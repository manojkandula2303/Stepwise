import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  // ---------------- Heap ----------------
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    topic: 'heap',
    lc150: true,
    statement: 'Given an integer array `nums` and an integer `k`, return the `k`-th largest element in sorted order (not the k-th distinct element). Try to do it without fully sorting.',
    constraints: ['`1 <= k <= nums.length <= 10^5`'],
    sig: { name: 'findKthLargest', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
      { args: [[-1, -1], 2], expected: -1 },
    ],
    hints: ['Keep a min-heap of the k largest values seen so far.', 'Its root is the k-th largest.'],
    approaches: [
      { name: 'Sort', idea: 'Sort descending and index.', time: 'O(n log n)', space: 'O(1)' },
      { name: 'Min-heap of size k', idea: 'Push each value; pop when the heap exceeds k.', time: 'O(n log k)', space: 'O(k)' },
      { name: 'Quickselect', idea: 'Partition around a random pivot and recurse into one side.', time: 'O(n) average', space: 'O(1)' },
    ],
    solution: {
      python: `import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
`,
      java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }
}
`,
    },
  },
  {
    id: 'ipo',
    title: 'IPO',
    difficulty: 'Hard',
    topic: 'heap',
    lc150: true,
    statement: 'You start with capital `w` and may complete at most `k` distinct projects. Project `i` requires `capital[i]` to start and adds `profits[i]` to your capital when finished. Return the maximum final capital.',
    constraints: ['`1 <= k <= 10^5`', '`1 <= n <= 10^5`'],
    sig: { name: 'findMaximizedCapital', params: [{ name: 'k', type: 'int' }, { name: 'w', type: 'int' }, { name: 'profits', type: 'int[]' }, { name: 'capital', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [2, 0, [1, 2, 3], [0, 1, 1]], expected: 4 },
      { args: [3, 0, [1, 2, 3], [0, 1, 2]], expected: 6 },
      { args: [1, 0, [1, 2, 3], [1, 1, 2]], expected: 0 },
      { args: [10, 5, [3, 1], [0, 10]], expected: 8 },
    ],
    hints: ['Sort projects by required capital.', 'Each round, push every affordable project\'s profit into a max-heap, then take the most profitable.'],
    approaches: [{ name: 'Sort + max-heap', idea: 'Greedily pick the most profitable affordable project each round; capital only grows, so more projects unlock over time.', time: 'O(n log n + k log n)', space: 'O(n)' }],
    solution: {
      python: `import heapq

class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        projects = sorted(zip(capital, profits))
        heap, i = [], 0
        for _ in range(k):
            while i < len(projects) and projects[i][0] <= w:
                heapq.heappush(heap, -projects[i][1])
                i += 1
            if not heap:
                break
            w -= heapq.heappop(heap)
        return w
`,
      java: `class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(capital[a], capital[b]));
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        int i = 0;
        while (k-- > 0) {
            while (i < n && capital[idx[i]] <= w) heap.offer(profits[idx[i++]]);
            if (heap.isEmpty()) break;
            w += heap.poll();
        }
        return w;
    }
}
`,
    },
  },
  {
    id: 'k-pairs-smallest-sums',
    title: 'Find K Pairs with Smallest Sums',
    difficulty: 'Medium',
    topic: 'heap',
    lc150: true,
    statement: 'Given two sorted arrays `nums1` and `nums2` and an integer `k`, return the `k` pairs `(u, v)` (one element from each array) with the smallest sums. Pairs with equal sums may be returned in any order.',
    constraints: ['`1 <= nums1.length, nums2.length <= 10^5`', '`1 <= k <= 10^4`, `k <= m·n`'],
    sig: { name: 'kSmallestPairs', params: [{ name: 'nums1', type: 'int[]' }, { name: 'nums2', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'List<List<int>>' },
    compare: 'unordered',
    tests: [
      { args: [[1, 7, 11], [2, 4, 6], 3], expected: [[1, 2], [1, 4], [1, 6]] },
      { args: [[1, 1, 2], [1, 2, 3], 2], expected: [[1, 1], [1, 1]] },
      { args: [[1, 2], [3], 2], expected: [[1, 3], [2, 3]] },
      { args: [[1, 2, 4], [-1, 1, 2], 3], expected: [[1, -1], [2, -1], [1, 1]] },
    ],
    hints: ['Think of an `m × n` grid of sums sorted along rows and columns.', 'Start the heap with `(nums1[i] + nums2[0], i, 0)` for the first k rows; after popping `(i, j)`, push `(i, j + 1)`.'],
    approaches: [{ name: 'Min-heap frontier', idea: 'The heap holds the next candidate in each row; each pop yields the next smallest pair.', time: 'O(k log k)', space: 'O(k)' }],
    solution: {
      python: `import heapq

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]
        heapq.heapify(heap)
        res = []
        while heap and len(res) < k:
            _, i, j = heapq.heappop(heap)
            res.append([nums1[i], nums2[j]])
            if j + 1 < len(nums2):
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
        return res
