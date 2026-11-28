/**
 * Self-report inventories for the psychometric section. There are no right answers: each
 * statement is rated 1–5 and averaged into trait scores with plain-language interpretation.
 * Items are original wording modelled on the widely used Big Five framework.
 */
import { actions, getDoc } from '../../lib/store';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, ProgressBar } from '../../components/ui';

interface Item {
  text: string;
  trait: string;
  reverse?: boolean;
}
interface Trait {
  id: string;
  name: string;
  high: string;
  low: string;
  work: string;
}
interface Inventory {
  title: string;
  intro: string;
  traits: Trait[];
  items: Item[];
}

const INVENTORIES: Record<string, Inventory> = {
  personality: {
    title: 'Big Five personality profile',
    intro: 'Rate how accurately each statement describes you as you usually are at work or study — not as you wish to be. There are no right answers; employers use these profiles to understand fit, not to pass or fail you.',
    traits: [
      { id: 'O', name: 'Openness', high: 'curious, imaginative, enjoys new ideas and approaches', low: 'practical, prefers proven methods and familiar routines', work: 'High scorers thrive in research, design and fast-changing roles; low scorers bring consistency to process-driven work.' },
      { id: 'C', name: 'Conscientiousness', high: 'organised, dependable, plans ahead and follows through', low: 'flexible and spontaneous, may find routine and detail tiring', work: 'The trait most consistently linked to job performance across roles. Show it with examples of deadlines met and work checked.' },
      { id: 'E', name: 'Extraversion', high: 'energised by people, talkative, comfortable taking the lead in groups', low: 'reserved, energised by focused solo work, thinks before speaking', work: 'Neither end is better: client-facing and sales roles suit extraverts; deep technical work often suits introverts.' },
      { id: 'A', name: 'Agreeableness', high: 'cooperative, trusting, considerate of others\' feelings', low: 'direct, sceptical, comfortable with disagreement', work: 'High scorers build team harmony; lower scorers can be valuable in negotiation and critical review.' },
      { id: 'N', name: 'Emotional Stability', high: 'calm under pressure, recovers quickly from setbacks', low: 'feels stress and worry more intensely', work: 'Stability helps in high-pressure roles. Lower scorers benefit from stress-management routines (see the Stress Management topic).' },
    ],
    items: [
      { text: 'I enjoy exploring ideas that are new to me.', trait: 'O' },
      { text: 'I prefer to stick with methods I already know.', trait: 'O', reverse: true },
      { text: 'I often think of unusual ways to solve problems.', trait: 'O' },
      { text: 'Abstract or theoretical discussions bore me.', trait: 'O', reverse: true },
      { text: 'I finish tasks well before their deadlines.', trait: 'C' },
      { text: 'I often leave things until the last minute.', trait: 'C', reverse: true },
      { text: 'I keep my work and files well organised.', trait: 'C' },
      { text: 'I sometimes skip details when I am in a hurry.', trait: 'C', reverse: true },
      { text: 'I feel energised after spending time with a group.', trait: 'E' },
      { text: 'I prefer to stay in the background at events.', trait: 'E', reverse: true },
      { text: 'I find it easy to start conversations with strangers.', trait: 'E' },
      { text: 'Long meetings with many people tire me out.', trait: 'E', reverse: true },
      { text: 'I go out of my way to help colleagues.', trait: 'A' },
      { text: 'I find it hard to sympathise with others\' problems.', trait: 'A', reverse: true },
      { text: 'I try to see things from other people\'s point of view.', trait: 'A' },
      { text: 'I tend to argue my point even when it upsets people.', trait: 'A', reverse: true },
      { text: 'I stay calm when things go wrong.', trait: 'N' },
      { text: 'I worry about things that might go wrong.', trait: 'N', reverse: true },
      { text: 'I recover quickly after criticism.', trait: 'N' },
      { text: 'My mood changes often during the day.', trait: 'N', reverse: true },
    ],
  },
  'work-preferences': {
    title: 'Work preferences profile',
    intro: 'Rate how much you agree with each statement. The result shows the working environment where you are likely to be most productive — useful for answering "What kind of team do you want to work in?"',
    traits: [
      { id: 'S', name: 'Structure', high: 'clear processes, defined roles and predictable schedules', low: 'freedom to define your own approach and change course', work: 'Structured: large organisations, regulated industries. Flexible: start-ups, research, consulting.' },
      { id: 'T', name: 'Collaboration', high: 'working closely with a team and frequent discussion', low: 'independent ownership of a clear piece of work', work: 'Mention concrete examples of both — most roles need some of each.' },
      { id: 'D', name: 'Detail focus', high: 'precision, careful checking and getting specifics right', low: 'big-picture thinking, strategy and connecting ideas', work: 'Detail: QA, finance, compliance, backend engineering. Big picture: product, architecture, management.' },
      { id: 'P', name: 'Pace', high: 'fast-moving, varied work with frequent change', low: 'steady, deep work on fewer things at a time', work: 'Know your preference and how you adapt when the pace is not your favourite.' },
    ],
    items: [
      { text: 'I work best when the process is clearly defined.', trait: 'S' },
      { text: 'I like deciding for myself how a task should be done.', trait: 'S', reverse: true },
      { text: 'Clear job descriptions help me perform well.', trait: 'S' },
      { text: 'I prefer solving problems with others over working alone.', trait: 'T' },
      { text: 'I do my best work when I can focus without interruption.', trait: 'T', reverse: true },
      { text: 'Regular team discussions improve my work.', trait: 'T' },
      { text: 'I notice small errors that others miss.', trait: 'D' },
      { text: 'I would rather plan the overall direction than handle details.', trait: 'D', reverse: true },
      { text: 'I double-check my work before submitting it.', trait: 'D' },
      { text: 'I enjoy juggling several tasks at once.', trait: 'P' },
      { text: 'I prefer to finish one thing completely before starting another.', trait: 'P', reverse: true },
      { text: 'Frequent change keeps work interesting for me.', trait: 'P' },
    ],
  },
};

