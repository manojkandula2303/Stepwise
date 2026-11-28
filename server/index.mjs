import express from 'express';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db.mjs';
import { attachUser, requireUser, hashPassword, verifyPassword, createSession, destroySession, sessionCookie, COOKIE } from './auth.mjs';
import * as runner from './runner/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROD = process.env.NODE_ENV === 'production';
// In development Vite owns PORT and proxies /api to 8787; in production this server also serves the built app.
const PORT = Number(process.env.API_PORT || (PROD && process.env.PORT) || 8787);
const app = express();

app.disable('x-powered-by');
// Behind Render's (or any) HTTPS proxy: trust X-Forwarded-* so req.ip and req.secure are correct.
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? (PROD ? 1 : 0)));

/** Express 4 doesn't catch errors thrown by async handlers: forward them to the error handler. */
for (const m of ['get', 'post', 'put', 'delete']) {
  const orig = app[m].bind(app);
  app[m] = (path, ...handlers) =>
    handlers.length === 0
      ? orig(path)
      : orig(path, ...handlers.map((h) => (typeof h === 'function' && h.length < 4 ? (req, res, next) => Promise.resolve(h(req, res, next)).catch(next) : h)));
}

// Code runs carry program input (up to a few MB for judged test cases); everything else stays small.
const smallJson = express.json({ limit: '256kb' });
const runJson = express.json({ limit: '4mb' });
app.use((req, res, next) => (req.path.startsWith('/api/run') ? runJson : smallJson)(req, res, next));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

// Health check (Render pings this; also confirms the database is reachable).
app.get('/api/health', async (_req, res) => {
  await db.one('SELECT 1 AS ok');
  res.json({ ok: true });
});

app.use(attachUser);
const secureCookie = (req) => req.secure || process.env.COOKIE_SECURE === '1';

// ---------- helpers ----------
const now = () => Date.now();
const today = () => new Date().toISOString().slice(0, 10);
const str = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');
const isId = (v) => typeof v === 'string' && /^[a-z0-9][a-z0-9_.:-]{0,100}$/i.test(v);
const LANGS = new Set(['python', 'java', 'cpp', 'c']);
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });

const ACTIVITY_UPSERT = 'INSERT INTO activity (user_id, day, count) VALUES (?, ?, ?) ON CONFLICT (user_id, day) DO UPDATE SET count = activity.count + excluded.count';
function bumpActivity(userId, n = 1, q = db) {
  return q.run(ACTIVITY_UPSERT, [userId, today(), n]);
}

/** Simple sliding-window rate limiter keyed by user or IP. */
function rateLimit(limit, windowMs) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.user ? `u${req.user.id}` : req.ip;
    const t = now();
    const arr = (hits.get(key) || []).filter((x) => t - x < windowMs);
    if (arr.length >= limit) return bad(res, 'Too many requests. Please slow down for a moment.', 429);
    arr.push(t);
    hits.set(key, arr);
    next();
  };
}

