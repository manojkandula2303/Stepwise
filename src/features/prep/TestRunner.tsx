import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Bookmark, ChevronLeft, ChevronRight, Clock, Eraser, Grid3x3, Send, Timer, X } from 'lucide-react';
import { actions } from '../../lib/store';
import { Button, Modal, useIsMobile } from '../../components/ui';
import { buildQuestions, formatTime, questionsByIds, scoreAttempt, specFromId, type TestQuestion, type TestSpec } from './tests';
import { DifficultyTag, Markdown, inline } from './Practice';
import { PREP_TOPICS } from '../../content/prep/curriculum';

interface Slot {
  chosen: number | null;
  marked: boolean;
  visited: boolean;
  timeSec: number;
}
interface Saved {
  specId: string;
  qids: string[];
  slots: Slot[];
  startedAt: number;
  deadline: number;
  current: number;
}

const KEY = 'sw-active-test';
const loadSaved = (): Saved | null => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
};

function Intro({ spec, onStart, loading, onBack }: { spec: TestSpec; onStart: () => void; loading: boolean; onBack: () => void }) {
  const topicNames = spec.topics.map((t) => PREP_TOPICS[t]?.title).filter(Boolean);
  return (
    <div className="test-intro page-enter">
      <button className="link-btn" style={{ fontSize: 13 }} onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>
      <h1>{spec.title}</h1>
      <div className="test-intro-facts">
        <div>
          <strong>{spec.count}</strong>
          <span>questions</span>
        </div>
        <div>
          <strong>{spec.minutes}</strong>
          <span>minutes</span>
        </div>
        <div>
          <strong>{spec.negative ? `−${spec.negative}` : '0'}</strong>
          <span>per wrong answer</span>
        </div>
      </div>
      <ul className="test-rules">
        <li>Each correct answer scores +1{spec.negative ? `; each wrong answer costs ${spec.negative}; unanswered questions score 0.` : '; there is no negative marking.'}</li>
        <li>The timer starts when you press Start and keeps running if you switch tabs. The test submits automatically when time runs out.</li>
        <li>Use <strong>Mark for review</strong> to flag questions to revisit. The palette shows answered, unanswered and marked questions.</li>
        <li>Keyboard: <kbd className="kbd">1</kbd>–<kbd className="kbd">4</kbd> choose an option, <kbd className="kbd">←</kbd>/<kbd className="kbd">→</kbd> move, <kbd className="kbd">M</kbd> mark.</li>
      </ul>
      {topicNames.length > 0 && (
        <div className="xs muted" style={{ marginBottom: 20 }}>
          Covers: {topicNames.length > 12 ? `${topicNames.slice(0, 12).join(', ')} and ${topicNames.length - 12} more topics` : topicNames.join(', ')}
        </div>
      )}
      <Button variant="primary" size="lg" icon={<Timer />} loading={loading} onClick={onStart}>
        Start test
      </Button>
    </div>
  );
}

