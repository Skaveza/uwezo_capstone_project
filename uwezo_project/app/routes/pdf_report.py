from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.pdf_report import generate_pdf_report


router = APIRouter(prefix="/report", tags=["Report Generation"])

@router.post("/")
async def generate_report(data: dict):
    """Generate a downloadable PDF summary report."""
    return generate_pdf_report(data)
