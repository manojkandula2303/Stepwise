/**
 * Code execution front door. Picks an isolated driver per language:
 *   docker  – container per run, no network, capped memory/CPU/pids, read-only FS (preferred in production)
 *   judge0  – remote Judge0 instance (JUDGE0_URL, optional JUDGE0_KEY)
 *   java-sm – separate JVM under a deny-all Security Manager (Java only, JDK < 24)
 * Python normally runs in the browser (Pyodide/WebAssembly) and only reaches the server through docker/judge0.
 * Unsandboxed host execution is never used.
 */
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runProcess, createQueue } from './process.mjs';
import { detectJava, runJava, traceJava, mainClassName } from './javaSandbox.mjs';

const LANGS = ['python', 'java', 'cpp', 'c'];
const enqueue = createQueue(Number(process.env.RUNNER_CONCURRENCY || 3));
let dockerOk = null;

async function hasDocker() {
  if (dockerOk !== null) return dockerOk;
  if (process.env.RUNNER === 'local') return (dockerOk = false);
  const r = await runProcess('docker', ['info', '--format', '{{.ServerVersion}}'], { timeoutMs: 6000 });
  return (dockerOk = r.code === 0);
}

export async function capabilities() {
  const docker = await hasDocker();
  const judge0 = Boolean(process.env.JUDGE0_URL);
  const java = await detectJava();
  const caps = {};
  for (const l of LANGS) {
    if (docker) caps[l] = { available: true, driver: 'docker' };
    else if (judge0) caps[l] = { available: true, driver: 'judge0' };
    else if (l === 'java' && java.available) caps[l] = { available: true, driver: 'java-sandbox' };
    else
      caps[l] = {
        available: false,
        reason:
          l === 'java'
            ? java.reason
            : l === 'python'
            ? 'Python runs in your browser sandbox.'
            : 'No isolated C/C++ runtime is configured on this server. Install Docker or set JUDGE0_URL.',
      };
  }
  caps.python.browser = true;
  caps.trace = { python: 'browser', java: java.available ? 'java-sandbox' : null };
  return caps;
}

export async function run({ language, code, stdin = '', timeoutMs = 6000 }) {
  if (!LANGS.includes(language)) return { status: 'internal_error', stderr: 'Unsupported language.' };
  const caps = await capabilities();
  const cap = caps[language];
  if (!cap.available) return { status: 'unavailable', stderr: cap.reason };
  return enqueue(async () => {
    if (cap.driver === 'docker') return runDocker({ language, code, stdin, timeoutMs });
    if (cap.driver === 'judge0') return runJudge0({ language, code, stdin, timeoutMs });
    return runJava({ code, stdin, timeoutMs });
  });
}

export async function trace({ language, code, stdin }) {
  if (language !== 'java') return { status: 'internal_error', stderr: 'Python is traced in the browser.' };
  const java = await detectJava();
  if (!java.available) return { status: 'unavailable', stderr: java.reason };
  return enqueue(() => traceJava({ code, stdin }));
}

// ---------------- Docker ----------------
const IMAGES = {
  python: { image: 'python:3.12-alpine', file: 'main.py', cmd: 'python3 /code/main.py' },
  java: { image: 'eclipse-temurin:17-jdk-alpine', file: null, cmd: null },
  cpp: { image: 'gcc:13', file: 'main.cpp', cmd: 'g++ -O2 -std=c++17 -o /tmp/a /code/main.cpp 2>/tmp/ce || { cat /tmp/ce >&2; exit 99; }; /tmp/a' },
  c: { image: 'gcc:13', file: 'main.c', cmd: 'gcc -O2 -std=c11 -o /tmp/a /code/main.c -lm 2>/tmp/ce || { cat /tmp/ce >&2; exit 99; }; /tmp/a' },
};

async function runDocker({ language, code, stdin, timeoutMs }) {
  const spec = IMAGES[language];
  const dir = await mkdtemp(join(tmpdir(), 'sw-docker-'));
  try {
    let file = spec.file;
    let cmd = spec.cmd;
    if (language === 'java') {
      const cls = mainClassName(code);
      file = `${cls}.java`;
      cmd = `javac -proc:none -d /tmp /code/${file} 2>/tmp/ce || { cat /tmp/ce >&2; exit 99; }; java -Xmx200m -cp /tmp ${cls}`;
    }
    await writeFile(join(dir, file), code, 'utf8');
    const args = [
      'run', '--rm', '-i', '--network', 'none', '--memory', '256m', '--memory-swap', '256m', '--cpus', '1',
      '--pids-limit', '64', '--read-only', '--tmpfs', '/tmp:rw,exec,size=64m', '--cap-drop', 'ALL',
      '--security-opt', 'no-new-privileges', '--user', '65534:65534', '-v', `${dir}:/code:ro`,
      spec.image, 'sh', '-c', `timeout ${Math.ceil(timeoutMs / 1000)}s sh -c '${cmd.replace(/'/g, `'\\''`)}'`,
    ];
    const r = await runProcess('docker', args, { stdin, timeoutMs: timeoutMs + 15000 });
    if (r.code === 99) return { status: 'compile_error', compileOutput: r.stderr, stdout: '', stderr: '' };
    let status = 'ok';
    if (r.timedOut || r.code === 124) status = 'timeout';
    else if (r.code === 137) status = 'memory_limit';
    else if (r.code !== 0) status = 'runtime_error';
    return { status, stdout: r.stdout, stderr: r.stderr, exitCode: r.code, timeMs: r.ms };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// ---------------- Judge0 ----------------
const JUDGE0_IDS = { python: 71, java: 62, cpp: 54, c: 50 };

async function runJudge0({ language, code, stdin, timeoutMs }) {
  const b64 = (s) => Buffer.from(s || '', 'utf8').toString('base64');
  const unb64 = (s) => (s ? Buffer.from(s, 'base64').toString('utf8') : '');
  let source = code;
  if (language === 'java') source = code.replace(/public\s+class\s+([A-Za-z_]\w*)/, (m, n) => (n === 'Main' ? m : m.replace(n, 'Main')));
  const headers = { 'content-type': 'application/json' };
  if (process.env.JUDGE0_KEY) headers['X-Auth-Token'] = process.env.JUDGE0_KEY;
  const res = await fetch(`${process.env.JUDGE0_URL.replace(/\/$/, '')}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language_id: JUDGE0_IDS[language],
      source_code: b64(source),
      stdin: b64(stdin),
      cpu_time_limit: timeoutMs / 1000,
      memory_limit: 256000,
    }),
    signal: AbortSignal.timeout(timeoutMs + 20000),
  });
  if (!res.ok) return { status: 'internal_error', stderr: `Judge0 responded ${res.status}` };
  const j = await res.json();
  const id = j.status?.id;
  const map = { 3: 'ok', 5: 'timeout', 6: 'compile_error' };
  const status = map[id] || (id >= 7 ? 'runtime_error' : 'internal_error');
  return {
    status,
    stdout: unb64(j.stdout),
    stderr: unb64(j.stderr) || (status === 'runtime_error' ? j.status?.description : ''),
    compileOutput: unb64(j.compile_output),
    timeMs: j.time ? Math.round(parseFloat(j.time) * 1000) : undefined,
  };
}
