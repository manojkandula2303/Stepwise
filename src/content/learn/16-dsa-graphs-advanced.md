=== cycle-detection | Cycle Detection
summary: Detect cycles in undirected graphs (parent tracking, union-find) and directed graphs (three-colour DFS).
practice: course-schedule, redundant-connection, find-eventual-safe-states
---
A **cycle** is a path that starts and ends at the same vertex. Whether a graph has one decides a lot: a directed graph can be topologically sorted only if it has no cycle, and an undirected graph is a tree exactly when it is connected and acyclic.

The rule for spotting a cycle differs between undirected and directed graphs, and mixing them up is a classic bug.

## Undirected graphs: a visited neighbour that isn't your parent

During DFS, every edge leads either to an unvisited vertex (explore it) or to a visited one. In an undirected graph, the edge back to the vertex you just came from (your **parent**) is the same edge seen from the other side, so ignore it. Any *other* visited neighbour closes a cycle.

:::viz graph 0-1,1-2,2-0,2-3 | hl=0,1,2 | caption=0 – 1 – 2 – 0 is a cycle; edge 2 – 3 is not part of any cycle
:::

```python title="Undirected cycle check with DFS"
def has_cycle_undirected(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = [False] * n

    def dfs(u, parent):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                if dfs(v, u):
                    return True
            elif v != parent:      # visited and not where we came from
                return True
        return False

    return any(not seen[u] and dfs(u, -1) for u in range(n))

print(has_cycle_undirected(3, [(0, 1), (1, 2), (2, 0)]))
print(has_cycle_undirected(4, [(0, 1), (1, 2), (2, 3)]))
```
```java
import java.util.*;

public class Main {
    static List<List<Integer>> adj;
    static boolean[] seen;

    static boolean dfs(int u, int parent) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                if (dfs(v, u)) return true;
            } else if (v != parent) {      // visited and not where we came from
                return true;
            }
        }
        return false;
    }

    static boolean hasCycleUndirected(int n, int[][] edges) {
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        seen = new boolean[n];
        for (int u = 0; u < n; u++) if (!seen[u] && dfs(u, -1)) return true;
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasCycleUndirected(3, new int[][]{{0, 1}, {1, 2}, {2, 0}}));
        System.out.println(hasCycleUndirected(4, new int[][]{{0, 1}, {1, 2}, {2, 3}}));
    }
}
```
```output-python
True
False
```
```output-java
true
false
```

:::tip
Union-Find is often simpler for undirected graphs: process edges one by one, and if both endpoints already share a root, that edge closes a cycle. That is exactly how **Redundant Connection** and Kruskal's algorithm work.
:::

## Directed graphs: three colours

In a directed graph, reaching an already-visited vertex is **not** enough. In the graph `0 → 1, 0 → 2, 1 → 3, 2 → 3`, DFS reaches 3 twice but there is no cycle. What matters is whether the visited vertex is **still on the current DFS path**.

Track three states per vertex:

| Colour | Meaning |
|---|---|
| White | not visited yet |
| Grey | visited, still on the current recursion path |
| Black | finished: it and everything reachable from it are explored |

An edge into a **grey** vertex is a *back edge*, and it means a cycle.

```python title="Directed cycle check with colours"
def has_cycle_directed(n, adj):
    WHITE, GREY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(u):
        color[u] = GREY
        for v in adj[u]:
            if color[v] == GREY:            # back edge -> cycle
                return True
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False

    return any(color[u] == WHITE and dfs(u) for u in range(n))

print(has_cycle_directed(4, [[1], [2], [0], [2]]))
print(has_cycle_directed(4, [[1, 2], [3], [3], []]))
```
```java
public class Main {
    static int[][] adj;
    static int[] color;   // 0 white, 1 grey, 2 black

    static boolean dfs(int u) {
        color[u] = 1;
        for (int v : adj[u]) {
            if (color[v] == 1) return true;              // back edge -> cycle
            if (color[v] == 0 && dfs(v)) return true;
        }
        color[u] = 2;
        return false;
    }

    static boolean hasCycleDirected(int[][] graph) {
        adj = graph;
        color = new int[graph.length];
        for (int u = 0; u < graph.length; u++) if (color[u] == 0 && dfs(u)) return true;
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasCycleDirected(new int[][]{{1}, {2}, {0}, {2}}));
        System.out.println(hasCycleDirected(new int[][]{{1, 2}, {3}, {3}, {}}));
    }
}
```
```output-python
True
False
```
```output-java
true
false
```

