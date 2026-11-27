"""ENGRAM database foundation: configuration, engine, ORM base and sessions."""

from app.database.base import Base
from app.database.config import (
    DATABASE_URL_ENV_VAR,
    DEFAULT_SQLITE_PATH,
    current_database_url,
    default_database_url,
    resolve_database_url,
)
from app.database.engine import create_db_engine, get_engine, reset_engine_cache
from app.database.session import get_db, get_session_factory, reset_session_factory_cache


def reset_database_caches() -> None:
    """Drop the cached session factory and dispose the cached engine."""
    reset_session_factory_cache()
    reset_engine_cache()


__all__ = [
    "Base",
    "DATABASE_URL_ENV_VAR",
    "DEFAULT_SQLITE_PATH",
    "create_db_engine",
    "current_database_url",
    "default_database_url",
    "get_db",
    "get_engine",
    "get_session_factory",
    "reset_database_caches",
    "reset_engine_cache",
    "reset_session_factory_cache",
    "resolve_database_url",
]
