=== complexity | Time & Space Complexity
summary: Measure how an algorithm's cost grows with input size, using Big-O notation.
practice: contains-duplicate-basic
---
Two correct programs can differ enormously in speed. **Complexity analysis** describes how the work (time) and memory (space) an algorithm needs **grow** as the input size `n` grows — independent of hardware or language.

## Big-O in one minute

Big-O keeps only the dominant term and drops constants: `3n² + 5n + 20` is **O(n²)**. It describes the growth rate, which is what matters once inputs get large.

| Big-O | Name | Example | n = 10⁶ operations (roughly) |
|---|---|---|---|
| O(1) | constant | array index, hash lookup | 1 |
| O(log n) | logarithmic | binary search | 20 |
| O(n) | linear | one pass over an array | 10⁶ |
| O(n log n) | linearithmic | efficient sorting | 2·10⁷ |
| O(n²) | quadratic | all pairs, nested loops | 10¹² — too slow |
| O(2ⁿ) | exponential | all subsets | impossible |

:::tip
A rule of thumb for interviews and judges: about **10⁸ simple operations per second**. With n = 10⁵, O(n²) = 10¹⁰ is too slow, but O(n log n) ≈ 2·10⁶ is instant.
:::

## Counting the work

```python title="Three functions, three growth rates"
def first(nums):            # O(1): one step regardless of n
    return nums[0]

def total(nums):            # O(n): touches each element once
    s = 0
    for x in nums:
        s += x
    return s

def count_pairs(nums):      # O(n^2): every pair (i, j)
    pairs = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            pairs += 1
    return pairs

nums = list(range(6))
print(first(nums), total(nums), count_pairs(nums))
```
```java
public class Main {
    static int first(int[] nums) { return nums[0]; }           // O(1)

    static int total(int[] nums) {                              // O(n)
        int s = 0;
        for (int x : nums) s += x;
        return s;
    }

    static int countPairs(int[] nums) {                         // O(n^2)
        int pairs = 0;
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++)
                pairs++;
        return pairs;
    }

    public static void main(String[] args) {
        int[] nums = {0, 1, 2, 3, 4, 5};
        System.out.println(first(nums) + " " + total(nums) + " " + countPairs(nums));
    }
}
```
```output
0 15 15
```

`count_pairs` runs its inner body `n(n−1)/2` times — 15 for n = 6. Drop the constant ½ and lower-order terms: O(n²).

## Logarithms come from halving

When each step cuts the remaining work in half, the number of steps is about log₂ n:

```python title="How many halvings until 1?"
n = 1_000_000
steps = 0
while n > 1:
    n //= 2
    steps += 1
print(steps)
```
```java
public class Main {
    public static void main(String[] args) {
        int n = 1_000_000, steps = 0;
        while (n > 1) {
            n /= 2;
            steps++;
        }
        System.out.println(steps);
    }
}
```
```output
19
```

## Space complexity

Space counts the **extra** memory an algorithm allocates: a new array of size n is O(n); a few variables are O(1). Recursion uses stack space proportional to its depth.

## Rules for analysing code

- **Sequential steps add:** O(n) then O(n²) → O(n²).
- **Nested loops multiply:** a loop of n inside a loop of m → O(n·m).
- **Different inputs get different letters:** looping over `a` and then `b` is O(a + b), not O(n).
- **Amortised cost:** appending to a dynamic array is O(1) on average even though an occasional resize costs O(n).
- **Built-ins aren't free:** `x in list`, `list.index`, `s.substring` and `sorted()` all have their own cost.

:::complexity
Best case: Input that makes the algorithm finish fastest
Average case: Expected cost over typical inputs
Worst case: Upper bound — what Big-O usually reports
:::

:::warning
- Hidden loops: `if x in my_list` inside a loop makes the whole thing O(n²). A set makes it O(n).
- String concatenation in a loop is O(n²) in total (strings are immutable).
- Slicing (`nums[1:]`) copies — O(k) time and space each time.
:::

:::quiz
Q: What is the time complexity of this code?

```
for i in range(n):
    j = 1
    while j < n:
        j *= 2
```
- O(n)
- [x] O(n log n)
- O(n²)
- O(log n)
> The outer loop runs n times; the inner loop doubles j each time, so it runs about log₂ n times. Multiply: O(n log n).
:::

