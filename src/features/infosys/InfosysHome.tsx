import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Building2, CircleCheck, Clock, FileCode2, Sparkles, Timer } from 'lucide-react';
import { useStore, actions } from '../../lib/store';
import { Button } from '../../components/ui';
import { LEVELS, PROBLEMS, generateTest } from '../../content/infosys';
import type { CodingLevel, CodingTest } from '../../lib/types';
import { LevelTag } from './Statement';

export function testScore(t: CodingTest) {
  const total = t.problems.length * 100;
  const got = t.problems.reduce((s, p) => s + (p.result ? Math.round((p.result.passed / p.result.total) * 100) : 0), 0);
  return { got, total, pct: total ? Math.round((got / total) * 100) : 0 };
}

export function useGenerate() {
  const navigate = useNavigate();
  return (level: CodingLevel) => {
    const t = generateTest(level);
    actions.saveCodingTest(t);
    navigate(`/infosys/test/${t.id}`);
  };
}

export function TestHistory({ tests, empty }: { tests: CodingTest[]; empty: string }) {
  if (!tests.length) return <p className="small muted">{empty}</p>;
  return (
    <div className="problem-rows">
      {tests.slice(0, 12).map((t) => {
        const s = testScore(t);
        return (
          <Link key={t.id} to={`/infosys/test/${t.id}`} className="problem-row">
            <LevelTag level={t.level} />
            <span className="grow truncate">{new Date(t.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
            <span className="xs muted hide-mobile">{t.problems.length} questions</span>
            {t.status === 'submitted' ? (
              <span className={`score-badge ${s.pct >= 80 ? 'good' : s.pct >= 40 ? 'ok' : 'low'}`}>{s.got}/{s.total}</span>
            ) : (
              <span className="xs" style={{ color: 'var(--accent-text)' }}>{t.status === 'ready' ? 'Not started' : 'In progress'}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function InfosysHome() {
  const tests = useStore((s) => s.codingTests);
  const generate = useGenerate();
  const navigate = useNavigate();

  return (
    <div className="page page-enter">
      <div className="inf-hero">
        <div className="inf-hero-icon">
          <Building2 size={22} />
        </div>
        <div className="grow">
          <h1>Infosys Coding Assessment</h1>
          <p className="muted">
            Prepare for Infosys in-person and online coding rounds (Specialist Programmer, Digital Specialist Engineer, HackWithInfy-style tests). Every level lists the topics you need, explains the pattern behind every problem, and generates fresh timed tests of four Infosys-style questions, each judged on 2 public and 12 hidden test cases.
          </p>
        </div>
      </div>

      <div className="inf-levels">
        {LEVELS.map((l) => {
          const probs = PROBLEMS[l.id];
          const mine = tests.filter((t) => t.level === l.id && t.status === 'submitted');
          const best = mine.length ? Math.max(...mine.map((t) => testScore(t).pct)) : null;
          return (
            <div key={l.id} className={`inf-level-card inf-card-${l.id}`}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <LevelTag level={l.id} />
                {best !== null && <span className={`score-badge ${best >= 80 ? 'good' : best >= 40 ? 'ok' : 'low'}`}>Best {best}%</span>}
              </div>
              <h2>{l.title}</h2>
              <p className="small muted">{l.tagline}</p>
              <div className="inf-level-facts">
                <span>
                  <FileCode2 size={13} /> {probs.length} problems
                </span>
                <span>
                  <Sparkles size={13} /> {l.topics.length} topics
                </span>
                <span>
                  <Clock size={13} /> {l.minutes} min test
                </span>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                <Button variant="secondary" icon={<ArrowRight />} onClick={() => navigate(`/infosys/${l.id}`)}>
                  Topics &amp; samples
                </Button>
                <Button variant="primary" icon={<Timer />} onClick={() => generate(l.id)}>
                  Generate test
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-grid" style={{ marginTop: 28 }}>
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>Your tests</h2>
            <span className="xs muted">{tests.length} generated</span>
          </div>
          <TestHistory tests={tests} empty="No tests yet. Generate one from any level above. Your tests and code are saved to your account." />
        </section>
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>How the tests work</h2>
          </div>
          <ul className="acct-list small">
            <li>Each generated test has <strong>4 questions of the same difficulty</strong>, drawn from that level's problem bank, with freshly generated test data.</li>
            <li>Every question has <strong>2 public cases</strong> (shown as sample input/output) and <strong>12 hidden cases</strong>: edge cases, random cases and maximum-size inputs.</li>
            <li>Read from standard input and print to standard output in Python, Java, C++ or C, exactly as in the real test.</li>
            <li>Each question scores up to 100 points: the share of the 14 cases your best submission passes.</li>
            <li>After you submit the test, the pattern, approach and reference solutions for every question are revealed.</li>
          </ul>
          <p className="xs muted" style={{ marginTop: 10 }}>
            <CircleCheck size={11} style={{ verticalAlign: -1 }} /> Every problem's reference solution is verified in Python and Java against generated test data.
          </p>
        </section>
      </div>
    </div>
  );
}
