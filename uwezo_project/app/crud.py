from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_user(db: Session, user: schemas.UserCreate):
    new_user = models.User(username=user.username, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_users(db: Session):
    return db.query(models.User).all()

def create_audit(db: Session, audit: schemas.AuditTrailCreate):
    new_audit = models.AuditTrail(
        action=audit.action,
        details=audit.details,
        user_id=audit.user_id,
        timestamp=audit.timestamp or datetime.utcnow(),
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    return new_audit

def get_audit_logs(db: Session):
    return db.query(models.AuditTrail).all()

def create_upload(db: Session, filename: str):
    new_upload = models.Upload(
        filename=filename,
        uploaded_at=datetime.utcnow(),
        expires_at=None,
        processing_purpose=None,
        processed=False
    )
    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)
    return new_upload

def log_review(db: Session, document_id: int, user_id: int, comment: str, retrain_flag: bool = False):
    review = models.Review(
        document_id=document_id,
        user_id=user_id,
        comment=comment,
        retrain_flag=retrain_flag,
        reviewed_at=datetime.utcnow()
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_reviews_for_document(db: Session, document_id: int):
    return db.query(models.Review).filter(models.Review.document_id == document_id).all()
