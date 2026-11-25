=== kmp | KMP String Matching
summary: Find every occurrence of a pattern in O(n + m) using the prefix function, never re-reading the text.
practice: find-index-first-occurrence, repeated-substring-pattern
---
The naive way to find a pattern of length `m` in a text of length `n` tries every start position and compares up to `m` characters: O(n · m) in the worst case (think pattern `aaaab` in text `aaaa…a`). **Knuth–Morris–Pratt** (KMP) finds every occurrence in **O(n + m)**.

The insight: after a mismatch, the characters you just matched are known. They tell you how far you can shift the pattern without missing a match, so you never move backwards in the text.

## The prefix function

For each position `i` of a string, `pi[i]` is the length of the longest **proper prefix** of `s[0..i]` that is also a **suffix** of it.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| s[i] | a | a | b | a | a | a | b |
| pi[i] | 0 | 1 | 0 | 1 | 2 | 2 | 3 |

At `i = 6`, the prefix `aab` equals the suffix `aab`, so `pi[6] = 3`.

```python title="Prefix function and KMP search"
def prefix_function(s):
    pi = [0] * len(s)
    for i in range(1, len(s)):
        j = pi[i - 1]                    # length of the current border
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]                # fall back to a shorter border
        if s[i] == s[j]:
            j += 1
        pi[i] = j
    return pi

def kmp_search(text, pattern):
    pi = prefix_function(pattern)
    matches, j = [], 0                   # j = characters of pattern matched
    for i, ch in enumerate(text):
        while j > 0 and ch != pattern[j]:
            j = pi[j - 1]
        if ch == pattern[j]:
            j += 1
        if j == len(pattern):
            matches.append(i - j + 1)
            j = pi[j - 1]                # keep going for overlapping matches
    return matches

print(prefix_function("aabaaab"))
print(kmp_search("abababab", "abab"))
```
```java
import java.util.*;

public class Main {
    static int[] prefixFunction(String s) {
        int[] pi = new int[s.length()];
        for (int i = 1; i < s.length(); i++) {
            int j = pi[i - 1];                       // length of the current border
            while (j > 0 && s.charAt(i) != s.charAt(j)) j = pi[j - 1];
            if (s.charAt(i) == s.charAt(j)) j++;
            pi[i] = j;
        }
        return pi;
    }

    static List<Integer> kmpSearch(String text, String pattern) {
        int[] pi = prefixFunction(pattern);
        List<Integer> matches = new ArrayList<>();
        int j = 0;                                   // characters of pattern matched
        for (int i = 0; i < text.length(); i++) {
            while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = pi[j - 1];
            if (text.charAt(i) == pattern.charAt(j)) j++;
            if (j == pattern.length()) {
                matches.add(i - j + 1);
                j = pi[j - 1];                       // keep going for overlapping matches
            }
        }
        return matches;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(prefixFunction("aabaaab")));
        System.out.println(kmpSearch("abababab", "abab"));
    }
}
```
```output
[0, 1, 0, 1, 2, 2, 3]
[0, 2, 4]
```

## Why it's linear

In the search loop, `j` increases by at most 1 per text character, and every fallback `j = pi[j − 1]` decreases it. `j` can't decrease more in total than it increased, so all the `while` loops together cost O(n). The same argument makes the prefix function O(m).

:::complexity
Time: O(n + m)
Space: O(m) for the prefix function
:::

:::tip
The prefix function answers more than searching: the **shortest period** of `s` is `len(s) − pi[last]`, which solves *Repeated Substring Pattern* in one line, and running it on `pattern + "#" + text` gives another way to search.
:::

:::quiz
Q: What is the prefix function of `"abab"`?
- `[0, 1, 2, 3]`
- [x] `[0, 0, 1, 2]`
- `[0, 0, 0, 0]`
- `[1, 0, 1, 0]`
> "a" → 0; "ab" → 0; "aba" has border "a" → 1; "abab" has border "ab" → 2.
:::

=== rabin-karp | Rabin–Karp & String Hashing
summary: Compare substrings in O(1) with rolling polynomial hashes — pattern search, duplicates and longest repeats.
practice: repeated-dna-sequences
---
**String hashing** maps a string to a number so two strings can be compared by comparing numbers. A **polynomial rolling hash** treats the string as a number in base `B`, taken modulo a large prime `M`:

`hash(s) = (s[0]·B^(k−1) + s[1]·B^(k−2) + … + s[k−1]) mod M`

