import { useEffect, useState } from 'react';
import { CircleAlert, CircleCheck, Clock, Lock, Play, RotateCcw, Send } from 'lucide-react';
import { CodeEditor } from '../../components/code/Editor';
import { ComplexityPanel } from '../../components/code/ComplexityPanel';
import { Button, IconButton, Select, Tabs } from '../../components/ui';
import { getRuntimes, runCode, usePythonStatus, warmPython } from '../../lib/runner';
import { LANG_LABEL, type CaseResult, type CodeLang, type CodingTestProblem, type RunResult } from '../../lib/types';
import type { TestCase } from '../../content/infosys/types';
import { STARTER } from './starter';
import { judgeCases, VERDICT_LABEL } from './judge';

const LANGS: CodeLang[] = ['python', 'java', 'cpp', 'c'];

type ConsoleTab = 'cases' | 'custom' | 'result';
type Busy = null | { label: string; done: number; total: number };

export interface Submission {
  cases: CaseResult[];
  passed: number;
  total: number;
  lang: CodeLang;
  submittedAt: number;
}

export function CodingPanel({
  cases,
  code,
  lang,
  onCode,
  onLang,
  onSubmit,
  result,
  locked,
}: {
  cases: TestCase[];
  code: Partial<Record<CodeLang, string>>;
  lang: CodeLang;
  onCode: (lang: CodeLang, code: string) => void;
  onLang: (lang: CodeLang) => void;
  onSubmit: (s: Submission) => void;
  result?: CodingTestProblem['result'];
  locked?: boolean;
}) {
  const source = code[lang] ?? STARTER[lang];
  const [tab, setTab] = useState<ConsoleTab>(result ? 'result' : 'cases');
  const [busy, setBusy] = useState<Busy>(null);
  const [pubRuns, setPubRuns] = useState<{ r: RunResult; v: CaseResult['status'] }[] | null>(null);
  const [custom, setCustom] = useState('');
  const [customOut, setCustomOut] = useState<RunResult | null>(null);
  const [caps, setCaps] = useState<Record<string, { available: boolean; reason?: string }>>({});
  const py = usePythonStatus();
  const pub = cases.filter((c) => c.public);

  useEffect(() => {
    getRuntimes().then(setCaps);
  }, []);
  useEffect(() => {
    if (lang === 'python') warmPython();
  }, [lang]);
  useEffect(() => {
    setPubRuns(null);
  }, [lang]);
  useEffect(() => {
    if (!custom && pub[0]) setCustom(pub[0].input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases]);

  const unavailable = lang !== 'python' && caps[lang] && !caps[lang].available ? caps[lang].reason : null;

  async function runPublic() {
    setTab('cases');
    setBusy({ label: 'Running the public test cases', done: 0, total: pub.length });
    const r = await judgeCases(lang, source, pub, (done) => setBusy((b) => b && { ...b, done }));
    setPubRuns(r.results.map((x, i) => ({ r: x, v: r.verdicts[i].status })));
    setBusy(null);
  }

  async function runCustom() {
    setTab('custom');
    setBusy({ label: 'Running your input', done: 0, total: 1 });
    setCustomOut(await runCode(lang, source, custom, 5000));
    setBusy(null);
  }

  async function submit() {
    setTab('result');
    setBusy({ label: 'Judging against 14 test cases', done: 0, total: cases.length });
    const r = await judgeCases(lang, source, cases, (done) => setBusy((b) => b && { ...b, done }));
    setBusy(null);
    onSubmit({ cases: r.verdicts, passed: r.passed, total: cases.length, lang, submittedAt: Date.now() });
    // Keep the public details visible too.
    setPubRuns(r.results.slice(0, pub.length).map((x, i) => ({ r: x, v: r.verdicts[i].status })));
  }

  return (
    <div className="inf-coding">
      <div className="ws-editor">
        <div className="ws-editor-bar">
          <Select<CodeLang> label="Language" value={lang} onChange={onLang} options={LANGS.map((l) => ({ value: l, label: LANG_LABEL[l], icon: <span className={`lang-dot ${l}`} /> }))} />
          {locked && (
            <span className="xs muted row" style={{ gap: 4 }}>
              <Lock size={12} /> Test submitted: read only
            </span>
          )}
          <div className="grow" />
          {!locked && (
            <IconButton
              label="Reset to the starter template"
              size="sm"
              icon={<RotateCcw />}
              onClick={() => {
                if (source === STARTER[lang] || confirm('Replace your code with the starter template?')) onCode(lang, STARTER[lang]);
              }}
            />
          )}
        </div>
        <div className="ws-editor-body">
          <CodeEditor value={source} onChange={(v) => onCode(lang, v)} lang={lang} readOnly={locked} onRun={locked ? undefined : runPublic} />
        </div>
      </div>

      <div className="ws-console-wrap">
        <div className="console-tabs">
          <Tabs<ConsoleTab>
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'cases', label: 'Public cases' },
              { value: 'custom', label: 'Custom input' },
              { value: 'result', label: result ? `Result ${result.passed}/${result.total}` : 'Result' },
            ]}
          />
        </div>
        <div className="console-body">
          {busy ? (
            <div className="running" style={{ padding: 16 }}>
              <span className="spinner" />
              {lang === 'python' && py !== 'ready' ? 'Loading the Python runtime (first run only)…' : `${busy.label}… ${busy.total > 1 ? `${busy.done}/${busy.total}` : ''}`}
            </div>
          ) : tab === 'cases' ? (
            <PublicResults pub={pub} runs={pubRuns} />
          ) : tab === 'custom' ? (
            <div className="col" style={{ gap: 8 }}>
              <textarea className="textarea mono" rows={5} value={custom} onChange={(e) => setCustom(e.target.value)} spellCheck={false} aria-label="Custom input" />
              <div className="row" style={{ gap: 8 }}>
                <Button size="sm" variant="secondary" icon={<Play />} onClick={runCustom} disabled={!!busy}>
                  Run with this input
                </Button>
              </div>
              {customOut && <RunOutput r={customOut} />}
            </div>
          ) : (
            <SubmissionResult result={result} pubCount={pub.length} />
          )}
          {unavailable && <div className="speech-note" style={{ marginTop: 10 }}>{unavailable}</div>}
          <ComplexityPanel code={source} lang={lang} compact />
        </div>
        {!locked && (
          <div className="ws-runbar">
            <span className="xs muted hide-mobile">
              <kbd className="kbd">Ctrl</kbd> <kbd className="kbd">Enter</kbd> runs the public cases
            </span>
            <div className="grow" />
            <Button variant="secondary" icon={<Play />} onClick={runPublic} disabled={!!busy}>
              Run
            </Button>
            <Button variant="primary" icon={<Send />} onClick={submit} disabled={!!busy}>
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function RunOutput({ r }: { r: RunResult }) {
  return (
    <div>
      <div className="xs muted" style={{ marginBottom: 4 }}>
        {r.status === 'ok' ? 'Output' : r.status.replace('_', ' ')}
        {r.timeMs !== undefined ? ` · ${r.timeMs} ms` : ''}
      </div>
      {r.compileOutput && <pre className="console-pre error">{r.compileOutput}</pre>}
      {(r.stdout || !r.compileOutput) && <pre className="console-pre">{r.stdout || ' '}</pre>}
      {r.stderr && r.status !== 'ok' && <pre className="console-pre error" style={{ marginTop: 6 }}>{r.stderr}</pre>}
    </div>
  );
}

function PublicResults({ pub, runs }: { pub: TestCase[]; runs: { r: RunResult; v: CaseResult['status'] }[] | null }) {
  const [active, setActive] = useState(0);
  const c = pub[active];
  const run = runs?.[active];
  return (
    <div>
      <div className="case-chips" style={{ margin: '0 0 10px' }}>
        {pub.map((_, i) => (
          <span key={i} className={`chip${i === active ? ' active' : ''}`} role="button" tabIndex={0} onClick={() => setActive(i)} onKeyDown={(e) => e.key === 'Enter' && setActive(i)}>
            {runs && <span className={`dot ${runs[i].v === 'pass' ? 'ok' : 'bad'}`} />}
            Case {i + 1}
          </span>
        ))}
      </div>
      {runs && run && (
        <div className={`small ${run.v === 'pass' ? 'ok-text' : 'bad-text'}`} style={{ fontWeight: 600, marginBottom: 8 }}>
          {run.v === 'pass' ? <CircleCheck size={14} /> : <CircleAlert size={14} />} {VERDICT_LABEL[run.v]}
          {run.r.timeMs !== undefined && <span className="xs muted" style={{ fontWeight: 400 }}> · {run.r.timeMs} ms</span>}
        </div>
      )}
      <div className="inf-io-grid">
        <div>
          <div className="case-label">Input</div>
          <pre className="console-pre">{c.input.length > 2000 ? c.input.slice(0, 2000) + '…' : c.input}</pre>
        </div>
        <div>
          <div className="case-label">Expected output</div>
          <pre className="console-pre">{c.output}</pre>
        </div>
      </div>
      {run && (
        <div style={{ marginTop: 10 }}>
          <div className="case-label">Your output</div>
          <RunOutput r={run.r} />
        </div>
      )}
      {!runs && <p className="xs muted" style={{ marginTop: 10 }}>Press Run to test your code on the public cases.</p>}
    </div>
  );
}

export function SubmissionResult({ result, pubCount }: { result?: CodingTestProblem['result']; pubCount: number }) {
  if (!result) return <p className="small muted">Submit to judge your code on all 14 test cases (2 public + 12 hidden).</p>;
  const all = result.passed === result.total;
  return (
    <div>
      <div className={`inf-verdict ${all ? 'ok' : result.passed ? 'partial' : 'bad'}`}>
        {all ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
        <strong>{all ? 'Accepted' : result.passed ? 'Partially correct' : 'Not accepted'}</strong>
        <span className="grow" />
        <span className="tabular">
          {result.passed}/{result.total} cases
        </span>
      </div>
      <div className="inf-case-grid">
        {result.cases.map((c, i) => (
          <div key={i} className={`inf-case ${c.status === 'pass' ? 'ok' : 'bad'}`} title={VERDICT_LABEL[c.status]}>
            <span className="inf-case-name">{i < pubCount ? `Public ${i + 1}` : `Hidden ${i - pubCount + 1}`}</span>
            <span className="inf-case-status">{VERDICT_LABEL[c.status]}</span>
            {c.timeMs !== undefined && (
              <span className="xs muted tabular">
                <Clock size={10} /> {c.timeMs} ms
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="xs muted" style={{ marginTop: 8 }}>
        Submitted in {LANG_LABEL[result.lang]} · {new Date(result.submittedAt).toLocaleTimeString()}. Hidden cases include edge cases and maximum-size inputs; a time limit on the large ones usually means the algorithm is too slow.
      </p>
    </div>
  );
}
