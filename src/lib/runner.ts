import { useSyncExternalStore } from 'react';
import { api } from './api';
import type { CodeLang, RunResult, Trace } from './types';

// ---------- Python worker lifecycle ----------
type PyStatus = 'idle' | 'loading' | 'ready';
let worker: Worker | null = null;
let pyStatus: PyStatus = 'idle';
let seq = 0;
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();
const statusSubs = new Set<() => void>();
const setPyStatus = (s: PyStatus) => {
  pyStatus = s;
  statusSubs.forEach((f) => f());
};

export function usePythonStatus() {
  return useSyncExternalStore(
    (f) => {
      statusSubs.add(f);
      return () => statusSubs.delete(f);
    },
    () => pyStatus
  );
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./pyWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const p = pending.get(e.data.id);
      if (!p) return;
      pending.delete(e.data.id);
      if (pyStatus !== 'ready') setPyStatus('ready');
      e.data.ok ? p.resolve(e.data.result) : p.reject(new Error(e.data.error));
    };
    worker.onerror = (e) => {
      pending.forEach((p) => p.reject(new Error(e.message || 'Python runtime crashed')));
      pending.clear();
      killWorker();
    };
    if (pyStatus !== 'ready') setPyStatus('loading');
  }
  return worker;
}

function killWorker() {
  worker?.terminate();
  worker = null;
  setPyStatus('idle');
}

/** Start downloading the Python runtime ahead of the first run. */
export function warmPython() {
  if (pyStatus !== 'idle') return;
  callWorker('warm', '', '', 120000).catch(() => {});
}

function callWorker(type: 'run' | 'trace' | 'warm', code: string, stdin: string, timeoutMs: number, extra: object = {}) {
  const w = getWorker();
  const id = ++seq;
  return new Promise<any>((resolve, reject) => {
    // Timeout starts only once the runtime is loaded so first-run download time isn't counted.
    let timer: ReturnType<typeof setTimeout> | null = null;
    const arm = () => {
      timer = setTimeout(() => {
        if (!pending.has(id)) return;
        pending.delete(id);
        killWorker();
        reject(new TimeoutError());
      }, timeoutMs);
    };
    pending.set(id, {
      resolve: (v) => {
        if (timer) clearTimeout(timer);
        resolve(v);
      },
      reject: (e) => {
        if (timer) clearTimeout(timer);
        reject(e);
      },
    });
    if (pyStatus === 'ready') arm();
    else {
      const unsub = () => statusSubs.delete(onReady);
      const onReady = () => {
        if (pyStatus === 'ready') {
          unsub();
          arm();
        }
      };
      statusSubs.add(onReady);
    }
    w.postMessage({ id, type, code, stdin, ...extra });
  });
}

class TimeoutError extends Error {
  constructor() {
    super('timeout');
  }
}

// ---------- public API ----------
export async function runCode(language: CodeLang, code: string, stdin = '', timeoutMs = 6000): Promise<RunResult> {
  const started = performance.now();
  if (language === 'python') {
    try {
      const r = await callWorker('run', code, stdin, timeoutMs);
      return { ...r, timeMs: Math.round(performance.now() - started) };
    } catch (e) {
      if (e instanceof TimeoutError)
        return { status: 'timeout', stdout: '', stderr: `Time limit exceeded (${timeoutMs / 1000}s). Look for an infinite loop or a slow algorithm.` };
      return { status: 'internal_error', stdout: '', stderr: `Could not start Python: ${(e as Error).message}. Check your internet connection (the runtime loads from a CDN).` };
    }
  }
  try {
    const r = await api<RunResult>('/run', { body: { language, code, stdin, timeoutMs } });
    return { ...r, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
  } catch (e) {
    return { status: 'internal_error', stdout: '', stderr: (e as Error).message };
  }
}

export async function traceCode(language: 'python' | 'java', code: string, stdin = ''): Promise<{ trace?: Trace; error?: string }> {
  if (language === 'python') {
    try {
      const trace = await callWorker('trace', code, stdin, 15000, { maxSteps: 1500 });
      return { trace };
    } catch (e) {
      if (e instanceof TimeoutError) return { error: 'Tracing timed out. The program may loop forever or run too many steps.' };
      return { error: (e as Error).message };
    }
  }
  try {
    const r = await api<any>('/trace', { body: { language, code, stdin } });
    if (r.status === 'ok') return { trace: r.trace };
    if (r.status === 'compile_error') return { error: 'Compilation failed:\n' + r.compileOutput };
    return { error: r.stderr || 'Tracing failed.' };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

let capsPromise: Promise<any> | null = null;
export function getRuntimes(): Promise<Record<string, { available: boolean; reason?: string; driver?: string }>> {
  if (!capsPromise) capsPromise = api('/runtimes').catch(() => ({}));
  return capsPromise;
}

export const STATUS_LABEL: Record<string, string> = {
  ok: 'Finished',
  compile_error: 'Compilation error',
  runtime_error: 'Runtime error',
  timeout: 'Time limit exceeded',
  memory_limit: 'Memory limit exceeded',
  unavailable: 'Runtime unavailable',
  internal_error: 'Execution failed',
};