Its power is the **rolling** update: sliding a window one step right removes the leftmost character and appends a new one in O(1):

`new = ((old − s[i]·B^(k−1)) · B + s[i+k]) mod M`

## Rabin–Karp search

Hash the pattern, slide a window of the same length across the text, and compare hashes. When the hashes match, compare the actual characters to rule out a **collision** (two different strings with the same hash).

```python title="Rabin–Karp with collision check"
def rabin_karp(text, pattern):
    B, M = 256, 1_000_000_007
    n, m = len(text), len(pattern)
    if m > n:
        return []
    high = pow(B, m - 1, M)              # B^(m-1) mod M, to remove the left character
    ph = th = 0
    for i in range(m):
        ph = (ph * B + ord(pattern[i])) % M
        th = (th * B + ord(text[i])) % M
    matches = []
    for i in range(n - m + 1):
        if ph == th and text[i:i + m] == pattern:      # verify on hash match
            matches.append(i)
        if i + m < n:                                   # roll the window
            th = ((th - ord(text[i]) * high) * B + ord(text[i + m])) % M
    return matches

print(rabin_karp("zabcxabcy", "abc"))
print(rabin_karp("aaaa", "aa"))
```
```java
import java.util.*;

public class Main {
    static List<Integer> rabinKarp(String text, String pattern) {
        final long B = 256, M = 1_000_000_007L;
        int n = text.length(), m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        if (m > n) return matches;
        long high = 1;
        for (int i = 0; i < m - 1; i++) high = high * B % M;   // B^(m-1) mod M
        long ph = 0, th = 0;
        for (int i = 0; i < m; i++) {
            ph = (ph * B + pattern.charAt(i)) % M;
            th = (th * B + text.charAt(i)) % M;
        }
        for (int i = 0; i + m <= n; i++) {
            if (ph == th && text.regionMatches(i, pattern, 0, m)) matches.add(i);   // verify on hash match
            if (i + m < n) {                                                         // roll the window
                th = (th - text.charAt(i) * high % M + M) % M;
                th = (th * B + text.charAt(i + m)) % M;
            }
        }
        return matches;
    }

    public static void main(String[] args) {
        System.out.println(rabinKarp("zabcxabcy", "abc"));
        System.out.println(rabinKarp("aaaa", "aa"));
    }
}
```
```output
[1, 5]
[0, 1, 2]
```

## Prefix hashes: any substring in O(1)

Precompute `h[i]` = hash of `s[0..i)` and powers `p[i] = B^i`. Then the hash of any substring `s[l..r)` is

`(h[r] − h[l] · p[r − l]) mod M`

so comparing two substrings of any length is O(1) after O(n) preprocessing. This powers solutions for *longest repeated substring* (binary search on the length, plus a set of hashes), *count distinct substrings*, and fast palindrome checks.

```python title="Comparing substrings with prefix hashes"
B, M = 131, 1_000_000_007
s = "abcabcab"
n = len(s)
h, p = [0] * (n + 1), [1] * (n + 1)
for i, ch in enumerate(s):
    h[i + 1] = (h[i] * B + ord(ch)) % M
    p[i + 1] = p[i] * B % M

def sub_hash(l, r):                      # hash of s[l:r]
    return (h[r] - h[l] * p[r - l]) % M

print(sub_hash(0, 3) == sub_hash(3, 6))  # "abc" vs "abc"
print(sub_hash(0, 3) == sub_hash(1, 4))  # "abc" vs "bca"
print(sub_hash(0, 5) == sub_hash(3, 8))  # "abcab" vs "abcab"
```
```java
public class Main {
    static final long B = 131, M = 1_000_000_007L;
    static long[] h, p;

    static long subHash(int l, int r) {      // hash of s[l:r]
        return ((h[r] - h[l] * p[r - l]) % M + M) % M;
    }

    public static void main(String[] args) {
        String s = "abcabcab";
        int n = s.length();
        h = new long[n + 1];
        p = new long[n + 1];
        p[0] = 1;
        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * B + s.charAt(i)) % M;
            p[i + 1] = p[i] * B % M;
        }
        System.out.println(subHash(0, 3) == subHash(3, 6));
        System.out.println(subHash(0, 3) == subHash(1, 4));
        System.out.println(subHash(0, 5) == subHash(3, 8));
    }
}
```
```output-python
True
False
True
```
```output-java
true
false
true
```

:::complexity
Rabin–Karp: O(n + m) expected, O(n · m) worst case if every window collides
Prefix hashes: O(n) preprocessing, O(1) per substring comparison
:::

