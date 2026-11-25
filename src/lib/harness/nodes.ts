/**
 * LeetCode-style `Node` classes for problems the plain ListNode/TreeNode types can't express.
 * LeetCode calls all of these `Node`, with different fields, so a problem may use only one kind.
 *
 * Wire formats (JSON):
 *   RandomListNode  [[val, randomIndex | null], ...]
 *   GraphNode       adjacency list; node i+1's neighbours are adj[i] (values are 1..n); [] = no graph
 *   NextTreeNode    input: level order with nulls; output: values level by level via `next`, "#" ending each level
 *   QuadNode        output: level order of [isLeaf, val] (internal nodes as [0, 1]); null for no tree
 *
 * For RandomListNode and GraphNode the harness also checks that the result shares no node with the input
 * (the problem asks for a deep copy).
 */
import type { Sig, TypeName } from './types';

export type NodeKind = 'RandomListNode' | 'GraphNode' | 'NextTreeNode' | 'QuadNode';
export const NODE_KINDS: NodeKind[] = ['RandomListNode', 'GraphNode', 'NextTreeNode', 'QuadNode'];
export const isNodeKind = (t: TypeName): t is NodeKind => (NODE_KINDS as string[]).includes(t);

export function nodeKindOf(sig: Sig): NodeKind | null {
  const s = JSON.stringify(sig);
  return NODE_KINDS.find((k) => s.includes(`"${k}"`)) || null;
}

// ---------------------------------------------------------------- starter comments
export const STARTER_DOC: Record<NodeKind, { py: string[]; java: string[]; cpp: string[] }> = {
  RandomListNode: {
    py: ['# Definition for a Node.', '# class Node:', '#     def __init__(self, x: int, next: \'Node\' = None, random: \'Node\' = None):', '#         self.val = int(x)', '#         self.next = next', '#         self.random = random'],
    java: ['/*', '// Definition for a Node.', 'class Node {', '    int val;', '    Node next;', '    Node random;', '    public Node(int val) { this.val = val; }', '}', '*/'],
    cpp: ['/*', '// Definition for a Node.', 'class Node {', 'public:', '    int val; Node* next; Node* random;', '    Node(int _val) : val(_val), next(nullptr), random(nullptr) {}', '};', '*/'],
  },
  GraphNode: {
    py: ['# Definition for a Node.', '# class Node:', '#     def __init__(self, val = 0, neighbors = None):', '#         self.val = val', '#         self.neighbors = neighbors if neighbors is not None else []'],
    java: ['/*', '// Definition for a Node.', 'class Node {', '    public int val;', '    public List<Node> neighbors;', '    public Node(int val) { this.val = val; neighbors = new ArrayList<>(); }', '}', '*/'],
    cpp: ['/*', '// Definition for a Node.', 'class Node {', 'public:', '    int val; vector<Node*> neighbors;', '    Node(int _val) : val(_val) {}', '};', '*/'],
  },
  NextTreeNode: {
    py: ['# Definition for a Node.', '# class Node:', '#     def __init__(self, val: int = 0, left: \'Node\' = None, right: \'Node\' = None, next: \'Node\' = None):', '#         self.val = val', '#         self.left = left', '#         self.right = right', '#         self.next = next'],
    java: ['/*', '// Definition for a Node.', 'class Node {', '    public int val;', '    public Node left, right, next;', '    public Node(int val) { this.val = val; }', '}', '*/'],
    cpp: ['/*', '// Definition for a Node.', 'class Node {', 'public:', '    int val; Node *left, *right, *next;', '    Node(int _val) : val(_val), left(nullptr), right(nullptr), next(nullptr) {}', '};', '*/'],
  },
  QuadNode: {
    py: ['# Definition for a QuadTree node.', '# class Node:', '#     def __init__(self, val, isLeaf, topLeft=None, topRight=None, bottomLeft=None, bottomRight=None):', '#         self.val = val', '#         self.isLeaf = isLeaf', '#         self.topLeft = topLeft', '#         self.topRight = topRight', '#         self.bottomLeft = bottomLeft', '#         self.bottomRight = bottomRight'],
    java: ['/*', '// Definition for a QuadTree node.', 'class Node {', '    public boolean val, isLeaf;', '    public Node topLeft, topRight, bottomLeft, bottomRight;', '    public Node(boolean val, boolean isLeaf) { this.val = val; this.isLeaf = isLeaf; }', '    public Node(boolean val, boolean isLeaf, Node topLeft, Node topRight, Node bottomLeft, Node bottomRight) { ... }', '}', '*/'],
    cpp: ['/*', '// Definition for a QuadTree node.', 'class Node {', 'public:', '    bool val, isLeaf; Node *topLeft, *topRight, *bottomLeft, *bottomRight;', '    Node(bool _val, bool _isLeaf);', '    Node(bool _val, bool _isLeaf, Node* tl, Node* tr, Node* bl, Node* br);', '};', '*/'],
  },
};

