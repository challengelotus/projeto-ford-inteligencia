from sqlalchemy import Column, Integer, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base  # Base centralizada no database.py

class User(Base):
    __tablename__ = "usuario"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    nome       = Column(Text, nullable=False)
    email      = Column(Text, nullable=False, unique=True, index=True)
    senha_hash = Column(Text, nullable=False)               # argon2 — nunca texto puro
    role       = Column(Text, nullable=False, default="user")  # 'admin' | 'user'
    criado_em  = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"