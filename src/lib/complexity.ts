/**
 * Static time/space complexity estimator for Python, Java, C and C++.
 *
 * It parses the program into a tree of loops, functions, branches and statements, then:
 *  - classifies every loop's growth (constant, linear, logarithmic, √n) from its header and how the
 *    loop variable changes, and multiplies nested loops;
 *  - recognises recursion patterns (linear, divide-and-conquer, branching, backtracking, tree walks,
 *    memoised DP) and the cost of the work done per call;
 *  - knows the cost of common library calls (sorting is n log n, sum/max/min/join are linear, …);
 *  - estimates auxiliary space from allocations, collections that grow inside loops, and recursion depth.
 *
 * Complexity is expressed in terms of n, the input size. This is a static estimate: it cannot know
 * the actual data, so it reports a confidence level and the reasons behind each figure.
 */
import type { CodeLang } from './types';

// ---------------------------------------------------------------- cost algebra
export interface Cost {
  /** factorial growth */
  f: boolean;
  /** exponential base (0 = none) */
  e: number;
  /** power of n */
  p: number;
  /** power of log n */
  l: number;
}
const C = (p = 0, l = 0, e = 0, f = false): Cost => ({ p, l, e, f });
const ONE = C();
const N = C(1);
const LOG = C(0, 1);
const SQRT = C(0.5);
const NLOGN = C(1, 1);

function mul(a: Cost, b: Cost): Cost {
  return { f: a.f || b.f, e: Math.max(a.e, b.e), p: a.p + b.p, l: a.l + b.l };
}
function cmp(a: Cost, b: Cost) {
  if (a.f !== b.f) return a.f ? 1 : -1;
  if (a.e !== b.e) return a.e - b.e;
  if (a.p !== b.p) return a.p - b.p;
  return a.l - b.l;
}
const max = (...cs: Cost[]) => cs.reduce((m, c) => (cmp(c, m) > 0 ? c : m), ONE);

const SUP: Record<string, string> = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
export function formatCost(c: Cost): string {
  if (c.f) return 'O(n!)';
  if (c.e) return `O(${c.e}ⁿ)`;
  const parts: string[] = [];
  const p = c.p;
  if (p === 0.5) parts.push('√n');
  else if (p === 1.5) parts.push('n√n');
  else if (p === 1) parts.push('n');
  else if (p > 0) parts.push(Number.isInteger(p) ? `n${SUP[p] || '^' + p}` : `n^${p}`);
  if (c.l === 1) parts.push('log n');
  else if (c.l > 1) parts.push(`log${SUP[c.l] || '^' + c.l} n`);
  return `O(${parts.join(' ') || '1'})`;
}

const NAMES: Record<string, string> = {
  'O(1)': 'constant',
  'O(log n)': 'logarithmic',
  'O(√n)': 'square root',
  'O(n)': 'linear',
  'O(n log n)': 'linearithmic',
  'O(n²)': 'quadratic',
  'O(n³)': 'cubic',
  'O(2ⁿ)': 'exponential',
  'O(n!)': 'factorial',
};
export const costName = (s: string) => NAMES[s] || (s.includes('ⁿ') ? 'exponential' : 'polynomial');

// ---------------------------------------------------------------- program tree
type Kind = 'loop' | 'func' | 'block' | 'stmt';
interface Node {
  kind: Kind;
  /** loop/func/branch header, or statement text */
  text: string;
  line: number;
  body: Node[];
  name?: string;
  params?: string[];
  decorators?: string[];
}

