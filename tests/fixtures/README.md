# ENGRAM Fictional Test Fixtures

**Everything in this folder is fictional.** The people, places, events and diary text are
invented for testing. They are not real diary records and don't describe team members. Never add
real diary content, personal information or secrets here.

| File | Contents |
|---|---|
| `fictional_entries.json` | 6 people, 2 vaults, 22 diary entries |
| `access_scenarios.json` | 10 access-control scenarios with expected decisions |

The fixtures are used by the test plan ([`../test-plan.md`](../test-plan.md)). Their structure
is checked automatically by `backend/tests/test_data/test_fictional_fixtures.py`.

## Reference clock

All date-based expectations are evaluated at **`2026-12-01T09:00:00+08:00`** (Asia/Manila).
Tests must inject this time instead of using the real current time, so results stay the same
whenever the tests run.

## Status of this format (schema version 0.1-draft)

- This is a **neutral fixture format**. It is **not** Alaala Policy Language (APL) syntax and
  **not** a Prolog fact structure. Those are designed later. Each module's tests should convert
  these fixtures into its own input format.
- The entry types `letter` and `legacy_lesson` are **provisional** subclasses of the base
  `diary` entry, pending the UML class diagram (Task 2.02). Tests must not depend on attributes
  that subclass might have.
- Topic labels such as *health*, *finance*, *reflection* and *memory* are **tags**, not types.

## `fictional_entries.json`

### people
| Field | Meaning |
|---|---|
| `id` | `OWN-*` owner, `BEN-*` beneficiary, `VER-*` release verifier, `REQ-X` unregistered requester |
| `name` | Invented name |
| `role` | `owner`, `beneficiary`, `release_verifier` or `unregistered` |
| `relationship` | Relationship to the owner (beneficiaries only) |
| `registered` | `false` only for the unregistered requester |

### vaults
| Field | Meaning |
|---|---|
| `status` | `released` or `sealed` |
| `trigger_verified` | Whether a release trigger was verified. Missed check-ins alone never release a vault |
| `verified_by` | The person who verified the trigger, or `null` |
| `missed_checkins` | Count of missed owner check-ins |
| `policy_frozen` | `true` means the legacy policy can no longer be changed |

### entries
| Field | Meaning |
|---|---|
| `id` | `E-01` … `E-22` |
| `vault` | The vault the entry belongs to |
| `type` | `diary`, `letter`*, `legacy_lesson`* (*provisional) |
| `created_at` | ISO 8601 timestamp with a UTC offset |
| `title`, `content` | Invented text |
| `tags` | Topic labels |
| `writing_mode` | `verbatim`, `light_fix` or `review` |
| `access_policy` | See below |
| `corrects_entry_id` | For an append-only **correction record**: the ID of the earlier entry it corrects. The original entry is never modified. Otherwise `null` |

### access_policy
```json
{
  "owner_only": false,
  "grants": [ { "beneficiary": "BEN-01", "available_from": null } ],
  "denies": [ { "beneficiary": "BEN-02" } ]
}
```
The rules the scenarios specify:
1. **Deny by default:** someone with no grant is denied.
2. **A deny overrides a grant** for the same person.
3. A grant applies only from `available_from` onwards (`null` means immediately).
4. Beneficiary access also requires the vault to be `released` with a verified trigger.
5. `owner_only: true` means no beneficiary access, whatever the grants say. There are no grants
   on such entries.
6. The owner can always read their own entries.

## `access_scenarios.json`

| Field | Meaning |
|---|---|
| `requester` | A person ID |
| `action` | `read_entry`, `update_policy` or `ask_ai` |
| `target` | An entry ID, or a vault ID for `ask_ai` |
| `question` | The natural-language question for `ask_ai`, otherwise `null` |
| `expected_decision` | `ALLOW`, `DENY`, `REJECT` or `ANSWER_WITHOUT_RESTRICTED_EVIDENCE`. A **specification**, not an observed result |
| `rules` | Labels of the rules the scenario exercises |
| `response_constraint` | For example `generic_denial` (the response must not reveal whether the entry exists) |
| `excluded_evidence` | Entry IDs that must never reach the AI model |
