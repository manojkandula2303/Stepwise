=== binary-search | Binary Search
summary: Halve the search space each step — O(log n) on sorted data and monotonic answers.
practice: search-insert-position, find-first-last-position, search-rotated-sorted-array, sqrt-x
---
**Binary search** finds a target in a **sorted** array by repeatedly comparing it with the middle element and discarding the half that can't contain it. Each step halves the range, so 1,000,000 elements need at most 20 comparisons.

:::viz array 1,3,5,7,9,11,13 | ptr=0:lo,3:mid,6:hi | caption=target 9 > 7, so the answer must be right of mid
:::

## The classic version

```python title="Find a target's index"
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(nums, 9), binary_search(nums, 4))
```
```java
public class Main {
    static int binarySearch(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;      // avoids int overflow
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(binarySearch(nums, 9) + " " + binarySearch(nums, 4));
    }
}
```
```output
4 -1
```

## Dry run — target 9

| lo | hi | mid | nums[mid] | action |
|---|---|---|---|---|
| 0 | 6 | 3 | 7 | 7 < 9 → lo = 4 |
| 4 | 6 | 5 | 11 | 11 > 9 → hi = 4 |
| 4 | 4 | 4 | **9** | found |

## Lower bound: first position ≥ target

Many problems want a *boundary* rather than an exact match: insertion position, first occurrence, first value that satisfies a condition.

```python title="First index with nums[i] >= target"
def lower_bound(nums, target):
    lo, hi = 0, len(nums)          # hi is exclusive
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

nums = [1, 2, 4, 4, 4, 7]
print(lower_bound(nums, 4), lower_bound(nums, 5), lower_bound(nums, 99))
```
```java
public class Main {
    static int lowerBound(int[] nums, int target) {
        int lo = 0, hi = nums.length;      // hi is exclusive
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 4, 4, 4, 7};
        System.out.println(lowerBound(nums, 4) + " " + lowerBound(nums, 5) + " " + lowerBound(nums, 99));
    }
}
```
```output
2 5 6
```

## Binary search on the answer

If you can test "is answer ≥ x feasible?" and feasibility is **monotonic** (once true, always true), binary search over x — even when there's no array. Examples: integer square root, minimum capacity to ship packages, Koko eating bananas.

:::complexity
Time: O(log n)
Space: O(1) iterative
:::

:::compare
Library versions: Python's `bisect.bisect_left(nums, x)` is exactly `lower_bound`; `bisect_right` gives the first index `> x`. Java's `Arrays.binarySearch` returns an index if found, otherwise `-(insertionPoint) - 1`; `Collections.binarySearch` does the same for lists.
:::

:::warning
- `(lo + hi) / 2` can overflow `int` in Java when both are large — use `lo + (hi - lo) / 2`.
- Mixing conventions causes infinite loops. Pick one: inclusive `[lo, hi]` with `while lo <= hi` and `hi = mid - 1`, **or** half-open `[lo, hi)` with `while lo < hi` and `hi = mid`.
- The array must be sorted (or the predicate monotonic).
:::

=== sorting-basic | Elementary Sorting
summary: Bubble, selection and insertion sort — simple O(n²) algorithms and what they teach.
practice: sort-colors, h-index
---
Sorting puts elements in order. You'll nearly always call the built-in sort, but the elementary algorithms teach core ideas: comparisons, swaps, invariants and stability.

## Bubble sort

Repeatedly swap adjacent out-of-order pairs. After pass `i`, the largest `i + 1` elements are in their final place at the end.

```python title="Bubble sort with early exit"
def bubble_sort(a):
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:      # already sorted
            break
    return a

print(bubble_sort([5, 1, 4, 2, 8]))
```
```java
import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 4, 2, 8};
        bubbleSort(a);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[1, 2, 4, 5, 8]
```

## Insertion sort

Grow a sorted prefix; insert each new element into its correct place by shifting larger elements right. Fast on nearly-sorted data and used inside real-world sorts for small ranges.

```python title="Insertion sort"
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]       # shift right
            j -= 1
        a[j + 1] = key
    return a

print(insertion_sort([12, 11, 13, 5, 6]))
```
```java
import java.util.Arrays;

public class Main {
    static void insertionSort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] a = {12, 11, 13, 5, 6};
        insertionSort(a);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[5, 6, 11, 12, 13]
```

## Selection sort

Find the minimum of the unsorted part and swap it to the front. Always O(n²) comparisons but only O(n) swaps.

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | no |

A sort is **stable** if equal elements keep their original relative order — important when sorting records by one field after another.

