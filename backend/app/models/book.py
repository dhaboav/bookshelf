"""Model for book table"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.utils import get_datetime_utc

if TYPE_CHECKING:
    from app.models.genre import Genre


class Book(SQLModel, table=True):
    """Model for database book table"""

    __tablename__ = "book"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    author: str
    genre_id: Optional[int] = Field(default=None, foreign_key="genre.id")
    description: Optional[str] = None
    total_pages: int
    published_year: int
    created_at: Optional[datetime] = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )
    updated_at: Optional[datetime] = Field(
        default_factory=get_datetime_utc,
        sa_column_kwargs={"onupdate": get_datetime_utc},
    )

    # Relationships
    genre: Optional["Genre"] = Relationship(back_populates="books")
