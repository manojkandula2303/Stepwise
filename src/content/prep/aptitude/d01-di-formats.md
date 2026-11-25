=== d-tabular | Tabular Data
summary: Reading multi-row, multi-year tables and computing totals, growth, shares and ratios quickly.
---
Tables are the most common DI format. Questions reward **organisation** more than speed.

## Habits

1. Read the **title and units** first (thousands? ₹ crore? percent?).
2. Compute row and column **totals once**, and write them next to the table.
3. Before calculating, check which figures the question actually needs.
4. For "highest growth" questions, compare **percentage** growth (change ÷ base), not absolute change, unless the question says otherwise.

:::context
**Employees by department**

| Department | 2020 | 2021 | 2022 | 2023 |
|---|---|---|---|---|
| Sales | 120 | 140 | 150 | 180 |
| HR | 30 | 35 | 40 | 40 |
| Tech | 200 | 240 | 300 | 330 |
| Finance | 50 | 55 | 60 | 75 |
:::

:::mcq easy
Q: What was the total number of employees in 2022?
- 520
- [x] 550
- 575
- 600
> 150 + 40 + 300 + 60 = 550.
:::

:::mcq easy
Q: By what percent did the number of Tech employees grow from 2020 to 2023?
- 55%
- [x] 65%
- 60%
- 130%
> (330 − 200)/200 = 65%.
:::

:::mcq medium
Q: Which department had the highest percentage growth from 2020 to 2023?
- Sales
- HR
- [x] Tech
- Finance
> Sales 50%, HR 33.3%, Tech 65%, Finance 50%.
:::

:::mcq easy
Q: What was the average number of HR employees over the four years?
- 35
- [x] 36.25
- 37.5
- 40
> (30 + 35 + 40 + 40)/4 = 36.25.
:::

:::mcq easy
Q: What was the ratio of Sales to Finance employees in 2023?
- 5 : 12
- [x] 12 : 5
- 18 : 7
- 3 : 1
> 180 : 75 = 12 : 5.
:::

:::mcq medium
Q: Approximately what percentage of all 2021 employees worked in Tech?
- 48%
- [x] 51%
- 55%
- 60%
> The 2021 total is 470, and 240/470 ≈ 51.1%.
:::

:::mcq medium
Q: In which year did the total number of employees rise the most over the previous year?
- 2021
- [x] 2022
- 2023
- It rose equally each year
> The totals are 400, 470, 550 and 625, giving increases of 70, 80 and 75.
:::

:::mcq medium
Q: Finance's 2023 headcount is what percent of HR's 2023 headcount?
- 175%
- [x] 187.5%
- 53.3%
- 200%
> 75/40 = 187.5%.
:::

:::context
:::

:::mcq easy
Q: A table reports a value of 250 in "₹ lakh". What is that in crore?
- ₹25 crore
- [x] ₹2.5 crore
- ₹0.25 crore
- ₹250 crore
> 100 lakh = 1 crore.
:::

:::mcq medium
Q: A's sales grew from 80 to 100 and B's from 120 to 144. Who grew faster in percentage terms?
- B
- [x] A
- They grew equally
- Cannot be determined
> A grew 25% and B grew 20%.
:::

=== d-bar-graphs | Bar Graphs
summary: Reading simple and grouped bar charts, comparing heights, and computing change and averages.
---
In a bar graph, **bar length encodes value**. Check the scale and units on the axis, and whether the axis starts at zero (a non-zero start exaggerates differences).

## Types

- **Simple bars:** one series (production by year).
- **Grouped bars:** several series side by side (exports vs imports).
- **Stacked bars:** the parts of a total stacked in one bar; the segment heights are the parts.

## Quick moves

- Above or below average: compute the average once, then just compare.
- Largest **increase**: compare consecutive differences, not the tallest bar.

:::context
**Car production (thousand units)**

```
2019 | ████████████████████████            60
2020 | ████████████████                    40
2021 | ████████████████████████████        70
2022 | ████████████████████████████████████ 90
2023 | ████████████████████████████████    80
```
:::