`,
      java: `class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 0; i < Math.min(k, nums1.length); i++) pq.offer(new int[]{nums1[i] + nums2[0], i, 0});
        List<List<Integer>> res = new ArrayList<>();
        while (!pq.isEmpty() && res.size() < k) {
            int[] t = pq.poll();
            int i = t[1], j = t[2];
            res.add(List.of(nums1[i], nums2[j]));
            if (j + 1 < nums2.length) pq.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'find-median-data-stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    topic: 'heap',
    lc150: true,
    statement: 'Design `MedianFinder` with `addNum(num)` and `findMedian()`, which returns the median of all numbers added so far (the mean of the two middle values when the count is even).',
    constraints: ['At most `5 * 10^4` calls', '`findMedian` is only called after at least one `addNum`'],
    sig: {
      kind: 'design',
      className: 'MedianFinder',
      ctor: [],
      methods: [
        { name: 'addNum', params: [{ name: 'num', type: 'int' }], returns: 'void' },
        { name: 'findMedian', params: [], returns: 'double' },
      ],
    },
    tests: [
      { args: [['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], [[], [1], [2], [], [3], []]], expected: [null, null, null, 1.5, null, 2.0] },
      { args: [['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian'], [[], [-1], [], [-2], [], [-3], []]], expected: [null, null, -1.0, null, -1.5, null, -2.0] },
      { args: [['MedianFinder', 'addNum', 'addNum', 'addNum', 'addNum', 'findMedian'], [[], [5], [15], [1], [3], []]], expected: [null, null, null, null, null, 4.0] },
    ],
    hints: ['Keep the smaller half in a max-heap and the larger half in a min-heap.', 'Balance them so their sizes differ by at most one; the median comes from the tops.'],
    approaches: [{ name: 'Two heaps', idea: 'A max-heap `low` and a min-heap `high`. Insert into `low`, move its max to `high`, and rebalance so `low` has the extra element.', time: 'O(log n) add, O(1) median', space: 'O(n)' }],
    solution: {
      python: `import heapq

class MedianFinder:
    def __init__(self):
        self.low = []    # max-heap via negatives
        self.high = []   # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return float(-self.low[0])
        return (-self.low[0] + self.high[0]) / 2
`,
      java: `class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (high.size() > low.size()) low.offer(high.poll());
    }

    public double findMedian() {
        return low.size() > high.size() ? low.peek() : (low.peek() + (long) high.peek()) / 2.0;
    }
}
`,
    },
  },
  // ---------------- Bit manipulation ----------------
  {
    id: 'add-binary',
    title: 'Add Binary',
    difficulty: 'Easy',
    topic: 'bit',
    lc150: true,
    statement: 'Given two binary strings `a` and `b`, return their sum as a binary string.',
    constraints: ['`1 <= a.length, b.length <= 10^4`', 'No leading zeros except "0"'],
    sig: { name: 'addBinary', params: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['11', '1'], expected: '100' },
      { args: ['1010', '1011'], expected: '10101' },
      { args: ['0', '0'], expected: '0' },
      { args: ['1111', '1111'], expected: '11110' },
    ],
    hints: ['Add from the rightmost digits, carrying like decimal addition.', 'Build the result in reverse and flip it at the end.'],
    approaches: [{ name: 'Digit-by-digit addition', idea: 'Walk both strings from the end, summing bits and carry.', time: 'O(max(m, n))', space: 'O(max(m, n))' }],
    solution: {
      python: `class Solution:
    def addBinary(self, a: str, b: str) -> str:
        i, j, carry, out = len(a) - 1, len(b) - 1, 0, []
        while i >= 0 or j >= 0 or carry:
            s = carry + (int(a[i]) if i >= 0 else 0) + (int(b[j]) if j >= 0 else 0)
            out.append(str(s % 2))
            carry = s // 2
            i -= 1
            j -= 1
        return ''.join(reversed(out))
`,
      java: `class Solution {
    public String addBinary(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int s = carry + (i >= 0 ? a.charAt(i--) - '0' : 0) + (j >= 0 ? b.charAt(j--) - '0' : 0);
            sb.append(s % 2);
            carry = s / 2;
        }
        return sb.reverse().toString();
    }
}
`,
    },
  },
  {
    id: 'reverse-bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    topic: 'bit',
    lc150: true,
    statement: 'Reverse the bits of a 32-bit unsigned integer `n` and return the result as an unsigned value.\n\n*In this judge, `n` and the result are passed as 64-bit integers in the range [0, 2³² − 1] so the unsigned value is unambiguous in every language.*',
    constraints: ['`0 <= n < 2^32`'],
    sig: { name: 'reverseBits', params: [{ name: 'n', type: 'long' }], returns: 'long' },
    tests: [
      { args: [43261596], expected: 964176192 },
      { args: [4294967293], expected: 3221225471 },
      { args: [0], expected: 0 },
      { args: [1], expected: 2147483648 },
    ],
    hints: ['Process 32 bits: shift the result left and append the lowest bit of `n`, then shift `n` right.'],
    approaches: [{ name: 'Bit by bit', idea: '32 iterations of `res = (res << 1) | (n & 1); n >>= 1`.', time: 'O(32)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
`,
      java: `class Solution {
    public long reverseBits(long n) {
        long res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>= 1;
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    topic: 'bit',
    lc150: true,
    statement: 'Given a positive integer `n`, return the number of set bits (1s) in its binary representation (its Hamming weight).',
    constraints: ['`1 <= n <= 2^31 - 1`'],
    sig: { name: 'hammingWeight', params: [{ name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [11], expected: 3 },
      { args: [128], expected: 1 },
      { args: [2147483645], expected: 30 },
      { args: [1], expected: 1 },
    ],
    hints: ['`n & (n - 1)` clears the lowest set bit.', 'Count how many times you can do that before `n` becomes 0.'],
    approaches: [{ name: 'Brian Kernighan\'s trick', idea: 'Each `n &= n - 1` removes exactly one set bit.', time: 'O(number of set bits)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count
`,
      java: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        return count;
    }
}
`,
    },
  },
  {
    id: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    topic: 'bit',
    lc150: true,
    statement: 'Every element of a non-empty integer array appears twice except for one. Find that single one, in linear time and constant extra space.',
    constraints: ['`1 <= nums.length <= 3 * 10^4`'],
    sig: { name: 'singleNumber', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[1]], expected: 1 },
      { args: [[-3, 7, 7]], expected: -3 },
    ],
    hints: ['`x ^ x = 0` and `x ^ 0 = x`.', 'XOR all numbers together.'],
    approaches: [{ name: 'XOR everything', idea: 'Pairs cancel out, leaving the unique value.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0
        for x in nums:
            res ^= x
        return res
`,
      java: `class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int x : nums) res ^= x;
        return res;
    }
}
`,
    },
  },
  {
    id: 'single-number-ii',
    title: 'Single Number II',
    difficulty: 'Medium',
    topic: 'bit',
    lc150: true,
    statement: 'Every element appears **three** times except for one, which appears once. Find it in linear time and constant extra space.',
    constraints: ['`1 <= nums.length <= 3 * 10^4`', 'Values fit in a 32-bit signed integer'],
    sig: { name: 'singleNumber', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[2, 2, 3, 2]], expected: 3 },
      { args: [[0, 1, 0, 1, 0, 1, 99]], expected: 99 },
      { args: [[-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]], expected: -4 },
      { args: [[7]], expected: 7 },
    ],
    hints: ['Count how many numbers have each bit set; for every bit, that count mod 3 is the single number\'s bit.', 'In Python, convert the 32-bit result back to a signed integer.'],
    approaches: [
      { name: 'Bit counting', idea: 'For each of 32 bit positions, sum the bits mod 3.', time: 'O(32 n)', space: 'O(1)' },
      { name: 'ones/twos state machine', idea: 'Track bits seen once and twice with `ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones`.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0
        for bit in range(32):
            count = sum((x >> bit) & 1 for x in nums)
            if count % 3:
                res |= 1 << bit
        return res - (1 << 32) if res >= 1 << 31 else res
`,
      java: `class Solution {
    public int singleNumber(int[] nums) {
        int ones = 0, twos = 0;
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
}
`,
    },
  },
  {
    id: 'bitwise-and-range',
    title: 'Bitwise AND of Numbers Range',
    difficulty: 'Medium',
    topic: 'bit',
    lc150: true,
    statement: 'Given two integers `left` and `right` representing the range `[left, right]`, return the bitwise AND of all numbers in the range, inclusive.',
    constraints: ['`0 <= left <= right <= 2^31 - 1`'],
    sig: { name: 'rangeBitwiseAnd', params: [{ name: 'left', type: 'int' }, { name: 'right', type: 'int' }], returns: 'int' },
    tests: [
      { args: [5, 7], expected: 4 },
      { args: [0, 0], expected: 0 },
      { args: [1, 2147483647], expected: 0 },
      { args: [12, 15], expected: 12 },
    ],
    hints: ['Any bit that flips somewhere in the range becomes 0.', 'The answer is the common binary prefix of `left` and `right`: shift both right until equal, then shift back.'],
    approaches: [{ name: 'Common prefix', idea: 'Strip differing low bits by shifting both numbers right until they match.', time: 'O(32)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left != right:
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
`,
      java: `class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int shift = 0;
        while (left != right) {
            left >>= 1;
            right >>= 1;
            shift++;
        }
        return left << shift;
    }
}
`,
    },
  },
  // ---------------- Math ----------------
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topic: 'math',
    lc150: true,
    statement: 'Given an integer `x`, return `true` if it reads the same forward and backward. Try solving it without converting to a string.',
    constraints: ['`-2^31 <= x <= 2^31 - 1`'],
    sig: { name: 'isPalindrome', params: [{ name: 'x', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [0], expected: true },
      { args: [12321], expected: true },
    ],
    hints: ['Negative numbers and numbers ending in 0 (except 0) are never palindromes.', 'Reverse the second half of the digits and compare it with the first half.'],
    approaches: [{ name: 'Reverse half the number', idea: 'Build the reversed lower half until it is ≥ the remaining upper half, avoiding overflow.', time: 'O(log x)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        rev = 0
        while x > rev:
            rev = rev * 10 + x % 10
            x //= 10
        return x == rev or x == rev // 10
`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10;
    }
}
`,
    },
  },
  {
    id: 'plus-one',
    title: 'Plus One',
    difficulty: 'Easy',
    topic: 'math',
    lc150: true,
    statement: 'A large integer is represented as an array of `digits`, most significant first, with no leading zeros. Add one and return the resulting digit array.',
    constraints: ['`1 <= digits.length <= 100`'],
    sig: { name: 'plusOne', params: [{ name: 'digits', type: 'int[]' }], returns: 'int[]' },
    tests: [
      { args: [[1, 2, 3]], expected: [1, 2, 4] },
      { args: [[4, 3, 2, 1]], expected: [4, 3, 2, 2] },
      { args: [[9]], expected: [1, 0] },
      { args: [[9, 9, 9]], expected: [1, 0, 0, 0] },
    ],
    hints: ['Walk from the last digit: if it is less than 9, increment and return.', 'Otherwise set it to 0 and carry. If every digit was 9, prepend a 1.'],
    approaches: [{ name: 'Carry from the end', idea: 'Only trailing 9s change to 0; the first non-9 digit absorbs the carry.', time: 'O(n)', space: 'O(1) (O(n) when all 9s)' }],
    solution: {
      python: `class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits
`,
      java: `class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) { digits[i]++; return digits; }
            digits[i] = 0;
        }
        int[] res = new int[digits.length + 1];
        res[0] = 1;
        return res;
    }
}
`,
    },
  },
  {
    id: 'factorial-trailing-zeroes',
    title: 'Factorial Trailing Zeroes',
    difficulty: 'Medium',
    topic: 'math',
    lc150: true,
    statement: 'Given an integer `n`, return the number of trailing zeroes in `n!`.',
    constraints: ['`0 <= n <= 10^4`'],
    sig: { name: 'trailingZeroes', params: [{ name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [3], expected: 0 },
      { args: [5], expected: 1 },
      { args: [0], expected: 0 },
      { args: [25], expected: 6 },
      { args: [10000], expected: 2499 },
    ],
    hints: ['Each trailing zero comes from a factor 10 = 2 × 5, and factors of 2 are plentiful.', 'Count factors of 5: `n/5 + n/25 + n/125 + …`.'],
    approaches: [{ name: 'Count factors of five', idea: 'Multiples of 25 contribute an extra 5, multiples of 125 another, and so on.', time: 'O(log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        while n:
            n //= 5
            count += n
        return count
`,
      java: `class Solution {
    public int trailingZeroes(int n) {
        int count = 0;
        while (n > 0) {
            n /= 5;
            count += n;
        }
        return count;
    }
}
`,
    },
  },
  {
    id: 'sqrt-x',
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    topic: 'binary-search',
    lc150: true,
    statement: 'Given a non-negative integer `x`, return the square root of `x` rounded **down** to the nearest integer, without using built-in exponent or square-root functions.',
    constraints: ['`0 <= x <= 2^31 - 1`'],
    sig: { name: 'mySqrt', params: [{ name: 'x', type: 'int' }], returns: 'int' },
    tests: [
      { args: [4], expected: 2 },
      { args: [8], expected: 2 },
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [2147395599], expected: 46339 },
    ],
    hints: ['Binary search for the largest `m` with `m * m <= x`.', 'Use 64-bit arithmetic (or `m <= x / m`) to avoid overflow.'],
    approaches: [{ name: 'Binary search on the answer', idea: '`m * m <= x` is monotonic in `m`, so binary search finds the boundary.', time: 'O(log x)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def mySqrt(self, x: int) -> int:
        lo, hi = 0, x
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if mid * mid <= x:
                lo = mid
            else:
                hi = mid - 1
        return lo
`,
      java: `class Solution {
    public int mySqrt(int x) {
        long lo = 0, hi = x;
        while (lo < hi) {
            long mid = (lo + hi + 1) / 2;
            if (mid * mid <= x) lo = mid; else hi = mid - 1;
        }
        return (int) lo;
    }
}
`,
    },
  },
  {
    id: 'pow-x-n',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    topic: 'math',
    lc150: true,
    statement: 'Implement `pow(x, n)`, which computes `x` raised to the integer power `n`. Answers within `10^-5` are accepted.',
    constraints: ['`-100.0 < x < 100.0`', '`-2^31 <= n <= 2^31 - 1`', 'The result fits in a double'],
    sig: { name: 'myPow', params: [{ name: 'x', type: 'double' }, { name: 'n', type: 'int' }], returns: 'double' },
    tests: [
      { args: [2.0, 10], expected: 1024.0 },
      { args: [2.1, 3], expected: 9.261 },
      { args: [2.0, -2], expected: 0.25 },
      { args: [1.0, -2147483648], expected: 1.0 },
      { args: [0.5, 4], expected: 0.0625 },
    ],
    hints: ['Fast exponentiation: `x^n = (x^2)^(n/2)` for even n.', 'Handle negative `n` by using `1/x`; in Java, convert `n` to `long` before negating.'],
    approaches: [{ name: 'Binary exponentiation', idea: 'Square the base and halve the exponent each step, multiplying the result when the current bit is 1.', time: 'O(log |n|)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1 / x, -n
        res = 1.0
        while n:
            if n & 1:
                res *= x
            x *= x
            n >>= 1
        return res
`,
      java: `class Solution {
    public double myPow(double x, int n) {
        long e = n;
        if (e < 0) { x = 1 / x; e = -e; }
        double res = 1.0;
        while (e > 0) {
            if ((e & 1) == 1) res *= x;
            x *= x;
            e >>= 1;
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'max-points-on-a-line',
    title: 'Max Points on a Line',
    difficulty: 'Hard',
    topic: 'math',
    lc150: true,
    statement: 'Given an array of distinct `points` on the X-Y plane, return the maximum number of points that lie on the same straight line.',
    constraints: ['`1 <= points.length <= 300`', 'All points are unique'],
    sig: { name: 'maxPoints', params: [{ name: 'points', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[1, 1], [2, 2], [3, 3]]], expected: 3 },
      { args: [[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]], expected: 4 },
      { args: [[[0, 0]]], expected: 1 },
      { args: [[[0, 0], [1, 0], [2, 0], [0, 1]]], expected: 3 },
    ],
    hints: ['Fix one point and group the others by the slope to it.', 'Represent slopes exactly as reduced fractions `(dy/g, dx/g)` with a normalised sign, not floats.'],
    approaches: [{ name: 'Slope counting per anchor', idea: 'For each anchor, count points per normalised slope; the best line through that anchor has `1 + max count` points.', time: 'O(n²)', space: 'O(n)' }],
    solution: {
      python: `from math import gcd

class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        best = 1
        for i, (x1, y1) in enumerate(points):
            slopes = defaultdict(int)
            for x2, y2 in points[i + 1:]:
                dx, dy = x2 - x1, y2 - y1
                g = gcd(dx, dy)
                dx, dy = dx // g, dy // g
                if dx < 0 or (dx == 0 and dy < 0):
                    dx, dy = -dx, -dy
                slopes[(dx, dy)] += 1
                best = max(best, slopes[(dx, dy)] + 1)
        return best
`,
      java: `class Solution {
    public int maxPoints(int[][] points) {
        int best = 1;
        for (int i = 0; i < points.length; i++) {
            Map<String, Integer> slopes = new HashMap<>();
            for (int j = i + 1; j < points.length; j++) {
                int dx = points[j][0] - points[i][0], dy = points[j][1] - points[i][1];
                int g = gcd(Math.abs(dx), Math.abs(dy));
                dx /= g; dy /= g;
                if (dx < 0 || (dx == 0 && dy < 0)) { dx = -dx; dy = -dy; }
                int c = slopes.merge(dx + "/" + dy, 1, Integer::sum);
                best = Math.max(best, c + 1);
            }
        }
        return best;
    }

    private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}
`,
    },
  },
  // ---------------- 1D DP ----------------
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'dp',
    lc150: true,
    statement: 'You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?',
    constraints: ['`1 <= n <= 45`'],
    sig: { name: 'climbStairs', params: [{ name: 'n', type: 'int' }], returns: 'int' },
    tests: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [1], expected: 1 },
      { args: [5], expected: 8 },
      { args: [45], expected: 1836311903 },
    ],
    hints: ['The last move to step `n` came from `n - 1` or `n - 2`.', '`ways(n) = ways(n-1) + ways(n-2)` — the Fibonacci recurrence.'],
    approaches: [
      { name: 'Memoized recursion', idea: 'Cache `ways(i)` to avoid recomputation.', time: 'O(n)', space: 'O(n)' },
      { name: 'Two variables', idea: 'Only the previous two values are needed.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b
`,
      java: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 1; i < n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
`,
    },
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Houses along a street hold `nums[i]` money. Robbing two adjacent houses triggers an alarm. Return the maximum amount you can rob without alerting the police.',
    constraints: ['`1 <= nums.length <= 100`', '`0 <= nums[i] <= 400`'],
    sig: { name: 'rob', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[5]], expected: 5 },
      { args: [[2, 1, 1, 2]], expected: 4 },
    ],
    hints: ['At each house: skip it (keep the best so far) or rob it (best up to two houses back + this one).', '`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.'],
    approaches: [{ name: 'DP with two variables', idea: 'Roll the last two states forward.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = prev1 = 0
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1
`,
      java: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
`,
    },
  },
  {
    id: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Words may be reused.',
    constraints: ['`1 <= s.length <= 300`', '`1 <= wordDict.length <= 1000`'],
    sig: { name: 'wordBreak', params: [{ name: 's', type: 'string' }, { name: 'wordDict', type: 'List<string>' }], returns: 'bool' },
    tests: [
      { args: ['leetcode', ['leet', 'code']], expected: true },
      { args: ['applepenapple', ['apple', 'pen']], expected: true },
      { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
      { args: ['aaaaaaa', ['aaaa', 'aaa']], expected: true },
    ],
    hints: ['`dp[i]` = can the prefix `s[:i]` be segmented?', '`dp[i]` is true if some `j < i` has `dp[j]` true and `s[j:i]` in the dictionary.'],
    approaches: [{ name: 'Prefix DP', idea: 'Build up which prefixes are breakable; only check word lengths that exist in the dictionary.', time: 'O(n · L)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        lengths = {len(w) for w in words}
        dp = [True] + [False] * len(s)
        for i in range(1, len(s) + 1):
            dp[i] = any(L <= i and dp[i - L] and s[i - L:i] in words for L in lengths)
        return dp[len(s)]
`,
      java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i && !dp[i]; j++)
                if (dp[j] && words.contains(s.substring(j, i))) dp[i] = true;
        return dp[s.length()];
    }
}
`,
    },
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given coin denominations `coins` and a total `amount`, return the fewest coins needed to make up that amount, or `-1` if it cannot be made. You have an unlimited supply of each coin.',
    constraints: ['`1 <= coins.length <= 12`', '`0 <= amount <= 10^4`'],
    sig: { name: 'coinChange', params: [{ name: 'coins', type: 'int[]' }, { name: 'amount', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[1, 3, 4], 6], expected: 2 },
      { args: [[186, 419, 83, 408], 6249], expected: 20 },
    ],
    hints: ['Greedy fails (coins 1, 3, 4 for amount 6).', '`dp[a] = 1 + min(dp[a - c])` over coins `c ≤ a`.'],
    approaches: [{ name: 'Bottom-up DP over amounts', idea: 'Compute the fewest coins for every amount from 0 to `amount`.', time: 'O(amount · coins)', space: 'O(amount)' }],
    solution: {
      python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a and dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
        return dp[amount] if dp[amount] != INF else -1
`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
`,
    },
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given an integer array `nums`, return the length of the longest **strictly** increasing subsequence.',
    constraints: ['`1 <= nums.length <= 2500`'],
    sig: { name: 'lengthOfLIS', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { args: [[7, 7, 7, 7]], expected: 1 },
      { args: [[4, 10, 4, 3, 8, 9]], expected: 3 },
    ],
    hints: ['O(n²): `dp[i]` = LIS ending at `i` = 1 + max `dp[j]` for `j < i` with `nums[j] < nums[i]`.', 'O(n log n): maintain the smallest possible tail for each length and binary search where each number goes.'],
    approaches: [
      { name: 'Quadratic DP', idea: 'For each index, extend the best earlier subsequence with a smaller last value.', time: 'O(n²)', space: 'O(n)' },
      { name: 'Patience sorting', idea: '`tails[k]` is the smallest tail of an increasing subsequence of length k+1; replace with lower bound.', time: 'O(n log n)', space: 'O(n)' },
    ],
    solution: {
      python: `import bisect

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            i = bisect.bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)
`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1; else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}
`,
    },
  },
  // ---------------- Multidimensional DP ----------------
  {
    id: 'triangle',
    title: 'Triangle',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given a `triangle` array, return the minimum path sum from top to bottom. From index `i` on one row you may move to index `i` or `i + 1` on the next row.',
    constraints: ['`1 <= triangle.length <= 200`'],
    sig: { name: 'minimumTotal', params: [{ name: 'triangle', type: 'List<List<int>>' }], returns: 'int' },
    tests: [
      { args: [[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]], expected: 11 },
      { args: [[[-10]]], expected: -10 },
      { args: [[[1], [2, 3]]], expected: 3 },
      { args: [[[-1], [2, 3], [1, -1, -3]]], expected: -1 },
    ],
    hints: ['Work bottom-up: each cell\'s best is its value plus the smaller of the two cells below.', 'A single 1D array of the row below is enough.'],
    approaches: [{ name: 'Bottom-up DP', idea: 'Start with the last row and fold upward; the top cell ends up holding the answer.', time: 'O(n²)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = triangle[-1][:]
        for r in range(len(triangle) - 2, -1, -1):
            for i in range(r + 1):
                dp[i] = triangle[r][i] + min(dp[i], dp[i + 1])
        return dp[0]
`,
      java: `class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n + 1];
        for (int r = n - 1; r >= 0; r--)
            for (int i = 0; i <= r; i++)
                dp[i] = triangle.get(r).get(i) + Math.min(dp[i], dp[i + 1]);
        return dp[0];
    }
}
`,
    },
  },
  {
    id: 'minimum-path-sum',
    title: 'Minimum Path Sum',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given an `m × n` grid of non-negative numbers, find a path from the top-left to the bottom-right that minimises the sum of numbers along it. You may only move right or down.',
    constraints: ['`1 <= m, n <= 200`'],
    sig: { name: 'minPathSum', params: [{ name: 'grid', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
      { args: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
      { args: [[[5]]], expected: 5 },
      { args: [[[1, 2], [1, 1]]], expected: 3 },
    ],
    hints: ['`dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])`.', 'The first row and column have only one way in.'],
    approaches: [{ name: 'Grid DP (rolling row)', idea: 'Each cell takes the cheaper of the cell above and to the left.', time: 'O(m·n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [float('inf')] * n
        dp[0] = 0
        for r in range(m):
            for c in range(n):
                left = dp[c - 1] if c > 0 else float('inf')
                dp[c] = grid[r][c] + min(dp[c], left)
        return dp[-1]
`,
      java: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                int left = c > 0 ? dp[c - 1] : Integer.MAX_VALUE;
                dp[c] = grid[r][c] + Math.min(dp[c], left);
            }
        return dp[n - 1];
    }
}
`,
    },
  },
  {
    id: 'unique-paths-ii',
    title: 'Unique Paths II',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'A robot starts at the top-left of an `m × n` grid and moves only right or down to reach the bottom-right. Cells marked `1` are obstacles. Return the number of unique paths.',
    constraints: ['`1 <= m, n <= 100`'],
    sig: { name: 'uniquePathsWithObstacles', params: [{ name: 'obstacleGrid', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: 2 },
      { args: [[[0, 1], [0, 0]]], expected: 1 },
      { args: [[[1]]], expected: 0 },
      { args: [[[0, 0], [0, 1]]], expected: 0 },
    ],
    hints: ['Same recurrence as Unique Paths, but obstacle cells have 0 ways.', 'A 1D array updated row by row is enough.'],
    approaches: [{ name: 'Grid DP', idea: '`dp[c] = 0` on obstacles, else `dp[c] += dp[c-1]`.', time: 'O(m·n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        n = len(obstacleGrid[0])
        dp = [0] * n
        dp[0] = 1
        for row in obstacleGrid:
            for c in range(n):
                if row[c] == 1:
                    dp[c] = 0
                elif c > 0:
                    dp[c] += dp[c - 1]
        return dp[-1]
`,
      java: `class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int n = obstacleGrid[0].length;
        int[] dp = new int[n];
        dp[0] = 1;
        for (int[] row : obstacleGrid)
            for (int c = 0; c < n; c++) {
                if (row[c] == 1) dp[c] = 0;
                else if (c > 0) dp[c] += dp[c - 1];
            }
        return dp[n - 1];
    }
}
`,
    },
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given a string `s`, return the longest palindromic substring. If several have the maximum length, return the one that appears first.',
    constraints: ['`1 <= s.length <= 1000`'],
    sig: { name: 'longestPalindrome', params: [{ name: 's', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['babad'], expected: 'bab' },
      { args: ['cbbd'], expected: 'bb' },
      { args: ['a'], expected: 'a' },
      { args: ['forgeeksskeegfor'], expected: 'geeksskeeg' },
    ],
    hints: ['Every palindrome mirrors around a centre — a character or a gap between two characters.', 'Expand from each of the 2n − 1 centres while the ends match.'],
    approaches: [
      { name: 'DP table', idea: '`pal[i][j]` is true if `s[i] == s[j]` and `pal[i+1][j-1]`.', time: 'O(n²)', space: 'O(n²)' },
      { name: 'Expand around centre', idea: 'Try each centre and expand outward.', time: 'O(n²)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, best = 0, 1
        for c in range(2 * len(s) - 1):
            l, r = c // 2, c // 2 + c % 2
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            if r - l - 1 > best:
                start, best = l + 1, r - l - 1
        return s[start:start + best]
`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, best = 1;
        for (int c = 0; c < 2 * s.length() - 1; c++) {
            int l = c / 2, r = c / 2 + c % 2;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
            if (r - l - 1 > best) { start = l + 1; best = r - l - 1; }
        }
        return s.substring(start, start + best);
    }
}
`,
    },
  },
  {
    id: 'interleaving-string',
    title: 'Interleaving String',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given strings `s1`, `s2` and `s3`, return whether `s3` is formed by interleaving `s1` and `s2` — merging their characters while preserving each string\'s internal order.',
    constraints: ['`0 <= s1.length, s2.length <= 100`'],
    sig: { name: 'isInterleave', params: [{ name: 's1', type: 'string' }, { name: 's2', type: 'string' }, { name: 's3', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true },
      { args: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false },
      { args: ['', '', ''], expected: true },
      { args: ['a', '', 'a'], expected: true },
      { args: ['ab', 'cd', 'acdb'], expected: true },
    ],
    hints: ['`dp[i][j]` = can `s1[:i]` and `s2[:j]` interleave into `s3[:i+j]`?', 'The last character of `s3[:i+j]` came from `s1[i-1]` or `s2[j-1]`.'],
    approaches: [{ name: '2D DP', idea: '`dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or (dp[i][j-1] and s2[j-1] == s3[i+j-1])`.', time: 'O(m·n)', space: 'O(n) with a rolling row' }],
    solution: {
      python: `class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False
        dp = [False] * (n + 1)
        for i in range(m + 1):
            for j in range(n + 1):
                if i == 0 and j == 0:
                    dp[j] = True
                else:
                    from_s1 = i > 0 and dp[j] and s1[i - 1] == s3[i + j - 1]
                    from_s2 = j > 0 and dp[j - 1] and s2[j - 1] == s3[i + j - 1]
                    dp[j] = from_s1 or from_s2
        return dp[n]
`,
      java: `class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;
        boolean[] dp = new boolean[n + 1];
        for (int i = 0; i <= m; i++)
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) { dp[j] = true; continue; }
                boolean a = i > 0 && dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1);
                boolean b = j > 0 && dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1);
                dp[j] = a || b;
            }
        return dp[n];
    }
}
`,
    },
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given two strings `word1` and `word2`, return the minimum number of operations (insert a character, delete a character, or replace a character) to convert `word1` into `word2`.',
    constraints: ['`0 <= word1.length, word2.length <= 500`'],
    sig: { name: 'minDistance', params: [{ name: 'word1', type: 'string' }, { name: 'word2', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['horse', 'ros'], expected: 3 },
      { args: ['intention', 'execution'], expected: 5 },
      { args: ['', 'abc'], expected: 3 },
      { args: ['same', 'same'], expected: 0 },
    ],
    hints: ['`dp[i][j]` = edits to turn `word1[:i]` into `word2[:j]`.', 'If the last characters match, `dp[i][j] = dp[i-1][j-1]`; otherwise 1 + min(insert, delete, replace).'],
    approaches: [{ name: 'Levenshtein DP', idea: 'Fill the table row by row; the bottom-right cell is the answer.', time: 'O(m·n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        prev = list(range(n + 1))
        for i in range(1, m + 1):
            cur = [i] + [0] * n
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    cur[j] = prev[j - 1]
                else:
                    cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
            prev = cur
        return prev[n]
`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = word1.charAt(i - 1) == word2.charAt(j - 1)
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
        return dp[m][n];
    }
}
`,
    },
  },
  {
    id: 'best-time-stock-iii',
    title: 'Best Time to Buy and Sell Stock III',
    difficulty: 'Hard',
    topic: 'dp',
    lc150: true,
    statement: 'Given daily `prices`, find the maximum profit with **at most two** transactions. You must sell before buying again.',
    constraints: ['`1 <= prices.length <= 10^5`'],
    sig: { name: 'maxProfit', params: [{ name: 'prices', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[3, 3, 5, 0, 0, 3, 1, 4]], expected: 6 },
      { args: [[1, 2, 3, 4, 5]], expected: 4 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1]], expected: 0 },
    ],
    hints: ['Track four states: after the first buy, first sell, second buy, second sell.', 'Update them in that order for each price.'],
    approaches: [{ name: 'State machine DP', idea: '`buy1 = max(buy1, -p)`, `sell1 = max(sell1, buy1 + p)`, `buy2 = max(buy2, sell1 - p)`, `sell2 = max(sell2, buy2 + p)`.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        buy1 = buy2 = float('-inf')
        sell1 = sell2 = 0
        for p in prices:
            buy1 = max(buy1, -p)
            sell1 = max(sell1, buy1 + p)
            buy2 = max(buy2, sell1 - p)
            sell2 = max(sell2, buy2 + p)
        return sell2
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int buy1 = Integer.MIN_VALUE, buy2 = Integer.MIN_VALUE, sell1 = 0, sell2 = 0;
        for (int p : prices) {
            buy1 = Math.max(buy1, -p);
            sell1 = Math.max(sell1, buy1 + p);
            buy2 = Math.max(buy2, sell1 - p);
            sell2 = Math.max(sell2, buy2 + p);
        }
        return sell2;
    }
}
`,
    },
  },
  {
    id: 'best-time-stock-iv',
    title: 'Best Time to Buy and Sell Stock IV',
    difficulty: 'Hard',
    topic: 'dp',
    lc150: true,
    statement: 'Given an integer `k` and daily `prices`, find the maximum profit with **at most `k`** transactions (sell before buying again).',
    constraints: ['`1 <= k <= 100`', '`1 <= prices.length <= 1000`'],
    sig: { name: 'maxProfit', params: [{ name: 'k', type: 'int' }, { name: 'prices', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [2, [2, 4, 1]], expected: 2 },
      { args: [2, [3, 2, 6, 5, 0, 3]], expected: 7 },
      { args: [1, [1, 2]], expected: 1 },
      { args: [100, [1, 3, 2, 5, 4, 8]], expected: 9 },
    ],
    hints: ['Generalise Stock III: keep `buy[j]` and `sell[j]` for each transaction count `j`.', 'If `k >= n/2`, it is the unlimited-transactions problem.'],
    approaches: [{ name: 'k-state DP', idea: 'For each price, update `buy[j] = max(buy[j], sell[j-1] - p)` and `sell[j] = max(sell[j], buy[j] + p)` for j = 1..k.', time: 'O(n·k)', space: 'O(k)' }],
    solution: {
      python: `class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        buy = [float('-inf')] * (k + 1)
        sell = [0] * (k + 1)
        for p in prices:
            for j in range(1, k + 1):
                buy[j] = max(buy[j], sell[j - 1] - p)
                sell[j] = max(sell[j], buy[j] + p)
        return sell[k]
`,
      java: `class Solution {
    public int maxProfit(int k, int[] prices) {
        int[] buy = new int[k + 1], sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE);
        for (int p : prices)
            for (int j = 1; j <= k; j++) {
                buy[j] = Math.max(buy[j], sell[j - 1] - p);
                sell[j] = Math.max(sell[j], buy[j] + p);
            }
        return sell[k];
    }
}
`,
    },
  },
  {
    id: 'maximal-square',
    title: 'Maximal Square',
    difficulty: 'Medium',
    topic: 'dp',
    lc150: true,
    statement: 'Given an `m × n` binary matrix of `"0"` and `"1"`, find the largest square containing only 1s and return its **area**.',
    constraints: ['`1 <= m, n <= 300`'],
    sig: { name: 'maximalSquare', params: [{ name: 'matrix', type: 'char[][]' }], returns: 'int' },
    tests: [
      { args: [[['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]], expected: 4 },
      { args: [[['0', '1'], ['1', '0']]], expected: 1 },
      { args: [[['0']]], expected: 0 },
      { args: [[['1', '1'], ['1', '1']]], expected: 4 },
    ],
    hints: ['`dp[r][c]` = side of the largest square with bottom-right corner at (r, c).', 'For a `1` cell: `1 + min(top, left, top-left)`.'],
    approaches: [{ name: 'Square-corner DP', idea: 'A square of side s ending at a cell requires squares of side s−1 above, left and diagonally.', time: 'O(m·n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        n = len(matrix[0])
        dp = [0] * (n + 1)
        best = 0
        for row in matrix:
            prev_diag = 0
            for c in range(1, n + 1):
                tmp = dp[c]
                if row[c - 1] == '1':
                    dp[c] = 1 + min(dp[c], dp[c - 1], prev_diag)
                    best = max(best, dp[c])
                else:
                    dp[c] = 0
                prev_diag = tmp
        return best * best
`,
      java: `class Solution {
    public int maximalSquare(char[][] matrix) {
        int n = matrix[0].length, best = 0;
        int[] dp = new int[n + 1];
        for (char[] row : matrix) {
            int prevDiag = 0;
            for (int c = 1; c <= n; c++) {
                int tmp = dp[c];
                if (row[c - 1] == '1') {
                    dp[c] = 1 + Math.min(dp[c], Math.min(dp[c - 1], prevDiag));
                    best = Math.max(best, dp[c]);
                } else dp[c] = 0;
                prevDiag = tmp;
            }
        }
        return best * best;
    }
}
`,
    },
  },
];

export default problems;
