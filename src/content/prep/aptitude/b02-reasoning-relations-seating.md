=== r-blood-relations | Blood Relations
summary: Family-tree reasoning: pointing statements, coded relations and multi-person family puzzles.
---
Always **draw the family tree**. Use a standard notation and the questions become mechanical.

## Notation

- **+** for male and **−** for female (or squares and circles)
- A horizontal line = married couple
- A vertical line = parent → child
- A dotted horizontal line = siblings

## Relations to know

| Relation | Who |
|---|---|
| Paternal uncle | Father's brother |
| Maternal uncle | Mother's brother |
| Nephew / niece | Brother's or sister's son / daughter |
| Brother-in-law | Spouse's brother, or sister's husband |
| Cousin | Uncle's or aunt's child |
| Grandson | Son's or daughter's son |

## Pointing statements: work from the end

"Her mother is the only daughter of my mother."
- My mother's only daughter = **my sister**.
- So her mother is my sister, and I am her **maternal uncle**.

## Gender traps

"Q is the sister of R" says nothing about R's gender. If a question then asks how R is related to P (Q's father), the answer is **child**, not son.

## Coded relations

Replace each symbol by its meaning and read left to right. With A × B = "A is the father of B" and A − B = "A is the brother of B", P × Q − R means P is Q's father and Q is R's brother, so **P is R's father**.

:::mcq easy
Q: A is B's brother, and B is C's mother. How is A related to C?
- Father
- [x] Maternal uncle
- Paternal uncle
- Brother
> A is the brother of C's mother.
:::

:::mcq medium
Q: Pointing to a woman in a photo, a man says, "Her mother is the only daughter of my mother." How is the man related to the woman?
- Father
- Brother
- [x] Maternal uncle
- Grandfather
> His mother's only daughter is his sister, who is the woman's mother.
:::

:::mcq medium
Q: P is the father of Q, and Q is the sister of R. How is R related to P?
- Son
- Daughter
- [x] Child (gender not known)
- Nephew
> R's gender is never stated.
:::

:::mcq hard
Q: Introducing a boy, a girl says, "He is the son of the daughter of the father of my uncle." How is the boy related to the girl?
- Brother
- Cousin
- [x] Brother or cousin
- Nephew
> The father of her uncle is her grandfather. His daughter is her mother or her aunt, so the boy is her brother or her cousin.
:::

:::mcq medium
Q: A × B means A is the father of B, and A − B means A is the brother of B. What does P × Q − R tell you?
- P is R's uncle
- [x] P is R's father
- P is R's brother
- P is R's grandfather
> P is Q's father and Q is R's brother, so P is R's father too.
:::

:::mcq medium
Q: Rita's mother's only son's wife is Meena. How is Meena related to Rita?
- Sister
- [x] Sister-in-law
- Cousin
- Aunt
> Rita's mother's only son is Rita's brother, and his wife is Rita's sister-in-law.
:::

:::mcq easy
Q: Pointing to a man, Neha says, "He is the only son of my grandfather's only son." How is the man related to Neha?
- Father
- [x] Brother
- Cousin
- Uncle
> Her grandfather's only son is her father, and his only son is her brother.
:::

:::context
**Family of six: A, B, C, D, E, F**

- A and B are a married couple; A is the husband.
- D is the only son of C, who is A's brother.
- E is D's sister.
- B is the daughter-in-law of F, whose husband has died.
:::

:::mcq medium
Q: How is E related to C?
- Niece
- [x] Daughter
- Sister
- Wife
> D and E are siblings, and D is C's son, so E is C's daughter.
:::

:::mcq medium
Q: Who is C's mother?
- B
- [x] F
- E
- Cannot be determined
> B is F's daughter-in-law, so A is F's son. C is A's brother, so F is C's mother too.
:::

:::mcq medium
Q: How is D related to A?
- Son
- [x] Nephew
- Brother
- Cousin
> D is the son of A's brother C.
:::

:::context
:::

=== r-direction-sense | Direction Sense
summary: Tracking turns and distances, final direction and displacement, and shadow-based questions.
---
## Draw a compass and trace the path

```
        N
   NW   |   NE
 W -----+----- E
   SW   |   SE
        S
```

