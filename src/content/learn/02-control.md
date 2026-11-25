=== if-else | Conditionals: if / else
summary: Make decisions — run code only when a condition is true.
practice: even-or-odd, grade-calculator, leap-year
---
Programs constantly choose between paths: *if the password is correct, log in; otherwise show an error*. A **conditional** runs a block of code only when its condition evaluates to true.

## if, else if, else

```python title="Grading a score"
score = 78

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print("Grade:", grade)
```
```java
public class Main {
    public static void main(String[] args) {
        int score = 78;
        String grade;

        if (score >= 90) {
            grade = "A";
        } else if (score >= 80) {
            grade = "B";
        } else if (score >= 70) {
            grade = "C";
        } else {
            grade = "F";
        }

        System.out.println("Grade: " + grade);
    }
}
```
```output
Grade: C
```

Conditions are checked **top to bottom**, and only the **first** true branch runs. That is why `score >= 80` doesn't also need `score < 90` — if the score were 90+, the first branch would already have run.

:::compare
- Python: `if cond:` / `elif cond:` / `else:` — a colon, then an **indented** block. No parentheses needed.
- Java: `if (cond) { … } else if (cond) { … } else { … }` — parentheses around the condition are required; braces group the block.
- Java conditions must be `boolean`. `if (count)` does not compile. Python accepts any value and uses *truthiness*: `0`, `""`, `[]`, `{}` and `None` are false; everything else is true.
:::

## Nested conditions and logical operators

```python title="Two equivalent ways"
age, has_ticket = 20, True

if age >= 18:
    if has_ticket:
        print("Enter")

if age >= 18 and has_ticket:
    print("Enter (flattened)")
```
```java
public class Main {
    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;

        if (age >= 18) {
            if (hasTicket) {
                System.out.println("Enter");
            }
        }

        if (age >= 18 && hasTicket) {
            System.out.println("Enter (flattened)");
        }
    }
}
```
```output
Enter
Enter (flattened)
```

Prefer the flat version — fewer levels of indentation are easier to read.

## Conditional expressions

```python
n = 7
parity = "even" if n % 2 == 0 else "odd"
print(parity)
```
```java
public class Main {
    public static void main(String[] args) {
        int n = 7;
        String parity = (n % 2 == 0) ? "even" : "odd";
        System.out.println(parity);
    }
}
```
```output
odd
```

Python's form reads like English (`value_if_true if condition else value_if_false`); Java uses the **ternary** operator `condition ? a : b`.

:::warning
- Writing `=` (assignment) instead of `==` (comparison). Java rejects `if (x = 5)` for ints; Python rejects `if x = 5:`.
- Python: forgetting the colon or mis-indenting the block.
- Java: omitting braces for a one-line `if` and later adding a second line — only the first line is actually inside the `if`. Always use braces.
:::

:::quiz
Q: With `x = 15`, which branch runs?

```
if x > 10: print("A")
elif x > 5: print("B")
else: print("C")
```
- Both A and B
- [x] Only A
- Only B
- C
> Only the first true branch executes. Once `x > 10` matches, the rest is skipped.
:::

=== switch-match | Switch & Match
summary: Choose between many fixed options cleanly.
---
When one value is compared against many constants, a long `if/elif` chain gets noisy. Java has `switch`; Python 3.10+ has `match`.

## Matching a value

```python title="Day name from a number"
day = 3

match day:
    case 1:
        name = "Monday"
    case 2:
        name = "Tuesday"
    case 3:
        name = "Wednesday"
    case 6 | 7:
        name = "Weekend"
    case _:
        name = "Unknown"

print(name)
```
```java
public class Main {
    public static void main(String[] args) {
        int day = 3;
        String name = switch (day) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 6, 7 -> "Weekend";
            default -> "Unknown";
        };
        System.out.println(name);
    }
}
```
```output
Wednesday
```

:::compare
- Python's `case _:` is the fallback; Java's is `default`.
- `case 6 | 7` (Python) and `case 6, 7` (Java) match several values.
- Java's **arrow** form (`->`, Java 14+) never falls through and can produce a value. The classic `case 1: … break;` form **falls through** to the next case if you forget `break` — a common bug.
- Python's `match` is *structural pattern matching*: it can also destructure sequences and objects (`case [x, y]:`, `case Point(x=0):`), which is far more powerful than a plain switch.
:::

## Classic Java switch with fall-through

```java title="Fall-through (classic syntax)"
public class Main {
    public static void main(String[] args) {
        char grade = 'B';
        switch (grade) {
            case 'A':
            case 'B':
                System.out.println("Good");
                break;
            case 'C':
                System.out.println("OK");
                break;
            default:
                System.out.println("Try again");
        }
    }
}
```
```output
Good
```

