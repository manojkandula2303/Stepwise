import express from 'express';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, tx } from './db.mjs';
import { attachUser, requireUser, hashPassword, verifyPassword, createSession, destroySession, sessionCookie, COOKIE } from './auth.mjs';
import * as runner from './runner/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROD = process.env.NODE_ENV === 'production';
// In development Vite owns PORT and proxies /api to 8787; in production this server also serves the built app.
const PORT = Number(process.env.API_PORT || (PROD && process.env.PORT) || 8787);
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});
app.use(attachUser);

// ---------- helpers ----------
const now = () => Date.now();
const today = () => new Date().toISOString().slice(0, 10);
const str = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');
const isId = (v) => typeof v === 'string' && /^[a-z0-9][a-z0-9_.:-]{0,100}$/i.test(v);
const LANGS = new Set(['python', 'java', 'cpp', 'c']);
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });

function bumpActivity(userId, n = 1) {
  db.prepare(
    'INSERT INTO activity (user_id, day, count) VALUES (?, ?, ?) ON CONFLICT(user_id, day) DO UPDATE SET count = count + excluded.count'
  ).run(userId, today(), n);
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

function userState(userId) {
  const u = db.prepare('SELECT id, email, name, prefs, created_at FROM users WHERE id = ?').get(userId);
  return {
    user: { id: u.id, email: u.email, name: u.name, createdAt: u.created_at },
    prefs: JSON.parse(u.prefs || '{}'),
    completed: Object.fromEntries(
      db.prepare('SELECT concept_id, completed_at FROM concept_progress WHERE user_id = ?').all(userId).map((r) => [r.concept_id, r.completed_at])
    ),
    bookmarks: db.prepare('SELECT concept_id FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(userId).map((r) => r.concept_id),
    problems: Object.fromEntries(
      db
        .prepare('SELECT problem_id, status, saved, attempts, solved_at, last_lang FROM problem_progress WHERE user_id = ?')
        .all(userId)
        .map((r) => [r.problem_id, { status: r.status, saved: !!r.saved, attempts: r.attempts, solvedAt: r.solved_at, lastLang: r.last_lang }])
    ),
    submissions: db
      .prepare('SELECT id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 200')
      .all(userId)
      .map((r) => ({ id: String(r.id), problemId: r.problem_id, language: r.language, verdict: r.verdict, passed: r.passed, total: r.total, runtimeMs: r.runtime_ms, code: r.code, createdAt: r.created_at })),
    snippets: db
      .prepare('SELECT id, title, language, code, stdin, updated_at FROM snippets WHERE user_id = ? ORDER BY updated_at DESC')
      .all(userId)
      .map((r) => ({ id: r.id, title: r.title, language: r.language, code: r.code, stdin: r.stdin, updatedAt: r.updated_at })),
    activity: Object.fromEntries(db.prepare('SELECT day, count FROM activity WHERE user_id = ?').all(userId).map((r) => [r.day, r.count])),
    attempts: db
      .prepare('SELECT data FROM test_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 200')
      .all(userId)
      .map((r) => JSON.parse(r.data)),
  };
}

// ---------- auth ----------
const authLimit = rateLimit(20, 10 * 60 * 1000);

app.post('/api/auth/signup', authLimit, (req, res) => {
  const email = str(req.body?.email, 254).trim().toLowerCase();
  const name = str(req.body?.name, 80).trim();
  const password = str(req.body?.password, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(res, 'Enter a valid email address.');
  if (name.length < 1) return bad(res, 'Enter your name.');
  if (password.length < 8) return bad(res, 'Password must be at least 8 characters.');
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) return bad(res, 'An account with this email already exists.', 409);
  const info = db.prepare('INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)').run(email, name, hashPassword(password), now());
  const userId = Number(info.lastInsertRowid);
  const s = createSession(userId);
  res.setHeader('Set-Cookie', sessionCookie(s.token, s.expires, PROD));
  res.json(userState(userId));
});

app.post('/api/auth/login', authLimit, (req, res) => {
  const email = str(req.body?.email, 254).trim().toLowerCase();
  const password = str(req.body?.password, 200);
  const u = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email);
  if (!u || !verifyPassword(password, u.password_hash)) return bad(res, 'Incorrect email or password.', 401);
  const s = createSession(u.id);
  res.setHeader('Set-Cookie', sessionCookie(s.token, s.expires, PROD));
  res.json(userState(u.id));
});

app.post('/api/auth/logout', (req, res) => {
  destroySession(req.sessionToken);
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json(userState(req.user.id));
});

// ---------- guest-data import (merges local progress after sign-up / sign-in) ----------
app.post('/api/import', requireUser, (req, res) => {
  const b = req.body || {};
  const uid = req.user.id;
  tx(() => {
    for (const [cid, at] of Object.entries(b.completed || {}).slice(0, 2000))
      if (isId(cid)) db.prepare('INSERT OR IGNORE INTO concept_progress (user_id, concept_id, completed_at) VALUES (?, ?, ?)').run(uid, cid, Number(at) || now());
    for (const cid of (Array.isArray(b.bookmarks) ? b.bookmarks : []).slice(0, 2000))
      if (isId(cid)) db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, concept_id, created_at) VALUES (?, ?, ?)').run(uid, cid, now());
    for (const [pid, p] of Object.entries(b.problems || {}).slice(0, 2000)) {
      if (!isId(pid) || !p) continue;
      db.prepare(
        `INSERT INTO problem_progress (user_id, problem_id, status, saved, attempts, solved_at, last_lang) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, problem_id) DO UPDATE SET
           status = CASE WHEN problem_progress.status = 'solved' THEN 'solved' ELSE excluded.status END,
           saved = MAX(problem_progress.saved, excluded.saved), attempts = problem_progress.attempts + excluded.attempts`
      ).run(uid, pid, ['todo', 'attempted', 'solved'].includes(p.status) ? p.status : 'todo', p.saved ? 1 : 0, Number(p.attempts) || 0, p.solvedAt || null, LANGS.has(p.lastLang) ? p.lastLang : null);
    }
    for (const s of (Array.isArray(b.submissions) ? b.submissions : []).slice(0, 200)) {
      if (!isId(s.problemId) || !LANGS.has(s.language)) continue;
      db.prepare('INSERT INTO submissions (user_id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        uid, s.problemId, s.language, str(s.verdict, 40), Number(s.passed) || 0, Number(s.total) || 0, Number(s.runtimeMs) || null, str(s.code, 65536), Number(s.createdAt) || now()
      );
    }
    for (const s of (Array.isArray(b.snippets) ? b.snippets : []).slice(0, 500)) {
      if (!isId(s.id) || !LANGS.has(s.language)) continue;
      db.prepare('INSERT OR REPLACE INTO snippets (id, user_id, title, language, code, stdin, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
        s.id, uid, str(s.title, 120) || 'Untitled', s.language, str(s.code, 65536), str(s.stdin, 65536), Number(s.updatedAt) || now()
      );
    }
    for (const a of (Array.isArray(b.attempts) ? b.attempts : []).slice(0, 200)) {
      const clean = cleanAttempt(a);
      if (clean) db.prepare('INSERT OR IGNORE INTO test_attempts (id, user_id, space, data, created_at) VALUES (?, ?, ?, ?, ?)').run(clean.id, uid, clean.space, JSON.stringify(clean), clean.createdAt);
    }
    for (const [day, n] of Object.entries(b.activity || {}).slice(0, 1000))
      if (/^\d{4}-\d{2}-\d{2}$/.test(day))
        db.prepare('INSERT INTO activity (user_id, day, count) VALUES (?, ?, ?) ON CONFLICT(user_id, day) DO UPDATE SET count = count + excluded.count').run(uid, day, Math.min(Number(n) || 0, 10000));
    if (b.prefs && typeof b.prefs === 'object') savePrefs(uid, b.prefs);
  });
  res.json(userState(uid));
});

