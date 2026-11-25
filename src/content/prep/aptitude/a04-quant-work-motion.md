=== q-time-work | Time and Work
summary: Work rates, the LCM-units method, efficiency ratios and man-days.
---
If someone can finish a job in n days, they do **1/n of it per day**. Rates add when people work together.

## Two methods

**Fractions.** A takes 10 days and B takes 15. Together they do 1/10 + 1/15 = 1/6 of the job per day, so they finish in **6 days**.

**LCM units (usually faster).** Let the job be LCM(10, 15) = 30 units. A does 3 units a day and B does 2, so together they do 5 units a day and need 30/5 = **6 days**.

## Efficiency

If A is twice as efficient as B, A does 2 units a day for every 1 that B does, and A needs **half** of B's time.

## Man-days

When work is the same, **M₁ × D₁ × H₁ = M₂ × D₂ × H₂** (men × days × hours per day).
- 20 men, 8 hours a day, 15 days → 24 men at 10 hours a day need 20·8·15/(24·10) = **10 days**.

## Pairs

If A+B, B+C and C+A take x, y and z days, then 2(A + B + C) = 1/x + 1/y + 1/z. From the total of all three, subtract a pair to find one person.

**Example.** Pairs take 12, 15 and 20 days. 1/12 + 1/15 + 1/20 = 1/5 is twice the combined rate, so all three do 1/10 a day and need 10 days. A alone = 1/10 − 1/15 = 1/30, so **30 days**.

## Someone leaves partway

Work out what has been done so far, then give the rest to whoever remains.

:::mcq easy
Q: A can finish a job in 10 days and B in 15 days. How long do they take together?
- 5 days
- [x] 6 days
- 8 days
- 12.5 days
> 1/10 + 1/15 = 1/6.
:::

:::mcq easy
Q: A and B together finish a job in 12 days; A alone takes 20 days. How long does B take alone?
- 25 days
- [x] 30 days
- 32 days
- 8 days
> 1/12 − 1/20 = 2/60 = 1/30.
:::

:::mcq medium
Q: A is twice as efficient as B, and together they finish a job in 14 days. How long would A take alone?
- 28 days
- [x] 21 days
- 18 days
- 42 days
> The rates are 2 : 1, so the job is 3 × 14 = 42 units. A does 2 a day: 21 days.
:::

:::mcq easy
Q: 12 men finish a job in 18 days. How long would 18 men take?
- 27 days
- [x] 12 days
- 15 days
- 9 days
> 12 × 18 = 216 man-days, and 216/18 = 12 days.
:::

:::mcq medium
Q: A takes 20 days and B takes 30 days. A works for 5 days and leaves. How long does B take to finish?
- 20 days
- [x] 22.5 days
- 25 days
- 15 days
> A did 5/20 = 1/4, so 3/4 remains. B needs 3/4 × 30 = 22.5 days.
:::

:::mcq easy
Q: A, B and C can finish a job in 10, 12 and 15 days. How long do they take together?
- 3 days
- [x] 4 days
- 5 days
- 6 days
> With 60 units, the rates are 6 + 5 + 4 = 15 units a day, so 4 days.
:::

:::mcq medium
Q: 10 men or 15 women can finish a job in 30 days. How long will 10 men and 15 women take together?
- 20 days
- [x] 15 days
- 12 days
- 10 days
> The two groups have equal output, so working together doubles the rate: 15 days.
:::

:::mcq medium
Q: 20 men working 8 hours a day finish a job in 15 days. How long would 24 men working 10 hours a day take?
- 12 days
- [x] 10 days
- 8 days
- 9 days
> 20 × 8 × 15 = 24 × 10 × D, so D = 10.
:::

:::mcq medium
Q: A can do 1/3 of a job in 5 days, and B can do 2/5 of it in 10 days. How long do they take together?
- 9 days
- [x] 9⅜ days
- 10 days
- 8½ days
> A alone takes 15 days and B 25 days. 1/15 + 1/25 = 8/75, so 75/8 = 9⅜ days.
:::

