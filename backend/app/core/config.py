# app/core/config.py
import os
from pathlib import Path

# Define a raiz do projeto (backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    # JWT
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "ALTERAR_NO_PROD")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'fichas.db'}"

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # 📁 Caminhos para Scrapy e YouTube
    SCRAPY_SETTINGS_MODULE: str = "app.scraping.settings"  # Import path
    YOUTUBE_SECRET_FILE: Path = BASE_DIR / "app" / "utils" / "secret_file.json"
    DATA_RAW_DIR: Path = BASE_DIR / "data" / "raw"

settings = Settings()