- **Right turn = 90° clockwise**; left turn = 90° anticlockwise.
- Facing north, your right is east. Facing south, your right is **west**.

## Distance from the start

Add up the net movement east–west and north–south, then use Pythagoras.

**Example.** 6 km east, then 8 km north: the distance is √(36 + 64) = **10 km**, to the north-east.

## Shadows

| Time | Sun | Shadow points |
|---|---|---|
| Morning | East | West |
| Evening | West | East |
| Noon | Overhead | No shadow (for this kind of question) |

**Example.** In the evening a man's shadow falls to his right. The shadow points east, so his right is east and he is facing **north**.

## Turning by angles

Each 45° is one step around the 8-point compass. From south-east, turning 135° anticlockwise passes E (45°) and NE (90°) and ends at **N** (135°).

:::mcq easy
Q: A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the start, and in which direction?
- 5 km north
- [x] 3 km east
- 3 km west
- 13 km east
> The north and south legs cancel, leaving 3 km east.
:::

:::mcq easy
Q: You face north, turn 90° clockwise and then 180°. Which way do you face now?
- East
- [x] West
- South
- North
> North → East (90° clockwise) → West (180°).
:::

:::mcq easy
Q: A person walks 6 km east and then 8 km north. How far are they from the start?
- 14 km
- [x] 10 km
- 12 km
- 2 km
> √(6² + 8²) = 10.
:::

:::mcq easy
Q: Early in the morning, Ram stands facing his own shadow. Which way is he facing?
- East
- [x] West
- North
- South
> The sun is in the east in the morning, so his shadow points west, and he faces west.
:::

:::mcq medium
Q: Starting at a point, a person walks 10 m south, turns left and walks 20 m, turns left and walks 10 m, then turns right and walks 5 m. Where is he now relative to the start?
- 15 m east
- [x] 25 m east
- 25 m west
- 20 m north-east
> South 10, east 20, north 10 (back level with the start), then a right turn from north means east 5. Total: 25 m east.
:::

:::mcq medium
Q: A is north of B, and C is east of B. In which direction is A from C?
- North-east
- [x] North-west
- South-west
- South-east
> A is above B and C is to B's right, so from C, A is up and to the left: north-west.
:::

:::mcq medium
Q: Facing south-east, you turn 135° anticlockwise. Which way do you face now?
- East
- [x] North
- North-east
- West
> SE → E (45°) → NE (90°) → N (135°).
:::

:::mcq easy
Q: A person walks 4 km west and then 3 km south. Where are they relative to the start?
- 7 km south-west
- [x] 5 km south-west
- 5 km south-east
- 1 km west
> √(16 + 9) = 5, towards the south-west.
:::

:::mcq medium
Q: In the evening, two friends stand facing each other. One friend's shadow falls exactly to his right. Which way is that friend facing?
- South
- [x] North
- East
- West
> In the evening shadows point east. If east is on his right, he is facing north.
:::

:::mcq hard
Q: A man walks 3 km north, 4 km east, 3 km north and 4 km east. How far is he from the start, and in which direction?
- 14 km north-east
- [x] 10 km north-east
- 10 km east
- 8 km north
> Net 6 km north and 8 km east: √(36 + 64) = 10 km, to the north-east.
:::

=== r-ranking | Ranking and Order
summary: Positions from both ends, totals, people between two others, interchanges and comparison chains.
---
## Core formulas (one row or ranking)

- **Total = left position + right position − 1**
- **Position from the other end = total − position + 1**
- **People between two positions p₁ < p₂ (same end) = p₂ − p₁ − 1**

**Example.** Ravi is 7th from the left and 12th from the right, so there are 7 + 12 − 1 = **18** people.

## Two people from opposite ends

If A is a-th from the left and B is b-th from the right, and they **don't overlap**, with k people between them: total = a + b + k.

## Interchange questions

When two people swap places, each takes the other's old position. Combine the new information with what is known about the old position.

**Example.** Kamla is 9th from the left and Veena is 16th from the right. After they swap, Kamla is 25th from the left.
Kamla is now in Veena's old seat, which is 25th from the left and 16th from the right, so the total is 25 + 16 − 1 = **40**.

## Comparison chains

Turn each statement into an inequality and merge them: P > Q, Q > S and S > R give P > Q > S > R.

