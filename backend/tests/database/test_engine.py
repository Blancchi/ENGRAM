"""Tests for engine creation, SQLite settings, and test-database isolation."""

from pathlib import Path

import pytest
from sqlalchemy import Engine, inspect, text

from app.database import (
    DATABASE_URL_ENV_VAR,
    Base,
    create_db_engine,
    default_database_url,
    get_engine,
    reset_database_caches,
)
from tests.helpers import sqlite_url


def test_sqlite_connection_works(db_engine: Engine) -> None:
    with db_engine.connect() as connection:
        assert connection.execute(text("SELECT 1")).scalar_one() == 1

    assert Path(db_engine.url.database).is_file()


def test_foreign_keys_are_enabled(db_engine: Engine) -> None:
    with db_engine.connect() as connection:
        assert connection.execute(text("PRAGMA foreign_keys")).scalar_one() == 1


def test_engine_creates_missing_parent_folder(tmp_path: Path) -> None:
    db_path = tmp_path / "nested" / "folder" / "engram.db"

    engine = create_db_engine(sqlite_url(db_path))
    try:
        assert db_path.parent.is_dir()
    finally:
        engine.dispose()


def test_app_engine_uses_test_database_not_dev(
    _isolated_database_env: Path,
) -> None:
    engine = get_engine()

    assert engine.url != default_database_url()
    assert Path(engine.url.database) == _isolated_database_env


def test_engine_follows_env_change_after_cache_reset(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    other_db = tmp_path / "other.db"
    first_engine = get_engine()

    monkeypatch.setenv(DATABASE_URL_ENV_VAR, sqlite_url(other_db).render_as_string())
    reset_database_caches()
    second_engine = get_engine()

    assert second_engine is not first_engine
    assert Path(second_engine.url.database) == other_db
    assert second_engine.url != default_database_url()


def test_committed_data_does_not_leak_between_databases(tmp_path: Path) -> None:
    first = create_db_engine(sqlite_url(tmp_path / "first.db"))
    second = create_db_engine(sqlite_url(tmp_path / "second.db"))
    try:
        with first.begin() as connection:
            connection.execute(text("CREATE TABLE scratch (note TEXT)"))
            connection.execute(text("INSERT INTO scratch VALUES ('fictional note')"))

        with first.connect() as connection:
            assert connection.execute(text("SELECT COUNT(*) FROM scratch")).scalar_one() == 1
        assert "scratch" not in inspect(second).get_table_names()
    finally:
        first.dispose()
        second.dispose()


def test_no_models_are_registered_yet() -> None:
    assert Base.metadata.tables == {}
