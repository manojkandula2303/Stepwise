=== dp-knapsack | Knapsack Patterns: 0/1 and Unbounded
summary: Choose items under a capacity — use each once (0/1) or any number of times (unbounded), and count combinations vs permutations.
practice: coin-change, coin-change-ii, word-break
---
**Knapsack** problems pick items, each with a weight (cost) and a value, to maximise value without exceeding a capacity `W`. Many interview problems are knapsacks in disguise: coin change, subset sum, partition equal subset sum, target sum.

The single most important question: **can each item be used once, or any number of times?**

| Variant | Each item | Inner loop over capacity |
|---|---|---|
| 0/1 knapsack | at most once | **downwards** (`W` → `wt`) |
| Unbounded knapsack | any number of times | **upwards** (`wt` → `W`) |

## Why the loop direction matters

With a 1D array `dp[w]` (best value with capacity `w`), updating `dp[w]` reads `dp[w − wt]`:

- Going **downwards**, `dp[w − wt]` still holds the value from *before* this item was considered, so the item is counted at most once.
- Going **upwards**, `dp[w − wt]` may already include this item, so it can be taken again and again.

```python title="Same items, two variants"
def knapsack_01(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):          # downwards: each item once
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]

def knapsack_unbounded(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(wt, W + 1):              # upwards: reuse allowed
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]

weights, values = [1, 3, 4], [15, 50, 60]
print(knapsack_01(weights, values, 8), knapsack_unbounded(weights, values, 8))
```
```java
public class Main {
    static int knapsack01(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < weights.length; i++)
            for (int w = W; w >= weights[i]; w--)            // downwards: each item once
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        return dp[W];
    }

    static int knapsackUnbounded(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < weights.length; i++)
            for (int w = weights[i]; w <= W; w++)            // upwards: reuse allowed
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        return dp[W];
    }

    public static void main(String[] args) {
        int[] weights = {1, 3, 4}, values = {15, 50, 60};
        System.out.println(knapsack01(weights, values, 8) + " " + knapsackUnbounded(weights, values, 8));
    }
}
```
```output
125 130
```

With each item once, the best is all three items (weight 8, value 125). With reuse, the best is weight-3 item twice plus weight-1 item twice (value 130).

## Counting: combinations vs permutations

When the question is "**how many ways**" (for example, coin change II), the **order of the two loops** decides what you count:

- **Items outside, amounts inside** → each multiset is counted once (combinations: 1+2+2 and 2+1+2 are the same).
- **Amounts outside, items inside** → every ordering is counted separately (permutations).

```python title="Ways to make 5 with coins 1, 2, 5"
def combinations(coins, amount):
    dp = [1] + [0] * amount
    for c in coins:                       # coins outside
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]

def permutations(coins, amount):
    dp = [1] + [0] * amount
    for a in range(1, amount + 1):        # amounts outside
        for c in coins:
            if c <= a:
                dp[a] += dp[a - c]
    return dp[amount]

print(combinations([1, 2, 5], 5), permutations([1, 2, 5], 5))
```
```java
public class Main {
    static int combinations(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int c : coins)                          // coins outside
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];
        return dp[amount];
    }

    static int permutations(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int a = 1; a <= amount; a++)            // amounts outside
            for (int c : coins) if (c <= a) dp[a] += dp[a - c];
        return dp[amount];
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        System.out.println(combinations(coins, 5) + " " + permutations(coins, 5));
    }
}
```
```output
4 9
```

The 4 combinations are 5, 2+2+1, 2+1+1+1 and 1+1+1+1+1.

## Recognising a knapsack

| Problem | Items | Capacity | Variant |
|---|---|---|---|
| Coin Change (fewest coins) | coins | amount | unbounded, minimise count |
| Coin Change II (ways) | coins | amount | unbounded, count combinations |
| Partition Equal Subset Sum | numbers | half the total | 0/1, feasibility |
| Combination Sum IV | numbers | target | unbounded, count permutations |

:::complexity
Time: O(n · W)
Space: O(W) with the 1D array
:::

