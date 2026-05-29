from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from models.post import Post
from schemas.user import UserResponse
from schemas.post import PostResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# Get All Users
@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users


# Get Single User
@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# Get Posts By User
@router.get(
    "/{user_id}/posts",
    response_model=list[PostResponse]
)
def get_user_posts(
    user_id: str,
    db: Session = Depends(get_db)
):

    posts = db.query(Post).filter(
        Post.user_id == user_id
    ).all()

    return posts