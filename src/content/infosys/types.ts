import type { CodingLevel } from '../../lib/types';
import type { Rng } from './rng';

/** What kind of test case a generator is asked for. */
export type CaseKind = 'public' | 'edge' | 'random' | 'large';

export interface Pattern {
  /** Short name, e.g. "Prefix sum + hash map". */
  name: string;
  /** Signals in the statement that point to this pattern. */
  recognize: string;
  /** Step-by-step approach. */
  approach: string[];
  time: string;
  space: string;
  /** Common mistakes / traps. */
  pitfalls?: string;
}

export interface InfosysProblem {
  id: string;
  level: CodingLevel;
  title: string;
  /** Topic ids (see levels.ts) this problem exercises. */
  topics: string[];
  /** Markdown statement in the Infosys style (story, task). */
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  pattern: Pattern;
  /** Shown as a worked sample on the level page. */
  sample?: boolean;
  /** Walk-through of the first public case (for samples). */
  walkthrough?: string;
  /** Builds one stdin input. */
  gen: (rng: Rng, kind: CaseKind) => string;
  /** Reference solver: stdin → expected stdout. */
  solve: (input: string) => string;
  solutions: { python: string; java: string };
}

export interface TestCase {
  input: string;
  output: string;
  public: boolean;
}
