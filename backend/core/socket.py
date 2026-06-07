import socketio
from core.database import SessionLocal
from models.message import Message

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

socket_app = socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ):
    print("Connected:", sid)


@sio.event
async def disconnect(sid):
    print("Disconnected:", sid)


@sio.on("join_conversation")
async def join_conversation(
    sid,
    conversation_id,
):
    await sio.enter_room(
        sid,
        conversation_id
    )

    print(
        f"{sid} joined {conversation_id}"
    )

@sio.on("send_message")
async def send_message_socket(sid, message):
    print("SOCKET RECEIVED:", message)

    await sio.emit(
        "receive_message",
        message,
        room=message["conversation_id"]
    )

    print("SOCKET EMITTED:", message["conversation_id"])

@sio.on("edit_message")
async def edit_message(sid, data):
    message_id = data["message_id"]
    content = data["content"]

    db = SessionLocal()

    try:
        message = (
            db.query(Message)
            .filter(Message.id == message_id)
            .first()
        )

        if not message:
            return

        message.content = content

        db.commit()
        db.refresh(message)
        print("EDIT RECEIVED", data)

        await sio.emit(
            "message_edited",
            {
                "id": str(message.id),
                "content": message.content,
                "conversation_id": str(message.conversation_id),
            },
            room=str(message.conversation_id),
        )

    finally:
        db.close()

@sio.on("delete_message")
async def delete_message(sid, data):
    message_id = data["message_id"]

    db = SessionLocal()

    try:
        message = (
            db.query(Message)
            .filter(Message.id == message_id)
            .first()
        )

        if not message:
            return

        conversation_id = str(
            message.conversation_id
        )

        db.delete(message)
        db.commit()
        print("DELETE RECEIVED", data)

        await sio.emit(
            "message_deleted",
            {
                "id": str(message_id),
                "conversation_id": conversation_id,
            },
    room=conversation_id,
)

    finally:
        db.close()