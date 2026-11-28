import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { actions, getDoc, useStore } from '../../lib/store';
import { Button, IconButton, Tabs } from '../../components/ui';
import { PROBLEMS, PROBLEM_BY_ID, generateCases } from '../../content/infosys';
import type { CodeLang } from '../../lib/types';
import { LevelTag, PatternCard, ProblemStatement, Solutions } from './Statement';
import { CodingPanel, type Submission } from './CodingPanel';
import { InfWorkspace } from './Workspace';
import { STARTER } from './starter';
import { practiceStatus } from './LevelPage';

type LeftTab = 'problem' | 'pattern' | 'solution';

/** Practice mode for a single problem: fixed test data (seed 1), unlimited submissions, pattern and solutions available. */
export function ProblemPage() {
  const { id = '' } = useParams();
  const p = PROBLEM_BY_ID[id];
  const navigate = useNavigate();
  const kv = useStore((s) => s.kv);
  const prefLang = useStore((s) => s.prefs.codeLang);
  const [lang, setLang] = useState<CodeLang>(() => (getDoc<CodeLang>('infosys-lang', 'last') || prefLang || 'python') as CodeLang);
  const [tab, setTab] = useState<LeftTab>('problem');
  const [result, setResult] = useState<Submission | undefined>();
  const cases = useMemo(() => (p ? generateCases(p, 1) : []), [p]);
  if (!p) return <Navigate to="/infosys" replace />;

  const list = PROBLEMS[p.level];
  const pos = list.findIndex((x) => x.id === p.id);
  const code = Object.fromEntries((['python', 'java', 'cpp', 'c'] as CodeLang[]).map((l) => [l, kv['infosys-draft']?.[`${p.id}:${l}`] as string | undefined]).filter(([, v]) => v !== undefined));
  const best = practiceStatus(kv, p.id);

  const header = (
    <div className="ws-header">
      <Button variant="ghost" size="sm" icon={<ArrowLeft />} onClick={() => navigate(`/infosys/${p.level}?tab=problems`)}>
        <span className="hide-mobile">Back</span>
      </Button>
      <IconButton label="Previous problem" size="sm" icon={<ChevronLeft />} disabled={pos <= 0} onClick={() => navigate(`/infosys/problem/${list[pos - 1].id}`)} />
      <IconButton label="Next problem" size="sm" icon={<ChevronRight />} disabled={pos >= list.length - 1} onClick={() => navigate(`/infosys/problem/${list[pos + 1].id}`)} />
      <LevelTag level={p.level} />
      <span className="small truncate grow" style={{ fontWeight: 500 }}>
        {p.title}
      </span>
      {best && <span className={`score-badge ${best.passed === 14 ? 'good' : best.passed >= 7 ? 'ok' : 'low'}`}>Best {best.passed}/14</span>}
    </div>
  );

  const left = (
    <>
      <Tabs<LeftTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'problem', label: 'Problem' },
          { value: 'pattern', label: 'Pattern' },
          { value: 'solution', label: 'Solutions' },
        ]}
      />
      <div className="ws-scroll">
        {tab === 'problem' && <ProblemStatement p={p} cases={cases} />}
        {tab === 'pattern' && <PatternCard p={p} />}
        {tab === 'solution' && (
          <>
            <p className="small muted" style={{ marginBottom: 10 }}>
              Try the problem first. Reference solutions read the whole input at once and print one answer.
            </p>
            <Solutions p={p} />
          </>
        )}
      </div>
    </>
  );

  const right = (
    <CodingPanel
      cases={cases}
      code={code}
      lang={lang}
      onLang={(l) => {
        setLang(l);
        actions.setDoc('infosys-lang', 'last', l);
      }}
      onCode={(l, c) => {
        const key = `${p.id}:${l}`;
        if (c === STARTER[l]) actions.removeDoc('infosys-draft', key);
        else if (kv['infosys-draft']?.[key] !== c) actions.setDoc('infosys-draft', key, c);
      }}
      result={result}
      onSubmit={(s) => {
        setResult(s);
        if (!best || s.passed > best.passed) actions.setDoc('infosys-practice', p.id, { passed: s.passed, total: s.total, at: Date.now() });
        if (s.passed === s.total) actions.noteActivity();
      }}
    />
  );

  return <InfWorkspace header={header} left={left} right={right} />;
}