:::warning
- **Collisions are possible.** Verify matches when correctness matters, or use two independent hashes (different `B` and `M`) to make collisions vanishingly rare.
- In Java, keep values in `long` and reduce modulo `M` after every multiplication; subtracting can go negative, so add `M` before taking the final `% M`.
- Python's `%` always returns a non-negative result, which is why the Python code needs no `+ M`.
:::

=== z-algorithm | Z-Algorithm
summary: For every position, the length of the longest substring starting there that matches a prefix — linear-time pattern matching.
---
The **Z-array** of a string `s` stores, for each position `i`, the length of the longest substring starting at `i` that is also a **prefix** of `s`. (By convention, `z[0]` is set to 0.)

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| s[i] | a | a | b | x | a | a | b |
| z[i] | 0 | 1 | 0 | 0 | 3 | 1 | 0 |

At `i = 4`, `aab` matches the prefix `aab`, so `z[4] = 3`.

## Computing it in O(n)

Keep the window `[l, r)` of the rightmost match found so far (`s[l..r)` equals a prefix). For a new `i` inside that window, the matching prefix tells you `z[i]` is at least `min(r − i, z[i − l])` for free; then extend character by character. Each extension pushes `r` right, so the total work is linear.

```python title="Z-function and pattern search"
def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])          # reuse the known match
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1                            # extend explicitly
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

def z_search(text, pattern):
    s = pattern + "$" + text                     # "$" never appears in the inputs
    z = z_function(s)
    m = len(pattern)
    return [i - m - 1 for i in range(m + 1, len(s)) if z[i] == m]

print(z_function("aabxaab"))
print(z_search("baabaab", "aab"))
```
```java
import java.util.*;

public class Main {
    static int[] zFunction(String s) {
        int n = s.length();
        int[] z = new int[n];
        for (int i = 1, l = 0, r = 0; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);              // reuse the known match
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;   // extend explicitly
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }

    static List<Integer> zSearch(String text, String pattern) {
        String s = pattern + "$" + text;                               // "$" never appears in the inputs
        int[] z = zFunction(s);
        int m = pattern.length();
        List<Integer> res = new ArrayList<>();
        for (int i = m + 1; i < s.length(); i++) if (z[i] == m) res.add(i - m - 1);
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(zFunction("aabxaab")));
        System.out.println(zSearch("baabaab", "aab"));
    }
}
```
```output
[0, 1, 0, 0, 3, 1, 0]
[1, 4]
```

:::complexity
Time: O(n)
Space: O(n)
:::

:::compare
KMP, Z and Rabin–Karp all match patterns in linear time. **Z** is often the easiest to write from memory. **KMP** streams the text without storing it. **Rabin–Karp** generalises best: multiple patterns of the same length, 2D matching, and arbitrary substring comparisons through prefix hashes.
:::

=== heap-sort | Heap Sort
summary: Sort in place in guaranteed O(n log n) by building a max-heap and repeatedly moving the maximum to the end.
practice: sort-an-array, kth-largest-element
---
**Heap sort** uses a binary max-heap stored inside the array itself:

1. **Heapify** the array into a max-heap (every parent ≥ its children). Sifting down every non-leaf, from the last one back to the root, takes O(n).
2. Repeatedly **swap the root (the maximum) with the last element** of the heap, shrink the heap by one, and sift the new root down. The sorted part grows from the right.

:::viz tree 13,11,12,5,6,7 | hl=0 | caption=After heapify, the maximum (13) is at the root, index 0
:::

```python title="In-place heap sort"
def heap_sort(a):
    n = len(a)

    def sift_down(i, size):
        while True:
            largest, l, r = i, 2 * i + 1, 2 * i + 2
            if l < size and a[l] > a[largest]:
                largest = l
            if r < size and a[r] > a[largest]:
                largest = r
            if largest == i:
                return
            a[i], a[largest] = a[largest], a[i]
            i = largest

    for i in range(n // 2 - 1, -1, -1):      # build the max-heap
        sift_down(i, n)
    for end in range(n - 1, 0, -1):          # move the max to the end
        a[0], a[end] = a[end], a[0]
        sift_down(0, end)
    return a

print(heap_sort([12, 11, 13, 5, 6, 7]))
```
```java
import java.util.Arrays;

public class Main {
    static void siftDown(int[] a, int i, int size) {
        while (true) {
            int largest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < size && a[l] > a[largest]) largest = l;
            if (r < size && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            int t = a[i]; a[i] = a[largest]; a[largest] = t;
            i = largest;
        }
    }

    static void heapSort(int[] a) {
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, i, n);   // build the max-heap
        for (int end = n - 1; end > 0; end--) {                     // move the max to the end
            int t = a[0]; a[0] = a[end]; a[end] = t;
            siftDown(a, 0, end);
        }
    }

    public static void main(String[] args) {
        int[] a = {12, 11, 13, 5, 6, 7};
        heapSort(a);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[5, 6, 7, 11, 12, 13]
```

