def test_login_sucesso(client, usuario):
    response = client.post(
        "/auth/token",
        data={
            "username": "teste@teste.com",
            "password": "12345678",
        },
    )
    
    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "refresh_token" in data


def test_login_senha_incorreta(client, usuario):
    response = client.post(
        "/auth/token",
        data={
            "username": "teste@teste.com",
            "password": "senha_errada",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_usuario_inexistente(client):
    response = client.post(
        "/auth/token",
        data={
            "username": "naoexiste@teste.com",
            "password": "12345678",
        },
    )

    assert response.status_code == 401