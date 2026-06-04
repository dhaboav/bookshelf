"""add isbn to book table

Revision ID: 2624d6753eb3
Revises: 70d1f81597f6
Create Date: 2026-06-04 20:39:43.426378

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "2624d6753eb3"
down_revision: Union[str, Sequence[str], None] = "70d1f81597f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema tanpa menghapus data (MySQL Friendly)."""
    op.add_column(
        "book",
        sa.Column("isbn", sqlmodel.sql.sqltypes.AutoString(length=13), nullable=True),
    )
    bind = op.get_bind()
    result = bind.execute(sa.text("SELECT id FROM book"))
    books = result.fetchall()
    for row in books:
        book_id = row[0]
        temp_isbn = f"OLD_ISBN{str(book_id).zfill(5)}"

        bind.execute(
            sa.text("UPDATE book SET isbn = :isbn WHERE id = :id"),
            {"isbn": temp_isbn, "id": book_id},
        )
    op.alter_column(
        "book",
        "isbn",
        nullable=False,
        existing_type=sqlmodel.sql.sqltypes.AutoString(length=13),
    )
    op.create_unique_constraint(None, "book", ["isbn"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(None, "book", type_="unique")
    op.drop_column("book", "isbn")
