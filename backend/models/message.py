class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID)

    sender_id = Column(
        UUID,
        ForeignKey("users.id")
    )

    receiver_id = Column(
        UUID,
        ForeignKey("users.id")
    )

    content = Column(Text)

    created_at = Column(DateTime)