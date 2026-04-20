from app.core.config import settings
from app.models import Message
from app.routes.book import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_HOST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def redirect_to_docs():
    return RedirectResponse(url="/docs")


@app.get("/healthCheck", response_model=Message)
def health_check() -> Message:
    """Endpoint for health check"""
    return Message(detail="All system online")
