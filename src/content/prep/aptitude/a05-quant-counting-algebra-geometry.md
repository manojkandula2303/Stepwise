=== q-pnc | Permutations and Combinations
summary: Counting principles, arrangements with repeats, selections, circular arrangements and grouping constraints.
---
Counting questions come down to two questions: **does order matter?** and **are items repeated?**

## Fundamental principle

If one choice can be made in m ways and a second in n ways, both together can be made in **m × n** ways ("and" multiplies). Mutually exclusive alternatives **add** ("or" adds).

## Permutations (order matters)

- n distinct items in a row: **n!**
- r of n distinct items in a row: **ⁿPᵣ = n!/(n − r)!**
- With repeats (p of one kind, q of another): **n!/(p! q!)**
  - BANANA: 6!/(3! 2!) = **60**
- Circular arrangement of n people: **(n − 1)!**

## Combinations (order doesn't matter)

**ⁿCᵣ = n!/(r!(n − r)!)**, and ⁿCᵣ = ⁿCₙ₋ᵣ.

- Committee of 3 men from 6 and 2 women from 5: ⁶C₃ × ⁵C₂ = 20 × 10 = **200**
- Handshakes among n people: ⁿC₂
- Diagonals of an n-gon: **n(n − 3)/2**

## Constraints

- **Must be together:** glue the group into one block, arrange the blocks, then arrange inside the block.
- **Never together:** total arrangements − arrangements where they are together.
- **At least one:** total − none.

**Example.** Arrange LEADER so the vowels (E, A, E) stay together. The blocks L, D, R, [EAE] give 4! = 24 orders. Inside the block there are 3!/2! = 3 orders. Total **72**.

:::mcq easy
Q: In how many ways can 5 different books be arranged on a shelf?
- 25
- [x] 120
- 60
- 720
> 5! = 120.
:::

:::mcq easy
Q: How many distinct arrangements are there of the letters of LEVEL?
- 60
- [x] 30
- 120
- 20
> 5!/(2! × 2!) = 30 (L and E each appear twice).
:::

:::mcq easy
Q: What is the value of ¹⁰C₃?
- 720
- [x] 120
- 30
- 210
> 10 × 9 × 8 / 6 = 120.
:::

:::mcq medium
Q: How many committees of 3 men and 2 women can be formed from 6 men and 5 women?
- 150
- [x] 200
- 300
- 462
> ⁶C₃ × ⁵C₂ = 20 × 10 = 200.
:::

:::mcq medium
Q: How many distinct arrangements are there of the letters of BANANA?
- 120
- [x] 60
- 720
- 30
> 6!/(3! × 2!) = 60.
:::

:::mcq easy
Q: How many 3-digit numbers with distinct digits can be formed from the digits 1–5?
- 125
- [x] 60
- 10
- 120
> 5 × 4 × 3 = 60.
:::

:::mcq medium
Q: In how many ways can 6 people sit around a round table?
- 720
- [x] 120
- 360
- 60
> (6 − 1)! = 120.
:::

:::mcq medium
Q: How many diagonals does a decagon have?
- 45
- [x] 35
- 40
- 30
> n(n − 3)/2 = 10 × 7/2 = 35.
:::

:::mcq easy
Q: Twelve people each shake hands once with everyone else. How many handshakes are there?
- 132
- [x] 66
- 144
- 78
> ¹²C₂ = 66.
:::

:::mcq hard
Q: In how many ways can the letters of LEADER be arranged so that the vowels are always together?
- 36
- [x] 72
- 144
- 24
> Treat EAE as one block: 4! = 24 arrangements of blocks, times 3!/2! = 3 inside the block, giving 72.
:::

=== q-probability | Probability
summary: Classical probability with coins, dice, cards and bags; complements; independent events.
---
**P(event) = favourable outcomes ÷ total equally likely outcomes**, a number from 0 to 1.

## Sample spaces you must know

| Experiment | Outcomes |
|---|---|
| n coins | 2ⁿ |
| n dice | 6ⁿ |
| A deck of cards | 52: 4 suits × 13; 26 red, 26 black; 12 face cards; 4 aces |

## Rules

- **Complement:** P(not A) = 1 − P(A). "At least one" is usually easiest as 1 − P(none).
  - At least one head in 3 coins: 1 − 1/8 = **7/8**
- **Addition:** P(A or B) = P(A) + P(B) − P(A and B)
  - Red or king: 26/52 + 4/52 − 2/52 = **28/52 = 7/13**
- **Independent events:** P(A and B) = P(A) × P(B)

## Drawing without replacement

Use combinations. Two balls from 5 red and 3 blue, both red: ⁵C₂/⁸C₂ = 10/28 = **5/14**.

## Two dice: sums

