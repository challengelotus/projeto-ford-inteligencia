# app/models/vehicle_model.py
from sqlalchemy import Column, Integer, Text, JSON, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class Veiculo(Base):
    __tablename__ = "veiculo"

    # Chave primária
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Dados básicos de identificação
    marca = Column(Text, nullable=False)
    modelo = Column(Text, nullable=False)
    versao = Column(Text, nullable=False)
    ano = Column(Integer, nullable=False)

    # Hash único para evitar duplicatas (gerado via hashlib no service)
    hash_busca = Column(Text, unique=True, index=True, nullable=False)

    # Fonte dos dados (ex: "scrapy_integrado", "padrao", "manual")
    fonte = Column(Text, nullable=False)

    # Data de criação (gerada automaticamente pelo banco)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    # 🆕 Campo JSON com as 11 especificações técnicas
    # Exemplo: {"motor": "2.0 Turbo", "potencia": "250 cv", ...}
    especificacoes = Column(JSON, nullable=False)

    def __repr__(self):
        return f"<Veiculo(id={self.id}, {self.marca} {self.modelo} {self.versao} {self.ano})>"
