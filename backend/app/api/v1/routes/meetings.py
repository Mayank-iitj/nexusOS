"""NexusOS — Meetings Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/meetings")

@router.get("/")
async def list_meetings():
    return {"meetings": [
        {"id": "meet_001", "title": "Sprint Planning", "start_time": "2026-07-20T10:00:00Z", "end_time": "2026-07-20T11:00:00Z", "attendees": ["Alex Chen", "Mike Torres", "Sarah Kim"], "status": "scheduled", "meeting_url": "https://meet.google.com/abc-defg-hij", "ai_summary": None},
        {"id": "meet_002", "title": "Client Demo - Acme Corp", "start_time": "2026-07-20T14:00:00Z", "end_time": "2026-07-20T15:00:00Z", "attendees": ["Alex Chen", "Client: John Smith"], "status": "scheduled", "meeting_url": "https://zoom.us/j/123456789", "ai_summary": None},
        {"id": "meet_003", "title": "Weekly Design Review", "start_time": "2026-07-18T15:00:00Z", "end_time": "2026-07-18T16:00:00Z", "attendees": ["Sarah Kim", "Jordan Lee"], "status": "completed", "ai_summary": "Reviewed new dashboard widgets. Agreed on glassmorphism theme. Action: Sarah to finalize color palette by Friday."},
        {"id": "meet_004", "title": "Architecture Review", "start_time": "2026-07-17T11:00:00Z", "end_time": "2026-07-17T12:00:00Z", "attendees": ["Alex Chen", "Mike Torres", "Jordan Lee"], "status": "completed", "ai_summary": "Discussed migration to event-driven architecture. Decision: Use Redis Streams for agent communication. Mike to prototype by next week."},
    ], "total": 4}

@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str):
    return {"id": meeting_id, "title": "Sprint Planning", "status": "scheduled"}

@router.post("/")
async def create_meeting(title: str, start_time: str, end_time: str):
    return {"id": "meet_new", "title": title, "status": "created"}
