from fastapi import FastAPI
from models import *
from core.database import engine, Base
from core.middleware import setup_middleware
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.posts import router as posts_router
from routes.comments import router as comments_router
from routes.likes import router as likes_router
from routes.upload import router as upload_router
from routes.dislike import router as dislike_router
from fastapi.staticfiles import StaticFiles
from routes.messages import router as messages_router
from core.socket import sio
import socketio



app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Create database tables
Base.metadata.create_all(bind=engine)

# middleware here
setup_middleware(app)

#routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)
app.include_router(upload_router)
app.include_router(dislike_router)
app.include_router(messages_router)


@app.get("/")
def root():
    return {
        "message": "Social Media API Running"
    }

socket_app = socketio.ASGIApp(
    sio,
    other_asgi_app=app
)