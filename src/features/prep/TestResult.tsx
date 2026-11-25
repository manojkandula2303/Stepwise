import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CircleCheck, CircleMinus, CircleX, Clock, RotateCcw, Target, Bookmark } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Button, EmptyState, ProgressBar, ProgressRing, Segmented } from '../../components/ui';
import { PREP_TOPICS, locateTopic } from '../../content/prep/curriculum';
import { DifficultyTag, Markdown, inline } from './Practice';
import { formatTime, pct, questionsByIds, type TestQuestion } from './tests';

type Filter = 'all' | 'wrong' | 'skipped' | 'marked' | 'correct';

export function TestResult() {
  const { attemptId = '' } = useParams();
  const attempt = useStore((s) => s.attempts.find((a) => a.id === attemptId));
  const ready = useStore((s) => s.ready);
  const navigate = useNavigate();
  const [qs, setQs] = useState<Record<string, TestQuestion> | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (attempt) questionsByIds(attempt.answers.map((a) => a.qid)).then(setQs);
  }, [attempt]);

  const byTopic = useMemo(() => {
    if (!attempt) return [];
    const map = new Map<string, { total: number; correct: number; wrong: number; time: number }>();
    for (const a of attempt.answers) {
      const t = a.qid.split('#')[0];
      const r = map.get(t) || { total: 0, correct: 0, wrong: 0, time: 0 };
      r.total++;
      if (a.correct) r.correct++;
      else if (a.chosen !== null) r.wrong++;
      r.time += a.timeSec;
      map.set(t, r);
    }
    return [...map.entries()].map(([t, r]) => ({ t, ...r })).sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [attempt]);

  // Large tests (mocks, sectionals) read better grouped by section.
  const rows = useMemo(() => {
    if (byTopic.length <= 12)
      return byTopic.map((r) => {
        const loc = locateTopic(r.t);
        return { key: r.t, label: PREP_TOPICS[r.t]?.title || r.t, to: loc ? `/prep/${loc.space.id}/${r.t}` : '#', total: r.total, correct: r.correct };
      });
    const map = new Map<string, { label: string; to: string; total: number; correct: number }>();
    for (const r of byTopic) {
      const loc = locateTopic(r.t);
      const key = loc?.section.id || 'other';
      const g = map.get(key) || { label: loc ? `${loc.section.letter}. ${loc.section.title}` : 'Other', to: loc ? `/prep/${loc.space.id}?tab=topics` : '#', total: 0, correct: 0 };
      g.total += r.total;
      g.correct += r.correct;
      map.set(key, g);
    }
    return [...map.entries()].map(([key, g]) => ({ key, ...g })).sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [byTopic]);

  if (!attempt)
    return (
      <div className="page">
        <EmptyState icon={<Target />} title={ready ? 'Result not found' : 'Loading…'} action={<Button variant="secondary" onClick={() => navigate('/prep')}>Placement Prep</Button>}>
          {ready ? 'This attempt may belong to another account or device.' : ''}
        </EmptyState>
      </div>
    );

  const score = pct(attempt);
  const accuracy = attempt.correct + attempt.wrong ? Math.round((attempt.correct / (attempt.correct + attempt.wrong)) * 100) : 0;
  const avgTime = attempt.total ? attempt.timeTakenSec / attempt.total : 0;
  const answers = attempt.answers.map((a, i) => ({ a, i })).filter(({ a }) =>
    filter === 'all' ? true : filter === 'wrong' ? a.chosen !== null && !a.correct : filter === 'skipped' ? a.chosen === null : filter === 'marked' ? a.marked : a.correct
  );
  const weak = byTopic.filter((r) => r.correct / r.total < 0.6).slice(0, 4);

  return (
    <div className="page page-narrow page-enter">
      <button className="link-btn" style={{ fontSize: 13, marginBottom: 16 }} onClick={() => navigate(`/prep/${attempt.space}?tab=tests`)}>
        <ArrowLeft size={14} /> Back to tests
      </button>
      <div className="result-hero">
        <ProgressRing value={score / 100} size={104} stroke={8} color={score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'}>
          <div className="col" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 26, fontWeight: 700 }} className="tabular">{score}%</span>
            <span className="xs muted">score</span>
          </div>
        </ProgressRing>
        <div className="grow col" style={{ gap: 6 }}>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>{attempt.title}</h1>
          <span className="small muted">
            {new Date(attempt.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {attempt.score} / {attempt.maxScore} marks
            {attempt.negative ? ` (−${attempt.negative} per wrong answer)` : ''}
          </span>
          <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <Button variant="primary" icon={<RotateCcw />} onClick={() => navigate(`/prep/test/${encodeURIComponent(attempt.specId)}`)}>
              Retake
            </Button>
            {attempt.kind === 'topic' && attempt.topics[0] && (
              <Button variant="secondary" icon={<BookOpen />} onClick={() => navigate(`/prep/${attempt.space}/${attempt.topics[0]}`)}>
                Review the lesson
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="stats" style={{ marginTop: 24 }}>
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{attempt.correct}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{attempt.wrong}</div>
          <div className="stat-label">Wrong</div>
        </div>
        <div className="stat">
          <div className="stat-value">{attempt.skipped}</div>
          <div className="stat-label">Skipped</div>
        </div>
        <div className="stat">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy (attempted)</div>
        </div>
      </div>
      <p className="small muted">
        <Clock size={13} style={{ verticalAlign: -2 }} /> {formatTime(attempt.timeTakenSec)} used of {formatTime(attempt.durationSec)} · {Math.round(avgTime)} s per question on average
      </p>

      {byTopic.length > 1 && (
        <section style={{ marginTop: 28 }}>
          <h2 className="prep-h2">{byTopic.length > 12 ? 'Section breakdown' : 'Topic breakdown'}</h2>
          <div className="problem-rows">
            {rows.map((r) => {
              const p = Math.round((r.correct / r.total) * 100);
              return (
                <Link key={r.key} to={r.to} className="problem-row">
                  <span className="grow truncate">{r.label}</span>
                  <span className="xs muted tabular hide-mobile">{r.correct}/{r.total}</span>
                  <span style={{ width: 90 }}>
                    <ProgressBar value={r.correct / r.total} tone={p >= 60 ? 'success' : 'accent'} label={`${p}%`} />
                  </span>
                  <span className="xs tabular" style={{ width: 36, textAlign: 'right' }}>{p}%</span>
                </Link>
              );
            })}
          </div>
          {weak.length > 0 && (
            <p className="small muted" style={{ marginTop: 10 }}>
              Focus next on: {weak.map((w, i) => {
                const loc = locateTopic(w.t);
                return (
                  <span key={w.t}>
                    {i > 0 && ', '}
                    <Link className="prose-link" to={loc ? `/prep/${loc.space.id}/${w.t}` : '#'}>{PREP_TOPICS[w.t]?.title}</Link>
                  </span>
                );
              })}
            </p>
          )}
        </section>
      )}

      <section style={{ marginTop: 28 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h2 className="prep-h2" style={{ margin: 0 }}>Answer review</h2>
          <Segmented<Filter>
            size="sm"
            label="Filter answers"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'wrong', label: `Wrong ${attempt.wrong}` },
              { value: 'skipped', label: `Skipped ${attempt.skipped}` },
              { value: 'marked', label: 'Marked' },
              { value: 'correct', label: 'Correct' },
            ]}
          />
        </div>
        {!qs ? (
          <div className="skeleton" style={{ height: 120 }} />
        ) : (
          <div className="pq-list">
            {answers.map(({ a, i }) => {
              const q = qs[a.qid];
              if (!q) return <div key={i} className="pq small muted">Question {i + 1} is no longer available.</div>;
              return (
                <div key={i} className="pq">
                  <div className="pq-head">
                    <span className="pq-num">Q{i + 1}</span>
                    {a.correct ? <span className="badge success"><CircleCheck /> Correct</span> : a.chosen === null ? <span className="badge"><CircleMinus /> Skipped</span> : <span className="badge danger"><CircleX /> Wrong</span>}
                    {a.marked && <span className="badge warning"><Bookmark /> Marked</span>}
                    <DifficultyTag d={q.q.difficulty} />
                    <span className="xs muted">{q.topicTitle} · {a.timeSec}s</span>
                  </div>
                  <Markdown md={q.q.question} className="prose pq-question" />
                  <div className="quiz-options">
                    {q.q.options.map((o, k) => {
                      const state = k === q.q.answer ? 'correct' : k === a.chosen ? 'wrong' : 'dim';
                      return (
                        <div key={k} className={`quiz-option ${state}`}>
                          <span className="quiz-key">{String.fromCharCode(65 + k)}</span>
                          <span className="grow" dangerouslySetInnerHTML={{ __html: inline(o) }} />
                          {k === a.chosen && <span className="xs muted">your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                  {q.q.explanation && (
                    <div className="quiz-explain">
                      <span dangerouslySetInnerHTML={{ __html: inline(q.q.explanation) }} />
                    </div>
                  )}
                </div>
              );
            })}
            {!answers.length && <p className="small muted">Nothing to show for this filter.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
