
# ENGRAM – Development Instructions

## Project
E.N.G.R.A.M. (Encrypted Narrative & Guarded Retrieval Access Memory)
Alaala: My Personal AI Diary

ENGRAM is a mobile-first AI-assisted personal diary system.

## Technology Stack
- Mobile: React Native, Expo, TypeScript, Expo Router
- Backend: Python, FastAPI, SQLAlchemy, Pydantic
- Database: SQLite for initial development
- Logic Programming: SWI-Prolog
- Custom Language: Alaala Policy Language (APL)
- Testing: Pytest, API tests
- Primary testing device: Physical Android phone

## Required Programming Paradigms
1. OOP: Owner, Entry, Beneficiary, Vault, Protocol, Grant, writing modes.
2. Functional: Pure functions, immutable processing, append-only entries, hash chains.
3. Logic: Prolog-based access-control rules.
4. Language Design: EBNF, lexer, recursive-descent parser, interpreter.
5. Scripting: Grounded AI Q&A using controlled backend tools.

## Core Features
- Personal Diary Management
- AI Memory Assistant
- Beneficiary Management
- Legacy Policy Manager
- Security and Privacy Management
- AI-Assisted Writing Modes

## Security Requirements
- Deny access by default.
- Explicit deny rules override allow rules.
- Enforce release dates and frozen legacy policies.
- Verify legacy release triggers; missed check-ins alone are insufficient.
- Preserve original diary content.
- The backend must authorize entry access before retrieval.
- Unauthorized entries must never reach the AI model.
- AI answers must use authorized evidence and cite entry dates.
- Never invent memories or disclose restricted entry existence.
- Use fictional data for development and testing.
- Never commit secrets, tokens, API keys, or real diary records.
- Treat a hash chain as tamper evidence, not encryption.

## Development Workflow
- Inspect existing code before modifying files.
- Work on only one approved development step at a time.
- Explain the implementation plan before changing code.
- Keep mobile and backend responsibilities separate.
- Use clear, maintainable, testable code.
- Add appropriate automated tests.
- Report which tests actually ran and their results.
- Never delete or overwrite existing work without approval.
- Do not install dependencies without explaining why.
- Do not push or commit changes automatically.
- Ask for approval before advancing to the next major task.

## Current Progress
- GitHub repository initialized.
- Expo mobile starter app runs on Android.
- Python virtual environment created.
- Initial backend dependencies installed.
- FastAPI /health endpoint works.
- FastAPI /docs endpoint works.
- Backend Pytest suite with /health tests (Step 5.5).

## Current Task
Step 5.6: SQLite + SQLAlchemy database foundation.
Database config, engine, declarative Base, session factory, `get_db` dependency,
and isolated database tests. No models, CRUD endpoints, AI, Prolog, or APL yet.
