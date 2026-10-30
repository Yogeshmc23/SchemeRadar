from dotenv import load_dotenv
import os
import psycopg

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("DATABASE_URL is missing from .env")
else:
    try:
        conn = psycopg.connect(database_url)
        print("PostgreSQL connected successfully!")

        result = conn.execute(
            "SELECT extname FROM pg_extension WHERE extname = %s",
            ("vector",)
        ).fetchone()

        print("pgvector:", result)

        conn.close()

    except Exception as error:
        print("Connection error:", error)