// ---------------------------------------------------------------- Python
export const PY_NODE: Record<NodeKind, string> = {
  RandomListNode: `
class Node:
    def __init__(self, x=0, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random
`,
  GraphNode: `
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
`,
  NextTreeNode: `
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
`,
  QuadNode: `
class Node:
    def __init__(self, val=False, isLeaf=False, topLeft=None, topRight=None, bottomLeft=None, bottomRight=None):
        self.val = val
        self.isLeaf = isLeaf
        self.topLeft = topLeft
        self.topRight = topRight
        self.bottomLeft = bottomLeft
        self.bottomRight = bottomRight
`,
};

/** Python conversion functions; called from _sw_in / _sw_out for node kinds. */
export const PY_NODE_RUNTIME = `
_SW_INPUT_IDS = set()

def _sw_reset():
    # ids are only unique among live objects, so forget the previous test case's inputs.
    _SW_INPUT_IDS.clear()

def _sw_node_in(t, v):
    if t == 'RandomListNode':
        nodes = [Node(p[0]) for p in v]
        for i, p in enumerate(v):
            if i + 1 < len(nodes): nodes[i].next = nodes[i + 1]
            if p[1] is not None: nodes[i].random = nodes[p[1]]
        _SW_INPUT_IDS.update(id(n) for n in nodes)
        return nodes[0] if nodes else None
    if t == 'GraphNode':
        if not v: return None
        nodes = [Node(i + 1) for i in range(len(v))]
        for i, nbrs in enumerate(v): nodes[i].neighbors = [nodes[j - 1] for j in nbrs]
        _SW_INPUT_IDS.update(id(n) for n in nodes)
        return nodes[0]
    if t == 'NextTreeNode':
        if not v or v[0] is None: return None
        root = Node(v[0]); q = deque([root]); i = 1
        while q and i < len(v):
            n = q.popleft()
            if i < len(v) and v[i] is not None: n.left = Node(v[i]); q.append(n.left)
            i += 1
            if i < len(v) and v[i] is not None: n.right = Node(v[i]); q.append(n.right)
            i += 1
        return root
    raise ValueError('unsupported input type ' + t)

def _sw_shared(n):
    if id(n) in _SW_INPUT_IDS:
        raise RuntimeError('The result reuses nodes from the input; you must return a deep copy.')

def _sw_node_out(t, v):
    if t == 'RandomListNode':
        nodes, cur = [], v
        while cur is not None and len(nodes) < 10000:
            _sw_shared(cur); nodes.append(cur); cur = cur.next
        index = {id(n): i for i, n in enumerate(nodes)}
        return [[n.val, index.get(id(n.random)) if n.random is not None else None] for n in nodes]
    if t == 'GraphNode':
        if v is None: return []
        seen, q = {id(v): v}, deque([v])
        while q:
            n = q.popleft(); _sw_shared(n)
            for m in n.neighbors:
                if id(m) not in seen: seen[id(m)] = m; q.append(m)
        nodes = sorted(seen.values(), key=lambda n: n.val)
        return [[m.val for m in n.neighbors] for n in nodes]
    if t == 'NextTreeNode':
        res, head = [], v
        while head is not None:
            nxt_head, cur = None, head
            while cur is not None:
                res.append(cur.val)
                if nxt_head is None: nxt_head = cur.left or cur.right
                cur = cur.next
            res.append('#')
            head = nxt_head
        return res
    if t == 'QuadNode':
        if v is None: return None
        res, q = [], deque([v])
        while q:
            n = q.popleft()
            if n.isLeaf: res.append([1, 1 if n.val else 0])
            else:
                res.append([0, 1]); q.extend([n.topLeft, n.topRight, n.bottomLeft, n.bottomRight])
        return res
    raise ValueError('unsupported output type ' + t)
`;

