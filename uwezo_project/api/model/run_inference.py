import os
import io
import json
import traceback
from PIL import Image
import torch
from transformers import VisionEncoderDecoderModel, DonutProcessor
from fpdf import FPDF
from .fraud_detection import detect_fraud

# --------------------------
# Paths
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../../models/donut_model_finetuned")
OUTPUT_DIR = os.path.join(BASE_DIR, "../../outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --------------------------
# Device
# --------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"

# --------------------------
# Load Model & Processor
# --------------------------
model = VisionEncoderDecoderModel.from_pretrained(MODEL_PATH).to(device)
processor = DonutProcessor.from_pretrained(MODEL_PATH, use_fast=True)

# Ensure generation tokens
model.config.decoder_start_token_id = processor.tokenizer.convert_tokens_to_ids(["<s>"])[0]
model.config.pad_token_id = processor.tokenizer.pad_token_id
model.config.eos_token_id = processor.tokenizer.eos_token_id

# --------------------------
# PDF Generation
# --------------------------
def generate_pdf(data: dict, pdf_path: str):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Bank Statement Extraction & Fraud Report", ln=True, align="C")
    pdf.ln(10)

    pdf.cell(0, 10, "Extracted Data:", ln=True)
    for k, v in data.items():
        if k not in ["fraud_alerts", "anomaly_scores"]:
            pdf.multi_cell(0, 8, f"{k}: {v}")

    pdf.ln(5)
    pdf.cell(0, 10, "Fraud Alerts:", ln=True)
    alerts = data.get("fraud_alerts", {})
    if alerts:
        for k, v in alerts.items():
            pdf.multi_cell(0, 8, f"{k}: {v}")
    else:
        pdf.cell(0, 8, "No alerts detected.")

    pdf.output(pdf_path)

# --------------------------
# Single Image Inference
# --------------------------
def run_inference_on_image(file_bytes: bytes, filename: str, historical_stats: dict = None):
    """
    Single image inference (reuses loaded model)
    Returns JSON prediction, fraud alerts, anomaly scores, and PDF path.
    """
    try:
        # Load image
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        pixel_values = processor(image, return_tensors="pt").pixel_values.to(device)

        # Generate model output
        outputs = model.generate(pixel_values, max_length=512)
        result_text = processor.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]

        # Parse JSON safely
        try:
            extracted_data = json.loads(result_text)
            if not isinstance(extracted_data, dict):
                extracted_data = {}
        except json.JSONDecodeError:
            extracted_data = {}

        # Run fraud detection safely
        fraud_results = detect_fraud(extracted_data, historical_stats)
        if fraud_results is None:
            fraud_results = {}
        extracted_data["fraud_alerts"] = fraud_results.get("alerts", {})
        extracted_data["anomaly_scores"] = fraud_results.get("anomaly_scores", {})

        # Save JSON
        json_path = os.path.join(OUTPUT_DIR, f"{os.path.splitext(filename)[0]}.json")
        with open(json_path, "w") as f:
            json.dump(extracted_data, f, indent=4)

        # Generate PDF
        pdf_path = os.path.join(OUTPUT_DIR, f"{os.path.splitext(filename)[0]}.pdf")
        generate_pdf(extracted_data, pdf_path)

        return {
            "prediction": extracted_data,
            "json_path": json_path,
            "pdf_report": pdf_path
        }

    except Exception as e:
        print(f"Error in run_inference_on_image for {filename}: {e}")
        traceback.print_exc()
        return {
            "prediction": {},
            "json_path": None,
            "pdf_report": None,
            "error": str(e)
        }

# --------------------------
# Batch Inference
# --------------------------
def run_inference_batch(files: list[tuple[bytes, str]], historical_stats: dict = None):
    """
    Batch inference using the preloaded model
    Returns a list of results per file with safe error handling.
    """
    results = []
    for file_bytes, filename in files:
        try:
            result = run_inference_on_image(file_bytes, filename, historical_stats)
            results.append({"filename": filename, **result})
        except Exception as e:
            results.append({"filename": filename, "prediction": {}, "error": str(e)})
    return results