:::warning
O(n · W) is **pseudo-polynomial**: it depends on the numeric value of `W`, not on the input size. With `W` around 10⁹, this DP is impossible and you need a different idea.
:::

:::quiz
Q: In the 1D 0/1 knapsack, what goes wrong if you loop capacity **upwards**?
- Nothing, the order doesn't matter
- [x] An item can be added more than once, turning it into the unbounded knapsack
- The answer becomes too small
- It throws an index error
> Going upwards, `dp[w − wt]` may already include the current item, so it gets reused.
:::

=== dp-interval | Interval DP
summary: Solve problems over ranges `[i, j]` by trying every split point — burst balloons, palindromic subsequences, matrix chains.
practice: burst-balloons, longest-palindromic-substring
---
In **interval DP**, the state is a range: `dp[i][j]` is the answer for the sub-array or substring from `i` to `j`. You build answers for short intervals first, then combine them into longer ones, usually by trying every split point `k` between `i` and `j`.

**Tell-tale signs:** the order in which you merge, remove or split pieces matters, and the problem shrinks into contiguous sub-ranges.

## Longest palindromic subsequence

`dp[i][j]` = length of the longest palindromic subsequence of `s[i..j]`.

- If `s[i] == s[j]`: those two characters wrap a palindrome inside, so `dp[i][j] = dp[i+1][j−1] + 2`.
- Otherwise drop one end: `dp[i][j] = max(dp[i+1][j], dp[i][j−1])`.

Fill `i` from the end so `dp[i+1][…]` is ready when you need it.

```python title="Longest palindromic subsequence"
def lps(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]

print(lps("bbbab"), lps("cbbd"))
```
```java
public class Main {
    static int lps(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (int j = i + 1; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) dp[i][j] = dp[i + 1][j - 1] + 2;
                else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
        return dp[0][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(lps("bbbab") + " " + lps("cbbd"));
    }
}
```
```output
4 2
```

## Burst balloons: choose the last one

Bursting balloon `k` earns `left × k × right`, where `left` and `right` are its current neighbours. Choosing which balloon to burst **first** is hard, because neighbours keep changing. Choosing which one to burst **last** in the interval `(i, j)` is easy: when `k` goes last, its neighbours are exactly the boundaries `i` and `j`, and the two sides are independent sub-problems.

`dp[i][j] = max over k of vals[i] × vals[k] × vals[j] + dp[i][k] + dp[k][j]`

```python title="Burst balloons"
def max_coins(nums):
    vals = [1] + nums + [1]            # padding with 1s at both ends
    n = len(vals)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):         # distance between the open boundaries
        for left in range(0, n - length):
            right = left + length
            for k in range(left + 1, right):    # k is burst last in (left, right)
                gain = vals[left] * vals[k] * vals[right] + dp[left][k] + dp[k][right]
                dp[left][right] = max(dp[left][right], gain)
    return dp[0][n - 1]

print(max_coins([3, 1, 5, 8]), max_coins([1, 5]))
```
```java
public class Main {
    static int maxCoins(int[] nums) {
        int n = nums.length + 2;
        int[] vals = new int[n];
        vals[0] = vals[n - 1] = 1;                 // padding with 1s at both ends
        for (int i = 0; i < nums.length; i++) vals[i + 1] = nums[i];
        int[][] dp = new int[n][n];
        for (int length = 2; length < n; length++)
            for (int left = 0; left + length < n; left++) {
                int right = left + length;
                for (int k = left + 1; k < right; k++)   // k is burst last in (left, right)
                    dp[left][right] = Math.max(dp[left][right], vals[left] * vals[k] * vals[right] + dp[left][k] + dp[k][right]);
            }
        return dp[0][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(maxCoins(new int[]{3, 1, 5, 8}) + " " + maxCoins(new int[]{1, 5}));
    }
}
```
```output
167 10
```

For `[3, 1, 5, 8]`, the best order is 1, 5, 3, 8: 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 15 + 120 + 24 + 8 = 167.

