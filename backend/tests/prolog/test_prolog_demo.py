"""Tests for the Task 1.04 Python -> SWI-Prolog demonstration.

These tests are skipped automatically when SWI-Prolog is not installed.
"""

import shutil
from pathlib import Path

import pytest

from scripts.prolog_demo import DEFAULT_GOAL, DEMO_FILE, find_swipl, run_goal

SWIPL = find_swipl()

pytestmark = pytest.mark.skipif(SWIPL is None, reason="SWI-Prolog (swipl) is not installed")


def test_demo_goal_succeeds() -> None:
    result = run_goal(SWIPL, DEMO_FILE, DEFAULT_GOAL)

    assert result.succeeded, result.stderr
    assert result.exit_code == 0
    assert "TRUE" in result.stdout


def test_false_goal_is_reported_as_failure() -> None:
    result = run_goal(SWIPL, DEMO_FILE, "uses_paradigm(prolog, functional)")

    assert not result.succeeded
    assert result.exit_code == 1
    assert "FALSE" in result.stdout


def test_prolog_file_in_path_with_spaces(tmp_path: Path) -> None:
    spaced_dir = tmp_path / "folder with spaces"
    spaced_dir.mkdir()
    spaced_file = spaced_dir / "stack demo.pl"
    shutil.copyfile(DEMO_FILE, spaced_file)

    result = run_goal(SWIPL, spaced_file, DEFAULT_GOAL)

    assert result.succeeded, result.stderr
