from fastapi import APIRouter, UploadFile, File
import tempfile, json
from pathlib import Path
from app.services.flagging_service import analyze_document

router = APIRouter(prefix="/review", tags=["Review & Flagging"])

@router.post("/flag")
async def flag_document(file: UploadFile = File(...)):
    """
    Endpoint: Upload a document; returns extracted fields and flagging decision.
    """
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        image_path = Path(tmp.name)

    # Lookup the OCR JSON you generated when the doc was uploaded
    ocr_path = Path("processed/ocr/val") / (image_path.stem + ".json")
    if not ocr_path.exists():
        return {"error": f"OCR JSON not found for {image_path.name}"}

    result = analyze_document(image_path, ocr_path)
    return {"document": image_path.name, "analysis": result}
