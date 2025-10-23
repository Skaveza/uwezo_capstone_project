from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter()

@router.post("/login/")
def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == email).first()
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"user_id": user.id, "username": user.username, "role": user.role}
