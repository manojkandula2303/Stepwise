import type { FnSig, Sig, TypeName } from './types';

const SCALAR: Partial<Record<TypeName, string>> = { int: 'int', long: 'long long', double: 'double', bool: 'bool', string: 'char*', char: 'char' };

function paramDecl(p: { name: string; type: TypeName }) {
  if (SCALAR[p.type]) return `${SCALAR[p.type]} ${p.name}`;
  if (p.type === 'int[]') return `int* ${p.name}, int ${p.name}Size`;
  if (p.type === 'string[]') return `char** ${p.name}, int ${p.name}Size`;
  if (p.type === 'int[][]') return `int** ${p.name}, int ${p.name}Size, int* ${p.name}ColSize`;
  throw new Error('unsupported');
}

function retType(t: TypeName) {
  if (t === 'void') return 'void';
  if (t === 'int[]') return 'int*';
  return SCALAR[t]!;
}

function allParams(sig: FnSig) {
  const ps = sig.params.map(paramDecl);
  if (sig.returns === 'int[]') ps.push('int* returnSize');
  return ps.join(', ');
}

export function cStarter(sig: Sig): string {
  const s = sig as FnSig;
  const note = s.returns === 'int[]' ? '/**\n * Note: The returned array must be malloced; set *returnSize to its length.\n */\n' : '';
  const body = s.returns === 'void' ? '    \n' : s.returns === 'int[]' ? '    *returnSize = 0;\n    return NULL;\n' : s.returns === 'string' ? '    return "";\n' : '    return 0;\n';
  return `${note}${retType(s.returns)} ${s.name}(${allParams(s)}) {\n${body}}\n`;
}

const PRELUDE = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>
#include <limits.h>
#include <ctype.h>
`;

const RUNTIME = String.raw`
typedef struct SwJ { int k; double n; int b; char* s; struct SwJ* a; int len; } SwJ; /* k: 0 null 1 num 2 bool 3 str 4 arr */
static const char* sw_p;
static void sw_ws(void) { while (*sw_p && isspace((unsigned char)*sw_p)) sw_p++; }
static SwJ sw_val(void) {
  SwJ j; memset(&j, 0, sizeof j); sw_ws();
  if (*sw_p == '[') { int cap = 8; sw_p++; j.k = 4; j.a = malloc(sizeof(SwJ) * cap); sw_ws();
    if (*sw_p == ']') { sw_p++; return j; }
    while (1) { if (j.len == cap) { cap *= 2; j.a = realloc(j.a, sizeof(SwJ) * cap); } j.a[j.len++] = sw_val(); sw_ws(); if (*sw_p == ',') { sw_p++; continue; } sw_p++; return j; } }
  if (*sw_p == '"') { int cap = 16, n = 0; sw_p++; j.k = 3; j.s = malloc(cap);
    while (*sw_p != '"') { char c = *sw_p++; if (c == '\\') { char e = *sw_p++; c = e == 'n' ? '\n' : e == 't' ? '\t' : e; } if (n + 2 > cap) { cap *= 2; j.s = realloc(j.s, cap); } j.s[n++] = c; }
    j.s[n] = 0; sw_p++; return j; }
  if (!strncmp(sw_p, "true", 4)) { sw_p += 4; j.k = 2; j.b = 1; return j; }
  if (!strncmp(sw_p, "false", 5)) { sw_p += 5; j.k = 2; return j; }
  if (!strncmp(sw_p, "null", 4)) { sw_p += 4; return j; }
  { char* end; j.k = 1; j.n = strtod(sw_p, &end); sw_p = end; }
  return j;
}
static SwJ sw_parse(const char* s) { sw_p = s; return sw_val(); }
static char* sw_line(void) { static char* buf = NULL; static size_t cap = 0; size_t n = 0; int c;
  if (!buf) { cap = 1 << 16; buf = malloc(cap); }
  while ((c = getchar()) != EOF && c != '\n') { if (n + 2 > cap) { cap *= 2; buf = realloc(buf, cap); } buf[n++] = (char)c; }
  buf[n] = 0; return buf; }
