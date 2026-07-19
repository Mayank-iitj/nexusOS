"""NexusOS — Tasks Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/tasks")

DEMO_TASKS = [
    {"id": "task_001", "title": "Finalize API documentation", "status": "in_progress", "priority": "high", "project": "NexusOS v2.0 Launch", "assignee": "Alex Chen", "due_date": "2026-07-20", "labels": ["docs", "api"]},
    {"id": "task_002", "title": "Review GitHub Agent PR #247", "status": "review", "priority": "high", "project": "API Integration Suite", "assignee": "Mike Torres", "due_date": "2026-07-19", "labels": ["review", "github"]},
    {"id": "task_003", "title": "Design email campaign templates", "status": "todo", "priority": "medium", "project": "Q3 Marketing Campaign", "assignee": "Sarah Kim", "due_date": "2026-07-22", "labels": ["design", "marketing"]},
    {"id": "task_004", "title": "Implement memory persistence layer", "status": "in_progress", "priority": "high", "project": "NexusOS v2.0 Launch", "assignee": "Alex Chen", "due_date": "2026-07-21", "labels": ["backend", "memory"]},
    {"id": "task_005", "title": "Set up CI/CD pipeline", "status": "done", "priority": "medium", "project": "NexusOS v2.0 Launch", "assignee": "Jordan Lee", "due_date": "2026-07-18", "labels": ["devops"]},
    {"id": "task_006", "title": "Write integration tests for Slack agent", "status": "todo", "priority": "medium", "project": "API Integration Suite", "assignee": "Mike Torres", "due_date": "2026-07-23", "labels": ["testing", "slack"]},
    {"id": "task_007", "title": "Prepare investor presentation", "status": "todo", "priority": "urgent", "project": "Q3 Marketing Campaign", "assignee": "Sarah Kim", "due_date": "2026-07-20", "labels": ["presentation"]},
    {"id": "task_008", "title": "Optimize vector search performance", "status": "in_progress", "priority": "high", "project": "NexusOS v2.0 Launch", "assignee": "Jordan Lee", "due_date": "2026-07-22", "labels": ["backend", "performance"]},
]

@router.get("/")
async def list_tasks(status: str = None, priority: str = None):
    tasks = DEMO_TASKS
    if status:
        tasks = [t for t in tasks if t["status"] == status]
    if priority:
        tasks = [t for t in tasks if t["priority"] == priority]
    return {"tasks": tasks, "total": len(tasks)}

@router.get("/{task_id}")
async def get_task(task_id: str):
    return next((t for t in DEMO_TASKS if t["id"] == task_id), {"error": "Not found"})

@router.post("/")
async def create_task(title: str, project_id: str = None):
    return {"id": "task_new", "title": title, "status": "created"}

@router.put("/{task_id}")
async def update_task(task_id: str):
    return {"id": task_id, "status": "updated"}

@router.delete("/{task_id}")
async def delete_task(task_id: str):
    return {"message": "Task deleted", "id": task_id}
