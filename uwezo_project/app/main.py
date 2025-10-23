from fastapi import FastAPI, Depends, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from . import models, crud, schemas
from .database import engine, get_db
from .routes import auth, analyze, review, pdf_report, upload, retrain, review_flag

# Enable CORS for local frontend
app = FastAPI(title="Uwezo API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jinja2 templates
templates = Jinja2Templates(directory=os.path.abspath(os.path.join(os.path.dirname(__file__), "../templates")))

# Serve dashboard.html using Jinja2
@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

# Optionally, serve static files for images/css
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static"))
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Create tables
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Uwezo API is running!"}

# Core endpoints
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
    return crud.get_audit_logs(db)

# Routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(review.router)
app.include_router(pdf_report.router)
app.include_router(retrain.router)
app.include_router(review_flag.router)