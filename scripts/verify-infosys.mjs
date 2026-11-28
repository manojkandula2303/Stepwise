// Verifies the Infosys problem bank: for every problem and several seeds, the JS reference solver,
// the Python solution and the Java solution must agree on all 14 generated test cases.
// Usage: node scripts/verify-infosys.mjs [problem-id-filter] [--seeds=3] [--no-java] [--no-python]
import { build } from 'esbuild';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith('--')) || '';
const seeds = Number((args.find((a) => a.startsWith('--seeds=')) || '--seeds=3').split('=')[1]);
const doJava = !args.includes('--no-java');
const doPython = !args.includes('--no-python');

const work = mkdtempSync(join(tmpdir(), 'sw-infosys-'));
const bundle = join(work, 'bank.mjs');
await build({ entryPoints: [join(root, 'src/content/infosys/index.ts')], bundle: true, format: 'esm', platform: 'node', outfile: bundle, logLevel: 'error' });
const bank = await import(pathToFileURL(bundle).href);

const norm = (s) => s.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
let failures = 0;
let checks = 0;
const slow = [];

for (const p of bank.ALL_PROBLEMS) {
  if (filter && !p.id.includes(filter)) continue;
  const dir = join(work, p.id);
  mkdirSync(dir);
  writeFileSync(join(dir, 'sol.py'), p.solutions.python);
  writeFileSync(join(dir, 'Main.java'), p.solutions.java);
  let javaOk = doJava;
  if (doJava) {
    const c = spawnSync('javac', ['-encoding', 'UTF-8', '-d', dir, join(dir, 'Main.java')], { encoding: 'utf8' });
    if (c.status !== 0) {
      console.log(`✘ ${p.id}: Java compile error\n${c.stderr}`);
      failures++;
      javaOk = false;
    }
  }
  const problems = [];
  let maxPy = 0;
  let maxJava = 0;
  let maxInput = 0;
  for (let seed = 1; seed <= seeds; seed++) {
    let cases;
    try {
      cases = bank.generateCases(p, seed * 7919);
    } catch (e) {
      problems.push(`seed ${seed}: generator/solver threw ${e.message}`);
      continue;
    }
    if (cases.length !== 14 || cases.filter((c) => c.public).length !== 2) problems.push(`seed ${seed}: expected 2 public + 12 private cases`);
    const total = cases.reduce((n, c) => n + c.input.length, 0);
    maxInput = Math.max(maxInput, total);
    for (const [i, c] of cases.entries()) {
      if (doPython) {
        const t = Date.now();
        const r = spawnSync('python', [join(dir, 'sol.py')], { input: c.input, encoding: 'utf8', timeout: 20000 });
        maxPy = Math.max(maxPy, Date.now() - t);
        checks++;
        if (r.status !== 0) problems.push(`seed ${seed} case ${i}: Python error ${r.stderr.slice(-300)}`);
        else if (norm(r.stdout) !== norm(c.output)) problems.push(`seed ${seed} case ${i}: Python "${norm(r.stdout).slice(0, 60)}" vs expected "${c.output.slice(0, 60)}"`);
      }
      if (javaOk) {
        const t = Date.now();
        const r = spawnSync('java', ['-Xss64m', '-cp', dir, 'Main'], { input: c.input, encoding: 'utf8', timeout: 20000 });
        maxJava = Math.max(maxJava, Date.now() - t);
        checks++;
        if (r.status !== 0) problems.push(`seed ${seed} case ${i}: Java error ${r.stderr.slice(-300)}`);
        else if (norm(r.stdout) !== norm(c.output)) problems.push(`seed ${seed} case ${i}: Java "${norm(r.stdout).slice(0, 60)}" vs expected "${c.output.slice(0, 60)}"`);
      }
    }
  }
  if (maxPy > 3000 || maxJava > 3000) slow.push(`${p.id} (python ${maxPy} ms, java ${maxJava} ms)`);
  if (problems.length) {
    failures++;
    console.log(`✘ ${p.id}\n  ${problems.slice(0, 6).join('\n  ')}`);
  } else console.log(`✔ ${p.id}  (inputs ≤ ${(maxInput / 1024).toFixed(0)} KB per test, python ≤ ${maxPy} ms, java ≤ ${maxJava} ms)`);
}
rmSync(work, { recursive: true, force: true });
console.log(`\n${checks} runs checked, ${failures} problem(s) failing.`);
if (slow.length) console.log('Slow (> 3 s on one case):\n  ' + slow.join('\n  '));
process.exitCode = failures ? 1 : 0;
