import logging
from sqlalchemy.orm import Session
from app.db.models import CallSession, Incident

logger = logging.getLogger(__name__)

def get_or_create_session(db: Session, session_id: str) -> CallSession:
    """
    Retrieves an existing CallSession, or creates and returns a new one if not found.
    """
    session = db.query(CallSession).filter(CallSession.id == session_id).first()
    if not session:
        session = CallSession(id=session_id, status="active")
        db.add(session)
        db.commit()
        db.refresh(session)
        logger.info(f"Created new call session in DB: {session_id}")
    return session

def get_or_create_incident(db: Session, session_id: str) -> Incident:
    """
    Retrieves the latest incident for a session, or creates a new one if none exists.
    """
    incident = db.query(Incident).filter(Incident.session_id == session_id).order_by(Incident.id.desc()).first()
    if not incident:
        incident = Incident(
            session_id=session_id,
            transcript="",
            risk_score=0.0,
            matched_patterns="[]",
            reasoning="Awaiting transcript updates...",
            is_ai_voice=False,
            deepfake_score=0.0,
            status="flagged"
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        logger.info(f"Created new incident log in DB for session: {session_id}")
    return incident
