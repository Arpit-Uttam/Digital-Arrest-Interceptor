import base64
import json
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.crud import get_or_create_session, get_or_create_incident
from app.db.schemas import (
    AudioChunkRequest, AudioChunkResponse,
    TranscriptChunkRequest, TranscriptChunkResponse
)
from app.core.config import settings
from app.services.transcription import transcribe_audio
from app.services.deepfake import analyze_audio_deepfake
from app.services.scorer import rule_based_score, calculate_fusion_score
from app.services.llm import llm_score
from app.services.websocket import manager

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/audio-chunk", response_model=AudioChunkResponse)
async def process_audio_chunk(request: AudioChunkRequest, db: Session = Depends(get_db)):
    """
    Decodes audio base64, runs deepfake voice detection, transcribes using Whisper,
    and returns the transcribed text.
    """
    try:
        audio_data = base64.b64decode(request.audio_blob.split(",")[-1] if "," in request.audio_blob else request.audio_blob)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to decode base64 audio: {str(e)}")

    # 1. Run deepfake voice detection
    filename_sim = request.filename if request.filename else f"session_{request.session_id}.wav"
    if "deepfake" in request.session_id.lower() or (request.filename and "deepfake" in request.filename.lower()):
        filename_sim = "deepfake_sample.wav"
        
    deepfake_results = analyze_audio_deepfake(audio_data, filename_sim)
    
    # Save the deepfake status in the database incident
    incident = get_or_create_incident(db, request.session_id)
    incident.is_ai_voice = deepfake_results["is_ai_voice"]
    incident.deepfake_score = deepfake_results["confidence"]
    db.commit()

    # 2. Transcribe Audio (using transcription service)
    transcript_text = transcribe_audio(audio_data, request.session_id, request.filename)

    return AudioChunkResponse(transcript=transcript_text)

@router.post("/transcript-chunk", response_model=TranscriptChunkResponse)
async def process_transcript_chunk(request: TranscriptChunkRequest, db: Session = Depends(get_db)):
    """
    Receives transcribed text, appends it to the session transcript, runs rule-based
    and semantic LLM evaluations, stores results, and broadcasts risk status over WebSockets.
    """
    session_id = request.session_id
    text_chunk = request.text_chunk.strip()

    # Get or create session and incident logs
    get_or_create_session(db, session_id)
    incident = get_or_create_incident(db, session_id)

    # Append new chunk to cumulative transcript
    if incident.transcript:
        incident.transcript += " " + text_chunk
    else:
        incident.transcript = text_chunk

    # 1. Run Rule-based Scorer
    rule_score, rule_matched_patterns = rule_based_score(incident.transcript)

    # 2. Run LLM Semantic Scorer
    llm_results = await llm_score(incident.transcript)
    llm_score_val = llm_results.get("score", 0.0)
    llm_matched_patterns = llm_results.get("matched_patterns", [])
    reasoning = llm_results.get("reasoning", "")

    # 3. Score Fusion: calculate final score using scoring service
    final_score = calculate_fusion_score(rule_score, llm_score_val)
    alert_triggered = final_score >= settings.ALERT_THRESHOLD

    # Combine matched categories from rules and LLM
    all_matched = list(set(rule_matched_patterns + llm_matched_patterns))

    # Update database record
    incident.risk_score = final_score
    incident.matched_patterns = json.dumps(all_matched)
    incident.reasoning = reasoning
    incident.timestamp = datetime.utcnow()
    
    if final_score >= settings.ALERT_THRESHOLD:
        incident.status = "flagged"
    else:
        incident.status = "dismissed" if final_score < 40 else "flagged"

    db.commit()
    db.refresh(incident)

    # 4. Broadcast real-time results via WebSockets
    ws_payload = {
        "session_id": session_id,
        "risk_score": final_score,
        "matched_patterns": all_matched,
        "alert": alert_triggered,
        "reasoning": reasoning,
        "is_ai_voice": incident.is_ai_voice,
        "deepfake_score": incident.deepfake_score
    }
    await manager.broadcast_to_session(session_id, ws_payload)

    return TranscriptChunkResponse(
        session_id=session_id,
        risk_score=final_score,
        matched_patterns=all_matched,
        alert=alert_triggered,
        is_ai_voice=incident.is_ai_voice,
        deepfake_score=incident.deepfake_score
    )
