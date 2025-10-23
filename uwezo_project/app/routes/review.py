from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/review", tags=["Document Review"])

@router.post("/{document_id}")
def review_document(document_id: int, review: schemas.ReviewSchema, db: Session = Depends(get_db)):
    # Unpack review fields and pass as separate arguments
    logged_review = crud.log_review(
        db,
        document_id,
        review.user_id,
        review.comment,
        review.trigger_retrain
    )
    # Only queue retrain if requested
    if review.trigger_retrain:
        crud.queue_retrain_task(db, document_id)
    # Optionally, return the logged_review object
    return {
        "message": "Review recorded",
        "review_id": logged_review.id,
        "document_id": document_id
    }