:::complexity
Time: O(n³) when every interval tries every split point (O(n²) for palindromic subsequence)
Space: O(n²)
:::

:::tip
Other classic interval DPs: **matrix chain multiplication** (cheapest order to multiply matrices), **minimum cost to cut a stick**, **palindrome partitioning II**, and **optimal binary search tree**. They all share the shape `dp[i][j] = best over k of (dp[i][k] + dp[k][j] + cost(i, k, j))`.
:::

:::warning
Iterate by **interval length** (or `i` backwards), never plain `i` then `j` forwards: `dp[i][j]` needs shorter intervals to be finished first.
:::

=== dp-trees | DP on Trees
summary: Compute answers bottom-up over a tree — return several values per node, like rob/skip in House Robber III.
practice: house-robber-iii, binary-tree-max-path-sum, diameter-binary-tree
---
On a tree, the natural sub-problem is a **subtree**. A post-order DFS computes each node's answer from its children's answers, so every node is processed once: O(n).

The key technique: **return more than one value per node** when the parent needs to know different things about the subtree.

## House Robber III

Houses form a binary tree; robbing two directly connected houses alerts the police. For each node, return two values:

- `take` — best total if this node **is** robbed (so its children must not be).
- `skip` — best total if it **isn't** robbed (children are free to be robbed or not).

```
take = node.val + left.skip + right.skip
skip = max(left.take, left.skip) + max(right.take, right.skip)
```

:::viz tree 3,4,5,1,3,null,1 | hl=1,2 | caption=Best: rob 4 and 5 for a total of 9
:::

```python title="Rob or skip each node"
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)                     # (take, skip)
        l, r = dfs(node.left), dfs(node.right)
        take = node.val + l[1] + r[1]
        skip = max(l) + max(r)
        return (take, skip)
    return max(dfs(root))

t1 = TreeNode(3, TreeNode(2, None, TreeNode(3)), TreeNode(3, None, TreeNode(1)))
t2 = TreeNode(3, TreeNode(4, TreeNode(1), TreeNode(3)), TreeNode(5, None, TreeNode(1)))
print(rob(t1), rob(t2))
```
```java
public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
        TreeNode(int val) { this(val, null, null); }
    }

    static int[] dfs(TreeNode node) {           // returns {take, skip}
        if (node == null) return new int[]{0, 0};
        int[] l = dfs(node.left), r = dfs(node.right);
        int take = node.val + l[1] + r[1];
        int skip = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
        return new int[]{take, skip};
    }

    static int rob(TreeNode root) {
        int[] res = dfs(root);
        return Math.max(res[0], res[1]);
    }

    public static void main(String[] args) {
        TreeNode t1 = new TreeNode(3, new TreeNode(2, null, new TreeNode(3)), new TreeNode(3, null, new TreeNode(1)));
        TreeNode t2 = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(3)), new TreeNode(5, null, new TreeNode(1)));
        System.out.println(rob(t1) + " " + rob(t2));
    }
}
```
```output
7 9
```

## Dry run — second tree

| Node | take | skip | Note |
|---|---|---|---|
| 1 (under 4) | 1 | 0 | leaf |
| 3 (under 4) | 3 | 0 | leaf |
| 4 | 4 + 0 + 0 = 4 | 1 + 3 = 4 | |
| 1 (under 5) | 1 | 0 | leaf |
| 5 | 5 + 0 = 5 | 1 | |
| 3 (root) | 3 + 4 + 1 = 8 | 4 + 5 = **9** | answer max(8, 9) = 9 |

## Patterns you've already met

Several tree problems in this course are tree DP:

| Problem | Value returned to the parent | Global answer updated at each node |
|---|---|---|
| Diameter of Binary Tree | height | left height + right height |
| Binary Tree Maximum Path Sum | best downward path gain | val + left gain + right gain |
| Balanced Binary Tree | height (or −1 if unbalanced) | — |

:::tip
**Rerooting** extends tree DP to "answer for every node as the root" (for example, sum of distances from every node) in O(n): one DFS computes subtree answers, and a second DFS pushes the parent's contribution down to each child.
:::

