import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, ChevronRight, Circle, ClipboardList, Clock, Flame, History, Layers, SlidersHorizontal, Timer } from 'lucide-react';
import { PREP_TOPICS, SPACES, spaceById, spaceTopics, type PrepSpace } from '../../content/prep/curriculum';
import { useStore } from '../../lib/store';
import { Button, EmptyState, ProgressBar, ProgressRing, Tabs } from '../../components/ui';
import type { TestAttempt } from '../../lib/types';
import { ScoreBadge, bestFor } from './Practice';
import { customSpec, formatTime, mockSpec, moduleSpec, pct, sectionSpec, topicSpec, type TestSpec } from './tests';

const testUrl = (spec: TestSpec) => `/prep/test/${encodeURIComponent(spec.id)}`;

function TestRow({ spec, attempts, highlight }: { spec: TestSpec; attempts: TestAttempt[]; highlight?: boolean }) {
  const navigate = useNavigate();
  const best = bestFor(attempts, spec.id);
  return (
    <div className={`test-row${highlight ? ' highlight' : ''}`}>
      <div className="grow col" style={{ gap: 2, minWidth: 0 }}>
        <span className="truncate" style={{ fontWeight: 500 }}>
          {spec.title}
        </span>
        <span className="xs muted">
          {spec.count} questions · {spec.minutes} min{spec.negative ? ` · −${spec.negative} per wrong answer` : ''}
        </span>
      </div>
      <ScoreBadge value={best} />
      <Button size="sm" variant={highlight ? 'primary' : 'secondary'} icon={<Clock />} onClick={() => navigate(testUrl(spec))}>
        {best === null ? 'Start' : 'Retake'}
      </Button>
    </div>
  );
}

