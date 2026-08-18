# app/routes/user_routes.py
from fastapi import APIRouter, Depends

from app.dependencies.auth_dependencies import get_current_active_user
from app.models.user_model import User
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
