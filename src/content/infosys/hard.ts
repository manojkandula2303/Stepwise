import type { InfosysProblem } from './types';
import { lines, reader } from './rng';

const javaHead = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));`;

const MODN = 1_000_000_007;
const modAdd = (a: number, b: number) => (a + b) % MODN;

function grid(r: { int: (a: number, b: number) => number; chance: (p: number) => boolean }, R: number, C: number, wall: number, openEnds: boolean) {
  const g: string[] = [];
  for (let i = 0; i < R; i++) {
    let row = '';
    for (let j = 0; j < C; j++) row += r.chance(wall) ? '#' : '.';
    g.push(row);
  }
  if (openEnds) {
    g[0] = '.' + g[0].slice(1);
    g[R - 1] = g[R - 1].slice(0, C - 1) + '.';
  }
  return g;
}

export const HARD: InfosysProblem[] = [
  {
    id: 'inf-h-broken-stairs',
    level: 'hard',
    title: 'Broken Staircase',
    topics: ['dp-basic', 'modular'],
    sample: true,
    statement: `A temple staircase has steps numbered **1 to N**; you start on the ground (step 0). With each move you climb **1 or 2 steps**. Some steps are **broken** and you must never land on them.

Count the number of different ways to reach step N exactly. Since the answer can be very large, print it **modulo 1,000,000,007**.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M, the number of broken steps.\nEach of the next M lines contains the number of a broken step.',
    outputFormat: 'Print the number of ways modulo 1,000,000,007.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ N', '1 ≤ broken step ≤ N (all distinct)'],
    pattern: {
      name: '1-D DP (Fibonacci-style counting)',
      recognize: '"Number of ways to reach position N" with a few allowed moves: ways[i] depends on ways[i−1], ways[i−2].',
      approach: ['ways[0] = 1.', 'For i = 1..N: ways[i] = 0 if step i is broken, else (ways[i−1] + ways[i−2]) mod M.', 'Print ways[N].'],
      time: 'O(N)',
      space: 'O(N) (O(1) with two variables)',
      pitfalls: 'Take the modulo at every step. If step N itself is broken the answer is 0.',
    },
    walkthrough: 'N = 4 with step 2 broken: ways = [1, 1, 0, 1, 1]. Step 3 can only be reached from step 1 (by a 2-step), and step 4 only from step 3. Answer 1.',
    gen: (r, k) => {
      const make = (n: number, m: number) => {
        const set = new Set<number>();
        while (set.size < m) set.add(r.int(1, n));
        return lines(n, m, [...set]);
      };
      if (k === 'public') return make(r.int(4, 8), r.int(0, 2));
      if (k === 'edge') return r.pick([lines(1, 0), lines(1, 1, 1), lines(5, 2, [2, 3]), lines(2, 0)]);
      const n = k === 'large' ? 100000 : r.int(10, 400);
      return make(n, r.int(0, Math.floor(n / r.pick([5, 20, 100]))));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const m = rd.num();
      const broken = new Set(rd.nums(m));
      let a = 1; // ways[i-2]
      let b = broken.has(1) ? 0 : 1; // ways[i-1]
      if (n === 1) return String(b);
      for (let i = 2; i <= n; i++) {
        const c = broken.has(i) ? 0 : modAdd(a, b);
        a = b;
        b = c;
      }
      return String(b);
    },
    solutions: {
      python: `import sys

MOD = 10**9 + 7
data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
broken = set(map(int, data[2:2 + m]))
ways = [0] * (n + 1)
ways[0] = 1
for i in range(1, n + 1):
    if i in broken:
        continue
    ways[i] = (ways[i - 1] + (ways[i - 2] if i >= 2 else 0)) % MOD
print(ways[n])
`,
      java: `${javaHead}
        final long MOD = 1_000_000_007L;
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        boolean[] broken = new boolean[n + 1];
        for (int i = 0; i < m; i++) broken[Integer.parseInt(st.nextToken())] = true;
        long[] ways = new long[n + 1];
        ways[0] = 1;
        for (int i = 1; i <= n; i++) {
            if (broken[i]) continue;
            ways[i] = (ways[i - 1] + (i >= 2 ? ways[i - 2] : 0)) % MOD;
        }
        System.out.println(ways[n]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-lis',
    level: 'hard',
    title: 'Rising Sales Trend',
    topics: ['lis', 'dp-basic'],
    sample: true,
    statement: `A store logs its daily sales **A[0..N−1]**. An analyst wants the longest *rising trend*: a subsequence of days (not necessarily consecutive, in order) whose sales are **strictly increasing**.

Print the length of the longest strictly increasing subsequence.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the length of the longest strictly increasing subsequence.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁹'],
    pattern: {
      name: 'LIS with binary search (patience sorting)',
      recognize: '"Longest increasing subsequence" with N up to 10⁵: the O(N²) DP is too slow.',
      approach: [
        'Keep tails[k] = the smallest possible last value of an increasing subsequence of length k + 1.',
        'For each x, find the first tail ≥ x (lower bound) and replace it with x; if none, append x.',
        'The length of tails is the answer.',
      ],
      time: 'O(N log N)',
      space: 'O(N)',
      pitfalls: 'For strictly increasing use lower_bound (bisect_left); bisect_right would allow equal values.',
    },
    walkthrough: 'A = [10, 9, 2, 5, 3, 7, 101, 18]: tails evolve 10 → 9 → 2 → 2,5 → 2,3 → 2,3,7 → 2,3,7,101 → 2,3,7,18. Answer 4.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(6, 8);
        return lines(n, r.array(n, 1, 20));
      }
      if (k === 'edge') return r.pick([lines(1, 5), lines(4, [7, 7, 7, 7]), lines(5, [5, 4, 3, 2, 1]), lines(5, [1, 2, 3, 4, 5])]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      return lines(n, r.array(n, 1, k === 'large' ? r.pick([100, 1000000000]) : 1000));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const tails: number[] = [];
      for (const x of rd.nums(n)) {
        let lo = 0;
        let hi = tails.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (tails[mid] < x) lo = mid + 1;
          else hi = mid;
        }
        tails[lo] = x;
      }
      return String(tails.length);
    },
    solutions: {
      python: `import sys
from bisect import bisect_left

data = sys.stdin.read().split()
n = int(data[0])
tails = []
for x in map(int, data[1:1 + n]):
    i = bisect_left(tails, x)
    if i == len(tails):
        tails.append(x)
    else:
        tails[i] = x
print(len(tails))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] tails = new long[n];
        int len = 0;
        for (int i = 0; i < n; i++) {
            long x = Long.parseLong(st.nextToken());
            int lo = 0, hi = len;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1; else hi = mid;
            }
            tails[lo] = x;
            if (lo == len) len++;
        }
        System.out.println(len);
    }
}
`,
    },
  },
  {
    id: 'inf-h-knapsack',
    level: 'hard',
    title: 'Relief Truck Loading',
    topics: ['knapsack'],
    statement: `A relief truck can carry at most **W** kg. There are **N** supply boxes; box i weighs **w[i]** kg and has an importance value **v[i]**. Each box can be loaded **at most once** and cannot be split.

Find the maximum total importance that fits in the truck.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, W.\nEach of the next N lines contains two space-separated integers w[i] and v[i].',
    outputFormat: 'Print the maximum total importance.',
    constraints: ['1 ≤ N ≤ 100', '1 ≤ W ≤ 10⁴', '1 ≤ w[i] ≤ 10⁴', '1 ≤ v[i] ≤ 10⁴'],
    pattern: {
      name: '0/1 knapsack DP',
      recognize: 'Choose a subset of items under a capacity to maximise value; each item used at most once.',
      approach: ['best[c] = maximum value with capacity c (start all 0).', 'For each item, for c from W down to w[i]: best[c] = max(best[c], best[c − w[i]] + v[i]).', 'Iterating capacity downwards ensures each item is used once.'],
      time: 'O(N · W)',
      space: 'O(W)',
      pitfalls: 'Iterating capacity upwards turns it into the unbounded knapsack (items reused).',
    },
    gen: (r, k) => {
      const make = (n: number, W: number, maxW: number, maxV: number) => {
        const rows = Array.from({ length: n }, () => `${r.int(1, maxW)} ${r.int(1, maxV)}`);
        return lines(n, W, rows);
      };
      if (k === 'public') return make(r.int(3, 5), r.int(5, 12), 8, 20);
      if (k === 'edge') return r.pick([lines(1, 5, '6 100'), lines(1, 5, '5 100'), lines(3, 10, ['10 5', '5 3', '5 3'])]);
      if (k === 'large') return make(100, 10000, r.pick([200, 2000, 10000]), 10000);
      return make(r.int(5, 40), r.int(20, 1000), r.int(10, 300), 1000);
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const W = rd.num();
      const best = new Array(W + 1).fill(0);
      for (let i = 0; i < n; i++) {
        const w = rd.num();
        const v = rd.num();
        for (let c = W; c >= w; c--) if (best[c - w] + v > best[c]) best[c] = best[c - w] + v;
      }
      return String(best[W]);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n, cap = int(data[0]), int(data[1])
best = [0] * (cap + 1)
for i in range(n):
    w, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
    for c in range(cap, w - 1, -1):
        if best[c - w] + v > best[c]:
            best[c] = best[c - w] + v
print(best[cap])
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int cap = Integer.parseInt(st.nextToken());
        long[] best = new long[cap + 1];
        for (int i = 0; i < n; i++) {
            int w = Integer.parseInt(st.nextToken());
            long v = Long.parseLong(st.nextToken());
            for (int c = cap; c >= w; c--) best[c] = Math.max(best[c], best[c - w] + v);
        }
        System.out.println(best[cap]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-grid-bfs',
    level: 'hard',
    title: 'Warehouse Robot Route',
    topics: ['bfs'],
    sample: true,
    statement: `A warehouse floor is an **R × C** grid. Each cell is either free ('.') or blocked by a shelf ('#'). A robot starts at the **top-left** cell and must reach the **bottom-right** cell, moving one cell **up, down, left or right** per step and never entering a blocked cell.

Print the minimum number of steps, or **−1** if the target cannot be reached (including when the start or target is blocked).`,
    inputFormat: 'The first line contains two space-separated integers R and C.\nEach of the next R lines contains a string of C characters describing a row of the grid.',
    outputFormat: 'Print the minimum number of steps, or −1.',
    constraints: ['1 ≤ R, C ≤ 500', "Each character is '.' or '#'"],
    pattern: {
      name: 'Breadth-first search on a grid',
      recognize: '"Minimum number of moves" on an unweighted grid: BFS explores cells in order of distance.',
      approach: ['If the start or target is blocked, print −1.', 'BFS from (0, 0) with a queue and a distance grid (−1 = unvisited).', 'For each cell, try the 4 neighbours inside the grid that are free and unvisited.', 'Print the distance of (R−1, C−1) (−1 if never reached).'],
      time: 'O(R · C)',
      space: 'O(R · C)',
      pitfalls: 'DFS does not give the shortest path. A 1 × 1 free grid needs 0 steps.',
    },
    walkthrough: 'Grid\n...\n.#.\n...\nThe robot goes around the shelf in 4 steps (right, right, down, down).',
    gen: (r, k) => {
      if (k === 'public') {
        const R = r.int(3, 5);
        const C = r.int(3, 5);
        return lines(`${R} ${C}`, grid(r, R, C, 0.25, true));
      }
      if (k === 'edge') return r.pick([lines('1 1', '.'), lines('1 1', '#'), lines('2 2', ['.#', '#.']), lines('1 5', '.....'), lines('2 2', ['#.', '..'])]);
      const R = k === 'large' ? 500 : r.int(5, 40);
      const C = k === 'large' ? 500 : r.int(5, 40);
      return lines(`${R} ${C}`, grid(r, R, C, r.pick([0.1, 0.25, 0.32]), r.chance(0.9)));
    },
    solve: (inp) => {
      const t = inp.split(/\s+/).filter(Boolean);
      const R = Number(t[0]);
      const C = Number(t[1]);
      const g = t.slice(2, 2 + R);
      if (g[0][0] === '#' || g[R - 1][C - 1] === '#') return '-1';
      const dist = new Int32Array(R * C).fill(-1);
      const q = new Int32Array(R * C);
      let head = 0;
      let tail = 0;
      dist[0] = 0;
      q[tail++] = 0;
      while (head < tail) {
        const cur = q[head++];
        const i = Math.floor(cur / C);
        const j = cur % C;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ni = i + di;
          const nj = j + dj;
          if (ni < 0 || nj < 0 || ni >= R || nj >= C || g[ni][nj] === '#') continue;
          const id = ni * C + nj;
          if (dist[id] !== -1) continue;
          dist[id] = dist[cur] + 1;
          q[tail++] = id;
        }
      }
      return String(dist[R * C - 1]);
    },
    solutions: {
      python: `import sys
from collections import deque

data = sys.stdin.read().split()
r, c = int(data[0]), int(data[1])
g = data[2:2 + r]
if g[0][0] == '#' or g[r - 1][c - 1] == '#':
    print(-1)
else:
    dist = [[-1] * c for _ in range(r)]
    dist[0][0] = 0
    q = deque([(0, 0)])
    while q:
        i, j = q.popleft()
        for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
            if 0 <= ni < r and 0 <= nj < c and g[ni][nj] == '.' and dist[ni][nj] == -1:
                dist[ni][nj] = dist[i][j] + 1
                q.append((ni, nj))
    print(dist[r - 1][c - 1])
`,
      java: `${javaHead}
        int r = Integer.parseInt(st.nextToken());
        int c = Integer.parseInt(st.nextToken());
        char[][] g = new char[r][];
        for (int i = 0; i < r; i++) g[i] = st.nextToken().toCharArray();
        if (g[0][0] == '#' || g[r - 1][c - 1] == '#') { System.out.println(-1); return; }
        int[] dist = new int[r * c];
        Arrays.fill(dist, -1);
        int[] q = new int[r * c];
        int head = 0, tail = 0;
        dist[0] = 0;
        q[tail++] = 0;
        int[] di = {1, -1, 0, 0}, dj = {0, 0, 1, -1};
        while (head < tail) {
            int cur = q[head++], i = cur / c, j = cur % c;
            for (int d = 0; d < 4; d++) {
                int ni = i + di[d], nj = j + dj[d];
                if (ni < 0 || nj < 0 || ni >= r || nj >= c || g[ni][nj] == '#') continue;
                int id = ni * c + nj;
                if (dist[id] != -1) continue;
                dist[id] = dist[cur] + 1;
                q[tail++] = id;
            }
        }
        System.out.println(dist[r * c - 1]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-friend-groups',
    level: 'hard',
    title: 'Friendship Circles',
    topics: ['dsu'],
    statement: `A campus app has **N** students numbered 1 to N and records **M** friendships; each friendship connects two students. Friendship is *transitive* for this purpose: friends of friends belong to the **same circle**.

Print the number of friendship circles (a student with no friends forms a circle alone).`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M.\nEach of the next M lines contains two space-separated integers u and v (a friendship).',
    outputFormat: 'Print the number of circles.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ 10⁵', '1 ≤ u, v ≤ N'],
    pattern: {
      name: 'Union–find (disjoint set union)',
      recognize: 'Groups formed by merging pairs; count connected components.',
      approach: ['Start with N separate sets (circles = N).', 'For each friendship, find both roots; if they differ, union them and decrease circles by 1.', 'Use path compression (and union by size) so each operation is almost O(1).'],
      time: 'O((N + M) · α(N))',
      space: 'O(N)',
      pitfalls: 'Self-friendships (u = v) and repeated pairs must not reduce the count. In Python, a recursive find can hit the recursion limit: write it iteratively.',
    },
    gen: (r, k) => {
      const make = (n: number, m: number) => lines(n, m, Array.from({ length: m }, () => `${r.int(1, n)} ${r.int(1, n)}`));
      if (k === 'public') return make(r.int(5, 7), r.int(2, 4));
      if (k === 'edge') return r.pick([lines(1, 0), lines(3, 0), lines(2, 2, ['1 2', '2 1']), lines(4, 1, '3 3')]);
      if (k === 'large') return make(50000, r.pick([10000, 30000, 50000]));
      const n = r.int(10, 400);
      return make(n, r.int(0, n));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const m = rd.num();
      const p = Array.from({ length: n + 1 }, (_, i) => i);
      const find = (x: number) => {
        while (p[x] !== x) {
          p[x] = p[p[x]];
          x = p[x];
        }
        return x;
      };
      let c = n;
      for (let i = 0; i < m; i++) {
        const a = find(rd.num());
        const b = find(rd.num());
        if (a !== b) {
          p[a] = b;
          c--;
        }
      }
      return String(c);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
parent = list(range(n + 1))
size = [1] * (n + 1)

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

circles = n
for i in range(m):
    a, b = find(int(data[2 + 2 * i])), find(int(data[3 + 2 * i]))
    if a != b:
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        circles -= 1
print(circles)
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] parent, size;

    static int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        parent = new int[n + 1];
        size = new int[n + 1];
        for (int i = 0; i <= n; i++) { parent[i] = i; size[i] = 1; }
        int circles = n;
        for (int i = 0; i < m; i++) {
            int a = find(Integer.parseInt(st.nextToken())), b = find(Integer.parseInt(st.nextToken()));
            if (a != b) {
                if (size[a] < size[b]) { int t = a; a = b; b = t; }
                parent[b] = a;
                size[a] += size[b];
                circles--;
            }
        }
        System.out.println(circles);
    }
}
`,
    },
  },
  {
    id: 'inf-h-edit-distance',
    level: 'hard',
    title: 'Autocorrect Cost',
    topics: ['dp-basic'],
    statement: `An autocorrect engine converts a typed word **A** into a dictionary word **B**. In one operation it can **insert** a character, **delete** a character or **replace** a character.

