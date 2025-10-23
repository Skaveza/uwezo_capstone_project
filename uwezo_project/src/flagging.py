"""
Document-level integrity analysis and flagging utilities.
"""

import cv2
import numpy as np
from sklearn.ensemble import IsolationForest
from pathlib import Path


# 1. Numerical anomaly detection

def check_numeric_consistency(fields: dict) -> dict:
    """
    Perform internal math checks on numeric fields extracted from LayoutLMv3.
    Expected keys: opening_balance, closing_balance, table_transactions_data (list of amounts).
    """
    result = {"consistency_score": 1.0, "status": "ok", "reason": ""}
    try:
        if not fields.get("table_transactions_data"):
            return result

        try:
            tx_sum = sum(float(x) for x in fields["table_transactions_data"])
            opening = float(fields.get("opening_balance", 0))
            closing = float(fields.get("closing_balance", 0))
        except Exception:
            result.update({"consistency_score": 0.0, "status": "suspicious",
                           "reason": "Non‑numeric or missing fields"})
            return result

        diff = abs((opening + tx_sum) - closing)
        thresh = 0.01 * max(abs(closing), 1.0)
        score = max(0.0, 1.0 - diff / (thresh + 1e-9))
        result["consistency_score"] = score
        if score < 0.8:
            result["status"] = "suspicious"
            result["reason"] = f"Balance mismatch: diff={diff:.2f}"
    except Exception as e:
        result.update({"status": "error", "reason": str(e)})
    return result


# 2. Forensic vision / tampering detection

def detect_forensic_tampering(img_path: Path) -> dict:
    """
    Detect potential edits or tampering in an image using simple noise + compression features.
    Advanced implementations can replace this with a trained CNN or tampering API.
    """
    img = cv2.imread(str(img_path))
    result = {"tamper_score": 0.0, "status": "ok", "reason": ""}
    if img is None:
        result.update({"status": "error", "reason": f"Cannot read {img_path}"})
        return result

    # JPEG compression artifacts heuristic
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dct = cv2.dct(np.float32(gray) / 255.0)
    energy = np.mean(np.abs(dct))
    edge = cv2.Canny(gray, 100, 200)
    edge_density = np.mean(edge > 0)

    tamper_score = (abs(energy - 0.15) + edge_density) / 2
    tamper_score = min(1.0, max(0.0, tamper_score))
    result["tamper_score"] = tamper_score

    if tamper_score > 0.7:
        result["status"] = "suspicious"
        result["reason"] = "High edge / entropy variation, possible manipulation"
    return result


# 3. Aggregator / ensemble risk scorer

def aggregate_flags(numeric_result: dict, vision_result: dict) -> dict:
    """
    Combine numerical and vision scores into a document-level flag.
    """
    num_score = numeric_result.get("consistency_score", 1.0)
    tamper_score = vision_result.get("tamper_score", 0.0)

    risk = 0.6 * tamper_score + 0.4 * (1 - num_score)
    status = "suspicious" if risk > 0.75 else "approved"
    return {
        "risk_score": round(risk, 3),
        "status": status,
        "numeric_check": numeric_result,
        "tamper_check": vision_result,
    }
