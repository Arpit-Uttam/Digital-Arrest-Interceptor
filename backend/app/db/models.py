from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from app.db.session import Base

class CallSession(Base):
    __tablename__ = "call_sessions"

    id = Column(String, primary_key=True, index=True)  # custom session_id or uuid
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="active")  # active, completed

    incidents = relationship("Incident", back_populates="session", cascade="all, delete-orphan")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String, ForeignKey("call_sessions.id"))
    transcript = Column(Text, nullable=False)
    risk_score = Column(Float, default=0.0)
    matched_patterns = Column(Text, default="[]")  # JSON array string of matched categories
    reasoning = Column(Text, nullable=True)         # reasoning explaining the score
    is_ai_voice = Column(Boolean, default=False)
    deepfake_score = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="flagged")      # flagged, reported, dismissed

    session = relationship("CallSession", back_populates="incidents")