Print the minimum number of operations needed to turn A into B.`,
    inputFormat: 'The first line contains a string, A.\nThe second line contains a string, B.',
    outputFormat: 'Print the minimum number of operations.',
    constraints: ['1 ≤ |A|, |B| ≤ 1000', 'Both strings contain only lowercase English letters'],
    pattern: {
      name: '2-D DP (edit distance)',
      recognize: 'Transform one string into another with insert / delete / replace at minimum cost.',
      approach: [
        'dp[i][j] = cost to turn the first i characters of A into the first j characters of B.',
        'dp[i][0] = i, dp[0][j] = j.',
        'If A[i−1] == B[j−1]: dp[i][j] = dp[i−1][j−1]; else 1 + min(dp[i−1][j], dp[i][j−1], dp[i−1][j−1]).',
      ],
      time: 'O(|A| · |B|)',
      space: 'O(|B|) with two rows',
    },
    gen: (r, k) => {
      if (k === 'public') return lines(r.str(r.int(3, 6), 'abcd'), r.str(r.int(3, 6), 'abcd'));
      if (k === 'edge') return r.pick([lines('a', 'a'), lines('a', 'b'), lines('abc', 'abcdef'), lines('kitten', 'sitting')]);
      const n = k === 'large' ? 1000 : r.int(10, 120);
      const a = r.str(n, 'abcde');
      const b = r.chance(0.5) ? a.split('').map((c) => (r.chance(0.2) ? r.str(1, 'abcde') : c)).join('') : r.str(k === 'large' ? 1000 : r.int(10, 120), 'abcde');
      return lines(a, b);
    },
    solve: (inp) => {
      const [a, b] = inp.split(/\s+/).filter(Boolean);
      let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
      for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        for (let j = 1; j <= b.length; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
        prev = cur;
      }
      return String(prev[b.length]);
    },
    solutions: {
      python: `a = input().strip()
b = input().strip()
prev = list(range(len(b) + 1))
for i in range(1, len(a) + 1):
    cur = [i] + [0] * len(b)
    ai = a[i - 1]
    for j in range(1, len(b) + 1):
        if ai == b[j - 1]:
            cur[j] = prev[j - 1]
        else:
            cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
    prev = cur
print(prev[len(b)])
`,
      java: `${javaHead}
        String a = st.nextToken(), b = st.nextToken();
        int[] prev = new int[b.length() + 1], cur = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) prev[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            cur[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) cur[j] = prev[j - 1];
                else cur[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
            }
            int[] t = prev; prev = cur; cur = t;
        }
        System.out.println(prev[b.length()]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-subset-count',
    level: 'hard',
    title: 'Exact Budget Bundles',
    topics: ['knapsack', 'modular'],
    statement: `An online store offers **N** add-ons with prices **A[0..N−1]**. A customer wants to buy a **bundle** (any subset of add-ons, each at most once) whose total price is **exactly K**.

Count the number of such subsets, modulo **1,000,000,007**. Add-ons with the same price are still different add-ons.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].\nThe last line contains an integer, K.',
    outputFormat: 'Print the number of subsets with total K, modulo 1,000,000,007.',
    constraints: ['1 ≤ N ≤ 100', '1 ≤ A[i] ≤ 1000', '1 ≤ K ≤ 10⁴'],
    pattern: {
      name: 'Subset-sum counting DP',
      recognize: '"Number of subsets with sum K" with small K: count, not enumerate (2ᴺ subsets).',
      approach: ['ways[0] = 1 (the empty subset), ways[s] = 0 otherwise.', 'For each price a, for s from K down to a: ways[s] = (ways[s] + ways[s − a]) mod M.', 'Print ways[K].'],
      time: 'O(N · K)',
      space: 'O(K)',
      pitfalls: 'Iterate s downwards so each add-on is used at most once.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(4, 6);
        return lines(n, r.array(n, 1, 6), r.int(4, 10));
      }
      if (k === 'edge') return r.pick([lines(1, 5, 5), lines(1, 5, 4), lines(4, [1, 1, 1, 1], 2), lines(3, [1000, 1000, 1000], 10000)]);
      if (k === 'large') return lines(100, r.array(100, 1, r.pick([5, 100, 1000])), r.int(5000, 10000));
      const n = r.int(5, 40);
      return lines(n, r.array(n, 1, 50), r.int(10, 400));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const K = rd.num();
      const ways = new Array(K + 1).fill(0);
      ways[0] = 1;
      for (const x of a) for (let s = K; s >= x; s--) ways[s] = (ways[s] + ways[s - x]) % MODN;
      return String(ways[K]);
    },
    solutions: {
      python: `import sys

MOD = 10**9 + 7
data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
k = int(data[1 + n])
ways = [0] * (k + 1)
ways[0] = 1
for x in a:
    for s in range(k, x - 1, -1):
        ways[s] = (ways[s] + ways[s - x]) % MOD
print(ways[k])
`,
      java: `${javaHead}
        final long MOD = 1_000_000_007L;
        int n = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        long[] ways = new long[k + 1];
        ways[0] = 1;
        for (int x : a)
            for (int s = k; s >= x; s--) ways[s] = (ways[s] + ways[s - x]) % MOD;
        System.out.println(ways[k]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-max-xor',
    level: 'hard',
    title: 'Strongest Encryption Pair',
    topics: ['bits'],
    statement: `A security system holds **N** keys **A[0..N−1]**. The strength of a pair of keys is their **bitwise XOR**.

Print the maximum strength over all pairs of two different keys (if N = 1, print 0).`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].',
    outputFormat: 'Print the maximum XOR of two keys.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ A[i] < 2³⁰'],
    pattern: {
      name: 'Greedy bit-by-bit with prefixes (or a binary trie)',
      recognize: '"Maximum XOR of two numbers" with large N: decide the answer from the highest bit down.',
      approach: [
        'Build the answer bit by bit from bit 29 down to 0.',
        'At each bit, collect the prefixes (x >> bit) of all numbers in a set and test whether candidate = (answer << 1) | 1 can be formed: it can if some prefix p has p ^ candidate also in the set.',
        'Keep the 1 if possible, otherwise 0. (A binary trie gives the same result.)',
      ],
      time: 'O(30 · N)',
      space: 'O(N)',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(4, 6);
        return lines(n, r.array(n, 0, 31));
      }
      if (k === 'edge') return r.pick([lines(1, 7), lines(3, [5, 5, 5]), lines(2, [0, 1073741823])]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      return lines(n, r.array(n, 0, r.pick([1023, 1073741823])));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      let ans = 0;
      for (let bit = 29; bit >= 0; bit--) {
        const cand = (ans << 1) | 1;
        const pre = new Set(a.map((x) => x >> bit));
        let ok = false;
        for (const p of pre)
          if (pre.has(p ^ cand)) {
            ok = true;
            break;
          }
        ans = ok ? cand : ans << 1;
      }
      return String(n === 1 ? 0 : ans);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
ans = 0
for bit in range(29, -1, -1):
    cand = (ans << 1) | 1
    prefixes = {x >> bit for x in a}
    ans = cand if any((p ^ cand) in prefixes for p in prefixes) else ans << 1
print(ans if n > 1 else 0)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        int ans = 0;
        for (int bit = 29; bit >= 0; bit--) {
            int cand = (ans << 1) | 1;
            HashSet<Integer> prefixes = new HashSet<>();
            for (int x : a) prefixes.add(x >> bit);
            boolean ok = false;
            for (int p : prefixes) if (prefixes.contains(p ^ cand)) { ok = true; break; }
            ans = ok ? cand : ans << 1;
        }
        System.out.println(n > 1 ? ans : 0);
    }
}
`,
    },
  },
  {
    id: 'inf-h-grid-paths',
    level: 'hard',
    title: 'Delivery Routes in the City',
    topics: ['dp-basic', 'modular'],
    statement: `A city is an **R × C** grid of blocks; some blocks are closed for construction ('#'), the rest are open ('.'). A delivery scooter starts at the **top-left** block and must reach the **bottom-right** block, moving only **right** or **down**, through open blocks.

