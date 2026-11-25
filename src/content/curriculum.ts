import lessonIndex from 'virtual:lesson-index';
import type { Concept } from './parse';

/** Lightweight lesson metadata (always loaded); bodies are fetched with loadConcept(). */
export interface ConceptMeta {
  id: string;
  title: string;
  summary: string;
  practice: string[];
  file: string;
}

/** Hierarchy: Subject → Module → Concept page → Sections. Concepts are written once and shared between subjects. */
export interface Module {
  id: string;
  title: string;
  concepts: string[];
  /** Practice topic id unlocked by this module. */
  topic?: string;
}
export interface Subject {
  id: 'python' | 'java' | 'dsa';
  title: string;
  blurb: string;
  lang?: 'python' | 'java';
  modules: Module[];
}

export const CONCEPTS: Record<string, ConceptMeta> = Object.fromEntries(lessonIndex.map((c) => [c.id, c]));

// Each module file becomes its own chunk, fetched the first time one of its lessons is opened.
const files = import.meta.glob('./learn/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
const fileCache = new Map<string, Promise<Record<string, Concept>>>();

function loadFile(file: string) {
  let p = fileCache.get(file);
  if (!p) {
    p = Promise.all([files[`./learn/${file}`](), import('./parse')]).then(([src, { parseModule }]) =>
      Object.fromEntries(parseModule(src).map((c) => [c.id, c]))
    );
    p.catch(() => fileCache.delete(file));
    fileCache.set(file, p);
  }
  return p;
}

export async function loadConcept(id: string): Promise<Concept | undefined> {
  const meta = CONCEPTS[id];
  if (!meta) return undefined;
  return (await loadFile(meta.file))[id];
}

const fundamentals: Module[] = [
  { id: 'basics', title: 'Getting Started', concepts: ['intro', 'variables', 'operators', 'input-output', 'type-conversion'], topic: 'basics' },
  { id: 'control', title: 'Control Flow', concepts: ['if-else', 'switch-match', 'for-loop', 'while-loop', 'break-continue'], topic: 'basics' },
  { id: 'strings', title: 'Strings', concepts: ['strings', 'string-methods', 'string-formatting'], topic: 'basics' },
  { id: 'collections', title: 'Collections', concepts: ['lists-arrays', 'matrices', 'tuples', 'sets', 'dictionaries', 'comprehensions'], topic: 'basics' },
  { id: 'functions', title: 'Functions', concepts: ['functions', 'parameters', 'scope', 'lambdas', 'recursion-basics'], topic: 'basics' },
  { id: 'oop', title: 'Object-Oriented Programming', concepts: ['classes-objects', 'encapsulation', 'inheritance', 'polymorphism', 'interfaces-abstract', 'equality-hashing'] },
  { id: 'errors', title: 'Errors & Files', concepts: ['exceptions', 'file-io', 'context-managers'] },
];

export const SUBJECTS: Subject[] = [
  {
    id: 'python',
    title: 'Python',
    lang: 'python',
    blurb: 'From your first print statement to generators, decorators and type hints.',
    modules: [...fundamentals, { id: 'py-advanced', title: 'Advanced Python', concepts: ['iterators-generators', 'decorators', 'modules-packages', 'type-hints'] }],
  },
  {
    id: 'java',
    title: 'Java',
    lang: 'java',
    blurb: 'Static types, classes and the collections framework — the language of enterprise and Android.',
    modules: [...fundamentals, { id: 'java-advanced', title: 'Advanced Java', concepts: ['generics', 'collections-framework', 'streams', 'static-final'] }],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    blurb: 'Every core structure and technique, implemented in Python and Java with dry runs and complexity.',
    modules: [
      { id: 'foundations', title: 'Foundations', concepts: ['complexity'], topic: 'arrays' },
      { id: 'arrays', title: 'Arrays & Strings', concepts: ['dsa-arrays', 'dsa-strings'], topic: 'arrays' },
      { id: 'hashing', title: 'Hashing', concepts: ['hashing'], topic: 'hashing' },
      { id: 'techniques', title: 'Core Techniques', concepts: ['two-pointers', 'sliding-window', 'prefix-sum'], topic: 'two-pointers' },
      { id: 'string-algorithms', title: 'String Algorithms', concepts: ['kmp', 'rabin-karp', 'z-algorithm'], topic: 'strings' },
      { id: 'linked-list', title: 'Linked Lists', concepts: ['linked-list', 'linked-list-techniques', 'doubly-circular-lists'], topic: 'linked-list' },
      { id: 'stack-queue', title: 'Stacks & Queues', concepts: ['stack', 'queue', 'monotonic-stack'], topic: 'stack' },
      { id: 'recursion', title: 'Recursion & Backtracking', concepts: ['recursion', 'backtracking'], topic: 'backtracking' },
      { id: 'search-sort', title: 'Searching & Sorting', concepts: ['binary-search', 'sorting-basic', 'sorting-advanced', 'heap-sort', 'counting-radix-sort'], topic: 'binary-search' },
      { id: 'trees', title: 'Trees', concepts: ['binary-trees', 'tree-traversals', 'bst', 'balanced-bst'], topic: 'trees' },
      { id: 'heaps', title: 'Heaps & Priority Queues', concepts: ['heaps'], topic: 'heap' },
      { id: 'graphs', title: 'Graphs', concepts: ['graph-basics', 'bfs-dfs', 'cycle-detection', 'bipartite-graphs', 'shortest-paths', 'topological-sort'], topic: 'graphs' },
      { id: 'graphs-advanced', title: 'Advanced Graphs', concepts: ['minimum-spanning-tree', 'bellman-ford-floyd', 'strongly-connected-components', 'bridges-articulation'], topic: 'graphs' },
      { id: 'greedy', title: 'Greedy Algorithms', concepts: ['greedy', 'intervals'], topic: 'greedy' },
      { id: 'dp', title: 'Dynamic Programming', concepts: ['dp-intro', 'dp-1d', 'dp-2d', 'dp-knapsack'], topic: 'dp' },
      { id: 'dp-advanced', title: 'Advanced Dynamic Programming', concepts: ['dp-interval', 'dp-trees', 'dp-bitmask', 'dp-digit'], topic: 'dp' },
      { id: 'bits', title: 'Bit Manipulation', concepts: ['bit-manipulation'], topic: 'bit' },
      { id: 'math', title: 'Math & Game Theory', concepts: ['number-theory', 'sieve-primes', 'game-theory'], topic: 'math' },
      { id: 'advanced', title: 'Advanced Structures', concepts: ['tries', 'dsu', 'segment-tree', 'segment-tree-impl', 'sqrt-decomposition'], topic: 'trie' },
    ],
  },
];

export const subjectById = (id: string) => SUBJECTS.find((s) => s.id === id);

/** Flattened, ordered concept list for a subject (only concepts that exist). */
export function subjectConcepts(s: Subject) {
  return s.modules.flatMap((m) => m.concepts.filter((c) => CONCEPTS[c]).map((c) => ({ concept: CONCEPTS[c], module: m })));
}

export function subjectsForConcept(id: string) {
  return SUBJECTS.filter((s) => s.modules.some((m) => m.concepts.includes(id)));
}
