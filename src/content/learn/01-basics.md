=== intro | Your First Program
summary: How a program runs, and how to make the computer print something.
practice: hello-output
---
A **program** is a list of instructions the computer follows from top to bottom. The simplest useful instruction is *print this text*. Every course starts here because it lets you see what your code is doing.

## Hello, World

```python title="Printing a line of text"
print("Hello, World!")
print("I am learning to code.")
```
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("I am learning to code.");
    }
}
```
```output
Hello, World!
I am learning to code.
```

Each statement runs in order. The text inside quotes is a **string** — a piece of text — and it is printed exactly as written.

:::python
Python needs nothing around your code. A file containing `print("Hello")` is already a complete program. `print` adds a newline after the text automatically.
:::

:::java
Java code always lives inside a **class**. Execution starts at the special method `public static void main(String[] args)`. You will learn what each word means later — for now, treat it as the required frame around your code.

- `System.out.println(...)` prints and then moves to a new line.
- `System.out.print(...)` prints *without* a newline.
- Every statement ends with a semicolon `;`.
:::

## How your code runs

:::compare
- **Python** is *interpreted*: the Python interpreter reads your file and executes it line by line. There is no separate compile step, so you can run code immediately.
- **Java** is *compiled*: `javac` first translates your source into **bytecode** (`.class` files), and the Java Virtual Machine (JVM) runs that bytecode. The compiler catches many mistakes — like a missing semicolon or a type mismatch — before the program ever starts.
- Python uses **indentation** to group code. Java uses **curly braces** `{ }`.
:::

## Printing several values

```python title="Printing values side by side"
print("Score:", 42)
print(1, 2, 3)
print("a", "b", sep="-")
print("no newline", end="")
print(" ...continues")
```
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Score: " + 42);
        System.out.println(1 + " " + 2 + " " + 3);
        System.out.println("a" + "-" + "b");
        System.out.print("no newline");
        System.out.println(" ...continues");
    }
}
```
```output
Score: 42
1 2 3
a-b
no newline ...continues
```

:::python
`print` accepts any number of values separated by commas, and puts a space between them. Use `sep=` to change the separator and `end=` to change what is printed at the end (a newline by default).
:::

:::java
`println` takes a single value. To print several, join them into one string with `+`. When one side of `+` is a String, Java converts the other side to text automatically.
:::

## Comments

Comments are notes for humans. The computer ignores them.

```python
# This is a single-line comment
print("Comments are ignored")  # so is this

"""
A triple-quoted string on its own line is
often used as a multi-line comment or docstring.
"""
```
```java
public class Main {
    public static void main(String[] args) {
        // This is a single-line comment
        System.out.println("Comments are ignored"); // so is this

        /*
         * A block comment can span
         * several lines.
         */
    }
}
```
```output
Comments are ignored
```

## Common mistakes

:::warning
- **Forgetting quotes** around text: `print(Hello)` looks for a *variable* called `Hello` and fails.
- **Mismatched quotes**: `"Hello'` is not a valid string. Open and close with the same kind.
- **Java:** a missing semicolon or a misspelled `System.out.println` (it is case-sensitive) stops compilation.
- **Python:** unexpected indentation at the start of a line is an error — top-level code must start in column 0.
:::

:::quiz
Q: What does this Python code print?

```
print("A", "B", sep="")
print("C")
```
- `A B` then `C`
- [x] `AB` then `C`
- `ABC` on one line
- An error
> `sep=""` removes the space between values, and `print` still ends with a newline, so `C` appears on the next line.
:::

=== variables | Variables & Data Types
summary: Store values under names, and learn the basic kinds of data.
practice: swap-two-numbers
---
A **variable** is a name that refers to a value. You create one with an assignment, and you can change it later. Variables let a program remember things — a score, a name, a running total.

## Creating variables

```python title="Assigning and reassigning"
age = 21
name = "Ada"
height = 1.68
is_student = True

print(name, "is", age)
age = age + 1          # reassign using the old value
print("Next year:", age)
```
```java
public class Main {
    public static void main(String[] args) {
        int age = 21;
        String name = "Ada";
        double height = 1.68;
        boolean isStudent = true;

        System.out.println(name + " is " + age);
        age = age + 1;     // reassign using the old value
        System.out.println("Next year: " + age);
    }
}
```
```output
Ada is 21
Next year: 22
```