/** Everything stored for one account: what every device of that user loads after signing in. */
async function userState(userId) {
  const p = [userId];
  const [u, completed, bookmarks, problems, submissions, snippets, activity, attempts, kvRows, coding] = await Promise.all([
    db.one('SELECT id, email, name, prefs, created_at FROM users WHERE id = ?', p),
    db.all('SELECT concept_id, completed_at FROM concept_progress WHERE user_id = ?', p),
    db.all('SELECT concept_id FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC', p),
    db.all('SELECT problem_id, status, saved, attempts, solved_at, last_lang FROM problem_progress WHERE user_id = ?', p),
    db.all('SELECT id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 200', p),
    db.all('SELECT id, title, language, code, stdin, updated_at FROM snippets WHERE user_id = ? ORDER BY updated_at DESC', p),
    db.all('SELECT day, count FROM activity WHERE user_id = ?', p),
    db.all('SELECT data FROM test_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 200', p),
    db.all('SELECT ns, key, value FROM user_kv WHERE user_id = ?', p),
    db.all('SELECT data FROM coding_tests WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', p),
  ]);
  const kv = {};
  for (const r of kvRows) (kv[r.ns] ||= {})[r.key] = JSON.parse(r.value);
  return {
    user: { id: Number(u.id), email: u.email, name: u.name, createdAt: u.created_at },
    prefs: JSON.parse(u.prefs || '{}'),
    completed: Object.fromEntries(completed.map((r) => [r.concept_id, r.completed_at])),
    bookmarks: bookmarks.map((r) => r.concept_id),
    problems: Object.fromEntries(problems.map((r) => [r.problem_id, { status: r.status, saved: !!r.saved, attempts: r.attempts, solvedAt: r.solved_at, lastLang: r.last_lang }])),
    submissions: submissions.map((r) => ({ id: String(r.id), problemId: r.problem_id, language: r.language, verdict: r.verdict, passed: r.passed, total: r.total, runtimeMs: r.runtime_ms, code: r.code, createdAt: r.created_at })),
    snippets: snippets.map((r) => ({ id: r.id, title: r.title, language: r.language, code: r.code, stdin: r.stdin, updatedAt: r.updated_at })),
    activity: Object.fromEntries(activity.map((r) => [r.day, r.count])),
    attempts: attempts.map((r) => JSON.parse(r.data)),
    kv,
    codingTests: coding.map((r) => JSON.parse(r.data)),
  };
}

// ---------- per-user storage space ----------
/** Each account gets its own isolated space; this caps how much it can hold. */
const QUOTA_BYTES = Number(process.env.USER_QUOTA_MB || 25) * 1024 * 1024;
const KV_NS = /^[a-z][a-z0-9-]{0,30}$/;
const KV_KEY = /^[A-Za-z0-9_.:@-]{1,160}$/;

async function storageUsage(uid) {
  const q = {
    progress: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(concept_id)), 0) b FROM concept_progress WHERE user_id = ?',
    bookmarks: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(concept_id)), 0) b FROM bookmarks WHERE user_id = ?',
    problems: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(problem_id) + 24), 0) b FROM problem_progress WHERE user_id = ?',
    submissions: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(code) + 64), 0) b FROM submissions WHERE user_id = ?',
    snippets: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(code) + LENGTH(stdin) + LENGTH(title)), 0) b FROM snippets WHERE user_id = ?',
    tests: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(data)), 0) b FROM test_attempts WHERE user_id = ?',
    codingTests: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(data)), 0) b FROM coding_tests WHERE user_id = ?',
    documents: 'SELECT COUNT(*) n, COALESCE(SUM(LENGTH(value) + LENGTH(key)), 0) b FROM user_kv WHERE user_id = ?',
  };
  const keys = Object.keys(q);
  const vals = await Promise.all(keys.map((k) => db.one(q[k], [uid])));
  const categories = Object.fromEntries(keys.map((k, i) => [k, { count: Number(vals[i].n), bytes: Number(vals[i].b) }]));
  const used = Object.values(categories).reduce((s, r) => s + r.bytes, 0);
  return { used, quota: QUOTA_BYTES, categories };
}

async function overQuota(uid, extra) {
  return (await storageUsage(uid)).used + extra > QUOTA_BYTES;
}

// ---------- auth ----------
const authLimit = rateLimit(20, 10 * 60 * 1000);

app.post('/api/auth/signup', authLimit, async (req, res) => {
  const email = str(req.body?.email, 254).trim().toLowerCase();
  const name = str(req.body?.name, 80).trim();
  const password = str(req.body?.password, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 'Enter a valid email address.');
  if (name.length < 1) return bad(res, 'Enter your name.');
  if (password.length < 8) return bad(res, 'Password must be at least 8 characters.');
  if (await db.one('SELECT 1 AS x FROM users WHERE email = ?', [email])) return bad(res, 'An account with this email already exists.', 409);
  const row = await db.one('INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?) RETURNING id', [email, name, hashPassword(password), now()]);
  const userId = Number(row.id);
  const s = await createSession(userId);
  res.setHeader('Set-Cookie', sessionCookie(s.token, s.expires, secureCookie(req)));
  res.json(await userState(userId));
});

