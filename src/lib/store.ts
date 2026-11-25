/**
 * App state: one external store, two persistence modes.
 *  - Guest: everything lives in localStorage.
 *  - Signed in: optimistic local update, then the matching API call. On sign-in, guest data is merged server-side.
 */
import { useSyncExternalStore } from 'react';
import { api } from './api';
import { toast } from './toast';
import type { CodeLang, LearnLang, Prefs, ProblemProgress, Snippet, Submission, TestAttempt, Theme, User, UserData } from './types';

interface State extends UserData {
  user: User | null;
  ready: boolean;
}

const LS_KEY = 'sw-data-v1';
const empty = (): UserData => ({ prefs: {}, completed: {}, bookmarks: [], problems: {}, submissions: [], snippets: [], activity: {}, attempts: [] });

function loadGuest(): UserData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...empty(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return empty();
}

function initialTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === 'dark' ? 'dark' : 'light';
}

let state: State = { ...loadGuest(), user: null, ready: false };
state.prefs = { ...state.prefs, theme: initialTheme() };
const subs = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  if (!state.user) {
    try {
      const { user, ready, ...data } = state;
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }
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

/** Fire-and-forget server sync; only when signed in. */
function sync(path: string, body?: unknown, method?: string) {
  if (!state.user) return;
  api(path, { body, method }).catch((e) => toast(`Couldn't save: ${e.message}`, 'error'));
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
    ready: true,
  });
  if (data.prefs?.theme) applyTheme(data.prefs.theme, false);
}

function hasGuestData(d: UserData) {
  return Object.keys(d.completed).length || d.bookmarks.length || Object.keys(d.problems).length || d.snippets.length || d.submissions.length || d.attempts.length;
}

export const actions = {
  async init() {
    try {
      const me = await api('/me');
      if (me.user) applyServer(me);
      else set({ ready: true });
    } catch {
      set({ ready: true });
    }
  },

  async signIn(mode: 'login' | 'signup', body: { email: string; password: string; name?: string }) {
    const guest = loadGuest();
    const data = await api(`/auth/${mode}`, { body });
    if (hasGuestData(guest)) {
      const merged = await api('/import', { body: { ...guest, prefs: { ...guest.prefs, ...state.prefs } } });
      applyServer(merged);
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        /* ignore */
      }
    } else applyServer(data);
    toast(mode === 'signup' ? `Welcome, ${data.user.name}` : `Signed in as ${data.user.name}`, 'success');
  },

  async signOut() {
    await api('/auth/logout', { body: {} }).catch(() => {});
    const theme = state.prefs.theme;
    state = { ...empty(), user: null, ready: true, prefs: { theme } };
    set({});
    toast('Signed out');
  },

  setTheme(theme: Theme) {
    applyTheme(theme, true);
    set({ prefs: { ...state.prefs, theme } });
    sync('/prefs', { theme }, 'PUT');
  },

  setLearnLang(learnLang: LearnLang) {
    if (state.prefs.learnLang === learnLang) return;
    set({ prefs: { ...state.prefs, learnLang } });
    sync('/prefs', { learnLang }, 'PUT');
  },

  setCodeLang(codeLang: CodeLang) {
    if (state.prefs.codeLang === codeLang) return;
    set({ prefs: { ...state.prefs, codeLang } });
    sync('/prefs', { codeLang }, 'PUT');
  },

  setComplete(conceptId: string, done: boolean) {
    const completed = { ...state.completed };
    if (done) completed[conceptId] = Date.now();
    else delete completed[conceptId];
    set({ completed, activity: done ? bump(state.activity) : state.activity });
    sync(`/concepts/${encodeURIComponent(conceptId)}/complete`, { done });
  },

  toggleBookmark(conceptId: string) {
    const on = !state.bookmarks.includes(conceptId);
    set({ bookmarks: on ? [conceptId, ...state.bookmarks] : state.bookmarks.filter((b) => b !== conceptId) });
    sync(`/concepts/${encodeURIComponent(conceptId)}/bookmark`, { on });
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
    sync(`/snippets/${encodeURIComponent(snip.id)}`, snip, 'PUT');
  },

  deleteSnippet(id: string) {
    set({ snippets: state.snippets.filter((s) => s.id !== id) });
    sync(`/snippets/${encodeURIComponent(id)}`, undefined, 'DELETE');
  },

  recordAttempt(attempt: TestAttempt) {
    set({ attempts: [attempt, ...state.attempts.filter((a) => a.id !== attempt.id)].slice(0, 200), activity: bump(state.activity) });
    sync('/attempts', attempt);
  },

  noteActivity() {
    set({ activity: bump(state.activity) });
    sync('/activity', {});
  },
};

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