The `=` sign means **assign**, not "equals". `age = age + 1` reads as: *compute `age + 1`, then store the result back in `age`*.

## Static vs dynamic typing

:::compare
- **Python is dynamically typed.** A variable has no fixed type; the *value* has a type. You can write `x = 5` and later `x = "five"`.
- **Java is statically typed.** You declare the type when creating the variable (`int x = 5;`) and it can only ever hold that type. `x = "five";` is a compile-time error.
- Java has `var` (Java 10+) for local variables: `var count = 10;` — the compiler *infers* `int`, but the type is still fixed.
- Naming style differs: Python uses `snake_case` (`is_student`), Java uses `camelCase` (`isStudent`).
:::

## The basic types

| Kind of data | Python | Java | Example |
|---|---|---|---|
| Whole number | `int` (unlimited size) | `int` (32-bit), `long` (64-bit) | `42` |
| Decimal number | `float` (64-bit) | `double` (64-bit), `float` (32-bit) | `3.14` |
| True / false | `bool` — `True`, `False` | `boolean` — `true`, `false` | `True` |
| Text | `str` | `String` | `"hi"` |
| Single character | (a `str` of length 1) | `char` — `'a'` | `'a'` |
| No value | `None` | `null` (objects only) | |

```python title="Inspecting types"
print(type(42))
print(type(3.5))
print(type("hi"))
print(type(True))
big = 2 ** 100
print(big)
```
```java
public class Main {
    public static void main(String[] args) {
        int i = 42;
        double d = 3.5;
        char c = 'h';
        long big = 1L << 62;
        System.out.println(((Object) i).getClass().getSimpleName());
        System.out.println(((Object) d).getClass().getSimpleName());
        System.out.println(c);
        System.out.println(big);
        System.out.println(Integer.MAX_VALUE);
    }
}
```
```output-python
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
1267650600228229401496703205376
```
```output-java
Integer
Double
h
4611686018427387904
2147483647
```

:::java
Java's `int` holds values from about −2.1 billion to 2.1 billion (`Integer.MAX_VALUE` = 2,147,483,647). Going past that **overflows** silently and wraps around to negative numbers. Use `long` (append `L` to literals: `10_000_000_000L`) when values can get large — a very common interview bug.
:::

:::python
Python integers grow as large as memory allows, so `2 ** 100` just works. There is no overflow to worry about for `int`.
:::

## Constants

```python
MAX_USERS = 100        # by convention, ALL_CAPS means "don't change me"
print(MAX_USERS)
```
```java
public class Main {
    static final int MAX_USERS = 100;   // final: the compiler forbids reassignment

    public static void main(String[] args) {
        System.out.println(MAX_USERS);
    }
}
```
```output
100
```

:::compare
Python has no true constants — ALL_CAPS names are a convention that other programmers respect. Java's `final` keyword is enforced by the compiler.
:::

## Multiple assignment and swapping

```python title="Swap two variables"
a, b = 1, 2
a, b = b, a        # tuple unpacking swaps in one line
print(a, b)
```
```java
public class Main {
    public static void main(String[] args) {
        int a = 1, b = 2;
        int temp = a;      // Java needs a temporary variable
        a = b;
        b = temp;
        System.out.println(a + " " + b);
    }
}
```
```output
2 1
```

:::warning
- Using a variable before assigning it: Python raises `NameError`; Java refuses to compile ("variable might not have been initialized").
- Names are case-sensitive: `Age` and `age` are different variables.
- Names cannot start with a digit or be a keyword (`class`, `for`, `if` …).
:::

:::quiz
Q: In Java, what happens with `int x = 2147483647; x = x + 1;`?
- A compile error
- `x` becomes `2147483648`
- [x] `x` wraps around to `-2147483648`
- An exception is thrown at runtime
> Java `int` arithmetic overflows silently. The bit pattern wraps around to the most negative value. Use `long` or `Math.addExact` to avoid this.
:::

=== operators | Operators & Expressions
summary: Arithmetic, comparison and logical operators — and where Python and Java disagree.
practice: even-or-odd, sum-of-digits
---
An **expression** combines values and operators to produce a new value, like `3 + 4 * 2`. Operators follow precedence rules similar to maths: multiplication before addition, parentheses first.

## Arithmetic

