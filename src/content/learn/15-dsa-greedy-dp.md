=== greedy | Greedy Algorithms
summary: Make the locally best choice at each step — and know when that's provably optimal.
practice: jump-game, gas-station, assign-cookies, best-time-stock-ii
---
A **greedy** algorithm builds a solution step by step, always taking the choice that looks best *right now*, and never reconsidering. When it works it's usually simple and fast — but it only works when the problem has the **greedy-choice property**: some optimal solution begins with the greedy choice.

## Example: assign cookies

Each child has a greed factor; each cookie a size. A child is content if given a cookie at least as large as their greed. Maximise content children.

Greedy idea: sort both; give the **smallest sufficient** cookie to the **least greedy** child. Using a bigger cookie than necessary can only hurt later children.

```python title="Assign cookies"
def find_content(greed, cookies):
    greed.sort()
    cookies.sort()
    child = 0
    for size in cookies:
        if child < len(greed) and size >= greed[child]:
            child += 1
    return child

print(find_content([1, 2, 3], [1, 1]))
print(find_content([1, 2], [1, 2, 3]))
```
```java
import java.util.Arrays;

public class Main {
    static int findContent(int[] greed, int[] cookies) {
        Arrays.sort(greed);
        Arrays.sort(cookies);
        int child = 0;
        for (int size : cookies) {
            if (child < greed.length && size >= greed[child]) child++;
        }
        return child;
    }

    public static void main(String[] args) {
        System.out.println(findContent(new int[]{1, 2, 3}, new int[]{1, 1}));
        System.out.println(findContent(new int[]{1, 2}, new int[]{1, 2, 3}));
    }
}
```
```output
1
2
```

## When greedy fails

Making change with coins `[1, 3, 4]` for amount 6: greedy takes 4 + 1 + 1 (3 coins), but 3 + 3 uses only 2. When greedy fails, **dynamic programming** usually works.

## Proving a greedy choice

The usual argument is an **exchange argument**: take any optimal solution; show you can swap one of its choices for the greedy choice without making it worse. Then by induction, the greedy solution is optimal.

:::complexity
Typical: O(n log n) — dominated by sorting
:::

:::tip
Greedy problems often start with **sorting** by the right key: by end time (interval scheduling), by ratio (fractional knapsack), by deadline. Choosing the key is most of the work.
:::

=== intervals | Interval Problems
summary: Sort by start or end, then merge, insert or schedule in one pass.
practice: merge-intervals, insert-interval, non-overlapping-intervals, min-arrows-balloons
---
Interval problems give you ranges `[start, end]`. Almost all of them begin by **sorting** — by start time to merge, by end time to schedule.

:::viz array [1 3],[2 6],[8 10],[15 18] | hl=0,1 | caption=[1,3] and [2,6] overlap → merge into [1,6]
:::

## Merging overlapping intervals

```python title="Merge intervals"
def merge(intervals):
    intervals.sort(key=lambda iv: iv[0])
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:       # overlaps the last one
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))
print(merge([[1, 4], [4, 5]]))
```
```java
import java.util.*;

public class Main {
    static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] iv : intervals) {
            if (!merged.isEmpty() && iv[0] <= merged.get(merged.size() - 1)[1]) {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], iv[1]);
            } else {
                merged.add(new int[]{iv[0], iv[1]});
            }
        }
        return merged.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(merge(new int[][]{{1, 3}, {2, 6}, {8, 10}, {15, 18}})));
        System.out.println(Arrays.deepToString(merge(new int[][]{{1, 4}, {4, 5}})));
    }
}
```
```output
[[1, 6], [8, 10], [15, 18]]
[[1, 5]]
```

## Scheduling: keep the most non-overlapping intervals

Sort by **end** time and always take the interval that finishes first — it leaves the most room for the rest (classic greedy, provable by exchange argument).

```python title="Maximum number of non-overlapping intervals"
def max_non_overlapping(intervals):
    intervals.sort(key=lambda iv: iv[1])
    count, end = 0, float("-inf")
    for s, e in intervals:
        if s >= end:
            count += 1
            end = e
    return count

print(max_non_overlapping([[1, 2], [2, 3], [3, 4], [1, 3]]))
```
```java
import java.util.*;

public class Main {
    static int maxNonOverlapping(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int count = 0;
        long end = Long.MIN_VALUE;
        for (int[] iv : intervals) {
            if (iv[0] >= end) { count++; end = iv[1]; }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(maxNonOverlapping(new int[][]{{1, 2}, {2, 3}, {3, 4}, {1, 3}}));
    }
}
```
```output
3
```

