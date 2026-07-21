from fastapi import APIRouter
from app.api.endpoints import audio, incidents, websocket

api_router = APIRouter()

# Register audio processing endpoints
api_router.include_router(audio.router, prefix="/api", tags=["audio"])

# Register incident management endpoints
api_router.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])

# Register websocket connection endpoints
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