app.post('/api/auth/login', authLimit, async (req, res) => {
  const email = str(req.body?.email, 254).trim().toLowerCase();
  const password = str(req.body?.password, 200);
  const u = await db.one('SELECT id, password_hash FROM users WHERE email = ?', [email]);
  if (!u || !verifyPassword(password, u.password_hash)) return bad(res, 'Incorrect email or password.', 401);
  const s = await createSession(Number(u.id));
  res.setHeader('Set-Cookie', sessionCookie(s.token, s.expires, secureCookie(req)));
  res.json(await userState(Number(u.id)));
});

app.post('/api/auth/logout', async (req, res) => {
  await destroySession(req.sessionToken);
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});

app.get('/api/me', async (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json(await userState(req.user.id));
});

// ---------- guest-data import (merges local progress after sign-up / sign-in) ----------
app.post('/api/import', requireUser, async (req, res) => {
  const b = req.body || {};
  const uid = req.user.id;
  await db.tx(async (q) => {
    for (const [cid, at] of Object.entries(b.completed || {}).slice(0, 2000))
      if (isId(cid)) await q.run('INSERT INTO concept_progress (user_id, concept_id, completed_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', [uid, cid, Number(at) || now()]);
    for (const cid of (Array.isArray(b.bookmarks) ? b.bookmarks : []).slice(0, 2000))
      if (isId(cid)) await q.run('INSERT INTO bookmarks (user_id, concept_id, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', [uid, cid, now()]);
    for (const [pid, p] of Object.entries(b.problems || {}).slice(0, 2000)) {
      if (!isId(pid) || !p) continue;
      await q.run(
        `INSERT INTO problem_progress (user_id, problem_id, status, saved, attempts, solved_at, last_lang) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (user_id, problem_id) DO UPDATE SET
           status = CASE WHEN problem_progress.status = 'solved' THEN 'solved' ELSE excluded.status END,
           saved = CASE WHEN problem_progress.saved > excluded.saved THEN problem_progress.saved ELSE excluded.saved END,
           attempts = problem_progress.attempts + excluded.attempts`,
        [uid, pid, ['todo', 'attempted', 'solved'].includes(p.status) ? p.status : 'todo', p.saved ? 1 : 0, Number(p.attempts) || 0, Number(p.solvedAt) || null, LANGS.has(p.lastLang) ? p.lastLang : null]
      );
    }
    for (const s of (Array.isArray(b.submissions) ? b.submissions : []).slice(0, 200)) {
      if (!isId(s.problemId) || !LANGS.has(s.language)) continue;
      await q.run('INSERT INTO submissions (user_id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        uid, s.problemId, s.language, str(s.verdict, 40), Number(s.passed) || 0, Number(s.total) || 0, Number(s.runtimeMs) || null, str(s.code, 65536), Number(s.createdAt) || now(),
      ]);
    }
    for (const s of (Array.isArray(b.snippets) ? b.snippets : []).slice(0, 500)) {
      if (!isId(s.id) || !LANGS.has(s.language)) continue;
      await q.run(SNIPPET_UPSERT, [s.id, uid, str(s.title, 120) || 'Untitled', s.language, str(s.code, 65536), str(s.stdin, 65536), Number(s.updatedAt) || now()]);
    }
    for (const a of (Array.isArray(b.attempts) ? b.attempts : []).slice(0, 200)) {
      const clean = cleanAttempt(a);
      if (clean) await q.run('INSERT INTO test_attempts (id, user_id, space, data, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING', [clean.id, uid, clean.space, JSON.stringify(clean), clean.createdAt]);
    }
    for (const [ns, entries] of Object.entries(b.kv || {}).slice(0, 20)) {
      if (!KV_NS.test(ns) || !entries || typeof entries !== 'object') continue;
      for (const [key, value] of Object.entries(entries).slice(0, 1000)) {
        const json = JSON.stringify(value ?? null);
        if (KV_KEY.test(key) && json.length <= 131072)
          await q.run('INSERT INTO user_kv (user_id, ns, key, value, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING', [uid, ns, key, json, now()]);
      }
    }
    for (const t of (Array.isArray(b.codingTests) ? b.codingTests : []).slice(0, 100)) {
      const clean = cleanCodingTest(t);
      if (clean) await q.run('INSERT INTO coding_tests (id, user_id, level, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING', [clean.id, uid, clean.level, clean.json, clean.createdAt, now()]);
    }
    for (const [day, n] of Object.entries(b.activity || {}).slice(0, 1000))
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) await q.run(ACTIVITY_UPSERT, [uid, day, Math.min(Number(n) || 0, 10000)]);
    if (b.prefs && typeof b.prefs === 'object') await savePrefs(uid, b.prefs, q);
  });
  res.json(await userState(uid));
});

