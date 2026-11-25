import { useEffect, useRef } from 'react';
import { EditorState, Compartment, StateEffect, StateField, RangeSetBuilder } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, Decoration, type DecorationSet } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, indentOnInput, bracketMatching, indentUnit, HighlightStyle } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { tags as t } from '@lezer/highlight';
import type { CodeLang } from '../../lib/types';

/** Same token colours as static code blocks (both read the --syn-* theme tokens). */
const editorHighlightStyle = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.modifier, t.self], color: 'var(--syn-keyword)' },
  { tag: [t.string, t.special(t.string), t.character, t.regexp], color: 'var(--syn-string)' },
  { tag: [t.number, t.bool, t.null, t.atom], color: 'var(--syn-number)' },
  { tag: [t.comment, t.lineComment, t.blockComment, t.docComment], color: 'var(--syn-comment)', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.function(t.definition(t.variableName))], color: 'var(--syn-function)' },
  { tag: [t.typeName, t.className, t.definition(t.className), t.namespace, t.standard(t.typeName)], color: 'var(--syn-type)' },
  { tag: [t.operator, t.punctuation, t.bracket], color: 'var(--syn-operator)' },
  { tag: [t.meta, t.annotation, t.processingInstruction], color: 'var(--syn-type)' },
]);

// ---------------- Editor ----------------
const langExt = (l: CodeLang) => (l === 'python' ? python() : l === 'java' ? java() : cpp());

const setLineEffect = StateEffect.define<number | null>();
const execLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const e of tr.effects)
      if (e.is(setLineEffect)) {
        if (e.value == null || e.value < 1 || e.value > tr.state.doc.lines) return Decoration.none;
        const line = tr.state.doc.line(e.value);
        const b = new RangeSetBuilder<Decoration>();
        b.add(line.from, line.from, Decoration.line({ class: 'cm-exec-line' }));
        return b.finish();
      }
    return deco.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

const baseTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13.5px', backgroundColor: 'var(--code-bg)', color: 'var(--syn-variable)' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.65' },
  '.cm-content': { padding: '12px 0', caretColor: 'var(--text)' },
  '.cm-gutters': { backgroundColor: 'var(--code-bg)', color: 'var(--text-4)', border: 'none', paddingLeft: '6px' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 8px', minWidth: '32px' },
  '.cm-activeLine': { backgroundColor: 'var(--code-line-prev)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--text-2)' },
  '.cm-cursor': { borderLeftColor: 'var(--text)', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'var(--accent-soft) !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-matchingBracket': { backgroundColor: 'var(--surface-active)', outline: '1px solid var(--border-strong)' },
  '.cm-tooltip': { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' },
  '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: 'var(--accent-soft)', color: 'var(--text)' },
  '.cm-exec-line': { backgroundColor: 'var(--code-line)', boxShadow: 'inset 2px 0 0 var(--accent)' },
  '.cm-panels': { backgroundColor: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' },
});

export interface EditorHandle {
  setLine: (n: number | null) => void;
}

export function CodeEditor({
  value,
  onChange,
  lang,
  readOnly,
  onRun,
  execLine,
  minHeight,
}: {
  value: string;
  onChange?: (v: string) => void;
  lang: CodeLang;
  readOnly?: boolean;
  onRun?: () => void;
  execLine?: number | null;
  minHeight?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const langComp = useRef(new Compartment());
  const roComp = useRef(new Compartment());
  const cbs = useRef({ onChange, onRun });
  cbs.current = { onChange, onRun };

  useEffect(() => {
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          highlightSelectionMatches(),
          indentUnit.of('    '),
          EditorState.tabSize.of(4),
          syntaxHighlighting(editorHighlightStyle),
          execLineField,
          baseTheme,
          keymap.of([
            { key: 'Mod-Enter', run: () => (cbs.current.onRun?.(), true) },
            { key: 'Mod-s', run: () => true, preventDefault: true },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...completionKeymap,
            indentWithTab,
          ]),
          langComp.current.of(langExt(lang)),
          roComp.current.of([EditorState.readOnly.of(!!readOnly), EditorView.editable.of(!readOnly)]),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) cbs.current.onChange?.(u.state.doc.toString());
          }),
          EditorView.contentAttributes.of({ 'aria-label': 'Code editor', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
        ],
      }),
    });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    view.current?.dispatch({ effects: langComp.current.reconfigure(langExt(lang)) });
  }, [lang]);

  useEffect(() => {
    view.current?.dispatch({ effects: roComp.current.reconfigure([EditorState.readOnly.of(!!readOnly), EditorView.editable.of(!readOnly)]) });
  }, [readOnly]);

  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.dispatch({ effects: setLineEffect.of(execLine ?? null) });
    if (execLine && execLine <= v.state.doc.lines) {
      const pos = v.state.doc.line(execLine).from;
      v.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'nearest' }) });
    }
  }, [execLine, value]);

  return <div className="editor" ref={host} style={minHeight ? { minHeight } : undefined} />;
}
