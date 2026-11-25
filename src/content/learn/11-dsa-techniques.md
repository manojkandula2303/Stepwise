=== two-pointers | Two Pointers
summary: Walk two indices through a sequence to replace nested loops with a single pass.
practice: valid-palindrome, two-sum-ii, container-with-most-water, three-sum
---
The **two-pointer** technique keeps two indices and moves them according to a rule, so each element is visited a bounded number of times — O(n) instead of the O(n²) of checking every pair.

Two common shapes:

- **Opposite ends:** `left` starts at 0, `right` at `n − 1`; they move toward each other. Works on **sorted** arrays and palindromes.
- **Same direction (fast/slow):** a reader and a writer pointer, used for in-place filtering and deduplication.

## Pair sum in a sorted array

```python title="Find two numbers that add up to target"
def pair_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        if s < target:
            left += 1      # need a bigger sum
        else:
            right -= 1     # need a smaller sum
    return []

print(pair_sum([1, 3, 4, 6, 8, 11], 10))
```
```java
import java.util.Arrays;

public class Main {
    static int[] pairSum(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int s = nums[left] + nums[right];
            if (s == target) return new int[]{left, right};
            if (s < target) left++;       // need a bigger sum
            else right--;                 // need a smaller sum
        }
        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(pairSum(new int[]{1, 3, 4, 6, 8, 11}, 10)));
    }
}
```
```output
[2, 3]
```

:::viz array 1,3,4,6,8,11 | ptr=0:left,5:right | caption=1 + 11 = 12 > 10, so move right inward
:::

## Why it's correct

Because the array is sorted, if `nums[left] + nums[right]` is too big, **no** pair using `right` with any index ≥ `left` can work — every other partner is even bigger. So discarding `right` loses nothing. The symmetric argument justifies moving `left`.

## Dry run — target 10

| left | right | sum | action |
|---|---|---|---|
| 0 (1) | 5 (11) | 12 | too big → right−− |
| 0 (1) | 4 (8) | 9 | too small → left++ |
| 1 (3) | 4 (8) | 11 | too big → right−− |
| 1 (3) | 3 (6) | 9 | too small → left++ |
| 2 (4) | 3 (6) | **10** | found |

## Same-direction: remove duplicates in place

```python title="Reader / writer pointers"
def dedupe(nums):
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return nums[:write]

print(dedupe([1, 1, 2, 3, 3, 3, 4]))
```
```java
import java.util.Arrays;

public class Main {
    static int dedupe(int[] nums) {
        int write = 1;
        for (int read = 1; read < nums.length; read++) {
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }
        return write;
    }

    public static void main(String[] args) {
        int[] nums = {1, 1, 2, 3, 3, 3, 4};
        int k = dedupe(nums);
        System.out.println(Arrays.toString(Arrays.copyOf(nums, k)));
    }
}
```
```output
[1, 2, 3, 4]
```

:::complexity
Time: O(n) — each pointer moves at most n times
Space: O(1)
:::

:::warning
- Opposite-end pointers require **sorted** input (or a symmetric property like palindromes). On unsorted data, sort first (O(n log n)) or use a hash map.
- Use `left < right`, not `<=`, when a pair needs two distinct elements.
- For 3Sum and similar, skip duplicate values after moving pointers to avoid duplicate answers.
:::

:::quiz
Q: In the sorted pair-sum, the current sum is smaller than the target. What should you do?
- Move `right` left
- [x] Move `left` right
- Move both pointers
- Restart from the beginning
> Increasing `left` picks a larger number, which is the only way to increase the sum.
:::

=== sliding-window | Sliding Window
summary: Maintain a window over a sequence and update it incrementally instead of recomputing.
practice: minimum-size-subarray-sum, longest-substring-no-repeat, max-sum-subarray-k
---
Many problems ask about **contiguous** subarrays or substrings: the longest, shortest, or best one satisfying some condition. A **sliding window** keeps a range `[left, right]` and updates a running summary as the window moves, avoiding recomputation.

