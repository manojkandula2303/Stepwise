import type { InfosysProblem } from './types';
import { lines, reader } from './rng';

const javaHead = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));`;

export const EASY: InfosysProblem[] = [
  {
    id: 'inf-e-distinct-candies',
    level: 'easy',
    title: 'Distinct Candies',
    topics: ['hashing', 'io'],
    sample: true,
    statement: `Riya has **N** candies; the type of the i-th candy is **A[i]**. Her doctor allows her to eat exactly **⌊N / 2⌋** candies. Riya loves variety, so she wants to eat as many **different types** as possible.

Find the maximum number of distinct candy types she can eat.`,
    inputFormat: 'The first line contains an integer, N, the number of candies.\nEach line i of the N subsequent lines (where 0 ≤ i < N) contains an integer describing A[i].',
    outputFormat: 'Print a single integer: the maximum number of distinct types Riya can eat.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Hash set (distinct count)',
      recognize: '"Different / distinct / unique" values with a cap on how many you may pick.',
      approach: ['Put all types in a set to count distinct values D.', 'She may eat at most ⌊N/2⌋ candies, and at most D distinct types.', 'Answer = min(D, ⌊N/2⌋).'],
      time: 'O(N)',
      space: 'O(N)',
      pitfalls: 'N = 1 means she may eat 0 candies, so the answer is 0.',
    },
    walkthrough: 'For types [1, 1, 2, 2, 3, 3] there are 3 distinct types and she may eat 6 / 2 = 3 candies, so she eats one of each: answer 3.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 8);
        return lines(n, r.array(n, 1, 4));
      }
      if (k === 'edge') return r.pick([lines(1, 7), lines(4, [5, 5, 5, 5]), lines(6, [1, 2, 3, 4, 5, 6]), lines(2, [1000000000, 1])]);
      const n = k === 'large' ? 30000 : r.int(10, 300);
      return lines(n, r.array(n, 1, k === 'large' ? r.pick([50, 100000, 1000000000]) : r.int(2, 60)));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      return String(Math.min(new Set(rd.nums(n)).size, Math.floor(n / 2)));
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
types = data[1:1 + n]
print(min(len(set(types)), n // 2))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        HashSet<Integer> seen = new HashSet<>();
        for (int i = 0; i < n; i++) seen.add(Integer.parseInt(st.nextToken()));
        System.out.println(Math.min(seen.size(), n / 2));
    }
}
`,
    },
  },
  {
    id: 'inf-e-signal-towers',
    level: 'easy',
    title: 'Visible Signal Towers',
    topics: ['arrays'],
    statement: `A straight road has **N** signal towers with heights **A[0], A[1], …, A[N−1]**, from west to east. Standing at the far west end, you can see a tower only if it is **strictly taller** than every tower before it.

Count how many towers are visible.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the number of visible towers.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Running maximum',
      recognize: '"Taller / larger than all previous" means compare with the best value seen so far.',
      approach: ['Keep best = the tallest height seen so far (start below any height).', 'For each tower, if A[i] > best it is visible: count it and set best = A[i].'],
      time: 'O(N)',
      space: 'O(1)',
      pitfalls: 'Equal heights are not visible ("strictly taller"). The first tower is always visible.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        return lines(n, r.array(n, 1, 9));
      }
      if (k === 'edge') return r.pick([lines(1, 4), lines(5, [3, 3, 3, 3, 3]), lines(5, [1, 2, 3, 4, 5]), lines(5, [9, 8, 7, 6, 5])]);
      const n = k === 'large' ? 50000 : r.int(10, 400);
      const a = r.array(n, 1, k === 'large' ? 1000000000 : 1000);
      if (k === 'large' && r.chance(0.5)) a.sort((x, y) => x - y);
      return lines(n, a);
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      let best = 0;
      let c = 0;
      for (const x of rd.nums(n))
        if (x > best) {
          c++;
          best = x;
        }
      return String(c);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
best = 0
visible = 0
for i in range(1, n + 1):
    h = int(data[i])
    if h > best:
        visible += 1
        best = h
print(visible)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long best = 0;
        int visible = 0;
        for (int i = 0; i < n; i++) {
            long h = Long.parseLong(st.nextToken());
            if (h > best) { visible++; best = h; }
        }
        System.out.println(visible);
    }
}
`,
    },
  },
  {
    id: 'inf-e-bracket-depth',
    level: 'easy',
    title: 'Deepest Nesting',
    topics: ['strings', 'arrays'],
    statement: `A compiler logs a **balanced** sequence of brackets **S** consisting only of '(' and ')'. The *depth* at a position is the number of brackets that are open at that moment.

Find the maximum depth reached anywhere in S.`,
    inputFormat: 'The first line contains a string, S.',
    outputFormat: 'Print the maximum nesting depth.',
    constraints: ['2 ≤ |S| ≤ 2 × 10⁵', 'S is a balanced bracket sequence'],
    pattern: {
      name: 'Counter instead of a stack',
      recognize: 'Only one bracket type, and the sequence is guaranteed balanced: a counter is enough.',
      approach: ['depth = 0, best = 0.', "For '(' increase depth and update best; for ')' decrease depth."],
      time: 'O(|S|)',
      space: 'O(1)',
    },
    gen: (r, k) => {
      const make = (pairs: number) => {
        let s = '';
        let open = 0;
        let left = pairs;
        while (left > 0 || open > 0) {
          if (left > 0 && (open === 0 || r.chance(0.55))) {
            s += '(';
            open++;
            left--;
          } else {
            s += ')';
            open--;
          }
        }
        return s;
      };
      if (k === 'public') return lines(make(r.int(3, 5)));
      if (k === 'edge') return r.pick([lines('()'), lines('(((())))'), lines('()()()()')]);
      return lines(make(k === 'large' ? 100000 : r.int(10, 300)));
    },
    solve: (inp) => {
      const s = inp.trim();
      let d = 0;
      let best = 0;
      for (const ch of s) {
        d += ch === '(' ? 1 : -1;
        best = Math.max(best, d);
      }
      return String(best);
    },
    solutions: {
      python: `s = input().strip()
depth = best = 0
for ch in s:
    if ch == '(':
        depth += 1
        best = max(best, depth)
    else:
        depth -= 1
print(best)
`,
      java: `${javaHead}
        String s = st.nextToken();
        int depth = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') { depth++; best = Math.max(best, depth); }
            else depth--;
        }
        System.out.println(best);
    }
}
`,
    },
  },
  {
    id: 'inf-e-digit-rounds',
    level: 'easy',
    title: 'Digit Sum Rounds',
    topics: ['math', 'strings'],
    statement: `A security token is a very long positive number **N** (it can have up to 10⁵ digits). In one *round*, the token is replaced by the sum of its digits. Rounds continue while the token has more than one digit.

How many rounds are performed?`,
    inputFormat: 'The first line contains the number N (without leading zeros).',
    outputFormat: 'Print the number of rounds.',
    constraints: ['1 ≤ number of digits of N ≤ 10⁵'],
    pattern: {
      name: 'Simulation on a string',
      recognize: 'A number too large for any integer type: process it as a string of digits.',
      approach: ['If N already has one digit, the answer is 0.', 'First round: sum the characters of the string (at most 9 × 10⁵).', 'Then keep summing digits of the (small) result until one digit remains, counting rounds.'],
      time: 'O(number of digits)',
      space: 'O(1) besides the input',
      pitfalls: 'Do not convert the 10⁵-digit string to an integer in Java/C++ (it overflows).',
    },
    gen: (r, k) => {
      const num = (len: number) => String(r.int(1, 9)) + r.str(len - 1, '0123456789');
      if (k === 'public') return lines(num(r.int(3, 6)));
      if (k === 'edge') return r.pick([lines('7'), lines('10'), lines('99999999999'), lines('1' + '0'.repeat(40))]);
      return lines(num(k === 'large' ? 100000 : r.int(5, 200)));
    },
    solve: (inp) => {
      let s = inp.trim();
      let rounds = 0;
      while (s.length > 1) {
        let sum = 0;
        for (const ch of s) sum += ch.charCodeAt(0) - 48;
        s = String(sum);
        rounds++;
      }
      return String(rounds);
    },
    solutions: {
      python: `s = input().strip()
rounds = 0
while len(s) > 1:
    s = str(sum(int(c) for c in s))
    rounds += 1
print(rounds)
`,
      java: `${javaHead}
        String s = st.nextToken();
        int rounds = 0;
        while (s.length() > 1) {
            long sum = 0;
            for (int i = 0; i < s.length(); i++) sum += s.charAt(i) - '0';
            s = Long.toString(sum);
            rounds++;
        }
        System.out.println(rounds);
    }
}
`,
    },
  },
  {
    id: 'inf-e-pair-sum',
    level: 'easy',
    title: 'Budget Pairs',
    topics: ['hashing'],
    sample: true,
    statement: `A shop lists **N** gadgets with prices **A[0..N−1]**. A customer wants to buy **exactly two different gadgets** whose prices add up to exactly **K**.

Count the number of pairs of indices (i, j) with i < j and A[i] + A[j] = K.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].\nThe last line contains an integer, K.',
    outputFormat: 'Print the number of valid pairs.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹', '2 ≤ K ≤ 2 × 10⁹'],
    pattern: {
      name: 'Complement counting with a hash map',
      recognize: '"Pairs that sum to K": for each element, how many earlier elements equal K − A[i]?',
      approach: ['Keep a frequency map of values seen so far.', 'For each A[i], add freq[K − A[i]] to the answer, then record A[i].', 'Processing left to right counts each pair exactly once (i < j).'],
      time: 'O(N)',
      space: 'O(N)',
      pitfalls: 'The count can exceed 2³¹ − 1 when many equal values exist: use a 64-bit counter.',
    },
    walkthrough: 'Prices [2, 4, 3, 3] with K = 6: the pairs (2, 4) and (3, 3) both sum to 6, so the answer is 2. Scanning left to right: at 4 we have seen one 2 → +1; at the second 3 we have seen one 3 → +1.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        const a = r.array(n, 1, 6);
        return lines(n, a, r.int(4, 9));
      }
      if (k === 'edge') return r.pick([lines(1, 5, 10), lines(4, [3, 3, 3, 3], 6), lines(3, [1, 2, 3], 100)]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      const hi = k === 'large' ? r.pick([10, 1000, 1000000000]) : r.int(5, 50);
      const a = r.array(n, 1, hi);
      return lines(n, a, a[r.int(0, n - 1)] + a[r.int(0, n - 1)]);
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const K = rd.num();
      const freq = new Map<number, number>();
      let c = 0;
      for (const x of a) {
        c += freq.get(K - x) || 0;
        freq.set(x, (freq.get(x) || 0) + 1);
      }
      return String(c);
    },
    solutions: {
      python: `import sys
from collections import defaultdict

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
k = int(data[1 + n])
freq = defaultdict(int)
pairs = 0
for x in a:
    pairs += freq[k - x]
    freq[x] += 1
print(pairs)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
        long k = Long.parseLong(st.nextToken());
        HashMap<Long, Integer> freq = new HashMap<>();
        long pairs = 0;
        for (long x : a) {
            pairs += freq.getOrDefault(k - x, 0);
            freq.merge(x, 1, Integer::sum);
        }
        System.out.println(pairs);
    }
}
`,
    },
  },
  {
    id: 'inf-e-equalize',
    level: 'easy',
    title: 'Equal Salaries',
    topics: ['sorting', 'math'],
    statement: `A team of **N** interns earns salaries **A[i]**. HR can raise or lower one intern's salary by **1 rupee** per operation. HR wants all salaries to become **equal** using the minimum number of operations.

