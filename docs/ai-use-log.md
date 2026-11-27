# AI-Use Log

This log records code and text produced with AI help, as required by Kaneo Task 1.08.
Each entry uses the fields below. When a detail was not captured at the time, it is marked
**Not recorded**. Never fill it in from memory or guesswork.

> **For the documentation lead:** this file was drafted with AI help during Task 1.04. Please
> review the entry below, fill in the fields marked *Not recorded* where you can confirm them
> (for example, from the Claude Code session history), and add yourself as reviewer.

## Entry template

| Field | Value |
|---|---|
| Date | YYYY-MM-DD (or a range) |
| Task | Kaneo task ID and title |
| AI tool / model | Tool name and model |
| Prompt | The prompt text, a faithful summary, or a link to it |
| AI response / output | What the AI produced (files, text, plans) |
| Changes made | Files created or modified as a result |
| Human decisions | What team members decided, approved or rejected |
| Verification performed | Tests run, results, manual checks, and anything still pending |
| Reviewer | Name and review date |

---

## Entry: Kaneo Task 1.04 – Technology Stack and Development Environment

| Field | Value |
|---|---|
| Date | 2026-11-27 to 2026-11-28 |
| Task | 1.04 – Technology Stack and Development Environment (branch `docs/1.04-tech-stack`) |
| AI tool / model | Claude Code (VS Code extension), model Claude Opus 5.5 |
| Prompt | **Not recorded** in this log. The lead developer gave the instructions in a Claude Code session. *Documentation lead: add the prompt text or a summary from the session history.* |
| AI response / output | Implementation plans for Task 1.04, which the lead developer revised and approved before any files were changed. Drafts of the files listed under "Changes made". A repository review that found documentation gaps. |
| Changes made | **New:** `docs/technology-stack-decision.md`, `docs/development-environment-setup.md`, `docs/ai-use-log.md`, `prolog/demo/stack_demo.pl`, `backend/scripts/__init__.py`, `backend/scripts/prolog_demo.py`, `backend/tests/prolog/__init__.py`, `backend/tests/prolog/test_prolog_demo.py`, `backend/tests/prolog/test_prolog_discovery.py`. **Modified:** `README.md`, `CLAUDE.md`. No application code (`backend/app/`, `mobile/`) or dependencies were changed. |
| Human decisions | The team selected GroqCloud – GPT-OSS 20B (`openai/gpt-oss-20b`) as the AI model, which is not yet tested. The lead developer approved the plans and approved installing SWI-Prolog through winget; winget selected version 11.0.1. The lead developer found that AVG Antivirus had quarantined `swipl.exe` and submitted it to AVG for false-positive analysis. The team is not restoring or whitelisting `swipl.exe` until that analysis has been reviewed and the executable's safety has been verified. The lead developer asked for the documentation to mark Prolog verification as pending. |
| Verification performed | Backend test suite (`python -m pytest`, 2026-11-28): **25 passed, 3 skipped, 0 failed**. The 3 skipped tests are the ones that call SWI-Prolog; they were skipped because `swipl.exe` is unavailable. **Pending:** the Python → SWI-Prolog demonstration has not run successfully. **Not tested:** GroqCloud / GPT-OSS 20B. The documentation has not yet been reviewed by a team member. |
| Reviewer | **Not recorded** (pending review by the documentation lead) |
