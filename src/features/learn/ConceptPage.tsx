import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Check, ChevronLeft, ChevronRight, CircleCheck, Circle, ListTree, X, Target } from 'lucide-react';
import { CONCEPTS, loadConcept, subjectById, subjectConcepts, type Subject } from '../../content/curriculum';
import type { Concept } from '../../content/parse';
import { PROBLEMS_BY_ID, problemsForTopic } from '../../content/problems';
import { actions, useLearnLang, useStore } from '../../lib/store';
import { LangToggle } from '../../components/code';
import { Button, DifficultyLabel, IconButton, ProgressBar } from '../../components/ui';
import { Blocks } from './Blocks';

function Tree({ subject, current, onNavigate }: { subject: Subject; current: string; onNavigate?: () => void }) {
  const completed = useStore((s) => s.completed);
  const currentModule = subject.modules.find((m) => m.concepts.includes(current))?.id;
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [currentModule || '']: true }));
  useEffect(() => {
    if (currentModule) setOpen((o) => ({ ...o, [currentModule]: true }));
  }, [currentModule]);
  const all = subjectConcepts(subject);
  const done = all.filter((c) => completed[c.concept.id]).length;
  return (
    <div className="tree">
      <div className="tree-head">
        <Link to="/learn" className="xs muted row" style={{ gap: 2 }} onClick={onNavigate}>
          <ChevronLeft size={14} /> All subjects
        </Link>
        <div className="tree-subject">{subject.title}</div>
        <div className="row" style={{ gap: 10 }}>
          <div className="grow">
            <ProgressBar value={all.length ? done / all.length : 0} label={`${subject.title} progress`} />
          </div>
          <span className="xs muted tabular">
            {done}/{all.length}
          </span>
        </div>
      </div>
      <nav className="tree-body">
        {subject.modules.map((m, mi) => {
          const items = m.concepts.filter((c) => CONCEPTS[c]);
          if (!items.length) return null;
          const mdone = items.filter((c) => completed[c]).length;
          const isOpen = !!open[m.id];
          return (
            <div key={m.id} className="tree-module">
              <button className="tree-module-btn" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}>
                <span className="tree-num">{String(mi + 1).padStart(2, '0')}</span>
                <span className="grow truncate">{m.title}</span>
                {mdone === items.length ? <CircleCheck size={14} className="tree-done" /> : <span className="xs muted tabular">{mdone}/{items.length}</span>}
              </button>
              <div className="collapse-body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div>
                  {items.map((cid) => (
                    <Link key={cid} to={`/learn/${subject.id}/${cid}`} className={`tree-item${cid === current ? ' active' : ''}`} onClick={onNavigate} aria-current={cid === current ? 'page' : undefined}>
                      {completed[cid] ? <Check size={13} className="tree-done" /> : <Circle size={6} className="tree-dot" />}
                      <span className="truncate">{CONCEPTS[cid].title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function ConceptPage() {
  const { subject: sid = '', concept: cid = '' } = useParams();
  const subject = subjectById(sid);
  const lang = useLearnLang();
  const done = useStore((s) => !!s.completed[cid]);
  const bookmarked = useStore((s) => s.bookmarks.includes(cid));
  const solved = useStore((s) => s.problems);
  const [drawer, setDrawer] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const flat = useMemo(() => (subject ? subjectConcepts(subject) : []), [subject]);
  const idx = flat.findIndex((c) => c.concept.id === cid);
  const concept = CONCEPTS[cid];
  const [body, setBody] = useState<{ id: string; c?: Concept; error?: boolean } | null>(null);
  const loaded = body?.id === cid ? body : null;
  const sections = loaded?.c?.sections ?? [];

  useEffect(() => {
    let live = true;
    loadConcept(cid).then(
      (c) => live && setBody({ id: cid, c }),
      () => live && setBody({ id: cid, error: true })
    );
    return () => {
      live = false;
    };
  }, [cid]);

  useEffect(() => {
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
    setDrawer(false);
    actions.setDoc('misc', 'last-concept', { subject: sid, concept: cid });
  }, [sid, cid]);

  // Scroll-spy for "On this page".
  useEffect(() => {
    const root = document.getElementById('main-scroll');
    if (!root || !sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActiveSection(vis[0].target.id);
      },
      { root, rootMargin: '0px 0px -70% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections, lang]);

  if (!subject) return <Navigate to="/learn" replace />;
  if (!concept || idx < 0) return <Navigate to={`/learn/${subject.id}/${flat[0]?.concept.id || ''}`} replace />;

  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const module = flat[idx].module;
  const lastInModule = flat[idx + 1]?.module.id !== module.id;
  const fromTopic = !concept.practice.length && lastInModule && module.topic ? problemsForTopic(module.topic).slice(0, 4).map((p) => p.id) : [];
  const practice = [...concept.practice, ...fromTopic].map((id) => PROBLEMS_BY_ID[id]).filter(Boolean);

  return (
    <div className="learn">
      <aside className="learn-side hide-mobile">
        <Tree subject={subject} current={cid} />
      </aside>
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawer(false)} />
          <div className="drawer" role="dialog" aria-label="Lessons">
            <div className="row" style={{ justifyContent: 'flex-end', padding: '8px 8px 0' }}>
              <IconButton label="Close" tip={false} icon={<X />} onClick={() => setDrawer(false)} />
            </div>
            <Tree subject={subject} current={cid} onNavigate={() => setDrawer(false)} />
          </div>
        </>
      )}

      <div className="learn-main">
        <div className="learn-toolbar">
          <Button variant="ghost" size="sm" icon={<ListTree />} className="show-mobile" onClick={() => setDrawer(true)} aria-label="Open lesson list" />
          <nav className="crumbs grow hide-mobile" aria-label="Breadcrumb">
            <Link to="/learn">Learn</Link>
            <ChevronRight />
            <Link to={`/learn/${subject.id}/${flat.find((c) => c.module.id === module.id)!.concept.id}`}>{subject.title}</Link>
            <ChevronRight />
            <span className="truncate">{module.title}</span>
          </nav>
          <div className="grow show-mobile" />
          <LangToggle size="sm" />
          <IconButton label={bookmarked ? 'Remove bookmark' : 'Bookmark'} icon={bookmarked ? <BookmarkCheck /> : <Bookmark />} onClick={() => actions.toggleBookmark(cid)} active={bookmarked} size="sm" />
        </div>

        <div className="learn-content">
          <article className="lesson page-enter" key={cid}>
            <div className="lesson-kicker">
              {module.title} · Lesson {idx + 1} of {flat.length}
            </div>
            <h1 className="lesson-title">{concept.title}</h1>
            {concept.summary && <p className="lesson-summary">{concept.summary}</p>}

            {loaded?.c ? (
              <Blocks blocks={loaded.c.blocks} lang={lang} />
            ) : loaded?.error ? (
              <div className="callout warning">
                <span>This lesson couldn't be loaded. Check your connection and </span>
                <button className="link-btn" style={{ fontSize: 14 }} onClick={() => location.reload()}>
                  retry
                </button>
              </div>
            ) : (
              <div className="lesson-skeleton" aria-busy="true" aria-label="Loading lesson">
                <div className="skeleton" style={{ height: 14, width: "92%" }} />
                <div className="skeleton" style={{ height: 14, width: "84%" }} />
                <div className="skeleton" style={{ height: 14, width: "60%" }} />
                <div className="skeleton" style={{ height: 180, marginTop: 12 }} />
              </div>
            )}

            {practice.length > 0 && (
              <section className="lesson-practice">
                <h2 className="lesson-h2" id="practice">
                  Practice
                </h2>
                <p className="muted small" style={{ marginBottom: 12 }}>
                  Apply this concept. Each problem runs against real test cases in {lang === 'python' ? 'Python' : 'Java'}.
                </p>
                <div className="problem-rows">
                  {practice.map((p) => (
                    <Link key={p.id} to={`/practice/${p.id}`} className="problem-row">
                      {solved[p.id]?.status === 'solved' ? <CircleCheck size={16} className="tree-done" /> : <Target size={16} className="muted" />}
                      <span className="grow truncate">{p.title}</span>
                      <DifficultyLabel value={p.difficulty} />
                      <ChevronRight size={15} className="muted" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="lesson-complete">
              <Button variant={done ? 'secondary' : 'primary'} size="lg" icon={done ? <CircleCheck /> : <Check />} onClick={() => actions.setComplete(cid, !done)}>
                {done ? 'Completed' : 'Mark as complete'}
              </Button>
              {done && <span className="small muted">Nice work. Progress saved.</span>}
            </div>

            <nav className="pager" aria-label="Lesson navigation">
              {prev ? (
                <Link to={`/learn/${subject.id}/${prev.concept.id}`} className="pager-link">
                  <span className="xs muted row" style={{ gap: 2 }}>
                    <ChevronLeft size={13} /> Previous
                  </span>
                  <span className="truncate">{prev.concept.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to={`/learn/${subject.id}/${next.concept.id}`}
                  className="pager-link next"
                  onClick={() => {
                    if (!done) actions.setComplete(cid, true);
                  }}
                >
                  <span className="xs muted row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                    Next <ChevronRight size={13} />
                  </span>
                  <span className="truncate">{next.concept.title}</span>
                </Link>
              ) : (
                <Link to="/learn" className="pager-link next">
                  <span className="xs muted">Finished</span>
                  <span>Back to subjects</span>
                </Link>
              )}
            </nav>
          </article>

          {sections.length > 1 && (
            <aside className="toc">
              <div className="section-title" style={{ marginBottom: 10 }}>
                On this page
              </div>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={`toc-link${activeSection === s.id ? ' active' : ''}`}>
                  {s.text}
                </a>
              ))}
              {practice.length > 0 && (
                <a href="#practice" className={`toc-link${activeSection === 'practice' ? ' active' : ''}`}>
                  Practice
                </a>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
