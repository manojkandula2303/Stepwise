=== strings | String Basics
summary: Text as a sequence of characters — indexing, slicing, length and immutability.
practice: reverse-string-basic, count-vowels
---
A **string** is an ordered sequence of characters. Each character has an **index**, starting at 0.

:::viz array H,e,l,l,o | hl=1 | caption=s = "Hello" — s[1] is 'e'
:::

## Indexing and length

```python title="Characters by position"
s = "Hello"
print(len(s))
print(s[0], s[4])
print(s[-1])          # negative index counts from the end
for ch in s:
    print(ch, end=" ")
print()
```
```java
public class Main {
    public static void main(String[] args) {
        String s = "Hello";
        System.out.println(s.length());
        System.out.println(s.charAt(0) + " " + s.charAt(4));
        System.out.println(s.charAt(s.length() - 1));
        for (char ch : s.toCharArray()) {
            System.out.print(ch + " ");
        }
        System.out.println();
    }
}
```
```output
5
H o
o
H e l l o 
```

:::compare
- Python: `len(s)`, `s[i]`, and negative indices (`s[-1]` is the last character). A single character is itself a string of length 1.
- Java: `s.length()` (a method — note the parentheses), `s.charAt(i)` returns a `char`. No negative indices.
- Out-of-range access fails in both: `IndexError` (Python), `StringIndexOutOfBoundsException` (Java).
:::

## Slicing / substrings

```python title="Extracting part of a string"
s = "programming"
print(s[0:7])     # characters 0..6
print(s[3:])      # from 3 to the end
print(s[:4])      # first four
print(s[::-1])    # reversed
print(s[::2])     # every second character
```
```java
public class Main {
    public static void main(String[] args) {
        String s = "programming";
        System.out.println(s.substring(0, 7));
        System.out.println(s.substring(3));
        System.out.println(s.substring(0, 4));
        System.out.println(new StringBuilder(s).reverse());
        StringBuilder every2 = new StringBuilder();
        for (int i = 0; i < s.length(); i += 2) every2.append(s.charAt(i));
        System.out.println(every2);
    }
}
```
```output
program
gramming
prog
gnimmargorp
pormig
```

Both `s[a:b]` and `s.substring(a, b)` include index `a` and **exclude** index `b`.

## Strings are immutable

Neither language lets you change a string in place. Operations that look like modifications actually create a **new** string.

```python
s = "cat"
# s[0] = "b"     -> TypeError: 'str' object does not support item assignment
s = "b" + s[1:]
print(s)
```
```java
public class Main {
    public static void main(String[] args) {
        String s = "cat";
        // s.charAt(0) = 'b';   -> does not compile
        s = "b" + s.substring(1);
        System.out.println(s);
    }
}
```
```output
bat
```

:::warning
Because strings are immutable, building a long string with `+=` inside a loop copies the whole string each time — **O(n²)** overall. Collect pieces in a list and `"".join(parts)` in Python, or use `StringBuilder` in Java.
:::

## Comparing strings

```python
a, b = "apple", "apple"
print(a == b)          # compares contents
print("apple" < "banana")   # lexicographic order
```
```java
public class Main {
    public static void main(String[] args) {
        String a = "apple";
        String b = new String("apple");
        System.out.println(a.equals(b));     // contents: true
        System.out.println(a == b);          // same object? false
        System.out.println("apple".compareTo("banana") < 0);
    }
}
```
```output-python
True
True
```
```output-java
true
false
true
```

:::java
Always compare Java strings with `.equals()` (or `.equalsIgnoreCase()`). `==` checks whether both variables refer to the **same object** in memory, which is sometimes true by coincidence (string literals are interned) and sometimes not — a classic bug.
:::

:::quiz
Q: In Python, what is `"abcdef"[1:4]`?
- `"abcd"`
- [x] `"bcd"`
- `"bcde"`
- `"abc"`
> Slicing starts at index 1 ('b') and stops before index 4, giving 'b', 'c', 'd'.
:::

=== string-methods | String Methods
summary: Search, split, join, change case and test characters.
practice: is-palindrome-basic, capitalize-words
---
Both languages ship with a rich set of string operations. Learning the common ones saves you from re-implementing them by hand.

## The everyday toolkit

```python title="Common string methods"
s = "  Hello, World  "
t = s.strip()
print(t)
print(t.lower(), t.upper())
print(t.replace("World", "Python"))
print(t.find("o"), t.count("o"))
print(t.startswith("Hell"), t.endswith("!"))
print("a,b,c".split(","))
print("-".join(["x", "y", "z"]))
```
```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String s = "  Hello, World  ";
        String t = s.trim();
        System.out.println(t);
        System.out.println(t.toLowerCase() + " " + t.toUpperCase());
        System.out.println(t.replace("World", "Java"));
        System.out.println(t.indexOf("o") + " " + (t.length() - t.replace("o", "").length()));
        System.out.println(t.startsWith("Hell") + " " + t.endsWith("!"));
        System.out.println(Arrays.toString("a,b,c".split(",")));
        System.out.println(String.join("-", "x", "y", "z"));
    }
}
```
```output-python
Hello, World
hello, world HELLO, WORLD
Hello, Python
4 2
True False
['a', 'b', 'c']
x-y-z
```
```output-java
Hello, World
hello, world HELLO, WORLD
Hello, Java
4 2
true false
[a, b, c]
x-y-z
```