:::complexity
Time: O(n)
Space: O(h) recursion
:::

=== dp-bitmask | Bitmask DP
summary: Use the bits of an integer as the set of items chosen so far — travelling salesman, assignment and partition problems for n ≤ ~20.
practice: partition-k-equal-subsets
---
When a DP state must remember **which subset** of a small set has been used, encode the subset as an integer: bit `i` is 1 if item `i` is in the subset. With `n` items there are `2ⁿ` subsets, so this works for `n` up to about 20.

| Operation | Expression |
|---|---|
| Is item `i` in `mask`? | `(mask >> i) & 1` |
| Add item `i` | `mask \| (1 << i)` |
| Remove item `i` | `mask & ~(1 << i)` |
| The full set | `(1 << n) - 1` |
| Number of items | popcount(mask) |

## Travelling salesman

Visit every city exactly once and return to the start, at minimum total distance. Brute force tries all `(n − 1)!` orders. Bitmask DP does far better:

`dp[mask][i]` = shortest path that starts at city 0, visits exactly the cities in `mask`, and ends at city `i`.

Transition: from `dp[mask][i]`, go to any unvisited city `j`: `dp[mask | (1 << j)][j] = min(…, dp[mask][i] + dist[i][j])`.

```python title="Travelling salesman with bitmask DP"
def tsp(dist):
    n = len(dist)
    INF = float("inf")
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0                                   # visited {0}, standing at 0
    for mask in range(1 << n):
        for i in range(n):
            if dp[mask][i] == INF or not (mask >> i) & 1:
                continue
            for j in range(n):
                if (mask >> j) & 1:
                    continue                       # already visited
                nxt = mask | (1 << j)
                dp[nxt][j] = min(dp[nxt][j], dp[mask][i] + dist[i][j])
    full = (1 << n) - 1
    return min(dp[full][i] + dist[i][0] for i in range(1, n))

dist = [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]
print(tsp(dist))
```
```java
import java.util.Arrays;

public class Main {
    static int tsp(int[][] dist) {
        int n = dist.length, INF = 1_000_000_000;
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) Arrays.fill(row, INF);
        dp[1][0] = 0;                                  // visited {0}, standing at 0
        for (int mask = 0; mask < (1 << n); mask++)
            for (int i = 0; i < n; i++) {
                if (dp[mask][i] == INF || ((mask >> i) & 1) == 0) continue;
                for (int j = 0; j < n; j++) {
                    if (((mask >> j) & 1) == 1) continue;  // already visited
                    int nxt = mask | (1 << j);
                    dp[nxt][j] = Math.min(dp[nxt][j], dp[mask][i] + dist[i][j]);
                }
            }
        int full = (1 << n) - 1, best = INF;
        for (int i = 1; i < n; i++) best = Math.min(best, dp[full][i] + dist[i][0]);
        return best;
    }

    public static void main(String[] args) {
        int[][] dist = {{0, 10, 15, 20}, {10, 0, 35, 25}, {15, 35, 0, 30}, {20, 25, 30, 0}};
        System.out.println(tsp(dist));
    }
}
```
```output
80
```

The best tour is 0 → 1 → 3 → 2 → 0: 10 + 25 + 30 + 15 = 80.

:::complexity
Time: O(2ⁿ · n²)
Space: O(2ⁿ · n)
:::

:::tip
- **Enumerate all subsets** of `n` items: `for mask in range(1 << n)`.
- **Enumerate the subsets of a mask**: `sub = mask; while sub: …; sub = (sub - 1) & mask`. Doing this for every mask costs O(3ⁿ) in total.
- Other bitmask DPs: assigning n workers to n jobs, partitioning into k equal-sum subsets, shortest path visiting all nodes (BFS over (node, mask)).
:::

:::warning
2²⁰ ≈ 10⁶ states is fine; 2³⁰ ≈ 10⁹ is not. If `n` is much above 20, bitmask DP is the wrong tool.
:::

