from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from schemas.user import UserResponse


class PostCreate(BaseModel):
    content: str
    image_url: str | None = None

class PostUpdate(BaseModel):
    content: str
    image_url: str | None = None

class PostResponse(BaseModel):
    id: UUID
    user_id: UUID
    content: str
    image_url: str | None = None
    user: UserResponse
    likes_count: int=0
    liked_by_user: bool=False
    createdAt: datetime
    updatedAt: datetime
    class Config:
        from_attributes = True


PostResponse.model_rebuild()