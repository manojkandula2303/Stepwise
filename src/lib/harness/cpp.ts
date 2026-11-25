import { isDesign, visible, type Param, type Sig, type TypeName } from './types';
import { CPP_NODE, CPP_NODE_RUNTIME, nodeKindOf, STARTER_DOC } from './nodes';

const CPP: Record<TypeName, string> = {
  int: 'int',
  long: 'long long',
  double: 'double',
  bool: 'bool',
  string: 'string',
  char: 'char',
  'int[]': 'vector<int>',
  'char[]': 'vector<char>',
  'string[]': 'vector<string>',
  'int[][]': 'vector<vector<int>>',
  'char[][]': 'vector<vector<char>>',
  'List<int>': 'vector<int>',
  'List<string>': 'vector<string>',
  'List<double>': 'vector<double>',
  'List<List<int>>': 'vector<vector<int>>',
  'List<List<string>>': 'vector<vector<string>>',
  ListNode: 'ListNode*',
  TreeNode: 'TreeNode*',
  'ListNode[]': 'vector<ListNode*>',
  RandomListNode: 'Node*',
  GraphNode: 'Node*',
  NextTreeNode: 'Node*',
  QuadNode: 'Node*',
  void: 'void',
};

const byRef = (t: TypeName) => CPP[t].startsWith('vector') || t === 'string';
const sigParams = (ps: Param[]) => visible(ps).map((p) => `${CPP[p.type]}${byRef(p.type) ? '&' : ''} ${p.name}`).join(', ');
const usesNode = (s: Sig, n: string) => JSON.stringify(s).includes(`"${n}`);
const ret = (t: TypeName) => (t === 'void' ? '' : t === 'bool' ? '        return false;\n' : ['int', 'long', 'double', 'char'].includes(t) ? '        return 0;\n' : CPP[t].endsWith('*') ? '        return nullptr;\n' : '        return {};\n');

export function cppStarter(sig: Sig): string {
  const head: string[] = [];
  if (usesNode(sig, 'ListNode')) head.push('/**', ' * struct ListNode {', ' *     int val; ListNode *next;', ' *     ListNode(int x) : val(x), next(nullptr) {}', ' * };', ' */');
  if (usesNode(sig, 'TreeNode')) head.push('/**', ' * struct TreeNode {', ' *     int val; TreeNode *left, *right;', ' *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}', ' * };', ' */');
  const kind = nodeKindOf(sig);
  if (kind) head.push(...STARTER_DOC[kind].cpp);
  if (isDesign(sig)) {
    const b = [`class ${sig.className} {`, 'public:', `    ${sig.className}(${sigParams(sig.ctor)}) {`, '        ', '    }'];
    for (const m of sig.methods) b.push('', `    ${CPP[m.returns]} ${m.name}(${sigParams(m.params)}) {`, ret(m.returns) + '    }');
    b.push('};', '');
    return [...head, ...b].join('\n');
  }
  return [...head, 'class Solution {', 'public:', `    ${CPP[sig.returns]} ${sig.name}(${sigParams(sig.params)}) {`, ret(sig.returns) + '    }', '};', ''].join('\n');
}

const PRELUDE = String.raw`#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode *next; ListNode() : val(0), next(nullptr) {} ListNode(int x) : val(x), next(nullptr) {} ListNode(int x, ListNode *n) : val(x), next(n) {} };
struct TreeNode { int val; TreeNode *left, *right; TreeNode() : val(0), left(nullptr), right(nullptr) {} TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {} };
`;

