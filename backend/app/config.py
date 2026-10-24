import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables and .env file.
    No hardcoded secrets or production credentials.
    """
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "RaktNavi API"
    APP_ENV: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "127.0.0.1"

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/raktnavi_db",
        description="PostgreSQL connection string with psycopg driver"
    )

    # CORS: Explicitly comma-separated list of trusted origins
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    # Business rules
    STALE_THRESHOLD_HOURS: int = 24
    MAX_REQUEST_BODY_BYTES: int = 262144  # 256 KB limit to prevent payload abuse

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse comma-separated origin strings into a clean list of origins."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


settings = Settings()