| Sum | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Ways | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |

## Calendar questions

A leap year has 52 weeks and 2 extra days. Of the 7 possible pairs of extra days, 2 contain a Sunday, so P(53 Sundays) = **2/7**.

:::mcq easy
Q: Two dice are thrown. What is the probability that the sum is 7?
- 1/12
- [x] 1/6
- 7/36
- 5/36
> 6 of the 36 outcomes give 7.
:::

:::mcq easy
Q: A card is drawn from a standard deck. What is the probability that it is a king?
- 1/52
- [x] 1/13
- 1/4
- 4/13
> 4/52 = 1/13.
:::

:::mcq easy
Q: Three coins are tossed. What is the probability of at least one head?
- 1/2
- [x] 7/8
- 3/8
- 3/4
> 1 − P(no heads) = 1 − 1/8.
:::

:::mcq medium
Q: A bag has 5 red and 3 blue balls. Two are drawn at random. What is the probability that both are red?
- 25/64
- [x] 5/14
- 5/8
- 3/14
> ⁵C₂/⁸C₂ = 10/28 = 5/14.
:::

:::mcq medium
Q: A card is drawn at random. What is the probability that it is red or a king?
- 15/26
- [x] 7/13
- 1/2
- 8/13
> (26 + 4 − 2)/52 = 28/52 = 7/13.
:::

:::mcq medium
Q: For independent events, P(A) = 0.4 and P(B) = 0.5. What is P(A or B)?
- 0.9
- [x] 0.7
- 0.2
- 0.8
> 0.4 + 0.5 − 0.4 × 0.5 = 0.7.
:::

:::mcq easy
Q: Two dice are thrown. What is the probability of a doublet (both the same)?
- 1/36
- [x] 1/6
- 1/12
- 1/3
> 6/36 = 1/6.
:::

:::mcq medium
Q: What is the probability that a leap year has 53 Sundays?
- 1/7
- [x] 2/7
- 3/7
- 1/53
> The 2 extra days form one of 7 equally likely pairs, and 2 of those pairs include a Sunday.
:::

:::mcq medium
Q: Two dice are thrown. What is the probability that the sum is at least 10?
- 1/12
- [x] 1/6
- 5/36
- 1/4
> Sums 10, 11 and 12 occur in 3 + 2 + 1 = 6 ways, and 6/36 = 1/6.
:::

:::mcq hard
Q: A tells the truth 3/4 of the time and B 4/5 of the time. What is the probability that they contradict each other when describing the same fact?
- 1/5
- [x] 7/20
- 3/20
- 13/20
> One is true and the other false: (3/4)(1/5) + (1/4)(4/5) = 3/20 + 4/20 = 7/20.
:::

=== q-number-series | Number Series
summary: Spotting the pattern: differences, ratios, squares and cubes, alternating series and finding the wrong term.
---
Work through patterns in this order and you'll crack almost every series:

1. **Differences.** Take first differences, then second differences.
2. **Ratios.** Look for multiplying by a constant, or × then +.
3. **Squares and cubes.** n², n³, n² ± 1, n(n + 1).
4. **Primes.** 2, 3, 5, 7, 11, 13, …
5. **Alternating series.** Two interleaved series, or alternating operations (+2, ×2, …).
6. **Fibonacci-like.** Each term is the sum of the previous two.

## Examples

| Series | Pattern | Next |
|---|---|---|
| 2, 6, 12, 20, 30 | n(n + 1) | 42 |
| 5, 11, 23, 47 | × 2 + 1 | 95 |
| 120, 99, 80, 63, 48 | n² − 1 for n = 11, 10, 9, … | 35 |
| 4, 6, 12, 14, 28, 30 | + 2, × 2 alternately | 60 |
| 1, 2, 6, 15, 31 | differences 1, 4, 9, 16 (squares) | 56 |

## Wrong-term questions

Find the rule from most of the terms, then check each term against it. In 3, 7, 15, 27, 63, 127 the rule × 2 + 1 gives 31, so **27** is wrong.

:::mcq easy
Q: 2, 6, 12, 20, 30, ?
- 40
- [x] 42
- 44
- 36
> n(n + 1): 6 × 7 = 42.
:::

:::mcq easy
Q: 3, 9, 27, 81, ?
- 162
- [x] 243
- 324
- 108
> Each term is multiplied by 3.
:::

:::mcq easy
Q: 1, 4, 9, 16, 25, ?
- 30
- [x] 36
- 49
- 35
> These are perfect squares; next is 6² = 36.
:::

:::mcq medium
Q: 5, 11, 23, 47, ?
- 94
- [x] 95
- 96
- 71
> × 2 + 1 each time: 47 × 2 + 1 = 95.
:::

