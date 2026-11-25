import type { Problem } from '../../lib/harness';

/** Rebuild a tree from level order and check it is a height-balanced BST over exactly `nums`. */
function balancedBstOf(nums: number[], level: any): boolean {
  if (!Array.isArray(level)) return false;
  type N = { v: number; l?: N; r?: N };
  if (!level.length) return nums.length === 0;
  const root: N = { v: level[0] };
  const q: N[] = [root];
  let i = 1;
  while (q.length && i < level.length) {
    const n = q.shift()!;
    if (i < level.length && level[i] != null) q.push((n.l = { v: level[i] }));
    i++;
    if (i < level.length && level[i] != null) q.push((n.r = { v: level[i] }));
    i++;
  }
  const order: number[] = [];
  let balanced = true;
  const walk = (n?: N): number => {
    if (!n) return 0;
    const hl = walk(n.l);
    order.push(n.v);
    const hr = walk(n.r);
    if (Math.abs(hl - hr) > 1) balanced = false;
    return 1 + Math.max(hl, hr);
  };
  walk(root);
  return balanced && JSON.stringify(order) === JSON.stringify(nums);
}

const problems: Problem[] = [
  // ---------------- Backtracking ----------------
  {
    id: 'letter-combinations',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given a string of digits `2-9`, return all letter combinations the number could represent on a phone keypad (2 = abc, 3 = def, 4 = ghi, 5 = jkl, 6 = mno, 7 = pqrs, 8 = tuv, 9 = wxyz). Return them in any order; an empty input gives an empty list.',
    constraints: ['`0 <= digits.length <= 4`'],
    sig: { name: 'letterCombinations', params: [{ name: 'digits', type: 'string' }], returns: 'List<string>' },
    compare: 'unordered',
    tests: [
      { args: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { args: [''], expected: [] },
      { args: ['2'], expected: ['a', 'b', 'c'] },
      { args: ['79'], expected: ['pw', 'px', 'py', 'pz', 'qw', 'qx', 'qy', 'qz', 'rw', 'rx', 'ry', 'rz', 'sw', 'sx', 'sy', 'sz'] },
    ],
    hints: ['Build the string one digit at a time.', 'At depth `i`, try each letter of `digits[i]`, recurse, then undo.'],
    approaches: [{ name: 'Backtracking', idea: 'DFS over digit positions, appending each possible letter.', time: 'O(4^n · n)', space: 'O(n) recursion' }],
    solution: {
      python: `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        pad = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
        res = []

        def bt(i, path):
            if i == len(digits):
                res.append(path)
                return
            for ch in pad[digits[i]]:
                bt(i + 1, path + ch)

        bt(0, '')
        return res
`,
      java: `class Solution {
    private static final String[] PAD = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (!digits.isEmpty()) bt(digits, 0, new StringBuilder(), res);
        return res;
    }

    private void bt(String d, int i, StringBuilder path, List<String> res) {
        if (i == d.length()) { res.add(path.toString()); return; }
        for (char ch : PAD[d.charAt(i) - '0'].toCharArray()) {
            path.append(ch);
            bt(d, i + 1, path, res);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
`,
    },
  },
  {
    id: 'combinations',
    title: 'Combinations',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given integers `n` and `k`, return all combinations of `k` numbers chosen from `1..n`, in any order.',
    constraints: ['`1 <= n <= 20`', '`1 <= k <= n`'],
    sig: { name: 'combine', params: [{ name: 'n', type: 'int' }, { name: 'k', type: 'int' }], returns: 'List<List<int>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [4, 2], expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
      { args: [1, 1], expected: [[1]] },
      { args: [3, 3], expected: [[1, 2, 3]] },
      { args: [4, 3], expected: [[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]] },
    ],
    hints: ['Choose numbers in increasing order to avoid duplicates.', 'Prune: stop when not enough numbers remain to reach size `k`.'],
    approaches: [{ name: 'Backtracking with start index', idea: 'Each call chooses the next number from `start..n`.', time: 'O(C(n,k) · k)', space: 'O(k)' }],
    solution: {
      python: `class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        res, path = [], []

        def bt(start):
            if len(path) == k:
                res.append(path[:])
                return
            for x in range(start, n - (k - len(path)) + 2):
                path.append(x)
                bt(x + 1)
                path.pop()

        bt(1)
        return res
`,
      java: `class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        bt(n, k, 1, new ArrayList<>(), res);
        return res;
    }

    private void bt(int n, int k, int start, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == k) { res.add(new ArrayList<>(path)); return; }
        for (int x = start; x <= n - (k - path.size()) + 1; x++) {
            path.add(x);
            bt(n, k, x + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}
`,
    },
  },
  {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given an array `nums` of distinct integers, return all possible permutations, in any order.',
    constraints: ['`1 <= nums.length <= 6`', 'All integers are unique'],
    sig: { name: 'permute', params: [{ name: 'nums', type: 'int[]' }], returns: 'List<List<int>>' },
    compare: 'unordered',
    tests: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]] },
      { args: [[1]], expected: [[1]] },
    ],
    hints: ['Build the permutation position by position.', 'Track which elements are already used.'],
    approaches: [{ name: 'Backtracking with a used array', idea: 'At each depth, try every unused element.', time: 'O(n · n!)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res, path, used = [], [], [False] * len(nums)

        def bt():
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i, x in enumerate(nums):
                if not used[i]:
                    used[i] = True
                    path.append(x)
                    bt()
                    path.pop()
                    used[i] = False

        bt()
        return res
`,
      java: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private void bt(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            bt(nums, used, path, res);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
`,
    },
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given distinct positive integers `candidates` and a `target`, return all unique combinations whose sum is `target`. Each number may be used an unlimited number of times. Two combinations are the same if they use the same numbers with the same frequencies. Return them in any order.',
    constraints: ['`1 <= candidates.length <= 30`', '`2 <= candidates[i] <= 40`', '`1 <= target <= 40`'],
    sig: { name: 'combinationSum', params: [{ name: 'candidates', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'List<List<int>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expected: [] },
      { args: [[3, 4], 7], expected: [[3, 4]] },
    ],
    hints: ['To avoid duplicates, only allow choosing candidates at index ≥ the last chosen index.', 'Sort candidates so you can stop early when a candidate exceeds the remaining target.'],
    approaches: [{ name: 'Backtracking with reuse', idea: 'Recurse with the same start index (reuse allowed) and remaining target.', time: 'Exponential in target / min(candidate)', space: 'O(target)' }],
    solution: {
      python: `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res, path = [], []

        def bt(start, remain):
            if remain == 0:
                res.append(path[:])
                return
            for i in range(start, len(candidates)):
                c = candidates[i]
                if c > remain:
                    break
                path.append(c)
                bt(i, remain - c)
                path.pop()

        bt(0, target)
        return res
`,
      java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> res = new ArrayList<>();
        bt(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void bt(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length && c[i] <= remain; i++) {
            path.add(c[i]);
            bt(c, i, remain - c[i], path, res);
            path.remove(path.size() - 1);
        }
    }
}
`,
    },
  },
  {
    id: 'n-queens-ii',
    title: 'N-Queens II',
    difficulty: 'Hard',
    topic: 'backtracking',
    lc150: true,
    statement: 'Place `n` queens on an `n × n` chessboard so that no two queens attack each other (no shared row, column or diagonal). Return the number of distinct solutions.',
    constraints: ['`1 <= n <= 9`'],
    sig: { name: 'totalNQueens', params: [{ name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [4], expected: 2 },
      { args: [1], expected: 1 },
      { args: [2], expected: 0 },
      { args: [6], expected: 4 },
      { args: [8], expected: 92 },
    ],
    hints: ['Place one queen per row.', 'Track used columns and both diagonals (`r - c` and `r + c`) in sets for O(1) conflict checks.'],
    approaches: [{ name: 'Row-by-row backtracking', idea: 'Try each column in the current row; skip attacked squares using column/diagonal sets.', time: 'O(n!)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def totalNQueens(self, n: int) -> int:
        cols, d1, d2 = set(), set(), set()

        def bt(r):
            if r == n:
                return 1
            count = 0
            for c in range(n):
                if c in cols or r - c in d1 or r + c in d2:
                    continue
                cols.add(c); d1.add(r - c); d2.add(r + c)
                count += bt(r + 1)
                cols.remove(c); d1.remove(r - c); d2.remove(r + c)
            return count

        return bt(0)
`,
      java: `class Solution {
    public int totalNQueens(int n) {
        return bt(0, n, new boolean[n], new boolean[2 * n], new boolean[2 * n]);
    }

    private int bt(int r, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
        if (r == n) return 1;
        int count = 0;
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;
            cols[c] = d1[r - c + n] = d2[r + c] = true;
            count += bt(r + 1, n, cols, d1, d2);
            cols[c] = d1[r - c + n] = d2[r + c] = false;
        }
        return count;
    }
}
`,
    },
  },
  {
    id: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given `n` pairs of parentheses, generate all combinations of well-formed parentheses, in any order.',
    constraints: ['`1 <= n <= 8`'],
    sig: { name: 'generateParenthesis', params: [{ name: 'n', type: 'int' }], returns: 'List<string>' },
    compare: 'unordered',
    tests: [
      { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { args: [1], expected: ['()'] },
      { args: [2], expected: ['(())', '()()'] },
    ],
    hints: ['Add `(` while fewer than `n` are open.', 'Add `)` only while it would not exceed the number of `(`.'],
    approaches: [{ name: 'Backtracking with counts', idea: 'Track open and close counts; both choices are only made when they keep the string valid.', time: 'O(4^n / √n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []

        def bt(s, opened, closed):
            if len(s) == 2 * n:
                res.append(s)
                return
            if opened < n:
                bt(s + '(', opened + 1, closed)
            if closed < opened:
                bt(s + ')', opened, closed + 1)

        bt('', 0, 0)
        return res
`,
      java: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        bt(n, "", 0, 0, res);
        return res;
    }

    private void bt(int n, String s, int open, int close, List<String> res) {
        if (s.length() == 2 * n) { res.add(s); return; }
        if (open < n) bt(n, s + "(", open + 1, close, res);
        if (close < open) bt(n, s + ")", open, close + 1, res);
    }
}
`,
    },
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    topic: 'backtracking',
    lc150: true,
    statement: 'Given an `m × n` grid of characters and a string `word`, return `true` if `word` exists in the grid, formed from sequentially adjacent cells (horizontal or vertical). A cell may not be used more than once.',
    constraints: ['`1 <= m, n <= 6`', '`1 <= word.length <= 15`'],
    sig: { name: 'exist', params: [{ name: 'board', type: 'char[][]' }, { name: 'word', type: 'string' }], returns: 'bool' },
    tests: [
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expected: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expected: true },
      { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expected: false },
      { args: [[['a']], 'a'], expected: true },
    ],
    hints: ['Try starting the DFS from every cell.', 'Temporarily mark a cell as used while exploring from it, and restore it afterwards.'],
    approaches: [{ name: 'DFS backtracking', idea: 'Match `word[i]` at the current cell, then recurse to neighbours for `word[i+1]`.', time: 'O(m·n·3^L)', space: 'O(L)' }],
    solution: {
      python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])

        def dfs(r, c, i):
            if i == len(word):
                return True
            if r < 0 or c < 0 or r >= m or c >= n or board[r][c] != word[i]:
                return False
            board[r][c] = '#'
            found = dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
            board[r][c] = word[i]
            return found

        return any(dfs(r, c, 0) for r in range(m) for c in range(n))
`,
      java: `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, word, r, c, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] b, String w, int r, int c, int i) {
        if (i == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
        b[r][c] = '#';
        boolean found = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1) || dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
        b[r][c] = w.charAt(i);
        return found;
    }
}
`,
    },
  },
  // ---------------- Divide & conquer ----------------
  {
    id: 'convert-sorted-array-to-bst',
    title: 'Convert Sorted Array to Binary Search Tree',
    difficulty: 'Easy',
    topic: 'divide-conquer',
    lc150: true,
    statement: 'Given an integer array `nums` sorted in ascending order, convert it to a **height-balanced** BST (the depths of the two subtrees of every node differ by at most one). Any valid answer is accepted.',
    constraints: ['`1 <= nums.length <= 10^4`', 'Strictly increasing'],
    sig: { name: 'sortedArrayToBST', params: [{ name: 'nums', type: 'int[]' }], returns: 'TreeNode' },
    tests: [
      { args: [[-10, -3, 0, 5, 9]], expected: [0, -3, 9, -10, null, 5] },
      { args: [[1, 3]], expected: [3, 1] },
      { args: [[1]], expected: [1] },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [4, 2, 6, 1, 3, 5, 7] },
    ],
    check: (args, actual) => balancedBstOf(args[0], actual),
    notes: ['[0, -10, 5, null, -3, null, 9] is also accepted.'],
    hints: ['The middle element makes a balanced root.', 'Recursively build the left half and the right half.'],
    approaches: [{ name: 'Divide and conquer', idea: 'Pick the middle as root; the halves become balanced subtrees.', time: 'O(n)', space: 'O(log n)' }],
    solution: {
      python: `class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def build(lo, hi):
            if lo > hi:
                return None
            mid = (lo + hi) // 2
            return TreeNode(nums[mid], build(lo, mid - 1), build(mid + 1, hi))
        return build(0, len(nums) - 1)
