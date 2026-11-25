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

## What's inside

| Area | Contents |
|---|---|
| Learn | 98 lessons across Python, Java and DSA (58 in DSA) (Subject → Module → Lesson → Sections). Each lesson has a Python/Java toggle, runnable examples, expected output, "Python vs Java" callouts, diagrams, dry runs, complexity and quizzes. |
| Practice | 228 judged problems grouped by topic, linked from the lessons. |
| LeetCode 150 | The interview set, with progress, filters, hints, brute-force and optimal approaches, and Python/Java reference solutions. |
| Compiler | Python, Java, C++ and C with stdin, multiple inputs, starter templates and saved snippets. |
| Visualizer | Line-by-line execution of Python and Java programs: call stack, variables, heap objects, array index pointers, linked lists, trees and narration for each step. |
| Placement Prep | Two separate spaces, each with concepts, worked examples, practice questions and timed tests. **Aptitude & Reasoning** (152 topics): Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Communication Skills (read-aloud, sentence repetition and listening practice using browser speech) and Psychometric (Big Five and work-preference self-assessments plus situational judgement). **Technical MCQs** (64 topics): DBMS, OS, Computer Networks, OOP, Software Engineering and Computer Architecture. 2,136 questions in total. |
| Timed tests | A highlighted lesson test on every topic, plus module tests, sectional tests (−0.25 negative marking), a full mock per space and a custom test builder. Exam-style runner with timer, question palette, mark-for-review, keyboard shortcuts, resume after reload and auto-submit. Results include score, accuracy, a per-topic breakdown and an answer review with explanations. |
| Dashboard | Progress per subject and prep space, LeetCode 150 completion, recent tests, activity heatmap, streaks, achievements and saved items. |

Progress is stored in the browser for guests and in SQLite for signed-in users. Guest progress is merged into the account on sign-in.

## Architecture

```
server/            Express API + SQLite (node:sqlite), scrypt passwords, httpOnly session cookies
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

Every problem's reference solution passes its own test suite in both Python and Java. Every lesson example's printed output matches the expected output shown in the lesson (339 checks across 98 lessons). All 216 placement-prep topics and 2,136 questions pass the structural check, and every numeric answer was worked through when it was written.
"# Stepwise" 
