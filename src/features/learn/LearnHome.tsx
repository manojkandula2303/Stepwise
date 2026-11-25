import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, ChevronRight } from 'lucide-react';
import { CONCEPTS, SUBJECTS, subjectConcepts, subjectsForConcept } from '../../content/curriculum';
import { actions, useStore } from '../../lib/store';
import { ProgressBar } from '../../components/ui';

const ICON: Record<string, string> = { python: 'Py', java: 'Jv', dsa: '{ }' };

export function LearnHome() {
  const completed = useStore((s) => s.completed);
  const bookmarks = useStore((s) => s.bookmarks);
  const navigate = useNavigate();

  return (
    <div className="page page-enter">
      <div className="page-head">
        <div>
          <h1>Learn</h1>
          <p>Every lesson shows the same concept in Python and Java. Switch languages at any time without losing your place.</p>
        </div>
      </div>

      <div className="subject-list">
        {SUBJECTS.filter((s) => subjectConcepts(s).length).map((s) => {
          const all = subjectConcepts(s);
          const done = all.filter((c) => completed[c.concept.id]).length;
          const nextUp = all.find((c) => !completed[c.concept.id]) || all[0];
          const pct = all.length ? done / all.length : 0;
          return (
            <button
              key={s.id}
              className="subject-row"
              onClick={() => {
                if (s.lang) actions.setLearnLang(s.lang);
                navigate(`/learn/${s.id}/${nextUp.concept.id}`);
              }}
            >
              <span className={`subject-icon ${s.id}`}>{ICON[s.id]}</span>
              <span className="grow col" style={{ gap: 4, minWidth: 0 }}>
                <span className="row" style={{ gap: 10 }}>
                  <span className="subject-title">{s.title}</span>
                  <span className="xs muted">
                    {s.modules.length} modules · {all.length} lessons
                  </span>
                </span>
                <span className="small muted">{s.blurb}</span>
                <span className="row" style={{ gap: 10, marginTop: 6, maxWidth: 360 }}>
                  <span className="grow">
                    <ProgressBar value={pct} label={`${s.title} progress`} />
                  </span>
                  <span className="xs muted tabular">{Math.round(pct * 100)}%</span>
                </span>
              </span>
              <span className="subject-cta hide-mobile">
                {done === 0 ? 'Start' : done === all.length ? 'Review' : 'Continue'}
                <ArrowRight size={15} />
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="section-title" style={{ margin: '48px 0 12px' }}>
        Curriculum
      </h2>
      <div className="curriculum-grid">
        {SUBJECTS.filter((s) => subjectConcepts(s).length).map((s) => (
          <div key={s.id} className="curriculum-col">
            <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>
              {s.title}
            </div>
            {s.modules.map((m) => {
              const items = m.concepts.filter((c) => CONCEPTS[c]);
              if (!items.length) return null;
              const d = items.filter((c) => completed[c]).length;
              return (
                <Link key={m.id} to={`/learn/${s.id}/${items[0]}`} className="curriculum-item" onClick={() => s.lang && actions.setLearnLang(s.lang)}>
                  <span className="grow truncate">{m.title}</span>
                  <span className="xs muted tabular">
                    {d}/{items.length}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {bookmarks.length > 0 && (
        <>
          <h2 className="section-title" style={{ margin: '48px 0 12px' }}>
            Bookmarks
          </h2>
          <div className="problem-rows">
            {bookmarks
              .filter((b) => CONCEPTS[b])
              .map((b) => {
                const subj = subjectsForConcept(b)[0];
                return (
                  <Link key={b} to={`/learn/${subj.id}/${b}`} className="problem-row">
                    <Bookmark size={15} className="muted" />
                    <span className="grow truncate">{CONCEPTS[b].title}</span>
                    <span className="xs muted hide-mobile">{subj.title}</span>
                    <ChevronRight size={15} className="muted" />
                  </Link>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