Find that minimum number of operations.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the minimum number of operations.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Median minimises total distance',
      recognize: '"Make all equal with ±1 steps" = minimise Σ|A[i] − x|, which is smallest at the median.',
      approach: ['Sort A.', 'Take x = A[N/2] (any median works).', 'Answer = Σ |A[i] − x| (use 64-bit).'],
      time: 'O(N log N)',
      space: 'O(1) besides sorting',
      pitfalls: 'Using the mean instead of the median gives a wrong answer.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(3, 6);
        return lines(n, r.array(n, 1, 20));
      }
      if (k === 'edge') return r.pick([lines(1, 42), lines(3, [5, 5, 5]), lines(2, [1, 1000000000])]);
      const n = k === 'large' ? 30000 : r.int(5, 300);
      return lines(n, r.array(n, 1, k === 'large' ? 1000000000 : 1000));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n).sort((x, y) => x - y);
      const m = a[Math.floor(n / 2)];
      let s = 0;
      for (const x of a) s += Math.abs(x - m);
      return String(s);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
a = sorted(map(int, data[1:1 + n]))
m = a[n // 2]
print(sum(abs(x - m) for x in a))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
        Arrays.sort(a);
        long m = a[n / 2], ops = 0;
        for (long x : a) ops += Math.abs(x - m);
        System.out.println(ops);
    }
}
`,
    },
  },
  {
    id: 'inf-e-longest-run',
    level: 'easy',
    title: 'Longest Streak',
    topics: ['arrays'],
    statement: `A fitness app records the number of steps **A[i]** walked on each of **N** days. A *streak* is a block of **consecutive days with exactly the same step count**.

