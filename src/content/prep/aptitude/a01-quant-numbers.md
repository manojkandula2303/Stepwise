=== q-number-system | Number System
summary: Types of numbers, place value, factors, unit digits and trailing zeros: the base for every arithmetic question.
---
Every aptitude paper opens with number questions because they test whether you can reason about numbers instead of grinding through arithmetic.

## Types of numbers

| Type | Meaning | Examples |
|---|---|---|
| Natural | Counting numbers | 1, 2, 3, … |
| Whole | Natural numbers and 0 | 0, 1, 2, … |
| Integers | Whole numbers and their negatives | …, −2, −1, 0, 1, … |
| Rational | Can be written as p/q, q ≠ 0 | 3/4, −2, 0.333… |
| Irrational | Cannot be written as p/q | √2, π |
| Prime | Exactly two factors: 1 and itself | 2, 3, 5, 7, 11 |
| Composite | More than two factors | 4, 6, 8, 9 |

- **1 is neither prime nor composite.** 2 is the only even prime.
- There are **25 primes below 100**: 15 below 50 and 10 more between 50 and 100.
- To test whether n is prime, try dividing by primes up to √n.

## Place value and face value

In 47,382 the **face value** of 7 is 7; its **place value** is 7 × 1000 = 7000.

## Counting factors

Write the number as a product of prime powers: N = a^p × b^q × c^r.

- Number of factors = (p + 1)(q + 1)(r + 1)
- Sum of factors = (1 + a + … + a^p)(1 + b + … + b^q)(1 + c + … + c^r)

**Example.** 360 = 2³ × 3² × 5, so it has (3+1)(2+1)(1+1) = **24** factors.

## Unit digit (cyclicity)

The last digit of powers repeats in a cycle of at most 4:

| Base ends in | Cycle of unit digits | Length |
|---|---|---|
| 2 | 2, 4, 8, 6 | 4 |
| 3 | 3, 9, 7, 1 | 4 |
| 7 | 7, 9, 3, 1 | 4 |
| 8 | 8, 4, 2, 6 | 4 |
| 4 | 4, 6 | 2 |
| 9 | 9, 1 | 2 |
| 0, 1, 5, 6 | stay the same | 1 |

To find the unit digit of a^n, divide n by 4. Use the remainder as the position in the cycle (a remainder of 0 means the last position).

**Example.** Unit digit of 7^95: 95 = 4 × 23 + 3, so take the 3rd term of 7, 9, 3, 1, which is **3**.

## Trailing zeros of n!

Each zero needs a factor 10 = 2 × 5, and fives are scarcer than twos, so count the fives:

zeros = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …

**Example.** 100! has 20 + 4 = **24** trailing zeros.

## Handy sums

- 1 + 2 + … + n = n(n + 1)/2
- 1² + 2² + … + n² = n(n + 1)(2n + 1)/6
- 1³ + 2³ + … + n³ = [n(n + 1)/2]²
- Sum of the first n odd numbers = n²

:::note
Exam shortcut: when the options differ only in the last digit, compute just the unit digit. When they differ in size, estimate.
:::

:::mcq easy
Q: What is the unit digit of 7^95?
- 1
- [x] 3
- 7
- 9
> The cycle of 7 is 7, 9, 3, 1. 95 leaves remainder 3 when divided by 4, so the unit digit is the 3rd term, 3.
:::

:::mcq easy
Q: How many factors does 360 have?
- 18
- 20
- [x] 24
- 36
> 360 = 2³ × 3² × 5¹. Number of factors = (3+1)(2+1)(1+1) = 24.
:::

:::mcq easy
Q: Which of these is a prime number?
- 91
- 87
- [x] 97
- 119
> 91 = 7 × 13, 87 = 3 × 29, 119 = 7 × 17. 97 has no prime factor up to √97 ≈ 9.8, so it is prime.
:::

:::mcq easy
Q: What is the sum of the first 50 natural numbers?
- 1250
- [x] 1275
- 1300
- 2550
> n(n + 1)/2 = 50 × 51 / 2 = 1275.
:::

:::mcq medium
Q: What is the unit digit of 2^43 × 3^22?
- 4
- 6
- [x] 2
- 8
> 2^43: 43 mod 4 = 3, so the unit digit is 8. 3^22: 22 mod 4 = 2, so it is 9. 8 × 9 = 72, which ends in 2.
:::

:::mcq medium
Q: How many trailing zeros does 100! have?
- 20
- [x] 24
- 25
- 22
> ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24.
:::

