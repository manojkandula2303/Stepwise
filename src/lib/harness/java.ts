import { isDesign, visible, type Param, type Sig, type TypeName } from './types';
import { isNodeKind, JAVA_NODE, JAVA_NODE_CONV, JAVA_NODE_HELPERS, nodeKindOf, STARTER_DOC } from './nodes';

export const JAVA: Record<TypeName, string> = {
  int: 'int',
  long: 'long',
  double: 'double',
  bool: 'boolean',
  string: 'String',
  char: 'char',
  'int[]': 'int[]',
  'char[]': 'char[]',
  'string[]': 'String[]',
  'int[][]': 'int[][]',
  'char[][]': 'char[][]',
  'List<int>': 'List<Integer>',
  'List<string>': 'List<String>',
  'List<double>': 'List<Double>',
  'List<List<int>>': 'List<List<Integer>>',
  'List<List<string>>': 'List<List<String>>',
  ListNode: 'ListNode',
  TreeNode: 'TreeNode',
  'ListNode[]': 'ListNode[]',
  RandomListNode: 'Node',
  GraphNode: 'Node',
  NextTreeNode: 'Node',
  QuadNode: 'Node',
  void: 'void',
};

const CONV: Record<TypeName, string> = {
  int: 'H.toInt',
  long: 'H.toLong',
  double: 'H.toDouble',
  bool: 'H.toBool',
  string: 'H.toStr',
  char: 'H.toChar',
  'int[]': 'H.toIntArr',
  'char[]': 'H.toCharArr',
  'string[]': 'H.toStrArr',
  'int[][]': 'H.toInt2D',
  'char[][]': 'H.toChar2D',
  'List<int>': 'H.toListInt',
  'List<string>': 'H.toListStr',
  'List<double>': 'H.toListDouble',
  'List<List<int>>': 'H.toListListInt',
  'List<List<string>>': 'H.toListListStr',
  ListNode: 'H.toListNode',
  TreeNode: 'H.toTree',
  'ListNode[]': 'H.toListNodeArr',
  ...JAVA_NODE_CONV,
  void: '',
};

const usesNode = (s: Sig, n: string) => JSON.stringify(s).includes(`"${n}`);
const sigParams = (ps: Param[]) => visible(ps).map((p) => `${JAVA[p.type]} ${p.name}`).join(', ');
const defaultReturn = (t: TypeName) =>
  t === 'void' ? '' : t === 'bool' ? '        return false;\n' : ['int', 'long', 'double', 'char'].includes(t) ? '        return 0;\n' : '        return null;\n';

export function javaStarter(sig: Sig): string {
  const head: string[] = [];
  if (usesNode(sig, 'ListNode'))
    head.push('/**', ' * Definition for singly-linked list.', ' * class ListNode {', ' *     int val; ListNode next;', ' *     ListNode(int val) { this.val = val; }', ' * }', ' */');
  if (usesNode(sig, 'TreeNode'))
    head.push('/**', ' * Definition for a binary tree node.', ' * class TreeNode {', ' *     int val; TreeNode left, right;', ' *     TreeNode(int val) { this.val = val; }', ' * }', ' */');
  const kind = nodeKindOf(sig);
  if (kind) head.push(...STARTER_DOC[kind].java);
  if (isDesign(sig)) {
    const body = [`class ${sig.className} {`, '', `    public ${sig.className}(${sigParams(sig.ctor)}) {`, '        ', '    }'];
    for (const m of sig.methods) body.push('', `    public ${JAVA[m.returns]} ${m.name}(${sigParams(m.params)}) {`, defaultReturn(m.returns) + '    }');
    body.push('}', '');
    return [...head, ...body].join('\n');
  }
  return [...head, 'class Solution {', `    public ${JAVA[sig.returns]} ${sig.name}(${sigParams(sig.params)}) {`, defaultReturn(sig.returns) + '    }', '}', ''].join('\n');
}

const HELPERS = String.raw`
class ListNode { int val; ListNode next; ListNode() {} ListNode(int val) { this.val = val; } ListNode(int val, ListNode next) { this.val = val; this.next = next; } }
class TreeNode { int val; TreeNode left, right; TreeNode() {} TreeNode(int val) { this.val = val; } TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; } }
`;

