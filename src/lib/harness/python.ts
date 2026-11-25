import { isDesign, visible, type Param, type Sig, type TypeName } from './types';
import { nodeKindOf, PY_NODE, PY_NODE_RUNTIME, STARTER_DOC } from './nodes';

const PY: Record<TypeName, string> = {
  int: 'int',
  long: 'int',
  double: 'float',
  bool: 'bool',
  string: 'str',
  char: 'str',
  'int[]': 'List[int]',
  'char[]': 'List[str]',
  'string[]': 'List[str]',
  'int[][]': 'List[List[int]]',
  'char[][]': 'List[List[str]]',
  'List<int>': 'List[int]',
  'List<string>': 'List[str]',
  'List<double>': 'List[float]',
  'List<List<int>>': 'List[List[int]]',
  'List<List<string>>': 'List[List[str]]',
  ListNode: 'Optional[ListNode]',
  TreeNode: 'Optional[TreeNode]',
  'ListNode[]': 'List[Optional[ListNode]]',
  RandomListNode: 'Optional[Node]',
  GraphNode: 'Optional[Node]',
  NextTreeNode: 'Optional[Node]',
  QuadNode: 'Node',
  void: 'None',
};

const usesNode = (s: Sig, n: 'ListNode' | 'TreeNode') => JSON.stringify(s).includes(`"${n}`);

const params = (ps: Param[]) => visible(ps).map((p) => `, ${p.name}: ${PY[p.type]}`).join('');

export function pythonStarter(sig: Sig): string {
  const head: string[] = [];
  if (usesNode(sig, 'ListNode'))
    head.push('# Definition for singly-linked list.', '# class ListNode:', '#     def __init__(self, val=0, next=None):', '#         self.val = val', '#         self.next = next');
  if (usesNode(sig, 'TreeNode'))
    head.push('# Definition for a binary tree node.', '# class TreeNode:', '#     def __init__(self, val=0, left=None, right=None):', '#         self.val = val', '#         self.left = left', '#         self.right = right');
  const kind = nodeKindOf(sig);
  if (kind) head.push(...STARTER_DOC[kind].py);
  if (head.length) head.push('');
  if (isDesign(sig)) {
    const lines = [`class ${sig.className}:`, `    def __init__(self${params(sig.ctor)}):`, '        pass', ''];
    for (const m of sig.methods) lines.push(`    def ${m.name}(self${params(m.params)}) -> ${PY[m.returns]}:`, '        pass', '');
    return [...head, ...lines].join('\n').trimEnd() + '\n';
  }
  return [...head, 'class Solution:', `    def ${sig.name}(self${params(sig.params)}) -> ${PY[sig.returns]}:`, '        pass', ''].join('\n');
}

const PRELUDE = `from __future__ import annotations
import sys, json, math, heapq, bisect, itertools, functools, collections, string
from typing import *
from collections import *
from functools import lru_cache, cache
from heapq import *
from bisect import *

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`;

const RUNTIME = `
def _sw_in(t, v):
    if t in ('RandomListNode', 'GraphNode', 'NextTreeNode', 'QuadNode'): return _sw_node_in(t, v)
    if t == 'ListNode':
        d = ListNode(); c = d
        for x in v: c.next = ListNode(x); c = c.next
        return d.next
    if t == 'ListNode[]':
        return [_sw_in('ListNode', x) for x in v]
    if t == 'TreeNode':
        if not v or v[0] is None: return None
        root = TreeNode(v[0]); q = deque([root]); i = 1
        while q and i < len(v):
            n = q.popleft()
            if i < len(v) and v[i] is not None: n.left = TreeNode(v[i]); q.append(n.left)
            i += 1
            if i < len(v) and v[i] is not None: n.right = TreeNode(v[i]); q.append(n.right)
            i += 1
        return root
    if t == 'double': return float(v)
    return v

def _sw_out(t, v):
    if t in ('RandomListNode', 'GraphNode', 'NextTreeNode', 'QuadNode'): return _sw_node_out(t, v)
    if t == 'ListNode':
        r = []; seen = 0
        while v is not None and seen < 10000: r.append(v.val); v = v.next; seen += 1
        return r
    if t == 'TreeNode':
        if v is None: return []
        r = []; q = deque([v])
        while q:
            n = q.popleft()
            if n is None: r.append(None); continue
            r.append(n.val); q.append(n.left); q.append(n.right)
        while r and r[-1] is None: r.pop()
        return r
    if isinstance(v, tuple): return list(v)
    if isinstance(v, set): return sorted(v)
    return v

def _sw_cyc(head, pos):
    if head is None or pos < 0: return
    nodes = []
    while head is not None: nodes.append(head); head = head.next
    nodes[-1].next = nodes[pos]

def _sw_emit(tag, payload=''):
    sys.stdout.write('\\x01' + tag + (' ' + payload if payload else '') + '\\n')
`;