:::mcq medium
Q: How many numbers from 1 to 100 are divisible by 3 or 5?
- 53
- 45
- [x] 47
- 50
> Divisible by 3: 33. By 5: 20. By both (15): 6. By inclusion–exclusion, 33 + 20 − 6 = 47.
:::

:::mcq medium
Q: What is the sum of all the factors of 36?
- 72
- [x] 91
- 84
- 90
> 36 = 2² × 3². Sum = (1 + 2 + 4)(1 + 3 + 9) = 7 × 13 = 91.
:::

:::mcq easy
Q: In 47,382, what is the difference between the place value and the face value of 7?
- 7000
- 6990
- [x] 6993
- 693
> Place value 7000 − face value 7 = 6993.
:::

:::mcq hard
Q: What is the unit digit of 1! + 2! + 3! + … + 50!?
- 0
- 1
- [x] 3
- 9
> From 5! onwards every factorial ends in 0. 1 + 2 + 6 + 24 = 33, so the unit digit is 3.
:::

=== q-divisibility | Divisibility Rules
summary: Quick tests for divisibility by 2–12 and how to use them to fill missing digits.
---
Divisibility rules let you check a number, or find a missing digit, without long division.

## The rules

| Divisor | Rule | Example |
|---|---|---|
| 2 | Last digit is even | 3,478 |
| 3 | Sum of digits divisible by 3 | 2,316 → 12 |
| 4 | Last two digits divisible by 4 | 6,5**24** |
| 5 | Last digit 0 or 5 | 7,315 |
| 6 | Divisible by both 2 and 3 | 2,316 |
| 8 | Last three digits divisible by 8 | 1,247,**312** |
| 9 | Sum of digits divisible by 9 | 23,256 → 18 |
| 10 | Last digit 0 | 4,560 |
| 11 | (Sum of digits in odd places) − (sum in even places) is 0 or a multiple of 11 | 9,152 → (9+5) − (1+2) = 11 |
| 12 | Divisible by both 3 and 4 | 2,316 |

**Divisibility by 7:** double the last digit and subtract it from the rest; repeat. For 1,617: 161 − 14 = 147 → 14 − 14 = 0, so it is divisible.

## Composite divisors

To test divisibility by a composite number, split it into **co-prime** factors and test each:
- 12 = 3 × 4 (not 2 × 6, because 2 and 6 share a factor)
- 72 = 8 × 9
- 15 = 3 × 5

## Finding a missing digit

**Example.** Find * so that 23*56 is divisible by 9.
The digit sum is 2 + 3 + 5 + 6 + * = 16 + *. The next multiple of 9 is 18, so * = **2**.

**Example.** Find k so that 8k6 is divisible by 11.
(8 + 6) − k must be 0 or 11, so k = 14 (not a digit) or k = **3**. Check: 836 = 11 × 76.

:::tip
The product of any n consecutive integers is divisible by n!. For example, the product of any 3 consecutive integers is divisible by 6.
:::

:::mcq easy
Q: Which of these numbers is divisible by 11?
- 9,153
- [x] 9,152
- 8,152
- 9,252
> For 9,152: (9 + 5) − (1 + 2) = 11, a multiple of 11. Each of the others gives a difference of 10.
:::

:::mcq easy
Q: What is the smallest digit that can replace * so that 53*4 is divisible by 3?
- [x] 0
- 1
- 2
- 3
> 5 + 3 + 4 = 12 is already divisible by 3, so * = 0 works.
:::

:::mcq easy
Q: Which number is divisible by 4?
- 7,318
- [x] 6,524
- 5,342
- 9,126
> Check the last two digits: only 24 is divisible by 4.
:::

:::mcq easy
Q: Which digit should replace * so that 23*56 is divisible by 9?
- 1
- [x] 2
- 3
- 4
> The digit sum is 16 + *, and the next multiple of 9 is 18, so * = 2.
:::

:::mcq medium
Q: Which of these numbers is divisible by 8?
- 1,247,314
- [x] 1,247,312
- 1,247,318
- 1,247,322
> Check the last three digits: 312 = 8 × 39. 314, 318 and 322 are not multiples of 8.
:::

:::mcq medium
Q: Which of these is divisible by 12?
- 2,318
- [x] 2,316
- 2,322
- 2,326
> It must pass both the 3 and the 4 test. 2,316 has digit sum 12 and ends in 16 (divisible by 4). The others fail the 4 test.
:::

:::mcq medium
Q: Which of these is divisible by 7?
- 1,618
- 1,619
- [x] 1,617
- 1,621
> 161 − 2 × 7 = 147 = 7 × 21, so 1,617 is divisible by 7 (1,617 = 7 × 231).
:::