:::mcq hard
Q: A and B can finish a job in 12 days, B and C in 15 days, and C and A in 20 days. How long would A take alone?
- 24 days
- [x] 30 days
- 40 days
- 60 days
> All three together do 1/10 a day. A = 1/10 − 1/15 (B+C) = 1/30.
:::

=== q-pipes-cisterns | Pipes and Cisterns
summary: Inlets and outlets as positive and negative work, leaks, and pipes opened or closed partway.
---
Pipes are time-and-work with a sign: **inlets add** to the tank and **outlets or leaks subtract**.

## Net rate

Net rate = Σ(1/inlet time) − Σ(1/outlet time).

**Example.** A fills in 12 h, B fills in 15 h and C empties in 20 h. 1/12 + 1/15 − 1/20 = (5 + 4 − 3)/60 = 1/10, so all three together fill it in **10 h**.

## Leaks

A pipe normally fills in a hours, but with a leak takes b hours. The leak alone empties a full tank in **ab/(b − a)** hours.
For 6 and 8: 48/2 = **24 h**.

## Finding capacity

Convert the rate in litres into a fraction of the tank.

**Example.** A leak empties a full tank in 8 h. When an inlet pouring in 6 L/min (360 L/h) is opened, the tank instead empties in 12 h.
C/8 − 360 = C/12 → C/24 = 360 → C = **8640 L**.

## Pipes switched mid-way

Compute the fraction filled while all pipes are on, then let the remaining pipe finish.

## Alternating pipes

Group the hours into cycles, and watch for the tank filling partway through a cycle.

:::mcq easy
Q: Pipe A fills a tank in 20 minutes and pipe B in 30 minutes. How long do both take together?
- 10 min
- [x] 12 min
- 15 min
- 25 min
> 1/20 + 1/30 = 1/12.
:::

:::mcq easy
Q: Pipe A fills a tank in 10 hours and pipe B empties it in 15 hours. If both are open, how long does the tank take to fill?
- 25 h
- [x] 30 h
- 20 h
- 6 h
> 1/10 − 1/15 = 1/30.
:::

:::mcq medium
Q: A and B fill a tank in 12 h and 15 h; C empties it in 20 h. With all three open, how long does it take to fill?
- 8 h
- [x] 10 h
- 12 h
- 15 h
> (5 + 4 − 3)/60 = 1/10.
:::

:::mcq medium
Q: A pipe fills a tank in 6 hours, but because of a leak it takes 8 hours. How long would the leak take to empty a full tank?
- 16 h
- [x] 24 h
- 14 h
- 48 h
> 6 × 8/(8 − 6) = 24.
:::

:::mcq medium
Q: Two pipes fill a tank in 4 h and 6 h. Opened together, how long do they take to fill 3/4 of it?
- 1 h 30 min
- [x] 1 h 48 min
- 2 h
- 2 h 24 min
> Together they fill 5/12 per hour (full tank in 2.4 h). 3/4 × 2.4 = 1.8 h = 1 h 48 min.
:::

:::mcq hard
Q: A leak empties a full tank in 8 h. When an inlet adding 6 L/min is also opened, the tank empties in 12 h. What is the capacity?
- 5760 L
- [x] 8640 L
- 7200 L
- 9600 L
> C/8 − 360 = C/12, so C/24 = 360 and C = 8640.
:::

:::mcq medium
Q: A fills a tank in 12 min and B in 18 min. Both are opened for 4 min, then A is closed. How much longer does B take to fill the tank?
- 6 min
- [x] 8 min
- 10 min
- 9 min
> In 4 min: 4 × 5/36 = 5/9 filled. The remaining 4/9 takes B 8 min.
:::

:::mcq medium
Q: A and B fill a tank in 30 and 20 minutes. With outlet C also open, the tank fills in 24 minutes. How long would C take to empty a full tank?
- 20 min
- [x] 24 min
- 30 min
- 40 min
> 1/30 + 1/20 − 1/c = 1/24 gives 1/c = 1/12 − 1/24 = 1/24.
:::

:::mcq medium
Q: One pipe fills 3 times as fast as another, and together they fill a tank in 36 minutes. How long does the slower pipe take alone?
- 108 min
- [x] 144 min
- 48 min
- 72 min
> The rates are 3 : 1, so the tank is 4 × 36 = 144 units. The slower pipe does 1 unit a minute.
:::

