"""Tests for the session factory and the get_db FastAPI dependency."""

from unittest.mock import Mock

import pytest
from sqlalchemy import Engine, text
from sqlalchemy.orm import Session

from app.database import get_db, get_engine, get_session_factory
from app.database import session as session_module


@pytest.fixture
def spied_session(db_engine: Engine, monkeypatch: pytest.MonkeyPatch) -> Session:
    """A real session whose close() is wrapped by a Mock, served by get_db()."""
    session = Session(db_engine)
    session.close = Mock(wraps=session.close)  # type: ignore[method-assign]
    monkeypatch.setattr(session_module, "get_session_factory", lambda: lambda: session)
    return session


def test_get_db_yields_working_session_and_closes_it(spied_session: Session) -> None:
    dependency = get_db()

    session = next(dependency)
    assert session is spied_session
    assert session.execute(text("SELECT 1")).scalar_one() == 1
    spied_session.close.assert_not_called()

    dependency.close()

    spied_session.close.assert_called_once_with()


def test_get_db_closes_session_when_request_fails(spied_session: Session) -> None:
    dependency = get_db()
    next(dependency)

    with pytest.raises(RuntimeError, match="simulated failure"):
        dependency.throw(RuntimeError("simulated failure"))

    spied_session.close.assert_called_once_with()


def test_session_factory_settings() -> None:
    factory = get_session_factory()

    with factory() as session:
        assert session.autoflush is False
        assert session.expire_on_commit is False
        assert session.get_bind() is get_engine()


def test_session_factory_is_cached() -> None:
    assert get_session_factory() is get_session_factory()
