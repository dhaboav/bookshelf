"""API for book.
Utilities:
- get_book_by_id: Get data by id.

APIs:
- [POST] create_book    : Create a book data.
- [GET] get_all_book    : Get all the book data.
- [PATCH] update_book   : Update the book data by id.
- [DEL] delete_book     : Delete the book data by id.
"""

from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.db import SessionDep
from app.models.book import Book
from app.routes.genre import get_data_by_id, get_data_by_name
from app.schemes.book import BookCreate, BookUpdate
from app.schemes.message import Message

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
def create_book(session: SessionDep, request: BookCreate):
    """API to create a new book.
    Args:
        session (SessionDep): Database session dependency.
        request (BookCreate): Scheme to create a new book data.

    Return:
        Message: detail for API Response.

    Raises:
        HTTPException: HTTP 400 Bad Request if genre doesn't exists.
    """

    genre = get_data_by_name(session, request.genre)
    if not genre:
        raise HTTPException(400, "The genre doesn't exists")

    book_data = request.model_dump(exclude={"genre"})
    db_obj = Book.model_validate(book_data)
    db_obj.genre_id = genre.id

    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="The book was added successfully")


@router.get("/")
def get_all_book(session: SessionDep) -> List:
    """API to get all book data.
    Args:
        session (SessionDep): Database session dependency.

    Return:
        List: Information about all books from database.
    """
    stmt = select(Book)
    db_objs = session.exec(stmt).all()
    books = []

    for data in db_objs:
        genre = get_data_by_id(session, data.genre_id)
        books_dict = data.model_dump(exclude="genre_id")
        books_dict["genre"] = genre.genre if genre else None
        books.append(books_dict)

    return books


@router.patch("/{id}", response_model=Message)
def update_book(session: SessionDep, id: int, request: BookUpdate):
    """API to update the book data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the book whose to update.
        request (BookUpdate): Scheme to update the book data.

    Return:
        Message: detail for API Response.
    """
    book = get_book_by_id(session, id)
    update_data = request.model_dump(exclude_unset=True)
    if "genre" in update_data:
        genre = update_data.pop("genre")
        genre_db = get_data_by_name(session, genre)
        book.genre_id = genre_db.id
    book.sqlmodel_update(update_data)

    session.add(book)
    session.commit()
    session.refresh(book)
    return Message(detail="Book updated successfully")


@router.delete("/{id}", response_model=Message)
def delete_book(session: SessionDep, id: int):
    """API to delete the book data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the book whose to delete.

    Return:
        Message: detail for API Response.
    """
    data = get_book_by_id(session, id)
    session.delete(data)
    session.commit()
    return Message(detail="The book was deleted successfully")
