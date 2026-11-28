# ENGRAM Policy Language (APL): EBNF Grammar Draft (Task 2.01)

Version 3 \| Revised for team review \| November 27, 2026

Team: Marvin E. Larosa, Mark Troylan B. Goyal, Edison D. Estrabela, Kim A. Dominguez, Sandra O. De Guzman.

Review status: Proposed revision, pending team approval. The release syntax and default behavior below are recommended design decisions, not yet confirmed against the live CLAUDE.md or Kaneo card.

## Purpose

The Alaala Policy Language (APL) lets an ENGRAM owner specify who may access diary entries and letters, at what level, and when. The lexer and recursive-descent parser produce an abstract syntax tree (AST). Semantic validation checks the policy before the interpreter builds Prolog facts. The language remains small and uses semicolon-terminated statements.

## Design choices

1\. Deny by default. Anything not explicitly allowed is denied.

2\. Deny overrides allow. A matching deny blocks all levels of access.

3\. Three access levels: existence, summary and full.

4\. Time clauses support sealed letters and dated permissions.

5\. Verified legacy release is a mandatory backend gate; missed check-ins alone cannot release a vault. Numerical trustee quorum and key splitting are not included in this proposed core grammar.

6\. One policy per vault, with one-token lookahead for recursive-descent parsing.

7\. Legacy Lessons is the selected add-on. Lessons are proposed to reuse diary storage and existing APL targets.

## Scope and source basis

Retain the six core features and Legacy Lessons. Do not introduce Memory Fading and Consent Refresh, Trustee Quorum Release, or custody transfer without a separate approved scope decision. A basic trusted verification procedure may still be used by the backend if the team approves it. The original handout requires at least four statement types and three sample programs; V3 provides five concrete statement types and three samples.

# Lexical rules and EBNF grammar

## Lexical rules (Task 2.11)

| **Token**            | **Description / examples**                                                                                                                                                                                                                                         |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| KEYWORD              | Reserved lowercase words: policy, for, owner, beneficiary, named, default, mode, release, when, legacy, verified, allow, deny, on, all, entries, tag, entry, type, after, before, existence, summary, full, diary, letter, verbatim, lightfix, review, mentioning. |
| IDENT                | ASCII letter followed by zero or more ASCII letters, digits or underscores; case-sensitive. Example: maria, vault_001.                                                                                                                                             |
| STRING               | Double-quoted text; no embedded double quote or newline. No escape syntax in V3. Examples: "family", "ENT-020".                                                                                                                                                    |
| DATE                 | Exactly YYYY-MM-DD, e.g. 2040-05-01. Calendar validity is checked semantically.                                                                                                                                                                                    |
| Symbols              | { } ; ,                                                                                                                                                                                                                                                            |
| Comment / whitespace | \# to end of line, outside strings; spaces, tabs and newlines ignored.                                                                                                                                                                                             |

Scan complete identifiers before keyword classification. Scan a complete date as one token; reject malformed dates and unknown characters. A \# inside a quoted string is ordinary text. Require end-of-input after the closing policy brace.

## EBNF grammar

Notation: = defines; comma joins; \| chooses; \[ \] is optional; { } repeats zero or more times; quoted text denotes a literal. IDENT, STRING and DATE are lexer tokens.

```
program = policy ;
policy = "policy" , STRING , "for" , "owner" , IDENT ,
               "{" , { statement } , "}" ;
statement = beneficiary | default_mode | release | rule ;
beneficiary = "beneficiary" , IDENT , [ "named" , STRING ] , ";" ;
default_mode = "default" , "mode" , mode , ";" ;
mode = "verbatim" | "lightfix" | "review" ;
release = "release" , "when" , "legacy" , "verified" , ";" ;
rule = allow_rule | deny_rule ;
allow_rule = "allow" , subjects , level , "on" , target ,
               [ "after" , DATE ] , ";" ;
deny_rule = "deny" , subjects , "on" , target ,
               [ "before" , DATE ] , ";" ;
subjects = IDENT , { "," , IDENT } ;
level = "existence" | "summary" | "full" ;
target = "all" , "entries" | "tag" , STRING
               | "entry" , STRING | "type" , entry_type
               | "mentioning" , IDENT ;
entry_type = "diary" | "letter" ;
```

