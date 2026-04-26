from typing import Optional

from sqlmodel import SQLModel


class AuthorPublic(SQLModel):
    id: int
    author: str


class AuthorCreate(SQLModel):
    """Scheme for create author"""

    author: str


class AuthorUpdate(SQLModel):
    """Scheme for update author"""

    author: Optional[str] = None
