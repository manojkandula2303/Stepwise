import prepIndex from 'virtual:prep-index';
import type { Concept } from '../parse';

/**
 * Placement prep: two separate spaces (Aptitude & Reasoning, Technical MCQs).
 * Space → Section → Module → Topic. Topic ids are prefixed per section (q-, r-, v-, d-, c-, p-, t-)
 * so they never collide with programming lesson ids.
 */
export type SpaceId = 'aptitude' | 'technical';

export interface PrepModule {
  id: string;
  title: string;
  topics: string[];
}
export interface PrepSection {
  id: string;
  letter: string;
  title: string;
  blurb: string;
  modules: PrepModule[];
  /** Sections that measure preference rather than right answers are left out of scored mocks. */
  scored?: boolean;
}
export interface PrepSpace {
  id: SpaceId;
  title: string;
  short: string;
  blurb: string;
  sections: PrepSection[];
}

export type PrepTopicMeta = (typeof prepIndex)[number];
export const PREP_TOPICS: Record<string, PrepTopicMeta> = Object.fromEntries(prepIndex.map((t) => [t.id, t]));

const m = (id: string, title: string, topics: string[]): PrepModule => ({ id, title, topics });

export const SPACES: PrepSpace[] = [
  {
    id: 'aptitude',
    title: 'Aptitude & Reasoning',
    short: 'Aptitude',
    blurb: 'Quantitative aptitude, logical reasoning, verbal ability, data interpretation, communication and psychometric assessments.',
    sections: [
      {
        id: 'quant',
        letter: 'A',
        title: 'Quantitative Aptitude',
        blurb: 'Arithmetic, money, ratios, work, speed, counting, algebra and geometry.',
        scored: true,
        modules: [
          m('q-numbers', 'Numbers', ['q-number-system', 'q-divisibility', 'q-lcm-hcf', 'q-remainders', 'q-simplification']),
          m('q-money', 'Percentages & Money', ['q-percentages', 'q-percent-change', 'q-profit-loss', 'q-discounts', 'q-simple-interest', 'q-compound-interest']),
          m('q-ratios', 'Ratios & Averages', ['q-ratio-proportion', 'q-partnership', 'q-averages', 'q-weighted-averages', 'q-ages', 'q-mixtures']),
          m('q-work', 'Time & Work', ['q-time-work', 'q-pipes-cisterns', 'q-work-wages']),
          m('q-motion', 'Time, Speed & Distance', ['q-tsd', 'q-trains', 'q-boats-streams', 'q-races-games']),
          m('q-counting', 'Counting & Probability', ['q-pnc', 'q-probability']),
          m('q-algebra', 'Series, Powers & Algebra', ['q-number-series', 'q-ap-gp', 'q-surds-indices', 'q-logarithms', 'q-algebra']),
          m('q-geometry', 'Geometry & Mensuration', ['q-mensuration-2d', 'q-mensuration-3d', 'q-geometry']),
          m('q-di', 'Data Interpretation Basics', ['q-data-interpretation']),
        ],
      },
      {
        id: 'reasoning',
        letter: 'B',
        title: 'Logical Reasoning',
        blurb: 'Series, coding, relations, arrangements, puzzles, verbal logic and non-verbal reasoning.',
        scored: true,
        modules: [
          m('r-series', 'Series & Coding', ['r-number-series', 'r-alphabet-series', 'r-alphanumeric-series', 'r-coding-decoding', 'r-analogy', 'r-classification']),
          m('r-relations', 'Relations & Directions', ['r-blood-relations', 'r-direction-sense', 'r-ranking']),
          m('r-arrangements', 'Seating Arrangements', ['r-seating-linear', 'r-seating-circular', 'r-seating-square']),
          m('r-puzzles', 'Puzzles', ['r-floor-puzzles', 'r-box-puzzles', 'r-scheduling-puzzles', 'r-month-day-puzzles']),
          m('r-verbal-logic', 'Verbal Logic', ['r-syllogisms', 'r-statement-conclusions', 'r-statement-assumptions', 'r-statement-arguments', 'r-cause-effect', 'r-course-of-action', 'r-assertion-reason']),
          m('r-analytical', 'Analytical Reasoning', ['r-inequalities', 'r-input-output', 'r-data-sufficiency', 'r-logical-deduction', 'r-venn-diagrams', 'r-mathematical-operations']),
          m('r-clocks-calendars', 'Clocks & Calendars', ['r-clocks', 'r-calendars']),
          m('r-non-verbal', 'Non-Verbal Reasoning', ['r-non-verbal', 'r-mirror-images', 'r-water-images', 'r-paper-folding', 'r-figure-series', 'r-embedded-figures', 'r-cubes-dice']),
        ],
      },
      {
        id: 'verbal',
        letter: 'C',
        title: 'Verbal Ability',
        blurb: 'Grammar, sentence correction, comprehension, vocabulary and verbal reasoning.',
        scored: true,
        modules: [
          m('v-grammar-core', 'Grammar Fundamentals', ['v-grammar-fundamentals', 'v-parts-of-speech', 'v-nouns', 'v-pronouns', 'v-verbs', 'v-adjectives', 'v-adverbs', 'v-prepositions', 'v-conjunctions', 'v-articles']),
          m('v-grammar-usage', 'Tenses, Agreement & Voice', ['v-tenses', 'v-subject-verb-agreement', 'v-voice', 'v-narration']),
          m('v-correction', 'Sentence Correction', ['v-sentence-correction', 'v-error-spotting', 'v-sentence-improvement', 'v-spelling']),
          m('v-completion', 'Completion & Ordering', ['v-fill-blanks', 'v-cloze-test', 'v-sentence-completion', 'v-paragraph-completion', 'v-para-jumbles', 'v-sentence-rearrangement']),
          m('v-vocabulary', 'Vocabulary', ['v-vocabulary', 'v-synonyms', 'v-antonyms', 'v-one-word-substitution', 'v-idioms-phrases', 'v-word-usage', 'v-contextual-vocabulary', 'v-verbal-analogies']),
          m('v-reading', 'Reading & Reasoning', ['v-reading-comprehension', 'v-critical-reasoning']),
        ],
      },
      {
        id: 'di',
        letter: 'D',
        title: 'Data Interpretation',
        blurb: 'Tables, charts and caselets — reading data fast and calculating accurately.',
        scored: true,
        modules: [
          m('d-formats', 'Data Formats', ['d-tabular', 'd-bar-graphs', 'd-line-graphs', 'd-pie-charts', 'd-mixed-graphs', 'd-caselets', 'd-missing-data']),
          m('d-calculations', 'DI Calculations', ['d-data-comparison', 'd-percentage-di', 'd-ratio-di', 'd-average-di', 'd-graph-calculations', 'd-approximation-di', 'd-data-sufficiency']),
        ],
      },
      {
        id: 'communication',
        letter: 'E',
        title: 'Communication Skills',
        blurb: 'Reading aloud, listening, pronunciation, spoken fluency and professional writing — with speech practice in the browser.',
        scored: true,
        modules: [
          m('c-spoken', 'Speaking & Listening', ['c-reading-aloud', 'c-listening', 'c-sentence-repetition', 'c-fluency', 'c-active-listening']),
          m('c-voice', 'Pronunciation & Delivery', ['c-pronunciation', 'c-intonation', 'c-stress-rhythm']),
          m('c-language', 'Language in Speech', ['c-grammar-speech', 'c-vocabulary-communication']),
          m('c-tasks', 'Speaking Tasks', ['c-topic-speaking', 'c-picture-description', 'c-situation-speaking']),
          m('c-professional', 'Professional Communication', ['c-professional-communication', 'c-email-writing', 'c-presentation-skills']),
        ],
      },
      {
        id: 'psychometric',
        letter: 'F',
        title: 'Psychometric & Personality',
        blurb: 'Personality profiling and situational judgement — what employers look for and how to answer authentically.',
        scored: false,
        modules: [
          m('p-personality', 'Personality', ['p-personality', 'p-work-preferences']),
          m('p-judgement', 'Situational Judgement', ['p-sjt', 'p-workplace-behaviour', 'p-teamwork', 'p-leadership', 'p-decision-making', 'p-problem-solving']),
          m('p-self', 'Self-Management', ['p-adaptability', 'p-conflict', 'p-time-management', 'p-emotional-intelligence', 'p-stress']),
          m('p-values', 'Values', ['p-ethics', 'p-integrity']),
        ],
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical MCQs',
    short: 'Technical',
    blurb: 'Core computer science for placement tests: DBMS, operating systems, networks, OOP, software engineering and computer architecture.',
    sections: [
      {
        id: 'dbms',
        letter: '1',
        title: 'DBMS',
        blurb: 'Data models, keys, normalization, transactions, indexing and SQL.',
        scored: true,
        modules: [
          m('t-db-design', 'Database Design', ['t-db-fundamentals', 't-er-model', 't-keys', 't-functional-dependencies', 't-normalization']),
          m('t-db-transactions', 'Transactions', ['t-transactions', 't-acid']),
          m('t-db-sql', 'SQL & Storage', ['t-indexing', 't-joins', 't-views', 't-stored-procedures', 't-triggers']),
        ],
      },
      {
        id: 'os',
        letter: '2',
        title: 'Operating Systems',
        blurb: 'Processes, scheduling, deadlocks, memory, synchronization and disks.',
        scored: true,
        modules: [
          m('t-os-processes', 'Processes & Scheduling', ['t-os-fundamentals', 't-processes-threads', 't-process-scheduling', 't-cpu-scheduling']),
          m('t-os-concurrency', 'Concurrency', ['t-synchronization', 't-semaphores', 't-deadlocks']),
          m('t-os-memory', 'Memory & Storage', ['t-memory-management', 't-paging-segmentation', 't-virtual-memory', 't-disk-scheduling']),
        ],
      },
      {
        id: 'networks',
        letter: '3',
        title: 'Computer Networks',
        blurb: 'Layered models, addressing, transport, application protocols and security.',
        scored: true,
        modules: [
          m('t-cn-models', 'Models & Basics', ['t-network-fundamentals', 't-osi-model', 't-tcp-ip-model', 't-network-topologies']),
          m('t-cn-addressing', 'Addressing & Routing', ['t-ip-addressing', 't-ipv4-ipv6', 't-routing-switching']),
          m('t-cn-protocols', 'Protocols & Security', ['t-tcp-udp', 't-http-https', 't-dns', 't-dhcp', 't-firewalls']),
        ],
      },
      {
        id: 'oop',
        letter: '4',
        title: 'Object-Oriented Programming',
        blurb: 'The four pillars, constructors, overloading vs overriding, interfaces and exceptions.',
        scored: true,
        modules: [
          m('t-oop-pillars', 'Core Concepts', ['t-classes-objects', 't-encapsulation', 't-inheritance', 't-polymorphism', 't-abstraction']),
          m('t-oop-mechanics', 'Language Mechanics', ['t-constructors', 't-method-overloading', 't-method-overriding', 't-interfaces', 't-abstract-classes', 't-exception-handling']),
        ],
      },
      {
        id: 'se',
        letter: '5',
        title: 'Software Engineering',
        blurb: 'Process models, agile and scrum, testing levels and techniques, and Git.',
        scored: true,
        modules: [
          m('t-se-process', 'Process Models', ['t-sdlc', 't-waterfall', 't-agile', 't-scrum']),
          m('t-se-testing', 'Testing', ['t-software-testing', 't-unit-testing', 't-integration-testing', 't-system-testing', 't-black-white-box']),
          m('t-se-tools', 'Tools', ['t-git']),
        ],
      },
      {
        id: 'architecture',
        letter: '6',
        title: 'Computer Architecture',
        blurb: 'CPU organisation, memory hierarchy, the instruction cycle and number systems.',
        scored: true,
        modules: [
          m('t-ca-cpu', 'The CPU', ['t-cpu-architecture', 't-alu-control-unit', 't-registers', 't-instruction-cycle']),
          m('t-ca-memory', 'Memory', ['t-cache-memory', 't-primary-secondary-memory', 't-ram-rom']),
          m('t-ca-numbers', 'Number Systems', ['t-number-systems']),
        ],
      },
    ],
  },
];

export const spaceById = (id: string) => SPACES.find((s) => s.id === id);

/** Ordered topics of a space (only those whose content exists). */
export function spaceTopics(space: PrepSpace) {
  return space.sections.flatMap((section) =>
    section.modules.flatMap((module) => module.topics.filter((t) => PREP_TOPICS[t]).map((t) => ({ topic: PREP_TOPICS[t], module, section })))
  );
}

export function locateTopic(id: string) {
  for (const space of SPACES)
    for (const section of space.sections)
      for (const module of section.modules) if (module.topics.includes(id)) return { space, section, module };
  return null;
}

// ---------------------------------------------------------------- lazy content
const files = import.meta.glob('./*/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
const fileCache = new Map<string, Promise<Record<string, Concept>>>();

function loadFile(file: string) {
  let p = fileCache.get(file);
  if (!p) {
    p = Promise.all([files[`./${file}`](), import('../parse')]).then(([src, { parseModule }]) => Object.fromEntries(parseModule(src).map((c) => [c.id, c])));
    p.catch(() => fileCache.delete(file));
    fileCache.set(file, p);
  }
  return p;
}

export async function loadPrepTopic(id: string): Promise<Concept | undefined> {
  const meta = PREP_TOPICS[id];
  return meta ? (await loadFile(meta.file))[id] : undefined;
}

export async function loadPrepTopics(ids: string[]): Promise<Concept[]> {
  const files = Array.from(new Set(ids.map((id) => PREP_TOPICS[id]?.file).filter(Boolean)));
  const loaded = Object.assign({}, ...(await Promise.all(files.map(loadFile)))) as Record<string, Concept>;
  return ids.map((id) => loaded[id]).filter(Boolean);
}
