from pathlib import Path
from src.flagging import (
    check_numeric_consistency,
    detect_forensic_tampering,
    aggregate_flags,
)
from app.services.extraction import run_inference  # assuming you have one (predict_fields wrapper)

def analyze_document(image_path: Path, ocr_json_path: Path):
    """
    Run model inference, apply flagging analysis, and return final classification.
    """
    # Step 1: extract structured fields
    fields = run_inference(image_path, ocr_json_path)

    # Step 2: run checks
    numeric_res = check_numeric_consistency(fields)
    vision_res = detect_forensic_tampering(image_path)
    combined = aggregate_flags(numeric_res, vision_res)

    return {
        "fields": fields,
        "flagging": combined
    }
