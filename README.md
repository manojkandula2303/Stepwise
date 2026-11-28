# Stepwise

Learn Python, Java and Data Structures & Algorithms — every concept in both languages — with a built-in judge, the LeetCode 150, a multi-language compiler and a step-by-step execution visualizer.

## Quick start

Requirements: **Node 22+** and **JDK 17–23** (for Java execution and tracing).

```bash
npm install
npm run dev        # Vite on http://localhost:5173, API on :8787
```

Production (one port serves the built app and the API):

```bash
npm run build
npm start          # http://localhost:8787 (override with PORT or API_PORT)
```

Locally, data is stored in SQLite (`data/stepwise.db`). Set `DATABASE_URL` to a PostgreSQL connection string to use Postgres instead; the schema is created automatically.

## Deploying to Render

On Render, a web service's disk is wiped on every deploy and restart, so the deployed app keeps all accounts in **PostgreSQL**. Every user can then sign in on any device and see the same work.

**One-click (Blueprint).** The repository includes `render.yaml`, which creates the web service (Docker, with Node 22 and JDK 17 for Java) and a Postgres database, and connects them through `DATABASE_URL`.

1. Push this project to GitHub (or GitLab).
2. In Render: **New → Blueprint**, pick the repository, then **Apply**.
3. Wait for the first deploy, then open the `stepwise` service URL. `/api/health` should return `{"ok":true}`.

**Manual setup** (equivalent):

1. **New → PostgreSQL** and create a database.
2. **New → Web Service** from the repository, runtime **Docker** (the `Dockerfile` is detected), health check path `/api/health`.
3. Add the environment variable `DATABASE_URL` = the database's **Internal Database URL**.

**Bring your local accounts and work along (optional).** Copy the database's **External Database URL** from Render, then on your computer run:

```powershell
$env:DATABASE_URL = "<External Database URL>"; npm run db:migrate
```

This copies every account, password, progress record, snippet, draft and test from `data/stepwise.db`. It's safe to run more than once: existing rows are kept.

**Good to know**
- **Free plans:** a free Render web service sleeps after a period without traffic, and the first request then takes a little while to wake it. Render's free Postgres databases expire after a limited period. For long-term use, upgrade the database, or point `DATABASE_URL` at another Postgres host (for example Neon or Supabase). SSL is enabled automatically for external hosts.
- **Code execution on Render:** Python runs in the browser and Java runs in the server's sandboxed JVM. C and C++ need Docker-in-Docker, which Render doesn't offer; set `JUDGE0_URL` to a Judge0 instance to enable them.
- **Environment variables:** `DATABASE_URL`, `USER_QUOTA_MB` (default 25), `RUN_RATE_LIMIT` (runs per minute, default 90), `PGSSL` (`require` / `disable` to override SSL detection), `PG_POOL_MAX` (default 10).

## What's inside

| Area | Contents |
|---|---|
| Learn | 98 lessons across Python, Java and DSA (58 in DSA) (Subject → Module → Lesson → Sections). Each lesson has a Python/Java toggle, runnable examples, expected output, "Python vs Java" callouts, diagrams, dry runs, complexity and quizzes. |
| Practice | 228 judged problems grouped by topic, linked from the lessons. |
| LeetCode 150 | The interview set, with progress, filters, hints, brute-force and optimal approaches, and Python/Java reference solutions. |
| Compiler | Python, Java, C++ and C with stdin, multiple inputs, starter templates and saved snippets. Every program shows its **time and space complexity**, estimated by a static analyser (loops and nesting, halving/doubling, √n, amortised two-pointer and sliding-window loops, BFS/DFS, recursion patterns, memoisation, library calls, allocations and recursion depth), with line-by-line reasons and a confidence level. |
| Infosys Coding | A dedicated section for the Infosys coding assessment with four levels: **Easy, Medium, Hard, Complex**. Each level lists the topics you need (linked to the lessons), explains the pattern behind every problem, and has Infosys-style sample questions (stdin/stdout, one value per line). **Generate test** builds a timed test of 4 questions of that level, each judged on **2 public + 12 hidden test cases** (edge, random and maximum-size). 38 problems, each with a test-case generator, a reference solver and verified Python/Java solutions. |
| Visualizer | Line-by-line execution of Python and Java programs: call stack, variables, heap objects, array index pointers, linked lists, trees and narration for each step. |
| Placement Prep | Two separate spaces, each with concepts, worked examples, practice questions and timed tests. **Aptitude & Reasoning** (152 topics): Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Communication Skills (read-aloud, sentence repetition and listening practice using browser speech) and Psychometric (Big Five and work-preference self-assessments plus situational judgement). **Technical MCQs** (64 topics): DBMS, OS, Computer Networks, OOP, Software Engineering and Computer Architecture. 2,136 questions in total. |
| Timed tests | A highlighted lesson test on every topic, plus module tests, sectional tests (−0.25 negative marking), a full mock per space and a custom test builder. Exam-style runner with timer, question palette, mark-for-review, keyboard shortcuts, resume after reload and auto-submit. Results include score, accuracy, a per-topic breakdown and an answer review with explanations. |
| Dashboard | Progress per subject and prep space, LeetCode 150 completion, recent tests, activity heatmap, streaks, achievements and saved items. |