## Dry run

| Phase | Array | Note |
|---|---|---|
| start | 12 11 13 5 6 7 | |
| after heapify | 13 11 12 5 6 7 | max at the root |
| swap 13 ↔ 7, sift | 12 11 7 5 6 \| 13 | 13 is in place |
| swap 12 ↔ 6, sift | 11 6 7 5 \| 12 13 | |
| … | 5 6 7 11 12 13 | sorted |

:::complexity
Time: O(n log n) in every case
Space: O(1) — fully in place
Stable: no
:::

:::compare
Heap sort's worst case is O(n log n) (quick sort's is O(n²)) and it needs no extra memory (merge sort needs O(n)). In practice it's usually slower than quick sort because it jumps around memory. Introsort, used by C++'s `std::sort`, switches to heap sort when quick sort recurses too deep.
:::

=== counting-radix-sort | Counting Sort & Radix Sort
summary: Beat O(n log n) for integers in a limited range by counting instead of comparing.
practice: sort-colors, h-index, maximum-gap
---
Comparison sorts can't beat O(n log n). But when keys are **small integers**, you don't need to compare them at all.

## Counting sort

If every value lies in `[0, k]`, count how often each value occurs, then write the values back in order. **O(n + k)**.

The stable version computes **prefix sums** of the counts (so each value knows where its block ends) and places elements from right to left. Stability is what makes counting sort usable inside radix sort.

```python title="Stable counting sort"
def counting_sort(a, k):
    count = [0] * (k + 1)
    for x in a:
        count[x] += 1
    for v in range(1, k + 1):           # prefix sums: end position of each value
        count[v] += count[v - 1]
    out = [0] * len(a)
    for x in reversed(a):               # right to left keeps equal keys in order
        count[x] -= 1
        out[count[x]] = x
    return out

print(counting_sort([4, 2, 2, 8, 3, 3, 1], 8))
```
```java
import java.util.Arrays;

public class Main {
    static int[] countingSort(int[] a, int k) {
        int[] count = new int[k + 1];
        for (int x : a) count[x]++;
        for (int v = 1; v <= k; v++) count[v] += count[v - 1];   // end position of each value
        int[] out = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) out[--count[a[i]]] = a[i];   // right to left keeps order
        return out;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(countingSort(new int[]{4, 2, 2, 8, 3, 3, 1}, 8)));
    }
}
```
```output
[1, 2, 2, 3, 3, 4, 8]
```

## Radix sort (LSD)

For large integers, sort by **one digit at a time**, from least significant to most, with a stable counting sort on each digit. Because each pass is stable, ties on the current digit keep the order produced by earlier digits.

```python title="LSD radix sort, base 10"
def radix_sort(a):
    exp = 1
    while max(a) // exp > 0:
        buckets = [[] for _ in range(10)]
        for x in a:                          # stable: append in current order
            buckets[(x // exp) % 10].append(x)
        a = [x for b in buckets for x in b]
        exp *= 10
    return a

print(radix_sort([170, 45, 75, 90, 802, 24, 2, 66]))
```
```java
import java.util.*;

public class Main {
    static int[] radixSort(int[] a) {
        int max = Arrays.stream(a).max().getAsInt();
        for (int exp = 1; max / exp > 0; exp *= 10) {
            int[] count = new int[10];
            for (int x : a) count[(x / exp) % 10]++;
            for (int d = 1; d < 10; d++) count[d] += count[d - 1];
            int[] out = new int[a.length];
            for (int i = a.length - 1; i >= 0; i--) out[--count[(a[i] / exp) % 10]] = a[i];   // stable pass
            a = out;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(radixSort(new int[]{170, 45, 75, 90, 802, 24, 2, 66})));
    }
}
```
```output
[2, 24, 45, 66, 75, 90, 170, 802]
```

## Dry run of radix sort

