import type { HeapObj, TStep, TVal } from '../../lib/types';
import { TreeViz } from '../learn/Diagram';
import { fmtLang, pointersFor } from './explain';

const NEXT = ['next', 'nxt'];
const VALUE_FIELDS = ['val', 'value', 'data', 'key', 'item'];

function nodeValue(o: HeapObj, heap: Record<string, HeapObj>, lang: string) {
  const f = o.fields?.find(([n]) => VALUE_FIELDS.includes(n)) || o.fields?.find(([, v]) => v.t !== 'ref' && v.t !== 'none');
  return f ? fmtLang(f[1], heap, lang) : o.type;
}
const field = (o: HeapObj, names: string[]) => o.fields?.find(([n]) => names.includes(n))?.[1];

function Prim({ v, heap, lang, onHover, changed }: { v: TVal; heap: Record<string, HeapObj>; lang: string; onHover?: (id: string | null) => void; changed?: boolean }) {
  if (v.t === 'ref') {
    const o = heap[v.v];
    return (
      <span className="ref-chip" onMouseEnter={() => onHover?.(v.v)} onMouseLeave={() => onHover?.(null)}>
        {o ? `${o.type}${o.items ? `[${o.items.length + (o.more || 0)}]` : o.entries ? `{${o.entries.length}}` : ''}` : 'ref'}
        <span aria-hidden>↗</span>
      </span>
    );
  }
  return <span className={`val val-${v.t}${changed ? ' changed' : ''}`}>{fmtLang(v, heap, lang)}</span>;
}

