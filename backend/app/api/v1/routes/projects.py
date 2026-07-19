"""NexusOS — Projects Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/projects")

DEMO_PROJECTS = [
    {"id": "proj_001", "name": "NexusOS v2.0 Launch", "description": "Major platform release with multi-agent AI orchestration", "status": "active", "color": "#6366f1", "icon": "Rocket", "tasks_total": 24, "tasks_completed": 18, "progress": 75, "owner": "Alex Chen", "due_date": "2026-07-25"},
    {"id": "proj_002", "name": "Q3 Marketing Campaign", "description": "Multi-channel marketing push for enterprise customers", "status": "active", "color": "#f59e0b", "icon": "Megaphone", "tasks_total": 16, "tasks_completed": 9, "progress": 56, "owner": "Sarah Kim", "due_date": "2026-08-15"},
    {"id": "proj_003", "name": "API Integration Suite", "description": "Build connectors for Slack, Jira, Notion, and GitHub", "status": "active", "color": "#10b981", "icon": "Plug", "tasks_total": 32, "tasks_completed": 28, "progress": 87, "owner": "Mike Torres", "due_date": "2026-07-30"},
]

@router.get("/")
async def list_projects():
    return {"projects": DEMO_PROJECTS, "total": len(DEMO_PROJECTS)}

@router.get("/{project_id}")
async def get_project(project_id: str):
    return next((p for p in DEMO_PROJECTS if p["id"] == project_id), {"error": "Not found"})

@router.post("/")
async def create_project(name: str, description: str = ""):
    return {"id": "proj_new", "name": name, "status": "created"}

@router.put("/{project_id}")
async def update_project(project_id: str):
    return {"id": project_id, "status": "updated"}

@router.delete("/{project_id}")
async def delete_project(project_id: str):
    return {"message": "Project deleted", "id": project_id}