| Pass | Sorted by | Result |
|---|---|---|
| 1 | ones digit | 170 90 802 2 24 45 75 66 |
| 2 | tens digit | 802 2 24 45 66 170 75 90 |
| 3 | hundreds digit | 2 24 45 66 75 90 170 802 |

:::complexity
Counting sort: O(n + k) time, O(n + k) space
Radix sort: O(d · (n + b)) for d digits in base b
Both are stable
:::

:::warning
- Counting sort is only practical when the range `k` is small compared with `n`; sorting values up to 10⁹ this way needs a 10⁹-element array.
- Negative numbers need an offset (subtract the minimum first) or separate handling.
- **Bucket sort** is the cousin for real numbers spread evenly in a range: scatter into buckets, sort each, and concatenate.
:::

=== doubly-circular-lists | Doubly & Circular Linked Lists
summary: Nodes with prev and next pointers for O(1) deletion anywhere, and lists whose tail wraps to the head.
practice: lru-cache, design-browser-history
---
A singly linked list can only move forward, and deleting a node requires its predecessor. Two variations fix specific weaknesses.

## Doubly linked lists

Each node stores both `prev` and `next`. Given a reference to any node, you can remove it in O(1), and you can traverse in both directions. **Sentinel** (dummy) head and tail nodes remove every edge case: the list is never truly empty, so insertion and deletion never need `if` checks.

:::viz list 0,1,3 | caption=Doubly linked: each node also points back to its predecessor
:::

```python title="Doubly linked list with sentinels"
class Node:
    def __init__(self, val=None):
        self.val, self.prev, self.next = val, None, None

class DoublyLinkedList:
    def __init__(self):
        self.head, self.tail = Node(), Node()      # sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _insert_between(self, node, a, b):
        node.prev, node.next = a, b
        a.next = b.prev = node
        return node

    def push_front(self, val):
        return self._insert_between(Node(val), self.head, self.head.next)

    def push_back(self, val):
        return self._insert_between(Node(val), self.tail.prev, self.tail)

    def remove(self, node):                        # O(1): no search needed
        node.prev.next, node.next.prev = node.next, node.prev

    def forward(self):
        out, cur = [], self.head.next
        while cur is not self.tail:
            out.append(cur.val)
            cur = cur.next
        return out

    def backward(self):
        out, cur = [], self.tail.prev
        while cur is not self.head:
            out.append(cur.val)
            cur = cur.prev
        return out

dll = DoublyLinkedList()
dll.push_back(1)
two = dll.push_back(2)
dll.push_back(3)
dll.push_front(0)
dll.remove(two)
print(dll.forward(), dll.backward())
```
```java
import java.util.*;

public class Main {
    static class Node {
        int val; Node prev, next;
        Node(int val) { this.val = val; }
    }

    static class DoublyLinkedList {
        Node head = new Node(0), tail = new Node(0);       // sentinels
        DoublyLinkedList() { head.next = tail; tail.prev = head; }

        Node insertBetween(Node node, Node a, Node b) {
            node.prev = a; node.next = b;
            a.next = node; b.prev = node;
            return node;
        }

        Node pushFront(int val) { return insertBetween(new Node(val), head, head.next); }
        Node pushBack(int val) { return insertBetween(new Node(val), tail.prev, tail); }

        void remove(Node node) {                            // O(1): no search needed
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        List<Integer> forward() {
            List<Integer> out = new ArrayList<>();
            for (Node c = head.next; c != tail; c = c.next) out.add(c.val);
            return out;
        }

        List<Integer> backward() {
            List<Integer> out = new ArrayList<>();
            for (Node c = tail.prev; c != head; c = c.prev) out.add(c.val);
            return out;
        }
    }

    public static void main(String[] args) {
        DoublyLinkedList dll = new DoublyLinkedList();
        dll.pushBack(1);
        Node two = dll.pushBack(2);
        dll.pushBack(3);
        dll.pushFront(0);
        dll.remove(two);
        System.out.println(dll.forward() + " " + dll.backward());
    }
}
```
```output
[0, 1, 3] [3, 1, 0]
```

:::tip
A hash map from key to doubly-linked node is exactly how an **LRU cache** gets O(1) `get` and `put`: the map finds the node, and the list moves it to the front or evicts from the back in O(1). Python's `OrderedDict` and Java's `LinkedHashMap` are built this way.
:::

## Circular linked lists

In a circular list the tail points back to the head, so there is no `null` at the end. That suits round-robin scheduling, playlists on repeat and turn-based games. Traversal must stop when you return to the start, not when you reach `null`.

