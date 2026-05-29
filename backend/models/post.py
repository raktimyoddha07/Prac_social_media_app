from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from core.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    image_url = Column(
        String,
        nullable=True
    )

    createdAt = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updatedAt = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    user = relationship("User", back_populates="posts")