import type { Problem } from '../../lib/harness';

const T = (name: string) => ({ name, type: 'TreeNode' as const });

const problems: Problem[] = [
  {
    id: 'maximum-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `root` of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to a leaf.\n\nTrees are given in level order, with `null` for missing children.',
    constraints: ['`0 <= number of nodes <= 10^4`'],
    sig: { name: 'maxDepth', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { args: [[1, null, 2]], expected: 2 },
      { args: [[]], expected: 0 },
      { args: [[1, 2, null, 3, null, 4]], expected: 4 },
    ],
    hints: ['The depth of a tree is 1 + the larger depth of its two subtrees.', 'An empty tree has depth 0.'],
    approaches: [
      { name: 'Recursive DFS', idea: '`depth(node) = 1 + max(depth(left), depth(right))`.', time: 'O(n)', space: 'O(h)' },
      { name: 'BFS by levels', idea: 'Count the number of levels processed.', time: 'O(n)', space: 'O(w)' },
    ],
    solution: {
      python: `class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
`,
    },
  },
  {
    id: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the roots of two binary trees `p` and `q`, return `true` if they are structurally identical and their nodes have the same values.',
    constraints: ['`0 <= number of nodes <= 100`'],
    sig: { name: 'isSameTree', params: [T('p'), T('q')], returns: 'bool' },
    tests: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true },
      { args: [[1, 2], [1, null, 2]], expected: false },
      { args: [[1, 2, 1], [1, 1, 2]], expected: false },
      { args: [[], []], expected: true },
    ],
    hints: ['Two empty trees are the same; one empty and one not are different.', 'Otherwise compare root values and recurse on both pairs of subtrees.'],
    approaches: [{ name: 'Recursion', idea: 'Trees match when roots match and left/right subtrees match pairwise.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p or not q:
            return p is q
        return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
`,
      java: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
`,
    },
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `root` of a binary tree, invert it (mirror it left to right) and return its root.',
    constraints: ['`0 <= number of nodes <= 100`'],
    sig: { name: 'invertTree', params: [T('root')], returns: 'TreeNode' },
    tests: [
      { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
      { args: [[2, 1, 3]], expected: [2, 3, 1] },
      { args: [[]], expected: [] },
      { args: [[1, 2]], expected: [1, null, 2] },
    ],
    hints: ['Swap the children of every node.', 'Recursively invert the subtrees.'],
    approaches: [{ name: 'Recursive swap', idea: 'Swap `left` and `right`, then invert each subtree.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root:
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode l = invertTree(root.left);
        root.left = invertTree(root.right);
        root.right = l;
        return root;
    }
}
`,
    },
  },
  {
    id: 'symmetric-tree',
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `root` of a binary tree, check whether it is a mirror of itself (symmetric around its centre).',
    constraints: ['`1 <= number of nodes <= 1000`'],
    sig: { name: 'isSymmetric', params: [T('root')], returns: 'bool' },
    tests: [
      { args: [[1, 2, 2, 3, 4, 4, 3]], expected: true },
      { args: [[1, 2, 2, null, 3, null, 3]], expected: false },
      { args: [[1]], expected: true },
      { args: [[1, 2, 3]], expected: false },
    ],
    hints: ['A tree is symmetric if its left and right subtrees are mirrors.', 'Two trees are mirrors when roots match, `a.left` mirrors `b.right`, and `a.right` mirrors `b.left`.'],
    approaches: [{ name: 'Mirror recursion', idea: 'Compare outer pairs and inner pairs recursively.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def mirror(a, b):
            if not a or not b:
                return a is b
            return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
        return mirror(root.left, root.right)
`,
      java: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        return mirror(root.left, root.right);
    }

    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
}
`,
    },
  },
  {
    id: 'construct-tree-preorder-inorder',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `preorder` and `inorder` traversals of a binary tree with unique values, construct and return the tree.',
    constraints: ['`1 <= n <= 3000`', 'All values are unique'],
    sig: { name: 'buildTree', params: [{ name: 'preorder', type: 'int[]' }, { name: 'inorder', type: 'int[]' }], returns: 'TreeNode' },
    tests: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
      { args: [[-1], [-1]], expected: [-1] },
      { args: [[1, 2, 3], [3, 2, 1]], expected: [1, 2, null, 3] },
      { args: [[1, 2, 3], [1, 2, 3]], expected: [1, null, 2, null, 3] },
    ],
    hints: ['The first preorder element is the root.', 'Its position in inorder splits the remaining values into left and right subtrees. Use a value → index map for O(1) lookups.'],
    approaches: [{ name: 'Recursion with index map', idea: 'Consume preorder left to right; each value\'s inorder index tells how many nodes belong to the left subtree.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        idx = {v: i for i, v in enumerate(inorder)}
        it = iter(preorder)

        def build(lo, hi):
            if lo > hi:
                return None
            val = next(it)
            node = TreeNode(val)
            node.left = build(lo, idx[val] - 1)
            node.right = build(idx[val] + 1, hi)
            return node

        return build(0, len(inorder) - 1)
`,
      java: `class Solution {
    private int pre = 0;
    private Map<Integer, Integer> idx = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int lo, int hi) {
        if (lo > hi) return null;
        int val = preorder[pre++];
        TreeNode node = new TreeNode(val);
        node.left = build(preorder, lo, idx.get(val) - 1);
        node.right = build(preorder, idx.get(val) + 1, hi);
        return node;
    }
}
`,
    },
  },
  {
    id: 'construct-tree-inorder-postorder',
    title: 'Construct Binary Tree from Inorder and Postorder Traversal',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `inorder` and `postorder` traversals of a binary tree with unique values, construct and return the tree.',
    constraints: ['`1 <= n <= 3000`', 'All values are unique'],
    sig: { name: 'buildTree', params: [{ name: 'inorder', type: 'int[]' }, { name: 'postorder', type: 'int[]' }], returns: 'TreeNode' },
    tests: [
      { args: [[9, 3, 15, 20, 7], [9, 15, 7, 20, 3]], expected: [3, 9, 20, null, null, 15, 7] },
      { args: [[-1], [-1]], expected: [-1] },
      { args: [[2, 1], [2, 1]], expected: [1, 2] },
      { args: [[1, 2], [2, 1]], expected: [1, null, 2] },
    ],
    hints: ['The last postorder element is the root.', 'Consume postorder from the end, building the **right** subtree before the left.'],
    approaches: [{ name: 'Recursion from the end of postorder', idea: 'Mirror of the preorder version: take roots from the back and recurse right first.', time: 'O(n)', space: 'O(n)' }],
    solution: {
      python: `class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        idx = {v: i for i, v in enumerate(inorder)}
        post = postorder[:]

        def build(lo, hi):
            if lo > hi:
                return None
            val = post.pop()
            node = TreeNode(val)
            node.right = build(idx[val] + 1, hi)
            node.left = build(lo, idx[val] - 1)
            return node

        return build(0, len(inorder) - 1)
`,
      java: `class Solution {
    private int post;
    private Map<Integer, Integer> idx = new HashMap<>();

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        post = postorder.length - 1;
        return build(postorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] postorder, int lo, int hi) {
        if (lo > hi) return null;
        int val = postorder[post--];
        TreeNode node = new TreeNode(val);
        node.right = build(postorder, idx.get(val) + 1, hi);
        node.left = build(postorder, lo, idx.get(val) - 1);
        return node;
    }
}
`,
    },
  },
  {
    id: 'populating-next-right-pointers-ii',
    title: 'Populating Next Right Pointers in Each Node II',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement:
      'Each node of a binary tree has an extra `next` pointer. Set every `next` to point to the node immediately to its right **on the same level**, or null if there is none. The tree is not necessarily complete. Return the root.\n\nThe output lists each level by following `next` pointers from its leftmost node, with `"#"` marking the end of each level.',
    constraints: ['`0 <= number of nodes <= 6000`', 'Follow-up: use only O(1) extra space (recursion stack aside)'],
    sig: { name: 'connect', params: [{ name: 'root', type: 'NextTreeNode' }], returns: 'NextTreeNode' },
    tests: [
      { args: [[1, 2, 3, 4, 5, null, 7]], expected: [1, '#', 2, 3, '#', 4, 5, 7, '#'] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1, '#'] },
      { args: [[1, 2, 3, 4, null, null, 5]], expected: [1, '#', 2, 3, '#', 4, 5, '#'] },
      { args: [[1, 2, null, 3, null, 4]], expected: [1, '#', 2, '#', 3, '#', 4, '#'] },
    ],
    notes: ['On level 3, 5 points to 7 even though 3 has no left child.'],
    hints: ['A level-order traversal with a queue links each node to the next one dequeued on the same level.', 'For O(1) space: walk the current level using the `next` pointers you already set, and build the next level\'s chain with a dummy head and a tail pointer.'],
    approaches: [
      { name: 'BFS by levels', idea: 'Process each level from a queue and link consecutive nodes.', time: 'O(n)', space: 'O(w)' },
      { name: 'Level-by-level with a dummy head', idea: 'The level above is already a linked list via `next`. Walk it, appending every child to a new chain; the chain becomes the next level.', time: 'O(n)', space: 'O(1)' },
    ],
    solution: {
      python: `class Solution:
    def connect(self, root: Optional[Node]) -> Optional[Node]:
        head = root
        while head:
            dummy = tail = Node(0)
            cur = head
            while cur:
                for child in (cur.left, cur.right):
                    if child:
                        tail.next = child
                        tail = child
                cur = cur.next
            head = dummy.next
        return root
`,
      java: `class Solution {
    public Node connect(Node root) {
        Node head = root;
        while (head != null) {
            Node dummy = new Node(0), tail = dummy;
            for (Node cur = head; cur != null; cur = cur.next) {
                if (cur.left != null) { tail.next = cur.left; tail = tail.next; }
                if (cur.right != null) { tail.next = cur.right; tail = tail.next; }
            }
            head = dummy.next;
        }
        return root;
    }
}
`,
    },
  },
  {
    id: 'diameter-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    topic: 'trees',
    statement: 'Return the length of the **diameter** of a binary tree: the number of edges on the longest path between any two nodes. The path may or may not pass through the root.',
    constraints: ['`1 <= number of nodes <= 10^4`'],
    sig: { name: 'diameterOfBinaryTree', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: 3 },
      { args: [[1, 2]], expected: 1 },
      { args: [[1]], expected: 0 },
      { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expected: 4 },
    ],
    hints: ['The longest path through a node = height(left) + height(right).', 'Compute heights recursively and update a global best at each node.'],
    approaches: [{ name: 'Height DFS with a running maximum', idea: 'One post-order traversal computes each subtree height and the best `left + right` seen.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def height(node):
            nonlocal best
            if not node:
                return 0
            l, r = height(node.left), height(node.right)
            best = max(best, l + r)
            return 1 + max(l, r)

        height(root)
        return best
`,
      java: `class Solution {
    private int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return best;
    }

    private int height(TreeNode n) {
        if (n == null) return 0;
        int l = height(n.left), r = height(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    }
}
`,
    },
  },
  {
    id: 'flatten-binary-tree',
    title: 'Flatten Binary Tree to Linked List',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Flatten a binary tree into a "linked list" **in place**: use `right` pointers as `next`, set every `left` to null, and keep the nodes in **preorder**.',
    constraints: ['`0 <= number of nodes <= 2000`'],
    sig: { name: 'flatten', params: [T('root')], returns: 'void', inplace: 0 },
    tests: [
      { args: [[1, 2, 5, 3, 4, null, 6]], expected: [1, null, 2, null, 3, null, 4, null, 5, null, 6] },
      { args: [[]], expected: [] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2]], expected: [1, null, 2] },
    ],
    hints: ['For each node with a left child, find the rightmost node of the left subtree.', 'Attach the original right subtree there, move the left subtree to the right, and clear `left`.'],
    approaches: [{ name: 'Morris-style rewiring', idea: 'Walk down the right spine; splice each left subtree in before the right subtree. No recursion needed.', time: 'O(n)', space: 'O(1)' }],
    solution: {
      python: `class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        cur = root
        while cur:
            if cur.left:
                pre = cur.left
                while pre.right:
                    pre = pre.right
                pre.right = cur.right
                cur.right = cur.left
                cur.left = None
            cur = cur.right
`,
      java: `class Solution {
    public void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) {
                TreeNode pre = cur.left;
                while (pre.right != null) pre = pre.right;
                pre.right = cur.right;
                cur.right = cur.left;
                cur.left = null;
            }
            cur = cur.right;
        }
    }
}
`,
    },
  },
  {
    id: 'path-sum',
    title: 'Path Sum',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the `root` of a binary tree and an integer `targetSum`, return `true` if there is a **root-to-leaf** path whose values add up to `targetSum`.',
    constraints: ['`0 <= number of nodes <= 5000`'],
    sig: { name: 'hasPathSum', params: [T('root'), { name: 'targetSum', type: 'int' }], returns: 'bool' },
    tests: [
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22], expected: true },
      { args: [[1, 2, 3], 5], expected: false },
      { args: [[], 0], expected: false },
      { args: [[1, 2], 1], expected: false },
      { args: [[-2, null, -3], -5], expected: true },
    ],
    hints: ['Subtract each node\'s value from the target as you go down.', 'Check for zero only at leaves.'],
    approaches: [{ name: 'DFS with remaining sum', idea: 'At a leaf, the remaining target must equal the leaf\'s value.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False
        if not root.left and not root.right:
            return root.val == targetSum
        rest = targetSum - root.val
        return self.hasPathSum(root.left, rest) or self.hasPathSum(root.right, rest)
`,
      java: `class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        if (root.left == null && root.right == null) return root.val == targetSum;
        int rest = targetSum - root.val;
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
}
`,
    },
  },
  {
    id: 'sum-root-to-leaf',
    title: 'Sum Root to Leaf Numbers',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Each node holds a digit 0–9. Every root-to-leaf path represents a number (e.g. path 1 → 2 → 3 is `123`). Return the total sum of all such numbers.',
    constraints: ['`1 <= number of nodes <= 1000`', 'Depth ≤ 10'],
    sig: { name: 'sumNumbers', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[1, 2, 3]], expected: 25 },
      { args: [[4, 9, 0, 5, 1]], expected: 1026 },
      { args: [[0]], expected: 0 },
      { args: [[1, 0]], expected: 10 },
    ],
    hints: ['Carry the number formed so far down the tree: `cur = cur * 10 + node.val`.', 'Add `cur` to the answer at each leaf.'],
    approaches: [{ name: 'DFS with accumulated value', idea: 'Pass the prefix number to children; leaves contribute their full number.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def sumNumbers(self, root: Optional[TreeNode]) -> int:
        def dfs(node, cur):
            if not node:
                return 0
            cur = cur * 10 + node.val
            if not node.left and not node.right:
                return cur
            return dfs(node.left, cur) + dfs(node.right, cur)
        return dfs(root, 0)
`,
      java: `class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode n, int cur) {
        if (n == null) return 0;
        cur = cur * 10 + n.val;
        if (n.left == null && n.right == null) return cur;
        return dfs(n.left, cur) + dfs(n.right, cur);
    }
}
`,
    },
  },
  {
    id: 'binary-tree-max-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    topic: 'trees',
    lc150: true,
    statement: 'A path is a sequence of nodes where each adjacent pair is connected by an edge; a node appears at most once, and the path need not pass through the root. Return the maximum sum of node values over all non-empty paths.',
    constraints: ['`1 <= number of nodes <= 3 * 10^4`', '`-1000 <= Node.val <= 1000`'],
    sig: { name: 'maxPathSum', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
      { args: [[-3]], expected: -3 },
      { args: [[2, -1]], expected: 2 },
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 },
    ],
    hints: ['For each node, compute the best "downward" path starting there: `val + max(0, bestLeft, bestRight)`.', 'The best path that bends at a node is `val + max(0, bestLeft) + max(0, bestRight)` — track the global maximum of that.'],
    approaches: [{ name: 'Post-order DFS', idea: 'Return the best single-branch gain to the parent while updating a global answer with the two-branch path at each node. Negative gains are dropped.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float('-inf')

        def gain(node):
            nonlocal best
            if not node:
                return 0
            l = max(gain(node.left), 0)
            r = max(gain(node.right), 0)
            best = max(best, node.val + l + r)
            return node.val + max(l, r)

        gain(root)
        return best
`,
      java: `class Solution {
    private int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    private int gain(TreeNode n) {
        if (n == null) return 0;
        int l = Math.max(gain(n.left), 0), r = Math.max(gain(n.right), 0);
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
    }
}
`,
    },
  },
  {
    id: 'bst-iterator',
    title: 'Binary Search Tree Iterator',
    difficulty: 'Medium',
    topic: 'bst',
    lc150: true,
    statement: 'Implement `BSTIterator`, which iterates over a BST in **inorder** (ascending) order:\n\n- `BSTIterator(root)` initialises the iterator.\n- `next()` returns the next smallest number.\n- `hasNext()` returns whether more numbers remain.\n\nAim for average O(1) time per call and O(h) memory.',
    constraints: ['`1 <= number of nodes <= 10^5`', '`next()` is only called when `hasNext()` is true'],
    sig: {
      kind: 'design',
      className: 'BSTIterator',
      ctor: [T('root')],
      methods: [
        { name: 'next', params: [], returns: 'int' },
        { name: 'hasNext', params: [], returns: 'bool' },
      ],
    },
    tests: [
      { args: [['BSTIterator', 'next', 'next', 'hasNext', 'next', 'hasNext', 'next', 'hasNext', 'next', 'hasNext'], [[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]], expected: [null, 3, 7, true, 9, true, 15, true, 20, false] },
      { args: [['BSTIterator', 'hasNext', 'next', 'hasNext'], [[[1]], [], [], []]], expected: [null, true, 1, false] },
      { args: [['BSTIterator', 'next', 'next', 'next', 'hasNext'], [[[2, 1, 3]], [], [], [], []]], expected: [null, 1, 2, 3, false] },
    ],
    hints: ['Simulate inorder traversal with an explicit stack.', 'Push the left spine; `next()` pops a node and pushes the left spine of its right child.'],
    approaches: [{ name: 'Controlled iterative inorder', idea: 'The stack always holds the path to the next smallest element. Each node is pushed and popped once, so `next` is amortised O(1).', time: 'O(1) amortised', space: 'O(h)' }],
    solution: {
      python: `class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left

    def next(self) -> int:
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val

    def hasNext(self) -> bool:
        return bool(self.stack)
`,
      java: `class BSTIterator {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    public BSTIterator(TreeNode root) { pushLeft(root); }

    private void pushLeft(TreeNode n) {
        for (; n != null; n = n.left) stack.push(n);
    }

    public int next() {
        TreeNode n = stack.pop();
        pushLeft(n.right);
        return n.val;
    }

    public boolean hasNext() { return !stack.isEmpty(); }
}
`,
    },
  },
  {
    id: 'count-complete-tree-nodes',
    title: 'Count Complete Tree Nodes',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Given the root of a **complete** binary tree (every level full except possibly the last, which is filled from the left), return the number of nodes. Aim for better than O(n).',
    constraints: ['`0 <= number of nodes <= 5 * 10^4`'],
    sig: { name: 'countNodes', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[1, 2, 3, 4, 5, 6]], expected: 6 },
      { args: [[]], expected: 0 },
      { args: [[1]], expected: 1 },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 7 },
    ],
    hints: ['If the leftmost and rightmost depths are equal, the tree is perfect: it has `2^h - 1` nodes.', 'Otherwise recurse on both children; one of them is always perfect.'],
    approaches: [
      { name: 'Plain traversal', idea: 'Count every node.', time: 'O(n)', space: 'O(h)' },
      { name: 'Perfect-subtree shortcut', idea: 'Compare left and right spine heights; perfect subtrees are counted with a formula.', time: 'O(log² n)', space: 'O(log n)' },
    ],
    solution: {
      python: `class Solution:
    def countNodes(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        lh, rh, l, r = 0, 0, root, root
        while l:
            lh += 1
            l = l.left
        while r:
            rh += 1
            r = r.right
        if lh == rh:
            return (1 << lh) - 1
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
`,
      java: `class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;
        int lh = 0, rh = 0;
        for (TreeNode l = root; l != null; l = l.left) lh++;
        for (TreeNode r = root; r != null; r = r.right) rh++;
        if (lh == rh) return (1 << lh) - 1;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}
`,
    },
  },
  {
    id: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Given a binary tree with unique values and two values `p` and `q` that both exist in it, return the value of their **lowest common ancestor** — the deepest node that has both as descendants (a node is a descendant of itself).\n\n*Adapted for this judge: `p` and `q` are given as values, and you return a value.*',
    constraints: ['`2 <= number of nodes <= 10^5`', 'All values unique; `p != q`'],
    sig: { name: 'lowestCommonAncestor', params: [T('root'), { name: 'p', type: 'int' }, { name: 'q', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5 },
      { args: [[1, 2], 1, 2], expected: 1 },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 8], expected: 3 },
    ],
    hints: ['Recurse into both subtrees; return the node if it equals `p` or `q`.', 'If both sides return something, the current node is the LCA; otherwise pass up the non-empty side.'],
    approaches: [{ name: 'Post-order search', idea: 'The first node whose left and right subtrees each contain one target (or which is itself a target containing the other) is the LCA.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def lowestCommonAncestor(self, root: Optional[TreeNode], p: int, q: int) -> int:
        def find(node):
            if not node or node.val in (p, q):
                return node
            l, r = find(node.left), find(node.right)
            if l and r:
                return node
            return l or r
        return find(root).val
`,
      java: `class Solution {
    public int lowestCommonAncestor(TreeNode root, int p, int q) {
        return find(root, p, q).val;
    }

    private TreeNode find(TreeNode n, int p, int q) {
        if (n == null || n.val == p || n.val == q) return n;
        TreeNode l = find(n.left, p, q), r = find(n.right, p, q);
        if (l != null && r != null) return n;
        return l != null ? l : r;
    }
}
`,
    },
  },
  // ---------------- BFS ----------------
  {
    id: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Imagine standing on the right side of a binary tree. Return the values of the nodes you can see, ordered from top to bottom.',
    constraints: ['`0 <= number of nodes <= 100`'],
    sig: { name: 'rightSideView', params: [T('root')], returns: 'List<int>' },
    tests: [
      { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] },
      { args: [[1, null, 3]], expected: [1, 3] },
      { args: [[]], expected: [] },
      { args: [[1, 2, 3, 4]], expected: [1, 3, 4] },
    ],
    hints: ['Do a level-order traversal.', 'The last node of each level is visible from the right.'],
    approaches: [{ name: 'BFS by levels', idea: 'Record the final node processed at each level.', time: 'O(n)', space: 'O(w)' }],
    solution: {
      python: `class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        res, q = [], deque([root] if root else [])
        while q:
            for i in range(len(q)):
                node = q.popleft()
                if i == 0:
                    res.append(None)
                res[-1] = node.val
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
        return res
`,
      java: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                if (i == size - 1) res.add(n.val);
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'average-of-levels',
    title: 'Average of Levels in Binary Tree',
    difficulty: 'Easy',
    topic: 'trees',
    lc150: true,
    statement: 'Return the average value of the nodes on each level of a binary tree, as a list from top to bottom. Answers within `10^-5` are accepted.',
    constraints: ['`1 <= number of nodes <= 10^4`'],
    sig: { name: 'averageOfLevels', params: [T('root')], returns: 'List<double>' },
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [3.0, 14.5, 11.0] },
      { args: [[3, 9, 20, 15, 7]], expected: [3.0, 14.5, 11.0] },
      { args: [[1]], expected: [1.0] },
      { args: [[2147483647, 2147483647, 2147483647]], expected: [2147483647.0, 2147483647.0] },
    ],
    hints: ['Level-order traversal again.', 'Sum each level using a 64-bit accumulator to avoid overflow.'],
    approaches: [{ name: 'BFS by levels', idea: 'Average each level\'s values as you process it.', time: 'O(n)', space: 'O(w)' }],
    solution: {
      python: `class Solution:
    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:
        res, q = [], deque([root])
        while q:
            total, size = 0, len(q)
            for _ in range(size):
                node = q.popleft()
                total += node.val
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(total / size)
        return res
`,
      java: `class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>(List.of(root));
        while (!q.isEmpty()) {
            int size = q.size();
            long total = 0;
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                total += n.val;
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            res.add((double) total / size);
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Return the level order traversal of a binary tree\'s values: a list of levels, each listing values from left to right.',
    constraints: ['`0 <= number of nodes <= 2000`'],
    sig: { name: 'levelOrder', params: [T('root')], returns: 'List<List<int>>' },
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] },
      { args: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] },
    ],
    hints: ['Use a queue.', 'Process exactly `len(queue)` nodes per level.'],
    approaches: [{ name: 'BFS', idea: 'Each outer iteration consumes one full level and enqueues the next.', time: 'O(n)', space: 'O(w)' }],
    solution: {
      python: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        res, q = [], deque([root] if root else [])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(level)
        return res
`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.offer(root);
        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                level.add(n.val);
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            res.add(level);
        }
        return res;
    }
}
`,
    },
  },
  {
    id: 'binary-tree-zigzag',
    title: 'Binary Tree Zigzag Level Order Traversal',
    difficulty: 'Medium',
    topic: 'trees',
    lc150: true,
    statement: 'Return the zigzag level order traversal: the first level left to right, the next right to left, and so on, alternating.',
    constraints: ['`0 <= number of nodes <= 2000`'],
    sig: { name: 'zigzagLevelOrder', params: [T('root')], returns: 'List<List<int>>' },
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [20, 9], [15, 7]] },
      { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1], [3, 2], [4, 5, 6, 7]] },
    ],
    hints: ['Do a normal level-order traversal.', 'Reverse every other level before adding it.'],
    approaches: [{ name: 'BFS with alternating direction', idea: 'Collect each level, reversing odd-numbered levels.', time: 'O(n)', space: 'O(w)' }],
    solution: {
      python: `class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        res, q = [], deque([root] if root else [])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(level if len(res) % 2 == 0 else level[::-1])
        return res
`,
      java: `class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Deque<TreeNode> q = new ArrayDeque<>();
        if (root != null) q.offer(root);
        while (!q.isEmpty()) {
            LinkedList<Integer> level = new LinkedList<>();
            boolean ltr = res.size() % 2 == 0;
            for (int i = q.size(); i > 0; i--) {
                TreeNode n = q.poll();
                if (ltr) level.addLast(n.val); else level.addFirst(n.val);
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
            res.add(level);
        }
        return res;
    }
}
`,
    },
  },
  // ---------------- BST ----------------
  {
    id: 'min-abs-diff-bst',
    title: 'Minimum Absolute Difference in BST',
    difficulty: 'Easy',
    topic: 'bst',
    lc150: true,
    statement: 'Given the root of a BST, return the minimum absolute difference between the values of any two different nodes.',
    constraints: ['`2 <= number of nodes <= 10^4`'],
    sig: { name: 'getMinimumDifference', params: [T('root')], returns: 'int' },
    tests: [
      { args: [[4, 2, 6, 1, 3]], expected: 1 },
      { args: [[1, 0, 48, null, null, 12, 49]], expected: 1 },
      { args: [[5, 1, 9]], expected: 4 },
      { args: [[236, 104, 701, null, 227, null, 911]], expected: 9 },
    ],
    hints: ['An inorder traversal of a BST is sorted.', 'In sorted order, the minimum difference is between adjacent elements.'],
    approaches: [{ name: 'Inorder with previous value', idea: 'Track the previously visited value during inorder traversal and compare adjacent pairs.', time: 'O(n)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        best, prev = float('inf'), None

        def inorder(node):
            nonlocal best, prev
            if not node:
                return
            inorder(node.left)
            if prev is not None:
                best = min(best, node.val - prev)
            prev = node.val
            inorder(node.right)

        inorder(root)
        return best
`,
      java: `class Solution {
    private int best = Integer.MAX_VALUE;
    private Integer prev = null;

    public int getMinimumDifference(TreeNode root) {
        inorder(root);
        return best;
    }

    private void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        if (prev != null) best = Math.min(best, n.val - prev);
        prev = n.val;
        inorder(n.right);
    }
}
`,
    },
  },
  {
    id: 'kth-smallest-in-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    topic: 'bst',
    lc150: true,
    statement: 'Given the root of a BST and an integer `k`, return the `k`-th smallest value (1-indexed) among all node values.',
    constraints: ['`1 <= k <= n <= 10^4`'],
    sig: { name: 'kthSmallest', params: [T('root'), { name: 'k', type: 'int' }], returns: 'int' },
    tests: [
      { args: [[3, 1, 4, null, 2], 1], expected: 1 },
      { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      { args: [[1], 1], expected: 1 },
      { args: [[5, 3, 6, 2, 4, null, null, 1], 6], expected: 6 },
    ],
    hints: ['Inorder traversal visits values in ascending order.', 'Stop as soon as you have visited `k` nodes.'],
    approaches: [{ name: 'Iterative inorder with early exit', idea: 'Use a stack to walk inorder, decrementing `k` until it reaches zero.', time: 'O(h + k)', space: 'O(h)' }],
    solution: {
      python: `class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack, node = [], root
        while True:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            k -= 1
            if k == 0:
                return node.val
            node = node.right
`,
      java: `class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        while (true) {
            for (; node != null; node = node.left) stack.push(node);
            node = stack.pop();
            if (--k == 0) return node.val;
            node = node.right;
        }
    }
}
`,
    },
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    topic: 'bst',
    lc150: true,
    statement: 'Determine whether a binary tree is a valid BST: every node\'s left subtree contains only smaller values, its right subtree only larger values, and both subtrees are themselves BSTs.',
    constraints: ['`1 <= number of nodes <= 10^4`', '`-2^31 <= Node.val <= 2^31 - 1`'],
    sig: { name: 'isValidBST', params: [T('root')], returns: 'bool' },
    tests: [
      { args: [[2, 1, 3]], expected: true },
      { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
      { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
      { args: [[2147483647]], expected: true },
      { args: [[2, 2, 2]], expected: false },
    ],
    hints: ['Comparing a node only with its children is not enough.', 'Pass down an allowed (low, high) range; use 64-bit bounds or nulls to handle extreme values.'],
    approaches: [
      { name: 'Range recursion', idea: 'Every node must lie strictly within bounds inherited from its ancestors.', time: 'O(n)', space: 'O(h)' },
      { name: 'Inorder must be strictly increasing', idea: 'Track the previous inorder value.', time: 'O(n)', space: 'O(h)' },
    ],
    solution: {
      python: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def ok(node, lo, hi):
            if not node:
                return True
            if not (lo < node.val < hi):
                return False
            return ok(node.left, lo, node.val) and ok(node.right, node.val, hi)
        return ok(root, float('-inf'), float('inf'))
`,
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        return ok(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean ok(TreeNode n, long lo, long hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return ok(n.left, lo, n.val) && ok(n.right, n.val, hi);
    }
}
`,
    },
  },
];

export default problems;