:::mcq easy
Q: In which year was production highest?
- 2021
- [x] 2022
- 2023
- 2019
> 90 thousand in 2022.
:::

:::mcq easy
Q: By what percent did production fall from 2019 to 2020?
- 20%
- [x] 33.33%
- 50%
- 25%
> (60 − 40)/60 = 33.33%.
:::

:::mcq easy
Q: What was the average annual production over the five years?
- 66 thousand
- [x] 68 thousand
- 70 thousand
- 72 thousand
> 340/5 = 68.
:::

:::mcq medium
Q: By what percent did production grow from 2020 to 2022?
- 100%
- [x] 125%
- 50%
- 80%
> (90 − 40)/40 = 125%.
:::

:::mcq easy
Q: What is the ratio of 2021 production to 2023 production?
- 8 : 7
- [x] 7 : 8
- 9 : 8
- 7 : 9
> 70 : 80.
:::

:::mcq medium
Q: In how many years was production above the five-year average?
- 2
- [x] 3
- 4
- 1
> 70, 90 and 80 are all above 68.
:::

:::mcq medium
Q: Approximately what share of total production came from 2022?
- 22.5%
- [x] 26.5%
- 30%
- 18%
> 90/340 ≈ 26.5%.
:::

:::mcq medium
Q: Which year had the largest increase over the previous year?
- 2022
- [x] 2021
- 2023
- 2020
> 2021 rose by 30 thousand; 2022 rose by only 20.
:::

:::context
:::

:::mcq easy
Q: In a grouped bar chart, exports are 50 and imports are 65 (₹ crore). What is the trade deficit?
- ₹115 crore
- [x] ₹15 crore
- ₹10 crore
- ₹65 crore
> Imports − exports = 15.
:::

:::mcq easy
Q: On a bar chart's scale, 1 cm represents 15 units. How tall is the bar for 45 units?
- 2 cm
- [x] 3 cm
- 4.5 cm
- 6 cm
> 45/15 = 3 cm.
:::

=== d-line-graphs | Line Graphs
summary: Reading trends over time: slopes, peaks and dips, percentage change and simple projections.
---
Line graphs show **change over time**. The **slope** between two points shows the rate of change: steeper means faster.

## Reading tips

- **Up, flat or down** between two points means increase, no change or decrease.
- "Steepest rise" usually means the largest absolute change between consecutive points, unless the question asks for percentage change.
- For a projection, apply the **same growth rate** (or the same absolute change) that the question specifies.

:::context
**Company profit (₹ crore), points on the line graph**

| Year | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 |
|---|---|---|---|---|---|---|
| Profit | 20 | 25 | 15 | 30 | 36 | 45 |

```
45 |                         ●
36 |                    ●
30 |               ●
25 |     ●
20 | ●
15 |          ●
   +----+----+----+----+----+---
    2018 2019 2020 2021 2022 2023
```
:::

:::mcq easy
Q: Which year had the largest absolute increase over the previous year?
- 2023
- [x] 2021
- 2022
- 2019
> 2021 rose by 15; the next largest rise is 9 (2023).
:::

:::mcq easy
Q: By what percent did profit fall from 2019 to 2020?
- 10%
- [x] 40%
- 66.67%
- 33.33%
> (25 − 15)/25 = 40%.
:::

:::mcq easy
Q: What was the average annual profit over the six years?
- ₹27 crore
- [x] ₹28.5 crore
- ₹30 crore
- ₹29.5 crore
> 171/6 = 28.5.
:::

:::mcq easy
Q: By what percent did profit grow from 2021 to 2023?
- 40%
- [x] 50%
- 66.67%
- 15%
> (45 − 30)/30 = 50%.
:::

:::mcq easy
Q: In how many years did profit fall compared with the year before?
- 0
- [x] 1
- 2
- 3
> Only 2020.
:::

:::mcq easy
Q: The 2023 profit is how many times the 2020 profit?
- 2
- [x] 3
- 2.5
- 4
> 45/15 = 3.
:::

