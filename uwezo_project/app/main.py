from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import engine, get_db  
from .routes import analyze, review, pdf_report, upload, retrain

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Uwezo API", version="1.0")

@app.get("/")
def root():
    return {"message": "Uwezo API is running!"}

# Core Endpoints
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.post("/audit/", response_model=schemas.AuditTrailResponse)
def create_audit(audit: schemas.AuditTrailCreate, db: Session = Depends(get_db)):
    return crud.create_audit(db, audit)

@app.get("/audit/", response_model=list[schemas.AuditTrailResponse])
def get_audit_logs(db: Session = Depends(get_db)):
    logs, = crud.get_audit_logs(db)
    return logs

# Include routes
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(review.router)
app.include_router(pdf_report.router)
app.include_router(retrain.router)