**The Josephus problem:** `n` people stand in a circle; counting from person 1, every `k`-th person is removed. Who survives?

```python title="Josephus with a circular list"
class Node:
    def __init__(self, val):
        self.val, self.next = val, None

def josephus(n, k):
    head = Node(1)
    tail = head
    for v in range(2, n + 1):
        tail.next = Node(v)
        tail = tail.next
    tail.next = head                  # close the circle
    prev = tail
    while prev.next is not prev:      # more than one person left
        for _ in range(k - 1):
            prev = prev.next
        prev.next = prev.next.next    # remove the k-th person
    return prev.val

print(josephus(5, 2), josephus(7, 3))
```
```java
public class Main {
    static class Node {
        int val; Node next;
        Node(int val) { this.val = val; }
    }

    static int josephus(int n, int k) {
        Node head = new Node(1), tail = head;
        for (int v = 2; v <= n; v++) { tail.next = new Node(v); tail = tail.next; }
        tail.next = head;                       // close the circle
        Node prev = tail;
        while (prev.next != prev) {             // more than one person left
            for (int i = 0; i < k - 1; i++) prev = prev.next;
            prev.next = prev.next.next;         // remove the k-th person
        }
        return prev.val;
    }

    public static void main(String[] args) {
        System.out.println(josephus(5, 2) + " " + josephus(7, 3));
    }
}
```
```output
3 4
```

With 5 people and k = 2, people leave in the order 2, 4, 1, 5, and person 3 survives.

| Operation | Singly | Doubly |
|---|---|---|
| Delete a node you hold a reference to | O(n) (need the predecessor) | O(1) |
| Traverse backwards | not possible | O(n) |
| Memory per node | 1 pointer | 2 pointers |

:::complexity
Doubly linked list: O(1) insert or delete at a known node, O(n) search
Josephus simulation: O(n · k)
:::

:::warning
- In a doubly linked list, every insertion and deletion updates **four** pointers. Forgetting one breaks backward traversal while forward traversal still looks fine.
- In a circular list, a `while cur:` loop never ends. Stop when you are back at the starting node.
:::

=== balanced-bst | Balanced BSTs: AVL Trees
summary: Keep a BST's height O(log n) with rotations — AVL insertion step by step, and how red–black trees compare.
practice: balanced-binary-tree, convert-sorted-array-to-bst
---
A plain BST degrades to a linked list when keys arrive in sorted order, making every operation O(n). **Self-balancing** BSTs restore balance after each change so the height stays O(log n).

An **AVL tree** keeps, for every node, the **balance factor** `height(left) − height(right)` in `{−1, 0, 1}`. After an insertion, walk back up; at the first node whose balance becomes ±2, one or two **rotations** fix it.

## Rotations

A rotation re-hangs three nodes while preserving the BST order. A **right rotation** at `y` lifts its left child `x`: `x` becomes the subtree root, `y` becomes `x`'s right child, and `x`'s old right subtree moves to `y`'s left.

| Imbalance at node z | Shape | Fix |
|---|---|---|
| Left-Left | inserted into left child's left subtree | rotate right at z |
| Right-Right | inserted into right child's right subtree | rotate left at z |
| Left-Right | inserted into left child's right subtree | rotate left at z.left, then right at z |
| Right-Left | inserted into right child's left subtree | rotate right at z.right, then left at z |

