"""Reusable helpers for the ENGRAM backend test suite."""

from pathlib import Path

from sqlalchemy.engine import URL


def sqlite_url(path: Path) -> URL:
    """Build a SQLite URL for ``path`` (safe for paths containing spaces)."""
    return URL.create("sqlite", database=path.as_posix())
