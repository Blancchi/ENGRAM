"""SQLAlchemy engine creation.

``get_engine()`` is created lazily and cached, so importing the application
never opens a connection or creates files on disk.
"""

from functools import lru_cache
from pathlib import Path
from typing import Any

from sqlalchemy import Engine, create_engine, event
from sqlalchemy.engine import URL, make_url

from app.database.config import current_database_url


def _is_sqlite(url: URL) -> bool:
    return url.get_backend_name() == "sqlite"


def _sqlite_file_path(url: URL) -> Path | None:
    """Return the on-disk path for a file-based SQLite URL, else ``None``."""
    database = url.database
    if not database or database == ":memory:" or database.startswith("file:"):
        return None
    return Path(database)


def _enable_sqlite_foreign_keys(dbapi_connection: Any, _connection_record: Any) -> None:
    """SQLite ships with foreign keys disabled; enable them per connection."""
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("PRAGMA foreign_keys=ON")
    finally:
        cursor.close()


def create_db_engine(url: str | URL) -> Engine:
    """Build an engine for ``url`` with ENGRAM's SQLite defaults applied."""
    url = make_url(url)
    engine_kwargs: dict[str, Any] = {}

    if _is_sqlite(url):
        # FastAPI runs sync endpoints in a threadpool, so a connection may be
        # used by a thread other than the one that opened it.
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        file_path = _sqlite_file_path(url)
        if file_path is not None:
            file_path.parent.mkdir(parents=True, exist_ok=True)

    engine = create_engine(url, **engine_kwargs)

    if _is_sqlite(url):
        event.listen(engine, "connect", _enable_sqlite_foreign_keys)

    return engine


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    """Return the application's shared engine, creating it on first use."""
    return create_db_engine(current_database_url())


def reset_engine_cache() -> None:
    """Dispose the cached engine (if any) and clear the cache."""
    if get_engine.cache_info().currsize:
        get_engine().dispose()
    get_engine.cache_clear()
