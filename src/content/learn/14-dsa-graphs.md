=== graph-basics | Graphs: Representation
summary: Vertices and edges — directed, undirected, weighted — and how to store them.
practice: number-of-provinces, find-center-of-star
---
A **graph** is a set of **vertices** (nodes) connected by **edges**. Graphs model road networks, social connections, dependencies between tasks, web links — anything with relationships.

:::viz graph A-B,A-C,B-D,C-D,D-E | caption=An undirected graph with 5 vertices and 5 edges
:::

## Kinds of graphs

- **Undirected** (friendship) vs **directed** (follows, prerequisites).
- **Weighted** (road distances) vs **unweighted**.
- **Cyclic** vs **acyclic**; a directed acyclic graph is a **DAG**.
- A **tree** is a connected, acyclic undirected graph with n − 1 edges.
- A **grid** is an implicit graph: each cell connects to its neighbours.

## Adjacency list

The standard representation: for each vertex, a list of its neighbours. Space O(V + E).

```python title="Build an adjacency list from an edge list"
from collections import defaultdict

edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)          # omit for a directed graph

for node in sorted(graph):
    print(node, "->", graph[node])
print("degree of 3:", len(graph[3]))
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}};
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : edges) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);   // omit for a directed graph
        }
        for (int i = 0; i < n; i++) System.out.println(i + " -> " + graph.get(i));
        System.out.println("degree of 3: " + graph.get(3).size());
    }
}
```
```output
0 -> [1, 2]
1 -> [0, 3]
2 -> [0, 3]
3 -> [1, 2, 4]
4 -> [3]
degree of 3: 3
```

## Adjacency matrix

`matrix[u][v] = 1` (or the weight) if there's an edge. O(1) edge lookup, but O(V²) space — good for small dense graphs.

| | Adjacency list | Adjacency matrix |
|---|---|---|
| Space | O(V + E) | O(V²) |
| Is there an edge u–v? | O(deg u) | O(1) |
| Iterate neighbours of u | O(deg u) | O(V) |
| Best for | sparse graphs (most problems) | dense / small graphs |

:::tip
In interviews, graphs often arrive as an **edge list** (`[[0,1],[1,2]]`), a **grid**, or a **dictionary of neighbours**. Converting to an adjacency list is usually step one.
:::

=== bfs-dfs | BFS & DFS
summary: The two fundamental ways to explore a graph, and what each is good for.
practice: number-of-islands, surrounded-regions, course-schedule, rotting-oranges
---
**Depth-first search** (DFS) goes as deep as possible before backtracking — natural with recursion or a stack. **Breadth-first search** (BFS) explores in rings of increasing distance — uses a queue, and finds **shortest paths in unweighted graphs**.

Both visit every vertex and edge once: **O(V + E)**. Both need a `visited` set so cycles don't cause infinite loops.

:::viz graph 0-1,0-2,1-3,2-3,3-4 | hl=0 | caption=Start at 0 — DFS: 0 1 3 2 4 · BFS: 0 1 2 3 4
:::

```python title="DFS and BFS from vertex 0"
from collections import deque

graph = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}

def dfs(node, visited, order):
    visited.add(node)
    order.append(node)
    for nb in graph[node]:
        if nb not in visited:
            dfs(nb, visited, order)
    return order

def bfs(start):
    visited, order = {start}, []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)          # mark when enqueued
                q.append(nb)
    return order

print("DFS:", dfs(0, set(), []))
print("BFS:", bfs(0))
```
```java
import java.util.*;

public class Main {
    static int[][] graph = {{1, 2}, {0, 3}, {0, 3}, {1, 2, 4}, {3}};

    static void dfs(int node, boolean[] visited, List<Integer> order) {
        visited[node] = true;
        order.add(node);
        for (int nb : graph[node]) if (!visited[nb]) dfs(nb, visited, order);
    }

    static List<Integer> bfs(int start) {
        boolean[] visited = new boolean[graph.length];
        List<Integer> order = new ArrayList<>();
        Deque<Integer> q = new ArrayDeque<>();
        visited[start] = true;
        q.offer(start);
        while (!q.isEmpty()) {
            int node = q.poll();
            order.add(node);
            for (int nb : graph[node]) {
                if (!visited[nb]) { visited[nb] = true; q.offer(nb); }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        List<Integer> d = new ArrayList<>();
        dfs(0, new boolean[graph.length], d);
        System.out.println("DFS: " + d);
        System.out.println("BFS: " + bfs(0));
    }
}
```
```output
DFS: [0, 1, 3, 2, 4]
BFS: [0, 1, 2, 3, 4]
```

## Grids: counting islands

Each unvisited land cell starts a new island; a DFS "sinks" every connected land cell so it isn't counted again.

```python title="Number of islands"
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count

grid = [list("11000"), list("11000"), list("00100"), list("00011")]
print(num_islands(grid))
```
```java
public class Main {
    static void sink(char[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
    }

    static int numIslands(char[][] g) {
        int count = 0;
        for (int r = 0; r < g.length; r++)
            for (int c = 0; c < g[0].length; c++)
                if (g[r][c] == '1') { count++; sink(g, r, c); }
        return count;
    }

    public static void main(String[] args) {
        char[][] g = {"11000".toCharArray(), "11000".toCharArray(), "00100".toCharArray(), "00011".toCharArray()};
        System.out.println(numIslands(g));
    }
}
```
```output
3
```

