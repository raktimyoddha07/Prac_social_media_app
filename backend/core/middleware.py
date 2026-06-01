from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Get FRONTEND_URL from .env
FRONTEND_URL = os.getenv("FRONTEND_URL")


def setup_middleware(app):

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            FRONTEND_URL,
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )