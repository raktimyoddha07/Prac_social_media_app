from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CommentCreate(BaseModel):
    comment_text: str


class CommentUser(BaseModel):
    id: UUID
    username: str

    class Config:
        from_attributes = True


class CommentResponse(BaseModel):
    id: UUID
    post_id: UUID
    user_id: UUID
    comment_text: str
    user: CommentUser
    createdAt: datetime
    class Config:
        from_attributes = True

class CommentUpdate(BaseModel):
    comment_text: str