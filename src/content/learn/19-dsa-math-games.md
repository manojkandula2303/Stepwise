=== number-theory | GCD, Modular Arithmetic & Fast Exponentiation
summary: Euclid's algorithm, modular arithmetic for huge answers, binary exponentiation and modular inverses.
practice: pow-x-n, count-good-numbers, gcd-of-strings
---
Many problems say "return the answer modulo 10⁹ + 7" or need divisibility reasoning. A handful of number-theory tools cover almost all of them.

## GCD and LCM

**Euclid's algorithm** rests on one fact: `gcd(a, b) = gcd(b, a mod b)`, and `gcd(a, 0) = a`. Each step at least halves the larger number within two steps, so it takes O(log min(a, b)).

`lcm(a, b) = a / gcd(a, b) × b` (divide first to avoid overflow).

The **extended** Euclidean algorithm also finds integers `x` and `y` with `a·x + b·y = gcd(a, b)`, which is how modular inverses are computed when the modulus isn't prime.

```python title="GCD, LCM and extended Euclid"
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a // gcd(a, b) * b

def ext_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = ext_gcd(b, a % b)
    return g, y1, x1 - (a // b) * y1      # a*x + b*y = g

print(gcd(48, 18), lcm(48, 18))
g, x, y = ext_gcd(240, 46)
print(g, x, y, 240 * x + 46 * y)
```
```java
public class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long t = a % b; a = b; b = t; }
        return a;
    }

    static long lcm(long a, long b) { return a / gcd(a, b) * b; }

    static long[] extGcd(long a, long b) {         // returns {g, x, y} with a*x + b*y = g
        if (b == 0) return new long[]{a, 1, 0};
        long[] r = extGcd(b, a % b);
        return new long[]{r[0], r[2], r[1] - (a / b) * r[2]};
    }

    public static void main(String[] args) {
        System.out.println(gcd(48, 18) + " " + lcm(48, 18));
        long[] r = extGcd(240, 46);
        System.out.println(r[0] + " " + r[1] + " " + r[2] + " " + (240 * r[1] + 46 * r[2]));
    }
}
```
```output
6 144
2 -9 47 2
```

## Modular arithmetic

Working modulo `M` keeps numbers small while preserving `+`, `−` and `×`:

| Rule | Note |
|---|---|
| `(a + b) mod M = ((a mod M) + (b mod M)) mod M` | |
| `(a × b) mod M = ((a mod M) × (b mod M)) mod M` | in Java, multiply as `long`: two values below 10⁹ multiply to below 10¹⁸ |
| `(a − b) mod M = ((a − b) mod M + M) mod M` | Java's `%` can return negatives; Python's can't |
| `(a / b) mod M = a × b⁻¹ mod M` | **division needs a modular inverse** |

## Fast (binary) exponentiation

Computing `aⁿ` by multiplying n times is O(n). Instead, square repeatedly: `aⁿ = (a^(n/2))²` for even n, and `a · aⁿ⁻¹` for odd n. Iteratively, walk the bits of n. **O(log n)**.

## Modular inverse

When `M` is prime and `a` is not a multiple of `M`, **Fermat's little theorem** gives `a^(M−1) ≡ 1`, so `a⁻¹ ≡ a^(M−2) (mod M)`. Combined with factorials, this computes binomial coefficients `C(n, k) mod M` quickly.

```python title="Binary exponentiation, inverses and nCr mod p"
MOD = 10**9 + 7

def power(a, n, m):
    result = 1
    a %= m
    while n > 0:
        if n & 1:                   # this bit of n is set
            result = result * a % m
        a = a * a % m               # square for the next bit
        n >>= 1
    return result

def inverse(a, p):                  # p must be prime
    return power(a, p - 2, p)

def nCr(n, r, p):
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % p
    return fact[n] * inverse(fact[r], p) % p * inverse(fact[n - r], p) % p

print(power(2, 10, 1000), power(2, 30, MOD))
print(inverse(3, MOD), 3 * inverse(3, MOD) % MOD)
print(nCr(10, 3, MOD), nCr(52, 5, MOD))
```
```java
public class Main {
    static final long MOD = 1_000_000_007L;

    static long power(long a, long n, long m) {
        long result = 1;
        a %= m;
        while (n > 0) {
            if ((n & 1) == 1) result = result * a % m;   // this bit of n is set
            a = a * a % m;                                // square for the next bit
            n >>= 1;
        }
        return result;
    }

    static long inverse(long a, long p) { return power(a, p - 2, p); }   // p must be prime

    static long nCr(int n, int r, long p) {
        long[] fact = new long[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % p;
        return fact[n] * inverse(fact[r], p) % p * inverse(fact[n - r], p) % p;
    }

    public static void main(String[] args) {
        System.out.println(power(2, 10, 1000) + " " + power(2, 30, MOD));
        System.out.println(inverse(3, MOD) + " " + (3 * inverse(3, MOD) % MOD));
        System.out.println(nCr(10, 3, MOD) + " " + nCr(52, 5, MOD));
    }
}
```
```output
24 73741817
333333336 1
120 2598960
```

