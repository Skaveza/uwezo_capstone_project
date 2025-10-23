import re
import pandas as pd

# 1. Define variants for key financial columns
COLUMN_MAPPING = {
    "credit": ["credit", "money in", "inflow", "deposit", "amount received", "received amount"],
    "debit": ["debit", "money out", "withdrawal", "outflow", "spent", "amount paid"],
    "balance": ["balance", "ledger balance", "running balance", "closing balance", "closing bal", "balance amount"],
    "date": ["date", "transaction date", "value date", "booking date"],
    "description": ["description", "narration", "particulars", "details", "transaction details", "remark"]
}

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize column names to a consistent schema.
    Works for both tabular (PDF) and OCR-extracted (image) DataFrames.
    """
    df = df.copy()
    normalized_map = {}

    for col in df.columns:
        # Clean the header text
        clean_col = re.sub(r"[^a-zA-Z0-9 ]", "", col).strip().lower()
        matched = False

        # Check if header matches any expected variant (partial matches included)
        for target, variants in COLUMN_MAPPING.items():
            if any(clean_col in v or v in clean_col for v in variants):
                normalized_map[col] = target
                matched = True
                break

        # Keep original name if no match found
        if not matched:
            normalized_map[col] = clean_col

    df.rename(columns=normalized_map, inplace=True)
    return df
