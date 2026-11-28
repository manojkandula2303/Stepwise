import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FilePlus2, FolderOpen, Play, Plus, Save, Trash2, Workflow, X, BookTemplate, CircleCheck, CircleAlert } from 'lucide-react';
import { CodeEditor } from '../../components/code/Editor';
import { Badge, Button, EmptyState, IconButton, Menu, Modal, Select, Tooltip, useIsMobile } from '../../components/ui';
import { actions, useCodeLang, useStore } from '../../lib/store';
import { runCode, traceCode, getRuntimes, STATUS_LABEL, usePythonStatus, warmPython } from '../../lib/runner';
import { takeHandoff } from '../../lib/handoff';
import { LANG_LABEL, type CodeLang, type RunResult, type Trace, type Snippet } from '../../lib/types';
import { SAMPLES } from './samples';
import { Visualizer } from '../visualizer/Visualizer';
import { toast } from '../../lib/toast';
import { getDoc } from '../../lib/store';
import { ComplexityPanel } from '../../components/code/ComplexityPanel';

const LANGS: CodeLang[] = ['python', 'java', 'cpp', 'c'];
const bufKey = (l: CodeLang) => `sw-compiler:${l}`;
/** Editor buffers live in the signed-in user's own (synced) space; guests keep them on this device. */
const loadBuf = (l: CodeLang) => getDoc<string>('buffer', l, bufKey(l)) ?? SAMPLES[0].code[l];

type CaseRun = { input: string; result?: RunResult; running?: boolean };

