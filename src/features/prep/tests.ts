/**
 * Timed tests for placement prep: specs, question selection and scoring.
 *
 * Spec ids are URL-safe strings:
 *   topic:<topicId>                 lesson-wise test
 *   module:<space>:<moduleId>       cumulative test over a module
 *   section:<space>:<sectionId>     cumulative test over a section
 *   mock:<space>                    full mock for the space
 *   custom:<space>:<t1,t2>:<count>:<minutes>:<negative>
 */
import type { MCQ } from '../../content/parse';
import { PREP_TOPICS, SPACES, loadPrepTopics, locateTopic, spaceById, type PrepSection, type SpaceId } from '../../content/prep/curriculum';
import type { AttemptAnswer, TestAttempt } from '../../lib/types';

export interface TestSpec {
  id: string;
  title: string;
  kind: TestAttempt['kind'];
  space: SpaceId;
  topics: string[];
  count: number;
  minutes: number;
  negative: number;
  /** For mocks: how many questions to take from each section. */
  strata?: { label: string; topics: string[]; count: number }[];
}

export interface TestQuestion {
  qid: string;
  topicId: string;
  topicTitle: string;
  q: MCQ;
}

/** Minutes allowed per question, by section — tuned to typical placement-test pacing. */
const PACE: Record<string, number> = {
  quant: 1.5,
  reasoning: 1.25,
  verbal: 0.9,
  di: 2,
  communication: 1,
  psychometric: 1,
  dbms: 0.75,
  os: 0.75,
  networks: 0.75,
  oop: 0.75,
  se: 0.75,
  architecture: 0.75,
};

const available = (topics: string[]) => topics.reduce((n, t) => n + (PREP_TOPICS[t]?.questions || 0), 0);
const sectionTopics = (s: PrepSection) => s.modules.flatMap((m) => m.topics).filter((t) => PREP_TOPICS[t]);
const paceOf = (topicId: string) => PACE[locateTopic(topicId)?.section.id || ''] ?? 1;
const minutesFor = (topics: string[], count: number) => {
  const avg = topics.length ? topics.reduce((s, t) => s + paceOf(t), 0) / topics.length : 1;
  return Math.max(5, Math.round(count * avg));
};

export function topicSpec(topicId: string): TestSpec | null {
  const meta = PREP_TOPICS[topicId];
  const loc = locateTopic(topicId);
  if (!meta || !loc || !meta.questions) return null;
  const count = Math.min(10, meta.questions);
  return { id: `topic:${topicId}`, title: `${meta.title} — Lesson Test`, kind: 'topic', space: loc.space.id, topics: [topicId], count, minutes: minutesFor([topicId], count), negative: 0 };
}

export function moduleSpec(space: SpaceId, moduleId: string): TestSpec | null {
  const sp = spaceById(space);
  const mod = sp?.sections.flatMap((s) => s.modules).find((m) => m.id === moduleId);
  if (!sp || !mod) return null;
  const topics = mod.topics.filter((t) => PREP_TOPICS[t]);
  const count = Math.min(15, available(topics));
  if (!count) return null;
  return { id: `module:${space}:${moduleId}`, title: `${mod.title} — Module Test`, kind: 'module', space, topics, count, minutes: minutesFor(topics, count), negative: 0 };
}

export function sectionSpec(space: SpaceId, sectionId: string): TestSpec | null {
  const sp = spaceById(space);
  const sec = sp?.sections.find((s) => s.id === sectionId);
  if (!sp || !sec) return null;
  const topics = sectionTopics(sec);
  const count = Math.min(25, available(topics));
  if (!count) return null;
  return { id: `section:${space}:${sectionId}`, title: `${sec.title} — Sectional Test`, kind: 'section', space, topics, count, minutes: minutesFor(topics, count), negative: 0.25 };
}

/** Full-length mock: questions drawn from every scored section of the space. */
export function mockSpec(space: SpaceId): TestSpec | null {
  const sp = spaceById(space);
  if (!sp) return null;
  const per: Record<string, number> = space === 'aptitude' ? { quant: 15, reasoning: 15, verbal: 15, di: 10, communication: 5 } : { dbms: 8, os: 8, networks: 8, oop: 8, se: 8, architecture: 8 };
  const strata = sp.sections
    .filter((s) => s.scored && per[s.id])
    .map((s) => ({ label: s.title, topics: sectionTopics(s), count: Math.min(per[s.id], available(sectionTopics(s))) }))
    .filter((s) => s.count > 0);
  const topics = strata.flatMap((s) => s.topics);
  const count = strata.reduce((n, s) => n + s.count, 0);
  if (!count) return null;
  const minutes = strata.reduce((n, s) => n + s.count * (PACE[sp.sections.find((x) => x.title === s.label)!.id] ?? 1), 0);
  return { id: `mock:${space}`, title: `${sp.short} — Full Mock Test`, kind: 'mock', space, topics, count, minutes: Math.round(minutes), negative: 0.25, strata };
}

