from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CommentCreate(BaseModel):
    comment_text: str


class CommentResponse(BaseModel):
    id: UUID
    post_id: UUID
    user_id: UUID
    comment_text: str
    createdAt: datetime

    class Config:
        from_attributes = True