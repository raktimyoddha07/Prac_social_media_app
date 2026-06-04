from core.socket import sio


@sio.event
async def connect(sid, environ):
    print(f"Connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"Disconnected: {sid}")


@sio.event
async def join_conversation(
    sid,
    conversation_id,
):
    await sio.enter_room(
        sid,
        conversation_id,
    )

    print(
        f"{sid} joined {conversation_id}"
    )


@sio.event
async def send_message(
    sid,
    data,
):
    await sio.emit(
        "receive_message",
        data,
        room=data["conversation_id"],
    )