=== dp-digit | Digit DP
summary: Count numbers up to N with a digit property by walking the digits with a "tight" flag.
practice: count-digit-one
---
"How many integers from 0 to N have digit sum S?", "…contain no 4?", "…have non-decreasing digits?" When N can be as large as 10¹⁸, checking every number is impossible. **Digit DP** builds the numbers digit by digit, from the most significant, and counts them in roughly O(digits × states × 10).

## The state

- `pos` — which digit we are choosing.
- Whatever the property needs, such as the digit sum so far.
- `tight` — are we still matching N's prefix exactly? If so, the next digit can't exceed N's digit at this position; otherwise any digit 0–9 is allowed.

:::viz array 3,4,7 | hl=0 | caption=N = 347: with prefix 3, the next digit is capped at 4; with prefix 2, any digit 0–9 is allowed
:::

## Count numbers in [0, N] with digit sum S

```python title="Digit DP, checked against brute force"
from functools import lru_cache

def count_digit_sum(N, S):
    digits = list(map(int, str(N)))

    @lru_cache(maxsize=None)
    def go(pos, total, tight):
        if total > S:
            return 0                                  # prune: sum already too big
        if pos == len(digits):
            return 1 if total == S else 0
        limit = digits[pos] if tight else 9
        return sum(go(pos + 1, total + d, tight and d == limit) for d in range(limit + 1))

    return go(0, 0, True)

def brute(N, S):
    return sum(1 for x in range(N + 1) if sum(map(int, str(x))) == S)

print(count_digit_sum(100, 5), brute(100, 5))
print(count_digit_sum(1000, 10), brute(1000, 10))
print(count_digit_sum(10**18, 100))
```
```java
import java.util.Arrays;

public class Main {
    static int[] digits;
    static int S;
    static long[][][] memo;

    static long go(int pos, int total, int tight) {
        if (total > S) return 0;                          // prune: sum already too big
        if (pos == digits.length) return total == S ? 1 : 0;
        if (memo[pos][total][tight] != -1) return memo[pos][total][tight];
        int limit = tight == 1 ? digits[pos] : 9;
        long count = 0;
        for (int d = 0; d <= limit; d++) count += go(pos + 1, total + d, (tight == 1 && d == limit) ? 1 : 0);
        return memo[pos][total][tight] = count;
    }

    static long countDigitSum(long N, int s) {
        String str = Long.toString(N);
        digits = new int[str.length()];
        for (int i = 0; i < str.length(); i++) digits[i] = str.charAt(i) - '0';
        S = s;
        memo = new long[digits.length][s + 1][2];
        for (long[][] a : memo) for (long[] b : a) Arrays.fill(b, -1);
        return go(0, 0, 1);
    }

    static long brute(int N, int s) {
        long count = 0;
        for (int x = 0; x <= N; x++) {
            int sum = 0;
            for (int y = x; y > 0; y /= 10) sum += y % 10;
            if (sum == s) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countDigitSum(100, 5) + " " + brute(100, 5));
        System.out.println(countDigitSum(1000, 10) + " " + brute(1000, 10));
        System.out.println(countDigitSum(1_000_000_000_000_000_000L, 100));
    }
}
```
```output
6 6
63 63
9869362547411187
```

The last line counts the numbers up to 10¹⁸ with digit sum 100, far beyond what brute force could ever reach.

## Why `tight` matters

Once you place a digit **smaller** than N's digit at some position, every later digit is unrestricted, and those states are shared by many prefixes, which is where memoisation pays off. While `tight` is true, you follow N exactly and there is only one such path.

:::complexity
Time: O(digits × property states × 2 × 10)
Space: O(digits × property states × 2)
:::

:::warning
- Decide whether to count 0, and whether the range is `[0, N]` or `[1, N]`. For a range `[L, R]`, compute `f(R) − f(L − 1)`.
- Some properties (like "no leading zeros" or "digits strictly increasing") need an extra `started` flag to tell leading zeros apart from real zeros.
:::
