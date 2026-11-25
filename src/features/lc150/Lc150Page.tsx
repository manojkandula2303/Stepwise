import { LC150 } from '../../content/problems';
import { useStore } from '../../lib/store';
import { ProblemTable } from '../practice/ProblemTable';
import { ProgressRing } from '../../components/ui';

export function Lc150Page() {
  const progress = useStore((s) => s.problems);
  const by = (d: string) => LC150.filter((p) => p.difficulty === d);
  const solved = (arr: typeof LC150) => arr.filter((p) => progress[p.id]?.status === 'solved').length;
  const total = solved(LC150);

  return (
    <div className="page page-enter">
      <div className="page-head">
        <div>
          <h1>LeetCode 150</h1>
          <p>The 150 problems that show up most in technical interviews, grouped by pattern. Work through them in order, or filter to what you need.</p>
        </div>
      </div>

      <div className="lc-summary">
        <ProgressRing value={LC150.length ? total / LC150.length : 0} size={64} stroke={5} color="var(--success)">
          <span className="small tabular" style={{ fontWeight: 600 }}>
            {LC150.length ? Math.round((total / LC150.length) * 100) : 0}%
          </span>
        </ProgressRing>
        <div className="col" style={{ gap: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }} className="tabular">
            {total} <span className="muted" style={{ fontWeight: 400 }}>/ {LC150.length} solved</span>
          </span>
          <span className="xs muted">Overall completion</span>
        </div>
        <div className="lc-split">
          {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
            <div key={d} className="col" style={{ gap: 2 }}>
              <span className={`diff diff-${d.toLowerCase()}`}>{d}</span>
              <span className="small tabular">
                {solved(by(d))}
                <span className="muted">/{by(d).length}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <ProblemTable problems={LC150} base="/lc150" numbered topicFilter groupByTopic />
    </div>
  );
}
