import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket import manager

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/session/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time status pushing.
    """
    await manager.connect(websocket, session_id)
    try:
        # Keep connection open and listen for client heartbeats or messages
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received data from websocket client: {data}")
            # Echo heartbeat confirm
            await websocket.send_text(json.dumps({"status": "alive"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        logger.info(f"WebSocket client disconnected from session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, session_id)
