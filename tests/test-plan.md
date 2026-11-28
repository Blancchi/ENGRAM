# ENGRAM Test Plan

**Project:** ENGRAM – Alaala: My Personal AI Diary
**Kaneo task:** 1.07 – Prepare Test Plan and Fictional Test Data
**Plan version:** 0.1 (draft for QA review)
**Prepared by:** Backend developer (with AI assistance). **Reviewer:** QA lead (see [Sign-off](#10-qa-review-and-sign-off))

> **Read this first.** Most ENGRAM modules are not built yet. Every *Expected result* below is a
> **specification of required behaviour**, not an observed outcome. A test is marked
> PASSED or FAILED only after it has actually run, with the date and commit recorded.
> All test data is **fictional** (see [`fixtures/`](fixtures/)).

## Contents
1. [Scope](#1-scope)
2. [Acceptance criteria (unverified)](#2-acceptance-criteria-unverified)
3. [Design assumptions](#3-design-assumptions)
4. [Approach and environment](#4-approach-and-environment)
5. [Test data](#5-test-data)
6. [Test cases (63)](#6-test-cases)
7. [Traceability to security requirements](#7-traceability-to-security-requirements)
8. [Entry and exit criteria](#8-entry-and-exit-criteria)
9. [Risks and blockers](#9-risks-and-blockers)
10. [QA review and sign-off](#10-qa-review-and-sign-off)
11. [Execution log](#11-execution-log)

## 1. Scope

**In scope:** 63 test cases in 10 areas:

| # | Area | IDs | Count |
|---|---|---|---|
| 1 | Fixture data and regression | TD-01 – TD-05 | 5 |
| 2 | Personal diary management | DM-01 – DM-06 | 6 |
| 3 | Beneficiaries and access-control policies | BA-01 – BA-08 | 8 |
| 4 | APL lexer | APL-L-01 – APL-L-05 | 5 |
| 5 | APL parser and interpreter | APL-P-01 – APL-P-06 | 6 |
| 6 | Prolog authorization rules | PL-01 – PL-08 | 8 |
| 7 | Immutable entry-processing pipeline | IP-01 – IP-05 | 5 |
| 8 | Append-only records and hash-chain integrity | HC-01 – HC-07 | 7 |
| 9 | AI-assisted writing modes | WM-01 – WM-05 | 5 |
| 10 | Grounded AI Q&A | QA-01 – QA-08 | 8 |
| | **Total** | | **63** |

**Out of scope for this version:**
- Mobile UI tests, which will be added once screens exist.
- Performance and load tests.
- Live AI model quality evaluation, beyond the opt-in smoke test QA-08.
- Encryption at rest, which hasn't been designed yet.

## 2. Acceptance criteria (unverified)

The Kaneo Task 1.07 card was **not available** while this plan was prepared. The criteria below
are **assumptions** based on the lead developer's request. The QA lead should check each one
against the Kaneo card and tick it or correct it.

| # | Assumed criterion | Where it is addressed | Confirmed? |
|---|---|---|---|
| AC-1 | The test plan covers diary management, beneficiaries/access, the APL lexer and parser, Prolog rules, the immutable pipeline, the hash chain, writing modes and grounded AI Q&A | §6 | ☐ |
| AC-2 | At least 20 fully fictional diary entries with varied types, topics, timestamps and access conditions | `fixtures/fictional_entries.json` (22 entries) | ☐ |
| AC-3 | At least 6 access scenarios: allow, deny, conflict, release date, unauthorized | `fixtures/access_scenarios.json` (10 scenarios) | ☐ |
| AC-4 | Every test case has an ID, objective, input/preconditions, expected result and status | §6 | ☐ |
| AC-5 | Tests that can run now are separated from tests blocked on modules | Status column in §6 | ☐ |
| AC-6 | The QA lead reviews and approves the deliverables | §10 | ☐ |

## 3. Design assumptions

These are working assumptions, to be confirmed as the design is finalized.

| Topic | Assumption used in this plan | Status |
|---|---|---|
| Writing modes | **Verbatim**: saved exactly as written. **Light Fix**: AI suggests minor spelling and grammar fixes. **Review**: AI gives feedback without rewriting. In every mode the original text is preserved, and AI output is saved only after the owner accepts it. | Mode names confirmed by the lead developer; detailed behaviour is an assumption |
| Entry types | `diary` is the base Entry. `letter` and `legacy_lesson` are **provisional subclasses**. Topic labels (health, finance, reflection, memory) are tags, not types. | Provisional, pending the UML (Task 2.02) |
| Corrections | An append-only **record** that refers to the original entry through `corrects_entry_id`. The original is never changed. | Assumption |
| Access policy format | The fixtures use a neutral structured format (grants, denies, `available_from`, `owner_only`). | It is **not** APL syntax and **not** a Prolog fact structure |
| APL syntax | Not yet defined. The APL tests describe behaviour only, and concrete inputs are added once the EBNF grammar exists. | Unknown |
| Prolog facts | Not yet defined. The PL tests describe the decisions that are required. | Unknown |
| Release triggers | A vault is released only when its trigger is verified by a designated verifier. Missed check-ins alone are never enough. | Verification process is an assumption |
| Hash chain | Each record stores the hash of the record before it, and the first (genesis) record links to a fixed starting value. The algorithm (for example SHA-256) is still to be decided. | Assumption |

## 4. Approach and environment

- **Automated tests:** Pytest from `backend/` (`python -m pytest`). This uses the existing
  `pytest.ini` and `conftest.py`, where database tests use throwaway SQLite files.
- **Reference clock:** every time-dependent test uses **`2026-12-01T09:00:00+08:00`**
  (Asia/Manila), never the real current time.
- **AI tests:** QA-01 to QA-07 use a **mocked model**, so the tests can inspect the request
  payload and nothing is sent over the network. QA-08 is the only live test. It is opt-in and
  is skipped when no API key is set.
- **Prolog tests:** these need SWI-Prolog. It is currently unavailable on the lead developer's
  machine, because the executable is held by antivirus quarantine pending a false-positive
  review.
- **Mobile:** manual testing on a physical Android phone. No mobile cases are in this version.

**Status values used in §6:**
- **READY**: can run now.
- **BLOCKED – module**: the module under test isn't implemented yet.
- **BLOCKED – SWI-Prolog**: SWI-Prolog isn't available.
- **PASSED / FAILED (date, commit)**: recorded only after a test actually runs.

## 5. Test data

All fixtures are fictional and documented in [`fixtures/README.md`](fixtures/README.md).

- **People:** owner `OWN-01`; beneficiaries `BEN-01` (daughter), `BEN-02` (son), `BEN-03` (spouse);
  release verifier `VER-01`; unregistered requester `REQ-X`.
- **Vaults:**
  - `VAULT-A`: released, trigger verified, policy frozen.
  - `VAULT-B`: sealed, 3 missed check-ins, trigger **not** verified.
- **Entries:** `E-01` to `E-22`.
  - Types: diary, letter*, legacy_lesson* (*provisional).
  - Writing modes: verbatim, light_fix, review.
  - Access cases:
    - owner-only (`E-04`, `E-13`);
    - grants with and without dates;
    - a deny that overrides a grant (`E-07`, `E-09`);
    - a deny limited to the people it lists (`E-17`);
    - future releases (`E-08`, `E-20`);
    - releases whose date has passed (`E-15`, `E-18`);
    - an entry in a sealed vault (`E-21`);
    - a correction record (`E-22`, which corrects `E-06`).
- **Access scenarios:** `AS-01` to `AS-10`.

| ID | Requester | Action → target | Expected decision (specification) |
|---|---|---|---|
| AS-01 | BEN-01 | read E-05 | ALLOW: explicit grant, vault released |
| AS-02 | BEN-02 | read E-05 | DENY: no grant (deny by default) |
| AS-03 | BEN-02 | read E-07 | DENY: the explicit deny overrides the grant (conflict) |
| AS-04 | BEN-03 | read E-17 | ALLOW: the deny applies only to BEN-01 and BEN-02 |
| AS-05 | BEN-01 | read E-08 | DENY: the release date (2030-08-30) hasn't been reached |
| AS-06 | BEN-02 | read E-15 | ALLOW: the release date (2025-12-01) has passed |
| AS-07 | REQ-X | read E-01 | DENY with a generic response: unregistered requester, and no confirmation that the entry exists |
| AS-08 | BEN-01 | read E-21 | DENY: VAULT-B is sealed, and missed check-ins alone are not enough |
| AS-09 | OWN-01 | update the policy of E-03 | REJECT: VAULT-A's policy is frozen |
| AS-10 | BEN-01 | ask AI "What did Mom write about her health?" | Answer that no authorized entries were found. E-04 and E-17 are never sent to the model, and their existence isn't revealed |

## 6. Test cases

Columns: **ID · Objective · Input / preconditions · Expected result (specification) · Status**

### 6.1 Fixture data and regression (TD), executable now

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| TD-01 | Fixture records are complete and well-typed | Both fixture files | Every entry, person, vault and scenario has all required fields with allowed values (types, writing modes, actions, roles, statuses) | READY (automated) |
| TD-02 | Identifiers are unique | Both fixture files | No duplicate IDs among people, vaults, entries or scenarios | READY (automated) |
| TD-03 | Every reference resolves | Both fixture files | Vault owners and verifiers, entry vaults, grant and deny beneficiaries, `corrects_entry_id`, and scenario requesters, targets and excluded evidence all point to existing records. A correction is created after the entry it corrects. Owner-only entries have no grants | READY (automated) |
| TD-04 | Counts, formats and fictional marker | Both fixture files | At least 20 entries and at least 6 scenarios. Every timestamp is ISO 8601 with a UTC offset. Both files use the same reference clock. Decisions use allowed values and cover ALLOW, DENY and REJECT. Both files are marked `fictional: true` | READY (automated) |
| TD-05 | The existing backend behaviour is unaffected | `python -m pytest` from `backend/` | The whole existing suite (health and database) still passes alongside TD-01 to TD-04 | READY |

TD-01 to TD-04 are implemented in `backend/tests/test_data/test_fictional_fixtures.py`, as 12 Pytest
items, because TD-02 is parametrized over 4 collections.

### 6.2 Personal diary management (DM)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| DM-01 | Create an entry | Owner OWN-01 submits E-01's title and content | The entry is stored with a server-assigned timestamp and an ID. Its stored content equals the input exactly | BLOCKED – module |
| DM-02 | The owner reads their own private entry | E-04 stored (owner-only) | OWN-01 receives E-04's full content | BLOCKED – module |
| DM-03 | Entries cannot be edited | E-06 stored, then an update request changes its content | The update is rejected. E-06's stored content is unchanged | BLOCKED – module |
| DM-04 | Entries cannot be deleted | E-06 stored, then a delete request | The delete is rejected. E-06 can still be read by the owner | BLOCKED – module |
| DM-05 | Required fields are validated | A create request missing the title or content | A validation error. Nothing is stored | BLOCKED – module |
| DM-06 | The entry type is recorded | Create E-02 (`letter`*) and E-03 (`legacy_lesson`*) | The stored type matches the input. (*Provisional: the test doesn't check subclass-specific attributes) | BLOCKED – module |

### 6.3 Beneficiaries and access-control policies (BA)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| BA-01 | Register a beneficiary | OWN-01 registers BEN-01 as daughter | BEN-01 is stored as a registered beneficiary of OWN-01 with that relationship | BLOCKED – module |
| BA-02 | Explicit grant allows access | AS-01 | ALLOW. The content of E-05 is returned | BLOCKED – module |
| BA-03 | Deny by default | AS-02 | DENY with a generic response | BLOCKED – module |
| BA-04 | Deny overrides allow | AS-03 | DENY with a generic response | BLOCKED – module |
| BA-05 | A deny is limited to the people it lists | AS-04 | ALLOW for BEN-03 | BLOCKED – module |
| BA-06 | Release dates are enforced | AS-05 and AS-06, at the reference clock | AS-05 is DENY (date in the future). AS-06 is ALLOW (date passed) | BLOCKED – module |
| BA-07 | Unregistered requesters are denied without revealing anything | AS-07, plus the same request for a non-existent entry ID | Both are DENY with **identical** responses (status and body) | BLOCKED – module |
| BA-08 | Missed check-ins alone don't release a vault | AS-08 | DENY. VAULT-B stays sealed | BLOCKED – module |

### 6.4 APL lexer (APL-L)

The concrete APL source text is added once the EBNF grammar is defined.

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| APL-L-01 | Keywords are recognised | A policy that uses each keyword | Each keyword becomes its own keyword token | BLOCKED – module |
| APL-L-02 | Identifiers and string literals | A policy that names `BEN-01` and a quoted title | They become identifier and string tokens with exact values | BLOCKED – module |
| APL-L-03 | Date literals | A policy containing `2030-08-30` | A single date token with that value | BLOCKED – module |
| APL-L-04 | Invalid characters are reported | A policy containing a character outside the grammar | A lexer error stating the character, line and column | BLOCKED – module |
| APL-L-05 | Whitespace and comments are skipped | A policy with blank lines and comments | No tokens for whitespace or comments, and the token positions are correct | BLOCKED – module |

### 6.5 APL parser and interpreter (APL-P)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| APL-P-01 | Parse a valid policy | A valid policy equivalent to E-07's access policy | An AST holding the same grants and deny | BLOCKED – module |
| APL-P-02 | Syntax errors are reported with their position | A policy with a missing terminator or bracket | A parse error stating the line and column. No partial policy is accepted | BLOCKED – module |
| APL-P-03 | Unknown beneficiaries are rejected | A policy that references an undefined beneficiary | A semantic error naming the unknown beneficiary | BLOCKED – module |
| APL-P-04 | The interpreter matches the fixture policies | APL versions of the policies used in AS-01 to AS-08 | Interpreting them gives the same decisions as the scenarios' expected decisions | BLOCKED – module |
| APL-P-05 | Deny precedence is kept | A policy that allows and denies the same person | The interpreted result denies that person | BLOCKED – module |
| APL-P-06 | Frozen policies cannot be changed | AS-09 | REJECT. E-03's policy is unchanged | BLOCKED – module |

### 6.6 Prolog authorization rules (PL)

The fact structure is still to be designed. Each test turns the fixture's structured policy into
the facts the future design uses.

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| PL-01 | Explicit grant allows access | AS-01 | The access query succeeds | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-02 | No facts means deny | AS-02 | The access query fails (deny) | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-03 | Deny overrides allow | AS-03 | The access query fails | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-04 | A deny is limited to the people it lists | AS-04 | The access query succeeds for BEN-03 | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-05 | Future release dates deny | AS-05, with the reference clock passed in as a fact | The access query fails | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-06 | Release dates that have passed allow | AS-06, with the reference clock passed in as a fact | The access query succeeds | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-07 | Unregistered requesters are denied | AS-07 | The access query fails | BLOCKED – module; BLOCKED – SWI-Prolog |
| PL-08 | A vault is released only by a verified trigger | AS-08 | The access query fails, and VAULT-B is not treated as released | BLOCKED – module; BLOCKED – SWI-Prolog |

### 6.7 Immutable entry-processing pipeline (IP)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| IP-01 | Processing doesn't mutate its input | Run each pipeline function on E-03, then compare with a deep copy | The input is unchanged | BLOCKED – module |
| IP-02 | Processing is deterministic | Run the pipeline twice on E-12 | Both outputs are identical | BLOCKED – module |
| IP-03 | The original content is preserved | Process E-06 (light_fix) | The original content is kept byte for byte, alongside any derived output | BLOCKED – module |
| IP-04 | Derived data is stored separately | Process E-16 | Derived data (for example a summary or tags) is a separate record linked to E-16. E-16 itself is unchanged | BLOCKED – module |
| IP-05 | The pipeline order is fixed | Process E-01 through the full pipeline | The steps run in the documented order, and changing their order isn't possible through configuration | BLOCKED – module |

### 6.8 Append-only records and hash-chain integrity (HC)

> The hash chain provides **tamper evidence, not encryption**. Hashed content is still stored as
> readable text.

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| HC-01 | The genesis link | Append E-01 to an empty chain | The record's previous-hash equals the documented starting value | BLOCKED – module |
| HC-02 | Each record links to its predecessor | Append E-01 to E-05 | Each record's previous-hash equals the hash of the record before it | BLOCKED – module |
| HC-03 | A clean chain verifies | E-01 to E-22 appended in `created_at` order | Verification reports the chain as valid | BLOCKED – module |
| HC-04 | Edited content is detected | Chain from HC-03, then E-10's stored content is changed directly | Verification fails and identifies the first invalid record | BLOCKED – module |
| HC-05 | A deleted record is detected | Chain from HC-03, then E-11 is removed directly | Verification fails at the break | BLOCKED – module |
| HC-06 | Reordering is detected | Chain from HC-03, then E-12 and E-13 are swapped | Verification fails | BLOCKED – module |
| HC-07 | A correction is appended, not edited | Chain containing E-06, then E-22 (`corrects_entry_id: E-06`) is appended | E-22 is a new record that links to E-06. E-06 is unchanged. The chain still verifies | BLOCKED – module |

### 6.9 AI-assisted writing modes (WM)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| WM-01 | Verbatim stores the text unchanged | Submit E-01's content in Verbatim mode | The stored content equals the input exactly, and no AI call is made | BLOCKED – module |
| WM-02 | Light Fix suggests without overwriting | Submit E-03's content with a deliberate typo, in Light Fix mode (mocked AI) | A suggestion is returned. The original text is kept unchanged | BLOCKED – module |
| WM-03 | Review gives feedback without rewriting | Submit E-05's content in Review mode (mocked AI) | Feedback is returned. No rewritten entry text is produced or stored | BLOCKED – module |
| WM-04 | Nothing is saved without the owner's acceptance | Light Fix suggestion, then the owner rejects it, then the owner accepts another one | After the rejection only the original is stored. After acceptance the accepted text is stored **and** the original is preserved | BLOCKED – module |
| WM-05 | The mode is recorded | Entries created in each of the three modes | Each stored entry records its writing mode | BLOCKED – module |

### 6.10 Grounded AI Q&A (QA)

| ID | Objective | Input / preconditions | Expected result (specification) | Status |
|---|---|---|---|---|
| QA-01 | Only authorized evidence reaches the model | AS-10 with a mocked model | The payload sent to the model contains no content from E-04 or E-17. Every included entry is one BEN-01 is authorized to read | BLOCKED – module |
| QA-02 | Answers cite entry dates | BEN-01 asks about the calamansi planting (mocked model) | The answer cites E-01's date (2024-01-03) | BLOCKED – module |
| QA-03 | Insufficient evidence is reported | AS-10 | The answer says no authorized entries were found, without guessing | BLOCKED – module |
| QA-04 | No invented memories | A question about an event in none of the authorized entries | The answer doesn't describe the event as a memory, and every claim it makes points to cited evidence | BLOCKED – module |
| QA-05 | Restricted entries are not disclosed | AS-10 compared with the same question asked when E-04 and E-17 don't exist | The two responses are identical | BLOCKED – module |
| QA-06 | Unauthorized requesters cause no model call | REQ-X asks any question | Denied with a generic response. The mocked model is never called | BLOCKED – module |
| QA-07 | An unreleased vault causes no model call | BEN-01 asks about VAULT-B | Denied. The mocked model is never called | BLOCKED – module |
| QA-08 | Live provider smoke test (opt-in) | Marker `ai_smoke`, a set `GROQ_API_KEY`, fictional entries only | The API is reachable, the model ID is accepted, and the answer cites a date. Skipped when no key is set | BLOCKED – module |

## 7. Traceability to security requirements

From the *Security Requirements* in `CLAUDE.md`:

| Security requirement | Test IDs |
|---|---|
| Deny access by default | BA-03, PL-02 |
| Explicit deny rules override allow rules | BA-04, BA-05, PL-03, PL-04, APL-P-05 |
| Enforce release dates and frozen legacy policies | BA-06, PL-05, PL-06, APL-P-06 |
| Verify release triggers; missed check-ins alone are insufficient | BA-08, PL-08, QA-07 |
| Preserve original diary content | DM-03, DM-04, IP-03, IP-04, HC-07, WM-02, WM-03, WM-04 |
| Authorize entry access before retrieval | BA-02 – BA-08, QA-01, QA-06 |
| Unauthorized entries never reach the AI model | QA-01, QA-06, QA-07 |
| AI answers use authorized evidence and cite entry dates | QA-01, QA-02 |
| Never invent memories or disclose restricted entry existence | BA-07, QA-03, QA-04, QA-05 |
| Use fictional data for development and testing | TD-04, plus every fixture |
| Never commit secrets, tokens, API keys or real diary records | Process control: the QA review checklist (§10) |
| A hash chain is tamper evidence, not encryption | HC-01 – HC-07, and the note in §6.8 |

## 8. Entry and exit criteria

**Entry, per area:** the module is implemented on a branch; its design assumptions from §3 are
confirmed or updated; the fixtures are valid (TD-01 to TD-04 pass); for PL tests, SWI-Prolog is
available and verified safe.

**Exit, per area:** every case in the area has been run. Every security-critical case passes:
BA, PL, HC, QA-01, QA-05, QA-06 and QA-07. Any failure has a linked issue. Results are recorded in
§11 with the date and commit.

## 9. Risks and blockers

| Risk / blocker | Impact | Mitigation |
|---|---|---|
| The UML isn't final (Task 2.02 postponed) | Entry subclasses and their attributes may change | Treat the subclasses as provisional. Tests avoid subclass-specific attributes |
| The APL grammar isn't defined | APL tests can't have concrete inputs yet | The tests specify behaviour now. Inputs are added once the EBNF exists |
| SWI-Prolog is unavailable (antivirus quarantine pending false-positive review) | PL-01 to PL-08 can't run | Keep them blocked. Don't bypass antivirus. Re-plan once the executable is cleared |
| The AI model hasn't been tested yet | QA-08 is unverified, and how well answers are grounded is unknown | Mocked-model tests for QA-01 to QA-07. Live test kept opt-in |
| Fixture expectations drift from the final design | Tests could encode the wrong rules | The QA lead reviews the scenarios. The fixtures are versioned (`schema_version`) |

## 10. QA review and sign-off

**Review checklist for the QA lead:**
- [ ] AC-1 to AC-6 (§2) checked against the Kaneo Task 1.07 card
- [ ] The design assumptions (§3) confirmed or corrected
- [ ] All fixture data is fictional: no real people, team members, contacts, addresses or secrets
- [ ] Every test case has an ID, objective, input/preconditions, expected result and status
- [ ] Expected results read as specifications. No status claims a result for an unbuilt module
- [ ] The traceability table (§7) covers every security requirement
- [ ] The TD tests' output was checked (§11)

| Role | Name | Decision | Date | Plan version |
|---|---|---|---|---|
| QA lead | *Not recorded* | *Pending* | *Pending* | 0.1 |

## 11. Execution log

Record only tests that were actually run.

| Date | Branch / commit | Command | Tests run | Result |
|---|---|---|---|---|
| 2026-11-28 | `docs/1.07-test-plan`, base `be510ae`, with the Task 1.07 files not yet committed | `python -m pytest` (from `backend/`) | TD-01 to TD-04 (12 items) and TD-05 (the existing 21 tests) | 33 passed, 0 failed. Run before review |

The cases in §6.2 to §6.10 (58 cases) have **not been run**. Their modules are not implemented.
