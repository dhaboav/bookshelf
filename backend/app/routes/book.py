"""API for book.
Features:
    - get_book_by_id: Utility to get book data by id.
    - [POST] create_new_book: API to create the book data.
    - [GET] get_book: API to get all the book data.
    - [PATCH] update_book: API to update the book data by id.
    - [DEL] delete_book: API to delete the book data by id.
"""

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


@router.post("/", response_model=Message, status_code=201)
def create_new_book(session: SessionDep, request: BookBase) -> Message:
    """
    Endpoint to create a new book entry.

    Args:
        session (SessionDep): Database session dependency.
        request (BookBase): Book scheme that contain data about book.

    Return:
        Message: detail for API Response.

    Raises:
        HTTPException: HTTP 400 Bad Request if isbn already exists.
    """

    db_obj = Book.model_validate(request)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="Book added successfully")


@router.get("/")
def get_book(session: SessionDep):
    """
    Endpoint to get all book data.

    Args:
        session (SessionDep): Database session dependency.
    """
    stmt = select(Book)
    return session.exec(stmt).all()


@router.patch("/{book_id}", response_model=Message)
def update_book(session: SessionDep, book_id: int, request: BookUpdate) -> Message:
    """
    Endpoint to update book data.

    Args:
        session (SessionDep): Database session dependency.
        book_id (int): ID of the book that to update.
        request (BookUpdate): Book scheme to update book data.

    Return:
        Message: detail for API Response.

    Raises:
        HTTPException: HTTP 400 Bad Request if isbn already exists.
    """
    book = get_book_by_id(session, book_id)
    update_data = request.model_dump(exclude_unset=True)
    book.sqlmodel_update(update_data)
    session.add(book)
    session.commit()
    session.refresh(book)

    return Message(detail="Book updated successfully")


@router.delete("/{book_id}")
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
