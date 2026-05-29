from pydantic import BaseModel
from uuid import UUID


class LikeCreate(BaseModel):
    post_id: UUID