from fastapi import FastAPI

from app.core.config import settings
from app.models import Message
from app.routes.book import router

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(router)


@app.get("/health-check", response_model=Message)
def health_check() -> Message:
    """Endpoint for health check"""
    return Message(detail="All system online")
