export type LearnLang = 'python' | 'java';
export type CodeLang = 'python' | 'java' | 'cpp' | 'c';
export type Theme = 'light' | 'dark';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const LANG_LABEL: Record<CodeLang, string> = { python: 'Python', java: 'Java', cpp: 'C++', c: 'C' };

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: number;
}

export interface ProblemProgress {
  status: 'todo' | 'attempted' | 'solved';
  saved: boolean;
  attempts: number;
  solvedAt?: number | null;
  lastLang?: CodeLang | null;
}

export interface Submission {
  id: string;
  problemId: string;
  language: CodeLang;
  verdict: string;
  passed: number;
  total: number;
  runtimeMs?: number | null;
  code: string;
  createdAt: number;
}

export interface Snippet {
  id: string;
  title: string;
  language: CodeLang;
  code: string;
  stdin: string;
  updatedAt: number;
}

export interface AttemptAnswer {
  /** `${topicId}#${questionIndex}` */
  qid: string;
  chosen: number | null;
  correct: boolean;
  marked: boolean;
  timeSec: number;
}

export interface TestAttempt {
  id: string;
  space: 'aptitude' | 'technical';
  specId: string;
  title: string;
  kind: 'topic' | 'module' | 'section' | 'mock' | 'custom';
  topics: string[];
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  negative: number;
  durationSec: number;
  timeTakenSec: number;
  createdAt: number;
  answers: AttemptAnswer[];
}

export interface Prefs {
  theme?: Theme;
  learnLang?: LearnLang;
  codeLang?: CodeLang;
}

export interface UserData {
  prefs: Prefs;
  completed: Record<string, number>;
  bookmarks: string[];
  problems: Record<string, ProblemProgress>;
  submissions: Submission[];
  snippets: Snippet[];
  activity: Record<string, number>;
  attempts: TestAttempt[];
}

// ---------- execution ----------
export type RunStatus =
  | 'ok'
  | 'compile_error'
  | 'runtime_error'
  | 'timeout'
  | 'memory_limit'
  | 'unavailable'
  | 'internal_error';

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  timeMs?: number;
  truncated?: boolean;
}

// ---------- trace (shared by the Python and Java tracers) ----------
export type TVal =
  | { t: 'int' | 'float'; v: number | string }
  | { t: 'str'; v: string; type?: string }
  | { t: 'char'; v: string }
  | { t: 'bool'; v: boolean }
  | { t: 'none' }
  | { t: 'ref'; v: string }
  | { t: 'other'; v: string };

export interface HeapObj {
  kind: 'list' | 'tuple' | 'set' | 'dict' | 'object' | 'array' | 'deque' | 'stack' | 'heap';
  type: string;
  items?: TVal[];
  entries?: [TVal, TVal][];
  fields?: [string, TVal][];
  more?: number;
}

export interface TFrame {
  id: number | string;
  name: string;
  line: number;
  vars: [string, TVal][];
}

export interface TStep {
  line: number;
  event: 'line' | 'call' | 'return' | 'exception';
  func: string;
  stack: TFrame[];
  heap: Record<string, HeapObj>;
  stdout: string;
  returned?: TVal;
  exception?: string;
}

export interface Trace {
  language: LearnLang;
  steps: TStep[];
  stdout: string;
  stderr?: string;
  truncated?: boolean;
  error?: string;
}
