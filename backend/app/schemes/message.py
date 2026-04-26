"""Models and schemes for FastAPI application.

- Message: The scheme for API response.
"""

from sqlmodel import SQLModel


class Message(SQLModel):
    """Scheme model for API response"""

    detail: str
