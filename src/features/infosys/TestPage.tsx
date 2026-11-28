import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CircleCheck, Clock, Flag, Play, RotateCcw, Trophy } from 'lucide-react';
import { actions, useStore } from '../../lib/store';
import { Button, Modal, ProgressRing, Tabs } from '../../components/ui';
import { CodeBlock } from '../../components/code';
import { PROBLEM_BY_ID, generateCases, levelById } from '../../content/infosys';
import type { CodeLang, CodingTest } from '../../lib/types';
import { LANG_LABEL } from '../../lib/types';
import { formatTime } from '../prep/tests';
import { LevelTag, PatternCard, ProblemStatement, Solutions } from './Statement';
import { CodingPanel, SubmissionResult } from './CodingPanel';
import { InfWorkspace } from './Workspace';
import { testScore, useGenerate } from './InfosysHome';
import { STARTER } from './starter';

/** A generated 4-question Infosys-style test: intro → timed solving → results with patterns and solutions. */
export function TestPage() {
  const { id = '' } = useParams();
  const stored = useStore((s) => s.codingTests.find((t) => t.id === id));
  const ready = useStore((s) => s.ready);
  const [test, setTest] = useState<CodingTest | undefined>(stored);
  const navigate = useNavigate();

  // Adopt the stored copy when it first appears (e.g. after loading from the server).
  useEffect(() => {
    if (stored && (!test || test.id !== stored.id)) setTest(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored?.id]);

  // Persist edits (debounced) to the user's account; the outbox keeps only the latest version.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persist = useCallback((t: CodingTest, now = false) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (now) actions.saveCodingTest(t);
    else saveTimer.current = setTimeout(() => actions.saveCodingTest(t), 1000);
  }, []);
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);
  const update = useCallback(
    (fn: (t: CodingTest) => CodingTest, now = false) =>
      setTest((cur) => {
        if (!cur) return cur;
        const next = fn(cur);
        persist(next, now);
        return next;
      }),
    [persist]
  );

  if (!test) {
    if (!ready) return <div className="running" style={{ height: '100%', justifyContent: 'center' }}><span className="spinner" /></div>;
    return <Navigate to="/infosys" replace />;
  }
  if (test.status === 'ready') return <Intro test={test} onStart={() => update((t) => ({ ...t, status: 'in-progress', startedAt: Date.now() }), true)} onBack={() => navigate(-1)} />;
  if (test.status === 'in-progress') return <Running test={test} update={update} />;
  return <Results test={test} />;
}

function Intro({ test, onStart, onBack }: { test: CodingTest; onStart: () => void; onBack: () => void }) {
  const info = levelById(test.level)!;
  return (
    <div className="test-intro page-enter">
      <button className="link-btn" style={{ fontSize: 13 }} onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>
      <LevelTag level={test.level} />
      <h1 style={{ fontSize: 'var(--text-2xl)' }}>{test.title}</h1>
      <div className="test-intro-facts">
        <div>
          <strong>{test.problems.length}</strong>
          <span className="xs muted">coding questions</span>
        </div>
        <div>
          <strong>{Math.round(test.durationSec / 60)}</strong>
          <span className="xs muted">minutes</span>
        </div>
        <div>
          <strong>2 + 12</strong>
          <span className="xs muted">public + hidden cases</span>
        </div>
        <div>
          <strong>{test.problems.length * 100}</strong>
          <span className="xs muted">max score</span>
        </div>
      </div>
      <ul className="test-rules">
        <li>Read input from standard input and print the answer to standard output, exactly as the statement describes.</li>
        <li>Run tests your code on the 2 public cases; Submit judges it on all 14. Your best submission per question counts.</li>
        <li>Each question scores (cases passed ÷ 14) × 100. Partial solutions earn partial marks.</li>
        <li>The timer keeps running if you leave; the test is submitted automatically when time runs out.</li>
        <li>Patterns, approaches and reference solutions are shown after you finish.</li>
      </ul>
      <p className="xs muted">Topics covered at this level: {info.topics.map((t) => t.title).join(', ')}.</p>
      <Button variant="primary" size="lg" icon={<Play />} onClick={onStart}>
        Start test
      </Button>
    </div>
  );
}