:::mcq easy
Q: What is the ratio of 2018 profit to 2022 profit?
- 9 : 5
- [x] 5 : 9
- 2 : 3
- 4 : 7
> 20 : 36 = 5 : 9.
:::

:::mcq medium
Q: If the 2022→2023 percentage growth continues, what will the 2024 profit be?
- ₹54 crore
- [x] ₹56.25 crore
- ₹50 crore
- ₹60 crore
> Growth was 9/36 = 25%, and 45 × 1.25 = 56.25.
:::

:::context
:::

:::mcq easy
Q: On a line graph, what does a horizontal segment between two points mean?
- A sharp increase
- [x] No change
- A decrease
- Missing data
> The value is the same at both points.
:::

:::mcq easy
Q: A line graph is best suited to showing:
- Parts of a whole
- [x] A trend over time
- Unordered categories
- A single value
> Its connected points show how a value changes over time.
:::

=== d-pie-charts | Pie Charts
summary: Converting between percentages, angles and amounts, and comparing sectors.
---
A pie chart shows **parts of a whole**. The key conversions:

- **Amount = percentage × total**
- **Central angle = percentage × 3.6°** (because 100% = 360°)
- **Percentage = angle ÷ 3.6**

| % | 10 | 15 | 20 | 25 | 50 |
|---|---|---|---|---|---|
| Angle | 36° | 54° | 72° | 90° | 180° |

:::warning
When comparing two pie charts with **different totals**, a larger percentage doesn't always mean a larger amount. Convert to amounts first.
:::

:::context
**A family's monthly budget: total income ₹60,000**

| Item | Rent | Food | Education | Transport | Savings | Others |
|---|---|---|---|---|---|---|
| Share | 25% | 20% | 15% | 10% | 18% | 12% |
:::

:::mcq easy
Q: How much does the family spend on food each month?
- ₹10,000
- [x] ₹12,000
- ₹15,000
- ₹9,000
> 20% of 60,000.
:::

:::mcq easy
Q: What is the central angle of the Rent sector?
- 72°
- [x] 90°
- 100°
- 25°
> 25 × 3.6 = 90°.
:::

:::mcq easy
Q: How much does the family save each month?
- ₹12,000
- [x] ₹10,800
- ₹9,600
- ₹18,000
> 18% of 60,000.
:::

:::mcq easy
Q: How much is spent on Education and Transport together?
- ₹12,000
- [x] ₹15,000
- ₹18,000
- ₹9,000
> 25% of 60,000.
:::

:::mcq medium
Q: What is the central angle of the Others sector?
- 36°
- [x] 43.2°
- 48°
- 12°
> 12 × 3.6 = 43.2°.
:::

:::mcq easy
Q: By how much does Rent exceed Transport?
- ₹6,000
- [x] ₹9,000
- ₹12,000
- ₹15,000
> 15% of 60,000.
:::

:::mcq easy
Q: What is the ratio of Food to Savings?
- 9 : 10
- [x] 10 : 9
- 5 : 4
- 4 : 3
> 20 : 18.
:::

:::mcq medium
Q: Income rises by 10% and the percentages stay the same. What is the new monthly food spending?
- ₹12,600
- [x] ₹13,200
- ₹14,000
- ₹12,000
> 12,000 × 1.1.
:::

:::context
:::

:::mcq easy
Q: A sector of 54° represents what percentage of the whole?
- 12%
- [x] 15%
- 18%
- 54%
> 54/3.6 = 15.
:::

:::mcq medium
Q: Company X (500 employees) has 20% in HR; company Y (400 employees) has 25% in HR. Which has more HR staff?
- X
- Y
- [x] They have the same number
- Cannot be determined
> Both have 100.
:::

=== d-mixed-graphs | Mixed Graphs
summary: Combining two data sources, such as a pie for totals and a table for sub-percentages.
---
Mixed-graph sets give **two linked sources**. Typically one gives the totals and the other splits each total further.

