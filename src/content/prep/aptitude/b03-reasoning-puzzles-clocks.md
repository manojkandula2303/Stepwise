=== r-floor-puzzles | Floor Puzzles
summary: People on numbered floors of a building, with attributes, solved with a grid and elimination.
---
Floor puzzles are linear arrangements turned vertical: **floor 1 is the bottom** unless stated otherwise.

## Method

1. Draw a column of floors with the top floor at the top.
2. Place fixed facts first (top floor, bottom floor, "on floor 3").
3. Handle block clues next: "immediately above", "two floors below". These often allow only one position once the building's edges are considered.
4. If there's a second attribute (car colour, city), add a column and fill the grid.
5. Apply negative clues last.

:::tip
"Immediately above" means exactly one floor up. "Above" alone means any floor higher. Many wrong answers come from confusing the two.
:::

:::context
**Puzzle 1.** Six people A, B, C, D, E and F each live on a different floor of a 6-floor building (floor 1 is the bottom).

- E lives on the top floor.
- C lives on an even-numbered floor, immediately above F.
- A lives immediately below F.
- B lives above C.
- D lives below A.
:::

:::mcq easy
Q: Who lives on floor 5?
- C
- [x] B
- E
- F
> E = 6. C must be on floor 4: on floor 2, F would be on 1 with no room for A below. So F = 3 and A = 2. B (above C) = 5 and D = 1.
:::

:::mcq easy
Q: Who lives on the bottom floor?
- A
- [x] D
- F
- B
> From floor 1 to 6: D, A, F, C, B, E.
:::

:::mcq easy
Q: How many people live between A and B?
- 1
- [x] 2
- 3
- 0
> F and C (floors 3 and 4).
:::

:::mcq easy
Q: Who lives immediately above C?
- E
- [x] B
- F
- A
> C is on 4 and B on 5.
:::

:::mcq easy
Q: Which floor does F live on?
- 2
- [x] 3
- 4
- 1
> D, A, F, C, B, E from the bottom.
:::

:::context
**Puzzle 2.** P, Q, R and S live on floors 1 to 4 (1 is the bottom). Each owns a car of a different colour: red, blue, green or white.

- The owner of the red car lives on floor 3.
- Q lives immediately below the owner of the red car.
- S lives on the top floor and does not own the green car.
- P owns the blue car.
- R does not live on floor 1.
:::

:::mcq medium
Q: Who owns the green car?
- R
- [x] Q
- S
- P
> Q = 2 and S = 4. R isn't on floor 1, so R = 3 (red) and P = 1 (blue). S isn't green, so S is white and Q is green.
:::

:::mcq medium
Q: What colour is S's car?
- Green
- [x] White
- Red
- Blue
> Red belongs to R and blue to P, and S isn't green, so S's car is white.
:::

:::mcq easy
Q: Who lives on floor 1?
- Q
- [x] P
- R
- S
> P = 1, Q = 2, R = 3, S = 4.
:::

:::context
:::

:::mcq easy
Q: In a 7-floor building, X lives three floors above Y. What is the highest floor Y can live on?
- 3
- [x] 4
- 5
- 6
> Y + 3 ≤ 7, so Y ≤ 4.
:::

:::mcq hard
Q: In a 5-floor building, A lives above B but below C, D lives immediately above C, and E lives on floor 1. Who lives on floor 3?
- B
- [x] A
- C
- D
> E = 1. The other four, in order, are B < A < C with D immediately above C, which only fits as B = 2, A = 3, C = 4, D = 5.
:::

=== r-box-puzzles | Box Stacking Puzzles
summary: Boxes stacked one above another, with positions, colours and the boxes between them.
---
A stack is a vertical line: **position 1 is the bottom**. Use the same grid method as floor puzzles.

## Words to read carefully

- "Immediately above or below": adjacent positions only.
- "Above or below": any position higher or lower.
- "Exactly two boxes between X and Y": their positions differ by 3.
- "kth from the top" = position (total − k + 1) from the bottom.

## Two-case technique

When a clue leaves two placements, sketch both stacks side by side. The next clue nearly always eliminates one; for example, "O is below J" kills any case where J sits too low.

