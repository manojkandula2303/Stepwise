=== r-number-series | Number Series (Reasoning)
summary: Faster pattern recognition for number series: mixed operations, multiplier chains, n³ ± n and two-step rules.
---
Reasoning papers use the same series ideas as quant but lean on **mixed operations** and **two interleaved rules**. Check the patterns in this order:

1. Differences, then differences of the differences
2. Multipliers that grow (×2, ×3, ×4, …)
3. Two alternating operations (+3, −2 or ×3, ÷2)
4. Powers: n², n³, n³ − n, n² + n
5. Each term is the sum of the previous two or three

## Worked examples

- **2, 4, 12, 48, 240, ?** The multipliers are ×2, ×3, ×4, ×5, so next is ×6: **1440**.
- **0, 6, 24, 60, 120, ?** This is n³ − n: 6³ − 6 = **210**.
- **8, 24, 12, 36, 18, 54, ?** The steps alternate ×3 and ÷2: 54 ÷ 2 = **27**.

:::tip
If the numbers grow very fast, think multiplication. If they grow slowly and steadily, think differences. If they go up and down, think two interleaved series.
:::

:::mcq easy
Q: 7, 10, 8, 11, 9, 12, ?
- 13
- [x] 10
- 11
- 14
> The steps alternate +3 and −2: 12 − 2 = 10.
:::

:::mcq medium
Q: 2, 4, 12, 48, 240, ?
- 960
- [x] 1440
- 1200
- 480
> The multipliers are ×2, ×3, ×4, ×5, then ×6.
:::

:::mcq easy
Q: 1, 8, 27, 64, ?
- 100
- [x] 125
- 81
- 216
> Cubes: 5³ = 125.
:::

:::mcq medium
Q: 6, 12, 21, 33, 48, ?
- 63
- [x] 66
- 69
- 60
> The differences are 6, 9, 12, 15, so the next is 18: 48 + 18 = 66.
:::

:::mcq easy
Q: 3, 5, 9, 17, 33, ?
- 49
- [x] 65
- 66
- 64
> × 2 − 1 each time.
:::

:::mcq easy
Q: 11, 13, 17, 19, 23, ?
- 25
- [x] 29
- 27
- 31
> Consecutive primes; next after 23 is 29.
:::

:::mcq easy
Q: 2, 5, 11, 23, 47, ?
- 94
- [x] 95
- 96
- 71
> × 2 + 1 each time.
:::

:::mcq hard
Q: 0, 6, 24, 60, 120, ?
- 180
- [x] 210
- 216
- 240
> n³ − n for n = 1 to 6: 216 − 6 = 210.
:::

:::mcq medium
Q: 1, 3, 4, 7, 11, 18, ?
- 25
- [x] 29
- 27
- 31
> Each term is the sum of the previous two: 11 + 18 = 29.
:::

:::mcq medium
Q: 8, 24, 12, 36, 18, 54, ?
- 108
- [x] 27
- 72
- 36
> The steps alternate × 3 and ÷ 2.
:::

=== r-alphabet-series | Alphabet Series
summary: Letter positions, forward and reverse counting, skip patterns and letter groups.
---
Convert letters to their positions and the question becomes a number series.

## Positions to memorise

**EJOTY** gives the multiples of 5: E = 5, J = 10, O = 15, T = 20, Y = 25.
Count from the nearest one: P = 16, K = 11, W = 23.

**Reverse position** = 27 − position. A ↔ Z, B ↔ Y, M ↔ N, so 10th from the right is 27 − 10 = 17 = **Q**.

## Common patterns

| Series | Rule | Next |
|---|---|---|
| A, C, E, G | +2 | I |
| Z, X, V, T | −2 | R |
| A, B, D, G, K | +1, +2, +3, +4, +5 | P |
| AZ, BY, CX | first letter forward, second backward | DW |
| ACE, BDF, CEG | each letter +1 | DFH |

## "nth to the right of the mth" questions

Add or subtract positions. 7th to the right of the 15th letter from the left is 15 + 7 = 22, which is **V**.

:::mcq easy
Q: A, C, E, G, ?
- H
- [x] I
- J
- K
> +2 each time.
:::

:::mcq easy
Q: Z, X, V, T, ?
- S
- [x] R
- Q
- P
> −2 each time.
:::

:::mcq easy
Q: B, E, H, K, ?
- M
- [x] N
- O
- L
> +3 each time: K (11) + 3 = N (14).
:::

