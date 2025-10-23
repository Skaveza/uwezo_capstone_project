from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, models
import os
from datetime import datetime

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/", summary="Upload a document")
async def upload_document(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    safe_filename = f"{user_id}_{timestamp}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    upload = crud.create_upload(
        db=db,
        filename=safe_filename,
        user_id=user_id,
        file_path=file_path,
        processing_purpose="manual"
    )

    return {
        "message": "File uploaded successfully.",
        "upload_id": upload.id,
        "filename": safe_filename
    }

# GET all uploads for dashboard stats
@router.get("/upload/")
def get_uploads(db: Session = Depends(get_db)):
    uploads = db.query(models.Upload).all()
    # If your model has `flagged` and `confidence_score` fields, include them here
    results = [
        {
            "id": u.id,
            "filename": u.filename,
            "flagged": getattr(u, "flagged", False),  # Adjust as needed
            "processed": u.processed,
            "processing_purpose": u.processing_purpose,
            "confidence_score": getattr(u, "confidence_score", None),  # Adjust as needed
            # Add other fields needed for dashboard
        }
        for u in uploads
    ]
    return results