:::context
**Puzzle 1.** Six boxes J, K, L, M, N and O are stacked one above another (position 1 is the bottom).

- M is at the top.
- K is immediately below M.
- L is at the bottom.
- N is immediately above J.
- O is below J.
:::

:::mcq easy
Q: Which box is in position 4?
- J
- [x] N
- O
- K
> M = 6, K = 5, L = 1. N sits right on top of J and O is below J, so J = 3, N = 4, O = 2.
:::

:::mcq easy
Q: How many boxes are between O and K?
- 1
- [x] 2
- 3
- 4
> O = 2 and K = 5, with J and N between them.
:::

:::mcq easy
Q: Which box is immediately above O?
- N
- [x] J
- L
- K
> From the bottom: L, O, J, N, K, M.
:::

:::mcq easy
Q: Which box is second from the top?
- N
- [x] K
- M
- J
> K is in position 5.
:::

:::mcq easy
Q: Which box is directly below J?
- L
- [x] O
- N
- K
> O is in position 2, just below J in position 3.
:::

:::context
**Puzzle 2.** Four boxes A, B, C and D are stacked. Each is a different colour: red, green, blue or yellow.

- The yellow box is at the bottom.
- B is immediately above the yellow box.
- The red box is at the top.
- C is green.
- D is not at the top.
:::

:::mcq medium
Q: What colour is box B?
- Green
- [x] Blue
- Red
- Yellow
> Yellow = 1, B = 2, red = 4. Green C must be 3. D isn't at the top, so D = 1 (yellow) and A = 4 (red). B gets the remaining colour, blue.
:::

:::mcq easy
Q: Which box is at the top?
- C
- [x] A
- D
- B
> A is red, at position 4.
:::

:::mcq easy
Q: Which box is yellow?
- A
- [x] D
- B
- C
> D is at the bottom.
:::

:::context
:::

:::mcq easy
Q: In a stack of 7 boxes, one box is 3rd from the top. What is its position from the bottom?
- 4th
- [x] 5th
- 3rd
- 6th
> 7 − 3 + 1 = 5.
:::

:::mcq hard
Q: Five boxes are stacked. P is above Q, R is above P, S is below Q, and T is at the top. Which box is in the middle?
- Q
- [x] P
- R
- S
> From the bottom: S, Q, P, R, T. The middle (3rd) box is P.
:::

=== r-scheduling-puzzles | Scheduling Puzzles
summary: Events on days or time slots: before/after chains, fixed slots and negative clues.
---
Scheduling puzzles place events in **ordered slots** (days of the week, hours, months). Treat the slots like seats in a row.

## Translating clues

| Clue | Meaning |
|---|---|
| "X is the day after Y" | X = Y + 1 |
| "X is before Y" | X < Y (any gap) |
| "Two days between X and Y" | their slots differ by 3 |
| "X is not on Monday" | cross out one cell |

## Method

1. Draw a table with the slots across and the people or events down.
2. Fill fixed clues, then chains, then eliminations.
3. Chains such as "Asha < Ben < Chen" are powerful when combined with "Asha isn't first".

:::context
**Puzzle 1.** Five lectures (Maths, Physics, Chemistry, Biology and English) are held from Monday to Friday, one each day.

- English is on Wednesday.
- Physics is the day after English.
- Maths is the day before English.
- Biology is not on Monday.
:::

:::mcq easy
Q: Which lecture is on Friday?
- Chemistry
- [x] Biology
- Physics
- English
> English is Wednesday, Physics Thursday and Maths Tuesday. Biology can't be Monday, so it's Friday, and Chemistry is Monday.
:::

:::mcq easy
Q: Which lecture is on Monday?
- Maths
- [x] Chemistry
- Biology
- Physics
> Chemistry is the only lecture left for Monday.
:::

:::mcq easy
Q: How many lectures come between Maths and Biology?
- 1
- [x] 2
- 3
- 0
> English and Physics (Wednesday and Thursday).
:::

:::mcq easy
Q: On which day is Physics?
- Wednesday
- [x] Thursday
- Friday
- Tuesday
> The day after English (Wednesday).
:::

