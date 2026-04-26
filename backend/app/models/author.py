"""Model for author table"""

from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.book import Book


class Author(SQLModel, table=True):
    """Model for database author table"""

    __tablename__ = "author"

    id: Optional[int] = Field(default=None, primary_key=True)
    author: str

    # Relationships
    books: list["Book"] = Relationship(back_populates="author")
