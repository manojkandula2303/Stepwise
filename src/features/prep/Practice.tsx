import { memo, useMemo, useState } from 'react';
import { marked } from 'marked';
import { CircleCheck, CircleX, Eye, RotateCcw } from 'lucide-react';
import type { MCQ } from '../../content/parse';
import { Button, Segmented } from '../../components/ui';
import type { TestAttempt } from '../../lib/types';
import { pct } from './tests';

export const Markdown = memo(function Markdown({ md, className = 'prose' }: { md: string; className?: string }) {
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});

export const inline = (s: string) => marked.parseInline(s, { async: false }) as string;

export function DifficultyTag({ d }: { d: MCQ['difficulty'] }) {
  return <span className={`qdiff qdiff-${d}`}>{d}</span>;
}

/** One practice question with instant feedback and an explanation. */
function PracticeQuestion({ q, n }: { q: MCQ; n: number }) {
  const [pick, setPick] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const answered = pick !== null || reveal;
  return (
    <div className="pq">
      <div className="pq-head">
        <span className="pq-num">Q{n}</span>
        <DifficultyTag d={q.difficulty} />
      </div>
      <Markdown md={q.question} className="prose pq-question" />
      <div className="quiz-options">
        {q.options.map((o, i) => {
          const state = !answered ? '' : i === q.answer ? 'correct' : i === pick ? 'wrong' : 'dim';
          return (
            <button key={i} className={`quiz-option ${state}`} disabled={answered} onClick={() => setPick(i)}>
              <span className="quiz-key">{String.fromCharCode(65 + i)}</span>
              <span className="grow" dangerouslySetInnerHTML={{ __html: inline(o) }} />
              {state === 'correct' && <CircleCheck />}
              {state === 'wrong' && <CircleX />}
            </button>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 10, gap: 6 }}>
        {!answered && (
          <Button size="sm" variant="ghost" icon={<Eye />} onClick={() => setReveal(true)}>
            Show answer
          </Button>
        )}
        {answered && (
          <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => { setPick(null); setReveal(false); }}>
            Try again
          </Button>
        )}
      </div>
      {answered && (
        <div className="quiz-explain">
          {pick !== null && <strong>{pick === q.answer ? 'Correct. ' : 'Not quite. '}</strong>}
          <span dangerouslySetInnerHTML={{ __html: inline(q.explanation || '') }} />
        </div>
      )}
    </div>
  );
}

export function PracticeList({ questions }: { questions: MCQ[] }) {
  const [level, setLevel] = useState<'all' | MCQ['difficulty']>('all');
  const [key, setKey] = useState(0);
  const shown = questions.map((q, i) => ({ q, i })).filter((x) => level === 'all' || x.q.difficulty === level);
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <Segmented
          size="sm"
          label="Difficulty"
          value={level}
          onChange={setLevel}
          options={[
            { value: 'all', label: `All (${questions.length})` },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]}
        />
        <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => setKey((k) => k + 1)}>
          Reset answers
        </Button>
      </div>
      <div className="pq-list" key={key}>
        {shown.map(({ q, i }) => (
          <PracticeQuestion key={i} q={q} n={i + 1} />
        ))}
        {!shown.length && <p className="small muted">No {level} questions in this topic.</p>}
      </div>
    </div>
  );
}

/** Best result (percentage) for a test spec across saved attempts. */
export function bestFor(attempts: TestAttempt[], specId: string) {
  const mine = attempts.filter((a) => a.specId === specId);
  return mine.length ? Math.max(...mine.map(pct)) : null;
}

export function ScoreBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  return <span className={`score-badge ${value >= 80 ? 'good' : value >= 50 ? 'ok' : 'low'}`}>{value}%</span>;
}
