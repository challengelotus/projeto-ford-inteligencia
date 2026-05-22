from pydantic import BaseModel, ConfigDict
from typing import Literal
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    id: int | None = None
    nome: str
    email: str
    password: str

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
    marca: str
    modelo: str
    versao: str
    ano: int
    fonte: str
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