// ---------- preferences ----------
async function savePrefs(uid, patch, q = db) {
  const cur = JSON.parse((await q.one('SELECT prefs FROM users WHERE id = ?', [uid])).prefs || '{}');
  const next = { ...cur };
  if (['light', 'dark'].includes(patch.theme)) next.theme = patch.theme;
  if (['python', 'java'].includes(patch.learnLang)) next.learnLang = patch.learnLang;
  if (LANGS.has(patch.codeLang)) next.codeLang = patch.codeLang;
  if (typeof patch.name === 'string' && patch.name.trim()) await q.run('UPDATE users SET name = ? WHERE id = ?', [str(patch.name, 80).trim(), uid]);
  await q.run('UPDATE users SET prefs = ? WHERE id = ?', [JSON.stringify(next), uid]);
  return next;
}
app.put('/api/prefs', requireUser, async (req, res) => res.json({ prefs: await savePrefs(req.user.id, req.body || {}) }));

// ---------- learning progress ----------
app.post('/api/concepts/:id/complete', requireUser, async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid concept.');
  if (req.body?.done === false) await db.run('DELETE FROM concept_progress WHERE user_id = ? AND concept_id = ?', [req.user.id, id]);
  else {
    const inserted = await db.one('INSERT INTO concept_progress (user_id, concept_id, completed_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING RETURNING concept_id', [req.user.id, id, now()]);
    if (inserted) await bumpActivity(req.user.id);
  }
  res.json({ ok: true });
});

app.post('/api/concepts/:id/bookmark', requireUser, async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid concept.');
  if (req.body?.on === false) await db.run('DELETE FROM bookmarks WHERE user_id = ? AND concept_id = ?', [req.user.id, id]);
  else await db.run('INSERT INTO bookmarks (user_id, concept_id, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', [req.user.id, id, now()]);
  res.json({ ok: true });
});

// ---------- problems ----------
app.post('/api/problems/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid problem.');
  const b = req.body || {};
  await db.run('INSERT INTO problem_progress (user_id, problem_id) VALUES (?, ?) ON CONFLICT DO NOTHING', [req.user.id, id]);
  if (typeof b.saved === 'boolean') await db.run('UPDATE problem_progress SET saved = ? WHERE user_id = ? AND problem_id = ?', [b.saved ? 1 : 0, req.user.id, id]);
  if (['todo', 'attempted', 'solved'].includes(b.status)) {
    if (b.status === 'solved') await db.run('UPDATE problem_progress SET status = ?, solved_at = COALESCE(solved_at, ?) WHERE user_id = ? AND problem_id = ?', [b.status, now(), req.user.id, id]);
    else await db.run('UPDATE problem_progress SET status = ?, solved_at = NULL WHERE user_id = ? AND problem_id = ?', [b.status, req.user.id, id]);
  }
  res.json({ ok: true });
});

