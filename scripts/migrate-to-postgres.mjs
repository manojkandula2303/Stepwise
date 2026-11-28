// Copy every account and all its work from the local SQLite database into Postgres (e.g. your Render database).
// Usage (PowerShell):
//   $env:DATABASE_URL = "<External Database URL from Render>"; node --experimental-sqlite scripts/migrate-to-postgres.mjs
// Optional: SQLITE_FILE=path/to/stepwise.db (default: data/stepwise.db). Existing rows in Postgres are kept (no overwrite).
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL to the Postgres connection string first.');
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.env.SQLITE_FILE || join(process.env.DATA_DIR || join(root, 'data'), 'stepwise.db');
if (!existsSync(file)) {
  console.error(`SQLite database not found: ${file}`);
  process.exit(1);
}
const sqlite = new DatabaseSync(file, { readOnly: true });
// Importing the db layer with DATABASE_URL set connects to Postgres and creates the schema.
const { db, DRIVER } = await import('../server/db.mjs');
if (DRIVER !== 'postgres') throw new Error('DATABASE_URL did not select Postgres');

// Parent tables first (foreign keys).
const TABLES = [
  ['users', ['id', 'email', 'name', 'password_hash', 'prefs', 'created_at'], '(id)'],
  ['sessions', ['token', 'user_id', 'expires_at'], '(token)'],
  ['concept_progress', ['user_id', 'concept_id', 'completed_at'], '(user_id, concept_id)'],
  ['bookmarks', ['user_id', 'concept_id', 'created_at'], '(user_id, concept_id)'],
  ['problem_progress', ['user_id', 'problem_id', 'status', 'saved', 'attempts', 'solved_at', 'last_lang'], '(user_id, problem_id)'],
  ['submissions', ['id', 'user_id', 'problem_id', 'language', 'verdict', 'passed', 'total', 'runtime_ms', 'code', 'created_at'], '(id)'],
  ['snippets', ['id', 'user_id', 'title', 'language', 'code', 'stdin', 'updated_at'], '(user_id, id)'],
  ['test_attempts', ['id', 'user_id', 'space', 'data', 'created_at'], '(user_id, id)'],
  ['user_kv', ['user_id', 'ns', 'key', 'value', 'updated_at'], '(user_id, ns, key)'],
  ['coding_tests', ['id', 'user_id', 'level', 'data', 'created_at', 'updated_at'], '(user_id, id)'],
  ['activity', ['user_id', 'day', 'count'], '(user_id, day)'],
];

const existing = new Set(sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => r.name));
let total = 0;
await db.tx(async (q) => {
  for (const [table, cols, key] of TABLES) {
    if (!existing.has(table)) continue;
    const rows = sqlite.prepare(`SELECT ${cols.join(', ')} FROM ${table}`).all();
    const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')}) ON CONFLICT ${key} DO NOTHING`;
    let n = 0;
    for (const r of rows) n += (await q.run(sql, cols.map((c) => (typeof r[c] === 'bigint' ? Number(r[c]) : r[c])))).changes;
    console.log(`${table.padEnd(17)} ${String(n).padStart(6)} of ${rows.length} rows copied`);
    total += n;
  }
  // Keep generated ids moving forward after copying explicit ids.
  for (const t of ['users', 'submissions'])
    await q.run(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 0) FROM ${t}), 1))`);
});
console.log(`\nDone: ${total} rows copied from ${file} to ${db.describe()}`);
await db.close();
