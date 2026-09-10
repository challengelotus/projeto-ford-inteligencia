# app/schemas/vehicle_schema.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class Especificacoes(BaseModel):
    motor: str
    potencia: str
    torque: str
    cambio: str
    numero_de_marchas: str
    tracao: str
    comprimento: str
    largura: str
    altura: str
    capacidade_do_tanque: str
    peso: str
    aceleracao_0_100: str
    velocidade_maxima: str
    consumo_urbano: str
    consumo_rodoviario: str


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


class VeiculoCompareResponse(BaseModel):
    """Schema para retornar a comparação de dois veículos simultaneamente."""

    veiculo_1: VeiculoResponse
    veiculo_2: VeiculoResponse