:::mcq medium
Q: For which digit k is 8k6 divisible by 11?
- 2
- [x] 3
- 4
- 5
> (8 + 6) − k must be 0 or 11, so k = 3. 836 = 11 × 76.
:::

:::mcq easy
Q: The digits of a number add up to 27. The number is definitely divisible by:
- 2
- 5
- [x] 9
- 11
> A digit sum of 27 is a multiple of 9, so the number is divisible by 9 (and by 3).
:::

:::mcq hard
Q: What is the largest number that always divides the product of any three consecutive integers?
- 3
- [x] 6
- 12
- 24
> Among three consecutive integers one is even and one is a multiple of 3, so the product is always divisible by 6. Check 1 × 2 × 3 = 6: nothing larger always works.
:::

=== q-lcm-hcf | LCM and HCF
summary: Highest common factor and lowest common multiple, their product rule and the classic word problems.
---
The **HCF** (highest common factor, also called GCD) is the largest number that divides all the given numbers. The **LCM** (lowest common multiple) is the smallest number they all divide.

## Two ways to compute

**Prime factorisation.** HCF takes the *lowest* power of each common prime; LCM takes the *highest* power of every prime.

- 36 = 2² × 3², 84 = 2² × 3 × 7
- HCF = 2² × 3 = **12**
- LCM = 2² × 3² × 7 = **252**

**Division (Euclid).** HCF(a, b) = HCF(b, a mod b). For 624 and 480: 624 mod 480 = 144; 480 mod 144 = 48; 144 mod 48 = 0, so HCF = **48**.

## The product rule (two numbers only)

HCF × LCM = product of the two numbers.

## Fractions

- HCF of fractions = HCF of numerators ÷ LCM of denominators
- LCM of fractions = LCM of numerators ÷ HCF of denominators

## Which one does the question want?

| The question asks for… | Use |
|---|---|
| The largest size / greatest number that divides exactly | HCF |
| When things happen together again (bells, lights, runners) | LCM |
| The smallest number divisible by all | LCM |
| The largest number leaving the **same remainder** | HCF of the differences |
| The smallest number leaving remainder r with each divisor | LCM + r |

**Example.** Bells ring every 6, 8 and 12 minutes. They ring together again after LCM(6, 8, 12) = **24 minutes**.

**Example.** The largest number that divides 43, 91 and 183 leaving the same remainder: HCF(91 − 43, 183 − 91, 183 − 43) = HCF(48, 92, 140) = **4**.

:::mcq easy
Q: What is the HCF of 36 and 84?
- 6
- [x] 12
- 18
- 4
> 36 = 2²·3², 84 = 2²·3·7. Common part: 2²·3 = 12.
:::

:::mcq easy
Q: What is the LCM of 12, 18 and 30?
- 90
- 120
- [x] 180
- 360
> 12 = 2²·3, 18 = 2·3², 30 = 2·3·5. LCM = 2²·3²·5 = 180.
:::

:::mcq easy
Q: Two numbers have a product of 2160 and an HCF of 12. What is their LCM?
- 120
- [x] 180
- 216
- 240
> LCM = product ÷ HCF = 2160 ÷ 12 = 180.
:::

:::mcq easy
Q: Three bells ring every 6, 8 and 12 minutes. If they ring together now, after how many minutes will they next ring together?
- 12
- [x] 24
- 48
- 36
> LCM(6, 8, 12) = 24.
:::

:::mcq medium
Q: What is the largest number that divides 43, 91 and 183 leaving the same remainder each time?
- 2
- [x] 4
- 8
- 12
> Take the HCF of the differences: HCF(48, 92, 140) = 4.
:::

:::mcq medium
Q: What is the smallest number that leaves remainder 4 when divided by 12, 15 or 20?
- 56
- [x] 64
- 124
- 60
> LCM(12, 15, 20) = 60, and 60 + 4 = 64.
:::

:::mcq medium
Q: What is the HCF of 2/3, 4/9 and 8/15?
- 2/3
- [x] 2/45
- 8/45
- 4/45
> HCF of the numerators (2, 4, 8) is 2; LCM of the denominators (3, 9, 15) is 45. So the answer is 2/45.
:::

:::mcq medium
Q: Two numbers are in the ratio 3 : 4 and their HCF is 5. What is their LCM?
- 35
- [x] 60
- 120
- 20
> The numbers are 15 and 20, and their LCM is 60.
:::

