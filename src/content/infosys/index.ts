import type { CodingLevel, CodingTest } from '../../lib/types';
import type { InfosysProblem, TestCase } from './types';
import { hashString, makeRng } from './rng';
import { EASY } from './easy';
import { MEDIUM } from './medium';
import { HARD } from './hard';
import { COMPLEX } from './complex';
import { levelById } from './levels';

export const PROBLEMS: Record<CodingLevel, InfosysProblem[]> = { easy: EASY, medium: MEDIUM, hard: HARD, complex: COMPLEX };
export const ALL_PROBLEMS = [...EASY, ...MEDIUM, ...HARD, ...COMPLEX];
export const PROBLEM_BY_ID: Record<string, InfosysProblem> = Object.fromEntries(ALL_PROBLEMS.map((p) => [p.id, p]));

export const PUBLIC_CASES = 2;
export const PRIVATE_CASES = 12;
/** Mix of hidden cases: edge cases, random cases and maximum-size cases. */
const PRIVATE_KINDS = ['edge', 'edge', 'edge', 'random', 'random', 'random', 'random', 'random', 'random', 'large', 'large', 'large'] as const;

/** Deterministically generate the 2 public + 12 private test cases of a problem for a seed. */
export function generateCases(p: InfosysProblem, seed: number): TestCase[] {
  const rng = makeRng(hashString(p.id) ^ Math.imul(seed, 2654435761));
  const out: TestCase[] = [];
  const seen = new Set<string>();
  const add = (input: string, pub: boolean) => {
    out.push({ input, output: p.solve(input).trim(), public: pub });
    seen.add(input);
  };
  for (let i = 0; i < PUBLIC_CASES; i++) {
    let input = p.gen(rng, 'public');
    for (let t = 0; t < 5 && seen.has(input); t++) input = p.gen(rng, 'public');
    add(input, true);
  }
  for (const kind of PRIVATE_KINDS) {
    let input = p.gen(rng, kind);
    // Edge generators pick from a small set: try a few times for variety, accept repeats otherwise.
    for (let t = 0; t < 6 && seen.has(input); t++) input = p.gen(rng, kind);
    add(input, false);
  }
  return out;
}

const newId = () => `ct${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Build a new 4-question test of one difficulty. */
export function generateTest(level: CodingLevel, count = 4): CodingTest {
  const pool = [...PROBLEMS[level]];
  const rng = makeRng((Date.now() ^ (Math.random() * 2 ** 31)) >>> 0);
  rng.shuffle(pool);
  const info = levelById(level)!;
  const n = Math.min(count, pool.length);
  return {
    id: newId(),
    level,
    title: `${info.title} — Infosys practice test`,
    createdAt: Date.now(),
    durationSec: info.minutes * 60,
    startedAt: null,
    finishedAt: null,
    status: 'ready',
    problems: pool.slice(0, n).map((p) => ({ problemId: p.id, seed: rng.int(1, 2 ** 30), lang: 'python', code: {} })),
  };
}

/** Compare program output with the expected output (ignores trailing spaces and blank lines). */
export function sameOutput(actual: string, expected: string) {
  const norm = (s: string) =>
    s
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((l) => l.replace(/\s+$/, ''))
      .join('\n')
      .replace(/\n+$/, '');
  return norm(actual) === norm(expected);
}

export { LEVELS, levelById } from './levels';
