import type { HeapObj, TStep, TVal, Trace } from '../../lib/types';

export function fmt(v: TVal | undefined, heap: Record<string, HeapObj>, depth = 0): string {
  if (!v) return '';
  switch (v.t) {
    case 'none':
      return 'None';
    case 'bool':
      return String(v.v);
    case 'int':
    case 'float':
      return String(v.v);
    case 'str':
      return JSON.stringify(v.v);
    case 'char':
      return `'${v.v}'`;
    case 'other':
      return String(v.v);
    case 'ref': {
      const o = heap[v.v];
      if (!o) return '…';
      if (depth > 1) return o.type;
      if (o.items) return `[${o.items.slice(0, 8).map((x) => fmt(x, heap, depth + 1)).join(', ')}${o.items.length > 8 || o.more ? ', …' : ''}]`;
      if (o.entries) return `{${o.entries.slice(0, 5).map(([k, x]) => `${fmt(k, heap, depth + 1)}: ${fmt(x, heap, depth + 1)}`).join(', ')}${o.entries.length > 5 ? ', …' : ''}}`;
      return `${o.type} object`;
    }
  }
}

const nullName = (lang: string) => (lang === 'java' ? 'null' : 'None');

export function fmtLang(v: TVal | undefined, heap: Record<string, HeapObj>, lang: string) {
  const s = fmt(v, heap);
  return v?.t === 'none' ? nullName(lang) : v?.t === 'bool' && lang === 'python' ? (v.v ? 'True' : 'False') : s;
}

/** Plain-language description of what changed between two steps. */
export function explain(trace: Trace, i: number, codeLines: string[]): { title: string; details: string[] } {
  const s = trace.steps[i];
  const prev = trace.steps[i - 1];
  const lang = trace.language;
  const src = (n: number) => (codeLines[n - 1] || '').trim();
  const top = s.stack[s.stack.length - 1];

  if (!prev) {
    return {
      title: 'Program starts',
      details: [`Execution begins at line ${s.line}: \`${src(s.line)}\``, lang === 'java' ? 'The JVM calls main() and creates its stack frame.' : 'Python creates the global frame and runs the file from top to bottom.'],
    };
  }

  const details: string[] = [];
  let title = '';

  if (s.event === 'call') {
    const args = top?.vars.filter(([n]) => n !== 'this').map(([n, v]) => `${n} = ${fmtLang(v, s.heap, lang)}`) || [];
    title = `Call ${top?.name}(${args.join(', ')})`;
    details.push(`A new frame for \`${top?.name}\` is pushed onto the call stack (depth ${s.stack.length}).`);
    if (s.stack.filter((f) => f.name === top?.name).length > 1) details.push('This is a recursive call — the same function is now active more than once, each with its own variables.');
  } else if (s.event === 'return') {
    const v = s.returned ? fmtLang(s.returned, s.heap, lang) : null;
    title = v !== null ? `${top?.name} returns ${v}` : `${top?.name} finishes`;
    details.push(`The frame for \`${top?.name}\` will be popped and control goes back to ${s.stack.length > 1 ? `\`${s.stack[s.stack.length - 2].name}\`` : 'the caller'}.`);
  } else if (s.event === 'exception') {
    title = `Exception: ${s.exception}`;
    details.push('The exception propagates up the call stack until something catches it.');
  }

  // Variable changes in frames that exist in both steps.
  if (s.event === 'line' || s.event === 'return') {
    const ran = prev.event === 'line' || prev.event === 'call' ? prev.line : null;
    if (ran && !title) title = `Line ${ran} ran`;
    const prevFrame = prev.stack.find((f) => f.id === top?.id && f.name === top?.name) || prev.stack[prev.stack.length - 1];
    if (top && prevFrame && prevFrame.name === top.name) {
      const pm = new Map(prevFrame.vars);
      for (const [n, v] of top.vars) {
        const before = pm.get(n);
        const now = fmtLang(v, s.heap, lang);
        if (!before) details.push(`\`${n}\` is created with value ${now}.`);
        else {
          const was = fmtLang(before, prev.heap, lang);
          if (was !== now) details.push(v.t === 'ref' ? `\`${n}\` was updated: now ${now}.` : `\`${n}\` changes from ${was} to ${now}.`);
        }
      }
    }
    // Returned from a call into this frame
    if (prev.event === 'return' && prev.returned) details.unshift(`Back in \`${top?.name}\` with the returned value ${fmtLang(prev.returned, prev.heap, lang)}.`);
  }

  const out = s.stdout.slice(prev.stdout.length);
  if (out) details.push(`Printed: ${JSON.stringify(out.replace(/\n$/, ''))}`);

  // Loop detection: jumping back to an earlier line inside the same function.
  if (s.event === 'line' && prev.event === 'line' && s.line < prev.line && prev.stack.length === s.stack.length && /^(for|while)\b/.test(src(s.line))) {
    details.push(`Loop goes back to its header on line ${s.line} to check whether to run another iteration.`);
  }
  if (s.event === 'line' && /^(if|elif|else|while|for)\b/.test(src(prev.line)) && prev.event === 'line' && s.stack.length === prev.stack.length) {
    const cond = src(prev.line);
    if (/^(if|elif)\b/.test(cond)) details.push(s.line === prev.line + 1 ? 'The condition was true, so its block runs.' : 'The condition was false, so its block is skipped.');
  }

  if (!title) title = `Line ${s.line}`;
  if (s.event === 'line') details.push(`Next to run: line ${s.line} — \`${src(s.line)}\``);
  if (!details.length) details.push('No variables changed on this step.');
  return { title, details };
}

/** Find integer variables that look like indices into a given array, to draw pointers under its cells. */
const POINTER_NAMES = /^(i|j|k|l|r|lo|hi|low|high|left|right|mid|start|end|slow|fast|p|q|idx|index|pos|front|rear|top|curr?|first|last|a|b)$/i;
export function pointersFor(step: TStep, arrayId: string): Record<number, string[]> {
  const res: Record<number, string[]> = {};
  const obj = step.heap[arrayId];
  if (!obj?.items) return res;
  const n = obj.items.length;
  for (const f of step.stack) {
    if (!f.vars.some(([, v]) => v.t === 'ref' && v.v === arrayId)) continue;
    for (const [name, v] of f.vars) {
      if (v.t === 'int' && typeof v.v === 'number' && POINTER_NAMES.test(name) && v.v >= 0 && v.v <= n) (res[v.v] ||= []).push(name);
    }
  }
  return res;
}
