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
- **AI model:** [add model and provider]
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

- **Backend:** [add the commands to create the virtual environment, install
  dependencies and start the server]
- **Mobile:** [add the commands to install dependencies and start Expo]
- **Tests:** [add the pytest command]

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
or text written with AI help is recorded in the AI-use log in `docs/`.

## Task tracking

Kaneo board: https://msi.tail69002a.ts.net/dashboard/workspace/xPiITYDzF1wnSgCh8GdFGPM1BLOJuC8F/project/xqmdh7wo0l33i7lh3e415w0n/board