```python title="Arithmetic operators"
a, b = 17, 5
print(a + b)    # addition
print(a - b)    # subtraction
print(a * b)    # multiplication
print(a / b)    # true division -> float
print(a // b)   # floor division
print(a % b)    # remainder (modulo)
print(a ** 2)   # power
```
```java
public class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println(a + b);              // addition
        System.out.println(a - b);              // subtraction
        System.out.println(a * b);              // multiplication
        System.out.println((double) a / b);     // division with a double
        System.out.println(a / b);              // int / int truncates
        System.out.println(a % b);              // remainder
        System.out.println((int) Math.pow(a, 2)); // power
    }
}
```
```output
22
12
85
3.4
3
2
289
```

:::compare
- **Division:** in Python `/` always gives a float (`17 / 5 == 3.4`) and `//` floors. In Java, `/` between two `int`s **truncates** (`17 / 5 == 3`). Cast one side to `double` for a decimal result.
- **Negative division:** Python's `//` rounds *down* (`-7 // 2 == -4`); Java's `/` rounds *toward zero* (`-7 / 2 == -3`).
- **Modulo of negatives:** Python's `%` takes the sign of the divisor (`-7 % 3 == 2`); Java's takes the sign of the dividend (`-7 % 3 == -1`).
- **Power:** Python has `**`. Java uses `Math.pow`, which returns a `double`.
:::

## Assignment shortcuts

```python
score = 10
score += 5     # score = score + 5
score *= 2
score -= 1
print(score)
```
```java
public class Main {
    public static void main(String[] args) {
        int score = 10;
        score += 5;
        score *= 2;
        score -= 1;
        score++;           // Java also has ++ and --
        System.out.println(score);
    }
}
```
```output-python
29
```
```output-java
30
```

:::java
`x++` adds one and `x--` subtracts one. Python has no `++` operator — write `x += 1`.
:::

## Comparison and logic

```python title="Booleans from comparisons"
x = 7
print(x > 5 and x < 10)
print(x == 7 or x == 8)
print(not x == 7)
print(1 < x < 10)          # chained comparison
```
```java
public class Main {
    public static void main(String[] args) {
        int x = 7;
        System.out.println(x > 5 && x < 10);
        System.out.println(x == 7 || x == 8);
        System.out.println(!(x == 7));
        System.out.println(1 < x && x < 10);  // no chaining in Java
    }
}
```
```output-python
True
True
False
True
```
```output-java
true
true
false
true
```

| Meaning | Python | Java |
|---|---|---|
| and | `and` | `&&` |
| or | `or` | `\|\|` |
| not | `not` | `!` |
| equal / not equal | `==`, `!=` | `==`, `!=` |

Both languages **short-circuit**: in `a and b`, if `a` is false, `b` is never evaluated. This lets you write guards like `i < len(nums) and nums[i] > 0` safely.

:::warning
In Java, `==` on objects (like `String`) compares **references**, not contents. Use `s1.equals(s2)` to compare text. In Python, `==` compares values; `is` checks identity.
:::

## Precedence

From highest to lowest (simplified): parentheses → `**` → unary `-` → `* / // %` → `+ -` → comparisons → `not` → `and` → `or`. When in doubt, add parentheses — they make intent obvious.

:::quiz
Q: What is `-7 // 2` in Python, and `-7 / 2` in Java (both integers)?
- Both are `-3`
- Both are `-4`
- [x] Python gives `-4`, Java gives `-3`
- Python gives `-3`, Java gives `-4`
> Python floors toward negative infinity; Java truncates toward zero. This matters in problems involving negative numbers and midpoints.
:::

=== input-output | Input & Output
summary: Read what the user types and format what you print.
practice: sum-two-inputs
---
Programs become useful when they react to input. Both languages read from **standard input** (stdin) — the keyboard, or the input box in this platform's compiler.

## Reading a line

```python title="Read a name and greet"
name = input("Your name: ")
print("Hello,", name)
```
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Your name: ");
        String name = sc.nextLine();
        System.out.println("Hello, " + name);
    }
}
```
```output
Your name: Hello, Ada
```

Try it with **Edit** — type `Ada` in the input box, then run.

## Reading numbers

`input()` always returns a **string**. Convert it before doing arithmetic.

```python title="Sum of numbers on one line"
line = input()                    # e.g. "3 8 1"
nums = list(map(int, line.split()))
print(sum(nums))
```
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = 0;
        while (sc.hasNextInt()) {
            total += sc.nextInt();
        }
        System.out.println(total);
    }
}
```
```output
12
```

:::compare
- Python's `input()` reads one whole line. Split it and convert pieces with `int()` / `float()`.
- Java's `Scanner` reads **tokens**: `nextInt()`, `nextDouble()`, `next()` (one word) and `nextLine()` (rest of the line).
- Mixing `nextInt()` and `nextLine()` in Java is a classic bug: `nextInt()` leaves the newline behind, so the following `nextLine()` returns an empty string. Call an extra `sc.nextLine()` to consume it.
- For large inputs, Java's `BufferedReader` is much faster than `Scanner`; Python's `sys.stdin.readline` is faster than `input()`.
:::

## Formatting output

```python title="f-strings"
item, price, qty = "Pen", 1.5, 4
print(f"{qty} x {item} = {price * qty:.2f}")
print(f"{'left':<8}|{'right':>8}")
```
```java
public class Main {
    public static void main(String[] args) {
        String item = "Pen";
        double price = 1.5;
        int qty = 4;
        System.out.printf("%d x %s = %.2f%n", qty, item, price * qty);
        System.out.println(String.format("%-8s|%8s", "left", "right"));
    }
}
```
```output
4 x Pen = 6.00
left    |   right
```

`.2f` / `%.2f` means "a float with 2 decimal places". `<8` / `%-8s` left-aligns in 8 characters; `>8` / `%8s` right-aligns.

:::quiz
Q: In Python, the user types `5`. What does `print(input() * 2)` print?
- `10`
- [x] `55`
- An error
- `5 5`
> `input()` returns the string `"5"`, and multiplying a string by 2 repeats it. Convert with `int(input())` to get 10.
:::

=== type-conversion | Type Conversion
summary: Turn strings into numbers and back, and understand implicit vs explicit casts.
---
Values often arrive in the wrong type — numbers read as text, or a decimal you need as a whole number. **Conversion** (or casting) produces a value of a different type.

## Explicit conversion

```python title="Converting between types"
n = int("42")          # str -> int
f = float("3.75")      # str -> float
s = str(99)            # int -> str
i = int(3.99)          # float -> int truncates toward zero
b = bool(0)            # 0, "", [], None are False
print(n + 1, f, s + "!", i, b)
print(int("ff", 16))   # parse in base 16
```
```java
public class Main {
    public static void main(String[] args) {
        int n = Integer.parseInt("42");
        double f = Double.parseDouble("3.75");
        String s = String.valueOf(99);
        int i = (int) 3.99;                 // cast truncates toward zero
        System.out.println((n + 1) + " " + f + " " + s + "!" + " " + i);
        System.out.println(Integer.parseInt("ff", 16));
        char c = 'A';
        System.out.println((int) c + " " + (char) (c + 1));
    }
}
```
```output-python
43 3.75 99! 3 False
255
```
```output-java
43 3.75 99! 3
255
65 B
```

## Implicit conversion (widening)

:::java
Java converts automatically when no information can be lost — *widening*: `byte → short → int → long → float → double`. Going the other way (*narrowing*) needs an explicit cast and may lose data:

- `double d = 5;` is fine (`5.0`).
- `int x = 5.7;` does not compile; `int x = (int) 5.7;` gives `5`.
- `char` is a number underneath: `'a' + 1` is `98`, and `(char) ('a' + 1)` is `'b'`.
:::

:::python
Python mixes `int` and `float` freely in arithmetic (the result is a `float`), but never converts strings implicitly: `"3" + 4` raises `TypeError`. Characters convert with `ord('a') == 97` and `chr(98) == 'b'`.
:::

## Invalid conversions

```python
try:
    int("12abc")
except ValueError as e:
    print("Error:", e)
```
```java
public class Main {
    public static void main(String[] args) {
        try {
            Integer.parseInt("12abc");
        } catch (NumberFormatException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```
```output-python
Error: invalid literal for int() with base 10: '12abc'
```
```output-java
Error: For input string: "12abc"
```

:::tip
In interview problems, converting a digit character to its value is common: Python `int(ch)` or `ord(ch) - ord('0')`; Java `ch - '0'`.
:::

:::quiz
Q: Which Java statement compiles?
- `int x = 3.0;`
- `long y = 3.5;`
- [x] `double z = 3;`
- `char c = "a";`
> Assigning an `int` to a `double` is a widening conversion, which Java performs automatically. The others narrow or mix incompatible types.
:::