## Accounts, storage and offline use

- **A separate storage space per account.** Every table in the database (PostgreSQL in production, SQLite locally) is keyed by user id, so signing in on any device loads the same account: progress, submissions, snippets, drafts, editor buffers, self-assessments, prep attempts and Infosys tests. Accounts can't see each other's data. Each account has a quota (`USER_QUOTA_MB`, default 25). The **Account & storage** page shows usage by category, exports everything as JSON and deletes the account and all its data.
- **Guests** keep progress in the browser; it is merged into the account on sign-up or sign-in.
- **Offline.** The production build registers a service worker that precaches the whole app: every lesson, problem, prep topic and Infosys problem. The Python runtime (Pyodide) is cached after first use, or on demand with *Prepare for offline*. Signed-in users get a per-account cache on the device, and changes made offline go into a queue that syncs automatically when the server is reachable again. Java, C and C++ need the server. The app can be installed from the browser (Install app / Add to Home Screen).

## Architecture

```
server/            Express API + PostgreSQL (DATABASE_URL) or SQLite (local), scrypt passwords, httpOnly session cookies
  runner/          Isolated code execution drivers
  java/Tracer.java JDI-based step tracer for Java
src/
  styles/          Design tokens (tokens.css) and component styles; light + dark themes
  components/      Reusable UI kit, code block / editor, app shell
  lib/             Store, API client, runners, Pyodide worker, judge harness generators
  content/learn/   Lessons in a compact Markdown format (see content/parse.ts)
  content/problems Problems as typed data; harnesses are generated from each signature
  content/prep/    Placement prep: curriculum.ts plus aptitude/*.md and technical/*.md
  features/        learn, practice, lc150, prep, compiler, visualizer, dashboard, auth
```

**Judge.** Each problem declares a typed signature (`int[]`, `ListNode`, `TreeNode`, design classes …). From it the app generates LeetCode-style starter code and an I/O harness for Python, Java, C++ and C, so problems are written once. Problems with many valid answers use custom validators.

**Loading.** A Vite plugin (`scripts/content-index.ts`) builds small indexes of lesson and problem metadata at build time. Lists, navigation and progress use those indexes; each lesson module, problem file, language grammar and the code editor are separate chunks fetched on first use. First load is about 385 KB of JavaScript (~118 KB gzipped).

**Adding content.** Drop a `.md` file in `src/content/learn/` (format documented at the top of `parse.ts`) and reference the concept ids in `curriculum.ts`. Add problems as a `.ts` file in `src/content/problems/` that default-exports an array.

**Adding prep content.** Prep topics use the same Markdown format plus these blocks:
- `:::mcq easy|medium|hard`: a question written as `Q:` and `- options`, with the answer marked `- [x]` and the explanation after `>`.
- `:::context`: a shared passage, table or puzzle shown with the questions that follow it. An empty `:::context` block ends it.
- `:::speak read|repeat|free`, `:::listen` and `:::assessment personality|work-preferences`.

Add the topic id to a module in `src/content/prep/curriculum.ts`, then run `node scripts/check-prep.mjs` to check that every topic exists and every question is well formed. Test attempts are saved to the `test_attempts` table (or to the browser for guests).

## Code execution security

User code never runs unisolated on the API host.

- **Python** runs in the browser via Pyodide (CPython on WebAssembly) in a Web Worker. A hard timeout terminates the worker.
- **Java** without Docker: compiled with annotation processing disabled, run in a separate JVM under a deny-all Security Manager (no file, network, process or reflection access), with `-Xmx256m`, a wall-clock kill, capped output and a stripped environment. Requires JDK < 24. Newer JDKs removed the Security Manager, so this driver refuses to run there.
- **Docker** (used automatically when available, recommended in production): one container per run, with no network, 256 MB memory, 1 CPU, pids limit, a read-only filesystem, all capabilities dropped and a non-root user.
- **Judge0**: set `JUDGE0_URL` (and optionally `JUDGE0_KEY`) to use a remote Judge0 instance.
- Runs are rate-limited (`RUN_RATE_LIMIT`, default 90/min) and queued (`RUNNER_CONCURRENCY`, default 3).

C and C++ need Docker or Judge0. Without either, the compiler explains that they're unavailable.

## Verification

Every problem's reference solution passes its own test suite in both Python and Java. Every lesson example's printed output matches the expected output shown in the lesson (339 checks across 98 lessons). `node scripts/verify-infosys.mjs` checks that the reference solver, the Python solution and the Java solution of every Infosys problem agree on generated test cases (3,192 runs across 3 seeds per problem). All 216 placement-prep topics and 2,136 questions pass the structural check, and every numeric answer was worked through when it was written.
"# Stepwise" 
