"""
NexusOS — Workflows Routes
CRUD for visual workflow builder configurations.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/workflows")


@router.get("/")
async def list_workflows():
    return {
        "workflows": [
            {
                "id": "wf_001", "name": "Client Email → Jira → Slack",
                "description": "When a client email arrives, extract action items, create Jira tasks, notify on Slack",
                "trigger_type": "email", "is_active": True, "run_count": 47,
                "last_run_at": "2026-07-19T08:30:00Z",
                "nodes": 5, "status": "active",
            },
            {
                "id": "wf_002", "name": "Daily Standup Prep",
                "description": "Every morning at 9 AM, gather GitHub activity, Jira updates, and calendar events",
                "trigger_type": "schedule", "is_active": True, "run_count": 23,
                "last_run_at": "2026-07-19T09:00:00Z",
                "nodes": 6, "status": "active",
            },
            {
                "id": "wf_003", "name": "Meeting Follow-up",
                "description": "After each meeting, generate notes, create tasks, send summary email",
                "trigger_type": "event", "is_active": False, "run_count": 12,
                "last_run_at": "2026-07-18T16:00:00Z",
                "nodes": 4, "status": "paused",
            },
        ],
        "total": 3,
    }


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    return {
        "id": workflow_id,
        "name": "Client Email → Jira → Slack",
        "nodes": [
            {"id": "1", "type": "trigger", "position": {"x": 50, "y": 200}, "data": {"label": "Email Received", "config": {"source": "gmail"}}},
            {"id": "2", "type": "agent", "position": {"x": 300, "y": 200}, "data": {"label": "Email Agent", "agent": "email", "action": "extract_tasks"}},
            {"id": "3", "type": "agent", "position": {"x": 550, "y": 100}, "data": {"label": "Jira Agent", "agent": "jira", "action": "create_issue"}},
            {"id": "4", "type": "agent", "position": {"x": 550, "y": 300}, "data": {"label": "Notion Agent", "agent": "notion", "action": "update_database"}},
            {"id": "5", "type": "agent", "position": {"x": 800, "y": 200}, "data": {"label": "Slack Agent", "agent": "slack", "action": "send_message"}},
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
            {"id": "e2-3", "source": "2", "target": "3"},
            {"id": "e2-4", "source": "2", "target": "4"},
            {"id": "e3-5", "source": "3", "target": "5"},
            {"id": "e4-5", "source": "4", "target": "5"},
        ],
    }


@router.post("/")
async def create_workflow(name: str, nodes: list = [], edges: list = []):
    return {"id": "wf_new", "name": name, "status": "created"}


@router.put("/{workflow_id}")
async def update_workflow(workflow_id: str):
    return {"id": workflow_id, "status": "updated"}


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str):
    return {"message": "Workflow deleted", "id": workflow_id}


@router.post("/{workflow_id}/execute")
async def execute_workflow(workflow_id: str):
    return {"id": workflow_id, "execution_id": "exec_wf_001", "status": "running"}