The five concrete statement types are beneficiary, default_mode, release, allow_rule and deny_rule. An empty file is invalid; an empty policy body is syntactically valid and grants no access.

# Policy semantics and access enforcement

| **Statement**                            | **Meaning**                                                                                                                  |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| beneficiary maria named "Maria Navarro"; | Declares a registered beneficiary identifier and optional display name; identity must be linked to an authenticated account. |
| default mode lightfix;                   | Owner writing-mode preference. Proposed default if omitted: verbatim. Original text is always retained.                      |
| release when legacy verified;            | Declares the mandatory legacy verification gate; it does not perform verification or release the vault.                      |
| allow maria summary on tag "family";     | Permits a cited summary of matching entries after all gates pass.                                                            |
| deny maria on tag "business";            | Blocks all access levels for matching entries.                                                                               |
| allow ... after 2040-05-01               | Permission starts on May 1, 2040 (inclusive).                                                                                |
| deny ... before 2040-05-01               | Denial applies strictly before May 1, 2040.                                                                                  |

## Release and sealed letters

While ALIVE or verification is pending, beneficiaries cannot access protected vault entries. The release clause is optional syntax; when omitted, the same verified-release gate still applies. A missed check-in may initiate review but never unlocks the vault. Only the approved, authenticated backend process may establish verification; neither APL text, an AI answer nor a beneficiary request can set that state. On successful activation the vault transitions to RELEASED and the policy is frozen. Missing, invalid or inconsistent state results in denial.

Prolog must enforce each sealed letter's own release date independently of policy grants, for every beneficiary. Use the trusted request date in the configured vault time zone; if the date or zone cannot be determined, fail closed. Date comparisons use real calendar dates, not text fragments or arithmetic expressions.

## Rule matching and disclosure

Resolve the authenticated requester and vault before evaluating rules. Apply all matching time and target predicates. If any applicable deny matches, deny; otherwise select the highest matching allow (full \> summary \> existence). No matching allow means deny. The mentioning target uses a verified person identifier from entry metadata; ambiguous or unresolved names do not match a grant.

| **Decision** | **Permitted AI-facing data**                                                                |
|--------------|---------------------------------------------------------------------------------------------|
| Denied       | No protected data, metadata, citation or existence confirmation. Return a neutral response. |
| Existence    | Authorized existence/count only; no original text.                                          |
| Summary      | Authorized, cited summary and permitted date metadata; no unrestricted original text.       |
| Full         | Authorized original text and allowed citations.                                             |

Access level is enforced by backend tools, not by the AI prompt alone. Citations and source previews must be checked against the same permission. Legacy Lessons use the same rules; no independent bypass is allowed.

# Sample APL programs

## Sample 1 — Maria access scenarios

```
# Fictional owner and beneficiaries.
policy "Navarro legacy" for owner mateo {
  beneficiary maria named "Maria Navarro";
  beneficiary sofia named "Sofia Navarro";
  default mode verbatim;
  allow maria existence on mentioning maria;
  allow maria summary on tag "family";
  allow maria summary on tag "personal";
  deny maria on tag "business";
  deny maria, sofia on entry "ENT-020" before 2040-05-01;
  allow maria, sofia full on entry "ENT-020" after 2040-05-01;
}
```

Assume ENT-020 is a sealed letter with its own release date of 2040-05-01. Its explicit deny prevents early access by Maria or Sofia; the independent letter gate protects it against every beneficiary. The omitted release clause still requires verified activation.

## Sample 2 — Minimal policy with a beneficiary grant

```
policy "Simple" for owner mateo {
  beneficiary sofia;
  allow sofia summary on tag "family";
}
```

Only Sofia may receive an authorized family summary, and only after verified activation. All other access is denied.

## Sample 3 — Verified release and Legacy Lessons

