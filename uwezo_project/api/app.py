from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import os
from api.model.run_inference import run_inference_on_image, run_inference_batch



app = FastAPI(title="Uwezo: Document Verification API")

BASE_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../outputs")
os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)


@app.post("/upload/single")
async def upload_file(file: UploadFile = File(...)):
    file_bytes = await file.read()
    filename = file.filename
    try:
        result = run_inference_on_image(file_bytes, filename)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    return JSONResponse(result)


@app.post("/upload/batch")
async def upload_files(files: list[UploadFile] = File(...)):
    files_data = [(await f.read(), f.filename) for f in files]
    results = run_inference_batch(files_data)
    return JSONResponse({"results": results})


@app.get("/download/json/{filename}")
def download_json(filename: str):

    name_only = os.path.splitext(filename)[0]
    path = os.path.join(BASE_OUTPUT_DIR, f"{name_only}.json")
    if os.path.exists(path):
        return FileResponse(path, media_type="application/json", filename=f"{name_only}.json")
    return JSONResponse({"error": "File not found"}, status_code=404)


@app.get("/download/pdf/{filename}")
def download_pdf(filename: str):
    name_only = os.path.splitext(filename)[0]
    path = os.path.join(BASE_OUTPUT_DIR, f"{name_only}.pdf")
    if os.path.exists(path):
        return FileResponse(path, media_type="application/pdf", filename=f"{name_only}.pdf")
    return JSONResponse({"error": "File not found"}, status_code=404)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
