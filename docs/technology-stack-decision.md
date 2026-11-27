# Technology Stack Decision Note

**Project:** ENGRAM – Alaala: My Personal AI Diary
**Kaneo task:** 1.04 – Technology Stack and Development Environment
**Status:** Accepted, except where marked *pending validation*.
Python–Prolog integration: *pending verification* (see [Verification status](#verification-status)).

This note records which tools ENGRAM uses, why we chose them, and which of the five
required programming paradigms each one supports. Setup steps are in
[development-environment-setup.md](development-environment-setup.md).

## Summary

| Layer | Choice | Version in repo | Paradigm(s) supported |
|---|---|---|---|
| Mobile app | React Native + Expo + TypeScript + Expo Router | Expo SDK ~58, RN 0.88.1, TS ~6.0 | OOP (UI components) |
| Backend API | Python + FastAPI + Pydantic | Python 3.13, FastAPI 0.165, Pydantic 2.14 | OOP, Functional, Scripting |
| Persistence | SQLAlchemy 2.x + SQLite | SQLAlchemy 2.1.9, SQLite 3.50 | OOP (ORM models), Functional (append-only) |
| Access rules | SWI-Prolog, called from Python | 11.0.1 installed, *not yet verified* | Logic |
| Policy language | Alaala Policy Language (APL), written in Python | — | Language design |
| AI model | GroqCloud – GPT-OSS 20B (`openai/gpt-oss-20b`) | — | Scripting (*pending validation*) |
| Testing | Pytest + FastAPI TestClient; Android phone | pytest 9.2, httpx 0.28 | — |
| Collaboration | GitHub, Kaneo, AI-use log, `CLAUDE.md` | — | — |

## Verification status

| Item | Status |
|---|---|
| Backend test suite (health, database, Prolog discovery) | Verified: runs and passes with `python -m pytest` |
| Python → SWI-Prolog demo | **Pending.** The demo code is written. SWI-Prolog 11.0.1 was installed on the lead developer's machine with winget, but antivirus software quarantined `swipl.exe` as suspicious, so the demo has not run yet. The team has submitted the file for false-positive analysis. |
| GroqCloud – GPT-OSS 20B | **Not tested.** Selected by the team only (see below) |

winget's installer hash check only confirms that the download matched what winget expected. It
does **not** show that the quarantined executable is safe. The team will restore or reinstall
SWI-Prolog only after the antivirus vendor's analysis, and will then run the demo and record the
real output.

## How the paradigms map onto the stack

1. **Object-oriented:** Python classes for Owner, Entry, Beneficiary, Vault, Protocol, Grant
   and the writing modes, persisted as SQLAlchemy ORM models.
2. **Functional:** pure Python functions for processing entries, immutable (append-only)
   diary entries, and a hash chain over entries. The hash chain is tamper evidence, not encryption.
3. **Logic:** SWI-Prolog rules decide who may read which entry and when, with deny by default
   and explicit deny overriding allow.
4. **Language design:** APL gets an EBNF grammar, a hand-written lexer, a recursive-descent
   parser and an interpreter, all in Python.
5. **Scripting:** the backend runs the AI question-and-answer flow through a small set of
   controlled tools, feeding the model only evidence it has already authorized.

## Decisions

### Python + FastAPI (backend)
- **Why:** Python is the language the whole team knows best, and it can host four of the five
  paradigms in one codebase. FastAPI gives typed endpoints, automatic `/docs`, and Pydantic
  validation at the API boundary, and its in-process TestClient makes API tests fast.
- **Alternatives considered:** Django (heavier and opinionated about its own ORM and admin), Flask
  (no built-in validation or typed schemas), and Node/Express (it would split backend logic away from the
  Python APL and Prolog tooling).

### SQLAlchemy 2.x + SQLite (persistence)
- **Why:** SQLite is a single file with no server to install, so every teammate can run the backend
  right away. SQLAlchemy 2.x maps the OOP domain classes to tables, and it lets us move to
  PostgreSQL later by changing `ENGRAM_DATABASE_URL`.
- **Current state (Step 5.6):** the engine, declarative `Base`, session factory and `get_db`
  dependency exist. The database URL comes from the environment, `PRAGMA foreign_keys=ON` is set,
  and tests run against throwaway databases.
- **Important:** SQLite stores data **unencrypted** on disk. Encryption at rest is a separate,
  later decision. The `.db` files are git-ignored.
- **Alternatives considered:** PostgreSQL (needs a server and is overkill for now) and raw `sqlite3`
  (no ORM, so the OOP mapping would be harder).

### React Native + Expo + TypeScript + Expo Router (mobile)
- **Why:** one codebase targets Android, our primary test device. Expo Go lets everyone test on a
  physical phone without building an APK. TypeScript catches errors at compile time, and Expo Router
  gives file-based navigation.
- **Responsibility split:** the mobile app is a client only. All authorization, Prolog and AI calls
  happen in the backend, and the app never holds API keys.
- **Alternatives considered:** native Kotlin (Android only, and slower for a mixed-skill team) and Flutter
  (Dart, which no one on the team uses).

### SWI-Prolog (logic paradigm)
- **Why:** it is a mature, free Prolog with good Windows support. Access-control rules such as
  "deny by default" and "deny overrides allow" are naturally expressed as logic rules.
- **Integration approach:** Python starts the `swipl` executable with `subprocess.run`, passing
  arguments as a list (no shell). This is designed to handle Windows paths that contain spaces.
  The minimal demo (`backend/scripts/prolog_demo.py` + `prolog/demo/stack_demo.pl`) is written,
  but **it has not been run successfully yet**; see [Verification status](#verification-status).
- **Why subprocess and not a Python binding (for example `janus-swi` or `pyswip`):** it needs
  no extra Python dependency, it is easy to debug from a terminal, and a Prolog crash cannot take
  down the API process. We can revisit this if per-call start-up time becomes a problem.
- **Not yet built:** the real ENGRAM authorization rules.

### Alaala Policy Language (APL)
- **Approach:** plain Python, with no parser generator, so the language-design work is visible
  and assessable:
  EBNF grammar (in `grammar/`) → hand-written lexer → recursive-descent parser → AST →
  interpreter that validates policies and produces Prolog facts for the access-rule engine.
- **Alternatives considered:** Lark or ANTLR. Both are faster to build with, but they would hide the lexer and parser
  that the course requires us to write ourselves.

### AI orchestration
- **Flow:** request → backend checks access with Prolog → backend retrieves **only authorized**
  entries → those entries go to the model as evidence → the answer must cite entry dates →
  the backend returns the answer.
- **Rules:** unauthorized entries never reach the model, the model must not invent memories,
  and answers must never reveal that restricted entries exist.
- The model is called through a small provider-neutral adapter in the backend, so it can be
  swapped later without touching the rest of the code.

### AI provider and model: selected, *pending validation*

| Item | Decision |
|---|---|
| Provider | GroqCloud |
| Model | GPT-OSS 20B |
| Model ID | `openai/gpt-oss-20b` |
| Integration | The Python FastAPI backend calls Groq's API, server-side only |
| Status | **Selected by the team. API connectivity, model quality and grounding have not yet been tested.** |

- **Rationale:** an open-weight model on fast hosted inference. Because the weights are open,
  the AI layer is not locked to one vendor. Details such as limits, pricing and data handling
  should be confirmed in Groq's current documentation before we rely on them.
- **Security notes:**
  - `GROQ_API_KEY` belongs only in `backend/.env` (git-ignored). It must never be committed or sent
    to the mobile app.
  - Authorized diary excerpts are sent to a third-party service. Review Groq's data-retention and
    data-use terms before any non-fictional data is used.
  - Prolog authorization still runs first. Only authorized evidence is ever sent.
- **Open risks to track:** whether answers cite entry dates reliably, whether the model refuses
  when the evidence is insufficient, answer quality in Filipino and English, and rate limits.

#### Planned smoke test (future task, not part of 1.04)
A small, isolated test to validate the selection before the AI Memory Assistant is built:

- **Location:** `backend/tests/ai_smoke/test_groq_smoke.py`. It is kept separate from the
  Prolog demo.
- **Opt-in:** it uses the pytest marker `ai_smoke`, is excluded from the normal `pytest` run, and is
  skipped when `GROQ_API_KEY` is not set. No one makes network calls by accident.
- **Input:** two or three **fictional** dated diary entries given as evidence, plus a question.
- **Checks:**
  1. the API is reachable and accepts the model ID;
  2. the answer is not empty;
  3. the answer cites at least one of the given entry dates;
  4. a question the evidence cannot answer gets a "not found in the authorized entries" style
     reply, not an invented memory.
- **Client library:** either the `httpx` package we already have, against Groq's
  OpenAI-compatible endpoint, or the official `groq` SDK. This will be decided, and approved
  before anything is installed, in that task.
- **Out of scope:** retrieval, the Memory Assistant endpoint, prompt templates, storing answers.

### Testing
- **Backend:** Pytest with FastAPI TestClient (needs `httpx`). Database tests use throwaway SQLite
  files and fail the run if the development database is touched. Tests for finding the SWI-Prolog
  executable never run Prolog, so they run everywhere. The tests that actually call SWI-Prolog
  are skipped automatically on machines where it is not available.
- **Mobile:** manual testing on a physical Android phone through Expo Go.

### Collaboration
- **GitHub:** `main` always works. Each task gets its own branch (`feature/`, `fix/`, `docs/`),
  and pull requests are reviewed by a teammate other than the author.
- **Kaneo:** the task board. Each task links its evidence, such as PRs, screenshots and test output.
- **[AI-use log](ai-use-log.md)** and **`CLAUDE.md`:** record and steer AI-assisted work.

## Dependency review (as of Task 1.04)

**Backend (`backend/requirements.txt`)**
- Exact pins from `pip freeze`, which is good for reproducibility.
- Runtime and test-only packages (`pytest`, `httpx`) share one file. **Follow-up:** split them into
  `requirements.txt` and `requirements-dev.txt`.
- `opentelemetry-api` is pinned but not used by our code. **Follow-up:** confirm what pulled it in,
  and remove it if nothing needs it.
- Starlette prints a deprecation warning recommending `httpx2` for the test client. The tests
  still pass. **Follow-up:** revisit this when upgrading.

**Mobile (`mobile/package.json`)**
- Expo SDK ~58 with React Native 0.88.1, React 19.3, TypeScript ~6.0, Expo Router ~58.
- `@expo/ngrok` (dev) enables `expo start --tunnel` when the phone and laptop are on different
  networks.
- A lockfile is committed. Teammates should use `npm ci` so everyone installs identical versions.

No dependencies were added or changed in Task 1.04.
