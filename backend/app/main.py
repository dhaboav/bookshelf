from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.models import Message
from app.routes.book import router

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_HOST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health-check", response_model=Message)
def health_check() -> Message:
    """Endpoint for health check"""
    return Message(detail="All system online")
