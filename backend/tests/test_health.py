"""API tests for the GET /health endpoint."""

from fastapi.testclient import TestClient

EXPECTED_HEALTH_BODY = {
    "status": "ok",
    "application": "ENGRAM",
    "message": "Backend is running successfully",
}


def test_health_returns_200(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200


def test_health_returns_expected_body(client: TestClient) -> None:
    response = client.get("/health")

    assert response.json() == EXPECTED_HEALTH_BODY


def test_health_returns_json_content_type(client: TestClient) -> None:
    response = client.get("/health")

    assert response.headers["content-type"].startswith("application/json")


def test_health_rejects_post(client: TestClient) -> None:
    response = client.post("/health")

    assert response.status_code == 405


def test_unknown_route_returns_404(client: TestClient) -> None:
    response = client.get("/does-not-exist")

    assert response.status_code == 404
