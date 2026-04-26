"""API for genre.
Utilities:
- get_data_by_id    : Get data by id.
- get_data_by_name  : Get data by genre.

APIs:
- [POST] create_genre   : Create a new genre.
- [GET] get_all_genre   : Get all the data.
- [GET] get_genre       : Get the data by id.
- [PATCH] update_genre  : Update the data by id.
- [DEL] delete_genre    : Delete the data by id.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.db import SessionDep
from app.models.genre import Genre
from app.schemes.genre import GenreCreate, GenreUpdate
from app.schemes.message import Message

router = APIRouter(prefix="/genre", tags=["Genre"])


def get_data_by_id(session: SessionDep, id: int) -> Genre:
    """Utility function to get the genre data by id.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the genre whose to get.

    Return:
        Gerne: Information about data from database.
    """
    return session.get(Genre, id)


def get_data_by_name(session: SessionDep, genre: str) -> Optional[Genre]:
    """Utility function to get the genre data by name.
    Args:
        session (SessionDep): Database session dependency.
        genre (str): The genre whose to get.

    Return:
        Genre: The genre data from database.
    """
    stmt = select(Genre).where(Genre.genre == genre)
    data = session.exec(stmt).first()
    return data


@router.post("/", response_model=Message, status_code=201)
def create_genre(session: SessionDep, request: GenreCreate):
    """API to create a new genre data.
    Args:
        session (SessionDep): Database session dependency.
        request (GenreCreate): Scheme to add a new genre.

    Return:
        Message: detail for API Response.
    """
    is_data_exist = get_data_by_name(session, request.genre)
    if is_data_exist:
        raise HTTPException(400, "The genre already exists")

    db_obj = Genre.model_validate(request)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return Message(detail="The genre was added successfully")


@router.get("/")
def get_all_genre(session: SessionDep):
    """API to get all genre.
    Args:
        session (SessionDep): Database session dependency.
    """
    stmt = select(Genre)
    return session.exec(stmt).all()


@router.get("/{id}")
def get_genre(session: SessionDep, id: int):
    """API to get the genre data.
    Args:
        session (SessionDep): Database session dependency.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The genre not found")

    return data


@router.patch("/{id}", response_model=Message)
def update_genre(session: SessionDep, id: int, request: GenreUpdate):
    """API to update the genre data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the genre whose to update.
        request (GenreUpdate): Scheme to update the genre.

    Return:
        Message: detail for API Response.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The genre not found")

    is_exist = get_data_by_name(session, request.genre)
    if data.genre != request.genre and is_exist:
        raise HTTPException(400, "The genre already exists")

    update_data = request.model_dump(exclude_unset=True)
    data.sqlmodel_update(update_data)
    session.add(data)
    session.commit()
    session.refresh(data)

    return Message(detail="The genre was updated successfully")


@router.delete("/{id}", response_model=Message)
def delete_genre(session: SessionDep, id: int):
    """API to delete the genre data.
    Args:
        session (SessionDep): Database session dependency.
        id (int): ID of the genre whose to delete.

    Return:
        Message: detail for API Response.
    """
    data = get_data_by_id(session, id)
    if not data:
        raise HTTPException(404, "The genre not found")

    session.delete(data)
    session.commit()
    return Message(detail="The genre was deleted successfully")
