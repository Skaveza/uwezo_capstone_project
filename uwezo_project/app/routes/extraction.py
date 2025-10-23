from fastapi import APIRouter, UploadFile, File
from ..extraction import extract_bank_statement
from tempfile import NamedTemporaryFile

router = APIRouter(prefix="/analyze", tags=["PDF Extraction"])

@router.post("/")
async def analyze_pdf(file: UploadFile = File(...)):
    """Analyze a PDF bank statement and extract text and tables."""
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp.flush()
        data = extract_bank_statement(tmp.name)
    return data
