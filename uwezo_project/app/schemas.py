from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True  # ← update for Pydantic v2

class AuditTrailBase(BaseModel):
    action: str
    details: str
    user_id: int
    timestamp: Optional[datetime] = None

class AuditTrailCreate(AuditTrailBase):
    pass

class AuditTrailResponse(AuditTrailBase):
    id: int
    class Config:
        from_attributes = True 

class ReviewSchema(BaseModel):
    comment: str
    user_id: int
    trigger_retrain: bool = False
