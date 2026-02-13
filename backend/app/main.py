from fastapi import FastAPI

from app.core.config import settings
from app.routes.book import router

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(router)


@app.get("/health-check")
def health_check():
    return "All System Online"