const SCALE = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

export function AssessmentBlock({ kind }: { kind: string }) {
  const inv = INVENTORIES[kind];
  const key = `sw-assess-${kind}`;
  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    const saved = getDoc<(number | null)[]>('assessment', kind, key);
    if (Array.isArray(saved) && saved.length === inv?.items.length) return saved;
    return inv ? inv.items.map(() => null) : [];
  });
  const [showResult, setShowResult] = useState(() => answers.every((a) => a !== null));
  if (!inv) return null;

  const set = (i: number, v: number) => {
    const next = answers.map((a, j) => (j === i ? v : a));
    setAnswers(next);
    actions.setDoc('assessment', kind, next);
  };
  const done = answers.filter((a) => a !== null).length;

  const scores = inv.traits.map((t) => {
    const items = inv.items.map((it, i) => ({ it, a: answers[i] })).filter((x) => x.it.trait === t.id && x.a !== null);
    const avg = items.length ? items.reduce((s, x) => s + (x.it.reverse ? 6 - x.a! : x.a!), 0) / items.length : 0;
    return { t, score: Math.round(((avg - 1) / 4) * 100) };
  });

  return (
    <div className="assessment">
      <div className="assessment-head">
        <div style={{ fontWeight: 600 }}>{inv.title}</div>
        <p className="small muted">{inv.intro}</p>
        <div className="row" style={{ gap: 10 }}>
          <div className="grow">
            <ProgressBar value={done / inv.items.length} label="Assessment progress" />
          </div>
          <span className="xs muted tabular">
            {done}/{inv.items.length}
          </span>
        </div>
      </div>
      {!showResult ? (
        <>
          <ol className="likert-list">
            {inv.items.map((it, i) => (
              <li key={i} className="likert-item">
                <div className="small">{it.text}</div>
                <div className="likert-scale" role="radiogroup" aria-label={it.text}>
                  {SCALE.map((label, v) => (
                    <button key={v} role="radio" aria-checked={answers[i] === v + 1} className={`likert-opt${answers[i] === v + 1 ? ' on' : ''}`} onClick={() => set(i, v + 1)} title={label}>
                      <span className="likert-num">{v + 1}</span>
                      <span className="likert-label">{label}</span>
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <Button variant="primary" disabled={done < inv.items.length} onClick={() => setShowResult(true)}>
            {done < inv.items.length ? `Answer all ${inv.items.length} statements to see your profile` : 'See my profile'}
          </Button>
        </>
      ) : (
        <div className="assessment-result">
          {scores.map(({ t, score }) => (
            <div key={t.id} className="trait-row">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong className="small">{t.name}</strong>
                <span className="small tabular">{score}/100</span>
              </div>
              <ProgressBar value={score / 100} tone="accent" label={t.name} />
              <p className="small muted">
                {score >= 60 ? `Higher: ${t.high}.` : score <= 40 ? `Lower: ${t.low}.` : `Balanced: you show both sides — ${t.high}, and at times ${t.low}.`} {t.work}
              </p>
            </div>
          ))}
          <p className="xs muted">This is a learning tool, not a clinical or hiring instrument. Real employer assessments use longer, validated questionnaires — answer them honestly and consistently, as with this one.</p>
          <Button
            variant="secondary"
            icon={<RotateCcw />}
            onClick={() => {
              setAnswers(inv.items.map(() => null));
              setShowResult(false);
              actions.removeDoc('assessment', kind);
            }}
          >
            Retake
          </Button>
        </div>
      )}
    </div>
  );
}