static int* sw_ints(SwJ j) { int* a = malloc(sizeof(int) * (j.len + 1)); for (int i = 0; i < j.len; i++) a[i] = (int) llround(j.a[i].n); return a; }
static char** sw_strs(SwJ j) { char** a = malloc(sizeof(char*) * (j.len + 1)); for (int i = 0; i < j.len; i++) a[i] = j.a[i].s; return a; }
static int** sw_grid(SwJ j, int** cols) { int** g = malloc(sizeof(int*) * (j.len + 1)); *cols = malloc(sizeof(int) * (j.len + 1)); for (int i = 0; i < j.len; i++) { g[i] = sw_ints(j.a[i]); (*cols)[i] = j.a[i].len; } return g; }
static void sw_q(const char* s) { putchar('"'); for (; *s; s++) { if (*s == '"' || *s == '\\') putchar('\\'); if (*s == '\n') { fputs("\\n", stdout); continue; } putchar(*s); } putchar('"'); }
static void sw_arr(const int* a, int n) { putchar('['); for (int i = 0; i < n; i++) { if (i) putchar(','); printf("%d", a[i]); } putchar(']'); }
static void sw_begin(void) { fflush(stdout); printf("\x01" "BEGIN\n"); fflush(stdout); }
static void sw_res(void) { fflush(stdout); printf("\x01" "RESULT "); }
`;

export function cProgram(user: string, sig: Sig): { code: string; userOffset: number } {
  const s = sig as FnSig;
  const decl: string[] = [];
  const args: string[] = [];
  s.params.forEach((p, k) => {
    decl.push(`    SwJ j${k} = sw_parse(sw_line());`);
    switch (p.type) {
      case 'int': decl.push(`    int a${k} = (int) llround(j${k}.n);`); args.push(`a${k}`); break;
      case 'long': decl.push(`    long long a${k} = llround(j${k}.n);`); args.push(`a${k}`); break;
      case 'double': decl.push(`    double a${k} = j${k}.n;`); args.push(`a${k}`); break;
      case 'bool': decl.push(`    bool a${k} = j${k}.b;`); args.push(`a${k}`); break;
      case 'string': decl.push(`    char* a${k} = j${k}.s;`); args.push(`a${k}`); break;
      case 'char': decl.push(`    char a${k} = j${k}.s[0];`); args.push(`a${k}`); break;
      case 'int[]': decl.push(`    int* a${k} = sw_ints(j${k}); int n${k} = j${k}.len;`); args.push(`a${k}`, `n${k}`); break;
      case 'string[]': decl.push(`    char** a${k} = sw_strs(j${k}); int n${k} = j${k}.len;`); args.push(`a${k}`, `n${k}`); break;
      case 'int[][]': decl.push(`    int* c${k}; int** a${k} = sw_grid(j${k}, &c${k}); int n${k} = j${k}.len;`); args.push(`a${k}`, `n${k}`, `c${k}`); break;
    }
  });
  if (s.returns === 'int[]') args.push('&rs');
  const call = `${s.name}(${args.join(', ')})`;
  let out: string;
  if (s.prefix !== undefined) out = `int r = ${call}; if (r < 0) r = 0; if (r > n${s.prefix}) r = n${s.prefix}; sw_res(); sw_arr(a${s.prefix}, r);`;
  else switch (s.returns) {
    case 'int': out = `int r = ${call}; sw_res(); printf("%d", r);`; break;
    case 'long': out = `long long r = ${call}; sw_res(); printf("%lld", r);`; break;
    case 'double': out = `double r = ${call}; sw_res(); printf("%.10g", r);`; break;
    case 'bool': out = `bool r = ${call}; sw_res(); fputs(r ? "true" : "false", stdout);`; break;
    case 'char': out = `char r = ${call}; char b[2] = {r, 0}; sw_res(); sw_q(b);`; break;
    case 'string': out = `char* r = ${call}; sw_res(); if (r) sw_q(r); else fputs("null", stdout);`; break;
    case 'int[]': out = `int rs = 0; int* r = ${call}; sw_res(); sw_arr(r, rs);`; break;
    default: {
      const k = s.inplace;
      if (k === undefined) out = `${call}; sw_res(); fputs("null", stdout);`;
      else if (s.params[k].type === 'int[]') out = `${call}; sw_res(); sw_arr(a${k}, n${k});`;
      else out = `${call}; sw_res(); putchar('['); for (int i = 0; i < n${k}; i++) { if (i) putchar(','); sw_arr(a${k}[i], c${k}[i]); } putchar(']');`;
    }
  }
  const main = `
int main(void) {
  int T = atoi(sw_line());
  for (int t = 0; t < T; t++) {
${decl.join('\n')}
    sw_begin();
    { ${out} }
    putchar('\\n'); fflush(stdout);
  }
  return 0;
}
`;
  return { code: PRELUDE + RUNTIME + '\n' + user + '\n' + main, userOffset: (PRELUDE + RUNTIME).split('\n').length };
}
