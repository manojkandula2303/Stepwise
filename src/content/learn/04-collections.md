=== lists-arrays | Lists & Arrays
summary: Ordered collections — Python's list, Java's fixed-size array and resizable ArrayList.
practice: max-in-list, second-largest, running-sum-basic
---
A list stores many values in order, each reachable by index. This is the single most used data structure in programming.

:::viz array 10,20,30,40 | caption=Indices start at 0. Access by index is O(1).
:::

## Creating and accessing

```python title="Python list"
nums = [10, 20, 30, 40]
print(nums[0], nums[-1], len(nums))
nums[1] = 25
nums.append(50)
nums.insert(0, 5)
print(nums)
nums.pop()          # remove last
nums.remove(25)     # remove first matching value
print(nums)
```
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};            // fixed size
        System.out.println(arr[0] + " " + arr[arr.length - 1] + " " + arr.length);

        List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 40));
        nums.set(1, 25);
        nums.add(50);
        nums.add(0, 5);
        System.out.println(nums);
        nums.remove(nums.size() - 1);            // remove last (by index)
        nums.remove(Integer.valueOf(25));        // remove by value
        System.out.println(nums);
    }
}
```
```output-python
10 40 4
[5, 10, 25, 30, 40, 50]
[5, 10, 30, 40]
```
```output-java
10 40 4
[5, 10, 25, 30, 40, 50]
[5, 10, 30, 40]
```

:::compare
- **Python `list`** is dynamic: it grows and shrinks, and can hold values of mixed types.
- **Java arrays** (`int[]`) have a **fixed length** chosen at creation, and hold one type. They can store primitives directly, so they're fast and memory-efficient.
- **Java `ArrayList<Integer>`** is the resizable equivalent of a Python list. It holds objects, so `int` values are **boxed** into `Integer`.
- Watch out: `list.remove(1)` on a `List<Integer>` removes the element **at index 1**. To remove the value 1, use `remove(Integer.valueOf(1))`.
:::

## Operation costs

| Operation | Python list / ArrayList | Why |
|---|---|---|
| Read/write by index | O(1) | Elements sit next to each other in memory |
| Append at end | O(1) amortised | Occasionally the backing array is doubled |
| Insert/remove at front or middle | O(n) | Later elements must shift |
| Search for a value | O(n) | Must check items one by one |

## Useful operations

```python title="Sorting, searching, copying"
nums = [5, 2, 9, 1]
print(sorted(nums), nums)     # sorted() returns a new list
nums.sort(reverse=True)       # sort in place
print(nums)
print(9 in nums, nums.index(9))
print(sum(nums), min(nums), max(nums))
copy = nums[:]                # shallow copy
copy[0] = 100
print(nums[0], copy[0])
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] nums = {5, 2, 9, 1};
        int[] sortedCopy = nums.clone();
        Arrays.sort(sortedCopy);
        System.out.println(Arrays.toString(sortedCopy) + " " + Arrays.toString(nums));

        List<Integer> list = new ArrayList<>(List.of(5, 2, 9, 1));
        list.sort(Collections.reverseOrder());
        System.out.println(list);
        System.out.println(list.contains(9) + " " + list.indexOf(9));
        int sum = 0;
        for (int x : list) sum += x;
        System.out.println(sum + " " + Collections.min(list) + " " + Collections.max(list));
        List<Integer> copy = new ArrayList<>(list);
        copy.set(0, 100);
        System.out.println(list.get(0) + " " + copy.get(0));
    }
}
```
```output-python
[1, 2, 5, 9] [5, 2, 9, 1]
[9, 5, 2, 1]
True 0
17 1 9
9 100
```
```output-java
[1, 2, 5, 9] [5, 2, 9, 1]
[9, 5, 2, 1]
true 0
17 1 9
9 100
```

## References, not copies

```python title="Two names, one list"
a = [1, 2, 3]
b = a          # b refers to the SAME list
b.append(4)
print(a)
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(List.of(1, 2, 3));
        List<Integer> b = a;     // same object
        b.add(4);
        System.out.println(a);
    }
}
```
```output
[1, 2, 3, 4]
```

Use **Visualize** here: both variables point to one list object. Assignment copies the *reference*, not the contents.

:::warning
- Python `[[0] * 3] * 3` creates three references to the **same** inner list — changing one row changes all. Use `[[0] * 3 for _ in range(3)]`.
- Java `Arrays.toString(arr)` is needed to print an array; `System.out.println(arr)` prints something like `[I@1b6d3586`.
:::

:::quiz
Q: In Java, which structure should you use when you don't know in advance how many elements you will store?
- `int[]`
- [x] `ArrayList<Integer>`
- `String`
- `int`
> Arrays have a fixed length. `ArrayList` resizes automatically as you add elements.
:::

=== matrices | 2D Lists & Matrices
summary: Grids of values — rows and columns, traversal patterns, and common pitfalls.
practice: matrix-sum, transpose-matrix
---
A 2D array (matrix) is a list of rows, where each row is itself a list. `grid[r][c]` is the element in row `r`, column `c`.

:::viz matrix 1,2,3;4,5,6;7,8,9 | hl=1:2 | caption=grid[1][2] is 6
:::

## Creating and traversing

```python title="Row-by-row traversal"
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
rows, cols = len(grid), len(grid[0])
for r in range(rows):
    for c in range(cols):
        print(grid[r][c], end=" ")
    print()
print("center:", grid[1][1])
zeros = [[0] * cols for _ in range(rows)]
print(zeros)
```
```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9},
        };
        int rows = grid.length, cols = grid[0].length;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                System.out.print(grid[r][c] + " ");
            }
            System.out.println();
        }
        System.out.println("center: " + grid[1][1]);
        int[][] zeros = new int[rows][cols];      // filled with 0
        System.out.println(Arrays.deepToString(zeros));
    }
}
```
```output-python
1 2 3 
4 5 6 
7 8 9 
center: 5
[[0, 0, 0], [0, 0, 0], [0, 0, 0]]
```
```output-java
1 2 3 
4 5 6 
7 8 9 
center: 5
[[0, 0, 0], [0, 0, 0], [0, 0, 0]]
```

## Neighbours in a grid

Grid problems (islands, flood fill, shortest path in a maze) visit the 4 neighbours of a cell. A direction list keeps the code tidy:

```python title="Four-directional neighbours"
grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
r, c = 0, 1
for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
    nr, nc = r + dr, c + dc
    if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
        print(grid[nr][nc], end=" ")
