from typing import Optional

from sqlmodel import Field, SQLModel

from app.schemes.author import AuthorPublic
from app.schemes.genre import GenrePublic
from app.utils import get_current_year_utc


class BookPublic(SQLModel):
    id: int
    title: str
    isbn: str = Field(min_length=13, max_length=13)
    author: Optional[AuthorPublic] = None
    genre: Optional[GenrePublic] = None
    description: Optional[str] = None
    total_pages: int
    published_year: int = Field(ge=1950, le=get_current_year_utc())


class BookCreate(SQLModel):
    """Scheme for create book"""

    title: str
    isbn: str = Field(min_length=13, max_length=13)
    author_id: int
    genre_id: int
    description: Optional[str] = None
    total_pages: int
    published_year: int = Field(ge=1950, le=get_current_year_utc())


class BookUpdate(SQLModel):
    """Scheme for update book"""

    title: Optional[str] = None
    isbn: str = Field(min_length=13, max_length=13)
    author_id: Optional[int] = None
    genre_id: Optional[int] = None
    description: Optional[str] = None
    total_pages: Optional[int] = None
    published_year: Optional[int] = Field(
        default=None, ge=1950, le=get_current_year_utc()
    )
