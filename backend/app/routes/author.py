"""API for author.
Utilities:
- get_data_by_id    : Get data by id.
- get_data_by_name  : Get data by author.

APIs:
- [POST] create_author   : Create a new author.
- [GET] get_all_author   : Get all the data.
- [GET] get_author       : Get the data by id.
- [PATCH] update_author  : Update the data by id.
- [DEL] delete_author    : Delete the data by id.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.db import SessionDep
from app.models.author import Author
from app.schemes.author import AuthorCreate, AuthorUpdate
from app.schemes.message import Message

router = APIRouter(prefix="/author", tags=["Author"])


def get_data_by_id(session: SessionDep, id: int) -> Author:
    """Utility function to get the author data by id.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the author whose to get.

    Return:
        Author: Information about data from database.
    """
    return session.get(Author, id)


def get_data_by_name(session: SessionDep, author: str) -> Optional[Author]:
    """Utility function to get the author data by name.
    Args:
        session (SessionDep): Database session dependency.
        author (str): The author whose to get.

    Return:
        Author: The author data from database.
    """
    stmt = select(Author).where(Author.author == author)
    data = session.exec(stmt).first()
    return data


@router.post("/", response_model=Message, status_code=201)
def create_author(session: SessionDep, request: AuthorCreate):
    """API to create a new author data.
    Args:
        session (SessionDep): Database session dependency.
        request (AuthorCreate): Scheme to add a new author.

    Return:
        Message: detail for API Response.
    """
    is_data_exist = get_data_by_name(session, request.author)
    if is_data_exist:
        raise HTTPException(400, "The author already exists")

    db_obj = Author.model_validate(request)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="The author was added successfully")


@router.get("/")
def get_all_author(session: SessionDep):
    """API to get all genre.
    Args:
        session (SessionDep): Database session dependency.
    """
    stmt = select(Author)
    return session.exec(stmt).all()


@router.get("/{id}")
def get_author(session: SessionDep, id: int):
    """API to get the author data.
    Args:
        session (SessionDep): Database session dependency.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The author not found")

    return data


@router.patch("/{id}", response_model=Message)
def update_author(session: SessionDep, id: int, request: AuthorUpdate):
    """API to update the author data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the author whose to update.
        request (AuthorUpdate): Scheme to update the author.

    Return:
        Message: detail for API Response.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The author not found")

    is_exist = get_data_by_name(session, request.author)
    if data.author != request.author and is_exist:
        raise HTTPException(400, "The author already exists")

    update_data = request.model_dump(exclude_unset=True)
    data.sqlmodel_update(update_data)
    session.add(data)
    session.commit()
    session.refresh(data)

    return Message(detail="The author was updated successfully")


@router.delete("/{id}", response_model=Message)
def delete_author(session: SessionDep, id: int):
    """API to delete the author data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the author whose to delete.

    Return:
        Message: detail for API Response.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The author not found")

    session.delete(data)
    session.commit()
    return Message(detail="The author was deleted successfully")