export function pythonProgram(user: string, sig: Sig): string {
  let main: string;
  if (isDesign(sig)) {
    const methods = Object.fromEntries(sig.methods.map((m) => [m.name, [m.params.map((p) => p.type), m.returns]]));
    main = `
def _sw_main():
    data = sys.stdin.read().split('\\n')
    T = int(data[0]); p = 1
    ctor_types = ${JSON.stringify(sig.ctor.map((p) => p.type))}
    methods = ${JSON.stringify(methods)}
    for _ in range(T):
        ops = json.loads(data[p]); argl = json.loads(data[p + 1]); p += 2
        _sw_emit('BEGIN')
        try:
            outs = []; obj = None
            for op, a in zip(ops, argl):
                if op == ${JSON.stringify(sig.className)}:
                    obj = ${sig.className}(*[_sw_in(t, x) for t, x in zip(ctor_types, a)]); outs.append(None)
                else:
                    pt, rt = methods[op]
                    r = getattr(obj, op)(*[_sw_in(t, x) for t, x in zip(pt, a)])
                    outs.append(None if rt == 'void' else _sw_out(rt, r))
            _sw_emit('RESULT', json.dumps(outs))
        except Exception as e:
            _sw_emit('ERROR', type(e).__name__ + ': ' + str(e))
_sw_main()
`;
  } else {
    const types = sig.params.map((p) => p.type);
    const result =
      sig.prefix !== undefined
        ? `list(args[${sig.prefix}][:r])`
        : sig.returns === 'void' && sig.inplace !== undefined
        ? `_sw_out(${JSON.stringify(types[sig.inplace])}, args[${sig.inplace}])`
        : `_sw_out(${JSON.stringify(sig.returns)}, r)`;
    main = `
def _sw_main():
    data = sys.stdin.read().split('\\n')
    T = int(data[0]); p = 1
    types = ${JSON.stringify(types)}
    for _ in range(T):
        _sw_reset()
        args = []
        for t in types:
            args.append(_sw_in(t, json.loads(data[p]))); p += 1
        _sw_emit('BEGIN')
        try:
${sig.cycle ? `            _sw_cyc(args[${sig.cycle.list}], args[${sig.cycle.pos}])
` : ''}            r = Solution().${sig.name}(*[args[i] for i in ${JSON.stringify(sig.params.map((x, i) => (x.hidden ? -1 : i)).filter((i) => i >= 0))}])
            _sw_emit('RESULT', json.dumps(${result}))
        except RecursionError:
            _sw_emit('ERROR', 'RecursionError: maximum recursion depth exceeded')
        except Exception as e:
            _sw_emit('ERROR', type(e).__name__ + ': ' + str(e))
_sw_main()
`;
  }
  const kind = nodeKindOf(sig);
  return PRELUDE + '\n' + user + '\n' + (kind ? PY_NODE[kind] : '') + RUNTIME + PY_NODE_RUNTIME + main;
}

/** Number of lines added before user code, so error line numbers can be mapped back. */
export const PY_PRELUDE_LINES = PRELUDE.split('\n').length;
