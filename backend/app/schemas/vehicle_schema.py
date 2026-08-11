# app/schemas/vehicle_schema.py
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class Especificacoes(BaseModel):
    motor: str
    potencia: str
    torque: str
    cambio: str
    tracao: str
    suspensao: str
    freios: str
    rodas_pneus: str
    farois: str
    modos_conducao: str
    preco: str

class VeiculoBase(BaseModel):
    marca: str = Field(..., min_length=2, max_length=50)
    modelo: str = Field(..., min_length=2, max_length=50)
    versao: str = Field(..., min_length=1, max_length=100)
    ano: int = Field(..., ge=1886, le=2027)
    fonte: str = Field(..., max_length=50)
    especificacoes: Especificacoes

class VeiculoCreate(VeiculoBase):
    hash_busca: str

class VeiculoResponse(VeiculoBase):
    id: int
    hash_busca: str
    criado_em: datetime
    model_config = ConfigDict(from_attributes=True)
