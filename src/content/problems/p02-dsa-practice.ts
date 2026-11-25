import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'linked-list',
    statement: 'Given the head of a singly linked list, reverse the list and return the new head.',
    sig: { name: 'reverseList', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { args: [[1, 2]], expected: [2, 1] },
      { args: [[]], expected: [] },
    ],
    hints: ['Walk the list keeping `prev` and `cur`.', 'Save `cur.next` before pointing `cur.next` at `prev`.'],
    approaches: [{ name: 'Iterative pointer reversal', idea: 'Flip each `next` pointer in one pass.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        while head:
            head.next, prev, head = prev, head, head.next
        return prev
`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode nxt = head.next;
            head.next = prev;
            prev = head;
            head = nxt;
        }
        return prev;
    }
}
`,
    },
  },
  {
    id: 'middle-of-linked-list',
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    topic: 'linked-list',
    statement: 'Return the middle node of a linked list (as the list starting there). If there are two middle nodes, return the second one.',
    sig: { name: 'middleNode', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
      { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
      { args: [[1]], expected: [1] },
    ],
    hints: ['Move `slow` one step and `fast` two steps at a time.', 'When `fast` reaches the end, `slow` is in the middle.'],
    approaches: [{ name: 'Fast and slow pointers', idea: 'Fast covers twice the distance, so slow stops halfway.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        return slow
`,
      java: `class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        return slow;
    }
}
`,
    },
  },
  {
    id: 'number-of-recent-calls',
    title: 'Number of Recent Calls',
    difficulty: 'Easy',
    topic: 'queue',
    statement: 'Implement `RecentCounter`: `ping(t)` records a request at time `t` (milliseconds, strictly increasing) and returns how many requests happened in the inclusive range `[t - 3000, t]`.',
    sig: { kind: 'design', className: 'RecentCounter', ctor: [], methods: [{ name: 'ping', params: [{ name: 't', type: 'int' }], returns: 'int' }] },
    tests: [
      { args: [['RecentCounter', 'ping', 'ping', 'ping', 'ping'], [[], [1], [100], [3001], [3002]]], expected: [null, 1, 2, 3, 3] },
      { args: [['RecentCounter', 'ping', 'ping'], [[], [5], [10000]]], expected: [null, 1, 1] },
    ],
    hints: ['Keep timestamps in a queue.', 'Before answering, pop timestamps older than `t - 3000` from the front.'],
    approaches: [{ name: 'Queue window', idea: 'The queue always holds exactly the requests within the last 3000 ms.', time: 'O(1) amortised', space: 'O(window)' }],
    solution: {
      python: `class RecentCounter:
    def __init__(self):
        self.q = deque()

    def ping(self, t: int) -> int:
        self.q.append(t)
        while self.q[0] < t - 3000:
            self.q.popleft()
        return len(self.q)
`,
      java: `class RecentCounter {
    private final Deque<Integer> q = new ArrayDeque<>();

    public int ping(int t) {
        q.offer(t);
        while (q.peek() < t - 3000) q.poll();
        return q.size();
    }
}
`,
    },
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    topic: 'stack',
    statement: 'Given daily `temperatures`, return an array where `answer[i]` is the number of days you have to wait after day `i` for a warmer temperature, or `0` if there is no future warmer day.',
    sig: { name: 'dailyTemperatures', params: [{ name: 'temperatures', type: 'int[]' }], returns: 'int[]' },
    tests: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { args: [[30, 60, 90]], expected: [1, 1, 0] },
      { args: [[50, 40, 30]], expected: [0, 0, 0] },
    ],
    hints: ['Keep a stack of indices whose warmer day hasn\'t been found yet.', 'When a warmer day arrives, pop and fill in the waiting time for each popped index.'],
    approaches: [{ name: 'Monotonic decreasing stack', idea: 'Each index is pushed and popped once.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                res[j] = i - j
            stack.append(i)
        return res
`,
      java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] res = new int[temperatures.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < temperatures.length; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int j = stack.pop();
                res[j] = i - j;
            }
            stack.push(i);
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'next-greater-element',
    title: 'Next Greater Element',
    difficulty: 'Medium',
    topic: 'stack',
    statement: 'For each element of `nums`, return the first element to its right that is strictly greater, or `-1` if none exists.',
    sig: { name: 'nextGreater', params: [{ name: 'nums', type: 'int[]' }], returns: 'int[]' },
    tests: [
      { args: [[2, 1, 5, 3, 4]], expected: [5, 5, -1, 4, -1] },
      { args: [[1, 2, 3]], expected: [2, 3, -1] },
      { args: [[3, 2, 1]], expected: [-1, -1, -1] },
      { args: [[7]], expected: [-1] },
    ],
    hints: ['A monotonic stack of indices waiting for their answer.', 'Pop while the current value is greater than the value at the stack top.'],
    approaches: [{ name: 'Monotonic stack', idea: 'The current element is the answer for every smaller element it pops.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def nextGreater(self, nums: List[int]) -> List[int]:
        res = [-1] * len(nums)
        stack = []
        for i, x in enumerate(nums):
            while stack and nums[stack[-1]] < x:
                res[stack.pop()] = x
            stack.append(i)
        return res
`,
      java: `class Solution {
    public int[] nextGreater(int[] nums) {
        int[] res = new int[nums.length];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) res[stack.pop()] = nums[i];
            stack.push(i);
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    topic: 'backtracking',
    statement: 'Given an array of unique integers `nums`, return all possible subsets (the power set), in any order. The solution must not contain duplicate subsets.',
    sig: { name: 'subsets', params: [{ name: 'nums', type: 'int[]' }], returns: 'List<List<int>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [[0]], expected: [[], [0]] },
      { args: [[4, 5]], expected: [[], [4], [5], [4, 5]] },
    ],
    hints: ['For each element, branch: include it or skip it.', 'Or iterate: start with `[[]]` and, for each number, add it to a copy of every existing subset.'],
    approaches: [{ name: 'Backtracking', idea: 'Record the current path at every node of the decision tree.', time: 'O(n · 2ⁿ)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = [[]]
        for x in nums:
            res += [s + [x] for s in res]
        return res
`,
      java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void bt(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            bt(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}
`,
    },
  },
  {
    id: 'sort-colors',
    title: 'Sort Colors',
    difficulty: 'Medium',
    topic: 'sorting',
    statement: 'Given an array `nums` containing only 0s, 1s and 2s (red, white, blue), sort it **in place** so equal colours are adjacent in the order 0, 1, 2 — without using a library sort.',
    sig: { name: 'sortColors', params: [{ name: 'nums', type: 'int[]' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
      { args: [[2, 0, 1]], expected: [0, 1, 2] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2, 0, 0, 2, 1]], expected: [0, 0, 1, 1, 2, 2] },
    ],
    hints: ['Counting sort works in two passes.', 'Dutch national flag: keep regions for 0s (`lo`), 1s (`mid`) and 2s (`hi`) and partition in one pass.'],
    approaches: [
      { name: 'Counting', idea: 'Count each colour, then overwrite.', time: 'O(n)', space: 'O(1)' },
      { name: 'Dutch national flag', idea: 'Swap 0s to the front and 2s to the back while scanning with `mid`.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        lo, mid, hi = 0, 0, len(nums) - 1
        while mid <= hi:
            if nums[mid] == 0:
                nums[lo], nums[mid] = nums[mid], nums[lo]
                lo += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[hi] = nums[hi], nums[mid]
                hi -= 1
`,
      java: `class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) { int t = nums[lo]; nums[lo++] = nums[mid]; nums[mid++] = t; }
            else if (nums[mid] == 1) mid++;
            else { int t = nums[hi]; nums[hi--] = nums[mid]; nums[mid] = t; }
        }
    }
}
`,
    },
  },
  {
    id: 'last-stone-weight',
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    topic: 'heap',
    statement: 'Each turn, smash the two heaviest stones `x <= y` together: if equal both are destroyed, otherwise a stone of weight `y - x` remains. Return the weight of the last remaining stone, or `0` if none remain.',
    sig: { name: 'lastStoneWeight', params: [{ name: 'stones', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1 },
      { args: [[1]], expected: 1 },
      { args: [[3, 3]], expected: 0 },
      { args: [[10, 4, 2, 10]], expected: 2 },
    ],
    hints: ['You repeatedly need the two largest values — a max-heap.', 'Python\'s heapq is a min-heap; push negated weights.'],
    approaches: [{ name: 'Max-heap simulation', idea: 'Pop two, push the difference if non-zero, until at most one stone remains.', time: 'O(n log n)', space: 'O(n)' }],
    solution: {
      python: `import heapq

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        heap = [-s for s in stones]
        heapq.heapify(heap)
        while len(heap) > 1:
            y, x = -heapq.heappop(heap), -heapq.heappop(heap)
            if y != x:
                heapq.heappush(heap, -(y - x))
        return -heap[0] if heap else 0
`,
      java: `class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) pq.offer(s);
        while (pq.size() > 1) {
            int y = pq.poll(), x = pq.poll();
            if (y != x) pq.offer(y - x);
        }
        return pq.isEmpty() ? 0 : pq.peek();
    }
}
`,
    },
  },
  {
    id: 'find-center-of-star',
    title: 'Find Center of Star Graph',
    difficulty: 'Easy',
    topic: 'graphs',
    statement: 'An undirected star graph has one center connected to every other node and no other edges. Given its `edges`, return the center.',
    sig: { name: 'findCenter', params: [{ name: 'edges', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[1, 2], [2, 3], [4, 2]]], expected: 2 },
      { args: [[[1, 2], [5, 1], [1, 3], [1, 4]]], expected: 1 },
      { args: [[[3, 1], [3, 2]]], expected: 3 },
    ],
    hints: ['The center appears in every edge.', 'So it is whichever endpoint the first two edges share.'],
    approaches: [{ name: 'Compare two edges', idea: 'The shared endpoint of edges 0 and 1 must be the center.', time: 'O(1)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def findCenter(self, edges: List[List[int]]) -> int:
        a, b = edges[0]
        return a if a in edges[1] else b
`,
      java: `class Solution {
    public int findCenter(int[][] edges) {
        int a = edges[0][0], b = edges[0][1];
        return (a == edges[1][0] || a == edges[1][1]) ? a : b;
    }
}
`,
    },
  },
  {
    id: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'In a grid, `0` is empty, `1` a fresh orange and `2` a rotten orange. Every minute, fresh oranges adjacent (4-directionally) to a rotten one become rotten. Return the minutes until no fresh orange remains, or `-1` if impossible.',
    sig: { name: 'orangesRotting', params: [{ name: 'grid', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
      { args: [[[0, 2]]], expected: 0 },
      { args: [[[1]]], expected: -1 },
    ],
    hints: ['Start a BFS from **all** rotten oranges at once (multi-source BFS).', 'Each BFS level is one minute; count fresh oranges to detect the impossible case.'],
    approaches: [{ name: 'Multi-source BFS', idea: 'Enqueue every rotten orange, then spread level by level.', time: 'O(m·n)', space: 'O(m·n)' }],
    solution: {
      python: `class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q = deque((r, c) for r in range(m) for c in range(n) if grid[r][c] == 2)
        fresh = sum(row.count(1) for row in grid)
        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1
        return -1 if fresh else minutes
`,
      java: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            for (int s = q.size(); s > 0; s--) {
                int[] p = q.poll();
                for (int[] d : dirs) {
                    int nr = p[0] + d[0], nc = p[1] + d[1];
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++;
        }
        return fresh > 0 ? -1 : minutes;
    }
}
`,
    },
  },
  {
    id: 'network-delay-time',
    title: 'Network Delay Time',
    difficulty: 'Medium',
    topic: 'graphs',
    statement: 'Nodes are labelled `1..n`. `times[i] = [u, v, w]` is a directed edge from `u` to `v` taking `w` time. A signal is sent from node `k`. Return the time for all nodes to receive it, or `-1` if some node never does.',
    sig: { name: 'networkDelayTime', params: [{ name: 'times', type: 'int[][]' }, { name: 'n', type: 'int' }, { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
      { args: [[[1, 2, 1]], 2, 1], expected: 1 },
      { args: [[[1, 2, 1]], 2, 2], expected: -1 },
      { args: [[[1, 2, 4], [1, 3, 1], [3, 2, 2]], 3, 1], expected: 3 },
    ],
    hints: ['This is single-source shortest paths with non-negative weights: Dijkstra.', 'The answer is the maximum shortest distance, if every node is reachable.'],
    approaches: [{ name: 'Dijkstra with a min-heap', idea: 'Settle nodes in order of distance; the last settled distance is the answer.', time: 'O(E log V)', space: 'O(V + E)' }],
    solution: {
      python: `import heapq

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))
        dist = {}
        heap = [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if u in dist:
                continue
            dist[u] = d
            for v, w in graph[u]:
                if v not in dist:
                    heapq.heappush(heap, (d + w, v))
        return max(dist.values()) if len(dist) == n else -1
`,
      java: `class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i <= n; i++) g.add(new ArrayList<>());
        for (int[] t : times) g.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            if (top[0] > dist[top[1]]) continue;
            for (int[] e : g.get(top[1])) {
                if (top[0] + e[1] < dist[e[0]]) {
                    dist[e[0]] = top[0] + e[1];
                    pq.offer(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        int best = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            best = Math.max(best, dist[i]);
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'assign-cookies',
    title: 'Assign Cookies',
    difficulty: 'Easy',
    topic: 'greedy',
    statement: 'Child `i` is content with a cookie of size at least `g[i]`. Cookie `j` has size `s[j]`. Each child gets at most one cookie. Return the maximum number of content children.',
    sig: { name: 'findContentChildren', params: [{ name: 'g', type: 'int[]' }, { name: 's', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 2, 3], [1, 1]], expected: 1 },
      { args: [[1, 2], [1, 2, 3]], expected: 2 },
      { args: [[10, 9, 8, 7], [5, 6, 7, 8]], expected: 2 },
      { args: [[1], []], expected: 0 },
    ],
    hints: ['Sort both arrays.', 'Give each cookie (smallest first) to the least greedy child it can satisfy.'],
    approaches: [{ name: 'Sort + two pointers', idea: 'Never waste a large cookie on a child a smaller cookie could satisfy.', time: 'O(n log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        child = 0
        for size in s:
            if child < len(g) and size >= g[child]:
                child += 1
        return child
`,
      java: `class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0;
        for (int size : s) if (child < g.length && size >= g[child]) child++;
        return child;
    }
}
`,
    },
  },
  {
    id: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    topic: 'intervals',
    statement: 'Given an array of intervals, return the minimum number of intervals to remove so the rest do not overlap. Intervals that only touch (e.g. `[1,2]` and `[2,3]`) do not overlap.',
    sig: { name: 'eraseOverlapIntervals', params: [{ name: 'intervals', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
      { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: 0 },
      { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 },
    ],
    hints: ['Equivalent to keeping the maximum number of non-overlapping intervals.', 'Sort by end time and greedily keep each interval that starts after the last kept one ends.'],
    approaches: [{ name: 'Greedy by end time', idea: 'Keeping the earliest-ending interval leaves the most room; removed = total − kept.', time: 'O(n log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda iv: iv[1])
        kept, end = 0, float('-inf')
        for s, e in intervals:
            if s >= end:
                kept += 1
                end = e
        return len(intervals) - kept
`,
      java: `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int kept = 0;
        long end = Long.MIN_VALUE;
        for (int[] iv : intervals) if (iv[0] >= end) { kept++; end = iv[1]; }
        return intervals.length - kept;
    }
}
`,
    },
  },
  {
    id: 'min-cost-climbing-stairs',
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    topic: 'dp',
    statement: '`cost[i]` is the cost of stepping on stair `i`. After paying, you can climb one or two stairs. You may start at stair 0 or 1. Return the minimum cost to reach the top (just past the last stair).',
    sig: { name: 'minCostClimbingStairs', params: [{ name: 'cost', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[10, 15, 20]], expected: 15 },
      { args: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], expected: 6 },
      { args: [[0, 0]], expected: 0 },
    ],
    hints: ['`dp[i]` = cheapest cost to stand on stair `i` = `cost[i] + min(dp[i-1], dp[i-2])`.', 'The top is reached from either of the last two stairs.'],
    approaches: [{ name: 'Rolling DP', idea: 'Only the last two values are needed.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        a, b = 0, 0
        for c in cost:
            a, b = b, c + min(a, b)
        return min(a, b)
`,
      java: `class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int a = 0, b = 0;
        for (int c : cost) {
            int next = c + Math.min(a, b);
            a = b;
            b = next;
        }
        return Math.min(a, b);
    }
}
`,
    },
  },
  {
    id: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'A robot at the top-left of an `m × n` grid can only move right or down. How many unique paths lead to the bottom-right corner?',
    sig: { name: 'uniquePaths', params: [{ name: 'm', type: 'int' }, { name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [3, 7], expected: 28 },
      { args: [3, 2], expected: 3 },
      { args: [1, 1], expected: 1 },
      { args: [10, 10], expected: 48620 },
    ],
    hints: ['`dp[r][c] = dp[r-1][c] + dp[r][c-1]`.', 'The first row and column each have exactly one path.'],
    approaches: [
      { name: 'Grid DP', idea: 'Fill row by row with a 1D array.', time: 'O(m·n)', space: 'O(n)' },
      { name: 'Combinatorics', idea: 'Choose which m−1 of the m+n−2 moves go down: C(m+n−2, m−1).', time: 'O(min(m, n))', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for _ in range(1, m):
            for c in range(1, n):
                dp[c] += dp[c - 1]
        return dp[-1]
`,
      java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int r = 1; r < m; r++)
            for (int c = 1; c < n; c++) dp[c] += dp[c - 1];
        return dp[n - 1];
    }
}
`,
    },
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    topic: 'dp',
    statement: 'Return the length of the longest common subsequence of `text1` and `text2` (characters in the same relative order, not necessarily contiguous). Return `0` if there is none.',
    sig: { name: 'longestCommonSubsequence', params: [{ name: 'text1', type: 'string' }, { name: 'text2', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['abcde', 'ace'], expected: 3 },
      { args: ['abc', 'abc'], expected: 3 },
      { args: ['abc', 'def'], expected: 0 },
      { args: ['bsbininm', 'jmjkbkjkv'], expected: 1 },
    ],
    hints: ['`dp[i][j]` = LCS of `text1[:i]` and `text2[:j]`.', 'Matching last characters extend the diagonal; otherwise take the max of dropping one character.'],
    approaches: [{ name: '2D DP', idea: 'Classic LCS table with a rolling row for O(n) space.', time: 'O(m·n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        n = len(text2)
        prev = [0] * (n + 1)
        for a in text1:
            cur = [0] * (n + 1)
            for j in range(1, n + 1):
                cur[j] = prev[j - 1] + 1 if a == text2[j - 1] else max(prev[j], cur[j - 1])
            prev = cur
        return prev[n]
`,
      java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = text1.charAt(i - 1) == text2.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[m][n];
    }
}
`,
    },
  },
  {
    id: 'counting-bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    topic: 'bit',
    statement: 'Given `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of 1 bits in the binary representation of `i`.',
    sig: { name: 'countBits', params: [{ name: 'n', type: 'int' }], returns: 'int[]' },
    tests: [
      { args: [2], expected: [0, 1, 1] },
      { args: [5], expected: [0, 1, 1, 2, 1, 2] },
      { args: [0], expected: [0] },
    ],
    hints: ['`i >> 1` has the same bits as `i` without the last one.', '`ans[i] = ans[i >> 1] + (i & 1)`.'],
    approaches: [{ name: 'DP on bits', idea: 'Reuse the answer for `i // 2` plus the lowest bit.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i >> 1] + (i & 1)
        return ans
`,
      java: `class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
        return ans;
    }
}
`,
    },
  },
  {
    id: 'redundant-connection',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    topic: 'dsu',
    statement: 'A tree of `n` nodes (labelled `1..n`) had one extra edge added, creating exactly one cycle. Given the `edges`, return an edge that can be removed so the graph becomes a tree. If several answers exist, return the one that occurs **last** in the input.',
    sig: { name: 'findRedundantConnection', params: [{ name: 'edges', type: 'int[][]' }], returns: 'int[]' },
    tests: [
      { args: [[[1, 2], [1, 3], [2, 3]]], expected: [2, 3] },
      { args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], expected: [1, 4] },
      { args: [[[1, 2], [2, 3], [3, 1]]], expected: [3, 1] },
    ],
    hints: ['Process edges in order with Union-Find.', 'The first edge whose endpoints are already connected closes the cycle.'],
    approaches: [{ name: 'Union-Find', idea: 'Union endpoints; when `find(u) == find(v)`, that edge is redundant.', time: 'O(n α(n))', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        parent = list(range(len(edges) + 1))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for u, v in edges:
            ru, rv = find(u), find(v)
            if ru == rv:
                return [u, v]
            parent[ru] = rv
        return []
`,
      java: `class Solution {
    private int[] parent;

    private int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    public int[] findRedundantConnection(int[][] edges) {
        parent = new int[edges.length + 1];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int ru = find(e[0]), rv = find(e[1]);
            if (ru == rv) return e;
            parent[ru] = rv;
        }
        return new int[0];
    }
}
`,
    },
  },
  {
    id: 'range-sum-query-mutable',
    title: 'Range Sum Query - Mutable',
    difficulty: 'Medium',
    topic: 'prefix-sum',
    statement: 'Design `NumArray` over an integer array supporting `update(index, val)` (set `nums[index] = val`) and `sumRange(left, right)` (sum of `nums[left..right]` inclusive), both efficiently.',
    sig: {
      kind: 'design',
      className: 'NumArray',
      ctor: [{ name: 'nums', type: 'int[]' }],
      methods: [
        { name: 'update', params: [{ name: 'index', type: 'int' }, { name: 'val', type: 'int' }], returns: 'void' },
        { name: 'sumRange', params: [{ name: 'left', type: 'int' }, { name: 'right', type: 'int' }], returns: 'int' },
      ],
    },
    tests: [
      { args: [['NumArray', 'sumRange', 'update', 'sumRange'], [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]], expected: [null, 9, null, 8] },
      { args: [['NumArray', 'sumRange', 'update', 'sumRange', 'sumRange'], [[[5, 2, 6, 3, 1]], [1, 3], [2, 10], [1, 3], [0, 4]]], expected: [null, 11, null, 15, 21] },
    ],
    hints: ['Prefix sums make updates O(n).', 'A Fenwick (binary indexed) tree or segment tree gives O(log n) for both operations.'],
    approaches: [{ name: 'Fenwick tree', idea: 'Store partial sums indexed by lowest set bit; updates and prefix queries walk O(log n) nodes.', time: 'O(log n) per operation', space: 'O(n)' }],
    solution: {
      python: `class NumArray:
    def __init__(self, nums: List[int]):
        self.nums = nums[:]
        self.tree = [0] * (len(nums) + 1)
        for i, x in enumerate(nums):
            self._add(i, x)

    def _add(self, i, delta):
        i += 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i

    def _prefix(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i
        return s

    def update(self, index: int, val: int) -> None:
        self._add(index, val - self.nums[index])
        self.nums[index] = val

    def sumRange(self, left: int, right: int) -> int:
        return self._prefix(right + 1) - self._prefix(left)
`,
      java: `class NumArray {
    private final int[] nums, tree;

    public NumArray(int[] nums) {
        this.nums = nums.clone();
        tree = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) add(i, nums[i]);
    }

    private void add(int i, int delta) {
        for (i++; i < tree.length; i += i & -i) tree[i] += delta;
    }

    private int prefix(int i) {
        int s = 0;
        for (; i > 0; i -= i & -i) s += tree[i];
        return s;
    }

    public void update(int index, int val) {
        add(index, val - nums[index]);
        nums[index] = val;
    }

    public int sumRange(int left, int right) {
        return prefix(right + 1) - prefix(left);
    }
}
`,
    },
  },
  {
    id: 'max-sum-subarray-k',
    title: 'Maximum Sum of a Subarray of Size K',
    difficulty: 'Easy',
    topic: 'sliding-window',
    statement: 'Return the maximum sum of any contiguous subarray of exactly `k` elements.',
    sig: { name: 'maxSumK', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
      { args: [[2, 3, 4, 1, 5], 2], expected: 7 },
      { args: [[-1, -2, -3], 1], expected: -1 },
      { args: [[4], 1], expected: 4 },
    ],
    hints: ['Compute the first window, then slide: add the entering element, subtract the leaving one.'],
    approaches: [{ name: 'Fixed sliding window', idea: 'Each window sum is derived from the previous in O(1).', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def maxSumK(self, nums: List[int], k: int) -> int:
        window = sum(nums[:k])
        best = window
        for i in range(k, len(nums)):
            window += nums[i] - nums[i - k]
            best = max(best, window)
        return best
`,
      java: `class Solution {
    public int maxSumK(int[] nums, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) window += nums[i];
        int best = window;
        for (int i = k; i < nums.length; i++) {
            window += nums[i] - nums[i - k];
            best = Math.max(best, window);
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    topic: 'prefix-sum',
    statement: 'Given an integer array `nums` (which may contain negatives) and an integer `k`, return the number of contiguous subarrays whose sum equals `k`.',
    sig: { name: 'subarraySum', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[1, 1, 1], 2], expected: 2 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[1, 2, 3, -3, 3], 3], expected: 5 },
      { args: [[0, 0], 0], expected: 3 },
    ],
    hints: ['A subarray `(j, i]` sums to k exactly when `prefix[i] - prefix[j] == k`.', 'Count how many earlier prefix sums equal `prefix[i] - k` using a hash map (start with `{0: 1}`).'],
    approaches: [{ name: 'Prefix sums + hash map', idea: 'Accumulate the running sum and look up how many prefixes complete a subarray summing to k.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        seen = {0: 1}
        running = count = 0
        for x in nums:
            running += x
            count += seen.get(running - k, 0)
            seen[running] = seen.get(running, 0) + 1
        return count
`,
      java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);
        int running = 0, count = 0;
        for (int x : nums) {
            running += x;
            count += seen.getOrDefault(running - k, 0);
            seen.merge(running, 1, Integer::sum);
        }
        return count;
    }
}
`,
    },
  },
];

export default problems;
