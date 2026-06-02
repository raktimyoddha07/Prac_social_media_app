from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Get FRONTEND_URL from .env
FRONTEND_URL = os.getenv("FRONTEND_URL")
#print("ENV FILE:", os.path.abspath(".env"))


def setup_middleware(app):

    if not FRONTEND_URL:
        raise ValueError(
            "FRONTEND_URL not found in .env"
        )
    print(repr(FRONTEND_URL))
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )