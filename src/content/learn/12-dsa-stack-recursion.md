=== stack | Stacks
summary: Last-in, first-out — matching brackets, undo, and expression evaluation.
practice: valid-parentheses, min-stack, evaluate-rpn
---
A **stack** is a LIFO (last in, first out) collection: you **push** onto the top and **pop** from the top, like a pile of plates. Both operations are O(1).

:::viz stack 3,7,1 | caption=push adds to the top; pop removes the top (1)
:::

Stacks appear whenever the most recent unfinished thing must be handled first: matching brackets, undo history, the function call stack, depth-first search.

## Using a stack

```python title="Python list as a stack"
stack = []
stack.append(3)       # push
stack.append(7)
stack.append(1)
print(stack[-1])      # peek
print(stack.pop())    # pop
print(stack, len(stack) == 0)
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(3);
        stack.push(7);
        stack.push(1);
        System.out.println(stack.peek());
        System.out.println(stack.pop());
        System.out.println(stack + " " + stack.isEmpty());
    }
}
```
```output-python
1
1
[3, 7] False
```
```output-java
1
1
[7, 3] false
```

:::compare
- Python: a plain `list` — `append` to push, `pop()` to pop, `stack[-1]` to peek.
- Java: `ArrayDeque` — `push`, `pop`, `peek`. Note `ArrayDeque` prints from the **top** down. Avoid the legacy `Stack` class.
- Popping an empty stack fails: `IndexError` in Python, `NoSuchElementException` in Java. `peek` on an empty `ArrayDeque` returns `null`.
:::

## Matching brackets

```python title="Valid parentheses"
def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack

for s in ["()[]{}", "([)]", "{[]}", "(("]:
    print(s, is_valid(s))
```
```java
import java.util.*;

public class Main {
    static boolean isValid(String s) {
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        Deque<Character> stack = new ArrayDeque<>();
        for (char ch : s.toCharArray()) {
            if (pairs.containsKey(ch)) {
                if (stack.isEmpty() || stack.pop() != pairs.get(ch)) return false;
            } else {
                stack.push(ch);
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        for (String s : new String[]{"()[]{}", "([)]", "{[]}", "(("}) System.out.println(s + " " + isValid(s));
    }
}
```
```output-python
()[]{} True
([)] False
{[]} True
(( False
```
```output-java
()[]{} true
([)] false
{[]} true
(( false
```

## Dry run — `"{[]}"`

| char | action | stack after |
|---|---|---|
| `{` | push | `{` |
| `[` | push | `{ [` |
| `]` | pop `[` ✓ matches | `{` |
| `}` | pop `{` ✓ matches | (empty) |

Empty at the end → valid.

:::complexity
Push / pop / peek: O(1)
Bracket matching: O(n) time, O(n) space
:::

=== queue | Queues & Deques
summary: First-in, first-out processing, double-ended queues, and BFS.
practice: number-of-recent-calls, binary-tree-level-order
---
A **queue** is FIFO (first in, first out): add at the **back**, remove from the **front**, like a line at a counter. A **deque** (double-ended queue) supports O(1) add and remove at both ends.

:::viz queue 5,9,2 | caption=enqueue at the back, dequeue from the front (5)
:::

```python title="collections.deque"
from collections import deque

q = deque()
q.append("a")        # enqueue
q.append("b")
q.append("c")
print(q.popleft())   # dequeue -> "a"
print(q[0])          # peek front
q.appendleft("z")    # deque: add at the front too
print(list(q))
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Deque<String> q = new ArrayDeque<>();
        q.offer("a");           // enqueue at the back
        q.offer("b");
        q.offer("c");
        System.out.println(q.poll());    // dequeue -> "a"
        System.out.println(q.peek());    // peek front
        q.offerFirst("z");               // deque: add at the front
        System.out.println(q);
    }
}
```
```output-python
a
b
['z', 'b', 'c']
```
```output-java
a
b
[z, b, c]
```

:::warning
Don't use a Python `list` as a queue: `list.pop(0)` is O(n) because every remaining element shifts. `deque.popleft()` is O(1). In Java, `ArrayDeque` is the default choice for both queues and stacks.
:::

## Queues drive breadth-first search

Processing items in arrival order explores things **level by level** — the basis of BFS on trees and graphs.

```python title="Level-by-level processing"
from collections import deque

# Each person knows some others; find how many "hops" from Ada to everyone.
friends = {"Ada": ["Bob", "Cy"], "Bob": ["Dee"], "Cy": ["Dee", "Eve"], "Dee": [], "Eve": []}
dist = {"Ada": 0}
q = deque(["Ada"])
while q:
    person = q.popleft()
    for f in friends[person]:
        if f not in dist:
            dist[f] = dist[person] + 1
            q.append(f)
print(dist)
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, List<String>> friends = new HashMap<>();
        friends.put("Ada", List.of("Bob", "Cy"));
        friends.put("Bob", List.of("Dee"));
        friends.put("Cy", List.of("Dee", "Eve"));
        friends.put("Dee", List.of());
        friends.put("Eve", List.of());
        Map<String, Integer> dist = new LinkedHashMap<>();
        dist.put("Ada", 0);
        Deque<String> q = new ArrayDeque<>(List.of("Ada"));
        while (!q.isEmpty()) {
            String person = q.poll();
            for (String f : friends.get(person)) {
                if (!dist.containsKey(f)) {
                    dist.put(f, dist.get(person) + 1);
                    q.offer(f);
                }
            }
        }
        System.out.println(dist);
    }
}
```
```output-python
{'Ada': 0, 'Bob': 1, 'Cy': 1, 'Dee': 2, 'Eve': 2}
```
```output-java
{Ada=0, Bob=1, Cy=1, Dee=2, Eve=2}
```

:::complexity
Enqueue / dequeue (deque): O(1)
:::

=== monotonic-stack | Monotonic Stack & Queue
summary: Keep a stack in sorted order to find the next greater/smaller element in O(n).
practice: daily-temperatures, next-greater-element
---
A **monotonic stack** keeps its elements in increasing (or decreasing) order. Before pushing a new element, you pop everything that breaks the order — and each pop *answers a question* about the popped element.

Classic question: **for each element, what is the next element to its right that is greater?** Brute force is O(n²); a monotonic stack does it in O(n).

```python title="Next greater element for every index"
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                    # indices with values in decreasing order
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x  # x is the next greater for that index
        stack.append(i)
    return res

print(next_greater([2, 1, 5, 3, 4]))
```
```java
import java.util.*;

public class Main {
    static int[] nextGreater(int[] nums) {
        int[] res = new int[nums.length];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>();   // indices, values decreasing
        for (int i = 0; i < nums.length; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                res[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{2, 1, 5, 3, 4})));
    }
}
```
```output
[5, 5, -1, 4, -1]
```

## Dry run

| i | x | pops (index → answer) | stack (values) |
|---|---|---|---|
| 0 | 2 | — | 2 |
| 1 | 1 | — | 2 1 |
| 2 | 5 | 1 → 5, 0 → 5 | 5 |
| 3 | 3 | — | 5 3 |
| 4 | 4 | 3 → 4 | 5 4 |

Indices left on the stack (2 and 4) have no greater element: −1.

:::complexity
Time: O(n) — each index is pushed and popped at most once
Space: O(n)
:::

:::tip
Variants: *previous* greater (scan right to left), next *smaller* (flip the comparison), largest rectangle in a histogram, daily temperatures, stock span. A **monotonic deque** solves the sliding-window maximum in O(n).
:::

=== recursion | Recursion in Depth
summary: Recursion trees, the call stack, and memoization.
practice: fibonacci-memo, power-of-two-basic, climbing-stairs
---
A recursive function solves a problem by calling itself on smaller inputs. To design one, answer three questions:

1. **What is the smallest input I can answer directly?** (base case)
2. **How do I shrink the problem?**
3. **How do I combine the smaller answer(s)?**

## The call stack

Every call gets its own **frame** with its own parameters and local variables. Frames stack up until a base case returns, then unwind. The maximum stack depth is the recursion's **space** cost.

```python title="Sum of a list, recursively"
def total(nums, i=0):
    if i == len(nums):          # base case: nothing left
        return 0
    return nums[i] + total(nums, i + 1)

print(total([4, 2, 7]))
```
```java
public class Main {
    static int total(int[] nums, int i) {
        if (i == nums.length) {           // base case: nothing left
            return 0;
        }
        return nums[i] + total(nums, i + 1);
    }

    public static void main(String[] args) {
        System.out.println(total(new int[]{4, 2, 7}, 0));
    }
}
```
```output
13
```

**Visualize** this to watch four frames build up and then return 0, 7, 9, 13.

## Recursion trees and repeated work

Naive Fibonacci makes **two** calls per level, so its call tree has about 2ⁿ nodes — and computes the same values over and over.

:::viz tree fib(4),fib(3),fib(2),fib(2),fib(1),fib(1),fib(0),fib(1),fib(0) | hl=2,3 | caption=fib(2) is computed twice already at n = 4
:::

**Memoization** stores each result the first time it's computed, so every subproblem is solved once: O(2ⁿ) → O(n).

```python title="Fibonacci: naive vs memoized"
from functools import lru_cache

calls = 0
def fib_naive(n):
    global calls
    calls += 1
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)

@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

print(fib_naive(20), "calls:", calls)
print(fib_memo(90))
```
```java
import java.util.*;

public class Main {
    static int calls = 0;
    static int fibNaive(int n) {
        calls++;
        return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
    }

    static Map<Integer, Long> memo = new HashMap<>();
    static long fibMemo(int n) {
        if (n < 2) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long v = fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, v);
        return v;
    }

    public static void main(String[] args) {
        System.out.println(fibNaive(20) + " calls: " + calls);
        System.out.println(fibMemo(90));
    }
}
```
```output
6765 calls: 21891
2880067194370816120
```

:::complexity
Naive Fibonacci: O(2ⁿ) time, O(n) stack space
Memoized Fibonacci: O(n) time, O(n) space
:::

:::warning
- Python's default recursion limit is about 1000 frames; deep recursion raises `RecursionError`. Java's default stack fits a few thousand frames before `StackOverflowError`. Convert very deep recursion to iteration.
- Every recursive path must reach a base case. Check edge inputs (0, empty, negative).
:::

=== backtracking | Backtracking
summary: Build solutions step by step, undoing choices that can't lead anywhere.
practice: subsets, permutations, combination-sum, generate-parentheses, n-queens-ii
---
**Backtracking** explores all candidate solutions by making a choice, recursing, then **undoing** the choice and trying the next one. It's a depth-first search over a tree of decisions.

```
choose → explore (recurse) → un-choose
```

## Generating all subsets

At each element, branch on two choices: include it or not.

```python title="All subsets"
def subsets(nums):
    result, path = [], []

    def backtrack(i):
        if i == len(nums):
            result.append(path[:])      # record a copy
            return
        path.append(nums[i])            # choose: include nums[i]
        backtrack(i + 1)
        path.pop()                      # un-choose
        backtrack(i + 1)                # exclude nums[i]

    backtrack(0)
    return result

print(subsets([1, 2, 3]))
```
```java
import java.util.*;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void backtrack(int[] nums, int i, List<Integer> path) {
        if (i == nums.length) {
            result.add(new ArrayList<>(path));    // record a copy
            return;
        }
        path.add(nums[i]);                        // choose
        backtrack(nums, i + 1, path);
        path.remove(path.size() - 1);             // un-choose
        backtrack(nums, i + 1, path);             // exclude
    }

    public static void main(String[] args) {
        backtrack(new int[]{1, 2, 3}, 0, new ArrayList<>());
        System.out.println(result);
    }
}
```
```output-python
[[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
```
```output-java
[[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
```

:::viz tree {},{1},{},{1 2},{1},{2},{} | caption=Each level decides one element: left = include, right = exclude
:::

## Permutations with a "used" set

```python title="All orderings"
def permutations(nums):
    result, path, used = [], [], [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False

    backtrack()
    return result

print(permutations([1, 2, 3]))
```
```java
import java.util.*;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void backtrack(int[] nums, boolean[] used, List<Integer> path) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        backtrack(nums, new boolean[nums.length], new ArrayList<>());
        System.out.println(result);
    }
}
```
```output-python
[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```
```output-java
[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```

## Pruning

Backtracking gets fast by **pruning** — abandoning a branch as soon as it can't succeed (sum already exceeds the target, a queen is attacked, too many open brackets). Pruning doesn't change the worst-case bound but often cuts real running time dramatically.

:::complexity
Subsets: O(n · 2ⁿ) time
Permutations: O(n · n!) time
Space: O(n) recursion depth (plus output)
:::

:::warning
- Append a **copy** of the path (`path[:]`, `new ArrayList<>(path)`). Appending `path` itself stores a reference that you then keep modifying — every result ends up empty.
- Every "choose" must have a matching "un-choose" on every path out of the call.
:::

:::quiz
Q: How many subsets does a set of 5 distinct elements have?
- 10
- 25
- [x] 32
- 120
> Each element is either in or out: 2⁵ = 32 subsets, including the empty set.
:::