:::complexity
GCD: O(log min(a, b))
Binary exponentiation: O(log n)
nCr with precomputed factorials: O(n) preprocessing, O(log p) per query
:::

:::compare
Python integers never overflow and the built-in `pow(a, n, m)` does modular exponentiation; `pow(a, -1, m)` gives the inverse (Python 3.8+), and `math.gcd`/`math.lcm` exist. In Java, use `long` for every intermediate product and reduce modulo M after each multiplication; `BigInteger.modPow` and `modInverse` exist but are slow.
:::

:::warning
- In Java, `int × int` overflows **before** the `% M`. Write `(long) a * b % M`.
- Fermat inverses only work for a **prime** modulus. For other moduli use the extended Euclidean algorithm, and an inverse exists only when `gcd(a, M) = 1`.
:::

:::quiz
Q: Why can't you compute `(a / b) mod M` as `(a mod M) / (b mod M)`?
- Division is too slow
- [x] After reducing modulo M, the division is no longer exact; you must multiply by b's modular inverse
- Because M is prime
- You can; it's equivalent
> For example, with M = 7: 12 / 4 = 3, but (12 mod 7) / (4 mod 7) = 5 / 4, which isn't even an integer. Multiplying by the inverse of 4 mod 7 (which is 2) gives 5 × 2 mod 7 = 3, the right answer.
:::

=== sieve-primes | Primes & the Sieve of Eratosthenes
summary: Find all primes up to N in O(N log log N), and factorise many numbers fast with smallest prime factors.
practice: count-primes-basic, is-prime-basic
---
Checking one number for primality takes O(√n) by trial division. When you need **all** primes up to N, or to factorise **many** numbers, sieve them.

## Sieve of Eratosthenes

Start with every number marked prime. For each prime `p`, cross out its multiples starting at `p²` (smaller multiples were already crossed out by smaller primes). Stop once `p² > N`.

:::viz array 2,3,4,5,6,7,8,9,10,11,12 | hl=0,1,3,5,9 | caption=After crossing out multiples of 2 and 3, the survivors 2, 3, 5, 7 and 11 are prime
:::

```python title="Sieve of Eratosthenes"
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
        p += 1
    return [i for i, prime in enumerate(is_prime) if prime]

print(sieve(50))
print(len(sieve(1_000_000)))
```
```java
import java.util.*;

public class Main {
    static List<Integer> sieve(int n) {
        boolean[] composite = new boolean[n + 1];
        List<Integer> primes = new ArrayList<>();
        for (int p = 2; p <= n; p++) {
            if (composite[p]) continue;
            primes.add(p);
            for (long m = (long) p * p; m <= n; m += p) composite[(int) m] = true;
        }
        return primes;
    }

    public static void main(String[] args) {
        System.out.println(sieve(50));
        System.out.println(sieve(1_000_000).size());
    }
}
```
```output
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
78498
```

## Smallest prime factor: factorise in O(log n)

A variant of the sieve records each number's **smallest prime factor** (SPF). To factorise `x`, repeatedly divide by `spf[x]`. Each division at least halves `x`, so factorisation takes O(log x) after the sieve.

```python title="Factorisation with smallest prime factors"
def build_spf(n):
    spf = list(range(n + 1))
    p = 2
    while p * p <= n:
        if spf[p] == p:                         # p is prime
            for m in range(p * p, n + 1, p):
                if spf[m] == m:
                    spf[m] = p
        p += 1
    return spf

def factorize(x, spf):
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors

spf = build_spf(1000)
print(factorize(360, spf), factorize(97, spf), factorize(1000, spf))
```
```java
import java.util.*;

public class Main {
    static int[] buildSpf(int n) {
        int[] spf = new int[n + 1];
        for (int i = 0; i <= n; i++) spf[i] = i;
        for (int p = 2; (long) p * p <= n; p++)
            if (spf[p] == p)                                  // p is prime
                for (int m = p * p; m <= n; m += p)
                    if (spf[m] == m) spf[m] = p;
        return spf;
    }

    static List<Integer> factorize(int x, int[] spf) {
        List<Integer> factors = new ArrayList<>();
        while (x > 1) { factors.add(spf[x]); x /= spf[x]; }
        return factors;
    }

    public static void main(String[] args) {
        int[] spf = buildSpf(1000);
        System.out.println(factorize(360, spf) + " " + factorize(97, spf) + " " + factorize(1000, spf));
    }
}
```
```output
[2, 2, 2, 3, 3, 5] [97] [2, 2, 2, 5, 5, 5]
```

