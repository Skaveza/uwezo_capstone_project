import numpy as np

def detect_fraud(transaction_data: dict, historical_stats: dict = None):
    """
    Detect anomalies and potential fraud in a financial statement.

    Parameters:
        transaction_data: dict
            Features extracted by Donut (numeric fields, balances, transactions)
        historical_stats: dict, optional
            Historical mean/std for numeric features
            e.g., {"total_debit": {"mean": 5000, "std": 2000}, ...}

    Returns:
        dict with:
            alerts: flagged features with explanations
            anomaly_scores: z-scores or None for threshold-only checks
    """
    numeric_fields = [
        "opening_balance", "closing_balance", "total_credit", "total_debit",
        "tax", "pre_tax", "liabilities", "assets", "capital", "withdraw", "deposit"
    ]

    # Thresholds for fields without historical stats
    thresholds = {
        "total_debit": 100_000,
        "total_credit": 100_000,
        "withdraw": 50_000,
        "deposit": 50_000,
        "tax": 20_000
    }

    alerts = {}
    anomaly_scores = {}

    for field in numeric_fields:
        value = transaction_data.get(field)
        if value is None:
            continue  # skip missing values

        # Compute z-score if historical stats are available
        if historical_stats and field in historical_stats:
            mean = historical_stats[field]["mean"]
            std = historical_stats[field]["std"]
            z_score = (value - mean) / std if std > 0 else 0.0
            anomaly_scores[field] = float(z_score)
            if abs(z_score) > 3:
                alerts[field] = f"Anomaly detected: {field}={value} (z={z_score:.2f})"
        else:
            # Threshold-based alert
            threshold = thresholds.get(field)
            anomaly_scores[field] = None
            if threshold and value > threshold:
                alerts[field] = f"Threshold exceeded: {field}={value} (limit={threshold})"

