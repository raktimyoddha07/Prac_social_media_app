from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from core.database import get_db
from models.post import Post
from models.user import User
from schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse
)
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


# Create Post
@router.post(
    "/",
    response_model=PostResponse
)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_post = Post(
        user_id=current_user.id,
        content=post.content,
        image_url=post.image_url
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


# Get All Posts
@router.get(
    "/",
    response_model=list[PostResponse]
)
def get_posts(
    db: Session = Depends(get_db)
):

    posts = db.query(Post).order_by(
        Post.createdAt.desc()
    ).all()

    return posts


# Get Single Post
@router.get(
    "/{post_id}",
    response_model=PostResponse
)
def get_post(
    post_id: str,
    db: Session = Depends(get_db)
):

    post = db.query(Post).filter(
        Post.id == post_id
    ).first()

    if not post:

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


# Delete Post
@router.delete("/{post_id}")
def delete_post(
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

    if post.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    db.delete(post)

    db.commit()

    return {
        "message": "Post deleted"
    }


# Update Post
@router.put(
    "/{post_id}",
    response_model=PostResponse
)
def update_post(
    post_id: str,
    updated_post: PostUpdate,
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

    # Only owner can edit
    if post.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    post.content = updated_post.content
    post.image_url = updated_post.image_url

    db.commit()

    db.refresh(post)

    return post