/** Remove comments and the contents of string literals (keeping the quotes). */
function scrub(code: string, lang: CodeLang): string {
  let out = '';
  let i = 0;
  const py = lang === 'python';
  while (i < code.length) {
    const c = code[i];
    const two = code.slice(i, i + 2);
    if (py && c === '#') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (!py && two === '//') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (!py && two === '/*') {
      const end = code.indexOf('*/', i + 2);
      const chunk = code.slice(i, end < 0 ? code.length : end + 2);
      out += chunk.replace(/[^\n]/g, ' ');
      i += chunk.length;
      continue;
    }
    if (py && (code.startsWith('"""', i) || code.startsWith("'''", i))) {
      const q = code.slice(i, i + 3);
      const end = code.indexOf(q, i + 3);
      const chunk = code.slice(i, end < 0 ? code.length : end + 3);
      out += '""' + chunk.slice(2, -1).replace(/[^\n]/g, '') + '"';
      i += chunk.length;
      continue;
    }
    if (c === '"' || c === "'" || (c === '`' && !py)) {
      let j = i + 1;
      while (j < code.length && code[j] !== c && code[j] !== '\n') j += code[j] === '\\' ? 2 : 1;
      out += c + c;
      i = j + 1;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

// ----- Python: indentation-based
function parsePython(src: string): Node[] {
  const raw = src.split('\n');
  // Join physical lines into logical lines (open brackets or trailing backslash continue a line).
  const lines: { text: string; indent: number; line: number }[] = [];
  let buf = '';
  let start = 0;
  let depth = 0;
  raw.forEach((l, idx) => {
    if (!buf) start = idx;
    buf += (buf ? ' ' : '') + l.replace(/\\\s*$/, '');
    for (const ch of l) {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth = Math.max(0, depth - 1);
    }
    if (depth > 0 || /\\\s*$/.test(l)) return;
    if (buf.trim()) {
      const indent = raw[start].match(/^[ \t]*/)![0].replace(/\t/g, '    ').length;
      lines.push({ text: buf.trim(), indent, line: start + 1 });
    }
    buf = '';
  });

  let i = 0;
  function block(minIndent: number): Node[] {
    const out: Node[] = [];
    let decorators: string[] = [];
    while (i < lines.length && lines[i].indent >= minIndent) {
      const { text, indent, line } = lines[i];
      i++;
      if (text.startsWith('@')) {
        decorators.push(text);
        continue;
      }
      // Single-line compound statements: "for x in y: s += x"
      const inline = /^(for|while|if|elif|else|def|with|try|except)\b[^:]*:\s*(\S.*)$/.exec(text);
      const header = inline ? text.slice(0, text.length - inline[2].length).trim() : text;
      const opens = header.endsWith(':') && /^(for|while|def|class|if|elif|else|with|try|except|finally|async\s+def|match|case)\b/.test(header);
      let body: Node[] = [];
      if (opens) {
        if (inline) body = [{ kind: 'stmt', text: inline[2], line, body: [] }];
        else if (i < lines.length && lines[i].indent > indent) body = block(lines[i].indent);
      }
      if (/^(async\s+)?def\s+/.test(header)) {
        const m = /def\s+(\w+)\s*\(([^)]*)\)/.exec(header);
        out.push({ kind: 'func', text: header, line, body, name: m?.[1], params: (m?.[2] || '').split(',').map((s) => s.split(/[:=]/)[0].trim()).filter((s) => s && s !== 'self'), decorators });
      } else if (/^(for|while)\b/.test(header)) out.push({ kind: 'loop', text: header, line, body });
      else if (opens) out.push({ kind: 'block', text: header, line, body });
      else out.push({ kind: 'stmt', text, line, body: [] });
      decorators = [];
    }
    return out;
  }
  return block(0);
}

// ----- C-like: tokenizer + recursive descent
interface Tok {
  t: string;
  line: number;
}
function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  const re = /\s+|([A-Za-z_]\w*|\d+(?:\.\d+)?[A-Za-z]*|<<=|>>=|->|::|\+\+|--|<=|>=|==|!=|&&|\|\||[+\-*/%&|^]=|<<|>>|[{}()[\];,.<>=+\-*/%!&|^~?:#'"@])/g;
  let line = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[1]) toks.push({ t: m[1], line });
    line += (m[0].match(/\n/g) || []).length;
  }
  return toks;
}

function parseCLike(src: string): Node[] {
  // Drop preprocessor lines.
  const toks = tokenize(src.replace(/^\s*#.*$/gm, ''));
  let i = 0;
  const peek = (k = 0) => toks[i + k]?.t;
  // Rebuild source text: a space only between two word-like tokens ("int x", "new int[n]", "v.push_back(x)").
  const word = (s: string) => /^[A-Za-z_0-9]/.test(s);
  const text = (a: number, b: number) =>
    toks
      .slice(a, b)
      .map((x, k, arr) => (k > 0 && word(arr[k - 1].t) && word(x.t) ? ' ' : '') + x.t)
      .join('');

  function parens(): string {
    // assumes toks[i] === '('
    const s = i;
    let d = 0;
    do {
      if (peek() === '(') d++;
      else if (peek() === ')') d--;
      i++;
    } while (i < toks.length && d > 0);
    return text(s + 1, i - 1);
  }

  function blockContents(): Node[] {
    const out: Node[] = [];
    while (i < toks.length && peek() !== '}') {
      const n = statement();
      if (n) out.push(n);
    }
    return out;
  }

  function statement(): Node | null {
    const tok = toks[i];
    if (!tok) return null;
    const t = tok.t;
    if (t === ';') {
      i++;
      return null;
    }
    if (t === '{') {
      i++;
      const body = blockContents();
      i++;
      return { kind: 'block', text: '{', line: tok.line, body };
    }
    if (t === 'for' || t === 'while') {
      i++;
      const h = peek() === '(' ? parens() : '';
      const body = statement();
      return { kind: 'loop', text: `${t} (${h})`, line: tok.line, body: body ? [body] : [] };
    }
    if (t === 'do') {
      i++;
      const body = statement();
      let h = '';
      if (peek() === 'while') {
        i++;
        h = peek() === '(' ? parens() : '';
      }
      if (peek() === ';') i++;
      return { kind: 'loop', text: `while (${h})`, line: tok.line, body: body ? [body] : [] };
    }
    if (t === 'if' || t === 'switch' || t === 'catch' || t === 'synchronized') {
      i++;
      const h = peek() === '(' ? parens() : '';
      const then = statement();
      const body = then ? [then] : [];
      if (peek() === 'else') {
        i++;
        const e = statement();
        if (e) body.push(e);
      }
      return { kind: 'block', text: `${t} (${h})`, line: tok.line, body };
    }
    if (t === 'else' || t === 'try' || t === 'finally') {
      i++;
      if (t === 'try' && peek() === '(') parens();
      const b = statement();
      return { kind: 'block', text: t, line: tok.line, body: b ? [b] : [] };
    }
    if (t === 'case' || t === 'default') {
      while (i < toks.length && peek() !== ':') i++;
      i++;
      return null;
    }
    // Generic statement or a header that opens a block (function, class, namespace, initializer, lambda).
    const s = i;
    let depth = 0;
    while (i < toks.length) {
      const x = peek();
      if (x === '(' || x === '[') depth++;
      else if (x === ')' || x === ']') depth--;
      else if (x === '{') {
        const header = text(s, i);
        const isInit = depth > 0 || /(=|\breturn|\bnew|->|,)\s*$/.test(header) || /=\s*$/.test(header);
        if (isInit) {
          // Consume the balanced braces as part of this statement (array initializer, lambda, anonymous class).
          let d = 0;
          do {
            if (peek() === '{') d++;
            else if (peek() === '}') d--;
            i++;
          } while (i < toks.length && d > 0);
          continue;
        }
        i++;
        const body = blockContents();
        i++;
        if (/\b(class|struct|interface|enum|namespace|record)\b/.test(header)) return { kind: 'block', text: header, line: tok.line, body };
        const fm = /([A-Za-z_]\w*)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*(?:const\s*)?(?:throws [\w\s,.]+)?$/.exec(header);
        if (fm && !/^(if|for|while|switch|catch|return|new)$/.test(fm[1])) {
          const params = fm[2]
            .split(',')
            .map((p) => p.trim().split(/\s+/).pop()!.replace(/[&*[\]]/g, ''))
            .filter(Boolean);
          return { kind: 'func', text: header, line: tok.line, body, name: fm[1], params };
        }
        return { kind: 'block', text: header, line: tok.line, body };
      } else if (x === '}' && depth <= 0) break;
      else if (x === ';' && depth <= 0) {
        i++;
        break;
      }
      i++;
    }
    const st = text(s, i).replace(/;$/, '').trim();
    if (i === s) i++; // safety: always make progress
    return st ? { kind: 'stmt', text: st, line: tok.line, body: [] } : null;
  }

  const out: Node[] = [];
  while (i < toks.length) {
    if (peek() === '}') {
      i++;
      continue;
    }
    const n = statement();
    if (n) out.push(n);
  }
  return out;
}

// ---------------------------------------------------------------- analysis
export interface ComplexityReport {
  time: string;
  space: string;
  timeName: string;
  spaceName: string;
  timeWhy: string[];
  spaceWhy: string[];
  confidence: 'high' | 'medium' | 'low';
  notes: string[];
}

interface Ctx {
  lang: CodeLang;
  funcs: Map<string, Node>;
  memoTime: Map<string, Cost>;
  memoSpace: Map<string, Cost>;
  stack: Set<string>;
  why: Map<string, string>;
  spaceWhy: Map<string, string>;
  lowConfidence: boolean;
  /** Variables holding maps/dicts (indexed writes into these grow memory). */
  maps: Set<string>;
  mediumConfidence: boolean;
}

const rx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isNumericBound = (s: string) => /^\s*-?\d+\s*$/.test(s);

function addWhy(ctx: Ctx, line: number, msg: string) {
  const k = `${String(line).padStart(5, '0')}:${msg}`;
  if (!ctx.why.has(k)) ctx.why.set(k, `Line ${line}: ${msg}`);
}
function addSpaceWhy(ctx: Ctx, line: number, msg: string) {
  const k = `${String(line).padStart(5, '0')}:${msg}`;
  if (!ctx.spaceWhy.has(k)) ctx.spaceWhy.set(k, `Line ${line}: ${msg}`);
}

/** Variables that the loop body updates multiplicatively (halving or doubling). */
function geometricUpdate(body: Node[], vars: string[]): string | null {
  const all = flatten(body)
    .map((n) => n.text)
    .join('\n');
  for (const v of vars) {
    const V = rx(v);
    if (new RegExp(`\\b${V}\\s*(//=|/=|>>=|\\*=|<<=)`).test(all)) return v;
    if (new RegExp(`\\b${V}\\s*=\\s*${V}\\s*(//|/|>>|\\*|<<)\\s*\\d`).test(all)) return v;
    if (new RegExp(`\\b${V}\\s*=\\s*\\(?\\s*${V}\\s*(//|/|>>)`).test(all)) return v;
  }
  return null;
}

function flatten(nodes: Node[]): Node[] {
  return nodes.flatMap((n) => (n.kind === 'func' ? [] : [n, ...flatten(n.body)]));
}

const idents = (s: string) => Array.from(new Set(s.match(/[A-Za-z_]\w*/g) || []));

/** How many times a loop runs, as a function of n. */
function loopFactor(node: Node, ctx: Ctx): Cost {
  const h = node.text;
  const py = ctx.lang === 'python';
  const say = (c: Cost, why: string) => {
    addWhy(ctx, node.line, `${why} → ×${formatCost(c).slice(2, -1)}`);
    return c;
  };

  if (py && /^for\b/.test(h)) {
    const it = /^for\s+.+?\s+in\s+(.+):$/.exec(h)?.[1]?.trim() || '';
    const range = /^range\s*\((.*)\)$/.exec(it);
    if (range) {
      const args = splitArgs(range[1]);
      if (args.every(isNumericBound)) return say(ONE, 'loop runs a fixed number of times');
      if (args.some((a) => /sqrt|isqrt|\*\*\s*0?\.5/.test(a))) return say(SQRT, 'loop up to √n');
      return say(N, `loop over range(${range[1].trim()})`);
    }
    if (/^\[.*\]$|^\(.*\)$|^""$|^''$/.test(it) && !/\bfor\b/.test(it)) return say(ONE, 'loop over a fixed literal');
    if (/^(sorted|reversed)\s*\(/.test(it)) return say(N, `loop over ${it.split('(')[0]}(…)`);
    return say(N, `loop over ${it.length > 30 ? it.slice(0, 30) + '…' : it}`);
  }

  if (!py && /^for\s*\(/.test(h)) {
    const inside = h.slice(h.indexOf('(') + 1, h.lastIndexOf(')'));
    if (!inside.includes(';')) return say(N, 'loop over every element'); // for (x : arr)
    const [init, cond, update] = inside.split(';').map((s) => s.trim());
    const v = (/([A-Za-z_]\w*)\s*=/.exec(init) || /([A-Za-z_]\w*)/.exec(cond))?.[1] || '';
    if (/(\*=|\/=|>>=|<<=)/.test(update) || new RegExp(`${rx(v)}\\s*=\\s*${rx(v)}\\s*[*/]`).test(update)) return say(LOG, `loop variable ${v} is multiplied/divided each step`);
    if (v && new RegExp(`\\b${rx(v)}\\s*\\*\\s*${rx(v)}\\b`).test(cond)) return say(SQRT, `loop while ${v}·${v} ≤ n`);
    if (/sqrt/.test(cond)) return say(SQRT, 'loop up to √n');
    const bound = /[<>]=?\s*(.+)$/.exec(cond)?.[1] || '';
    const initVal = /=\s*(.+)$/.exec(init)?.[1] || '';
    if (isNumericBound(bound) && (isNumericBound(initVal) || !initVal)) return say(ONE, 'loop runs a fixed number of times');
    if (!cond) {
      ctx.mediumConfidence = true;
      return say(N, 'loop with no condition (assumed to run up to n times)');
    }
    return say(N, `loop while ${cond}`);
  }

  // while loops (all languages)
  const cond = (py ? /^while\s+(.+):$/.exec(h)?.[1] : h.slice(h.indexOf('(') + 1, h.lastIndexOf(')'))) || '';
  const vars = idents(cond).filter((x) => !/^(len|size|length|isEmpty|empty|True|true|not|and|or|None|null|nullptr)$/.test(x));
  const all = flatten(node.body)
    .map((n) => n.text)
    .join('\n');
  const g = geometricUpdate(node.body, vars);
  if (g) return say(LOG, `${g} is halved/doubled each iteration`);
  // binary search: lo/hi narrowed around a midpoint
  if (/\bmid\b/.test(all) && vars.length >= 2 && /[<>]=?/.test(cond)) {
    ctx.mediumConfidence = true;
    return say(LOG, 'binary search: the range halves each iteration');
  }
  const sq = vars.find((v) => new RegExp(`\\b${rx(v)}\\s*\\*\\s*${rx(v)}\\b`).test(cond));
  if (sq) return say(SQRT, `loop while ${sq}·${sq} ≤ n`);
  if (/^(True|true|1)$/.test(cond.trim())) {
    ctx.mediumConfidence = true;
    return say(N, 'infinite loop with a break (assumed to run up to n times)');
  }
  // "while q:" / "while (!stack.isEmpty())": process a queue/stack until it is empty.
  if (vars.length && /^\s*(not\s+|!)?\s*\(?\s*[A-Za-z_][\w.]*(\s*\.\s*(isEmpty|empty)\s*\(\s*\))?\s*\)?\s*$/.test(cond)) {
    ctx.mediumConfidence = true;
    return say(N, `loop until ${cond.trim()} is exhausted (each element processed once)`);
  }
  ctx.mediumConfidence = true;
  return say(N, `loop while ${cond.trim().slice(0, 30)}`);
}

function splitArgs(s: string) {
  const out: string[] = [];
  let d = 0;
  let cur = '';
  for (const ch of s) {
    if ('([{'.includes(ch)) d++;
    if (')]}'.includes(ch)) d--;
    if (ch === ',' && d === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

/** Cost of library calls appearing in one statement. */
function builtinCost(text: string, line: number, ctx: Ctx): Cost {
  let c = ONE;
  // Reading input (input().split(), sc.nextLine().split(" ")) is part of reading the input, not extra work.
  text = text.replace(/(input|readline|nextLine|readLine)\s*\(\s*\)\s*(\.\s*(strip|trim)\s*\(\s*\))?\s*\.\s*split\s*\([^)]*\)/g, '_in_');
  if (/\bsorted\s*\(|\.sort\s*\(|Arrays\s*\.\s*sort|Collections\s*\.\s*sort|\bstd\s*::\s*sort\b|\bsort\s*\(\s*\w+\s*\.\s*begin|\bsort\s*\(\s*\w+\s*,\s*\w+\s*\+|\bqsort\s*\(|stable_sort/.test(text)) {
    c = max(c, NLOGN);
    addWhy(ctx, line, 'sorting costs n log n');
  }
  if (/\bheapq\.heapify|make_heap|new PriorityQueue<[^>]*>\s*\(\s*\w+\s*\)/.test(text)) {
    c = max(c, N);
    addWhy(ctx, line, 'building a heap costs n');
  }
  // sum(arr), max(nums), list(s), sum(x for x in a): a single collection argument means a full scan.
  if (ctx.lang === 'python' && /\b(sum|max|min|any|all|reversed|list|set|dict|tuple|Counter|enumerate|sorted)\s*\(\s*([A-Za-z_][\w.]*(\[[^\]]*\])?\s*\)|[^()]*\bfor\b)/.test(text)) {
    c = max(c, N);
    addWhy(ctx, line, 'built-in that scans the whole collection (n)');
  }
  if (/\.(count|index|indexOf|lastIndexOf|contains|remove|insert)\s*\(|"".join|''\.join|\.join\s*\(|\.split\s*\(|\.toCharArray\s*\(|\.substring\s*\(|\bin\s+[A-Za-z_]\w*\s*$/.test(text)) {
    c = max(c, N);
    addWhy(ctx, line, 'operation that may scan or copy a whole sequence (up to n)');
  }
  if (/\.(pop|remove)\s*\(\s*0\s*\)|\.insert\s*\(\s*0\s*,/.test(text)) {
    c = max(c, N);
    addWhy(ctx, line, 'removing/inserting at the front of a list shifts every element (n)');
  }
  return c;
}

function calledFuncs(text: string, ctx: Ctx, self?: string) {
  const out: string[] = [];
  for (const name of ctx.funcs.keys()) if (name !== self && new RegExp(`(^|[^\\w])${rx(name)}\\s*\\(`).test(text)) out.push(name);
  return out;
}

/**
 * Amortised inner loops: a pointer that only moves forward across all outer iterations
 * (sliding window, two pointers), or adjacency lists visited once each overall (BFS/DFS).
 */
function amortised(inner: Node, outer: Node | undefined, ctx: Ctx): string | null {
  if (!outer) return null;
  const h = inner.text;
  const py = ctx.lang === 'python';
  // for v in adj[u] / graph[u] / g[u] inside a "while queue" style loop: every edge once in total.
  const adjFor = py ? /^for\s+.+?\s+in\s+(adj|graph|g|edges|neighbou?rs|children|tree)\w*\s*[[(.]/.test(h) : /for\s*\(.*:\s*(adj|graph|g|edges|neighbou?rs|children|tree)\w*\s*[[(.]/.test(h);
  if (adjFor && /while/.test(outer.text)) return 'each adjacency list is scanned once in total → O(V + E), counted as n';
  if (!/^while\b/.test(h)) return null;
  const cond = (py ? /^while\s+(.+):$/.exec(h)?.[1] : h.slice(h.indexOf('(') + 1, h.lastIndexOf(')'))) || '';
  const vars = idents(cond);
  const innerText = flatten(inner.body).map((x) => x.text).join('\n');
  const outerOnly = flatten(outer.body)
    .filter((x) => !flatten([inner]).includes(x))
    .map((x) => x.text)
    .join('\n');
  // Candidate pointers: variables in the condition, or used as an index inside the inner loop (a[l]).
  const indexVars = Array.from(innerText.matchAll(/\[\s*([A-Za-z_]\w*)\s*\]/g), (m) => m[1]);
  const candidates = Array.from(new Set([...vars, ...indexVars]));
  for (const v of candidates) {
    const V = rx(v);
    const moves = new RegExp(`\\b${V}\\s*(\\+=|-=)\\s*1\\b|\\b${V}\\s*(\\+\\+|--)|(\\+\\+|--)\\s*${V}\\b`).test(innerText);
    if (!moves) continue;
    const resetOuter = new RegExp(`(^|[^\\w.])${V}\\s*=(?!=)`).test(outerOnly);
    const resetInner = new RegExp(`(^|[^\\w.])${V}\\s*=(?!=)`).test(innerText);
    if (!resetOuter && !resetInner) return `pointer ${v} only moves forward across all iterations (amortised: n steps in total)`;
  }
  return null;
}

function nodeTime(n: Node, ctx: Ctx, self?: string, outer?: Node): Cost {
  if (n.kind === 'func') return ONE;
  if (n.kind === 'stmt') {
    let c = builtinCost(n.text, n.line, ctx);
    for (const f of calledFuncs(n.text, ctx, self)) c = max(c, funcTime(f, ctx));
    return c;
  }
  if (n.kind === 'block') {
    let c = bodyTime(n.body, ctx, self, outer);
    const hdr = n.text;
    for (const f of calledFuncs(hdr, ctx, self)) c = max(c, funcTime(f, ctx));
    return c;
  }
  // loop
  const am = amortised(n, outer, ctx);
  if (am) {
    addWhy(ctx, n.line, am);
    ctx.mediumConfidence = true;
    return bodyTime(n.body, ctx, self, n);
  }
  const factor = loopFactor(n, ctx);
  const inner = bodyTime(n.body, ctx, self, n);
  // The loop header runs once for "for x in sorted(a)".
  let headerCost = /sorted\s*\(|Arrays\s*\.\s*sort/.test(n.text) ? NLOGN : ONE;
  if (cmp(headerCost, ONE) > 0) addWhy(ctx, n.line, 'sorting in the loop header costs n log n (once)');
  for (const f of calledFuncs(n.text, ctx, self)) headerCost = max(headerCost, funcTime(f, ctx));
  return max(mul(factor, max(ONE, inner)), headerCost);
}

function bodyTime(nodes: Node[], ctx: Ctx, self?: string, outer?: Node): Cost {
  return max(...nodes.map((n) => nodeTime(n, ctx, self, outer)));
}

/** Self-calls of a function and how their arguments shrink. */
function recursionInfo(fn: Node, ctx: Ctx) {
  const name = fn.name!;
  const call = new RegExp(`(^|[^\\w])${rx(name)}\\s*\\(([^()]*(?:\\([^()]*\\)[^()]*)*)\\)`, 'g');
  let calls = 0;
  let inLoop = false;
  let halving = false;
  let decrement = false;
  let tree = false;
  const visit = (nodes: Node[], loopDepth: number) => {
    for (const n of nodes) {
      if (n.kind === 'func') continue;
      const texts = [n.text];
      for (const t of texts) {
        let m: RegExpExecArray | null;
        call.lastIndex = 0;
        while ((m = call.exec(t))) {
          calls++;
          if (loopDepth > 0 || (n.kind === 'loop' && t === n.text)) inLoop = true;
          const args = m[2];
          if (/\/\s*2|\/\/\s*2|>>\s*1|\bmid\b|\(\s*\w+\s*\+\s*\w+\s*\)\s*\/|half|\[\s*:\s*\w*mid|\[\s*\w*mid\w*\s*:/.test(args)) halving = true;
          if (/\.(left|right|next|children|child)\b|\bleft\b|\bright\b|\bneighbou?r|\bchild|\bnode\b|\bnei\b|\bv\b|\bu\b/.test(args)) tree = true;
          if (/[-+]\s*1\b|\[\s*1\s*:|\bi\s*\+\s*1|\bidx\s*\+\s*1|\bstart\s*\+\s*1|\bpos\s*\+\s*1/.test(args)) decrement = true;
        }
      }
      visit(n.body, n.kind === 'loop' ? loopDepth + 1 : loopDepth);
    }
  };
  visit(fn.body, 0);
  const fnText = flatten(fn.body)
    .map((n) => n.text)
    .join('\n');
  const memo =
    (fn.decorators || []).some((d) => /lru_cache|cache\b/.test(d)) ||
    /\b(memo|dp|cache)\b\s*(\[|\.get|\.containsKey|\.has|\.count|\.find)/.test(fnText) ||
    /\bin\s+(memo|dp|cache)\b/.test(fnText);
  // Graph walk: nodes are marked visited and never un-marked (backtracking would un-mark them).
  const marks = /\b(visited|seen|vis|used|marked)\w*\s*(\[[^\]]*\]\s*=\s*(True|true|1)\b|\.(add|insert)\s*\()/.test(fnText) || /\bin\s+(visited|seen)\b/.test(fnText);
  const unmarks = /\b(visited|seen|vis|used|marked)\w*\s*(\[[^\]]*\]\s*=\s*(False|false|0)\b|\.(remove|discard|erase|delete)\s*\()/.test(fnText);
  const graphWalk = marks && !unmarks;
  return { calls, inLoop, halving, decrement, tree, memo, graphWalk };
}

function funcTime(name: string, ctx: Ctx): Cost {
  if (ctx.memoTime.has(name)) return ctx.memoTime.get(name)!;
  if (ctx.stack.has(name)) {
    ctx.lowConfidence = true;
    return N; // mutual recursion: assume linear depth
  }
  const fn = ctx.funcs.get(name);
  if (!fn) return ONE;
  ctx.stack.add(name);
  const work = bodyTime(fn.body, ctx, name);
  const r = recursionInfo(fn, ctx);
  let total = work;
  if (r.calls > 0) {
    ctx.mediumConfidence = true;
    const linearWork = work.p >= 1;
    if (r.memo) {
      const states = Math.max(1, Math.min(3, (fn.params || []).length || 1));
      const st = C(states);
      total = mul(st, max(ONE, work));
      addWhy(ctx, fn.line, `${name}() is memoised: about n${states > 1 ? SUP[states] : ''} distinct states, each computed once`);
    } else if (r.graphWalk) {
      total = N;
      addWhy(ctx, fn.line, `${name}() marks nodes as visited, so each node and edge is processed once → O(V + E), counted as n`);
    } else if (r.inLoop && !r.halving) {
      const fact = r.decrement || /\bpermut|used\b|visited\b|swap\s*\(/.test(flatten(fn.body).map((x) => x.text).join(' '));
      total = fact ? C(0, 0, 0, true) : C(0, 0, 2);
      addWhy(ctx, fn.line, fact ? `${name}() recurses inside a loop over the remaining choices (backtracking over permutations) → n!` : `${name}() recurses inside a loop (backtracking) → exponential`);
    } else if (r.calls >= 2 && r.halving) {
      total = linearWork ? NLOGN : N;
      addWhy(ctx, fn.line, linearWork ? `${name}() splits the input in half twice and does linear work per level (divide and conquer) → n log n` : `${name}() splits the input in half twice with constant work → n`);
    } else if (r.calls >= 2 && r.tree && !r.decrement) {
      total = mul(N, work.p >= 1 ? N : ONE);
      addWhy(ctx, fn.line, `${name}() visits each node of a tree/graph once → n`);
    } else if (r.calls >= 2) {
      total = C(0, 0, Math.min(r.calls, 3));
      addWhy(ctx, fn.line, `${name}() calls itself ${r.calls} times on a slightly smaller input → ${Math.min(r.calls, 3)}ⁿ`);
    } else if (r.halving) {
      total = linearWork ? N : mul(LOG, max(ONE, work));
      addWhy(ctx, fn.line, linearWork ? `${name}() halves the input each call with linear work (n + n/2 + …) → n` : `${name}() halves the input on each call → log n`);
    } else {
      total = mul(N, max(ONE, work));
      addWhy(ctx, fn.line, `${name}() calls itself once per step on a smaller input → depth n`);
    }
  }
  ctx.stack.delete(name);
  ctx.memoTime.set(name, total);
  return total;
}

// ----- space
function allocCost(text: string, line: number, ctx: Ctx): Cost {
  const py = ctx.lang === 'python';
  let c = ONE;
  const note = (k: Cost, msg: string) => {
    if (cmp(k, c) > 0) c = k;
    addSpaceWhy(ctx, line, `${msg} → ${formatCost(k)}`);
  };
  if (py) {
    if (/\[\s*\[.*\]\s*\*\s*[\w(]+.*for\b.*\bin\b|\[\s*\[.*for\b.*\bin\b.*\]\s*for\b.*\bin\b/.test(text)) note(C(2), '2-D table');
    else if (/\[[^\]]*\]\s*\*\s*\(?\s*[A-Za-z_]/.test(text) || /\[.*\bfor\b.*\bin\b.*\]/.test(text) || /\{.*\bfor\b.*\bin\b.*\}/.test(text)) note(N, 'list/set built from the input');
    else if (/=\s*(list|set|dict|sorted|Counter|deque|bytearray)\s*\(\s*[A-Za-z_]/.test(text) || /input\s*\(\s*\)\s*\.\s*split/.test(text) || /\[\s*:\s*\]|\[\s*::\s*-1\s*\]/.test(text)) note(N, 'copy of a sequence');
  } else {
    if (/new\s+\w+(<[^>]*>)?\s*\[\s*[A-Za-z_][^\]]*\]\s*\[\s*[A-Za-z_][^\]]*\]/.test(text) || /vector\s*<\s*vector/.test(text) || /\b\w+\s+\w+\s*\[\s*[A-Za-z_]\w*[^\]]*\]\s*\[\s*[A-Za-z_]\w*[^\]]*\]/.test(text)) note(C(2), '2-D array/table');
    else if (/new\s+\w+\s*\[\s*[A-Za-z_(]/.test(text) || /vector\s*<[^>]*>\s*\w+\s*\(\s*[A-Za-z_]/.test(text) || /malloc\s*\(\s*[A-Za-z_]/.test(text) || /\bnew\s+(ArrayList|HashMap|HashSet|StringBuilder|ArrayDeque|LinkedList)\s*<[^>]*>\s*\(\s*[A-Za-z_]/.test(text) || /\.toCharArray\s*\(|\.split\s*\(/.test(text)) note(N, 'array/collection sized by the input');
    else if (/\b(int|long|char|double|bool|float)\s+\w+\s*\[\s*[A-Za-z_]\w*\s*\]/.test(text)) note(N, 'array sized by the input');
    else {
      const big = /\[\s*(\d{4,})\s*\]/.exec(text);
      if (big) note(N, `fixed buffer of ${big[1]} elements sized for the largest input`);
    }
  }
  return c;
}

const GROW_CALL = /\.(append|add|push|push_back|emplace_back|emplace|put|insert|appendleft|offer|addLast|addFirst|extend|setdefault|putIfAbsent|merge)\s*\(/;

/** Does this statement add to a collection? Indexed writes count only for maps/dicts (a[i] = x on an array doesn't grow it). */
function grows(text: string, ctx: Ctx) {
  if (GROW_CALL.test(text)) return true;
  if (/^\s*[A-Za-z_]\w*\s*\+=\s*[A-Za-z_"'[]/.test(text) && !/^\s*\w+\s*\+=\s*[\w.]+\s*(\[|$|[-+*/%])/.test(text)) return true; // s += "x" / s += [x]
  const m = /^\s*([A-Za-z_]\w*)\s*\[[^\]]+\]\s*(\+?=)(?!=)/.exec(text);
  return !!m && ctx.maps.has(m[1]);
}

function bodySpace(nodes: Node[], ctx: Ctx, loopMult: Cost, self?: string, outer?: Node): Cost {
  let c = ONE;
  for (const n of nodes) {
    if (n.kind === 'func') continue;
    if (n.kind === 'stmt') {
      c = max(c, allocCost(n.text, n.line, ctx));
      if (loopMult.p > 0 && grows(n.text, ctx)) {
        c = max(c, loopMult);
        addSpaceWhy(ctx, n.line, `collection grows inside a loop → ${formatCost(loopMult)}`);
      }
      for (const f of calledFuncs(n.text, ctx, self)) c = max(c, funcSpace(f, ctx));
    } else if (n.kind === 'loop') {
      const quiet = { ...ctx, why: new Map() };
      const factor = amortised(n, outer, quiet) ? ONE : loopFactor(n, quiet);
      c = max(c, bodySpace(n.body, ctx, mul(loopMult, factor), self, n));
      for (const f of calledFuncs(n.text, ctx, self)) c = max(c, funcSpace(f, ctx));
    } else {
      c = max(c, bodySpace(n.body, ctx, loopMult, self, outer));
      for (const f of calledFuncs(n.text, ctx, self)) c = max(c, funcSpace(f, ctx));
    }
  }
  return c;
}

function funcSpace(name: string, ctx: Ctx): Cost {
  if (ctx.memoSpace.has(name)) return ctx.memoSpace.get(name)!;
  const fn = ctx.funcs.get(name);
  if (!fn || ctx.stack.has(name)) return ONE;
  ctx.stack.add(name);
  let s = bodySpace(fn.body, ctx, ONE, name);
  const r = recursionInfo(fn, ctx);
  if (r.calls > 0) {
    let depth: Cost = N;
    if (r.halving) depth = LOG;
    if (r.memo) {
      const states = Math.max(1, Math.min(3, (fn.params || []).length || 1));
      s = max(s, C(states));
      addSpaceWhy(ctx, fn.line, `memo table for ${name}() holds about ${formatCost(C(states)).slice(2, -1)} entries`);
    }
    addSpaceWhy(ctx, fn.line, `recursion depth of ${name}() → ${formatCost(depth)} stack frames${r.tree ? ' (tree height; n in the worst case)' : ''}`);
    s = max(s, depth);
  }
  ctx.stack.delete(name);
  ctx.memoSpace.set(name, s);
  return s;
}

function collectFuncs(nodes: Node[], into: Map<string, Node>, lang: CodeLang) {
  for (const n of nodes) {
    if (n.kind === 'func' && n.name && (lang === 'python' || n.name !== 'main') && !into.has(n.name)) into.set(n.name, n);
    collectFuncs(n.body, into, lang);
  }
}

function collectMaps(nodes: Node[], into: Set<string>) {
  for (const n of nodes) {
    const t = n.text;
    const py = /([A-Za-z_]\w*)\s*=\s*(\{\s*\}|dict\s*\(|defaultdict\s*\(|Counter\s*\(|\{[^}]*:)/.exec(t);
    if (py) into.add(py[1]);
    const jv = /(?:Map|HashMap|TreeMap|LinkedHashMap|unordered_map|map)\s*<[^;]*?>\s*([A-Za-z_]\w*)/.exec(t);
    if (jv) into.add(jv[1]);
    collectMaps(n.body, into);
  }
}

function findMain(nodes: Node[]): Node | null {
  for (const n of nodes) {
    if (n.kind === 'func' && n.name === 'main') return n;
    const m = findMain(n.body);
    if (m) return m;
  }
  return null;
}

export function analyzeComplexity(code: string, lang: CodeLang): ComplexityReport | null {
  if (!code.trim()) return null;
  let tree: Node[];
  try {
    const clean = scrub(code, lang);
    tree = lang === 'python' ? parsePython(clean) : parseCLike(clean);
  } catch {
    return null;
  }
  const ctx: Ctx = {
    lang,
    funcs: new Map(),
    memoTime: new Map(),
    memoSpace: new Map(),
    stack: new Set(),
    why: new Map(),
    spaceWhy: new Map(),
    lowConfidence: false,
    maps: new Set(),
    mediumConfidence: false,
  };
  collectFuncs(tree, ctx.funcs, lang);
  collectMaps(tree, ctx.maps);
  const notes: string[] = [];

  // Entry point: main() for Java/C/C++, module-level code for Python (falling back to every function).
  let time: Cost;
  let space: Cost;
  const main = lang === 'python' ? null : findMain(tree);
  const topLevel = lang === 'python' ? tree.filter((n) => n.kind !== 'func' && !(n.kind === 'block' && /^class\b/.test(n.text))) : [];
  // Python classes (e.g. class Solution) contain methods: include their methods as callable functions.
  if (main) {
    time = bodyTime(main.body, ctx);
    space = bodySpace(main.body, ctx, ONE);
  } else if (topLevel.length && calledAny(topLevel, ctx)) {
    time = bodyTime(topLevel, ctx);
    space = bodySpace(topLevel, ctx, ONE);
  } else if (ctx.funcs.size) {
    time = max(...[...ctx.funcs.keys()].map((f) => funcTime(f, ctx)), bodyTime(topLevel, ctx));
    space = max(...[...ctx.funcs.keys()].map((f) => funcSpace(f, ctx)), bodySpace(topLevel, ctx, ONE));
    notes.push('No call to these functions was found, so the most expensive function is reported.');
  } else {
    time = bodyTime(tree, ctx);
    space = bodySpace(tree, ctx, ONE);
  }

  const t = formatCost(time);
  const s = formatCost(space);
  const timeWhy = [...ctx.why.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  const spaceWhy = [...ctx.spaceWhy.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  if (!timeWhy.length) timeWhy.push('No loops, recursion or costly library calls: every statement runs a fixed number of times.');
  if (!spaceWhy.length) spaceWhy.push('Only a fixed number of variables are used (no structures that grow with the input).');
  if (/\binput\s*\(|Scanner|cin\s*>>|scanf|readLine|BufferedReader/.test(code)) notes.push('Space includes storing the input you read.');
  const confidence = ctx.lowConfidence ? 'low' : ctx.mediumConfidence ? 'medium' : 'high';
  return { time: t, space: s, timeName: costName(t), spaceName: costName(s), timeWhy: timeWhy.slice(0, 8), spaceWhy: spaceWhy.slice(0, 6), confidence, notes };
}

function calledAny(nodes: Node[], ctx: Ctx): boolean {
  if (!ctx.funcs.size) return true;
  const text = flatten(nodes)
    .map((n) => n.text)
    .join('\n');
  return [...ctx.funcs.keys()].some((f) => new RegExp(`(^|[^\\w])${rx(f)}\\s*\\(`).test(text)) || /\bfor\b|\bwhile\b/.test(text);
}