:::mcq hard
Q: Pipes A (6 h) and B (4 h) are opened alternately for one hour each, starting with A. When is the tank full?
- 4 h
- [x] 5 h
- 4 h 30 min
- 6 h
> Each 2-hour cycle fills 5/12, so after 4 h 10/12 is full. A's 5th hour adds 1/6 = 2/12, which completes it exactly at 5 h.
:::

=== q-work-wages | Work and Wages
summary: Sharing payment by work done, efficiency ratios and helpers paid for their fraction.
---
**Wages are paid for work done, not for time spent.** When people work the same number of days, their shares are in the ratio of their efficiencies, which is the inverse ratio of the times they would take alone.

## Recipe

1. Find each person's share of the total work (as a fraction or in units).
2. Divide the money in that ratio.

**Example.** A, B and C take 6, 8 and 12 days. Their rates are 1/6 : 1/8 : 1/12 = 4 : 3 : 2. Out of ₹1350, C gets 1350 × 2/9 = **₹300**.

**Example (helper).** A and B finish in 8 days. With C's help it takes 6 days. In 6 days A and B do 6/8 = 3/4, so C did 1/4 of the work and gets 1/4 of the money.

## Pairs

If A + B do 7/11 of the work and B + C do 8/11, then C = 1 − 7/11 = 4/11 and A = 1 − 8/11 = 3/11.

## Daily wage rates

If 3 men do as much as 5 women, a man's daily wage is 5/3 of a woman's.

:::mcq easy
Q: A finishes a job in 10 days and B in 15 days. Working together they are paid ₹5000. What is A's share?
- ₹2000
- [x] ₹3000
- ₹2500
- ₹3333
> The rates are 3 : 2, so A gets 5000 × 3/5 = 3000.
:::

:::mcq medium
Q: A, B and C take 6, 8 and 12 days for a job and are paid ₹1350 together. What is C's share?
- ₹450
- [x] ₹300
- ₹337.50
- ₹270
> The rates are 4 : 3 : 2, so C gets 1350 × 2/9 = 300.
:::

:::mcq medium
Q: A and B can finish a job in 8 days for ₹4000. With C's help it is done in 6 days. What is C's share?
- ₹800
- [x] ₹1000
- ₹1200
- ₹1333
> A and B do 6/8 = 3/4 in 6 days, so C did 1/4, worth 4000/4 = 1000.
:::

:::mcq medium
Q: A works alone for 5 days of a 15-day job. B then finishes it in 10 days. Out of ₹900, what is A's share?
- ₹450
- [x] ₹300
- ₹600
- ₹180
> A completed 5/15 = 1/3 of the work, so A gets ₹300.
:::

:::mcq easy
Q: 10 men earn ₹4000 in 8 days. At the same rate, how much do 15 men earn in 6 days?
- ₹4000
- [x] ₹4500
- ₹5000
- ₹6000
> ₹4000/80 man-days = ₹50 each. 90 man-days × ₹50 = ₹4500.
:::

:::mcq easy
Q: A is 50% more efficient than B. Working together they earn ₹1000. What is A's share?
- ₹500
- [x] ₹600
- ₹667
- ₹750
> The rates are 1.5 : 1 = 3 : 2, so A gets 600.
:::

:::mcq medium
Q: A and B together finish a job in 12 days; A alone takes 20 days. Out of ₹1800, what is B's share?
- ₹1080
- [x] ₹720
- ₹900
- ₹600
> B's rate = 1/12 − 1/20 = 1/30. A : B = 1/20 : 1/30 = 3 : 2, so B gets 720.
:::

:::mcq easy
Q: A takes 9 days and B takes 18 days for a job. Working together they earn ₹450. What is B's share?
- ₹225
- [x] ₹150
- ₹300
- ₹180
> A : B = 2 : 1, so B gets 150.
:::

