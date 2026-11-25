import { memo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useHighlightedLines } from '../../lib/highlight';
import { actions, useLearnLang } from '../../lib/store';
import { Segmented } from '../ui';
import type { CodeLang, LearnLang } from '../../lib/types';

export type { EditorHandle } from './Editor';
import { toast } from '../../lib/toast';

// ---------------- Python / Java toggle ----------------
export function LangToggle({ size }: { size?: 'sm' }) {
  const lang = useLearnLang();
  return (
    <Segmented<LearnLang>
      label="Code language"
      size={size}
      value={lang}
      onChange={actions.setLearnLang}
      options={[
        { value: 'python', label: <><span className="lang-dot python" />Python</> },
        { value: 'java', label: <><span className="lang-dot java" />Java</> },
      ]}
    />
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="code-copy"
      aria-label="Copy code"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1200);
          },
          () => toast('Copy failed', 'error')
        );
      }}
    >
      {done ? <Check /> : <Copy />}
    </button>
  );
}

// ---------------- Static highlighted block ----------------
export const CodeBlock = memo(function CodeBlock({
  code,
  lang,
  title,
  highlight,
  numbers = true,
  actions: extra,
}: {
  code: string;
  lang: CodeLang | 'text';
  title?: string;
  highlight?: number[];
  numbers?: boolean;
  actions?: React.ReactNode;
}) {
  const lines = useHighlightedLines(code.replace(/\n$/, ''), lang);
  return (
    <div className="code-block">
      {(title || extra) && (
        <div className="code-head">
          <span className="code-title">{title}</span>
          <div className="row" style={{ gap: 4 }}>
            {extra}
            <CopyButton text={code} />
          </div>
        </div>
      )}
      {!title && !extra && <CopyButton text={code} />}
      <pre className={numbers ? 'with-numbers' : ''}>
        <code>
          {lines.map((spans, i) => (
            <span key={i} className={`code-line${highlight?.includes(i + 1) ? ' hl' : ''}`}>
              {numbers && <span className="ln">{i + 1}</span>}
              <span className="lc">
                {spans.length ? spans.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text)) : '​'}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
});

export function OutputBlock({ text, label = 'Output' }: { text: string; label?: string }) {
  return (
    <div className="output-block">
      <div className="output-label">{label}</div>
      <pre>{text.replace(/\n$/, '') || ' '}</pre>
    </div>
  );
}

