import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, Lightbulb, ListChecks, Target, Timer } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Button, Tabs } from '../../components/ui';
import { PROBLEMS, generateCases, levelById } from '../../content/infosys';
import type { InfosysProblem } from '../../content/infosys/types';
import { LessonLinks, LevelTag, PatternCard, ProblemStatement, topicTitle } from './Statement';
import { TestHistory, useGenerate } from './InfosysHome';

type Tab = 'topics' | 'patterns' | 'samples' | 'problems' | 'tests';

export function practiceStatus(kv: Record<string, Record<string, unknown>>, id: string) {
  return kv['infosys-practice']?.[id] as { passed: number; total: number; at: number } | undefined;
}

export function LevelPage() {
  const { level = '' } = useParams();
  const info = levelById(level);
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'topics';
  const tests = useStore((s) => s.codingTests);
  const kv = useStore((s) => s.kv);
  const generate = useGenerate();
  const navigate = useNavigate();
  if (!info) return <Navigate to="/infosys" replace />;
  const probs = PROBLEMS[info.id];
  const samples = probs.filter((p) => p.sample);
  const solved = probs.filter((p) => practiceStatus(kv, p.id)?.passed === 14).length;

  return (
    <div className="page page-enter">
      <button className="link-btn" style={{ fontSize: 13, marginBottom: 12 }} onClick={() => navigate('/infosys')}>
        <ArrowLeft size={14} /> Infosys Coding
      </button>
      <div className="inf-level-head">
        <div className="grow">
          <LevelTag level={info.id} />
          <h1 style={{ marginTop: 6 }}>{info.title} level</h1>
          <p className="muted">{info.tagline}</p>
          <p className="xs muted">
            {probs.length} problems · {solved} solved in practice · {info.minutes}-minute tests of 4 questions
          </p>
        </div>
        <Button variant="primary" size="lg" icon={<Timer />} onClick={() => generate(info.id)}>
          Generate a test
        </Button>
      </div>

      <Tabs<Tab>
        value={tab}
        onChange={(t) => setParams({ tab: t }, { replace: true })}
        tabs={[
          { value: 'topics', label: 'Topics to learn', icon: <BookOpen size={14} /> },
          { value: 'patterns', label: 'Patterns', icon: <Lightbulb size={14} /> },
          { value: 'samples', label: 'Sample questions', icon: <Target size={14} /> },
          { value: 'problems', label: 'All problems', icon: <ListChecks size={14} /> },
          { value: 'tests', label: 'Your tests', icon: <Timer size={14} /> },
        ]}
      />

      <div style={{ marginTop: 20 }}>
        {tab === 'topics' && (
          <>
            <section className="inf-card">
              <h2 className="prep-h2">What questions at this level look like</h2>
              <ul className="acct-list small">
                {info.expect.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p className="small" style={{ marginTop: 10 }}>
                <strong>Scale:</strong> {info.scale}
              </p>
            </section>
            <h2 className="prep-h2" style={{ marginTop: 24 }}>
              Topics you need for {info.title.toLowerCase()} questions
            </h2>
            <div className="inf-topics">
              {info.topics.map((t, i) => {
                const used = probs.filter((p) => p.topics.includes(t.id));
                return (
                  <div key={t.id} className="inf-topic-card">
                    <div className="row" style={{ gap: 8, alignItems: 'baseline' }}>
                      <span className="prep-letter">{i + 1}</span>
                      <h3 className="grow">{t.title}</h3>
                    </div>
                    <p className="small muted">{t.why}</p>
                    <ul className="acct-list small">
                      {t.skills.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <div className="inf-topic-foot">
                      <LessonLinks ids={t.lessons} />
                      {used.length > 0 && (
                        <span className="xs muted">
                          Used in:{' '}
                          {used.map((p, k) => (
                            <span key={p.id}>
                              {k > 0 && ', '}
                              <Link className="prose-link" to={`/infosys/problem/${p.id}`}>{p.title}</Link>
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <section className="inf-card" style={{ marginTop: 24 }}>
              <h2 className="prep-h2">Strategy for the test</h2>
              <ul className="acct-list small">
                {info.strategy.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {tab === 'patterns' && (
          <>
            <p className="small muted" style={{ marginBottom: 14 }}>
              Every problem at this level is built on one of these patterns. Learn to recognise the signal in the statement, then apply the approach.
            </p>
            <div className="inf-pattern-list">
              {probs.map((p) => (
                <div key={p.id} className="inf-pattern-row">
                  <div className="row" style={{ justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <strong>{p.pattern.name}</strong>
                    <Link to={`/infosys/problem/${p.id}`} className="xs prose-link">
                      {p.title} <ArrowRight size={11} style={{ verticalAlign: -1 }} />
                    </Link>
                  </div>
                  <p className="small muted" style={{ margin: '4px 0 6px' }}>
                    <strong>Signal:</strong> {p.pattern.recognize}
                  </p>
                  <ol className="inf-steps small">
                    {p.pattern.approach.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <div className="inf-cx">
                    <span>
                      Time <code>{p.pattern.time}</code>
                    </span>
                    <span>
                      Space <code>{p.pattern.space}</code>
                    </span>
                    <span className="xs muted">{p.topics.map((t) => topicTitle(p.level, t)).join(' · ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'samples' && (
          <div className="col" style={{ gap: 20 }}>
            <p className="small muted">Worked Infosys-style questions with their pattern explained. Solve them in the editor, then compare with the reference approach.</p>
            {samples.map((p) => (
              <SampleCard key={p.id} p={p} status={practiceStatus(kv, p.id)} />
            ))}
          </div>
        )}

        {tab === 'problems' && (
          <div className="problem-rows">
            {probs.map((p) => {
              const st = practiceStatus(kv, p.id);
              return (
                <Link key={p.id} to={`/infosys/problem/${p.id}`} className="problem-row">
                  {st?.passed === 14 ? <CircleCheck size={15} className="ok" /> : <span className="todo-dot" />}
                  <span className="grow truncate">{p.title}</span>
                  <span className="xs muted hide-mobile">{p.pattern.name}</span>
                  {st && st.passed < 14 && <span className="xs muted tabular">{st.passed}/14</span>}
                  {p.sample && <span className="inf-topic">sample</span>}
                </Link>
              );
            })}
          </div>
        )}

        {tab === 'tests' && (
          <>
            <div className="test-row highlight" style={{ marginBottom: 16 }}>
              <div className="grow col" style={{ gap: 2 }}>
                <span style={{ fontWeight: 600 }}>{info.title} test: 4 questions · {info.minutes} minutes</span>
                <span className="xs muted">Random questions from this level with fresh test data: 2 public + 12 hidden cases each.</span>
              </div>
              <Button variant="primary" icon={<Timer />} onClick={() => generate(info.id)}>
                Generate
              </Button>
            </div>
            <TestHistory tests={tests.filter((t) => t.level === info.id)} empty="No tests at this level yet." />
          </>
        )}
      </div>
    </div>
  );
}

function SampleCard({ p, status }: { p: InfosysProblem; status?: { passed: number; total: number } }) {
  const navigate = useNavigate();
  const cases = useMemo(() => generateCases(p, 1), [p]);
  return (
    <div className="inf-card">
      <ProblemStatement p={p} cases={cases} showLevel={false} />
      <div style={{ marginTop: 14 }}>
        <PatternCard p={p} collapsible />
      </div>
      <div className="row" style={{ gap: 8, marginTop: 14 }}>
        <Button variant="primary" icon={<Target />} onClick={() => navigate(`/infosys/problem/${p.id}`)}>
          {status ? 'Continue solving' : 'Solve in the editor'}
        </Button>
        {status && <span className="xs muted">Best practice result: {status.passed}/14 cases</span>}
      </div>
    </div>
  );
}
