from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class EspecificacoesSchema(BaseModel):
    motor: str
    potencia: str
    torque: str
    cambio: str
    numero_de_marchas: str
    tracao: str
    propulsao: str
    suspensao: str
    freios: str
    rodas_e_pneus: str
    farois: str
    modos_de_conducao: str
    comprimento: str
    largura: str
    altura: str
    capacidade_do_tanque: str
    peso: str
    aceleracao_0_100: str
    velocidade_maxima: str
    consumo_urbano: str
    consumo_rodoviario: str
    preco: str
    tipo_combustivel: str


class VeiculoBase(BaseModel):
    marca: str
    modelo: str
    versao: str
    ano: int
    fonte: str


class VeiculoResponse(VeiculoBase):
    id: int
    hash_busca: str
    criado_em: datetime
    especificacoes: EspecificacoesSchema

    class Config:
        from_attributes = True


class VeiculoCompareResponse(BaseModel):
    veiculo1: VeiculoResponse
    veiculo2: VeiculoResponse