:::complexity
Time: O(n log n) for sorting, O(n) for the sweep
Space: O(n) for the output
:::

:::warning
Clarify whether touching intervals (`[1,4]` and `[4,5]`) count as overlapping — it changes `<` vs `<=`.
:::

=== dp-intro | Dynamic Programming: The Idea
summary: Overlapping subproblems + optimal substructure → memoization or tabulation.
practice: climbing-stairs, fibonacci-memo, min-cost-climbing-stairs
---
**Dynamic programming** (DP) solves a problem by combining solutions to smaller subproblems, computing each subproblem **once** and storing it. It applies when:

1. **Optimal substructure** — the best answer can be built from best answers to subproblems.
2. **Overlapping subproblems** — the same subproblems recur many times (otherwise plain recursion or divide-and-conquer suffices).

## The recipe

1. **Define the state:** what does `dp[i]` mean, in words?
2. **Write the transition:** how is `dp[i]` computed from smaller states?
3. **Set base cases.**
4. **Choose an order** (top-down memoization, or bottom-up tabulation).
5. **Read off the answer.**

## Climbing stairs

You can climb 1 or 2 steps at a time. How many distinct ways to reach step `n`?

- State: `ways[i]` = number of ways to reach step `i`.
- Transition: the last move was 1 step (from `i−1`) or 2 steps (from `i−2`): `ways[i] = ways[i−1] + ways[i−2]`.
- Base: `ways[0] = 1`, `ways[1] = 1`.

```python title="Top-down (memoized) and bottom-up (tabulated)"
from functools import lru_cache

@lru_cache(maxsize=None)
def ways_memo(n):
    if n <= 1:
        return 1
    return ways_memo(n - 1) + ways_memo(n - 2)

def ways_table(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        dp[i] = dp[i - 1] + (dp[i - 2] if i >= 2 else 0)
    return dp[n]

def ways_two_vars(n):
    a, b = 1, 1           # ways[i-2], ways[i-1]
    for _ in range(n - 1):
        a, b = b, a + b
    return b

print(ways_memo(5), ways_table(5), ways_two_vars(5), ways_two_vars(45))
```
```java
import java.util.*;

public class Main {
    static Map<Integer, Integer> memo = new HashMap<>();
    static int waysMemo(int n) {
        if (n <= 1) return 1;
        if (memo.containsKey(n)) return memo.get(n);
        int r = waysMemo(n - 1) + waysMemo(n - 2);
        memo.put(n, r);
        return r;
    }

    static int waysTable(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) dp[i] = dp[i - 1] + (i >= 2 ? dp[i - 2] : 0);
        return dp[n];
    }

    static int waysTwoVars(int n) {
        int a = 1, b = 1;
        for (int i = 0; i < n - 1; i++) { int c = a + b; a = b; b = c; }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(waysMemo(5) + " " + waysTable(5) + " " + waysTwoVars(5) + " " + waysTwoVars(45));
    }
}
```
```output
8 8 8 1836311903
```

## Dry run — `dp` table for n = 5

| i | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| dp[i] | 1 | 1 | 2 | 3 | 5 | **8** |

:::compare
- **Top-down (memoization):** write the natural recursion and cache results. Easy to derive; only computes needed states; uses recursion stack.
- **Bottom-up (tabulation):** fill a table in dependency order with loops. No recursion limit; often allows **space optimisation** (keep only the last few states).
:::

:::complexity
Time: O(number of states × work per state)
Climbing stairs: O(n) time, O(1) space with two variables
:::

=== dp-1d | 1D Dynamic Programming
summary: Linear DP — house robber, coin change, longest increasing subsequence, word break.
practice: house-robber, coin-change, longest-increasing-subsequence, word-break
---
In 1D DP the state is a single index or amount: `dp[i]` describes the best answer for a prefix (or a target value).

## House robber: take or skip

You can't rob two adjacent houses. Maximise loot.

- `dp[i]` = best loot from the first `i` houses.
- Either skip house `i−1` (`dp[i−1]`) or rob it (`dp[i−2] + nums[i−1]`).

```python title="House robber with O(1) space"
def rob(nums):
    prev2, prev1 = 0, 0          # dp[i-2], dp[i-1]
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

print(rob([2, 7, 9, 3, 1]))
```
```java
public class Main {
    static int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[]{2, 7, 9, 3, 1}));
    }
}
```
```output
12
```

## Coin change: fewest coins

- `dp[a]` = fewest coins to make amount `a` (∞ if impossible).
- `dp[a] = 1 + min(dp[a − c])` over every coin `c ≤ a`.