:::mcq easy
Q: 2, 3, 5, 7, 11, ?
- 12
- [x] 13
- 15
- 17
> These are consecutive primes.
:::

:::mcq medium
Q: Find the wrong term: 3, 7, 15, 27, 63, 127
- 7
- [x] 27
- 63
- 15
> The rule is × 2 + 1, so the 4th term should be 31.
:::

:::mcq easy
Q: 1, 1, 2, 3, 5, 8, ?
- 11
- [x] 13
- 12
- 14
> Fibonacci: each term is the sum of the previous two.
:::

:::mcq medium
Q: 120, 99, 80, 63, 48, ?
- 33
- [x] 35
- 36
- 37
> n² − 1 for n = 11, 10, 9, 8, 7, 6: 36 − 1 = 35.
:::

:::mcq medium
Q: 4, 6, 12, 14, 28, 30, ?
- 32
- [x] 60
- 58
- 62
> The operations alternate between + 2 and × 2: 30 × 2 = 60.
:::

:::mcq hard
Q: 1, 2, 6, 15, 31, ?
- 47
- [x] 56
- 52
- 63
> The differences are 1, 4, 9, 16 (squares); the next difference is 25, so 31 + 25 = 56.
:::

=== q-ap-gp | Progressions (AP and GP)
summary: nth term and sum formulas for arithmetic and geometric progressions, means and infinite GP sums.
---
## Arithmetic progression (AP)

Each term adds a constant difference d.

- nth term: **aₙ = a + (n − 1)d**
- Sum of n terms: **Sₙ = n/2 × [2a + (n − 1)d] = n/2 × (first + last)**
- Number of terms from a to l: **(l − a)/d + 1**
- Arithmetic mean of x and y: (x + y)/2

:::tip
For three terms in an AP, write them as a − d, a, a + d; the d's cancel when you add them.
:::

## Geometric progression (GP)

Each term multiplies by a constant ratio r.

- nth term: **aₙ = a × rⁿ⁻¹**
- Sum of n terms: **Sₙ = a(rⁿ − 1)/(r − 1)** for r ≠ 1
- Infinite sum when |r| < 1: **S∞ = a/(1 − r)**
- Geometric mean of x and y: √(xy)

## Examples

- Two-digit multiples of 3 run from 12 to 99: 30 terms, sum = 30/2 × (12 + 99) = **1665**
- 3 + 6 + 12 + … to 8 terms = 3(2⁸ − 1)/(2 − 1) = **765**
- 1 + 1/2 + 1/4 + … = 1/(1 − 1/2) = **2**

:::mcq easy
Q: What is the 10th term of 3, 7, 11, …?
- 43
- [x] 39
- 40
- 35
> 3 + 9 × 4 = 39.
:::

:::mcq medium
Q: What is the sum of the first 20 terms of 2, 5, 8, …?
- 590
- [x] 610
- 620
- 600
> 20/2 × [4 + 19 × 3] = 10 × 61 = 610.
:::

:::mcq easy
Q: What is the 6th term of the GP 2, 6, 18, …?
- 162
- [x] 486
- 1458
- 243
> 2 × 3⁵ = 486.
:::

:::mcq easy
Q: What is the sum to infinity of 1 + 1/2 + 1/4 + …?
- 1.5
- [x] 2
- 3
- Infinite
> a/(1 − r) = 1/(1/2) = 2.
:::

:::mcq easy
Q: How many terms are there in 7, 11, 15, …, 99?
- 23
- [x] 24
- 25
- 22
> (99 − 7)/4 + 1 = 24.
:::

:::mcq medium
Q: Three numbers in an AP add up to 27 and multiply to 693. What is the largest?
- 9
- [x] 11
- 13
- 12
> The middle term is 9, and (9 − d) × 9 × (9 + d) = 693 gives 81 − d² = 77, so d = 2. The numbers are 7, 9, 11.
:::

:::mcq easy
Q: The sum of the first n odd numbers is 400. What is n?
- 40
- [x] 20
- 25
- 200
> The sum of the first n odd numbers is n², so n = 20.
:::

:::mcq medium
Q: What is the sum of the first 8 terms of 3 + 6 + 12 + …?
- 384
- [x] 765
- 768
- 381
> 3(2⁸ − 1) = 3 × 255 = 765.
:::

:::mcq easy
Q: What is the geometric mean of 4 and 16?
- 10
- [x] 8
- 6
- 12
> √(4 × 16) = 8.
:::

:::mcq hard
Q: What is the sum of all two-digit numbers divisible by 3?
- 1632
- [x] 1665
- 1683
- 1650
> 12 to 99 in steps of 3 is 30 terms: 30/2 × (12 + 99) = 1665.
:::