:::python
Before Python 3.10, the idiom was a dictionary lookup: `{1: "Mon", 2: "Tue"}.get(day, "Unknown")`. It still works well for simple value-to-value mappings.
:::

=== for-loop | For Loops
summary: Repeat code for each item in a sequence or for a counted number of times.
practice: sum-to-n, fizzbuzz, multiplication-table
---
A **loop** repeats a block of code. A `for` loop is the natural choice when you know *what* you are iterating over — a range of numbers, the items of a list, the characters of a string.

## Counting with a range

```python title="Count from 0 to 4"
for i in range(5):
    print("Iteration", i)
```
```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteration " + i);
        }
    }
}
```
```output
Iteration 0
Iteration 1
Iteration 2
Iteration 3
Iteration 4
```

:::compare
- Python's `range(5)` produces 0, 1, 2, 3, 4 — the **stop value is excluded**. `range(start, stop, step)` gives full control: `range(10, 0, -2)` → 10, 8, 6, 4, 2.
- Java's classic `for` has three parts: **initialise** (`int i = 0`), **condition** checked before each iteration (`i < 5`), and **update** after each iteration (`i++`).
- In Java, `i` exists only inside the loop. In Python the loop variable remains defined after the loop ends, holding its last value.
:::

:::viz array 0,1,2,3,4 | ptr=0:i | caption=range(5) visits each index once, stopping before 5
:::

## Iterating over items

```python title="For-each over a list"
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit.upper())

for index, fruit in enumerate(fruits):
    print(index, fruit)
```
```java
public class Main {
    public static void main(String[] args) {
        String[] fruits = {"apple", "banana", "cherry"};
        for (String fruit : fruits) {
            System.out.println(fruit.toUpperCase());
        }

        for (int index = 0; index < fruits.length; index++) {
            System.out.println(index + " " + fruits[index]);
        }
    }
}
```
```output
APPLE
BANANA
CHERRY
0 apple
1 banana
2 cherry
```

Python's `for` is **always** a for-each loop. When you need the index too, use `enumerate`. Java's enhanced for (`for (Type x : collection)`) gives items; use the classic form when you need the index.

## Accumulating a result

A very common loop pattern: start with an initial value and update it on every iteration.

```python title="Sum and maximum"
nums = [4, 9, 2, 7]
total = 0
largest = nums[0]
for x in nums:
    total += x
    if x > largest:
        largest = x
print("total =", total, "largest =", largest)
```
```java
public class Main {
    public static void main(String[] args) {
        int[] nums = {4, 9, 2, 7};
        int total = 0;
        int largest = nums[0];
        for (int x : nums) {
            total += x;
            if (x > largest) {
                largest = x;
            }
        }
        System.out.println("total = " + total + " largest = " + largest);
    }
}
```
```output
total = 22 largest = 9
```

Press **Visualize** on this example to watch `total` and `largest` change on every iteration.

## Dry run

| Iteration | `x` | `total` after | `largest` after |
|---|---|---|---|
| 1 | 4 | 4 | 4 |
| 2 | 9 | 13 | 9 |
| 3 | 2 | 15 | 9 |
| 4 | 7 | 22 | 9 |

:::warning
- **Off-by-one:** `range(1, n)` stops at `n-1`. To include `n`, use `range(1, n + 1)`. In Java, `i <= n` vs `i < n`.
- **Modifying a list while iterating over it** skips or repeats items. Iterate over a copy (`for x in nums[:]`) or build a new list.
- Java: using `i <= arr.length` causes `ArrayIndexOutOfBoundsException` on the last iteration.
:::

:::quiz
Q: How many times does `for i in range(2, 11, 3)` run?
- 2
- [x] 3
- 4
- 9
> It visits 2, 5 and 8. The next value, 11, is the stop value and is excluded.
:::

=== while-loop | While Loops
summary: Repeat while a condition stays true — when you don't know the number of iterations in advance.
practice: count-digits, reverse-number, collatz-steps
---
A `while` loop checks its condition **before each iteration** and keeps going as long as it is true. Use it when the number of repetitions depends on what happens inside the loop — reading input until it ends, halving a number until it reaches 1, or searching until you find something.

## Basic while

```python title="Digits of a number"
n = 4096
digits = 0
while n > 0:
    n //= 10
    digits += 1
print("digits:", digits)
```
```java
public class Main {
    public static void main(String[] args) {
        int n = 4096;
        int digits = 0;
        while (n > 0) {
            n /= 10;
            digits++;
        }
        System.out.println("digits: " + digits);
    }
}
```
```output
digits: 4
```

