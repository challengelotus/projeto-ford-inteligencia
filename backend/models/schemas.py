from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    id: int | None = None
    nome: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=100, pattern=r"^\S+@\S+\.\S+$")
    password: str = Field(..., min_length=8, max_length=128)

class UserResponse(BaseModel):
    nome: str | None = None
    email: str | None = None
    role: str | None = None

    model_config = {"from_attributes": True}

class UserInDB(UserResponse):
    senha_hash: str

# Veiculos
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

# Histórico
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