// ---------- preferences ----------
function savePrefs(uid, patch) {
  const cur = JSON.parse(db.prepare('SELECT prefs FROM users WHERE id = ?').get(uid).prefs || '{}');
  const next = { ...cur };
  if (['light', 'dark'].includes(patch.theme)) next.theme = patch.theme;
  if (['python', 'java'].includes(patch.learnLang)) next.learnLang = patch.learnLang;
  if (LANGS.has(patch.codeLang)) next.codeLang = patch.codeLang;
  if (typeof patch.name === 'string' && patch.name.trim()) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(str(patch.name, 80).trim(), uid);
  db.prepare('UPDATE users SET prefs = ? WHERE id = ?').run(JSON.stringify(next), uid);
  return next;
}
app.put('/api/prefs', requireUser, (req, res) => res.json({ prefs: savePrefs(req.user.id, req.body || {}) }));

// ---------- learning progress ----------
app.post('/api/concepts/:id/complete', requireUser, (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid concept.');
  if (req.body?.done === false) db.prepare('DELETE FROM concept_progress WHERE user_id = ? AND concept_id = ?').run(req.user.id, id);
  else {
    const r = db.prepare('INSERT OR IGNORE INTO concept_progress (user_id, concept_id, completed_at) VALUES (?, ?, ?)').run(req.user.id, id, now());
    if (r.changes) bumpActivity(req.user.id);
  }
  res.json({ ok: true });
});

