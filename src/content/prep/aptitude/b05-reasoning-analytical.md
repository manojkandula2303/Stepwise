=== r-inequalities | Inequalities
summary: Chaining direct and coded inequalities, deciding what is definitely true, and either–or cases.
---
## Chaining rule

You can link two terms only through a chain where every sign points the **same way** (or is =).

| Chain | Result |
|---|---|
| A > B ≥ C | A > C |
| A ≥ B ≥ C | A ≥ C |
| A > B = C | A > C |
| A > B < C | **no relation** between A and C |
| A ≥ B ≤ C | **no relation** |

If any sign in the chain is strict (> or <), the result is strict.

## Either–or

If the statements give A ≥ C, and the conclusions are I: A > C and II: A = C, neither is definite on its own, but together they cover every case. The answer is **either I or II**.

## Coded inequalities

Questions may replace signs with symbols, for example P @ Q for P > Q. **Decode first**, then chain.

:::mcq easy
Q: Statement: A > B ≥ C = D. Conclusion: A > D.
- [x] True
- False
- Cannot be determined
- True only if B = C
> A > B ≥ C = D gives A > D.
:::

:::mcq easy
Q: Statements: P ≥ Q > R and S < R. Conclusion: P > S.
- [x] True
- False
- Cannot be determined
- True only if P = Q
> P ≥ Q > R > S.
:::

:::mcq medium
Q: Statements: X ≤ Y < Z and W ≥ Z. Conclusion: X < W.
- [x] True
- False
- Cannot be determined
- X = W
> X ≤ Y < Z ≤ W, and the chain contains a strict sign.
:::

:::mcq easy
Q: Statements: A ≥ B and B ≤ C. What is the relation between A and C?
- A ≥ C
- A ≤ C
- [x] Cannot be determined
- A = C
> The signs point in opposite directions.
:::

:::mcq medium
Q: P @ Q means P > Q, P # Q means P < Q, and P $ Q means P = Q. Statements: A @ B, B $ C, C # D. Conclusions: I. A @ C. II. D @ B.
- Only I is true
- Only II is true
- [x] Both are true
- Neither is true
> A > B = C, so A > C. D > C = B, so D > B.
:::

:::mcq medium
Q: Statements: M ≥ N ≥ O. Conclusions: I. M > O. II. M = O.
- Only I follows
- Only II follows
- [x] Either I or II follows
- Neither follows
> M ≥ O, so exactly one of > and = must hold.
:::

:::mcq easy
Q: Statement: J > K ≥ L < M. What is the relation between J and M?
- J > M
- J < M
- [x] Cannot be determined
- J = M
> L < M reverses the direction of the chain.
:::

:::mcq medium
Q: Statement: E ≥ F > G = H < I. Conclusions: I. E > H. II. I > F.
- Both are true
- [x] Only I is true
- Only II is true
- Neither is true
> E ≥ F > G = H gives E > H. I and F are linked only through H < I, which runs the other way.
:::

:::mcq medium
Q: Statement: R < S ≤ T = U. Which of these is definitely true?
- S = U
- T > S
- [x] U > R
- R ≥ T
> R < S ≤ T = U gives U > R.
:::

:::mcq hard
Q: Statement: A ≥ B > C ≤ D < E ≤ F. Conclusions: I. A > C. II. F > C.
- Only I is true
- Only II is true
- [x] Both are true
- Neither is true
> A ≥ B > C gives A > C. F ≥ E > D ≥ C gives F > C.
:::

=== r-input-output | Input–Output (Machine Input)
summary: Spotting the step-by-step rearrangement rule of a machine and predicting other steps.
---
A "machine" turns an input line into a final arrangement one step at a time. Your job is to spot the rule and apply it.

## Common rules

- At each step, the **largest (or smallest)** remaining number moves to the left (or right) end of the unarranged part.
- Words are arranged **alphabetically** (or by length), one per step.
- Numbers and words alternate, each with its own rule.
- Arithmetic: every element is transformed (squared, +1, …) at each step.

## How to crack it

1. Compare the input with **Step 1**. What moved, and where to?
2. Confirm the guess with Step 2.
3. The arranged part grows from one end; everything else keeps its **relative order**.
4. The number of steps is usually (number of elements − 1) or fewer, if some elements are already in place.