:::mcq easy
Q: Ravi is 7th from the left and 12th from the right in a row. How many people are in the row?
- 19
- [x] 18
- 17
- 20
> 7 + 12 − 1 = 18.
:::

:::mcq easy
Q: In a class of 40, Riya ranks 15th from the top. What is her rank from the bottom?
- 25
- [x] 26
- 24
- 27
> 40 − 15 + 1 = 26.
:::

:::mcq medium
Q: A is 10th from the left and B is 15th from the right, with 3 people between them (no overlap). How many people are in the row?
- 25
- [x] 28
- 27
- 30
> 10 + 3 + 15 = 28.
:::

:::mcq easy
Q: P is taller than Q, R is shorter than S, and Q is taller than S. Who is the shortest?
- Q
- S
- [x] R
- P
> P > Q > S > R.
:::

:::mcq medium
Q: In a row of 25, X is 8th from the left and Y is 12th from the right. How many people sit between X and Y?
- 4
- [x] 5
- 6
- 3
> Y is 25 − 12 + 1 = 14th from the left, so 14 − 8 − 1 = 5 people sit between them.
:::

:::mcq easy
Q: Raj ranks 9th from the top and 38th from the bottom. How many students are there?
- 47
- [x] 46
- 45
- 48
> 9 + 38 − 1 = 46.
:::

:::mcq easy
Q: Kiran ranks 12th from the top, and Swati is 5 ranks below Kiran. What is Swati's rank from the top?
- 7th
- [x] 17th
- 16th
- 18th
> 12 + 5 = 17.
:::

:::mcq hard
Q: In a row, A is 15th from the left and B is 20th from the right. After they swap, A is 25th from the left. How many people are in the row?
- 40
- [x] 44
- 45
- 39
> A's new seat (B's old one) is 25th from the left and 20th from the right: 25 + 20 − 1 = 44.
:::

:::mcq medium
Q: A is taller than B, C is taller than A, D is shorter than B, and E is the tallest. Who is the second tallest?
- A
- [x] C
- B
- E
> E > C > A > B > D.
:::

:::mcq hard
Q: Kamla is 9th from the left and Veena is 16th from the right. After they swap, Kamla is 25th from the left. What is Veena's new position from the right?
- 30th
- [x] 32nd
- 31st
- 24th
> The row has 25 + 16 − 1 = 40 people. Veena now sits in Kamla's old seat, 9th from the left, which is 40 − 9 + 1 = 32nd from the right.
:::

=== r-seating-linear | Linear Seating Arrangement
summary: People in a row facing north or south: fixing positions from the clues and answering position questions.
---
## Method

1. Draw blanks for the seats and number them from the left.
2. Place **definite** clues first (ends, "third from the left", "in the middle").
3. Then use clues that link people ("immediately right of", "second to the left of").
4. Leave negative clues ("X is not next to Y") until the end; they eliminate options.
5. If a clue allows two cases, draw both and let later clues kill one.

## Facing direction matters

| Facing | Their right is | Their left is |
|---|---|---|
| North (facing away from you, as you look at the page) | Your right | Your left |
| South (facing you) | **Your left** | **Your right** |

"Second to the right of Q" means skip one seat in Q's right direction.

:::context
**Puzzle 1.** Six friends P, Q, R, S, T and U sit in a row facing **north**.

- S sits third from the left end.
- Q sits immediately to the right of S.
- U sits at one of the ends.
- R sits second to the right of Q.
- T is not an immediate neighbour of S.
:::

:::mcq easy
Q: Who sits at the right end?
- U
- [x] R
- T
- Q
> Positions 1 to 6 from the left are U P S Q T R. S = 3 and Q = 4, so R = 6. U takes end 1. T can't be next to S, so T = 5 and P = 2.
:::

:::mcq easy
Q: Who sits between Q and R?
- S
- [x] T
- P
- Nobody
> The order is U P S Q T R.
:::

:::mcq easy
Q: How many people sit between U and Q?
- 1
- [x] 2
- 3
- 4
> P and S.
:::

:::mcq easy
Q: Who sits immediately to the left of S?
- U
- [x] P
- Q
- T
> U P S Q T R.
:::