```python title="AVL insertion"
class Node:
    def __init__(self, key):
        self.key, self.left, self.right, self.height = key, None, None, 1

def h(n):
    return n.height if n else 0

def update(n):
    n.height = 1 + max(h(n.left), h(n.right))

def rotate_right(y):
    x = y.left
    y.left, x.right = x.right, y
    update(y)
    update(x)
    return x

def rotate_left(x):
    y = x.right
    x.right, y.left = y.left, x
    update(x)
    update(y)
    return y

def insert(node, key):
    if not node:
        return Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)
    update(node)
    balance = h(node.left) - h(node.right)
    if balance > 1 and key < node.left.key:        # Left-Left
        return rotate_right(node)
    if balance < -1 and key >= node.right.key:     # Right-Right
        return rotate_left(node)
    if balance > 1:                                # Left-Right
        node.left = rotate_left(node.left)
        return rotate_right(node)
    if balance < -1:                               # Right-Left
        node.right = rotate_right(node.right)
        return rotate_left(node)
    return node

def preorder(n):
    return [n.key] + preorder(n.left) + preorder(n.right) if n else []

root = None
for k in [10, 20, 30, 40, 50, 25]:
    root = insert(root, k)
print(preorder(root), root.height)
```
```java
import java.util.*;

public class Main {
    static class Node {
        int key, height = 1;
        Node left, right;
        Node(int key) { this.key = key; }
    }

    static int h(Node n) { return n == null ? 0 : n.height; }
    static void update(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }

    static Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        update(y);
        update(x);
        return x;
    }

    static Node rotateLeft(Node x) {
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        update(x);
        update(y);
        return y;
    }

    static Node insert(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key) node.left = insert(node.left, key);
        else node.right = insert(node.right, key);
        update(node);
        int balance = h(node.left) - h(node.right);
        if (balance > 1 && key < node.left.key) return rotateRight(node);      // Left-Left
        if (balance < -1 && key >= node.right.key) return rotateLeft(node);    // Right-Right
        if (balance > 1) { node.left = rotateLeft(node.left); return rotateRight(node); }      // Left-Right
        if (balance < -1) { node.right = rotateRight(node.right); return rotateLeft(node); }   // Right-Left
        return node;
    }

    static void preorder(Node n, List<Integer> out) {
        if (n == null) return;
        out.add(n.key);
        preorder(n.left, out);
        preorder(n.right, out);
    }

    public static void main(String[] args) {
        Node root = null;
        for (int k : new int[]{10, 20, 30, 40, 50, 25}) root = insert(root, k);
        List<Integer> out = new ArrayList<>();
        preorder(root, out);
        System.out.println(out + " " + root.height);
    }
}
```
```output
[30, 20, 10, 25, 40, 50] 3
```

:::viz tree 30,20,40,10,25,null,50 | caption=After inserting 10, 20, 30, 40, 50, 25: height 3 instead of 6
:::

## Dry run

| Insert | What happens |
|---|---|
| 10, 20, 30 | 10 becomes −2 (Right-Right) → rotate left: root 20 |
| 40 | no imbalance |
| 50 | 30 becomes −2 (Right-Right) → rotate left at 30: 40 has children 30, 50 |
| 25 | root 20 becomes −2, but its right child 40 leans left (Right-Left) → rotate right at 40, then left at 20: root 30 |

:::complexity
Search / insert / delete: O(log n) worst case
Rotation: O(1)
:::

:::compare
**Red–black trees** colour each node red or black and allow a looser balance (the height is at most about 2 log₂ n), so they need fewer rotations on insert and delete. That's why language libraries use them: Java's `TreeMap`/`TreeSet` and C++'s `std::map`/`std::set`. **AVL trees** are more strictly balanced, which makes lookups slightly faster. In interviews you're rarely asked to code either from scratch, but you should explain rotations and the guarantee.
:::

=== segment-tree-impl | Segment Tree with Lazy Propagation
summary: Build a segment tree from scratch, then add range updates in O(log n) by postponing work with lazy tags.
practice: range-sum-query-mutable
---
A **segment tree** stores aggregates (sums, minimums, maximums…) of array segments in a binary tree: the root covers the whole array, each node's children cover the two halves of its segment, and the leaves are single elements. Stored in an array of size `4n`, node `i` has children `2i` and `2i + 1`.

:::viz tree [0-4] 15,[0-2] 6,[3-4] 9,[0-1] 3,[2] 3,[3] 4,[4] 5 | caption=Segment tree for [1, 2, 3, 4, 5]: each node stores the sum of its range
:::

- **Query** `[l, r]`: if a node's segment is completely inside `[l, r]`, use its stored value; if it's completely outside, ignore it; otherwise ask both children. At most about 4 nodes per level are visited: O(log n).
- **Point update**: change a leaf and recompute its ancestors: O(log n).

## Range updates need laziness

"Add 10 to every element in `[1, 3]`" would touch O(n) leaves. **Lazy propagation** stops at nodes whose segment lies completely inside the update range: it updates the node's sum immediately (adding `value × length`) and records a **lazy tag** meaning "my children still owe this addition". The tag is **pushed down** only when a later operation needs to look inside that node.

