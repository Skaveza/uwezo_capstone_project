
# 1. Imports

import os
import re
import json
import numpy as np
import evaluate
import pandas as pd
from pathlib import Path
from PIL import Image
import torch

from transformers import (
    AutoProcessor,
    LayoutLMv3Processor,
    LayoutLMv3ForTokenClassification,
    Trainer,
    TrainingArguments,
)


# Core Paths

PROJECT_ROOT = Path.cwd()
PROC_IMG = PROJECT_ROOT / "processed" / "images"
PROC_OCR = PROJECT_ROOT / "processed" / "ocr"
YOLO_ROOT = PROJECT_ROOT / "yolo"
MODEL_DIR = PROJECT_ROOT / "models" / "layoutlmv3_runs"

# Ensure directories exist
for d in [PROC_IMG, PROC_OCR, YOLO_ROOT, MODEL_DIR]:
    d.mkdir(parents=True, exist_ok=True)


# Label Constants
CLASSES = [
    "table_transactions_data","table_transactions_header","account_holder_name",
    "bank_name","account_number","statement_period","opening_balance",
    "currency","doc_type"
]
BIO_LABELS = ["O"] + [f"B-{c}" for c in CLASSES] + [f"I-{c}" for c in CLASSES]
id2label = {i:l for i,l in enumerate(BIO_LABELS)}
label2id = {l:i for i,l in id2label.items()}

print(f"Setup complete. {len(BIO_LABELS)} labels loaded.")

# Constants for OCR column normalization
COLUMN_MAPPING = {
    "credit": ["credit", "money in", "inflow", "deposit", "amount received", "received amount"],
    "debit": ["debit", "money out", "withdrawal", "outflow", "spent", "amount paid"],
    "balance": ["balance", "ledger balance", "running balance", "closing balance", "closing bal", "balance amount"],
    "date": ["date", "transaction date", "value date", "booking date"],
    "description": ["description", "narration", "particulars", "details", "transaction details", "remark"]
}

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize column names to a consistent schema
    across different bank statement formats.
    """
    df = df.copy()
    normalized_map = {}
    for col in df.columns:
        clean_col = re.sub(r"[^a-zA-Z0-9 ]", "", col).strip().lower()
        matched = False
        for target, variants in COLUMN_MAPPING.items():
            if any(clean_col in v or v in clean_col for v in variants):
                normalized_map[col] = target
                matched = True
                break
        if not matched: normalized_map[col] = clean_col
    df.rename(columns=normalized_map, inplace=True)
    return df
