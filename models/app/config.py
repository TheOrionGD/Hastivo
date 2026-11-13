import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "hastivo-isl-v2"
    SERVICE_NAME: str = "Hastivo Translation & Language Engine"
    API_VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
