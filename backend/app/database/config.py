"""Database connection configuration.

The database URL comes from the ``ENGRAM_DATABASE_URL`` environment variable,
optionally supplied through ``backend/.env``. When it is not set, ENGRAM uses a
local SQLite file at ``backend/data/engram.db``.

Note: SQLite stores data unencrypted on disk. This module only decides *where*
data lives; it provides no confidentiality.
"""

import os
from collections.abc import Mapping
from pathlib import Path

from dotenv import dotenv_values
from sqlalchemy.engine import URL, make_url

DATABASE_URL_ENV_VAR = "ENGRAM_DATABASE_URL"

BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"
DEFAULT_SQLITE_PATH = BACKEND_DIR / "data" / "engram.db"


def default_database_url() -> URL:
    """Return the absolute SQLite URL for the local development database."""
    return URL.create("sqlite", database=DEFAULT_SQLITE_PATH.as_posix())


def resolve_database_url(env: Mapping[str, str | None]) -> URL:
    """Pick the database URL from ``env``, falling back to the default.

    Pure function: it reads only the mapping it is given, so it can be tested
    without touching ``os.environ`` or the filesystem.
    """
    raw_url = (env.get(DATABASE_URL_ENV_VAR) or "").strip()
    return make_url(raw_url) if raw_url else default_database_url()


def current_database_url() -> URL:
    """Resolve the URL from ``backend/.env`` plus the process environment.

    Real environment variables take precedence over values in ``.env``. The
    ``.env`` file is read without modifying ``os.environ``.
    """
    file_values = dotenv_values(ENV_FILE) if ENV_FILE.is_file() else {}
    return resolve_database_url({**file_values, **os.environ})