## Dry run — directed graph `0 → 1 → 2 → 0`, `3 → 2`

| Step | Action | Colours (0 1 2 3) |
|---|---|---|
| 1 | visit 0 | G W W W |
| 2 | visit 1 | G G W W |
| 3 | visit 2 | G G G W |
| 4 | edge 2 → 0, and 0 is grey | **cycle found** |

:::complexity
Time: O(V + E)
Space: O(V) for colours and recursion
:::

:::warning
- Using the undirected "visited and not parent" rule on a directed graph reports false cycles.
- Using a plain visited set (two colours) on a directed graph also reports false cycles; you need the grey "on the current path" state.
- Kahn's algorithm (topological sort) detects directed cycles too: if it can't remove every vertex, a cycle remains.
:::

:::quiz
Q: DFS on a **directed** graph reaches vertex 5, which is already **black**. What does that tell you?
- There is a cycle through 5
- [x] Nothing about cycles: 5 was fully explored on an earlier branch
- The graph is disconnected
- The graph is undirected
> A black vertex is finished and not on the current path, so this edge is a cross or forward edge. Only an edge to a grey vertex signals a cycle.
:::

=== bipartite-graphs | Bipartite Graphs
summary: Split vertices into two groups so every edge crosses between them — two-colouring with BFS.
practice: is-graph-bipartite, possible-bipartition
---
A graph is **bipartite** if its vertices can be split into two groups so that every edge connects a vertex in one group to a vertex in the other. Equivalently, you can colour every vertex red or blue so that no edge joins two vertices of the same colour.

Bipartite graphs model two-sided relationships: students and courses, workers and jobs, "these two people must be on different teams".

:::viz graph 0-1,1-2,2-3,3-0 | hl=0,2 | caption=A 4-cycle is bipartite: {0, 2} and {1, 3}
:::

:::tip
**Key fact:** a graph is bipartite if and only if it contains **no odd-length cycle**. A triangle (3-cycle) can never be two-coloured.
:::

## Two-colouring with BFS

Give the start vertex colour 0; every neighbour must get the opposite colour. If you ever find an edge whose ends already share a colour, the graph is not bipartite. Repeat from every uncoloured vertex, because the graph may be disconnected.

```python title="Check bipartiteness and return the colouring"
from collections import deque

def is_bipartite(adj):
    color = [-1] * len(adj)
    for s in range(len(adj)):
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
                    return False, color
    return True, color

print(is_bipartite([[1, 3], [0, 2], [1, 3], [0, 2]]))
print(is_bipartite([[1, 2], [0, 2], [0, 1]])[0])
```
```java
import java.util.*;

public class Main {
    static int[] color;

    static boolean isBipartite(int[][] adj) {
        color = new int[adj.length];
        Arrays.fill(color, -1);
        for (int s = 0; s < adj.length; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            Deque<Integer> q = new ArrayDeque<>(List.of(s));
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : adj[u]) {
                    if (color[v] == -1) { color[v] = 1 - color[u]; q.offer(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isBipartite(new int[][]{{1, 3}, {0, 2}, {1, 3}, {0, 2}}) + " " + Arrays.toString(color));
        System.out.println(isBipartite(new int[][]{{1, 2}, {0, 2}, {0, 1}}));
    }
}
```
```output-python
(True, [0, 1, 0, 1])
False
```
```output-java
true [0, 1, 0, 1]
false
```

## Dry run — triangle `0 – 1 – 2 – 0`

| Dequeue | Neighbour | Action |
|---|---|---|
| 0 (colour 0) | 1 | colour 1 → 1 |
| | 2 | colour 2 → 1 |
| 1 (colour 1) | 0 | ok (different) |
| | 2 | **same colour (1 and 1)** → not bipartite |