const RUNTIME = String.raw`
namespace sw {
struct J { int k = 0; double n = 0; bool b = false; string s; vector<J> a; }; // k: 0 null, 1 num, 2 bool, 3 str, 4 arr
struct P { const string& s; size_t i = 0; P(const string& x) : s(x) {}
  void ws() { while (i < s.size() && isspace((unsigned char)s[i])) i++; }
  J val() { ws(); J j; char c = s[i];
    if (c == '[') { i++; j.k = 4; ws(); if (s[i] == ']') { i++; return j; } while (true) { j.a.push_back(val()); ws(); if (s[i] == ',') { i++; continue; } i++; return j; } }
    if (c == '"') { i++; j.k = 3; while (s[i] != '"') { char d = s[i++]; if (d == '\\') { char e = s[i++]; if (e == 'n') j.s += '\n'; else if (e == 't') j.s += '\t'; else if (e == 'u') { j.s += (char) stoi(s.substr(i, 4), nullptr, 16); i += 4; } else j.s += e; } else j.s += d; } i++; return j; }
    if (s.compare(i, 4, "true") == 0) { i += 4; j.k = 2; j.b = true; return j; }
    if (s.compare(i, 5, "false") == 0) { i += 5; j.k = 2; return j; }
    if (s.compare(i, 4, "null") == 0) { i += 4; return j; }
    size_t st = i; while (i < s.size() && strchr("+-0123456789.eE", s[i])) i++; j.k = 1; j.n = stod(s.substr(st, i - st)); return j; }
};
J parse(const string& s) { P p(s); return p.val(); }
template <class T> struct C;
template <> struct C<int> { static int f(const J& j) { return (int) llround(j.n); } };
template <> struct C<long long> { static long long f(const J& j) { return llround(j.n); } };
template <> struct C<double> { static double f(const J& j) { return j.n; } };
template <> struct C<bool> { static bool f(const J& j) { return j.b; } };
template <> struct C<string> { static string f(const J& j) { return j.s; } };
template <> struct C<char> { static char f(const J& j) { return j.s.empty() ? 0 : j.s[0]; } };
template <class T> struct C<vector<T>> { static vector<T> f(const J& j) { vector<T> v; for (auto& x : j.a) v.push_back(C<T>::f(x)); return v; } };
template <> struct C<ListNode*> { static ListNode* f(const J& j) { ListNode d; ListNode* c = &d; for (auto& x : j.a) { c->next = new ListNode((int) llround(x.n)); c = c->next; } return d.next; } };
template <> struct C<TreeNode*> { static TreeNode* f(const J& j) {
  if (j.a.empty() || j.a[0].k == 0) return nullptr; TreeNode* root = new TreeNode((int) llround(j.a[0].n)); deque<TreeNode*> q{root}; size_t i = 1;
  while (!q.empty() && i < j.a.size()) { TreeNode* n = q.front(); q.pop_front();
    if (i < j.a.size() && j.a[i].k != 0) { n->left = new TreeNode((int) llround(j.a[i].n)); q.push_back(n->left); } i++;
    if (i < j.a.size() && j.a[i].k != 0) { n->right = new TreeNode((int) llround(j.a[i].n)); q.push_back(n->right); } i++; }
  return root; } };
string q(const string& s) { string r = "\""; for (char c : s) { if (c == '"' || c == '\\') { r += '\\'; r += c; } else if (c == '\n') r += "\\n"; else r += c; } return r + "\""; }
string ser(int v) { return to_string(v); }
string ser(long long v) { return to_string(v); }
string ser(double v) { ostringstream o; o << setprecision(12) << v; return o.str(); }
string ser(bool v) { return v ? "true" : "false"; }
string ser(char v) { return q(string(1, v)); }
string ser(const string& v) { return q(v); }
string ser(ListNode* n) { string r = "["; int c = 0; while (n && c < 10000) { if (c) r += ","; r += to_string(n->val); n = n->next; c++; } return r + "]"; }
string ser(TreeNode* t) { vector<string> r; deque<TreeNode*> q{t}; if (!t) return "[]";
  while (!q.empty()) { TreeNode* n = q.front(); q.pop_front(); if (!n) { r.push_back("null"); continue; } r.push_back(to_string(n->val)); q.push_back(n->left); q.push_back(n->right); }
  while (!r.empty() && r.back() == "null") r.pop_back(); string s = "["; for (size_t i = 0; i < r.size(); i++) { if (i) s += ","; s += r[i]; } return s + "]"; }
template <class T> string ser(const vector<T>& v) { string r = "["; for (size_t i = 0; i < v.size(); i++) { if (i) r += ","; r += ser(v[i]); } return r + "]"; }
string ser(const vector<bool>& v) { string r = "["; for (size_t i = 0; i < v.size(); i++) { if (i) r += ","; r += v[i] ? "true" : "false"; } return r + "]"; }
void emit(const string& tag, const string& p = "") { cout.flush(); cout << '\x01' << tag << (p.empty() ? "" : " " + p) << "\n"; cout.flush(); }
}
`;

