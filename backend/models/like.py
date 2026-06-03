from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from core.database import Base

class Like(Base):
    __tablename__ = "likes"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True
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