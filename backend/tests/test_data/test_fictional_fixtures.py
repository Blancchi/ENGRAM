"""TD-01 to TD-04: structural validation of the Task 1.07 fictional fixtures.

These tests check only that the fixture files are complete and consistent.
They do not test any application behaviour, and they do not decide whether an
access scenario's expected decision is correct; that belongs to the module
tests listed in tests/test-plan.md.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import pytest

FIXTURES_DIR = Path(__file__).resolve().parents[3] / "tests" / "fixtures"

ENTRY_FIELDS = {
    "id", "vault", "type", "created_at", "title", "content", "tags",
    "writing_mode", "access_policy", "corrects_entry_id",
}
SCENARIO_FIELDS = {
    "id", "requester", "action", "target", "question", "expected_decision",
    "rules", "rationale", "response_constraint", "excluded_evidence",
}
ENTRY_TYPES = {"diary", "letter", "legacy_lesson"}
WRITING_MODES = {"verbatim", "light_fix", "review"}
ACTIONS = {"read_entry", "update_policy", "ask_ai"}
PERSON_ROLES = {"owner", "beneficiary", "release_verifier", "unregistered"}
VAULT_STATUSES = {"released", "sealed"}


def _load(name: str) -> dict[str, Any]:
    with (FIXTURES_DIR / name).open(encoding="utf-8") as handle:
        return json.load(handle)


@pytest.fixture(scope="module")
def entries_doc() -> dict[str, Any]:
    return _load("fictional_entries.json")


@pytest.fixture(scope="module")
def scenarios_doc() -> dict[str, Any]:
    return _load("access_scenarios.json")


def _is_aware_timestamp(value: str) -> bool:
    try:
        return datetime.fromisoformat(value).tzinfo is not None
    except (TypeError, ValueError):
        return False


# --- TD-01: required fields and types -------------------------------------------------


def test_td01_entries_have_required_fields_and_valid_values(entries_doc: dict[str, Any]) -> None:
    for entry in entries_doc["entries"]:
        assert set(entry) == ENTRY_FIELDS, entry["id"]
        assert entry["type"] in ENTRY_TYPES, entry["id"]
        assert entry["writing_mode"] in WRITING_MODES, entry["id"]
        assert isinstance(entry["title"], str) and entry["title"].strip(), entry["id"]
        assert isinstance(entry["content"], str) and entry["content"].strip(), entry["id"]
        assert isinstance(entry["tags"], list), entry["id"]
        assert all(isinstance(tag, str) and tag for tag in entry["tags"]), entry["id"]

        policy = entry["access_policy"]
        assert set(policy) == {"owner_only", "grants", "denies"}, entry["id"]
        assert isinstance(policy["owner_only"], bool), entry["id"]
        for grant in policy["grants"]:
            assert set(grant) == {"beneficiary", "available_from"}, entry["id"]
        for deny in policy["denies"]:
            assert set(deny) == {"beneficiary"}, entry["id"]


def test_td01_people_vaults_and_scenarios_have_required_fields(
    entries_doc: dict[str, Any], scenarios_doc: dict[str, Any]
) -> None:
    for person in entries_doc["people"]:
        assert set(person) == {"id", "name", "role", "relationship", "registered"}
        assert person["role"] in PERSON_ROLES, person["id"]
    for vault in entries_doc["vaults"]:
        assert vault["status"] in VAULT_STATUSES, vault["id"]
        assert isinstance(vault["trigger_verified"], bool), vault["id"]
        assert isinstance(vault["policy_frozen"], bool), vault["id"]
    for scenario in scenarios_doc["scenarios"]:
        assert set(scenario) == SCENARIO_FIELDS, scenario["id"]
        assert scenario["action"] in ACTIONS, scenario["id"]
        assert scenario["rationale"].strip(), scenario["id"]
        assert scenario["rules"], scenario["id"]


# --- TD-02: unique identifiers ---------------------------------------------------------


@pytest.mark.parametrize(
    ("document", "collection"),
    [
        ("fictional_entries.json", "people"),
        ("fictional_entries.json", "vaults"),
        ("fictional_entries.json", "entries"),
        ("access_scenarios.json", "scenarios"),
    ],
)
def test_td02_ids_are_unique(document: str, collection: str) -> None:
    ids = [item["id"] for item in _load(document)[collection]]

    assert len(ids) == len(set(ids)), f"duplicate IDs in {collection}"


# --- TD-03: references resolve -----------------------------------------------------------


def test_td03_entry_references_resolve(entries_doc: dict[str, Any]) -> None:
    people = {p["id"]: p for p in entries_doc["people"]}
    vaults = {v["id"]: v for v in entries_doc["vaults"]}
    entries = {e["id"]: e for e in entries_doc["entries"]}
    beneficiaries = {pid for pid, p in people.items() if p["role"] == "beneficiary"}

    for vault in vaults.values():
        assert vault["owner"] in people, vault["id"]
        assert vault["verified_by"] is None or vault["verified_by"] in people, vault["id"]
        assert vault["trigger_verified"] == (vault["verified_by"] is not None), vault["id"]

    for entry in entries.values():
        assert entry["vault"] in vaults, entry["id"]
        policy = entry["access_policy"]
        for rule in policy["grants"] + policy["denies"]:
            assert rule["beneficiary"] in beneficiaries, entry["id"]
        if policy["owner_only"]:
            assert policy["grants"] == [], f"{entry['id']} is owner-only but has grants"

        original_id = entry["corrects_entry_id"]
        if original_id is not None:
            assert original_id in entries, entry["id"]
            assert original_id != entry["id"], entry["id"]
            original = entries[original_id]
            assert original["corrects_entry_id"] is None, "corrections must target an original"
            assert datetime.fromisoformat(original["created_at"]) < datetime.fromisoformat(
                entry["created_at"]
            ), f"{entry['id']} must be appended after the entry it corrects"


def test_td03_scenario_references_resolve(
    entries_doc: dict[str, Any], scenarios_doc: dict[str, Any]
) -> None:
    people = {p["id"] for p in entries_doc["people"]}
    vaults = {v["id"] for v in entries_doc["vaults"]}
    entries = {e["id"] for e in entries_doc["entries"]}

    for scenario in scenarios_doc["scenarios"]:
        assert scenario["requester"] in people, scenario["id"]
        if scenario["action"] == "ask_ai":
            assert scenario["target"] in vaults, scenario["id"]
            assert scenario["question"], scenario["id"]
        else:
            assert scenario["target"] in entries, scenario["id"]
        assert set(scenario["excluded_evidence"]) <= entries, scenario["id"]


# --- TD-04: counts, formats, fictional marker -------------------------------------------


def test_td04_minimum_counts(entries_doc: dict[str, Any], scenarios_doc: dict[str, Any]) -> None:
    assert len(entries_doc["entries"]) >= 20
    assert len(scenarios_doc["scenarios"]) >= 6


def test_td04_timestamps_are_iso8601_with_offset(
    entries_doc: dict[str, Any], scenarios_doc: dict[str, Any]
) -> None:
    assert _is_aware_timestamp(entries_doc["_meta"]["reference_clock"])
    assert entries_doc["_meta"]["reference_clock"] == scenarios_doc["_meta"]["reference_clock"]

    for entry in entries_doc["entries"]:
        assert _is_aware_timestamp(entry["created_at"]), entry["id"]
        for grant in entry["access_policy"]["grants"]:
            available_from = grant["available_from"]
            assert available_from is None or _is_aware_timestamp(available_from), entry["id"]


def test_td04_expected_decisions_use_allowed_values(scenarios_doc: dict[str, Any]) -> None:
    allowed = set(scenarios_doc["_meta"]["allowed_decisions"])
    decisions = {s["expected_decision"] for s in scenarios_doc["scenarios"]}

    assert decisions <= allowed
    assert {"ALLOW", "DENY", "REJECT"} <= decisions, "scenarios must cover allow, deny and reject"


def test_td04_fixtures_are_marked_fictional(
    entries_doc: dict[str, Any], scenarios_doc: dict[str, Any]
) -> None:
    assert entries_doc["_meta"]["fictional"] is True
    assert scenarios_doc["_meta"]["fictional"] is True
