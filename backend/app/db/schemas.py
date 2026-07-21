from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Input schemas
class AudioChunkRequest(BaseModel):
    session_id: str
    audio_blob: str  # Base64 encoded audio string
    filename: Optional[str] = None

class TranscriptChunkRequest(BaseModel):
    session_id: str
    text_chunk: str
    timestamp: Optional[datetime] = None

class IncidentStatusUpdate(BaseModel):
    status: str  # reported, dismissed, flagged

# Response schemas
class AudioChunkResponse(BaseModel):
    transcript: str

class TranscriptChunkResponse(BaseModel):
    session_id: str
    risk_score: float
    matched_patterns: List[str]
    alert: bool
    is_ai_voice: bool
    deepfake_score: float

class IncidentResponse(BaseModel):
    id: int
    session_id: str
    transcript: str
    risk_score: float
    matched_patterns: List[str]
    reasoning: Optional[str] = None
    is_ai_voice: bool
    deepfake_score: float
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_scams: int
    average_risk: float
    total_dismissed: int
    total_reported: int
