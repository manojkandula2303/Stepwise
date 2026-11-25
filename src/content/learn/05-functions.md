=== functions | Functions & Methods
summary: Package reusable logic behind a name, with inputs and a return value.
practice: is-prime-basic, celsius-to-fahrenheit
---
A **function** is a named block of code that takes inputs (**parameters**), does some work, and optionally **returns** a result. Functions let you write logic once and reuse it, and they break big problems into small, testable pieces.

## Defining and calling

```python title="A function with parameters and a return value"
def area(width, height):
    result = width * height
    return result

def greet(name):
    print("Hello,", name)    # no return -> returns None

a = area(3, 4)
print(a)
greet("Ada")
print(area(2, 5) + area(1, 1))
```
```java
public class Main {
    static int area(int width, int height) {
        int result = width * height;
        return result;
    }

    static void greet(String name) {           // void: returns nothing
        System.out.println("Hello, " + name);
    }

    public static void main(String[] args) {
        int a = area(3, 4);
        System.out.println(a);
        greet("Ada");
        System.out.println(area(2, 5) + area(1, 1));
    }
}
```
```output
12
Hello, Ada
11
```

:::compare
- Python: `def name(params):` — no type declarations required. A function without `return` returns `None`.
- Java: functions are **methods** and always live inside a class. You declare the **return type** (`int`, `void` for nothing) and each parameter's type. `static` means it belongs to the class itself, so `main` can call it without creating an object.
- Java checks at compile time that every path returns a value of the right type.
:::

## What happens during a call

When a function is called, a new **stack frame** is created holding its parameters and local variables. When it returns, the frame is discarded and execution continues where the call was made. Click **Visualize** on the example above to watch frames appear and disappear.

## Returning early

```python title="Early return keeps code flat"
def classify(n):
    if n < 0:
        return "negative"
    if n == 0:
        return "zero"
    return "positive"

for x in (-5, 0, 8):
    print(x, classify(x))
```
```java
public class Main {
    static String classify(int n) {
        if (n < 0) return "negative";
        if (n == 0) return "zero";
        return "positive";
    }

    public static void main(String[] args) {
        for (int x : new int[]{-5, 0, 8}) {
            System.out.println(x + " " + classify(x));
        }
    }
}
```
```output
-5 negative
0 zero
8 positive
```

## Pass by value — and what that means for objects

```python title="Rebinding vs mutating"
def try_change(n, items):
    n = 100            # rebinds the local name only
    items.append(4)    # mutates the shared list

x = 1
lst = [1, 2, 3]
try_change(x, lst)
print(x, lst)
```
```java
import java.util.*;

public class Main {
    static void tryChange(int n, List<Integer> items) {
        n = 100;           // changes the local copy only
        items.add(4);      // mutates the shared list
    }

    public static void main(String[] args) {
        int x = 1;
        List<Integer> lst = new ArrayList<>(List.of(1, 2, 3));
        tryChange(x, lst);
        System.out.println(x + " " + lst);
    }
}
```
```output
1 [1, 2, 3, 4]
```

Both languages pass **a copy of the reference** for objects. The function can modify the object the reference points to, but reassigning the parameter never affects the caller's variable.

:::quiz
Q: What does a Python function return if it reaches the end without a `return` statement?
- `0`
- An empty string
- [x] `None`
- It raises an error
> Functions without an explicit return give back `None`. Java requires you to declare such methods as `void`.
:::

=== parameters | Parameters: Defaults, Varargs & Overloading
summary: Optional arguments, variable-length arguments, keyword arguments and method overloading.
---
## Default values vs overloading

```python title="Default and keyword arguments"
def power(base, exp=2):
    return base ** exp

print(power(5))            # uses default exp=2
print(power(2, 10))
print(power(exp=3, base=2))  # keyword arguments, any order
```
```java
public class Main {
    static int power(int base) {              // overload 1
        return power(base, 2);
    }

    static int power(int base, int exp) {     // overload 2
        int r = 1;
        for (int i = 0; i < exp; i++) r *= base;
        return r;
    }

    public static void main(String[] args) {
        System.out.println(power(5));
        System.out.println(power(2, 10));
    }
}
```
```output-python
25
1024
8
```
```output-java
25
1024
```

:::compare
- Python supports **default parameter values** and **keyword arguments** (`f(exp=3, base=2)`).
- Java has neither. Instead it supports **overloading**: several methods with the same name but different parameter lists. The compiler picks the one that matches the call.
- Python has no overloading — a second `def` with the same name simply replaces the first.
:::

:::warning
**Python's mutable default trap:** `def add(item, bucket=[])` creates the list **once**, when the function is defined, and every call shares it. Use `bucket=None` and create the list inside the function.
:::

## Variable number of arguments

```python title="*args and **kwargs"
def total(*nums):
    return sum(nums)

def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

print(total(1, 2, 3, 4))
describe(name="Ada", lang="Python")
values = [5, 6]
print(total(*values))     # unpack a list into arguments
```
```java
public class Main {
    static int total(int... nums) {            // varargs: nums is an int[]
        int s = 0;
        for (int n : nums) s += n;
        return s;
    }

    public static void main(String[] args) {
        System.out.println(total(1, 2, 3, 4));
        int[] values = {5, 6};
        System.out.println(total(values));
    }
}
```
```output-python
10
name = Ada
lang = Python
11
```
```output-java
10
11
```

