"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Groq API
    GROQ_API_KEY: str = ""
    
    # HuggingFace
    HF_TOKEN: str = ""
    
    from typing import Any

    # CORS
    # Using Any to prevent pydantic-settings from trying to JSON parse the env var
    CORS_ORIGINS: Any = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:8080",
        ]
    )
    
    # Evidence Storage
    EVIDENCE_DIR: str = "./evidence"
    SCREENSHOT_DIR: str = "./evidence/screenshots"
    LOGS_DIR: str = "./evidence/logs"
    
    # AI Detection Settings
    DETECTION_SENSITIVITY_LOW: float = 0.7
    DETECTION_SENSITIVITY_MEDIUM: float = 0.5
    DETECTION_SENSITIVITY_HIGH: float = 0.3
    
    # Warning Thresholds
    WARNING_THRESHOLD: int = 3
    BLOCK_THRESHOLD: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        """
        Robustly parse CORS origins from various formats (list, string, JSON string).
        """
        if isinstance(value, list):
            return value
            
        if isinstance(value, str):
            # Check if it's a JSON list string
            if value.strip().startswith("[") and value.strip().endswith("]"):
                import json
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    pass # Fallback to comma split
            
            return [
                origin.strip()
                for origin in value.split(",")
                if origin.strip()
            ]
        return value


settings = Settings()

