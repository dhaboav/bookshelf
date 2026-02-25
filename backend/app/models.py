"""Models and schemes for FastAPI application.

This module provides reusable models and schemes for database and routes in application.

Features:
    - BookBase: The base model for book.
    - BookUpdate: Schemes for updating book.
    - Book: The model for database usage.
    - Message: The scheme for API response.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel


def get_datetime_utc() -> datetime:
    """Utility Function for UTC timezone"""
    return datetime.now(timezone.utc)


class BookBase(SQLModel):
    """Base model for book"""

    title: str
    author: str
    genre: str
    description: Optional[str] = None
    total_pages: int
    published_year: int


class BookUpdate(BookBase):
    """Scheme for update book"""

    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    total_pages: Optional[int] = None
    published_year: Optional[int] = None


class Book(BookBase, table=True):
    """Model for database book table"""

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),
    )


class Message(SQLModel):
    """Scheme model for API response"""

    detail: str
