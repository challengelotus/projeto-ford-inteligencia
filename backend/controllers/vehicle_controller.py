import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from ..utils.helpers import limiter, logger
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.database import get_db
from ..models.orm_models import User, Veiculo
from ..models.schemas import VeiculoResponse, VeiculoCreate
from ..auth.auth_handler import get_current_active_user

router = APIRouter(prefix="/veiculos", tags=["Veículos"])

def gerar_hash_busca(marca: str, modelo: str, versao: str, ano: int) -> str:
    texto_base = f"{marca.lower()}-{modelo.lower()}-{versao.lower()}-{ano}"
    return hashlib.sha256(texto_base.encode('utf-8')).hexdigest()

# Função simulada de Web Scraping
def fazer_scraping_veiculo(marca: str, modelo: str, versao: str, ano: int):
    # Aqui entraria o BeautifulSoup / Selenium / Playwright
    return {
        "motor": "2.0 Turbo", "potencia": "250 cv", "torque": "38 kgfm",
        "cambio": "Automático de 8 marchas", "tracao": "AWD", 
        "suspensao": "Independente", "freios": "Disco ventilado", 
        "rodas_pneus": "Aro 18", "farois": "LED", 
        "modos_conducao": "Normal, Sport, Eco", "preco": "R$ 250.000"
    }

@router.get("/busca", response_model=VeiculoResponse)
@limiter.limit("20/minute")
async def buscar_veiculo(
    request: Request,
    marca: str = Query(..., min_length=2, max_length=50), 
    modelo: str = Query(..., min_length=1, max_length=50), 
    versao: str = Query(..., min_length=1, max_length=100), 
    ano: int = Query(..., ge=1886, le=2027),
    fonte: str = Query("padrao", max_length=50),
    bypass_cache: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if bypass_cache:
        logger.warning(
            "cache_bypass_requested", 
            user_id=current_user.id, 
            marca=marca, 
            modelo=modelo
        )
        
    hash_busca = gerar_hash_busca(marca, modelo, versao, ano)
    
    #  Verifica se já existe na base de dados
    veiculo_db = db.query(Veiculo).filter(Veiculo.hash_busca == hash_busca).first()
    
    if veiculo_db and not bypass_cache:
        return veiculo_db

    novas_especificacoes = fazer_scraping_veiculo(marca, modelo, versao, ano)
    
    if veiculo_db and bypass_cache:
        veiculo_db.especificacoes = novas_especificacoes
        veiculo_db.fonte = fonte
        veiculo_db.criado_em = datetime.utcnow()
        db.commit()
        db.refresh(veiculo_db)
        return veiculo_db
    else:
        novo_veiculo = Veiculo(
            marca=marca, modelo=modelo, versao=versao, ano=ano,
            hash_busca=hash_busca, fonte=fonte, especificacoes=novas_especificacoes
        )
        db.add(novo_veiculo)
        db.commit()
        db.refresh(novo_veiculo)
        return novo_veiculo