const H = String.raw`
final class H {
    private final String s; private int i;
    private H(String s) { this.s = s; }
    static Object parse(String s) { H h = new H(s.trim()); return h.val(); }
    private void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }
    private Object val() {
        ws(); char c = s.charAt(i);
        if (c == '[') { i++; List<Object> l = new ArrayList<>(); ws(); if (s.charAt(i) == ']') { i++; return l; }
            while (true) { l.add(val()); ws(); if (s.charAt(i) == ',') { i++; continue; } i++; return l; } }
        if (c == '"') { i++; StringBuilder b = new StringBuilder();
            while (s.charAt(i) != '"') { char d = s.charAt(i++); if (d == '\\') { char e = s.charAt(i++);
                switch (e) { case 'n': b.append('\n'); break; case 't': b.append('\t'); break; case 'r': b.append('\r'); break;
                    case 'u': b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; break; default: b.append(e); } } else b.append(d); }
            i++; return b.toString(); }
        if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
        if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
        if (s.startsWith("null", i)) { i += 4; return null; }
        int st = i; while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
        String n = s.substring(st, i);
        if (n.contains(".") || n.contains("e") || n.contains("E")) return Double.parseDouble(n);
        return Long.parseLong(n);
    }
    @SuppressWarnings("unchecked") static List<Object> L(Object o) { return (List<Object>) o; }
    static int toInt(Object o) { return ((Number) o).intValue(); }
    static long toLong(Object o) { return ((Number) o).longValue(); }
    static double toDouble(Object o) { return ((Number) o).doubleValue(); }
    static boolean toBool(Object o) { return (Boolean) o; }
    static String toStr(Object o) { return (String) o; }
    static char toChar(Object o) { return ((String) o).charAt(0); }
    static int[] toIntArr(Object o) { List<Object> l = L(o); int[] a = new int[l.size()]; for (int k = 0; k < a.length; k++) a[k] = toInt(l.get(k)); return a; }
    static char[] toCharArr(Object o) { List<Object> l = L(o); char[] a = new char[l.size()]; for (int k = 0; k < a.length; k++) a[k] = toChar(l.get(k)); return a; }
    static String[] toStrArr(Object o) { List<Object> l = L(o); String[] a = new String[l.size()]; for (int k = 0; k < a.length; k++) a[k] = (String) l.get(k); return a; }
    static int[][] toInt2D(Object o) { List<Object> l = L(o); int[][] a = new int[l.size()][]; for (int k = 0; k < a.length; k++) a[k] = toIntArr(l.get(k)); return a; }
    static char[][] toChar2D(Object o) { List<Object> l = L(o); char[][] a = new char[l.size()][]; for (int k = 0; k < a.length; k++) a[k] = toCharArr(l.get(k)); return a; }
    static List<Integer> toListInt(Object o) { List<Integer> r = new ArrayList<>(); for (Object x : L(o)) r.add(toInt(x)); return r; }
    static List<Double> toListDouble(Object o) { List<Double> r = new ArrayList<>(); for (Object x : L(o)) r.add(toDouble(x)); return r; }
    static List<String> toListStr(Object o) { List<String> r = new ArrayList<>(); for (Object x : L(o)) r.add((String) x); return r; }
    static List<List<Integer>> toListListInt(Object o) { List<List<Integer>> r = new ArrayList<>(); for (Object x : L(o)) r.add(toListInt(x)); return r; }
    static List<List<String>> toListListStr(Object o) { List<List<String>> r = new ArrayList<>(); for (Object x : L(o)) r.add(toListStr(x)); return r; }
    static ListNode toListNode(Object o) { ListNode d = new ListNode(), c = d; for (Object x : L(o)) { c.next = new ListNode(toInt(x)); c = c.next; } return d.next; }
    static ListNode[] toListNodeArr(Object o) { List<Object> l = L(o); ListNode[] a = new ListNode[l.size()]; for (int k = 0; k < a.length; k++) a[k] = toListNode(l.get(k)); return a; }
    static TreeNode toTree(Object o) {
        List<Object> v = L(o); if (v.isEmpty() || v.get(0) == null) return null;
        TreeNode root = new TreeNode(toInt(v.get(0))); ArrayDeque<TreeNode> q = new ArrayDeque<>(); q.add(root); int k = 1;
        while (!q.isEmpty() && k < v.size()) { TreeNode n = q.poll();
            if (k < v.size() && v.get(k) != null) { n.left = new TreeNode(toInt(v.get(k))); q.add(n.left); } k++;
            if (k < v.size() && v.get(k) != null) { n.right = new TreeNode(toInt(v.get(k))); q.add(n.right); } k++; }
        return root;
    }
    static String q(String s) { StringBuilder b = new StringBuilder("\""); for (char c : s.toCharArray()) { if (c == '"' || c == '\\') b.append('\\').append(c); else if (c == '\n') b.append("\\n"); else if (c < 32) b.append(String.format("\\u%04x", (int) c)); else b.append(c); } return b.append('"').toString(); }
    static String ser(Object o) {
        if (o == null) return "null";
        if (o instanceof String) return q((String) o);
        if (o instanceof Character) return q(String.valueOf(o));
        if (o instanceof Double || o instanceof Float) { double d = ((Number) o).doubleValue(); return Double.isFinite(d) ? String.valueOf(d) : "null"; }
        if (o instanceof Number || o instanceof Boolean) return String.valueOf(o);
        if (o instanceof int[]) { int[] a = (int[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(a[k]); } return b.append(']').toString(); }
        if (o instanceof long[]) { long[] a = (long[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(a[k]); } return b.append(']').toString(); }
        if (o instanceof double[]) { double[] a = (double[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(a[k]); } return b.append(']').toString(); }
        if (o instanceof boolean[]) { boolean[] a = (boolean[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(a[k]); } return b.append(']').toString(); }
        if (o instanceof char[]) { char[] a = (char[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(q(String.valueOf(a[k]))); } return b.append(']').toString(); }
        if (o instanceof Object[]) { Object[] a = (Object[]) o; StringBuilder b = new StringBuilder("["); for (int k = 0; k < a.length; k++) { if (k > 0) b.append(','); b.append(ser(a[k])); } return b.append(']').toString(); }
        if (o instanceof Collection) { StringBuilder b = new StringBuilder("["); boolean f = true; for (Object x : (Collection<?>) o) { if (!f) b.append(','); f = false; b.append(ser(x)); } return b.append(']').toString(); }
        if (o instanceof ListNode) { StringBuilder b = new StringBuilder("["); ListNode c = (ListNode) o; int n = 0; while (c != null && n < 10000) { if (n > 0) b.append(','); b.append(c.val); c = c.next; n++; } return b.append(']').toString(); }
        if (o instanceof TreeNode) {
            List<String> r = new ArrayList<>(); ArrayDeque<Object> qu = new ArrayDeque<>(); List<TreeNode> lv = new ArrayList<>(); lv.add((TreeNode) o);
            LinkedList<TreeNode> queue = new LinkedList<>(); queue.add((TreeNode) o);
            while (!queue.isEmpty()) { TreeNode n = queue.poll(); if (n == null) { r.add("null"); continue; } r.add(String.valueOf(n.val)); queue.add(n.left); queue.add(n.right); }
            while (!r.isEmpty() && r.get(r.size() - 1).equals("null")) r.remove(r.size() - 1);
            return "[" + String.join(",", r) + "]";
        }
        return q(String.valueOf(o));
    }
    static void emit(String tag, String payload) { System.out.flush(); System.out.println("\u0001" + tag + (payload == null ? "" : " " + payload)); System.out.flush(); }
}
`;

