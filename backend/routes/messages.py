from uuid import UUID

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
from core.socket import sio

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
        "createdAt": conversation.createdAt,
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
    conversations = (
        db.query(Conversation)
        .filter(
            (Conversation.user1_id == current_user.id)
            |
            (Conversation.user2_id == current_user.id)
        )
        .all()
    )

    conversations.sort(
        key=lambda c: (
            db.query(Message)
            .filter(
                Message.conversation_id == c.id
            )
            .order_by(
                Message.createdAt.desc()
            )
            .first()
            .createdAt
            if db.query(Message)
                .filter(
                    Message.conversation_id == c.id
                )
                .first()
            else c.createdAt
        ),
        reverse=True,
    )

    return [
        build_conversation_response(
            conversation,
            current_user,
            db,
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
        "createdAt": message.createdAt,
        "sender": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "profile_picture": current_user.profile_picture,
            "bio": current_user.bio,
            "createdAt": current_user.createdAt,
            "updatedAt": current_user.updatedAt,
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
        Message.createdAt.asc()
    ).all()

    return [
        {
            "id": message.id,
            "conversation_id": message.conversation_id,
            "content": message.content,
            "is_read": message.is_read,
            "createdAt": message.createdAt,
            "sender": {
                "id": message.sender.id,
                "username": message.sender.username,
                "email": message.sender.email,
                "profile_picture": message.sender.profile_picture,
                "bio": message.sender.bio,
                "createdAt": message.sender.createdAt,
                "updatedAt": message.sender.updatedAt,
            }
        }
        for message in messages
    ]




#edit message
@router.put("/{message_id}", response_model=MessageResponse)
def edit_message(
    message_id: UUID,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(404, "Message not found")

    if message.sender_id != current_user.id:
        raise HTTPException(403, "Not allowed")

    message.content = data.content

    db.commit()
    db.refresh(message)

    return {
    "id": message.id,
    "conversation_id": message.conversation_id,
    "content": message.content,
    "is_read": message.is_read,
    "createdAt": message.createdAt,
    "sender": {
        "id": message.sender.id,
        "username": message.sender.username,
        "email": message.sender.email,
        "profile_picture": message.sender.profile_picture,
        "bio": message.sender.bio,
        "createdAt": message.sender.createdAt,
        "updatedAt": message.sender.updatedAt,
    }
}

#delete message
@router.delete("/{message_id}")
def delete_message(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(404, "Message not found")

    if message.sender_id != current_user.id:
        raise HTTPException(403, "Not allowed")

    db.delete(message)
    db.commit()

    return {"message": "Deleted"}