app.post('/api/submissions', requireUser, async (req, res) => {
  const b = req.body || {};
  if (!isId(b.problemId) || !LANGS.has(b.language)) return bad(res, 'Invalid submission.');
  const verdict = str(b.verdict, 40);
  const accepted = verdict === 'Accepted';
  const uid = req.user.id;
  const id = await db.tx(async (q) => {
    const row = await q.one('INSERT INTO submissions (user_id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id', [
      uid, b.problemId, b.language, verdict, Number(b.passed) || 0, Number(b.total) || 0, Number(b.runtimeMs) || null, str(b.code, 65536), now(),
    ]);
    await q.run(
      `INSERT INTO problem_progress (user_id, problem_id, status, attempts, solved_at, last_lang) VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET attempts = problem_progress.attempts + 1, last_lang = excluded.last_lang,
         status = CASE WHEN problem_progress.status = 'solved' OR excluded.status = 'solved' THEN 'solved' ELSE 'attempted' END,
         solved_at = COALESCE(problem_progress.solved_at, excluded.solved_at)`,
      [uid, b.problemId, accepted ? 'solved' : 'attempted', accepted ? now() : null, b.language]
    );
    await bumpActivity(uid, 1, q);
    return Number(row.id);
  });
  res.json({ id: String(id) });
});

// ---------- snippets ----------
const SNIPPET_UPSERT = `INSERT INTO snippets (id, user_id, title, language, code, stdin, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT (user_id, id) DO UPDATE SET title = excluded.title, language = excluded.language, code = excluded.code, stdin = excluded.stdin, updated_at = excluded.updated_at`;

app.put('/api/snippets/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const b = req.body || {};
  if (!isId(id) || !LANGS.has(b.language)) return bad(res, 'Invalid snippet.');
  const count = Number((await db.one('SELECT COUNT(*) AS n FROM snippets WHERE user_id = ?', [req.user.id])).n);
  if (count >= 500 && !(await db.one('SELECT 1 AS x FROM snippets WHERE user_id = ? AND id = ?', [req.user.id, id]))) return bad(res, 'Snippet limit reached (500).');
  await db.run(SNIPPET_UPSERT, [id, req.user.id, str(b.title, 120).trim() || 'Untitled', b.language, str(b.code, 65536), str(b.stdin, 65536), now()]);
  res.json({ ok: true });
});

app.delete('/api/snippets/:id', requireUser, async (req, res) => {
  await db.run('DELETE FROM snippets WHERE user_id = ? AND id = ?', [req.user.id, req.params.id]);
  res.json({ ok: true });
});

// ---------- placement-prep test attempts ----------
/** Validate and normalise a test attempt; returns null if it is malformed. */
function cleanAttempt(a) {
  if (!a || typeof a !== 'object' || !isId(a.id) || !['aptitude', 'technical'].includes(a.space)) return null;
  const num = (v, max = 1e9) => Math.max(0, Math.min(Number(v) || 0, max));
  const answers = (Array.isArray(a.answers) ? a.answers : []).slice(0, 300).map((x) => ({
    qid: str(x?.qid, 120),
    chosen: Number.isInteger(x?.chosen) && x.chosen >= 0 && x.chosen < 10 ? x.chosen : null,
    correct: !!x?.correct,
    marked: !!x?.marked,
    timeSec: num(x?.timeSec, 86400),
  }));
  return {
    id: a.id,
    space: a.space,
    specId: str(a.specId, 200),
    title: str(a.title, 160),
    kind: ['topic', 'module', 'section', 'mock', 'custom'].includes(a.kind) ? a.kind : 'custom',
    topics: (Array.isArray(a.topics) ? a.topics : []).filter(isId).slice(0, 300),
    total: num(a.total, 300),
    correct: num(a.correct, 300),
    wrong: num(a.wrong, 300),
    skipped: num(a.skipped, 300),
    score: Math.max(-1000, Math.min(Number(a.score) || 0, 1000)),
    maxScore: num(a.maxScore, 1000),
    negative: num(a.negative, 1),
    durationSec: num(a.durationSec, 86400),
    timeTakenSec: num(a.timeTakenSec, 86400),
    createdAt: num(a.createdAt, 1e15) || now(),
    answers,
  };
}