export function AttemptList({ attempts }: { attempts: TestAttempt[] }) {
  if (!attempts.length)
    return (
      <EmptyState icon={<History />} title="No tests taken yet">
        Your completed tests, scores and reviews appear here.
      </EmptyState>
    );
  return (
    <div className="problem-rows">
      {attempts.map((a) => (
        <Link key={a.id} to={`/prep/result/${a.id}`} className="problem-row">
          <span className={`score-badge ${pct(a) >= 80 ? 'good' : pct(a) >= 50 ? 'ok' : 'low'}`}>{pct(a)}%</span>
          <span className="grow col" style={{ minWidth: 0 }}>
            <span className="truncate">{a.title}</span>
            <span className="xs muted">
              {a.correct}/{a.total} correct · {formatTime(a.timeTakenSec)} · {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </span>
          <ChevronRight size={15} className="muted" />
        </Link>
      ))}
    </div>
  );
}

function TopicsTab({ space }: { space: PrepSpace }) {
  const completed = useStore((s) => s.completed);
  const attempts = useStore((s) => s.attempts);
  const navigate = useNavigate();
  return (
    <div className="col" style={{ gap: 28 }}>
      {space.sections.map((sec) => {
        const topics = sec.modules.flatMap((m) => m.topics).filter((t) => PREP_TOPICS[t]);
        if (!topics.length) return null;
        const done = topics.filter((t) => completed[t]).length;
        return (
          <section key={sec.id} className="prep-section">
            <div className="prep-section-head">
              <span className="prep-letter">{sec.letter}</span>
              <div className="grow col" style={{ gap: 2 }}>
                <h2>{sec.title}</h2>
                <span className="small muted">{sec.blurb}</span>
              </div>
              <span className="xs muted tabular hide-mobile">
                {done}/{topics.length} topics
              </span>
            </div>
            {sec.modules.map((mod) => {
              const items = mod.topics.filter((t) => PREP_TOPICS[t]);
              if (!items.length) return null;
              return (
                <div key={mod.id} className="prep-module">
                  <div className="prep-module-title">{mod.title}</div>
                  <div className="ptable">
                    {items.map((t) => {
                      const spec = topicSpec(t);
                      const best = spec ? bestFor(attempts, spec.id) : null;
                      return (
                        <div key={t} className="ptable-row">
                          <span className="ptable-status">{completed[t] ? <Check size={15} className="ok" /> : <span className="todo-dot" />}</span>
                          <Link to={`/prep/${space.id}/${t}`} className="ptable-title grow">
                            <span className="truncate">{PREP_TOPICS[t].title}</span>
                          </Link>
                          <span className="xs muted hide-mobile">{PREP_TOPICS[t].questions} Qs</span>
                          <ScoreBadge value={best} />
                          {spec && (
                            <button className="test-chip" onClick={() => navigate(testUrl(spec))} title={`Lesson test: ${spec.count} questions, ${spec.minutes} min`}>
                              <Timer size={13} /> Test
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

function CustomBuilder({ space }: { space: PrepSpace }) {
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(25);
  const [negative, setNegative] = useState(false);
  const toggle = (ids: string[], on: boolean) => {
    const next = new Set(chosen);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    setChosen(next);
  };
  const available = [...chosen].reduce((n, t) => n + (PREP_TOPICS[t]?.questions || 0), 0);
  const spec = chosen.size ? customSpec(space.id, [...chosen], count, minutes, negative ? 0.25 : 0) : null;
  return (
    <div className="custom-builder">
      <div className="custom-topics">
        {space.sections.map((sec) => {
          const ids = sec.modules.flatMap((m) => m.topics).filter((t) => PREP_TOPICS[t]?.questions);
          if (!ids.length) return null;
          const all = ids.every((t) => chosen.has(t));
          return (
            <details key={sec.id} className="custom-section">
              <summary>
                <input type="checkbox" checked={all} onChange={(e) => toggle(ids, e.target.checked)} onClick={(e) => e.stopPropagation()} aria-label={`Select all of ${sec.title}`} />
                <span className="grow">{sec.title}</span>
                <span className="xs muted">{ids.filter((t) => chosen.has(t)).length}/{ids.length}</span>
              </summary>
              <div className="custom-topic-grid">
                {ids.map((t) => (
                  <label key={t} className="custom-topic">
                    <input type="checkbox" checked={chosen.has(t)} onChange={(e) => toggle([t], e.target.checked)} />
                    <span>{PREP_TOPICS[t].title}</span>
                  </label>
                ))}
              </div>
            </details>
          );
        })}
      </div>
      <div className="custom-settings">
        <div className="field">
          <label htmlFor="cq">Questions</label>
          <input id="cq" className="input" type="number" min={5} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))} />
        </div>
        <div className="field">
          <label htmlFor="cm">Minutes</label>
          <input id="cm" className="input" type="number" min={1} max={240} value={minutes} onChange={(e) => setMinutes(Math.max(1, Math.min(240, Number(e.target.value) || 1)))} />
        </div>
        <label className="custom-topic" style={{ alignSelf: 'end', paddingBottom: 8 }}>
          <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} />
          <span>Negative marking (−0.25)</span>
        </label>
        <Button variant="primary" icon={<Clock />} disabled={!spec} onClick={() => spec && navigate(testUrl(spec))}>
          {chosen.size ? `Start (${Math.min(count, available)} questions)` : 'Select topics'}
        </Button>
      </div>
    </div>
  );
}

function TestsTab({ space }: { space: PrepSpace }) {
  const attempts = useStore((s) => s.attempts);
  const mock = mockSpec(space.id);
  const sections = space.sections.map((s) => ({ s, spec: sectionSpec(space.id, s.id) })).filter((x) => x.spec);
  return (
    <div className="col" style={{ gap: 32 }}>
      {mock && (
        <section>
          <h2 className="prep-h2">
            <Flame size={17} /> Full mock test
          </h2>
          <p className="small muted" style={{ marginBottom: 10 }}>
            A full-length timed test drawn from every {space.id === 'aptitude' ? 'scored section (A–E)' : 'subject'}, with negative marking — the closest thing to the real exam.
          </p>
          <TestRow spec={mock} attempts={attempts} highlight />
          {mock.strata && <div className="xs muted" style={{ marginTop: 8 }}>{mock.strata.map((s) => `${s.label}: ${s.count}`).join(' · ')}</div>}
        </section>
      )}
      <section>
        <h2 className="prep-h2">
          <Layers size={17} /> Sectional tests
        </h2>
        <p className="small muted" style={{ marginBottom: 10 }}>Cumulative tests across one whole section.</p>
        <div className="col" style={{ gap: 8 }}>
          {sections.map(({ s, spec }) => (
            <TestRow key={s.id} spec={spec!} attempts={attempts} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="prep-h2">
          <ClipboardList size={17} /> Module tests
        </h2>
        <p className="small muted" style={{ marginBottom: 10 }}>Cumulative tests across the topics of one module.</p>
        {space.sections.map((s) => {
          const specs = s.modules.map((m) => moduleSpec(space.id, m.id)).filter(Boolean) as TestSpec[];
          if (!specs.length) return null;
          return (
            <div key={s.id} style={{ marginBottom: 18 }}>
              <div className="prep-module-title">{s.title}</div>
              <div className="col" style={{ gap: 8 }}>
                {specs.map((spec) => (
                  <TestRow key={spec.id} spec={spec} attempts={attempts} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
      <section>
        <h2 className="prep-h2">
          <SlidersHorizontal size={17} /> Custom test
        </h2>
        <p className="small muted" style={{ marginBottom: 10 }}>Pick any topics, the number of questions and the time limit.</p>
        <CustomBuilder space={space} />
      </section>
      <section>
        <h2 className="prep-h2">
          <Timer size={17} /> Lesson-wise tests
        </h2>
        <p className="small muted">Every topic has its own timed lesson test — start it from the Topics tab or from the topic page.</p>
      </section>
    </div>
  );
}

export function SpacePage() {
  const { space: sid = '' } = useParams();
  const space = spaceById(sid);
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as 'topics' | 'tests' | 'history') || 'topics';
  const completed = useStore((s) => s.completed);
  const attempts = useStore((s) => s.attempts);
  const mine = useMemo(() => attempts.filter((a) => a.space === sid), [attempts, sid]);
  if (!space) return <Navigate to="/prep" replace />;
  const all = spaceTopics(space);
  const done = all.filter((t) => completed[t.topic.id]).length;
  const questions = all.reduce((n, t) => n + t.topic.questions, 0);
  const avg = mine.length ? Math.round(mine.reduce((s, a) => s + pct(a), 0) / mine.length) : null;
  const firstTodo = all.find((t) => !completed[t.topic.id]) || all[0];

  return (
    <div className="page page-enter">
      <nav className="crumbs" style={{ marginBottom: 14 }}>
        <Link to="/prep">Placement Prep</Link>
        <ChevronRight />
        <span>{space.title}</span>
      </nav>
      <div className="page-head">
        <div>
          <h1>{space.title}</h1>
          <p>{space.blurb}</p>
        </div>
        {firstTodo && (
          <Link to={`/prep/${space.id}/${firstTodo.topic.id}`} className="btn btn-primary btn-lg">
            <BookOpen /> {done ? 'Continue' : 'Start learning'} <ArrowRight />
          </Link>
        )}
      </div>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">
            {done}
            <span className="muted" style={{ fontSize: 'var(--text-md)', fontWeight: 400 }}>/{all.length}</span>
          </div>
          <div className="stat-label">Topics completed</div>
        </div>
        <div className="stat">
          <div className="stat-value">{questions}</div>
          <div className="stat-label">Practice questions</div>
        </div>
        <div className="stat">
          <div className="stat-value">{mine.length}</div>
          <div className="stat-label">Tests taken</div>
        </div>
        <div className="stat">
          <div className="stat-value">{avg === null ? '—' : `${avg}%`}</div>
          <div className="stat-label">Average test score</div>
        </div>
      </div>
      <Tabs
        value={tab}
        onChange={(v) => setParams(v === 'topics' ? {} : { tab: v })}
        tabs={[
          { value: 'topics', label: 'Topics', icon: <BookOpen /> },
          { value: 'tests', label: 'Tests', icon: <Timer /> },
          { value: 'history', label: `History${mine.length ? ` (${mine.length})` : ''}`, icon: <History /> },
        ]}
      />
      <div style={{ paddingTop: 24 }} key={tab} className="page-enter">
        {tab === 'topics' && <TopicsTab space={space} />}
        {tab === 'tests' && <TestsTab space={space} />}
        {tab === 'history' && <AttemptList attempts={mine} />}
      </div>
    </div>
  );
}

export function PrepHome() {
  const completed = useStore((s) => s.completed);
  const attempts = useStore((s) => s.attempts);
  const bookmarks = useStore((s) => s.bookmarks).filter((b) => PREP_TOPICS[b]);
  const navigate = useNavigate();
  return (
    <div className="page page-enter">
      <div className="page-head">
        <div>
          <h1>Placement Prep</h1>
          <p>Aptitude, reasoning, verbal and communication skills — and core computer science MCQs — with concepts, practice questions and timed tests.</p>
        </div>
      </div>
      <div className="prep-spaces">
        {SPACES.map((sp) => {
          const all = spaceTopics(sp);
          const done = all.filter((t) => completed[t.topic.id]).length;
          const mine = attempts.filter((a) => a.space === sp.id);
          const mock = mockSpec(sp.id);
          return (
            <div key={sp.id} className="prep-space-card">
              <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
                <ProgressRing value={all.length ? done / all.length : 0} size={52} stroke={4.5} color="var(--accent)">
                  <span className="xs tabular" style={{ fontWeight: 600 }}>
                    {all.length ? Math.round((done / all.length) * 100) : 0}%
                  </span>
                </ProgressRing>
                <div className="grow col" style={{ gap: 4 }}>
                  <h2 style={{ fontSize: 'var(--text-lg)' }}>{sp.title}</h2>
                  <span className="small muted">{sp.blurb}</span>
                </div>
              </div>
              <div className="prep-space-sections">
                {sp.sections.map((s) => (
                  <span key={s.id} className="badge">
                    {s.letter}. {s.title}
                  </span>
                ))}
              </div>
              <div className="xs muted">
                {all.length} topics · {all.reduce((n, t) => n + t.topic.questions, 0)} questions · {mine.length} tests taken
              </div>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button variant="primary" icon={<BookOpen />} onClick={() => navigate(`/prep/${sp.id}`)}>
                  Open
                </Button>
                <Button variant="secondary" icon={<Timer />} onClick={() => navigate(`/prep/${sp.id}?tab=tests`)}>
                  Tests
                </Button>
                {mock && (
                  <Button variant="ghost" icon={<Flame />} onClick={() => navigate(testUrl(mock))}>
                    Full mock
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="dash-grid" style={{ marginTop: 32 }}>
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>Recent tests</h2>
          </div>
          <AttemptList attempts={attempts.slice(0, 8)} />
        </section>
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>Bookmarked topics</h2>
          </div>
          {bookmarks.length ? (
            bookmarks.slice(0, 10).map((b) => {
              const sp = SPACES.find((s) => s.sections.some((sec) => sec.modules.some((m) => m.topics.includes(b))))!;
              return (
                <Link key={b} to={`/prep/${sp.id}/${b}`} className="activity-item">
                  {completed[b] ? <Check size={14} className="tree-done" /> : <Circle size={6} className="tree-dot" />}
                  <span className="grow truncate">{PREP_TOPICS[b].title}</span>
                  <ChevronRight size={14} className="muted" />
                </Link>
              );
            })
          ) : (
            <p className="small muted">Bookmark topics to revisit them quickly.</p>
          )}
        </section>
      </div>
    </div>
  );
}