=== q-surds-indices | Surds and Indices
summary: Laws of exponents, fractional and negative powers, simplifying and rationalising surds, and comparing roots.
---
## Laws of indices

| Law | Example |
|---|---|
| aᵐ × aⁿ = aᵐ⁺ⁿ | 2⁵ × 2³ = 2⁸ |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 3⁷ ÷ 3⁴ = 3³ |
| (aᵐ)ⁿ = aᵐⁿ | (2³)² = 2⁶ |
| a⁰ = 1 | 7⁰ = 1 |
| a⁻ⁿ = 1/aⁿ | 2⁻³ = 1/8 |
| a^(m/n) = (ⁿ√a)ᵐ | 27^(2/3) = 3² = 9 |

**Solving for an exponent:** write both sides with the same base. 3^(x + 2) = 243 = 3⁵, so x = **3**.

**Factor out the smaller power:** 4ˣ − 4ˣ⁻¹ = 4ˣ⁻¹(4 − 1) = 24, so 4ˣ⁻¹ = 8 and 2^(2x − 2) = 2³, giving x = **2.5**.

## Surds

- Simplify: √50 = 5√2, √18 = 3√2
- Like surds add: 5√2 + 3√2 = 8√2
- Rationalise with the conjugate: 1/(√3 + √2) = (√3 − √2)/(3 − 2) = **√3 − √2**

## Comparing roots

Raise every number to the LCM of the root orders. To compare √3, ∛5 and ∜10, raise to the 12th power: 3⁶ = 729, 5⁴ = 625, 10³ = 1000. So **∜10 is largest**.

## Infinite nested roots

If x = √(6 + √(6 + …)), then x² = 6 + x, which gives x = **3**.

:::mcq easy
Q: What is 2⁵ × 2³?
- 2¹⁵
- [x] 256
- 64
- 128
> 2⁵⁺³ = 2⁸ = 256.
:::

:::mcq easy
Q: What is 27^(2/3)?
- 18
- [x] 9
- 3
- 6
> (∛27)² = 3² = 9.
:::

:::mcq easy
Q: Simplify √50 + √18.
- √68
- [x] 8√2
- 6√2
- 2√17
> 5√2 + 3√2 = 8√2.
:::

:::mcq medium
Q: What is 1/(√3 + √2) with a rational denominator?
- √3 + √2
- [x] √3 − √2
- (√3 − √2)/5
- 1/√5
> Multiply by the conjugate: (√3 − √2)/(3 − 2).
:::

:::mcq easy
Q: If 2ˣ = 32, what is x?
- 4
- [x] 5
- 6
- 16
> 32 = 2⁵.
:::

:::mcq medium
Q: What is (0.04)^(−1/2)?
- 0.2
- [x] 5
- 25
- 0.5
> 0.04 = 1/25, so (1/25)^(−1/2) = 25^(1/2) = 5.
:::

:::mcq easy
Q: If 3^(x + 2) = 243, what is x?
- 2
- [x] 3
- 5
- 4
> 243 = 3⁵, so x + 2 = 5.
:::

:::mcq medium
Q: Which is the largest: √3, ∛5 or ∜10?
- √3
- ∛5
- [x] ∜10
- They are equal
> 12th powers: 729, 625 and 1000, so ∜10 is largest.
:::

:::mcq hard
Q: If 4ˣ − 4ˣ⁻¹ = 24, what is x?
- 2
- [x] 2.5
- 3
- 1.5
> 4ˣ⁻¹ × 3 = 24, so 4ˣ⁻¹ = 8 and 2^(2x − 2) = 2³, giving x = 2.5.
:::

:::mcq hard
Q: What is the value of √(6 + √(6 + √(6 + …)))?
- 2
- [x] 3
- √6
- 6
> x² = 6 + x, so x² − x − 6 = 0 and x = 3 (taking the positive root).
:::

=== q-logarithms | Logarithms
summary: Definition, the product, quotient and power rules, change of base and counting digits.
---
**log_b(x) = y means bʸ = x.** A logarithm answers "what power of b gives x?"

## Rules

| Rule | Example |
|---|---|
| log(ab) = log a + log b | log 5 + log 20 = log 100 = 2 |
| log(a/b) = log a − log b | log 50 − log 5 = 1 |
| log(aⁿ) = n log a | log 8 = 3 log 2 = 0.903 |
| log_b b = 1, log_b 1 = 0 | log₁₀ 10 = 1 |
| Change of base: log_b a = log a / log b | log₄ 8 = log 8/log 4 = 3/2 |
| log_b a × log_a b = 1 | Chains cancel: log_b a × log_c b × log_a c = 1 |

## Standard values (base 10)

