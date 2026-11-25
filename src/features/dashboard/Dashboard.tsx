import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Bookmark, BookOpen, CircleCheck, CircleX, Flame, ChevronRight, Timer } from 'lucide-react';
import { PREP_TOPICS, SPACES, locateTopic, spaceTopics } from '../../content/prep/curriculum';
import { pct } from '../prep/tests';
import { CONCEPTS, SUBJECTS, subjectConcepts, subjectsForConcept } from '../../content/curriculum';
import { LC150, PROBLEMS, PROBLEMS_BY_ID } from '../../content/problems';
import { streakOf, useStore, actions } from '../../lib/store';
import { ProgressBar, Segmented } from '../../components/ui';
import { LANG_LABEL, type LearnLang } from '../../lib/types';
import { openAuth } from '../../components/layout/AppShell';

function Heatmap({ activity }: { activity: Record<string, number> }) {
  const days = useMemo(() => {
    const out: { d: string; n: number }[] = [];
    const t = new Date();
    for (let k = 0; k < 7 * 20; k++) {
      const d = new Date(t);
      d.setDate(t.getDate() - k);
      const key = d.toISOString().slice(0, 10);
      out.push({ d: key, n: activity[key] || 0 });
    }
    return out;
  }, [activity]);
  const lvl = (n: number) => (n === 0 ? '' : n < 2 ? 'l1' : n < 4 ? 'l2' : n < 8 ? 'l3' : 'l4');
  return (
    <div className="heatmap" role="img" aria-label="Coding activity over the last 20 weeks">
      {days.map((x) => (
        <span key={x.d} className={`heat ${lvl(x.n)}`} title={`${x.d}: ${x.n} activit${x.n === 1 ? 'y' : 'ies'}`} />
      ))}
    </div>
  );
}

