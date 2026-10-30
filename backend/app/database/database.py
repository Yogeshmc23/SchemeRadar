from dotenv import load_dotenv
from pathlib import Path
import os
import psycopg

# Load backend/.env
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is missing from .env")

    return psycopg.connect(DATABASE_URL)


def create_tables():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scholarships (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                states TEXT[],
                courses TEXT[],
                education_levels TEXT[],
                eligible_years TEXT[],
                max_annual_income NUMERIC,
                categories TEXT[],
                benefits TEXT,
                application_deadline TEXT,
                official_url TEXT,
                source_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

    print("Scholarship table created successfully!")


if __name__ == "__main__":
    create_tables()