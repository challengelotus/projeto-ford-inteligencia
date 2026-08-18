# app/routes/vehicle_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth_dependencies import get_current_active_user
from app.models.user_model import User
from app.schemas.vehicle_schema import VeiculoResponse
from app.services.scraper_service import buscar_dados_completos_veiculo
from app.services.vehicle_service import (
    create_veiculo,
    gerar_hash_busca,
    get_veiculo_by_hash,
    update_veiculo,
)
from app.utils.helpers import limiter, logger

router = APIRouter(prefix="/veiculos", tags=["Veículos"])


@router.get("/busca", response_model=VeiculoResponse)
@limiter.limit("10/minute")
async def buscar_veiculo(
    request: Request,
    marca: str = Query(..., min_length=2, max_length=50),
    modelo: str = Query(..., min_length=1, max_length=50),
    versao: str = Query(..., min_length=1, max_length=100),
    ano: int = Query(..., ge=1886, le=2027),
    fonte: str = Query("scrapy_integrado", max_length=50),
    bypass_cache: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    hash_busca = gerar_hash_busca(marca, modelo, versao, ano)
    veiculo_db = get_veiculo_by_hash(db, hash_busca)

    # Caso 1: Cache válido e não quer forçar atualização
    if veiculo_db and not bypass_cache:
        return veiculo_db

    # Caso 2: Precisa buscar dados novos (Scrapy + YouTube)
    carro_query = f"{marca} {modelo} {versao}"
    logger.info("scraping_started", user_id=current_user.id, carro=carro_query)

    try:
        # 🔥 AQUI RODA O SCRAPING (pode levar alguns segundos)
        dados_brutos = buscar_dados_completos_veiculo(carro_query)
        # Exemplo: pega o primeiro artigo como "especificações"
        # Na vida real, você usaria IA (Groq) para extrair os campos estruturados
        especs = {
            "motor": "Extraído via Scrapy",
            "potencia": "Verificar fontes",
            "torque": "Verificar fontes",
            "cambio": "Verificar fontes",
            "tracao": "Verificar fontes",
            "suspensao": "Verificar fontes",
            "freios": "Verificar fontes",
            "rodas_pneus": "Verificar fontes",
            "farois": "Verificar fontes",
            "modos_conducao": "Verificar fontes",
            "preco": "Consultar tabela FIPE",
        }
        # (Aqui você poderia chamar o Groq para extrair os dados estruturados)

        if veiculo_db and bypass_cache:
            veiculo_atualizado = update_veiculo(db, veiculo_db, especs, fonte)
            return veiculo_atualizado
        else:
            novo_veiculo = create_veiculo(db, marca, modelo, versao, ano, fonte, especs)
            return novo_veiculo

    except Exception as e:
        logger.error("scraping_failed", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Falha ao buscar dados do veículo: {str(e)}",
        )
