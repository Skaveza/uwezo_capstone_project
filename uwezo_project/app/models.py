from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    role = Column(String)

    # Relationships
    audit_trails = relationship("AuditTrail", back_populates="user")
    subject_requests = relationship("SubjectRequest", back_populates="user")


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True)
    filename = Column(Text)
    uploaded_at = Column(DateTime)
    expires_at = Column(DateTime)
    processing_purpose = Column(Text)
    processed = Column(Boolean)

    fields = relationship("ExtractedField", back_populates="upload")
    cases = relationship("Case", back_populates="upload")


class ExtractedField(Base):
    __tablename__ = "extractedfields"

    id = Column(Integer, primary_key=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"))
    field_name = Column(Text)
    field_value = Column(Text)
    masked = Column(Boolean, default=False)

    upload = relationship("Upload", back_populates="fields")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"))
    template_type = Column(Text)
    language = Column(Text)
    error_rate = Column(Float)
    confidence_score = Column(Float)
    flagged = Column(Boolean)
    reviewer_id = Column(Integer)
    reviewer_decision = Column(Text)

    upload = relationship("Upload", back_populates="cases")
    evidence_bundles = relationship("EvidenceBundle", back_populates="case")
    decision_labels = relationship("DecisionLabel", back_populates="case")


class AuditTrail(Base):
    __tablename__ = "audittrail"

    id = Column(Integer, primary_key=True)
    action = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime)
    details = Column(Text)
    model_version = Column(Text)
    dataset_snapshot = Column(Text)

    user = relationship("User", back_populates="audit_trails")


class EvidenceBundle(Base):
    __tablename__ = "evidencebundles"

    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    pdf_path = Column(Text)
    json_path = Column(Text)
    extracted_at = Column(DateTime)
    retention_until = Column(DateTime)

    case = relationship("Case", back_populates="evidence_bundles")


class SubjectRequest(Base):
    __tablename__ = "subjectrequests"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    request_type = Column(Text)
    request_details = Column(Text)
    status = Column(Text)
    request_date = Column(DateTime)
    completion_date = Column(DateTime)

    user = relationship("User", back_populates="subject_requests")


class DecisionLabel(Base):
    __tablename__ = "decisionlabels"

    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    label = Column(Text)
    reviewer_justification = Column(Text)
    evidence = Column(Text)
    confidence = Column(Float)
    review_month = Column(Text)

    case = relationship("Case", back_populates="decision_labels")


class AuthenticityCheck(Base):
    __tablename__ = "authenticitychecks"

    id = Column(Integer, primary_key=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"))
    metadata_sane = Column(Boolean)
    compression_issues = Column(Boolean)
    cross_page_consistency = Column(Boolean)
    trust_score = Column(Float)
    issues_found = Column(Text)
    action_taken = Column(Text)


class AccessibilityAudit(Base):
    __tablename__ = "accessibilityaudits"

    id = Column(Integer, primary_key=True)
    date = Column(DateTime)
    issue = Column(Text)
    fixed = Column(Boolean)
    method = Column(Text)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("uploads.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)                              
    retrain_flag = Column(Boolean, default=False)
    reviewed_at = Column(DateTime)

    user = relationship("User", backref="reviews")
    document = relationship("Upload", backref="reviews")
