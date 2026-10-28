from sqlalchemy import text
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./restart.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def add_barrier_column():
    with engine.begin() as connection:
        columns = connection.execute(
            text("PRAGMA table_info(check_ins)")
        ).fetchall()

        column_names = [column[1] for column in columns]

        if "barrier" not in column_names:
            connection.execute(
                text("ALTER TABLE check_ins ADD COLUMN barrier VARCHAR(50)")
            )