export function TestRunner() {
  const { specId = '' } = useParams();
  const id = decodeURIComponent(specId);
  const spec = useMemo(() => specFromId(id), [id]);
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const [phase, setPhase] = useState<'intro' | 'loading' | 'running'>('intro');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [current, setCurrent] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [palette, setPalette] = useState(false);
  const enteredAt = useRef(Date.now());
  const submitted = useRef(false);

  // Resume an in-progress test after a reload.
  useEffect(() => {
    const saved = loadSaved();
    if (!saved || saved.specId !== id || saved.deadline < Date.now() - 5000) return;
    setPhase('loading');
    questionsByIds(saved.qids).then((map) => {
      const qs = saved.qids.map((q) => map[q]).filter(Boolean);
      if (qs.length !== saved.qids.length) {
        setPhase('intro');
        return;
      }
      setQuestions(qs);
      setSlots(saved.slots);
      setCurrent(saved.current);
      setDeadline(saved.deadline);
      setStartedAt(saved.startedAt);
      setNow(Date.now());
      enteredAt.current = Date.now();
      setPhase('running');
    });
  }, [id]);

  async function start() {
    if (!spec) return;
    setPhase('loading');
    const qs = await buildQuestions(spec);
    const t = Date.now();
    setQuestions(qs);
    setSlots(qs.map((_, i) => ({ chosen: null, marked: false, visited: i === 0, timeSec: 0 })));
    setCurrent(0);
    setStartedAt(t);
    setNow(t);
    setDeadline(t + spec.minutes * 60_000);
    enteredAt.current = t;
    setPhase('running');
  }

  // Persist progress so a reload doesn't lose the attempt.
  useEffect(() => {
    if (phase !== 'running') return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ specId: id, qids: questions.map((q) => q.qid), slots, startedAt, deadline, current } satisfies Saved));
    } catch {
      /* ignore */
    }
  }, [phase, slots, current, id, questions, startedAt, deadline]);

  // Ticking clock and leave-page warning.
  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => setNow(Date.now()), 500);
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      clearInterval(t);
      window.removeEventListener('beforeunload', warn);
    };
  }, [phase]);

  /** Add the time spent on the current question to its slot. */
  const flushTime = useCallback(
    (list: Slot[]) => {
      const spent = (Date.now() - enteredAt.current) / 1000;
      enteredAt.current = Date.now();
      return list.map((s, i) => (i === current ? { ...s, timeSec: s.timeSec + spent } : s));
    },
    [current]
  );

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= questions.length) return;
      setSlots((s) => flushTime(s).map((x, j) => (j === i ? { ...x, visited: true } : x)));
      setCurrent(i);
      setPalette(false);
    },
    [questions.length, flushTime]
  );

  const choose = (opt: number | null) => setSlots((s) => s.map((x, i) => (i === current ? { ...x, chosen: opt } : x)));
  const toggleMark = () => setSlots((s) => s.map((x, i) => (i === current ? { ...x, marked: !x.marked } : x)));

  const submit = useCallback(() => {
    if (!spec || submitted.current) return;
    submitted.current = true;
    const final = flushTime(slots);
    const attempt = scoreAttempt(
      spec,
      questions,
      final.map((s, i) => ({ qid: questions[i].qid, chosen: s.chosen, marked: s.marked, timeSec: Math.round(s.timeSec) })),
      startedAt,
      Math.min(spec.minutes * 60, Math.round((Date.now() - startedAt) / 1000))
    );
    actions.recordAttempt(attempt);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    navigate(`/prep/result/${attempt.id}`, { replace: true });
  }, [spec, slots, questions, startedAt, navigate, flushTime]);

  const remaining = Math.max(0, Math.round((deadline - now) / 1000));
  useEffect(() => {
    if (phase === 'running' && deadline && now >= deadline) submit();
  }, [now, deadline, phase, submit]);

  // Keyboard shortcuts.
  useEffect(() => {
    if (phase !== 'running') return;
    const onKey = (e: KeyboardEvent) => {
      if (confirm || (e.target as HTMLElement).closest('input, textarea')) return;
      const n = '1234'.indexOf(e.key);
      const l = 'abcd'.indexOf(e.key.toLowerCase());
      const q = questions[current];
      if (n >= 0 && q && n < q.q.options.length) choose(n);
      else if (l >= 0 && !e.ctrlKey && !e.metaKey && q && l < q.q.options.length) choose(l);
      else if (e.key === 'ArrowRight') go(current + 1);
      else if (e.key === 'ArrowLeft') go(current - 1);
      else if (e.key.toLowerCase() === 'm') toggleMark();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!spec)
    return (
      <div className="page">
        <div className="empty">
          <AlertTriangle />
          <strong>This test isn't available</strong>
          <div>It may not have any questions yet.</div>
          <Button variant="secondary" onClick={() => navigate('/prep')}>Back to Placement Prep</Button>
        </div>
      </div>
    );

  if (phase !== 'running') return <Intro spec={spec} loading={phase === 'loading'} onStart={start} onBack={() => navigate(-1)} />;

  const q = questions[current];
  const slot = slots[current];
  const answered = slots.filter((s) => s.chosen !== null).length;
  const marked = slots.filter((s) => s.marked).length;
  const low = remaining <= 60;

  const paletteEl = (
    <div className="palette">
      <div className="palette-counts">
        <span><i className="pl answered" /> Answered {answered}</span>
        <span><i className="pl unanswered" /> Not answered {slots.filter((s) => s.visited && s.chosen === null).length}</span>
        <span><i className="pl marked" /> Marked {marked}</span>
        <span><i className="pl unvisited" /> Not visited {slots.filter((s) => !s.visited).length}</span>
      </div>
      <div className="palette-grid">
        {slots.map((s, i) => {
          const cls = s.marked ? (s.chosen !== null ? 'marked answered' : 'marked') : s.chosen !== null ? 'answered' : s.visited ? 'unanswered' : 'unvisited';
          return (
            <button key={i} className={`palette-btn ${cls}${i === current ? ' current' : ''}`} onClick={() => go(i)} aria-label={`Question ${i + 1}`}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <Button variant="primary" icon={<Send />} onClick={() => setConfirm(true)} style={{ width: '100%' }}>
        Submit test
      </Button>
    </div>
  );

  return (
    <div className="test">
      <header className="test-header">
        <div className="grow col" style={{ minWidth: 0 }}>
          <span className="truncate" style={{ fontWeight: 600 }}>{spec.title}</span>
          <span className="xs muted">
            {answered}/{questions.length} answered
          </span>
        </div>
        <div className={`timer${low ? ' low' : ''}`} role="timer" aria-live={low ? 'polite' : 'off'}>
          <Clock size={15} /> {formatTime(remaining)}
        </div>
        {mobile ? (
          <Button size="sm" variant="secondary" icon={<Grid3x3 />} onClick={() => setPalette(true)} aria-label="Question palette" />
        ) : (
          <Button size="sm" variant="primary" icon={<Send />} onClick={() => setConfirm(true)}>
            Submit
          </Button>
        )}
      </header>
      <div className="test-body">
        <main className="test-main">
          <div className="test-q page-enter" key={current}>
            <div className="test-q-meta">
              <span style={{ fontWeight: 600 }}>Question {current + 1}</span>
              <span className="muted">of {questions.length}</span>
              <span className="badge">{q.topicTitle}</span>
              <DifficultyTag d={q.q.difficulty} />
              {slot.marked && <span className="badge warning">Marked for review</span>}
            </div>
            <Markdown md={q.q.question} className="prose test-question" />
            <div className="quiz-options" role="radiogroup">
              {q.q.options.map((o, i) => (
                <button key={i} role="radio" aria-checked={slot.chosen === i} className={`quiz-option test-option${slot.chosen === i ? ' chosen' : ''}`} onClick={() => choose(i)}>
                  <span className="quiz-key">{String.fromCharCode(65 + i)}</span>
                  <span className="grow" dangerouslySetInnerHTML={{ __html: inline(o) }} />
                </button>
              ))}
            </div>
          </div>
          <footer className="test-footer">
            <Button variant="ghost" icon={<ChevronLeft />} disabled={current === 0} onClick={() => go(current - 1)}>
              <span className="hide-mobile">Previous</span>
            </Button>
            <Button variant="ghost" icon={<Eraser />} disabled={slot.chosen === null} onClick={() => choose(null)}>
              <span className="hide-mobile">Clear</span>
            </Button>
            <div className="grow" />
            <Button variant="secondary" icon={<Bookmark />} onClick={() => { toggleMark(); if (!slot.marked) go(current + 1); }}>
              {slot.marked ? 'Unmark' : <><span className="hide-mobile">Mark for review &amp; next</span><span className="show-mobile">Mark</span></>}
            </Button>
            <Button variant="primary" onClick={() => (current < questions.length - 1 ? go(current + 1) : setConfirm(true))}>
              {current < questions.length - 1 ? <>Save &amp; next <ChevronRight /></> : <>Finish <Send /></>}
            </Button>
          </footer>
        </main>
        {!mobile && <aside className="test-side">{paletteEl}</aside>}
      </div>

      {mobile && palette && (
        <>
          <div className="drawer-overlay" onClick={() => setPalette(false)} />
          <div className="sheet" role="dialog" aria-label="Question palette">
            <div className="row" style={{ justifyContent: 'space-between', padding: '12px 16px 0' }}>
              <strong>Questions</strong>
              <Button size="sm" variant="ghost" icon={<X />} onClick={() => setPalette(false)} aria-label="Close" />
            </div>
            <div style={{ padding: 16, overflow: 'auto' }}>{paletteEl}</div>
          </div>
        </>
      )}

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Submit test?">
        <div className="submit-summary">
          <div><strong>{answered}</strong><span>answered</span></div>
          <div><strong>{questions.length - answered}</strong><span>unanswered</span></div>
          <div><strong>{marked}</strong><span>marked</span></div>
        </div>
        <p className="small muted" style={{ margin: '14px 0 18px' }}>
          {questions.length - answered > 0 ? 'Unanswered questions score zero. ' : ''}You still have {formatTime(remaining)} left. You can't change answers after submitting.
        </p>
        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={() => setConfirm(false)}>Keep working</Button>
          <Button variant="primary" icon={<Send />} onClick={submit}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
}