export function CompilerPage({ visualize: startVisualize = false }: { visualize?: boolean }) {
  const preferred = useCodeLang();
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useIsMobile();
  const pyStatus = usePythonStatus();
  const snippets = useStore((s) => s.snippets);
  const [lang, setLang] = useState<CodeLang>(preferred);
  const [code, setCode] = useState(() => loadBuf(preferred));
  const [cases, setCases] = useState<CaseRun[]>([{ input: '' }]);
  const [activeCase, setActiveCase] = useState(0);
  const [mode, setMode] = useState<'edit' | 'visualize'>(startVisualize ? 'visualize' : 'edit');
  const [trace, setTrace] = useState<Trace | null>(null);
  const [traceErr, setTraceErr] = useState('');
  const [tracing, setTracing] = useState(false);
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [libOpen, setLibOpen] = useState(false);
  const [runtimes, setRuntimes] = useState<Record<string, { available: boolean; reason?: string }>>({});
  const [mobilePane, setMobilePane] = useState<'code' | 'io'>('code');

  useEffect(() => {
    getRuntimes().then(setRuntimes);
    const h = takeHandoff();
    if (h) {
      setLang(h.lang);
      setCode(h.code);
      setCases([{ input: h.stdin || '' }]);
      setSnippetId(null);
      if (startVisualize && (h.lang === 'python' || h.lang === 'java')) visualize(h.lang, h.code, h.stdin || '');
    } else if (startVisualize) setMode('edit');
    if ((h?.lang || lang) === 'python') warmPython();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (getDoc<string>('buffer', lang) !== code) actions.setDoc('buffer', lang, code);
    }, 300);
    return () => clearTimeout(t);
  }, [code, lang]);

  const unavailable = lang !== 'python' && runtimes[lang] && !runtimes[lang].available ? runtimes[lang].reason : '';

  function switchLang(l: CodeLang) {
    setLang(l);
    setCode(loadBuf(l));
    setSnippetId(null);
    setCases((c) => c.map((x) => ({ input: x.input })));
    actions.setCodeLang(l);
    if (l === 'python') warmPython();
    if (mode === 'visualize' && l !== 'python' && l !== 'java') setMode('edit');
  }

  async function runAll() {
    if (mobile) setMobilePane('io');
    setCases((cs) => cs.map((c) => ({ ...c, running: true, result: undefined })));
    for (let k = 0; k < cases.length; k++) {
      const r = await runCode(lang, code, cases[k].input);
      setCases((cs) => cs.map((c, j) => (j === k ? { ...c, running: false, result: r } : c)));
    }
    actions.noteActivity();
  }

  async function visualize(l: CodeLang = lang, c: string = code, input: string = cases[activeCase]?.input || '') {
    if (l !== 'python' && l !== 'java') return;
    setMode('visualize');
    setTracing(true);
    setTrace(null);
    setTraceErr('');
    const r = await traceCode(l, c, input);
    setTracing(false);
    if (r.trace) setTrace(r.trace);
    else setTraceErr(r.error || 'Tracing failed');
  }

  function loadSnippet(s: Snippet) {
    setLang(s.language);
    setCode(s.code);
    setCases([{ input: s.stdin }]);
    setSnippetId(s.id);
    setLibOpen(false);
    setMode('edit');
    toast(`Opened "${s.title}"`);
  }

  function save(asNew: boolean) {
    const existing = snippets.find((s) => s.id === snippetId);
    if (existing && !asNew) {
      actions.saveSnippet({ ...existing, code, language: lang, stdin: cases[0]?.input || '' });
      toast('Snippet saved', 'success');
      return;
    }
    setTitle('');
    setSaveOpen(true);
  }

  const current = snippets.find((s) => s.id === snippetId);
  const res = cases[activeCase]?.result;
  const anyRunning = cases.some((c) => c.running);

  const io = (
    <div className="cmp-io">
      <div className="cmp-io-head">
        <div className="case-chips" style={{ margin: 0 }}>
          {cases.map((c, k) => (
            <span key={k} className={`chip${k === activeCase ? ' active' : ''}`} role="button" tabIndex={0} onClick={() => setActiveCase(k)} onKeyDown={(e) => e.key === 'Enter' && setActiveCase(k)}>
              {c.result && <span className={`dot ${c.result.status === 'ok' ? 'ok' : 'bad'}`} />}
              Input {k + 1}
              {cases.length > 1 && (
                <X
                  size={12}
                  style={{ marginLeft: 2, opacity: 0.6 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCases(cases.filter((_, j) => j !== k));
                    setActiveCase(0);
                  }}
                />
              )}
            </span>
          ))}
          {cases.length < 8 && <IconButton label="Add test input" size="sm" icon={<Plus />} onClick={() => { setCases([...cases, { input: '' }]); setActiveCase(cases.length); }} />}
        </div>
      </div>
      <div className="cmp-io-body">
        <label className="case-label" htmlFor="cmp-stdin">
          Input (stdin)
        </label>
        <textarea
          id="cmp-stdin"
          className="textarea"
          rows={4}
          value={cases[activeCase]?.input || ''}
          onChange={(e) => setCases(cases.map((c, j) => (j === activeCase ? { input: e.target.value } : c)))}
          placeholder="Text your program reads with input() / Scanner"
          spellCheck={false}
        />
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 16, marginBottom: 6 }}>
          <span className="case-label" style={{ margin: 0 }}>
            Output
          </span>
          {res && (
            <span className="row" style={{ gap: 8 }}>
              <span className={`small ${res.status === 'ok' ? 'ok-text' : 'bad-text'}`} style={{ fontWeight: 500 }}>
                {res.status === 'ok' ? <CircleCheck size={13} /> : <CircleAlert size={13} />} {STATUS_LABEL[res.status]}
              </span>
              {res.timeMs !== undefined && <span className="xs muted tabular">{res.timeMs} ms</span>}
            </span>
          )}
        </div>
        {cases[activeCase]?.running ? (
          <div className="running" style={{ padding: 20 }}>
            <span className="spinner" />
            {lang === 'python' && pyStatus !== 'ready' ? 'Loading the Python runtime (first run only)…' : lang === 'python' ? 'Running in your browser…' : lang === 'java' ? 'Compiling & running in the sandbox…' : 'Running…'}
          </div>
        ) : res ? (
          <>
            {res.compileOutput && <pre className="console-pre error">{res.compileOutput}</pre>}
            {(res.stdout || !res.compileOutput) && <pre className="console-pre">{res.stdout}</pre>}
            {res.stderr && res.status !== 'ok' && <pre className="console-pre error" style={{ marginTop: 8 }}>{res.stderr}</pre>}
            {res.truncated && <div className="xs muted" style={{ marginTop: 6 }}>Output was truncated.</div>}
          </>
        ) : (
          <div className="console-pre muted" style={{ color: 'var(--text-4)' }}>
            Run the program to see its output.
          </div>
        )}
        <ComplexityPanel code={code} lang={lang} measuredMs={res?.timeMs} />
      </div>
    </div>
  );

  return (
    <div className="cmp">
      <div className="cmp-bar">
        {mode === 'visualize' ? (
          <Button variant="ghost" size="sm" icon={<ArrowLeft />} onClick={() => setMode('edit')}>
            Edit code
          </Button>
        ) : (
          <Select<CodeLang> label="Language" value={lang} onChange={switchLang} options={LANGS.map((l) => ({ value: l, label: LANG_LABEL[l], icon: <span className={`lang-dot ${l}`} /> }))} />
        )}
        {mode === 'edit' && (
          <>
            <Menu
              align="left"
              trigger={({ toggle }) => (
                <Button variant="ghost" size="sm" icon={<BookTemplate />} onClick={toggle}>
                  <span className="hide-mobile">Examples</span>
                </Button>
              )}
              items={[
                { label: 'Starter templates', heading: true },
                ...SAMPLES.map((s) => ({
                  label: s.title,
                  onSelect: () => {
                    setCode(s.code[lang]);
                    setCases([{ input: s.stdin || '' }]);
                    setSnippetId(null);
                  },
                })),
              ]}
            />
            <Button variant="ghost" size="sm" icon={<FolderOpen />} onClick={() => setLibOpen(true)}>
              <span className="hide-mobile">Snippets</span>
            </Button>
            <Button variant="ghost" size="sm" icon={<Save />} onClick={() => save(false)}>
              <span className="hide-mobile">{current ? 'Save' : 'Save as…'}</span>
            </Button>
            {current && (
              <span className="xs muted truncate hide-mobile" style={{ maxWidth: 180 }}>
                {current.title}
              </span>
            )}
          </>
        )}
        <div className="grow" />
        {mode === 'edit' && (
          <>
            <Tooltip label={lang === 'python' || lang === 'java' ? 'Step through execution' : 'Visualizer supports Python and Java'} below>
              <Button variant="secondary" icon={<Workflow />} onClick={() => visualize()} disabled={!(lang === 'python' || lang === 'java') || !!unavailable}>
                <span className="hide-mobile">Visualize</span>
              </Button>
            </Tooltip>
            <Button variant="primary" icon={<Play />} onClick={runAll} loading={anyRunning} disabled={!!unavailable}>
              Run
            </Button>
          </>
        )}
        {mode === 'visualize' && (
          <Badge>
            <span className={`lang-dot ${lang}`} />
            {LANG_LABEL[lang]}
          </Badge>
        )}
      </div>

      {unavailable && mode === 'edit' && (
        <div className="cmp-banner">
          <CircleAlert size={15} />
          <span>{unavailable}</span>
        </div>
      )}

      {mode === 'visualize' ? (
        <div className="cmp-viz">
          {tracing && (
            <div className="running" style={{ padding: 48 }}>
              <span className="spinner" />
              {lang === 'python' && pyStatus !== 'ready' ? 'Loading the Python runtime…' : 'Recording every step of execution…'}
            </div>
          )}
          {traceErr && (
            <div style={{ padding: 24 }}>
              <pre className="console-pre error">{traceErr}</pre>
              <Button style={{ marginTop: 12 }} variant="secondary" icon={<ArrowLeft />} onClick={() => setMode('edit')}>
                Back to the editor
              </Button>
            </div>
          )}
          {trace && <Visualizer trace={trace} code={code} />}
        </div>
      ) : mobile ? (
        <div className="cmp-mobile">
          <div className="ws-mobile-switch">
            <div className="seg" role="radiogroup" aria-label="Pane" style={{ width: '100%' }}>
              {(['code', 'io'] as const).map((p) => (
                <button key={p} role="radio" aria-checked={mobilePane === p} onClick={() => setMobilePane(p)} style={{ flex: 1, justifyContent: 'center', background: mobilePane === p ? 'var(--surface)' : undefined, boxShadow: mobilePane === p ? 'var(--shadow-sm)' : undefined }}>
                  {p === 'code' ? 'Code' : 'Input & Output'}
                </button>
              ))}
            </div>
          </div>
          {mobilePane === 'code' ? (
            <div className="cmp-editor">
              <CodeEditor value={code} onChange={setCode} lang={lang} onRun={runAll} />
            </div>
          ) : (
            <div style={{ overflow: 'auto', flex: 1 }}>{io}</div>
          )}
        </div>
      ) : (
        <div className="cmp-body">
          <div className="cmp-editor">
            <CodeEditor value={code} onChange={setCode} lang={lang} onRun={runAll} />
          </div>
          {io}
        </div>
      )}

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)} title="Save snippet">
        <form
          className="col"
          style={{ gap: 14 }}
          onSubmit={(e) => {
            e.preventDefault();
            const id = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
            actions.saveSnippet({ id, title: title.trim() || 'Untitled', language: lang, code, stdin: cases[0]?.input || '', updatedAt: Date.now() });
            setSnippetId(id);
            setSaveOpen(false);
            toast('Snippet saved', 'success');
          }}
        >
          <div className="field">
            <label htmlFor="sn-title">Title</label>
            <input id="sn-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Two-pointer warmup" maxLength={120} />
          </div>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </form>
      </Modal>

      <Modal open={libOpen} onClose={() => setLibOpen(false)} title="Your snippets" width={520}>
        {snippets.length === 0 ? (
          <EmptyState icon={<FilePlus2 />} title="No saved snippets">
            Use Save to keep code you want to come back to.
          </EmptyState>
        ) : (
          <div className="problem-rows">
            {snippets.map((s) => (
              <div key={s.id} className="problem-row" style={{ padding: '8px 8px 8px 14px' }}>
                <span className={`lang-dot ${s.language}`} />
                <button className="grow truncate" style={{ border: 0, background: 'none', textAlign: 'left', cursor: 'pointer', padding: '4px 0', fontWeight: 500 }} onClick={() => loadSnippet(s)}>
                  {s.title}
                </button>
                <span className="xs muted hide-mobile">{new Date(s.updatedAt).toLocaleDateString()}</span>
                <IconButton
                  label="Delete snippet"
                  tip={false}
                  size="sm"
                  icon={<Trash2 />}
                  onClick={() => {
                    if (confirm(`Delete "${s.title}"? This can't be undone.`)) {
                      actions.deleteSnippet(s.id);
                      if (snippetId === s.id) setSnippetId(null);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export function VisualizePage() {
  return <CompilerPage visualize />;
}