export function FramesView({ step, prev, lang, hover, onHover }: { step: TStep; prev?: TStep; lang: string; hover: string | null; onHover: (id: string | null) => void }) {
  return (
    <div className="frames">
      {[...step.stack].reverse().map((f, i) => {
        const pf = prev?.stack.find((x) => x.id === f.id && x.name === f.name);
        const pm = new Map(pf?.vars || []);
        return (
          <div key={`${f.id}-${f.name}`} className={`frame${i === 0 ? ' active' : ''}`}>
            <div className="frame-head">
              <span className="frame-name">{f.name}</span>
              <span className="xs muted">line {f.line}</span>
            </div>
            {f.vars.length === 0 ? (
              <div className="xs muted" style={{ padding: '6px 10px' }}>
                no variables yet
              </div>
            ) : (
              <div className="vars">
                {f.vars.map(([n, v]) => {
                  const before = pm.get(n);
                  const changed = !before || (v.t !== 'ref' && JSON.stringify(before) !== JSON.stringify(v));
                  return (
                    <div key={n} className={`var-row${v.t === 'ref' && v.v === hover ? ' hover' : ''}`}>
                      <span className="var-name">{n}</span>
                      <Prim v={v} heap={step.heap} lang={lang} onHover={onHover} changed={changed && i === 0} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {step.returned && (
        <div className="frame returned">
          <div className="frame-head">
            <span className="frame-name">return value</span>
          </div>
          <div className="vars">
            <div className="var-row">
              <span className="var-name">{step.func}</span>
              <Prim v={step.returned} heap={step.heap} lang={lang} onHover={onHover} changed />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeqView({ id, o, step, lang, prev, onHover }: { id: string; o: HeapObj; step: TStep; lang: string; prev?: TStep; onHover: (id: string | null) => void }) {
  const ptrs = pointersFor(step, id);
  const before = prev?.heap[id]?.items;
  const items = o.items || [];
  const vertical = o.kind === 'stack';
  return (
    <div className={`seq${vertical ? ' vertical' : ''}`}>
      {(vertical ? [...items].map((v, i) => ({ v, i })).reverse() : items.map((v, i) => ({ v, i }))).map(({ v, i }) => {
        const changed = before && JSON.stringify(before[i]) !== JSON.stringify(v);
        return (
          <div key={i} className={`seq-cell-wrap${ptrs[i] ? ' pointed' : ''}`}>
            <div className={`seq-cell${changed ? ' changed' : ''}`}>{v.t === 'ref' ? <Prim v={v} heap={step.heap} lang={lang} onHover={onHover} /> : fmtLang(v, step.heap, lang)}</div>
            {!vertical && <div className="seq-idx">{i}</div>}
            {ptrs[i] && <div className="seq-ptr">{ptrs[i].join(', ')}</div>}
          </div>
        );
      })}
      {!vertical && ptrs[items.length] && (
        <div className="seq-cell-wrap pointed">
          <div className="seq-cell ghost" />
          <div className="seq-idx">{items.length}</div>
          <div className="seq-ptr">{ptrs[items.length].join(', ')}</div>
        </div>
      )}
      {o.more ? <span className="xs muted" style={{ alignSelf: 'center' }}>+{o.more} more</span> : null}
      {items.length === 0 && !ptrs[0] && <span className="xs muted">empty</span>}
    </div>
  );
}

function ObjectCard({ id, o, step, lang, onHover }: { id: string; o: HeapObj; step: TStep; lang: string; onHover: (id: string | null) => void }) {
  if (o.entries)
    return (
      <table className="dict-table">
        <tbody>
          {o.entries.map(([k, v], i) => (
            <tr key={i}>
              <td>
                <Prim v={k} heap={step.heap} lang={lang} onHover={onHover} />
              </td>
              <td>
                <Prim v={v} heap={step.heap} lang={lang} onHover={onHover} />
              </td>
            </tr>
          ))}
          {o.entries.length === 0 && (
            <tr>
              <td className="xs muted">empty</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  if (o.kind === 'set')
    return (
      <div className="set-view">
        {(o.items || []).map((v, i) => (
          <span key={i} className="set-item">
            {fmtLang(v, step.heap, lang)}
          </span>
        ))}
        {!o.items?.length && <span className="xs muted">empty</span>}
      </div>
    );
  return (
    <div className="vars">
      {(o.fields || []).map(([n, v]) => (
        <div key={n} className="var-row">
          <span className="var-name">{n}</span>
          <Prim v={v} heap={step.heap} lang={lang} onHover={onHover} />
        </div>
      ))}
    </div>
  );
}

/** Draw objects reachable from the stack: linked lists as chains, trees as trees, sequences as cells. */
export function HeapView({ step, prev, lang, hover, onHover }: { step: TStep; prev?: TStep; lang: string; hover: string | null; onHover: (id: string | null) => void }) {
  const heap = step.heap;
  const ids = Object.keys(heap);
  if (!ids.length) return <div className="xs muted" style={{ padding: 8 }}>No objects yet. Lists, dictionaries and class instances will appear here.</div>;

  const isList = (o: HeapObj) => o.kind === 'object' && o.fields?.some(([n]) => NEXT.includes(n)) && !o.fields?.some(([n]) => n === 'left');
  const isTree = (o: HeapObj) => o.kind === 'object' && o.fields?.some(([n]) => n === 'left') && o.fields?.some(([n]) => n === 'right');

  const referenced = new Set<string>();
  for (const id of ids) {
    const o = heap[id];
    for (const f of [...(o.fields || []).map(([, v]) => v), ...(o.items || [])]) if (f.t === 'ref') referenced.add(f.v);
  }
  // Which ids do frame variables point at (for highlighting current node)
  const frameRefs = new Map<string, string[]>();
  for (const f of step.stack) for (const [n, v] of f.vars) if (v.t === 'ref') frameRefs.set(v.v, [...(frameRefs.get(v.v) || []), n]);

  const shown = new Set<string>();
  const blocks: JSX.Element[] = [];

  // Linked lists
  for (const id of ids) {
    const o = heap[id];
    if (!isList(o) || shown.has(id)) continue;
    const pointedByNode = ids.some((x) => isList(heap[x]) && (heap[x].fields || []).some(([n, v]) => NEXT.includes(n) && v.t === 'ref' && v.v === id));
    if (pointedByNode) continue;
    const chain: string[] = [];
    let cur: string | undefined = id;
    while (cur && heap[cur] && !chain.includes(cur) && chain.length < 40) {
      chain.push(cur);
      const nx = field(heap[cur], NEXT);
      cur = nx?.t === 'ref' ? nx.v : undefined;
    }
    const cyc = cur && chain.includes(cur);
    chain.forEach((c) => shown.add(c));
    blocks.push(
      <div key={`ll-${id}`} className="heap-block">
        <div className="heap-label">Linked list</div>
        <div className="viz-list">
          {chain.map((c) => (
            <span key={c} className="row" style={{ gap: 0 }}>
              <span className={`viz-node${hover === c || frameRefs.has(c) ? ' hl' : ''}`} title={frameRefs.get(c)?.join(', ')}>
                <span>{nodeValue(heap[c], heap, lang)}</span>
                <span className="viz-next" />
              </span>
              <span className="viz-arrow" />
              {frameRefs.has(c) && <span className="node-ptr">{frameRefs.get(c)!.join(', ')}</span>}
            </span>
          ))}
          <span className="viz-null">{cyc ? '↺ cycle' : lang === 'java' ? 'null' : 'None'}</span>
        </div>
      </div>
    );
  }

  // Trees
  for (const id of ids) {
    const o = heap[id];
    if (!isTree(o) || shown.has(id)) continue;
    const isChild = ids.some((x) => isTree(heap[x]) && (heap[x].fields || []).some(([n, v]) => (n === 'left' || n === 'right') && v.t === 'ref' && v.v === id));
    if (isChild) continue;
    const values: (string | null)[] = [];
    const hl: number[] = [];
    const q: (string | null)[] = [id];
    while (q.length && values.length < 63) {
      const c = q.shift()!;
      if (c === null || !heap[c]) {
        values.push(null);
        continue;
      }
      shown.add(c);
      if (frameRefs.has(c) || hover === c) hl.push(values.length);
      values.push(nodeValue(heap[c], heap, lang));
      const l = field(heap[c], ['left']);
      const r = field(heap[c], ['right']);
      q.push(l?.t === 'ref' ? l.v : null, r?.t === 'ref' ? r.v : null);
    }
    while (values.length && values[values.length - 1] === null) values.pop();
    blocks.push(
      <div key={`tr-${id}`} className="heap-block">
        <div className="heap-label">Binary tree</div>
        <TreeViz values={values} hl={hl} />
      </div>
    );
  }

  // Everything else, top-level objects first (those referenced from frames)
  const order = [...ids].sort((a, b) => Number(referenced.has(a)) - Number(referenced.has(b)));
  for (const id of order) {
    if (shown.has(id)) continue;
    const o = heap[id];
    shown.add(id);
    const names = frameRefs.get(id);
    blocks.push(
      <div key={id} className={`heap-block${hover === id ? ' hover' : ''}`} onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}>
        <div className="heap-label">
          {o.type}
          {names && <span className="muted"> · {names.join(', ')}</span>}
        </div>
        {o.items && o.kind !== 'set' ? <SeqView id={id} o={o} step={step} lang={lang} prev={prev} onHover={onHover} /> : <ObjectCard id={id} o={o} step={step} lang={lang} onHover={onHover} />}
      </div>
    );
  }
  return <div className="heap">{blocks}</div>;
}
