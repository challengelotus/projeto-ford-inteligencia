# app/schemas/user_schema.py
from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    id: int | None = None
    nome: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=100, pattern=r"^\S+@\S+\.\S+$")
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    nome: str | None = None
    email: str | None = None
    role: str | None = None
    model_config = ConfigDict(from_attributes=True)