| Use | DFS | BFS |
|---|---|---|
| Visit everything / connected components | ✓ | ✓ |
| Shortest path (unweighted) | | ✓ |
| Detect cycles, topological sort | ✓ | ✓ (Kahn) |
| Backtracking / path enumeration | ✓ | |

:::warning
- In BFS, mark a node visited **when you enqueue it**, not when you dequeue it — otherwise the same node can be queued many times.
- Recursive DFS on a big grid (e.g. 1000 × 1000) can overflow the stack; switch to an explicit stack or BFS.
:::

=== shortest-paths | Shortest Paths
summary: BFS for unweighted graphs, Dijkstra for non-negative weights, and when to use each.
practice: network-delay-time, word-ladder, minimum-genetic-mutation
---
The right shortest-path algorithm depends on the edge weights.

| Graph | Algorithm | Time |
|---|---|---|
| Unweighted (all edges cost 1) | BFS | O(V + E) |
| Non-negative weights | Dijkstra | O((V + E) log V) |
| Negative weights allowed | Bellman–Ford | O(V · E) |
| All pairs, small V | Floyd–Warshall | O(V³) |

:::viz graph A-B:4,A-C:1,C-B:2,B-D:1,C-D:5 | caption=Shortest A → D is A → C → B → D with cost 1 + 2 + 1 = 4
:::

## Dijkstra's algorithm

Repeatedly settle the unvisited vertex with the smallest known distance (using a min-heap), then relax its outgoing edges. With non-negative weights, once a vertex is popped its distance is final.

```python title="Dijkstra with a heap"
import heapq

def dijkstra(graph, src):
    dist = {node: float("inf") for node in graph}
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue                      # stale entry
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    return dist

graph = {
    "A": [("B", 4), ("C", 1)],
    "B": [("A", 4), ("C", 2), ("D", 1)],
    "C": [("A", 1), ("B", 2), ("D", 5)],
    "D": [("B", 1), ("C", 5)],
}
print(dijkstra(graph, "A"))
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // vertices: A=0, B=1, C=2, D=3
        int n = 4;
        int[][] edges = {{0, 1, 4}, {0, 2, 1}, {2, 1, 2}, {1, 3, 1}, {2, 3, 5}};
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) {
            g.get(e[0]).add(new int[]{e[1], e[2]});
            g.get(e[1]).add(new int[]{e[0], e[2]});
        }
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, 0});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;            // stale entry
            for (int[] e : g.get(u)) {
                int v = e[0], w = e[1];
                if (d + w < dist[v]) {
                    dist[v] = d + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        System.out.println(Arrays.toString(dist));
    }
}
```
```output-python
{'A': 0, 'B': 3, 'C': 1, 'D': 4}
```
```output-java
[0, 3, 1, 4]
```

## Dry run

| Pop (dist, node) | Relaxations | dist after |
|---|---|---|
| (0, A) | B = 4, C = 1 | A0 B4 C1 D∞ |
| (1, C) | B = min(4, 1+2) = 3, D = 6 | A0 B3 C1 D6 |
| (3, B) | D = min(6, 3+1) = 4 | A0 B3 C1 D4 |
| (4, B) stale entry skipped… (4, D) settled | — | final |

:::warning
- Dijkstra is **wrong** with negative edge weights — use Bellman–Ford.
- Skip stale heap entries (`if d > dist[u]: continue`); otherwise the algorithm still works but does extra work.
- For unweighted graphs, BFS is simpler and faster.
:::

=== topological-sort | Topological Sort
summary: Order tasks so every prerequisite comes first — and detect cycles in directed graphs.
practice: course-schedule, course-schedule-ii
---
A **topological order** of a directed graph lists vertices so that every edge `u → v` has `u` before `v`. It exists only for **DAGs** (directed acyclic graphs). Typical uses: course prerequisites, build systems, task scheduling.

:::viz graph A>C,B>C,C>D,B>E,E>D | caption=One valid order: A, B, E, C, D
:::

## Kahn's algorithm (BFS on in-degrees)

1. Count each vertex's **in-degree** (incoming edges).
2. Start with all vertices of in-degree 0.
3. Repeatedly remove one, append it to the order, and decrement its neighbours' in-degrees; enqueue any that drop to 0.
4. If the order has fewer than V vertices, the graph has a **cycle**.

```python title="Course order with Kahn's algorithm"
from collections import deque

def find_order(n, prereqs):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for course, pre in prereqs:
        graph[pre].append(course)
        indeg[course] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []      # [] means a cycle

print(find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
print(find_order(2, [[0, 1], [1, 0]]))
```
```java
import java.util.*;

public class Main {
    static List<Integer> findOrder(int n, int[][] prereqs) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] p : prereqs) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return order.size() == n ? order : new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(findOrder(4, new int[][]{{1, 0}, {2, 0}, {3, 1}, {3, 2}}));
        System.out.println(findOrder(2, new int[][]{{0, 1}, {1, 0}}));
    }
}
```
```output
[0, 1, 2, 3]
[]
```

:::complexity
Time: O(V + E)
Space: O(V + E)
:::

:::tip
DFS also produces a topological order: record each vertex **after** all its descendants finish (post-order), then reverse. Use three colours (unvisited / in progress / done) — reaching an "in progress" vertex means a cycle.
:::