=== dsa-arrays | Arrays: Patterns & Operations
summary: Traversal, in-place updates, insertion and deletion costs, and Kadane's algorithm.
practice: max-in-list, best-time-stock, rotate-array, maximum-subarray
---
An array stores elements in **contiguous memory**, which is why reading `a[i]` is O(1): the address is `start + i × size`. That same layout makes inserting or deleting in the middle O(n), because everything after must shift.

:::viz array 7,2,9,4,5 | hl=2 | caption=Reading a[2] is a single address calculation
:::

## Core operations and their cost

| Operation | Cost |
|---|---|
| Access / update `a[i]` | O(1) |
| Append at end (dynamic array) | O(1) amortised |
| Insert / delete at index i | O(n − i) |
| Linear search | O(n) |
| Binary search (sorted) | O(log n) |

## In-place reversal with two indices

```python title="Reverse without extra space"
def reverse(a):
    i, j = 0, len(a) - 1
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1
        j -= 1
    return a

print(reverse([1, 2, 3, 4, 5]))
```
```java
import java.util.Arrays;

public class Main {
    static void reverse(int[] a) {
        int i = 0, j = a.length - 1;
        while (i < j) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
            i++;
            j--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        reverse(a);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[5, 4, 3, 2, 1]
```

:::viz array 1,2,3,4,5 | ptr=0:i,4:j | caption=Swap a[i] and a[j], then move both inward
:::

## Kadane's algorithm: maximum subarray sum

Given an array with negative numbers, find the contiguous subarray with the largest sum. The brute force checks all O(n²) subarrays. **Kadane's** insight: at each index, the best subarray *ending here* is either the current element alone, or the current element added to the best subarray ending at the previous index.

```python title="Kadane's algorithm"
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)     # extend or start fresh
        best = max(best, cur)
    return best

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
```
```java
public class Main {
    static int maxSubarray(int[] nums) {
        int best = nums[0], cur = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);   // extend or start fresh
            best = Math.max(best, cur);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxSubarray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
    }
}
```
```output
6
```

## Dry run

| i | x | cur = max(x, cur + x) | best |
|---|---|---|---|
| 0 | −2 | −2 | −2 |
| 1 | 1 | 1 | 1 |
| 2 | −3 | −2 | 1 |
| 3 | 4 | 4 | 4 |
| 4 | −1 | 3 | 4 |
| 5 | 2 | 5 | 5 |
| 6 | 1 | **6** | **6** |
| 7 | −5 | 1 | 6 |
| 8 | 4 | 5 | 6 |

The answer is `[4, −1, 2, 1]` with sum 6.

:::complexity
Time: O(n)
Space: O(1)
Brute force: O(n²)
:::

:::warning
- Initialise with `nums[0]`, not 0 — an all-negative array's answer is its largest (least negative) element.
- Off-by-one errors at array boundaries are the most common array bug; check empty and single-element inputs.
:::

:::quiz
Q: Why is inserting at the front of an array O(n)?
- Arrays must be sorted first
- [x] Every existing element must shift one position to the right
- The array must be copied twice
- Indexing becomes slower
> Contiguous storage means making room at index 0 requires moving all n elements.
:::

=== dsa-strings | String Algorithms
summary: Frequency counting, palindromes, anagrams and the cost of string operations.
practice: valid-anagram, valid-palindrome, longest-common-prefix
---
String problems are array problems over characters, with two twists: strings are **immutable** in Python and Java, and the alphabet is often small (26 lowercase letters), which enables counting tricks.

## Frequency arrays

For lowercase letters, a fixed array of 26 counts is faster and simpler than a hash map.

```python title="Are two strings anagrams?"
def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = [0] * 26
    for a, b in zip(s, t):
        count[ord(a) - ord('a')] += 1
        count[ord(b) - ord('a')] -= 1
    return all(c == 0 for c in count)

print(is_anagram("listen", "silent"), is_anagram("rat", "car"))
```
```java
public class Main {
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent") + " " + isAnagram("rat", "car"));
    }
}
```
```output-python
True False
```
```output-java
true false
```

## Palindromes with two pointers

```python title="Palindrome check ignoring non-letters"
def is_palindrome(s):
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

print(is_palindrome("A man, a plan, a canal: Panama"))
```
```java
public class Main {
    static boolean isPalindrome(String s) {
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

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}
```
```output-python
True
```
```output-java
true
```

## Expand around center

Many palindrome problems try every possible center (each character, and each gap between characters) and expand outward while the ends match — O(n²) overall with O(1) space.