`,
      java: `class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] a, int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        return new TreeNode(a[mid], build(a, lo, mid - 1), build(a, mid + 1, hi));
    }
}
`,
    },
  },
  {
    id: 'sort-list',
    title: 'Sort List',
    difficulty: 'Medium',
    topic: 'divide-conquer',
    lc150: true,
    statement: 'Given the head of a linked list, return the list sorted in ascending order. Aim for O(n log n) time.',
    constraints: ['`0 <= number of nodes <= 5 * 10^4`'],
    sig: { name: 'sortList', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[4, 2, 1, 3]], expected: [1, 2, 3, 4] },
      { args: [[-1, 5, 3, 4, 0]], expected: [-1, 0, 3, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[2, 2, 1]], expected: [1, 2, 2] },
    ],
    hints: ['Merge sort suits linked lists: splitting needs no random access and merging needs no extra array.', 'Find the middle with slow/fast pointers, split, sort halves, merge.'],
    approaches: [{ name: 'Top-down merge sort', idea: 'Split at the middle, recursively sort, and merge the two sorted halves.', time: 'O(n log n)', space: 'O(log n)' }],
    solution: {
      python: `class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        mid, slow.next = slow.next, None
        a, b = self.sortList(head), self.sortList(mid)
        dummy = tail = ListNode()
        while a and b:
            if a.val <= b.val:
                tail.next, a = a, a.next
            else:
                tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next