log 2 ≈ 0.301, log 3 ≈ 0.477, log 5 ≈ 0.699, log 7 ≈ 0.845.

## Counting digits

The number of digits in N is ⌊log₁₀ N⌋ + 1.
For 2³⁰: 30 × 0.301 = 9.03, so it has **10 digits**.

## Nested logs

Work from the inside out: log₂(log₃ 81) = log₂ 4 = **2**.

:::mcq easy
Q: What is log₂ 64?
- 8
- [x] 6
- 32
- 5
> 2⁶ = 64.
:::

:::mcq easy
Q: What is log₁₀ 1000?
- 2
- [x] 3
- 10
- 100
> 10³ = 1000.
:::

:::mcq easy
Q: If log 2 = 0.301, what is log 8?
- 0.602
- [x] 0.903
- 2.408
- 0.8
> log 8 = 3 log 2 = 0.903.
:::

:::mcq easy
Q: What is log₃ 81?
- 3
- [x] 4
- 27
- 9
> 3⁴ = 81.
:::

:::mcq easy
Q: What is log 5 + log 20 (base 10)?
- log 25
- [x] 2
- 1
- 100
> log(5 × 20) = log 100 = 2.
:::

:::mcq medium
Q: What is log₂(log₃ 81)?
- 4
- [x] 2
- 3
- 1
> log₃ 81 = 4, and log₂ 4 = 2.
:::

:::mcq easy
Q: If log₁₀ x = 2, what is x?
- 20
- [x] 100
- 1000
- 10
> x = 10² = 100.
:::

:::mcq medium
Q: What is log₄ 8?
- 2
- [x] 3/2
- 2/3
- 1/2
> log₄ 8 = log 8/log 4 = 3 log 2/2 log 2 = 3/2.
:::

:::mcq medium
Q: Given log 2 = 0.301, how many digits does 2³⁰ have?
- 9
- [x] 10
- 11
- 30
> 30 × 0.301 = 9.03, and ⌊9.03⌋ + 1 = 10.
:::

:::mcq hard
Q: What is log_b a × log_c b × log_a c?
- 0
- [x] 1
- abc
- log abc
> Change of base: (log a/log b)(log b/log c)(log c/log a) = 1.
:::

=== q-algebra | Algebra and Equations
summary: Linear equations, simultaneous equations, quadratics, sum and product of roots, and key identities.
---
## Linear equations

Isolate the variable: 2x + 5 = 17, so x = **6**.

**Simultaneous equations.** Add or subtract them to eliminate a variable. x + y = 10 and x − y = 4 add to 2x = 14, so x = **7**.

## Quadratics: ax² + bx + c = 0

- Factorise: x² − 5x + 6 = (x − 2)(x − 3), so the roots are **2 and 3**.
- Formula: x = [−b ± √(b² − 4ac)]/2a
- **Sum of roots = −b/a**, **product = c/a**
- Discriminant D = b² − 4ac: D > 0 gives two real roots, D = 0 equal roots, D < 0 no real roots.
- A quadratic with roots p and q: x² − (p + q)x + pq = 0

## Identities

- (a + b)² = a² + 2ab + b², so **a² + b² = (a + b)² − 2ab**
- a³ + b³ = (a + b)³ − 3ab(a + b)
- If x + 1/x = k, then x² + 1/x² = k² − 2

**Example.** a + b = 7 and ab = 12 give a² + b² = 49 − 24 = **25**.

## Word problems

Translate each phrase directly: "two numbers differ by 5 and their product is 84" becomes x(x + 5) = 84, so x = 7 and the larger number is **12**.

:::mcq easy
Q: Solve 2x + 5 = 17.
- 5
- [x] 6
- 11
- 7
> 2x = 12, so x = 6.
:::

:::mcq easy
Q: If x + y = 10 and x − y = 4, what is x?
- 3
- [x] 7
- 6
- 14
> Adding: 2x = 14.
:::

:::mcq easy
Q: What are the roots of x² − 5x + 6 = 0?
- −2, −3
- [x] 2, 3
- 1, 6
- −1, 6
> (x − 2)(x − 3) = 0.
:::

:::mcq medium
Q: If x + 1/x = 3, what is x² + 1/x²?
- 9
- [x] 7
- 11
- 6
> 3² − 2 = 7.
:::

:::mcq easy
Q: What is the sum of the roots of 2x² − 8x + 3 = 0?
- −4
- [x] 4
- 3/2
- 8
> −b/a = 8/2 = 4.
:::

:::mcq medium
Q: If a + b = 7 and ab = 12, what is a² + b²?
- 37
- [x] 25
- 49
- 24
> 49 − 2 × 12 = 25.
:::

