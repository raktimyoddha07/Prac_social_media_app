from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user

from models.user import User
from models.post import Post
from models.like import Like
from models.dislike import Dislike

router = APIRouter(
    prefix="/posts",
    tags=["Dislikes"]
)


@router.post("/{post_id}/dislike")
def dislike_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(
        Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    existing_dislike = db.query(Dislike).filter(
        Dislike.post_id == post_id,
        Dislike.user_id == current_user.id
    ).first()

    if existing_dislike:
        db.delete(existing_dislike)
        db.commit()

        return {
            "message": "Dislike removed"
        }

    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.id
    ).first()

    if existing_like:
        db.delete(existing_like)

    new_dislike = Dislike(
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(new_dislike)
    db.commit()

    return {
        "message": "Post disliked"
    }