# app/routes/analyze.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.extraction import extract_with_ai
from .. import crud
import tempfile

router = APIRouter(prefix="/analyze", tags=["Model Inference"])

@router.post("/")
async def analyze_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type not in ["application/pdf", "image/png", "image/jpeg"]:
        raise HTTPException(status_code=415, detail="File type not supported.")

    # Save upload record
    upload = crud.create_upload(db, file.filename)

    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-4:]) as tmp:
        tmp.write(await file.read())
        tmp.flush()
        # combine extraction, inference, flagging
        result = extract_with_ai(tmp.name)

    upload.processed = True
    db.commit()

    return JSONResponse(
        content={
            "id": upload.id,
            "filename": upload.filename,
            "result": result
        }
    )
