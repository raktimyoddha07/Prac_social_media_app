from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from core.database import get_db

from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from models.user import User
from fastapi.security import OAuth2PasswordRequestForm
from schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Register
@router.post(
    "/register",
    response_model=TokenResponse
)
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    existing_username = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_username:

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(
    data={
        "user_id": str(new_user.id)
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Login
@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={"user_id": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Current Logged In User
@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user