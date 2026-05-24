from sqlalchemy import Column, Integer, Text, TIMESTAMP, JSON, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.models.database import Base  # Base centralizada no database.py

class User(Base):
    __tablename__ = "usuario"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    nome       = Column(Text, nullable=False)
    email      = Column(Text, nullable=False, unique=True, index=True)
    senha_hash = Column(Text, nullable=False)               # argon2 — nunca texto puro
    role       = Column(Text, nullable=False, default="user")  # 'admin' | 'user'
    criado_em  = Column(TIMESTAMP, server_default=func.now())

    historicos = relationship("Historico", back_populates="usuario")

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"
    
class Veiculo(Base):
    __tablename__ = "veiculo"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    marca          = Column(Text, nullable=False)
    modelo         = Column(Text, nullable=False)
    versao         = Column(Text, nullable=False)
    ano            = Column(Integer, nullable=False)
    hash_busca     = Column(Text, unique=True, index=True, nullable=False)
    fonte          = Column(Text, nullable=False)
    criado_em      = Column(TIMESTAMP, server_default=func.now())
    
    # Campo JSON para as 11 especificações
    atributos = Column(JSON, nullable=False)

class Historico(Base):
    __tablename__ = "historico"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario  = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=True)
    tipo        = Column(Text, nullable=False) # 'individual' ou 'comparacao'
    
    id_veiculo  = Column(Integer, ForeignKey("veiculo.id", ondelete="SET NULL"), nullable=True)
    id_veiculo1 = Column(Integer, ForeignKey("veiculo.id", ondelete="SET NULL"), nullable=True)
    id_veiculo2 = Column(Integer, ForeignKey("veiculo.id", ondelete="SET NULL"), nullable=True)
    
    criado_em   = Column(TIMESTAMP, server_default=func.now())

    usuario  = relationship("User", back_populates="historicos")
    veiculo  = relationship("Veiculo", foreign_keys=[id_veiculo])
    veiculo1 = relationship("Veiculo", foreign_keys=[id_veiculo1])
    veiculo2 = relationship("Veiculo", foreign_keys=[id_veiculo2])

    excluido_em = Column(TIMESTAMP, nullable=True) # SOFT DELETE!!!

    def anonimizar(self):
        self.id_usuario = None

    # Validar a regra de negócio do histórico
    __table_args__ = (
        CheckConstraint(
            "(tipo = 'individual' AND id_veiculo IS NOT NULL AND id_veiculo1 IS NULL AND id_veiculo2 IS NULL) OR "
            "(tipo = 'comparacao' AND id_veiculo IS NOT NULL AND id_veiculo1 IS NOT NULL AND id_veiculo2 IS NOT NULL)",
            name="check_tipo_historico"
        ),
    )