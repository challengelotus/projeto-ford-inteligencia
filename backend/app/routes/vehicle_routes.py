# app/routes/vehicle_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth_dependencies import get_current_active_user
from app.models.user_model import User
from app.schemas.vehicle_schema import VeiculoResponse
from app.services.scraper_service import get_blog_scrapy
from app.services.vehicle_service import (
    VehicleService,
    create_veiculo,
    gerar_hash_busca,
    get_veiculo_by_hash,
    update_veiculo,
)
from app.utils.helpers import limiter, logger

router = APIRouter(prefix="/veiculos", tags=["Veículos"])

ai_service = VehicleService()


@router.get("/busca", response_model=VeiculoResponse)
@limiter.limit("10/minute")
async def buscar_veiculo(
    request: Request,
    marca: str = Query(..., min_length=2, max_length=50),
    modelo: str = Query(..., min_length=1, max_length=50),
    versao: str = Query(..., min_length=1, max_length=100),
    ano: int = Query(..., ge=1886, le=2027),
    fonte: str = Query("scrapy_ia_consenso", max_length=50),
    bypass_cache: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    hash_busca = gerar_hash_busca(marca, modelo, versao, ano)
    veiculo_db = get_veiculo_by_hash(db, hash_busca)

    # Caso 1: Cache válido e não quer forçar atualização (Economiza IA e Scrapy)
    if veiculo_db and not bypass_cache:
        return veiculo_db

    # Caso 2: Precisa buscar dados novos do zero
    carro_query = f"{marca} {modelo} {versao}"
    logger.info("scraping_started", user_id=current_user.id, carro=carro_query)

    try:
        # 🔥 1. Roda o Scraping para vasculhar a internet
        get_blog_scrapy(carro_query)

        # 🧠 2. Roda a Inteligência Artificial
        especs = ai_service.processar_veiculo_com_ia(
            marca=marca,
            modelo=modelo,
            versao=versao,
            ano=ano,
        )

        # 💾 3. Salva no Banco de Dados (via funções do Rafael)
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
            detail=f"Falha ao buscar e processar dados do veículo com a IA: {str(e)}",
        )
