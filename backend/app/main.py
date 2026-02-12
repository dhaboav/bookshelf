from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)


@app.get("/health-check")
def health_check():
    return "All System Online"