:::mcq medium
Q: A floor is 6.24 m by 4.8 m. What is the side of the largest square tile that can pave it exactly?
- 24 cm
- 36 cm
- [x] 48 cm
- 52 cm
> HCF(624, 480) = 48, so 48 cm tiles fit exactly (13 × 10 = 130 tiles).
:::

:::mcq hard
Q: What is the smallest number that leaves remainder 3 when divided by 5, 6, 7 or 8 and is itself divisible by 9?
- 843
- [x] 1683
- 2523
- 1263
> The number has the form 840k + 3. Since 840 ≡ 3 (mod 9), we need 3k + 3 ≡ 0 (mod 9), so k = 2: 1683 = 9 × 187.
:::

=== q-remainders | Remainders
summary: Remainder arithmetic, cyclicity of remainders and the negative-remainder trick.
---
You rarely need to compute huge numbers when only the remainder is asked.

## Rules of remainder arithmetic

For a divisor d, take remainders first and combine them afterwards:

- Remainder of (a + b) = remainder of (ra + rb)
- Remainder of (a × b) = remainder of (ra × rb)
- Remainder of a^n = remainder of (ra)^n

**Example.** Remainder of 17 × 23 × 29 ÷ 6. The remainders are 5, 5, 5, and 5³ = 125 leaves **5** when divided by 6.

## Negative remainders

A remainder of r is the same as a remainder of r − d. For example, 7 ≡ −1 (mod 8). This makes powers easy:

- 7^100 ÷ 8: (−1)^100 = 1, so the remainder is **1**
- 99^99 ÷ 100: (−1)^99 = −1, which is 100 − 1 = **99**

## Remainder cycles

Powers of a number repeat their remainders. For 2^n ÷ 7 the remainders run 2, 4, 1, 2, 4, 1, … (a cycle of 3). So 2^100: 100 mod 3 = 1, giving remainder **2**.

## Shortcuts

- Dividing by 9 (or 3): the remainder equals the remainder of the digit sum.
- If N leaves remainder r when divided by d, and k divides d, then N leaves (r mod k) when divided by k.
  - Example: N ÷ 56 leaves 29, so N ÷ 8 leaves 29 mod 8 = **5**.

## Two conditions at once

To find the smallest n with n ≡ 3 (mod 5) and n ≡ 4 (mod 7), list the first sequence until one fits the second: 3, 8, 13, **18** (18 = 2×7 + 4).

:::mcq easy
Q: What is the remainder when 2^31 is divided by 5?
- 1
- 2
- [x] 3
- 4
> Remainders of 2^n mod 5 cycle 2, 4, 3, 1. 31 mod 4 = 3, so the remainder is 3.
:::

:::mcq easy
Q: A number leaves remainder 29 when divided by 56. What remainder does it leave when divided by 8?
- 3
- [x] 5
- 1
- 7
> 8 divides 56, so the remainder is 29 mod 8 = 5.
:::

:::mcq medium
Q: What is the remainder when 17 × 23 × 29 is divided by 6?
- 1
- 3
- [x] 5
- 2
> Each factor leaves 5. 5 × 5 × 5 = 125, and 125 mod 6 = 5.
:::

:::mcq easy
Q: What is the remainder when 7^100 is divided by 8?
- 0
- [x] 1
- 7
- 3
> 7 ≡ −1 (mod 8), and (−1)^100 = 1.
:::

:::mcq easy
Q: What is the remainder when 3^50 is divided by 4?
- 3
- [x] 1
- 2
- 0
> 3 ≡ −1 (mod 4), and (−1)^50 = 1.
:::

:::mcq medium
Q: What is the remainder when 1! + 2! + 3! + … + 100! is divided by 12?
- 3
- [x] 9
- 0
- 6
> 4! = 24 and every later factorial is divisible by 12. So only 1 + 2 + 6 = 9 counts.
:::

:::mcq medium
Q: What is the smallest number that leaves remainder 3 when divided by 5 and remainder 4 when divided by 7?
- 13
- [x] 18
- 23
- 33
> Numbers that leave 3 mod 5: 3, 8, 13, 18. 18 = 2 × 7 + 4.
:::

:::mcq medium
Q: What is the remainder when 2^100 is divided by 7?
- 1
- [x] 2
- 4
- 6
> 2^n mod 7 cycles 2, 4, 1. 100 mod 3 = 1, so the remainder is 2.
:::

:::mcq hard
Q: What is the remainder when 99^99 is divided by 100?
- 1
- [x] 99
- 9
- 0
> 99 ≡ −1 (mod 100), so 99^99 ≡ −1, which is 99.
:::