```python title="Coin change"
def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1

print(coin_change([1, 3, 4], 6), coin_change([2], 3))
```
```java
import java.util.Arrays;

public class Main {
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 3, 4}, 6) + " " + coinChange(new int[]{2}, 3));
    }
}
```
```output
2 -1
```

## Longest increasing subsequence

`dp[i]` = length of the longest increasing subsequence **ending at** `i`: `1 + max(dp[j])` for `j < i` with `nums[j] < nums[i]`. O(n²); a patience-sorting variant with binary search achieves O(n log n).

```python title="LIS in O(n log n)"
import bisect

def lis(nums):
    tails = []          # tails[k] = smallest tail of an increasing subsequence of length k+1
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))
```
```java
import java.util.*;

public class Main {
    static int lis(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int x : nums) {
            int i = Collections.binarySearch(tails, x);
            if (i < 0) i = -i - 1;
            if (i == tails.size()) tails.add(x);
            else tails.set(i, x);
        }
        return tails.size();
    }

    public static void main(String[] args) {
        System.out.println(lis(new int[]{10, 9, 2, 5, 3, 7, 101, 18}));
    }
}
```
```output
4
```

:::warning
- Define the state precisely ("ending at i" vs "within the first i") — most DP bugs are a fuzzy state definition.
- Use a sentinel like `amount + 1` instead of `Integer.MAX_VALUE` when you add to it, to avoid overflow.
:::

=== dp-2d | 2D Dynamic Programming
summary: Grids and two-sequence problems — unique paths, LCS, edit distance, knapsack.
practice: unique-paths, minimum-path-sum, longest-common-subsequence, edit-distance
---
When the state needs two indices — a cell in a grid, or positions in two strings — the table becomes 2D.

## Unique paths in a grid

Moving only right or down, how many paths lead from the top-left to the bottom-right of an `m × n` grid?

`dp[r][c] = dp[r−1][c] + dp[r][c−1]`, with the first row and column all 1.

:::viz matrix 1,1,1,1;1,2,3,4;1,3,6,10 | hl=2:3 | caption=3 × 4 grid: 10 paths to the bottom-right cell
:::

```python title="Unique paths"
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]

print(unique_paths(3, 4), unique_paths(3, 7))
```
```java
public class Main {
    static int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r - 1][c] + dp[r][c - 1];
        return dp[m - 1][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 4) + " " + uniquePaths(3, 7));
    }
}
```
```output
10 28
```

## Longest common subsequence

`dp[i][j]` = LCS length of `a[:i]` and `b[:j]`.

- If `a[i−1] == b[j−1]`: `dp[i][j] = dp[i−1][j−1] + 1`.
- Otherwise: `dp[i][j] = max(dp[i−1][j], dp[i][j−1])`.

```python title="LCS"
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"), lcs("abc", "def"))
```
```java
public class Main {
    static int lcs(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println(lcs("abcde", "ace") + " " + lcs("abc", "def"));
    }
}
```
```output
3 0
```

## 0/1 knapsack

Items with weights and values; capacity `W`; each item used at most once. `dp[w]` = best value with capacity `w`. Iterate capacities **downwards** so each item is counted once.

```python title="0/1 knapsack in 1D"
def knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]

print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))
```
```java
public class Main {
    static int knapsack(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < weights.length; i++)
            for (int w = W; w >= weights[i]; w--)
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[]{1, 3, 4, 5}, new int[]{1, 4, 5, 7}, 7));
    }
}
```
```output
9
```

:::complexity
Unique paths / LCS / edit distance: O(m·n) time, O(m·n) space (O(n) with a rolling row)
0/1 knapsack: O(n·W) time, O(W) space
:::

:::tip
Space optimisation: if row `i` only depends on row `i−1`, keep two rows (or one, filled in the right direction).
:::

=== bit-manipulation | Bit Manipulation
summary: Work directly with binary — masks, XOR tricks and counting set bits.
practice: single-number, number-of-1-bits, counting-bits, power-of-two-basic
---
Integers are stored in binary. Bitwise operators act on each bit independently and run in O(1).