:::complexity
Time: O(V + E)
Space: O(V)
:::

:::warning
- Start a new BFS from every uncoloured vertex; checking only from vertex 0 misses other components.
- DFS works equally well. Union-Find also works: union all neighbours of each vertex together, and fail if a vertex ends up in the same set as one of its neighbours.
:::

=== minimum-spanning-tree | Minimum Spanning Trees
summary: Connect every vertex at the lowest total cost — Kruskal's algorithm with union-find, and Prim's algorithm with a heap.
practice: min-cost-connect-points
---
Given a connected, weighted, undirected graph, a **spanning tree** connects all `V` vertices using exactly `V − 1` edges and no cycles. A **minimum spanning tree** (MST) is a spanning tree whose total edge weight is as small as possible.

Typical uses: laying cable or pipes between buildings at minimum cost, network design, clustering.

:::viz graph A-B:2,A-D:6,B-C:3,B-D:8,B-E:5,C-E:7,D-E:9 | caption=MST: A–B (2), B–C (3), B–E (5), A–D (6), total 16
:::

Both classic algorithms are **greedy** and rely on the *cut property*: for any way of splitting the vertices into two groups, the cheapest edge crossing between them belongs to some MST.

## Kruskal's algorithm

1. Sort all edges by weight.
2. Take edges from cheapest to most expensive, adding an edge **only if it joins two different components** (use Union-Find).
3. Stop after `V − 1` edges.

```python title="Kruskal with union-find"
def kruskal(n, edges):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total, chosen = 0, []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:              # different components: safe to add
            parent[ru] = rv
            total += w
            chosen.append((u, v, w))
    return total, chosen

edges = [(0, 1, 2), (0, 3, 6), (1, 2, 3), (1, 3, 8), (1, 4, 5), (2, 4, 7), (3, 4, 9)]
total, chosen = kruskal(5, edges)
print(total, chosen)
```
```java
import java.util.*;

public class Main {
    static int[] parent;

    static int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1, 2}, {0, 3, 6}, {1, 2, 3}, {1, 3, 8}, {1, 4, 5}, {2, 4, 7}, {3, 4, 9}};
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int total = 0;
        List<String> chosen = new ArrayList<>();
        for (int[] e : edges) {
            int ru = find(e[0]), rv = find(e[1]);
            if (ru != rv) {             // different components: safe to add
                parent[ru] = rv;
                total += e[2];
                chosen.add("(" + e[0] + ", " + e[1] + ", " + e[2] + ")");
            }
        }
        System.out.println(total + " " + chosen);
    }
}
```
```output
16 [(0, 1, 2), (1, 2, 3), (1, 4, 5), (0, 3, 6)]
```

## Dry run

| Edge (weight) | Same component? | Action |
|---|---|---|
| 0–1 (2) | no | add, total 2 |
| 1–2 (3) | no | add, total 5 |
| 1–4 (5) | no | add, total 10 |
| 0–3 (6) | no | add, total 16 — 4 edges, done |
| 2–4 (7) | yes (2 and 4 already joined through 1) | skip |

## Prim's algorithm

Grow one tree from a start vertex. Repeatedly take the cheapest edge that leaves the tree, using a min-heap of candidate edges.