## Fixed-size window

```python title="Maximum sum of any k consecutive elements"
def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right] - nums[right - k]   # add new, drop old
        best = max(best, window)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))
```
```java
public class Main {
    static int maxSumK(int[] nums, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) window += nums[i];
        int best = window;
        for (int right = k; right < nums.length; right++) {
            window += nums[right] - nums[right - k];   // add new, drop old
            best = Math.max(best, window);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxSumK(new int[]{2, 1, 5, 1, 3, 2}, 3));
    }
}
```
```output
9
```

:::viz array 2,1,5,1,3,2 | hl=2,3,4 | caption=Window [5, 1, 3] has the maximum sum 9
:::

## Variable-size window

Expand `right` every step; **shrink** from `left` while the window breaks the rule.

```python title="Longest substring without repeating characters"
def longest_unique(s):
    last = {}          # char -> last index seen
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1        # jump past the duplicate
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"), longest_unique("pwwkew"))
```
```java
import java.util.*;

public class Main {
    static int longestUnique(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            Integer prev = last.get(ch);
            if (prev != null && prev >= left) left = prev + 1;
            last.put(ch, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestUnique("abcabcbb") + " " + longestUnique("pwwkew"));
    }
}
```
```output
3 3
```

## The template

```
left = 0
for right in range(n):
    add s[right] to the window state
    while window is invalid:
        remove s[left] from the window state
        left += 1
    update the answer using the window [left, right]
```

:::complexity
Time: O(n) — each index enters and leaves the window once
Space: O(k) for the window's state (e.g. character counts)
:::

:::warning
- Sliding windows need a **monotonic** condition: making the window bigger can only make it "more invalid" (or less). With negative numbers in sum problems, this often fails — use prefix sums instead.
- Window length is `right - left + 1`.
:::

=== prefix-sum | Prefix Sums
summary: Precompute running totals to answer any range-sum query in O(1).
practice: running-sum-basic, product-except-self, subarray-sum-equals-k
---
A **prefix sum** array stores `prefix[i] = nums[0] + … + nums[i−1]`. Then the sum of any range `nums[l..r]` is a single subtraction: `prefix[r + 1] − prefix[l]`.

:::viz array 0,3,4,8,9,14 | caption=prefix of [3, 1, 4, 1, 5] — sum(nums[1..3]) = prefix[4] − prefix[1] = 9 − 3 = 6
:::

## Range sum queries

```python title="Build once, query many times"
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    return prefix

nums = [3, 1, 4, 1, 5]
prefix = build_prefix(nums)
print(prefix)
print(prefix[4] - prefix[1])       # sum of nums[1..3]
print(prefix[5] - prefix[0])       # whole array
```
```java
import java.util.Arrays;

public class Main {
    static int[] buildPrefix(int[] nums) {
        int[] prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
        return prefix;
    }

    public static void main(String[] args) {
        int[] nums = {3, 1, 4, 1, 5};
        int[] prefix = buildPrefix(nums);
        System.out.println(Arrays.toString(prefix));
        System.out.println(prefix[4] - prefix[1]);
        System.out.println(prefix[5] - prefix[0]);
    }
}
```
```output
[0, 3, 4, 8, 9, 14]
6
14
```

## Prefix sums + hash map: count subarrays summing to k

A subarray `(j, i]` sums to `k` exactly when `prefix[i] − prefix[j] = k`, i.e. `prefix[j] = prefix[i] − k`. Count how often each prefix value has appeared so far.

