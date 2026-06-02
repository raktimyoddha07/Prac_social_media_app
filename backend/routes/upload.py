from fastapi import APIRouter, UploadFile, File
import shutil
import uuid
import os

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...)
):
    extension = os.path.splitext(
        file.filename
    )[1]

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )
        
    return {
        "image_url":
        f"http://127.0.0.1:8000/uploads/{filename}"
    }