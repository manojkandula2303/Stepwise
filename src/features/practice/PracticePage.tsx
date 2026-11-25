import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { PROBLEMS, TOPICS, problemsForTopic } from '../../content/problems';
import { CONCEPTS, subjectsForConcept } from '../../content/curriculum';
import { useStore } from '../../lib/store';
import { ProblemTable } from './ProblemTable';
import { ProgressBar } from '../../components/ui';

export function PracticePage() {
  const [params, setParams] = useSearchParams();
  const topic = params.get('topic') || 'all';
  const progress = useStore((s) => s.problems);
  const topics = TOPICS.filter((t) => problemsForTopic(t.id).length);
  const list = topic === 'all' ? PROBLEMS : problemsForTopic(topic);
  const current = TOPICS.find((t) => t.id === topic);
  const concept = current?.concept && CONCEPTS[current.concept];
  const conceptSubject = concept ? subjectsForConcept(concept.id).find((s) => s.id === 'dsa') || subjectsForConcept(concept.id)[0] : null;
  const solvedAll = PROBLEMS.filter((p) => progress[p.id]?.status === 'solved').length;

  return (
    <div className="page page-enter">
      <div className="page-head">
        <div>
          <h1>Practice</h1>
          <p>Topic-wise problems from beginner to advanced. Every problem runs against real test cases in Python, Java, C++ or C.</p>
        </div>
        <div className="col" style={{ gap: 6, minWidth: 180 }}>
          <span className="xs muted">
            {solvedAll} of {PROBLEMS.length} solved
          </span>
          <ProgressBar value={PROBLEMS.length ? solvedAll / PROBLEMS.length : 0} tone="success" label="Practice progress" />
        </div>
      </div>

      <div className="practice-layout">
        <nav className="topic-nav" aria-label="Topics">
          <button className={`topic-link${topic === 'all' ? ' active' : ''}`} onClick={() => setParams({})}>
            <span className="grow">All problems</span>
            <span className="xs muted tabular">{PROBLEMS.length}</span>
          </button>
          {topics.map((t) => {
            const items = problemsForTopic(t.id);
            const solved = items.filter((p) => progress[p.id]?.status === 'solved').length;
            return (
              <button key={t.id} className={`topic-link${topic === t.id ? ' active' : ''}`} onClick={() => setParams({ topic: t.id })}>
                <span className="grow truncate">{t.title}</span>
                <span className="xs muted tabular">
                  {solved}/{items.length}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="grow" style={{ minWidth: 0 }}>
          {concept && conceptSubject && (
            <Link to={`/learn/${conceptSubject.id}/${concept.id}`} className="topic-lesson-link">
              <BookOpen size={15} />
              <span className="grow">
                New to {current!.title.toLowerCase()}? Read the lesson <strong>{concept.title}</strong> first.
              </span>
            </Link>
          )}
          <ProblemTable key={topic} problems={list} base="/practice" showTopic={topic === 'all'} groupByTopic={topic === 'all'} />
        </div>
      </div>
    </div>
  );
}
