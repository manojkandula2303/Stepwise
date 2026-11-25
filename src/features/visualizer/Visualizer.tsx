import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pause, Play, TriangleAlert } from 'lucide-react';
import type { Trace } from '../../lib/types';
import { useHighlightedLines } from '../../lib/highlight';
import { IconButton, Select, Tabs, useIsMobile } from '../../components/ui';
import { explain } from './explain';
import { FramesView, HeapView } from './HeapView';

const SPEEDS = [
  { value: '1600', label: '0.5×' },
  { value: '800', label: '1×' },
  { value: '400', label: '2×' },
  { value: '150', label: '4×' },
];

export function Visualizer({ trace, code }: { trace: Trace; code: string }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('800');
  const [hover, setHover] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'state' | 'output'>('state');
  const mobile = useIsMobile();
  const n = trace.steps.length;
  const step = trace.steps[Math.min(i, n - 1)];
  const prev = i > 0 ? trace.steps[i - 1] : undefined;
  const codeLines = useMemo(() => code.split('\n'), [code]);
  const lines = useHighlightedLines(code.replace(/\n$/, ''), trace.language);
  const ex = useMemo(() => (step ? explain(trace, i, codeLines) : null), [trace, i, codeLines, step]);
  const codeRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [trace]);

  useEffect(() => {
    if (!playing) return;
    if (i >= n - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((x) => Math.min(n - 1, x + 1)), Number(speed));
    return () => clearTimeout(t);
  }, [playing, i, n, speed]);

  useEffect(() => {
    const el = codeRef.current?.querySelector<HTMLElement>('.vline.current');
    if (el && codeRef.current) {
      const c = codeRef.current;
      const top = el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2;
      c.scrollTo({ top: Math.max(0, top), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!rootRef.current || (e.target as HTMLElement).closest('input, textarea, .cm-editor')) return;
      if (e.key === 'ArrowRight') {
        setI((x) => Math.min(n - 1, x + 1));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setI((x) => Math.max(0, x - 1));
        e.preventDefault();
      } else if (e.key === ' ' && document.activeElement?.closest('.viz')) {
        setPlaying((p) => !p);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n]);

  if (!n)
    return (
      <div className="empty">
        <TriangleAlert />
        <strong>Nothing to visualize</strong>
        <div>{trace.error || 'The program produced no steps.'}</div>
      </div>
    );

  const prevLine = prev && prev.event !== 'return' ? prev.line : null;
  const isLast = i === n - 1;

  const output = (
    <div className="viz-panel">
      <div className="viz-panel-title">Output</div>
      <pre className="console-pre viz-output">{step.stdout}</pre>
      {isLast && (trace.error || trace.stderr) && <pre className="console-pre error" style={{ marginTop: 8 }}>{trace.error || trace.stderr}</pre>}
    </div>
  );

  const state = (
    <>
      <div className="viz-panel">
        <div className="viz-panel-title">Call stack & variables</div>
        <FramesView step={step} prev={prev} lang={trace.language} hover={hover} onHover={setHover} />
      </div>
      <div className="viz-panel">
        <div className="viz-panel-title">Objects & data structures</div>
        <HeapView step={step} prev={prev} lang={trace.language} hover={hover} onHover={setHover} />
      </div>
    </>
  );

  return (
    <div className="viz" ref={rootRef} tabIndex={-1}>
      <div className="viz-left">
        <div className="viz-code" ref={codeRef}>
          <pre>
            {lines.map((spans, k) => {
              const ln = k + 1;
              const cls = ln === step.line ? 'current' : ln === prevLine ? 'previous' : '';
              return (
                <div key={k} className={`vline ${cls}`}>
                  <span className="vmark">{cls === 'current' ? '➜' : cls === 'previous' ? '•' : ''}</span>
                  <span className="vln">{ln}</span>
                  <span className="vlc">{spans.length ? spans.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text)) : '​'}</span>
                </div>
              );
            })}
          </pre>
        </div>
        <div className="viz-legend xs muted">
          <span><span className="legend-swatch current" /> next line to run</span>
          <span><span className="legend-swatch previous" /> line just executed</span>
        </div>
        <div className="viz-controls">
          <div className="row" style={{ gap: 2 }}>
            <IconButton label="First step" size="sm" icon={<ChevronFirst />} onClick={() => { setI(0); setPlaying(false); }} disabled={i === 0} />
            <IconButton label="Previous step" size="sm" icon={<ChevronLeft />} onClick={() => { setI((x) => Math.max(0, x - 1)); setPlaying(false); }} disabled={i === 0} />
            <button className="play-btn" aria-label={playing ? 'Pause' : 'Play'} onClick={() => { if (isLast) setI(0); setPlaying((p) => !p); }}>
              {playing ? <Pause /> : <Play />}
            </button>
            <IconButton label="Next step" size="sm" icon={<ChevronRight />} onClick={() => { setI((x) => Math.min(n - 1, x + 1)); setPlaying(false); }} disabled={isLast} />
            <IconButton label="Last step" size="sm" icon={<ChevronLast />} onClick={() => { setI(n - 1); setPlaying(false); }} disabled={isLast} />
          </div>
          <input className="viz-slider grow" type="range" min={0} max={n - 1} value={i} onChange={(e) => { setI(Number(e.target.value)); setPlaying(false); }} aria-label="Step" style={{ ['--pct' as any]: `${n > 1 ? (i / (n - 1)) * 100 : 100}%` }} />
          <span className="xs muted tabular viz-count">
            {i + 1} / {n}
            {trace.truncated ? '+' : ''}
          </span>
          <Select label="Speed" value={speed} onChange={setSpeed} options={SPEEDS} />
        </div>
        {ex && (
          <div className="viz-explain" key={i}>
            <div className="viz-explain-title">
              <span className={`ev ev-${step.event}`}>{step.event === 'line' ? 'step' : step.event}</span>
              {ex.title}
            </div>
            <ul>
              {ex.details.map((d, k) => (
                <li key={k} dangerouslySetInnerHTML={{ __html: d.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/`([^`]+)`/g, '<code>$1</code>') }} />
              ))}
            </ul>
          </div>
        )}
        {trace.truncated && isLast && <div className="xs muted" style={{ marginTop: 8 }}>Trace stopped after {n} steps to keep things responsive.</div>}
      </div>
      <div className="viz-right">
        {mobile ? (
          <>
            <Tabs value={mobileTab} onChange={setMobileTab} tabs={[{ value: 'state', label: 'Variables & objects' }, { value: 'output', label: 'Output' }]} />
            <div style={{ paddingTop: 12 }} className="col">
              {mobileTab === 'state' ? state : output}
            </div>
          </>
        ) : (
          <>
            {state}
            {output}
          </>
        )}
      </div>
    </div>
  );
}