```python title="Subarray Sum Equals K"
def subarray_sum(nums, k):
    count = 0
    running = 0
    seen = {0: 1}               # empty prefix
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count

print(subarray_sum([1, 1, 1], 2))
print(subarray_sum([1, 2, 3, -3, 3], 3))
```
```java
import java.util.*;

public class Main {
    static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);              // empty prefix
        int count = 0, running = 0;
        for (int x : nums) {
            running += x;
            count += seen.getOrDefault(running - k, 0);
            seen.merge(running, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{1, 1, 1}, 2));
        System.out.println(subarraySum(new int[]{1, 2, 3, -3, 3}, 3));
    }
}
```
```output
2
5
```

This works with negative numbers, where a sliding window fails.

:::complexity
Build: O(n) time, O(n) space
Range query: O(1)
Subarray-sum count: O(n) time, O(n) space
:::

:::tip
The same idea extends to 2D (`prefix[r][c]` = sum of the rectangle from the origin), to prefix XOR, and to prefix products (Product of Array Except Self).
:::

=== linked-list | Linked Lists
summary: Nodes connected by pointers — insertion, deletion and traversal.
practice: reverse-linked-list, merge-two-sorted-lists, middle-of-linked-list
---
A **linked list** is a chain of **nodes**. Each node stores a value and a reference to the next node. The list is accessed through its **head**; the last node points to `null`/`None`.

:::viz list 4,8,15,16 | caption=Each node points to the next; the last points to null
:::

Unlike arrays, nodes are scattered in memory, so there is no O(1) indexing — reaching the k-th node takes k steps. In exchange, inserting or deleting a node you already have a reference to is O(1): just rewire pointers.

## Building and traversing

```python title="A minimal linked list"
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

head = Node(4, Node(8, Node(15)))

def to_list(head):
    out = []
    cur = head
    while cur:
        out.append(cur.val)
        cur = cur.next
    return out

new_head = Node(1, head)          # insert at front: O(1)
head.next = Node(6, head.next)    # insert after 4: O(1)
print(to_list(new_head))
```
```java
import java.util.*;

public class Main {
    static class Node {
        int val;
        Node next;
        Node(int val, Node next) { this.val = val; this.next = next; }
    }

    static List<Integer> toList(Node head) {
        List<Integer> out = new ArrayList<>();
        for (Node cur = head; cur != null; cur = cur.next) out.add(cur.val);
        return out;
    }

    public static void main(String[] args) {
        Node head = new Node(4, new Node(8, new Node(15, null)));
        Node newHead = new Node(1, head);           // insert at front
        head.next = new Node(6, head.next);         // insert after 4
        System.out.println(toList(newHead));
    }
}
```
```output
[1, 4, 6, 8, 15]
```

## Deleting a node

To delete the node after `prev`, skip over it: `prev.next = prev.next.next`. A **dummy head** node avoids special-casing deletion of the real head.

```python title="Remove all nodes with a value"
class Node:
    def __init__(self, val, next=None):
        self.val, self.next = val, next

def remove_all(head, target):
    dummy = Node(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next     # unlink
        else:
            prev = prev.next
    return dummy.next

head = Node(7, Node(1, Node(7, Node(3))))
cur = remove_all(head, 7)
while cur:
    print(cur.val, end=" ")
    cur = cur.next
print()
```
```java
public class Main {
    static class Node {
        int val; Node next;
        Node(int val, Node next) { this.val = val; this.next = next; }
    }

    static Node removeAll(Node head, int target) {
        Node dummy = new Node(0, head);
        Node prev = dummy;
        while (prev.next != null) {
            if (prev.next.val == target) prev.next = prev.next.next;   // unlink
            else prev = prev.next;
        }
        return dummy.next;
    }

    public static void main(String[] args) {
        Node head = new Node(7, new Node(1, new Node(7, new Node(3, null))));
        for (Node cur = removeAll(head, 7); cur != null; cur = cur.next) System.out.print(cur.val + " ");
        System.out.println();
    }
}
```
```output
1 3 
```

| Operation | Array | Linked list |
|---|---|---|
| Access k-th element | O(1) | O(k) |
| Insert/delete at front | O(n) | O(1) |
| Insert/delete after a known node | O(n) | O(1) |
| Memory | compact | extra pointer per node |

