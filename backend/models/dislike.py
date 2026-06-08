from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from core.database import Base

class Dislike(Base):
    __tablename__ = "dislikes"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    post_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "posts.id",
            ondelete="CASCADE"
        )
    )

    createdAt = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )