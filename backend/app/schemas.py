from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    nome: str
    email: str
    password: str

class UserResponse(BaseModel):
    nome: str | None = None
    email: str | None = None
    role: str | None = None

    model_config = {"from_attributes": True}

class UserInDB(UserResponse):
    senha_hash: str