:::mcq medium
Q: Two numbers differ by 5 and their product is 84. What is the larger number?
- 14
- [x] 12
- 7
- 21
> x(x + 5) = 84 gives x = 7, so the larger number is 12.
:::

:::mcq easy
Q: Which quadratic has roots 3 and −2?
- x² + x − 6 = 0
- [x] x² − x − 6 = 0
- x² − 5x + 6 = 0
- x² + 5x − 6 = 0
> Sum = 1 and product = −6, so x² − x − 6 = 0.
:::

:::mcq medium
Q: If x + y = 5 and xy = 6, what is x³ + y³?
- 125
- [x] 35
- 65
- 90
> (x + y)³ − 3xy(x + y) = 125 − 90 = 35.
:::

:::mcq hard
Q: For which values of k does x² + kx + 16 = 0 have equal roots?
- ±4
- [x] ±8
- 8 only
- ±16
> D = k² − 64 = 0 gives k = ±8.
:::

=== q-mensuration-2d | Mensuration 2D
summary: Perimeter and area of triangles, quadrilaterals and circles, Heron's formula and paths.
---
## Formulas

| Shape | Area | Perimeter |
|---|---|---|
| Rectangle l × b | lb | 2(l + b) |
| Square of side a | a² = d²/2 | 4a |
| Triangle | ½ × base × height | sum of sides |
| Equilateral triangle of side a | (√3/4)a² | 3a |
| Circle of radius r | πr² | 2πr |
| Semicircle | πr²/2 | πr + 2r |
| Parallelogram | base × height | 2(a + b) |
| Rhombus with diagonals d₁, d₂ | ½ d₁d₂ | 4a, where a² = (d₁/2)² + (d₂/2)² |
| Trapezium | ½ (sum of parallel sides) × height | sum of sides |

**Heron's formula:** with s = (a + b + c)/2, area = √[s(s − a)(s − b)(s − c)].
For 13, 14, 15: s = 21, area = √(21 · 8 · 7 · 6) = **84**.

:::tip
Use π = 22/7 when the radius is a multiple of 7. Radius 7 gives area 154 and circumference 44.
:::

## Paths and borders

The area of a path = outer area − inner area.
A 2 m path outside a 20 × 15 garden: 24 × 19 − 20 × 15 = 456 − 300 = **156 m²**.

## Scaling

If every length is multiplied by k, area is multiplied by **k²**.

:::mcq easy
Q: What is the area of a 12 × 8 rectangle?
- 40
- [x] 96
- 80
- 100
> 12 × 8 = 96.
:::

:::mcq easy
Q: What is the area of a circle of radius 7 (π = 22/7)?
- 44
- [x] 154
- 147
- 308
> 22/7 × 49 = 154.
:::

:::mcq easy
Q: What is the circumference of a circle of radius 14 (π = 22/7)?
- 44
- [x] 88
- 616
- 176
> 2 × 22/7 × 14 = 88.
:::

:::mcq easy
Q: What is the area of a triangle with sides 3, 4 and 5?
- 12
- [x] 6
- 7.5
- 10
> It is right-angled, so the area is ½ × 3 × 4 = 6.
:::

:::mcq medium
Q: What is the area of an equilateral triangle of side 6?
- 18
- [x] 9√3
- 36√3
- 6√3
> (√3/4) × 36 = 9√3.
:::

:::mcq easy
Q: A square has a diagonal of 10. What is its area?
- 100
- [x] 50
- 25
- 40
> d²/2 = 100/2 = 50.
:::

:::mcq medium
Q: A rhombus has diagonals 10 and 24. What is the length of a side?
- 12
- [x] 13
- 17
- 15
> Half-diagonals 5 and 12 give a side of √(25 + 144) = 13.
:::

:::mcq easy
Q: A trapezium has parallel sides 10 and 14 and a height of 6. What is its area?
- 84
- [x] 72
- 144
- 60
> ½ × 24 × 6 = 72.
:::

:::mcq medium
Q: What is the area of a triangle with sides 13, 14 and 15?
- 91
- [x] 84
- 96
- 78
> s = 21, area = √(21 × 8 × 7 × 6) = √7056 = 84.
:::

:::mcq hard
Q: A 2 m wide path runs around the outside of a 20 m × 15 m garden. What is the area of the path?
- 140 m²
- [x] 156 m²
- 148 m²
- 160 m²
> (24 × 19) − (20 × 15) = 456 − 300 = 156.
:::

=== q-mensuration-3d | Mensuration 3D
summary: Volume and surface area of cubes, cuboids, cylinders, cones and spheres, and melting/recasting.
---
## Formulas

