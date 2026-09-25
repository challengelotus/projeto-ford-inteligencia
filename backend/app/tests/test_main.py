from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_openapi(client):
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert "openapi" in response.json()

def test_banco_de_testes(client, db):
    assert db is not None