"""Session factory and the FastAPI database dependency."""

from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy.orm import Session, sessionmaker

from app.database.engine import get_engine


@lru_cache(maxsize=1)
def get_session_factory() -> sessionmaker[Session]:
    """Return the shared session factory, bound to the cached engine."""
    return sessionmaker(bind=get_engine(), autoflush=False, expire_on_commit=False)


def reset_session_factory_cache() -> None:
    get_session_factory.cache_clear()


def get_db() -> Iterator[Session]:
    """FastAPI dependency: yield a session and always close it afterwards.

    Committing is left to the caller so writes stay explicit.
    """
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()
