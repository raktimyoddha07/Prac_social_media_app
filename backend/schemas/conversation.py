from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ConversationResponse(BaseModel):
    id: UUID

    other_user: ConversationUser

    createdAt: datetime

    class Config:
        from_attributes = True

class ConversationUser(BaseModel):
    id: UUID
    username: str
    profile_picture: str | None = None

    class Config:
        from_attributes = True