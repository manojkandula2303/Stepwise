=== exceptions | Exceptions & Error Handling
summary: Detect, handle and raise errors without crashing your program.
---
When something goes wrong at runtime — dividing by zero, a missing file, bad input — the language raises an **exception**. If nothing handles it, the program stops and prints a stack trace. Handling exceptions lets you recover gracefully.

## try / except / catch

```python title="Handling specific errors"
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero")
        return None
    else:
        return result            # runs only if no exception
    finally:
        print("done")            # always runs

print(safe_divide(10, 2))
print(safe_divide(1, 0))
```
```java
public class Main {
    static Integer safeDivide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
            return null;
        } finally {
            System.out.println("done");  // always runs
        }
    }

    public static void main(String[] args) {
        System.out.println(safeDivide(10, 2));
        System.out.println(safeDivide(1, 0));
    }
}
```
```output-python
done
5.0
Cannot divide by zero
done
None
```
```output-java
done
5
Cannot divide by zero
done
null
```

:::compare
- Python: `try` / `except Type as e` / `else` / `finally`. Java: `try` / `catch (Type e)` / `finally` (no `else`).
- Catch several types: Python `except (ValueError, TypeError):`, Java `catch (IllegalArgumentException | NullPointerException e)`.
- **Checked exceptions (Java only):** some exceptions, like `IOException`, must be either caught or declared with `throws` in the method signature — the compiler enforces it. Unchecked ones (`RuntimeException` subclasses) don't need declaring. Python has no checked exceptions.
:::

## Raising your own

```python title="Validate input"
class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("amount must be positive")
    if amount > balance:
        raise InsufficientFunds(f"need {amount - balance} more")
    return balance - amount

for amt in (30, -5, 500):
    try:
        print("left:", withdraw(100, amt))
    except (ValueError, InsufficientFunds) as e:
        print(type(e).__name__, "-", e)
```
```java
public class Main {
    static class InsufficientFunds extends RuntimeException {
        InsufficientFunds(String msg) { super(msg); }
    }

    static int withdraw(int balance, int amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        if (amount > balance) throw new InsufficientFunds("need " + (amount - balance) + " more");
        return balance - amount;
    }

    public static void main(String[] args) {
        for (int amt : new int[]{30, -5, 500}) {
            try {
                System.out.println("left: " + withdraw(100, amt));
            } catch (IllegalArgumentException | InsufficientFunds e) {
                System.out.println(e.getClass().getSimpleName() + " - " + e.getMessage());
            }
        }
    }
}
```
```output-python
left: 70
ValueError - amount must be positive
InsufficientFunds - need 400 more
```
```output-java
left: 70
IllegalArgumentException - amount must be positive
InsufficientFunds - need 400 more
```

## Common exceptions

| Situation | Python | Java |
|---|---|---|
| Index out of range | `IndexError` | `ArrayIndexOutOfBoundsException` |
| Missing key | `KeyError` | (`get` returns `null`) |
| Using a null/None reference | `AttributeError` / `TypeError` | `NullPointerException` |
| Bad number format | `ValueError` | `NumberFormatException` |
| Division by zero (integers) | `ZeroDivisionError` | `ArithmeticException` |
| Too much recursion | `RecursionError` | `StackOverflowError` |

:::warning
Avoid catching everything (`except:` / `catch (Exception e)`) and silently ignoring it. It hides real bugs. Catch the specific exceptions you expect and can actually handle.
:::

=== file-io | Reading & Writing Files
summary: Persist data to files and read it back.
---
Programs often need to save data or read input files. The pattern is the same everywhere: **open** a file, **read or write**, and **close** it — ideally automatically.

:::note
Python examples here run against a temporary in-memory file system inside your browser. The Java sandbox blocks file access for security, so running the Java version here reports an access error — it works as-is on your own machine.
:::

```python title="Write lines, then read them back"
with open("notes.txt", "w") as f:          # "w" = write (overwrite)
    f.write("first line\n")
    f.write("second line\n")

with open("notes.txt") as f:               # default mode "r" = read
    for line in f:
        print(line.strip())

with open("notes.txt", "a") as f:          # "a" = append
    f.write("third line\n")
```
```java
import java.io.*;
import java.nio.file.*;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        try (BufferedWriter w = Files.newBufferedWriter(Path.of("notes.txt"))) {
            w.write("first line\n");
            w.write("second line\n");
        }

        try (BufferedReader r = Files.newBufferedReader(Path.of("notes.txt"))) {
            String line;
            while ((line = r.readLine()) != null) {
                System.out.println(line);
            }
        }

        List<String> all = Files.readAllLines(Path.of("notes.txt"));
        Files.writeString(Path.of("notes.txt"), "third line\n", StandardOpenOption.APPEND);
    }
}
```
```output
first line
second line
```

:::compare
- Python's `with` statement and Java's **try-with-resources** (`try (Resource r = ...)`) both close the file automatically, even if an exception occurs.
- Java file APIs throw the checked `IOException`, so the method must declare `throws IOException` or catch it.
- Convenience helpers: Python `pathlib.Path("f").read_text()`; Java `Files.readString(Path.of("f"))` and `Files.readAllLines`.
:::

=== context-managers | Context Managers & Resource Safety
summary: Guarantee clean-up with `with` and try-with-resources — and write your own.
---
Files, network connections and locks must be released when you're done, even if an error happens halfway. Both languages provide a construct that guarantees clean-up.

```python title="A custom context manager"
class Timer:
    def __enter__(self):
        print("start")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("stop (error)" if exc_type else "stop")
        return False        # don't swallow exceptions

with Timer():
    print("working...")

try:
    with Timer():
        raise RuntimeError("boom")
except RuntimeError:
    print("handled")
```
```java
public class Main {
    static class Timer implements AutoCloseable {
        Timer() { System.out.println("start"); }

        @Override
        public void close() { System.out.println("stop"); }
    }

    public static void main(String[] args) {
        try (Timer t = new Timer()) {
            System.out.println("working...");
        }
        try (Timer t = new Timer()) {
            throw new RuntimeException("boom");
        } catch (RuntimeException e) {
            System.out.println("handled");
        }
    }
}
```
```output-python
start
working...
stop
start
stop (error)
handled
```
```output-java
start
working...
stop
start
stop
handled
```

:::compare
- Python: any object with `__enter__` and `__exit__` works in a `with` block. The `contextlib.contextmanager` decorator turns a generator function into one.
- Java: any class implementing `AutoCloseable` works in try-with-resources; `close()` is called automatically in reverse order of opening.
:::
