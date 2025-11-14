from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = "sqlite:///./app.db"
    GEMINI_API_KEY: str = "AIzaSyCps-K2jdyov4Yy4lEnykxuos-2c4HB50Y"
    OPENAI_API_KEY: str = "your-openai-api-key-here"
    
    # Celery Configuration
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Email Configuration
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    FROM_EMAIL: str = ""

    #  Modern config syntax (replaces class Config)
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore",   # Ignore extra env vars instead of raising error
    )


settings = Settings()
