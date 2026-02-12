from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    ISBN: str = Field(unique=True, min_length=13, max_length=13)
    author: str
    genre: str
    description: str
    total_pages: int
    publisher: str
    publish_year: int
    created_at: Optional[datetime] = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )
