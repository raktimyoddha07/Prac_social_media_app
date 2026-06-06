from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from schemas.user import UserResponse


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    content: str
    is_read: bool
    createdAt: datetime
    sender: UserResponse
    class Config:
        from_attributes = True