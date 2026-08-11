# app/services/auth_service.py
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.core.security import verify_password
from app.utils.helpers import logger  # mantém seu logger

def get_user(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> User | bool:
    user = get_user(db, email)
    if not user:
        logger.warning("auth_failed", email=email, reason="user_not_found")
        return False
    if not verify_password(password, user.senha_hash):
        logger.warning("auth_failed", email=email, reason="invalid_password")
        return False

    logger.info("auth_success", email=email, user_id=user.id, role=user.role)
    return user
