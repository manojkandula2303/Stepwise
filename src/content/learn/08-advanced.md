=== iterators-generators | Iterators & Generators
summary: Produce values one at a time, lazily — and how Java's Iterator compares.
---
An **iterator** hands out values one at a time. Every `for` loop uses one behind the scenes. A **generator** is the easiest way to write your own: a function that `yield`s values and pauses between them.

```python title="A lazy sequence"
def countdown(n):
    while n > 0:
        yield n          # pause here, hand back n
        n -= 1

for x in countdown(3):
    print(x)

gen = countdown(2)
print(next(gen), next(gen))

def fib():
    a, b = 0, 1
    while True:          # infinite, but lazy
        yield a
        a, b = b, a + b

import itertools
print(list(itertools.islice(fib(), 10)))
```
```java
import java.util.*;

public class Main {
    static class Countdown implements Iterable<Integer> {
        private final int start;
        Countdown(int start) { this.start = start; }

        public Iterator<Integer> iterator() {
            return new Iterator<>() {
                int n = start;
                public boolean hasNext() { return n > 0; }
                public Integer next() { return n--; }
            };
        }
    }

    public static void main(String[] args) {
        for (int x : new Countdown(3)) System.out.println(x);

        Iterator<Integer> it = new Countdown(2).iterator();
        System.out.println(it.next() + " " + it.next());
    }
}
```
```output-python
3
2
1
2 1
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```
```output-java
3
2
1
2 1
```

:::compare
- Python generators keep their local state between `yield`s automatically, so lazy sequences take a few lines.
- Java has no `yield` for iterators. You implement `Iterator<T>` (`hasNext`, `next`) by hand, or use `Stream.iterate`/`Stream.generate` for lazy sequences.
- Laziness means values are computed only when requested — you can represent huge or infinite sequences in constant memory.
:::

=== decorators | Decorators
summary: Wrap functions to add behaviour — logging, timing, caching.
---
A **decorator** is a function that takes a function and returns a new function, usually adding behaviour before or after the original runs. `@decorator` above a `def` applies it.

```python title="Logging and memoization"
import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args):
        result = func(*args)
        print(f"{func.__name__}{args} -> {result}")
        return result
    return wrapper

@logged
def add(a, b):
    return a + b

add(2, 3)

@functools.lru_cache(maxsize=None)    # built-in memoizing decorator
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))
```
```java
import java.util.*;
import java.util.function.*;

public class Main {
    // Java has no decorator syntax; wrap with higher-order functions instead.
    static <T, R> Function<T, R> logged(String name, Function<T, R> f) {
        return x -> {
            R r = f.apply(x);
            System.out.println(name + "(" + x + ") -> " + r);
            return r;
        };
    }

    static Map<Integer, Long> memo = new HashMap<>();
    static long fib(int n) {
        if (n < 2) return n;
        Long cached = memo.get(n);
        if (cached != null) return cached;
        long v = fib(n - 1) + fib(n - 2);
        memo.put(n, v);
        return v;
    }

    public static void main(String[] args) {
        Function<Integer, Integer> square = logged("square", x -> x * x);
        square.apply(7);
        System.out.println(fib(80));
    }
}
```
```output-python
add(2, 3) -> 5
23416728348467685
```
```output-java
square(7) -> 49
23416728348467685
```

:::compare
Java has **annotations** (`@Override`, `@Deprecated`) that look similar but are metadata read by the compiler or frameworks — they don't wrap your method by themselves. In Java, the decorator pattern is implemented with wrapper classes or higher-order functions.
:::

:::tip
`@functools.lru_cache` / `@functools.cache` turns a slow recursive function into a memoized one in a single line — very useful in dynamic programming.
:::

=== modules-packages | Modules, Packages & Imports
summary: Split code across files and use the standard library.
---
As programs grow, code is organised into files and folders, and reused through imports.

```python title="Importing from the standard library"
import math
from collections import deque, Counter
from random import randint as rnd

print(math.sqrt(16), math.gcd(12, 18))
q = deque([1, 2, 3])
q.appendleft(0)
print(q)
print(Counter("hello"))

if __name__ == "__main__":
    print("run directly, not imported")
```
```java
import java.util.ArrayDeque;
import java.util.Deque;
import static java.lang.Math.sqrt;

public class Main {
    public static void main(String[] args) {
        System.out.println(sqrt(16) + " " + gcd(12, 18));
        Deque<Integer> q = new ArrayDeque<>(java.util.List.of(1, 2, 3));
        q.addFirst(0);
        System.out.println(q);
    }

    static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}
```
```output-python
4.0 6
deque([0, 1, 2, 3])
Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})
run directly, not imported
```
```output-java
4.0 6
[0, 1, 2, 3]
```

:::compare
- **Python:** each `.py` file is a *module*; a folder with modules is a *package*. `import x`, `from x import y`, `import x as alias`. Code under `if __name__ == "__main__":` runs only when the file is executed directly.
- **Java:** each public class lives in its own `.java` file named after it; classes are grouped into **packages** declared with `package com.example.app;` matching the folder structure. `import java.util.List;` or `import java.util.*;`. `java.lang` (String, Math, Integer…) is imported automatically.
- Interview-relevant library modules: Python `collections`, `heapq`, `bisect`, `itertools`, `functools`, `math`; Java `java.util` (collections, `Arrays`, `Collections`), `java.util.stream`.
:::

=== type-hints | Type Hints
summary: Optional static types for Python — and how they compare with Java's enforced types.
---
Python is dynamically typed, but you can annotate types. Tools like `mypy` and editors use the hints to catch bugs; the interpreter itself ignores them at runtime.

```python title="Annotated functions"
from typing import Optional

def find_index(items: list[str], target: str) -> Optional[int]:
    for i, item in enumerate(items):
        if item == target:
            return i
    return None

def total(prices: dict[str, float]) -> float:
    return sum(prices.values())

print(find_index(["a", "b"], "b"))
print(find_index(["a"], "z"))
print(total({"tea": 2.5, "cake": 4.0}))
```
```java
import java.util.*;

public class Main {
    static Optional<Integer> findIndex(List<String> items, String target) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).equals(target)) return Optional.of(i);
        }
        return Optional.empty();
    }

    static double total(Map<String, Double> prices) {
        double s = 0;
        for (double p : prices.values()) s += p;
        return s;
    }

    public static void main(String[] args) {
        System.out.println(findIndex(List.of("a", "b"), "b"));
        System.out.println(findIndex(List.of("a"), "z"));
        System.out.println(total(Map.of("tea", 2.5, "cake", 4.0)));
    }
}
```
```output-python
1
None
6.5
```
```output-java
Optional[1]
Optional.empty
6.5
```

:::compare
- Java's types are **mandatory and enforced** by the compiler. Python's hints are **optional and advisory** — `find_index(5, 5)` still runs (and fails at runtime).
- `Optional[int]` in Python means "an int or None". Java's `Optional<Integer>` is an actual wrapper object you must unwrap with `isPresent()`, `orElse(...)`, etc.
- The LeetCode-style starters in this platform use hints like `List[int]` and `Optional[TreeNode]` so you can see the expected types.
:::

=== generics | Generics
summary: Write classes and methods that work with any type, safely.
---
**Generics** let one class or method work with many types while the compiler still checks type safety. `List<String>` is a list that can only hold strings.