:::mcq easy
Q: What is the remainder when 123456 is divided by 9?
- 0
- 6
- [x] 3
- 1
> The digit sum is 21, and 21 mod 9 = 3.
:::

=== q-simplification | Simplification and Approximation
summary: BODMAS, fraction and decimal shortcuts, algebraic identities for fast arithmetic and approximation.
---
Simplification questions reward a few habits: the right order of operations, algebraic identities and sensible rounding.

## BODMAS

Work in this order: **B**rackets → **O**rders (powers, roots) → **D**ivision and **M**ultiplication (left to right) → **A**ddition and **S**ubtraction (left to right).

**Example.** 5 + 3 × (8 − 2)² ÷ 6 = 5 + 3 × 36 ÷ 6 = 5 + 18 = **23**.

:::warning
Division and multiplication have equal priority, so go left to right: 18 ÷ 3 × 2 = 6 × 2 = 12, not 18 ÷ 6 = 3.
:::

## Identities that save time

- (a + b)² = a² + 2ab + b²
- (a − b)² = a² − 2ab + b²
- a² − b² = (a + b)(a − b)
  - Example: 87² − 13² = 100 × 74 = 7400
- 999 × 999 = (1000 − 1)² = 1,000,000 − 2000 + 1 = 998,001

## Fractions and decimals

Learn these equivalents so you can swap freely:

| Fraction | Decimal | Percent |
|---|---|---|
| 1/2 | 0.5 | 50% |
| 1/4 | 0.25 | 25% |
| 1/5 | 0.2 | 20% |
| 1/8 | 0.125 | 12.5% |
| 1/3 | 0.333… | 33.33% |
| 1/6 | 0.1666… | 16.67% |

## Approximation

When the options are far apart, round each number to something friendly:

39.97% of 600 + 15.02 × 4.99 ≈ 40% of 600 + 15 × 5 = 240 + 75 = **315**.

## Continued fractions

Work from the bottom up: 1 + 1/(1 + 1/(1 + 1/2)) → 1 + 1/2 = 3/2 → 1 + 2/3 = 5/3 → 1 + 3/5 = **8/5**.

:::mcq easy
Q: What is 18 ÷ 3 × 2 + 4 − 1?
- 6
- 7
- [x] 15
- 11
> Left to right: 18 ÷ 3 = 6, then 6 × 2 = 12, then 12 + 4 − 1 = 15.
:::

:::mcq easy
Q: What is 5 + 3 × (8 − 2)² ÷ 6?
- 32
- [x] 23
- 18
- 59
> (8 − 2)² = 36, then 3 × 36 ÷ 6 = 18, and 5 + 18 = 23.
:::

:::mcq easy
Q: What is 0.25 × 0.4?
- 0.01
- [x] 0.1
- 1
- 0.001
> 25 × 4 = 100, and there are three decimal places in total: 0.100.
:::

:::mcq easy
Q: What is √784?
- 26
- [x] 28
- 24
- 32
> 28² = 784.
:::

:::mcq easy
Q: What is (1/2 + 1/3) ÷ 5/6?
- 5/6
- [x] 1
- 25/36
- 6/5
> 1/2 + 1/3 = 5/6, and 5/6 ÷ 5/6 = 1.
:::

:::mcq medium
Q: What is 999 × 999?
- 999,001
- [x] 998,001
- 998,991
- 989,001
> (1000 − 1)² = 1,000,000 − 2000 + 1 = 998,001.
:::

:::mcq medium
Q: What is 1.5 + 2.25 ÷ 0.75?
- 5
- [x] 4.5
- 3
- 1.25
> Divide first: 2.25 ÷ 0.75 = 3. Then 1.5 + 3 = 4.5.
:::

:::mcq medium
Q: Approximately, what is 39.97% of 600 + 15.02 × 4.99?
- 285
- 300
- [x] 315
- 330
> 40% of 600 = 240, and 15 × 5 = 75, giving about 315.
:::

:::mcq medium
Q: What is 87² − 13²?
- 7300
- [x] 7400
- 7500
- 7600
> a² − b² = (a + b)(a − b) = 100 × 74 = 7400.
:::

:::mcq hard
Q: What is the value of 1 + 1/(1 + 1/(1 + 1/2))?
- 5/3
- [x] 8/5
- 3/2
- 13/8
> From the inside out: 1 + 1/2 = 3/2, then 1 + 2/3 = 5/3, then 1 + 3/5 = 8/5.
:::