Each iteration removes the last digit (`n // 10`). The loop ends when nothing is left. Something inside the loop **must** move the condition toward false, or the loop never ends.

## do-while: run at least once

```java title="Java's do-while"
public class Main {
    public static void main(String[] args) {
        int attempts = 0;
        do {
            attempts++;
            System.out.println("Attempt " + attempts);
        } while (attempts < 3);
    }
}
```
```output
Attempt 1
Attempt 2
Attempt 3
```

:::compare
- Java has `do { … } while (cond);` which runs the body **before** checking — it always executes at least once.
- Python has no do-while. The idiom is `while True:` with a `break` when the exit condition is met.
- Python's loops (both `for` and `while`) support an `else:` block that runs only if the loop finished **without** `break` — handy for search loops.
:::

```python title="Python's while True idiom"
attempts = 0
while True:
    attempts += 1
    print("Attempt", attempts)
    if attempts >= 3:
        break
```
```output
Attempt 1
Attempt 2
Attempt 3
```

## Choosing for vs while

| Situation | Use |
|---|---|
| Iterate over a collection or a known range | `for` |
| Repeat until a condition changes (unknown count) | `while` |
| Two pointers moving toward each other | `while (left < right)` |

:::warning
**Infinite loops** happen when the condition never becomes false — for example forgetting `n //= 10` above. In this platform the runner stops programs after a few seconds and reports *Time limit exceeded*.
:::

:::quiz
Q: What does this print?

```
i = 10
while i > 0:
    i -= 3
print(i)
```
- 0
- 1
- [x] -2
- It loops forever
> i goes 10 → 7 → 4 → 1 → -2. At -2 the condition `i > 0` is false, so the loop stops and prints -2.
:::

=== break-continue | Break, Continue & Nested Loops
summary: Exit a loop early, skip an iteration, and loop inside loops.
practice: first-negative, count-primes-basic
---
Sometimes you need finer control: stop as soon as you've found what you want (`break`), or skip the rest of the current iteration (`continue`).

## break and continue

```python title="Skip odds, stop at a limit"
for n in range(1, 20):
    if n % 2 == 1:
        continue      # skip odd numbers
    if n > 10:
        break         # leave the loop completely
    print(n)
```
```java
public class Main {
    public static void main(String[] args) {
        for (int n = 1; n < 20; n++) {
            if (n % 2 == 1) {
                continue;     // skip odd numbers
            }
            if (n > 10) {
                break;        // leave the loop completely
            }
            System.out.println(n);
        }
    }
}
```
```output
2
4
6
8
10
```

## Nested loops

A loop inside a loop runs the **inner loop completely** for every iteration of the outer loop. With sizes `n` and `m`, the inner body runs `n × m` times.

```python title="A multiplication grid"
for row in range(1, 4):
    line = ""
    for col in range(1, 4):
        line += str(row * col).rjust(4)
    print(line)
```
```java
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 3; row++) {
            StringBuilder line = new StringBuilder();
            for (int col = 1; col <= 3; col++) {
                line.append(String.format("%4d", row * col));
            }
            System.out.println(line);
        }
    }
}
```
```output
   1   2   3
   2   4   6
   3   6   9
```

## Breaking out of nested loops

`break` only exits the **innermost** loop.

```python title="Find a pair that sums to a target"
nums = [3, 8, 1, 6]
target = 9
found = None
for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            found = (i, j)
            break
    if found:
        break
print(found)
```
```java
public class Main {
    public static void main(String[] args) {
        int[] nums = {3, 8, 1, 6};
        int target = 9;
        String found = "none";
        outer:
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    found = "(" + i + ", " + j + ")";
                    break outer;
                }
            }
        }
        System.out.println(found);
    }
}
```
```output
(0, 3)
```

:::compare
Java supports **labelled breaks**: put a label before the outer loop (`outer:`) and write `break outer;`. Python has no labels — use a flag variable as above, or put the loops in a function and `return`.
:::

:::tip
Nested loops over the same array are O(n²). Many interview problems start with this brute force and then improve it with hashing, sorting, or two pointers — you'll learn those in the DSA track.
:::

:::quiz
Q: How many times does the inner `print` run?

```
for i in range(3):
    for j in range(i):
        print(i, j)
```
- 9
- 6
- [x] 3
- 0
> For i = 0 the inner loop runs 0 times, for i = 1 once, for i = 2 twice: 0 + 1 + 2 = 3.
:::
