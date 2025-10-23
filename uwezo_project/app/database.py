from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Connection URL format:
DATABASE_URL = "postgresql://uwezo_user:securepassword@localhost:5432/uwezo_db"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured session class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