```java title="A generic container and method"
import java.util.*;

public class Main {
    static class Box<T> {
        private final T value;
        Box(T value) { this.value = value; }
        T get() { return value; }
    }

    static <T extends Comparable<T>> T maxOf(List<T> items) {
        T best = items.get(0);
        for (T x : items) if (x.compareTo(best) > 0) best = x;
        return best;
    }

    public static void main(String[] args) {
        Box<String> b = new Box<>("hello");
        String s = b.get();               // no cast needed
        System.out.println(s.toUpperCase());
        System.out.println(maxOf(List.of(3, 9, 4)));
        System.out.println(maxOf(List.of("pear", "apple", "zucchini")));
        // Box<int> -> not allowed: generics need objects, use Box<Integer>
    }
}
```
```python
from typing import Generic, TypeVar

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, value: T):
        self.value = value

    def get(self) -> T:
        return self.value

def max_of(items):
    best = items[0]
    for x in items:
        if x > best:
            best = x
    return best

print(Box("hello").get().upper())
print(max_of([3, 9, 4]))
print(max_of(["pear", "apple", "zucchini"]))
```
```output-java
HELLO
9
zucchini
```
```output-python
HELLO
9
zucchini
```

:::compare
- Java generics are checked at compile time and then **erased** — at runtime a `List<String>` is just a `List`. They only work with reference types, so primitives are boxed (`List<Integer>`).
- Bounded types (`<T extends Comparable<T>>`) restrict what `T` can be; wildcards (`List<? extends Number>`) accept families of types.
- Python is duck-typed, so any function already works with any type that supports the operations it uses. `TypeVar` and `Generic` exist only for type checkers.
:::

=== collections-framework | The Java Collections Framework
summary: Which collection to choose — List, Set, Map, Queue, Deque — and their Python counterparts.
---
Choosing the right collection is half of solving many problems. Here is the map between the two languages.

| Need | Java | Python | Typical cost |
|---|---|---|---|
| Ordered, indexable, resizable | `ArrayList` | `list` | O(1) index, O(1)* append |
| Fast add/remove at both ends | `ArrayDeque` | `collections.deque` | O(1) |
| Unique items, fast lookup | `HashSet` | `set` | O(1) avg |
| Unique items, sorted | `TreeSet` | (`sortedcontainers`, or sort + `bisect`) | O(log n) |
| Key → value | `HashMap` | `dict` | O(1) avg |
| Key → value, sorted keys | `TreeMap` | (sort keys when needed) | O(log n) |
| Insertion-ordered map | `LinkedHashMap` | `dict` (3.7+) | O(1) avg |
| Always get the smallest | `PriorityQueue` | `heapq` on a list | O(log n) push/pop |

```java title="Picking the right tool"
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1); stack.push(2);
        System.out.println("stack pop: " + stack.pop());

        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(1); queue.offer(2);
        System.out.println("queue poll: " + queue.poll());

        PriorityQueue<Integer> minHeap = new PriorityQueue<>(List.of(5, 1, 3));
        System.out.println("min: " + minHeap.poll());
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        maxHeap.addAll(List.of(5, 1, 3));
        System.out.println("max: " + maxHeap.poll());

        TreeMap<Integer, String> scores = new TreeMap<>(Map.of(70, "C", 80, "B", 90, "A"));
        System.out.println("floor(85): " + scores.floorEntry(85).getValue());
    }
}
```
```python
from collections import deque
import heapq
import bisect

stack = [1, 2]
print("stack pop:", stack.pop())

queue = deque([1, 2])
print("queue poll:", queue.popleft())

heap = [5, 1, 3]
heapq.heapify(heap)
print("min:", heapq.heappop(heap))
max_heap = [-x for x in [5, 1, 3]]
heapq.heapify(max_heap)
print("max:", -heapq.heappop(max_heap))

keys, grades = [70, 80, 90], ["C", "B", "A"]
i = bisect.bisect_right(keys, 85) - 1
print("floor(85):", grades[i])
```
```output
stack pop: 2
queue poll: 1
min: 1
max: 5
floor(85): B
```

:::warning
Avoid the legacy `Stack` and `Vector` classes in Java (synchronised and slower). Use `ArrayDeque` for both stacks and queues. Also avoid `LinkedList` as a general-purpose list — `ArrayList` is faster for almost everything.
:::

=== streams | Lambdas & Streams in Depth
summary: Declarative data pipelines in Java — and the Python idioms that match them.
---
A **stream** is a pipeline: a source, zero or more intermediate operations (`filter`, `map`, `sorted`, `distinct`), and one terminal operation (`collect`, `sum`, `count`, `forEach`, `reduce`). Streams are lazy — nothing runs until the terminal operation.