```python title="Range add, range sum"
class SegmentTree:
    def __init__(self, a):
        self.n = len(a)
        self.sum = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(a, 1, 0, self.n - 1)

    def _build(self, a, node, lo, hi):
        if lo == hi:
            self.sum[node] = a[lo]
            return
        mid = (lo + hi) // 2
        self._build(a, 2 * node, lo, mid)
        self._build(a, 2 * node + 1, mid + 1, hi)
        self.sum[node] = self.sum[2 * node] + self.sum[2 * node + 1]

    def _apply(self, node, lo, hi, val):
        self.sum[node] += val * (hi - lo + 1)
        self.lazy[node] += val

    def _push(self, node, lo, hi):            # hand the pending addition to the children
        if self.lazy[node]:
            mid = (lo + hi) // 2
            self._apply(2 * node, lo, mid, self.lazy[node])
            self._apply(2 * node + 1, mid + 1, hi, self.lazy[node])
            self.lazy[node] = 0

    def add(self, l, r, val, node=1, lo=0, hi=None):
        if hi is None:
            hi = self.n - 1
        if r < lo or hi < l:
            return                            # no overlap
        if l <= lo and hi <= r:
            self._apply(node, lo, hi, val)    # full overlap: stop and tag
            return
        self._push(node, lo, hi)
        mid = (lo + hi) // 2
        self.add(l, r, val, 2 * node, lo, mid)
        self.add(l, r, val, 2 * node + 1, mid + 1, hi)
        self.sum[node] = self.sum[2 * node] + self.sum[2 * node + 1]

    def query(self, l, r, node=1, lo=0, hi=None):
        if hi is None:
            hi = self.n - 1
        if r < lo or hi < l:
            return 0
        if l <= lo and hi <= r:
            return self.sum[node]
        self._push(node, lo, hi)
        mid = (lo + hi) // 2
        return self.query(l, r, 2 * node, lo, mid) + self.query(l, r, 2 * node + 1, mid + 1, hi)

st = SegmentTree([1, 2, 3, 4, 5])
print(st.query(0, 4))
st.add(1, 3, 10)                     # [1, 12, 13, 14, 5]
print(st.query(0, 4), st.query(1, 2), st.query(3, 4))
```
```java
public class Main {
    static long[] sum, lazy;
    static int n;

    static void build(int[] a, int node, int lo, int hi) {
        if (lo == hi) { sum[node] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(a, 2 * node, lo, mid);
        build(a, 2 * node + 1, mid + 1, hi);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    static void apply(int node, int lo, int hi, long val) {
        sum[node] += val * (hi - lo + 1);
        lazy[node] += val;
    }

    static void push(int node, int lo, int hi) {        // hand the pending addition to the children
        if (lazy[node] != 0) {
            int mid = (lo + hi) / 2;
            apply(2 * node, lo, mid, lazy[node]);
            apply(2 * node + 1, mid + 1, hi, lazy[node]);
            lazy[node] = 0;
        }
    }

    static void add(int l, int r, long val, int node, int lo, int hi) {
        if (r < lo || hi < l) return;                            // no overlap
        if (l <= lo && hi <= r) { apply(node, lo, hi, val); return; }   // full overlap: stop and tag
        push(node, lo, hi);
        int mid = (lo + hi) / 2;
        add(l, r, val, 2 * node, lo, mid);
        add(l, r, val, 2 * node + 1, mid + 1, hi);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }

    static long query(int l, int r, int node, int lo, int hi) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return sum[node];
        push(node, lo, hi);
        int mid = (lo + hi) / 2;
        return query(l, r, 2 * node, lo, mid) + query(l, r, 2 * node + 1, mid + 1, hi);
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        n = a.length;
        sum = new long[4 * n];
        lazy = new long[4 * n];
        build(a, 1, 0, n - 1);
        System.out.println(query(0, 4, 1, 0, n - 1));
        add(1, 3, 10, 1, 0, n - 1);                              // [1, 12, 13, 14, 5]
        System.out.println(query(0, 4, 1, 0, n - 1) + " " + query(1, 2, 1, 0, n - 1) + " " + query(3, 4, 1, 0, n - 1));
    }
}
```
```output
15
45 25 19
```

:::complexity
Build: O(n)
Point or range update: O(log n)
Range query: O(log n)
Space: O(4n)
:::

:::tip
Change `sum` to `min` or `max` (and the identity 0 to ±∞) for range-minimum or range-maximum queries. For **range assignment** ("set [l, r] to x"), the lazy tag stores the assigned value plus a flag, and assigning overrides any pending addition.
:::

:::warning
- Always `push` before recursing into children, in both updates and queries; otherwise children return stale sums.
- Allocate `4n` nodes, not `2n`: the recursive layout can index past `2n` when `n` isn't a power of two.
:::
