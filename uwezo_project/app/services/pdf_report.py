from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from fastapi.responses import StreamingResponse
from datetime import datetime

def generate_pdf_report(data: dict):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 800, "Uwezo Bank Statement Summary")
    c.setFont("Helvetica", 10)

    y = 770
    for key, val in data.get("metadata", {}).items():
        c.drawString(50, y, f"{key}: {val}")
        y -= 15

    y -= 10
    c.drawString(50, y, "Sample transactions:")
    y -= 20

    for table in data.get("tables", []):
        for row in table.get("rows", [])[:5]:
            if y < 80:
                c.showPage()
                y = 780
            c.drawString(50, y, ", ".join(row))
            y -= 15

    c.save()
    buffer.seek(0)
    name = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return StreamingResponse(buffer, media_type="application/pdf",
                             headers={"Content-Disposition": f"attachment; filename={name}"})
