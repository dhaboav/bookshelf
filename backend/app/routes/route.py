from fastapi import APIRouter

from app.routes.book import router as book_route
from app.routes.genre import router as genre_route

router = APIRouter()
router.include_router(book_route)
router.include_router(genre_route)