Count the number of distinct routes modulo **1,000,000,007**.`,
    inputFormat: 'The first line contains two space-separated integers R and C.\nEach of the next R lines contains a string of C characters.',
    outputFormat: 'Print the number of routes modulo 1,000,000,007.',
    constraints: ['1 ≤ R, C ≤ 500', "Each character is '.' or '#'"],
    pattern: {
      name: 'Grid DP (counting paths)',
      recognize: 'Only right/down moves: the number of ways to reach a cell is the sum from the cell above and the cell to the left.',
      approach: ['ways[0][0] = 1 if open.', 'For each open cell: ways[i][j] = ways[i−1][j] + ways[i][j−1] (mod M); closed cells have 0.', 'Print ways[R−1][C−1].'],
      time: 'O(R · C)',
      space: 'O(C) with one row',
      pitfalls: 'A closed start or target gives 0. Take the modulo on every addition.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const R = r.int(3, 4);
        const C = r.int(3, 4);
        return lines(`${R} ${C}`, grid(r, R, C, 0.2, true));
      }
      if (k === 'edge') return r.pick([lines('1 1', '.'), lines('1 1', '#'), lines('2 2', ['..', '..']), lines('2 3', ['.#.', '...'])]);
      const R = k === 'large' ? 500 : r.int(5, 40);
      const C = k === 'large' ? 500 : r.int(5, 40);
      return lines(`${R} ${C}`, grid(r, R, C, r.pick([0.02, 0.1, 0.2]), r.chance(0.9)));
    },
    solve: (inp) => {
      const t = inp.split(/\s+/).filter(Boolean);
      const R = Number(t[0]);
      const C = Number(t[1]);
      const g = t.slice(2, 2 + R);
      const row = new Array(C).fill(0);
      for (let i = 0; i < R; i++)
        for (let j = 0; j < C; j++) {
          if (g[i][j] === '#') row[j] = 0;
          else if (i === 0 && j === 0) row[j] = 1;
          else row[j] = (row[j] + (j > 0 ? row[j - 1] : 0)) % MODN;
        }
      return String(row[C - 1]);
    },
    solutions: {
      python: `import sys

