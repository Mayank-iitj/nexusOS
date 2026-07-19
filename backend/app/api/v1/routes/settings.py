"""NexusOS — Settings Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/settings")

@router.get("/")
async def get_settings():
    return {
        "theme": "dark", "language": "en", "timezone": "America/New_York",
        "notifications": {"email": True, "push": True, "slack": False},
        "ai": {"auto_execute": False, "confirmation_level": "destructive", "default_model": "gemini-2.0-flash"},
        "integrations": {
            "google": {"connected": True, "scopes": ["gmail", "calendar", "drive"]},
            "github": {"connected": True, "repos": 12},
            "slack": {"connected": True, "channels": 8},
            "jira": {"connected": False},
            "notion": {"connected": True, "pages": 45},
        },
    }

@router.put("/")
async def update_settings():
    return {"status": "updated"}

@router.get("/integrations")
async def list_integrations():
    return {"integrations": [
        {"name": "Google Workspace", "icon": "google", "status": "connected", "description": "Gmail, Calendar, Drive, Docs, Sheets"},
        {"name": "GitHub", "icon": "github", "status": "connected", "description": "Repositories, Issues, Pull Requests"},
        {"name": "Slack", "icon": "slack", "status": "connected", "description": "Channels, Messages, Notifications"},
        {"name": "Jira", "icon": "jira", "status": "disconnected", "description": "Boards, Issues, Sprints"},
        {"name": "Notion", "icon": "notion", "status": "connected", "description": "Pages, Databases, Knowledge Base"},
        {"name": "Linear", "icon": "linear", "status": "disconnected", "description": "Issues, Projects, Cycles"},
        {"name": "Zoom", "icon": "zoom", "status": "disconnected", "description": "Meetings, Recordings"},
        {"name": "Discord", "icon": "discord", "status": "disconnected", "description": "Servers, Channels, Messages"},
    ]}
