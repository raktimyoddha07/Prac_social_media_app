from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user

from models.user import User
from models.message import Message
from models.conversation import Conversation

from schemas.message import (
    MessageCreate,
    MessageResponse
)

from schemas.conversation import (
    ConversationResponse
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


@router.post(
    "/conversation/{user_id}",
    response_model=ConversationResponse
)
def create_or_get_conversation(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = db.query(
        Conversation
    ).filter(
        (
            (Conversation.user1_id == current_user.id) &
            (Conversation.user2_id == user_id)
        )
        |
        (
            (Conversation.user1_id == user_id) &
            (Conversation.user2_id == current_user.id)
        )
    ).first()

    if conversation:
        return conversation

    conversation = Conversation(
        user1_id=current_user.id,
        user2_id=user_id
    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return conversation

@router.get(
    "/conversations",
    response_model=list[ConversationResponse]
)
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversations = db.query(
        Conversation
    ).filter(
        (Conversation.user1_id == current_user.id)
        |
        (Conversation.user2_id == current_user.id)
    ).all()

    return conversations

@router.post(
    "/{conversation_id}",
    response_model=MessageResponse
)
def send_message(
    conversation_id: str,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = db.query(
        Conversation
    ).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=data.content
    )

    db.add(message)

    db.commit()

    db.refresh(message)

    return message

@router.get(
    "/{conversation_id}",
    response_model=list[MessageResponse]
)
def get_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    messages = db.query(
        Message
    ).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at.asc()
    ).all()

    return messages