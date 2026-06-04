from pydantic import BaseModel
from uuid import UUID


class DislikeCreate(BaseModel):
    post_id: UUID