**Count = overall total × first percentage × second percentage.**

## Method

1. Compute the totals per category from the first source **once**, and tabulate them.
2. Apply the second source to each category.
3. Answer every question from your derived table; don't recompute.

:::context
**A college has 2400 students.**

*Distribution by stream (pie chart):* Science 35%, Commerce 30%, Arts 25%, Others 10%.

*Percentage of female students in each stream (table):*

| Stream | Science | Commerce | Arts | Others |
|---|---|---|---|---|
| Female | 40% | 50% | 55% | 30% |
:::

:::mcq easy
Q: How many female Science students are there?
- 280
- [x] 336
- 504
- 420
> 2400 × 35% = 840 Science students, and 40% of 840 = 336.
:::

:::mcq medium
Q: Which stream has the most female students?
- Science
- [x] Commerce
- Arts
- Others
> Science 336, Commerce 360, Arts 330, Others 72.
:::

:::mcq medium
Q: How many male students are there in total?
- 1098
- [x] 1302
- 1200
- 1250
> Female total = 1098, so 2400 − 1098 = 1302 are male.
:::

:::mcq easy
Q: How many male Arts students are there?
- 330
- [x] 270
- 300
- 240
> 600 Arts students, of whom 45% are male: 270.
:::

:::mcq easy
Q: What is the ratio of female Commerce students to female Others students?
- 4 : 1
- [x] 5 : 1
- 6 : 1
- 3 : 1
> 360 : 72.
:::

:::mcq medium
Q: What percentage of all students are female?
- 42.5%
- [x] 45.75%
- 48%
- 50%
> 1098/2400 = 45.75%.
:::

:::mcq medium
Q: How many more male students does Science have than Commerce?
- 120
- [x] 144
- 168
- 180
> 504 − 360 = 144.
:::

:::mcq medium
Q: If the Others stream doubled in size with the same female percentage, how many female Others students would there be?
- 72
- [x] 144
- 96
- 120
> 480 × 30% = 144.
:::

:::context
:::

:::mcq easy
Q: A pie gives a category's share of the total, and a table gives a percentage within that category. How do you find the actual count?
- Add the two percentages
- [x] Total × category % × sub-category %
- Subtract the two percentages
- Average the two percentages
> Apply both percentages to the total.
:::

:::mcq medium
Q: 40% of 5000 people live in City A, and 30% of them use public transport. How many people in City A use public transport?
- 1500
- [x] 600
- 2000
- 1200
> 5000 × 0.4 × 0.3 = 600.
:::

=== d-caselets | Caselets
summary: Data given as a paragraph: extract it into a table or Venn diagram, then answer from that.
---
A caselet presents data **in prose**. Before answering anything, convert it into a structure:

- **Overlapping groups** (students taking subjects) → a Venn diagram
- **Categories with attributes** (items, prices, quantities) → a table

The caselet is the slowest DI type to read and the fastest to solve once organised. Spend the first minute building the table.

:::context
**Caselet 1.** A coaching centre has 300 students, each enrolled in at least one of Maths, Reasoning and English. 150 take Maths, 140 take Reasoning and 130 take English. 60 take both Maths and Reasoning, 50 take both Reasoning and English, and 40 take both Maths and English. Some take all three.
:::

:::mcq medium
Q: How many students take all three subjects?
- 20
- [x] 30
- 40
- 50
> 300 = 150 + 140 + 130 − 60 − 50 − 40 + x, so x = 30.
:::

:::mcq medium
Q: How many take only Maths?
- 70
- [x] 80
- 90
- 50
> 150 − 60 − 40 + 30 = 80.
:::

:::mcq medium
Q: How many take exactly two subjects?
- 150
- [x] 60
- 90
- 70
> (60 − 30) + (50 − 30) + (40 − 30) = 60.
:::

:::mcq medium
Q: How many take exactly one subject?
- 180
- [x] 210
- 240
- 200
> Only Maths 80, only Reasoning 60, only English 70.
:::