:::mcq medium
Q: Which pair sits at the two ends?
- P and R
- [x] U and R
- U and T
- S and R
> Position 1 is U and position 6 is R.
:::

:::context
**Puzzle 2.** Five people A, B, C, D and E sit in a row facing **south**. Seats are numbered 1 to 5 from **west to east**.

- C sits in the middle.
- A sits to the immediate left of C.
- E sits at an extreme end, to the right of B.
- D does not sit at an end.
:::

:::mcq medium
Q: Who sits to the immediate right of C?
- A
- [x] D
- E
- B
> Facing south, left is east and right is west. A is east of C (seat 4). E is at an end, west of B, so E = 1. D isn't at an end, so D = 2 and B = 5. West to east: E D C A B. C's right (west) neighbour is D.
:::

:::mcq medium
Q: Who sits at the eastern end?
- E
- A
- [x] B
- D
> West to east: E D C A B.
:::

:::context
:::

:::mcq easy
Q: In a row of 8 facing north, X is 3rd from the left and Y is second to the right of X. What is Y's position from the right?
- 3rd
- [x] 4th
- 5th
- 6th
> Y is 5th from the left, which is 8 − 5 + 1 = 4th from the right.
:::

:::mcq easy
Q: You face north. On which side of you is the person to your immediate right?
- West
- [x] East
- North
- South
> Facing north, your right hand points east.
:::

:::mcq medium
Q: Seven people sit in a row facing north. M is 4th from the left, and N is third to the left of M. How many people sit to the left of N?
- 1
- [x] 0
- 2
- 3
> N is in seat 4 − 3 = 1, the left end.
:::

=== r-seating-circular | Circular Seating Arrangement
summary: Around a round table facing the centre or outward: directions, opposite seats and neighbours.
---
## Directions around a circle

- **Facing the centre:** your right is **anticlockwise** and your left is **clockwise**.
- **Facing outward:** it is reversed, so right is **clockwise**.

Number the seats 0 to n − 1 anticlockwise. For someone facing the centre:
- "k to the right of X" = X + k
- "k to the left of X" = X − k
- With an even number n, the person opposite seat s is at s + n/2.

## Method

1. Fix the first person anywhere; in a circle only relative positions matter.
2. Place everyone who has a definite relation to people already seated.
3. Use the negative clues last.

:::context
**Puzzle.** Eight people A to H sit around a circular table, all **facing the centre**.

- A sits opposite E.
- B sits second to the right of A.
- C sits to the immediate left of E.
- D sits opposite B.
- G sits to the immediate right of D.
- H is not adjacent to A.
:::

:::mcq medium
Q: Who sits opposite C?
- H
- [x] G
- F
- A
> Numbering anticlockwise from A = 0: B = 2, E = 4, C = 3, D = 6, G = 7, H = 5 (not next to A), F = 1. Opposite seat 3 is seat 7, which is G.
:::

:::mcq easy
Q: Who sits to the immediate left of A?
- F
- [x] G
- B
- H
> Left is clockwise: seat 0 − 1 = seat 7, which is G.
:::

:::mcq easy
Q: Who sits between B and E?
- F
- [x] C
- H
- D
> B = 2, C = 3, E = 4.
:::

:::mcq medium
Q: Who sits third to the right of D?
- G
- [x] F
- A
- B
> 6 + 3 = 9, which is seat 1 (mod 8), and seat 1 is F.
:::

:::mcq medium
Q: Going clockwise from A to D, how many people sit between them?
- 0
- [x] 1
- 2
- 4
> Clockwise from A (seat 0): seat 7 (G), then seat 6 (D). Only G is between them.
:::

:::mcq medium
Q: Which pair sits opposite each other?
- A and C
- [x] F and H
- B and G
- D and E
> F = 1 and H = 5 are four seats apart.
:::

:::context
:::

:::mcq easy
Q: Six people sit around a table facing the centre. How many seats to your right is the person directly opposite you?
- 2
- [x] 3
- 4
- 6
> Opposite = n/2 = 3 seats away (in either direction).
:::

:::mcq easy
Q: When you face the centre of a round table, moving to your right means moving:
- Clockwise
- [x] Anticlockwise
- Towards the centre
- It depends on the table size
> Facing the centre, your right hand points anticlockwise.
:::

:::mcq medium
Q: A, B, C, D and E sit in a circle facing the centre. B is to A's immediate right, C is to B's immediate right, and D is to E's immediate right. Who is to A's immediate left?
- E
- [x] D
- C
- B
> Anticlockwise from A: A, B, C. D must come straight after E, so the remaining two seats are E then D. D is next to A on the clockwise side, which is A's left.
:::

:::mcq hard
Q: People sit around a table facing away from the centre. In which direction is a person's immediate right neighbour?
- Anticlockwise
- [x] Clockwise
- Opposite
- It depends on the number of people
> Facing outward reverses the facing-centre rule, so right becomes clockwise.
:::

=== r-seating-square | Square and Rectangular Seating
summary: Corner and side-middle seats, mixed facing directions and opposite positions at square tables.
---
Square-table puzzles are circular puzzles with labels: seats are **corners** or **middles of sides**.

## Setup

With 8 people, number the seats 0 to 7 **anticlockwise**. Even numbers are corners and odd numbers are side middles (or the other way round, depending on the puzzle).

- Opposite seat = s + 4.
- If everyone faces the centre, right = anticlockwise (+1) and left = clockwise (−1).
- If some people **face outward**, their right and left swap: right = clockwise (−1).

:::tip
Mixed-facing puzzles are the most common trap. Mark each person's facing direction on your diagram before applying any "right of" clue.
:::

:::context
**Puzzle.** Eight people P, Q, R, S, T, U, V and W sit around a square table: four at the corners and four at the middles of the sides. **Everyone faces the centre.**

- P sits at a corner.
- Q sits opposite P.
- R sits second to the right of P.
- S sits to the immediate left of Q.
- T sits opposite R.
- U sits at the middle of a side, to the immediate right of P.
- V is not adjacent to Q.
:::

:::mcq medium
Q: Who sits opposite S?
- U
- [x] V
- W
- T
> With P = 0 (a corner) and numbering anticlockwise: U = 1, R = 2, S = 3, Q = 4, T = 6. V can't be next to Q (seats 3 and 5), so V = 7 and W = 5. Opposite seat 3 is seat 7, which is V.
:::

:::mcq easy
Q: Which of these people sits at a corner?
- U
- S
- [x] T
- V
> The corners are the even seats: P (0), R (2), Q (4) and T (6).
:::

:::mcq easy
Q: Who sits to the immediate right of T?
- W
- [x] V
- P
- Q
> Right = anticlockwise: seat 6 + 1 = 7, which is V.
:::

:::mcq easy
Q: Who sits between R and Q?
- U
- [x] S
- W
- T
> R = 2, S = 3, Q = 4.
:::

:::mcq medium
Q: Who sits second to the left of P?
- V
- [x] T
- R
- W
> Left = clockwise: 0 − 2 = seat 6, which is T.
:::

:::mcq easy
Q: Who sits to the immediate left of U?
- R
- [x] P
- V
- S
> U = 1, and one seat clockwise is seat 0, which is P.
:::

:::context
:::

:::mcq medium
Q: A, B, C and D sit at the corners of a square table facing the centre. A is to B's immediate right, and C is diagonally opposite B. Who is to B's immediate left?
- A
- C
- [x] D
- Cannot be determined
> Anticlockwise from B: B, A, C, D. B's left (clockwise) neighbour is D.
:::

:::mcq easy
Q: A person at a table faces away from the centre. Moving to their right around the table is:
- Anticlockwise
- [x] Clockwise
- Towards the opposite seat
- Not defined
> Facing outward reverses directions, so right is clockwise.
:::

:::mcq easy
Q: Eight people sit around a square table (four corners and four side middles). Going either way round, how many people sit between two people who are directly opposite each other?
- 2
- [x] 3
- 4
- 1
> Opposite seats are 4 apart, so 3 people sit between them on each side.
:::

:::mcq hard
Q: At a square table, the people at the corners face the centre and the people at the side middles face outward. M sits at the middle of a side, and N sits to M's immediate right. Where is N sitting?
- Middle of a side
- [x] A corner
- Opposite M
- Cannot be determined
> M faces outward, so M's right is the clockwise neighbour. Every neighbour of a side-middle seat is a corner.
:::
