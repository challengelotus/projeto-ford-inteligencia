from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# backend/app/database.py → .parent = app/ → .parent = backend/
BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'fichas.db'}"

engine = create_engine(DATABASE_URL ,
                       connect_args={"check_same_thread": False}
                       # obrigatório para SQLite + FastAPI
                       )

# Ativar foreign keys no SQLite
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base centralizada aqui — models.py importa daqui
class Base(DeclarativeBase):
    pass

def init_db():
    # Importado aqui para evitar circular import
    from backend.models.orm_models import User, Veiculo, Historico
    from backend.auth.security import get_password_hash

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "ford@ci.com").first()
        if not existing:
            admin = User(
                nome="Administrador Ford",
                email="ford@ci.com",
                senha_hash=get_password_hash("ford123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("Usuário admin criado!")
        else:
            print("Usuário admin já existe.")
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