// ---------------------------------------------------------------- Java
export const JAVA_NODE: Record<NodeKind, string> = {
  RandomListNode: `class Node { int val; Node next; Node random; Node(int val) { this.val = val; } }\n`,
  GraphNode: `class Node { public int val; public List<Node> neighbors; public Node() { neighbors = new ArrayList<>(); } public Node(int val) { this.val = val; neighbors = new ArrayList<>(); } public Node(int val, ArrayList<Node> neighbors) { this.val = val; this.neighbors = neighbors; } }\n`,
  NextTreeNode: `class Node { public int val; public Node left, right, next; public Node() {} public Node(int val) { this.val = val; } public Node(int val, Node left, Node right, Node next) { this.val = val; this.left = left; this.right = right; this.next = next; } }\n`,
  QuadNode: `class Node { public boolean val, isLeaf; public Node topLeft, topRight, bottomLeft, bottomRight; public Node() {} public Node(boolean val, boolean isLeaf) { this.val = val; this.isLeaf = isLeaf; } public Node(boolean val, boolean isLeaf, Node topLeft, Node topRight, Node bottomLeft, Node bottomRight) { this.val = val; this.isLeaf = isLeaf; this.topLeft = topLeft; this.topRight = topRight; this.bottomLeft = bottomLeft; this.bottomRight = bottomRight; } }\n`,
};

export const JAVA_NODE_CONV: Record<NodeKind, string> = {
  RandomListNode: 'HN.toRandom',
  GraphNode: 'HN.toGraph',
  NextTreeNode: 'HN.toNextTree',
  QuadNode: 'HN.unsupported',
};