:::context
**Puzzle 2.** Asha, Ben, Chen and Divya each have a meeting at a different time: 9, 10, 11 or 12 o'clock.

- Ben meets after Asha but before Chen.
- Divya does not meet at 12.
- Asha does not meet at 9.
:::

:::mcq medium
Q: Who meets at 9 o'clock?
- Asha
- [x] Divya
- Ben
- Chen
> Asha < Ben < Chen, and Asha isn't at 9, so Asha = 10, Ben = 11, Chen = 12. Divya takes 9.
:::

:::mcq easy
Q: Who meets at 12 o'clock?
- Ben
- [x] Chen
- Divya
- Asha
> Chen comes last in the chain.
:::

:::mcq easy
Q: Who meets immediately after Asha?
- Chen
- [x] Ben
- Divya
- Nobody
> Asha is at 10 and Ben at 11.
:::

:::context
:::

:::mcq medium
Q: A course meets every 3rd day, starting on a Monday (day 1). On which weekday is the 4th session?
- Tuesday
- [x] Wednesday
- Thursday
- Sunday
> Sessions fall on days 1, 4, 7 and 10: Monday, Thursday, Sunday and Wednesday.
:::

:::mcq easy
Q: Six talks are scheduled. Talk A comes before B, and C comes immediately after B. If B is 4th, where is C?
- 3rd
- [x] 5th
- 6th
- 2nd
> Immediately after 4th is 5th.
:::

:::mcq medium
Q: Seven events run from Monday to Sunday, one a day. P is on Wednesday, Q is two days after P, and R is the day before Q. On which day is R?
- Wednesday
- [x] Thursday
- Friday
- Tuesday
> Q is on Friday, so R is on Thursday.
:::

=== r-month-day-puzzles | Month and Day Puzzles
summary: Birthdays and events across months or dates, using month lengths and weekday arithmetic.
---
These puzzles mix arrangement logic with calendar facts.

## Facts you'll need

- 31 days: Jan, Mar, May, Jul, Aug, Oct, Dec
- 30 days: **Apr, Jun, Sep, Nov**
- Feb: 28 days, or 29 in a leap year
- Dates 7 apart fall on the same weekday. A 31-day month moves the weekday forward by 3, and a 30-day month by 2.

## Method

1. List only the months or dates given in the puzzle, **in calendar order**. These are your slots.
2. Apply the clues exactly as in linear arrangements: "only two between", "immediately before", and so on.
3. Use calendar facts ("a month with 30 days") as filters.

:::context
**Puzzle.** K, L, M, N, O and P have birthdays in six different months: January, March, April, June, August and December.

- K's birthday is in a month with 30 days.
- Exactly two of the others have birthdays between K's and N's, and N's comes after K's.
- M's birthday is the earliest in the year.
- L's birthday is immediately before N's.
- O's birthday is in a month with 31 days.
:::

:::mcq medium
Q: Whose birthday is in June?
- K
- [x] P
- O
- L
> K is in April or June, and two months must separate K from N. Only April works, with N in December. M = January and L = August. O takes March (31 days), leaving June for P.
:::

:::mcq easy
Q: In which month is O's birthday?
- June
- [x] March
- August
- January
> O needs a 31-day month, and March is the only one left.
:::

:::mcq easy
Q: How many people have birthdays between M's and K's?
- 0
- [x] 1
- 2
- 3
> Only O (March) falls between January and April.
:::

:::mcq easy
Q: Whose birthday is the latest in the year?
- L
- [x] N
- P
- K
> N's birthday is in December.
:::

:::mcq easy
Q: Of these six birthdays, whose comes immediately after K's?
- L
- [x] P
- O
- N
> April is followed by June (P).
:::

:::context
:::

:::mcq medium
Q: In a non-leap year, 1 March is a Monday. What day is 1 April?
- Wednesday
- [x] Thursday
- Friday
- Monday
> March has 31 days, which is 3 odd days: Monday + 3 = Thursday.
:::

:::mcq medium
Q: Someone is born on 29 February. How many actual birthdays (on 29 February) do they have from age 1 to age 12?
- 2
- [x] 3
- 4
- 12
> Only every 4th year: ages 4, 8 and 12 (assuming no century exception).
:::

