import sqlite3, joblib, os
from datetime import datetime
from src.preprocessing import preprocess_for_training
from src.training import train_model
from src.evaluation import evaluate_model

DB_PATH = "uwezo_statements.db"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "uwezo_latest.pt")
MIN_F1 = 0.9

def load_training_data():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""SELECT field_name, field_value FROM ExtractedFields e
                   JOIN Uploads u ON e.upload_id = u.id
                   WHERE u.processed = 1""")
    data = cur.fetchall()
    conn.close()
    return preprocess_for_training(data)

def retrain():
    os.makedirs(MODEL_DIR, exist_ok=True)
    X, y = load_training_data()
    model = train_model(X, y)
    scores = evaluate_model(model, X, y)
    if scores["f1"] >= MIN_F1:
        joblib.dump(model, MODEL_PATH)
        print(f"Model retrained successfully. New F1={scores['f1']:.3f}")
        return True
    print(f"Retrain skipped. F1={scores['f1']:.3f}")
    return False

if __name__ == "__main__":
    started = datetime.now()
    print(f"[{started}] Retraining started.")
    retrain()
    print(f"Completed at {datetime.now()}.")
