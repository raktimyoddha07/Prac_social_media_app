from fastapi import FastAPI
from models import *
from core.database import engine, Base
from core.middleware import setup_middleware
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.posts import router as posts_router
from routes.comments import router as comments_router
from routes.likes import router as likes_router



app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# middleware here
setup_middleware(app)

#rotes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)


@app.get("/")
def root():
    return {
        "message": "Social Media API Running"
    }