app.post('/api/attempts', requireUser, async (req, res) => {
  const a = cleanAttempt(req.body);
  if (!a) return bad(res, 'Invalid test attempt.');
  await db.tx(async (q) => {
    await q.run(
      'INSERT INTO test_attempts (id, user_id, space, data, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (user_id, id) DO UPDATE SET space = excluded.space, data = excluded.data, created_at = excluded.created_at',
      [a.id, req.user.id, a.space, JSON.stringify(a), a.createdAt]
    );
    await bumpActivity(req.user.id, 1, q);
  });
  res.json({ ok: true });
});

app.post('/api/activity', requireUser, async (req, res) => {
  await bumpActivity(req.user.id, 1);
  res.json({ ok: true });
});

// ---------- key-value documents (drafts, editor buffers, self-assessments) ----------
app.put('/api/kv/:ns/:key', requireUser, async (req, res) => {
  const { ns, key } = req.params;
  if (!KV_NS.test(ns) || !KV_KEY.test(key)) return bad(res, 'Invalid key.');
  const json = JSON.stringify(req.body?.value ?? null);
  if (json.length > 131072) return bad(res, 'Document is too large (128 KB max).');
  if (await overQuota(req.user.id, json.length)) return bad(res, 'Your storage space is full. Delete old drafts or snippets to free space.', 413);
  await db.run(
    'INSERT INTO user_kv (user_id, ns, key, value, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (user_id, ns, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
    [req.user.id, ns, key, json, now()]
  );
  res.json({ ok: true });
});

app.delete('/api/kv/:ns/:key', requireUser, async (req, res) => {
  await db.run('DELETE FROM user_kv WHERE user_id = ? AND ns = ? AND key = ?', [req.user.id, req.params.ns, req.params.key]);
  res.json({ ok: true });
});

// ---------- coding tests (Infosys practice assessments) ----------
const LEVELS = new Set(['easy', 'medium', 'hard', 'complex']);
function cleanCodingTest(t) {
  if (!t || typeof t !== 'object' || !isId(t.id) || !LEVELS.has(t.level) || !Array.isArray(t.problems) || t.problems.length > 8) return null;
  const json = JSON.stringify(t);
  if (json.length > 400000) return null;
  return { id: t.id, level: t.level, createdAt: Number(t.createdAt) || now(), json };
}

app.put('/api/coding-tests/:id', requireUser, async (req, res) => {
  const t = cleanCodingTest({ ...req.body, id: req.params.id });
  if (!t) return bad(res, 'Invalid coding test.');
  if (await overQuota(req.user.id, t.json.length)) return bad(res, 'Your storage space is full. Delete old tests to free space.', 413);
  await db.tx(async (q) => {
    const existed = await q.one('SELECT 1 AS x FROM coding_tests WHERE user_id = ? AND id = ?', [req.user.id, t.id]);
    await q.run(
      'INSERT INTO coding_tests (id, user_id, level, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (user_id, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at',
      [t.id, req.user.id, t.level, t.json, t.createdAt, now()]
    );
    if (!existed) await bumpActivity(req.user.id, 1, q);
  });
  res.json({ ok: true });
});

app.delete('/api/coding-tests/:id', requireUser, async (req, res) => {
  await db.run('DELETE FROM coding_tests WHERE user_id = ? AND id = ?', [req.user.id, req.params.id]);
  res.json({ ok: true });
});

// ---------- account: storage, export, deletion ----------
app.get('/api/account/storage', requireUser, async (req, res) => res.json(await storageUsage(req.user.id)));

