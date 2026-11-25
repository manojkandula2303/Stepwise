/** Static teaching diagrams declared in lesson files via :::viz. */
import type { ReactNode } from 'react';

function parseOpts(data: string) {
  const [main, ...opts] = data.split('|').map((s) => s.trim());
  const o: Record<string, string> = {};
  for (const p of opts) {
    const k = p.indexOf('=');
    if (k > 0) o[p.slice(0, k).trim()] = p.slice(k + 1).trim();
  }
  return { main, o };
}
const nums = (s?: string) => (s ? s.split(',').map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x)) : []);

function ArrayViz({ data }: { data: string }) {
  const { main, o } = parseOpts(data);
  const items = main.split(',').map((s) => s.trim());
  const hl = nums(o.hl);
  const dim = nums(o.dim);
  const ptrs: Record<number, string[]> = {};
  (o.ptr || '')
    .split(',')
    .filter(Boolean)
    .forEach((p) => {
      const [i, l] = p.split(':');
      (ptrs[Number(i)] ||= []).push(l);
    });
  return (
    <div className="viz-array">
      {items.map((v, i) => (
        <div key={i} className={`viz-cell-wrap${hl.includes(i) ? ' hl' : ''}${dim.includes(i) ? ' dim' : ''}`}>
          <div className="viz-cell">{v}</div>
          <div className="viz-idx">{i}</div>
          {ptrs[i] && <div className="viz-ptr">{ptrs[i].join(' ')}</div>}
        </div>
      ))}
    </div>
  );
}

function ListViz({ data }: { data: string }) {
  const { main, o } = parseOpts(data);
  const items = main ? main.split(',').map((s) => s.trim()) : [];
  const hl = nums(o.hl);
  return (
    <div className="viz-list">
      {o.head !== 'none' && <span className="viz-tag">head</span>}
      {items.map((v, i) => (
        <span key={i} className="row" style={{ gap: 0 }}>
          <span className={`viz-node${hl.includes(i) ? ' hl' : ''}`}>
            <span>{v}</span>
            <span className="viz-next" />
          </span>
          <span className="viz-arrow" />
        </span>
      ))}
      <span className="viz-null">null</span>
    </div>
  );
}

function StackViz({ data, queue }: { data: string; queue?: boolean }) {
  const { main } = parseOpts(data);
  const items = main ? main.split(',').map((s) => s.trim()) : [];
  if (queue)
    return (
      <div className="viz-queue">
        <span className="viz-tag">front</span>
        {items.map((v, i) => (
          <div key={i} className="viz-cell">
            {v}
          </div>
        ))}
        <span className="viz-tag">back</span>
      </div>
    );
  return (
    <div className="viz-stack">
      {[...items].reverse().map((v, i) => (
        <div key={i} className={`viz-cell${i === 0 ? ' hl' : ''}`}>
          {v}
          {i === 0 && <span className="viz-top">← top</span>}
        </div>
      ))}
    </div>
  );
}

export function TreeViz({ values, hl = [] }: { values: (string | null)[]; hl?: number[] }) {
  // Build from level order and lay out by in-order position.
  type N = { v: string; l?: N; r?: N; i: number; x?: number; d?: number };
  if (!values.length || values[0] == null) return <div className="muted small">empty tree</div>;
  const root: N = { v: values[0]!, i: 0 };
  const q: N[] = [root];
  let k = 1;
  while (q.length && k < values.length) {
    const n = q.shift()!;
    if (k < values.length && values[k] != null) q.push((n.l = { v: values[k]!, i: k }));
    k++;
    if (k < values.length && values[k] != null) q.push((n.r = { v: values[k]!, i: k }));
    k++;
  }
  let x = 0;
  let maxD = 0;
  const all: N[] = [];
  const walk = (n: N | undefined, d: number) => {
    if (!n) return;
    walk(n.l, d + 1);
    n.x = x++;
    n.d = d;
    maxD = Math.max(maxD, d);
    all.push(n);
    walk(n.r, d + 1);
  };
  walk(root, 0);
  const gx = 46,
    gy = 58,
    R = 17;
  const W = Math.max(x * gx, 60),
    H = (maxD + 1) * gy;
  const edges: ReactNode[] = [];
  for (const n of all)
    for (const c of [n.l, n.r])
      if (c) edges.push(<line key={`${n.i}-${c.i}`} x1={n.x! * gx + gx / 2} y1={n.d! * gy + R + 4} x2={c.x! * gx + gx / 2} y2={c.d! * gy + R + 4} />);
  return (
    <svg className="viz-tree" viewBox={`0 0 ${W} ${H}`} width={W} style={{ maxWidth: '100%' }} role="img" aria-label="Binary tree diagram">
      <g className="edges">{edges}</g>
      {all.map((n) => (
        <g key={n.i} className={hl.includes(n.i) ? 'hl' : ''} transform={`translate(${n.x! * gx + gx / 2},${n.d! * gy + R + 4})`}>
          <circle r={R} />
          <text dy="0.35em" textAnchor="middle">
            {n.v}
          </text>
        </g>
      ))}
    </svg>
  );
}

