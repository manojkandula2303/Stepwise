import { spawn } from 'node:child_process';

const MAX_OUTPUT = 512 * 1024;

/**
 * Spawn a process with a wall-clock timeout and capped output.
 * Resolves (never rejects) with { stdout, stderr, code, timedOut, ms, truncated }.
 */
export function runProcess(cmd, args, { stdin = '', timeoutMs = 5000, cwd, env } = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = '';
    let stderr = '';
    let truncated = false;
    let timedOut = false;
    let child;
    try {
      child = spawn(cmd, args, { cwd, env: env || minimalEnv(), windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      return resolve({ stdout: '', stderr: String(e.message || e), code: -1, timedOut: false, ms: 0, truncated: false });
    }
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    const cap = (cur, chunk) => {
      if (cur.length + chunk.length > MAX_OUTPUT) {
        truncated = true;
        child.kill('SIGKILL');
        return cur + chunk.slice(0, Math.max(0, MAX_OUTPUT - cur.length));
      }
      return cur + chunk;
    };
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (d) => (stdout = cap(stdout, d)));
    child.stderr.on('data', (d) => (stderr = cap(stderr, d)));
    child.on('error', (e) => (stderr += String(e.message || e)));
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code, timedOut, truncated, ms: Date.now() - start });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(stdin);
  });
}

/** Only pass through what toolchains need; never leak server secrets to user programs. */
export function minimalEnv() {
  const keep = ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP', 'JAVA_HOME', 'LANG', 'HOME', 'USERPROFILE', 'COMSPEC', 'PATHEXT'];
  const env = {};
  for (const k of keep) if (process.env[k]) env[k] = process.env[k];
  return env;
}

/** Limit concurrent executions so a burst of runs cannot exhaust the host. */
export function createQueue(concurrency) {
  let active = 0;
  const waiting = [];
  const next = () => {
    if (active >= concurrency || !waiting.length) return;
    active++;
    const { fn, resolve, reject } = waiting.shift();
    Promise.resolve()
      .then(fn)
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      if (waiting.length > 50) return reject(new Error('The runner is busy. Please try again in a moment.'));
      waiting.push({ fn, resolve, reject });
      next();
    });
}