:::mcq easy
Q: How many months have exactly 30 days?
- 3
- [x] 4
- 5
- 7
> April, June, September and November.
:::

:::mcq easy
Q: 1 January is a Friday. What is the date of the last Friday in January?
- 28th
- [x] 29th
- 30th
- 31st
> The Fridays fall on the 1st, 8th, 15th, 22nd and 29th.
:::

:::mcq hard
Q: The 3rd Monday of a month is the 17th. What is the date of the first Friday?
- 6th
- [x] 7th
- 5th
- 4th
> The Mondays are the 3rd, 10th and 17th, so the 1st is a Saturday. The first Friday is the 7th.
:::

=== r-clocks | Clocks
summary: Angle between the hands, when the hands overlap or form right angles, mirror images and clocks that gain or lose time.
---
## Speeds of the hands

- Minute hand: **6° per minute**
- Hour hand: **0.5° per minute** (30° per hour)
- The minute hand gains **5.5° per minute** on the hour hand.

## Angle at H:M

**θ = |30H − 5.5M|**. If θ > 180°, use 360° − θ for the smaller angle.

- 3:30 → |90 − 165| = **75°**
- 9:15 → |270 − 82.5| = 187.5°, so the smaller angle is **172.5°**

## When does a given angle occur?

Solve 30H − 5.5M = ±θ for M.
- Hands coincide between 4 and 5: 5.5M = 120, so M = **21 9/11 minutes past 4**.

## Counts in 12 hours (double them for a day)

| Event | In 12 h | In 24 h |
|---|---|---|
| Hands coincide | 11 | **22** |
| Right angle | 22 | **44** |
| Opposite (180°) | 11 | 22 |

The hands coincide every 65 5/11 minutes, not every 60.

## Mirror images

The mirror time is **11:60 − actual time** (for times between 1:00 and 11:00). For example, 3:40 shows as **8:20** in a mirror.

## Fast and slow clocks

Multiply the gain per hour by the hours elapsed. A clock that gains 5 minutes an hour and is set right at noon shows **6:30** at 6 pm.

:::mcq easy
Q: What is the angle between the hands at 3:00?
- 60°
- [x] 90°
- 120°
- 45°
> 30 × 3 = 90°.
:::

:::mcq medium
Q: What is the angle between the hands at 3:30?
- 90°
- [x] 75°
- 60°
- 105°
> |30 × 3 − 5.5 × 30| = |90 − 165| = 75°.
:::

:::mcq medium
Q: What is the smaller angle between the hands at 9:15?
- 180°
- [x] 172.5°
- 187.5°
- 165°
> |270 − 82.5| = 187.5°, so the smaller angle is 360° − 187.5° = 172.5°.
:::

:::mcq easy
Q: How many times do the hands of a clock coincide in a day?
- 24
- [x] 22
- 23
- 12
> 11 times every 12 hours.
:::

:::mcq medium
Q: At what time between 4 and 5 o'clock do the hands coincide?
- 4:20
- [x] 21 9/11 minutes past 4
- 4:22
- 21 3/11 minutes past 4
> 5.5M = 120, so M = 240/11 = 21 9/11.
:::

:::mcq easy
Q: A clock reads 3:40. What time does its mirror image show?
- 9:20
- [x] 8:20
- 8:40
- 9:40
> 11:60 − 3:40 = 8:20.
:::

:::mcq easy
Q: How many times are the hands of a clock at right angles in a day?
- 22
- [x] 44
- 48
- 24
> 22 times every 12 hours.
:::

:::mcq easy
Q: A clock gains 5 minutes every hour. It is set correctly at noon. What does it show at 6 pm?
- 6:05
- [x] 6:30
- 6:25
- 5:30
> 6 hours × 5 minutes = 30 minutes fast.
:::

:::mcq easy
Q: What is the angle between the hands at 7:20?
- 110°
- [x] 100°
- 90°
- 120°
> |210 − 110| = 100°.
:::

