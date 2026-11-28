import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Gauge, HardDrive, Info } from 'lucide-react';
import { analyzeComplexity, type ComplexityReport } from '../../lib/complexity';
import type { CodeLang } from '../../lib/types';

/** Debounced analysis so typing stays smooth. */
export function useComplexity(code: string, lang: CodeLang, delay = 350): ComplexityReport | null {
  const [src, setSrc] = useState({ code, lang });
  useEffect(() => {
    const t = setTimeout(() => setSrc({ code, lang }), delay);
    return () => clearTimeout(t);
  }, [code, lang, delay]);
  return useMemo(() => analyzeComplexity(src.code, src.lang), [src]);
}

const CONF: Record<ComplexityReport['confidence'], string> = {
  high: 'High confidence',
  medium: 'Likely',
  low: 'Rough estimate',
};

/**
 * Time and space complexity of the code in the editor, with the reasoning behind each figure.
 * Shown under the output in the compiler and in coding workspaces.
 */
export function ComplexityPanel({ code, lang, compact = false, measuredMs }: { code: string; lang: CodeLang; compact?: boolean; measuredMs?: number }) {
  const r = useComplexity(code, lang);
  const [open, setOpen] = useState(false);
  if (!r) return null;
  return (
    <div className={`cx${compact ? ' cx-compact' : ''}`} aria-label="Complexity analysis">
      <div className="cx-head">
        <div className="cx-metric">
          <Gauge size={15} />
          <span className="cx-label">Time</span>
          <strong className="cx-value">{r.time}</strong>
          <span className="cx-name">{r.timeName}</span>
        </div>
        <div className="cx-metric">
          <HardDrive size={15} />
          <span className="cx-label">Space</span>
          <strong className="cx-value">{r.space}</strong>
          <span className="cx-name">{r.spaceName}</span>
        </div>
        <span className={`cx-conf cx-${r.confidence}`} title="How sure the static analysis is">
          {CONF[r.confidence]}
        </span>
        <button className="cx-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          Why <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : undefined }} />
        </button>
      </div>
      {open && (
        <div className="cx-body">
          <div>
            <div className="cx-sub">Time</div>
            <ul>{r.timeWhy.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
          <div>
            <div className="cx-sub">Space</div>
            <ul>{r.spaceWhy.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
          <p className="cx-note">
            <Info size={12} /> Estimated from the code's structure, in terms of n (the input size){measuredMs !== undefined ? `. Last run took ${measuredMs} ms on your input.` : '.'}{' '}
            {r.notes.join(' ')}
          </p>
        </div>
      )}
    </div>
  );
}