:::complexity
Sieve: O(n log log n) time, O(n) space
Factorisation with SPF: O(log x) per number
Trial division (one number): O(√n)
:::

:::tip
Number of divisors and sum of divisors both follow from the prime factorisation: if `x = p₁^a₁ · p₂^a₂ · …`, then x has `(a₁ + 1)(a₂ + 1)…` divisors. For 360 = 2³ · 3² · 5, that's 4 · 3 · 2 = 24.
:::

=== game-theory | Game Theory: Minimax, Nim & Grundy Numbers
summary: Decide who wins two-player games with perfect play — minimax DP, Nim's XOR rule and the Sprague–Grundy theorem.
practice: nim-game, predict-the-winner
---
Interview game problems share a setup: two players alternate moves, both play **optimally**, and you must decide who wins (or by how much). The tools depend on the game's structure.

## Win and lose positions

A position is **losing** for the player to move if every move leads to a winning position for the opponent, and **winning** if at least one move leads to a losing position. Terminal positions are the base cases.

**Example: Nim with one pile, take 1–3 stones, last stone wins.** Positions 0, 4, 8, … are losing: whatever you take (1–3), the opponent takes the rest to the next multiple of 4. So you win exactly when `n % 4 != 0`.

## Minimax with memoisation

When players pick from the ends of an array to maximise their own total, let `best(i, j)` be the **score difference** (current player minus opponent) on `nums[i..j]`. The current player takes one end; afterwards the roles swap, so subtract the opponent's best:

`best(i, j) = max(nums[i] − best(i+1, j), nums[j] − best(i, j−1))`

The first player wins (or ties) when `best(0, n−1) >= 0`.

```python title="Predict the winner with minimax DP"
from functools import lru_cache

def first_player_wins(nums):
    @lru_cache(maxsize=None)
    def best(i, j):                        # score difference for the player to move
        if i > j:
            return 0
        return max(nums[i] - best(i + 1, j), nums[j] - best(i, j - 1))
    return best(0, len(nums) - 1) >= 0

print(first_player_wins((1, 5, 2)), first_player_wins((1, 5, 233, 7)))
```
```java
public class Main {
    static int[] nums;
    static Integer[][] memo;

    static int best(int i, int j) {                 // score difference for the player to move
        if (i > j) return 0;
        if (memo[i][j] != null) return memo[i][j];
        return memo[i][j] = Math.max(nums[i] - best(i + 1, j), nums[j] - best(i, j - 1));
    }

    static boolean firstPlayerWins(int[] a) {
        nums = a;
        memo = new Integer[a.length][a.length];
        return best(0, a.length - 1) >= 0;
    }

    public static void main(String[] args) {
        System.out.println(firstPlayerWins(new int[]{1, 5, 2}) + " " + firstPlayerWins(new int[]{1, 5, 233, 7}));
    }
}
```
```output-python
False True
```
```output-java
false true
```

With `[1, 5, 2]`, whichever end player 1 takes, player 2 takes the 5. With `[1, 5, 233, 7]`, player 1 takes 1, and whatever player 2 takes next, player 1 can take the 233.

## Nim

Several piles; a move removes any positive number of stones from **one** pile; whoever takes the last stone wins. **Bouton's theorem:** the player to move loses exactly when the XOR of all pile sizes is 0.

```python title="Nim: XOR decides"
from functools import reduce
from operator import xor

for piles in ([3, 4, 5], [1, 2, 3], [7]):
    x = reduce(xor, piles)
    print(piles, x, "first player wins" if x else "first player loses")
```
```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[][] games = {{3, 4, 5}, {1, 2, 3}, {7}};
        for (int[] piles : games) {
            int x = 0;
            for (int p : piles) x ^= p;
            System.out.println(Arrays.toString(piles) + " " + x + " " + (x != 0 ? "first player wins" : "first player loses"));
        }
    }
}
```
```output
[3, 4, 5] 2 first player wins
[1, 2, 3] 0 first player loses
[7] 7 first player wins
```

**Why:** from XOR 0, every move makes the XOR non-zero; from a non-zero XOR, there's always a move back to 0 (shrink a pile so the total cancels). The losing player is stuck with XOR 0, and the final empty position has XOR 0.

## Sprague–Grundy: combining games

Every position of an impartial game (both players have the same moves) has a **Grundy number**: the **mex** (minimum excluded non-negative integer) of the Grundy numbers of the positions you can move to. A position is losing exactly when its Grundy number is 0. For several independent games played together, XOR their Grundy numbers, just like Nim.

