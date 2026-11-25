import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  // ---------------- Graphs ----------------
  {
    id: 'find-eventual-safe-states',
    title: 'Find Eventual Safe States',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'A directed graph is given as `graph[i]` = the nodes reachable from `i` by one edge. A node is **safe** if every path starting from it leads to a terminal node (one with no outgoing edges) — in other words, it can never reach a cycle. Return all safe nodes in ascending order.',
    constraints: ['`1 <= n <= 10^4`'],
    sig: { name: 'eventualSafeNodes', params: [{ name: 'graph', type: 'int[][]' }], returns: 'List<int>' },
    tests: [
      { args: [[[1, 2], [2, 3], [5], [0], [5], [], []]], expected: [2, 4, 5, 6] },
      { args: [[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]], expected: [4] },
      { args: [[[]]], expected: [0] },
      { args: [[[0]]], expected: [] },
    ],
    hints: ['A node is unsafe exactly when it can reach a cycle.', 'Use three-colour DFS: a node that reaches a grey (in-progress) node is on or leads to a cycle; a node whose DFS finishes cleanly is safe.'],
    approaches: [
      { name: 'Three-colour DFS', idea: 'Mark a node grey on entry and "safe" on a clean exit. If DFS meets a grey node, every node on the current path stays unsafe.', time: 'O(V + E)', space: 'O(V)' },
      { name: 'Reverse graph + Kahn', idea: 'Reverse all edges and run topological sort from terminal nodes; every node that gets removed is safe.', time: 'O(V + E)', space: 'O(V + E)' },
    ],
    solution: {
      python: `class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        color = [0] * len(graph)          # 0 unvisited, 1 visiting/unsafe, 2 safe

        def safe(u):
            if color[u]:
                return color[u] == 2
            color[u] = 1
            for v in graph[u]:
                if not safe(v):
                    return False
            color[u] = 2
            return True

        return [u for u in range(len(graph)) if safe(u)]
`,
      java: `class Solution {
    private int[] color;                   // 0 unvisited, 1 visiting/unsafe, 2 safe

    private boolean safe(int[][] g, int u) {
        if (color[u] != 0) return color[u] == 2;
        color[u] = 1;
        for (int v : g[u]) if (!safe(g, v)) return false;
        color[u] = 2;
        return true;
    }

    public List<Integer> eventualSafeNodes(int[][] graph) {
        color = new int[graph.length];
        List<Integer> res = new ArrayList<>();
        for (int u = 0; u < graph.length; u++) if (safe(graph, u)) res.add(u);
        return res;
    }
}
`,
    },
  },
  {
    id: 'is-graph-bipartite',
    title: 'Is Graph Bipartite?',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'An undirected graph is given as an adjacency list `graph`. Return `true` if its nodes can be split into two groups such that every edge connects nodes from different groups. The graph may be disconnected.',
    constraints: ['`1 <= n <= 100`', 'No self-loops or parallel edges'],
    sig: { name: 'isBipartite', params: [{ name: 'graph', type: 'int[][]' }], returns: 'bool' },
    tests: [
      { args: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]], expected: false },
      { args: [[[1, 3], [0, 2], [1, 3], [0, 2]]], expected: true },
      { args: [[[], []]], expected: true },
      { args: [[[1], [0], [3], [2]]], expected: true },
    ],
    hints: ['Try to two-colour the graph with BFS or DFS.', 'Start a new search from every uncoloured node, since the graph may be disconnected.'],
    approaches: [{ name: 'BFS two-colouring', idea: 'Colour neighbours with the opposite colour; a conflict means an odd cycle.', time: 'O(V + E)', space: 'O(V)' }],
    solution: {
      python: `class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        color = [-1] * len(graph)
        for s in range(len(graph)):
            if color[s] != -1:
                continue
            color[s] = 0
            q = deque([s])
            while q:
                u = q.popleft()
                for v in graph[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return False
        return True
`,
      java: `class Solution {
    public boolean isBipartite(int[][] graph) {
        int[] color = new int[graph.length];
        Arrays.fill(color, -1);
        for (int s = 0; s < graph.length; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(s));
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : graph[u]) {
                    if (color[v] == -1) { color[v] = 1 - color[u]; q.offer(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'possible-bipartition',
    title: 'Possible Bipartition',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'Split people labelled `1..n` into two groups. `dislikes[i] = [a, b]` means `a` and `b` must not be in the same group. Return `true` if such a split is possible.',
    constraints: ['`1 <= n <= 2000`'],
    sig: { name: 'possibleBipartition', params: [{ name: 'n', type: 'int' }, { name: 'dislikes', type: 'int[][]' }], returns: 'bool' },
    tests: [
      { args: [4, [[1, 2], [1, 3], [2, 4]]], expected: true },
      { args: [3, [[1, 2], [1, 3], [2, 3]]], expected: false },
      { args: [5, [[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]], expected: false },
      { args: [1, []], expected: true },
    ],
    hints: ['Build a graph with an edge for each dislike.', 'The split exists exactly when that graph is bipartite.'],
    approaches: [{ name: 'Bipartite check', idea: 'Two-colour the dislike graph with BFS from every uncoloured person.', time: 'O(n + d)', space: 'O(n + d)' }],
    solution: {
      python: `class Solution:
    def possibleBipartition(self, n: int, dislikes: List[List[int]]) -> bool:
        adj = [[] for _ in range(n + 1)]
        for a, b in dislikes:
            adj[a].append(b)
            adj[b].append(a)
        color = [-1] * (n + 1)
        for s in range(1, n + 1):
            if color[s] != -1:
                continue
            color[s] = 0
            q = deque([s])
            while q:
                u = q.popleft()
                for v in adj[u]:
                    if color[v] == -1:
                        color[v] = 1 - color[u]
                        q.append(v)
                    elif color[v] == color[u]:
                        return False
        return True
`,
      java: `class Solution {
    public boolean possibleBipartition(int n, int[][] dislikes) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] d : dislikes) { adj.get(d[0]).add(d[1]); adj.get(d[1]).add(d[0]); }
        int[] color = new int[n + 1];
        Arrays.fill(color, -1);
        for (int s = 1; s <= n; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(s));
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) { color[v] = 1 - color[u]; q.offer(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'min-cost-connect-points',
    title: 'Min Cost to Connect All Points',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'Given `points[i] = [x, y]`, the cost of connecting two points is their Manhattan distance `|x1 − x2| + |y1 − y2|`. Return the minimum total cost to connect all points so that every pair is connected by exactly one simple path.',
    constraints: ['`1 <= points.length <= 1000`', 'All points are distinct'],
    sig: { name: 'minCostConnectPoints', params: [{ name: 'points', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], expected: 20 },
      { args: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18 },
      { args: [[[0, 0]]], expected: 0 },
      { args: [[[0, 0], [1, 1], [1, 0], [-1, 1]]], expected: 4 },
    ],
    hints: ['"Exactly one simple path between every pair" means a spanning tree; minimum cost means an MST.', 'The graph is complete (every pair is an edge), so Prim\'s O(n²) version without a heap is ideal.'],
    approaches: [
      { name: 'Kruskal', idea: 'Generate all n²/2 edges, sort them, and union-find.', time: 'O(n² log n)', space: 'O(n²)' },
      { name: 'Prim on a dense graph', idea: 'Keep the cheapest known connection cost for every point outside the tree; repeatedly add the cheapest and update the others.', time: 'O(n²)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        dist = [float('inf')] * n
        dist[0] = 0
        in_tree = [False] * n
        total = 0
        for _ in range(n):
            u = min((i for i in range(n) if not in_tree[i]), key=lambda i: dist[i])
            in_tree[u] = True
            total += dist[u]
            for v in range(n):
                if not in_tree[v]:
                    d = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                    if d < dist[v]:
                        dist[v] = d
        return total
`,
      java: `class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length, total = 0;
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        boolean[] inTree = new boolean[n];
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int i = 0; i < n; i++) if (!inTree[i] && (u == -1 || dist[i] < dist[u])) u = i;
            inTree[u] = true;
            total += dist[u];
            for (int v = 0; v < n; v++) {
                if (inTree[v]) continue;
                int d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                if (d < dist[v]) dist[v] = d;
            }
        }
        return total;
    }
}
`,
    },
  },
  {
    id: 'cheapest-flights-k-stops',
    title: 'Cheapest Flights Within K Stops',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'There are `n` cities and `flights[i] = [from, to, price]`. Return the cheapest price from `src` to `dst` using **at most `k` stops** (that is, at most `k + 1` flights), or `-1` if there is no such route.',
    constraints: ['`1 <= n <= 100`', '`0 <= k < n`'],
    sig: { name: 'findCheapestPrice', params: [{ name: 'n', type: 'int' }, { name: 'flights', type: 'int[][]' }, { name: 'src', type: 'int' }, { name: 'dst', type: 'int' }, { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1], expected: 700 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], expected: 200 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], expected: 500 },
      { args: [3, [[0, 1, 100]], 0, 2, 1], expected: -1 },
    ],
    notes: ['0 → 1 → 3 costs 700. The cheaper 0 → 1 → 2 → 3 (400) uses 2 stops, which is too many.'],
    hints: ['Dijkstra alone ignores the stop limit.', 'Run Bellman–Ford for exactly k + 1 rounds, relaxing from a copy of the previous round so each round adds at most one flight.'],
    approaches: [{ name: 'Bellman–Ford with k + 1 rounds', idea: 'After round r, `dist[v]` is the cheapest price using at most r flights. Copying the array each round prevents chaining several flights in one round.', time: 'O(k · E)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        INF = float('inf')
        dist = [INF] * n
        dist[src] = 0
        for _ in range(k + 1):
            nxt = dist[:]                     # relax from the previous round only
            for u, v, w in flights:
                if dist[u] + w < nxt[v]:
                    nxt[v] = dist[u] + w
            dist = nxt
        return -1 if dist[dst] == INF else dist[dst]
`,
      java: `class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        final int INF = Integer.MAX_VALUE;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int round = 0; round <= k; round++) {
            int[] nxt = dist.clone();         // relax from the previous round only
            for (int[] f : flights)
                if (dist[f[0]] != INF && dist[f[0]] + f[2] < nxt[f[1]]) nxt[f[1]] = dist[f[0]] + f[2];
            dist = nxt;
        }
        return dist[dst] == INF ? -1 : dist[dst];
    }
}
`,
    },
  },
  {
    id: 'critical-connections',
    title: 'Critical Connections in a Network',
    difficulty: 'Hard',
    topic: 'graphs',
    statement: 'There are `n` servers connected by undirected `connections`. A connection is **critical** if removing it leaves some servers unable to reach others. Return all critical connections in any order (each as a pair, in either orientation).',
    constraints: ['`2 <= n <= 10^5`', '`n - 1 <= connections.length <= 10^5`'],
    sig: { name: 'criticalConnections', params: [{ name: 'n', type: 'int' }, { name: 'connections', type: 'List<List<int>>' }], returns: 'List<List<int>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [4, [[0, 1], [1, 2], [2, 0], [1, 3]]], expected: [[1, 3]] },
      { args: [2, [[0, 1]]], expected: [[0, 1]] },
      { args: [5, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]]], expected: [[1, 3], [3, 4]] },
      { args: [4, [[0, 1], [1, 2], [2, 3], [3, 0]]], expected: [] },
    ],
    hints: ['Critical connections are exactly the bridges of the graph.', 'Use Tarjan\'s low-link values: tree edge u → v is a bridge when `low[v] > tin[u]`.'],
    approaches: [{ name: 'Tarjan bridges', idea: 'One DFS records discovery times and the lowest time reachable through one back edge.', time: 'O(V + E)', space: 'O(V + E)' }],
    solution: {
      python: `import sys

class Solution:
    def criticalConnections(self, n: int, connections: List[List[int]]) -> List[List[int]]:
        sys.setrecursionlimit(10000)
        adj = [[] for _ in range(n)]
        for u, v in connections:
            adj[u].append(v)
            adj[v].append(u)
        tin, low = [-1] * n, [0] * n
        timer = [0]
        res = []

        def dfs(u, parent):
            tin[u] = low[u] = timer[0]
            timer[0] += 1
            for v in adj[u]:
                if v == parent:
                    continue
                if tin[v] != -1:
                    low[u] = min(low[u], tin[v])
                else:
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if low[v] > tin[u]:
                        res.append([u, v])

        dfs(0, -1)
        return res
`,
      java: `class Solution {
    private List<List<Integer>> adj = new ArrayList<>(), res = new ArrayList<>();
    private int[] tin, low;
    private int timer = 0;

    private void dfs(int u, int parent) {
        tin[u] = low[u] = timer++;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (tin[v] != -1) low[u] = Math.min(low[u], tin[v]);
            else {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > tin[u]) res.add(List.of(u, v));
            }
        }
    }

    public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (List<Integer> c : connections) { adj.get(c.get(0)).add(c.get(1)); adj.get(c.get(1)).add(c.get(0)); }
        tin = new int[n];
        low = new int[n];
        Arrays.fill(tin, -1);
        dfs(0, -1);
        return res;
    }
}
`,
    },
  },
  // ---------------- Dynamic programming ----------------
  {
    id: 'coin-change-ii',
    title: 'Coin Change II',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'Given an `amount` and coin denominations `coins` (unlimited supply of each), return the number of **combinations** that make up the amount. Different orders of the same coins count once.',
    constraints: ['`0 <= amount <= 5000`', '`1 <= coins.length <= 300`', 'The answer fits in a 32-bit signed integer'],
    sig: { name: 'change', params: [{ name: 'amount', type: 'int' }, { name: 'coins', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [5, [1, 2, 5]], expected: 4 },
      { args: [3, [2]], expected: 0 },
      { args: [10, [10]], expected: 1 },
      { args: [0, [7]], expected: 1 },
      { args: [12, [1, 2, 5]], expected: 13 },
    ],
    hints: ['This is an unbounded knapsack that counts ways.', 'Loop over coins in the outer loop and amounts in the inner loop, so each multiset is counted once.'],
    approaches: [{ name: 'Unbounded knapsack, coins outside', idea: '`dp[a] += dp[a − c]`, processing one coin type at a time.', time: 'O(amount · coins)', space: 'O(amount)' }],
    solution: {
      python: `class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [1] + [0] * amount
        for c in coins:
            for a in range(c, amount + 1):
                dp[a] += dp[a - c]
        return dp[amount]
`,
      java: `class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int c : coins)
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];
        return dp[amount];
    }
}
`,
    },
  },
  {
    id: 'burst-balloons',
    title: 'Burst Balloons',
    difficulty: 'Hard',
    topic: 'dp',
    statement: 'Balloon `i` has number `nums[i]`. Bursting balloon `i` earns `nums[left] × nums[i] × nums[right]`, where `left` and `right` are its current neighbours (treat out-of-range neighbours as 1). Burst all balloons and return the maximum coins you can collect.',
    constraints: ['`1 <= n <= 300`', '`0 <= nums[i] <= 100`'],
    sig: { name: 'maxCoins', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 1, 5, 8]], expected: 167 },
      { args: [[1, 5]], expected: 10 },
      { args: [[7]], expected: 7 },
      { args: [[2, 3]], expected: 9 },
    ],
    hints: ['Think about which balloon is burst **last** in a range: its neighbours are then the range boundaries.', '`dp[i][j]` over open intervals of a padded array: try every k in (i, j) as the last balloon.'],
    approaches: [{ name: 'Interval DP', idea: '`dp[i][j] = max(vals[i]·vals[k]·vals[j] + dp[i][k] + dp[k][j])`, filled by increasing interval length.', time: 'O(n³)', space: 'O(n²)' }],
    solution: {
      python: `class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        vals = [1] + nums + [1]
        n = len(vals)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for i in range(n - length):
                j = i + length
                for k in range(i + 1, j):
                    dp[i][j] = max(dp[i][j], vals[i] * vals[k] * vals[j] + dp[i][k] + dp[k][j])
        return dp[0][n - 1]
`,
      java: `class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length + 2;
        int[] vals = new int[n];
        vals[0] = vals[n - 1] = 1;
        for (int i = 0; i < nums.length; i++) vals[i + 1] = nums[i];
        int[][] dp = new int[n][n];
        for (int length = 2; length < n; length++)
            for (int i = 0; i + length < n; i++) {
                int j = i + length;
                for (int k = i + 1; k < j; k++)
                    dp[i][j] = Math.max(dp[i][j], vals[i] * vals[k] * vals[j] + dp[i][k] + dp[k][j]);
            }
        return dp[0][n - 1];
    }
}
`,
    },
  },
  {
    id: 'house-robber-iii',
    title: 'House Robber III',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'Houses form a binary tree; each node holds an amount of money. Robbing two directly linked houses (parent and child) on the same night alerts the police. Return the maximum amount you can rob.',
    constraints: ['`0 <= number of nodes <= 10^4`'],
    sig: { name: 'rob', params: [{ name: 'root', type: 'TreeNode' }], returns: 'int' },
    tests: [
      { args: [[3, 2, 3, null, 3, null, 1]], expected: 7 },
      { args: [[3, 4, 5, 1, 3, null, 1]], expected: 9 },
      { args: [[]], expected: 0 },
      { args: [[4, 1, null, 2, null, 3]], expected: 7 },
    ],
    hints: ['For every node, compute two values: the best total if you rob it, and if you don\'t.', 'Robbing a node forbids robbing its children; skipping it lets each child choose its own best.'],
    approaches: [{ name: 'Tree DP returning (take, skip)', idea: '`take = val + left.skip + right.skip`, `skip = max(left) + max(right)`, computed in one post-order DFS.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def dfs(node):
            if not node:
                return (0, 0)
            l, r = dfs(node.left), dfs(node.right)
            return (node.val + l[1] + r[1], max(l) + max(r))
        return max(dfs(root))
`,
      java: `class Solution {
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] l = dfs(node.left), r = dfs(node.right);
        return new int[]{node.val + l[1] + r[1], Math.max(l[0], l[1]) + Math.max(r[0], r[1])};
    }

    public int rob(TreeNode root) {
        int[] res = dfs(root);
        return Math.max(res[0], res[1]);
    }
}
`,
    },
  },
  {
    id: 'partition-k-equal-subsets',
    title: 'Partition to K Equal Sum Subsets',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'Return `true` if the array `nums` can be divided into `k` non-empty subsets with equal sums.',
    constraints: ['`1 <= k <= nums.length <= 16`', '`1 <= nums[i] <= 10^4`'],
    sig: { name: 'canPartitionKSubsets', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [[4, 3, 2, 3, 5, 2, 1], 4], expected: true },
      { args: [[1, 2, 3, 4], 3], expected: false },
      { args: [[2, 2, 2, 2, 3, 4, 5], 4], expected: false },
      { args: [[1, 1, 1, 1], 2], expected: true },
    ],
    notes: ['(5), (1, 4), (2, 3), (2, 3) all sum to 5.'],
    hints: ['Each subset must sum to `total / k`; if that isn\'t an integer, the answer is false.', 'With n ≤ 16, use a bitmask of used numbers. `dp[mask]` stores how full the current bucket is (sum mod target) for reachable masks.'],
    approaches: [
      { name: 'Backtracking with pruning', idea: 'Fill buckets one at a time, trying numbers in descending order and skipping equal buckets.', time: 'O(k · 2ⁿ) worst case', space: 'O(n)' },
      { name: 'Bitmask DP', idea: 'For each reachable mask, add any unused number that fits in the current bucket; the full mask is reachable exactly when a partition exists.', time: 'O(n · 2ⁿ)', space: 'O(2ⁿ)' },
    ],
    solution: {
      python: `class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k:
            return False
        target, n = total // k, len(nums)
        dp = [-1] * (1 << n)          # fill level of the current bucket, -1 = unreachable
        dp[0] = 0
        for mask in range(1 << n):
            if dp[mask] < 0:
                continue
            for i in range(n):
                if not (mask >> i) & 1 and dp[mask] + nums[i] <= target:
                    dp[mask | (1 << i)] = (dp[mask] + nums[i]) % target
        return dp[(1 << n) - 1] == 0
`,
      java: `class Solution {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % k != 0) return false;
        int target = total / k, n = nums.length;
        int[] dp = new int[1 << n];               // fill level of the current bucket, -1 = unreachable
        Arrays.fill(dp, -1);
        dp[0] = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] < 0) continue;
            for (int i = 0; i < n; i++)
                if (((mask >> i) & 1) == 0 && dp[mask] + nums[i] <= target)
                    dp[mask | (1 << i)] = (dp[mask] + nums[i]) % target;
        }
        return dp[(1 << n) - 1] == 0;
    }
}
`,
    },
  },
  {
    id: 'count-digit-one',
    title: 'Number of Digit One',
    difficulty: 'Hard',
    topic: 'dp',
    statement: 'Given an integer `n`, count the total number of digit `1` appearing in all non-negative integers less than or equal to `n`.',
    constraints: ['`0 <= n <= 10^9`'],
    sig: { name: 'countDigitOne', params: [{ name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [13], expected: 6 },
      { args: [0], expected: 0 },
      { args: [100], expected: 21 },
      { args: [824883294], expected: 767944060 },
    ],
    notes: ['1, 10, 11 (two ones), 12 and 13 contain six 1s in total.'],
    hints: ['Count how often each digit position holds a 1, separately.', 'For the position with value m, split n into high, current digit and low parts; the count depends on whether the current digit is 0, 1, or larger. Digit DP works too.'],
    approaches: [
      { name: 'Digit DP', idea: 'Walk the digits with a tight flag, carrying the number of 1s placed so far.', time: 'O(log n · 10)', space: 'O(log n)' },
      { name: 'Per-position counting', idea: 'At position m: if the digit is 0 add `high·m`; if 1 add `high·m + low + 1`; otherwise add `(high + 1)·m`.', time: 'O(log n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def countDigitOne(self, n: int) -> int:
        count, m = 0, 1
        while m <= n:
            high, cur, low = n // (m * 10), (n // m) % 10, n % m
            if cur == 0:
                count += high * m
            elif cur == 1:
                count += high * m + low + 1
            else:
                count += (high + 1) * m
            m *= 10
        return count
`,
      java: `class Solution {
    public int countDigitOne(int n) {
        long count = 0;
        for (long m = 1; m <= n; m *= 10) {
            long high = n / (m * 10), cur = (n / m) % 10, low = n % m;
            if (cur == 0) count += high * m;
            else if (cur == 1) count += high * m + low + 1;
            else count += (high + 1) * m;
        }
        return (int) count;
    }
}
`,
    },
  },
  {
    id: 'predict-the-winner',
    title: 'Predict the Winner',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'Two players take turns removing a number from **either end** of the array `nums` and adding it to their score. Player 1 moves first, and both play optimally. Return `true` if player 1 can win or tie.',
    constraints: ['`1 <= nums.length <= 20`'],
    sig: { name: 'predictTheWinner', params: [{ name: 'nums', type: 'int[]' }], returns: 'bool' },
    tests: [
      { args: [[1, 5, 2]], expected: false },
      { args: [[1, 5, 233, 7]], expected: true },
      { args: [[1]], expected: true },
      { args: [[2, 4, 55, 6, 8]], expected: false },
    ],
    hints: ['Track the **score difference** (current player minus opponent) instead of two scores.', '`best(i, j) = max(nums[i] − best(i+1, j), nums[j] − best(i, j−1))`.'],
    approaches: [{ name: 'Minimax interval DP', idea: 'The player to move takes an end; the opponent then plays the same game on what remains, so subtract their best difference.', time: 'O(n²)', space: 'O(n²)' }],
    solution: {
      python: `class Solution:
    def predictTheWinner(self, nums: List[int]) -> bool:
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            dp[i][i] = nums[i]
            for j in range(i + 1, n):
                dp[i][j] = max(nums[i] - dp[i + 1][j], nums[j] - dp[i][j - 1])
        return dp[0][n - 1] >= 0
`,
      java: `class Solution {
    public boolean predictTheWinner(int[] nums) {
        int n = nums.length;
        int[][] dp = new int[n][n];
        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = nums[i];
            for (int j = i + 1; j < n; j++) dp[i][j] = Math.max(nums[i] - dp[i + 1][j], nums[j] - dp[i][j - 1]);
        }
        return dp[0][n - 1] >= 0;
    }
}
`,
    },
  },
  // ---------------- Strings ----------------
  {
    id: 'repeated-substring-pattern',
    title: 'Repeated Substring Pattern',
    difficulty: 'Easy',
    topic: 'strings',
    statement: 'Return `true` if the string `s` can be built by taking a substring of it and appending multiple copies of that substring together.',
    constraints: ['`1 <= s.length <= 10^4`'],
    sig: { name: 'repeatedSubstringPattern', params: [{ name: 's', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['abab'], expected: true },
      { args: ['aba'], expected: false },
      { args: ['abcabcabcabc'], expected: true },
      { args: ['a'], expected: false },
      { args: ['aabaaba'], expected: false },
    ],
    hints: ['Use the KMP prefix function: let `p = pi[n − 1]`.', '`s` is a repetition exactly when `p > 0` and `n` is divisible by the period `n − p`.'],
    approaches: [
      { name: 'Doubled string', idea: '`s` is periodic iff it appears in `(s + s)[1:-1]`.', time: 'O(n) with KMP', space: 'O(n)' },
      { name: 'Prefix function', idea: 'The shortest period is `n − pi[n − 1]`; check that it divides n.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        n = len(s)
        pi = [0] * n
        for i in range(1, n):
            j = pi[i - 1]
            while j > 0 and s[i] != s[j]:
                j = pi[j - 1]
            if s[i] == s[j]:
                j += 1
            pi[i] = j
        p = pi[-1]
        return p > 0 and n % (n - p) == 0
`,
      java: `class Solution {
    public boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        int[] pi = new int[n];
        for (int i = 1; i < n; i++) {
            int j = pi[i - 1];
            while (j > 0 && s.charAt(i) != s.charAt(j)) j = pi[j - 1];
            if (s.charAt(i) == s.charAt(j)) j++;
            pi[i] = j;
        }
        int p = pi[n - 1];
        return p > 0 && n % (n - p) == 0;
    }
}
`,
    },
  },
  {
    id: 'repeated-dna-sequences',
    title: 'Repeated DNA Sequences',
    difficulty: 'Medium',
    topic: 'hashing',
    statement: 'A DNA sequence is a string of the letters `A`, `C`, `G` and `T`. Return all 10-letter-long substrings that occur **more than once** in `s`, in any order.',
    constraints: ['`1 <= s.length <= 10^5`'],
    sig: { name: 'findRepeatedDnaSequences', params: [{ name: 's', type: 'string' }], returns: 'List<string>' },
    compare: 'unordered',
    tests: [
      { args: ['AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT'], expected: ['AAAAACCCCC', 'CCCCCAAAAA'] },
      { args: ['AAAAAAAAAAAAA'], expected: ['AAAAAAAAAA'] },
      { args: ['ACGT'], expected: [] },
    ],
    hints: ['Slide a window of length 10 and remember which windows you have seen.', 'To avoid building strings, encode each window as a 20-bit rolling hash (2 bits per letter).'],
    approaches: [
      { name: 'Set of substrings', idea: 'Store each 10-letter window in a "seen" set and add repeats to the answer set.', time: 'O(10 · n)', space: 'O(n)' },
      { name: 'Rolling 2-bit hash', idea: 'Map A, C, G, T to 0–3 and keep a 20-bit integer for the window, updated in O(1) per step.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def findRepeatedDnaSequences(self, s: str) -> List[str]:
        code = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
        mask = (1 << 20) - 1
        seen, repeated, h = set(), set(), 0
        for i, ch in enumerate(s):
            h = ((h << 2) | code[ch]) & mask      # rolling 20-bit hash
            if i >= 9:
                if h in seen:
                    repeated.add(s[i - 9:i + 1])
                seen.add(h)
        return list(repeated)
`,
      java: `class Solution {
    public List<String> findRepeatedDnaSequences(String s) {
        Map<Character, Integer> code = Map.of('A', 0, 'C', 1, 'G', 2, 'T', 3);
        int mask = (1 << 20) - 1, h = 0;
        Set<Integer> seen = new HashSet<>();
        Set<String> repeated = new HashSet<>();
        for (int i = 0; i < s.length(); i++) {
            h = ((h << 2) | code.get(s.charAt(i))) & mask;   // rolling 20-bit hash
            if (i >= 9) {
                if (!seen.add(h)) repeated.add(s.substring(i - 9, i + 1));
            }
        }
        return new ArrayList<>(repeated);
    }
}
`,
    },
  },
  // ---------------- Sorting ----------------
  {
    id: 'maximum-gap',
    title: 'Maximum Gap',
    difficulty: 'Medium',
    topic: 'sorting',
    statement: 'Given an integer array `nums`, return the maximum difference between two successive elements in its **sorted** form, or `0` if it has fewer than two elements. Your algorithm must run in linear time and use linear extra space.',
    constraints: ['`1 <= nums.length <= 10^5`', '`0 <= nums[i] <= 10^9`'],
    sig: { name: 'maximumGap', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 6, 9, 1]], expected: 3 },
      { args: [[10]], expected: 0 },
      { args: [[1, 10000000]], expected: 9999999 },
      { args: [[1, 1, 1, 1]], expected: 0 },
      { args: [[100, 3, 2, 1]], expected: 97 },
    ],
    hints: ['Comparison sorting is O(n log n). Radix sort is linear for bounded integers.', 'Pigeonhole alternative: with n numbers in [min, max], the maximum gap is at least `(max − min) / (n − 1)`. Use buckets of that size and compare only bucket boundaries.'],
    approaches: [
      { name: 'Radix sort', idea: 'Sort with LSD radix sort, then scan adjacent pairs.', time: 'O(d · n)', space: 'O(n)' },
      { name: 'Pigeonhole buckets', idea: 'The maximum gap never occurs inside a bucket, so track each bucket\'s min and max and compare consecutive non-empty buckets.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def maximumGap(self, nums: List[int]) -> int:
        n = len(nums)
        if n < 2:
            return 0
        lo, hi = min(nums), max(nums)
        if lo == hi:
            return 0
        size = max(1, (hi - lo) // (n - 1))
        count = (hi - lo) // size + 1
        bmin, bmax = [None] * count, [None] * count
        for x in nums:
            b = (x - lo) // size
            bmin[b] = x if bmin[b] is None else min(bmin[b], x)
            bmax[b] = x if bmax[b] is None else max(bmax[b], x)
        best, prev = 0, lo
        for b in range(count):
            if bmin[b] is None:
                continue
            best = max(best, bmin[b] - prev)
            prev = bmax[b]
        return best
`,
      java: `class Solution {
    public int maximumGap(int[] nums) {
        int n = nums.length;
        if (n < 2) return 0;
        int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
        for (int x : nums) { lo = Math.min(lo, x); hi = Math.max(hi, x); }
        if (lo == hi) return 0;
        int size = Math.max(1, (hi - lo) / (n - 1));
        int count = (hi - lo) / size + 1;
        int[] bmin = new int[count], bmax = new int[count];
        boolean[] used = new boolean[count];
        for (int x : nums) {
            int b = (x - lo) / size;
            if (!used[b]) { bmin[b] = bmax[b] = x; used[b] = true; }
            else { bmin[b] = Math.min(bmin[b], x); bmax[b] = Math.max(bmax[b], x); }
        }
        int best = 0, prev = lo;
        for (int b = 0; b < count; b++) {
            if (!used[b]) continue;
            best = Math.max(best, bmin[b] - prev);
            prev = bmax[b];
        }
        return best;
    }
}
`,
    },
  },
  // ---------------- Linked lists ----------------
  {
    id: 'design-browser-history',
    title: 'Design Browser History',
    difficulty: 'Medium',
    topic: 'linked-list',
    statement:
      'Implement `BrowserHistory` for a single tab that starts on `homepage`:\n\n- `visit(url)` goes to `url` from the current page and **clears all forward history**.\n- `back(steps)` moves back at most `steps` pages and returns the current URL.\n- `forward(steps)` moves forward at most `steps` pages and returns the current URL.',
    constraints: ['At most 5000 calls'],
    sig: {
      kind: 'design',
      className: 'BrowserHistory',
      ctor: [{ name: 'homepage', type: 'string' }],
      methods: [
        { name: 'visit', params: [{ name: 'url', type: 'string' }], returns: 'void' },
        { name: 'back', params: [{ name: 'steps', type: 'int' }], returns: 'string' },
        { name: 'forward', params: [{ name: 'steps', type: 'int' }], returns: 'string' },
      ],
    },
    tests: [
      {
        args: [
          ['BrowserHistory', 'visit', 'visit', 'visit', 'back', 'back', 'forward', 'visit', 'forward', 'back', 'back'],
          [['leetcode.com'], ['google.com'], ['facebook.com'], ['youtube.com'], [1], [1], [1], ['linkedin.com'], [2], [2], [7]],
        ],
        expected: [null, null, null, null, 'facebook.com', 'google.com', 'facebook.com', null, 'linkedin.com', 'google.com', 'leetcode.com'],
      },
      { args: [['BrowserHistory', 'back', 'forward', 'visit', 'back'], [['a.com'], [3], [3], ['b.com'], [1]]], expected: [null, 'a.com', 'a.com', null, 'a.com'] },
    ],
    hints: ['A doubly linked list of pages with a pointer to the current node fits naturally.', '`visit` creates a new node after the current one and drops everything beyond it.'],
    approaches: [
      { name: 'Doubly linked list', idea: 'Move the current pointer along `prev`/`next` links; `visit` re-links `current.next` to the new page.', time: 'O(1) visit, O(steps) back/forward', space: 'O(n)' },
      { name: 'Array with a cursor', idea: 'Keep pages in an array, the current index and the last valid index; `visit` overwrites and moves the end.', time: 'O(1) per operation', space: 'O(n)' },
    ],
    solution: {
      python: `class BrowserHistory:
    class Page:
        def __init__(self, url):
            self.url, self.prev, self.next = url, None, None

    def __init__(self, homepage: str):
        self.cur = self.Page(homepage)

    def visit(self, url: str) -> None:
        page = self.Page(url)
        page.prev = self.cur
        self.cur.next = page          # drops the forward history
        self.cur = page

    def back(self, steps: int) -> str:
        while steps and self.cur.prev:
            self.cur = self.cur.prev
            steps -= 1
        return self.cur.url

    def forward(self, steps: int) -> str:
        while steps and self.cur.next:
            self.cur = self.cur.next
            steps -= 1
        return self.cur.url
`,
      java: `class BrowserHistory {
    private static class Page {
        String url; Page prev, next;
        Page(String url) { this.url = url; }
    }

    private Page cur;

    public BrowserHistory(String homepage) { cur = new Page(homepage); }

    public void visit(String url) {
        Page page = new Page(url);
        page.prev = cur;
        cur.next = page;              // drops the forward history
        cur = page;
    }

    public String back(int steps) {
        while (steps-- > 0 && cur.prev != null) cur = cur.prev;
        return cur.url;
    }

    public String forward(int steps) {
        while (steps-- > 0 && cur.next != null) cur = cur.next;
        return cur.url;
    }
}
`,
    },
  },
  // ---------------- Trees ----------------
  {
    id: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    topic: 'trees',
    statement: 'Return `true` if a binary tree is **height-balanced**: for every node, the heights of its left and right subtrees differ by at most one.',
    constraints: ['`0 <= number of nodes <= 5000`'],
    sig: { name: 'isBalanced', params: [{ name: 'root', type: 'TreeNode' }], returns: 'bool' },
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: true },
      { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
      { args: [[]], expected: true },
      { args: [[1, null, 2, null, 3]], expected: false },
    ],
    hints: ['Checking each node with a separate height computation is O(n²).', 'Return the height bottom-up, or −1 as soon as any subtree is unbalanced.'],
    approaches: [{ name: 'Height with early exit', idea: 'A post-order DFS returns the subtree height, or −1 if unbalanced, so each node is visited once.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(node):
            if not node:
                return 0
            l, r = height(node.left), height(node.right)
            if l < 0 or r < 0 or abs(l - r) > 1:
                return -1
            return 1 + max(l, r)
        return height(root) >= 0
`,
      java: `class Solution {
    private int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left), r = height(node.right);
        if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }

    public boolean isBalanced(TreeNode root) { return height(root) >= 0; }
}
`,
    },
  },
  // ---------------- Math & games ----------------
  {
    id: 'count-good-numbers',
    title: 'Count Good Numbers',
    difficulty: 'Medium',
    topic: 'math',
    statement: 'A digit string is **good** if digits at even indices (0-based) are even and digits at odd indices are prime (2, 3, 5 or 7). Return the number of good digit strings of length `n`, modulo `10^9 + 7`. Leading zeros are allowed.',
    constraints: ['`1 <= n <= 10^15`'],
    sig: { name: 'countGoodNumbers', params: [{ name: 'n', type: 'long' }], returns: 'int' },
    tests: [
      { args: [1], expected: 5 },
      { args: [4], expected: 400 },
      { args: [50], expected: 564908303 },
      { args: [2], expected: 20 },
    ],
    hints: ['There are ⌈n/2⌉ even positions (5 choices each) and ⌊n/2⌋ odd positions (4 choices each).', 'Use fast modular exponentiation: n can be up to 10¹⁵.'],
    approaches: [{ name: 'Binary exponentiation', idea: 'Answer = 5^⌈n/2⌉ · 4^⌊n/2⌋ mod (10⁹ + 7), each power in O(log n).', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def countGoodNumbers(self, n: int) -> int:
        MOD = 10**9 + 7
        return pow(5, (n + 1) // 2, MOD) * pow(4, n // 2, MOD) % MOD
`,
      java: `class Solution {
    private static final long MOD = 1_000_000_007L;

    private long power(long a, long e) {
        long r = 1;
        a %= MOD;
        while (e > 0) {
            if ((e & 1) == 1) r = r * a % MOD;
            a = a * a % MOD;
            e >>= 1;
        }
        return r;
    }

    public int countGoodNumbers(long n) {
        return (int) (power(5, (n + 1) / 2) * power(4, n / 2) % MOD);
    }
}
`,
    },
  },
  {
    id: 'gcd-of-strings',
    title: 'Greatest Common Divisor of Strings',
    difficulty: 'Easy',
    topic: 'math',
    statement: 'A string `t` divides `s` if `s` is `t` repeated one or more times. Return the largest string `x` that divides both `str1` and `str2`, or `""` if none exists.',
    constraints: ['`1 <= str1.length, str2.length <= 1000`'],
    sig: { name: 'gcdOfStrings', params: [{ name: 'str1', type: 'string' }, { name: 'str2', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['ABCABC', 'ABC'], expected: 'ABC' },
      { args: ['ABABAB', 'ABAB'], expected: 'AB' },
      { args: ['LEET', 'CODE'], expected: '' },
      { args: ['AAAAAA', 'AA'], expected: 'AA' },
    ],
    hints: ['If a common divisor exists, then `str1 + str2 == str2 + str1`.', 'When it does, the answer is the prefix of length `gcd(len(str1), len(str2))`.'],
    approaches: [{ name: 'Concatenation check + GCD', idea: 'Both strings are repetitions of the same base exactly when the two concatenation orders match; the longest base has length gcd of the lengths.', time: 'O(m + n)', space: 'O(m + n)' }],
    solution: {
      python: `from math import gcd

class Solution:
    def gcdOfStrings(self, str1: str, str2: str) -> str:
        if str1 + str2 != str2 + str1:
            return ""
        return str1[:gcd(len(str1), len(str2))]
`,
      java: `class Solution {
    private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }

    public String gcdOfStrings(String str1, String str2) {
        if (!(str1 + str2).equals(str2 + str1)) return "";
        return str1.substring(0, gcd(str1.length(), str2.length()));
    }
}
`,
    },
  },
  {
    id: 'nim-game',
    title: 'Nim Game',
    difficulty: 'Easy',
    topic: 'math',
    statement: 'There is a heap of `n` stones. You and a friend alternate turns, you first, removing 1 to 3 stones each turn. Whoever removes the last stone wins. Both play optimally. Return `true` if you can win.',
    constraints: ['`1 <= n <= 2^31 - 1`'],
    sig: { name: 'canWinNim', params: [{ name: 'n', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [4], expected: false },
      { args: [1], expected: true },
      { args: [2], expected: true },
      { args: [8], expected: false },
      { args: [7], expected: true },
    ],
    hints: ['Work out who wins for n = 1 to 8 by hand.', 'Multiples of 4 are losing: whatever you take, your opponent restores a multiple of 4.'],
    approaches: [{ name: 'Losing positions are multiples of 4', idea: 'From n % 4 ≠ 0, take n % 4 stones to leave a multiple of 4; from a multiple of 4, every move leaves a non-multiple.', time: 'O(1)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def canWinNim(self, n: int) -> bool:
        return n % 4 != 0
`,
      java: `class Solution {
    public boolean canWinNim(int n) {
        return n % 4 != 0;
    }
}
`,
    },
  },
];

export default problems;