function Running({ test, update }: { test: CodingTest; update: (fn: (t: CodingTest) => CodingTest, now?: boolean) => void }) {
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const deadline = (test.startedAt || Date.now()) + test.durationSec * 1000;
  const remaining = Math.max(0, Math.round((deadline - now) / 1000));
  const casesPer = useMemo(() => test.problems.map((tp) => generateCases(PROBLEM_BY_ID[tp.problemId], tp.seed)), [test.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback(() => update((t) => ({ ...t, status: 'submitted', finishedAt: Date.now() }), true), [update]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      clearInterval(t);
      window.removeEventListener('beforeunload', warn);
    };
  }, []);
  useEffect(() => {
    if (remaining === 0) finish();
  }, [remaining, finish]);

  const tp = test.problems[current];
  const p = PROBLEM_BY_ID[tp.problemId];
  const low = remaining <= 300;

  const header = (
    <div className="ws-header inf-test-header">
      <LevelTag level={test.level} />
      <div className="inf-qtabs">
        {test.problems.map((q, i) => {
          const r = q.result;
          return (
            <button key={i} className={`inf-qtab${i === current ? ' active' : ''}${r ? (r.passed === r.total ? ' done' : ' partial') : ''}`} onClick={() => setCurrent(i)}>
              Q{i + 1}
              {r && <span className="tabular">{r.passed}/{r.total}</span>}
            </button>
          );
        })}
      </div>
      <div className="grow" />
      <div className={`timer${low ? ' low' : ''}`} role="timer">
        <Clock /> {formatTime(remaining)}
      </div>
      <Button size="sm" variant="primary" icon={<Flag />} onClick={() => setConfirm(true)}>
        <span className="hide-mobile">Finish test</span>
      </Button>
    </div>
  );

  const left = (
    <div className="ws-scroll">
      <div className="xs muted" style={{ marginBottom: 6 }}>
        Question {current + 1} of {test.problems.length}
      </div>
      <ProblemStatement p={p} cases={casesPer[current]} showLevel={false} />
    </div>
  );

  const right = (
    <CodingPanel
      key={current}
      cases={casesPer[current]}
      code={tp.code}
      lang={tp.lang}
      result={tp.result}
      onLang={(l: CodeLang) => update((t) => ({ ...t, problems: t.problems.map((q, i) => (i === current ? { ...q, lang: l } : q)) }))}
      onCode={(l: CodeLang, c: string) => update((t) => ({ ...t, problems: t.problems.map((q, i) => (i === current ? { ...q, lang: l, code: { ...q.code, [l]: c } } : q)) }))}
      onSubmit={(s) =>
        update(
          (t) => ({
            ...t,
            problems: t.problems.map((q, i) => (i === current && (!q.result || s.passed >= q.result.passed) ? { ...q, result: s } : q)),
          }),
          true
        )
      }
    />
  );

  const attempted = test.problems.filter((q) => q.result).length;
  return (
    <>
      <InfWorkspace header={header} left={left} right={right} />
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Finish the test?">
        <p className="small">
          You have submitted {attempted} of {test.problems.length} questions. Unsubmitted questions score 0. You still have {formatTime(remaining)} left.
        </p>
        <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Keep working
          </Button>
          <Button variant="primary" icon={<Flag />} onClick={finish}>
            Finish and see results
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Results({ test }: { test: CodingTest }) {
  const s = testScore(test);
  const generate = useGenerate();
  const [q, setQ] = useState(0);
  const used = test.startedAt && test.finishedAt ? Math.round((test.finishedAt - test.startedAt) / 1000) : null;
  const tp = test.problems[q];
  const p = PROBLEM_BY_ID[tp.problemId];
  const cases = useMemo(() => generateCases(p, tp.seed), [p, tp.seed]);
  const yourCode = tp.result ? tp.code[tp.result.lang] : tp.code[tp.lang];
  const yourLang = tp.result?.lang || tp.lang;

  return (
    <div className="page page-narrow page-enter">
      <Link to={`/infosys/${test.level}?tab=tests`} className="link-btn" style={{ fontSize: 13, marginBottom: 16, display: 'inline-flex' }}>
        <ArrowLeft size={14} /> {levelById(test.level)?.title} level
      </Link>
      <div className="result-hero">
        <ProgressRing value={s.pct / 100} size={104} stroke={8} color={s.pct >= 80 ? 'var(--success)' : s.pct >= 40 ? 'var(--warning)' : 'var(--danger)'}>
          <div className="col" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 700 }} className="tabular">{s.got}</span>
            <span className="xs muted">of {s.total}</span>
          </div>
        </ProgressRing>
        <div className="grow col" style={{ gap: 6 }}>
          <LevelTag level={test.level} />
          <h1 style={{ fontSize: 'var(--text-xl)' }}>{test.title}</h1>
          <span className="small muted">
            {new Date(test.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            {used !== null ? ` · ${formatTime(used)} used of ${formatTime(test.durationSec)}` : ''}
          </span>
          <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <Button variant="primary" icon={<RotateCcw />} onClick={() => generate(test.level)}>
              New {levelById(test.level)?.title.toLowerCase()} test
            </Button>
          </div>
        </div>
      </div>

      <div className="problem-rows" style={{ marginTop: 20 }}>
        {test.problems.map((x, i) => {
          const pr = PROBLEM_BY_ID[x.problemId];
          const sc = x.result ? Math.round((x.result.passed / x.result.total) * 100) : 0;
          return (
            <button key={i} className={`problem-row${i === q ? ' active-row' : ''}`} onClick={() => setQ(i)} style={{ textAlign: 'left' }}>
              {x.result?.passed === x.result?.total && x.result ? <CircleCheck size={15} className="ok" /> : x.result ? <Trophy size={15} className="muted" /> : <AlertTriangle size={15} className="muted" />}
              <span className="grow truncate">
                Q{i + 1}. {pr.title}
              </span>
              <span className="xs muted hide-mobile">{pr.pattern.name}</span>
              <span className={`score-badge ${sc >= 80 ? 'good' : sc >= 40 ? 'ok' : 'low'}`}>{sc}/100</span>
            </button>
          );
        })}
      </div>

      <section className="inf-card" style={{ marginTop: 20 }}>
        <Tabs
          value={String(q)}
          onChange={(v) => setQ(Number(v))}
          tabs={test.problems.map((_, i) => ({ value: String(i), label: `Q${i + 1}` }))}
        />
        <div style={{ marginTop: 16 }} className="col">
          <ProblemStatement p={p} cases={cases} />
          <h3 className="inf-h3">Your result</h3>
          <SubmissionResult result={tp.result} pubCount={2} />
          {yourCode && yourCode !== STARTER[yourLang] && <CodeBlock code={yourCode} lang={yourLang} title={`Your code (${LANG_LABEL[yourLang]})`} />}
          <h3 className="inf-h3">Pattern and approach</h3>
          <PatternCard p={p} />
          <h3 className="inf-h3">Reference solutions</h3>
          <Solutions p={p} />
        </div>
      </section>
    </div>
  );
}