:::mcq medium
Q: 3 men do as much work as 5 women. If a woman earns ₹300 a day, what should a man earn a day?
- ₹180
- [x] ₹500
- ₹450
- ₹400
> One man = 5/3 women, and 5/3 × 300 = 500.
:::

:::mcq hard
Q: A, B and C take a contract for ₹5500. A and B together do 7/11 of the work, and B and C together do 8/11. What is A's share?
- ₹2000
- [x] ₹1500
- ₹2500
- ₹1000
> C = 1 − 7/11 = 4/11 and A = 1 − 8/11 = 3/11, so A gets 5500 × 3/11 = 1500.
:::

=== q-tsd | Time, Speed and Distance
summary: Distance = speed × time, unit conversion, relative speed, constant-distance ratios and average speed.
---
**Distance = Speed × Time.** Everything else follows from this and from keeping units consistent.

## Units

- km/h → m/s: multiply by **5/18** (72 km/h = 20 m/s)
- m/s → km/h: multiply by **18/5**

## Proportionality

- Same time: distance ∝ speed
- Same distance: time ∝ 1/speed. If speeds are 3 : 4, times are **4 : 3**.

**Usual-time trick.** Walking at 4/5 of the usual speed takes 5/4 of the usual time, so the extra is 1/4 of the usual time. If that extra is 10 minutes, the usual time is **40 minutes**.

## Relative speed

- Moving **towards** each other: add the speeds.
- Moving in the **same direction**: subtract the speeds.

Two people 30 km apart walk towards each other at 4 and 6 km/h, so they meet in 30/10 = **3 h**.

## Average speed

Average speed = **total distance ÷ total time**. For two equal distances, it is 2uv/(u + v).

## After meeting

Two objects start towards each other and, after meeting, take t₁ and t₂ more hours to reach the other ends. Then
**S₁ : S₂ = √t₂ : √t₁**.

:::mcq easy
Q: What is 72 km/h in m/s?
- 18
- [x] 20
- 25
- 22
> 72 × 5/18 = 20.
:::

:::mcq easy
Q: A car travels 300 km in 5 hours. What is its speed?
- 50 km/h
- [x] 60 km/h
- 65 km/h
- 75 km/h
> 300/5 = 60.
:::

:::mcq medium
Q: A man reaches his office 10 minutes earlier walking at 6 km/h than at 5 km/h. How far is the office?
- 4 km
- [x] 5 km
- 6 km
- 3 km
> d/5 − d/6 = 1/6 h, so d/30 = 1/6 and d = 5.
:::

:::mcq medium
Q: A car covers 600 km. If it went 20 km/h faster, it would take 1 hour less. What is its speed?
- 80 km/h
- [x] 100 km/h
- 120 km/h
- 90 km/h
> 600/s − 600/(s + 20) = 1 gives s² + 20s − 12000 = 0, so s = 100.
:::

:::mcq medium
Q: Two people cover the same distance at speeds in the ratio 3 : 4. The slower takes 20 minutes longer. How long does the slower take?
- 60 min
- [x] 80 min
- 70 min
- 90 min
> The times are 4x and 3x, with x = 20, so the slower takes 80 min.
:::

:::mcq easy
Q: Two people 30 km apart walk towards each other at 4 km/h and 6 km/h. When do they meet?
- 2 h
- [x] 3 h
- 5 h
- 2.5 h
> 30/(4 + 6) = 3 h.
:::

:::mcq medium
Q: Walking at 4/5 of his usual speed, a man is 10 minutes late. What is his usual time?
- 30 min
- [x] 40 min
- 50 min
- 45 min
> The time becomes 5/4 of usual, so the extra 1/4 equals 10 min and the usual time is 40 min.
:::

:::mcq medium
Q: A thief 100 m ahead runs at 8 km/h, chased by a policeman at 10 km/h. How far does the thief run before being caught?
- 300 m
- [x] 400 m
- 500 m
- 250 m
> The policeman gains 2 km/h, so catching up takes 0.1/2 = 0.05 h. In that time the thief runs 8 × 0.05 km = 400 m.
:::

:::mcq easy
Q: A man goes to a town at 30 km/h and returns at 20 km/h. What is his average speed?
- 25 km/h
- [x] 24 km/h
- 26 km/h
- 22 km/h
> 2 × 30 × 20/50 = 24.
:::

