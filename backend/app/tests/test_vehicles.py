from unittest.mock import MagicMock, patch

from app.services.vehicle_service import gerar_hash_busca
from app.services.vehicle_service import create_veiculo


def obter_token(client, email="teste@teste.com", senha="12345678"):
    response = client.post(
        "/auth/token",
        data={
            "username": email,
            "password": senha,
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def headers_autenticacao(client):
    token = obter_token(client)

    return {
        "Authorization": f"Bearer {token}",
    }
    
@patch("app.routes.vehicle_routes.VehicleService")
@patch("app.routes.vehicle_routes.get_blog_scrapy")
def test_buscar_veiculo_sucesso(
    mock_scrapy,
    mock_vehicle_service,
    client,
    usuario,
):
    mock_scrapy.return_value = [
        {
            "titulo": "Ford Ranger Raptor",
            "conteudo": "Informações técnicas da Ford Ranger Raptor",
        }
    ]

    especificacoes = {
        "motor": "3.0 V6",
        "potencia": "397 cv",
        "torque": "583 Nm",
        "cambio": "Automático",
        "numero_de_marchas": "10",
        "tracao": "4x4",
        "propulsao": "Combustão",
        "suspensao": "Independente",
        "freios": "Discos",
        "rodas_e_pneus": "17 polegadas",
        "farois": "LED",
        "modos_de_conducao": "Normal, Sport, Off-road",
        "comprimento": "5,36 m",
        "largura": "2,03 m",
        "altura": "1,93 m",
        "capacidade_do_tanque": "80 L",
        "peso": "2.510 kg",
        "aceleracao_0_100": "5,8 s",
        "velocidade_maxima": "180 km/h",
        "consumo_urbano": "6 km/l",
        "consumo_rodoviario": "8 km/l",
        "preco": "R$ 500.000",
        "tipo_combustivel": "Gasolina",
    }

    mock_service_instance = MagicMock()
    mock_service_instance.processar_veiculo_com_ia.return_value = especificacoes

    mock_vehicle_service.return_value = mock_service_instance

    response = client.get(
        "/veiculos/busca",
        params={
            "marca": "Ford",
            "modelo": "Ranger",
            "versao": "Raptor",
            "ano": 2025,
        },
        headers=headers_autenticacao(client),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["marca"] == "Ford"
    assert data["modelo"] == "Ranger"
    assert data["versao"] == "Raptor"
    assert data["ano"] == 2025

    mock_scrapy.assert_called_once()

    mock_service_instance.processar_veiculo_com_ia.assert_called_once_with(
        marca="Ford",
        modelo="Ranger",
        versao="Raptor",
        ano=2025,
    )
    
@patch("app.routes.vehicle_routes.VehicleService")
@patch("app.routes.vehicle_routes.get_blog_scrapy")
def test_buscar_veiculo_scrapy_vazio(
    mock_scrapy,
    mock_vehicle_service,
    client,
    usuario,
):
    mock_scrapy.return_value = []

    response = client.get(
        "/veiculos/busca",
        params={
            "marca": "Ford",
            "modelo": "Ranger",
            "versao": "Raptor",
            "ano": 2025,
        },
        headers=headers_autenticacao(client),
    )

    assert response.status_code == 404

    data = response.json()

    assert "Não foi possível coletar dados" in data["detail"]

    mock_scrapy.assert_called_once()

    mock_vehicle_service.assert_not_called()
    
@patch("app.routes.vehicle_routes.VehicleService")
@patch("app.routes.vehicle_routes.get_blog_scrapy")
def test_buscar_veiculo_falha_na_ia(
    mock_scrapy,
    mock_vehicle_service,
    client,
    usuario,
):
    mock_scrapy.return_value = [
        {
            "titulo": "Ford Ranger",
            "conteudo": "Dados do veículo",
        }
    ]

    mock_service_instance = MagicMock()

    mock_service_instance.processar_veiculo_com_ia.side_effect = Exception(
        "Ollama indisponível"
    )

    mock_vehicle_service.return_value = mock_service_instance

    response = client.get(
        "/veiculos/busca",
        params={
            "marca": "Ford",
            "modelo": "Ranger",
            "versao": "Raptor",
            "ano": 2025,
        },
        headers=headers_autenticacao(client),
    )

    assert response.status_code == 503

    data = response.json()

    assert "Falha ao processar" in data["detail"]
    assert "Ollama indisponível" in data["detail"]
    
@patch("app.routes.vehicle_routes.VehicleService")
@patch("app.routes.vehicle_routes.get_blog_scrapy")
def test_buscar_veiculo_informacoes_insuficientes(
    mock_scrapy,
    mock_vehicle_service,
    client,
    usuario,
):
    mock_scrapy.return_value = [
        {
            "titulo": "Ford Ranger",
            "conteudo": "Dados insuficientes",
        }
    ]

    especificacoes = {
        "motor": "não disponível",
        "potencia": "não disponível",
        "torque": "não disponível",
        "cambio": "não disponível",
        "numero_de_marchas": "não disponível",
        "tracao": "não disponível",
        "propulsao": "não disponível",
        "suspensao": "não disponível",
        "freios": "não disponível",
        "rodas_e_pneus": "não disponível",
    }

    mock_service_instance = MagicMock()

    mock_service_instance.processar_veiculo_com_ia.return_value = especificacoes

    mock_vehicle_service.return_value = mock_service_instance

    response = client.get(
        "/veiculos/busca",
        params={
            "marca": "Ford",
            "modelo": "Ranger",
            "versao": "Raptor",
            "ano": 2025,
        },
        headers=headers_autenticacao(client),
    )

    assert response.status_code == 404

    data = response.json()

    assert "informações suficientes" in data["detail"]
    
def test_buscar_veiculo_retorna_cache(
    client,
    db,
    usuario,
):
    especificacoes = {
        "motor": "3.0 V6",
        "potencia": "397 cv",
        "torque": "583 Nm",
    }

    veiculo = create_veiculo(
        db=db,
        marca="Ford",
        modelo="Ranger",
        versao="Raptor",
        ano=2025,
        fonte="teste",
        especificacoes=especificacoes,
    )

    with patch(
        "app.routes.vehicle_routes.get_blog_scrapy"
    ) as mock_scrapy, patch(
        "app.routes.vehicle_routes.VehicleService"
    ) as mock_vehicle_service:

        response = client.get(
            "/veiculos/busca",
            params={
                "marca": "Ford",
                "modelo": "Ranger",
                "versao": "Raptor",
                "ano": 2025,
            },
            headers=headers_autenticacao(client),
        )

        assert response.status_code == 200

        data = response.json()

        assert data["marca"] == "Ford"
        assert data["modelo"] == "Ranger"
        assert data["versao"] == "Raptor"
        assert data["ano"] == 2025

        mock_scrapy.assert_not_called()
        mock_vehicle_service.assert_not_called()