```
policy "Release and lessons" for owner mateo {
  beneficiary maria;
  release when legacy verified;
  allow maria summary on tag "legacy_lessons";
  allow maria full on entry "LESSON-001";
  deny maria on tag "business";
}
```

Proposed implementation: store Legacy Lessons as diary entries tagged legacy_lessons, so the existing tag and entry targets work without extending the grammar. The lesson-specific grant permits full access to LESSON-001 after verified activation, unless an applicable deny or other access gate blocks it. No trustee quorum syntax is needed.

These examples use fictional identifiers and are intended as test fixtures, not real diary policies. The handout permits custom syntax; the implementation must demonstrate its required access behaviors.

# Interpreter and Prolog mapping

The interpreter converts a validated AST into structured, vault-scoped facts. The following is the complete proposed policy-fact mapping for Sample 1 (excluding display metadata and runtime entry facts). The default release condition is emitted even when omitted in source.

```
owner(vault_001, mateo).
beneficiary(vault_001, maria).
beneficiary(vault_001, sofia).
default_mode(vault_001, verbatim).
release_condition(vault_001, legacy_verified).
allow(vault_001, maria, existence, mentioning(maria), none).
allow(vault_001, maria, summary, tag(family), none).
allow(vault_001, maria, summary, tag(personal), none).
deny(vault_001, maria, tag(business), none).
deny(vault_001, maria, entry('ENT-020'), before(date(2040,5,1))).
deny(vault_001, sofia, entry('ENT-020'), before(date(2040,5,1))).
allow(vault_001, maria, full, entry('ENT-020'), after(date(2040,5,1))).
allow(vault_001, sofia, full, entry('ENT-020'), after(date(2040,5,1))).
```

A subject list compiles into one fact per beneficiary. Use date(Y,M,D) terms, not unquoted YYYY-MM-DD expressions. Display names may be stored separately as validated beneficiary metadata. Vault IDs come from the authenticated backend, not arbitrary policy text. Construct Prolog terms safely; never paste untrusted policy strings into executable source.

## Trusted runtime data (illustrative contract)

```
% Illustrative runtime facts, not generated from APL:
vault_state(vault_001, alive).
letter_release_date(vault_001, 'ENT-020', date(2040,5,1)).
```

The backend supplies trusted vault state, activation verification, entry metadata, authenticated requester and current date. The declaration release_condition(..., legacy_verified) is a requirement, not proof of verification. The runtime transition must be authorized, atomic with the policy freeze, and auditable.

## Access evaluation order

1\. Verify requester registration and ownership/vault scope; for beneficiary access, require verified RELEASED state.

2\. Verify the entry exists internally, belongs to the vault, passes integrity checks, and is not sealed for the request date.

3\. Evaluate applicable denies first, then the maximum matching allow level; fail closed on missing data or errors.

4\. Return the authorized level to the backend; project only permitted information into AI tools and source previews.

The exact predicate names, arities, state representations and error handling must be agreed with Task 2.07 before implementation. A policy update must be validated and installed atomically; invalid updates must not become active.

# Validation and parser test cases

## Lexical, syntax and semantic validation

| **Case**                                                          | **Expected result**                                                                            |
|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Empty file / comment-only file; trailing tokens                   | Syntax error                                                                                   |
| Unknown character; unterminated string; malformed date format     | Lexical error                                                                                  |
| Impossible date, e.g. 2040-13-45                                  | Semantic error                                                                                 |
| Unknown or duplicate beneficiary ID; duplicate subjects           | Semantic error                                                                                 |
| Owner identifier does not match the authenticated vault owner     | Semantic / authorization error                                                                 |
| More than one release or default_mode statement                   | Semantic error                                                                                 |
| Unknown or ambiguous mentioning identifier; empty tag or entry ID | Reject unresolved or ambiguous identifiers and empty values; never match a grant on ambiguity. |
| Unsupported trustee quorum or check-in release syntax             | Lexical or syntax error in V3                                                                  |
| Policy edit after release; invalid or missing verification        | Reject at runtime; no beneficiary disclosure.                                                  |