Find the length of the longest streak.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the length of the longest streak.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Run length in one pass',
      recognize: '"Consecutive equal values": compare each element with the previous one.',
      approach: ['cur = 1, best = 1.', 'If A[i] == A[i−1] then cur += 1, else cur = 1. Update best each step.'],
      time: 'O(N)',
      space: 'O(1)',
    },
    gen: (r, k) => {
      const runs = (n: number, hi: number) => {
        const a: number[] = [];
        while (a.length < n) {
          const v = r.int(0, hi);
          const len = r.int(1, 5);
          for (let i = 0; i < len && a.length < n; i++) a.push(v);
        }
        return a;
      };
      if (k === 'public') {
        const n = r.int(6, 9);
        return lines(n, runs(n, 5));
      }
      if (k === 'edge') return r.pick([lines(1, 0), lines(4, [7, 7, 7, 7]), lines(4, [1, 2, 3, 4])]);
      const n = k === 'large' ? 50000 : r.int(10, 400);
      return lines(n, runs(n, k === 'large' ? 3 : 10));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      let cur = 1;
      let best = 1;
      for (let i = 1; i < n; i++) {
        cur = a[i] === a[i - 1] ? cur + 1 : 1;
        best = Math.max(best, cur);
      }
      return String(best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
a = data[1:1 + n]
cur = best = 1
for i in range(1, n):
    cur = cur + 1 if a[i] == a[i - 1] else 1
    best = max(best, cur)
print(best)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long prev = Long.parseLong(st.nextToken());
        int cur = 1, best = 1;
        for (int i = 1; i < n; i++) {
            long x = Long.parseLong(st.nextToken());
            cur = (x == prev) ? cur + 1 : 1;
            best = Math.max(best, cur);
            prev = x;
        }
        System.out.println(best);
    }
}
`,
    },
  },
  {
    id: 'inf-e-rle-length',
    level: 'easy',
    title: 'Compressed Log Size',
    topics: ['strings'],
    statement: `A server compresses a log string **S** (lowercase letters) using run-length encoding: every maximal block of the same character **c** repeated **k** times is written as **c** followed by **k**, except that the count is **omitted when k = 1**.

