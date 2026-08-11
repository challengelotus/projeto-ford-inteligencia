# app/services/history_service.py
from datetime import datetime, timedelta
from sqlalchemy.orm import Session, joinedload
from app.models.history_model import Historico
from app.models.user_model import User
from app.schemas.history_schema import HistoricoCreate

def create_history(db: Session, user_id: int, history_data: HistoricoCreate) -> Historico:
    novo_historico = Historico(
        id_usuario=user_id,
        tipo=history_data.tipo,
        id_veiculo=history_data.id_veiculo,
        id_veiculo1=history_data.id_veiculo1,
        id_veiculo2=history_data.id_veiculo2
    )
    db.add(novo_historico)
    db.commit()
    db.refresh(novo_historico)
    return novo_historico

def get_user_history(db: Session, user_id: int):
    return db.query(Historico)\
        .options(
            joinedload(Historico.veiculo),
            joinedload(Historico.veiculo1),
            joinedload(Historico.veiculo2)
        )\
        .filter(Historico.id_usuario == user_id)\
        .order_by(Historico.criado_em.desc())\
        .all()

def anonimize_old_history(db: Session, days: int = 90):
    limite = datetime.utcnow() - timedelta(days=days)
    db.query(Historico)\
      .filter(Historico.criado_em < limite)\
      .update({Historico.id_usuario: None}, synchronize_session=False)
    db.commit()
