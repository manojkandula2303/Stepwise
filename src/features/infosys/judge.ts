import { api } from '../../lib/api';
import { runCode } from '../../lib/runner';
import type { CaseResult, CodeLang, RunResult } from '../../lib/types';
import { sameOutput } from '../../content/infosys';
import type { TestCase } from '../../content/infosys/types';

/** Per-case time limit (generous: Python runs in the browser). */
export const CASE_TIMEOUT_MS = 5000;

/**
 * Run a stdin/stdout program against several inputs.
 * Python runs in the browser one input at a time; Java/C/C++ use one batch request (compiled once).
 */
export async function runInputs(lang: CodeLang, code: string, inputs: string[], onProgress?: (done: number) => void): Promise<RunResult[]> {
  if (lang === 'python') {
    const out: RunResult[] = [];
    for (const input of inputs) {
      out.push(await runCode('python', code, input, CASE_TIMEOUT_MS));
      onProgress?.(out.length);
    }
    return out;
  }
  try {
    const r = await api<{ results: RunResult[] }>('/run-batch', { body: { language: lang, code, stdins: inputs, timeoutMs: CASE_TIMEOUT_MS } });
    onProgress?.(inputs.length);
    return r.results.map((x) => ({ ...x, stdout: x.stdout ?? '', stderr: x.stderr ?? '' }));
  } catch (e) {
    const msg = !navigator.onLine ? "This language runs on the Stepwise server, which can't be reached right now. Python works offline." : (e as Error).message;
    return inputs.map(() => ({ status: 'unavailable', stdout: '', stderr: msg }) as RunResult);
  }
}

export function verdict(r: RunResult, expected: string): CaseResult['status'] {
  if (r.status === 'compile_error') return 'compile_error';
  if (r.status === 'timeout') return 'timeout';
  if (r.status !== 'ok') return 'error';
  return sameOutput(r.stdout, expected) ? 'pass' : 'fail';
}

export async function judgeCases(lang: CodeLang, code: string, cases: TestCase[], onProgress?: (done: number) => void) {
  const results = await runInputs(lang, code, cases.map((c) => c.input), onProgress);
  const verdicts: CaseResult[] = results.map((r, i) => ({ status: verdict(r, cases[i].output), timeMs: r.timeMs }));
  return { results, verdicts, passed: verdicts.filter((v) => v.status === 'pass').length };
}

export const VERDICT_LABEL: Record<CaseResult['status'], string> = {
  pass: 'Passed',
  fail: 'Wrong answer',
  error: 'Runtime error',
  timeout: 'Time limit exceeded',
  compile_error: 'Compilation error',
};
