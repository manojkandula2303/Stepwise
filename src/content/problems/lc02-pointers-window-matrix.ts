import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  // ---------------- Two pointers ----------------
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'two-pointers',
    lc150: true,
    statement: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.',
    constraints: ['`1 <= s.length <= 2 * 10^5`', '`s` consists of printable ASCII characters'],
    sig: { name: 'isPalindrome', params: [{ name: 's', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['A man, a plan, a canal: Panama'], expected: true },
      { args: ['race a car'], expected: false },
      { args: [' '], expected: true },
      { args: ['0P'], expected: false },
      { args: ['ab_a'], expected: true },
    ],
    hints: ['Use two pointers from both ends.', 'Skip characters that are not letters or digits, and compare case-insensitively.'],
    approaches: [
      { name: 'Clean and reverse', idea: 'Build the filtered lowercase string and compare it with its reverse.', time: 'O(n)', space: 'O(n)' },
      { name: 'Two pointers', idea: 'Move inward from both ends, skipping non-alphanumerics, comparing lowercase characters.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        i, j = 0, len(s) - 1
        while i < j:
            if not s[i].isalnum():
                i += 1
            elif not s[j].isalnum():
                j -= 1
            elif s[i].lower() != s[j].lower():
                return False
            else:
                i += 1
                j -= 1
        return True
`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            char a = s.charAt(i), b = s.charAt(j);
            if (!Character.isLetterOrDigit(a)) i++;
            else if (!Character.isLetterOrDigit(b)) j--;
            else if (Character.toLowerCase(a) != Character.toLowerCase(b)) return false;
            else { i++; j--; }
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'is-subsequence',
    title: 'Is Subsequence',
    difficulty: 'Easy',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given strings `s` and `t`, return `true` if `s` is a **subsequence** of `t` — that is, `s` can be formed by deleting some (or no) characters from `t` without changing the order of the rest.',
    constraints: ['`0 <= s.length <= 100`', '`0 <= t.length <= 10^4`'],
    sig: { name: 'isSubsequence', params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['abc', 'ahbgdc'], expected: true },
      { args: ['axc', 'ahbgdc'], expected: false },
      { args: ['', 'abc'], expected: true },
      { args: ['abc', ''], expected: false },
      { args: ['aaa', 'aa'], expected: false },
    ],
    hints: ['Walk through `t` once with a pointer into `s`.', 'Advance the `s` pointer whenever characters match.'],
    approaches: [{ name: 'Two pointers', idea: 'Greedily match each character of `s` to the earliest possible position in `t`.', time: 'O(|t|)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for ch in t:
            if i < len(s) and s[i] == ch:
                i += 1
        return i == len(s)
`,
      java: `class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0;
        for (int j = 0; j < t.length() && i < s.length(); j++)
            if (s.charAt(i) == t.charAt(j)) i++;
        return i == s.length();
    }
}
`,
    },
  },
  {
    id: 'two-sum-ii',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given a **1-indexed** array `numbers` sorted in non-decreasing order, find two numbers that add up to `target`. Return their indices `[index1, index2]` with `index1 < index2`. Exactly one solution exists; use only constant extra space.',
    constraints: ['`2 <= numbers.length <= 3 * 10^4`', 'Exactly one solution exists'],
    sig: { name: 'twoSum', params: [{ name: 'numbers', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'int[]' },
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { args: [[2, 3, 4], 6], expected: [1, 3] },
      { args: [[-1, 0], -1], expected: [1, 2] },
      { args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
      { args: [[5, 25, 75], 100], expected: [2, 3] },
    ],
    hints: ['The array is sorted — start with the smallest and largest numbers.', 'If the sum is too small, move the left pointer right; too big, move the right pointer left.'],
    approaches: [{ name: 'Two pointers', idea: 'Because the array is sorted, each comparison safely discards one candidate.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target:
                return [l + 1, r + 1]
            if s < target:
                l += 1
            else:
                r -= 1
        return []
`,
      java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return new int[]{l + 1, r + 1};
            if (s < target) l++; else r--;
        }
        return new int[0];
    }
}
`,
    },
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given `height[i]`, the heights of `n` vertical lines at positions `i`, find two lines that, together with the x-axis, form a container holding the most water. Return that maximum area.',
    constraints: ['`2 <= n <= 10^5`', '`0 <= height[i] <= 10^4`'],
    sig: { name: 'maxArea', params: [{ name: 'height', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[1, 2, 1]], expected: 2 },
      { args: [[2, 3, 10, 5, 7, 8, 9]], expected: 36 },
    ],
    hints: ['Area = width × min(height[l], height[r]).', 'Moving the taller line inward can never help; always move the shorter one.'],
    approaches: [
      { name: 'All pairs', idea: 'Compute the area for every pair of lines.', time: 'O(n²)', space: 'O(1)' },
      { name: 'Two pointers', idea: 'Start at both ends. The shorter line limits the area, and any container using it with a closer partner is narrower and no taller — so discard it.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, (r - l) * min(height[l], height[r]))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best
`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++; else r--;
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'Medium',
    topic: 'two-pointers',
    lc150: true,
    statement: 'Given an integer array `nums`, return all **unique** triplets `[a, b, c]` of elements at distinct indices such that `a + b + c == 0`. The order of triplets and of numbers within a triplet does not matter.',
    constraints: ['`3 <= nums.length <= 3000`', '`-10^5 <= nums[i] <= 10^5`'],
    sig: { name: 'threeSum', params: [{ name: 'nums', type: 'int[]' }], returns: 'List<List<int>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
    ],
    hints: ['Sort the array first.', 'Fix the first number, then solve two-sum on the rest with two pointers. Skip duplicate values to avoid repeated triplets.'],
    approaches: [
      { name: 'Brute force + set', idea: 'Try every triple and deduplicate with a set of sorted tuples.', time: 'O(n³)', space: 'O(n)' },
      { name: 'Sort + two pointers', idea: 'For each index `i` (skipping duplicates), find pairs in `i+1..n-1` summing to `-nums[i]` with two pointers, skipping duplicates after each match.', time: 'O(n²)', space: 'O(1) besides output' },
    ],
    solution: {
      python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1
                    r -= 1
        return res
`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) l++;
                else if (s > 0) r--;
                else {
                    res.add(List.of(nums[i], nums[l], nums[r]));
                    l++;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                    r--;
                }
            }
        }
        return res;
    }
}
`,
    },
  },
  // ---------------- Sliding window ----------------
  {
    id: 'minimum-size-subarray-sum',
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    topic: 'sliding-window',
    lc150: true,
    statement: 'Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is **greater than or equal to** `target`. Return `0` if there is none.',
    constraints: ['`1 <= nums.length <= 10^5`', '`1 <= nums[i] <= 10^4`', '`1 <= target <= 10^9`'],
    sig: { name: 'minSubArrayLen', params: [{ name: 'target', type: 'int' }, { name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
      { args: [4, [1, 4, 4]], expected: 1 },
      { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
      { args: [15, [1, 2, 3, 4, 5]], expected: 5 },
      { args: [6, [10, 2, 3]], expected: 1 },
    ],
    hints: ['All numbers are positive, so growing the window only increases the sum.', 'Expand right; while the sum is ≥ target, record the length and shrink from the left.'],
    approaches: [{ name: 'Variable sliding window', idea: 'Maintain a window sum; each index enters and leaves once.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        left = total = 0
        best = float('inf')
        for right, x in enumerate(nums):
            total += x
            while total >= target:
                best = min(best, right - left + 1)
                total -= nums[left]
                left += 1
        return 0 if best == float('inf') else best
`,
      java: `class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0, total = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            total += nums[right];
            while (total >= target) {
                best = Math.min(best, right - left + 1);
                total -= nums[left++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
`,
    },
  },
  {
    id: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'sliding-window',
    lc150: true,
    statement: 'Given a string `s`, return the length of the longest substring that contains no repeated characters.',
    constraints: ['`0 <= s.length <= 5 * 10^4`', '`s` consists of letters, digits, symbols and spaces'],
    sig: { name: 'lengthOfLongestSubstring', params: [{ name: 's', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: ['abba'], expected: 2 },
      { args: ['dvdf'], expected: 3 },
    ],
    hints: ['Keep a window with no duplicates.', 'Store the last index of each character; when you see a repeat inside the window, jump `left` past it.'],
    approaches: [{ name: 'Sliding window with last-seen map', idea: 'Track each character\'s latest index. On a repeat within the window, move `left` to one past the previous occurrence.', time: 'O(n)', space: 'O(min(n, alphabet))' }],
    solution: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = best = 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best
`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            Integer prev = last.get(s.charAt(right));
            if (prev != null && prev >= left) left = prev + 1;
            last.put(s.charAt(right), right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
`,
    },
  },
  {
    id: 'substring-concatenation-words',
    title: 'Substring with Concatenation of All Words',
    difficulty: 'Hard',
    topic: 'sliding-window',
    lc150: true,
    statement: 'You are given a string `s` and an array `words` of strings that all have the **same length**. Return all starting indices of substrings in `s` that are a concatenation of every word in `words` exactly once, in any order. Return the indices in any order.',
    constraints: ['`1 <= s.length <= 10^4`', '`1 <= words.length <= 5000`', '`1 <= words[i].length <= 30`'],
    sig: { name: 'findSubstring', params: [{ name: 's', type: 'string' }, { name: 'words', type: 'string[]' }], returns: 'List<int>' },
    compare: 'unordered',
    tests: [
      { args: ['barfoothefoobarman', ['foo', 'bar']], expected: [0, 9] },
      { args: ['wordgoodgoodgoodbestword', ['word', 'good', 'best', 'word']], expected: [] },
      { args: ['barfoofoobarthefoobarman', ['bar', 'foo', 'the']], expected: [6, 9, 12] },
      { args: ['aaaaaa', ['aa', 'aa']], expected: [0, 1, 2] },
    ],
    hints: ['Every candidate window has length `len(words) * wordLen`.', 'Run a sliding window for each offset `0..wordLen-1`, stepping one word at a time and keeping word counts.'],
    approaches: [
      { name: 'Check every start', idea: 'For each start index, split the window into words and compare counts.', time: 'O(n · m · w)', space: 'O(m)' },
      { name: 'Word-sized sliding window', idea: 'For each offset, slide a window word by word, adding the incoming word and shrinking when a word appears too often.', time: 'O(n · w)', space: 'O(m)' },
    ],
    solution: {
      python: `class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        w, k = len(words[0]), len(words)
        need = Counter(words)
        res = []
        for off in range(w):
            left, count, seen = off, 0, Counter()
            for right in range(off, len(s) - w + 1, w):
                word = s[right:right + w]
                if word in need:
                    seen[word] += 1
                    count += 1
                    while seen[word] > need[word]:
                        seen[s[left:left + w]] -= 1
                        left += w
                        count -= 1
                    if count == k:
                        res.append(left)
                else:
                    seen.clear()
                    count = 0
                    left = right + w
        return res
`,
      java: `class Solution {
    public List<Integer> findSubstring(String s, String[] words) {
        int w = words[0].length(), k = words.length;
        Map<String, Integer> need = new HashMap<>();
        for (String x : words) need.merge(x, 1, Integer::sum);
        List<Integer> res = new ArrayList<>();
        for (int off = 0; off < w; off++) {
            Map<String, Integer> seen = new HashMap<>();
            int left = off, count = 0;
            for (int right = off; right + w <= s.length(); right += w) {
                String word = s.substring(right, right + w);
                if (need.containsKey(word)) {
                    seen.merge(word, 1, Integer::sum);
                    count++;
                    while (seen.get(word) > need.get(word)) {
                        seen.merge(s.substring(left, left + w), -1, Integer::sum);
                        left += w;
                        count--;
                    }
                    if (count == k) res.add(left);
                } else {
                    seen.clear();
                    count = 0;
                    left = right + w;
                }
            }
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    topic: 'sliding-window',
    lc150: true,
    statement: 'Given strings `s` and `t`, return the shortest substring of `s` that contains every character of `t` (including duplicates). If none exists, return `""`. The answer is unique when it exists.',
    constraints: ['`1 <= s.length, t.length <= 10^5`'],
    sig: { name: 'minWindow', params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { args: ['a', 'a'], expected: 'a' },
      { args: ['a', 'aa'], expected: '' },
      { args: ['ab', 'b'], expected: 'b' },
      { args: ['aaflslflsldkalskaaa', 'aaa'], expected: 'aaa' },
    ],
    hints: ['Count what you still need from `t`, and how many distinct characters are fully satisfied.', 'Expand right until the window is valid, then shrink left as far as possible while it stays valid.'],
    approaches: [{ name: 'Sliding window with counts', idea: 'Track `missing` = characters of `t` still uncovered. Expand until `missing == 0`, then shrink from the left, recording the best window.', time: 'O(|s| + |t|)', space: 'O(alphabet)' }],
    solution: {
      python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(t)
        left = start = 0
        best = float('inf')
        for right, ch in enumerate(s):
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1
            while missing == 0:
                if right - left + 1 < best:
                    best, start = right - left + 1, left
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
                left += 1
        return '' if best == float('inf') else s[start:start + best]
`,
      java: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), left = 0, start = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) missing--;
            while (missing == 0) {
                if (right - left + 1 < best) { best = right - left + 1; start = left; }
                if (++need[s.charAt(left++)] > 0) missing++;
            }
        }
        return best == Integer.MAX_VALUE ? "" : s.substring(start, start + best);
    }
}
`,
    },
  },
  // ---------------- Matrix ----------------
  {
    id: 'valid-sudoku',
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    topic: 'matrix',
    lc150: true,
    statement: 'Determine whether a partially filled 9×9 Sudoku board is valid: each row, each column, and each of the nine 3×3 boxes must contain the digits 1–9 **at most once**. Empty cells are `"."`. The board does not need to be solvable.',
    constraints: ['`board.length == board[i].length == 9`'],
    sig: { name: 'isValidSudoku', params: [{ name: 'board', type: 'char[][]' }], returns: 'bool' },
    tests: [
      {
        args: [[['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'], ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'], ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'], ['.', '.', '.', '.', '8', '.', '.', '7', '9']]],
        expected: true,
      },
      {
        args: [[['8', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'], ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'], ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'], ['.', '.', '.', '.', '8', '.', '.', '7', '9']]],
        expected: false,
      },
      {
        args: [[['.', '.', '.', '.', '5', '.', '.', '1', '.'], ['.', '4', '.', '3', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '3', '.', '.', '1'], ['8', '.', '.', '.', '.', '.', '.', '2', '.'], ['.', '.', '2', '.', '7', '.', '.', '.', '.'], ['.', '1', '5', '.', '.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.', '2', '.', '.', '.'], ['.', '2', '.', '9', '.', '.', '.', '.', '.'], ['.', '.', '4', '.', '.', '.', '.', '.', '.']]],
        expected: false,
      },
    ],
    notes: ['', 'The 8 in the top-left box appears twice (rows 0 and 3 share column 0).'],
    hints: ['Use one set per row, per column and per box.', 'The box index for cell (r, c) is `(r // 3) * 3 + c // 3`.'],
    approaches: [{ name: 'Hash sets', idea: 'Scan once; for each digit, check and record it in its row, column and box sets.', time: 'O(81) = O(1)', space: 'O(81) = O(1)' }],
    solution: {
      python: `class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        seen = set()
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == '.':
                    continue
                keys = [(v, 'r', r), (v, 'c', c), (v, 'b', r // 3, c // 3)]
                if any(k in seen for k in keys):
                    return False
                seen.update(keys)
        return True
`,
      java: `class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char v = board[r][c];
                if (v == '.') continue;
                if (!seen.add(v + "r" + r) || !seen.add(v + "c" + c) || !seen.add(v + "b" + r / 3 + c / 3)) return false;
            }
        return true;
    }
}
`,
    },
  },
  {
    id: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    topic: 'matrix',
    lc150: true,
    statement: 'Given an `m × n` matrix, return all of its elements in **spiral order** (clockwise, starting from the top-left).',
    constraints: ['`1 <= m, n <= 10`'],
    sig: { name: 'spiralOrder', params: [{ name: 'matrix', type: 'int[][]' }], returns: 'List<int>' },
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { args: [[[7]]], expected: [7] },
      { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
      { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3] },
    ],
    hints: ['Keep four boundaries: top, bottom, left, right.', 'Walk the top row, right column, bottom row (if any rows remain) and left column (if any columns remain), shrinking boundaries each time.'],
    approaches: [{ name: 'Shrinking boundaries', idea: 'Traverse the outer ring, then move all four boundaries inward. Guard the bottom and left passes for single rows/columns.', time: 'O(m·n)', space: 'O(1) besides output' }],
    solution: {
      python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                res.append(matrix[top][c])
            for r in range(top + 1, bottom + 1):
                res.append(matrix[r][right])
            if top < bottom:
                for c in range(right - 1, left - 1, -1):
                    res.append(matrix[bottom][c])
            if left < right:
                for r in range(bottom - 1, top, -1):
                    res.append(matrix[r][left])
            top, bottom, left, right = top + 1, bottom - 1, left + 1, right - 1
        return res
`,
      java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) res.add(matrix[top][c]);
            for (int r = top + 1; r <= bottom; r++) res.add(matrix[r][right]);
            if (top < bottom) for (int c = right - 1; c >= left; c--) res.add(matrix[bottom][c]);
            if (left < right) for (int r = bottom - 1; r > top; r--) res.add(matrix[r][left]);
            top++; bottom--; left++; right--;
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'rotate-image',
    title: 'Rotate Image',
    difficulty: 'Medium',
    topic: 'matrix',
    lc150: true,
    statement: 'Rotate an `n × n` matrix by 90 degrees clockwise **in place** (do not allocate another matrix).',
    constraints: ['`1 <= n <= 20`'],
    sig: { name: 'rotate', params: [{ name: 'matrix', type: 'int[][]' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
      { args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] },
      { args: [[[1]]], expected: [[1]] },
      { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
    ],
    hints: ['A clockwise rotation equals a transpose followed by reversing each row.', 'Transpose by swapping `matrix[i][j]` with `matrix[j][i]` for `j > i`.'],
    approaches: [{ name: 'Transpose + reverse rows', idea: 'Transposing flips over the main diagonal; reversing each row then completes the 90° clockwise turn.', time: 'O(n²)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()
`,
      java: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
            }
        for (int[] row : matrix)
            for (int l = 0, r = n - 1; l < r; l++, r--) {
                int t = row[l]; row[l] = row[r]; row[r] = t;
            }
    }
}
`,
    },
  },
  {
    id: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    topic: 'matrix',
    lc150: true,
    statement: 'Given an `m × n` integer matrix, if an element is `0`, set its entire row and column to `0`. Do it **in place**.',
    constraints: ['`1 <= m, n <= 200`'],
    sig: { name: 'setZeroes', params: [{ name: 'matrix', type: 'int[][]' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
      { args: [[[1]]], expected: [[1]] },
      { args: [[[1, 0]]], expected: [[0, 0]] },
    ],
    hints: ['First record which rows and columns contain a zero, then apply.', 'For O(1) space, use the first row and column as the markers (with a separate flag for the first column).'],
    approaches: [
      { name: 'Row/column sets', idea: 'Collect zero rows and columns, then zero them out.', time: 'O(m·n)', space: 'O(m + n)' },
      { name: 'First row/column as markers', idea: 'Store markers in row 0 and column 0, tracking separately whether column 0 itself must be zeroed.', time: 'O(m·n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows = {r for r, row in enumerate(matrix) for v in row if v == 0}
        cols = {c for row in matrix for c, v in enumerate(row) if v == 0}
        for r in range(len(matrix)):
            for c in range(len(matrix[0])):
                if r in rows or c in cols:
                    matrix[r][c] = 0
`,
      java: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[] rows = new boolean[m], cols = new boolean[n];
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (matrix[r][c] == 0) { rows[r] = true; cols[c] = true; }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (rows[r] || cols[c]) matrix[r][c] = 0;
    }
}
`,
    },
  },
  {
    id: 'game-of-life',
    title: 'Game of Life',
    difficulty: 'Medium',
    topic: 'matrix',
    lc150: true,
    statement:
      'Each cell of a board is live (`1`) or dead (`0`) and interacts with its 8 neighbours:\n\n1. A live cell with fewer than 2 live neighbours dies.\n2. A live cell with 2 or 3 live neighbours lives.\n3. A live cell with more than 3 live neighbours dies.\n4. A dead cell with exactly 3 live neighbours becomes live.\n\nAll cells update simultaneously. Update the board **in place** to its next state.',
    constraints: ['`1 <= m, n <= 25`'],
    sig: { name: 'gameOfLife', params: [{ name: 'board', type: 'int[][]' }], returns: 'void', inplace: 0 },
    tests: [
      { args: [[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]], expected: [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]] },
      { args: [[[1, 1], [1, 0]]], expected: [[1, 1], [1, 1]] },
      { args: [[[1]]], expected: [[0]] },
      { args: [[[0, 0, 0], [1, 1, 1], [0, 0, 0]]], expected: [[0, 1, 0], [0, 1, 0], [0, 1, 0]] },
    ],
    hints: ['Updates must use the *old* state of neighbours.', 'Encode transitions in place: e.g. 2 = live→dead, 3 = dead→live; then do a second pass to finalise.'],
    approaches: [
      { name: 'Copy of the board', idea: 'Count neighbours on a copy and write results into the original.', time: 'O(m·n)', space: 'O(m·n)' },
      { name: 'In-place state encoding', idea: 'Use bit 1 to store the next state: `cell |= next << 1`, then shift every cell right by one.', time: 'O(m·n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        m, n = len(board), len(board[0])
        for r in range(m):
            for c in range(n):
                live = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if (dr or dc) and 0 <= r + dr < m and 0 <= c + dc < n:
                            live += board[r + dr][c + dc] & 1
                if live == 3 or (live == 2 and board[r][c] & 1):
                    board[r][c] |= 2
        for r in range(m):
            for c in range(n):
                board[r][c] >>= 1
`,
      java: `class Solution {
    public void gameOfLife(int[][] board) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                int live = 0;
                for (int dr = -1; dr <= 1; dr++)
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) continue;
                        int nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n) live += board[nr][nc] & 1;
                    }
                if (live == 3 || (live == 2 && (board[r][c] & 1) == 1)) board[r][c] |= 2;
            }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) board[r][c] >>= 1;
    }
}
`,
    },
  },
];

export default problems;