:::context
**Machine 1.** At each step, the largest number not yet arranged moves to the right of the numbers already arranged at the left end. All other numbers keep their order.

Input: **27 13 48 31 92 65**

Step 1: **92 27 13 48 31 65**
:::

:::mcq medium
Q: What is Step 2?
- 92 65 48 27 13 31
- [x] 92 65 27 13 48 31
- 92 27 65 13 48 31
- 92 65 27 48 13 31
> 65 moves next to 92, and 27, 13, 48 and 31 keep their order.
:::

:::mcq medium
Q: How many steps does it take to complete the arrangement?
- 3
- [x] 4
- 5
- 6
> Step 3: 92 65 48 27 13 31. Step 4: 92 65 48 31 27 13 (done).
:::

:::mcq medium
Q: In Step 3, which number is 4th from the left?
- 31
- [x] 27
- 13
- 48
> Step 3 is 92 65 48 27 13 31.
:::

:::mcq medium
Q: Which step reads "92 65 48 27 13 31"?
- Step 2
- [x] Step 3
- Step 4
- It never appears
> Step 2 is 92 65 27 13 48 31. Moving 48 gives Step 3.
:::

:::context
**Machine 2.** At each step, the next word in alphabetical order moves to the right of the words already arranged at the left end.

Input: **sun cat apple dog bat**
:::

:::mcq medium
Q: What is Step 2?
- apple cat sun dog bat
- [x] apple bat sun cat dog
- apple bat cat sun dog
- bat apple sun cat dog
> Step 1: apple sun cat dog bat. Step 2: apple bat sun cat dog.
:::

:::mcq medium
Q: Which word is last in Step 3?
- sun
- [x] dog
- cat
- bat
> Step 3 is apple bat cat sun dog.
:::

:::context
:::

:::mcq easy
Q: At each step a machine doubles a number and subtracts 1. The input is 5. What is the output after 2 steps?
- 18
- [x] 17
- 19
- 9
> 5 → 9 → 17.
:::

:::mcq easy
Q: A machine replaces each number with its square minus 1. The input is 8 3 5. What is the output?
- 64 9 25
- [x] 63 8 24
- 65 10 26
- 63 9 24
> 8² − 1 = 63, 3² − 1 = 8, 5² − 1 = 24.
:::

:::mcq easy
Q: A machine adds each element's position number (1, 2, 3, …) to it. The input is 10 20 30. What is the output?
- 11 21 31
- [x] 11 22 33
- 12 22 32
- 13 23 33
> 10 + 1, 20 + 2, 30 + 3.
:::

:::mcq hard
Q: Using Machine 1's rule (largest remaining number moves left), Step 3 of some input is "92 65 48 13 27 31". Which of these could the input have been?
- 27 13 48 31 92 65
- [x] 13 27 31 48 65 92
- 31 27 13 48 65 92
- 92 65 48 31 27 13
> From 13 27 31 48 65 92: Step 1 is 92 13 27 31 48 65, Step 2 is 92 65 13 27 31 48, and Step 3 is 92 65 48 13 27 31.
:::

=== r-data-sufficiency | Data Sufficiency (Reasoning)
summary: Deciding whether each statement, both together, or neither gives enough information to answer.
---
You don't need to answer the question, only decide **whether the data is enough**.

## Standard options

- **A:** Statement I alone is sufficient; II alone is not.
- **B:** Statement II alone is sufficient; I alone is not.
- **C:** Either statement alone is sufficient.
- **D:** Both statements together are needed.
- **E:** Even both together are not sufficient.

## Method

1. Test **I alone**. Does it give a single, definite answer?
2. Test **II alone**.
3. Only if neither works alone, test them **together**.

:::warning
"Sufficient" means a **unique** answer. x² = 16 gives x = ±4, which is not sufficient if the question asks for the value of x.
:::

:::mcq medium
Q: What is A's age? I. A is twice as old as B. II. B is 15.
- I alone
- II alone
- Either alone
- [x] Both together
> You need both to get 30.
:::

:::mcq easy
Q: Is x even? I. x is divisible by 4. II. x is divisible by 3.
- [x] I alone
- II alone
- Either alone
- Both together
> Any multiple of 4 is even. A multiple of 3 could be odd or even.
:::

:::mcq medium
Q: How is P related to Q? I. P is the only son of Q's father. II. Q is P's sister.
- [x] I alone
- II alone
- Either alone
- Both together
> I makes P Q's brother. II leaves P's gender open, so P could be Q's brother or sister.
:::

:::mcq medium
Q: On which day is Ravi's birthday? I. It is after Tuesday but before Friday. II. It is on Thursday or Friday.
- I alone
- II alone
- Either alone
- [x] Both together
> I gives Wednesday or Thursday, and II gives Thursday or Friday. Together: Thursday.
:::

:::mcq medium
Q: What is the value of x? I. 2x + 3 = 11. II. x² = 16.
- [x] I alone
- II alone
- Either alone
- Both together
> I gives x = 4. II gives ±4, which isn't unique.
:::

:::mcq medium
Q: In which direction is the school from the house? I. The school is 2 km east of the park. II. The park is 2 km north of the house.
- I alone
- II alone
- Either alone
- [x] Both together
> Together they put the school north-east of the house.
:::

:::mcq medium
Q: What is Ram's salary? I. Ram earns more than Shyam. II. Shyam earns ₹40,000.
- I alone
- II alone
- Both together
- [x] Not sufficient even together
> You only learn that Ram earns more than ₹40,000.
:::

:::mcq medium
Q: What is the code for "sky"? I. "sky is blue" is coded "ta na ka". II. "blue is the sea" is coded "na ka po ri".
- I alone
- II alone
- Either alone
- [x] Both together
> The common words "is" and "blue" use "na" and "ka", so "sky" = "ta".
:::

:::mcq hard
Q: Is n prime? I. n is between 20 and 30. II. n is odd and not divisible by 3 or 5.
- I alone
- II alone
- Either alone
- [x] Both together
> Together only 23 and 29 qualify, and both are prime. Alone, each allows composite numbers (e.g. 21 for I, 49 for II).
:::

:::mcq medium
Q: How many students are in the class? I. Riya is 10th from the top and 21st from the bottom. II. There are 15 boys and 15 girls.
- I alone
- II alone
- [x] Either alone
- Both together
> Each statement on its own gives 30.
:::

=== r-logical-deduction | Logical Deduction
summary: If–then reasoning, contrapositives, common fallacies and truth-teller puzzles.
---
## Conditionals: "If P then Q"

| Form | Valid? |
|---|---|
| P is true → Q is true | ✔ (modus ponens) |
| Q is false → P is false | ✔ (contrapositive) |
| Q is true → P is true | ✘ affirming the consequent |
| P is false → Q is false | ✘ denying the antecedent |

**The contrapositive of "If P then Q" is "If not Q then not P"**, and the two are logically equivalent.

## Translating everyday words

- "Only members can enter" → If someone entered, they are a member.
- "Unless you register, you cannot attend" → If you attended, you registered.
- "Every student who passed studied hard" → If someone didn't study hard, they didn't pass.

## Truth-teller puzzles

Assume one person is telling the truth and follow the consequences. If they lead to a contradiction, the assumption is wrong. Try each case.

**Knights and knaves:** A says "We are both knaves." A knight can't say that (it would be a lie), so A is a knave. The statement is then false, which means B is a **knight**.

:::mcq easy
Q: All managers are graduates, and Ravi is a manager. What follows?
- [x] Ravi is a graduate
- All graduates are managers
- Ravi is not a graduate
- Nothing follows
> This is a direct application of the rule.
:::

:::mcq easy
Q: "If it rains, the match is cancelled." The match was not cancelled. What follows?
- It rained
- [x] It did not rain
- Cannot be determined
- The match was postponed
> The contrapositive: not cancelled → no rain.
:::

:::mcq medium
Q: "If it rains, the match is cancelled." The match was cancelled. What follows?
- It rained
- It did not rain
- [x] Cannot be determined
- It will rain tomorrow
> The match could have been cancelled for some other reason (affirming the consequent).
:::

:::mcq easy
Q: What is the contrapositive of "If P, then Q"?
- If Q, then P
- If not P, then not Q
- [x] If not Q, then not P
- P only if not Q
> The contrapositive negates and swaps both parts.
:::

:::mcq easy
Q: "Only members can enter the club." Raj entered the club. What follows?
- [x] Raj is a member
- Raj is not a member
- All members entered
- Cannot be determined
> Only members can enter, so anyone who entered is a member.
:::

:::mcq medium
Q: "Every student who passed studied hard." Meera did not study hard. What follows?
- Meera passed
- [x] Meera did not pass
- Cannot be determined
- Meera failed only the hard subjects
> The contrapositive of "passed → studied hard".
:::

:::mcq hard
Q: A says, "B is lying." B says, "C is lying." C says, "A and B are both lying." Who is telling the truth?
- Only A
- [x] Only B
- Only C
- A and C
> If C were truthful, A would be lying, which makes B truthful and contradicts C. So C lies, and B ("C is lying") tells the truth. Then A's claim is false.
:::

:::mcq medium
Q: "No red ball is large." Some balls in the box are large. What follows?
- Some balls in the box are red
- [x] Some balls in the box are not red
- All balls in the box are large
- No ball in the box is red
> The large balls can't be red.
:::

:::mcq easy
Q: "Unless you register, you cannot attend." Asha attended. What follows?
- [x] Asha registered
- Asha did not register
- Cannot be determined
- Registration was optional
> Attending requires registering.
:::

:::mcq hard
Q: Knights always tell the truth and knaves always lie. A says, "We are both knaves." What are A and B?
- Both knights
- Both knaves
- [x] A is a knave, B is a knight
- A is a knight, B is a knave
> A can't be a knight (that would make the statement false). So A is a knave, the statement is false, and B is a knight.
:::

=== r-venn-diagrams | Venn Diagrams
summary: Choosing the right diagram for a set of classes and counting with two- and three-set overlaps.
---
## Choosing a diagram

| Relationship | Picture | Example |
|---|---|---|
| One class inside another | Nested circles | Delhi ⊂ India ⊂ Asia |
| Two classes inside a third, separate from each other | Two separate circles inside a big one | Mango and Apple inside Fruits |
| Partial overlap | Overlapping circles | Teachers and Women |
| No relation | Separate circles | Pens and Rivers |

Typical combination: **Doctors, Men, Women**. Men and Women are separate circles, and Doctors overlaps both.

## Counting with two sets

**n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**

- Only A = n(A) − n(A ∩ B)
- Neither = total − n(A ∪ B)

## Counting with three sets

n(A ∪ B ∪ C) = A + B + C − (A∩B + B∩C + C∩A) + A∩B∩C

Only A = A − A∩B − A∩C + A∩B∩C

:::mcq easy
Q: Which diagram best shows Doctors, Men and Women?
- Three separate circles
- [x] Doctors overlapping both Men and Women, with Men and Women separate
- Three circles all overlapping each other
- Men inside Doctors
> Some doctors are men and some are women, but no one is both a man and a woman here.
:::

:::mcq easy
Q: Which diagram best shows Fruits, Mango and Apple?
- [x] Mango and Apple as separate circles inside Fruits
- Three separate circles
- Mango inside Apple, inside Fruits
- Three overlapping circles
> Both are fruits, and they don't overlap.
:::

:::mcq easy
Q: In a class of 50, 30 like tea, 25 like coffee and 10 like both. How many like neither?
- 0
- [x] 5
- 10
- 15
> 30 + 25 − 10 = 45 like at least one, so 5 like neither.
:::

:::mcq easy
Q: Which diagram best shows Animals, Dogs and Pets?
- Three separate circles
- [x] Dogs and Pets overlapping, both inside Animals
- Pets inside Dogs
- Dogs inside Pets, separate from Animals
> Some dogs are pets and some pets aren't dogs, and all are animals.
:::

:::mcq easy
Q: Of 100 people, 60 read Hindi, 50 read English and 20 read both. How many read only Hindi?
- 60
- [x] 40
- 30
- 20
> 60 − 20 = 40.
:::

:::mcq medium
Q: 40 play cricket, 30 football and 20 hockey. 10 play cricket and football, 8 football and hockey, 5 cricket and hockey, and 3 play all three. How many play at least one?
- 90
- [x] 70
- 73
- 67
> 90 − 23 + 3 = 70.
:::

:::mcq medium
Q: Using the same data, how many play only cricket?
- 25
- [x] 28
- 30
- 22
> 40 − 10 − 5 + 3 = 28.
:::

:::mcq medium
Q: Which diagram best shows Teacher, Female and Mother?
- Three separate circles
- [x] Mother inside Female, with Teacher overlapping both
- Teacher inside Mother
- Female inside Mother
> Every mother is female, and a teacher may or may not be female or a mother.
:::

:::mcq easy
Q: Which diagram best shows India, Delhi and Asia?
- [x] Three nested circles: Delhi inside India inside Asia
- Three overlapping circles
- India and Delhi separate inside Asia
- Three separate circles
> Each is entirely contained in the next.
:::

:::mcq hard
Q: In a survey of 200 people, 120 own a phone, 90 own a laptop and 30 own neither. How many own both?
- 30
- [x] 40
- 50
- 10
> 170 own at least one, and 120 + 90 − both = 170, so both = 40.
:::

=== r-mathematical-operations | Mathematical Operations
summary: Substituted operator symbols, interchanged signs and custom operations, all evaluated with BODMAS.
---
## Symbol substitution

Rewrite the expression with the **real** operators first, then apply BODMAS.

**Example.** + means ×, × means −, − means ÷ and ÷ means +.
8 + 2 × 6 − 3 ÷ 4 becomes 8 × 2 − 6 ÷ 3 + 4 = 16 − 2 + 4 = **18**.

:::warning
Never evaluate before substituting. And after substituting, BODMAS still applies: multiplication and division come before addition and subtraction.
:::

## Interchanging signs

When asked which interchange makes an equation correct, test each option by swapping **every** occurrence of the two signs.

## Custom operations

When a ★ b is defined by a formula, substitute the values. When it's defined only by examples (2 @ 3 = 13, 3 @ 4 = 25), look for the simplest rule that fits all of them, here a² + b².

:::mcq medium
Q: If + means ×, × means −, − means ÷ and ÷ means +, what is 8 + 2 × 6 − 3 ÷ 4?
- 14
- [x] 18
- 20
- 10
> 8 × 2 − 6 ÷ 3 + 4 = 16 − 2 + 4 = 18.
:::

:::mcq medium
Q: P means +, Q means −, R means × and S means ÷. What is 12 R 3 Q 20 S 4 P 6?
- 31
- [x] 37
- 43
- 25
> 12 × 3 − 20 ÷ 4 + 6 = 36 − 5 + 6 = 37.
:::

:::mcq easy
Q: If + and × are interchanged, what is 5 × 3 + 2?
- 17
- [x] 11
- 21
- 25
> It becomes 5 + 3 × 2 = 11.
:::

:::mcq easy
Q: If a ★ b = a² − b, what is 4 ★ 3?
- 7
- [x] 13
- 19
- 1
> 16 − 3 = 13.
:::

:::mcq easy
Q: If a # b = a + b + ab, what is 2 # 3?
- 6
- [x] 11
- 10
- 12
> 2 + 3 + 6 = 11.
:::

:::mcq medium
Q: Which interchange of signs makes "6 × 4 + 2 − 8 = 6" correct?
- [x] × and +
- + and −
- × and −
- No interchange works
> 6 + 4 × 2 − 8 = 6 + 8 − 8 = 6.
:::

:::mcq medium
Q: If 2 @ 3 = 13 and 3 @ 4 = 25, what is 4 @ 5?
- 40
- [x] 41
- 45
- 36
> a² + b²: 16 + 25 = 41.
:::

:::mcq medium
Q: If 5 $ 3 = 16 and 7 $ 2 = 45, what is 6 $ 4?
- 24
- [x] 20
- 52
- 10
> a² − b²: 36 − 16 = 20.
:::

:::mcq hard
Q: If × means +, + means ÷, − means × and ÷ means −, what is 15 + 3 × 4 − 2 ÷ 6?
- 9
- [x] 7
- 5
- 11
> 15 ÷ 3 + 4 × 2 − 6 = 5 + 8 − 6 = 7.
:::

:::mcq hard
Q: If a ⊕ b = (a + b)² − ab, what is (1 ⊕ 2) ⊕ 1?
- 49
- [x] 57
- 63
- 64
> 1 ⊕ 2 = 9 − 2 = 7, then 7 ⊕ 1 = 64 − 7 = 57.
:::