/** Returns { code, userOffset } where userOffset is the number of lines before user code. */
export function javaProgram(user: string, sig: Sig): { code: string; userOffset: number } {
  const imports: string[] = [];
  const body = user
    .split('\n')
    .map((l) => {
      if (/^\s*import\s+[\w.*]+\s*;\s*$/.test(l)) {
        imports.push(l.trim());
        return '';
      }
      return l;
    })
    .join('\n')
    .replace(/public\s+(final\s+)?class\s+/g, 'class ');
  const head = ['import java.util.*;', 'import java.util.stream.*;', 'import java.io.*;', ...imports].join('\n') + '\n' + HELPERS + (nodeKindOf(sig) ? JAVA_NODE[nodeKindOf(sig)!] : '');
  let main: string;
  if (isDesign(sig)) {
    const cases = sig.methods
      .map((m) => {
        const args = m.params.map((p, k) => `${CONV[p.type]}(a.get(${k}))`).join(', ');
        return m.returns === 'void'
          ? `                    case "${m.name}": obj.${m.name}(${args}); outs.add("null"); break;`
          : `                    case "${m.name}": outs.add(H.ser(obj.${m.name}(${args}))); break;`;
      })
      .join('\n');
    const ctorArgs = sig.ctor.map((p, k) => `${CONV[p.type]}(a.get(${k}))`).join(', ');
    main = `
public class Main {
    public static void main(String[] argv) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine().trim());
        for (int t = 0; t < T; t++) {
            List<Object> ops = H.L(H.parse(br.readLine())); List<Object> argl = H.L(H.parse(br.readLine()));
            H.emit("BEGIN", null);
            try {
                ${sig.className} obj = null; List<String> outs = new ArrayList<>();
                for (int k = 0; k < ops.size(); k++) {
                    String op = (String) ops.get(k); List<Object> a = H.L(argl.get(k));
                    switch (op) {
                    case "${sig.className}": obj = new ${sig.className}(${ctorArgs}); outs.add("null"); break;
${cases}
                    default: throw new RuntimeException("Unknown operation " + op);
                    }
                }
                H.emit("RESULT", "[" + String.join(",", outs) + "]");
            } catch (Throwable e) { H.emit("ERROR", e.toString()); }
        }
    }
}
`;
  } else {
    const decls = sig.params.map((p, k) => `            ${JAVA[p.type]} a${k} = ${CONV[p.type]}(H.parse(br.readLine()));`).join('\n');
    const call = `new Solution().${sig.name}(${sig.params.map((x, k) => (x.hidden ? '' : `a${k}`)).filter(Boolean).join(', ')})`;
    const cyc = sig.cycle ? `            if (a${sig.cycle.pos} >= 0 && a${sig.cycle.list} != null) { ListNode swC = a${sig.cycle.list}, swG = null; int swI = 0; while (true) { if (swI == a${sig.cycle.pos}) swG = swC; if (swC.next == null) break; swC = swC.next; swI++; } swC.next = swG; }
` : '';
    // A null list/tree must serialise as [] (the same as an empty one), not as null.
    const isNode = (t: TypeName) => t === 'ListNode' || t === 'TreeNode';
    const serVal = (expr: string, t: TypeName) => isNodeKind(t) ? `HN.ser((Node) ${expr})` : (isNode(t) ? `(${expr} == null ? "[]" : H.ser(${expr}))` : `H.ser(${expr})`);
    const invoke =
      sig.prefix !== undefined
        ? `int r = ${call}; H.emit("RESULT", H.ser(Arrays.copyOf(a${sig.prefix}, Math.max(0, Math.min(r, a${sig.prefix}.length)))));`
        : sig.returns === 'void'
        ? `${call}; H.emit("RESULT", ${sig.inplace !== undefined ? serVal(`a${sig.inplace}`, sig.params[sig.inplace].type) : '"null"'});`
        : `Object r = ${call}; H.emit("RESULT", ${serVal('r', sig.returns)});`;
    main = `
public class Main {
    public static void main(String[] argv) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine().trim());
        for (int t = 0; t < T; t++) {
${decls}
${cyc}            H.emit("BEGIN", null);
            try { ${invoke} }
            catch (StackOverflowError e) { H.emit("ERROR", "StackOverflowError: recursion too deep"); }
            catch (Throwable e) { H.emit("ERROR", e.toString()); }
        }
    }
}
`;
  }
  const nk = nodeKindOf(sig);
  return { code: head + body + '\n' + H + (nk ? JAVA_NODE_HELPERS[nk] : '') + main, userOffset: head.split('\n').length - 1 };
}
