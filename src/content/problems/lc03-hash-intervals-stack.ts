import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  // ---------------- Hashmap ----------------
  {
    id: 'ransom-note',
    title: 'Ransom Note',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Return `true` if `ransomNote` can be constructed using the letters from `magazine`, where each letter in `magazine` can be used only once.',
    constraints: ['`1 <= ransomNote.length, magazine.length <= 10^5`', 'Lowercase English letters only'],
    sig: { name: 'canConstruct', params: [{ name: 'ransomNote', type: 'string' }, { name: 'magazine', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['a', 'b'], expected: false },
      { args: ['aa', 'ab'], expected: false },
      { args: ['aa', 'aab'], expected: true },
      { args: ['abc', 'cbaxyz'], expected: true },
    ],
    hints: ['Count the letters available in the magazine.', 'Spend one count per letter of the note; fail if any count goes negative.'],
    approaches: [{ name: 'Letter counts', idea: 'A 26-length array (or hash map) of magazine letter counts, decremented by the note.', time: 'O(m + n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        have = Counter(magazine)
        for ch in ransomNote:
            have[ch] -= 1
            if have[ch] < 0:
                return False
        return True
`,
      java: `class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] have = new int[26];
        for (char c : magazine.toCharArray()) have[c - 'a']++;
        for (char c : ransomNote.toCharArray())
            if (--have[c - 'a'] < 0) return false;
        return true;
    }
}
`,
    },
  },
  {
    id: 'isomorphic-strings',
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`, where every occurrence of a character maps to the same character, and no two characters map to the same character. Return whether `s` and `t` are isomorphic.',
    constraints: ['`1 <= s.length <= 5 * 10^4`', '`t.length == s.length`'],
    sig: { name: 'isIsomorphic', params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['egg', 'add'], expected: true },
      { args: ['foo', 'bar'], expected: false },
      { args: ['paper', 'title'], expected: true },
      { args: ['badc', 'baba'], expected: false },
      { args: ['a', 'a'], expected: true },
    ],
    hints: ['Mapping must be consistent in both directions.', 'Keep two maps: s→t and t→s, and check both at every position.'],
    approaches: [{ name: 'Two-way mapping', idea: 'At each index, the pair (s[i], t[i]) must agree with any previously recorded mapping in both directions.', time: 'O(n)', space: 'O(alphabet)' }],
    solution: {
      python: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        st, ts = {}, {}
        for a, b in zip(s, t):
            if st.setdefault(a, b) != b or ts.setdefault(b, a) != a:
                return False
        return True
`,
      java: `class Solution {
    public boolean isIsomorphic(String s, String t) {
        int[] st = new int[256], ts = new int[256];
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (st[a] == 0 && ts[b] == 0) { st[a] = b; ts[b] = a; }
            else if (st[a] != b || ts[b] != a) return false;
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'word-pattern',
    title: 'Word Pattern',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Given a `pattern` and a string `s` of space-separated words, return `true` if `s` follows the pattern: there is a bijection between letters in `pattern` and non-empty words in `s`.',
    constraints: ['`1 <= pattern.length <= 300`', '`1 <= s.length <= 3000`'],
    sig: { name: 'wordPattern', params: [{ name: 'pattern', type: 'string' }, { name: 's', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['abba', 'dog cat cat dog'], expected: true },
      { args: ['abba', 'dog cat cat fish'], expected: false },
      { args: ['aaaa', 'dog cat cat dog'], expected: false },
      { args: ['abba', 'dog dog dog dog'], expected: false },
      { args: ['aaa', 'aa aa aa aa'], expected: false },
    ],
    hints: ['Split `s` into words; lengths must match the pattern.', 'Same idea as isomorphic strings, with letters ↔ words.'],
    approaches: [{ name: 'Two maps', idea: 'Maintain letter→word and word→letter maps and verify consistency at each position.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split()
        if len(words) != len(pattern):
            return False
        pw, wp = {}, {}
        for p, w in zip(pattern, words):
            if pw.setdefault(p, w) != w or wp.setdefault(w, p) != p:
                return False
        return True
`,
      java: `class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        if (words.length != pattern.length()) return false;
        Map<Character, String> pw = new HashMap<>();
        Map<String, Character> wp = new HashMap<>();
        for (int i = 0; i < words.length; i++) {
            char p = pattern.charAt(i);
            String w = words[i];
            if (!pw.getOrDefault(p, w).equals(w) || wp.getOrDefault(w, p) != p) return false;
            pw.put(p, w);
            wp.put(w, p);
        }
        return true;
    }
}
`,
    },
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` — the same letters with the same counts, in any order.',
    constraints: ['`1 <= s.length, t.length <= 5 * 10^4`', 'Lowercase English letters'],
    sig: { name: 'isAnagram', params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['anagram', 'nagaram'], expected: true },
      { args: ['rat', 'car'], expected: false },
      { args: ['a', 'ab'], expected: false },
      { args: ['listen', 'silent'], expected: true },
    ],
    hints: ['Different lengths can never be anagrams.', 'Count letters in one string and subtract with the other.'],
    approaches: [
      { name: 'Sort', idea: 'Anagrams are equal after sorting.', time: 'O(n log n)', space: 'O(n)' },
      { name: 'Count array', idea: 'Increment for `s`, decrement for `t`; all counts must end at zero.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
}
`,
    },
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'hashing',
    lc150: true,
    statement: 'Given an array of strings `strs`, group the anagrams together. Return the groups in any order; words within a group may be in any order.',
    constraints: ['`1 <= strs.length <= 10^4`', '`0 <= strs[i].length <= 100`'],
    sig: { name: 'groupAnagrams', params: [{ name: 'strs', type: 'string[]' }], returns: 'List<List<string>>' },
    compare: 'deep-unordered',
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
      { args: [['ab', 'ba', 'abc', 'cab', 'x']], expected: [['ab', 'ba'], ['abc', 'cab'], ['x']] },
    ],
    hints: ['Anagrams share a canonical form.', 'Use the sorted string (or a 26-count tuple) as a hash map key.'],
    approaches: [{ name: 'Hash by sorted key', idea: 'Group words under the key `sorted(word)`.', time: 'O(n · k log k)', space: 'O(n · k)' }],
    solution: {
      python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for w in strs:
            groups[''.join(sorted(w))].append(w)
        return list(groups.values())
`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String w : strs) {
            char[] c = w.toCharArray();
            Arrays.sort(c);
            groups.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
}
`,
    },
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Each input has exactly one solution, and you may not use the same element twice. Return the two indices in any order.',
    constraints: ['`2 <= nums.length <= 10^4`', 'Exactly one valid answer exists'],
    sig: { name: 'twoSum', params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }], returns: 'int[]' },
    compare: 'unordered',
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
      { args: [[1, 5, 9, 13, 2], 15], expected: [3, 4] },
    ],
    notes: ['nums[0] + nums[1] = 2 + 7 = 9.'],
    hints: ['For each number `x`, you need `target - x`.', 'Store numbers you have seen in a hash map from value to index.'],
    approaches: [
      { name: 'Brute force', idea: 'Check every pair.', time: 'O(n²)', space: 'O(1)' },
      { name: 'One-pass hash map', idea: 'Before inserting `x`, check whether its complement is already in the map.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []
`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}
`,
    },
  },
  {
    id: 'happy-number',
    title: 'Happy Number',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'A happy number is defined by repeatedly replacing the number with the sum of the squares of its digits. If the process reaches `1`, the number is happy; if it loops forever without reaching 1, it is not. Return whether `n` is happy.',
    constraints: ['`1 <= n <= 2^31 - 1`'],
    sig: { name: 'isHappy', params: [{ name: 'n', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [19], expected: true },
      { args: [2], expected: false },
      { args: [1], expected: true },
      { args: [7], expected: true },
      { args: [4], expected: false },
    ],
    hints: ['Either you reach 1 or you enter a cycle.', 'Detect the cycle with a seen-set, or with fast/slow pointers.'],
    approaches: [
      { name: 'Seen set', idea: 'Record each value; a repeat means a cycle.', time: 'O(log n) per step', space: 'O(log n)' },
      { name: 'Floyd\'s cycle detection', idea: 'Advance a slow and a fast sequence; they meet at 1 or inside a cycle.', time: 'O(log n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def isHappy(self, n: int) -> bool:
        def nxt(x):
            return sum(int(d) ** 2 for d in str(x))
        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = nxt(n)
        return n == 1
`,
      java: `class Solution {
    private int next(int x) {
        int s = 0;
        while (x > 0) { int d = x % 10; s += d * d; x /= 10; }
        return s;
    }

    public boolean isHappy(int n) {
        int slow = n, fast = next(n);
        while (fast != 1 && slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }
}
`,
    },
  },
  {
    id: 'contains-duplicate-ii',
    title: 'Contains Duplicate II',
    difficulty: 'Easy',
    topic: 'hashing',
    lc150: true,
    statement: 'Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` with `nums[i] == nums[j]` and `abs(i - j) <= k`.',
    constraints: ['`1 <= nums.length <= 10^5`', '`0 <= k <= 10^5`'],
    sig: { name: 'containsNearbyDuplicate', params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [[1, 2, 3, 1], 3], expected: true },
      { args: [[1, 0, 1, 1], 1], expected: true },
      { args: [[1, 2, 3, 1, 2, 3], 2], expected: false },
      { args: [[1], 0], expected: false },
    ],
    hints: ['Remember the last index at which each value appeared.', 'Or keep a sliding window set of the last `k` values.'],
    approaches: [{ name: 'Last-seen index map', idea: 'For each value, compare the current index with the last index it was seen at.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        last = {}
        for i, x in enumerate(nums):
            if x in last and i - last[x] <= k:
                return True
            last[x] = i
        return False
`,
      java: `class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> last = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = last.put(nums[i], i);
            if (j != null && i - j <= k) return true;
        }
        return false;
    }
}
`,
    },
  },
  {
    id: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topic: 'hashing',
    lc150: true,
    statement: 'Given an unsorted array of integers `nums`, return the length of the longest sequence of consecutive integers (e.g. 4, 5, 6, 7). Your algorithm must run in O(n) time.',
    constraints: ['`0 <= nums.length <= 10^5`'],
    sig: { name: 'longestConsecutive', params: [{ name: 'nums', type: 'int[]' }], returns: 'int' },
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { args: [[]], expected: 0 },
      { args: [[1, 0, 1, 2]], expected: 3 },
      { args: [[9]], expected: 1 },
    ],
    hints: ['Put everything in a set for O(1) lookups.', 'Only start counting from numbers that begin a run — those where `x - 1` is not in the set.'],
    approaches: [
      { name: 'Sort', idea: 'Sort and count runs.', time: 'O(n log n)', space: 'O(1)' },
      { name: 'Set with run starts', idea: 'Each run is walked exactly once, starting from its smallest element.', time: 'O(n)', space: 'O(n)' },
    ],
    solution: {
      python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 not in s:
                y = x
                while y + 1 in s:
                    y += 1
                best = max(best, y - x + 1)
        return best
`,
      java: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) {
            if (s.contains(x - 1)) continue;
            int y = x;
            while (s.contains(y + 1)) y++;
            best = Math.max(best, y - x + 1);
        }
        return best;
    }
}
`,
    },
  },
  // ---------------- Intervals ----------------
  {
    id: 'summary-ranges',
    title: 'Summary Ranges',
    difficulty: 'Easy',
    topic: 'intervals',
    lc150: true,
    statement: 'Given a sorted array of unique integers `nums`, return the smallest sorted list of ranges that cover all the numbers exactly. Format each range as `"a->b"` if `a != b`, or `"a"` if `a == b`.',
    constraints: ['`0 <= nums.length <= 20`', '`nums` is sorted and unique'],
    sig: { name: 'summaryRanges', params: [{ name: 'nums', type: 'int[]' }], returns: 'List<string>' },
    tests: [
      { args: [[0, 1, 2, 4, 5, 7]], expected: ['0->2', '4->5', '7'] },
      { args: [[0, 2, 3, 4, 6, 8, 9]], expected: ['0', '2->4', '6', '8->9'] },
      { args: [[]], expected: [] },
      { args: [[-1]], expected: ['-1'] },
    ],
    hints: ['Walk through the array, extending a range while the next number is one more.', 'Close the range when the run breaks.'],
    approaches: [{ name: 'Single pass', idea: 'Track the start of the current run and emit it when the run ends.', time: 'O(n)', space: 'O(1) besides output' }],
    solution: {
      python: `class Solution:
    def summaryRanges(self, nums: List[int]) -> List[str]:
        res, i = [], 0
        while i < len(nums):
            j = i
            while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1:
                j += 1
            res.append(str(nums[i]) if i == j else f"{nums[i]}->{nums[j]}")
            i = j + 1
        return res
