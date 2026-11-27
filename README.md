# ENGRAM

**E.N.G.R.A.M.: Encrypted Narrative & Guarded Retrieval Access Memory**
Alaala: My Personal AI Diary

ENGRAM is a mobile-first, AI-assisted personal diary. The owner writes entries and
letters and sets rules in advance for who may read what, and when. After the owner's
vault is released, registered askers (such as a spouse or child) can ask questions in
natural language. The system answers only from entries the rules allow, and cites the
date of every entry it uses.

CS 413 Programming Languages final project (project name: Alaala).

> ENGRAM is not a legal will or an estate-planning tool. It only controls who may read
> diary entries and letters, and when. All data used in this project is fictional.

## Team

| Name | Role |
|---|---|
| Marvin E. Larosa | Project Manager |
| Mark Troylan B. Goyal | Lead Developer |
| Edison D. Estrabela | UI/UX Designer |
| Kim A. Dominguez | QA / Tester |
| Sandra O. De Guzman | Documentation |

## Technology stack

- **Mobile:** React Native, Expo, TypeScript, Expo Router
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** SQLite (initial development)
- **Logic programming:** SWI-Prolog (access rules)
- **Custom language:** Alaala Policy Language (APL)
- **AI model:** GroqCloud – GPT-OSS 20B (`openai/gpt-oss-20b`), selected but not yet
  validated; see [docs/technology-stack-decision.md](docs/technology-stack-decision.md)
- **Testing:** Pytest and API tests; physical Android phone for mobile testing

## Programming paradigms

1. **Object-oriented:** Owner, Entry, Beneficiary, Vault, Protocol, Grant, writing modes
2. **Functional:** pure functions, immutable processing, append-only entries, hash chain
3. **Logic:** Prolog access-control rules (deny by default, deny beats allow)
4. **Language design:** EBNF grammar, lexer, recursive-descent parser, interpreter
5. **Scripting:** grounded AI question and answer using controlled backend tools

## Core features

- Personal diary management
- AI memory assistant
- Beneficiary management
- Legacy policy manager
- Security and privacy management
- AI-assisted writing modes

## Folder structure

| Folder | Contents |
|---|---|
| `backend/` | FastAPI backend source code |
| `mobile/` | React Native (Expo) mobile app source code |
| `prolog/` | Prolog access rules |
| `grammar/` | APL grammar (EBNF) and sample policies |
| `tests/` | Test plan, fictional test data and test code |
| `docs/` | Proposal, requirements, design notes, AI-use log |
| `reports/` | Design report and weekly updates |

## Getting started

```bash
git clone https://github.com/Blancchi/ENGRAM.git
cd ENGRAM
```

Full step-by-step instructions (tool versions, SWI-Prolog, troubleshooting):
[docs/development-environment-setup.md](docs/development-environment-setup.md)

- **Backend:** `cd backend`, `python -m venv .venv`, `.venv\Scripts\Activate.ps1`,
  `python -m pip install -r requirements.txt`, `uvicorn app.main:app --reload`
- **Mobile:** `cd mobile`, `npm ci`, `npx expo start`
- **Tests:** from `backend/` with the venv active, `python -m pytest`
- **Prolog demo:** from `backend/` with the venv active, `python scripts/prolog_demo.py`

Never commit secrets, tokens, API keys or real diary records. Use fictional data only.

## Branching

- `main` always works. Nobody pushes to it directly.
- Create one branch per task: `feature/<task-id>-short-name`
  (example: `feature/2.05-hash-chain`). Use `fix/` for bug fixes and `docs/` for documents.
- Open a pull request. A teammate other than the author reviews and approves it before
  it is merged.

## Commit messages

Format: `type(task-id): short description`

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

Example: `feat(2.05): add hash chain verification`

## Working with AI tools

Development instructions for AI coding tools are in [`CLAUDE.md`](CLAUDE.md). Any code
or text written with AI help is recorded in the [AI-use log](docs/ai-use-log.md).

## Task tracking

Kaneo board: **[PLACEHOLDER: Kaneo link to be added by the lead developer]**