:::tip
Use **Visualize** on the bubble sort: the array view highlights the cells that change on each swap, and the `i`/`j` pointers move underneath.
:::

=== sorting-advanced | Merge Sort, Quick Sort & Built-ins
summary: Divide-and-conquer sorting in O(n log n), counting sort, and custom comparators.
practice: sort-an-array, merge-intervals, kth-largest-element
---
## Merge sort

Split the array in half, sort each half recursively, then **merge** the two sorted halves. The merge takes O(n) and there are log n levels, so the total is O(n log n) — always.

```python title="Merge sort"
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:          # <= keeps it stable
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
```
```java
import java.util.Arrays;

public class Main {
    static void mergeSort(int[] a, int lo, int hi, int[] tmp) {
        if (hi - lo <= 1) return;
        int mid = (lo + hi) / 2;
        mergeSort(a, lo, mid, tmp);
        mergeSort(a, mid, hi, tmp);
        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        for (k = lo; k < hi; k++) a[k] = tmp[k];
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(a, 0, a.length, new int[a.length]);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[3, 9, 10, 27, 38, 43, 82]
```

:::viz tree [38 27 43 3 9 82 10],[38 27 43],[3 9 82 10],[38],[27 43],[3 9],[82 10] | caption=Split until single elements, then merge back up in sorted order
:::

## Quick sort

Pick a **pivot**, partition the array so smaller elements go left and larger go right, then recurse on each side. Average O(n log n), in place; worst case O(n²) when pivots are consistently bad (randomising the pivot makes this vanishingly unlikely).

```python title="Quick sort (Lomuto partition)"
import random

def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    p = random.randint(lo, hi)
    a[p], a[hi] = a[hi], a[p]          # random pivot to the end
    pivot, store = a[hi], lo
    for i in range(lo, hi):
        if a[i] < pivot:
            a[i], a[store] = a[store], a[i]
            store += 1
    a[store], a[hi] = a[hi], a[store]  # pivot into its final place
    quick_sort(a, lo, store - 1)
    quick_sort(a, store + 1, hi)
    return a

print(quick_sort([10, 7, 8, 9, 1, 5]))
```
```java
import java.util.*;

public class Main {
    static Random rnd = new Random();

    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int p = lo + rnd.nextInt(hi - lo + 1);
        swap(a, p, hi);
        int pivot = a[hi], store = lo;
        for (int i = lo; i < hi; i++) if (a[i] < pivot) swap(a, i, store++);
        swap(a, store, hi);
        quickSort(a, lo, store - 1);
        quickSort(a, store + 1, hi);
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        int[] a = {10, 7, 8, 9, 1, 5};
        quickSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
    }
}
```
```output
[1, 5, 7, 8, 9, 10]
```

## Built-in sorting with custom order

```python title="Sort records by several keys"
people = [("Ada", 36), ("Bob", 25), ("Cy", 36), ("Dee", 25)]
by_age_then_name = sorted(people, key=lambda p: (p[1], p[0]))
by_age_desc = sorted(people, key=lambda p: -p[1])
print(by_age_then_name)
print(by_age_desc)
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[][] people = {{"Ada", "36"}, {"Bob", "25"}, {"Cy", "36"}, {"Dee", "25"}};
        String[][] a = people.clone();
        Arrays.sort(a, Comparator.comparingInt((String[] p) -> Integer.parseInt(p[1])).thenComparing(p -> p[0]));
        System.out.println(Arrays.deepToString(a));
        String[][] b = people.clone();
        Arrays.sort(b, (p, q) -> Integer.compare(Integer.parseInt(q[1]), Integer.parseInt(p[1])));
        System.out.println(Arrays.deepToString(b));
    }
}
```
```output-python
[('Bob', 25), ('Dee', 25), ('Ada', 36), ('Cy', 36)]
[('Ada', 36), ('Cy', 36), ('Bob', 25), ('Dee', 25)]
```
```output-java
[[Bob, 25], [Dee, 25], [Ada, 36], [Cy, 36]]
[[Ada, 36], [Cy, 36], [Bob, 25], [Dee, 25]]
```

| Algorithm | Average | Worst | Space | Stable |
|---|---|---|---|---|
| Merge sort | O(n log n) | O(n log n) | O(n) | yes |
| Quick sort | O(n log n) | O(n²) | O(log n) | no |
| Heap sort | O(n log n) | O(n log n) | O(1) | no |
| Counting sort | O(n + k) | O(n + k) | O(k) | yes |

