import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import {
  ArrowLeft, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock, Eye, FileText, FlaskConical, History, Lightbulb, Play, Plus, RotateCcw, Send, Trash2, X,
} from 'lucide-react';
import { LC150, PROBLEMS, PROBLEMS_BY_ID, TOPIC_TITLE, TOPICS, loadProblem } from '../../content/problems';
import { judge, exampleInput, fmtValue, starterCode, supportedLangs, type JudgeResult, type Problem, type Test, isDesign } from '../../lib/harness';
import { actions, useCodeLang, useStore } from '../../lib/store';
import { CodeBlock, LangToggle } from '../../components/code';
import { CodeEditor } from '../../components/code/Editor';
import { Badge, Button, DifficultyLabel, IconButton, Segmented, Select, Tabs, useIsMobile } from '../../components/ui';
import { LANG_LABEL, type CodeLang } from '../../lib/types';
import { runCode, usePythonStatus, warmPython } from '../../lib/runner';
import { pythonProgram } from '../../lib/harness/python';
import { toast } from '../../lib/toast';
import { useLearnLang } from '../../lib/store';

const draftKey = (id: string, lang: CodeLang) => `sw-code:${id}:${lang}`;
function loadDraft(p: Problem, lang: CodeLang) {
  try {
    return localStorage.getItem(draftKey(p.id, lang)) ?? starterCode(lang, p.sig);
  } catch {
    return starterCode(lang, p.sig);
  }
}

