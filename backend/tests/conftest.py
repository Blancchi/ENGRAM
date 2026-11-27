"""Shared Pytest hooks and fixtures for the ENGRAM backend test suite.

Database isolation is configured in ``pytest_configure``, which runs before
test collection, so test modules imported during collection already see the
throwaway test database. This module itself imports only ``app.database``,
which has no import-time side effects; ``app.main`` is imported lazily.
"""

import os
import shutil
import tempfile
from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlalchemy.orm import Session

from app.database import (
    DATABASE_URL_ENV_VAR,
    DEFAULT_SQLITE_PATH,
    create_db_engine,
    default_database_url,
    get_engine,
    reset_database_caches,
)
from tests.helpers import sqlite_url


@dataclass(frozen=True)
class _DatabaseIsolation:
    temp_dir: Path
    test_db_path: Path
    original_env_value: str | None
    dev_db_existed: bool
    dev_dir_existed: bool


_ISOLATION_KEY = pytest.StashKey[_DatabaseIsolation]()


def pytest_configure(config: pytest.Config) -> None:
    """Redirect the app to a throwaway database before collection starts."""
    temp_dir = Path(tempfile.mkdtemp(prefix="engram-test-db-"))
    isolation = _DatabaseIsolation(
        temp_dir=temp_dir,
        test_db_path=temp_dir / "app_under_test.db",
        original_env_value=os.environ.get(DATABASE_URL_ENV_VAR),
        dev_db_existed=DEFAULT_SQLITE_PATH.exists(),
        dev_dir_existed=DEFAULT_SQLITE_PATH.parent.exists(),
    )
    config.stash[_ISOLATION_KEY] = isolation
    os.environ[DATABASE_URL_ENV_VAR] = sqlite_url(isolation.test_db_path).render_as_string()
    reset_database_caches()


def pytest_unconfigure(config: pytest.Config) -> None:
    """Restore the environment and remove the throwaway database folder."""
    isolation = config.stash.get(_ISOLATION_KEY, None)
    if isolation is None:
        return
    reset_database_caches()
    if isolation.original_env_value is None:
        os.environ.pop(DATABASE_URL_ENV_VAR, None)
    else:
        os.environ[DATABASE_URL_ENV_VAR] = isolation.original_env_value
    shutil.rmtree(isolation.temp_dir, ignore_errors=True)


@pytest.fixture(scope="session", autouse=True)
def _isolated_database_env(request: pytest.FixtureRequest) -> Iterator[Path]:
    """Yield the run's test database path; fail if the dev database appeared.

    The "existed before" snapshot is taken in ``pytest_configure``, before any
    test module is imported, so import-time side effects are also caught.
    """
    isolation = request.config.stash[_ISOLATION_KEY]
    yield isolation.test_db_path
    reset_database_caches()

    if not isolation.dev_db_existed:
        assert not DEFAULT_SQLITE_PATH.exists(), "Tests created the development database file."
    if not isolation.dev_dir_existed:
        assert not DEFAULT_SQLITE_PATH.parent.exists(), "Tests created the development data folder."


def _assert_cached_engine_is_not_dev() -> None:
    if get_engine.cache_info().currsize:
        assert get_engine().url != default_database_url(), (
            "A test created an engine pointing at the development database."
        )


@pytest.fixture(autouse=True)
def _reset_database_caches() -> Iterator[None]:
    """Give every test a fresh cached engine and session factory."""
    reset_database_caches()
    yield
    try:
        _assert_cached_engine_is_not_dev()
    finally:
        reset_database_caches()


@pytest.fixture
def db_engine(tmp_path: Path) -> Iterator[Engine]:
    """A fresh SQLite file database private to one test."""
    engine = create_db_engine(sqlite_url(tmp_path / "test.db"))
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(db_engine: Engine) -> Iterator[Session]:
    """A session bound to the per-test database, closed afterwards."""
    with Session(db_engine) as session:
        yield session


@pytest.fixture
def client() -> Iterator[TestClient]:
    """Provide an in-process HTTP client for the FastAPI app.

    ``app.main`` is imported here rather than at module level so that any
    future import-time code in the app runs only after isolation is in place.
    """
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client