| Operator | Python / Java | Example (5 = 101, 3 = 011) |
|---|---|---|
| AND | `&` | 5 & 3 = 001 = 1 |
| OR | `\|` | 5 \| 3 = 111 = 7 |
| XOR | `^` | 5 ^ 3 = 110 = 6 |
| NOT | `~` | ~5 = −6 (two's complement) |
| Left shift | `<<` | 5 << 1 = 1010 = 10 |
| Right shift | `>>` | 5 >> 1 = 10 = 2 |

## Essential tricks

```python title="Common bit operations"
n = 0b10110           # 22
print(bin(n), n)
print((n >> 2) & 1)   # read bit 2
print(n | (1 << 0))   # set bit 0
print(n & ~(1 << 1))  # clear bit 1
print(n & (n - 1))    # drop the lowest set bit
print(bin(n).count("1"))   # popcount
print(8 & 7 == 0, 6 & 5 == 0)   # power of two test: n & (n-1) == 0
```
```java
public class Main {
    public static void main(String[] args) {
        int n = 0b10110;       // 22
        System.out.println(Integer.toBinaryString(n) + " " + n);
        System.out.println((n >> 2) & 1);
        System.out.println(n | (1 << 0));
        System.out.println(n & ~(1 << 1));
        System.out.println(n & (n - 1));
        System.out.println(Integer.bitCount(n));
        System.out.println(((8 & 7) == 0) + " " + ((6 & 5) == 0));
    }
}
```
```output-python
0b10110 22
1
23
20
20
3
True False
```
```output-java
10110 22
1
23
20
20
3
true false
```

## XOR: find the unique element

XOR has three key properties: `x ^ x = 0`, `x ^ 0 = x`, and order doesn't matter. XOR-ing every number cancels out the pairs, leaving the single unpaired value.

```python title="Single number"
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result

print(single_number([4, 1, 2, 1, 2]))
```
```java
public class Main {
    static int singleNumber(int[] nums) {
        int result = 0;
        for (int x : nums) result ^= x;
        return result;
    }

    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{4, 1, 2, 1, 2}));
    }
}
```
```output
4
```

:::compare
- Java `int` is 32-bit two's complement; `>>` keeps the sign, `>>>` shifts in zeros (unsigned shift). Python integers are unbounded, so there's no `>>>`; mask with `& 0xFFFFFFFF` to emulate 32-bit behaviour.
- Built-ins: Java `Integer.bitCount`, `Integer.highestOneBit`, `Integer.numberOfTrailingZeros`; Python `int.bit_count()` (3.10+) and `int.bit_length()`.
:::

:::tip
A bitmask can represent a subset of up to ~20 items: bit `i` set means item `i` is included. Looping `mask` from 0 to `2ⁿ − 1` enumerates all subsets.
:::

=== tries | Tries (Prefix Trees)
summary: Store strings character by character for fast prefix lookups.
practice: implement-trie, design-add-search-words, word-search-ii
---
A **trie** stores a set of strings as a tree of characters. Each path from the root spells a prefix; nodes are marked where a complete word ends. Looking up a word or prefix of length L takes **O(L)**, independent of how many words are stored.

:::viz tree root,c,t,a,o,null,null,t,r | caption=Words "cat", "car", "co…" share the prefix "c"
:::

```python title="Insert, search and prefix check"
class Trie:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word):
        node = self
        for ch in word:
            node = node.children.setdefault(ch, Trie())
        node.is_word = True

    def _walk(self, s):
        node = self
        for ch in s:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

t = Trie()
for w in ["cat", "car", "cart", "dog"]:
    t.insert(w)
print(t.search("car"), t.search("ca"), t.starts_with("ca"), t.starts_with("do"), t.search("cow"))
```
```java
import java.util.*;

public class Main {
    static class Trie {
        Trie[] children = new Trie[26];
        boolean isWord;

        void insert(String word) {
            Trie node = this;
            for (char ch : word.toCharArray()) {
                int i = ch - 'a';
                if (node.children[i] == null) node.children[i] = new Trie();
                node = node.children[i];
            }
            node.isWord = true;
        }

        Trie walk(String s) {
            Trie node = this;
            for (char ch : s.toCharArray()) {
                node = node.children[ch - 'a'];
                if (node == null) return null;
            }
            return node;
        }

        boolean search(String w) { Trie n = walk(w); return n != null && n.isWord; }
        boolean startsWith(String p) { return walk(p) != null; }
    }

    public static void main(String[] args) {
        Trie t = new Trie();
        for (String w : new String[]{"cat", "car", "cart", "dog"}) t.insert(w);
        System.out.println(t.search("car") + " " + t.search("ca") + " " + t.startsWith("ca") + " " + t.startsWith("do") + " " + t.search("cow"));
    }
}
```
```output-python
True False True True False
```
```output-java
true false true true false
```

:::complexity
Insert / search / prefix: O(L) for a word of length L
Space: O(total characters stored)
:::

:::tip
Use a trie for autocomplete, word games (Boggle / Word Search II), and longest-common-prefix queries. A fixed array of 26 children is fast for lowercase letters; a hash map supports any alphabet.
:::

=== dsu | Disjoint Set Union (Union-Find)
summary: Track groups that merge over time, with near-O(1) union and find.
practice: number-of-provinces, redundant-connection
---
**Union-Find** maintains a collection of disjoint sets. It supports:

- `find(x)` — which set's representative (root) does `x` belong to?
- `union(a, b)` — merge the sets containing `a` and `b`.

With **path compression** and **union by rank/size**, both run in *amortised* O(α(n)) — effectively constant.

```python title="Union-Find with path compression and union by size"
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path halving
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already connected (a cycle edge)
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra             # attach smaller under larger
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True

d = DSU(6)
for a, b in [(0, 1), (1, 2), (3, 4)]:
    d.union(a, b)
print(d.components, d.find(2) == d.find(0), d.find(3) == d.find(5))
print(d.union(0, 2))     # already in the same set
```
```java
public class Main {
    static int[] parent, size;
    static int components;

    static int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving
            x = parent[x];
        }
        return x;
    }

    static boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        return true;
    }

    public static void main(String[] args) {
        int n = 6;
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        components = n;
        int[][] edges = {{0, 1}, {1, 2}, {3, 4}};
        for (int[] e : edges) union(e[0], e[1]);
        System.out.println(components + " " + (find(2) == find(0)) + " " + (find(3) == find(5)));
        System.out.println(union(0, 2));
    }
}
```
```output-python
3 True False
False
```
```output-java
3 true false
false
```

:::complexity
find / union: O(α(n)) amortised — practically constant
Space: O(n)
:::

:::tip
DSU answers connectivity questions incrementally: number of connected components, detecting a cycle in an undirected graph (union returns false), Kruskal's minimum spanning tree, grouping equivalent items (accounts merge, similar strings).
:::

=== segment-tree | Segment Trees & Fenwick Trees
summary: Range queries with point updates in O(log n).
practice: range-sum-query-mutable
---
Prefix sums answer range-sum queries in O(1), but an update forces an O(n) rebuild. When values **change** between queries, use a tree structure that makes **both** operations O(log n).

## Fenwick tree (Binary Indexed Tree)

A compact array where index `i` stores the sum of a range whose length is the lowest set bit of `i`. Moving to the next responsible index is a single bit trick.

```python title="Fenwick tree for prefix sums with updates"
class Fenwick:
    def __init__(self, n):
        self.tree = [0] * (n + 1)

    def update(self, i, delta):        # add delta at index i (0-based)
        i += 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i                # next responsible node

    def prefix(self, i):               # sum of [0, i)
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i                # drop lowest set bit
        return s

    def range_sum(self, l, r):         # sum of [l, r]
        return self.prefix(r + 1) - self.prefix(l)

nums = [5, 2, 6, 3, 1]
fw = Fenwick(len(nums))
for i, x in enumerate(nums):
    fw.update(i, x)
print(fw.range_sum(1, 3))
fw.update(2, 10 - nums[2])             # set nums[2] = 10
print(fw.range_sum(1, 3), fw.range_sum(0, 4))
```
```java
public class Main {
    static long[] tree;

    static void update(int i, long delta) {
        for (i++; i < tree.length; i += i & -i) tree[i] += delta;
    }

    static long prefix(int i) {
        long s = 0;
        for (; i > 0; i -= i & -i) s += tree[i];
        return s;
    }

    static long rangeSum(int l, int r) { return prefix(r + 1) - prefix(l); }

    public static void main(String[] args) {
        int[] nums = {5, 2, 6, 3, 1};
        tree = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) update(i, nums[i]);
        System.out.println(rangeSum(1, 3));
        update(2, 10 - nums[2]);
        System.out.println(rangeSum(1, 3) + " " + rangeSum(0, 4));
    }
}
```
```output
11
15 21
```

## Segment tree

A binary tree where each node stores an aggregate (sum, min, max, gcd…) of a segment of the array; the root covers everything and leaves are single elements. Queries combine O(log n) nodes; updates change one root-to-leaf path. More flexible than Fenwick (any associative operation, range updates with lazy propagation) at the cost of more code.

| Structure | Build | Point update | Range query | Notes |
|---|---|---|---|---|
| Prefix sums | O(n) | O(n) | O(1) | static data |
| Fenwick tree | O(n log n) | O(log n) | O(log n) | sums / invertible ops |
| Segment tree | O(n) | O(log n) | O(log n) | any associative op |

:::tip
In interviews, Fenwick and segment trees appear in harder "range query with updates" problems and counting inversions. Recognising that you need one is often the key insight.
:::