```python title="Longest palindromic substring"
def longest_palindrome(s):
    best = ""
    for center in range(2 * len(s) - 1):
        l, r = center // 2, center // 2 + center % 2
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        if r - l - 1 > len(best):
            best = s[l + 1:r]
    return best

print(longest_palindrome("babad"), longest_palindrome("cbbd"))
```
```java
public class Main {
    static String longestPalindrome(String s) {
        int start = 0, len = 0;
        for (int c = 0; c < 2 * s.length() - 1; c++) {
            int l = c / 2, r = c / 2 + c % 2;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
            if (r - l - 1 > len) { len = r - l - 1; start = l + 1; }
        }
        return s.substring(start, start + len);
    }

    public static void main(String[] args) {
        System.out.println(longestPalindrome("babad") + " " + longestPalindrome("cbbd"));
    }
}
```
```output
bab bb
```

:::complexity
Anagram check: O(n) time, O(1) space (26 counters)
Palindrome check: O(n) time, O(1) space
Expand around center: O(n²) time, O(1) space
:::

:::warning
- Building strings with `+=` in a loop is O(n²); use a list + `join` or `StringBuilder`.
- In Java, compare characters with `==` but strings with `.equals()`.
- Unicode and case: decide whether "A" and "a" should match before you start.
:::

=== hashing | Hashing & Hash Maps
summary: How hash tables give O(1) lookups, and the patterns that use them.
practice: two-sum, contains-duplicate-basic, group-anagrams, longest-consecutive-sequence
---
A **hash table** stores key–value pairs in an array of *buckets*. A **hash function** turns each key into a bucket index, so finding a key means computing its hash and looking in one bucket — O(1) on average.

:::viz hashmap "cat"→bucket 2:"meow","dog"→bucket 5:"woof","cow"→bucket 2:"moo" | caption=Different keys can collide in the same bucket; the table keeps both
:::

## How it works

1. `hash(key)` produces an integer; `index = hash % capacity` picks a bucket.
2. **Collisions** (two keys, same bucket) are handled by chaining (a small list per bucket) or probing (try the next slot).
3. When the table gets too full (load factor ~0.75), it **resizes** — doubles capacity and re-inserts everything. This keeps chains short, so operations stay O(1) on average.

Worst case, if every key collides, operations degrade to O(n) — rare with good hash functions.

## Pattern 1: complement lookup (Two Sum)

```python title="Two Sum in one pass"
def two_sum(nums, target):
    seen = {}                       # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))
```
```java
import java.util.*;

public class Main {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();   // value -> index
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));
    }
}
```
```output
[0, 1]
[1, 2]
```

## Dry run — `nums = [2, 7, 11, 15], target = 9`

| i | x | need = 9 − x | in `seen`? | `seen` after |
|---|---|---|---|---|
| 0 | 2 | 7 | no | {2: 0} |
| 1 | 7 | 2 | **yes → [0, 1]** | |

## Pattern 2: grouping by a key

```python title="Group anagrams by sorted letters"
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
```
```java
import java.util.*;

public class Main {
    static List<List<String>> groupAnagrams(String[] words) {
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : words) {
            char[] c = w.toCharArray();
            Arrays.sort(c);
            groups.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }

    public static void main(String[] args) {
        System.out.println(groupAnagrams(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"}));
    }
}
```
```output-python
[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```
```output-java
[[eat, tea, ate], [tan, nat], [bat]]
```

## Pattern 3: counting and set membership

- **Frequency map:** counts of each element (majority element, top-k frequent).
- **Seen set:** detect duplicates or cycles in O(n).
- **Prefix-sum map:** count subarrays with a given sum (covered in Prefix Sum).

:::complexity
Insert / lookup / delete: O(1) average, O(n) worst
Space: O(n)
:::

:::warning
- Keys must be immutable/hashable: use tuples (Python) or strings/records (Java), never lists or arrays. A Java `int[]` key uses identity, not contents.
- Java: `map.get(k)` returns `null` when missing — unboxing it into `int` throws `NullPointerException`.
- Don't rely on iteration order of `HashMap` / `HashSet`.
:::

:::quiz
Q: Why does Two Sum check for the complement *before* inserting the current number?
- It's faster
- [x] So an element is never paired with itself
- Hash maps require it
- To keep the indices sorted
> If you inserted first, `target = 6, x = 3` would find its own index. Checking first guarantees the two indices are different.
:::
