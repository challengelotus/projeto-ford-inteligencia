from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Historico, User
from ..schemas import HistoricoCreate, HistoricoResponse
from ..auth.auth_handler import get_current_active_user

router = APIRouter(prefix="/historico", tags=["Histórico"])

@router.post("/", response_model=HistoricoResponse, status_code=status.HTTP_201_CREATED)
async def criar_historico(
    historico_in: HistoricoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # A base de dados (SQLite via CHECK constraint) vai garantir que:
    # Se tipo=='individual', apenas id_veiculo pode ter valor.
    # Se tipo=='comparacao', os 3 IDs devem ter valor.
    
    novo_historico = Historico(
        id_usuario=current_user.id,
        tipo=historico_in.tipo,
        id_veiculo=historico_in.id_veiculo,
        id_veiculo1=historico_in.id_veiculo1,
        id_veiculo2=historico_in.id_veiculo2
    )
    
    try:
        db.add(novo_historico)
        db.commit()
        db.refresh(novo_historico)
        return novo_historico
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Erro ao criar histórico. Verifique se os IDs dos veículos correspondem ao tipo de pesquisa."
        )

@router.get("/")
async def listar_meu_historico(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Usa joinedload para fazer o JOIN em tempo real e evitar N+1 queries
    historicos = db.query(Historico)\
        .options(
            joinedload(Historico.veiculo),
            joinedload(Historico.veiculo1),
            joinedload(Historico.veiculo2)
        )\
        .filter(Historico.id_usuario == current_user.id)\
        .order_by(Historico.criado_em.desc())\
        .all()
    
    return historicos