For example, "aaabcc" becomes "a3bc2".

Print the length of the compressed string.`,
    inputFormat: 'The first line contains a string, S.',
    outputFormat: 'Print the length of the compressed string.',
    constraints: ['1 ≤ |S| ≤ 2 × 10⁵', 'S contains only lowercase English letters'],
    pattern: {
      name: 'Run-length encoding',
      recognize: 'Blocks of repeated characters: scan runs and add their encoded size.',
      approach: ['Walk through S grouping equal neighbours into runs.', 'Each run contributes 1 (the character) plus the number of digits of k when k > 1.'],
      time: 'O(|S|)',
      space: 'O(1)',
      pitfalls: 'A run of 12 contributes 3 characters ("a12"), not 2.',
    },
    gen: (r, k) => {
      const make = (len: number, maxRun: number) => {
        let s = '';
        while (s.length < len) s += r.str(1, 'abcd').repeat(r.int(1, maxRun));
        return s.slice(0, len);
      };
      if (k === 'public') return lines(make(r.int(6, 10), 4));
      if (k === 'edge') return r.pick([lines('a'), lines('abcdef'), lines('z'.repeat(150))]);
      return lines(make(k === 'large' ? 200000 : r.int(10, 300), k === 'large' ? 1500 : 15));
    },
    solve: (inp) => {
      const s = inp.trim();
      let total = 0;
      let i = 0;
      while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        const run = j - i;
        total += 1 + (run > 1 ? String(run).length : 0);
        i = j;
      }
      return String(total);
    },
    solutions: {
      python: `s = input().strip()
total = 0
i = 0
while i < len(s):
    j = i
    while j < len(s) and s[j] == s[i]:
        j += 1
    run = j - i
    total += 1 + (len(str(run)) if run > 1 else 0)
    i = j