```python title="Prim with a heap"
import heapq

def prim(n, edges):
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((w, v))
        adj[v].append((w, u))
    in_tree = [False] * n
    heap = [(0, 0)]               # (edge weight, vertex), start at 0
    total = 0
    while heap:
        w, u = heapq.heappop(heap)
        if in_tree[u]:
            continue              # stale entry
        in_tree[u] = True
        total += w
        for edge in adj[u]:
            if not in_tree[edge[1]]:
                heapq.heappush(heap, edge)
    return total

edges = [(0, 1, 2), (0, 3, 6), (1, 2, 3), (1, 3, 8), (1, 4, 5), (2, 4, 7), (3, 4, 9)]
print(prim(5, edges))
```
```java
import java.util.*;

public class Main {
    static int prim(int n, int[][] edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[2], e[1]});
            adj.get(e[1]).add(new int[]{e[2], e[0]});
        }
        boolean[] inTree = new boolean[n];
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.add(new int[]{0, 0});    // (edge weight, vertex), start at 0
        int total = 0;
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            if (inTree[top[1]]) continue;           // stale entry
            inTree[top[1]] = true;
            total += top[0];
            for (int[] e : adj.get(top[1])) if (!inTree[e[1]]) heap.add(e);
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 2}, {0, 3, 6}, {1, 2, 3}, {1, 3, 8}, {1, 4, 5}, {2, 4, 7}, {3, 4, 9}};
        System.out.println(prim(5, edges));
    }
}
```
```output
16
```

:::complexity
Kruskal: O(E log E) — dominated by sorting
Prim (binary heap): O(E log V)
Space: O(V + E)
:::

:::compare
Kruskal is natural when you already have an edge list (and pairs perfectly with Union-Find). Prim is natural with an adjacency list and for dense graphs; with an adjacency matrix and no heap it runs in O(V²), which beats Kruskal when E ≈ V².
:::

:::warning
- An MST is defined for **undirected** graphs. The directed version (minimum arborescence) needs a different algorithm.
- If the graph is disconnected, Kruskal produces a minimum spanning **forest**; check that you picked `V − 1` edges.
- An MST minimises the **total** weight; it does not give shortest paths between vertices. That's Dijkstra's job.
:::

:::quiz
Q: Kruskal considers edge 2–4 (weight 7) after 2 and 4 are already connected. Why is skipping it correct?
- Its weight is too large
- [x] Adding it would create a cycle, and a tree can't contain cycles
- It isn't connected to the start vertex
- Kruskal only uses the first V − 1 edges in the list
> 2 and 4 are already in the same component, so this edge would close a cycle. Any spanning tree containing it would have to drop a cheaper edge.
:::

=== bellman-ford-floyd | Bellman–Ford & Floyd–Warshall
summary: Shortest paths with negative edge weights, negative-cycle detection, and all-pairs shortest paths.
practice: cheapest-flights-k-stops, network-delay-time
---
Dijkstra's algorithm needs non-negative weights. When edges can be negative — refunds, energy gains, currency exchange — use **Bellman–Ford**. When you need the shortest path between **every** pair of vertices, use **Floyd–Warshall**.

## Bellman–Ford

**Relax every edge, V − 1 times.** After round `k`, every shortest path that uses at most `k` edges is correct. A shortest simple path has at most `V − 1` edges, so `V − 1` rounds are enough.

Then do **one more** round: if any distance still improves, a **negative cycle** is reachable, and shortest paths are undefined (you could loop forever to lower the cost).

:::viz graph S>A:4,S>B:5,A>C:-3,B>A:-2,C>D:2 | caption=Negative edges are fine as long as no cycle has negative total weight
:::

```python title="Bellman–Ford with negative-cycle detection"
def bellman_ford(n, edges, src):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    for _ in range(n - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break                      # already optimal: stop early
    for u, v, w in edges:              # one extra round
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None                # negative cycle reachable
    return dist

edges = [(0, 1, 6), (0, 2, 7), (1, 2, 8), (1, 3, 5), (1, 4, -4), (2, 3, -3),
         (2, 4, 9), (3, 1, -2), (4, 0, 2), (4, 3, 7)]
print(bellman_ford(5, edges, 0))
print(bellman_ford(3, [(0, 1, 1), (1, 2, -1), (2, 1, -1)], 0))
```
```java
import java.util.*;

public class Main {
    static final int INF = Integer.MAX_VALUE;

    static int[] bellmanFord(int n, int[][] edges, int src) {
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int round = 0; round < n - 1; round++) {
            boolean changed = false;
            for (int[] e : edges) {
                if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) {
                    dist[e[1]] = dist[e[0]] + e[2];
                    changed = true;
                }
            }
            if (!changed) break;          // already optimal: stop early
        }
        for (int[] e : edges)             // one extra round
            if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]]) return null;
        return dist;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 6}, {0, 2, 7}, {1, 2, 8}, {1, 3, 5}, {1, 4, -4}, {2, 3, -3},
                         {2, 4, 9}, {3, 1, -2}, {4, 0, 2}, {4, 3, 7}};
        System.out.println(Arrays.toString(bellmanFord(5, edges, 0)));
        System.out.println(Arrays.toString(bellmanFord(3, new int[][]{{0, 1, 1}, {1, 2, -1}, {2, 1, -1}}, 0)));
    }
}
```
```output-python
[0, 2, 7, 4, -2]
None
```
```output-java
[0, 2, 7, 4, -2]
null
```

The best route to vertex 4 is `0 → 2 → 3 → 1 → 4` with cost 7 − 3 − 2 − 4 = −2, a path Dijkstra would miss.

:::tip
**Limited number of edges:** if a problem allows at most `k` edges (like "cheapest flight with at most k stops"), run exactly `k` rounds, relaxing from a **copy** of the previous round's distances so a single round can't chain several edges.
:::

## Floyd–Warshall

For all pairs, keep a matrix `dist[i][j]`. For each possible intermediate vertex `k`, check whether going `i → k → j` beats the current `i → j`:

`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`

```python title="All-pairs shortest paths"
INF = float("inf")
dist = [
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0],
]
n = len(dist)
for k in range(n):                 # allow vertex k as an intermediate stop
    for i in range(n):
        for j in range(n):
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]

for row in dist:
    print(*row)
```
```java
public class Main {
    public static void main(String[] args) {
        final int INF = 1_000_000_000;
        int[][] dist = {
            {0, 3, INF, 7},
            {8, 0, 2, INF},
            {5, INF, 0, 1},
            {2, INF, INF, 0},
        };
        int n = dist.length;
        for (int k = 0; k < n; k++)           // allow vertex k as an intermediate stop
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
        for (int[] row : dist) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) sb.append(j > 0 ? " " : "").append(row[j]);
            System.out.println(sb);
        }
    }
}
```
```output
0 3 5 6
5 0 2 3
3 6 0 1
2 5 7 0
```

:::complexity
Bellman–Ford: O(V · E) time, O(V) space
Floyd–Warshall: O(V³) time, O(V²) space
:::

:::warning
- In Java, using `Integer.MAX_VALUE` as infinity and adding to it overflows. Check for infinity first (as in Bellman–Ford above), or use a large value like 10⁹ that can be added safely (as in Floyd–Warshall).
- Floyd–Warshall: the `k` loop **must** be the outermost loop.
- After Floyd–Warshall, `dist[i][i] < 0` means vertex `i` is on a negative cycle.
:::

:::quiz
Q: Why does Bellman–Ford run exactly V − 1 rounds of relaxation?
- To visit every vertex once
- [x] A shortest path without cycles has at most V − 1 edges, and each round fixes at least one more edge of it
- Because the last vertex never needs relaxing
- It's an arbitrary safe limit
> After round k, all shortest paths using at most k edges are correct. A simple path among V vertices has at most V − 1 edges.
:::

=== strongly-connected-components | Strongly Connected Components
summary: Group the vertices of a directed graph that can all reach each other — Kosaraju's two-pass DFS.
---
In a directed graph, two vertices are **strongly connected** if each can reach the other. A **strongly connected component** (SCC) is a maximal group of vertices that are all mutually reachable.

:::viz graph 0>1,1>2,2>0,1>3,3>4 | hl=0,1,2 | caption=SCCs: {0, 1, 2}, {3} and {4}
:::

Collapsing every SCC into a single node always gives a **DAG** (the "condensation"). That's useful for dependency analysis, finding mutually recursive functions, and solving 2-SAT.

## Kosaraju's algorithm

1. Run DFS on the graph and record vertices in order of **finishing time**.
2. Build the **reversed** graph (flip every edge).
3. Process vertices in **decreasing** finish time; each DFS on the reversed graph from an unassigned vertex collects exactly one SCC.

