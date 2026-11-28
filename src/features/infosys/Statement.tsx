import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lightbulb, Lock } from 'lucide-react';
import type { InfosysProblem, TestCase } from '../../content/infosys/types';
import { levelById } from '../../content/infosys';
import { CodeBlock } from '../../components/code';
import { Button, Segmented } from '../../components/ui';
import { Markdown } from '../prep/Practice';
import { CONCEPTS, subjectsForConcept } from '../../content/curriculum';

export const LEVEL_TONE: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'danger', complex: 'accent' };

export function LevelTag({ level }: { level: string }) {
  return <span className={`inf-level inf-level-${level}`}>{levelById(level)?.title || level}</span>;
}

export function topicTitle(level: string, id: string) {
  return levelById(level)?.topics.find((t) => t.id === id)?.title || id;
}

/** Problem statement in the Infosys format: story, input/output format, constraints, sample cases. */
export function ProblemStatement({ p, cases, showLevel = true }: { p: InfosysProblem; cases: TestCase[]; showLevel?: boolean }) {
  const pub = cases.filter((c) => c.public);
  return (
    <div className="inf-statement">
      <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {showLevel && <LevelTag level={p.level} />}
        {p.topics.map((t) => (
          <span key={t} className="inf-topic">
            {topicTitle(p.level, t)}
          </span>
        ))}
      </div>
      <h1 className="ws-title">{p.title}</h1>
      <Markdown md={p.statement} className="prose inf-prose" />
      <h3 className="inf-h3">Input format</h3>
      <p className="inf-pre-text">{p.inputFormat}</p>
      <h3 className="inf-h3">Output format</h3>
      <p className="inf-pre-text">{p.outputFormat}</p>
      <h3 className="inf-h3">Constraints</h3>
      <ul className="inf-constraints">
        {p.constraints.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {pub.map((c, i) => (
        <div key={i} className="inf-sample">
          <div className="inf-sample-col">
            <div className="inf-sample-label">Sample input {i + 1}</div>
            <pre className="console-pre">{trimSample(c.input)}</pre>
          </div>
          <div className="inf-sample-col">
            <div className="inf-sample-label">Sample output {i + 1}</div>
            <pre className="console-pre">{c.output}</pre>
          </div>
        </div>
      ))}
      <p className="xs muted" style={{ marginTop: 8 }}>
        <Lock size={11} style={{ verticalAlign: -1 }} /> Your code is judged on these 2 public cases and 12 hidden cases (edge cases, random cases and maximum-size inputs).
      </p>
    </div>
  );
}

const trimSample = (s: string) => {
  const ls = s.replace(/\n$/, '').split('\n');
  return ls.length > 40 ? [...ls.slice(0, 40), `… (${ls.length - 40} more lines)`].join('\n') : ls.join('\n');
};

/** The pattern behind a problem: how to recognise it, the approach, complexity and pitfalls. */
export function PatternCard({ p, collapsible = false }: { p: InfosysProblem; collapsible?: boolean }) {
  const [open, setOpen] = useState(!collapsible);
  if (!open)
    return (
      <Button variant="secondary" icon={<Lightbulb />} onClick={() => setOpen(true)}>
        Show the pattern &amp; approach
      </Button>
    );
  return (
    <div className="inf-pattern">
      <div className="inf-pattern-head">
        <Lightbulb size={16} />
        <strong className="grow">Pattern: {p.pattern.name}</strong>
        {collapsible && (
          <button className="link-btn xs" onClick={() => setOpen(false)}>
            <EyeOff size={12} /> Hide
          </button>
        )}
      </div>
      <p className="small">
        <strong>Recognise it:</strong> {p.pattern.recognize}
      </p>
      <ol className="inf-steps">
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
      </div>
      {p.pattern.pitfalls && (
        <p className="small inf-pitfall">
          <strong>Watch out:</strong> {p.pattern.pitfalls}
        </p>
      )}
      {p.walkthrough && (
        <p className="small muted" style={{ whiteSpace: 'pre-wrap' }}>
          <strong>Walk-through:</strong> {p.walkthrough}
        </p>
      )}
    </div>
  );
}

export function Solutions({ p, locked }: { p: InfosysProblem; locked?: string }) {
  const [lang, setLang] = useState<'python' | 'java'>('python');
  const [show, setShow] = useState(false);
  if (locked) return <p className="small muted"><Lock size={12} style={{ verticalAlign: -1 }} /> {locked}</p>;
  if (!show)
    return (
      <Button variant="ghost" icon={<Eye />} onClick={() => setShow(true)}>
        Show reference solutions
      </Button>
    );
  return (
    <div className="col" style={{ gap: 8 }}>
      <Segmented<'python' | 'java'> size="sm" label="Solution language" value={lang} onChange={setLang} options={[{ value: 'python', label: 'Python' }, { value: 'java', label: 'Java' }]} />
      <CodeBlock code={p.solutions[lang]} lang={lang} title={lang === 'python' ? 'solution.py' : 'Main.java'} />
    </div>
  );
}

/** Links to the matching lessons in Learn. */
export function LessonLinks({ ids }: { ids: string[] }) {
  const items = ids.filter((id) => CONCEPTS[id]);
  if (!items.length) return null;
  return (
    <span className="inf-lessons">
      {items.map((id) => (
        <Link key={id} to={`/learn/${subjectsForConcept(id)[0]?.id || 'dsa'}/${id}`} className="inf-lesson-link">
          {CONCEPTS[id].title}
        </Link>
      ))}
    </span>
  );
}
