"""General Configuration FastAPI application.

This module provides class for configuration in application.

Features:
    - Take information from .env.
    - Setup project title.
    - Configure database url.
"""

from pydantic import PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings class for application configuration."""

    model_config = SettingsConfigDict(
        env_file="../.env", env_ignore_empty=True, extra="ignore"
    )

    FRONTEND_HOST: str = "http://localhost:5173"

    PROJECT_NAME: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = ""

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )


settings = Settings()
