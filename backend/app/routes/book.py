from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.db import SessionDep
from app.models import Book, BookBase, BookUpdate, Message

router = APIRouter(prefix="/books", tags=["Book"])


def get_book_by_id(session: SessionDep, book_id: int) -> Book:
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


def is_isbn_exist(
    session: SessionDep, isbn: str, exclude_id: Optional[int] = None
) -> bool:
    stmt = select(Book).where(Book.ISBN == isbn)
    if exclude_id:
        stmt = stmt.where(Book.id != exclude_id)

    result = session.exec(stmt).first()
    if result:
        return True
    return False


@router.post("/add", response_model=Message)
def create_new_book(session: SessionDep, book_data: BookBase) -> Message:
    if is_isbn_exist(session, book_data.ISBN):
        raise HTTPException(status_code=400, detail="ISBN already exists")

    db_obj = Book.model_validate(book_data)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="Book added successfully")


@router.get("/get")
def get_book(session: SessionDep):
    stmt = select(Book)
    return session.exec(stmt).all()


@router.patch("/edit/{book_id}", response_model=Message)
def edit_book(session: SessionDep, book_id: int, book_data_in: BookUpdate) -> Message:
    if is_isbn_exist(session, book_data_in.ISBN, book_id):
        raise HTTPException(status_code=400, detail="ISBN already exists")

    book = get_book_by_id(session, book_id)
    update_data = book_data_in.model_dump(exclude_unset=True)
    book.sqlmodel_update(update_data)
    session.add(book)
    session.commit()
    session.refresh(book)

    return Message(detail="Book updated successfully")


@router.delete("/delete/{book_id}")
def delete_book(session: SessionDep, book_id: int) -> Message:
    book = get_book_by_id(session, book_id)
    session.delete(book)
    session.commit()
    return Message(detail="Book deleted successfully")