export function Dashboard() {
  const s = useStore((st) => st);
  const lang: LearnLang = s.prefs.learnLang || 'python';
  const streak = streakOf(s.activity);
  const solvedIds = Object.entries(s.problems).filter(([, p]) => p.status === 'solved').map(([id]) => id);
  const lcSolved = LC150.filter((p) => s.problems[p.id]?.status === 'solved').length;
  const accepted = s.submissions.filter((x) => x.verdict === 'Accepted').length;
  const accuracy = s.submissions.length ? Math.round((accepted / s.submissions.length) * 100) : null;
  const conceptsDone = Object.keys(s.completed).filter((c) => CONCEPTS[c]).length;

  let last: { subject: string; concept: string } | null = null;
  try {
    last = JSON.parse(localStorage.getItem('sw-last-concept') || 'null');
  } catch {
    /* ignore */
  }
  const lastConcept = last && CONCEPTS[last.concept];
  const resume = (() => {
    if (lastConcept && last) {
      const subj = SUBJECTS.find((x) => x.id === last!.subject)!;
      const flat = subjectConcepts(subj);
      const i = flat.findIndex((c) => c.concept.id === last!.concept);
      const target = s.completed[last.concept] && flat[i + 1] ? flat[i + 1] : flat[i];
      return { subject: subj, concept: target.concept };
    }
    const subj = SUBJECTS[0];
    return { subject: subj, concept: subjectConcepts(subj)[0].concept };
  })();

  const achievements = [
    { title: 'First lesson', desc: 'Complete any lesson', earned: conceptsDone >= 1 },
    { title: 'First accepted', desc: 'Solve a problem', earned: solvedIds.length >= 1 },
    { title: 'Bilingual', desc: 'Solve problems in Python and Java', earned: new Set(s.submissions.filter((x) => x.verdict === 'Accepted').map((x) => x.language)).size >= 2 },
    { title: 'On a roll', desc: 'Keep a 7-day streak', earned: streak >= 7 },
    { title: 'Interview ready', desc: 'Solve 50 of the LeetCode 150', earned: lcSolved >= 50 },
  ];

  const recent = s.submissions.slice(0, 6);
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  })();

  return (
    <div className="page page-enter">
      <div className="page-head dash-greeting">
        <div>
          <h1>
            {greeting}
            {s.user ? `, ${s.user.name.split(' ')[0]}` : ''}
          </h1>
          <p>
            {streak > 0 ? (
              <>
                <Flame size={14} style={{ verticalAlign: -2, color: 'var(--warning)' }} /> {streak}-day streak. Keep it going.
              </>
            ) : (
              'Pick up where you left off, or start something new.'
            )}
          </p>
        </div>
        <div className="col" style={{ gap: 6, alignItems: 'flex-end' }}>
          <span className="xs muted">Preferred language</span>
          <Segmented<LearnLang>
            size="sm"
            label="Preferred language"
            value={lang}
            onChange={(l) => {
              actions.setLearnLang(l);
              actions.setCodeLang(l);
            }}
            options={[
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
            ]}
          />
        </div>
      </div>

      {!s.user && s.ready && (
        <div className="topic-lesson-link" style={{ marginBottom: 24 }}>
          <span className="grow">You're learning as a guest — progress is stored in this browser. Create an account to sync across devices.</span>
          <button className="link-btn" style={{ fontSize: 13 }} onClick={() => openAuth.current('signup')}>
            Create account
          </button>
        </div>
      )}

      <Link to={`/learn/${resume.subject.id}/${resume.concept.id}`} className="continue">
        <BookOpen size={20} />
        <span className="grow col" style={{ minWidth: 0 }}>
          <span className="muted-inv">{lastConcept ? 'Continue learning' : 'Start learning'} · {resume.subject.title}</span>
          <span className="truncate" style={{ fontWeight: 600 }}>
            {resume.concept.title}
          </span>
        </span>
        <ArrowRight size={18} />
      </Link>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{conceptsDone}</div>
          <div className="stat-label">Lessons completed</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {solvedIds.length}
            <span className="muted" style={{ fontSize: 'var(--text-md)', fontWeight: 400 }}>
              /{PROBLEMS.length}
            </span>
          </div>
          <div className="stat-label">Problems solved</div>
        </div>
        <div className="stat">
          <div className="stat-value">{Math.round((lcSolved / Math.max(1, LC150.length)) * 100)}%</div>
          <div className="stat-label">LeetCode 150</div>
        </div>
        <div className="stat">
          <div className="stat-value">{accuracy === null ? '—' : `${accuracy}%`}</div>
          <div className="stat-label">Submission accuracy</div>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Learning progress</h2>
              <Link to="/learn" className="xs muted">
                All subjects
              </Link>
            </div>
            {SUBJECTS.map((subj) => {
              const all = subjectConcepts(subj);
              const d = all.filter((c) => s.completed[c.concept.id]).length;
              if (!all.length) return null;
              return (
                <Link key={subj.id} to={`/learn/${subj.id}/${(all.find((c) => !s.completed[c.concept.id]) || all[0]).concept.id}`} className="track-row">
                  <span style={{ fontWeight: 500 }} className="truncate">
                    {subj.id === 'dsa' ? 'DSA' : subj.title}
                  </span>
                  <ProgressBar value={all.length ? d / all.length : 0} label={`${subj.title} progress`} />
                  <span className="xs muted tabular" style={{ textAlign: 'right' }}>
                    {d}/{all.length}
                  </span>
                </Link>
              );
            })}
            <Link to="/lc150" className="track-row">
              <span style={{ fontWeight: 500 }}>LeetCode 150</span>
              <ProgressBar value={lcSolved / Math.max(1, LC150.length)} tone="success" label="LeetCode 150 progress" />
              <span className="xs muted tabular" style={{ textAlign: 'right' }}>
                {lcSolved}/{LC150.length}
              </span>
            </Link>
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Activity</h2>
              <span className="xs muted">Last 20 weeks</span>
            </div>
            <Heatmap activity={s.activity} />
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Recent submissions</h2>
              <Link to="/practice" className="xs muted">
                Practice
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="small muted">No submissions yet. Solve a problem in Practice or the LeetCode 150 to see it here.</p>
            ) : (
              recent.map((r) => {
                const p = PROBLEMS_BY_ID[r.problemId];
                if (!p) return null;
                return (
                  <Link key={r.id} to={`/${p.lc150 ? 'lc150' : 'practice'}/${p.id}`} className="activity-item">
                    {r.verdict === 'Accepted' ? <CircleCheck size={15} style={{ color: 'var(--success)' }} /> : <CircleX size={15} style={{ color: 'var(--danger)' }} />}
                    <span className="grow truncate">{p.title}</span>
                    <span className="xs muted">{LANG_LABEL[r.language]}</span>
                    <span className="xs muted hide-mobile">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </Link>
                );
              })
            )}
          </section>
        </div>

        <div>
          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Placement prep</h2>
              <Link to="/prep" className="xs muted">
                Open
              </Link>
            </div>
            {SPACES.map((sp) => {
              const all = spaceTopics(sp);
              const d = all.filter((t) => s.completed[t.topic.id]).length;
              return (
                <Link key={sp.id} to={`/prep/${sp.id}`} className="track-row">
                  <span style={{ fontWeight: 500 }} className="truncate">{sp.short}</span>
                  <ProgressBar value={all.length ? d / all.length : 0} label={`${sp.title} progress`} />
                  <span className="xs muted tabular" style={{ textAlign: 'right' }}>
                    {d}/{all.length}
                  </span>
                </Link>
              );
            })}
            {s.attempts.slice(0, 4).map((a) => {
              const p = pct(a);
              return (
                <Link key={a.id} to={`/prep/result/${a.id}`} className="activity-item">
                  <Timer size={14} className="muted" />
                  <span className="grow truncate">{a.title}</span>
                  <span className="xs tabular" style={{ color: p >= 80 ? 'var(--success)' : p >= 50 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>{p}%</span>
                </Link>
              );
            })}
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Saved</h2>
            </div>
            {s.bookmarks.length === 0 && !Object.values(s.problems).some((p) => p.saved) ? (
              <p className="small muted">Bookmark lessons and save problems to find them here.</p>
            ) : (
              <>
                {s.bookmarks
                  .filter((b) => CONCEPTS[b])
                  .slice(0, 5)
                  .map((b) => (
                    <Link key={b} to={`/learn/${subjectsForConcept(b)[0].id}/${b}`} className="activity-item">
                      <Bookmark size={14} className="muted" />
                      <span className="grow truncate">{CONCEPTS[b].title}</span>
                      <ChevronRight size={14} className="muted" />
                    </Link>
                  ))}
                {s.bookmarks
                  .filter((b) => PREP_TOPICS[b])
                  .slice(0, 5)
                  .map((b) => (
                    <Link key={b} to={`/prep/${locateTopic(b)?.space.id}/${b}`} className="activity-item">
                      <Bookmark size={14} className="muted" />
                      <span className="grow truncate">{PREP_TOPICS[b].title}</span>
                      <ChevronRight size={14} className="muted" />
                    </Link>
                  ))}
                {Object.entries(s.problems)
                  .filter(([id, p]) => p.saved && PROBLEMS_BY_ID[id])
                  .slice(0, 5)
                  .map(([id]) => (
                    <Link key={id} to={`/${PROBLEMS_BY_ID[id].lc150 ? 'lc150' : 'practice'}/${id}`} className="activity-item">
                      <Bookmark size={14} style={{ color: 'var(--accent)' }} />
                      <span className="grow truncate">{PROBLEMS_BY_ID[id].title}</span>
                      <ChevronRight size={14} className="muted" />
                    </Link>
                  ))}
              </>
            )}
          </section>

          <section className="dash-section">
            <div className="dash-section-head">
              <h2>Achievements</h2>
              <span className="xs muted">
                {achievements.filter((a) => a.earned).length}/{achievements.length}
              </span>
            </div>
            <div className="achievements">
              {achievements.map((a) => (
                <div key={a.title} className={`achievement${a.earned ? ' earned' : ''}`}>
                  <span className="medal">
                    <Award size={15} />
                  </span>
                  <span className="col">
                    <span className="a-title" style={{ fontWeight: 500 }}>
                      {a.title}
                    </span>
                    <span className="xs muted">{a.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
