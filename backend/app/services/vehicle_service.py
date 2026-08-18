# app/services/vehicle_service.py
import hashlib
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.vehicle_model import Veiculo
from app.schemas.vehicle_schema import Especificacoes
from app.utils.helpers import logger


def gerar_hash_busca(marca: str, modelo: str, versao: str, ano: int) -> str:
    texto_base = f"{marca.lower()}-{modelo.lower()}-{versao.lower()}-{ano}"
    return hashlib.sha256(texto_base.encode("utf-8")).hexdigest()


def get_veiculo_by_hash(db: Session, hash_busca: str) -> Veiculo | None:
    return db.query(Veiculo).filter(Veiculo.hash_busca == hash_busca).first()


def create_veiculo(
    db: Session,
    marca: str,
    modelo: str,
    versao: str,
    ano: int,
    fonte: str,
    especificacoes: dict,
) -> Veiculo:
    hash_busca = gerar_hash_busca(marca, modelo, versao, ano)
    novo_veiculo = Veiculo(
        marca=marca,
        modelo=modelo,
        versao=versao,
        ano=ano,
        hash_busca=hash_busca,
        fonte=fonte,
        especificacoes=especificacoes,
    )
    db.add(novo_veiculo)
    db.commit()
    db.refresh(novo_veiculo)
    return novo_veiculo


def update_veiculo(
    db: Session,
    veiculo: Veiculo,
    novas_especificacoes: dict,
    nova_fonte: str,
) -> Veiculo:
    veiculo.especificacoes = novas_especificacoes
    veiculo.fonte = nova_fonte
    veiculo.criado_em = datetime.utcnow()  # Atualiza timestamp
    db.commit()
    db.refresh(veiculo)
    return veiculo