| Solid | Volume | Curved / lateral SA | Total SA |
|---|---|---|---|
| Cube of side a | a³ | 4a² | 6a² |
| Cuboid l × b × h | lbh | 2h(l + b) | 2(lb + bh + hl) |
| Cylinder | πr²h | 2πrh | 2πr(r + h) |
| Cone (slant l = √(r² + h²)) | ⅓πr²h | πrl | πr(l + r) |
| Sphere | (4/3)πr³ | — | 4πr² |
| Hemisphere | (2/3)πr³ | 2πr² | 3πr² |

## Melting and recasting

The **volume stays the same**: number of small solids = big volume ÷ small volume.
A sphere of radius 6 (volume 288π) recast into cones of radius 3 and height 4 (volume 12π each) makes **24 cones**.

## Scaling

If every length is multiplied by k, surface area is multiplied by **k²** and volume by **k³**. Doubling a sphere's radius makes its volume 8 times larger.

:::mcq easy
Q: What is the volume of a cube of side 5?
- 25
- [x] 125
- 150
- 75
> 5³ = 125.
:::

:::mcq easy
Q: What is the total surface area of a 10 × 8 × 5 cuboid?
- 400
- [x] 340
- 170
- 380
> 2(80 + 40 + 50) = 340.
:::

:::mcq easy
Q: What is the volume of a cylinder with radius 7 and height 10 (π = 22/7)?
- 440
- [x] 1540
- 3080
- 1450
> 22/7 × 49 × 10 = 1540.
:::

:::mcq easy
Q: What is the volume of a sphere of radius 3?
- 27π
- [x] 36π
- 12π
- 108π
> (4/3)π × 27 = 36π.
:::

:::mcq medium
Q: What is the curved surface area of a cone with radius 3 and height 4?
- 12π
- [x] 15π
- 24π
- 9π
> Slant height l = 5, so πrl = 15π.
:::

:::mcq medium
Q: A cube has a total surface area of 150. What is its volume?
- 150
- [x] 125
- 216
- 64
> 6a² = 150 gives a = 5, so a³ = 125.
:::

:::mcq medium
Q: What is the volume of a cone with radius 7 and height 12 (π = 22/7)?
- 1848
- [x] 616
- 924
- 308
> ⅓ × 22/7 × 49 × 12 = 616.
:::

:::mcq easy
Q: A sphere's radius is doubled. Its volume becomes how many times larger?
- 2
- [x] 8
- 4
- 6
> Volume scales with r³, and 2³ = 8.
:::

:::mcq medium
Q: What is the total surface area of a solid hemisphere of radius 7 (π = 22/7)?
- 308
- [x] 462
- 616
- 154
> 3πr² = 3 × 22/7 × 49 = 462.
:::

:::mcq hard
Q: A sphere of radius 6 cm is melted and recast into cones of radius 3 cm and height 4 cm. How many cones are made?
- 12
- [x] 24
- 36
- 18
> The sphere's volume is 288π and each cone's is 12π, so 288π/12π = 24.
:::

=== q-geometry | Geometry
summary: Angles, triangles, polygons and circles: the facts that appear most often in aptitude tests.
---
## Lines and angles

- Complementary angles add up to 90°; supplementary angles add up to 180°.
- When a transversal cuts parallel lines, **alternate** and **corresponding** angles are equal, and co-interior angles add up to 180°.

## Triangles

- The angles add up to 180°. An exterior angle equals the sum of the two opposite interior angles.
- **Pythagoras:** a² + b² = c². Common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples (such as 9-12-15).
- **Basic proportionality:** if DE ∥ BC in triangle ABC, then AD/DB = AE/EC.
- Similar triangles have proportional sides, and their areas are in the ratio of the squares of the sides.

## Polygons (n sides)

- Sum of interior angles = **(n − 2) × 180°**
- Each exterior angle of a regular polygon = **360°/n**
  - An interior angle of 140° means an exterior angle of 40°, so n = **9**

## Circles

- The angle in a semicircle is 90°.
- Angles subtended by the same arc are equal; the angle at the centre is twice the angle at the circumference.
- A tangent is perpendicular to the radius at the point of contact. The two tangents from an external point are equal.
  - Tangent length = √(d² − r²): 13 cm away from a circle of radius 5 gives **12 cm**.
- Opposite angles of a cyclic quadrilateral add up to 180°.

:::mcq easy
Q: What is the sum of the interior angles of a hexagon?
- 540°
- [x] 720°
- 900°
- 360°
> (6 − 2) × 180° = 720°.
:::

:::mcq easy
Q: What is each exterior angle of a regular octagon?
- 40°
- [x] 45°
- 135°
- 60°
> 360°/8 = 45°.
:::

:::mcq easy
Q: A triangle's angles are in the ratio 2 : 3 : 4. What is the largest angle?
- 60°
- [x] 80°
- 90°
- 100°
> 180° × 4/9 = 80°.
:::

