// Structural check for Placement Prep content: node scripts/check-prep.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'prep');
const curriculum = readFileSync(join(root, 'curriculum.ts'), 'utf8');
// Topic ids are the third argument of every m('module-id', 'Title', [...topics]) call.
const topicIds = new Set([...curriculum.matchAll(/\bm\('[^']+',\s*'[^']*',\s*\[([^\]]*)\]\)/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])));

const found = new Map();
const problems = [];
for (const space of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const file of readdirSync(join(root, space.name)).filter((f) => f.endsWith('.md'))) {
    const src = readFileSync(join(root, space.name, file), 'utf8').replace(/\r\n/g, '\n');
    for (const part of src.split(/^=== /m).slice(1)) {
      const id = part.slice(0, part.indexOf('\n')).split('|')[0].trim();
      if (found.has(id)) problems.push(`${id}: duplicate topic id`);
      const blocks = [...part.matchAll(/^:::mcq ?(\w*)\n([\s\S]*?)^:::\s*$/gm)];
      found.set(id, { file: `${space.name}/${file}`, n: blocks.length });
      if (!/^summary:/m.test(part)) problems.push(`${id}: no summary`);
      blocks.forEach((b, i) => {
        const where = `${id}#${i}`;
        if (!['easy', 'medium', 'hard'].includes(b[1])) problems.push(`${where}: difficulty "${b[1]}"`);
        const lines = b[2].split('\n');
        if (!lines.some((l) => l.startsWith('Q:'))) problems.push(`${where}: no Q:`);
        const opts = lines.filter((l) => l.startsWith('- '));
        const right = opts.filter((l) => /^- \[x\]/i.test(l));
        if (opts.length < 2) problems.push(`${where}: ${opts.length} options`);
        if (right.length !== 1) problems.push(`${where}: ${right.length} correct options`);
        const texts = opts.map((o) => o.replace(/^- (\[x\]\s*)?/i, '').trim());
        if (new Set(texts).size !== texts.length) problems.push(`${where}: duplicate options`);
        if (!lines.some((l) => l.startsWith('>'))) problems.push(`${where}: no explanation`);
      });
    }
  }
}
const missing = [...topicIds].filter((t) => !found.has(t));
const extra = [...found.keys()].filter((t) => !topicIds.has(t));
const total = [...found.values()].reduce((n, x) => n + x.n, 0);
const thin = [...found.entries()].filter(([, x]) => x.n < 8).map(([k, x]) => `${k}(${x.n})`);
console.log(`topics: ${found.size}/${topicIds.size}   questions: ${total}`);
if (process.argv.includes('--missing')) console.log('missing:', missing.join(' ') || 'none');
else console.log(`missing: ${missing.length}`);
if (extra.length) console.log('not in curriculum:', extra.join(' '));
if (thin.length) console.log('fewer than 8 questions:', thin.join(' '));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n` + problems.join('\n'));
  process.exitCode = 1;
} else console.log('structure OK');
