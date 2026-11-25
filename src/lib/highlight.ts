import { highlightTree, tagHighlighter, tags as t } from '@lezer/highlight';
import { useEffect, useMemo, useState } from 'react';
import type { LRParser } from '@lezer/lr';
import type { CodeLang } from './types';

/** Token → CSS class map shared by static code blocks and the editor, so both themes stay in sync. */
export const classHighlighter = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.modifier, t.self], class: 'tk-kw' },
  { tag: [t.string, t.special(t.string), t.character, t.regexp], class: 'tk-str' },
  { tag: [t.number, t.bool, t.null, t.atom], class: 'tk-num' },
  { tag: [t.comment, t.lineComment, t.blockComment, t.docComment], class: 'tk-com' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.function(t.definition(t.variableName))], class: 'tk-fn' },
  { tag: [t.typeName, t.className, t.definition(t.className), t.namespace, t.standard(t.typeName)], class: 'tk-type' },
  { tag: [t.operator, t.punctuation, t.bracket, t.separator], class: 'tk-op' },
  { tag: [t.meta, t.annotation, t.processingInstruction], class: 'tk-meta' },
  { tag: [t.propertyName], class: 'tk-prop' },
]);

// Grammars load on demand, so pages without code never download them.
type Grammar = 'python' | 'java' | 'cpp';
const loaders: Record<Grammar, () => Promise<{ parser: LRParser }>> = {
  python: () => import('@lezer/python'),
  java: () => import('@lezer/java'),
  cpp: () => import('@lezer/cpp'),
};
const grammarOf = (l: CodeLang): Grammar => (l === 'c' ? 'cpp' : l);
const parsers: Partial<Record<Grammar, LRParser>> = {};
const pending: Partial<Record<Grammar, Promise<LRParser>>> = {};

export function loadParser(lang: CodeLang): Promise<LRParser> {
  const g = grammarOf(lang);
  if (parsers[g]) return Promise.resolve(parsers[g]!);
  return (pending[g] ||= loaders[g]().then((m) => (parsers[g] = m.parser)));
}

export type Span = { text: string; cls: string };

/** Returns highlighted spans per line. */
export function highlightLines(code: string, lang: CodeLang | 'text'): Span[][] {
  const lines: Span[][] = [[]];
  const push = (text: string, cls: string) => {
    const parts = text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ text: p, cls });
    });
  };
  if (lang === 'text') {
    push(code, '');
    return lines;
  }
  const parser = parsers[grammarOf(lang)];
  if (!parser) {
    push(code, '');
    loadParser(lang);
    return lines;
  }
  const tree = parser.parse(code);
  let pos = 0;
  highlightTree(tree, classHighlighter, (from, to, cls) => {
    if (from > pos) push(code.slice(pos, from), '');
    push(code.slice(from, to), cls);
    pos = to;
  });
  if (pos < code.length) push(code.slice(pos), '');
  return lines;
}

/** Highlighted lines that re-render once the grammar has loaded (plain text until then). */
export function useHighlightedLines(code: string, lang: CodeLang | 'text'): Span[][] {
  const ready = lang === 'text' || !!parsers[grammarOf(lang)];
  const [, setLoaded] = useState(0);
  useEffect(() => {
    if (ready) return;
    let live = true;
    loadParser(lang as CodeLang).then(() => live && setLoaded((n) => n + 1));
    return () => {
      live = false;
    };
  }, [lang, ready]);
  return useMemo(() => highlightLines(code, lang), [code, lang, ready]);
}
