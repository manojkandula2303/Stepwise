/**
 * Java driver for hosts without Docker.
 *
 * Isolation: user code is compiled with annotation processing disabled and executed in a
 * separate JVM under a Security Manager whose policy grants no file, network, process or
 * reflection permissions. Memory is capped with -Xmx, wall-clock time with a hard kill,
 * output is capped, and the environment is stripped. The Security Manager was removed in
 * JDK 24, so this driver refuses to run on JDK >= 24 — use the Docker or Judge0 driver there.
 */
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProcess } from './process.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const workDir = process.env.SANDBOX_DIR || join(root, '.sandbox');
const policyPath = join(workDir, 'sandbox.policy');
const tracerOut = join(workDir, 'tracer');

let javaInfo = null;

export async function detectJava() {
  if (javaInfo) return javaInfo;
  const r = await runProcess('java', ['-version'], { timeoutMs: 8000 });
  const m = /version "(\d+)(?:\.(\d+))?/.exec(r.stderr + r.stdout);
  if (!m) return (javaInfo = { available: false, reason: 'Java is not installed on the server.' });
  let major = Number(m[1]);
  if (major === 1) major = Number(m[2]);
  if (major >= 24) return (javaInfo = { available: false, major, reason: `JDK ${major} has no Security Manager; configure the Docker or Judge0 runner.` });
  const jc = await runProcess('javac', ['-version'], { timeoutMs: 8000 });
  if (jc.code !== 0) return (javaInfo = { available: false, major, reason: 'javac (JDK) is not installed on the server.' });
  mkdirSync(workDir, { recursive: true });
  writeFileSync(
    policyPath,
    [
      'grant {',
      '  permission java.lang.RuntimePermission "exitVM.*";',
      '  permission java.util.PropertyPermission "line.separator", "read";',
      '  permission java.util.PropertyPermission "java.version", "read";',
      '  permission java.util.PropertyPermission "user.dir", "read";',
      '};',
      '',
    ].join('\n')
  );
  return (javaInfo = { available: true, major });
}

function sandboxFlags() {
  const flags = ['-Xmx256m', '-Xss32m', '-XX:+UseSerialGC', '-XX:TieredStopAtLevel=1', '-Xshare:auto', '-Dfile.encoding=UTF-8'];
  flags.push(javaInfo.major >= 18 ? '-Djava.security.manager=allow' : '-Djava.security.manager');
  flags.push(`-Djava.security.policy==${policyPath}`);
  return flags;
}

const SM_NOISE = /^WARNING: (A command line option has enabled the Security Manager|The Security Manager is deprecated|System::setSecurityManager|Please consider reporting|A terminally deprecated method|Security Manager will be removed).*$\n?/gm;
export const cleanStderr = (s) => s.replace(/\r\n/g, '\n').replace(SM_NOISE, '').replace(/^\s+/, '');

