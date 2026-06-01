from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Response schema
class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    createdAt: datetime
    updatedAt: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