export function cppProgram(user: string, sig: Sig): { code: string; userOffset: number } {
  let main: string;
  if (isDesign(sig)) {
    const cases = sig.methods
      .map((m) => {
        const args = m.params.map((p, k) => `sw::C<${CPP[p.type]}>::f(a.a[${k}])`).join(', ');
        return m.returns === 'void'
          ? `      else if (op == "${m.name}") { obj->${m.name}(${args}); outs.push_back("null"); }`
          : `      else if (op == "${m.name}") { outs.push_back(sw::ser(obj->${m.name}(${args}))); }`;
      })
      .join('\n');
    const ctorArgs = sig.ctor.map((p, k) => `sw::C<${CPP[p.type]}>::f(a.a[${k}])`).join(', ');
    main = `
int main() {
  ios::sync_with_stdio(false); string line; getline(cin, line); int T = stoi(line);
  for (int t = 0; t < T; t++) {
    string l1, l2; getline(cin, l1); getline(cin, l2); sw::J ops = sw::parse(l1), argl = sw::parse(l2);
    sw::emit("BEGIN");
    ${sig.className}* obj = nullptr; vector<string> outs;
    for (size_t k = 0; k < ops.a.size(); k++) {
      const string& op = ops.a[k].s; const sw::J& a = argl.a[k];
      if (op == "${sig.className}") { obj = new ${sig.className}(${ctorArgs}); outs.push_back("null"); }
${cases}
    }
    string r = "["; for (size_t i = 0; i < outs.size(); i++) { if (i) r += ","; r += outs[i]; } sw::emit("RESULT", r + "]");
  }
}
`;
  } else {
    const decls = sig.params.map((p, k) => `    string l${k}; getline(cin, l${k}); ${CPP[p.type]} a${k} = sw::C<${CPP[p.type]}>::f(sw::parse(l${k}));`).join('\n');
    const call = `Solution().${sig.name}(${sig.params.map((x, k) => (x.hidden ? '' : `a${k}`)).filter(Boolean).join(', ')})`;
    const cyc = sig.cycle ? `    if (a${sig.cycle.pos} >= 0 && a${sig.cycle.list}) { ListNode *swC = a${sig.cycle.list}, *swG = nullptr; int swI = 0; while (true) { if (swI == a${sig.cycle.pos}) swG = swC; if (!swC->next) break; swC = swC->next; swI++; } swC->next = swG; }
` : '';
    const invoke =
      sig.prefix !== undefined
        ? `int r = ${call}; r = max(0, min(r, (int) a${sig.prefix}.size())); sw::emit("RESULT", sw::ser(vector<int>(a${sig.prefix}.begin(), a${sig.prefix}.begin() + r)));`
        : sig.returns === 'void' ?`${call}; sw::emit("RESULT", ${sig.inplace !== undefined ? `sw::ser(a${sig.inplace})` : '"null"'});` : `auto r = ${call}; sw::emit("RESULT", sw::ser(r));`;
    main = `
int main() {
  ios::sync_with_stdio(false); string line; getline(cin, line); int T = stoi(line);
  for (int t = 0; t < T; t++) {
${decls}
${cyc}    sw::emit("BEGIN");
    try { ${invoke} } catch (exception& e) { sw::emit("ERROR", e.what()); }
  }
}
`;
  }
  const nk = nodeKindOf(sig);
  const prelude = PRELUDE + (nk ? CPP_NODE[nk] : '');
  // Node-kind helpers need sw::J / sw::C, so they go inside the namespace, before emit().
  const runtime = nk ? RUNTIME.replace('void emit(', CPP_NODE_RUNTIME[nk] + 'void emit(') : RUNTIME;
  return { code: prelude + user + '\n' + runtime + main, userOffset: prelude.split('\n').length - 1 };
}