export function mainClassName(code) {
  const pub = /public\s+(?:final\s+)?class\s+([A-Za-z_]\w*)/.exec(code);
  if (pub) return pub[1];
  const withMain = /class\s+([A-Za-z_]\w*)[^{]*\{[^]*?static\s+void\s+main\s*\(/.exec(code);
  return withMain ? withMain[1] : 'Main';
}

async function compile(code, dir, debug) {
  const cls = mainClassName(code);
  const src = join(dir, `${cls}.java`);
  await writeFile(src, code, 'utf8');
  const out = join(dir, 'classes');
  await mkdir(out);
  const args = ['-proc:none', '-encoding', 'UTF-8', '-nowarn', '-d', out];
  if (debug) args.unshift('-g');
  args.push(src);
  const r = await runProcess('javac', ['-J-Xmx384m', ...args], { timeoutMs: 15000 });
  const msg = (r.stdout + r.stderr).split(dir + (process.platform === 'win32' ? '\\' : '/')).join('');
  return { ok: r.code === 0 && !r.timedOut, cls, out, msg: r.timedOut ? 'Compilation timed out.' : msg };
}

export async function runJava({ code, stdin, timeoutMs }) {
  const dir = await mkdtemp(join(tmpdir(), 'sw-java-'));
  try {
    const c = await compile(code, dir, false);
    if (!c.ok) return { status: 'compile_error', compileOutput: c.msg, stdout: '', stderr: '', timeMs: 0 };
    const r = await runProcess('java', [...sandboxFlags(), '-cp', c.out, c.cls], { stdin, timeoutMs, cwd: dir });
    const stderr = cleanStderr(r.stderr);
    let status = 'ok';
    if (r.timedOut) status = 'timeout';
    else if (r.code !== 0) status = 'runtime_error';
    if (/OutOfMemoryError/.test(stderr)) status = 'memory_limit';
    return { status, stdout: r.stdout, stderr, exitCode: r.code, timeMs: r.ms, truncated: r.truncated };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Compile once, then run the program against each input in its own sandboxed JVM. */
export async function runJavaBatch({ code, stdins, timeoutMs }) {
  const dir = await mkdtemp(join(tmpdir(), 'sw-java-'));
  try {
    const c = await compile(code, dir, false);
    if (!c.ok) return stdins.map(() => ({ status: 'compile_error', compileOutput: c.msg, stdout: '', stderr: '', timeMs: 0 }));
    const out = [];
    for (const stdin of stdins) {
      const r = await runProcess('java', [...sandboxFlags(), '-cp', c.out, c.cls], { stdin, timeoutMs, cwd: dir });
      const stderr = cleanStderr(r.stderr);
      let status = r.timedOut ? 'timeout' : r.code !== 0 ? 'runtime_error' : 'ok';
      if (/OutOfMemoryError/.test(stderr)) status = 'memory_limit';
      out.push({ status, stdout: r.stdout, stderr, exitCode: r.code, timeMs: r.ms, truncated: r.truncated });
    }
    return out;
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

let tracerReady = null;
function ensureTracer() {
  if (!tracerReady) {
    tracerReady = (async () => {
      const src = join(root, 'server', 'java', 'Tracer.java');
      if (existsSync(join(tracerOut, 'Tracer.class'))) {
        const { statSync } = await import('node:fs');
        if (statSync(join(tracerOut, 'Tracer.class')).mtimeMs > statSync(src).mtimeMs) return;
      }
      await mkdir(tracerOut, { recursive: true });
      const r = await runProcess('javac', ['-encoding', 'UTF-8', '-d', tracerOut, src], { timeoutMs: 60000 });
      if (r.code !== 0) throw new Error('Could not build the Java tracer: ' + r.stderr);
    })().catch((e) => {
      tracerReady = null;
      throw e;
    });
  }
  return tracerReady;
}

export async function traceJava({ code, stdin, maxSteps = 1500 }) {
  await ensureTracer();
  const dir = await mkdtemp(join(tmpdir(), 'sw-trace-'));
  try {
    const c = await compile(code, dir, true);
    if (!c.ok) return { status: 'compile_error', compileOutput: c.msg };
    const stdinFile = join(dir, 'stdin.txt');
    await writeFile(stdinFile, stdin || '', 'utf8');
    const debuggeeOpts = [...sandboxFlags(), '-cp', c.out].join(' ');
    const r = await runProcess(
      'java',
      ['-Xmx256m', '-cp', tracerOut, 'Tracer', c.cls, String(maxSteps), stdinFile, debuggeeOpts],
      { timeoutMs: 20000, cwd: dir }
    );
    if (r.timedOut) return { status: 'timeout', stderr: 'Tracing took too long. Try a smaller input or fewer loop iterations.' };
    const line = r.stdout.split('\n').find((l) => l.startsWith('{'));
    if (!line) return { status: 'internal_error', stderr: cleanStderr(r.stderr) || 'The tracer produced no output.' };
    const trace = JSON.parse(line);
    if (trace.stderr) trace.stderr = cleanStderr(trace.stderr);
    return { status: 'ok', trace };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
