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


def build_conversation_response(
    conversation: Conversation,
    current_user: User,
    db: Session,
):
    other_user_id = (
        conversation.user2_id
        if conversation.user1_id == current_user.id
        else conversation.user1_id
    )

    other_user = (
        db.query(User)
        .filter(User.id == other_user_id)
        .first()
    )

    return {
        "id": conversation.id,
        "created_at": conversation.created_at,
        "other_user": {
            "id": other_user.id,
            "username": other_user.username,
            "profile_picture": other_user.profile_picture,
        },
    }


# Create or Get Conversation
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
            (Conversation.user1_id == current_user.id)
            &
            (Conversation.user2_id == user_id)
        )
        |
        (
            (Conversation.user1_id == user_id)
            &
            (Conversation.user2_id == current_user.id)
        )
    ).first()

    if conversation:
        return build_conversation_response(
            conversation,
            current_user,
            db
        )

    conversation = Conversation(
        user1_id=current_user.id,
        user2_id=user_id
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return build_conversation_response(
        conversation,
        current_user,
        db
    )


# Get All Conversations
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

    return [
        build_conversation_response(
            conversation,
            current_user,
            db
        )
        for conversation in conversations
    ]


# Send Message
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

    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "content": message.content,
        "is_read": message.is_read,
        "created_at": message.created_at,
        "sender": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "profile_picture": current_user.profile_picture,
            "bio": current_user.bio,
            "created_at": current_user.created_at,
        }
    }


# Get Messages
@router.get(
    "/{conversation_id}",
    response_model=list[MessageResponse]
)
def get_messages(
    conversation_id: str,
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

    messages = db.query(
        Message
    ).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at.asc()
    ).all()

    return [
        {
            "id": message.id,
            "conversation_id": message.conversation_id,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at,
            "sender": {
                "id": message.sender.id,
                "username": message.sender.username,
                "email": message.sender.email,
                "profile_picture": message.sender.profile_picture,
                "bio": message.sender.bio,
                "created_at": message.sender.created_at,
            }
        }
        for message in messages
    ]