:::mcq hard
Q: Two cars start towards each other from opposite ends. After meeting, one takes 1.8 h and the other 0.8 h to reach the other end. What is the ratio of their speeds?
- 9 : 4
- [x] 2 : 3
- 4 : 9
- 3 : 2
> S₁ : S₂ = √t₂ : √t₁ = √0.8 : √1.8 = 2 : 3.
:::

=== q-trains | Problems on Trains
summary: Crossing poles, platforms and other trains, using lengths and relative speed.
---
A train crossing something must cover **its own length plus the length of the object**.

| Train crosses | Distance covered | Speed used |
|---|---|---|
| A pole, person or signal | Train length L | Train speed |
| A platform or bridge of length P | L + P | Train speed |
| Another train (lengths L₁, L₂), opposite direction | L₁ + L₂ | S₁ + S₂ |
| Another train, same direction | L₁ + L₂ | S₁ − S₂ |
| A person walking | L | Train speed ± person speed |

:::tip
Convert km/h to m/s (× 5/18) before mixing with metres. 54 km/h = 15 m/s, 72 = 20, 90 = 25, 36 = 10, 18 = 5.
:::

## Finding the length from two crossings

A train crosses a pole in 15 s and a 100 m platform in 25 s. The extra 10 s covers the extra 100 m, so v = 10 m/s and L = **150 m**.

## Two trains, two directions

If two equal trains cross in t₁ seconds going opposite ways and t₂ seconds going the same way, then sum and difference of speeds = total length / t₁ and total length / t₂. Solve the pair for the speeds.

:::mcq easy
Q: A 150 m train runs at 54 km/h. How long does it take to pass a pole?
- 8 s
- [x] 10 s
- 12 s
- 15 s
> 54 km/h = 15 m/s, and 150/15 = 10 s.
:::

:::mcq easy
Q: A 200 m train at 72 km/h crosses a 300 m platform. How long does it take?
- 15 s
- [x] 25 s
- 20 s
- 10 s
> 500 m at 20 m/s = 25 s.
:::

:::mcq medium
Q: Trains 120 m and 180 m long run in opposite directions at 40 km/h and 50 km/h. How long do they take to cross each other?
- 10 s
- [x] 12 s
- 15 s
- 18 s
> 90 km/h = 25 m/s, and 300/25 = 12 s.
:::

:::mcq medium
Q: Trains 150 m and 120 m long run in the same direction at 60 km/h and 42 km/h. How long does the faster take to pass the slower?
- 45 s
- [x] 54 s
- 60 s
- 27 s
> The relative speed is 18 km/h = 5 m/s, and 270/5 = 54 s.
:::

:::mcq medium
Q: A train passes a pole in 15 seconds and a 100 m platform in 25 seconds. How long is the train?
- 100 m
- [x] 150 m
- 200 m
- 125 m
> The extra 100 m takes 10 s, so v = 10 m/s and L = 150 m.
:::

:::mcq medium
Q: A 240 m train passes a man walking at 6 km/h in the same direction in 24 seconds. What is the train's speed?
- 36 km/h
- [x] 42 km/h
- 48 km/h
- 30 km/h
> The relative speed is 240/24 = 10 m/s = 36 km/h, so the train goes 36 + 6 = 42 km/h.
:::

:::mcq medium
Q: A 200 m train at 90 km/h crosses a bridge in 36 seconds. How long is the bridge?
- 600 m
- [x] 700 m
- 900 m
- 750 m
> 25 m/s × 36 s = 900 m, and 900 − 200 = 700 m.
:::

:::mcq hard
Q: Two trains, each 150 m long, cross each other in 10 s running in opposite directions and in 30 s running in the same direction. What is the faster train's speed?
- 54 km/h
- [x] 72 km/h
- 60 km/h
- 90 km/h
> Sum of speeds = 300/10 = 30 m/s and difference = 300/30 = 10 m/s, so the faster goes 20 m/s = 72 km/h.
:::

:::mcq easy
Q: A 300 m train at 36 km/h passes through a 200 m tunnel. How long does it take?
- 30 s
- [x] 50 s
- 20 s
- 40 s
> 500 m at 10 m/s = 50 s.
:::

:::mcq medium
Q: Two trains start at the same time from P and Q, 300 km apart, towards each other at 60 km/h and 40 km/h. How far from P do they meet?
- 150 km
- [x] 180 km
- 120 km
- 200 km
> They meet after 300/100 = 3 h, by which time the first has gone 60 × 3 = 180 km from P.
:::

=== q-boats-streams | Boats and Streams
summary: Downstream and upstream speeds, finding the speed of the boat and of the stream, and round trips.
---
With boat speed b (in still water) and stream speed s:

- **Downstream** (with the current): **b + s**
- **Upstream** (against the current): **b − s**

Going the other way:
- b = (downstream + upstream)/2
- s = (downstream − upstream)/2

**Example.** Downstream 16 km/h and upstream 10 km/h give b = **13** and s = **3**.

## Round trips

The time for distance d each way is d/(b + s) + d/(b − s). The average speed for the round trip is

**(b + s)(b − s)/b = (b² − s²)/b**, which is always slower than in still water.

## Ratio problems

If going upstream takes k times as long as going downstream, then b + s = k(b − s).
For k = 2: b = 3s, so **b : s = 3 : 1**.

:::mcq easy
Q: A boat goes 10 km/h in still water and the stream flows at 2 km/h. What is its downstream speed?
- 8 km/h
- [x] 12 km/h
- 10 km/h
- 20 km/h
> b + s = 12.
:::

:::mcq easy
Q: A boat goes 16 km/h downstream and 10 km/h upstream. What is its speed in still water?
- 12 km/h
- [x] 13 km/h
- 14 km/h
- 6 km/h
> (16 + 10)/2 = 13.
:::

:::mcq easy
Q: Downstream speed is 16 km/h and upstream speed is 10 km/h. What is the speed of the stream?
- 2 km/h
- [x] 3 km/h
- 6 km/h
- 4 km/h
> (16 − 10)/2 = 3.
:::

:::mcq medium
Q: A boat goes 30 km downstream in 2 h and returns in 3 h. What is the speed of the stream?
- 2 km/h
- [x] 2.5 km/h
- 5 km/h
- 3 km/h
> Downstream 15 and upstream 10, so s = 2.5.
:::

:::mcq medium
Q: A man rows at 8 km/h in still water on a river flowing at 2 km/h. How long does he take to row 15 km and back?
- 3.75 h
- [x] 4 h
- 4.5 h
- 3.5 h
> 15/10 + 15/6 = 1.5 + 2.5 = 4 h.
:::

:::mcq medium
Q: Rowing upstream takes twice as long as rowing downstream. What is the ratio of the boat's speed to the stream's?
- 2 : 1
- [x] 3 : 1
- 4 : 1
- 3 : 2
> b + s = 2(b − s), so b = 3s.
:::

:::mcq hard
Q: A man rows at 6 km/h in still water on a river flowing at 1.2 km/h. A round trip to a place takes 1 hour. How far is the place?
- 2.4 km
- [x] 2.88 km
- 3 km
- 2.5 km
> d/7.2 + d/4.8 = 1. With LCM 14.4: (2d + 3d)/14.4 = 1, so d = 2.88.
:::

:::mcq easy
Q: A swimmer covers 12 km downstream in 2 h and 4 km upstream in 2 h. What is his speed in still water?
- 3 km/h
- [x] 4 km/h
- 5 km/h
- 6 km/h
> Downstream 6 and upstream 2, so the still-water speed is (6 + 2)/2 = 4.
:::

:::mcq hard
Q: A boat goes 15 km/h in still water and makes a 30 km trip downstream and back in 4.5 hours. What is the speed of the stream?
- 3 km/h
- [x] 5 km/h
- 4 km/h
- 6 km/h
> 30/(15 + s) + 30/(15 − s) = 4.5 gives 900/(225 − s²) = 4.5, so s² = 25 and s = 5.
:::

