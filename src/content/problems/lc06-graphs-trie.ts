import type { Problem } from '../../lib/harness';

const g = (rows: string[]) => rows.map((r) => r.split(''));

/** Validates that `order` is a topological order of numCourses with the given prerequisites. */
function validTopo(n: number, prereqs: number[][], order: any, expected: any[]) {
  if (!Array.isArray(order)) return false;
  if (expected.length === 0) return order.length === 0;
  if (order.length !== n || new Set(order).size !== n) return false;
  const pos = new Map<number, number>(order.map((c: number, i: number) => [c, i]));
  return prereqs.every(([a, b]) => (pos.get(b) ?? -1) < (pos.get(a) ?? -1));
}

const problems: Problem[] = [
  // ---------------- Graph general ----------------
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'Given an `m × n` grid of `"1"` (land) and `"0"` (water), return the number of islands. An island is a group of land cells connected horizontally or vertically, surrounded by water. Cells outside the grid are water.',
    constraints: ['`1 <= m, n <= 300`'],
    sig: { name: 'numIslands', params: [{ name: 'grid', type: 'char[][]' }], returns: 'int' },
    tests: [
      { args: [g(['11110', '11010', '11000', '00000'])], expected: 1 },
      { args: [g(['11000', '11000', '00100', '00011'])], expected: 3 },
      { args: [g(['0'])], expected: 0 },
      { args: [g(['101', '010', '101'])], expected: 5 },
    ],
    hints: ['Each time you find unvisited land, you have found a new island.', 'Flood-fill (DFS/BFS) from it to mark the whole island visited.'],
    approaches: [{ name: 'DFS flood fill', idea: 'Scan cells; on land, count an island and sink all connected land.', time: 'O(m·n)', space: 'O(m·n) worst-case recursion' }],
    solution: {
      python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])

        def sink(r, c):
            stack = [(r, c)]
            grid[r][c] = '0'
            while stack:
                r, c = stack.pop()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                        grid[nr][nc] = '0'
                        stack.append((nr, nc))

        count = 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] == '1':
                    count += 1
                    sink(r, c)
        return count