app.post('/api/concepts/:id/bookmark', requireUser, (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid concept.');
  if (req.body?.on === false) db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND concept_id = ?').run(req.user.id, id);
  else db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, concept_id, created_at) VALUES (?, ?, ?)').run(req.user.id, id, now());
  res.json({ ok: true });
});

// ---------- problems ----------
app.post('/api/problems/:id', requireUser, (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return bad(res, 'Invalid problem.');
  const b = req.body || {};
  db.prepare('INSERT OR IGNORE INTO problem_progress (user_id, problem_id) VALUES (?, ?)').run(req.user.id, id);
  if (typeof b.saved === 'boolean') db.prepare('UPDATE problem_progress SET saved = ? WHERE user_id = ? AND problem_id = ?').run(b.saved ? 1 : 0, req.user.id, id);
  if (['todo', 'attempted', 'solved'].includes(b.status))
    db.prepare("UPDATE problem_progress SET status = ?, solved_at = CASE WHEN ? = 'solved' THEN COALESCE(solved_at, ?) ELSE NULL END WHERE user_id = ? AND problem_id = ?").run(b.status, b.status, now(), req.user.id, id);
  res.json({ ok: true });
});

app.post('/api/submissions', requireUser, (req, res) => {
  const b = req.body || {};
  if (!isId(b.problemId) || !LANGS.has(b.language)) return bad(res, 'Invalid submission.');
  const verdict = str(b.verdict, 40);
  const accepted = verdict === 'Accepted';
  const uid = req.user.id;
  const id = tx(() => {
    const info = db.prepare('INSERT INTO submissions (user_id, problem_id, language, verdict, passed, total, runtime_ms, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      uid, b.problemId, b.language, verdict, Number(b.passed) || 0, Number(b.total) || 0, Number(b.runtimeMs) || null, str(b.code, 65536), now()
    );
    db.prepare(
      `INSERT INTO problem_progress (user_id, problem_id, status, attempts, solved_at, last_lang) VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(user_id, problem_id) DO UPDATE SET attempts = attempts + 1, last_lang = excluded.last_lang,
         status = CASE WHEN problem_progress.status = 'solved' OR excluded.status = 'solved' THEN 'solved' ELSE 'attempted' END,
         solved_at = COALESCE(problem_progress.solved_at, excluded.solved_at)`
    ).run(uid, b.problemId, accepted ? 'solved' : 'attempted', accepted ? now() : null, b.language);
    bumpActivity(uid);
    return Number(info.lastInsertRowid);
  });
  res.json({ id: String(id) });
});

// ---------- snippets ----------
app.put('/api/snippets/:id', requireUser, (req, res) => {
  const { id } = req.params;
  const b = req.body || {};
  if (!isId(id) || !LANGS.has(b.language)) return bad(res, 'Invalid snippet.');
  const count = db.prepare('SELECT COUNT(*) AS n FROM snippets WHERE user_id = ?').get(req.user.id).n;
  if (count >= 500 && !db.prepare('SELECT 1 FROM snippets WHERE user_id = ? AND id = ?').get(req.user.id, id)) return bad(res, 'Snippet limit reached (500).');
  db.prepare('INSERT OR REPLACE INTO snippets (id, user_id, title, language, code, stdin, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    id, req.user.id, str(b.title, 120).trim() || 'Untitled', b.language, str(b.code, 65536), str(b.stdin, 65536), now()
  );
  res.json({ ok: true });
});

app.delete('/api/snippets/:id', requireUser, (req, res) => {
  db.prepare('DELETE FROM snippets WHERE user_id = ? AND id = ?').run(req.user.id, req.params.id);
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
    createdAt: num(a.createdAt) || now(),
    answers,
  };
}

app.post('/api/attempts', requireUser, (req, res) => {
  const a = cleanAttempt(req.body);
  if (!a) return bad(res, 'Invalid test attempt.');
  tx(() => {
    db.prepare('INSERT OR REPLACE INTO test_attempts (id, user_id, space, data, created_at) VALUES (?, ?, ?, ?, ?)').run(a.id, req.user.id, a.space, JSON.stringify(a), a.createdAt);
    bumpActivity(req.user.id);
  });
  res.json({ ok: true });
});

app.post('/api/activity', requireUser, (req, res) => {
  bumpActivity(req.user.id, 1);
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
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  bad(res, err.type === 'entity.too.large' ? 'Request is too large.' : 'Something went wrong on our side.', err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Stepwise API listening on http://localhost:${PORT}`);
  runner.capabilities().then((c) => console.log('Runtimes:', Object.entries(c).filter(([k]) => k !== 'trace').map(([k, v]) => `${k}=${v.available ? v.driver : 'off'}`).join(' ')));
});
