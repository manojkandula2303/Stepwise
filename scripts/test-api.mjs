// End-to-end API test (works against SQLite or Postgres): node scripts/test-api.mjs [baseUrl]
// Simulates two devices of one user plus a second user, and checks that every kind of work
// follows the account across devices and that accounts are isolated.
const base = process.argv[2] || 'http://localhost:8787';
let failures = 0;
const check = (name, cond, extra = '') => {
  console.log(`${cond ? '✔' : '✘'} ${name}${cond ? '' : '  ' + extra}`);
  if (!cond) failures++;
};

/** A "device": its own cookie jar. */
function device() {
  let cookie = '';
  return async (path, body, method) => {
    const res = await fetch(base + '/api' + path, {
      method: method || (body !== undefined ? 'POST' : 'GET'),
      headers: { ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0].endsWith('=') ? '' : set.split(';')[0];
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data };
  };
}

const sfx = Date.now().toString(36);
const email = `dana-${sfx}@example.test`;
const laptop = device();
const phone = device();
const other = device();

check('health', (await laptop('/health')).data.ok === true);

// Sign up on the laptop, with guest work to merge.
let r = await laptop('/auth/signup', { email, password: 'secret-pass-1', name: 'Dana' });
check('signup', r.status === 200 && r.data.user?.email === email, JSON.stringify(r.data));
r = await laptop('/import', {
  completed: { intro: 1700000000000 },
  bookmarks: ['hashing'],
  problems: { 'two-sum': { status: 'solved', saved: true, attempts: 2, solvedAt: 1700000000000, lastLang: 'python' } },
  submissions: [{ problemId: 'two-sum', language: 'python', verdict: 'Accepted', passed: 3, total: 3, runtimeMs: 12, code: 'print(1)', createdAt: 1700000000000 }],
  snippets: [{ id: 'snip1', title: 'Guest snippet', language: 'python', code: 'print(2)', stdin: '', updatedAt: 1700000000000 }],
  attempts: [{ id: 'att1', space: 'aptitude', specId: 'topic:q-percentages', title: 'Percentages', kind: 'topic', topics: ['q-percentages'], total: 10, correct: 7, wrong: 3, skipped: 0, score: 7, maxScore: 10, negative: 0, durationSec: 900, timeTakenSec: 400, createdAt: 1700000000000, answers: [] }],
  kv: { draft: { 'two-sum:python': 'def two_sum(): pass' } },
  codingTests: [{ id: 'ctguest1', level: 'easy', title: 'Easy test', createdAt: 1700000000000, durationSec: 3600, startedAt: null, finishedAt: null, status: 'ready', problems: [{ problemId: 'inf-e-pair-sum', seed: 7, lang: 'python', code: {} }] }],
  activity: { '2026-11-20': 3 },
  prefs: { theme: 'dark', learnLang: 'java' },
});
check('guest import', r.status === 200 && r.data.completed.intro && r.data.codingTests.length === 1, JSON.stringify(r.data).slice(0, 200));

// Work on the laptop.
await laptop('/concepts/two-pointers/complete', { done: true });
await laptop('/concepts/two-pointers/complete', { done: true }); // idempotent
await laptop('/concepts/sliding-window/bookmark', { on: true });
await laptop('/problems/valid-anagram', { saved: true });
await laptop('/problems/valid-anagram', { status: 'solved' });
r = await laptop('/submissions', { problemId: 'valid-anagram', language: 'java', verdict: 'Accepted', passed: 5, total: 5, runtimeMs: 40, code: 'class Solution {}' });
check('submission id', r.status === 200 && /^\d+$/.test(r.data.id), JSON.stringify(r.data));
await laptop('/snippets/snip2', { title: 'Laptop snippet', language: 'java', code: 'class Main {}', stdin: '1' }, 'PUT');
await laptop('/snippets/snip2', { title: 'Laptop snippet v2', language: 'java', code: 'class Main { }', stdin: '2' }, 'PUT');
await laptop('/attempts', { id: 'att2', space: 'technical', specId: 'mock:technical', title: 'Mock', kind: 'mock', topics: ['t-joins'], total: 48, correct: 30, wrong: 10, skipped: 8, score: 27.5, maxScore: 48, negative: 0.25, durationSec: 2160, timeTakenSec: 2000, createdAt: Date.now(), answers: [] });
await laptop('/kv/buffer/python', { value: 'print("hello from laptop")' }, 'PUT');
await laptop('/kv/assessment/personality', { value: [1, 2, 3, 4, 5] }, 'PUT');
await laptop('/coding-tests/ctlaptop1', { id: 'ctlaptop1', level: 'hard', title: 'Hard test', createdAt: Date.now(), durationSec: 7200, startedAt: Date.now(), finishedAt: null, status: 'in-progress', problems: [{ problemId: 'inf-h-lis', seed: 3, lang: 'java', code: { java: 'class Main {}' } }] }, 'PUT');
await laptop('/prefs', { codeLang: 'java' }, 'PUT');
await laptop('/activity', {});

// Log in on the phone: everything must be there.
r = await phone('/auth/login', { email, password: 'secret-pass-1' });
check('login on second device', r.status === 200);
const s = (await phone('/me')).data;
check('phone sees completed lessons', !!s.completed?.intro && !!s.completed?.['two-pointers']);
check('phone sees bookmarks', s.bookmarks?.includes('hashing') && s.bookmarks?.includes('sliding-window'));
check('phone sees problem progress', s.problems?.['two-sum']?.status === 'solved' && s.problems?.['valid-anagram']?.status === 'solved' && s.problems?.['valid-anagram']?.saved === true);
check('phone sees submissions', s.submissions?.length === 2);
check('phone sees snippets (updated)', s.snippets?.length === 2 && s.snippets.find((x) => x.id === 'snip2')?.title === 'Laptop snippet v2');
check('phone sees prep attempts', s.attempts?.length === 2);
check('phone sees drafts and buffers', s.kv?.draft?.['two-sum:python'] === 'def two_sum(): pass' && s.kv?.buffer?.python === 'print("hello from laptop")');
check('phone sees assessment', JSON.stringify(s.kv?.assessment?.personality) === '[1,2,3,4,5]');
check('phone sees Infosys tests', s.codingTests?.length === 2 && s.codingTests.some((t) => t.id === 'ctlaptop1' && t.status === 'in-progress'));
check('phone sees prefs', s.prefs?.theme === 'dark' && s.prefs?.codeLang === 'java');
check('phone sees activity', Object.values(s.activity || {}).reduce((a, b) => a + b, 0) >= 5);
check('timestamps are numbers', typeof s.user.createdAt === 'number' && typeof s.submissions[0].createdAt === 'number');

// Phone makes changes; the laptop sees them.
await phone('/coding-tests/ctlaptop1', { ...s.codingTests.find((t) => t.id === 'ctlaptop1'), status: 'submitted', finishedAt: Date.now() }, 'PUT');
await phone('/kv/buffer/python', { value: 'print("edited on phone")' }, 'PUT');
await phone('/snippets/snip1', undefined, 'DELETE');
const l = (await laptop('/me')).data;
check('laptop sees phone edits', l.codingTests.find((t) => t.id === 'ctlaptop1')?.status === 'submitted' && l.kv.buffer.python === 'print("edited on phone")' && l.snippets.length === 1);

// Storage space.
r = await laptop('/account/storage');
check('storage usage', r.status === 200 && r.data.used > 0 && r.data.categories.codingTests.count === 2, JSON.stringify(r.data));
r = await laptop('/account/export');
check('export', r.status === 200 && r.data.user.email === email);

// Another user sees none of it.
r = await other('/auth/signup', { email: `eve-${sfx}@example.test`, password: 'secret-pass-2', name: 'Eve' });
const e = r.data;
check('second user is isolated', Object.keys(e.completed).length === 0 && e.submissions.length === 0 && e.codingTests.length === 0 && Object.keys(e.kv).length === 0);
r = await other('/coding-tests/ctlaptop1', undefined, 'DELETE');
check("second user can't delete first user's data", (await laptop('/me')).data.codingTests.some((t) => t.id === 'ctlaptop1'));
check('duplicate email rejected', (await device()('/auth/signup', { email, password: 'whatever-123', name: 'X' })).status === 409);
check('wrong password rejected', (await device()('/auth/login', { email, password: 'nope-nope-1' })).status === 401);

// Logout on one device keeps the other signed in.
await phone('/auth/logout', {});
check('phone logged out', (await phone('/me')).data.user === null);
check('laptop still signed in', (await laptop('/me')).data.user?.email === email);

// Delete account removes everything.
check('delete needs password', (await laptop('/account/delete', { password: 'bad' })).status === 403);
r = await laptop('/account/delete', { password: 'secret-pass-1' });
check('account deleted', r.status === 200 && (await laptop('/me')).data.user === null);
check('login fails after deletion', (await device()('/auth/login', { email, password: 'secret-pass-1' })).status === 401);
await other('/account/delete', { password: 'secret-pass-2' });

console.log(failures ? `\n${failures} check(s) failed` : '\nAll API checks passed');
process.exitCode = failures ? 1 : 0;
