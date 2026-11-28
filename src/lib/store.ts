/**
 * App state: one external store, three persistence layers.
 *  - Guest: everything lives in localStorage on this device.
 *  - Signed in: each account has its own space on the server (SQLite, every row keyed by user id) AND
 *    its own local cache on this device (`sw-user-v1:<id>`), so the app keeps working offline.
 *  - Writes are optimistic: the UI updates at once, the change goes into a per-user outbox, and the outbox
 *    is flushed to the server whenever it is reachable (on start, on reconnect and every 20 s while pending).
 */
import { useSyncExternalStore } from 'react';
import { api, ApiError } from './api';
import { toast } from './toast';
import type { CodeLang, CodingTest, LearnLang, Prefs, ProblemProgress, Snippet, Submission, TestAttempt, Theme, User, UserData } from './types';

interface State extends UserData {
  user: User | null;
  ready: boolean;
  /** The server can't be reached right now (network down or server offline). */
  offline: boolean;
  /** Number of changes waiting to be synced to the server. */
  pending: number;
  /** The session expired while there were local changes; signing in again syncs them. */
  sessionExpired: boolean;
}

interface Op {
  path: string;
  method: string;
  body?: unknown;
  /** Ops with the same key replace each other (only the latest value matters). */
  key?: string;
}

const LS_GUEST = 'sw-data-v1';
const LS_USER = (id: number) => `sw-user-v1:${id}`;
const LS_LAST = 'sw-last-user';

const empty = (): UserData => ({ prefs: {}, completed: {}, bookmarks: [], problems: {}, submissions: [], snippets: [], activity: {}, attempts: [], kv: {}, codingTests: [] });

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable: the server copy is still authoritative */
  }
}
function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function loadGuest(): UserData {
  return { ...empty(), ...(read<Partial<UserData>>(LS_GUEST) || {}) };
}

interface UserCache {
  user: User;
  data: UserData;
  outbox: Op[];
}

function initialTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

let state: State = { ...loadGuest(), user: null, ready: false, offline: false, pending: 0, sessionExpired: false };
state.prefs = { ...state.prefs, theme: initialTheme() };
let outbox: Op[] = [];
const subs = new Set<() => void>();

// ---------- persistence ----------
let persistTimer: ReturnType<typeof setTimeout> | null = null;
function dataOf(s: State): UserData {
  const { user, ready, offline, pending, sessionExpired, ...data } = s;
  return data;
}
function persistNow() {
  persistTimer = null;
  if (state.user) {
    write(LS_USER(state.user.id), { user: state.user, data: dataOf(state), outbox } satisfies UserCache);
    write(LS_LAST, state.user.id);
  } else write(LS_GUEST, dataOf(state));
}
function persist() {
  if (!persistTimer) persistTimer = setTimeout(persistNow, 250);
}
window.addEventListener('pagehide', () => persistTimer && persistNow());

function set(patch: Partial<State>, save = true) {
  state = { ...state, ...patch };
  if (save) persist();
  subs.forEach((f) => f());
}

export function getState() {
  return state;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => selector(state)
  );
}

// ---------- outbox / sync ----------
let flushing = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(op: Op) {
  if (!state.user) return;
  if (op.key) outbox = outbox.filter((o) => o.key !== op.key);
  outbox.push(op);
  set({ pending: outbox.length });
  void flush();
}

/** Push queued changes to the server, in order. Stops on network failure and retries later. */
async function flush(): Promise<boolean> {
  if (flushing || !state.user || state.sessionExpired) return outbox.length === 0;
  flushing = true;
  try {
    while (outbox.length) {
      const op = outbox[0];
      try {
        await api(op.path, { method: op.method, body: op.body });
        outbox.shift();
        if (state.offline) set({ offline: false }, false);
      } catch (e) {
        const status = e instanceof ApiError ? e.status : 0;
        if (status === 0 || status >= 500 || status === 429) {
          set({ offline: status === 0 });
          scheduleRetry();
          return false;
        }
        if (status === 401) {
          set({ sessionExpired: true });
          return false;
        }
        // Rejected by validation (4xx): drop it so the queue doesn't jam, and tell the user.
        outbox.shift();
        toast(`Couldn't save a change: ${(e as Error).message}`, 'error');
      }
      set({ pending: outbox.length });
    }
    return true;
  } finally {
    flushing = false;
    set({ pending: outbox.length });
  }
}

function scheduleRetry() {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void flush();
  }, 20000);
}

window.addEventListener('online', () => {
  set({ offline: false }, false);
  void flush().then(() => actions.refresh());
});
window.addEventListener('offline', () => set({ offline: true }, false));

function sync(path: string, body?: unknown, method = 'POST', key?: string) {
  enqueue({ path, body, method, key });
}

// Debounced document sync: typing in an editor shouldn't send a request per keystroke.
const docTimers = new Map<string, ReturnType<typeof setTimeout>>();
function syncDoc(ns: string, key: string) {
  const id = `${ns}/${key}`;
  clearTimeout(docTimers.get(id));
  docTimers.set(
    id,
    setTimeout(() => {
      docTimers.delete(id);
      const value = state.kv[ns]?.[key];
      const path = `/kv/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`;
      if (value === undefined) sync(path, undefined, 'DELETE', `kv:${id}`);
      else sync(path, { value }, 'PUT', `kv:${id}`);
    }, 1200)
  );
}

const today = () => new Date().toISOString().slice(0, 10);
function bump(activity: Record<string, number>) {
  const d = today();
  return { ...activity, [d]: (activity[d] || 0) + 1 };
}

function applyServer(data: any) {
  const theme = state.prefs.theme;
  set({
    user: data.user,
    prefs: { ...data.prefs, theme: data.prefs?.theme || theme },
    completed: data.completed || {},
    bookmarks: data.bookmarks || [],
    problems: data.problems || {},
    submissions: data.submissions || [],
    snippets: data.snippets || [],
    activity: data.activity || {},
    attempts: data.attempts || [],
    kv: data.kv || {},
    codingTests: data.codingTests || [],
    ready: true,
    offline: false,
    sessionExpired: false,
  });
  if (data.prefs?.theme) applyTheme(data.prefs.theme, false);
}

function applyCache(c: UserCache) {
  outbox = c.outbox || [];
  set({ ...empty(), ...c.data, user: c.user, ready: true, pending: outbox.length });
  if (c.data.prefs?.theme) applyTheme(c.data.prefs.theme, false);
}

function hasGuestData(d: UserData) {
  return (
    Object.keys(d.completed).length ||
    d.bookmarks.length ||
    Object.keys(d.problems).length ||
    d.snippets.length ||
    d.submissions.length ||
    d.attempts.length ||
    d.codingTests.length ||
    Object.keys(d.kv).length
  );
}