:::mcq easy
Q: AZ, BY, CX, ?
- DV
- [x] DW
- EW
- DX
> The first letter moves forward and the second moves backward.
:::

:::mcq medium
Q: A, B, D, G, K, ?
- O
- [x] P
- Q
- N
> Gaps of +1, +2, +3, +4, +5: K (11) + 5 = P (16).
:::

:::mcq easy
Q: Which letter is 7th to the right of the 15th letter from the left of the alphabet?
- U
- [x] V
- W
- H
> 15 + 7 = 22, which is V.
:::

:::mcq easy
Q: ACE, BDF, CEG, ?
- DEF
- [x] DFH
- EGI
- DGH
> Each letter moves forward by 1.
:::

:::mcq medium
Q: If the alphabet is written backwards, which letter is 10th from the left?
- J
- [x] Q
- P
- R
> The 10th letter of the reversed alphabet is position 27 − 10 = 17, which is Q.
:::

:::mcq easy
Q: D, G, J, M, P, ?
- R
- [x] S
- T
- Q
> +3 each time.
:::

:::mcq hard
Q: B, C, E, H, L, Q, ?
- V
- [x] W
- X
- U
> Gaps grow by 1 (+1, +2, +3, +4, +5, +6): Q (17) + 6 = W (23).
:::

=== r-alphanumeric-series | Alphanumeric Series
summary: Mixed letter and number series, and position questions on letter–number–symbol strings.
---
There are two question styles:

**1. Paired series.** Each term pairs a letter with a number, and each half follows its own rule.
- A2, C6, E10, ? The letters skip one (A, C, E, G) and the number is twice the letter's position: **G14**.
- K1, M4, P9, T16, ? The letter gaps grow (+2, +3, +4, +5) and the numbers are squares: **Y25**.

**2. Arrangement strings.** You get a long row of letters, numbers and symbols, and questions ask about positions and neighbours.

## Working with an arrangement

- Number the positions from the left once, on paper.
- "kth from the right" = position (total − k + 1) from the left.
- "Immediately preceded by" means the element just to its **left**; "immediately followed by" means just to its **right**.
- Count carefully; these questions are about accuracy, not cleverness.

:::mcq easy
Q: A1, B2, C3, ?
- E5
- [x] D4
- D5
- C4
> The letter and its position both advance by 1.
:::

:::mcq easy
Q: 2B, 4D, 6F, ?
- 7G
- [x] 8H
- 8G
- 10H
> The numbers go up by 2, and the letter's position equals the number.
:::

:::mcq easy
Q: Z26, Y25, X24, ?
- V22
- [x] W23
- W22
- U21
> Moving backwards, with each letter paired with its position.
:::

:::mcq medium
Q: A2, C6, E10, ?
- F12
- [x] G14
- G12
- H16
> Every other letter, with the number equal to twice the letter's position.
:::

:::context
Study this arrangement (left to right):

**B 4 # K @ 7 T 9 $ M % 2 D 6 & J * 3**
:::

:::mcq medium
Q: How many symbols are immediately preceded by a number?
- 2
- [x] 3
- 4
- 6
> # (after 4), $ (after 9) and & (after 6). @, % and * come after letters.
:::

:::mcq easy
Q: Which element is 5th to the right of the 10th element from the left?
- J
- [x] &
- 6
- *
> The 10th element is M; five places to its right is position 15, which is &.
:::

:::mcq medium
Q: How many numbers are immediately followed by a letter?
- 1
- [x] 2
- 3
- 4
> 7 is followed by T, and 2 is followed by D. No other number is followed by a letter.
:::

:::mcq medium
Q: Which element is 7th from the right end?
- %
- [x] 2
- D
- M
> There are 18 elements, so 7th from the right is 18 − 7 + 1 = 12th from the left, which is 2.
:::

:::context
:::

:::mcq easy
Q: 1Z, 3X, 5V, ?
- 7U
- [x] 7T
- 6T
- 8S
> The numbers go up by 2 and the letters go back by 2.
:::

:::mcq hard
Q: K1, M4, P9, T16, ?
- X25
- [x] Y25
- Z25
- Y36
> The letter gaps are +2, +3, +4, +5 (T + 5 = Y), and the numbers are squares.
:::

=== r-coding-decoding | Coding and Decoding
summary: Letter shifts, opposite-letter codes, substitution codes, position-sum codes and word-to-word codes.
---
Every coding question hides one rule. Compare the original and its code letter by letter and the rule appears.

## Common code types

| Type | Example | Rule |
|---|---|---|
| Fixed shift | CAT → DBU | each letter +1 |
| Increasing shift | FRIEND → HUMJTK | +2, +3, +4, +5, … |
| Opposite letter | GOOD → TLLW | each letter → 27 − position |
| Reverse | MONDAY → YADNOM | the word written backwards |
| Letter → digit | ROSE → 6821 | look up each letter in the given words |
| Position sum | APPLE → 50 | add the letter positions |
| Sentence codes | "sky is blue" → "ta na ka" | find words common to two sentences |
| Substitution | "pen" is called "pencil" | answer with the **code word** |

## Sentence codes

Compare two sentences. The code shared by both belongs to the shared word.
"sky is blue" = "ta na ka" and "blue is sea" = "na ka pa": "is" and "blue" share "na" and "ka", so **sky = ta**.

## Substitution trap

If "pen" is called "pencil", then the answer to "What do you write with?" is the code name: **pencil**.

:::mcq easy
Q: If CAT is coded as DBU, how is DOG coded?
- EPI
- [x] EPH
- FPH
- DPH
> Each letter moves forward by 1.
:::

:::mcq medium
Q: If ROSE = 6821, CHAIR = 73456 and PREACH = 961473, what is SEARCH?
- 214763
- [x] 214673
- 216473
- 241673
> Each letter keeps one digit: S2, E1, A4, R6, C7, H3.
:::

:::mcq easy
Q: If BAD = 214 (each letter replaced by its position), what is CAB?
- 321
- [x] 312
- 213
- 123
> C = 3, A = 1, B = 2.
:::

:::mcq easy
Q: In a code, "sky is blue" = "ta na ka" and "blue is sea" = "na ka pa". What is the code for "sky"?
- na
- [x] ta
- ka
- pa
> "is" and "blue" take "na" and "ka", which leaves "ta" for "sky".
:::

:::mcq easy
Q: If MONDAY is written as YADNOM, how is TUESDAY written?
- YADSUET
- [x] YADSEUT
- YADSETU
- TADSEUY
> The word is reversed.
:::

:::mcq medium
Q: If APPLE = 50 (sum of letter positions), what is GRAPE?
- 45
- [x] 47
- 49
- 52
> 7 + 18 + 1 + 16 + 5 = 47.
:::

:::mcq medium
Q: In a code language, "pen" is called "pencil", "pencil" is called "book" and "book" is called "bag". What do you write with?
- pen
- [x] pencil
- book
- bag
> You write with a pen, which in this language is called "pencil".
:::

:::mcq medium
Q: Using opposite letters (A ↔ Z, B ↔ Y, …), how is GOOD coded?
- TLLV
- [x] TLLW
- SLLW
- TMMW
> G → T, O → L, D → W.
:::

:::mcq hard
Q: If FRIEND is coded as HUMJTK, how is CANDLE coded?
- EDRIRK
- [x] EDRIRL
- DCQHQK
- EDQIRL
> The shifts are +2, +3, +4, +5, +6, +7: C→E, A→D, N→R, D→I, L→R, E→L.
:::

:::mcq medium
Q: If TEACHER is coded as VGCEJGT, how is STUDENT coded?
- UVWEGPV
- [x] UVWFGPV
- TUVFGPV
- UVWFHPV
> Each letter moves forward by 2.
:::

=== r-analogy | Analogy
summary: Word, number and letter analogies: find the relationship in the first pair and apply it to the second.
---
**A : B :: C : ?** means "A is to B as C is to ?". State the A–B relationship as a sentence, then apply the same sentence to C.

## Common relationship types

| Type | Example |
|---|---|
| Worker : workplace | Doctor : Hospital |
| Tool : function | Knife : Cut |
| Creator : creation | Author : Book |
| Animal : young | Cow : Calf |
| Animal : action | Bird : Fly |
| Part : whole | Petal : Flower |
| Thing : surroundings | Oasis : Desert |
| Number rule | 3 : 27 (cube), 5 : 26 (n² + 1) |
| Letter shift | ACE : BDF (+1 each) |

:::tip
Make the sentence specific. "A doctor works in a hospital" rules out answers that are merely related, such as "Teacher : Student".
:::

