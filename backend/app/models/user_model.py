# app/models/user_model.py
from sqlalchemy import TIMESTAMP, Column, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True, index=True)
    senha_hash = Column(Text, nullable=False)
    role = Column(Text, nullable=False, default="user")
    criado_em = Column(TIMESTAMP, server_default=func.now())

    historicos = relationship("Historico", back_populates="usuario")
