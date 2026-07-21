import json
from app.db.models import Incident, CallSession

def test_get_dashboard_stats(client, db_session):
    """
    Verifies that the dashboard statistics endpoint returns correct counts and calculations.
    """
    session = CallSession(id="test_session_1", status="active")
    db_session.add(session)
    db_session.commit()
    
    incident = Incident(
        session_id="test_session_1",
        transcript="This is a test transcript",
        risk_score=80.0,
        matched_patterns='["Authority Impersonation"]',
        reasoning="Test warning reasoning",
        is_ai_voice=False,
        deepfake_score=0.0,
        status="flagged"
    )
    db_session.add(incident)
    db_session.commit()
    
    response = client.get("/api/incidents/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_scams"] == 1
    assert data["average_risk"] == 80.0

def test_get_incidents(client, db_session):
    """
    Verifies retrieval and mapping of logged incidents.
    """
    session = CallSession(id="test_session_2", status="active")
    db_session.add(session)
    db_session.commit()
    
    incident = Incident(
        session_id="test_session_2",
        transcript="Test transcript",
        risk_score=30.0,
        matched_patterns='["Isolation"]',
        reasoning="Some reasoning",
        is_ai_voice=True,
        deepfake_score=0.9,
        status="flagged"
    )
    db_session.add(incident)
    db_session.commit()
    
    response = client.get("/api/incidents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["session_id"] == "test_session_2"
    assert data[0]["is_ai_voice"] is True
    assert data[0]["deepfake_score"] == 0.9

def test_update_incident_status(client, db_session):
    """
    Verifies incident escalation and status modifications.
    """
    session = CallSession(id="test_session_3", status="active")
    db_session.add(session)
    db_session.commit()
    
    incident = Incident(
        session_id="test_session_3",
        transcript="Test transcript",
        risk_score=90.0,
        matched_patterns='["Payment Coercion"]',
        reasoning="Some reasoning",
        is_ai_voice=False,
        deepfake_score=0.0,
        status="flagged"
    )
    db_session.add(incident)
    db_session.commit()
    
    response = client.put(f"/api/incidents/{incident.id}/status", json={"status": "reported"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "reported"
    
    db_session.refresh(incident)
    assert incident.status == "reported"

def test_process_transcript_chunk(client, db_session):
    """
    Tests live transcript uploads and dynamic scoring response.
    """
    response = client.post(
        "/api/transcript-chunk",
        json={
            "session_id": "test_chunk_session",
            "text_chunk": "This is a call from CBI head office. Your account is flagged."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == "test_chunk_session"
    assert data["risk_score"] > 0.0
    assert "Authority Impersonation" in data["matched_patterns"]
