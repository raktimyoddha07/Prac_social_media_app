from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.comment import Comment
from models.post import Post
from models.user import User
from schemas.comment import (
    CommentCreate,
    CommentResponse,
    CommentUpdate
)
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    tags=["Comments"]
)


# Create Comment
@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse
)
def create_comment(
    post_id: str,
    comment: CommentCreate,
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

    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        comment_text=comment.comment_text
    )

    db.add(new_comment)

    db.commit()

    db.refresh(new_comment)

    return new_comment


# Get Comments Of Post
@router.get(
    "/posts/{post_id}/comments",
    response_model=list[CommentResponse]
)
def get_comments(
    post_id: str,
    db: Session = Depends(get_db)
):

    comments = db.query(Comment).filter(
        Comment.post_id == post_id
    ).all()

    return comments



# Update Comment
@router.put(
    "/comments/{comment_id}",
    response_model=CommentResponse
)
def update_comment(
    comment_id: str,
    updated_comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    comment = db.query(Comment).filter(
        Comment.id == comment_id
    ).first()

    if not comment:

        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    if comment.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )
    comment.comment_text = updated_comment.comment_text
    db.commit()
    db.refresh(comment)
    return comment

# Delete Comment
@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    comment = db.query(Comment).filter(
        Comment.id == comment_id
    ).first()

    if not comment:

        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    if comment.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    db.delete(comment)

    db.commit()

    return {
        "message": "Comment deleted"
    }