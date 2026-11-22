"""Shared Pytest fixtures for the ENGRAM backend test suite."""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    """Provide an in-process HTTP client for the FastAPI app.

    Using the client as a context manager runs the app's startup and
    shutdown events, so later fixtures (e.g. a test database) behave
    the same way they would under a real server.
    """
    with TestClient(app) as test_client:
        yield test_client
