/** Small deterministic PRNG (mulberry32) plus helpers for building test inputs. */
export interface Rng {
  next(): number;
  int(lo: number, hi: number): number;
  pick<T>(xs: readonly T[]): T;
  array(n: number, lo: number, hi: number): number[];
  str(n: number, alphabet?: string): string;
  shuffle<T>(xs: T[]): T[];
  chance(p: number): boolean;
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed: number): Rng {
  let a = seed >>> 0 || 0x9e3779b9;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  return {
    next,
    int,
    pick: (xs) => xs[Math.floor(next() * xs.length)],
    array: (n, lo, hi) => Array.from({ length: n }, () => int(lo, hi)),
    str: (n, alphabet = 'abcdefghijklmnopqrstuvwxyz') => Array.from({ length: n }, () => alphabet[Math.floor(next() * alphabet.length)]).join(''),
    shuffle: (xs) => {
      for (let i = xs.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [xs[i], xs[j]] = [xs[j], xs[i]];
      }
      return xs;
    },
    chance: (p) => next() < p,
  };
}

/** Input tokens (whitespace separated), with a cursor. */
export function reader(input: string) {
  const t = input.split(/\s+/).filter(Boolean);
  let i = 0;
  return {
    num: () => Number(t[i++]),
    big: () => BigInt(t[i++]),
    str: () => t[i++],
    nums: (n: number) => Array.from({ length: n }, () => Number(t[i++])),
    rest: () => t.slice(i),
  };
}

/** Infosys style: one value per line. */
export const lines = (...parts: (string | number | (string | number)[])[]) => parts.flatMap((p) => (Array.isArray(p) ? p.map(String) : [String(p)])).join('\n') + '\n';

export const MOD = 1_000_000_007n;
