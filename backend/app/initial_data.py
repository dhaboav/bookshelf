import logging
import os

from sqlalchemy import text
from sqlmodel import Session

from app.core.db import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SQL_FILE_PATH = os.path.join(os.getcwd(), "data.sql")


def init() -> None:
    with Session(engine) as session:
        try:
            check_data = session.exec(text("SELECT 1 FROM book LIMIT 1")).first()

            if not check_data:
                if os.path.exists(SQL_FILE_PATH):
                    logger.info(f"Started import data: {SQL_FILE_PATH}...")
                    with open(SQL_FILE_PATH, "r") as f:
                        sql_content = f.read()
                        session.exec(text(sql_content))
                        session.commit()
                    logger.info("Data import successfully")
                else:
                    logger.warning(f"File {SQL_FILE_PATH} not found. Skip import data.")
            else:
                logger.info("Data already exist. Skip import data.")

        except Exception as e:
            logger.error(f"Error: {e}")
            session.rollback()


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