print(total)
`,
      java: `${javaHead}
        String s = st.nextToken();
        long total = 0;
        int i = 0, n = s.length();
        while (i < n) {
            int j = i;
            while (j < n && s.charAt(j) == s.charAt(i)) j++;
            int run = j - i;
            total += 1 + (run > 1 ? Integer.toString(run).length() : 0);
            i = j;
        }
        System.out.println(total);
    }
}
`,
    },
  },
  {
    id: 'inf-e-second-max',
    level: 'easy',
    title: 'Runner-up Score',
    topics: ['arrays'],
    statement: `In a quiz, **N** participants scored **A[0..N−1]**. The *runner-up score* is the **largest score that is strictly less than the top score**.

Print the runner-up score, or **−1** if every participant has the same score.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the runner-up score, or −1.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Track the two largest distinct values',
      recognize: '"Second largest" without sorting: keep the best two as you scan.',
      approach: ['first = second = −1.', 'If x > first: second = first, first = x. Else if first > x > second: second = x.'],
      time: 'O(N)',
      space: 'O(1)',
      pitfalls: 'Duplicates of the top score must not become the runner-up.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(4, 7);
        return lines(n, r.array(n, 0, 10));
      }
      if (k === 'edge') return r.pick([lines(1, 5), lines(3, [9, 9, 9]), lines(4, [7, 7, 3, 7]), lines(2, [0, 1000000000])]);
      const n = k === 'large' ? 50000 : r.int(5, 300);
      return lines(n, r.array(n, 0, k === 'large' ? 1000000000 : 50));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      let f = -1;
      let s = -1;
      for (const x of rd.nums(n)) {
        if (x > f) {
          s = f;
          f = x;
        } else if (x < f && x > s) s = x;
      }
      return String(s);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
first = second = -1
for i in range(1, n + 1):
    x = int(data[i])
    if x > first:
        second, first = first, x
    elif first > x > second:
        second = x
print(second)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long first = -1, second = -1;
        for (int i = 0; i < n; i++) {
            long x = Long.parseLong(st.nextToken());
            if (x > first) { second = first; first = x; }
            else if (x < first && x > second) second = x;
        }
        System.out.println(second);
    }
}
`,
    },
  },
  {
    id: 'inf-e-best-trade',
    level: 'easy',
    title: 'Best Single Trade',
    topics: ['arrays', 'complexity'],
    sample: true,
    statement: `You know the price **A[i]** of a share on each of the next **N** days. You may **buy once and sell once**, and you must buy before you sell (on a later day).

Find the maximum profit you can make. If no profit is possible, print **0**.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the maximum profit.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'Running minimum',
      recognize: 'Best pair (i < j) maximising A[j] − A[i]: for each sell day, the best buy day is the cheapest day before it.',
      approach: ['low = A[0], best = 0.', 'For each later day: best = max(best, A[i] − low); low = min(low, A[i]).'],
      time: 'O(N)',
      space: 'O(1)',
      pitfalls: 'Checking every pair is O(N²) and times out for N = 10⁵.',
    },
    walkthrough: 'Prices [7, 1, 5, 3, 6, 4]: buy at 1 (day 2), sell at 6 (day 5): profit 5.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        return lines(n, r.array(n, 1, 10));
      }
      if (k === 'edge') return r.pick([lines(1, 10), lines(5, [9, 7, 5, 3, 1]), lines(4, [3, 3, 3, 3])]);
      const n = k === 'large' ? 50000 : r.int(10, 400);
      return lines(n, r.array(n, 1, k === 'large' ? 1000000000 : 1000));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      let low = a[0];
      let best = 0;
      for (let i = 1; i < n; i++) {
        best = Math.max(best, a[i] - low);
        low = Math.min(low, a[i]);
      }
      return String(best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
prices = list(map(int, data[1:1 + n]))
low, best = prices[0], 0
for p in prices[1:]:
    best = max(best, p - low)
    low = min(low, p)
print(best)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long low = Long.parseLong(st.nextToken()), best = 0;
        for (int i = 1; i < n; i++) {
            long p = Long.parseLong(st.nextToken());
            best = Math.max(best, p - low);
            low = Math.min(low, p);
        }
        System.out.println(best);
    }
}
`,
    },
  },
];