/** Helpers used only by node-kind problems (emitted only when the problem needs them). */
export const JAVA_NODE_HELPERS: Record<NodeKind, string> = {
  RandomListNode: `
final class HN {
    static final Set<Node> inputs = Collections.newSetFromMap(new IdentityHashMap<>());
    static Node toRandom(Object o) {
        List<Object> v = H.L(o); List<Node> nodes = new ArrayList<>();
        for (Object p : v) nodes.add(new Node(H.toInt(H.L(p).get(0))));
        for (int i = 0; i < nodes.size(); i++) {
            if (i + 1 < nodes.size()) nodes.get(i).next = nodes.get(i + 1);
            Object r = H.L(v.get(i)).get(1);
            if (r != null) nodes.get(i).random = nodes.get(H.toInt(r));
        }
        inputs.addAll(nodes);
        return nodes.isEmpty() ? null : nodes.get(0);
    }
    static String ser(Node head) {
        List<Node> nodes = new ArrayList<>(); Map<Node, Integer> idx = new IdentityHashMap<>();
        for (Node c = head; c != null && nodes.size() < 10000; c = c.next) {
            if (inputs.contains(c)) throw new RuntimeException("The result reuses nodes from the input; you must return a deep copy.");
            idx.put(c, nodes.size()); nodes.add(c);
        }
        StringBuilder b = new StringBuilder("[");
        for (int i = 0; i < nodes.size(); i++) {
            if (i > 0) b.append(',');
            Node n = nodes.get(i);
            b.append('[').append(n.val).append(',').append(n.random == null ? "null" : String.valueOf(idx.get(n.random))).append(']');
        }
        return b.append(']').toString();
    }
}
`,
  GraphNode: `
final class HN {
    static final Set<Node> inputs = Collections.newSetFromMap(new IdentityHashMap<>());
    static Node toGraph(Object o) {
        List<Object> v = H.L(o);
        if (v.isEmpty()) return null;
        List<Node> nodes = new ArrayList<>();
        for (int i = 0; i < v.size(); i++) nodes.add(new Node(i + 1));
        for (int i = 0; i < v.size(); i++) for (Object j : H.L(v.get(i))) nodes.get(i).neighbors.add(nodes.get(H.toInt(j) - 1));
        inputs.addAll(nodes);
        return nodes.get(0);
    }
    static String ser(Node start) {
        if (start == null) return "[]";
        Map<Node, Boolean> seen = new IdentityHashMap<>(); ArrayDeque<Node> q = new ArrayDeque<>(); List<Node> all = new ArrayList<>();
        seen.put(start, true); q.add(start);
        while (!q.isEmpty()) {
            Node n = q.poll(); all.add(n);
            if (inputs.contains(n)) throw new RuntimeException("The result reuses nodes from the input; you must return a deep copy.");
            for (Node m : n.neighbors) if (seen.put(m, true) == null) q.add(m);
        }
        all.sort((a, b) -> Integer.compare(a.val, b.val));
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < all.size(); i++) {
            if (i > 0) sb.append(',');
            sb.append('[');
            List<Node> nb = all.get(i).neighbors;
            for (int k = 0; k < nb.size(); k++) { if (k > 0) sb.append(','); sb.append(nb.get(k).val); }
            sb.append(']');
        }
        return sb.append(']').toString();
    }
}
`,
  NextTreeNode: `
final class HN {
    static Node toNextTree(Object o) {
        List<Object> v = H.L(o); if (v.isEmpty() || v.get(0) == null) return null;
        Node root = new Node(H.toInt(v.get(0))); ArrayDeque<Node> q = new ArrayDeque<>(); q.add(root); int k = 1;
        while (!q.isEmpty() && k < v.size()) { Node n = q.poll();
            if (k < v.size() && v.get(k) != null) { n.left = new Node(H.toInt(v.get(k))); q.add(n.left); } k++;
            if (k < v.size() && v.get(k) != null) { n.right = new Node(H.toInt(v.get(k))); q.add(n.right); } k++; }
        return root;
    }
    static String ser(Node head) {
        List<String> r = new ArrayList<>();
        while (head != null) {
            Node nextHead = null;
            for (Node c = head; c != null; c = c.next) {
                r.add(String.valueOf(c.val));
                if (nextHead == null) nextHead = c.left != null ? c.left : c.right;
            }
            r.add("\\"#\\"");
            head = nextHead;
        }
        return "[" + String.join(",", r) + "]";
    }
}
`,
  QuadNode: `
final class HN {
    static Node unsupported(Object o) { throw new UnsupportedOperationException(); }
    static String ser(Node root) {
        if (root == null) return "null";
        List<String> r = new ArrayList<>(); ArrayDeque<Node> q = new ArrayDeque<>(); q.add(root);
        while (!q.isEmpty()) {
            Node n = q.poll();
            if (n.isLeaf) r.add("[1," + (n.val ? 1 : 0) + "]");
            else { r.add("[0,1]"); q.add(n.topLeft); q.add(n.topRight); q.add(n.bottomLeft); q.add(n.bottomRight); }
        }
        return "[" + String.join(",", r) + "]";
    }
}
`,
};

// ---------------------------------------------------------------- C++
export const CPP_NODE: Record<NodeKind, string> = {
  RandomListNode: `class Node { public: int val; Node* next; Node* random; Node(int _val) : val(_val), next(nullptr), random(nullptr) {} };\n`,
  GraphNode: `class Node { public: int val; vector<Node*> neighbors; Node() : val(0) {} Node(int _val) : val(_val) {} Node(int _val, vector<Node*> _n) : val(_val), neighbors(_n) {} };\n`,
  NextTreeNode: `class Node { public: int val; Node *left, *right, *next; Node() : val(0), left(nullptr), right(nullptr), next(nullptr) {} Node(int _val) : val(_val), left(nullptr), right(nullptr), next(nullptr) {} Node(int _val, Node* l, Node* r, Node* n) : val(_val), left(l), right(r), next(n) {} };\n`,
  QuadNode: `class Node { public: bool val, isLeaf; Node *topLeft, *topRight, *bottomLeft, *bottomRight; Node() : val(false), isLeaf(false), topLeft(nullptr), topRight(nullptr), bottomLeft(nullptr), bottomRight(nullptr) {} Node(bool v, bool l) : val(v), isLeaf(l), topLeft(nullptr), topRight(nullptr), bottomLeft(nullptr), bottomRight(nullptr) {} Node(bool v, bool l, Node* a, Node* b, Node* c, Node* d) : val(v), isLeaf(l), topLeft(a), topRight(b), bottomLeft(c), bottomRight(d) {} };\n`,
};

