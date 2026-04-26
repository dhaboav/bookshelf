from typing import Optional

from sqlmodel import SQLModel


class GenreCreate(SQLModel):
    """Scheme for create genre"""

    genre: str


class GenreUpdate(SQLModel):
    """Scheme for update genre"""

    genre: Optional[str] = None