:::mcq hard
Q: When, after 2 o'clock, are the hands first at right angles?
- 2:25
- [x] 27 3/11 minutes past 2
- 2:30
- 25 5/11 minutes past 2
> 5.5M − 60 = 90, so M = 150/5.5 = 27 3/11.
:::

=== r-calendars | Calendars
summary: Odd days, leap-year rules, finding the day of the week for any date and repeating calendars.
---
## Odd days

The days left over after complete weeks are **odd days**. Moving forward n days shifts the weekday by n mod 7.

| Period | Odd days |
|---|---|
| Ordinary year | 1 |
| Leap year | 2 |
| 100 years | 5 |
| 200 years | 3 |
| 300 years | 1 |
| 400 years | 0 |

Month odd days: 31-day months give 3, 30-day months give 2, and February gives 0 (or 1 in a leap year).

## Leap years

A year is a leap year if it is divisible by 4. **Century years must be divisible by 400**: 2000 was a leap year, but 1900 was not.

## Day of the week for any date

Add up the odd days for complete centuries, the remaining complete years, the complete months, and the date. Take the total mod 7, where **0 = Sunday, 1 = Monday, …, 6 = Saturday**.

**Example: 26 January 1950.**
- 1600 years → 0
- 300 years → 1
- 49 years (12 leap, 37 ordinary) → 24 + 37 = 61 → 5
- 26 days → 5
- Total 11 → 4 = **Thursday**

## Next year's same date

The same date is 1 weekday later the next year (2 later if a 29 February falls in between).

## Repeating calendars

A year's calendar repeats when the odd days in between add up to a multiple of 7 **and** the two years are the same type (leap or ordinary). The 2023 calendar repeats in **2034**.

:::mcq easy
Q: Today is Monday. What day will it be in 61 days?
- Friday
- [x] Saturday
- Sunday
- Thursday
> 61 mod 7 = 5, and Monday + 5 = Saturday.
:::

:::mcq easy
Q: How many odd days does a leap year have?
- 1
- [x] 2
- 0
- 3
> 366 = 52 weeks + 2 days.
:::

:::mcq easy
Q: Was 1900 a leap year?
- Yes, because it is divisible by 4
- [x] No, because century years must be divisible by 400
- Yes, because every century year is a leap year
- No, because it is not divisible by 4
> 1900 is not divisible by 400.
:::

:::mcq easy
Q: 1 January 2023 was a Sunday. What day was 1 January 2024?
- Tuesday
- [x] Monday
- Sunday
- Saturday
> 2023 is an ordinary year, which adds 1 odd day.
:::

:::mcq medium
Q: 1 January 2024 was a Monday. What day was 1 January 2025?
- Tuesday
- [x] Wednesday
- Thursday
- Monday
> 2024 is a leap year, which adds 2 odd days.
:::

:::mcq hard
Q: In which year will the calendar of 2023 next repeat exactly?
- 2029
- [x] 2034
- 2031
- 2033
> The odd days from 2023 onwards add up to a multiple of 7 by the end of 2033, and 2034 is also an ordinary year.
:::

:::mcq medium
Q: On which day of the week was 15 August 1947?
- Thursday
- [x] Friday
- Saturday
- Sunday
> 1600 years → 0, 300 → 1, 46 years (11 leap, 35 ordinary) → 57 → 1. January–July adds 3+0+3+2+3+2+3 = 16 → 2, and the 15 days add 1. The total is 5, which is Friday.
:::

:::mcq easy
Q: How many odd days are there in 100 years?
- 1
- [x] 5
- 3
- 0
> 100 years has 24 leap years and 76 ordinary years: 48 + 76 = 124 days, and 124 mod 7 = 5.
:::

:::mcq easy
Q: The 5th of a month is a Tuesday. What day is the 26th?
- Monday
- [x] Tuesday
- Wednesday
- Thursday
> 21 days later is exactly 3 weeks.
:::

:::mcq hard
Q: On which day of the week was 26 January 1950?
- Wednesday
- [x] Thursday
- Friday
- Tuesday
> 0 + 1 + 5 (from 49 years) + 5 (from 26 days) = 11, and 11 mod 7 = 4, which is Thursday.
:::
