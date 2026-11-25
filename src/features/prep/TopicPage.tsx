import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Check, ChevronLeft, ChevronRight, CircleCheck, Circle, Clock, ListTree, Timer, X } from 'lucide-react';
import { PREP_TOPICS, loadPrepTopic, spaceById, spaceTopics, type PrepSpace } from '../../content/prep/curriculum';
import type { Concept } from '../../content/parse';
import { actions, useStore } from '../../lib/store';
import { Button, IconButton, ProgressBar } from '../../components/ui';
import { Blocks } from '../learn/Blocks';
import { PracticeList, ScoreBadge, bestFor } from './Practice';
import { topicSpec } from './tests';

function PrepTree({ space, current, onNavigate }: { space: PrepSpace; current: string; onNavigate?: () => void }) {
  const completed = useStore((s) => s.completed);
  const curSection = space.sections.find((s) => s.modules.some((m) => m.topics.includes(current)))?.id;
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [curSection || '']: true }));
  useEffect(() => {
    if (curSection) setOpen((o) => ({ ...o, [curSection]: true }));
  }, [curSection]);
  const all = spaceTopics(space);
  const done = all.filter((t) => completed[t.topic.id]).length;
  return (
    <div className="tree">
      <div className="tree-head">
        <Link to={`/prep/${space.id}`} className="xs muted row" style={{ gap: 2 }} onClick={onNavigate}>
          <ChevronLeft size={14} /> {space.title}
        </Link>
        <div className="row" style={{ gap: 10 }}>
          <div className="grow">
            <ProgressBar value={all.length ? done / all.length : 0} label="Progress" />
          </div>
          <span className="xs muted tabular">
            {done}/{all.length}
          </span>
        </div>
      </div>
      <nav className="tree-body">
        {space.sections.map((sec) => {
          const isOpen = !!open[sec.id];
          const topics = sec.modules.flatMap((m) => m.topics).filter((t) => PREP_TOPICS[t]);
          if (!topics.length) return null;
          const sdone = topics.filter((t) => completed[t]).length;
          return (
            <div key={sec.id} className="tree-module">
              <button className="tree-module-btn" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [sec.id]: !o[sec.id] }))}>
                <span className="tree-num">{sec.letter}</span>
                <span className="grow truncate">{sec.title}</span>
                <span className="xs muted tabular">
                  {sdone}/{topics.length}
                </span>
              </button>
              <div className="collapse-body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div>
                  {sec.modules.map((mod) => {
                    const items = mod.topics.filter((t) => PREP_TOPICS[t]);
                    if (!items.length) return null;
                    return (
                      <div key={mod.id}>
                        <div className="tree-group">{mod.title}</div>
                        {items.map((t) => (
                          <Link key={t} to={`/prep/${space.id}/${t}`} className={`tree-item${t === current ? ' active' : ''}`} onClick={onNavigate} aria-current={t === current ? 'page' : undefined}>
                            {completed[t] ? <Check size={13} className="tree-done" /> : <Circle size={6} className="tree-dot" />}
                            <span className="truncate">{PREP_TOPICS[t].title}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function TopicPage() {
  const { space: sid = '', topic: tid = '' } = useParams();
  const space = spaceById(sid);
  const navigate = useNavigate();
  const done = useStore((s) => !!s.completed[tid]);
  const bookmarked = useStore((s) => s.bookmarks.includes(tid));
  const attempts = useStore((s) => s.attempts);
  const [drawer, setDrawer] = useState(false);
  const [body, setBody] = useState<{ id: string; c?: Concept; error?: boolean } | null>(null);
  const flat = useMemo(() => (space ? spaceTopics(space) : []), [space]);
  const idx = flat.findIndex((x) => x.topic.id === tid);
  const meta = PREP_TOPICS[tid];
  const loaded = body?.id === tid ? body : null;

  useEffect(() => {
    let live = true;
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
    setDrawer(false);
    loadPrepTopic(tid).then(
      (c) => live && setBody({ id: tid, c }),
      () => live && setBody({ id: tid, error: true })
    );
    return () => {
      live = false;
    };
  }, [tid]);

  if (!space) return <Navigate to="/prep" replace />;
  if (!meta || idx < 0) return <Navigate to={`/prep/${space.id}`} replace />;

  const { section, module } = flat[idx];
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const spec = topicSpec(tid);
  const best = spec ? bestFor(attempts, spec.id) : null;
  const tries = spec ? attempts.filter((a) => a.specId === spec.id).length : 0;

  return (
    <div className="learn">
      <aside className="learn-side hide-mobile">
        <PrepTree space={space} current={tid} />
      </aside>
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawer(false)} />
          <div className="drawer" role="dialog" aria-label="Topics">
            <div className="row" style={{ justifyContent: 'flex-end', padding: '8px 8px 0' }}>
              <IconButton label="Close" tip={false} icon={<X />} onClick={() => setDrawer(false)} />
            </div>
            <PrepTree space={space} current={tid} onNavigate={() => setDrawer(false)} />
          </div>
        </>
      )}
      <div className="learn-main">
        <div className="learn-toolbar">
          <Button variant="ghost" size="sm" icon={<ListTree />} className="show-mobile" onClick={() => setDrawer(true)} aria-label="Open topic list" />
          <nav className="crumbs grow hide-mobile" aria-label="Breadcrumb">
            <Link to="/prep">Prep</Link>
            <ChevronRight />
            <Link to={`/prep/${space.id}`}>{space.short}</Link>
            <ChevronRight />
            <span className="truncate">{section.title}</span>
          </nav>
          <div className="grow show-mobile" />
          <IconButton label={bookmarked ? 'Remove bookmark' : 'Bookmark'} icon={bookmarked ? <BookmarkCheck /> : <Bookmark />} onClick={() => actions.toggleBookmark(tid)} active={bookmarked} size="sm" />
        </div>
        <div className="learn-content">
          <article className="lesson page-enter" key={tid}>
            <div className="lesson-kicker">
              {section.letter}. {section.title} · {module.title}
            </div>
            <h1 className="lesson-title">{meta.title}</h1>
            {meta.summary && <p className="lesson-summary">{meta.summary}</p>}

            {spec && (
              <div className="lesson-test-card">
                <Timer size={20} />
                <div className="grow col" style={{ gap: 2 }}>
                  <strong>Lesson test</strong>
                  <span className="small muted">
                    {spec.count} questions · {spec.minutes} min · timed{tries ? ` · ${tries} attempt${tries > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
                <ScoreBadge value={best} />
                <Button variant="primary" icon={<Clock />} onClick={() => navigate(`/prep/test/${encodeURIComponent(spec.id)}`)}>
                  {tries ? 'Retake' : 'Start test'}
                </Button>
              </div>
            )}

            {loaded?.c ? (
              <>
                <Blocks blocks={loaded.c.blocks} lang="python" />
                {loaded.c.questions.length > 0 && (
                  <section className="lesson-practice">
                    <h2 className="lesson-h2" id="practice">
                      Practice questions
                    </h2>
                    <p className="muted small" style={{ marginBottom: 12 }}>
                      Work through these untimed with instant feedback, then take the lesson test above.
                    </p>
                    <PracticeList questions={loaded.c.questions} />
                  </section>
                )}
              </>
            ) : loaded?.error ? (
              <div className="callout warning">This topic couldn't be loaded. Check your connection and reload.</div>
            ) : (
              <div className="lesson-skeleton" aria-busy="true">
                <div className="skeleton" style={{ height: 14, width: '92%' }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
                <div className="skeleton" style={{ height: 160, marginTop: 12 }} />
              </div>
            )}

            <div className="lesson-complete">
              <Button variant={done ? 'secondary' : 'primary'} size="lg" icon={done ? <CircleCheck /> : <Check />} onClick={() => actions.setComplete(tid, !done)}>
                {done ? 'Completed' : 'Mark as complete'}
              </Button>
            </div>
            <nav className="pager" aria-label="Topic navigation">
              {prev ? (
                <Link to={`/prep/${space.id}/${prev.topic.id}`} className="pager-link">
                  <span className="xs muted row" style={{ gap: 2 }}>
                    <ChevronLeft size={13} /> Previous
                  </span>
                  <span className="truncate">{prev.topic.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={`/prep/${space.id}/${next.topic.id}`} className="pager-link next" onClick={() => !done && actions.setComplete(tid, true)}>
                  <span className="xs muted row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                    Next <ChevronRight size={13} />
                  </span>
                  <span className="truncate">{next.topic.title}</span>
                </Link>
              ) : (
                <Link to={`/prep/${space.id}`} className="pager-link next">
                  <span className="xs muted">Finished</span>
                  <span>Back to {space.short}</span>
                </Link>
              )}
            </nav>
          </article>
        </div>
      </div>
    </div>
  );
}
