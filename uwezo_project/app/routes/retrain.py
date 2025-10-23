from fastapi import APIRouter
from app.services.retrain import retrain_model
from datetime import datetime

router = APIRouter()

@router.post("/trigger-retrain", summary="Trigger ML model retraining")
def trigger_retrain():
    started = datetime.now()
    print(f"[{started}] Retraining started via API.")
    result = retrain_model()
    completed = datetime.now()
    print(f"[{completed}] Retraining completed.")
    return {
        "status": "completed" if result["success"] else "failed",
        "f1_score": result.get("f1"),
        "message": result["message"],
        "started": str(started),
        "completed": str(completed)
    }
