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

    # Save upload record in database
    upload = crud.create_upload(db, file.filename)

    # Save file to disk for extraction or later reference
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-4:]) as tmp:
        tmp.write(await file.read())
        tmp.flush()
        data = extract_with_ai(tmp.name)

    # Update 'processed' field if extraction succeeded
    upload.processed = True
    db.commit()

    # Return document's info and extraction result
    return JSONResponse(content={
        "id": upload.id,
        "filename": upload.filename,
        "result": data
    })
