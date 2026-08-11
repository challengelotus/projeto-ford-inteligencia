# app/schemas/history_schema.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Literal

class HistoricoCreate(BaseModel):
    tipo: Literal['individual', 'comparacao']
    id_veiculo: int | None = None
    id_veiculo1: int | None = None
    id_veiculo2: int | None = None

class HistoricoResponse(HistoricoCreate):
    id: int
    id_usuario: int
    criado_em: datetime
    model_config = ConfigDict(from_attributes=True)
