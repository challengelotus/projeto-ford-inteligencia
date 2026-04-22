from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from .models import Base, User
from .auth.security import get_password_hash

DATABASE_URL = "oracle+oracledb://system:123456@localhost:1522/?service_name=orcl"  # You can use any database here

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def init_db():
    # Cria sessão
    db = SessionLocal()

    try:
        # Verifica se já existe usuário admin
        existing_user = db.query(User).filter(User.email == "ford@ci.com").first()

        if not existing_user:
            password = get_password_hash("ford123")
            admin = User(
                email="ford@ci.com",
                hashed_password=password  # depois te mostro como criptografar
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
        
# Cria as tabelas
Base.metadata.create_all(bind=engine)

# Executa ao iniciar o projeto
init_db()
