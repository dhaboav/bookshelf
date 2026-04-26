from typing import Optional

from sqlmodel import Field, SQLModel

from app.utils import get_current_year_utc


class BookCreate(SQLModel):
    """Scheme for create book"""

    title: str
    author: str
    genre: str
    description: Optional[str] = None
    total_pages: int
    published_year: int = Field(ge=1950, le=get_current_year_utc())


class BookUpdate(SQLModel):
    """Scheme for update book"""

    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    total_pages: Optional[int] = None
    published_year: Optional[int] = Field(
        default=None, ge=1950, le=get_current_year_utc()
    )