**Why it works:** the vertex that finishes last lies in a "source" SCC of the condensation. In the reversed graph, that SCC can't escape into other unassigned SCCs, so the DFS stays inside it.

```python title="Kosaraju's algorithm"
def kosaraju(n, edges):
    adj = [[] for _ in range(n)]
    radj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        radj[v].append(u)

    order, seen = [], [False] * n
    def dfs1(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                dfs1(v)
        order.append(u)              # record finish time

    for u in range(n):
        if not seen[u]:
            dfs1(u)

    comp, comps = [-1] * n, []
    def dfs2(u, c):
        comp[u] = c
        comps[c].append(u)
        for v in radj[u]:
            if comp[v] == -1:
                dfs2(v, c)

    for u in reversed(order):        # decreasing finish time
        if comp[u] == -1:
            comps.append([])
            dfs2(u, len(comps) - 1)
    return [sorted(c) for c in comps]

print(kosaraju(5, [(0, 1), (1, 2), (2, 0), (1, 3), (3, 4)]))
```
```java
import java.util.*;

public class Main {
    static List<List<Integer>> adj = new ArrayList<>(), radj = new ArrayList<>();
    static boolean[] seen;
    static int[] comp;
    static List<Integer> order = new ArrayList<>();
    static List<List<Integer>> comps = new ArrayList<>();

    static void dfs1(int u) {
        seen[u] = true;
        for (int v : adj.get(u)) if (!seen[v]) dfs1(v);
        order.add(u);                     // record finish time
    }

    static void dfs2(int u, int c) {
        comp[u] = c;
        comps.get(c).add(u);
        for (int v : radj.get(u)) if (comp[v] == -1) dfs2(v, c);
    }

    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1}, {1, 2}, {2, 0}, {1, 3}, {3, 4}};
        for (int i = 0; i < n; i++) { adj.add(new ArrayList<>()); radj.add(new ArrayList<>()); }
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); radj.get(e[1]).add(e[0]); }
        seen = new boolean[n];
        for (int u = 0; u < n; u++) if (!seen[u]) dfs1(u);
        comp = new int[n];
        Arrays.fill(comp, -1);
        for (int i = order.size() - 1; i >= 0; i--) {   // decreasing finish time
            int u = order.get(i);
            if (comp[u] == -1) { comps.add(new ArrayList<>()); dfs2(u, comps.size() - 1); }
        }
        for (List<Integer> c : comps) Collections.sort(c);
        System.out.println(comps);
    }
}
```
```output
[[0, 1, 2], [3], [4]]
```

## Dry run

| Phase | Result |
|---|---|
| DFS 1 from 0 | finish order: 2, 4, 3, 1, 0 |
| Reverse pass, start at 0 (last to finish) | reaches 2 → 1 in the reversed graph → SCC {0, 1, 2} |
| next unassigned: 3 | its only reversed edge leads to 1 (assigned) → SCC {3} |
| next unassigned: 4 | → SCC {4} |

:::complexity
Time: O(V + E) — two DFS passes
Space: O(V + E) for the reversed graph
:::

:::compare
**Tarjan's algorithm** finds SCCs in a single DFS using discovery times and low-link values (the same idea as bridges and articulation points). It avoids building the reversed graph but is trickier to get right. Kosaraju is the easier one to remember in an interview.
:::

=== bridges-articulation | Bridges & Articulation Points
summary: Find edges and vertices whose removal disconnects a graph — Tarjan's low-link values.
practice: critical-connections
---
In an undirected graph:

- A **bridge** is an edge whose removal increases the number of connected components.
- An **articulation point** (cut vertex) is a vertex whose removal does the same.

They are the single points of failure in a network: a server whose crash splits the data centre, or a road whose closure cuts off a town.

:::viz graph 0-1,1-2,2-0,1-3,3-4 | hl=1,3 | caption=Bridges: 1–3 and 3–4. Articulation points: 1 and 3
:::

## Discovery time and low-link

Run DFS and record for each vertex:

- `tin[u]` — the time `u` was first discovered.
- `low[u]` — the earliest discovery time reachable from `u`'s DFS subtree using **at most one back edge**.

