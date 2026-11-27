"""Tests for SWI-Prolog executable discovery and missing-executable handling.

None of these tests runs SWI-Prolog. They only create placeholder files and
patch lookups, so they run on every machine, with or without Prolog.
"""

from pathlib import Path

import pytest

from scripts import prolog_demo


@pytest.fixture
def no_system_swipl(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """Pretend swipl is neither on PATH nor in the default install folder."""
    monkeypatch.delenv("SWIPL_PATH", raising=False)
    monkeypatch.setattr(prolog_demo.shutil, "which", lambda name: None)
    monkeypatch.setattr(prolog_demo, "WINDOWS_DEFAULT_SWIPL", tmp_path / "missing" / "swipl.exe")


def test_swipl_path_env_var_is_used_first(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    placeholder = tmp_path / "custom location" / "swipl.exe"
    placeholder.parent.mkdir()
    placeholder.write_text("placeholder, never executed")
    monkeypatch.setenv("SWIPL_PATH", str(placeholder))
    monkeypatch.setattr(prolog_demo.shutil, "which", lambda name: str(tmp_path / "other.exe"))

    assert prolog_demo.find_swipl() == placeholder


def test_wrong_swipl_path_reports_not_found(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    monkeypatch.setenv("SWIPL_PATH", str(tmp_path / "does-not-exist" / "swipl.exe"))
    monkeypatch.setattr(prolog_demo.shutil, "which", lambda name: str(tmp_path / "other.exe"))

    assert prolog_demo.find_swipl() is None


@pytest.mark.usefixtures("no_system_swipl")
def test_not_found_when_no_env_path_or_default_install() -> None:
    assert prolog_demo.find_swipl() is None


@pytest.mark.usefixtures("no_system_swipl")
def test_main_reports_missing_executable(capsys: pytest.CaptureFixture[str]) -> None:
    exit_code = prolog_demo.main([])

    assert exit_code == 1
    assert "FAILURE: SWI-Prolog executable not found" in capsys.readouterr().out