`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') { count++; sink(grid, r, c); }
        return count;
    }

    private void sink(char[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
    }
}
`,
    },
  },
  {
    id: 'surrounded-regions',
    title: 'Surrounded Regions',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'Given an `m × n` board of `"X"` and `"O"`, capture every region of `"O"`s that is completely surrounded by `"X"` (not connected to the border) by flipping it to `"X"`. Modify the board in place.',
    constraints: ['`1 <= m, n <= 200`'],
    sig: { name: 'solve', params: [{ name: 'board', type: 'char[][]' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [g(['XXXX', 'XOOX', 'XXOX', 'XOXX'])], expected: g(['XXXX', 'XXXX', 'XXXX', 'XOXX']) },
      { args: [g(['X'])], expected: g(['X']) },
      { args: [g(['OO', 'OO'])], expected: g(['OO', 'OO']) },
      { args: [g(['XXX', 'XOX', 'XXX'])], expected: g(['XXX', 'XXX', 'XXX']) },
    ],
    hints: ['Think in reverse: which `O`s survive? Those connected to the border.', 'Mark border-connected `O`s (e.g. as `#`), flip the rest to `X`, then restore `#` to `O`.'],
    approaches: [{ name: 'Border flood fill', idea: 'DFS from every border `O` to mark safe cells; everything else unmarked is captured.', time: 'O(m·n)', space: 'O(m·n)' }],
    solution: {
      python: `class Solution:
    def solve(self, board: List[List[str]]) -> None:
        m, n = len(board), len(board[0])
        stack = [(r, c) for r in range(m) for c in range(n) if (r in (0, m - 1) or c in (0, n - 1)) and board[r][c] == 'O']
        while stack:
            r, c = stack.pop()
            if 0 <= r < m and 0 <= c < n and board[r][c] == 'O':
                board[r][c] = '#'
                stack.extend(((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)))
        for r in range(m):
            for c in range(n):
                board[r][c] = 'O' if board[r][c] == '#' else 'X'
`,
      java: `class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++) { mark(board, r, 0); mark(board, r, n - 1); }
        for (int c = 0; c < n; c++) { mark(board, 0, c); mark(board, m - 1, c); }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                board[r][c] = board[r][c] == '#' ? 'O' : 'X';
    }

    private void mark(char[][] b, int r, int c) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != 'O') return;
        b[r][c] = '#';
        mark(b, r + 1, c); mark(b, r - 1, c); mark(b, r, c + 1); mark(b, r, c - 1);
    }
}
`,
    },
  },
  {
    id: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement:
      'Given a reference to a node in a connected undirected graph, return a **deep copy** of the graph. Each node has a `val` and a list of `neighbors`. No node in the copy may be a node of the original graph.\n\nGraphs are written as adjacency lists: node values are `1..n`, and `adjList[i]` lists the neighbours of node `i + 1`. The given node is always node 1.',
    constraints: ['`0 <= n <= 100`', 'No repeated edges or self-loops; the graph is connected'],
    sig: { name: 'cloneGraph', params: [{ name: 'node', type: 'GraphNode' }], returns: 'GraphNode' },
    tests: [
      { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
      { args: [[[]]], expected: [[]] },
      { args: [[]], expected: [] },
      { args: [[[2], [1]]], expected: [[2], [1]] },
      { args: [[[2, 3], [1, 3], [1, 2]]], expected: [[2, 3], [1, 3], [1, 2]] },
    ],
    notes: ['The copy has four nodes connected the same way; the judge also checks that none of them belong to the original graph.'],
    hints: ['Traverse the graph (BFS or DFS) and keep a map from each original node to its copy.', 'The map doubles as the visited set, and it lets cycles point back to copies you already made.'],
    approaches: [{ name: 'BFS with an original → copy map', idea: 'Create the copy of a node the first time you see it; for every edge, append the neighbour\'s copy to the current node\'s copy.', time: 'O(V + E)', space: 'O(V)' }],
    solution: {
      python: `class Solution:
    def cloneGraph(self, node: Optional[Node]) -> Optional[Node]:
        if not node:
            return None
        copies = {node: Node(node.val)}
        q = deque([node])
        while q:
            cur = q.popleft()
            for nb in cur.neighbors:
                if nb not in copies:
                    copies[nb] = Node(nb.val)
                    q.append(nb)
                copies[cur].neighbors.append(copies[nb])
        return copies[node]
`,
      java: `class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Map<Node, Node> copies = new HashMap<>();
        copies.put(node, new Node(node.val));
        Deque<Node> q = new ArrayDeque<>(List.of(node));
        while (!q.isEmpty()) {
            Node cur = q.poll();
            for (Node nb : cur.neighbors) {
                if (!copies.containsKey(nb)) {
                    copies.put(nb, new Node(nb.val));
                    q.offer(nb);
                }
                copies.get(cur).neighbors.add(copies.get(nb));
            }
        }
        return copies.get(node);
    }
}
`,
    },
  },
  {
    id: 'number-of-provinces',
    title: 'Number of Provinces',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'There are `n` cities. `isConnected[i][j] = 1` if cities `i` and `j` are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces.',
    constraints: ['`1 <= n <= 200`', '`isConnected[i][i] == 1`, symmetric'],
    sig: { name: 'findCircleNum', params: [{ name: 'isConnected', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 },
      { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3 },
      { args: [[[1]]], expected: 1 },
      { args: [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], expected: 1 },
    ],
    hints: ['Count connected components.', 'Use DFS/BFS from each unvisited city, or Union-Find.'],
    approaches: [
      { name: 'DFS components', idea: 'Each DFS from an unvisited city discovers one whole province.', time: 'O(n²)', space: 'O(n)' },
      { name: 'Union-Find', idea: 'Union every connected pair; count distinct roots.', time: 'O(n² α(n))', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        seen = [False] * n

        def dfs(i):
            seen[i] = True
            for j in range(n):
                if isConnected[i][j] and not seen[j]:
                    dfs(j)

        count = 0
        for i in range(n):
            if not seen[i]:
                count += 1
                dfs(i)
        return count
`,
      java: `class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, count = 0;
        boolean[] seen = new boolean[n];
        for (int i = 0; i < n; i++)
            if (!seen[i]) { count++; dfs(isConnected, seen, i); }
        return count;
    }

    private void dfs(int[][] g, boolean[] seen, int i) {
        seen[i] = true;
        for (int j = 0; j < g.length; j++) if (g[i][j] == 1 && !seen[j]) dfs(g, seen, j);
    }
}
`,
    },
  },
  {
    id: 'evaluate-division',
    title: 'Evaluate Division',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'You are given equations `equations[i] = [A, B]` with `values[i]` meaning `A / B = values[i]`. For each query `[C, D]`, return `C / D`, or `-1.0` if it cannot be determined. Variables not in any equation are undetermined (even `x / x`).',
    constraints: ['`1 <= equations.length <= 20`', '`1 <= queries.length <= 20`', 'No contradictions; no division by zero'],
    sig: {
      name: 'calcEquation',
      params: [
        { name: 'equations', type: 'List<List<string>>' },
        { name: 'values', type: 'List<double>' },
        { name: 'queries', type: 'List<List<string>>' },
      ],
      returns: 'List<double>',
    },
    tests: [
      { args: [[['a', 'b'], ['b', 'c']], [2.0, 3.0], [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a'], ['x', 'x']]], expected: [6.0, 0.5, -1.0, 1.0, -1.0] },
      { args: [[['a', 'b'], ['b', 'c'], ['bc', 'cd']], [1.5, 2.5, 5.0], [['a', 'c'], ['c', 'b'], ['bc', 'cd'], ['cd', 'bc']]], expected: [3.75, 0.4, 5.0, 0.2] },
      { args: [[['a', 'b']], [0.5], [['a', 'b'], ['b', 'a'], ['a', 'c'], ['x', 'y']]], expected: [0.5, 2.0, -1.0, -1.0] },
    ],
    hints: ['Model each variable as a node and `A / B = v` as edges A→B (weight v) and B→A (weight 1/v).', 'A query is the product of weights along any path from C to D.'],
    approaches: [{ name: 'Weighted graph + DFS', idea: 'Build the graph, then for each query DFS from C multiplying weights until reaching D.', time: 'O(Q · (V + E))', space: 'O(V + E)' }],
    solution: {
      python: `class Solution:
    def calcEquation(self, equations: List[List[str]], values: List[float], queries: List[List[str]]) -> List[float]:
        graph = defaultdict(dict)
        for (a, b), v in zip(equations, values):
            graph[a][b] = v
            graph[b][a] = 1 / v

        def dfs(cur, target, acc, seen):
            if cur == target:
                return acc
            seen.add(cur)
            for nxt, w in graph[cur].items():
                if nxt not in seen:
                    r = dfs(nxt, target, acc * w, seen)
                    if r != -1.0:
                        return r
            return -1.0

        return [dfs(c, d, 1.0, set()) if c in graph and d in graph else -1.0 for c, d in queries]
`,
      java: `class Solution {
    private Map<String, Map<String, Double>> graph = new HashMap<>();

    public List<Double> calcEquation(List<List<String>> equations, List<Double> values, List<List<String>> queries) {
        for (int i = 0; i < equations.size(); i++) {
            String a = equations.get(i).get(0), b = equations.get(i).get(1);
            double v = values.get(i);
            graph.computeIfAbsent(a, k -> new HashMap<>()).put(b, v);
            graph.computeIfAbsent(b, k -> new HashMap<>()).put(a, 1 / v);
        }
        List<Double> res = new ArrayList<>();
        for (List<String> q : queries) {
            String c = q.get(0), d = q.get(1);
            res.add(graph.containsKey(c) && graph.containsKey(d) ? dfs(c, d, 1.0, new HashSet<>()) : -1.0);
        }
        return res;
    }

    private double dfs(String cur, String target, double acc, Set<String> seen) {
        if (cur.equals(target)) return acc;
        seen.add(cur);
        for (Map.Entry<String, Double> e : graph.get(cur).entrySet()) {
            if (seen.contains(e.getKey())) continue;
            double r = dfs(e.getKey(), target, acc * e.getValue(), seen);
            if (r != -1.0) return r;
        }
        return -1.0;
    }
}
`,
    },
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'There are `numCourses` courses labelled `0` to `numCourses - 1`. `prerequisites[i] = [a, b]` means you must take `b` before `a`. Return `true` if you can finish all courses.',
    constraints: ['`1 <= numCourses <= 2000`', '`0 <= prerequisites.length <= 5000`'],
    sig: { name: 'canFinish', params: [{ name: 'numCourses', type: 'int' }, { name: 'prerequisites', type: 'int[][]' }], returns: 'bool' },
    tests: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false },
      { args: [3, []], expected: true },
      { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false },
      { args: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], expected: true },
    ],
    hints: ['This is cycle detection in a directed graph.', 'Kahn\'s algorithm: repeatedly take courses with no remaining prerequisites; if all get taken, there is no cycle.'],
    approaches: [{ name: 'Topological sort (Kahn)', idea: 'Track in-degrees; process zero in-degree nodes; success iff every node is processed.', time: 'O(V + E)', space: 'O(V + E)' }],
    solution: {
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        done = 0
        while q:
            u = q.popleft()
            done += 1
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return done == numCourses
`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
        int done = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            done++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return done == numCourses;
    }
}
`,
    },
  },
  {
    id: 'course-schedule-ii',
    title: 'Course Schedule II',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'Same setup as Course Schedule. Return **any** valid order in which to take all courses, or an empty array if it is impossible.',
    constraints: ['`1 <= numCourses <= 2000`'],
    sig: { name: 'findOrder', params: [{ name: 'numCourses', type: 'int' }, { name: 'prerequisites', type: 'int[][]' }], returns: 'int[]' },
    tests: [
      { args: [2, [[1, 0]]], expected: [0, 1] },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: [0, 1, 2, 3] },
      { args: [1, []], expected: [0] },
      { args: [2, [[0, 1], [1, 0]]], expected: [] },
      { args: [3, [[0, 1], [0, 2], [1, 2]]], expected: [2, 1, 0] },
    ],
    check: (args, actual, expected) => validTopo(args[0], args[1], actual, expected),
    notes: ['', 'Any order where 0 comes first and 3 comes last is accepted, e.g. [0, 2, 1, 3].'],
    hints: ['Run Kahn\'s algorithm and record the order in which courses are taken.', 'If fewer than `numCourses` were taken, return an empty array.'],
    approaches: [{ name: 'Kahn\'s algorithm', idea: 'The processing order of zero in-degree nodes is a topological order.', time: 'O(V + E)', space: 'O(V + E)' }],
    solution: {
      python: `class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        order = []
        while q:
            u = q.popleft()
            order.append(u)
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return order if len(order) == numCourses else []
`,
      java: `class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
        int[] order = new int[numCourses];
        int k = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[k++] = u;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return k == numCourses ? order : new int[0];
    }
}
`,
    },
  },
  // ---------------- Graph BFS ----------------
  {
    id: 'snakes-and-ladders',
    title: 'Snakes and Ladders',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement:
      'An `n × n` board is numbered 1 to n² in a boustrophedon pattern starting from the **bottom-left**, alternating direction each row. From square `cur` you roll a die and move to any square in `[cur+1, min(cur+6, n²)]`; if that square has a snake or ladder (`board[r][c] != -1`), you must move to its destination. Each move takes at most one snake/ladder. Return the minimum number of rolls to reach n², or `-1` if impossible.',
    constraints: ['`2 <= n <= 20`', 'Squares 1 and n² have no snake or ladder'],
    sig: { name: 'snakesAndLadders', params: [{ name: 'board', type: 'int[][]' }], returns: 'int' },
    tests: [
      {
        args: [[[-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1], [-1, 35, -1, -1, 13, -1], [-1, -1, -1, -1, -1, -1], [-1, 15, -1, -1, -1, -1]]],
        expected: 4,
      },
      { args: [[[-1, -1], [-1, 3]]], expected: 1 },
      { args: [[[-1, -1, -1], [-1, 9, 8], [-1, 8, 9]]], expected: 1 },
      { args: [[[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]], expected: 2 },
    ],
    hints: ['This is a shortest-path problem on an unweighted graph: use BFS.', 'Write a helper converting a square number to (row, col), accounting for the alternating direction from the bottom.'],
    approaches: [{ name: 'BFS over squares', idea: 'Each square links to the next six (after applying snakes/ladders). BFS gives the fewest rolls.', time: 'O(n²)', space: 'O(n²)' }],
    solution: {
      python: `class Solution:
    def snakesAndLadders(self, board: List[List[int]]) -> int:
        n = len(board)

        def cell(s):
            r, c = divmod(s - 1, n)
            row = n - 1 - r
            col = c if r % 2 == 0 else n - 1 - c
            return row, col

        dist = {1: 0}
        q = deque([1])
        while q:
            s = q.popleft()
            if s == n * n:
                return dist[s]
            for nxt in range(s + 1, min(s + 6, n * n) + 1):
                r, c = cell(nxt)
                dest = board[r][c] if board[r][c] != -1 else nxt
                if dest not in dist:
                    dist[dest] = dist[s] + 1
                    q.append(dest)
        return -1