=== scope | Scope & Lifetime
summary: Where a variable is visible, and how long it lives.
---
**Scope** is the region of code where a name can be used. Getting it wrong leads to "undefined variable" errors or, worse, accidentally changing the wrong variable.

```python title="Local vs global"
counter = 0            # global

def increment():
    global counter     # without this, assignment would create a local
    counter += 1

def local_demo():
    message = "inside"     # local: disappears when the function returns
    return message

increment()
increment()
print(counter)
print(local_demo())
```
```java
public class Main {
    static int counter = 0;        // class-level (static) field

    static void increment() {
        counter++;                  // fields are visible inside methods
    }

    static String localDemo() {
        String message = "inside";  // local variable
        return message;
    }

    public static void main(String[] args) {
        increment();
        increment();
        System.out.println(counter);
        System.out.println(localDemo());
    }
}
```
```output
2
inside
```

:::compare
- **Python** scopes are function-level (LEGB rule: Local → Enclosing → Global → Built-in). An `if` or `for` block does **not** create a new scope — a variable assigned inside a loop is still visible after it.
- **Java** scopes are **block-level**: a variable declared inside `{ }` (including loop bodies) exists only within those braces.
- Assigning to a global inside a Python function requires the `global` keyword (or `nonlocal` for an enclosing function's variable). Reading it does not.
:::

```python title="Block scope difference"
for i in range(3):
    last = i * 10
print(i, last)      # still visible in Python
```
```java
public class Main {
    public static void main(String[] args) {
        int last = 0;
        for (int i = 0; i < 3; i++) {
            last = i * 10;
        }
        // System.out.println(i);   -> does not compile: i is out of scope
        System.out.println(last);
    }
}
```
```output-python
2 20
```
```output-java
20
```

:::tip
Prefer passing values in as parameters and returning results over modifying global state. Functions that only depend on their inputs are easier to test and reason about.
:::

=== lambdas | Lambdas & Higher-Order Functions
summary: Treat functions as values — pass them to sort, map and filter.
---
A **higher-order function** takes another function as an argument or returns one. A **lambda** is a small anonymous function written inline.

```python title="Sorting with a key function"
words = ["banana", "kiwi", "apple", "fig"]
print(sorted(words, key=len))
print(sorted(words, key=lambda w: (len(w), w)))

square = lambda x: x * x
print(list(map(square, [1, 2, 3])))
print(list(filter(lambda x: x > 1, [0, 1, 2, 3])))

def make_multiplier(k):
    return lambda x: x * k     # returns a function

triple = make_multiplier(3)
print(triple(7))
```
```java
import java.util.*;
import java.util.function.*;

public class Main {
    static Function<Integer, Integer> makeMultiplier(int k) {
        return x -> x * k;
    }

    public static void main(String[] args) {
        List<String> words = new ArrayList<>(List.of("banana", "kiwi", "apple", "fig"));
        words.sort(Comparator.comparingInt(String::length));
        System.out.println(words);
        words.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println(words);

        Function<Integer, Integer> square = x -> x * x;
        System.out.println(square.apply(4));

        Function<Integer, Integer> triple = makeMultiplier(3);
        System.out.println(triple.apply(7));
    }
}
```
```output-python
['fig', 'kiwi', 'apple', 'banana']
['fig', 'kiwi', 'apple', 'banana']
[1, 4, 9]
[2, 3]
21
```
```output-java
[fig, kiwi, apple, banana]
[fig, kiwi, apple, banana]
16
21
```

:::compare
- Python: `lambda args: expression` — a single expression, no statements.
- Java: `(args) -> expression` or `(args) -> { statements; }`. A lambda's type is a **functional interface** such as `Function<T, R>`, `Predicate<T>`, `Comparator<T>` or `Runnable`.
- Method references (`String::length`, `Integer::compare`) are shorthand for lambdas that call one method.
- Sorting: Python `key=` returns the value to sort by; Java `Comparator` compares two items. `(a, b) -> a[0] - b[0]` sorts arrays by first element (beware overflow — prefer `Integer.compare(a[0], b[0])`).
:::

=== recursion-basics | Recursion Basics
summary: A function that calls itself, with a base case to stop.
practice: factorial-basic, power-of-two-basic
---
**Recursion** solves a problem by solving a smaller version of the same problem. Every recursive function has:

1. A **base case** — a version small enough to answer directly.
2. A **recursive case** — reduce the problem and call the function again.

```python title="Factorial: n! = n × (n-1)!"
def factorial(n):
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))
```
```java
public class Main {
    static int factorial(int n) {
        if (n <= 1) {                 // base case
            return 1;
        }
        return n * factorial(n - 1);  // recursive case
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
```
```output
120
```

**Visualize** this example: you'll see five frames stack up (`factorial(5)` down to `factorial(1)`), then unwind as each returns its result to the caller.

## Tracing the calls

```
factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= 5 * 4 * 3 * factorial(2)
= 5 * 4 * 3 * 2 * factorial(1)
= 5 * 4 * 3 * 2 * 1 = 120
```

:::warning
- **Missing or unreachable base case** → infinite recursion → `RecursionError` (Python, default limit ~1000 frames) or `StackOverflowError` (Java).
- Each pending call uses stack memory, so recursion depth n costs O(n) space.
:::

The DSA track covers recursion in depth — recursion trees, memoization and backtracking.

:::quiz
Q: What happens if you call `factorial(-3)` with the code above?
- Infinite recursion
- [x] It returns 1
- It returns -6
- It raises an error
> -3 <= 1, so the base case returns 1 immediately. A stricter version would reject negative input.
:::
