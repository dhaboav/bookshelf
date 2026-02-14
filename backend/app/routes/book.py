from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.db import SessionDep
from app.models import Book, BookBase, BookUpdate, Message

router = APIRouter(prefix="/books", tags=["Book"])


def get_book_by_id(session: SessionDep, book_id: int) -> Book:
    """
    Utility function to get book data by id.

    Args:
        session (SessionDep): Database session dependency.
        book_id (int): ID of the book that to check.

    Return:
        Book: Information about book data from database.

    Raises:
        HTTPException: HTTP 404 Not Found if book dont exists.
    """
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


def is_isbn_exist(
    session: SessionDep, isbn: str, exclude_id: Optional[int] = None
) -> bool:
    """
    Utility function to check if ISBN already exist or not.

    Args:
        session (SessionDep): Database session dependency.
        isbn (str): Isbn of the book that want to be check.
        exclude_id Optional[int]: Book id that to be exclude, default is None.

    Return:
        bool: return True if isbn exist else False if not exist.
    """
    stmt = select(Book).where(Book.ISBN == isbn)
    if exclude_id:
        stmt = stmt.where(Book.id != exclude_id)

    result = session.exec(stmt).first()
    if result:
        return True
    return False


@router.post("/add", response_model=Message, status_code=201)
def create_new_book(session: SessionDep, book_data: BookBase) -> Message:
    """
    Endpoint to create a new book entry.

    Args:
        session (SessionDep): Database session dependency.
        book_data (BookBase): Book scheme that contain data about book.

    Return:
        Message: detail for API Response.

    Raises:
        HTTPException: HTTP 400 Bad Request if isbn already exists.
    """
    if is_isbn_exist(session, book_data.ISBN):
        raise HTTPException(status_code=400, detail="ISBN already exists")

    db_obj = Book.model_validate(book_data)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="Book added successfully")


@router.get("/get")
def get_book(session: SessionDep):
    """
    Endpoint to get all book data.

    Args:
        session (SessionDep): Database session dependency.
    """
    stmt = select(Book)
    return session.exec(stmt).all()


@router.patch("/edit/{book_id}", response_model=Message)
def edit_book(session: SessionDep, book_id: int, book_data_in: BookUpdate) -> Message:
    """
    Endpoint to update book data.

    Args:
        session (SessionDep): Database session dependency.
        book_id (int): ID of the book that to update.
        book_data_in (BookUpdate): Book scheme to update book data.

    Return:
        Message: detail for API Response.

    Raises:
        HTTPException: HTTP 400 Bad Request if isbn already exists.
    """
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
    """
    Endpoint to delete book data.

    Args:
        session (SessionDep): Database session dependency.
        book_id (int): ID of the book that to delete.

    Return:
        Message: detail for API Response.
    """
    book = get_book_by_id(session, book_id)
    session.delete(book)
    session.commit()
    return Message(detail="Book deleted successfully")
