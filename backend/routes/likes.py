from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.like import Like
from models.post import Post
from models.user import User

from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    tags=["Likes"]
)


# Like Post
@router.post("/posts/{post_id}/like")
def like_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    post = db.query(Post).filter(
        Post.id == post_id
    ).first()

    if not post:

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    if existing_like:

        raise HTTPException(
            status_code=400,
            detail="Post already liked"
        )

    new_like = Like(
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(new_like)

    db.commit()

    return {
        "message": "Post liked"
    }


# Unlike Post
@router.delete("/posts/{post_id}/like")
def unlike_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    if not like:

        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )

    db.delete(like)

    db.commit()

    return {
        "message": "Post unliked"
    }


# Get Likes Count
@router.get("/posts/{post_id}/likes")
def get_likes_count(
    post_id: str,
    db: Session = Depends(get_db)
):

    likes_count = db.query(Like).filter(
        Like.post_id == post_id
    ).count()

    return {
        "likes": likes_count
    }

@router.get("/posts/{post_id}/liked")
def is_post_liked(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    return {
        "liked": like is not None
    }