`,
      java: `class Solution {
    public List<String> summaryRanges(int[] nums) {
        List<String> res = new ArrayList<>();
        for (int i = 0; i < nums.length; ) {
            int j = i;
            while (j + 1 < nums.length && nums[j + 1] == nums[j] + 1) j++;
            res.add(i == j ? String.valueOf(nums[i]) : nums[i] + "->" + nums[j]);
            i = j + 1;
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    topic: 'intervals',
    lc150: true,
    statement: 'Given an array of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return the non-overlapping intervals that cover all input intervals, sorted by start.',
    constraints: ['`1 <= intervals.length <= 10^4`', '`0 <= start <= end <= 10^4`'],
    sig: { name: 'merge', params: [{ name: 'intervals', type: 'int[][]' }], returns: 'int[][]' },
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      { args: [[[1, 2]]], expected: [[1, 2]] },
    ],
    hints: ['Sort intervals by start.', 'An interval overlaps the last merged one if its start ≤ that interval\'s end.'],
    approaches: [{ name: 'Sort and sweep', idea: 'After sorting by start, overlapping intervals are adjacent; extend the last merged interval or start a new one.', time: 'O(n log n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        res = []
        for s, e in intervals:
            if res and s <= res[-1][1]:
                res[-1][1] = max(res[-1][1], e)
            else:
                res.append([s, e])
        return res
`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        for (int[] iv : intervals) {
            if (!res.isEmpty() && iv[0] <= res.get(res.size() - 1)[1])
                res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], iv[1]);
            else res.add(new int[]{iv[0], iv[1]});
        }
        return res.toArray(new int[0][]);
    }
}
`,
    },
  },
  {
    id: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    topic: 'intervals',
    lc150: true,
    statement: 'You are given a sorted list of non-overlapping `intervals` and a `newInterval`. Insert `newInterval`, merging if necessary, and return the resulting sorted, non-overlapping list.',
    constraints: ['`0 <= intervals.length <= 10^4`'],
    sig: { name: 'insert', params: [{ name: 'intervals', type: 'int[][]' }, { name: 'newInterval', type: 'int[]' }], returns: 'int[][]' },
    tests: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
      { args: [[], [5, 7]], expected: [[5, 7]] },
      { args: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]] },
      { args: [[[3, 5]], [1, 2]], expected: [[1, 2], [3, 5]] },
    ],
    hints: ['Three phases: intervals entirely before, overlapping, and entirely after the new one.', 'Merge all overlapping intervals into the new interval by taking min start / max end.'],
    approaches: [{ name: 'Three-phase sweep', idea: 'Copy intervals ending before `newInterval`, absorb overlapping ones, then copy the rest.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res, i, n = [], 0, len(intervals)
        s, e = newInterval
        while i < n and intervals[i][1] < s:
            res.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= e:
            s, e = min(s, intervals[i][0]), max(e, intervals[i][1])
            i += 1
        res.append([s, e])
        res.extend(intervals[i:])
        return res
`,
      java: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length, s = newInterval[0], e = newInterval[1];
        while (i < n && intervals[i][1] < s) res.add(intervals[i++]);
        while (i < n && intervals[i][0] <= e) {
            s = Math.min(s, intervals[i][0]);
            e = Math.max(e, intervals[i][1]);
            i++;
        }
        res.add(new int[]{s, e});
        while (i < n) res.add(intervals[i++]);
        return res.toArray(new int[0][]);
    }
}
`,
    },
  },
  {
    id: 'min-arrows-balloons',
    title: 'Minimum Number of Arrows to Burst Balloons',
    difficulty: 'Medium',
    topic: 'intervals',
    lc150: true,
    statement: 'Balloons are intervals `[xstart, xend]` on the x-axis. An arrow shot vertically at `x` bursts every balloon with `xstart <= x <= xend`. Return the minimum number of arrows needed to burst all balloons.',
    constraints: ['`1 <= points.length <= 10^5`', '`-2^31 <= xstart < xend <= 2^31 - 1`'],
    sig: { name: 'findMinArrowShots', params: [{ name: 'points', type: 'int[][]' }], returns: 'int' },
    tests: [
      { args: [[[10, 16], [2, 8], [1, 6], [7, 12]]], expected: 2 },
      { args: [[[1, 2], [3, 4], [5, 6], [7, 8]]], expected: 4 },
      { args: [[[1, 2], [2, 3], [3, 4], [4, 5]]], expected: 2 },
      { args: [[[-2147483648, 2147483647]]], expected: 1 },
    ],
    hints: ['Sort balloons by their end coordinate.', 'Shoot at the end of the first balloon; skip every balloon that arrow already bursts.'],
    approaches: [{ name: 'Greedy by end point', idea: 'Shooting at the earliest end bursts the most balloons that must be handled first. Count how many times a balloon starts after the last arrow.', time: 'O(n log n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        points.sort(key=lambda p: p[1])
        arrows, last = 0, None
        for s, e in points:
            if last is None or s > last:
                arrows += 1
                last = e
        return arrows
`,
      java: `class Solution {
    public int findMinArrowShots(int[][] points) {
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
        int arrows = 0;
        long last = Long.MIN_VALUE;
        for (int[] p : points) {
            if (arrows == 0 || p[0] > last) { arrows++; last = p[1]; }
        }
        return arrows;
    }
}
`,
    },
  },
  // ---------------- Stack ----------------
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'stack',
    lc150: true,
    statement: 'Given a string `s` containing only `()[]{}`, determine whether it is valid: every opening bracket is closed by the same type, in the correct order, and every closing bracket has a matching opener.',
    constraints: ['`1 <= s.length <= 10^4`'],
    sig: { name: 'isValid', params: [{ name: 's', type: 'string' }], returns: 'bool' },
    tests: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: ['('], expected: false },
      { args: [']'], expected: false },
    ],
    hints: ['The most recently opened bracket must be closed first.', 'Push openers on a stack; on a closer, the top must be its matching opener.'],
    approaches: [{ name: 'Stack', idea: 'Push openers; pop and compare on closers. The string is valid if the stack is empty at the end.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)
        return not stack
`,
      java: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
    },
  },
  {
    id: 'simplify-path',
    title: 'Simplify Path',
    difficulty: 'Medium',
    topic: 'stack',
    lc150: true,
    statement: 'Given an absolute Unix-style `path`, return its simplified canonical form: it starts with a single `/`, directories are separated by one `/`, there is no trailing `/`, and `.` (current directory) and `..` (parent directory) are resolved. Multiple slashes count as one; any other name (including `...`) is a directory name.',
    constraints: ['`1 <= path.length <= 3000`', '`path` is a valid absolute path'],
    sig: { name: 'simplifyPath', params: [{ name: 'path', type: 'string' }], returns: 'string' },
    tests: [
      { args: ['/home/'], expected: '/home' },
      { args: ['/home//foo/'], expected: '/home/foo' },
      { args: ['/home/user/Documents/../Pictures'], expected: '/home/user/Pictures' },
      { args: ['/../'], expected: '/' },
      { args: ['/.../a/../b/c/../d/./'], expected: '/.../b/d' },
    ],
    hints: ['Split on `/` and process each part.', 'Use a stack: push names, pop on `..`, ignore `.` and empty parts.'],
    approaches: [{ name: 'Stack of directory names', idea: 'Process components left to right; the stack holds the current absolute path.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def simplifyPath(self, path: str) -> str:
        stack = []
        for part in path.split('/'):
            if part == '..':
                if stack:
                    stack.pop()
            elif part and part != '.':
                stack.append(part)
        return '/' + '/'.join(stack)
`,
      java: `class Solution {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        for (String part : path.split("/")) {
            if (part.equals("..")) { if (!stack.isEmpty()) stack.pollLast(); }
            else if (!part.isEmpty() && !part.equals(".")) stack.addLast(part);
        }
        return "/" + String.join("/", stack);
    }
}
`,
    },
  },
  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    topic: 'stack',
    lc150: true,
    statement: 'Design a stack that supports `push(val)`, `pop()`, `top()` and `getMin()` (retrieve the minimum element) — all in **O(1)** time. `pop`, `top` and `getMin` are only called on non-empty stacks.',
    constraints: ['At most `3 * 10^4` calls'],
    sig: {
      kind: 'design',
      className: 'MinStack',
      ctor: [],
      methods: [
        { name: 'push', params: [{ name: 'val', type: 'int' }], returns: 'void' },
        { name: 'pop', params: [], returns: 'void' },
        { name: 'top', params: [], returns: 'int' },
        { name: 'getMin', params: [], returns: 'int' },
      ],
    },
    tests: [
      { args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [-2], [0], [-3], [], [], [], []]], expected: [null, null, null, null, -3, null, 0, -2] },
      { args: [['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin'], [[], [1], [1], [], [], []]], expected: [null, null, null, 1, null, 1] },
      { args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'], [[], [5], [3], [7], [], [], [], [], []]], expected: [null, null, null, null, 3, null, 3, null, 5] },
    ],
    hints: ['Store, alongside each value, the minimum of the stack at the time it was pushed.', 'Then `getMin` is just the stored minimum at the top.'],
    approaches: [{ name: 'Stack of (value, current min)', idea: 'Each entry remembers the minimum up to that point, so popping automatically restores the previous minimum.', time: 'O(1) per operation', space: 'O(n)' }],
    solution: {
      python: `class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val: int) -> None:
        cur = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]
`,
      java: `class MinStack {
    private final Deque<int[]> stack = new ArrayDeque<>();

    public void push(int val) {
        int cur = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, cur});
    }

    public void pop() { stack.pop(); }

    public int top() { return stack.peek()[0]; }

    public int getMin() { return stack.peek()[1]; }
}
`,
    },
  },
  {
    id: 'evaluate-rpn',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    topic: 'stack',
    lc150: true,
    statement: 'Evaluate an arithmetic expression given in Reverse Polish Notation as an array of `tokens`. Operators are `+`, `-`, `*`, `/`; operands are integers. Division truncates toward zero. The expression is always valid.',
    constraints: ['`1 <= tokens.length <= 10^4`'],
    sig: { name: 'evalRPN', params: [{ name: 'tokens', type: 'string[]' }], returns: 'int' },
    tests: [
      { args: [['2', '1', '+', '3', '*']], expected: 9 },
      { args: [['4', '13', '5', '/', '+']], expected: 6 },
      { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
      { args: [['3', '-4', '/']], expected: 0 },
      { args: [['7']], expected: 7 },
    ],
    hints: ['Push numbers on a stack.', 'On an operator, pop two operands (right first), apply, and push the result. Watch the truncation direction for negative division in Python.'],
    approaches: [{ name: 'Operand stack', idea: 'RPN is designed for stack evaluation: each operator applies to the two most recent values.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for t in tokens:
            if t in '+-*/' and len(t) == 1:
                b, a = stack.pop(), stack.pop()
                if t == '+': stack.append(a + b)
                elif t == '-': stack.append(a - b)
                elif t == '*': stack.append(a * b)
                else: stack.append(int(a / b))
            else:
                stack.append(int(t))
        return stack[0]
`,
      java: `class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+" -> stack.push(stack.pop() + stack.pop());
                case "-" -> { int b = stack.pop(), a = stack.pop(); stack.push(a - b); }
                case "*" -> stack.push(stack.pop() * stack.pop());
                case "/" -> { int b = stack.pop(), a = stack.pop(); stack.push(a / b); }
                default -> stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}
`,
    },
  },
  {
    id: 'basic-calculator',
    title: 'Basic Calculator',
    difficulty: 'Hard',
    topic: 'stack',
    lc150: true,
    statement: 'Given a string `s` representing a valid expression with non-negative integers, `+`, `-`, parentheses and spaces, evaluate it and return the result. Unary minus may appear (e.g. `"-(2+3)"`). Do not use built-in `eval`.',
    constraints: ['`1 <= s.length <= 3 * 10^5`', 'The answer fits in a 32-bit integer'],
    sig: { name: 'calculate', params: [{ name: 's', type: 'string' }], returns: 'int' },
    tests: [
      { args: ['1 + 1'], expected: 2 },
      { args: [' 2-1 + 2 '], expected: 3 },
      { args: ['(1+(4+5+2)-3)+(6+8)'], expected: 23 },
      { args: ['-(2+3)'], expected: -5 },
      { args: ['1-(     -2)'], expected: 3 },
    ],
    hints: ['Keep a running result and the current sign.', 'On `(`, push the current result and sign onto a stack and start fresh; on `)`, combine with the saved values.'],
    approaches: [{ name: 'Stack of (result, sign)', idea: 'Scan once, accumulating numbers with their signs. Parentheses save and restore the outer context.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def calculate(self, s: str) -> int:
        result, sign, num, stack = 0, 1, 0, []
        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch in '+-':
                result += sign * num
                num, sign = 0, (1 if ch == '+' else -1)
            elif ch == '(':
                stack.append((result, sign))
                result, sign = 0, 1
            elif ch == ')':
                result += sign * num
                num = 0
                prev, s2 = stack.pop()
                result = prev + s2 * result
        return result + sign * num
`,
      java: `class Solution {
    public int calculate(String s) {
        int result = 0, sign = 1, num = 0;
        Deque<int[]> stack = new ArrayDeque<>();
        for (char ch : s.toCharArray()) {
            if (Character.isDigit(ch)) num = num * 10 + (ch - '0');
            else if (ch == '+' || ch == '-') {
                result += sign * num;
                num = 0;
                sign = ch == '+' ? 1 : -1;
            } else if (ch == '(') {
                stack.push(new int[]{result, sign});
                result = 0;
                sign = 1;
            } else if (ch == ')') {
                result += sign * num;
                num = 0;
                int[] top = stack.pop();
                result = top[0] + top[1] * result;
            }
        }
        return result + sign * num;
    }
}
`,
    },
  },
];

export default problems;
