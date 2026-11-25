import type { Problem } from '../../lib/harness';

const problems: Problem[] = [
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given `head`, the head of a linked list, return `true` if the list contains a cycle — some node can be reached again by continuously following `next`.\n\nIn the tests, `pos` is the index of the node that the tail connects to (`-1` means no cycle). `pos` is **not** passed to your function.',
    constraints: ['`0 <= number of nodes <= 10^4`'],
    sig: { name: 'hasCycle', params: [{ name: 'head', type: 'ListNode' }, { name: 'pos', type: 'int', hidden: true }], returns: 'bool', cycle: { list: 0, pos: 1 } },
    tests: [
      { args: [[3, 2, 0, -4], 1], expected: true },
      { args: [[1, 2], 0], expected: true },
      { args: [[1], -1], expected: false },
      { args: [[], -1], expected: false },
      { args: [[1, 2, 3, 4, 5], -1], expected: false },
    ],
    hints: ['A visited set works, but needs O(n) memory.', 'Floyd\'s algorithm: a fast pointer (2 steps) will meet a slow pointer (1 step) if and only if there is a cycle.'],
    approaches: [
      { name: 'Visited set', idea: 'Store nodes as you go; seeing one again means a cycle.', time: 'O(n)', space: 'O(n)' },
      { name: 'Fast and slow pointers', idea: 'Inside a cycle, the gap between the pointers shrinks by one each step until they meet.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
`,
      java: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
`,
    },
  },
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Two non-negative integers are stored as linked lists in **reverse** digit order (the head is the ones digit). Add them and return the sum as a linked list in the same format.',
    constraints: ['Each list has 1–100 nodes', 'No leading zeros except the number 0 itself'],
    sig: { name: 'addTwoNumbers', params: [{ name: 'l1', type: 'ListNode' }, { name: 'l2', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
      { args: [[0], [0]], expected: [0] },
      { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
      { args: [[5], [5]], expected: [0, 1] },
    ],
    notes: ['342 + 465 = 807.'],
    hints: ['Add digit by digit like on paper, carrying into the next position.', 'Use a dummy head; continue while either list or a carry remains.'],
    approaches: [{ name: 'Elementary addition', idea: 'Walk both lists together, summing digits plus carry, appending `sum % 10` and carrying `sum // 10`.', time: 'O(max(m, n))', space: 'O(max(m, n))' }],
    solution: {
      python: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            s = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)
            carry, digit = divmod(s, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next
`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(), tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int s = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0);
            carry = s / 10;
            tail.next = new ListNode(s % 10);
            tail = tail.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'linked-list',
    lc150: true,
    statement: 'Merge two sorted linked lists `list1` and `list2` into one sorted list by splicing together their nodes. Return the head of the merged list.',
    constraints: ['`0 <= number of nodes in each list <= 50`'],
    sig: { name: 'mergeTwoLists', params: [{ name: 'list1', type: 'ListNode' }, { name: 'list2', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { args: [[], []], expected: [] },
      { args: [[], [0]], expected: [0] },
      { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
    ],
    hints: ['Use a dummy node and a tail pointer.', 'Attach the smaller head each time, then append whatever remains.'],
    approaches: [{ name: 'Iterative merge', idea: 'Compare heads, attach the smaller to the tail, advance. Finally attach the non-empty remainder.', time: 'O(m + n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next
`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(), tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'copy-list-random-pointer',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement:
      'Each node of a linked list has a `next` pointer and an extra `random` pointer, which can point to any node in the list or be null. Construct a **deep copy** of the list: brand-new nodes whose `next` and `random` pointers reproduce the same structure. No pointer in the copy may point to a node of the original list.\n\nLists are written as `[[val, randomIndex], ...]`, where `randomIndex` is the index of the node `random` points to, or `null`.',
    constraints: ['`0 <= n <= 1000`', '`-10^4 <= Node.val <= 10^4`'],
    sig: { name: 'copyRandomList', params: [{ name: 'head', type: 'RandomListNode' }], returns: 'RandomListNode' },
    tests: [
      { args: [[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]], expected: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] },
      { args: [[[1, 1], [2, 1]]], expected: [[1, 1], [2, 1]] },
      { args: [[[3, null], [3, 0], [3, null]]], expected: [[3, null], [3, 0], [3, null]] },
      { args: [[]], expected: [] },
      { args: [[[5, 0]]], expected: [[5, 0]] },
    ],
    notes: ['The copy has the same shape; the judge also checks that none of its nodes belong to the original list.'],
    hints: ['First create a copy of every node and remember which copy belongs to which original (a hash map).', 'In a second pass, set each copy\'s `next` and `random` by looking up the copies of the original\'s `next` and `random`.'],
    approaches: [
      { name: 'Hash map from original to copy', idea: 'Pass 1 creates the copies; pass 2 wires `next` and `random` through the map. A missing pointer maps to null.', time: 'O(n)', space: 'O(n)' },
      { name: 'Interleaving', idea: 'Insert each copy right after its original (A → A\' → B → B\'), set `copy.random = original.random.next`, then unweave the two lists.', time: 'O(n)', space: 'O(1) extra' },
    ],
    solution: {
      python: `class Solution:
    def copyRandomList(self, head: Optional[Node]) -> Optional[Node]:
        copy = {None: None}
        cur = head
        while cur:
            copy[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            copy[cur].next = copy[cur.next]
            copy[cur].random = copy[cur.random]
            cur = cur.next
        return copy[head]
`,
      java: `class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> copy = new HashMap<>();
        for (Node c = head; c != null; c = c.next) copy.put(c, new Node(c.val));
        for (Node c = head; c != null; c = c.next) {
            copy.get(c).next = copy.get(c.next);
            copy.get(c).random = copy.get(c.random);
        }
        return copy.get(head);
    }
}
`,
    },
  },
  {
    id: 'swap-nodes-in-pairs',
    title: 'Swap Nodes in Pairs',
    difficulty: 'Medium',
    topic: 'linked-list',
    statement: 'Swap every two adjacent nodes of a linked list and return its head. Change the links, not the values.',
    constraints: ['`0 <= number of nodes <= 100`'],
    sig: { name: 'swapPairs', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4]], expected: [2, 1, 4, 3] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[1, 2, 3]], expected: [2, 1, 3] },
    ],
    hints: ['A dummy node before the head simplifies swapping the first pair.', 'For each pair (a, b): `prev.next = b`, `a.next = b.next`, `b.next = a`, then `prev = a`.'],
    approaches: [{ name: 'Iterative rewiring', idea: 'Process pairs left to right with a `prev` pointer, rewiring three links per pair.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next, a.next, b.next = b, b.next, a
            prev = a
        return dummy.next
`,
      java: `class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next, b = a.next;
            a.next = b.next;
            b.next = a;
            prev.next = b;
            prev = a;
        }
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'reverse-linked-list-ii',
    title: 'Reverse Linked List II',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given the head of a linked list and two integers `left <= right` (1-indexed positions), reverse the nodes from position `left` to `right` and return the list.',
    constraints: ['`1 <= n <= 500`', '`1 <= left <= right <= n`'],
    sig: { name: 'reverseBetween', params: [{ name: 'head', type: 'ListNode' }, { name: 'left', type: 'int' }, { name: 'right', type: 'int' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5], 2, 4], expected: [1, 4, 3, 2, 5] },
      { args: [[5], 1, 1], expected: [5] },
      { args: [[3, 5], 1, 2], expected: [5, 3] },
      { args: [[1, 2, 3], 1, 3], expected: [3, 2, 1] },
    ],
    hints: ['Walk to the node just before position `left`.', 'Repeatedly move the node after the sublist\'s current first node to the front of the sublist (head insertion).'],
    approaches: [{ name: 'One-pass head insertion', idea: 'Keep `prev` before the range and `cur` as the original first node; move `cur.next` to just after `prev`, `right - left` times.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next
        cur = prev.next
        for _ in range(right - left):
            nxt = cur.next
            cur.next = nxt.next
            nxt.next = prev.next
            prev.next = nxt
        return dummy.next
`,
      java: `class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        for (int i = 1; i < left; i++) prev = prev.next;
        ListNode cur = prev.next;
        for (int i = 0; i < right - left; i++) {
            ListNode nxt = cur.next;
            cur.next = nxt.next;
            nxt.next = prev.next;
            prev.next = nxt;
        }
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'reverse-nodes-k-group',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    topic: 'linked-list',
    lc150: true,
    statement: 'Reverse the nodes of a linked list `k` at a time and return the modified list. If the number of remaining nodes is less than `k`, leave them as is. Change links, not values.',
    constraints: ['`1 <= k <= n <= 5000`'],
    sig: { name: 'reverseKGroup', params: [{ name: 'head', type: 'ListNode' }, { name: 'k', type: 'int' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
      { args: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
      { args: [[1, 2], 1], expected: [1, 2] },
      { args: [[1, 2, 3, 4], 4], expected: [4, 3, 2, 1] },
    ],
    hints: ['First check that `k` nodes remain; if not, stop.', 'Reverse exactly `k` nodes, connect the previous group\'s tail to the new group head, and continue.'],
    approaches: [{ name: 'Iterative group reversal', idea: 'Use a dummy head and a `groupPrev` pointer. For each full group, reverse it in place and reconnect both ends.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            prev, cur = group_next, group_prev.next
            while cur is not group_next:
                cur.next, prev, cur = prev, cur, cur.next
            first = group_prev.next
            group_prev.next = kth
            group_prev = first
`,
      java: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k; i++) {
                kth = kth.next;
                if (kth == null) return dummy.next;
            }
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) {
                ListNode nxt = cur.next;
                cur.next = prev;
                prev = cur;
                cur = nxt;
            }
            ListNode first = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = first;
        }
    }
}
`,
    },
  },
  {
    id: 'remove-nth-from-end',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given the head of a linked list, remove the `n`-th node from the end and return the head.',
    constraints: ['`1 <= sz <= 30`', '`1 <= n <= sz`'],
    sig: { name: 'removeNthFromEnd', params: [{ name: 'head', type: 'ListNode' }, { name: 'n', type: 'int' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { args: [[1], 1], expected: [] },
      { args: [[1, 2], 1], expected: [1] },
      { args: [[1, 2], 2], expected: [2] },
    ],
    hints: ['Move a `fast` pointer `n` steps ahead first.', 'Then move `fast` and `slow` together; when `fast` reaches the last node, `slow.next` is the node to delete. Start from a dummy node.'],
    approaches: [{ name: 'One pass with a gap', idea: 'Two pointers separated by `n` nodes; a dummy head handles deleting the first node.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n):
            fast = fast.next
        while fast.next:
            fast, slow = fast.next, slow.next
        slow.next = slow.next.next
        return dummy.next
`,
      java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), fast = dummy, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'remove-duplicates-sorted-list-ii',
    title: 'Remove Duplicates from Sorted List II',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given the head of a sorted linked list, delete **all** nodes that have duplicate numbers, leaving only distinct numbers. Return the sorted result.',
    constraints: ['`0 <= number of nodes <= 300`'],
    sig: { name: 'deleteDuplicates', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 3, 4, 4, 5]], expected: [1, 2, 5] },
      { args: [[1, 1, 1, 2, 3]], expected: [2, 3] },
      { args: [[]], expected: [] },
      { args: [[1, 1]], expected: [] },
      { args: [[1, 2, 2]], expected: [1] },
    ],
    hints: ['Duplicates are adjacent in a sorted list.', 'With a dummy and a `prev` pointer, skip an entire run of equal values when the run length is more than one.'],
    approaches: [{ name: 'Dummy + run skipping', idea: '`prev` always points to the last node known to be distinct; when a run of duplicates starts after it, unlink the whole run.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next:
            cur = prev.next
            if cur.next and cur.next.val == cur.val:
                v = cur.val
                while cur and cur.val == v:
                    cur = cur.next
                prev.next = cur
            else:
                prev = cur
        return dummy.next
`,
      java: `class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null) {
            ListNode cur = prev.next;
            if (cur.next != null && cur.next.val == cur.val) {
                int v = cur.val;
                while (cur != null && cur.val == v) cur = cur.next;
                prev.next = cur;
            } else prev = cur;
        }
        return dummy.next;
    }
}
`,
    },
  },
  {
    id: 'rotate-list',
    title: 'Rotate List',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given the head of a linked list, rotate the list to the right by `k` places.',
    constraints: ['`0 <= number of nodes <= 500`', '`0 <= k <= 2 * 10^9`'],
    sig: { name: 'rotateRight', params: [{ name: 'head', type: 'ListNode' }, { name: 'k', type: 'int' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] },
      { args: [[0, 1, 2], 4], expected: [2, 0, 1] },
      { args: [[], 3], expected: [] },
      { args: [[1], 99], expected: [1] },
    ],
    hints: ['Compute the length and connect the tail to the head to form a ring.', 'Break the ring after `n - k % n` nodes.'],
    approaches: [{ name: 'Ring and cut', idea: 'Make the list circular, walk to the new tail at index `n - k%n - 1`, and cut.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head:
            return None
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        tail.next = head
        new_tail = head
        for _ in range(n - k % n - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
`,
      java: `class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null) return null;
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) { tail = tail.next; n++; }
        tail.next = head;
        ListNode newTail = head;
        for (int i = 0; i < n - k % n - 1; i++) newTail = newTail.next;
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}
`,
    },
  },
  {
    id: 'partition-list',
    title: 'Partition List',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement: 'Given the head of a linked list and a value `x`, reorder it so all nodes with values less than `x` come before nodes with values greater than or equal to `x`, preserving the original relative order within each part.',
    constraints: ['`0 <= number of nodes <= 200`'],
    sig: { name: 'partition', params: [{ name: 'head', type: 'ListNode' }, { name: 'x', type: 'int' }], returns: 'ListNode' },
    tests: [
      { args: [[1, 4, 3, 2, 5, 2], 3], expected: [1, 2, 2, 4, 3, 5] },
      { args: [[2, 1], 2], expected: [1, 2] },
      { args: [[], 0], expected: [] },
      { args: [[3, 1, 2], 4], expected: [3, 1, 2] },
    ],
    hints: ['Build two separate lists: "less" and "greater or equal".', 'Use two dummy heads, then join them; remember to terminate the second list.'],
    approaches: [{ name: 'Two dummy lists', idea: 'Append each node to the appropriate list in order, then link the end of "less" to the start of "greater".', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        less = lt = ListNode()
        more = gt = ListNode()
        while head:
            if head.val < x:
                lt.next = head
                lt = lt.next
            else:
                gt.next = head
                gt = gt.next
            head = head.next
        gt.next = None
        lt.next = more.next
        return less.next
`,
      java: `class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode less = new ListNode(), more = new ListNode(), lt = less, gt = more;
        for (; head != null; head = head.next) {
            if (head.val < x) { lt.next = head; lt = head; }
            else { gt.next = head; gt = head; }
        }
        gt.next = null;
        lt.next = more.next;
        return less.next;
    }
}
`,
    },
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    topic: 'linked-list',
    lc150: true,
    statement:
      'Design a Least Recently Used cache with a fixed `capacity`:\n\n- `get(key)` returns the value if present, else `-1`.\n- `put(key, value)` inserts or updates the key. If the cache exceeds capacity, evict the **least recently used** key.\n\nBoth operations must run in **O(1)** average time. Both `get` and `put` count as a use.',
    constraints: ['`1 <= capacity <= 3000`', 'At most `2 * 10^5` calls'],
    sig: {
      kind: 'design',
      className: 'LRUCache',
      ctor: [{ name: 'capacity', type: 'int' }],
      methods: [
        { name: 'get', params: [{ name: 'key', type: 'int' }], returns: 'int' },
        { name: 'put', params: [{ name: 'key', type: 'int' }, { name: 'value', type: 'int' }], returns: 'void' },
      ],
    },
    tests: [
      { args: [['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4] },
      { args: [['LRUCache', 'put', 'get', 'put', 'get', 'get'], [[1], [2, 1], [2], [3, 2], [2], [3]]], expected: [null, null, 1, null, -1, 2] },
      { args: [['LRUCache', 'put', 'put', 'put', 'get', 'put', 'get'], [[2], [1, 1], [2, 2], [1, 10], [1], [3, 3], [2]]], expected: [null, null, null, null, 10, null, -1] },
    ],
    hints: ['A hash map gives O(1) lookup; you also need O(1) "move to most recent" and "remove least recent".', 'Combine a hash map with a doubly linked list (or use an ordered map such as `OrderedDict` / `LinkedHashMap`).'],
    approaches: [{ name: 'Hash map + doubly linked list', idea: 'The list orders keys by recency; the map points to list nodes. `get` moves a node to the front; `put` inserts at the front and evicts from the back.', time: 'O(1) per operation', space: 'O(capacity)' }],
    solution: {
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.data:
            return -1
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key: int, value: int) -> None:
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.cap:
            self.data.popitem(last=False)
`,
      java: `class LRUCache {
    private final int cap;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        cap = capacity;
        map = new LinkedHashMap<>(16, 0.75f, true);   // access order
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);
        if (map.size() > cap) map.remove(map.keySet().iterator().next());
    }
}
`,
    },
  },
];

export default problems;
