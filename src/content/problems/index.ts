import problemIndex from 'virtual:problem-index';
import type { Problem } from '../../lib/harness';
import type { CodeLang } from '../../lib/types';

export const TOPICS: { id: string; title: string; concept?: string }[] = [
  { id: 'basics', title: 'Language Basics', concept: 'for-loop' },
  { id: 'arrays', title: 'Arrays', concept: 'dsa-arrays' },
  { id: 'strings', title: 'Strings', concept: 'dsa-strings' },
  { id: 'hashing', title: 'Hashing', concept: 'hashing' },
  { id: 'two-pointers', title: 'Two Pointers', concept: 'two-pointers' },
  { id: 'sliding-window', title: 'Sliding Window', concept: 'sliding-window' },
  { id: 'prefix-sum', title: 'Prefix Sum', concept: 'prefix-sum' },
  { id: 'matrix', title: 'Matrix', concept: 'matrices' },
  { id: 'intervals', title: 'Intervals', concept: 'intervals' },
  { id: 'stack', title: 'Stack', concept: 'stack' },
  { id: 'linked-list', title: 'Linked List', concept: 'linked-list' },
  { id: 'trees', title: 'Binary Tree', concept: 'binary-trees' },
  { id: 'bst', title: 'Binary Search Tree', concept: 'bst' },
  { id: 'graphs', title: 'Graphs', concept: 'graph-basics' },
  { id: 'trie', title: 'Trie', concept: 'tries' },
  { id: 'backtracking', title: 'Backtracking', concept: 'backtracking' },
  { id: 'divide-conquer', title: 'Divide & Conquer', concept: 'sorting-advanced' },
  { id: 'binary-search', title: 'Binary Search', concept: 'binary-search' },
  { id: 'sorting', title: 'Sorting', concept: 'sorting-basic' },
  { id: 'queue', title: 'Queue', concept: 'queue' },
  { id: 'recursion', title: 'Recursion', concept: 'recursion' },
  { id: 'heap', title: 'Heap', concept: 'heaps' },
  { id: 'bit', title: 'Bit Manipulation', concept: 'bit-manipulation' },
  { id: 'math', title: 'Math', concept: 'operators' },
  { id: 'greedy', title: 'Greedy', concept: 'greedy' },
  { id: 'dp', title: 'Dynamic Programming', concept: 'dp-intro' },
  { id: 'dsu', title: 'Disjoint Set Union', concept: 'dsu' },
];
export const TOPIC_TITLE = Object.fromEntries(TOPICS.map((t) => [t.id, t.title]));

/** Lightweight problem metadata (always loaded); statements, tests and solutions load with loadProblem(). */
export type ProblemMeta = (typeof problemIndex)[number];

export const PROBLEMS: ProblemMeta[] = problemIndex;
export const PROBLEMS_BY_ID: Record<string, ProblemMeta> = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
export const LC150 = PROBLEMS.filter((p) => p.lc150);
export const problemsForTopic = (topic: string) => PROBLEMS.filter((p) => p.topic === topic);
export const metaLangs = (p: ProblemMeta): CodeLang[] => (p.c ? ['python', 'java', 'cpp', 'c'] : ['python', 'java', 'cpp']);

const files = import.meta.glob(['./*.ts', '!./index.ts']) as Record<string, () => Promise<{ default: Problem[] }>>;
const cache = new Map<string, Promise<Record<string, Problem>>>();

function loadFile(file: string) {
  let p = cache.get(file);
  if (!p) {
    p = files[`./${file}`]().then((m) => Object.fromEntries(m.default.map((x) => [x.id, x])));
    p.catch(() => cache.delete(file));
    cache.set(file, p);
  }
  return p;
}

export async function loadProblem(id: string): Promise<Problem | undefined> {
  const meta = PROBLEMS_BY_ID[id];
  if (!meta) return undefined;
  return (await loadFile(meta.file))[id];
}

/** Every full problem (used by tooling such as the solution verifier). */
export async function loadAllProblems(): Promise<Problem[]> {
  const byFile = await Promise.all(Array.from(new Set(PROBLEMS.map((p) => p.file))).map(loadFile));
  const all = Object.assign({}, ...byFile) as Record<string, Problem>;
  return PROBLEMS.map((p) => all[p.id]);
}
