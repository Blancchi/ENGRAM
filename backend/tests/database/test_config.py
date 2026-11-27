"""Tests for database URL configuration (pure functions, no I/O)."""

from pathlib import Path

from app.database import DATABASE_URL_ENV_VAR, DEFAULT_SQLITE_PATH, resolve_database_url

BACKEND_DIR = Path(__file__).resolve().parents[2]


def test_default_url_is_absolute_sqlite_dev_path() -> None:
    url = resolve_database_url({})

    assert url.get_backend_name() == "sqlite"
    assert Path(url.database).is_absolute()
    assert Path(url.database) == BACKEND_DIR / "data" / "engram.db"
    assert Path(url.database) == DEFAULT_SQLITE_PATH


def test_blank_env_value_falls_back_to_default() -> None:
    url = resolve_database_url({DATABASE_URL_ENV_VAR: "   "})

    assert Path(url.database) == DEFAULT_SQLITE_PATH


def test_env_value_overrides_default() -> None:
    url = resolve_database_url({DATABASE_URL_ENV_VAR: "sqlite:///C:/elsewhere/other.db"})

    assert url.get_backend_name() == "sqlite"
    assert url.database == "C:/elsewhere/other.db"


def test_default_path_is_not_touched_by_resolving() -> None:
    existed_before = DEFAULT_SQLITE_PATH.exists()

    resolve_database_url({})

    assert DEFAULT_SQLITE_PATH.exists() == existed_before