export function customSpec(space: SpaceId, topics: string[], count: number, minutes: number, negative: number): TestSpec | null {
  const valid = topics.filter((t) => PREP_TOPICS[t] && locateTopic(t)?.space.id === space);
  const n = Math.min(count, available(valid));
  if (!n) return null;
  return {
    id: `custom:${space}:${valid.join(',')}:${n}:${minutes}:${negative}`,
    title: 'Custom Test',
    kind: 'custom',
    space,
    topics: valid,
    count: n,
    minutes: Math.max(1, Math.min(240, minutes)),
    negative: Math.max(0, Math.min(1, negative)),
  };
}

export function specFromId(id: string): TestSpec | null {
  const [kind, ...rest] = id.split(':');
  const isSpace = (s: string): s is SpaceId => s === 'aptitude' || s === 'technical';
  switch (kind) {
    case 'topic':
      return topicSpec(rest[0]);
    case 'module':
      return isSpace(rest[0]) ? moduleSpec(rest[0], rest[1]) : null;
    case 'section':
      return isSpace(rest[0]) ? sectionSpec(rest[0], rest[1]) : null;
    case 'mock':
      return isSpace(rest[0]) ? mockSpec(rest[0]) : null;
    case 'custom':
      return isSpace(rest[0]) ? customSpec(rest[0], (rest[1] || '').split(',').filter(Boolean), Number(rest[2]), Number(rest[3]), Number(rest[4])) : null;
  }
  return null;
}

// ---------------------------------------------------------------- questions
function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

async function pool(topics: string[]): Promise<TestQuestion[]> {
  const concepts = await loadPrepTopics(topics);
  return concepts.flatMap((c) => c.questions.map((q, i) => ({ qid: `${c.id}#${i}`, topicId: c.id, topicTitle: c.title, q })));
}

/** Spread the picks across topics so a cumulative test isn't dominated by one topic. */
function spreadPick(all: TestQuestion[], count: number): TestQuestion[] {
  const byTopic = new Map<string, TestQuestion[]>();
  for (const q of shuffle(all)) byTopic.set(q.topicId, [...(byTopic.get(q.topicId) || []), q]);
  const queues = shuffle([...byTopic.values()]);
  const picked: TestQuestion[] = [];
  while (picked.length < count && queues.some((q) => q.length)) for (const q of queues) if (q.length && picked.length < count) picked.push(q.shift()!);
  return picked;
}

export async function buildQuestions(spec: TestSpec): Promise<TestQuestion[]> {
  if (spec.strata) {
    const parts = await Promise.all(spec.strata.map(async (s) => spreadPick(await pool(s.topics), s.count)));
    return parts.flat();
  }
  return spreadPick(await pool(spec.topics), spec.count);
}

/** Resolve question ids saved in an attempt back to questions (for review). */
export async function questionsByIds(qids: string[]): Promise<Record<string, TestQuestion>> {
  const topics = Array.from(new Set(qids.map((q) => q.split('#')[0])));
  const all = await pool(topics);
  return Object.fromEntries(all.map((q) => [q.qid, q]));
}

// ---------------------------------------------------------------- scoring
export function scoreAttempt(spec: TestSpec, questions: TestQuestion[], answers: Omit<AttemptAnswer, 'correct'>[], startedAt: number, timeTakenSec: number): TestAttempt {
  const full: AttemptAnswer[] = answers.map((a, i) => ({ ...a, correct: a.chosen !== null && a.chosen === questions[i].q.answer }));
  const correct = full.filter((a) => a.correct).length;
  const skipped = full.filter((a) => a.chosen === null).length;
  const wrong = full.length - correct - skipped;
  return {
    id: `t${startedAt.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    space: spec.space,
    specId: spec.id,
    title: spec.title,
    kind: spec.kind,
    topics: Array.from(new Set(questions.map((q) => q.topicId))),
    total: questions.length,
    correct,
    wrong,
    skipped,
    score: Math.round((correct - wrong * spec.negative) * 100) / 100,
    maxScore: questions.length,
    negative: spec.negative,
    durationSec: spec.minutes * 60,
    timeTakenSec,
    createdAt: Date.now(),
    answers: full,
  };
}

export const pct = (a: TestAttempt) => (a.maxScore ? Math.max(0, Math.round((a.score / a.maxScore) * 100)) : 0);

export function formatTime(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}

export const ALL_SPACES = SPACES;
