import socketio

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