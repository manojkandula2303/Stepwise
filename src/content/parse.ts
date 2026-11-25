/**
 * Lesson format (one module file holds many concepts):
 *
 *   === concept-id | Concept Title
 *   summary: One-line description
 *   practice: problem-id, problem-id
 *   ---
 *   Markdown body. "## Heading" lines become sections ("On this page").
 *
 *   Consecutive fenced blocks form one dual-language example:
 *     ```python title="Optional title"   ```java   ```output   ```output-python   ```output-java
 *
 *   Directives (single level, closed by a line ":::"):
 *     :::python / :::java          shown only for that language
 *     :::compare                   Python vs Java differences (always shown)
 *     :::note / :::tip / :::warning callouts
 *     :::complexity                "Label: value" lines
 *     :::viz <kind> <data>         array | list | tree | stack | queue | graph | matrix | hashmap
 *     :::quiz                      "Q: ...", "- option", "- [x] correct", "> explanation"
 */

export type Lang = 'python' | 'java';

export interface ExampleBlock {
  type: 'example';
  title?: string;
  code: Partial<Record<Lang, string>>;
  output: Partial<Record<Lang, string>>;
}
export type Block =
  | { type: 'md'; md: string }
  | { type: 'heading'; text: string; id: string }
  | ExampleBlock
  | { type: 'lang'; lang: Lang; blocks: Block[] }
  | { type: 'callout'; kind: 'note' | 'tip' | 'warning' | 'compare'; blocks: Block[] }
  | { type: 'complexity'; rows: [string, string][] }
  | { type: 'viz'; kind: string; data: string }
  | { type: 'quiz'; question: string; options: string[]; answer: number; explanation: string }
  | (MCQ & { type: 'mcq' })
  | { type: 'speak'; text: string; mode: string }
  | { type: 'listen'; text: string }
  | { type: 'assessment'; kind: string };

/** A practice / test question (written with :::mcq in prep lessons). */
export interface MCQ {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Concept {
  id: string;
  title: string;
  summary: string;
  practice: string[];
  blocks: Block[];
  sections: { id: string; text: string }[];
  /** :::mcq blocks, pulled out of the body: shown as practice and used by timed tests. */
  questions: MCQ[];
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>|`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const FENCE = /^```([\w-]*)(.*)$/;

/** Shared context (passage, table, puzzle) for the :::mcq blocks that follow; reset per concept. */
const currentContext = { value: '' };

function parseBlocks(src: string, sections: { id: string; text: string }[]): Block[] {
  const lines = src.split('\n');
  const out: Block[] = [];
  let md: string[] = [];
  const flushMd = () => {
    const text = md.join('\n').trim();
    if (text) out.push({ type: 'md', md: text });
    md = [];
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // ---- headings ----
    const h = /^##\s+(.+)$/.exec(line);
    if (h) {
      flushMd();
      const id = slug(h[1]);
      sections.push({ id, text: h[1].replace(/`/g, '') });
      out.push({ type: 'heading', text: h[1], id });
      i++;
      continue;
    }
    // ---- directives ----
    const d = /^:::(\w+)\s*(.*)$/.exec(line);
    if (d) {
      flushMd();
      const [, name, arg] = d;
      const body: string[] = [];
      i++;
      let inFence = false;
      while (i < lines.length && (inFence || lines[i].trim() !== ':::')) {
        if (lines[i].startsWith('```')) inFence = !inFence;
        body.push(lines[i]);
        i++;
      }
      i++; // closing :::
      const inner = body.join('\n');
      if (name === 'python' || name === 'java') out.push({ type: 'lang', lang: name, blocks: parseBlocks(inner, []) });
      else if (name === 'note' || name === 'tip' || name === 'warning' || name === 'compare') out.push({ type: 'callout', kind: name, blocks: parseBlocks(inner, []) });
      else if (name === 'complexity')
        out.push({
          type: 'complexity',
          rows: body
            .filter((l) => l.includes(':'))
            .map((l) => {
              const k = l.indexOf(':');
              return [l.slice(0, k).trim(), l.slice(k + 1).trim()] as [string, string];
            }),
        });
      else if (name === 'viz') {
        const [kind, ...rest] = arg.split(/\s+/);
        out.push({ type: 'viz', kind, data: [rest.join(' '), inner].filter(Boolean).join('\n').trim() });
      } else if (name === 'quiz' || name === 'mcq') {
        let question = '';
        const options: string[] = [];
        let answer = 0;
        const expl: string[] = [];
        for (const l of body) {
          if (l.startsWith('Q:')) question = l.slice(2).trim();
          else if (/^- \[x\]/i.test(l)) {
            answer = options.length;
            options.push(l.replace(/^- \[x\]\s*/i, ''));
          } else if (l.startsWith('- ')) options.push(l.slice(2));
          else if (l.startsWith('>')) expl.push(l.replace(/^>\s?/, ''));
          else if (question && !options.length) question += '\n' + l;   // keep blank lines (tables, code)
        }
        question = question.trim();
        if (name === 'quiz') out.push({ type: 'quiz', question, options, answer, explanation: expl.join(' ') });
        else {
          const difficulty = (['easy', 'medium', 'hard'].includes(arg.trim()) ? arg.trim() : 'medium') as MCQ['difficulty'];
          // Shared passage / table / puzzle set from the most recent :::context block.
          const ctx = currentContext.value;
          out.push({ type: 'mcq', question: ctx ? `${ctx}\n\n---\n\n${question}` : question, options, answer, explanation: expl.join(' '), difficulty });
        }
      } else if (name === 'context') {
        currentContext.value = inner.trim();      // an empty :::context ends the shared set
      } else if (name === 'speak') out.push({ type: 'speak', text: inner.trim(), mode: arg.trim() });
      else if (name === 'listen') out.push({ type: 'listen', text: inner.trim() });
      else if (name === 'assessment') out.push({ type: 'assessment', kind: arg.trim() });
      continue;
    }
    // ---- code example groups ----
    if (FENCE.test(line)) {
      flushMd();
      const ex: ExampleBlock = { type: 'example', code: {}, output: {} };
      while (i < lines.length && FENCE.test(lines[i])) {
        const [, lang, rest] = FENCE.exec(lines[i])!;
        const title = /title="([^"]*)"/.exec(rest)?.[1];
        if (title && !ex.title) ex.title = title;
        const body: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
        i++;
        const text = body.join('\n');
        if (lang === 'python' || lang === 'java') ex.code[lang] = text;
        else if (lang === 'output') ex.output.python = ex.output.java = text;
        else if (lang === 'output-python') ex.output.python = text;
        else if (lang === 'output-java') ex.output.java = text;
        else ex.code.python = ex.code.python ?? text;
        // allow blank lines between fences of the same group
        let j = i;
        while (j < lines.length && lines[j].trim() === '') j++;
        if (j < lines.length && FENCE.test(lines[j])) i = j;
        else break;
      }
      out.push(ex);
      continue;
    }
    md.push(line);
    i++;
  }
  flushMd();
  return out;
}

export function parseModule(src: string): Concept[] {
  const parts = src.replace(/\r\n/g, '\n').split(/^=== /m).slice(1);
  return parts.map((part) => {
    const nl = part.indexOf('\n');
    const [id, title] = part
      .slice(0, nl)
      .split('|')
      .map((s) => s.trim());
    const rest = part.slice(nl + 1);
    const sep = rest.search(/^---\s*$/m);
    const meta = sep >= 0 ? rest.slice(0, sep) : '';
    const body = sep >= 0 ? rest.slice(rest.indexOf('\n', sep) + 1) : rest;
    const get = (k: string) => new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(meta)?.[1]?.trim() || '';
    const sections: { id: string; text: string }[] = [];
    currentContext.value = '';
    const all = parseBlocks(body, sections);
    const questions: MCQ[] = [];
    const blocks = all.filter((b) => {
      if (b.type !== 'mcq') return true;
      const { type, ...q } = b;
      questions.push(q);
      return false;
    });
    return {
      id,
      title,
      summary: get('summary'),
      practice: get('practice')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      blocks,
      sections,
      questions,
    };
  });
}