print()
```
```java
public class Main {
    public static void main(String[] args) {
        int[][] grid = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int r = 0, c = 1;
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
                System.out.print(grid[nr][nc] + " ");
            }
        }
        System.out.println();
    }
}
```
```output
5 1 3 
```

:::warning
Always check bounds **before** indexing. Python's negative indices make `grid[-1][c]` silently read the last row instead of failing — a subtle bug in neighbour checks.
:::

=== tuples | Tuples & Records
summary: Fixed groups of values — Python tuples, and how Java models the same idea.
---
A **tuple** groups a fixed number of values together, like a point `(x, y)` or a `(name, age)` pair.

```python title="Tuples and unpacking"
point = (3, 4)
x, y = point                # unpacking
print(x, y, point[0])
# point[0] = 5              -> TypeError: tuples are immutable

def min_max(nums):
    return min(nums), max(nums)   # returns a tuple

lo, hi = min_max([4, 1, 9])
print(lo, hi)
pairs = [("b", 2), ("a", 1)]
print(sorted(pairs))        # tuples compare element by element
```
```java
import java.util.*;

public class Main {
    record Point(int x, int y) {}
    record MinMax(int min, int max) {}

    static MinMax minMax(int[] nums) {
        int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
        for (int n : nums) { lo = Math.min(lo, n); hi = Math.max(hi, n); }
        return new MinMax(lo, hi);
    }

    public static void main(String[] args) {
        Point point = new Point(3, 4);
        System.out.println(point.x() + " " + point.y() + " " + point);
        MinMax mm = minMax(new int[]{4, 1, 9});
        System.out.println(mm.min() + " " + mm.max());
        int[] pair = {1, 2};          // quick-and-dirty pair as an array
        System.out.println(pair[0] + pair[1]);
    }
}
```
```output-python
3 4 3
1 9
[('a', 1), ('b', 2)]
```
```output-java
3 4 Point[x=3, y=4]
1 9
3
```

:::compare
- Python tuples are built in, immutable, hashable (usable as dictionary keys and set members), and support unpacking: `a, b = b, a`.
- Java has no tuple type. Use a **record** (Java 16+) — a concise immutable class with named fields and built-in `equals`, `hashCode` and `toString`. For quick algorithmic code, a small `int[]` or `Map.Entry` is also common.
- To return two values from a Java method, return a record or an array.
:::

=== sets | Sets
summary: Unordered collections of unique values with fast membership tests.
practice: contains-duplicate-basic, unique-count
---
A **set** stores each value at most once and answers *"is x in here?"* in O(1) average time — much faster than scanning a list.

```python title="Set basics"
seen = set()
for x in [3, 1, 3, 2, 1]:
    seen.add(x)
print(len(seen), 2 in seen, 7 in seen)

a, b = {1, 2, 3}, {2, 3, 4}
print(a | b)    # union
print(a & b)    # intersection
print(a - b)    # difference
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<Integer> seen = new HashSet<>();
        for (int x : new int[]{3, 1, 3, 2, 1}) {
            seen.add(x);
        }
        System.out.println(seen.size() + " " + seen.contains(2) + " " + seen.contains(7));

        Set<Integer> a = new TreeSet<>(List.of(1, 2, 3));
        Set<Integer> b = new TreeSet<>(List.of(2, 3, 4));
        Set<Integer> union = new TreeSet<>(a); union.addAll(b);
        Set<Integer> inter = new TreeSet<>(a); inter.retainAll(b);
        Set<Integer> diff = new TreeSet<>(a); diff.removeAll(b);
        System.out.println(union);
        System.out.println(inter);
        System.out.println(diff);
    }
}
```
```output-python
3 True False
{1, 2, 3, 4}
{2, 3}
{1}
```
```output-java
3 true false
[1, 2, 3, 4]
[2, 3]
[1]
```

:::compare
- Python: `set()`, `{1, 2}` literal (but `{}` is an empty **dict**), operators `| & - ^`.
- Java: `HashSet` (fast, unordered), `LinkedHashSet` (keeps insertion order), `TreeSet` (sorted, O(log n) operations, has `first()`, `floor()`, `ceiling()`).
- `add` in Java returns `false` if the element was already present — handy for duplicate detection.
:::

:::tip
"Have I seen this before?" is one of the most common sub-problems in interviews. Reach for a set.
:::

=== dictionaries | Dictionaries & Hash Maps
summary: Key → value lookups in O(1) — counting, grouping and caching.
practice: char-frequency, word-count-basic
---
A **dictionary** (Python `dict`) or **hash map** (Java `HashMap`) maps keys to values. You look up a value by its key instantly, without scanning.

:::viz hashmap "apple":3,"banana":1,"cherry":5 | caption=Each key maps to exactly one value
:::

## Basic operations

```python title="Create, read, update, delete"
stock = {"apple": 3, "banana": 1}
stock["cherry"] = 5          # insert
stock["apple"] += 2          # update
print(stock["apple"])
print(stock.get("kiwi", 0))  # default when missing
del stock["banana"]
print("banana" in stock, len(stock))
for fruit, qty in stock.items():
    print(fruit, qty)
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> stock = new LinkedHashMap<>();
        stock.put("apple", 3);
        stock.put("banana", 1);
        stock.put("cherry", 5);
        stock.put("apple", stock.get("apple") + 2);
        System.out.println(stock.get("apple"));
        System.out.println(stock.getOrDefault("kiwi", 0));
        stock.remove("banana");
        System.out.println(stock.containsKey("banana") + " " + stock.size());
        for (Map.Entry<String, Integer> e : stock.entrySet()) {
            System.out.println(e.getKey() + " " + e.getValue());
        }
    }
}
```
```output-python
5
0
False 2
apple 5
cherry 5
```
```output-java
5
0
false 2
apple 5
cherry 5
```

## Counting — the classic pattern

```python title="Character frequencies"
from collections import Counter

text = "banana"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)
print(Counter(text).most_common(1))
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = "banana";
        Map<Character, Integer> counts = new TreeMap<>();
        for (char ch : text.toCharArray()) {
            counts.merge(ch, 1, Integer::sum);
        }
        System.out.println(counts);
    }
}
```
```output-python
{'b': 1, 'a': 3, 'n': 2}
[('a', 3)]
```
```output-java
{a=3, b=1, n=2}
```

:::compare
- Missing keys: Python `d[k]` raises `KeyError`; Java `map.get(k)` returns `null` (and unboxing `null` to `int` throws `NullPointerException`). Use `get(k, default)` / `getOrDefault(k, default)`.
- Python dicts keep **insertion order** (3.7+). Java `HashMap` has no guaranteed order; use `LinkedHashMap` for insertion order or `TreeMap` for sorted keys.
- Handy helpers: Python `collections.Counter` and `defaultdict(list)`; Java `merge`, `computeIfAbsent(k, x -> new ArrayList<>()).add(v)`.
- Keys must be **hashable/immutable**: tuples and strings work in Python, lists don't. In Java, keys need correct `equals` and `hashCode`.
:::

:::quiz
Q: What does Java's `map.get("missing")` return for a `Map<String, Integer>`?
- `0`
- [x] `null`
- It throws an exception
- An empty string
> `get` returns `null` for absent keys. Assigning that to an `int` causes a `NullPointerException`, so prefer `getOrDefault`.
:::

=== comprehensions | Comprehensions & Streams
summary: Build collections declaratively — Python comprehensions and their Java Stream equivalents.
---
Transforming and filtering collections is so common that both languages have a compact syntax for it.

```python title="Map and filter in one line"
nums = [1, 2, 3, 4, 5, 6]
squares = [x * x for x in nums]
evens = [x for x in nums if x % 2 == 0]
lookup = {x: x * x for x in nums if x > 3}
unique_lengths = {len(w) for w in ["hi", "yo", "hey"]}
print(squares)
print(evens)
print(lookup)
print(unique_lengths)
```
```java
import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
        List<Integer> squares = nums.stream().map(x -> x * x).collect(Collectors.toList());
        List<Integer> evens = nums.stream().filter(x -> x % 2 == 0).collect(Collectors.toList());
        Map<Integer, Integer> lookup = nums.stream().filter(x -> x > 3)
            .collect(Collectors.toMap(x -> x, x -> x * x, (a, b) -> a, TreeMap::new));
        Set<Integer> uniqueLengths = Stream.of("hi", "yo", "hey").map(String::length).collect(Collectors.toCollection(TreeSet::new));
        System.out.println(squares);
        System.out.println(evens);
        System.out.println(lookup);
        System.out.println(uniqueLengths);
    }
}
```
```output-python
[1, 4, 9, 16, 25, 36]
[2, 4, 6]
{4: 16, 5: 25, 6: 36}
{2, 3}
```
```output-java
[1, 4, 9, 16, 25, 36]
[2, 4, 6]
{4=16, 5=25, 6=36}
[2, 3]
```

:::compare
- A Python comprehension `[expr for item in iterable if condition]` reads left to right like a sentence.
- Java Streams chain operations: `.stream()`, `.filter(...)`, `.map(...)`, then a terminal operation like `.collect(...)`, `.sum()`, `.count()`.
- For primitive arrays use `Arrays.stream(int[])` or `IntStream.range(0, n)`, which avoid boxing.
- Both are optional — a plain loop is always fine, and often clearer when logic gets complex.
:::

:::python
Generator expressions use parentheses and produce values lazily: `sum(x * x for x in range(10**6))` never builds the full list in memory.
:::