:::mcq easy
Q: How many take Maths and Reasoning but not English?
- 60
- [x] 30
- 20
- 40
> 60 − 30.
:::

:::mcq medium
Q: What percentage of students take only English?
- 20%
- [x] 23.33%
- 25%
- 30%
> 70/300.
:::

:::context
**Caselet 2.** A shop sold 400 items in a week. 40% were shirts; the rest were trousers and jackets in the ratio 3 : 1. Shirts sell for ₹500, trousers for ₹800 and jackets for ₹2000.
:::

:::mcq easy
Q: How many jackets were sold?
- 80
- [x] 60
- 100
- 120
> 240 non-shirts split 3 : 1 gives 180 trousers and 60 jackets.
:::

:::mcq medium
Q: What was the total revenue?
- ₹3,20,000
- [x] ₹3,44,000
- ₹3,60,000
- ₹3,04,000
> 80,000 (shirts) + 1,44,000 (trousers) + 1,20,000 (jackets).
:::

:::mcq medium
Q: Which item earned the most revenue?
- Shirts
- [x] Trousers
- Jackets
- Shirts and jackets equally
> Trousers earned ₹1,44,000.
:::

:::mcq hard
Q: Approximately what share of total revenue came from jackets?
- 30%
- [x] 34.9%
- 40%
- 25%
> 1,20,000/3,44,000 ≈ 34.9%.
:::

:::context
:::

=== d-missing-data | Missing Data
summary: Filling blanks in a table using row and column totals, then answering questions.
---
Some cells are blank, but the **totals** let you work them out. Fill in **every** blank first; questions often depend on several.

## Order of attack

1. Look for a row or column with **only one blank**, and fill it from the total.
2. Each newly filled cell may leave another row or column with a single blank.
3. Check that the row totals and column totals add up to the same grand total.

:::context
**Production of four factories (units)**

| Factory | Q1 | Q2 | Total |
|---|---|---|---|
| P | 120 | ? | 270 |
| Q | ? | 180 | 330 |
| R | 90 | 110 | ? |
| S | ? | ? | 260 |
| **Total** | 470 | ? | ? |
:::

:::mcq easy
Q: What was factory P's Q2 production?
- 120
- [x] 150
- 170
- 140
> 270 − 120 = 150.
:::

:::mcq easy
Q: What was factory Q's Q1 production?
- 130
- [x] 150
- 180
- 160
> 330 − 180 = 150.
:::

:::mcq medium
Q: What was factory S's Q1 production?
- 100
- [x] 110
- 120
- 150
> 470 − (120 + 150 + 90) = 110.
:::

:::mcq medium
Q: What was the total Q2 production?
- 560
- [x] 590
- 600
- 620
> 150 + 180 + 110 + 150 = 590 (S's Q2 = 260 − 110 = 150).
:::

:::mcq medium
Q: Which factory produced the most in Q2?
- P
- [x] Q
- S
- R
> Q produced 180; P and S produced 150 each.
:::

:::mcq easy
Q: What was the grand total production?
- 1000
- [x] 1060
- 1100
- 1040
> 470 + 590, which also equals 270 + 330 + 200 + 260.
:::

:::mcq medium
Q: Approximately what percentage of total production came from factory R?
- 16.5%
- [x] 18.9%
- 20%
- 21.2%
> R's total is 200, and 200/1060 ≈ 18.9%.
:::

:::mcq medium
Q: S's Q2 production is approximately what percentage of S's total?
- 42.3%
- [x] 57.7%
- 50%
- 60%
> 150/260 ≈ 57.7%.
:::

:::context
:::

:::mcq easy
Q: Five values average 40. Four of them are 30, 45, 50 and 35. What is the fifth?
- 35
- [x] 40
- 45
- 50
> 200 − 160 = 40.
:::

:::mcq medium
Q: A pie chart's sectors are 30%, 25%, x% and 2x%. What is x?
- 10
- [x] 15
- 20
- 22.5
> 3x = 45.
:::
