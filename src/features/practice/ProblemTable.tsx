import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CircleCheck, CircleDashed, Search, SearchX } from 'lucide-react';
import { TOPIC_TITLE, metaLangs, type ProblemMeta } from '../../content/problems';
import { actions, useStore } from '../../lib/store';
import { DifficultyLabel, EmptyState, Select, IconButton } from '../../components/ui';
import { LANG_LABEL, type CodeLang } from '../../lib/types';

type Status = 'all' | 'todo' | 'solved' | 'attempted' | 'saved';

export function ProblemTable({ problems, base, numbered, showTopic = true, topicFilter, groupByTopic }: { problems: ProblemMeta[]; base: string; numbered?: boolean; showTopic?: boolean; topicFilter?: boolean; groupByTopic?: boolean }) {
  const progress = useStore((s) => s.problems);
  const [q, setQ] = useState('');
  const [diff, setDiff] = useState('all');
  const [status, setStatus] = useState<Status>('all');
  const [lang, setLang] = useState<'all' | CodeLang>('all');
  const [topic, setTopic] = useState('all');

  const topics = useMemo(() => Array.from(new Set(problems.map((p) => p.topic))), [problems]);
  const index = useMemo(() => new Map(problems.map((p, i) => [p.id, i])), [problems]);

  const rows = problems.filter((p) => {
    const pr = progress[p.id];
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (diff !== 'all' && p.difficulty !== diff) return false;
    if (topic !== 'all' && p.topic !== topic) return false;
    if (lang !== 'all' && !metaLangs(p).includes(lang)) return false;
    if (status === 'solved' && pr?.status !== 'solved') return false;
    if (status === 'attempted' && pr?.status !== 'attempted') return false;
    if (status === 'todo' && pr?.status === 'solved') return false;
    if (status === 'saved' && !pr?.saved) return false;
    return true;
  });

  const groups = groupByTopic && topic === 'all' && !q ? topics.map((t) => ({ t, items: rows.filter((r) => r.topic === t) })).filter((g) => g.items.length) : [{ t: '', items: rows }];

  return (
    <div>
      <div className="filters">
        <div className="search grow" style={{ minWidth: 180 }}>
          <Search />
          <input className="input" placeholder="Search problems" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search problems" />
        </div>
        <div className="row filter-selects">
          {topicFilter && (
            <Select label="Topic" value={topic} onChange={setTopic} options={[{ value: 'all', label: 'All topics' }, ...topics.map((t) => ({ value: t, label: TOPIC_TITLE[t] || t }))]} />
          )}
          <Select
            label="Difficulty"
            value={diff}
            onChange={setDiff}
            options={[
              { value: 'all', label: 'Any difficulty' },
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
            ]}
          />
          <Select<Status>
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'Any status' },
              { value: 'todo', label: 'Unsolved' },
              { value: 'attempted', label: 'Attempted' },
              { value: 'solved', label: 'Solved' },
              { value: 'saved', label: 'Saved' },
            ]}
          />
          <Select<'all' | CodeLang>
            label="Language"
            value={lang}
            onChange={setLang}
            options={[{ value: 'all', label: 'Any language' }, ...(['python', 'java', 'cpp', 'c'] as CodeLang[]).map((l) => ({ value: l, label: LANG_LABEL[l] }))]}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<SearchX />} title="No problems match these filters">
          Try clearing a filter or searching for something else.
        </EmptyState>
      ) : (
        groups.map((g) => (
          <div key={g.t || 'all'} className="ptable-group">
            {g.t && (
              <div className="ptable-group-head">
                <span>{TOPIC_TITLE[g.t]}</span>
                <span className="xs muted tabular">
                  {g.items.filter((p) => progress[p.id]?.status === 'solved').length}/{g.items.length}
                </span>
              </div>
            )}
            <div className="ptable" role="table">
              {g.items.map((p) => {
                const pr = progress[p.id];
                return (
                  <div key={p.id} className="ptable-row" role="row">
                    <span className="ptable-status" title={pr?.status || 'todo'}>
                      {pr?.status === 'solved' ? <CircleCheck size={16} className="ok" /> : pr?.status === 'attempted' ? <CircleDashed size={16} className="warn" /> : <span className="todo-dot" />}
                    </span>
                    <Link to={`${base}/${p.id}`} className="ptable-title grow">
                      {numbered && <span className="muted tabular ptable-num">{(index.get(p.id) ?? 0) + 1}.</span>}
                      <span className="truncate">{p.title}</span>
                    </Link>
                    {showTopic && !g.t && <span className="xs muted hide-mobile ptable-topic">{TOPIC_TITLE[p.topic]}</span>}
                    <span className="ptable-diff">
                      <DifficultyLabel value={p.difficulty} />
                    </span>
                    <IconButton label={pr?.saved ? 'Unsave' : 'Save'} tip={false} size="sm" icon={pr?.saved ? <BookmarkCheck /> : <Bookmark />} className={pr?.saved ? '' : 'save-btn'} onClick={() => actions.patchProblem(p.id, { saved: !pr?.saved })} />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