:::compare
- Python's `sorted()` / `list.sort()` use **Timsort**: stable, O(n log n), and very fast on partially ordered data.
- Java's `Arrays.sort(int[])` uses a dual-pivot **quicksort** for primitives (not stable, but stability doesn't matter for primitives); `Arrays.sort(Object[])` and `Collections.sort` use Timsort (stable).
:::

=== binary-trees | Binary Trees
summary: Hierarchical data — nodes, children, height, and recursive thinking.
practice: maximum-depth-binary-tree, invert-binary-tree, same-tree, symmetric-tree
---
A **binary tree** is made of nodes where each node has at most two children: **left** and **right**. The top node is the **root**; nodes without children are **leaves**.

:::viz tree 3,9,20,null,null,15,7 | caption=Root 3; leaves 9, 15 and 7; height 3
:::

Vocabulary: the **depth** of a node is its distance from the root; the **height** of the tree is the number of nodes on the longest root-to-leaf path. A tree with n nodes has n − 1 edges.

## Defining a tree and computing its height

Almost every tree algorithm is recursive: solve for the left subtree, solve for the right subtree, combine.

```python title="Height (maximum depth) of a tree"
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def max_depth(root):
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(max_depth(root))
```
```java
public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
        TreeNode(int val) { this(val, null, null); }
    }

    static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
        System.out.println(maxDepth(root));
    }
}
```
```output
3
```

**Visualize** this: the objects panel draws the tree, highlighting the node each frame is working on.

## Thinking recursively about trees

Ask: *if I already had the answer for both subtrees, how would I get the answer for the whole tree?*

| Problem | Combine step |
|---|---|
| Count nodes | `1 + count(left) + count(right)` |
| Sum of values | `val + sum(left) + sum(right)` |
| Mirror (invert) | swap children, then invert each |
| Same tree | values equal and both subtrees same |

```python title="Invert a tree"
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def invert(root):
    if root:
        root.left, root.right = invert(root.right), invert(root.left)
    return root

def preorder(root):
    return [] if root is None else [root.val] + preorder(root.left) + preorder(root.right)

root = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7, TreeNode(6), TreeNode(9)))
print(preorder(invert(root)))
```
```java
import java.util.*;

public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
        TreeNode(int val) { this(val, null, null); }
    }

    static TreeNode invert(TreeNode root) {
        if (root == null) return null;
        TreeNode l = invert(root.left);
        root.left = invert(root.right);
        root.right = l;
        return root;
    }

    static void preorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val);
        preorder(n.left, out);
        preorder(n.right, out);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)),
                                        new TreeNode(7, new TreeNode(6), new TreeNode(9)));
        List<Integer> out = new ArrayList<>();
        preorder(invert(root), out);
        System.out.println(out);
    }
}
```
```output
[4, 7, 9, 6, 2, 3, 1]
```

:::complexity
Most tree traversals: O(n) time
Space: O(h) recursion, where h is the height — O(log n) if balanced, O(n) if skewed
:::

:::warning
Always handle the empty tree (`None`/`null`) as the base case. Forgetting it is the most common tree bug.
:::

=== tree-traversals | Tree Traversals
summary: Preorder, inorder, postorder and level-order — recursive and iterative.
practice: binary-tree-level-order, binary-tree-right-side-view, binary-tree-zigzag
---
A **traversal** visits every node once. The order matters:

| Traversal | Order | Typical use |
|---|---|---|
| Preorder | node, left, right | copy/serialise a tree |
| Inorder | left, node, right | BST → sorted order |
| Postorder | left, right, node | delete/evaluate subtrees first |
| Level order | level by level (BFS) | shortest depth, views by level |

:::viz tree 1,2,3,4,5,null,6 | caption=Pre: 1 2 4 5 3 6 · In: 4 2 5 1 3 6 · Post: 4 5 2 6 3 1 · Level: 1 | 2 3 | 4 5 6
:::

## Depth-first traversals

```python title="Three DFS orders"
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def preorder(n):  return [] if not n else [n.val] + preorder(n.left) + preorder(n.right)
def inorder(n):   return [] if not n else inorder(n.left) + [n.val] + inorder(n.right)
def postorder(n): return [] if not n else postorder(n.left) + postorder(n.right) + [n.val]

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, None, TreeNode(6)))
print(preorder(root))
print(inorder(root))
print(postorder(root))
```
```java
import java.util.*;

public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
        TreeNode(int val) { this(val, null, null); }
    }

    static void pre(TreeNode n, List<Integer> o)  { if (n == null) return; o.add(n.val); pre(n.left, o); pre(n.right, o); }
    static void in(TreeNode n, List<Integer> o)   { if (n == null) return; in(n.left, o); o.add(n.val); in(n.right, o); }
    static void post(TreeNode n, List<Integer> o) { if (n == null) return; post(n.left, o); post(n.right, o); o.add(n.val); }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3, null, new TreeNode(6)));
        List<Integer> a = new ArrayList<>(), b = new ArrayList<>(), c = new ArrayList<>();
        pre(root, a); in(root, b); post(root, c);
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}
```
```output
[1, 2, 4, 5, 3, 6]
[4, 2, 5, 1, 3, 6]
[4, 5, 2, 6, 3, 1]
```

