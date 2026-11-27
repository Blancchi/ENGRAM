# ENGRAM

# ENGRAM (Alaala Project)

A personal AI diary that answers questions about its owner's entries
after release, only within rules the owner set in advance.
CS 413 Programming Languages final project.

## Team
| Name | Role |
|---|---|
| Marvin E. Larosa | Project Manager |
| Mark Troylan B. Goyal | Lead Developer |
| Edison D. Estrabela | UI/UX Designer |
| Kim A. Dominguez | QA / Tester |
| Sandra O. De Guzman | Documentation |

## Folder structure
- `backend/` backend source code
- `mobile/` mobile app source code
- `prolog/` Prolog access rules
- `grammar/` policy language grammar (EBNF) and sample policies
- `tests/` test plan, fictional test data and test code
- `docs/` proposal, design notes, AI-use log
- `reports/` design report and weekly updates

## Branching
- `main` always works. Nobody pushes to it directly.
- One branch per task: `feature/<task-id>-short-name`
  (example: `feature/2.05-hash-chain`). Use `fix/` and `docs/` for fixes and documents.
- Open a pull request. A teammate other than the author reviews it before merging.

## Commit messages
Format: `type(task-id): short description`
Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
Example: `feat(2.05): add hash chain verification`

## Task tracking
Kaneo board: [paste link here]