import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Incident
from app.db.schemas import IncidentResponse, IncidentStatusUpdate, DashboardStats
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("", response_model=List[IncidentResponse])
def get_incidents(
    status: Optional[str] = None,
    min_score: Optional[float] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Fetches past logged incidents with filtering options.
    """
    query = db.query(Incident)
    
    if status:
        query = query.filter(Incident.status == status)
    if min_score is not None:
        query = query.filter(Incident.risk_score >= min_score)
        
    incidents = query.order_by(Incident.timestamp.desc()).offset(offset).limit(limit).all()
    
    # Parse JSON matched_patterns for schema mapping
    response = []
    for inc in incidents:
        try:
            patterns = json.loads(inc.matched_patterns)
        except Exception:
            patterns = []
        response.append(
            IncidentResponse(
                id=inc.id,
                session_id=inc.session_id,
                transcript=inc.transcript,
                risk_score=inc.risk_score,
                matched_patterns=patterns,
                reasoning=inc.reasoning,
                is_ai_voice=inc.is_ai_voice,
                deepfake_score=inc.deepfake_score,
                timestamp=inc.timestamp,
                status=inc.status
            )
        )
    return response

@router.put("/{incident_id}/status")
def update_incident_status(incident_id: int, request: IncidentStatusUpdate, db: Session = Depends(get_db)):
    """
    Updates the escalation/status of a specific logged incident.
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident.status = request.status
    db.commit()
    return {"message": "Incident status updated successfully", "incident_id": incident_id, "status": incident.status}

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Computes summary metrics for the interceptor dashboard.
    """
    total_scams = db.query(Incident).filter(Incident.risk_score >= settings.ALERT_THRESHOLD).count()
    total_reported = db.query(Incident).filter(Incident.status == "reported").count()
    total_dismissed = db.query(Incident).filter(Incident.status == "dismissed").count()
    
    all_incidents = db.query(Incident).all()
    if all_incidents:
        avg_risk = sum(inc.risk_score for inc in all_incidents) / len(all_incidents)
    else:
        avg_risk = 0.0

    return DashboardStats(
        total_scams=total_scams,
        average_risk=round(avg_risk, 1),
        total_dismissed=total_dismissed,
        total_reported=total_reported
    )