:::warning
- Always check `cur is not None` / `cur != null` before reading `cur.next`.
- Save `next` **before** you overwrite a pointer, or you lose the rest of the list.
- Draw the pointers on paper (or use **Visualize**) — most linked-list bugs are pointer-order mistakes.
:::

=== linked-list-techniques | Linked List Techniques
summary: Reversal, fast/slow pointers, cycle detection and merging.
practice: reverse-linked-list, linked-list-cycle, remove-nth-from-end, merge-two-sorted-lists
---
A handful of techniques solve most linked-list interview problems.

## Reverse in place

Walk the list once, turning each `next` pointer around. Three variables: `prev`, `cur`, and a saved `nxt`.

```python title="Iterative reversal"
class Node:
    def __init__(self, val, next=None):
        self.val, self.next = val, next

def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next      # save the rest
        cur.next = prev     # flip the pointer
        prev = cur          # advance prev
        cur = nxt           # advance cur
    return prev

head = reverse(Node(1, Node(2, Node(3))))
while head:
    print(head.val, end=" ")
    head = head.next
print()
```
```java
public class Main {
    static class Node {
        int val; Node next;
        Node(int val, Node next) { this.val = val; this.next = next; }
    }

    static Node reverse(Node head) {
        Node prev = null, cur = head;
        while (cur != null) {
            Node nxt = cur.next;   // save the rest
            cur.next = prev;       // flip the pointer
            prev = cur;
            cur = nxt;
        }
        return prev;
    }

    public static void main(String[] args) {
        for (Node n = reverse(new Node(1, new Node(2, new Node(3, null)))); n != null; n = n.next)
            System.out.print(n.val + " ");
        System.out.println();
    }
}
```
```output
3 2 1 
```

Press **Visualize** to watch the arrows flip one node at a time.

## Fast and slow pointers

`slow` moves one step, `fast` moves two. When `fast` reaches the end, `slow` is at the **middle**. If there is a **cycle**, `fast` eventually laps `slow` and they meet (Floyd's algorithm).

```python title="Middle node and cycle detection"
class Node:
    def __init__(self, val, next=None):
        self.val, self.next = val, next

def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.val

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False

a = Node(1, Node(2, Node(3, Node(4, Node(5)))))
print(middle(a), has_cycle(a))
a.next.next.next.next.next = a.next     # 5 -> 2 creates a cycle
print(has_cycle(a))
```
```java
public class Main {
    static class Node {
        int val; Node next;
        Node(int val, Node next) { this.val = val; this.next = next; }
    }

    static int middle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        return slow.val;
    }

    static boolean hasCycle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        Node a = new Node(1, new Node(2, new Node(3, new Node(4, new Node(5, null)))));
        System.out.println(middle(a) + " " + hasCycle(a));
        a.next.next.next.next.next = a.next;   // 5 -> 2 creates a cycle
        System.out.println(hasCycle(a));
    }
}
```
```output-python
3 False
True
```
```output-java
3 false
true
```

## n-th from the end with a gap

Move `fast` n steps ahead, then move both together; when `fast` hits the end, `slow` is n nodes from the end. Combined with a dummy head, this removes the n-th node from the end in one pass.

## Merging two sorted lists

Use a dummy node and a `tail` pointer; repeatedly attach the smaller head. This is the merge step of merge sort on lists.

:::complexity
Reverse: O(n) time, O(1) space
Middle / cycle detection: O(n) time, O(1) space
Merge two sorted lists: O(n + m) time, O(1) space
:::

:::quiz
Q: In Floyd's cycle detection, why must the loop check `fast and fast.next`?
- To make it faster
- [x] `fast` jumps two nodes, so both must exist to avoid dereferencing null
- To detect the cycle start
- It isn't necessary
> If `fast.next` is null, `fast.next.next` would crash. Checking both guards the two-step jump.
:::