## Level-order (BFS) with a queue

Process the queue one **level** at a time by noting how many nodes it holds before you start the level.

```python title="Level order traversal"
from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def level_order(root):
    if not root:
        return []
    levels, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):          # exactly this level's nodes
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        levels.append(level)
    return levels

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, None, TreeNode(6)))
print(level_order(root))
```
```java
import java.util.*;

public class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
        TreeNode(int val) { this(val, null, null); }
    }

    static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        if (root == null) return levels;
        Deque<TreeNode> q = new ArrayDeque<>(List.of(root));
        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int size = q.size(); size > 0; size--) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            levels.add(level);
        }
        return levels;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3, null, new TreeNode(6)));
        System.out.println(levelOrder(root));
    }
}
```
```output
[[1], [2, 3], [4, 5, 6]]
```

:::tip
Iterative DFS uses an explicit **stack** instead of recursion — useful when trees are deep enough to overflow the call stack.
:::

=== bst | Binary Search Trees
summary: Ordered trees with O(log n) search, insert and delete when balanced.
practice: validate-bst, kth-smallest-in-bst, min-abs-diff-bst, convert-sorted-array-to-bst
---
A **binary search tree** (BST) is a binary tree with an ordering rule: for every node, **all** values in its left subtree are smaller, and **all** values in its right subtree are larger. An inorder traversal therefore visits values in sorted order.

:::viz tree 8,3,10,1,6,null,14,null,null,4,7 | hl=0,1,4 | caption=Searching for 6: 8 → go left → 3 → go right → 6
:::

## Search and insert

```python title="BST search and insert"
class Node:
    def __init__(self, val):
        self.val, self.left, self.right = val, None, None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root is not None

def inorder(n):
    return inorder(n.left) + [n.val] + inorder(n.right) if n else []

root = None
for v in [8, 3, 10, 1, 6, 14, 4, 7]:
    root = insert(root, v)
print(inorder(root))
print(search(root, 6), search(root, 5))
```
```java
import java.util.*;

public class Main {
    static class Node {
        int val; Node left, right;
        Node(int val) { this.val = val; }
    }

    static Node insert(Node root, int val) {
        if (root == null) return new Node(val);
        if (val < root.val) root.left = insert(root.left, val);
        else root.right = insert(root.right, val);
        return root;
    }

    static boolean search(Node root, int val) {
        while (root != null && root.val != val) root = val < root.val ? root.left : root.right;
        return root != null;
    }

    static void inorder(Node n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out); out.add(n.val); inorder(n.right, out);
    }

    public static void main(String[] args) {
        Node root = null;
        for (int v : new int[]{8, 3, 10, 1, 6, 14, 4, 7}) root = insert(root, v);
        List<Integer> out = new ArrayList<>();
        inorder(root, out);
        System.out.println(out);
        System.out.println(search(root, 6) + " " + search(root, 5));
    }
}
```
```output-python
[1, 3, 4, 6, 7, 8, 10, 14]
True False
```
```output-java
[1, 3, 4, 6, 7, 8, 10, 14]
true false
```

## Validating a BST

Checking only `left.val < node.val < right.val` is **not enough** — a value deep in the left subtree could still exceed an ancestor. Pass down the allowed range instead.

```python title="Validate with bounds"
class Node:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def is_bst(node, lo=float("-inf"), hi=float("inf")):
    if node is None:
        return True
    if not (lo < node.val < hi):
        return False
    return is_bst(node.left, lo, node.val) and is_bst(node.right, node.val, hi)

good = Node(5, Node(3, Node(2), Node(4)), Node(8))
bad = Node(5, Node(3, None, Node(6)), Node(8))    # 6 is in 5's left subtree
print(is_bst(good), is_bst(bad))
```
```java
public class Main {
    static class Node {
        int val; Node left, right;
        Node(int val, Node left, Node right) { this.val = val; this.left = left; this.right = right; }
        Node(int val) { this(val, null, null); }
    }

    static boolean isBst(Node n, long lo, long hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return isBst(n.left, lo, n.val) && isBst(n.right, n.val, hi);
    }

    public static void main(String[] args) {
        Node good = new Node(5, new Node(3, new Node(2), new Node(4)), new Node(8));
        Node bad = new Node(5, new Node(3, null, new Node(6)), new Node(8));
        System.out.println(isBst(good, Long.MIN_VALUE, Long.MAX_VALUE) + " " + isBst(bad, Long.MIN_VALUE, Long.MAX_VALUE));
    }
}
```
```output-python
True False
```
```output-java
true false
```