:::mcq easy
Q: What is the angle in a semicircle?
- 45°
- [x] 90°
- 180°
- 60°
> The angle subtended by a diameter at the circumference is always 90°.
:::

:::mcq easy
Q: What is the supplement of 65°?
- 25°
- [x] 115°
- 295°
- 135°
> 180° − 65° = 115°.
:::

:::mcq easy
Q: A right triangle has legs 9 and 12. How long is the hypotenuse?
- 13
- [x] 15
- 21
- 18
> 3-4-5 scaled by 3 gives 9-12-15.
:::

:::mcq easy
Q: Two parallel lines are cut by a transversal. The alternate interior angles are:
- Supplementary
- [x] Equal
- Complementary
- Unrelated
> Alternate interior angles are equal when the lines are parallel.
:::

:::mcq medium
Q: Each interior angle of a regular polygon is 140°. How many sides does it have?
- 8
- [x] 9
- 10
- 7
> The exterior angle is 40°, and 360/40 = 9.
:::

:::mcq medium
Q: A point is 13 cm from the centre of a circle of radius 5 cm. How long is a tangent from the point?
- 8 cm
- [x] 12 cm
- 18 cm
- 10 cm
> √(13² − 5²) = √144 = 12.
:::

:::mcq hard
Q: In triangle ABC, DE ∥ BC with D on AB and E on AC. AD = 3, DB = 2 and AE = 4.5. What is EC?
- 2.5
- [x] 3
- 3.5
- 6.75
> AD/DB = AE/EC, so 3/2 = 4.5/EC and EC = 3.
:::

=== q-data-interpretation | Data Interpretation Basics
summary: Reading tables and charts, then computing totals, growth, share and averages quickly.
---
Data interpretation (DI) puts the arithmetic you have learned to work on a table or chart. The skill is **reading precisely** and **computing only what is asked**.

## The four calculations

| Asked for | Compute |
|---|---|
| Growth from year 1 to year 2 | (Y₂ − Y₁)/Y₁ × 100 |
| Share of a total | part/total × 100 |
| Average | sum/count |
| Ratio | simplify a : b |

## Approach

1. Read the title, units and labels before the questions. Lakhs vs crores and % vs absolute values are common traps.
2. Add a total row or column once and reuse it.
3. Approximate when the options are far apart; compute exactly when they are close.

:::note
For a full treatment of every chart type, see the Data Interpretation section (D).
:::

:::context
**Sales (units) of four products**

| Product | 2021 | 2022 | 2023 |
|---|---|---|---|
| A | 120 | 150 | 180 |
| B | 200 | 180 | 220 |
| C | 80 | 100 | 90 |
| D | 150 | 170 | 210 |
:::

:::mcq easy
Q: What were the total sales in 2023?
- 650
- [x] 700
- 720
- 600
> 180 + 220 + 90 + 210 = 700.
:::

:::mcq easy
Q: By what percent did product A's sales grow from 2021 to 2023?
- 60%
- [x] 50%
- 40%
- 33.33%
> (180 − 120)/120 = 50%.
:::

:::mcq easy
Q: Which product had the highest sales in 2022?
- A
- [x] B
- C
- D
> B sold 180, ahead of D (170), A (150) and C (100).
:::

:::mcq easy
Q: What were product C's average annual sales over the three years?
- 85
- [x] 90
- 95
- 100
> (80 + 100 + 90)/3 = 90.
:::

:::mcq medium
Q: What is the ratio of B's 2021 sales to D's 2023 sales?
- 21 : 20
- [x] 20 : 21
- 10 : 7
- 4 : 3
> 200 : 210 = 20 : 21.
:::

:::mcq easy
Q: Which product's sales fell from 2022 to 2023?
- A
- B
- [x] C
- D
> C went from 100 to 90.
:::

:::mcq medium
Q: What percentage of 2023's total sales came from D?
- 25%
- [x] 30%
- 35%
- 28%
> 210/700 = 30%.
:::

:::mcq medium
Q: By what percent did total sales grow from 2022 to 2023?
- 14.29%
- [x] 16.67%
- 20%
- 15%
> 2022 total = 600, 2023 total = 700, and 100/600 = 16.67%.
:::

:::context
:::

:::mcq easy
Q: In a pie chart, a sector of 72° represents what percent of the whole?
- 25%
- [x] 20%
- 72%
- 18%
> 72/360 = 20%.
:::

:::mcq medium
Q: A company's revenue was ₹50 crore in 2019 and grows by 20% each year. What is its revenue in 2021?
- ₹70 crore
- [x] ₹72 crore
- ₹60 crore
- ₹75 crore
> 50 × 1.2 × 1.2 = 72.
:::
