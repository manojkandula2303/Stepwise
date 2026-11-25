import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    topic: 'arrays',
    lc150: true,
    statement:
      'You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n` — the number of real elements in each.\n\nMerge `nums2` into `nums1` **in place** so that `nums1` becomes one sorted array. `nums1` has length `m + n`; its last `n` slots are zeros reserved for the merge.',
    constraints: ['`nums1.length == m + n`', '`0 <= m, n <= 200`', '`-10^9 <= nums1[i], nums2[j] <= 10^9`'],
    sig: { name: 'merge', params: [{ name: 'nums1', type: 'int[]' }, { name: 'm', type: 'int' }, { name: 'nums2', type: 'int[]' }, { name: 'n', type: 'int' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
      { args: [[1], 1, [], 0], expected: [1] },
      { args: [[0], 0, [1], 1], expected: [1] },
      { args: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], expected: [1, 2, 3, 4, 5, 6] },
      { args: [[-1, 0, 0, 3, 3, 3, 0, 0, 0], 6, [1, 2, 2], 3], expected: [-1, 0, 0, 1, 2, 2, 3, 3, 3] },
    ],
    hints: ['Filling from the front would overwrite values you still need. Where is there free space?', 'Use three pointers starting at the ends: `i = m-1`, `j = n-1`, `k = m+n-1`. Place the larger value at `k`.'],
    approaches: [
      { name: 'Copy and sort', idea: 'Copy `nums2` into the tail of `nums1` and sort the whole array.', time: 'O((m+n) log(m+n))', space: 'O(1)' },
      { name: 'Three pointers from the end', idea: 'Compare the largest remaining elements of both arrays and write the bigger one into the last free slot. Stop when `nums2` is exhausted — any remaining `nums1` elements are already in place.', time: 'O(m + n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
`,
      java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
}
`,
    },
  },
  {
    id: 'remove-element',
    title: 'Remove Element',
    difficulty: 'Easy',
    topic: 'two-pointers',
    lc150: true,
    statement:
      'Given an integer array `nums` and an integer `val`, remove every occurrence of `val` **in place** and return `k`, the number of remaining elements.\n\nThe first `k` elements of `nums` must hold the kept values (in any order). What lies beyond index `k` does not matter. The judge checks the first `k` elements.',
    constraints: ['`0 <= nums.length <= 100`', '`0 <= nums[i], val <= 100`'],
    sig: { name: 'removeElement', params: [{ name: 'nums', type: 'int[]' }, { name: 'val', type: 'int' }], returns: 'int', prefix: 0 },
    compare: 'unordered',
    tests: [
      { args: [[3, 2, 2, 3], 3], expected: [2, 2] },
      { args: [[0, 1, 2, 2, 3, 0, 4, 2], 2], expected: [0, 1, 3, 0, 4] },
      { args: [[], 1], expected: [] },
      { args: [[1, 1, 1], 1], expected: [] },
      { args: [[4, 5], 6], expected: [4, 5] },
    ],
    notes: ['Return k = 2; the first two elements are both 2.'],
    hints: ['Keep a write pointer `k`. Walk through the array with a read pointer.', 'Whenever `nums[i] != val`, copy it to `nums[k]` and advance `k`.'],
    approaches: [{ name: 'Read/write pointers', idea: 'A single pass copies every element that is not `val` forward to the write position. The write pointer ends at the new length.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        k = 0
        for x in nums:
            if x != val:
                nums[k] = x
                k += 1
        return k
`,
      java: `class Solution {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int x : nums) if (x != val) nums[k++] = x;
        return k;
    }
}
`,
    },
  },
  {
    id: 'remove-duplicates-sorted',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given an integer array `nums` sorted in non-decreasing order, remove duplicates **in place** so each unique element appears once, keeping the relative order. Return `k`, the number of unique elements. The judge checks the first `k` elements.',
    constraints: ['`1 <= nums.length <= 3 * 10^4`', '`nums` is sorted in non-decreasing order'],
    sig: { name: 'removeDuplicates', params: [{ name: 'nums', type: 'int[]' }], returns: 'int', prefix: 0 },
    tests: [
      { args: [[1, 1, 2]], expected: [1, 2] },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4] },
      { args: [[7]], expected: [7] },
      { args: [[-3, -3, -3]], expected: [-3] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
    ],
    hints: ['Because the array is sorted, duplicates are adjacent.', 'Write `nums[i]` only when it differs from the last value you wrote.'],
    approaches: [{ name: 'Two pointers', idea: '`k` points to the next write slot. Each new value (different from `nums[k-1]`) is written at `k`.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
`,
      java: `class Solution {
    public int removeDuplicates(int[] nums) {
        int k = 1;
        for (int i = 1; i < nums.length; i++)
            if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
        return k;
    }
}
`,
    },
  },
  {
    id: 'remove-duplicates-sorted-ii',
    title: 'Remove Duplicates from Sorted Array II',
    difficulty: 'Medium',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given a sorted integer array `nums`, remove duplicates **in place** so that each unique element appears **at most twice**. Return `k`, the new length; the first `k` elements must hold the result in order.',
    constraints: ['`1 <= nums.length <= 3 * 10^4`', '`nums` is sorted in non-decreasing order'],
    sig: { name: 'removeDuplicates', params: [{ name: 'nums', type: 'int[]' }], returns: 'int', prefix: 0 },
    tests: [
      { args: [[1, 1, 1, 2, 2, 3]], expected: [1, 1, 2, 2, 3] },
      { args: [[0, 0, 1, 1, 1, 1, 2, 3, 3]], expected: [0, 0, 1, 1, 2, 3, 3] },
      { args: [[1]], expected: [1] },
      { args: [[2, 2]], expected: [2, 2] },
      { args: [[5, 5, 5, 5, 5]], expected: [5, 5] },
    ],
    hints: ['Generalise the previous problem: compare against the element two slots behind the write pointer.', 'Write `x` if `k < 2` or `x != nums[k-2]`.'],
    approaches: [{ name: 'Two pointers, look back two', idea: 'An element may be kept if fewer than two copies have been written, which is exactly when it differs from `nums[k-2]`.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        k = 0
        for x in nums:
            if k < 2 or x != nums[k - 2]:
                nums[k] = x
                k += 1
        return k
`,
      java: `class Solution {
    public int removeDuplicates(int[] nums) {
        int k = 0;
        for (int x : nums)
            if (k < 2 || x != nums[k - 2]) nums[k++] = x;
        return k;
    }
}
`,
    },
  },
  {
    id: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Given an array `nums` of size `n`, return the majority element — the value that appears **more than** `⌊n / 2⌋` times. You may assume it always exists.',
    constraints: ['`1 <= n <= 5 * 10^4`', 'A majority element always exists.'],
    sig: { name: 'majorityElement', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 2, 3]], expected: 3 },
      { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
      { args: [[1]], expected: 1 },
      { args: [[-1, -1, 5]], expected: -1 },
      { args: [[6, 5, 5]], expected: 5 },
    ],
    hints: ['A hash map of counts works in O(n) space. Can you do O(1)?', 'Boyer–Moore voting: keep a candidate and a counter; matching values increment, others decrement.'],
    approaches: [
      { name: 'Hash map counts', idea: 'Count occurrences and return the value whose count exceeds n/2.', time: 'O(n)', space: 'O(n)' },
      { name: 'Boyer–Moore voting', idea: 'Pair off each majority element against a different element. Since the majority has more than half, it survives as the final candidate.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = None, 0
        for x in nums:
            if count == 0:
                candidate = x
            count += 1 if x == candidate else -1
        return candidate
`,
      java: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
}
`,
    },
  },
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    topic: 'arrays',
    lc150: true,
    statement: 'Given an integer array `nums`, rotate it to the right by `k` steps **in place**, where `k` is non-negative.',
    constraints: ['`1 <= nums.length <= 10^5`', '`0 <= k <= 10^5`'],
    sig: { name: 'rotate', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
      { args: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
      { args: [[1, 2], 3], expected: [2, 1] },
      { args: [[1], 0], expected: [1] },
      { args: [[1, 2, 3], 3], expected: [1, 2, 3] },
    ],
    hints: ['Rotating by `n` steps changes nothing, so use `k % n`.', 'Reverse the whole array, then reverse the first `k` and the remaining `n-k` elements separately.'],
    approaches: [
      { name: 'Extra array', idea: 'Place each `nums[i]` at index `(i + k) % n` of a new array, then copy back.', time: 'O(n)', space: 'O(n)' },
      { name: 'Three reversals', idea: 'Reversing the whole array moves the last `k` elements to the front (reversed). Reversing each part restores their order.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k %= n

        def rev(lo, hi):
            while lo < hi:
                nums[lo], nums[hi] = nums[hi], nums[lo]
                lo += 1
                hi -= 1

        rev(0, n - 1)
        rev(0, k - 1)
        rev(k, n - 1)
`,
      java: `class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] a, int lo, int hi) {
        while (lo < hi) {
            int t = a[lo]; a[lo++] = a[hi]; a[hi--] = t;
        }
    }
}
`,
    },
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'arrays',
    lc150: true,
    statement: 'You are given an array `prices` where `prices[i]` is a stock price on day `i`. Choose one day to buy and a **later** day to sell. Return the maximum profit, or `0` if no profit is possible.',
    constraints: ['`1 <= prices.length <= 10^5`', '`0 <= prices[i] <= 10^4`'],
    sig: { name: 'maxProfit', params: [{ name: 'prices', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
      { args: [[3, 2, 6, 5, 0, 3]], expected: 4 },
    ],
    notes: ['Buy on day 1 (price 1), sell on day 4 (price 6).'],
    hints: ['For each day, the best buy is the cheapest price seen so far.', 'Track `minPrice` and the best `price - minPrice` in one pass.'],
    approaches: [
      { name: 'All pairs', idea: 'Try every buy/sell pair.', time: 'O(n²)', space: 'O(1)' },
      { name: 'Running minimum', idea: 'Selling today is best when we bought at the lowest earlier price. Keep that minimum as you scan.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        lo, best = float('inf'), 0
        for p in prices:
            lo = min(lo, p)
            best = max(best, p - lo)
        return best
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int lo = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            lo = Math.min(lo, p);
            best = Math.max(best, p - lo);
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'best-time-stock-ii',
    title: 'Best Time to Buy and Sell Stock II',
    difficulty: 'Medium',
    topic: 'greedy',
    lc150: true,
    statement: 'You may buy and sell the stock as many times as you like, but hold at most one share at a time (you may buy and sell on the same day). Return the maximum total profit.',
    constraints: ['`1 <= prices.length <= 3 * 10^4`', '`0 <= prices[i] <= 10^4`'],
    sig: { name: 'maxProfit', params: [{ name: 'prices', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 7 },
      { args: [[1, 2, 3, 4, 5]], expected: 4 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[2, 1, 2, 0, 1]], expected: 2 },
      { args: [[5]], expected: 0 },
    ],
    hints: ['Any rising stretch can be split into daily gains.', 'Add every positive difference `prices[i] - prices[i-1]`.'],
    approaches: [{ name: 'Collect every upswing', idea: 'Profit over a rising run equals the sum of its day-to-day increases, so greedily take each positive difference.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int total = 0;
        for (int i = 1; i < prices.length; i++)
            total += Math.max(0, prices[i] - prices[i - 1]);
        return total;
    }
}
`,
    },
  },
  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    topic: 'greedy',
    lc150: true,
    statement: 'You start at index `0` of `nums`. Each element is your maximum jump length from that position. Return `true` if you can reach the last index.',
    constraints: ['`1 <= nums.length <= 10^4`', '`0 <= nums[i] <= 10^5`'],
    sig: { name: 'canJump', params: [{ name: 'nums', type: 'int[]' }], returns: 'bool' },
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false },
      { args: [[0]], expected: true },
      { args: [[2, 0, 0]], expected: true },
      { args: [[1, 0, 1]], expected: false },
    ],
    hints: ['Track the furthest index reachable so far.', 'If the current index is beyond the furthest reach, you are stuck.'],
    approaches: [{ name: 'Greedy reach', idea: 'Scan left to right maintaining `reach = max(reach, i + nums[i])`. If `i > reach` at any point, return false.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0
        for i, x in enumerate(nums):
            if i > reach:
                return False
            reach = max(reach, i + x)
        return True
`,
      java: `class Solution {
    public boolean canJump(int[] nums) {
        int reach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) return false;
            reach = Math.max(reach, i + nums[i]);
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'jump-game-ii',
    title: 'Jump Game II',
    difficulty: 'Medium',
    topic: 'greedy',
    lc150: true,
    statement: 'Each `nums[i]` is the maximum jump length from index `i`. Starting at index `0`, return the **minimum number of jumps** to reach the last index. The last index is always reachable.',
    constraints: ['`1 <= nums.length <= 10^4`', '`0 <= nums[i] <= 1000`'],
    sig: { name: 'jump', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: 2 },
      { args: [[2, 3, 0, 1, 4]], expected: 2 },
      { args: [[0]], expected: 0 },
      { args: [[1, 1, 1, 1]], expected: 3 },
      { args: [[5, 1, 1, 1, 1]], expected: 1 },
    ],
    hints: ['Think in BFS layers: all indices reachable with `j` jumps form a window.', 'When you reach the end of the current window, you must jump; the next window ends at the furthest reach seen.'],
    approaches: [{ name: 'Greedy BFS by windows', idea: 'Keep `end` (edge of the current jump range) and `far` (best reach). When `i == end`, take a jump and set `end = far`.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = end = far = 0
        for i in range(len(nums) - 1):
            far = max(far, i + nums[i])
            if i == end:
                jumps += 1
                end = far
        return jumps
`,
      java: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            far = Math.max(far, i + nums[i]);
            if (i == end) {
                jumps++;
                end = far;
            }
        }
        return jumps;
    }
}
`,
    },
  },
  {
    id: 'h-index',
    title: 'H-Index',
    difficulty: 'Medium',
    topic: 'sorting',
    lc150: true,
    statement: 'Given `citations[i]`, the number of citations of a researcher\'s `i`-th paper, return their h-index: the largest `h` such that at least `h` papers have at least `h` citations each.',
    constraints: ['`1 <= n <= 5000`', '`0 <= citations[i] <= 1000`'],
    sig: { name: 'hIndex', params: [{ name: 'citations', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 0, 6, 1, 5]], expected: 3 },
      { args: [[1, 3, 1]], expected: 1 },
      { args: [[0, 0]], expected: 0 },
      { args: [[100]], expected: 1 },
      { args: [[4, 4, 4, 4]], expected: 4 },
    ],
    hints: ['Sort citations in descending order.', 'The h-index is the number of positions `i` (1-based) where `citations[i-1] >= i`.'],
    approaches: [
      { name: 'Sort', idea: 'After sorting descending, h grows while the i-th paper has at least i citations.', time: 'O(n log n)', space: 'O(1)' },
      { name: 'Counting buckets', idea: 'Bucket counts by citations (capped at n), then scan from high to low accumulating papers.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def hIndex(self, citations: List[int]) -> int:
        citations.sort(reverse=True)
        h = 0
        for i, c in enumerate(citations, 1):
            if c >= i:
                h = i
        return h
`,
      java: `class Solution {
    public int hIndex(int[] citations) {
        Arrays.sort(citations);
        int n = citations.length, h = 0;
        for (int i = 0; i < n; i++) {
            int papers = n - i;
            if (citations[i] >= papers) return papers;
        }
        return h;
    }
}
`,
    },
  },
  {
    id: 'insert-delete-getrandom',
    title: 'Insert Delete GetRandom O(1)',
    difficulty: 'Medium',
    topic: 'hashing',
    lc150: true,
    statement:
      'Implement `RandomizedSet`:\n\n- `insert(val)` adds `val` if absent; returns `true` if it was added.\n- `remove(val)` removes `val` if present; returns `true` if it was removed.\n- `getRandom()` returns a random element (each with equal probability). It is only called when the set is non-empty.\n\nEvery operation must run in **average O(1)** time.',
    constraints: ['At most `2 * 10^5` calls'],
    sig: {
      kind: 'design',
      className: 'RandomizedSet',
      ctor: [],
      methods: [
        { name: 'insert', params: [{ name: 'val', type: 'int' }], returns: 'bool' },
        { name: 'remove', params: [{ name: 'val', type: 'int' }], returns: 'bool' },
        { name: 'getRandom', params: [], returns: 'int' },
      ],
    },
    tests: [
      { args: [['RandomizedSet', 'insert', 'remove', 'insert', 'getRandom', 'remove', 'insert', 'getRandom'], [[], [1], [2], [2], [], [1], [2], []]], expected: [null, true, false, true, -1, true, false, 2] },
      { args: [['RandomizedSet', 'insert', 'insert', 'remove', 'insert', 'getRandom'], [[], [5], [5], [5], [6], []]], expected: [null, true, false, true, true, 6] },
      { args: [['RandomizedSet', 'insert', 'remove', 'insert', 'getRandom'], [[], [0], [0], [-1], []]], expected: [null, true, true, true, -1] },
    ],
    check: (args, actual, expected) => {
      if (!Array.isArray(actual) || actual.length !== expected.length) return false;
      const set = new Set<number>();
      const ops: string[] = args[0];
      const a: number[][] = args[1];
      for (let i = 1; i < ops.length; i++) {
        if (ops[i] === 'insert') set.add(a[i][0]);
        else if (ops[i] === 'remove') set.delete(a[i][0]);
        if (ops[i] === 'getRandom') {
          if (!set.has(actual[i])) return false;
        } else if (actual[i] !== expected[i]) return false;
      }
      return true;
    },
    notes: ['getRandom() may return any element currently in the set; here only 2 is present.'],
    hints: ['A hash map gives O(1) insert/remove but no O(1) random access. An array gives random access.', 'Store values in an array and map value → index. To remove, swap the element with the last one, then pop.'],
    approaches: [{ name: 'Array + index map', idea: 'Keep a dynamic array of values and a hash map from value to its index. Removal swaps the target with the last element, updates that element\'s index, and pops. `getRandom` picks a random array index.', time: 'O(1) average per operation', space: 'O(n)' }],
    solution: {
      python: `import random

class RandomizedSet:
    def __init__(self):
        self.vals = []
        self.pos = {}

    def insert(self, val: int) -> bool:
        if val in self.pos:
            return False
        self.pos[val] = len(self.vals)
        self.vals.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.pos:
            return False
        i, last = self.pos[val], self.vals[-1]
        self.vals[i] = last
        self.pos[last] = i
        self.vals.pop()
        del self.pos[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.vals)
`,
      java: `class RandomizedSet {
    private final List<Integer> vals = new ArrayList<>();
    private final Map<Integer, Integer> pos = new HashMap<>();
    private final Random rnd = new Random();

    public boolean insert(int val) {
        if (pos.containsKey(val)) return false;
        pos.put(val, vals.size());
        vals.add(val);
        return true;
    }

    public boolean remove(int val) {
        Integer i = pos.get(val);
        if (i == null) return false;
        int last = vals.get(vals.size() - 1);
        vals.set(i, last);
        pos.put(last, i);
        vals.remove(vals.size() - 1);
        pos.remove(val);
        return true;
    }

    public int getRandom() {
        return vals.get(rnd.nextInt(vals.size()));
    }
}
`,
    },
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'prefix-sum',
    lc150: true,
    statement: 'Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element except `nums[i]`. Do it in O(n) time **without** using division.',
    constraints: ['`2 <= nums.length <= 10^5`', '`-30 <= nums[i] <= 30`', 'All prefix/suffix products fit in a 32-bit integer.'],
    sig: { name: 'productExceptSelf', params: [{ name: 'nums', type: 'int[]' }], returns: 'int[]' },
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expected: [3, 2] },
      { args: [[0, 0]], expected: [0, 0] },
      { args: [[5, -2, 1, 1]], expected: [-2, 5, -10, -10] },
    ],
    hints: ['`answer[i]` = (product of everything left of i) × (product of everything right of i).', 'Fill the output with prefix products, then sweep from the right multiplying by a running suffix product.'],
    approaches: [
      { name: 'Prefix and suffix arrays', idea: 'Build `left[i]` and `right[i]` products, then multiply.', time: 'O(n)', space: 'O(n)' },
      { name: 'Output array as prefix, running suffix', idea: 'Reuse the output array for prefix products and keep the suffix product in a single variable.', time: 'O(n)', space: 'O(1) extra' },
    ],
    solution: {
      python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [1] * n
        for i in range(1, n):
            ans[i] = ans[i - 1] * nums[i - 1]
        suffix = 1
        for i in range(n - 1, -1, -1):
            ans[i] *= suffix
            suffix *= nums[i]
        return ans
`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
}
`,
    },
  },
  {
    id: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    topic: 'greedy',
    lc150: true,
    statement: 'There are `n` gas stations on a circular route. Station `i` has `gas[i]` fuel and it costs `cost[i]` to drive to station `i+1`. Starting with an empty tank, return the index of the station from which you can complete the full circuit clockwise, or `-1` if impossible. The answer is unique if it exists.',
    constraints: ['`1 <= n <= 10^5`', '`0 <= gas[i], cost[i] <= 10^4`'],
    sig: { name: 'canCompleteCircuit', params: [{ name: 'gas', type: 'int[]' }, { name: 'cost', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
      { args: [[2, 3, 4], [3, 4, 3]], expected: -1 },
      { args: [[5], [4]], expected: 0 },
      { args: [[3, 1, 1], [1, 2, 2]], expected: 0 },
      { args: [[1, 2], [2, 1]], expected: 1 },
    ],
    hints: ['If total gas < total cost, no start works.', 'If you run dry going from `s` to `i`, no station between `s` and `i` can be the start either — restart at `i+1`.'],
    approaches: [{ name: 'One-pass greedy', idea: 'Track total surplus and current tank. Whenever the tank drops below zero, set the start to the next station and reset the tank.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total = tank = start = 0
        for i in range(len(gas)):
            diff = gas[i] - cost[i]
            total += diff
            tank += diff
            if tank < 0:
                start, tank = i + 1, 0
        return start if total >= 0 else -1
`,
      java: `class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total >= 0 ? start : -1;
    }
}
`,
    },
  },
  {
    id: 'candy',
    title: 'Candy',
    difficulty: 'Hard',
    topic: 'greedy',
    lc150: true,
    statement: 'Children stand in a line with ratings `ratings[i]`. Give each child at least one candy, and give any child with a higher rating than an adjacent neighbour more candy than that neighbour. Return the minimum total candy.',
    constraints: ['`1 <= n <= 2 * 10^4`', '`0 <= ratings[i] <= 2 * 10^4`'],
    sig: { name: 'candy', params: [{ name: 'ratings', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 0, 2]], expected: 5 },
      { args: [[1, 2, 2]], expected: 4 },
      { args: [[5]], expected: 1 },
      { args: [[1, 3, 4, 5, 2]], expected: 11 },
      { args: [[3, 2, 1]], expected: 6 },
    ],
    hints: ['Satisfy the left-neighbour rule in one pass, then the right-neighbour rule in a second pass.', 'In the right-to-left pass, take `max(candies[i], candies[i+1] + 1)` so you don\'t break the first rule.'],
    approaches: [{ name: 'Two passes', idea: 'Left to right: if rating rises, give one more than the left neighbour. Right to left: if rating rises toward the left, ensure one more than the right neighbour, keeping the max.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        c = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                c[i] = c[i - 1] + 1
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                c[i] = max(c[i], c[i + 1] + 1)
        return sum(c)
`,
      java: `class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] c = new int[n];
        Arrays.fill(c, 1);
        for (int i = 1; i < n; i++)
            if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
        for (int i = n - 2; i >= 0; i--)
            if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
        int sum = 0;
        for (int x : c) sum += x;
        return sum;
    }
}
`,
    },
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much water is trapped after raining.',
    constraints: ['`1 <= n <= 2 * 10^4`', '`0 <= height[i] <= 10^5`'],
    sig: { name: 'trap', params: [{ name: 'height', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[1]], expected: 0 },
      { args: [[3, 0, 3]], expected: 3 },
      { args: [[1, 2, 3]], expected: 0 },
    ],
    hints: ['Water above bar `i` = `min(maxLeft, maxRight) - height[i]`.', 'With two pointers, the side with the smaller max is the bottleneck — process that side.'],
    approaches: [
      { name: 'Prefix/suffix maxima', idea: 'Precompute the tallest bar to the left and right of each index.', time: 'O(n)', space: 'O(n)' },
      { name: 'Two pointers', idea: 'Move the pointer with the smaller running max inward; its water level is fully determined by that max.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        lmax = rmax = water = 0
        while l < r:
            if height[l] < height[r]:
                lmax = max(lmax, height[l])
                water += lmax - height[l]
                l += 1
            else:
                rmax = max(rmax, height[r])
                water += rmax - height[r]
                r -= 1
        return water
`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lmax = Math.max(lmax, height[l]);
                water += lmax - height[l++];
            } else {
                rmax = Math.max(rmax, height[r]);
                water += rmax - height[r--];
            }
        }
        return water;
    }
}
`,
    },
  },
  {
    id: 'roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    topic: 'strings',
    lc150: true,
    statement: 'Convert a Roman numeral string `s` to an integer. Symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller symbol before a larger one is subtracted (e.g. `IV` = 4, `XC` = 90).',
    constraints: ['`1 <= s.length <= 15`', '`s` is a valid numeral in the range [1, 3999]'],
    sig: { name: 'romanToInt', params: [{ name: 's', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['III'], expected: 3 },
      { args: ['LVIII'], expected: 58 },
      { args: ['MCMXCIV'], expected: 1994 },
      { args: ['IX'], expected: 9 },
      { args: ['MMMCMXCIX'], expected: 3999 },
    ],
    hints: ['Map each symbol to its value.', 'If a symbol is smaller than the one after it, subtract it; otherwise add it.'],
    approaches: [{ name: 'Look-ahead scan', idea: 'Walk the string; subtract a value when the next symbol is larger, else add it.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def romanToInt(self, s: str) -> int:
        v = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i, ch in enumerate(s):
            if i + 1 < len(s) and v[ch] < v[s[i + 1]]:
                total -= v[ch]
            else:
                total += v[ch]
        return total
`,
      java: `class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> v = Map.of('I', 1, 'V', 5, 'X', 10, 'L', 50, 'C', 100, 'D', 500, 'M', 1000);
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = v.get(s.charAt(i));
            if (i + 1 < s.length() && cur < v.get(s.charAt(i + 1))) total -= cur;
            else total += cur;
        }
        return total;
    }
}
`,
    },
  },
  {
    id: 'integer-to-roman',
    title: 'Integer to Roman',
    difficulty: 'Medium',
    topic: 'strings',
    lc150: true,
    statement: 'Convert an integer `num` (1 ≤ num ≤ 3999) to a Roman numeral, using subtractive forms (`IV`, `IX`, `XL`, `XC`, `CD`, `CM`) where applicable.',
    constraints: ['`1 <= num <= 3999`'],
    sig: { name: 'intToRoman', params: [{ name: 'num', type: 'int' }], returns: 'string' },
    tests: [
      { args: [3749], expected: 'MMMDCCXLIX' },
      { args: [58], expected: 'LVIII' },
      { args: [1994], expected: 'MCMXCIV' },
      { args: [4], expected: 'IV' },
      { args: [3999], expected: 'MMMCMXCIX' },
    ],
    hints: ['List the 13 symbol values from largest to smallest, including the subtractive pairs.', 'Greedily subtract the largest value that fits.'],
    approaches: [{ name: 'Greedy with value table', idea: 'Iterate over (1000,M), (900,CM), … (1,I) and append each symbol while it fits.', time: 'O(1)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def intToRoman(self, num: int) -> str:
        table = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'), (100, 'C'), (90, 'XC'),
                 (50, 'L'), (40, 'XL'), (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]
        out = []
        for value, sym in table:
            while num >= value:
                out.append(sym)
                num -= value
        return ''.join(out)
`,
      java: `class Solution {
    public String intToRoman(int num) {
        int[] vals = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] syms = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < vals.length; i++)
            while (num >= vals[i]) { sb.append(syms[i]); num -= vals[i]; }
        return sb.toString();
    }
}
`,
    },
  },
  {
    id: 'length-of-last-word',
    title: 'Length of Last Word',
    difficulty: 'Easy',
    topic: 'strings',
    lc150: true,
    statement: 'Given a string `s` of words and spaces, return the length of the **last** word. A word is a maximal run of non-space characters.',
    constraints: ['`1 <= s.length <= 10^4`', 'There is at least one word.'],
    sig: { name: 'lengthOfLastWord', params: [{ name: 's', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['Hello World'], expected: 5 },
      { args: ['   fly me   to   the moon  '], expected: 4 },
      { args: ['luffy is still joyboy'], expected: 6 },
      { args: ['a'], expected: 1 },
      { args: ['day '], expected: 3 },
    ],
    hints: ['Skip trailing spaces from the end first.', 'Then count characters until the next space.'],
    approaches: [{ name: 'Scan from the end', idea: 'Move left past trailing spaces, then count non-space characters.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        i = len(s) - 1
        while s[i] == ' ':
            i -= 1
        n = 0
        while i >= 0 and s[i] != ' ':
            n += 1
            i -= 1
        return n
`,
      java: `class Solution {
    public int lengthOfLastWord(String s) {
        int i = s.length() - 1, n = 0;
        while (s.charAt(i) == ' ') i--;
        while (i >= 0 && s.charAt(i) != ' ') { n++; i--; }
        return n;
    }
}
`,
    },
  },
  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topic: 'strings',
    lc150: true,
    statement: 'Return the longest common prefix shared by all strings in `strs`, or an empty string if there is none.',
    constraints: ['`1 <= strs.length <= 200`', '`0 <= strs[i].length <= 200`'],
    sig: { name: 'longestCommonPrefix', params: [{ name: 'strs', type: 'string[]' }], returns: 'string' },
    tests: [
      { args: [['flower', 'flow', 'flight']], expected: 'fl' },
      { args: [['dog', 'racecar', 'car']], expected: '' },
      { args: [['alone']], expected: 'alone' },
      { args: [['', 'b']], expected: '' },
      { args: [['ab', 'abc', 'abd']], expected: 'ab' },
    ],
    hints: ['Compare characters column by column.', 'Stop at the first column where a string ends or characters differ.'],
    approaches: [{ name: 'Vertical scan', idea: 'For each index of the first string, check that every other string has the same character there.', time: 'O(S) where S is total characters', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        first = strs[0]
        for i, ch in enumerate(first):
            for s in strs[1:]:
                if i >= len(s) or s[i] != ch:
                    return first[:i]
        return first
`,
      java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];
        for (int i = 0; i < first.length(); i++)
            for (String s : strs)
                if (i >= s.length() || s.charAt(i) != first.charAt(i)) return first.substring(0, i);
        return first;
    }
}
`,
    },
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    topic: 'strings',
    lc150: true,
    statement: 'Given a string `s`, reverse the order of its words. Words are separated by one or more spaces. Return the words in reverse order joined by single spaces, with no leading or trailing spaces.',
    constraints: ['`1 <= s.length <= 10^4`', 'At least one word'],
    sig: { name: 'reverseWords', params: [{ name: 's', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['the sky is blue'], expected: 'blue is sky the' },
      { args: ['  hello world  '], expected: 'world hello' },
      { args: ['a good   example'], expected: 'example good a' },
      { args: ['single'], expected: 'single' },
    ],
    hints: ['Split on whitespace, ignoring empty pieces.', 'Reverse the list of words and join with one space.'],
    approaches: [{ name: 'Split, reverse, join', idea: 'Splitting on runs of whitespace discards extra spaces automatically.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def reverseWords(self, s: str) -> str:
        return ' '.join(reversed(s.split()))
`,
      java: `class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        Collections.reverse(Arrays.asList(words));
        return String.join(" ", words);
    }
}
`,
    },
  },
  {
    id: 'zigzag-conversion',
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    topic: 'strings',
    lc150: true,
    statement: 'Write string `s` in a zigzag pattern on `numRows` rows (down the rows, then diagonally up, repeating), then read it row by row. Return the resulting string.\n\nFor `"PAYPALISHIRING"` with 3 rows:\n\n```\nP   A   H   N\nA P L S I I G\nY   I   R\n```\nreads `"PAHNAPLSIIGYIR"`.',
    constraints: ['`1 <= s.length <= 1000`', '`1 <= numRows <= 1000`'],
    sig: { name: 'convert', params: [{ name: 's', type: 'string' }, { name: 'numRows', type: 'int' }], returns: 'string' },
    tests: [
      { args: ['PAYPALISHIRING', 3], expected: 'PAHNAPLSIIGYIR' },
      { args: ['PAYPALISHIRING', 4], expected: 'PINALSIGYAHRPI' },
      { args: ['A', 1], expected: 'A' },
      { args: ['AB', 1], expected: 'AB' },
      { args: ['ABCD', 2], expected: 'ACBD' },
    ],
    hints: ['Simulate: keep one string builder per row and a direction.', 'Flip direction when you hit the top or bottom row. Handle `numRows == 1` separately.'],
    approaches: [{ name: 'Row simulation', idea: 'Append each character to its current row, bouncing between row 0 and row numRows-1.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1:
            return s
        rows = [''] * numRows
        r, step = 0, 1
        for ch in s:
            rows[r] += ch
            if r == 0:
                step = 1
            elif r == numRows - 1:
                step = -1
            r += step
        return ''.join(rows)
`,
      java: `class Solution {
    public String convert(String s, int numRows) {
        if (numRows == 1) return s;
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int r = 0, step = 1;
        for (char ch : s.toCharArray()) {
            rows[r].append(ch);
            if (r == 0) step = 1;
            else if (r == numRows - 1) step = -1;
            r += step;
        }
        StringBuilder out = new StringBuilder();
        for (StringBuilder row : rows) out.append(row);
        return out.toString();
    }
}
`,
    },
  },
  {
    id: 'find-index-first-occurrence',
    title: 'Find the Index of the First Occurrence in a String',
    difficulty: 'Easy',
    topic: 'strings',
    lc150: true,
    statement: 'Return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` does not occur. Implement the search yourself rather than calling a built-in find.',
    constraints: ['`1 <= haystack.length, needle.length <= 10^4`'],
    sig: { name: 'strStr', params: [{ name: 'haystack', type: 'string' }, { name: 'needle', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['sadbutsad', 'sad'], expected: 0 },
      { args: ['leetcode', 'leeto'], expected: -1 },
      { args: ['hello', 'll'], expected: 2 },
      { args: ['a', 'a'], expected: 0 },
      { args: ['mississippi', 'issip'], expected: 4 },
    ],
    hints: ['Try every starting index `i` from 0 to `n - m`.', 'For linear time, look up the KMP failure function.'],
    approaches: [
      { name: 'Sliding comparison', idea: 'Compare the needle against each window of the haystack.', time: 'O(n·m)', space: 'O(1)' },
      { name: 'KMP', idea: 'Precompute the longest proper prefix that is also a suffix for each prefix of the needle so mismatches never re-scan the haystack.', time: 'O(n + m)', space: 'O(m)' },
    ],
    solution: {
      python: `class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n, m = len(haystack), len(needle)
        for i in range(n - m + 1):
            if haystack[i:i + m] == needle:
                return i
        return -1
`,
      java: `class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        for (int i = 0; i + m <= n; i++) {
            int j = 0;
            while (j < m && haystack.charAt(i + j) == needle.charAt(j)) j++;
            if (j == m) return i;
        }
        return -1;
    }
}
`,
    },
  },
  {
    id: 'text-justification',
    title: 'Text Justification',
    difficulty: 'Hard',
    topic: 'strings',
    lc150: true,
    statement:
      'Given `words` and a width `maxWidth`, format the text so each line has exactly `maxWidth` characters and is fully justified.\n\n- Pack as many words per line as fit (greedy).\n- Distribute extra spaces between words as evenly as possible; if they don\'t divide evenly, the left gaps get more.\n- A line with one word, and the **last** line, are left-justified (single spaces between words, padded on the right).',
    constraints: ['`1 <= words.length <= 300`', '`1 <= words[i].length <= maxWidth <= 100`'],
    sig: { name: 'fullJustify', params: [{ name: 'words', type: 'string[]' }, { name: 'maxWidth', type: 'int' }], returns: 'List<string>' },
    tests: [
      { args: [['This', 'is', 'an', 'example', 'of', 'text', 'justification.'], 16], expected: ['This    is    an', 'example  of text', 'justification.  '] },
      { args: [['What', 'must', 'be', 'acknowledgment', 'shall', 'be'], 16], expected: ['What   must   be', 'acknowledgment  ', 'shall be        '] },
      { args: [['a'], 1], expected: ['a'] },
      { args: [['a', 'b', 'c', 'd'], 3], expected: ['a b', 'c d'] },
    ],
    hints: ['First decide which words go on each line: keep adding while `letters + gaps <= maxWidth`.', 'For a middle line with `g` gaps and `spaces` total, each gap gets `spaces // g`, and the first `spaces % g` gaps get one extra.'],
    approaches: [{ name: 'Greedy lines + space distribution', idea: 'Group words greedily, then build each line: left-justify the last line and single-word lines; otherwise spread spaces with the remainder going to the leftmost gaps.', time: 'O(total characters)', space: 'O(total characters)' }],
    solution: {
      python: `class Solution:
    def fullJustify(self, words: List[str], maxWidth: int) -> List[str]:
        res, i, n = [], 0, len(words)
        while i < n:
            j, length = i, 0
            while j < n and length + len(words[j]) + (j - i) <= maxWidth:
                length += len(words[j])
                j += 1
            gaps = j - i - 1
            if j == n or gaps == 0:
                line = ' '.join(words[i:j])
                line += ' ' * (maxWidth - len(line))
            else:
                spaces = maxWidth - length
                q, r = divmod(spaces, gaps)
                line = ''
                for k in range(i, j - 1):
                    line += words[k] + ' ' * (q + (1 if k - i < r else 0))
                line += words[j - 1]
            res.append(line)
            i = j
        return res
`,
      java: `class Solution {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> res = new ArrayList<>();
        int i = 0, n = words.length;
        while (i < n) {
            int j = i, len = 0;
            while (j < n && len + words[j].length() + (j - i) <= maxWidth) len += words[j++].length();
            int gaps = j - i - 1;
            StringBuilder sb = new StringBuilder();
            if (j == n || gaps == 0) {
                for (int k = i; k < j; k++) {
                    sb.append(words[k]);
                    if (k < j - 1) sb.append(' ');
                }
                while (sb.length() < maxWidth) sb.append(' ');
            } else {
                int spaces = maxWidth - len, q = spaces / gaps, r = spaces % gaps;
                for (int k = i; k < j - 1; k++) {
                    sb.append(words[k]);
                    sb.append(" ".repeat(q + (k - i < r ? 1 : 0)));
                }
                sb.append(words[j - 1]);
            }
            res.add(sb.toString());
            i = j;
        }
        return res;
    }
}
`,
    },
  },
];

export default problems;
