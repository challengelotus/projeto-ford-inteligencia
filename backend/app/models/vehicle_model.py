from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class Veiculo(Base):
    __tablename__ = "veiculo"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, index=True)
    modelo = Column(String, index=True)
    versao = Column(String, index=True)
    ano = Column(Integer, index=True)
    hash_busca = Column(String, unique=True, index=True)
    fonte = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    # 22 Colunas Estruturadas para BI e Dashboards futuros
    motor = Column(String, nullable=True)
    potencia = Column(String, nullable=True)
    torque = Column(String, nullable=True)
    cambio = Column(String, nullable=True)
    numero_de_marchas = Column(String, nullable=True)
    tracao = Column(String, nullable=True)
    suspensao = Column(String, nullable=True)
    freios = Column(String, nullable=True)
    rodas_e_pneus = Column(String, nullable=True)
    farois = Column(String, nullable=True)
    modos_de_conducao = Column(String, nullable=True)
    comprimento = Column(String, nullable=True)
    largura = Column(String, nullable=True)
    altura = Column(String, nullable=True)
    capacidade_do_tanque = Column(String, nullable=True)
    peso = Column(String, nullable=True)
    aceleracao_0_100 = Column(String, nullable=True)
    velocidade_maxima = Column(String, nullable=True)
    consumo_urbano = Column(String, nullable=True)
    consumo_rodoviario = Column(String, nullable=True)
    preco = Column(String, nullable=True)
    tipo_combustivel = Column(String, nullable=True)

    @property
    def especificacoes(self):
        """
        Ponte de compatibilidade: Remonta as colunas em um dicionário 'especificacoes'
        no momento da leitura, para não quebrar as rotas e o frontend atual.
        """
        return {
            "motor": self.motor,
            "potencia": self.potencia,
            "torque": self.torque,
            "cambio": self.cambio,
            "numero_de_marchas": self.numero_de_marchas,
            "tracao": self.tracao,
            "suspensao": self.suspensao,
            "freios": self.freios,
            "rodas_e_pneus": self.rodas_e_pneus,
            "farois": self.farois,
            "modos_de_conducao": self.modos_de_conducao,
            "comprimento": self.comprimento,
            "largura": self.largura,
            "altura": self.altura,
            "capacidade_do_tanque": self.capacidade_do_tanque,
            "peso": self.peso,
            "aceleracao_0_100": self.aceleracao_0_100,
            "velocidade_maxima": self.velocidade_maxima,
            "consumo_urbano": self.consumo_urbano,
            "consumo_rodoviario": self.consumo_rodoviario,
            "preco": self.preco,
            "tipo_combustivel": self.tipo_combustivel,
        }