/** C++ conversion + serialisation for node kinds; placed inside namespace sw after the generic helpers. */
export const CPP_NODE_RUNTIME: Record<NodeKind, string> = {
  RandomListNode: String.raw`
set<Node*> inputs;
template <> struct C<Node*> { static Node* f(const J& j) {
  vector<Node*> nodes; for (auto& p : j.a) nodes.push_back(new Node((int) llround(p.a[0].n)));
  for (size_t i = 0; i < nodes.size(); i++) { if (i + 1 < nodes.size()) nodes[i]->next = nodes[i + 1]; if (j.a[i].a[1].k != 0) nodes[i]->random = nodes[(size_t) llround(j.a[i].a[1].n)]; }
  for (auto n : nodes) inputs.insert(n);
  return nodes.empty() ? nullptr : nodes[0]; } };
string ser(Node* head) {
  vector<Node*> nodes; map<Node*, int> idx;
  for (Node* c = head; c && nodes.size() < 10000; c = c->next) { if (inputs.count(c)) throw runtime_error("The result reuses nodes from the input; you must return a deep copy."); idx[c] = (int) nodes.size(); nodes.push_back(c); }
  string r = "["; for (size_t i = 0; i < nodes.size(); i++) { if (i) r += ","; r += "[" + to_string(nodes[i]->val) + "," + (nodes[i]->random ? to_string(idx[nodes[i]->random]) : string("null")) + "]"; }
  return r + "]"; }
`,
  GraphNode: String.raw`
set<Node*> inputs;
template <> struct C<Node*> { static Node* f(const J& j) {
  if (j.a.empty()) return nullptr; vector<Node*> nodes; for (size_t i = 0; i < j.a.size(); i++) nodes.push_back(new Node((int) i + 1));
  for (size_t i = 0; i < j.a.size(); i++) for (auto& x : j.a[i].a) nodes[i]->neighbors.push_back(nodes[(size_t) llround(x.n) - 1]);
  for (auto n : nodes) inputs.insert(n);
  return nodes[0]; } };
string ser(Node* start) {
  if (!start) return "[]"; set<Node*> seen{start}; deque<Node*> q{start}; vector<Node*> all;
  while (!q.empty()) { Node* n = q.front(); q.pop_front(); all.push_back(n); if (inputs.count(n)) throw runtime_error("The result reuses nodes from the input; you must return a deep copy.");
    for (Node* m : n->neighbors) if (seen.insert(m).second) q.push_back(m); }
  sort(all.begin(), all.end(), [](Node* a, Node* b) { return a->val < b->val; });
  string r = "["; for (size_t i = 0; i < all.size(); i++) { if (i) r += ","; r += "["; for (size_t k = 0; k < all[i]->neighbors.size(); k++) { if (k) r += ","; r += to_string(all[i]->neighbors[k]->val); } r += "]"; }
  return r + "]"; }
`,
  NextTreeNode: String.raw`
template <> struct C<Node*> { static Node* f(const J& j) {
  if (j.a.empty() || j.a[0].k == 0) return nullptr; Node* root = new Node((int) llround(j.a[0].n)); deque<Node*> q{root}; size_t i = 1;
  while (!q.empty() && i < j.a.size()) { Node* n = q.front(); q.pop_front();
    if (i < j.a.size() && j.a[i].k != 0) { n->left = new Node((int) llround(j.a[i].n)); q.push_back(n->left); } i++;
    if (i < j.a.size() && j.a[i].k != 0) { n->right = new Node((int) llround(j.a[i].n)); q.push_back(n->right); } i++; }
  return root; } };
string ser(Node* head) {
  string r = "["; bool first = true;
  while (head) { Node* nh = nullptr; for (Node* c = head; c; c = c->next) { r += (first ? "" : ",") + to_string(c->val); first = false; if (!nh) nh = c->left ? c->left : c->right; } r += ",\"#\""; head = nh; }
  return r + "]"; }
`,
  QuadNode: String.raw`
string ser(Node* root) {
  if (!root) return "null"; string r = "["; deque<Node*> q{root}; bool first = true;
  while (!q.empty()) { Node* n = q.front(); q.pop_front(); r += first ? "" : ","; first = false;
    if (n->isLeaf) r += string("[1,") + (n->val ? "1" : "0") + "]"; else { r += "[0,1]"; q.push_back(n->topLeft); q.push_back(n->topRight); q.push_back(n->bottomLeft); q.push_back(n->bottomRight); } }
  return r + "]"; }
`,
};
