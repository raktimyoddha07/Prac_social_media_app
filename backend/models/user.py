from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from core.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    username = Column(
        String(50),
        nullable=False,
        unique=True
    )

    email = Column(
        String(100),
        nullable=False,
        unique=True
    )

    password = Column(
        String,
        nullable=False
    )
    profile_picture = Column(Text, nullable=True)

    bio = Column(Text, nullable=True)

    
    createdAt = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updatedAt = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


    posts = relationship("Post", back_populates="user")

    conversations_sent = relationship(
        "Conversation",
        foreign_keys="Conversation.user1_id"
    )

    conversations_received = relationship(
        "Conversation",
        foreign_keys="Conversation.user2_id"
    )

    messages = relationship(
        "Message",
        back_populates="sender"
    )