export const actions = {
  async init() {
    // Show the last signed-in account's cached data immediately, so the app works offline.
    const lastId = read<number>(LS_LAST);
    const cache = lastId ? read<UserCache>(LS_USER(lastId)) : null;
    if (cache?.user) applyCache(cache);
    try {
      if (cache?.user) await flush();
      const me = await api('/me');
      if (me.user) {
        if (cache?.user && cache.user.id !== me.user.id) outbox = [];
        if (!outbox.length) applyServer(me);
        else set({ ready: true, offline: false });
      } else if (cache?.user && outbox.length) {
        // Session gone but local changes exist: keep them and ask the user to sign in again.
        set({ sessionExpired: true, ready: true });
      } else {
        if (cache?.user) remove(LS_USER(cache.user.id));
        remove(LS_LAST);
        state = { ...state, ...loadGuest(), user: null };
        set({ ready: true, offline: false });
      }
    } catch {
      set({ ready: true, offline: true });
      scheduleRetry();
    }
  },

  /** Re-read the account from the server (after reconnecting). */
  async refresh() {
    if (!state.user || outbox.length) return;
    try {
      const me = await api('/me');
      if (me.user?.id === state.user.id) applyServer(me);
    } catch {
      /* still offline */
    }
  },

  async signIn(mode: 'login' | 'signup', body: { email: string; password: string; name?: string }) {
    const guest = state.user ? empty() : loadGuest();
    const data = await api(`/auth/${mode}`, { body });
    const cache = read<UserCache>(LS_USER(data.user.id));
    // Changes made offline under this same account are replayed first.
    outbox = cache?.outbox?.length && (!state.user || state.user.id === data.user.id) ? cache.outbox : [];
    set({ user: data.user, sessionExpired: false, pending: outbox.length });
    if (outbox.length) await flush();
    if (hasGuestData(guest)) {
      const merged = await api('/import', { body: { ...guest, prefs: { ...guest.prefs, ...state.prefs } } });
      applyServer(merged);
      remove(LS_GUEST);
    } else applyServer(outbox.length ? await api('/me') : data);
    persistNow();
    toast(mode === 'signup' ? `Welcome, ${data.user.name}` : `Signed in as ${data.user.name}`, 'success');
  },

  async signOut() {
    if (outbox.length) await flush();
    if (outbox.length && !window.confirm(`${outbox.length} change(s) haven't reached the server yet (you're offline). Sign out anyway and discard them?`)) return;
    await api('/auth/logout', { body: {} }).catch(() => {});
    if (state.user) remove(LS_USER(state.user.id));
    remove(LS_LAST);
    outbox = [];
    const theme = state.prefs.theme;
    state = { ...empty(), user: null, ready: true, offline: state.offline, pending: 0, sessionExpired: false, prefs: { theme } };
    set({});
    toast('Signed out');
  },

  /** Called after the account was deleted on the server. */
  forgetAccount() {
    if (state.user) remove(LS_USER(state.user.id));
    remove(LS_LAST);
    outbox = [];
    const theme = state.prefs.theme;
    state = { ...empty(), user: null, ready: true, offline: false, pending: 0, sessionExpired: false, prefs: { theme } };
    set({});
  },

  setTheme(theme: Theme) {
    applyTheme(theme, true);
    set({ prefs: { ...state.prefs, theme } });
    sync('/prefs', { theme }, 'PUT', 'prefs:theme');
  },

  setLearnLang(learnLang: LearnLang) {
    if (state.prefs.learnLang === learnLang) return;
    set({ prefs: { ...state.prefs, learnLang } });
    sync('/prefs', { learnLang }, 'PUT', 'prefs:learnLang');
  },

  setCodeLang(codeLang: CodeLang) {
    if (state.prefs.codeLang === codeLang) return;
    set({ prefs: { ...state.prefs, codeLang } });
    sync('/prefs', { codeLang }, 'PUT', 'prefs:codeLang');
  },

  setComplete(conceptId: string, done: boolean) {
    const completed = { ...state.completed };
    if (done) completed[conceptId] = Date.now();
    else delete completed[conceptId];
    set({ completed, activity: done ? bump(state.activity) : state.activity });
    sync(`/concepts/${encodeURIComponent(conceptId)}/complete`, { done }, 'POST', `done:${conceptId}`);
  },

  toggleBookmark(conceptId: string) {
    const on = !state.bookmarks.includes(conceptId);
    set({ bookmarks: on ? [conceptId, ...state.bookmarks] : state.bookmarks.filter((b) => b !== conceptId) });
    sync(`/concepts/${encodeURIComponent(conceptId)}/bookmark`, { on }, 'POST', `bm:${conceptId}`);
    toast(on ? 'Bookmarked' : 'Bookmark removed', on ? 'success' : 'info', 1800);
  },

  patchProblem(problemId: string, patch: Partial<ProblemProgress>) {
    const cur: ProblemProgress = state.problems[problemId] || { status: 'todo', saved: false, attempts: 0 };
    set({ problems: { ...state.problems, [problemId]: { ...cur, ...patch } } });
    const body: any = {};
    if (patch.saved !== undefined) body.saved = patch.saved;
    if (patch.status !== undefined) body.status = patch.status;
    sync(`/problems/${encodeURIComponent(problemId)}`, body);
  },

  recordSubmission(sub: Omit<Submission, 'id' | 'createdAt'>) {
    const accepted = sub.verdict === 'Accepted';
    const full: Submission = { ...sub, id: `local-${Date.now()}`, createdAt: Date.now() };
    const cur: ProblemProgress = state.problems[sub.problemId] || { status: 'todo', saved: false, attempts: 0 };
    const next: ProblemProgress = {
      ...cur,
      attempts: cur.attempts + 1,
      lastLang: sub.language,
      status: cur.status === 'solved' || accepted ? 'solved' : 'attempted',
      solvedAt: cur.solvedAt || (accepted ? Date.now() : null),
    };
    set({
      submissions: [full, ...state.submissions].slice(0, 200),
      problems: { ...state.problems, [sub.problemId]: next },
      activity: bump(state.activity),
    });
    sync('/submissions', sub);
  },

  saveSnippet(snip: Snippet) {
    const others = state.snippets.filter((s) => s.id !== snip.id);
    set({ snippets: [{ ...snip, updatedAt: Date.now() }, ...others] });
    sync(`/snippets/${encodeURIComponent(snip.id)}`, snip, 'PUT', `snip:${snip.id}`);
  },

  deleteSnippet(id: string) {
    set({ snippets: state.snippets.filter((s) => s.id !== id) });
    sync(`/snippets/${encodeURIComponent(id)}`, undefined, 'DELETE', `snip:${id}`);
  },

  recordAttempt(attempt: TestAttempt) {
    set({ attempts: [attempt, ...state.attempts.filter((a) => a.id !== attempt.id)].slice(0, 200), activity: bump(state.activity) });
    sync('/attempts', attempt, 'POST', `attempt:${attempt.id}`);
  },

  noteActivity() {
    set({ activity: bump(state.activity) });
    sync('/activity', {});
  },

  // ----- per-user documents -----
  setDoc(ns: string, key: string, value: unknown) {
    set({ kv: { ...state.kv, [ns]: { ...(state.kv[ns] || {}), [key]: value } } });
    syncDoc(ns, key);
  },

  removeDoc(ns: string, key: string) {
    if (!state.kv[ns] || !(key in state.kv[ns])) return;
    const next = { ...state.kv[ns] };
    delete next[key];
    set({ kv: { ...state.kv, [ns]: next } });
    syncDoc(ns, key);
  },

  // ----- coding tests -----
  saveCodingTest(test: CodingTest, opts: { activity?: boolean } = {}) {
    const exists = state.codingTests.some((t) => t.id === test.id);
    set({
      codingTests: exists ? state.codingTests.map((t) => (t.id === test.id ? test : t)) : [test, ...state.codingTests].slice(0, 100),
      activity: opts.activity ? bump(state.activity) : state.activity,
    });
    sync(`/coding-tests/${encodeURIComponent(test.id)}`, test, 'PUT', `ct:${test.id}`);
  },

  deleteCodingTest(id: string) {
    set({ codingTests: state.codingTests.filter((t) => t.id !== id) });
    sync(`/coding-tests/${encodeURIComponent(id)}`, undefined, 'DELETE', `ct:${id}`);
  },

  /** Try to send queued changes right now. */
  syncNow() {
    return flush();
  },
};

/** Read a per-user document (falls back to a legacy shared localStorage key, migrating it on first read). */
export function getDoc<T>(ns: string, key: string, legacyKey?: string): T | undefined {
  const v = state.kv[ns]?.[key] as T | undefined;
  if (v !== undefined || !legacyKey) return v;
  try {
    const raw = localStorage.getItem(legacyKey);
    if (raw == null) return undefined;
    localStorage.removeItem(legacyKey);
    let parsed: any = raw;
    try {
      parsed = JSON.parse(raw);
    } catch {
      /* plain string */
    }
    queueMicrotask(() => actions.setDoc(ns, key, parsed));
    return parsed as T;
  } catch {
    return undefined;
  }
}

export function useDoc<T>(ns: string, key: string): T | undefined {
  return useStore((s) => s.kv[ns]?.[key] as T | undefined);
}

export function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-switching');
    setTimeout(() => root.classList.remove('theme-switching'), 320);
  }
  root.dataset.theme = theme;
  try {
    localStorage.setItem('sw-theme', theme);
  } catch {
    /* ignore */
  }
}

export const usePrefs = () => useStore((s) => s.prefs);
export const useLearnLang = (): LearnLang => useStore((s) => s.prefs.learnLang || 'python');
export const useCodeLang = (): CodeLang => useStore((s) => s.prefs.codeLang || s.prefs.learnLang || 'python');

export function streakOf(activity: Record<string, number>) {
  let streak = 0;
  const d = new Date();
  if (!activity[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1);
  while (activity[d.toISOString().slice(0, 10)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export type { State as AppState, Prefs };