function GraphViz({ data }: { data: string }) {
  const { main, o } = parseOpts(data);
  const directed = main.includes('>');
  const edges = main
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((e) => {
      const m = /^(\w+)\s*([->])\s*(\w+)(?::(\S+))?$/.exec(e);
      return m ? { a: m[1], b: m[3], w: m[4] } : null;
    })
    .filter(Boolean) as { a: string; b: string; w?: string }[];
  const nodes = Array.from(new Set(edges.flatMap((e) => [e.a, e.b])));
  const hl = (o.hl || '').split(',').map((s) => s.trim());
  const W = 300,
    H = 220,
    cx = W / 2,
    cy = H / 2,
    rad = 80,
    R = 16;
  const pos = Object.fromEntries(nodes.map((n, i) => [n, { x: cx + rad * Math.cos((2 * Math.PI * i) / nodes.length - Math.PI / 2), y: cy + rad * Math.sin((2 * Math.PI * i) / nodes.length - Math.PI / 2) }]));
  return (
    <svg className="viz-tree viz-graph" viewBox={`0 0 ${W} ${H}`} width={W} style={{ maxWidth: '100%' }} role="img" aria-label="Graph diagram">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="arrowhead" />
        </marker>
      </defs>
      <g className="edges">
        {edges.map((e, i) => {
          const p = pos[e.a],
            q = pos[e.b];
          const dx = q.x - p.x,
            dy = q.y - p.y,
            len = Math.hypot(dx, dy) || 1;
          const x1 = p.x + (dx / len) * R,
            y1 = p.y + (dy / len) * R,
            x2 = q.x - (dx / len) * (R + 2),
            y2 = q.y - (dy / len) * (R + 2);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={directed ? 'url(#arrow)' : undefined} />
              {e.w && (
                <text className="w" x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} textAnchor="middle">
                  {e.w}
                </text>
              )}
            </g>
          );
        })}
      </g>
      {nodes.map((n) => (
        <g key={n} className={hl.includes(n) ? 'hl' : ''} transform={`translate(${pos[n].x},${pos[n].y})`}>
          <circle r={R} />
          <text dy="0.35em" textAnchor="middle">
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MatrixViz({ data }: { data: string }) {
  const { main, o } = parseOpts(data);
  const rows = main.split(';').map((r) => r.split(',').map((s) => s.trim()));
  const hl = new Set((o.hl || '').split(',').map((s) => s.trim()));
  return (
    <div className="viz-matrix" style={{ gridTemplateColumns: `24px repeat(${rows[0].length}, 40px)` }}>
      <span />
      {rows[0].map((_, j) => (
        <span key={j} className="viz-idx">
          {j}
        </span>
      ))}
      {rows.map((r, i) => [
        <span key={`r${i}`} className="viz-idx" style={{ alignSelf: 'center' }}>
          {i}
        </span>,
        ...r.map((v, j) => (
          <div key={`${i}-${j}`} className={`viz-cell${hl.has(`${i}:${j}`) ? ' hl' : ''}`}>
            {v}
          </div>
        )),
      ])}
    </div>
  );
}

function HashViz({ data }: { data: string }) {
  const { main } = parseOpts(data);
  const pairs = main.split(',').map((p) => p.split(':').map((s) => s.trim()));
  return (
    <div className="viz-hash">
      {pairs.map(([k, v], i) => (
        <div key={i} className="viz-hash-row">
          <span className="viz-cell key">{k}</span>
          <span className="viz-arrow" />
          <span className="viz-cell">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function Diagram({ kind, data }: { kind: string; data: string }) {
  const caption = /\|\s*caption=([^|]+)/.exec(data)?.[1]?.trim();
  let body: ReactNode;
  switch (kind) {
    case 'array':
      body = <ArrayViz data={data} />;
      break;
    case 'list':
      body = <ListViz data={data} />;
      break;
    case 'stack':
      body = <StackViz data={data} />;
      break;
    case 'queue':
      body = <StackViz data={data} queue />;
      break;
    case 'tree': {
      const { main, o } = parseOpts(data);
      body = <TreeViz values={main.split(',').map((s) => (s.trim() === 'null' ? null : s.trim()))} hl={nums(o.hl)} />;
      break;
    }
    case 'graph':
      body = <GraphViz data={data} />;
      break;
    case 'matrix':
      body = <MatrixViz data={data} />;
      break;
    case 'hashmap':
      body = <HashViz data={data} />;
      break;
    default:
      body = <pre>{data}</pre>;
  }
  return (
    <figure className="diagram">
      <div className="diagram-body">{body}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