`,
      java: `class Solution {
    public int snakesAndLadders(int[][] board) {
        int n = board.length, target = n * n;
        int[] dist = new int[target + 1];
        Arrays.fill(dist, -1);
        dist[1] = 0;
        Deque<Integer> q = new ArrayDeque<>(List.of(1));
        while (!q.isEmpty()) {
            int s = q.poll();
            if (s == target) return dist[s];
            for (int nxt = s + 1; nxt <= Math.min(s + 6, target); nxt++) {
                int r = (nxt - 1) / n, c = (nxt - 1) % n;
                int row = n - 1 - r, col = r % 2 == 0 ? c : n - 1 - c;
                int dest = board[row][col] != -1 ? board[row][col] : nxt;
                if (dist[dest] == -1) { dist[dest] = dist[s] + 1; q.offer(dest); }
            }
        }
        return -1;
    }
}
`,
    },
  },
  {
    id: 'minimum-genetic-mutation',
    title: 'Minimum Genetic Mutation',
    difficulty: 'Medium',
    topic: 'graphs',
    lc150: true,
    statement: 'A gene is an 8-character string of `A`, `C`, `G`, `T`. One mutation changes a single character, and every intermediate gene must be in `bank`. Return the minimum number of mutations from `startGene` to `endGene`, or `-1`.',
    constraints: ['`0 <= bank.length <= 10`', 'All genes have length 8'],
    sig: { name: 'minMutation', params: [{ name: 'startGene', type: 'string' }, { name: 'endGene', type: 'string' }, { name: 'bank', type: 'string[]' }], returns: 'int' },
    tests: [
      { args: ['AACCGGTT', 'AACCGGTA', ['AACCGGTA']], expected: 1 },
      { args: ['AACCGGTT', 'AAACGGTA', ['AACCGGTA', 'AACCGCTA', 'AAACGGTA']], expected: 2 },
      { args: ['AAAAACCC', 'AACCCCCC', ['AAAACCCC', 'AAACCCCC', 'AACCCCCC']], expected: 3 },
      { args: ['AACCGGTT', 'AACCGGTA', []], expected: -1 },
    ],
    hints: ['BFS from the start gene.', 'Neighbours are bank genes that differ in exactly one position (or try all 8 × 4 single-character changes).'],
    approaches: [{ name: 'BFS', idea: 'Each level of BFS is one mutation; stop when reaching the end gene.', time: 'O(B · 8 · 4)', space: 'O(B)' }],
    solution: {
      python: `class Solution:
    def minMutation(self, startGene: str, endGene: str, bank: List[str]) -> int:
        valid = set(bank)
        q = deque([(startGene, 0)])
        seen = {startGene}
        while q:
            gene, steps = q.popleft()
            if gene == endGene:
                return steps
            for i in range(8):
                for ch in 'ACGT':
                    nxt = gene[:i] + ch + gene[i + 1:]
                    if nxt in valid and nxt not in seen:
                        seen.add(nxt)
                        q.append((nxt, steps + 1))
        return -1
