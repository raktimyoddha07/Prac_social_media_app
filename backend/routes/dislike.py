from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.dislike import Dislike
from models.post import Post
from models.user import User

from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    tags=["Dislikes"]
)


# Dislike Post
@router.post("/posts/{post_id}/dislike")
def dislike_post(
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

    existing_dislike = db.query(Dislike).filter(
        Dislike.post_id == post_id,
        Dislike.user_id == current_user.id
    ).first()

    if existing_dislike:

        raise HTTPException(
            status_code=400,
            detail="Post already disliked"
        )

    new_dislike = Dislike(
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(new_dislike)

    db.commit()

    return {
        "message": "Post disliked"
    }


# Remove Dislike
@router.delete("/posts/{post_id}/dislike")
def remove_dislike(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    dislike = db.query(Dislike).filter(
        Dislike.post_id == post_id,
        Dislike.user_id == current_user.id
    ).first()

    if not dislike:

        raise HTTPException(
            status_code=404,
            detail="Dislike not found"
        )

    db.delete(dislike)

    db.commit()

    return {
        "message": "Post undisliked"
    }


# Get Dislikes Count
@router.get("/posts/{post_id}/dislikes")
def get_dislikes_count(
    post_id: str,
    db: Session = Depends(get_db)
):

    dislikes_count = db.query(Dislike).filter(
        Dislike.post_id == post_id
    ).count()

    return {
        "dislikes": dislikes_count
    }

@router.get("/posts/{post_id}/disliked")
def is_post_disliked(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    dislike = db.query(Dislike).filter(
        Dislike.post_id == post_id,
        Dislike.user_id == current_user.id
    ).first()

    return {
        "disliked": dislike is not None
    }