import type { CodeLang, Difficulty } from '../types';

export type TypeName =
  | 'int'
  | 'long'
  | 'double'
  | 'bool'
  | 'string'
  | 'char'
  | 'int[]'
  | 'char[]'
  | 'string[]'
  | 'int[][]'
  | 'char[][]'
  | 'List<int>'
  | 'List<string>'
  | 'List<double>'
  | 'List<List<int>>'
  | 'List<List<string>>'
  | 'ListNode'
  | 'TreeNode'
  | 'ListNode[]'
  | 'RandomListNode'
  | 'GraphNode'
  | 'NextTreeNode'
  | 'QuadNode'
  | 'void';

export interface Param {
  name: string;
  type: TypeName;
  /** Read by the harness (e.g. a cycle position) but not passed to the user's function. */
  hidden?: boolean;
}

export const visible = (ps: Param[]) => ps.filter((p) => !p.hidden);

export interface FnSig {
  kind?: 'function';
  name: string;
  params: Param[];
  returns: TypeName;
  /** When the function returns void, the argument at this index is printed as the result (in-place problems). */
  inplace?: number;
  /** The function returns k (int) and the result checked is the first k elements of this int[] argument. */
  prefix?: number;
  /** Link the list argument's tail to the node at index args[pos] (pos = -1: no cycle). */
  cycle?: { list: number; pos: number };
}

export interface Method {
  name: string;
  params: Param[];
  returns: TypeName;
}

export interface DesignSig {
  kind: 'design';
  className: string;
  ctor: Param[];
  methods: Method[];
}

export type Sig = FnSig | DesignSig;

export interface Test {
  /** Function: argument values. Design: [operations, argumentLists]. */
  args: any[];
  expected: any;
}

export type CompareMode = 'exact' | 'unordered' | 'deep-unordered' | 'float';

export interface Approach {
  name: string;
  idea: string;
  time: string;
  space: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  /** DSA or language topic id this problem practises (links Learn ↔ Practice). */
  topic: string;
  lc150?: boolean;
  statement: string;
  constraints?: string[];
  sig: Sig;
  tests: Test[];
  /** How many leading tests are shown as examples (default 2). */
  examples?: number;
  notes?: string[];
  compare?: CompareMode;
  /** Custom validator for problems with many valid answers. */
  check?: (args: any[], actual: any, expected: any) => boolean;
  hints: string[];
  approaches: Approach[];
  solution: { python: string; java: string };
}

export const isDesign = (s: Sig): s is DesignSig => s.kind === 'design';

export function supportedLangs(p: Problem): CodeLang[] {
  const langs: CodeLang[] = ['python', 'java', 'cpp'];
  if (cSupported(p.sig)) langs.push('c');
  return langs;
}

const C_PARAM: TypeName[] = ['int', 'long', 'double', 'bool', 'string', 'char', 'int[]', 'string[]', 'int[][]'];
const C_RET: TypeName[] = ['int', 'long', 'double', 'bool', 'string', 'char', 'int[]', 'void'];

export function cSupported(s: Sig) {
  if (isDesign(s)) return false;
  if (!C_RET.includes(s.returns)) return false;
  if (s.returns === 'void' && s.inplace !== undefined && !['int[]', 'int[][]'].includes(s.params[s.inplace].type)) return false;
  return s.params.every((p) => C_PARAM.includes(p.type));
}