`,
      java: `class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        Set<String> valid = new HashSet<>(Arrays.asList(bank)), seen = new HashSet<>(List.of(startGene));
        Deque<String> q = new ArrayDeque<>(List.of(startGene));
        for (int steps = 0; !q.isEmpty(); steps++) {
            for (int size = q.size(); size > 0; size--) {
                String gene = q.poll();
                if (gene.equals(endGene)) return steps;
                char[] c = gene.toCharArray();
                for (int i = 0; i < 8; i++) {
                    char orig = c[i];
                    for (char ch : "ACGT".toCharArray()) {
                        c[i] = ch;
                        String nxt = new String(c);
                        if (valid.contains(nxt) && seen.add(nxt)) q.offer(nxt);
                    }
                    c[i] = orig;
                }
            }
        }
        return -1;
    }
}
`,
    },
  },
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    topic: 'graphs',
    lc150: true,
    statement: 'Given `beginWord`, `endWord` and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, changing one letter at a time, where every intermediate word is in `wordList`. Return `0` if no sequence exists.',
    constraints: ['`1 <= beginWord.length <= 10`', '`1 <= wordList.length <= 5000`'],
    sig: { name: 'ladderLength', params: [{ name: 'beginWord', type: 'string' }, { name: 'endWord', type: 'string' }, { name: 'wordList', type: 'List<string>' }], returns: 'int' },
    tests: [
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
      { args: ['a', 'c', ['a', 'b', 'c']], expected: 2 },
      { args: ['hot', 'dog', ['hot', 'dog']], expected: 0 },
    ],
    notes: ['hit → hot → dot → dog → cog has 5 words.'],
    hints: ['BFS where each word connects to words one letter apart.', 'Generate neighbours by trying every letter a–z at every position, checking membership in a set.'],
    approaches: [{ name: 'BFS with letter substitution', idea: 'Level-by-level BFS from `beginWord`; remove words from the set when visited.', time: 'O(N · L · 26)', space: 'O(N)' }],
    solution: {
      python: `class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        words = set(wordList)
        if endWord not in words:
            return 0
        q = deque([(beginWord, 1)])
        while q:
            word, steps = q.popleft()
            if word == endWord:
                return steps
            for i in range(len(word)):
                for ch in 'abcdefghijklmnopqrstuvwxyz':
                    nxt = word[:i] + ch + word[i + 1:]
                    if nxt in words:
                        words.remove(nxt)
                        q.append((nxt, steps + 1))
        return 0
