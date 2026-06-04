from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid

from core.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user1_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    user2_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    user1 = relationship(
        "User",
        foreign_keys=[user1_id]
    )

    user2 = relationship(
        "User",
        foreign_keys=[user2_id]
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete"
    )