:::mcq medium
Q: A boat goes 12 km/h in still water and the stream flows at 4 km/h. What is its average speed for a round trip?
- 12 km/h
- [x] 10.67 km/h
- 8 km/h
- 11 km/h
> (b² − s²)/b = (144 − 16)/12 = 10.67.
:::

=== q-races-games | Races and Games
summary: Beating by distance or time, head starts, three-runner races and circular tracks.
---
In a race of length D, "**A beats B by x metres**" means that when A finishes D, B has run D − x. So their speeds are in the ratio **D : (D − x)**.

## Three runners

Chain the ratios. In a 1000 m race A beats B by 100 m and B beats C by 100 m:
when A runs 1000, B runs 900 and C runs 900 × 900/1000 = 810. So A beats C by **190 m**.

## Beating by time

"A beats B by t seconds" means B needs t more seconds to finish. If B's speed is known, B's time is D/v_B and A's time is that minus t.

## Head starts

If A gives B a start of x m and they finish together, A runs D while B runs D − x in the same time.

## Circular tracks (length L, speeds a > b, same start)

| Question | Answer |
|---|---|
| First meeting, same direction | L/(a − b) |
| First meeting, opposite directions | L/(a + b) |
| First meeting at the start point | LCM of the lap times L/a and L/b |

## Games of points

"In a game of 100, A can give B 20 points" means that when A scores 100, B scores 80.

:::mcq easy
Q: In a 100 m race, A beats B by 20 m. What is the ratio of their speeds?
- 4 : 5
- [x] 5 : 4
- 6 : 5
- 5 : 3
> When A runs 100, B runs 80: 100 : 80 = 5 : 4.
:::

:::mcq medium
Q: In a 1 km race, A beats B by 100 m and B beats C by 100 m. By how much does A beat C?
- 200 m
- [x] 190 m
- 180 m
- 210 m
> When A runs 1000, B runs 900 and C runs 810, so A wins by 190 m.
:::

:::mcq easy
Q: A gives B a 10 m start in a 100 m race and they finish together. What is the ratio of their speeds?
- 11 : 10
- [x] 10 : 9
- 9 : 10
- 10 : 8
> In the same time A runs 100 and B runs 90.
:::

:::mcq medium
Q: In a 200 m race A beats B by 10 seconds. B runs at 5 m/s. What is A's time?
- 40 s
- [x] 30 s
- 35 s
- 25 s
> B takes 200/5 = 40 s, so A takes 30 s.
:::

:::mcq medium
Q: In a 100 m race A beats B by 25 m, and B beats C by 20 m. By how much does A beat C?
- 45 m
- [x] 40 m
- 35 m
- 50 m
> When A runs 100, B runs 75 and C runs 75 × 0.8 = 60.
:::

:::mcq easy
Q: A and B run on a 600 m circular track at 4 m/s and 6 m/s in the same direction from the same point. When do they first meet?
- 60 s
- [x] 300 s
- 150 s
- 100 s
> L/(a − b) = 600/2 = 300 s.
:::

:::mcq easy
Q: On the same 600 m track, running in opposite directions at 4 m/s and 6 m/s, when do they first meet?
- 100 s
- [x] 60 s
- 300 s
- 150 s
> L/(a + b) = 600/10 = 60 s.
:::

:::mcq medium
Q: On a 600 m track, runners at 4 m/s and 6 m/s start together. When do they first meet at the starting point?
- 150 s
- [x] 300 s
- 600 s
- 100 s
> Lap times are 150 s and 100 s, and LCM(150, 100) = 300 s.
:::

:::mcq hard
Q: In a game of 100 points, A can give B 20 points and C 25 points. How many points can B give C in a game of 100?
- 5
- [x] 6.25
- 7.5
- 4
> B : C = 80 : 75. When B scores 100, C scores 93.75, so B can give 6.25 points.
:::

:::mcq hard
Q: A runs 1¾ times as fast as B. If A gives B an 84 m start, how long should the race be for them to finish together?
- 168 m
- [x] 196 m
- 210 m
- 224 m
> The speeds are 7 : 4, so d/7 = (d − 84)/4, giving 3d = 588 and d = 196.
:::
