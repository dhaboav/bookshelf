from datetime import datetime, timezone
from typing import Optional

from pydantic import field_validator
from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


class BookBase(SQLModel):
    title: str
    ISBN: str = Field(unique=True, min_length=13, max_length=13)
    author: str
    genre: str
    description: str
    total_pages: int
    publisher: str
    publish_year: int


class BookUpdate(BookBase):
    title: Optional[str] = None
    ISBN: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    total_pages: Optional[int] = None
    publisher: Optional[str] = None
    publish_year: Optional[int] = None

    @field_validator("ISBN", mode="after")
    @classmethod
    def validate_isbn(cls, value: str) -> str:
        if value is not None and len(value) != 13:
            raise ValueError("Invalid ISBN: Must be exactly 13 characters")
        return value


class Book(BookBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )


class Message(SQLModel):
    detail: str