`,
      java: `class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return 0;
        Deque<String> q = new ArrayDeque<>(List.of(beginWord));
        for (int steps = 1; !q.isEmpty(); steps++) {
            for (int size = q.size(); size > 0; size--) {
                String w = q.poll();
                if (w.equals(endWord)) return steps;
                char[] c = w.toCharArray();
                for (int i = 0; i < c.length; i++) {
                    char orig = c[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        c[i] = ch;
                        String nxt = new String(c);
                        if (words.remove(nxt)) q.offer(nxt);
                    }
                    c[i] = orig;
                }
            }
        }
        return 0;
    }
}
`,
    },
  },
  // ---------------- Trie ----------------
  {
    id: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    topic: 'trie',
    lc150: true,
    statement: 'Implement a `Trie` with `insert(word)`, `search(word)` (is the exact word present?) and `startsWith(prefix)` (does any word start with the prefix?).',
    constraints: ['Lowercase letters; length ≤ 2000', 'At most `3 * 10^4` calls'],
    sig: {
      kind: 'design',
      className: 'Trie',
      ctor: [],
      methods: [
        { name: 'insert', params: [{ name: 'word', type: 'string' }], returns: 'void' },
        { name: 'search', params: [{ name: 'word', type: 'string' }], returns: 'bool' },
        { name: 'startsWith', params: [{ name: 'prefix', type: 'string' }], returns: 'bool' },
      ],
    },
    tests: [
      { args: [['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'], [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']]], expected: [null, null, true, false, true, null, true] },
      { args: [['Trie', 'insert', 'insert', 'startsWith', 'search', 'search'], [[], ['ab'], ['abc'], ['b'], ['ab'], ['abcd']]], expected: [null, null, null, false, true, false] },
    ],
    hints: ['Each node has up to 26 children and an end-of-word flag.', 'Search and startsWith walk the same path; only the final check differs.'],
    approaches: [{ name: 'Node with child array/map', idea: 'Insert creates missing nodes along the path; queries walk the path and check the flag.', time: 'O(L) per operation', space: 'O(total characters)' }],
    solution: {
      python: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and '$' in node

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None
`,
      java: `class Trie {
    private final Trie[] next = new Trie[26];
    private boolean end;

    public void insert(String word) {
        Trie node = this;
        for (char ch : word.toCharArray()) {
            if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new Trie();
            node = node.next[ch - 'a'];
        }
        node.end = true;
    }

    private Trie walk(String s) {
        Trie node = this;
        for (char ch : s.toCharArray()) {
            node = node.next[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    public boolean search(String word) { Trie n = walk(word); return n != null && n.end; }

    public boolean startsWith(String prefix) { return walk(prefix) != null; }
}
`,
    },
  },
  {
    id: 'design-add-search-words',
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    topic: 'trie',
    lc150: true,
    statement: 'Design `WordDictionary` with `addWord(word)` and `search(word)`, where `search` may contain `.` characters that match any single letter.',
    constraints: ['`1 <= word.length <= 25`', 'At most 2 dots per search query'],
    sig: {
      kind: 'design',
      className: 'WordDictionary',
      ctor: [],
      methods: [
        { name: 'addWord', params: [{ name: 'word', type: 'string' }], returns: 'void' },
        { name: 'search', params: [{ name: 'word', type: 'string' }], returns: 'bool' },
      ],
    },
    tests: [
      { args: [['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'], [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']]], expected: [null, null, null, null, false, true, true, true] },
      { args: [['WordDictionary', 'addWord', 'search', 'search', 'search'], [[], ['a'], ['.'], ['a.'], ['..']]], expected: [null, null, true, false, false] },
    ],
    hints: ['Store words in a trie.', 'For `.`, recursively try every child at that position.'],
    approaches: [{ name: 'Trie + DFS for wildcards', idea: 'Exact letters follow one branch; dots branch to all children.', time: 'O(L) add, O(26^d · L) search', space: 'O(total characters)' }],
    solution: {
      python: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):
                return '$' in node
            ch = word[i]
            if ch == '.':
                return any(dfs(child, i + 1) for k, child in node.items() if k != '$')
            return ch in node and dfs(node[ch], i + 1)
        return dfs(self.root, 0)
`,
      java: `class WordDictionary {
    private final WordDictionary[] next = new WordDictionary[26];
    private boolean end;

    public void addWord(String word) {
        WordDictionary node = this;
        for (char ch : word.toCharArray()) {
            if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new WordDictionary();
            node = node.next[ch - 'a'];
        }
        node.end = true;
    }

    public boolean search(String word) { return dfs(this, word, 0); }

    private boolean dfs(WordDictionary node, String w, int i) {
        if (i == w.length()) return node.end;
        char ch = w.charAt(i);
        if (ch == '.') {
            for (WordDictionary child : node.next) if (child != null && dfs(child, w, i + 1)) return true;
            return false;
        }
        WordDictionary child = node.next[ch - 'a'];
        return child != null && dfs(child, w, i + 1);
    }
}
`,
    },
  },
  {
    id: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    topic: 'trie',
    lc150: true,
    statement: 'Given an `m × n` board of letters and a list of `words`, return all words that can be formed on the board. A word is built from sequentially adjacent cells (horizontally or vertically); a cell may not be reused within one word. Return the words in any order.',
    constraints: ['`1 <= m, n <= 12`', '`1 <= words.length <= 3 * 10^4`'],
    sig: { name: 'findWords', params: [{ name: 'board', type: 'char[][]' }, { name: 'words', type: 'string[]' }], returns: 'List<string>' },
    compare: 'unordered',
    tests: [
      { args: [g(['oaan', 'etae', 'ihkr', 'iflv']), ['oath', 'pea', 'eat', 'rain']], expected: ['eat', 'oath'] },
      { args: [g(['ab', 'cd']), ['abcb']], expected: [] },
      { args: [g(['a']), ['a', 'b']], expected: ['a'] },
      { args: [g(['ab', 'cd']), ['abdc', 'acdb', 'ab', 'ba']], expected: ['abdc', 'acdb', 'ab', 'ba'] },
    ],
    hints: ['Searching each word separately repeats work. Put all words in a trie.', 'DFS from each cell while following trie edges; record a word when you reach its end node, and prune finished branches.'],
    approaches: [{ name: 'Trie-guided backtracking', idea: 'One DFS per starting cell explores only prefixes that exist in the trie. Mark found words to avoid duplicates.', time: 'O(m·n·4^L) worst case, much faster in practice', space: 'O(total characters)' }],
    solution: {
      python: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for w in words:
            node = root
            for ch in w:
                node = node.setdefault(ch, {})
            node['$'] = w
        m, n, res = len(board), len(board[0]), []

        def dfs(r, c, node):
            ch = board[r][c]
            nxt = node.get(ch)
            if not nxt:
                return
            if '$' in nxt:
                res.append(nxt.pop('$'))
            board[r][c] = '#'
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != '#':
                    dfs(nr, nc, nxt)
            board[r][c] = ch
            if not nxt:
                node.pop(ch)

        for r in range(m):
            for c in range(n):
                dfs(r, c, root)
        return res
`,
      java: `class Solution {
    private static class Node { Node[] next = new Node[26]; String word; }
    private final List<String> res = new ArrayList<>();

    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node n = root;
            for (char ch : w.toCharArray()) {
                if (n.next[ch - 'a'] == null) n.next[ch - 'a'] = new Node();
                n = n.next[ch - 'a'];
            }
            n.word = w;
        }
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++) dfs(board, r, c, root);
        return res;
    }

    private void dfs(char[][] b, int r, int c, Node node) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] == '#') return;
        char ch = b[r][c];
        Node nxt = node.next[ch - 'a'];
        if (nxt == null) return;
        if (nxt.word != null) { res.add(nxt.word); nxt.word = null; }
        b[r][c] = '#';
        dfs(b, r + 1, c, nxt); dfs(b, r - 1, c, nxt); dfs(b, r, c + 1, nxt); dfs(b, r, c - 1, nxt);
        b[r][c] = ch;
    }
}
`,
    },
  },
];

export default problems;
