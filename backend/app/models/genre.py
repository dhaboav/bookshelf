"""Model for genre table"""

from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.book import Book


class Genre(SQLModel, table=True):
    """Model for database genre table"""

    __tablename__ = "genre"

    id: Optional[int] = Field(default=None, primary_key=True)
    genre: str = Field(unique=True)

    # Relationships
    books: list["Book"] = Relationship(back_populates="genre")
