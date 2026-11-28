import type { InfosysProblem } from './types';
import { lines, reader } from './rng';

const javaHead = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));`;

type R = { int: (a: number, b: number) => number; chance: (p: number) => boolean; pick: <T>(xs: readonly T[]) => T };

/** Random connected-ish weighted graph as "u v w" lines (1-based). */
function graphEdges(r: R, n: number, m: number, maxW: number, connected: boolean) {
  const rows: string[] = [];
  if (connected) for (let v = 2; v <= n && rows.length < m; v++) rows.push(`${r.int(1, v - 1)} ${v} ${r.int(1, maxW)}`);
  while (rows.length < m) rows.push(`${r.int(1, n)} ${r.int(1, n)} ${r.int(1, maxW)}`);
  return rows;
}

/** Binary min-heap of [dist, node]. */
class Heap {
  a: [number, number][] = [];
  push(x: [number, number]) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): [number, number] {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const rr = l + 1;
        let s = i;
        if (l < a.length && a[l][0] < a[s][0]) s = l;
        if (rr < a.length && a[rr][0] < a[s][0]) s = rr;
        if (s === i) break;
        [a[s], a[i]] = [a[i], a[s]];
        i = s;
      }
    }
    return top;
  }
  get size() {
    return this.a.length;
  }
}

function readGraph(inp: string) {
  const rd = reader(inp);
  const n = rd.num();
  const m = rd.num();
  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  const edges: [number, number, number][] = [];
  for (let i = 0; i < m; i++) {
    const u = rd.num();
    const v = rd.num();
    const w = rd.num();
    adj[u].push([v, w]);
    adj[v].push([u, w]);
    edges.push([u, v, w]);
  }
  return { n, m, adj, edges };
}

const MODN = 1_000_000_007;

export const COMPLEX: InfosysProblem[] = [
  {
    id: 'inf-x-min-toll',
    level: 'complex',
    title: 'Cheapest Toll Route',
    topics: ['dijkstra'],
    sample: true,
    statement: `A logistics company operates in **N** cities connected by **M** two-way highways. Highway i connects cities **u** and **v** and charges a toll of **w** rupees. A truck must travel from **city 1** to **city N**.

