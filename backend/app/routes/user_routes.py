# app/routes/user_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth_dependencies import get_current_active_user, get_current_admin_user
from app.models.user_model import User
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.get("/", response_model=list[UserResponse])
async def list_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """Lista todos os usuários. Acesso restrito a administradores."""
    return db.query(User).all()