```python title="Grundy numbers: remove 1, 3 or 4 stones"
def grundy_table(n, moves):
    g = [0] * (n + 1)
    for x in range(1, n + 1):
        reachable = {g[x - m] for m in moves if m <= x}
        mex = 0
        while mex in reachable:
            mex += 1
        g[x] = mex
    return g

print(grundy_table(9, [1, 3, 4]))
```
```java
import java.util.*;

public class Main {
    static int[] grundyTable(int n, int[] moves) {
        int[] g = new int[n + 1];
        for (int x = 1; x <= n; x++) {
            Set<Integer> reachable = new HashSet<>();
            for (int m : moves) if (m <= x) reachable.add(g[x - m]);
            int mex = 0;
            while (reachable.contains(mex)) mex++;
            g[x] = mex;
        }
        return g;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(grundyTable(9, new int[]{1, 3, 4})));
    }
}
```
```output
[0, 1, 0, 1, 2, 3, 2, 0, 1, 0]
```

Positions 0, 2, 7 and 9 have Grundy number 0, so the player to move there loses.

:::complexity
Minimax over intervals: O(n²) states, O(1) each
Nim: O(number of piles)
Grundy table: O(n · |moves|)
:::

:::warning
- "Optimal play" means **both** players maximise their own outcome. Don't assume the opponent plays greedily.
- In score games, track the **difference** (mine minus theirs) so a single function works for both players.
- Grundy theory applies to **impartial** games only; in chess-like games the players have different moves.
:::

=== sqrt-decomposition | Square Root Decomposition
summary: Split an array into √n blocks to answer range queries and updates in O(√n) — simple and flexible.
practice: range-sum-query-mutable
---
**Square root decomposition** divides an array of `n` elements into blocks of about `√n` elements and keeps a summary (sum, min, count…) per block. A range query `[l, r]` then combines:

- the partial blocks at the two ends, element by element (at most 2√n elements), and
- the full blocks in between, using their summaries (at most √n blocks).

That's **O(√n)** per query, and a point update just changes one element and one block summary in **O(1)**.

:::viz array 1,2,3,4,5,6,7,8,9,10 | hl=3,4,5 | caption=Blocks of 3: [1 2 3] [4 5 6] [7 8 9] [10]. Query [2, 7] uses element 2, the whole block [4 5 6], then elements 6 and 7.
:::

```python title="Range sum with point updates"
import math

class SqrtDecomposition:
    def __init__(self, a):
        self.a = a[:]
        self.size = max(1, int(math.isqrt(len(a))))
        self.blocks = [0] * ((len(a) + self.size - 1) // self.size)
        for i, x in enumerate(a):
            self.blocks[i // self.size] += x

    def update(self, i, val):              # O(1)
        self.blocks[i // self.size] += val - self.a[i]
        self.a[i] = val

    def query(self, l, r):                 # O(sqrt n)
        total = 0
        while l <= r and l % self.size != 0:            # left partial block
            total += self.a[l]
            l += 1
        while l + self.size - 1 <= r:                   # whole blocks
            total += self.blocks[l // self.size]
            l += self.size
        while l <= r:                                   # right partial block
            total += self.a[l]
            l += 1
        return total

sd = SqrtDecomposition([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(sd.query(2, 7))
sd.update(4, 50)
print(sd.query(2, 7), sd.query(0, 9))
```
```java
public class Main {
    static int[] a;
    static long[] blocks;
    static int size;

    static void build(int[] input) {
        a = input.clone();
        size = Math.max(1, (int) Math.sqrt(a.length));
        blocks = new long[(a.length + size - 1) / size];
        for (int i = 0; i < a.length; i++) blocks[i / size] += a[i];
    }

    static void update(int i, int val) {          // O(1)
        blocks[i / size] += val - a[i];
        a[i] = val;
    }

    static long query(int l, int r) {             // O(sqrt n)
        long total = 0;
        while (l <= r && l % size != 0) total += a[l++];                         // left partial block
        while (l + size - 1 <= r) { total += blocks[l / size]; l += size; }      // whole blocks
        while (l <= r) total += a[l++];                                          // right partial block
        return total;
    }

    public static void main(String[] args) {
        build(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10});
        System.out.println(query(2, 7));
        update(4, 50);
        System.out.println(query(2, 7) + " " + query(0, 9));
    }
}
```
```output
33
78 100
```

:::complexity
Build: O(n)
Point update: O(1)
Range query: O(√n)
:::

:::compare
Segment and Fenwick trees answer the same queries in O(log n), which is faster. Square root decomposition wins on **simplicity and flexibility**: block summaries can hold anything (sorted copies for "count values ≤ x in a range", frequency tables, and so on) without designing a tree merge operation.
:::

:::tip
**Mo's algorithm** applies the same idea to queries: when all queries are known in advance (offline), sort them by `(l // block, r)` and slide a window between consecutive queries. Many "distinct elements in a range" problems then run in O((n + q)√n).
:::