app.get('/api/account/export', requireUser, async (req, res) => {
  const data = await userState(req.user.id);
  res.setHeader('Content-Disposition', `attachment; filename="stepwise-${req.user.id}-${today()}.json"`);
  res.json({ exportedAt: new Date().toISOString(), ...data });
});

app.post('/api/account/delete', requireUser, authLimit, async (req, res) => {
  const row = await db.one('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  if (!verifyPassword(String(req.body?.password || ''), row.password_hash)) return bad(res, 'Password is incorrect.', 403);
  await db.run('DELETE FROM users WHERE id = ?', [req.user.id]); // cascades to every per-user table
  res.setHeader('Set-Cookie', sessionCookie('', 0, secureCookie(req)));
  res.json({ ok: true });
});

// ---------- code execution ----------
const runLimit = rateLimit(Number(process.env.RUN_RATE_LIMIT || 90), 60 * 1000);

function validateRun(b) {
  if (!LANGS.has(b?.language)) return 'Unsupported language.';
  if (typeof b.code !== 'string' || !b.code.trim()) return 'Write some code first.';
  if (b.code.length > 65536) return 'Code is too long (64 KB max).';
  if (b.stdin != null && (typeof b.stdin !== 'string' || b.stdin.length > 1_000_000)) return 'Input is too large (1 MB max).';
  return null;
}

app.get('/api/runtimes', async (_req, res) => res.json(await runner.capabilities()));

app.post('/api/run', runLimit, async (req, res) => {
  const err = validateRun(req.body);
  if (err) return bad(res, err);
  try {
    const timeoutMs = Math.min(Math.max(Number(req.body.timeoutMs) || 6000, 1000), 10000);
    res.json(await runner.run({ language: req.body.language, code: req.body.code, stdin: req.body.stdin || '', timeoutMs }));
  } catch (e) {
    res.status(503).json({ status: 'internal_error', stderr: e.message });
  }
});

/** Run one program against several inputs (compiled once). Used by judged coding tests. */
app.post('/api/run-batch', runLimit, async (req, res) => {
  const err = validateRun(req.body);
  if (err) return bad(res, err);
  const stdins = req.body.stdins;
  if (!Array.isArray(stdins) || !stdins.length || stdins.length > 20 || stdins.some((s) => typeof s !== 'string'))
    return bad(res, 'Provide between 1 and 20 inputs.');
  if (stdins.reduce((n, s) => n + s.length, 0) > 3_500_000) return bad(res, 'Inputs are too large (3.5 MB max).');
  try {
    const timeoutMs = Math.min(Math.max(Number(req.body.timeoutMs) || 4000, 1000), 10000);
    res.json({ results: await runner.runBatch({ language: req.body.language, code: req.body.code, stdins, timeoutMs }) });
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});

app.post('/api/trace', runLimit, async (req, res) => {
  const err = validateRun(req.body);
  if (err) return bad(res, err);
  try {
    res.json(await runner.trace({ language: req.body.language, code: req.body.code, stdin: req.body.stdin || '' }));
  } catch (e) {
    res.status(503).json({ status: 'internal_error', stderr: e.message });
  }
});

app.use('/api', (_req, res) => bad(res, 'Not found', 404));

// ---------- static (production) ----------
const dist = join(root, 'dist');
if (existsSync(dist)) {
  // The service worker must never be cached, so app updates reach every device promptly.
  app.get('/sw.js', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(join(dist, 'sw.js'));
  });
  app.use('/assets', express.static(join(dist, 'assets'), { maxAge: '365d', immutable: true }));
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(join(dist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  bad(res, err.type === 'entity.too.large' ? 'Request is too large.' : 'Something went wrong on our side.', err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Stepwise API listening on http://localhost:${PORT} (database: ${db.describe()})`);
  runner.capabilities().then((c) => console.log('Runtimes:', Object.entries(c).filter(([k]) => k !== 'trace').map(([k, v]) => `${k}=${v.available ? v.driver : 'off'}`).join(' ')));
});
