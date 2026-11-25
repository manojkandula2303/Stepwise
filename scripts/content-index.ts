/**
 * Vite plugin: builds lightweight content indexes at build/dev time so the app can render
 * navigation, lists and progress without shipping every lesson body and problem up front.
 *
 *   virtual:lesson-index  -> [{ id, title, summary, practice, file }]
 *   virtual:problem-index -> [{ id, title, difficulty, topic, lc150, c, file }]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { build } from 'esbuild';
import type { Plugin } from 'vite';

const LESSON_ID = 'virtual:lesson-index';
const PROBLEM_ID = 'virtual:problem-index';
const PREP_ID = 'virtual:prep-index';

/** Placement-prep topics: src/content/prep/<space>/*.md, with their :::mcq question counts. */
function prepIndex(dir: string) {
  const out: object[] = [];
  for (const space of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
    for (const file of readdirSync(join(dir, space)).filter((f) => f.endsWith('.md')).sort()) {
      const src = readFileSync(join(dir, space, file), 'utf8').replace(/\r\n/g, '\n');
      for (const part of src.split(/^=== /m).slice(1)) {
        const nl = part.indexOf('\n');
        const [id, title] = part.slice(0, nl).split('|').map((s) => s.trim());
        const sep = part.search(/^---\s*$/m);
        const meta = sep >= 0 ? part.slice(nl + 1, sep) : '';
        const summary = /^summary:\s*(.*)$/m.exec(meta)?.[1]?.trim() || '';
        const questions = (part.match(/^:::mcq\b/gm) || []).length;
        out.push({ id, title, summary, file: `${space}/${file}`, space, questions });
      }
    }
  }
  return out;
}

function lessonIndex(dir: string) {
  const out: object[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const src = readFileSync(join(dir, file), 'utf8').replace(/\r\n/g, '\n');
    for (const part of src.split(/^=== /m).slice(1)) {
      const nl = part.indexOf('\n');
      const [id, title] = part.slice(0, nl).split('|').map((s) => s.trim());
      const sep = part.search(/^---\s*$/m);
      const meta = sep >= 0 ? part.slice(nl + 1, sep) : '';
      const get = (k: string) => new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(meta)?.[1]?.trim() || '';
      out.push({ id, title, summary: get('summary'), practice: get('practice').split(',').map((s) => s.trim()).filter(Boolean), file });
    }
  }
  return out;
}

const C_PARAM = ['int', 'long', 'double', 'bool', 'string', 'char', 'int[]', 'string[]', 'int[][]'];
const C_RET = ['int', 'long', 'double', 'bool', 'string', 'char', 'int[]', 'void'];
function cSupported(s: any) {
  if (s.kind === 'design' || !C_RET.includes(s.returns)) return false;
  if (s.returns === 'void' && s.inplace !== undefined && !['int[]', 'int[][]'].includes(s.params[s.inplace].type)) return false;
  return s.params.every((p: any) => C_PARAM.includes(p.type));
}

async function problemIndex(dir: string) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort();
  const out: object[] = [];
  for (const file of files) {
    // Problem files are plain data + type imports; bundle each to ESM and evaluate it in Node.
    const res = await build({ entryPoints: [join(dir, file)], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
    const code = res.outputFiles[0].text;
    const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
    for (const p of mod.default as any[]) {
      out.push({ id: p.id, title: p.title, difficulty: p.difficulty, topic: p.topic, lc150: !!p.lc150, c: cSupported(p.sig), file: basename(file) });
    }
  }
  return out;
}

export function contentIndex(root: string): Plugin {
  const learnDir = join(root, 'src/content/learn');
  const problemDir = join(root, 'src/content/problems');
  const prepDir = join(root, 'src/content/prep');
  return {
    name: 'content-index',
    resolveId(id) {
      if (id === LESSON_ID || id === PROBLEM_ID || id === PREP_ID) return '\0' + id;
    },
    async load(id) {
      if (id === '\0' + LESSON_ID) {
        readdirSync(learnDir).forEach((f) => this.addWatchFile(join(learnDir, f)));
        return `export default ${JSON.stringify(lessonIndex(learnDir))};`;
      }
      if (id === '\0' + PREP_ID) {
        for (const d of readdirSync(prepDir, { withFileTypes: true }))
          if (d.isDirectory()) readdirSync(join(prepDir, d.name)).forEach((f) => this.addWatchFile(join(prepDir, d.name, f)));
        return `export default ${JSON.stringify(prepIndex(prepDir))};`;
      }
      if (id === '\0' + PROBLEM_ID) {
        readdirSync(problemDir).forEach((f) => this.addWatchFile(join(problemDir, f)));
        return `export default ${JSON.stringify(await problemIndex(problemDir))};`;
      }
    },
    handleHotUpdate({ file, server }) {
      const norm = file.replace(/\\/g, '/');
      for (const [dir, vid] of [[learnDir, LESSON_ID], [problemDir, PROBLEM_ID], [prepDir, PREP_ID]] as const) {
        if (norm.startsWith(dir.replace(/\\/g, '/'))) {
          const m = server.moduleGraph.getModuleById('\0' + vid);
          if (m) server.moduleGraph.invalidateModule(m);
        }
      }
    },
  };
}
