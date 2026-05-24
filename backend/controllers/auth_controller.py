from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

from ..auth.auth_handler import authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, create_refresh_token, get_current_user
from ..models.database import get_db
from ..models.schemas import Token

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token, 
        refresh_token=refresh_token, 
        token_type="bearer"
    )

@router.post("/refresh")
async def refresh_token(current_user=Depends(get_current_user)) -> Token:
    new_access_token = create_access_token(
        data={"sub": current_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(access_token=new_access_token, token_type="bearer")