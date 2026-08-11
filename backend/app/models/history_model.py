# app/models/history_model.py
from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Historico(Base):
    __tablename__ = "historico"

    # ========== Chave Primária ==========
    id = Column(Integer, primary_key=True, autoincrement=True)

    # ========== Chaves Estrangeiras ==========
    # ID do usuário (NULL se o usuário for deletado ou anonimizado)
    id_usuario = Column(
        Integer,
        ForeignKey("usuario.id", ondelete="CASCADE"),
        nullable=True
    )

    # IDs dos veículos (podem ser NULL dependendo do tipo)
    id_veiculo = Column(
        Integer,
        ForeignKey("veiculo.id", ondelete="SET NULL"),
        nullable=True
    )
    id_veiculo1 = Column(
        Integer,
        ForeignKey("veiculo.id", ondelete="SET NULL"),
        nullable=True
    )
    id_veiculo2 = Column(
        Integer,
        ForeignKey("veiculo.id", ondelete="SET NULL"),
        nullable=True
    )

    # ========== Dados do Histórico ==========
    tipo = Column(Text, nullable=False)  # 'individual' ou 'comparacao'
    criado_em = Column(TIMESTAMP, server_default=func.now())

    # ========== Soft Delete (Anonimização) ==========
    excluido_em = Column(TIMESTAMP, nullable=True)

    # ========== Relacionamentos (ORM) ==========
    # Usamos strings nos relationship() para evitar importação circular
    usuario = relationship(
        "User",
        back_populates="historicos"
    )

    # Cada veículo aponta para a mesma tabela, mas com papéis diferentes
    veiculo = relationship(
        "Veiculo",
        foreign_keys=[id_veiculo]
    )
    veiculo1 = relationship(
        "Veiculo",
        foreign_keys=[id_veiculo1]
    )
    veiculo2 = relationship(
        "Veiculo",
        foreign_keys=[id_veiculo2]
    )

    # ========== Métodos Úteis ==========
    def anonimizar(self):
        """Remove a associação com o usuário (soft delete/anonymization)."""
        self.id_usuario = None
        self.excluido_em = func.now()  # Marca quando foi anonimizado

    def __repr__(self):
        return (
            f"<Historico(id={self.id}, tipo={self.tipo}, "
            f"usuario_id={self.id_usuario}, veiculo_id={self.id_veiculo})>"
        )

    # ========== Regras de Negócio via Banco de Dados ==========
    # Garante que:
    # - Se tipo == 'individual', apenas id_veiculo é preenchido.
    # - Se tipo == 'comparacao', os 3 IDs (id_veiculo, id_veiculo1, id_veiculo2) são preenchidos.
    __table_args__ = (
        CheckConstraint(
            "(tipo = 'individual' AND id_veiculo IS NOT NULL AND id_veiculo1 IS NULL AND id_veiculo2 IS NULL) OR "
            "(tipo = 'comparacao' AND id_veiculo IS NOT NULL AND id_veiculo1 IS NOT NULL AND id_veiculo2 IS NOT NULL)",
            name="check_tipo_historico"
        ),
    )
