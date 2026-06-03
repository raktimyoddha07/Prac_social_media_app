from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from models.post import Post
from schemas.user import (UserResponse, UserUpdate)
from schemas.post import PostResponse
from core.security import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

#get current user
@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    print("CURRENT USER =", current_user)
    return current_user

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



# Update User Profile
@router.put(
    "/me",
    response_model=UserResponse
)
def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_data.profile_picture is not None:
        current_user.profile_picture = user_data.profile_picture
    current_user.bio = user_data.bio
    current_user.username = user_data.username or current_user.username

    db.commit()
    db.refresh(current_user)

    return current_user