```java title="Grouping and aggregating"
import java.util.*;
import java.util.stream.*;

public class Main {
    record Person(String name, String city, int age) {}

    public static void main(String[] args) {
        List<Person> people = List.of(
            new Person("Ada", "London", 36),
            new Person("Alan", "London", 41),
            new Person("Grace", "NYC", 45));

        double avg = people.stream().mapToInt(Person::age).average().orElse(0);
        System.out.println("average age: " + avg);

        Map<String, List<String>> byCity = people.stream().collect(
            Collectors.groupingBy(Person::city, TreeMap::new,
                Collectors.mapping(Person::name, Collectors.toList())));
        System.out.println(byCity);

        String names = people.stream().filter(p -> p.age() > 40).map(Person::name)
            .sorted().collect(Collectors.joining(", "));
        System.out.println(names);

        int sumSquares = IntStream.rangeClosed(1, 5).map(x -> x * x).sum();
        System.out.println(sumSquares);
    }
}
```
```python
from collections import defaultdict

people = [("Ada", "London", 36), ("Alan", "London", 41), ("Grace", "NYC", 45)]

avg = sum(p[2] for p in people) / len(people)
print("average age:", round(avg, 4))

by_city = defaultdict(list)
for name, city, _ in people:
    by_city[city].append(name)
print(dict(sorted(by_city.items())))

names = ", ".join(sorted(p[0] for p in people if p[2] > 40))
print(names)

print(sum(x * x for x in range(1, 6)))
```
```output-java
average age: 40.666666666666664
{London=[Ada, Alan], NYC=[Grace]}
Alan, Grace
55
```
```output-python
average age: 40.6667
{'London': ['Ada', 'Alan'], 'NYC': ['Grace']}
Alan, Grace
55
```

:::tip
Streams shine for transformations and aggregations. For algorithmic code with indices, early exits or mutable state, a plain loop is usually clearer and faster.
:::

=== static-final | static, final & Memory
summary: Class-level members, constants, immutability, and stack vs heap.
---
## static and final

```java title="static and final in practice"
public class Main {
    static final double TAX = 0.2;          // constant shared by the class
    static int instances = 0;               // class-level counter

    final String id;                        // must be set once, in the constructor

    Main(String id) {
        this.id = id;
        instances++;
    }

    static double withTax(double price) {   // no object needed to call it
        return price * (1 + TAX);
    }

    public static void main(String[] args) {
        new Main("a");
        new Main("b");
        System.out.println(instances + " " + withTax(10));
        final int[] arr = {1, 2};
        arr[0] = 99;                         // allowed: the array object is mutable
        // arr = new int[3];                 // not allowed: the reference is final
        System.out.println(arr[0]);
    }
}
```
```python
TAX = 0.2                     # module-level "constant" (by convention)

class Item:
    instances = 0             # class attribute

    def __init__(self, id):
        self.id = id
        Item.instances += 1

    @staticmethod
    def with_tax(price):
        return price * (1 + TAX)

Item("a"); Item("b")
print(Item.instances, Item.with_tax(10))
arr = (1, 2)                  # tuples are immutable containers
print(arr[0])
```
```output-java
2 12.0
99
```
```output-python
2 12.0
1
```

## Stack and heap

Local variables and call frames live on the **stack**; objects live on the **heap**. A variable holding an object stores a **reference** (an address) to it. That's why two variables can refer to the same list, and why passing an object to a method lets the method mutate it.

Both languages free memory automatically with a **garbage collector** — when nothing references an object any more, its memory is reclaimed.

:::compare
- Java primitives (`int`, `double`, `boolean`, `char`…) are stored directly in the variable. Everything else is an object on the heap.
- In Python, **everything** is an object — even `5` — and variables are always references. Small integers and short strings are cached and shared.
- `final` (Java) makes a *reference* unchangeable, not the object. For true immutability, make all fields `final` and don't expose mutators (or use records).
:::