:::mcq easy
Q: Doctor : Hospital :: Teacher : ?
- Student
- [x] School
- Book
- Class
> A doctor works in a hospital; a teacher works in a school.
:::

:::mcq easy
Q: 3 : 27 :: 4 : ?
- 16
- [x] 64
- 81
- 12
> 3³ = 27, so 4³ = 64.
:::

:::mcq easy
Q: Bird : Fly :: Fish : ?
- Water
- [x] Swim
- Fin
- Gill
> The characteristic action of each animal.
:::

:::mcq easy
Q: ACE : BDF :: GIK : ?
- HIJ
- [x] HJL
- IJK
- HKM
> Each letter moves forward by 1.
:::

:::mcq easy
Q: Pen : Write :: Knife : ?
- Sharp
- [x] Cut
- Kitchen
- Steel
> Tool : function.
:::

:::mcq easy
Q: 16 : 4 :: 81 : ?
- 8
- [x] 9
- 27
- 3
> Square root.
:::

:::mcq easy
Q: Cow : Calf :: Dog : ?
- Kitten
- [x] Puppy
- Cub
- Foal
> Animal : its young.
:::

:::mcq medium
Q: Book : Author :: Painting : ?
- Canvas
- [x] Painter
- Gallery
- Brush
> Creation : creator.
:::

:::mcq medium
Q: 5 : 26 :: 7 : ?
- 49
- [x] 50
- 48
- 56
> n² + 1: 7² + 1 = 50.
:::

:::mcq hard
Q: Oasis : Desert :: Island : ?
- Land
- [x] Sea
- Beach
- Mountain
> An oasis is a small area surrounded by desert; an island is a small area surrounded by sea.
:::

=== r-classification | Classification (Odd One Out)
summary: Find the item that doesn't share the group's property: words, numbers and letter groups.
---
Three or four items share a property and one doesn't. Find the **most specific** property that all but one share.

## Checklist

- **Words:** category (fruit/vegetable, metal/alloy, planet/satellite), function, habitat, gender.
- **Numbers:** prime, even/odd, square, cube, divisibility, digit sum.
- **Letters:** consecutive letters, vowel positions, equal gaps.
- **Shapes:** number of sides, quadrilateral or not, symmetry.

:::warning
More than one property can split the group. Choose the one that leaves exactly **one** item out and that is the clearest. In 13, 17, 23, 27, 31 the odd one is 27, the only composite number.
:::

:::mcq easy
Q: Find the odd one out: Apple, Mango, Carrot, Banana
- Apple
- Mango
- [x] Carrot
- Banana
> Carrot is a vegetable; the others are fruits.
:::

:::mcq easy
Q: Find the odd one out: 3, 5, 7, 9, 11
- 3
- 7
- [x] 9
- 11
> 9 is the only non-prime.
:::

:::mcq easy
Q: Find the odd one out: Mercury, Venus, Moon, Mars
- Mercury
- Venus
- [x] Moon
- Mars
> The Moon is a satellite; the others are planets.
:::

:::mcq easy
Q: Find the odd one out: 8, 27, 64, 100, 125
- 8
- 64
- [x] 100
- 125
> 100 is a perfect square, not a perfect cube.
:::

:::mcq easy
Q: Find the odd one out: Rose, Lily, Lotus, Neem
- Rose
- Lily
- Lotus
- [x] Neem
> Neem is a tree; the others are flowers.
:::

:::mcq medium
Q: Find the odd one out: BCD, FGH, JKL, MOP
- BCD
- FGH
- JKL
- [x] MOP
> The others are three consecutive letters; MOP skips N.
:::

:::mcq easy
Q: Find the odd one out: Square, Rectangle, Triangle, Rhombus
- Square
- Rectangle
- [x] Triangle
- Rhombus
> The triangle is the only shape that is not a quadrilateral.
:::

:::mcq easy
Q: Find the odd one out: 121, 144, 169, 196, 210
- 121
- 169
- 196
- [x] 210
> The others are perfect squares (11², 12², 13², 14²).
:::

:::mcq medium
Q: Find the odd one out: Copper, Iron, Bronze, Silver
- Copper
- Iron
- [x] Bronze
- Silver
> Bronze is an alloy; the others are pure metals.
:::

:::mcq medium
Q: Find the odd one out: 13, 17, 23, 27, 31
- 13
- 23
- [x] 27
- 31
> 27 = 3³ is composite; the rest are prime.
:::