Print the minimum total toll, or **−1** if city N cannot be reached.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M.\nEach of the next M lines contains three space-separated integers u, v and w.',
    outputFormat: 'Print the minimum total toll, or −1.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ 2 × 10⁵', '1 ≤ u, v ≤ N', '1 ≤ w ≤ 10⁶'],
    pattern: {
      name: "Dijkstra's algorithm with a priority queue",
      recognize: 'Minimum cost path in a graph with non-negative edge weights.',
      approach: [
        'dist[1] = 0, every other dist = ∞; push (0, 1) into a min-heap.',
        'Pop the smallest (d, u); skip it if d > dist[u] (stale entry).',
        'For every edge (u, v, w): if d + w < dist[v], update dist[v] and push (dist[v], v).',
        'Print dist[N], or −1 if it is still ∞.',
      ],
      time: 'O((N + M) log N)',
      space: 'O(N + M)',
      pitfalls: 'Totals can exceed 2³¹ (up to 10⁶ × 10⁵): use 64-bit distances. N = 1 means a toll of 0.',
    },
    walkthrough: 'With roads 1–2 (4), 2–3 (1), 1–3 (7), the route 1 → 2 → 3 costs 5, cheaper than the direct 7.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(4, 5);
        const m = r.int(n, n + 2);
        return lines(n, m, graphEdges(r, n, m, 10, true));
      }
      if (k === 'edge') return r.pick([lines(1, 0), lines(2, 0), lines(3, 1, '1 2 5'), lines(2, 2, ['1 2 1000000', '2 1 3'])]);
      if (k === 'large') {
        const n = 10000;
        const m = 30000;
        return lines(n, m, graphEdges(r, n, m, 1000000, r.chance(0.85)));
      }
      const n = r.int(10, 200);
      const m = r.int(n - 1, n * 3);
      return lines(n, m, graphEdges(r, n, m, 1000, r.chance(0.8)));
    },
    solve: (inp) => {
      const { n, adj } = readGraph(inp);
      const dist = new Array(n + 1).fill(Infinity);
      dist[1] = 0;
      const h = new Heap();
      h.push([0, 1]);
      while (h.size) {
        const [d, u] = h.pop();
        if (d > dist[u]) continue;
        for (const [v, w] of adj[u])
          if (d + w < dist[v]) {
            dist[v] = d + w;
            h.push([dist[v], v]);
          }
      }
      return String(dist[n] === Infinity ? -1 : dist[n]);
    },
    solutions: {
      python: `import sys
import heapq

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
adj = [[] for _ in range(n + 1)]
for i in range(m):
    u, v, w = int(data[2 + 3 * i]), int(data[3 + 3 * i]), int(data[4 + 3 * i])
    adj[u].append((v, w))
    adj[v].append((u, w))
INF = float('inf')
dist = [INF] * (n + 1)
dist[1] = 0
heap = [(0, 1)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    for v, w in adj[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(heap, (dist[v], v))
print(dist[n] if dist[n] < INF else -1)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        List<long[]>[] adj = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = Integer.parseInt(st.nextToken()), v = Integer.parseInt(st.nextToken());
            long w = Long.parseLong(st.nextToken());
            adj[u].add(new long[]{v, w});
            adj[v].add(new long[]{u, w});
        }
        long[] dist = new long[n + 1];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[1] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.add(new long[]{0, 1});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[1];
            if (top[0] > dist[u]) continue;
            for (long[] e : adj[u]) {
                int v = (int) e[0];
                if (top[0] + e[1] < dist[v]) {
                    dist[v] = top[0] + e[1];
                    pq.add(new long[]{dist[v], v});
                }
            }
        }
        System.out.println(dist[n] == Long.MAX_VALUE ? -1 : dist[n]);
    }
}
`,
    },
  },
  {
    id: 'inf-x-fenwick',
    level: 'complex',
    title: 'Live Inventory Queries',
    topics: ['fenwick'],
    statement: `A warehouse tracks the stock **A[1..N]** of N shelves. It then processes **Q** operations in order:

- **1 i x** — the stock of shelf i becomes x.
- **2 l r** — report the total stock on shelves l to r (inclusive).

Print the answer of every type-2 operation, one per line.`,
    inputFormat: 'The first line contains an integer, N.\nEach of the next N lines contains an integer A[i].\nThe next line contains an integer, Q.\nEach of the next Q lines contains an operation "1 i x" or "2 l r".',
    outputFormat: 'For every type-2 operation, print the total on its own line.',
    constraints: ['1 ≤ N, Q ≤ 10⁵', '0 ≤ A[i], x ≤ 10⁹', '1 ≤ i ≤ N, 1 ≤ l ≤ r ≤ N', 'At least one type-2 operation'],
    pattern: {
      name: 'Fenwick tree (binary indexed tree)',
      recognize: 'Range sums mixed with point updates: prefix sums alone need O(N) per update.',
      approach: [
        'Build a Fenwick tree over A (add each value).',
        'Update "1 i x": add (x − A[i]) at position i and store A[i] = x.',
        'Query "2 l r": prefix(r) − prefix(l − 1).',
      ],
      time: 'O((N + Q) log N)',
      space: 'O(N)',
      pitfalls: 'An update sets a value; add the difference, not x. Sums reach 10¹⁴: use 64-bit.',
    },
    gen: (r, k) => {
      const make = (n: number, q: number, hi: number) => {
        const ops: string[] = [];
        let hasQuery = false;
        for (let i = 0; i < q; i++) {
          if (r.chance(0.5) || (i === q - 1 && !hasQuery)) {
            const l = r.int(1, n);
            ops.push(`2 ${l} ${r.int(l, n)}`);
            hasQuery = true;
          } else ops.push(`1 ${r.int(1, n)} ${r.int(0, hi)}`);
        }
        return lines(n, r.array(n, 0, hi), q, ops);
      };
      if (k === 'public') return make(r.int(4, 6), r.int(3, 5), 9);
      if (k === 'edge') return r.pick([lines(1, 5, 1, '2 1 1'), lines(2, [1, 2], 3, ['1 1 1000000000', '1 2 1000000000', '2 1 2']), lines(3, [0, 0, 0], 1, '2 1 3')]);
      if (k === 'large') return make(20000, 20000, 1000000000);
      return make(r.int(10, 300), r.int(10, 300), 1000);
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = [0, ...rd.nums(n)];
      const t = new Array(n + 1).fill(0);
      const add = (i: number, v: number) => {
        for (; i <= n; i += i & -i) t[i] += v;
      };
      const pre = (i: number) => {
        let s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
      };
      for (let i = 1; i <= n; i++) add(i, a[i]);
      const q = rd.num();
      const out: number[] = [];
      for (let k = 0; k < q; k++) {
        const type = rd.num();
        const x = rd.num();
        const y = rd.num();
        if (type === 1) {
          add(x, y - a[x]);
          a[x] = y;
        } else out.push(pre(y) - pre(x - 1));
      }
      return out.join('\n');
    },
    solutions: {
      python: `import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
a = [0] + [int(x) for x in data[1:1 + n]]
tree = [0] * (n + 1)

def add(i, v):
    while i <= n:
        tree[i] += v
        i += i & -i

def prefix(i):
    s = 0
    while i > 0:
        s += tree[i]
        i -= i & -i
    return s

for i in range(1, n + 1):
    add(i, a[i])
q = int(data[1 + n])
pos = 2 + n
out = []
for _ in range(q):
    t, x, y = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
    pos += 3
    if t == 1:
        add(x, y - a[x])
        a[x] = y
    else:
        out.append(prefix(y) - prefix(x - 1))
print("\\n".join(map(str, out)))
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    static long[] tree;
    static int n;

    static void add(int i, long v) { for (; i <= n; i += i & -i) tree[i] += v; }
    static long prefix(int i) { long s = 0; for (; i > 0; i -= i & -i) s += tree[i]; return s; }

    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));
        n = Integer.parseInt(st.nextToken());
        long[] a = new long[n + 1];
        tree = new long[n + 1];
        for (int i = 1; i <= n; i++) { a[i] = Long.parseLong(st.nextToken()); add(i, a[i]); }
        int q = Integer.parseInt(st.nextToken());
        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int t = Integer.parseInt(st.nextToken());
            int x = Integer.parseInt(st.nextToken());
            long y = Long.parseLong(st.nextToken());
            if (t == 1) { add(x, y - a[x]); a[x] = y; }
            else out.append(prefix((int) y) - prefix(x - 1)).append('\\n');
        }
        System.out.print(out);
    }
}
`,
    },
  },
  {
    id: 'inf-x-tsp',
    level: 'complex',
    title: 'Sales Tour Planner',
    topics: ['bitmask'],
    sample: true,
    statement: `A sales manager must visit **N** branch offices. Travelling from office i to office j costs **C[i][j]** (the matrix need not be symmetric). The tour starts and ends at **office 1** and must visit **every other office exactly once**.

Print the minimum cost of such a tour.`,
    inputFormat: 'The first line contains an integer, N.\nEach of the next N lines contains N space-separated integers: row i of the cost matrix C.',
    outputFormat: 'Print the minimum tour cost.',
    constraints: ['1 ≤ N ≤ 11', '0 ≤ C[i][j] ≤ 10⁶', 'C[i][i] = 0'],
    pattern: {
      name: 'Bitmask DP (travelling salesman)',
      recognize: 'Visit every item of a very small set (N ≤ ~15) in the best order: N! orders is too many, 2ᴺ · N states is fine.',
      approach: [
        'dp[mask][j] = minimum cost to start at office 0, visit exactly the offices in mask, and end at j.',
        'dp[1][0] = 0. For each state, try moving to an unvisited office k: dp[mask | 1<<k][k] = min(…, dp[mask][j] + C[j][k]).',
        'Answer = min over j of dp[full][j] + C[j][0].',
      ],
      time: 'O(2ᴺ · N²)',
      space: 'O(2ᴺ · N)',
      pitfalls: 'With N = 1 the tour is empty: cost 0.',
    },
    walkthrough: 'With 3 offices and costs 1→2 = 10, 2→3 = 15, 3→1 = 20 (and higher costs on the reverse routes), the tour 1 → 2 → 3 → 1 costs 45.',
    gen: (r, k) => {
      const make = (n: number, hi: number) => {
        const rows: string[] = [];
        for (let i = 0; i < n; i++) rows.push(Array.from({ length: n }, (_, j) => (i === j ? 0 : r.int(1, hi))).join(' '));
        return lines(n, rows);
      };
      if (k === 'public') return make(r.int(3, 4), 20);
      if (k === 'edge') return r.pick([lines(1, '0'), lines(2, ['0 5', '7 0']), make(3, 1)]);
      if (k === 'large') return make(11, 1000000);
      return make(r.int(4, 9), r.int(10, 1000));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const c: number[][] = Array.from({ length: n }, () => rd.nums(n));
      if (n === 1) return '0';
      const FULL = 1 << n;
      const dp = Array.from({ length: FULL }, () => new Array(n).fill(Infinity));
      dp[1][0] = 0;
      for (let mask = 1; mask < FULL; mask++) {
        if (!(mask & 1)) continue;
        for (let j = 0; j < n; j++) {
          const cur = dp[mask][j];
          if (cur === Infinity) continue;
          for (let kk = 0; kk < n; kk++) {
            if (mask & (1 << kk)) continue;
            const nm = mask | (1 << kk);
            if (cur + c[j][kk] < dp[nm][kk]) dp[nm][kk] = cur + c[j][kk];
          }
        }
      }
      let best = Infinity;
      for (let j = 1; j < n; j++) best = Math.min(best, dp[FULL - 1][j] + c[j][0]);
      return String(best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
c = [[int(data[1 + i * n + j]) for j in range(n)] for i in range(n)]
if n == 1:
    print(0)
else:
    INF = float('inf')
    full = 1 << n
    dp = [[INF] * n for _ in range(full)]
    dp[1][0] = 0
    for mask in range(1, full, 2):
        row = dp[mask]
        for j in range(n):
            cur = row[j]
            if cur == INF:
                continue
            cj = c[j]
            for k in range(n):
                if mask >> k & 1:
                    continue
                nm = mask | (1 << k)
                if cur + cj[k] < dp[nm][k]:
                    dp[nm][k] = cur + cj[k]
    print(min(dp[full - 1][j] + c[j][0] for j in range(1, n)))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[][] c = new long[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) c[i][j] = Long.parseLong(st.nextToken());
        if (n == 1) { System.out.println(0); return; }
        int full = 1 << n;
        long INF = Long.MAX_VALUE / 4;
        long[][] dp = new long[full][n];
        for (long[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;
        for (int mask = 1; mask < full; mask += 2)
            for (int j = 0; j < n; j++) {
                if (dp[mask][j] == INF) continue;
                for (int k = 0; k < n; k++) {
                    if ((mask >> k & 1) == 1) continue;
                    int nm = mask | (1 << k);
                    dp[nm][k] = Math.min(dp[nm][k], dp[mask][j] + c[j][k]);
                }
            }
        long best = INF;
        for (int j = 1; j < n; j++) best = Math.min(best, dp[full - 1][j] + c[j][0]);
        System.out.println(best);
    }
}
`,
    },
  },
  {
    id: 'inf-x-tree-mis',
    level: 'complex',
    title: 'Festival Volunteers',
    topics: ['tree-dp'],
    statement: `A company's **N** employees form a hierarchy tree (N − 1 reporting links, each connecting two employees). Employee i has an enthusiasm score **E[i]**. For a festival, HR wants to invite a group of employees such that **no two invited employees are directly linked**.

Print the maximum total enthusiasm of the invited group.`,
    inputFormat: 'The first line contains an integer, N.\nEach of the next N lines contains an integer E[i] (for employees 1..N).\nEach of the next N − 1 lines contains two space-separated integers u and v (a link).',
    outputFormat: 'Print the maximum total enthusiasm.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ E[i] ≤ 10⁹', 'The links form a tree'],
    pattern: {
      name: 'Tree DP (include / exclude each node)',
      recognize: 'Choose nodes on a tree with a constraint between parent and child: solve each subtree with two states.',
      approach: [
        'Root the tree at 1 and get a processing order with an iterative DFS (children before parents in reverse).',
        'take[v] = E[v] + Σ skip[child]; skip[v] = Σ max(take[child], skip[child]).',
        'Answer = max(take[1], skip[1]).',
      ],
      time: 'O(N)',
      space: 'O(N)',
      pitfalls: 'Recursive DFS overflows the stack in Python (and sometimes Java) for a path-shaped tree of 10⁵ nodes.',
    },
    gen: (r, k) => {
      const make = (n: number, hi: number, path: boolean) => {
        const edges: string[] = [];
        for (let v = 2; v <= n; v++) edges.push(`${path ? v - 1 : r.int(1, v - 1)} ${v}`);
        return lines(n, r.array(n, 1, hi), edges);
      };
      if (k === 'public') return make(r.int(4, 6), 9, false);
      if (k === 'edge') return r.pick([lines(1, 5), lines(2, [3, 4], '1 2'), make(5, 1, true)]);
      if (k === 'large') return make(30000, 1000000000, r.chance(0.5));
      return make(r.int(10, 300), 1000, r.chance(0.2));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const e = [0, ...rd.nums(n)];
      const adj: number[][] = Array.from({ length: n + 1 }, () => []);
      for (let i = 0; i < n - 1; i++) {
        const u = rd.num();
        const v = rd.num();
        adj[u].push(v);
        adj[v].push(u);
      }
      const parent = new Array(n + 1).fill(0);
      const order: number[] = [];
      const stack = [1];
      parent[1] = -1;
      while (stack.length) {
        const v = stack.pop()!;
        order.push(v);
        for (const w of adj[v])
          if (w !== parent[v]) {
            parent[w] = v;
            stack.push(w);
          }
      }
      const take = new Array(n + 1).fill(0);
      const skip = new Array(n + 1).fill(0);
      for (let i = order.length - 1; i >= 0; i--) {
        const v = order[i];
        take[v] += e[v];
        const p = parent[v];
        if (p > 0) {
          take[p] += skip[v];
          skip[p] += Math.max(take[v], skip[v]);
        }
      }
      return String(Math.max(take[1], skip[1]));
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
e = [0] + [int(x) for x in data[1:1 + n]]
adj = [[] for _ in range(n + 1)]
pos = 1 + n
for _ in range(n - 1):
    u, v = int(data[pos]), int(data[pos + 1])
    pos += 2
    adj[u].append(v)
    adj[v].append(u)
parent = [0] * (n + 1)
parent[1] = -1
order = []
stack = [1]
while stack:
    v = stack.pop()
    order.append(v)
    for w in adj[v]:
        if w != parent[v]:
            parent[w] = v
            stack.append(w)
take = [0] * (n + 1)
skip = [0] * (n + 1)
for v in reversed(order):
    take[v] += e[v]
    p = parent[v]
    if p > 0:
        take[p] += skip[v]
        skip[p] += max(take[v], skip[v])
print(max(take[1], skip[1]))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] e = new long[n + 1];
        for (int i = 1; i <= n; i++) e[i] = Long.parseLong(st.nextToken());
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < n - 1; i++) {
            int u = Integer.parseInt(st.nextToken()), v = Integer.parseInt(st.nextToken());
            adj[u].add(v);
            adj[v].add(u);
        }
        int[] parent = new int[n + 1], order = new int[n];
        int cnt = 0;
        int[] stack = new int[n];
        int top = 0;
        stack[top++] = 1;
        parent[1] = -1;
        while (top > 0) {
            int v = stack[--top];
            order[cnt++] = v;
            for (int w : adj[v]) if (w != parent[v]) { parent[w] = v; stack[top++] = w; }
        }
        long[] take = new long[n + 1], skip = new long[n + 1];
        for (int i = cnt - 1; i >= 0; i--) {
            int v = order[i];
            take[v] += e[v];
            int p = parent[v];
            if (p > 0) { take[p] += skip[v]; skip[p] += Math.max(take[v], skip[v]); }
        }
        System.out.println(Math.max(take[1], skip[1]));
    }
}
`,
    },
  },
  {
    id: 'inf-x-digit-dp',
    level: 'complex',
    title: 'Lucky Ticket Numbers',
    topics: ['digit-dp'],
    statement: `A lottery calls a ticket number **lucky** if the **sum of its digits is divisible by K**. Tickets are numbered from **1 to N**, and N can be as large as 10¹⁸.

Count the lucky ticket numbers in the range [1, N].`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, K.',
    outputFormat: 'Print the number of lucky tickets.',
    constraints: ['1 ≤ N ≤ 10¹⁸', '1 ≤ K ≤ 100'],
    pattern: {
      name: 'Digit DP',
      recognize: 'Count numbers up to a huge N with a property of their digits: build numbers digit by digit, tracking whether you are still "tight" against N.',
      approach: [
        'State: (position, digit sum mod K, tight). At each position try digits 0..limit, where limit is N\'s digit if tight else 9.',
        'Count every complete number whose sum mod K is 0; this includes 0, so subtract 1.',
        'Memoise states that are not tight (they are shared by many prefixes).',
      ],
      time: 'O(digits · K · 10)',
      space: 'O(digits · K)',
      pitfalls: 'Do not forget to exclude 0 (it is counted by the DP). Counts reach 10¹⁸: Java long is enough, but JavaScript needs BigInt.',
    },
    gen: (r, k) => {
      if (k === 'public') return lines(r.int(20, 150), r.int(2, 7));
      if (k === 'edge') return r.pick([lines(1, 1), lines(9, 10), lines('1000000000000000000', 1), lines(10, 1)]);
      if (k === 'large') {
        const digits = r.int(16, 18);
        return lines(String(r.int(1, 9)) + Array.from({ length: digits - 1 }, () => r.int(0, 9)).join(''), r.int(1, 100));
      }
      return lines(r.int(100, 10 ** r.int(3, 9)), r.int(2, 30));
    },
    solve: (inp) => {
      const [ns, ks] = inp.split(/\s+/).filter(Boolean);
      const K = Number(ks);
      const d = ns.split('').map(Number);
      // ways[pos][s]: free suffixes from pos such that (s + suffix digit sum) % K == 0 (BigInt: counts reach 10¹⁸).
      const L = d.length;
      const ways: bigint[][] = Array.from({ length: L + 1 }, () => new Array<bigint>(K).fill(0n));
      ways[L][0] = 1n;
      for (let pos = L - 1; pos >= 0; pos--)
        for (let s = 0; s < K; s++) {
          let t = 0n;
          for (let dig = 0; dig <= 9; dig++) t += ways[pos + 1][(s + dig) % K];
          ways[pos][s] = t;
        }
      let total = 0n;
      let prefix = 0;
      for (let pos = 0; pos < L; pos++) {
        for (let dig = 0; dig < d[pos]; dig++) total += ways[pos + 1][(prefix + dig) % K];
        prefix = (prefix + d[pos]) % K;
      }
      if (prefix % K === 0) total += 1n; // N itself
      return String(total - 1n); // exclude 0
    },
    solutions: {
      python: `n = input().strip()
k = int(input())
digits = [int(c) for c in n]
L = len(digits)
# ways[pos][s]: free suffixes from pos such that (s + suffix digit sum) % k == 0
ways = [[0] * k for _ in range(L + 1)]
ways[L][0] = 1
for pos in range(L - 1, -1, -1):
    nxt = ways[pos + 1]
    for s in range(k):
        ways[pos][s] = sum(nxt[(s + d) % k] for d in range(10))
total = 0
prefix = 0
for pos in range(L):
    for d in range(digits[pos]):
        total += ways[pos + 1][(prefix + d) % k]
    prefix = (prefix + digits[pos]) % k
if prefix == 0:
    total += 1          # N itself
print(total - 1)        # exclude 0
`,
      java: `${javaHead}
        String n = st.nextToken();
        int k = Integer.parseInt(st.nextToken());
        int L = n.length();
        long[][] ways = new long[L + 1][k];
        ways[L][0] = 1;
        for (int pos = L - 1; pos >= 0; pos--)
            for (int s = 0; s < k; s++) {
                long t = 0;
                for (int d = 0; d <= 9; d++) t += ways[pos + 1][(s + d) % k];
                ways[pos][s] = t;
            }
        long total = 0;
        int prefix = 0;
        for (int pos = 0; pos < L; pos++) {
            int digit = n.charAt(pos) - '0';
            for (int d = 0; d < digit; d++) total += ways[pos + 1][(prefix + d) % k];
            prefix = (prefix + digit) % k;
        }
        if (prefix == 0) total += 1;
        System.out.println(total - 1);
    }
}
`,
    },
  },
  {
    id: 'inf-x-merge-files',
    level: 'complex',
    title: 'Merging Log Files',
    topics: ['interval-dp'],
    statement: `A server has **N** log files arranged in a row; file i has size **S[i]** MB. Files can only be merged with an **adjacent** file, and merging two files of sizes a and b costs **a + b** and produces one file of size a + b in their place.

Print the minimum total cost to merge all files into one.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing S[i].',
    outputFormat: 'Print the minimum total merge cost.',
    constraints: ['1 ≤ N ≤ 100', '1 ≤ S[i] ≤ 10⁴'],
    pattern: {
      name: 'Interval DP',
      recognize: 'Only adjacent segments can combine, and the cost depends on the whole segment: solve every interval [i, j].',
      approach: [
        'dp[i][j] = minimum cost to merge files i..j into one; dp[i][i] = 0.',
        'For increasing lengths: dp[i][j] = min over split k of dp[i][k] + dp[k+1][j], plus sum(i..j) (the final merge).',
        'Use prefix sums to get sum(i..j) in O(1).',
      ],
      time: 'O(N³)',
      space: 'O(N²)',
      pitfalls: 'A greedy "merge the two smallest adjacent files" is not always optimal. A single file costs 0.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(3, 5);
        return lines(n, r.array(n, 1, 20));
      }
      if (k === 'edge') return r.pick([lines(1, 10), lines(2, [5, 7]), lines(4, [1, 1, 1, 1])]);
      const n = k === 'large' ? 100 : r.int(5, 40);
      return lines(n, r.array(n, 1, k === 'large' ? 10000 : 100));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const s = rd.nums(n);
      const pre = [0];
      for (const x of s) pre.push(pre[pre.length - 1] + x);
      const dp = Array.from({ length: n }, () => new Array(n).fill(0));
      for (let len = 2; len <= n; len++)
        for (let i = 0; i + len - 1 < n; i++) {
          const j = i + len - 1;
          let best = Infinity;
          for (let kk = i; kk < j; kk++) best = Math.min(best, dp[i][kk] + dp[kk + 1][j]);
          dp[i][j] = best + pre[j + 1] - pre[i];
        }
      return String(dp[0][n - 1]);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
s = list(map(int, data[1:1 + n]))
pre = [0]
for x in s:
    pre.append(pre[-1] + x)
dp = [[0] * n for _ in range(n)]
for length in range(2, n + 1):
    for i in range(n - length + 1):
        j = i + length - 1
        best = min(dp[i][k] + dp[k + 1][j] for k in range(i, j))
        dp[i][j] = best + pre[j + 1] - pre[i]
print(dp[0][n - 1])
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] pre = new long[n + 1];
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + Long.parseLong(st.nextToken());
        long[][] dp = new long[n][n];
        for (int len = 2; len <= n; len++)
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                long best = Long.MAX_VALUE;
                for (int k = i; k < j; k++) best = Math.min(best, dp[i][k] + dp[k + 1][j]);
                dp[i][j] = best + pre[j + 1] - pre[i];
            }
        System.out.println(dp[0][n - 1]);
    }
}
`,
    },
  },
  {
    id: 'inf-x-count-shortest',
    level: 'complex',
    title: 'Fastest Routes Count',
    topics: ['dijkstra'],
    statement: `A navigation app models a city as **N** junctions and **M** two-way roads; road i joins **u** and **v** and takes **w** minutes. Several different routes from **junction 1** to **junction N** may all take the minimum possible time.

Print the **number of different fastest routes** from 1 to N, modulo **1,000,000,007**. Print **0** if N is unreachable.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M.\nEach of the next M lines contains three space-separated integers u, v and w.',
    outputFormat: 'Print the number of fastest routes modulo 1,000,000,007.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ 2 × 10⁵', '1 ≤ u, v ≤ N, u ≠ v', '1 ≤ w ≤ 10⁶'],
    pattern: {
      name: 'Dijkstra with path counting',
      recognize: '"How many shortest paths": run Dijkstra and carry a count with each distance.',
      approach: [
        'dist[1] = 0, ways[1] = 1.',
        'When relaxing u → v: if dist[u] + w < dist[v], set dist[v] and ways[v] = ways[u]; if equal, ways[v] += ways[u] (mod M).',
        'Process each node once, when it is popped with its final distance.',
      ],
      time: 'O((N + M) log N)',
      space: 'O(N + M)',
      pitfalls: 'Skip stale heap entries, otherwise counts are added twice. N = 1 has exactly 1 route (staying put).',
    },
    gen: (r, k) => {
      const edges = (n: number, m: number, maxW: number, connected: boolean) => {
        const rows: string[] = [];
        if (connected) for (let v = 2; v <= n && rows.length < m; v++) rows.push(`${r.int(1, v - 1)} ${v} ${r.int(1, maxW)}`);
        while (rows.length < m) {
          const u = r.int(1, n);
          let v = r.int(1, n);
          if (v === u) v = u === n ? 1 : u + 1;
          if (n > 1) rows.push(`${u} ${v} ${r.int(1, maxW)}`);
          else break;
        }
        return rows;
      };
      if (k === 'public') {
        const n = r.int(4, 5);
        const m = r.int(n, n + 3);
        return lines(n, m, edges(n, m, 3, true));
      }
      if (k === 'edge') return r.pick([lines(1, 0), lines(2, 0), lines(4, 4, ['1 2 1', '1 3 1', '2 4 1', '3 4 1']), lines(2, 2, ['1 2 5', '2 1 5'])]);
      if (k === 'large') {
        const n = 10000;
        const m = 30000;
        return lines(n, m, edges(n, m, r.pick([2, 1000]), true));
      }
      const n = r.int(10, 200);
      const m = r.int(n - 1, n * 3);
      return lines(n, m, edges(n, m, r.pick([1, 3, 50]), r.chance(0.85)));
    },
    solve: (inp) => {
      const { n, adj } = readGraph(inp);
      const dist = new Array(n + 1).fill(Infinity);
      const ways = new Array(n + 1).fill(0);
      dist[1] = 0;
      ways[1] = 1;
      const h = new Heap();
      h.push([0, 1]);
      while (h.size) {
        const [d, u] = h.pop();
        if (d > dist[u]) continue;
        for (const [v, w] of adj[u]) {
          const nd = d + w;
          if (nd < dist[v]) {
            dist[v] = nd;
            ways[v] = ways[u];
            h.push([nd, v]);
          } else if (nd === dist[v]) ways[v] = (ways[v] + ways[u]) % MODN;
        }
      }
      return String(dist[n] === Infinity ? 0 : ways[n]);
    },
    solutions: {
      python: `import sys
import heapq

MOD = 10**9 + 7
data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
adj = [[] for _ in range(n + 1)]
for i in range(m):
    u, v, w = int(data[2 + 3 * i]), int(data[3 + 3 * i]), int(data[4 + 3 * i])
    adj[u].append((v, w))
    adj[v].append((u, w))
INF = float('inf')
dist = [INF] * (n + 1)
ways = [0] * (n + 1)
dist[1], ways[1] = 0, 1
heap = [(0, 1)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    for v, w in adj[u]:
        nd = d + w
        if nd < dist[v]:
            dist[v] = nd
            ways[v] = ways[u]
            heapq.heappush(heap, (nd, v))
        elif nd == dist[v]:
            ways[v] = (ways[v] + ways[u]) % MOD
print(ways[n] if dist[n] < INF else 0)
`,
      java: `${javaHead}
        final long MOD = 1_000_000_007L;
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        List<long[]>[] adj = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int u = Integer.parseInt(st.nextToken()), v = Integer.parseInt(st.nextToken());
            long w = Long.parseLong(st.nextToken());
            adj[u].add(new long[]{v, w});
            adj[v].add(new long[]{u, w});
        }
        long[] dist = new long[n + 1], ways = new long[n + 1];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[1] = 0;
        ways[1] = 1;
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.add(new long[]{0, 1});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[1];
            if (top[0] > dist[u]) continue;
            for (long[] e : adj[u]) {
                int v = (int) e[0];
                long nd = top[0] + e[1];
                if (nd < dist[v]) { dist[v] = nd; ways[v] = ways[u]; pq.add(new long[]{nd, v}); }
                else if (nd == dist[v]) ways[v] = (ways[v] + ways[u]) % MOD;
            }
        }
        System.out.println(dist[n] == Long.MAX_VALUE ? 0 : ways[n]);
    }
}
`,
    },
  },
  {
    id: 'inf-x-mst',
    level: 'complex',
    title: 'Fibre Network Rollout',
    topics: ['mst'],
    sample: true,
    statement: `A telecom company wants to connect **N** villages with fibre. There are **M** possible cable routes; route i connects villages **u** and **v** and costs **w** lakh rupees. Every village must end up connected to every other (directly or through other villages).