function Statement({ p }: { p: Problem }) {
  const html = useMemo(() => marked.parse(p.statement, { async: false }) as string, [p.statement]);
  const n = p.examples ?? 2;
  return (
    <div className="problem-statement">
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {p.tests.slice(0, n).map((t, i) => (
        <div key={i} className="ex-case">
          <div className="ex-case-title">Example {i + 1}</div>
          <div className="ex-case-body">
            <div>
              <span className="muted">Input: </span>
              <code>{exampleInput(p, t)}</code>
            </div>
            <div>
              <span className="muted">Output: </span>
              <code>{fmtValue(t.expected)}</code>
            </div>
            {p.notes?.[i] && (
              <div>
                <span className="muted">Explanation: </span>
                <span dangerouslySetInnerHTML={{ __html: marked.parseInline(p.notes[i], { async: false }) as string }} />
              </div>
            )}
          </div>
        </div>
      ))}
      {p.constraints && p.constraints.length > 0 && (
        <>
          <div className="ex-case-title" style={{ marginTop: 24 }}>
            Constraints
          </div>
          <ul className="constraints">
            {p.constraints.map((c, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: marked.parseInline(c, { async: false }) as string }} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Hints({ p }: { p: Problem }) {
  const [shown, setShown] = useState(0);
  return (
    <div className="col" style={{ gap: 10 }}>
      {p.hints.slice(0, shown).map((h, i) => (
        <div key={i} className="hint page-enter">
          <span className="hint-n">Hint {i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: marked.parseInline(h, { async: false }) as string }} />
        </div>
      ))}
      {shown < p.hints.length ? (
        <Button variant="secondary" icon={<Lightbulb />} onClick={() => setShown((s) => s + 1)} style={{ alignSelf: 'flex-start' }}>
          {shown === 0 ? 'Show first hint' : 'Show next hint'}
        </Button>
      ) : (
        <p className="small muted">That's every hint. The Solution tab walks through the full approach.</p>
      )}
    </div>
  );
}

function Solution({ p }: { p: Problem }) {
  const [revealed, setRevealed] = useState(false);
  const lang = useLearnLang();
  if (!revealed)
    return (
      <div className="empty" style={{ padding: '40px 16px' }}>
        <Eye />
        <strong>Try it yourself first</strong>
        <div>Struggling productively is where the learning happens. Use the hints if you're stuck.</div>
        <Button variant="secondary" style={{ marginTop: 10 }} onClick={() => setRevealed(true)}>
          Reveal solution
        </Button>
      </div>
    );
  return (
    <div className="col page-enter" style={{ gap: 24 }}>
      {p.approaches.map((a, i) => (
        <div key={i} className="approach">
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h3 className="approach-title">
              Approach {i + 1}: {a.name}
            </h3>
            <div className="row" style={{ gap: 6 }}>
              <Badge icon={<Clock />}>{a.time}</Badge>
              <Badge>Space {a.space}</Badge>
            </div>
          </div>
          <div className="prose small-prose" dangerouslySetInnerHTML={{ __html: marked.parse(a.idea, { async: false }) as string }} />
        </div>
      ))}
      <div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="section-title">Optimized solution</span>
          <LangToggle size="sm" />
        </div>
        <div className="lang-swap" key={lang}>
          <CodeBlock code={p.solution[lang]} lang={lang} title={lang === 'python' ? 'solution.py' : 'Solution.java'} />
        </div>
      </div>
    </div>
  );
}

function Submissions({ p, onLoad }: { p: Problem; onLoad: (lang: CodeLang, code: string) => void }) {
  const subs = useStore((s) => s.submissions.filter((x) => x.problemId === p.id));
  if (!subs.length)
    return (
      <div className="empty">
        <History />
        <strong>No submissions yet</strong>
        <div>Your submitted attempts for this problem will appear here.</div>
      </div>
    );
  return (
    <div className="problem-rows">
      {subs.map((s) => (
        <button key={s.id} className="problem-row" style={{ width: '100%', border: 0, borderTop: '1px solid var(--border)', background: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => onLoad(s.language, s.code)}>
          {s.verdict === 'Accepted' ? <CircleCheck size={15} style={{ color: 'var(--success)' }} /> : <CircleX size={15} style={{ color: 'var(--danger)' }} />}
          <span className="grow" style={{ color: s.verdict === 'Accepted' ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {s.verdict}
          </span>
          <span className="xs muted tabular">
            {s.passed}/{s.total}
          </span>
          <span className="xs muted">{LANG_LABEL[s.language]}</span>
          <span className="xs muted hide-mobile">{new Date(s.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </button>
      ))}
    </div>
  );
}

// ---------------- Console ----------------
type ConsoleState = { kind: 'idle' } | { kind: 'running'; label: string } | { kind: 'result'; res: JudgeResult; submit: boolean };

function CaseView({ p, c }: { p: Problem; c: JudgeResult['cases'][number] }) {
  const names = isDesign(p.sig) ? ['operations', 'arguments'] : p.sig.params.map((x) => x.name);
  return (
    <div className="case-view page-enter">
      <div className="case-field">
        <div className="case-label">Input</div>
        {c.args.map((a, i) => (
          <div key={i} className="case-value">
            <span className="muted">{names[i]} = </span>
            {fmtValue(a)}
          </div>
        ))}
      </div>
      {c.stdout && (
        <div className="case-field">
          <div className="case-label">Stdout</div>
          <div className="case-value pre">{c.stdout.replace(/\n$/, '')}</div>
        </div>
      )}
      <div className="case-field">
        <div className="case-label">Output</div>
        <div className={`case-value${c.error ? ' error pre' : c.passed ? '' : ' wrong'}`}>{c.error ? c.error : c.actualRaw !== undefined ? fmtValue(c.actual) : '—'}</div>
      </div>
      {c.expected !== undefined && (
        <div className="case-field">
          <div className="case-label">Expected</div>
          <div className="case-value">{fmtValue(c.expected)}</div>
        </div>
      )}
    </div>
  );
}

function Console({ p, state, cases, setCases, customCount }: { p: Problem; state: ConsoleState; cases: Test[]; setCases: (t: Test[]) => void; customCount: number }) {
  const [tab, setTab] = useState<'cases' | 'result'>('cases');
  const [sel, setSel] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const pyStatus = usePythonStatus();
  useEffect(() => {
    if (state.kind !== 'idle') setTab('result');
    if (state.kind === 'result') {
      const firstFail = state.res.cases.findIndex((c) => !c.passed);
      setSel(firstFail >= 0 ? firstFail : 0);
    }
  }, [state]);
  const names = isDesign(p.sig) ? ['operations', 'arguments'] : p.sig.params.map((x) => x.name);
  const cur = cases[sel] || cases[0];

  function startEdit() {
    setDraft((cur?.args || names.map(() => null)).map((a) => JSON.stringify(a)).join('\n'));
    setEditing(true);
  }
  function saveEdit(asNew: boolean) {
    try {
      const lines = draft.split('\n').filter((l) => l.trim());
      if (lines.length !== names.length) throw new Error(`Enter ${names.length} line${names.length > 1 ? 's' : ''}: ${names.join(', ')}`);
      const args = lines.map((l) => JSON.parse(l));
      const t: Test = { args, expected: undefined };
      const next = [...cases];
      if (asNew) next.push(t);
      else next[sel] = t;
      setCases(next);
      if (asNew) setSel(next.length - 1);
      setEditing(false);
    } catch (e) {
      toast(e instanceof SyntaxError ? 'Each line must be valid JSON, e.g. [1,2,3] or "abc"' : (e as Error).message, 'error');
    }
  }

  return (
    <div className="console">
      <div className="row console-tabs">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'cases', label: 'Test cases', icon: <FlaskConical /> },
            { value: 'result', label: 'Result', icon: <FileText /> },
          ]}
        />
      </div>
      <div className="console-body">
        {tab === 'cases' && (
          <div>
            <div className="case-chips">
              {cases.map((_, i) => (
                <button key={i} className={`chip${i === sel ? ' active' : ''}`} onClick={() => { setSel(i); setEditing(false); }}>
                  {i < cases.length - customCount ? `Case ${i + 1}` : `Custom ${i - (cases.length - customCount) + 1}`}
                </button>
              ))}
              <IconButton label="Add custom case" size="sm" icon={<Plus />} onClick={() => { setSel(cases.length); setDraft(names.map(() => '').join('\n')); setEditing(true); }} />
            </div>
            {editing ? (
              <div className="col" style={{ gap: 8 }}>
                <span className="xs muted">One JSON value per line: {names.join(', ')}</span>
                <textarea className="textarea" rows={Math.max(3, names.length + 1)} value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} aria-label="Custom test input" />
                <div className="row">
                  <Button size="sm" variant="primary" onClick={() => saveEdit(sel >= cases.length)}>
                    Save case
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              cur && (
                <div className="case-view">
                  {cur.args.map((a, i) => (
                    <div key={i} className="case-field">
                      <div className="case-label">{names[i]} =</div>
                      <div className="case-value">{fmtValue(a)}</div>
                    </div>
                  ))}
                  <div className="row">
                    <Button size="sm" variant="ghost" onClick={startEdit}>
                      Edit input
                    </Button>
                    {sel >= cases.length - customCount && (
                      <Button size="sm" variant="ghost" icon={<Trash2 />} onClick={() => { setCases(cases.filter((_, i) => i !== sel)); setSel(0); }}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {tab === 'result' && state.kind === 'idle' && <div className="empty" style={{ padding: 24 }}>Run your code to see results here.</div>}
        {tab === 'result' && state.kind === 'running' && (
          <div className="running">
            <span className="spinner" />
            <span>{state.label}</span>
            {pyStatus === 'loading' && <span className="xs muted">First run downloads the Python runtime (~10 MB, cached afterwards).</span>}
          </div>
        )}
        {tab === 'result' && state.kind === 'result' && (
          <div className="page-enter">
            <div className="verdict-row">
              <span className={`verdict ${state.res.verdict === 'Accepted' ? 'ok' : 'bad'}`}>{state.res.verdict === 'Accepted' && !state.submit ? 'All examples passed' : state.res.verdict}</span>
              {state.res.total > 0 && (
                <span className="small muted tabular">
                  {state.res.passed}/{state.res.total} test cases passed
                </span>
              )}
              {state.res.timeMs !== undefined && <span className="xs muted tabular">{state.res.timeMs} ms</span>}
            </div>
            {state.res.message && state.res.cases.every((c) => !c.error) && <pre className="console-pre error">{state.res.message}</pre>}
            {state.res.cases.length > 0 && (
              <>
                <div className="case-chips">
                  {state.res.cases.map((c, i) => (
                    <button key={i} className={`chip${i === sel ? ' active' : ''}`} onClick={() => setSel(i)}>
                      <span className={`dot ${c.passed ? 'ok' : 'bad'}`} />
                      Case {i + 1}
                    </button>
                  ))}
                </div>
                {state.res.cases[sel] && <CaseView p={p} c={state.res.cases[sel]} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Workspace ----------------
export function Workspace({ source }: { source: 'practice' | 'lc150' }) {
  const { id = '' } = useParams();
  const [state, setState] = useState<{ id: string; p?: Problem; error?: boolean } | null>(null);
  useEffect(() => {
    let live = true;
    loadProblem(id).then(
      (p) => live && setState({ id, p }),
      () => live && setState({ id, error: true })
    );
    return () => {
      live = false;
    };
  }, [id]);
  if (!PROBLEMS_BY_ID[id]) return <Navigate to={source === 'lc150' ? '/lc150' : '/practice'} replace />;
  if (state?.error && state.id === id)
    return (
      <div className="empty" style={{ paddingTop: 96 }}>
        <strong>Couldn't load this problem</strong>
        <div>Check your connection and try again.</div>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => location.reload()}>Retry</button>
      </div>
    );
  if (!state?.p || state.id !== id)
    return (
      <div className="running" style={{ height: "100%", justifyContent: "center" }}>
        <span className="spinner" />
      </div>
    );
  return <ProblemWorkspace source={source} p={state.p} />;
}

function ProblemWorkspace({ source, p }: { source: 'practice' | 'lc150'; p: Problem }) {
  const id = p.id;
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const preferred = useCodeLang();
  const progress = useStore((s) => s.problems[id]);
  const langs = p ? supportedLangs(p) : [];
  const [lang, setLang] = useState<CodeLang>(langs.includes(preferred) ? preferred : 'python');
  const [code, setCode] = useState(() => (p ? loadDraft(p, lang) : ''));
  const [leftTab, setLeftTab] = useState<'desc' | 'hints' | 'solution' | 'subs'>('desc');
  const [mobileView, setMobileView] = useState<'problem' | 'code' | 'result'>('problem');
  const [state, setState] = useState<ConsoleState>({ kind: 'idle' });
  const [custom, setCustom] = useState<Test[]>([]);
  const [split, setSplit] = useState(44);
  const [consoleH, setConsoleH] = useState(38);
  const busy = state.kind === 'running';

  const list = source === 'lc150' ? LC150 : PROBLEMS;
  const pos = list.findIndex((x) => x.id === id);

  useEffect(() => {
    if (!p) return;
    const l = supportedLangs(p).includes(preferred) ? preferred : 'python';
    setLang(l);
    setCode(loadDraft(p, l));
    setState({ kind: 'idle' });
    setCustom([]);
    setLeftTab('desc');
    setMobileView('problem');
    if (l === 'python') warmPython();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // persist draft
  useEffect(() => {
    if (!p) return;
    const t = setTimeout(() => {
      try {
        if (code === starterCode(lang, p.sig)) localStorage.removeItem(draftKey(p.id, lang));
        else localStorage.setItem(draftKey(p.id, lang), code);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [code, lang, p]);

  const switchLang = (l: CodeLang) => {
    setLang(l);
    setCode(loadDraft(p, l));
    actions.setCodeLang(l);
    if (l === 'python') warmPython();
  };

  const examples = useMemo(() => (p ? p.tests.slice(0, p.examples ?? 2) : []), [p]);
  const cases = useMemo(() => [...examples, ...custom], [examples, custom]);

  const execute = useCallback(
    async (submit: boolean) => {
      if (!p || busy) return;
      if (mobile) setMobileView('result');
      setState({ kind: 'running', label: submit ? `Judging against ${p.tests.length} test cases…` : 'Running examples…' });
      let tests: Test[] = submit ? p.tests : cases;
      // Custom cases have no expected value: compute it with the reference solution.
      if (!submit && tests.some((t) => t.expected === undefined)) {
        const ref = await runCode('python', pythonProgram(p.solution.python, p.sig), [String(tests.length), ...tests.flatMap((t) => t.args.map((a) => JSON.stringify(a)))].join('\n') + '\n', 8000);
        const outs = ref.stdout.split('\n').filter((l) => l.startsWith('\u0001RESULT'));
        tests = tests.map((t, i) => (t.expected !== undefined ? t : { ...t, expected: outs[i] ? JSON.parse(outs[i].slice(8)) : undefined }));
      }
      const res = await judge(p, lang, code, tests);
      setState({ kind: 'result', res, submit });
      if (submit && res.verdict !== 'Unavailable' && res.verdict !== 'Error') {
        actions.recordSubmission({ problemId: p.id, language: lang, verdict: res.verdict, passed: res.passed, total: res.total, runtimeMs: res.timeMs, code });
        if (res.verdict === 'Accepted') toast(`Accepted — ${p.title} solved`, 'success');
      }
    },
    [p, busy, mobile, cases, lang, code]
  );

  if (!p) return <Navigate to={source === 'lc150' ? '/lc150' : '/practice'} replace />;

  const solved = progress?.status === 'solved';
  const saved = !!progress?.saved;
  const back = source === 'lc150' ? '/lc150' : `/practice?topic=${p.topic}`;
  const topicConcept = TOPICS.find((t) => t.id === p.topic)?.concept;

  const left = (
    <div className="ws-left">
      <Tabs
        value={leftTab}
        onChange={setLeftTab}
        tabs={[
          { value: 'desc', label: 'Description' },
          { value: 'hints', label: `Hints` },
          { value: 'solution', label: 'Solution' },
          { value: 'subs', label: 'Submissions' },
        ]}
      />
      <div className="ws-scroll">
        {leftTab === 'desc' && (
          <div className="page-enter">
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 className="ws-title">
                {pos >= 0 && source === 'lc150' ? `${pos + 1}. ` : ''}
                {p.title}
              </h1>
              {solved && <Badge tone="success" icon={<CircleCheck />}>Solved</Badge>}
            </div>
            <div className="row" style={{ gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <DifficultyLabel value={p.difficulty} />
              <Link to={`/practice?topic=${p.topic}`} className="badge">
                {TOPIC_TITLE[p.topic]}
              </Link>
              {topicConcept && (
                <Link to={`/learn/dsa/${topicConcept}`} className="xs muted" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Review the lesson
                </Link>
              )}
            </div>
            <Statement p={p} />
          </div>
        )}
        {leftTab === 'hints' && <Hints p={p} />}
        {leftTab === 'solution' && <Solution p={p} />}
        {leftTab === 'subs' && (
          <Submissions
            p={p}
            onLoad={(l, c) => {
              setLang(l);
              setCode(c);
              if (mobile) setMobileView('code');
              toast('Loaded submission into the editor');
            }}
          />
        )}
      </div>
    </div>
  );

  const editor = (
    <div className="ws-editor">
      <div className="ws-editor-bar">
        <Select<CodeLang> label="Language" value={lang} onChange={switchLang} options={langs.map((l) => ({ value: l, label: LANG_LABEL[l], icon: <span className={`lang-dot ${l}`} /> }))} />
        <div className="grow" />
        <IconButton
          label="Reset to starter code"
          size="sm"
          icon={<RotateCcw />}
          onClick={() => {
            if (code === starterCode(lang, p.sig) || confirm('Replace your code with the starter template?')) setCode(starterCode(lang, p.sig));
          }}
        />
      </div>
      <div className="ws-editor-body">
        <CodeEditor value={code} onChange={setCode} lang={lang} onRun={() => execute(false)} />
      </div>
    </div>
  );

  const runBar = (
    <div className="ws-runbar">
      <span className="xs muted hide-mobile">
        <kbd className="kbd">Ctrl</kbd> <kbd className="kbd">Enter</kbd> to run
      </span>
      <div className="grow" />
      <Button variant="secondary" icon={<Play />} onClick={() => execute(false)} disabled={busy}>
        Run
      </Button>
      <Button variant="primary" icon={<Send />} onClick={() => execute(true)} loading={busy && state.kind === 'running' && state.label.startsWith('Judging')} disabled={busy}>
        Submit
      </Button>
    </div>
  );

  const consoleEl = <Console p={p} state={state} cases={cases} setCases={(t) => setCustom(t.slice(examples.length))} customCount={custom.length} />;

  const header = (
    <div className="ws-header">
      <Button variant="ghost" size="sm" icon={<ArrowLeft />} onClick={() => navigate(back)}>
        <span className="hide-mobile">{source === 'lc150' ? 'LeetCode 150' : 'Practice'}</span>
      </Button>
      <div className="row" style={{ gap: 2 }}>
        <IconButton label="Previous problem" size="sm" icon={<ChevronLeft />} disabled={pos <= 0} onClick={() => navigate(`/${source}/${list[pos - 1].id}`)} />
        <IconButton label="Next problem" size="sm" icon={<ChevronRight />} disabled={pos < 0 || pos >= list.length - 1} onClick={() => navigate(`/${source}/${list[pos + 1].id}`)} />
      </div>
      <span className="small truncate grow show-mobile" style={{ fontWeight: 500 }}>
        {p.title}
      </span>
      <div className="grow hide-mobile" />
      <IconButton label={saved ? 'Remove from saved' : 'Save for later'} size="sm" icon={saved ? <BookmarkCheck /> : <Bookmark />} active={saved} onClick={() => { actions.patchProblem(p.id, { saved: !saved }); toast(saved ? 'Removed from saved' : 'Saved for later', 'success', 1600); }} />
      {!solved && progress?.status !== 'attempted' ? null : (
        <span className="hide-mobile">
          {solved ? <Badge tone="success">Solved</Badge> : <Badge tone="warning">Attempted</Badge>}
        </span>
      )}
    </div>
  );

  if (mobile)
    return (
      <div className="ws ws-mobile">
        {header}
        <div className="ws-mobile-switch">
          <Segmented
            label="View"
            value={mobileView}
            onChange={setMobileView}
            options={[
              { value: 'problem', label: 'Problem' },
              { value: 'code', label: 'Code' },
              { value: 'result', label: 'Result' },
            ]}
          />
        </div>
        <div className="ws-mobile-body">
          <div style={{ display: mobileView === 'problem' ? 'contents' : 'none' }}>{left}</div>
          <div style={{ display: mobileView === 'code' ? 'contents' : 'none' }}>{editor}</div>
          <div style={{ display: mobileView === 'result' ? 'contents' : 'none' }}>{consoleEl}</div>
        </div>
        {runBar}
      </div>
    );

  return (
    <div className="ws">
      {header}
      <div className="ws-body" style={{ gridTemplateColumns: `minmax(0, ${split}%) 6px minmax(0, 1fr)` }}>
        {left}
        <Splitter axis="x" onDrag={(pct) => setSplit(Math.min(70, Math.max(26, pct)))} />
        <div className="ws-right" style={{ gridTemplateRows: `minmax(0, 1fr) 6px minmax(0, ${consoleH}%)` }}>
          {editor}
          <Splitter axis="y" onDrag={(pct) => setConsoleH(Math.min(70, Math.max(16, 100 - pct)))} />
          <div className="ws-console-wrap">
            {consoleEl}
            {runBar}
          </div>
        </div>
      </div>
    </div>
  );
}

function Splitter({ axis, onDrag }: { axis: 'x' | 'y'; onDrag: (pct: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`splitter splitter-${axis}`}
      role="separator"
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      onPointerDown={(e) => {
        const parent = ref.current!.parentElement!;
        const rect = parent.getBoundingClientRect();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
        const move = (ev: PointerEvent) => onDrag(axis === 'x' ? ((ev.clientX - rect.left) / rect.width) * 100 : ((ev.clientY - rect.top) / rect.height) * 100);
        const up = () => {
          document.body.style.userSelect = '';
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      }}
    />
  );
}