Parser tests (Task 2.12): use the three complete valid samples above, plus an empty policy body and valid comments/whitespace. The following are complete invalid source inputs; each is an independent fixture.

```
# P01 - missing semicolon
policy "Bad" for owner mateo { beneficiary maria }
# P02 - unknown access level
policy "Bad" for owner mateo {
  beneficiary maria; allow maria partial on all entries;
}
# P03 - undeclared beneficiary (semantic error)
policy "Bad" for owner mateo { allow maria full on all entries; }
# P04 - invalid calendar date (semantic error)
policy "Bad" for owner mateo {
  beneficiary maria; allow maria full on all entries after 2040-13-45;
}
# P05 - obsolete release syntax
policy "Bad" for owner mateo { release when trustees agree 2 of 3; }
# P06 - deny has no access level
policy "Bad" for owner mateo {
  beneficiary maria; deny maria summary on tag "business";
}
# P07 - duplicate default (semantic error)
policy "Bad" for owner mateo { default mode review; default mode verbatim; }
# P08 - trailing tokens
policy "Bad" for owner mateo {} extra
```

Also test empty input, missing closing brace, unterminated string, malformed date and duplicate declarations. Assert typed errors and no partial fact installation. Use PolicySyntaxError or a typed equivalent for lexical/syntax errors and a distinct validation error for semantic failures.

# Access tests and next steps

## Prolog and integration acceptance cases

Use fictional data. Unless otherwise stated, assume Sample 1 has been installed, legacy release has been verified, the requester is authenticated, and entry integrity checks succeed.

| **Case**                                                                                                 | **Expected result**                      |
|----------------------------------------------------------------------------------------------------------|------------------------------------------|
| Maria asks whether a non-business entry mentioning her exists; no stronger grant matches.                | Existence only; no content.              |
| Maria asks about a family-tagged entry, not sealed.                                                      | Cited summary.                           |
| Maria asks about a family + business tagged entry.                                                       | Deny; neutral reply.                     |
| Maria or Sofia asks for ENT-020 on 2040-04-30.                                                           | Deny; no letter details.                 |
| Maria or Sofia asks for ENT-020 on 2040-05-01.                                                           | Full original, if no other deny applies. |
| Broad full grant to another beneficiary for a sealed letter before its date.                             | Deny independently of grant.             |
| Unregistered user or wrong vault requests any entry.                                                     | Deny; neutral reply.                     |
| Registered beneficiary requests access while ALIVE or verification pending, even with no release clause. | Deny; no protected data.                 |
| Missed check-ins alone; or forged verification request.                                                  | No release; deny.                        |
| Owner tries to change released policy.                                                                   | Reject; frozen policy unchanged.         |
| Sample 3: Maria asks about a non-business legacy lesson.                                                 | Summary, or full for LESSON-001.         |
| Sample 3: Legacy Lesson also tagged business.                                                            | Deny; no protected data.                 |
| Summary-level requester asks AI to quote original or open full source.                                   | No original text disclosed.              |

## Open decisions and implementation handoff

1\. Team approval: confirm the proposed verified-release gate, omitted-release behavior, default writing mode, and Legacy Lessons tag representation. Define the authorized verification procedure separately; do not assume a numerical trustee quorum or allow an unverified release. Reconcile Task 1.03 (including FR-18, assumptions and Detect step), CLAUDE.md, Task 2.01 and Task 2.07.

2\. Confirm the team names, Kaneo acceptance criteria and instructor requirements before marking Task 2.01 Done. Commit grammar/apl.ebnf and the three examples under grammar/samples/. Mark builds the lexer (2.11); Kim prepares tests (2.12); Marvin implements Prolog rules (2.07). Record AI-assisted revisions and human verification in the AI-use log.

Basis: Task 2.01 V2 draft; ENGRAM Task 1.03 proposal; Alaala Student Handout (CS 413); finalized feature selection discussed by the team. V3 is a proposed specification, not a tested implementation.