`,
      java: `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode mid = slow.next;
        slow.next = null;
        ListNode a = sortList(head), b = sortList(mid), dummy = new ListNode(), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'construct-quad-tree',
    title: 'Construct Quad Tree',
    difficulty: 'Medium',
    topic: 'divide-conquer',
    lc150: true,
    statement:
      'Given an `n × n` grid of 0s and 1s (`n` is a power of two), build its **quad tree**. Each node has `val` (boolean) and `isLeaf`, plus four children `topLeft`, `topRight`, `bottomLeft`, `bottomRight`.\n\n- If the current square has all the same values, it becomes a leaf: `isLeaf = True`, `val` = that value, no children.\n- Otherwise `isLeaf = False` (its `val` can be anything), and you split the square into four equal quadrants and recurse.\n\nThe output is the tree in level order, each node as `[isLeaf, val]` with 1/0 for true/false; internal nodes are shown as `[0, 1]`.',
    constraints: ['`n == grid.length == grid[i].length`', '`n == 2^x` with `0 <= x <= 6`'],
    sig: { name: 'construct', params: [{ name: 'grid', type: 'int[][]' }], returns: 'QuadNode' },
    tests: [
      { args: [[[0, 1], [1, 0]]], expected: [[0, 1], [1, 0], [1, 1], [1, 1], [1, 0]] },
      { args: [[[1, 1], [1, 1]]], expected: [[1, 1]] },
      { args: [[[0]]], expected: [[1, 0]] },
      { args: [[[1, 1, 0, 0], [1, 1, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1]]], expected: [[0, 1], [1, 1], [1, 0], [1, 1], [1, 1]] },
      { args: [[[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 0], [1, 1, 0, 1]]], expected: [[0, 1], [1, 1], [1, 1], [1, 1], [0, 1], [1, 0], [1, 0], [1, 0], [1, 1]] },
    ],
    notes: ['The grid is mixed, so the root is internal; each 1×1 quadrant becomes a leaf (top-left 0, top-right 1, bottom-left 1, bottom-right 0).'],
    hints: ['Check whether the whole square is uniform; if so, return a leaf.', 'Otherwise split into four squares of half the size and build each recursively.'],
    approaches: [
      { name: 'Check then split', idea: 'Scan the square; uniform squares become leaves, others recurse on four quadrants.', time: 'O(n² log n)', space: 'O(log n)' },
      { name: 'Build bottom-up', idea: 'Recurse first; if all four children are leaves with the same value, merge them into one leaf. Every cell is read once.', time: 'O(n²)', space: 'O(log n)' },
    ],
    solution: {
      python: `class Solution:
    def construct(self, grid: List[List[int]]) -> Node:
        def build(r, c, n):
            first = grid[r][c]
            if all(grid[i][j] == first for i in range(r, r + n) for j in range(c, c + n)):
                return Node(first == 1, True)
            h = n // 2
            return Node(True, False, build(r, c, h), build(r, c + h, h), build(r + h, c, h), build(r + h, c + h, h))
        return build(0, 0, len(grid))
`,
      java: `class Solution {
    public Node construct(int[][] grid) {
        return build(grid, 0, 0, grid.length);
    }

    private Node build(int[][] g, int r, int c, int n) {
        boolean same = true;
        for (int i = r; i < r + n && same; i++)
            for (int j = c; j < c + n; j++)
                if (g[i][j] != g[r][c]) { same = false; break; }
        if (same) return new Node(g[r][c] == 1, true);
        int h = n / 2;
        return new Node(true, false, build(g, r, c, h), build(g, r, c + h, h), build(g, r + h, c, h), build(g, r + h, c + h, h));
    }
}
`,
    },
  },
  {
    id: 'sort-an-array',
    title: 'Sort an Array',
    difficulty: 'Medium',
    topic: 'divide-conquer',
    statement: 'Sort an integer array in ascending order **without** using built-in sort functions, in O(n log n) time.',
    constraints: ['`1 <= nums.length <= 5 * 10^4`'],
    sig: { name: 'sortArray', params: [{ name: 'nums', type: 'int[]' }], returns: 'int[]' },
    tests: [
      { args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
      { args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
      { args: [[1]], expected: [1] },
      { args: [[-4, 10, -4, 3]], expected: [-4, -4, 3, 10] },
    ],
    hints: ['Merge sort guarantees O(n log n).', 'Split in half, sort each half recursively, merge.'],
    approaches: [
      { name: 'Merge sort', idea: 'Recursively sort halves and merge with a temporary buffer.', time: 'O(n log n)', space: 'O(n)' },
      { name: 'Heap sort', idea: 'Build a max-heap and repeatedly move the max to the end.', time: 'O(n log n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        if len(nums) <= 1:
            return nums
        mid = len(nums) // 2
        a, b = self.sortArray(nums[:mid]), self.sortArray(nums[mid:])
        res, i, j = [], 0, 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                res.append(a[i]); i += 1
            else:
                res.append(b[j]); j += 1
        return res + a[i:] + b[j:]
`,
      java: `class Solution {
    public int[] sortArray(int[] nums) {
        mergeSort(nums, 0, nums.length, new int[nums.length]);
        return nums;
    }

    private void mergeSort(int[] a, int lo, int hi, int[] tmp) {
        if (hi - lo <= 1) return;
        int mid = (lo + hi) >>> 1;
        mergeSort(a, lo, mid, tmp);
        mergeSort(a, mid, hi, tmp);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        System.arraycopy(tmp, lo, a, lo, hi - lo);
    }
}
`,
    },
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topic: 'divide-conquer',
    lc150: true,
    statement: 'You are given an array of `k` linked lists, each sorted in ascending order. Merge them into one sorted linked list and return it.',
    constraints: ['`0 <= k <= 10^4`', 'Total nodes ≤ `10^4`'],
    sig: { name: 'mergeKLists', params: [{ name: 'lists', type: 'ListNode[]' }], returns: 'ListNode' },
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expected: [] },
      { args: [[[]]], expected: [] },
      { args: [[[2], [], [1]]], expected: [1, 2] },
    ],
    hints: ['A min-heap of the current head of each list gives the next smallest node in O(log k).', 'Alternatively, merge lists in pairs (divide and conquer).'],
    approaches: [
      { name: 'Min-heap', idea: 'Push every list head; repeatedly pop the smallest and push its successor.', time: 'O(N log k)', space: 'O(k)' },
      { name: 'Pairwise merging', idea: 'Merge lists two at a time, halving their number each round.', time: 'O(N log k)', space: 'O(1)' },
    ],
    solution: {
      python: `import heapq

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
`,
      java: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode n : lists) if (n != null) pq.offer(n);
        ListNode dummy = new ListNode(), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode n = pq.poll();
            tail.next = n;
            tail = n;
            if (n.next != null) pq.offer(n.next);
        }
        return dummy.next;
    }
}
`,
    },
  },
  // ---------------- Kadane ----------------
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topic: 'arrays',
    lc150: true,
    statement: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.',
    constraints: ['`1 <= nums.length <= 10^5`', '`-10^4 <= nums[i] <= 10^4`'],
    sig: { name: 'maxSubArray', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-3, -1, -2]], expected: -1 },
    ],
    notes: ['The subarray [4, -1, 2, 1] has the largest sum, 6.'],
    hints: ['The best subarray ending at `i` either extends the best one ending at `i - 1` or starts fresh at `i`.', 'Kadane\'s algorithm keeps that running value and the overall best.'],
    approaches: [
      { name: 'All subarrays', idea: 'Try every start and end.', time: 'O(n²)', space: 'O(1)' },
      { name: 'Kadane\'s algorithm', idea: '`cur = max(x, cur + x)`; `best = max(best, cur)`.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best
`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int best = nums[0], cur = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'maximum-sum-circular-subarray',
    title: 'Maximum Sum Circular Subarray',
    difficulty: 'Medium',
    topic: 'arrays',
    lc150: true,
    statement: 'Given a **circular** integer array `nums` (the end wraps around to the start), return the maximum possible sum of a non-empty subarray. Each element may be included at most once.',
    constraints: ['`1 <= n <= 3 * 10^4`'],
    sig: { name: 'maxSubarraySumCircular', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, -2, 3, -2]], expected: 3 },
      { args: [[5, -3, 5]], expected: 10 },
      { args: [[-3, -2, -3]], expected: -2 },
      { args: [[3, -1, 2, -1]], expected: 4 },
    ],
    hints: ['Either the best subarray doesn\'t wrap (plain Kadane), or it wraps — which means it is the total minus a minimum subarray in the middle.', 'If every number is negative, the wrapping case would be empty; return the plain maximum.'],
    approaches: [{ name: 'Kadane for max and min', idea: 'Answer = max(maxSub, total − minSub), unless all values are negative.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        total = 0
        cur_max = cur_min = 0
        best_max, best_min = nums[0], nums[0]
        for x in nums:
            cur_max = max(x, cur_max + x)
            best_max = max(best_max, cur_max)
            cur_min = min(x, cur_min + x)
            best_min = min(best_min, cur_min)
            total += x
        return best_max if best_max < 0 else max(best_max, total - best_min)
`,
      java: `class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total = 0, curMax = 0, curMin = 0, bestMax = nums[0], bestMin = nums[0];
        for (int x : nums) {
            curMax = Math.max(x, curMax + x);
            bestMax = Math.max(bestMax, curMax);
            curMin = Math.min(x, curMin + x);
            bestMin = Math.min(bestMin, curMin);
            total += x;
        }
        return bestMax < 0 ? bestMax : Math.max(bestMax, total - bestMin);
    }
}
`,
    },
  },
  // ---------------- Binary search ----------------
  {
    id: 'search-insert-position',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    topic: 'binary-search',
    lc150: true,
    statement: 'Given a sorted array of distinct integers and a `target`, return the index if found; otherwise return the index where it would be inserted to keep the array sorted. Use O(log n) time.',
    constraints: ['`1 <= nums.length <= 10^4`', 'Distinct, ascending'],
    sig: { name: 'searchInsert', params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[1, 3, 5, 6], 5], expected: 2 },
      { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 },
      { args: [[1, 3, 5, 6], 0], expected: 0 },
    ],
    hints: ['You need the first index with `nums[i] >= target` (lower bound).', 'Use a half-open range `[lo, hi)` with `hi = len(nums)`.'],
    approaches: [{ name: 'Lower-bound binary search', idea: 'Shrink the range until `lo == hi`, which is the insertion point.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo
`,
      java: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < target) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}
`,
    },
  },
  {
    id: 'search-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    topic: 'binary-search',
    lc150: true,
    statement: 'Each row of an `m × n` matrix is sorted, and the first integer of each row is greater than the last integer of the previous row. Return `true` if `target` is in the matrix, in O(log(m·n)) time.',
    constraints: ['`1 <= m, n <= 100`'],
    sig: { name: 'searchMatrix', params: [{ name: 'matrix', type: 'int[][]' }, { name: 'target', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
      { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
      { args: [[[1]], 1], expected: true },
      { args: [[[1, 3]], 3], expected: true },
    ],
    hints: ['Treat the matrix as one sorted array of length `m·n`.', 'Index `k` maps to `matrix[k // n][k % n]`.'],
    approaches: [{ name: 'Binary search on flattened index', idea: 'Standard binary search over `[0, m·n)` with index conversion.', time: 'O(log(m·n))', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            v = matrix[mid // n][mid % n]
            if v == target:
                return True
            if v < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False
`,
      java: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length, lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1, v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target) lo = mid + 1; else hi = mid - 1;
        }
        return false;
    }
}
`,
    },
  },
  {
    id: 'find-peak-element',
    title: 'Find Peak Element',
    difficulty: 'Medium',
    topic: 'binary-search',
    lc150: true,
    statement: 'A peak element is strictly greater than its neighbours. Given `nums` where `nums[i] != nums[i+1]`, return the index of **any** peak. Treat `nums[-1]` and `nums[n]` as −∞. Use O(log n) time.',
    constraints: ['`1 <= nums.length <= 1000`'],
    sig: { name: 'findPeakElement', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 2, 3, 1]], expected: 2 },
      { args: [[1, 2, 1, 3, 5, 6, 4]], expected: 5 },
      { args: [[1]], expected: 0 },
      { args: [[2, 1]], expected: 0 },
      { args: [[1, 2]], expected: 1 },
    ],
    check: (args, actual) => {
      const a: number[] = args[0];
      const i = actual;
      if (typeof i !== 'number' || i < 0 || i >= a.length) return false;
      return (i === 0 || a[i] > a[i - 1]) && (i === a.length - 1 || a[i] > a[i + 1]);
    },
    notes: ['', 'Index 1 (value 2) is also a valid peak.'],
    hints: ['If `nums[mid] < nums[mid + 1]`, a peak must exist to the right.', 'Otherwise a peak exists at `mid` or to its left.'],
    approaches: [{ name: 'Binary search on the slope', idea: 'Always move toward the higher neighbour; the boundary condition guarantees a peak in that half.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < nums[mid + 1]:
                lo = mid + 1
            else:
                hi = mid
        return lo
`,
      java: `class Solution {
    public int findPeakElement(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}
`,
    },
  },
  {
    id: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'binary-search',
    lc150: true,
    statement: 'A sorted array of distinct integers has been rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`). Return the index of `target`, or `-1`. Use O(log n) time.',
    constraints: ['`1 <= nums.length <= 5000`', 'All values distinct'],
    sig: { name: 'search', params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[3, 1], 1], expected: 1 },
      { args: [[5, 1, 3], 5], expected: 0 },
    ],
    hints: ['At any `mid`, at least one half (`lo..mid` or `mid..hi`) is sorted.', 'Check whether the target lies within the sorted half\'s range; if so search there, else search the other half.'],
    approaches: [{ name: 'Modified binary search', idea: 'Identify the sorted half each step and decide which half can contain the target.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1
`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
            }
        }
        return -1;
    }
}
`,
    },
  },
  {
    id: 'find-first-last-position',
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    topic: 'binary-search',
    lc150: true,
    statement: 'Given an array sorted in non-decreasing order, return the first and last index of `target`, or `[-1, -1]` if it is absent. Use O(log n) time.',
    constraints: ['`0 <= nums.length <= 10^5`'],
    sig: { name: 'searchRange', params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'int[]' },
    tests: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { args: [[], 0], expected: [-1, -1] },
      { args: [[1], 1], expected: [0, 0] },
      { args: [[2, 2, 2], 2], expected: [0, 2] },
    ],
    hints: ['Run a lower-bound search for `target` and for `target + 1`.', 'The range is `[lb(target), lb(target+1) - 1]` if `target` exists.'],
    approaches: [{ name: 'Two lower-bound searches', idea: 'Both boundaries come from the same helper.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lb(x):
            lo, hi = 0, len(nums)
            while lo < hi:
                mid = (lo + hi) // 2
                if nums[mid] < x:
                    lo = mid + 1
                else:
                    hi = mid
            return lo
        a = lb(target)
        if a == len(nums) or nums[a] != target:
            return [-1, -1]
        return [a, lb(target + 1) - 1]
`,
      java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int a = lb(nums, target);
        if (a == nums.length || nums[a] != target) return new int[]{-1, -1};
        return new int[]{a, lb(nums, target + 1) - 1};
    }

    private int lb(int[] nums, int x) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < x) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}
`,
    },
  },
  {
    id: 'find-min-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'binary-search',
    lc150: true,
    statement: 'Given a rotated sorted array of unique elements, return its minimum element in O(log n) time.',
    constraints: ['`1 <= n <= 5000`', 'All values unique'],
    sig: { name: 'findMin', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 4, 5, 1, 2]], expected: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { args: [[11, 13, 15, 17]], expected: 11 },
      { args: [[2, 1]], expected: 1 },
    ],
    hints: ['Compare `nums[mid]` with `nums[hi]`.', 'If `nums[mid] > nums[hi]`, the minimum is to the right of mid; otherwise it is at mid or to the left.'],
    approaches: [{ name: 'Binary search against the right end', idea: 'The minimum is the only point where the order breaks; comparing with `nums[hi]` locates it.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]
`,
      java: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
        }
        return nums[lo];
    }
}
`,
    },
  },
  {
    id: 'median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    topic: 'binary-search',
    lc150: true,
    statement: 'Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n`, return the median of the combined data. The overall run time should be O(log(m + n)).',
    constraints: ['`0 <= m, n <= 1000`', '`1 <= m + n <= 2000`'],
    sig: { name: 'findMedianSortedArrays', params: [{ name: 'nums1', type: 'int[]' }, { name: 'nums2', type: 'int[]' }], returns: 'double' },
    tests: [
      { args: [[1, 3], [2]], expected: 2.0 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[], [1]], expected: 1.0 },
      { args: [[0, 0], [0, 0]], expected: 0.0 },
      { args: [[1, 3, 8, 9, 15], [7, 11, 18, 19, 21, 25]], expected: 11.0 },
    ],
    hints: ['Binary search a partition of the shorter array so that the left halves of both arrays together hold half the elements.', 'A partition is correct when `maxLeft1 <= minRight2` and `maxLeft2 <= minRight1`.'],
    approaches: [
      { name: 'Merge', idea: 'Merge until the middle.', time: 'O(m + n)', space: 'O(1)' },
      { name: 'Partition binary search', idea: 'Search the cut in the shorter array; the matching cut in the other array is implied.', time: 'O(log min(m, n))', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        a, b = (nums1, nums2) if len(nums1) <= len(nums2) else (nums2, nums1)
        m, n = len(a), len(b)
        half = (m + n + 1) // 2
        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = half - i
            a_left = a[i - 1] if i > 0 else float('-inf')
            a_right = a[i] if i < m else float('inf')
            b_left = b[j - 1] if j > 0 else float('-inf')
            b_right = b[j] if j < n else float('inf')
            if a_left <= b_right and b_left <= a_right:
                if (m + n) % 2:
                    return float(max(a_left, b_left))
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            if a_left > b_right:
                hi = i - 1
            else:
                lo = i + 1
        return 0.0
`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] a = nums1.length <= nums2.length ? nums1 : nums2, b = a == nums1 ? nums2 : nums1;
        int m = a.length, n = b.length, half = (m + n + 1) / 2, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) >>> 1, j = half - i;
            long aL = i > 0 ? a[i - 1] : Long.MIN_VALUE, aR = i < m ? a[i] : Long.MAX_VALUE;
            long bL = j > 0 ? b[j - 1] : Long.MIN_VALUE, bR = j < n ? b[j] : Long.MAX_VALUE;
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            }
            if (aL > bR) hi = i - 1; else lo = i + 1;
        }
        return 0.0;
    }
}
`,
    },
  },
];

export default problems;