MOD = 10**9 + 7
data = sys.stdin.read().split()
r, c = int(data[0]), int(data[1])
g = data[2:2 + r]
row = [0] * c
for i in range(r):
    for j in range(c):
        if g[i][j] == '#':
            row[j] = 0
        elif i == 0 and j == 0:
            row[j] = 1
        else:
            row[j] = (row[j] + (row[j - 1] if j > 0 else 0)) % MOD
print(row[c - 1])
`,
      java: `${javaHead}
        final long MOD = 1_000_000_007L;
        int r = Integer.parseInt(st.nextToken());
        int c = Integer.parseInt(st.nextToken());
        long[] row = new long[c];
        for (int i = 0; i < r; i++) {
            String line = st.nextToken();
            for (int j = 0; j < c; j++) {
                if (line.charAt(j) == '#') row[j] = 0;
                else if (i == 0 && j == 0) row[j] = 1;
                else row[j] = (row[j] + (j > 0 ? row[j - 1] : 0)) % MOD;
            }
        }
        System.out.println(row[c - 1]);
    }
}
`,
    },
  },
  {
    id: 'inf-h-courses',
    level: 'hard',
    title: 'Completable Courses',
    topics: ['topo'],
    statement: `A university has **N** courses numbered 1 to N and **M** prerequisite rules. A rule "a b" means course **b** must be completed **before** course **a**. Some rules may form cycles, making those courses (and every course that depends on them) impossible to complete.