| Task | Python | Java |
|---|---|---|
| Remove surrounding whitespace | `s.strip()` | `s.trim()` / `s.strip()` |
| Find position (−1 if absent) | `s.find(x)` | `s.indexOf(x)` |
| Contains | `x in s` | `s.contains(x)` |
| Split | `s.split(",")` | `s.split(",")` (regex!) |
| Join | `",".join(list)` | `String.join(",", list)` |
| Repeat | `s * 3` | `s.repeat(3)` |

:::warning
Java's `split` takes a **regular expression**. Splitting on `"."` or `"|"` needs escaping: `s.split("\\.")`. Python's `split` takes a plain string, and `s.split()` with no argument splits on any run of whitespace.
:::

## Testing characters

```python title="Classify each character"
for ch in "a1 B?":
    print(repr(ch), ch.isalpha(), ch.isdigit(), ch.isspace(), ch.isupper())
```
```java
public class Main {
    public static void main(String[] args) {
        for (char ch : "a1 B?".toCharArray()) {
            System.out.println("'" + ch + "' " + Character.isLetter(ch) + " " + Character.isDigit(ch) + " "
                + Character.isWhitespace(ch) + " " + Character.isUpperCase(ch));
        }
    }
}
```
```output-python
'a' True False False False
'1' False True False False
' ' False False True False
'B' True False False True
'?' False False False False
```
```output-java
'a' true false false false
'1' false true false false
' ' false false true false
'B' true false false true
'?' false false false false
```

## Characters as numbers

```python
print(ord("a"), chr(98))
print(ord("c") - ord("a"))    # position in the alphabet
```
```java
public class Main {
    public static void main(String[] args) {
        System.out.println((int) 'a' + " " + (char) 98);
        System.out.println('c' - 'a');
    }
}
```
```output
97 b
2
```

:::tip
`ch - 'a'` (Java) and `ord(ch) - ord('a')` (Python) map lowercase letters to 0–25 — the basis of the "count array of size 26" trick used in many anagram problems.
:::

=== string-formatting | Formatting & Building Strings
summary: f-strings, String.format, and efficient string building with join and StringBuilder.
---
## Embedding values in text

```python title="f-strings"
name, score, ratio = "Ada", 93, 0.4567
print(f"{name} scored {score}")
print(f"ratio = {ratio:.2%}")
print(f"[{score:5d}] [{name:>6}] [{name:<6}]")
print(f"{1234567:,}")
```
```java
public class Main {
    public static void main(String[] args) {
        String name = "Ada";
        int score = 93;
        double ratio = 0.4567;
        System.out.println(name + " scored " + score);
        System.out.println(String.format("ratio = %.2f%%", ratio * 100));
        System.out.printf("[%5d] [%6s] [%-6s]%n", score, name, name);
        System.out.println(String.format("%,d", 1234567));
    }
}
```
```output
Ada scored 93
ratio = 45.67%
[   93] [   Ada] [Ada   ]
1,234,567
```

## Building strings efficiently

```python title="Collect then join"
parts = []
for i in range(5):
    parts.append(str(i * i))
result = ", ".join(parts)
print(result)
```
```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            if (i > 0) sb.append(", ");
            sb.append(i * i);
        }
        String result = sb.toString();
        System.out.println(result);
    }
}
```
```output
0, 1, 4, 9, 16
```

:::compare
- **Python:** append pieces to a list and call `"sep".join(list)` once at the end — linear time.
- **Java:** `StringBuilder` is a *mutable* buffer. `append` adds to the end in amortised O(1), `insert`, `reverse`, `setCharAt` and `deleteCharAt` modify it in place, and `toString()` produces the final `String`.
:::

:::java
`StringBuilder` methods worth memorising: `append(x)`, `insert(i, x)`, `reverse()`, `charAt(i)`, `setCharAt(i, c)`, `deleteCharAt(i)`, `length()`, `toString()`.
:::

:::quiz
Q: Why is `result += piece` inside a large loop slow?
- [x] Strings are immutable, so every `+=` copies the whole string built so far
- The `+=` operator is not supported for strings
- It creates a list behind the scenes
- It only works for numbers
> Each concatenation allocates a new string of the combined length, making the total work proportional to n². join/StringBuilder avoid that.
:::
