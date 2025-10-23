# app/services/extraction.py

from pathlib import Path
from src.layout_inference import predict_fields  # move your notebook inference here
from src.flagging import (
    check_numeric_consistency,
    detect_forensic_tampering,
    aggregate_flags,
)

def extract_with_ai(file_path: str):
    """
    run model inference + flagging.
    """
    # Step 1 − Existing extraction step
    extracted = some_existing_extraction_logic(file_path) 
    img_path = Path("processed/images/val") / (Path(file_path).stem + ".jpg")
    ocr_json = Path("processed/ocr/val") / (img_path.stem + ".json")

    # Step 2 − LayoutLMv3 inference
    if not (img_path.exists() and ocr_json.exists()):
        return {"error": f"Missing OCR or processed image for {file_path}"}

    fields = predict_fields(img_path, ocr_json)

    # Step 3 − Two‑part risk flagging
    numeric_res = check_numeric_consistency(fields)
    vision_res = detect_forensic_tampering(img_path)
    combined = aggregate_flags(numeric_res, vision_res)

    return {
        "fields": fields,
        "flagging": combined,
        "extraction_meta": extracted,
    }
