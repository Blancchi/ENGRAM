"""Regression test: isolation must already be active while test modules import.

The URL is captured at module import time (during collection, before any
fixture runs). ``current_database_url()`` is a pure lookup: it creates no
engine and touches no files, so this check can never write to a database.
"""

from pathlib import Path

from app.database import current_database_url, default_database_url

_URL_AT_IMPORT = current_database_url()


def test_test_database_is_configured_before_collection(_isolated_database_env: Path) -> None:
    assert _URL_AT_IMPORT != default_database_url()
    assert Path(_URL_AT_IMPORT.database) == _isolated_database_env