Print how many courses can be completed.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M.\nEach of the next M lines contains two space-separated integers a and b.',
    outputFormat: 'Print the number of courses that can be completed.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ 10⁵', '1 ≤ a, b ≤ N'],
    pattern: {
      name: "Topological sort (Kahn's algorithm)",
      recognize: 'Dependencies between tasks; tasks in or behind a cycle can never be done.',
      approach: ['Build edges b → a and count in-degrees.', 'Queue every course with in-degree 0. Repeatedly take one, count it as completable, and decrement the in-degree of its dependants; enqueue those that reach 0.', 'The number of courses taken from the queue is the answer.'],
      time: 'O(N + M)',
      space: 'O(N + M)',
      pitfalls: 'A rule "a a" (self-dependency) makes course a impossible.',
    },
    gen: (r, k) => {
      const make = (n: number, m: number, cycleBias: number) => {
        const rows: string[] = [];
        for (let i = 0; i < m; i++) {
          let a = r.int(1, n);
          let b = r.int(1, n);
          // Mostly acyclic (b < a), with some backward edges creating cycles.
          if (!r.chance(cycleBias) && b > a) [a, b] = [b, a];
          rows.push(`${a} ${b}`);
        }
        return lines(n, m, rows);
      };
      if (k === 'public') return make(r.int(4, 6), r.int(3, 5), 0.2);
      if (k === 'edge') return r.pick([lines(1, 0), lines(1, 1, '1 1'), lines(3, 3, ['1 2', '2 3', '3 1']), lines(3, 2, ['2 1', '3 2'])]);
      if (k === 'large') return make(50000, 50000, r.pick([0, 0.0005, 0.01]));
      const n = r.int(10, 400);
      return make(n, r.int(0, n * 2), r.pick([0, 0.02, 0.1]));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const m = rd.num();
      const adj: number[][] = Array.from({ length: n + 1 }, () => []);
      const indeg = new Array(n + 1).fill(0);
      for (let i = 0; i < m; i++) {
        const a = rd.num();
        const b = rd.num();
        adj[b].push(a);
        indeg[a]++;
      }
      const q: number[] = [];
      for (let v = 1; v <= n; v++) if (indeg[v] === 0) q.push(v);
      let head = 0;
      while (head < q.length) {
        const v = q[head++];
        for (const w of adj[v]) if (--indeg[w] === 0) q.push(w);
      }
      return String(q.length);
    },
    solutions: {
      python: `import sys
from collections import deque

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
adj = [[] for _ in range(n + 1)]
indeg = [0] * (n + 1)
for i in range(m):
    a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
    adj[b].append(a)
    indeg[a] += 1
q = deque(v for v in range(1, n + 1) if indeg[v] == 0)
done = 0
while q:
    v = q.popleft()
    done += 1
    for w in adj[v]:
        indeg[w] -= 1
        if indeg[w] == 0:
            q.append(w)
print(done)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n + 1];
        for (int i = 0; i < m; i++) {
            int a = Integer.parseInt(st.nextToken()), b = Integer.parseInt(st.nextToken());
            adj.get(b).add(a);
            indeg[a]++;
        }
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int v = 1; v <= n; v++) if (indeg[v] == 0) q.add(v);
        int done = 0;
        while (!q.isEmpty()) {
            int v = q.poll();
            done++;
            for (int w : adj.get(v)) if (--indeg[w] == 0) q.add(w);
        }
        System.out.println(done);
    }
}
`,
    },
  },
];