:::complexity
Search / insert / delete: O(h) — O(log n) balanced, O(n) skewed
Inorder traversal: O(n)
:::

:::compare
Self-balancing BSTs (red–black trees) keep height O(log n) automatically. Java's `TreeMap` and `TreeSet` are red–black trees with `floor`, `ceiling`, `first`, `last` and range views. Python's standard library has no balanced BST; sorting plus `bisect`, or the third-party `sortedcontainers`, fill the gap.
:::

:::warning
Inserting already-sorted data into a plain BST produces a linked-list-shaped tree with O(n) operations. Build balanced trees from sorted arrays by picking the middle element as the root.
:::

=== heaps | Heaps & Priority Queues
summary: Always get the smallest (or largest) element in O(log n) — top-k, scheduling and merging.
practice: kth-largest-element, last-stone-weight, find-median-data-stream, merge-k-sorted-lists
---
A **heap** is a complete binary tree where every parent is ≤ its children (a **min-heap**). The minimum is always at the root. It's stored compactly in an array: the children of index `i` are `2i + 1` and `2i + 2`.

:::viz tree 1,3,2,7,4,5 | hl=0 | caption=Min-heap: the root is the smallest; stored as [1, 3, 2, 7, 4, 5]
:::

- **push**: append at the end, then *sift up* while smaller than the parent — O(log n).
- **pop**: take the root, move the last element to the root, *sift down* — O(log n).
- **peek**: read the root — O(1).
- **heapify** an array of n items — O(n).

## Using the built-in priority queue

```python title="heapq: a min-heap on a list"
import heapq

h = []
for x in [5, 1, 8, 3, 2]:
    heapq.heappush(h, x)
print(h[0])                      # smallest
print([heapq.heappop(h) for _ in range(3)])

max_heap = []
for x in [5, 1, 8]:
    heapq.heappush(max_heap, -x)  # negate for a max-heap
print(-max_heap[0])

tasks = [(2, "write"), (1, "plan"), (3, "ship")]
heapq.heapify(tasks)             # tuples compare by first element
print(heapq.heappop(tasks))
```
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        for (int x : new int[]{5, 1, 8, 3, 2}) h.offer(x);
        System.out.println(h.peek());
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < 3; i++) out.add(h.poll());
        System.out.println(out);

        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        maxHeap.addAll(List.of(5, 1, 8));
        System.out.println(maxHeap.peek());

        PriorityQueue<Object[]> tasks = new PriorityQueue<>((a, b) -> Integer.compare((int) a[0], (int) b[0]));
        tasks.add(new Object[]{2, "write"});
        tasks.add(new Object[]{1, "plan"});
        tasks.add(new Object[]{3, "ship"});
        Object[] t = tasks.poll();
        System.out.println("(" + t[0] + ", " + t[1] + ")");
    }
}
```
```output-python
1
[1, 2, 3]
8
(1, 'plan')
```
```output-java
1
[1, 2, 3]
8
(1, plan)
```

## Top-k with a heap of size k

To find the k largest elements, keep a **min**-heap of size k: whenever it grows past k, pop the smallest. What remains are the k largest, and the root is the k-th largest. O(n log k).

```python title="k-th largest element"
import heapq

def kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

print(kth_largest([3, 2, 1, 5, 6, 4], 2))
```
```java
import java.util.*;

public class Main {
    static int kthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    public static void main(String[] args) {
        System.out.println(kthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));
    }
}
```
```output
5
```

:::complexity
push / pop: O(log n)
peek: O(1)
heapify: O(n)
Top-k: O(n log k)
:::

:::compare
- Python's `heapq` functions operate on a plain list and only provide a **min**-heap; negate values (or use tuples) for max-heap behaviour.
- Java's `PriorityQueue` is a min-heap by default; pass `Collections.reverseOrder()` or a comparator for other orders.
- Neither supports efficient "decrease key" or arbitrary removal — the usual workaround is to push a new entry and skip stale ones when popped (*lazy deletion*), as in Dijkstra's algorithm.
:::