Print the **minimum total cost**, or **−1** if it is impossible to connect all villages.`,
    inputFormat: 'The first line contains an integer, N.\nThe second line contains an integer, M.\nEach of the next M lines contains three space-separated integers u, v and w.',
    outputFormat: 'Print the minimum total cost, or −1.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ M ≤ 2 × 10⁵', '1 ≤ u, v ≤ N', '1 ≤ w ≤ 10⁶'],
    pattern: {
      name: "Minimum spanning tree (Kruskal's algorithm + DSU)",
      recognize: '"Connect everything at minimum total cost" with no ordering or path requirement.',
      approach: [
        'Sort routes by cost.',
        'Go through them with a union–find; take a route if it joins two different components.',
        'If you took N − 1 routes, print their total; otherwise the villages cannot all be connected: print −1.',
      ],
      time: 'O(M log M)',
      space: 'O(N + M)',
      pitfalls: 'N = 1 needs no cable (cost 0). The total can exceed 2³¹: use 64-bit.',
    },
    walkthrough: 'Villages 1–2 (3), 2–3 (1), 1–3 (2): take 2–3 (1) and 1–3 (2); 1–2 would form a cycle. Total 3.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(4, 5);
        const m = r.int(n, n + 2);
        return lines(n, m, graphEdges(r, n, m, 9, true));
      }
      if (k === 'edge') return r.pick([lines(1, 0), lines(2, 0), lines(3, 2, ['1 2 4', '1 2 1']), lines(2, 1, '1 1 5')]);
      if (k === 'large') {
        const n = 10000;
        const m = 30000;
        return lines(n, m, graphEdges(r, n, m, 1000000, r.chance(0.85)));
      }
      const n = r.int(10, 200);
      const m = r.int(n - 1, n * 3);
      return lines(n, m, graphEdges(r, n, m, 1000, r.chance(0.8)));
    },
    solve: (inp) => {
      const { n, edges } = readGraph(inp);
      edges.sort((a, b) => a[2] - b[2]);
      const p = Array.from({ length: n + 1 }, (_, i) => i);
      const find = (x: number) => {
        while (p[x] !== x) {
          p[x] = p[p[x]];
          x = p[x];
        }
        return x;
      };
      let total = 0;
      let used = 0;
      for (const [u, v, w] of edges) {
        const a = find(u);
        const b = find(v);
        if (a !== b) {
          p[a] = b;
          total += w;
          used++;
        }
      }
      return String(used === n - 1 ? total : -1);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
edges = sorted((int(data[4 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])) for i in range(m))
parent = list(range(n + 1))

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

total = used = 0
for w, u, v in edges:
    a, b = find(u), find(v)
    if a != b:
        parent[a] = b
        total += w
        used += 1
print(total if used == n - 1 else -1)
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] parent;

    static int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        long[][] edges = new long[m][3];
        for (int i = 0; i < m; i++) {
            edges[i][0] = Long.parseLong(st.nextToken());
            edges[i][1] = Long.parseLong(st.nextToken());
            edges[i][2] = Long.parseLong(st.nextToken());
        }
        Arrays.sort(edges, (a, b) -> Long.compare(a[2], b[2]));
        parent = new int[n + 1];
        for (int i = 0; i <= n; i++) parent[i] = i;
        long total = 0;
        int used = 0;
        for (long[] e : edges) {
            int a = find((int) e[0]), b = find((int) e[1]);
            if (a != b) { parent[a] = b; total += e[2]; used++; }
        }
        System.out.println(used == n - 1 ? total : -1);
    }
}
`,
    },
  },
];
