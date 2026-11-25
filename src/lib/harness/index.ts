import { runCode } from '../runner';
import type { CodeLang, RunResult } from '../types';
import { cProgram, cStarter } from './c';
import { cppProgram, cppStarter } from './cpp';
import { javaProgram, javaStarter } from './java';
import { pythonProgram, pythonStarter, PY_PRELUDE_LINES } from './python';
import { isDesign, type CompareMode, type Problem, type Sig, type Test } from './types';

export * from './types';

export function starterCode(lang: CodeLang, sig: Sig): string {
  switch (lang) {
    case 'python':
      return pythonStarter(sig);
    case 'java':
      return javaStarter(sig);
    case 'cpp':
      return cppStarter(sig);
    case 'c':
      return cStarter(sig);
  }
}

function buildProgram(lang: CodeLang, code: string, sig: Sig): { code: string; userOffset: number } {
  switch (lang) {
    case 'python':
      return { code: pythonProgram(code, sig), userOffset: PY_PRELUDE_LINES };
    case 'java':
      return javaProgram(code, sig);
    case 'cpp':
      return cppProgram(code, sig);
    case 'c':
      return cProgram(code, sig);
  }
}

function buildStdin(tests: Test[]): string {
  const lines = [String(tests.length)];
  for (const t of tests) for (const a of t.args) lines.push(JSON.stringify(a));
  return lines.join('\n') + '\n';
}

// ---------- output comparison ----------
const EPS = 1e-5;

function canon(v: any): string {
  return JSON.stringify(deepSort(v));
}
function deepSort(v: any): any {
  if (Array.isArray(v)) return v.map(deepSort).sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
  return v;
}

function equal(a: any, b: any): boolean {
  if (typeof a === 'number' && typeof b === 'number') return Number.isInteger(a) && Number.isInteger(b) ? a === b : Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => equal(x, b[i]));
  return a === b;
}

export function compare(expected: any, actual: any, mode: CompareMode = 'exact'): boolean {
  if (mode === 'unordered' && Array.isArray(expected) && Array.isArray(actual)) {
    const s = (x: any[]) => [...x].map((y) => JSON.stringify(y)).sort();
    return JSON.stringify(s(expected)) === JSON.stringify(s(actual));
  }
  if (mode === 'deep-unordered') return canon(expected) === canon(actual);
  return equal(expected, actual);
}

// ---------- judging ----------
export interface CaseResult {
  index: number;
  args: any[];
  expected: any;
  actual?: any;
  actualRaw?: string;
  stdout: string;
  error?: string;
  passed: boolean;
}

export interface JudgeResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Unavailable' | 'Error';
  cases: CaseResult[];
  passed: number;
  total: number;
  timeMs?: number;
  message?: string;
  run: RunResult;
}

function parseOutput(stdout: string) {
  const blocks: { stdout: string; result?: string; error?: string }[] = [];
  let cur: (typeof blocks)[number] | null = null;
  for (const raw of stdout.replace(/\r\n/g, '\n').split('\n')) {
    const i = raw.indexOf('\u0001');
    const line = i >= 0 ? raw.slice(i) : raw;
    const pre = i > 0 ? raw.slice(0, i) : '';
    if (pre && cur) cur.stdout += pre + '\n';
    if (line.startsWith('\u0001BEGIN')) {
      cur = { stdout: '' };
      blocks.push(cur);
    } else if (line.startsWith('\u0001RESULT') && cur) cur.result = line.slice(8).trim();
    else if (line.startsWith('\u0001ERROR') && cur) cur.error = line.slice(7).trim();
    else if (cur && i < 0) cur.stdout += raw + '\n';
  }
  return blocks;
}

/** Shift line numbers in compiler/runtime messages so they point at the user's code. */
function remapLines(msg: string, offset: number, lang: CodeLang) {
  if (!msg) return msg;
  const fix = (n: string) => String(Math.max(1, Number(n) - offset));
  if (lang === 'python') return msg.replace(/line (\d+)/g, (_, n) => `line ${fix(n)}`).replace(/File "<main>"/g, 'File "solution.py"');
  if (lang === 'java') return msg.replace(/(\w+\.java):(\d+)/g, (_, f, n) => `Solution.java:${fix(n)}`);
  return msg.replace(/main\.(cpp|c):(\d+)/g, (_, e, n) => `solution.${e}:${fix(n)}`);
}

export async function judge(problem: Problem, lang: CodeLang, code: string, tests: Test[]): Promise<JudgeResult> {
  const prog = buildProgram(lang, code, problem.sig);
  const run = await runCode(lang, prog.code, buildStdin(tests), lang === 'python' ? 8000 : 8000);
  const base = { cases: [] as CaseResult[], passed: 0, total: tests.length, timeMs: run.timeMs, run };
  if (run.status === 'compile_error')
    return { ...base, verdict: 'Compilation Error', message: remapLines(run.compileOutput || run.stderr, prog.userOffset, lang) };
  if (run.status === 'unavailable') return { ...base, verdict: 'Unavailable', message: run.stderr };
  if (run.status === 'internal_error') return { ...base, verdict: 'Error', message: run.stderr };

  const blocks = parseOutput(run.stdout);
  const mode = problem.compare || 'exact';
  const cases: CaseResult[] = tests.map((t, index) => {
    const b = blocks[index];
    const c: CaseResult = { index, args: t.args, expected: t.expected, stdout: b?.stdout || '', passed: false };
    if (!b) return c;
    if (b.error) c.error = remapLines(b.error, prog.userOffset, lang);
    else if (b.result !== undefined) {
      c.actualRaw = b.result;
      try {
        c.actual = JSON.parse(b.result);
        c.passed = problem.check ? problem.check(t.args, c.actual, t.expected) : compare(t.expected, c.actual, mode);
      } catch {
        c.error = 'Could not read the returned value.';
      }
    }
    return c;
  });
  const passed = cases.filter((c) => c.passed).length;
  const res: JudgeResult = { ...base, cases, passed, verdict: 'Accepted' };
  const firstMissing = cases.findIndex((c) => c.actual === undefined && !c.error);
  if (run.status === 'timeout') res.verdict = 'Time Limit Exceeded';
  else if (run.status === 'memory_limit') res.verdict = 'Memory Limit Exceeded';
  else if (cases.some((c) => c.error) || (run.status === 'runtime_error' && firstMissing >= 0)) res.verdict = 'Runtime Error';
  else if (passed < tests.length) res.verdict = 'Wrong Answer';
  if (run.status === 'runtime_error' || run.status === 'timeout') {
    const err = remapLines(run.stderr, prog.userOffset, lang);
    res.message = err;
    if (firstMissing >= 0 && !cases[firstMissing].error) cases[firstMissing].error = err.trim().split('\n').slice(-3).join('\n') || run.status;
  }
  return res;
}

// ---------- display helpers ----------
export function fmtValue(v: any): string {
  return JSON.stringify(v)?.replace(/,/g, ', ') ?? 'null';
}

export function exampleInput(problem: Problem, t: Test): string {
  if (isDesign(problem.sig)) return `${fmtValue(t.args[0])}\n${fmtValue(t.args[1])}`;
  return problem.sig.params.map((p, i) => `${p.name} = ${fmtValue(t.args[i])}`).join(', ');
}

export function cSupportedNote(p: Problem) {
  return isDesign(p.sig) ? 'design' : '';
}
