import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { ArrowLeftRight, CircleCheck, CircleX, Code2, Info, Lightbulb, Play, TriangleAlert, Workflow, RotateCcw } from 'lucide-react';
import type { Block, ExampleBlock, Lang } from '../../content/parse';
import { CodeBlock, OutputBlock } from '../../components/code';
import { Button } from '../../components/ui';
import { Diagram } from './Diagram';
import { runCode, STATUS_LABEL } from '../../lib/runner';
import { openInTool } from '../../lib/handoff';
import { ListenBlock, SpeakBlock } from '../prep/Speech';
import { AssessmentBlock } from '../prep/Assessment';

marked.setOptions({ gfm: true, breaks: false });

const Md = memo(function Md({ md }: { md: string }) {
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
});

function Example({ ex, lang }: { ex: ExampleBlock; lang: Lang }) {
  const navigate = useNavigate();
  const [live, setLive] = useState<{ text: string; error: boolean; label: string } | null>(null);
  const [running, setRunning] = useState(false);
  const code = ex.code[lang];
  const other: Lang = lang === 'python' ? 'java' : 'python';
  const fileName = lang === 'python' ? 'main.py' : 'Main.java';
  const runnable = code && (lang === 'python' || /static\s+void\s+main/.test(code));

  if (!code) {
    const alt = ex.code[other];
    if (!alt) return null;
    return (
      <div className="example missing">
        <div className="callout note">
          <Info />
          <div>
            This example is {other === 'python' ? 'Python' : 'Java'}-specific — {lang === 'python' ? 'Python' : 'Java'} has no direct equivalent. Here it is in{' '}
            {other === 'python' ? 'Python' : 'Java'} for reference.
          </div>
        </div>
        <CodeBlock code={alt} lang={other} title={other === 'python' ? 'main.py' : 'Main.java'} />
      </div>
    );
  }

  async function run() {
    setRunning(true);
    const r = await runCode(lang, code!, '');
    setRunning(false);
    const err = r.status !== 'ok';
    setLive({
      text: err ? [r.stdout, r.compileOutput, r.stderr].filter(Boolean).join('\n') : r.stdout,
      error: err,
      label: err ? STATUS_LABEL[r.status] : `Your run · ${r.timeMs ?? 0} ms`,
    });
  }

  return (
    <div className="example" key={lang}>
      {ex.title && <div className="example-title">{ex.title}</div>}
      <div className="lang-swap" key={lang}>
        <CodeBlock
          code={code}
          lang={lang}
          title={fileName}
          actions={
            runnable ? (
              <>
                <Button size="sm" variant="ghost" icon={<Workflow />} onClick={() => openInTool(navigate, 'visualize', lang, code)} className="hide-mobile">
                  Visualize
                </Button>
                <Button size="sm" variant="ghost" icon={<Code2 />} onClick={() => openInTool(navigate, 'compiler', lang, code)} className="hide-mobile">
                  Edit
                </Button>
                <Button size="sm" variant="ghost" icon={<Play />} loading={running} onClick={run}>
                  Run
                </Button>
              </>
            ) : undefined
          }
        />
        {live ? (
          <div className={`output-block${live.error ? ' error' : ''}`}>
            <div className="output-label row" style={{ justifyContent: 'space-between' }}>
              <span>{live.label}</span>
              <button className="link-btn" onClick={() => setLive(null)}>
                <RotateCcw size={12} /> Expected
              </button>
            </div>
            <pre>{live.text.replace(/\n$/, '') || ' '}</pre>
          </div>
        ) : (
          ex.output[lang] !== undefined && <OutputBlock text={ex.output[lang]!} />
        )}
      </div>
      {runnable && (
        <div className="show-mobile example-mobile-actions">
          <Button size="sm" variant="ghost" icon={<Workflow />} onClick={() => openInTool(navigate, 'visualize', lang, code)}>
            Visualize
          </Button>
          <Button size="sm" variant="ghost" icon={<Code2 />} onClick={() => openInTool(navigate, 'compiler', lang, code)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

function Quiz({ b }: { b: Extract<Block, { type: 'quiz' }> }) {
  const [pick, setPick] = useState<number | null>(null);
  const done = pick !== null;
  return (
    <div className="quiz">
      <div className="quiz-label">Check your understanding</div>
      <Md md={b.question} />
      <div className="quiz-options">
        {b.options.map((o, i) => {
          const state = !done ? '' : i === b.answer ? 'correct' : i === pick ? 'wrong' : 'dim';
          return (
            <button key={i} className={`quiz-option ${state}`} disabled={done} onClick={() => setPick(i)}>
              <span className="quiz-key">{String.fromCharCode(65 + i)}</span>
              <span className="grow" dangerouslySetInnerHTML={{ __html: marked.parseInline(o, { async: false }) as string }} />
              {state === 'correct' && <CircleCheck />}
              {state === 'wrong' && <CircleX />}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="quiz-explain">
          <strong>{pick === b.answer ? 'Correct.' : 'Not quite.'}</strong> <span dangerouslySetInnerHTML={{ __html: marked.parseInline(b.explanation, { async: false }) as string }} />
          {pick !== b.answer && (
            <button className="link-btn" style={{ marginLeft: 8 }} onClick={() => setPick(null)}>
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const CALLOUT = {
  note: { icon: Info, title: null },
  tip: { icon: Lightbulb, title: null },
  warning: { icon: TriangleAlert, title: null },
  compare: { icon: ArrowLeftRight, title: 'Python vs Java' },
};

export function Blocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'md':
            return <Md key={i} md={b.md} />;
          case 'heading':
            return (
              <h2 key={i} id={b.id} className="lesson-h2">
                <a href={`#${b.id}`} dangerouslySetInnerHTML={{ __html: marked.parseInline(b.text, { async: false }) as string }} />
              </h2>
            );
          case 'example':
            return <Example key={i} ex={b} lang={lang} />;
          case 'lang':
            return b.lang === lang ? (
              <div key={`${i}-${lang}`} className="lang-only lang-swap">
                <span className="lang-only-tag">
                  <span className={`lang-dot ${b.lang}`} />
                  {b.lang === 'python' ? 'Python' : 'Java'}
                </span>
                <Blocks blocks={b.blocks} lang={lang} />
              </div>
            ) : null;
          case 'callout': {
            const C = CALLOUT[b.kind];
            return (
              <div key={i} className={`callout ${b.kind}`}>
                <C.icon />
                <div className="grow">
                  {C.title && <div className="callout-title">{C.title}</div>}
                  <Blocks blocks={b.blocks} lang={lang} />
                </div>
              </div>
            );
          }
          case 'complexity':
            return (
              <div key={i} className="complexity">
                {b.rows.map(([k, v]) => (
                  <div key={k} className="complexity-row">
                    <span>{k}</span>
                    <code>{v}</code>
                  </div>
                ))}
              </div>
            );
          case 'viz':
            return <Diagram key={i} kind={b.kind} data={b.data} />;
          case 'quiz':
            return <Quiz key={i} b={b} />;
          case 'speak':
            return <SpeakBlock key={i} text={b.text} mode={b.mode} />;
          case 'listen':
            return <ListenBlock key={i} text={b.text} />;
          case 'assessment':
            return <AssessmentBlock key={i} kind={b.kind} />;
          default:
            return null;
        }
      })}
    </>
  );
}