For a tree edge `u → v` (where `v` is `u`'s child in the DFS):

- **Bridge** if `low[v] > tin[u]`: nothing under `v` can climb back to `u` or above without this edge.
- **Articulation point** (`u` is not the root) if `low[v] >= tin[u]`: the subtree of `v` can't get above `u` without going through `u`.
- **The root** is an articulation point only if it has **two or more** DFS children.

```python title="Bridges and articulation points in one DFS"
def bridges_and_points(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    tin, low = [-1] * n, [0] * n
    timer = [0]
    bridges, points = [], set()

    def dfs(u, parent):
        tin[u] = low[u] = timer[0]
        timer[0] += 1
        children = 0
        for v in adj[u]:
            if v == parent:
                continue
            if tin[v] != -1:                       # back edge
                low[u] = min(low[u], tin[v])
            else:                                  # tree edge
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > tin[u]:
                    bridges.append((min(u, v), max(u, v)))
                if parent != -1 and low[v] >= tin[u]:
                    points.add(u)
                children += 1
        if parent == -1 and children > 1:
            points.add(u)

    for u in range(n):
        if tin[u] == -1:
            dfs(u, -1)
    return sorted(bridges), sorted(points)

print(bridges_and_points(5, [(0, 1), (1, 2), (2, 0), (1, 3), (3, 4)]))
```
```java
import java.util.*;

public class Main {
    static List<List<Integer>> adj = new ArrayList<>();
    static int[] tin, low;
    static int timer = 0;
    static List<String> bridges = new ArrayList<>();
    static TreeSet<Integer> points = new TreeSet<>();

    static void dfs(int u, int parent) {
        tin[u] = low[u] = timer++;
        int children = 0;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (tin[v] != -1) {                          // back edge
                low[u] = Math.min(low[u], tin[v]);
            } else {                                     // tree edge
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > tin[u]) bridges.add("(" + Math.min(u, v) + ", " + Math.max(u, v) + ")");
                if (parent != -1 && low[v] >= tin[u]) points.add(u);
                children++;
            }
        }
        if (parent == -1 && children > 1) points.add(u);
    }

    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1}, {1, 2}, {2, 0}, {1, 3}, {3, 4}};
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        tin = new int[n];
        low = new int[n];
        Arrays.fill(tin, -1);
        for (int u = 0; u < n; u++) if (tin[u] == -1) dfs(u, -1);
        Collections.sort(bridges);
        System.out.println(bridges + " " + points);
    }
}
```
```output-python
([(1, 3), (3, 4)], [1, 3])
```
```output-java
[(1, 3), (3, 4)] [1, 3]
```

## Dry run

| Vertex | tin | low (final) | Why |
|---|---|---|---|
| 0 | 0 | 0 | root |
| 1 | 1 | 0 | its child 2 has a back edge to 0 |
| 2 | 2 | 0 | back edge 2 → 0 |
| 3 | 3 | 3 | no back edges from its subtree |
| 4 | 4 | 4 | leaf |

- Edge 1–3: `low[3] = 3 > tin[1] = 1` → bridge; and `3 >= 1` → 1 is an articulation point.
- Edge 3–4: `low[4] = 4 > tin[3] = 3` → bridge; 3 is an articulation point.
- Root 0 has only one DFS child (1), so it is **not** an articulation point.

:::complexity
Time: O(V + E)
Space: O(V)
:::

:::warning
- Skip only the edge to the **parent**, not every visited neighbour. With parallel edges, skip by edge id instead of parent vertex.
- The root needs the special "two or more children" rule; applying `low[v] >= tin[u]` to the root marks it wrongly.
:::

:::quiz
Q: In the graph above, why is edge 0–1 **not** a bridge?
- Because 0 is the root
- [x] Removing it still leaves the path 0 – 2 – 1, so the graph stays connected
- Because 1 is an articulation point
- Because its weight is zero
> Edge 0–1 lies on the cycle 0 – 1 – 2. Edges on a cycle are never bridges, because the rest of the cycle provides another route.
:::
