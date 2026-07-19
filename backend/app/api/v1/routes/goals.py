"""
NexusOS — Goals & Execution Routes
Submit goals to the AI orchestration engine and monitor execution.
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/goals")


class GoalRequest(BaseModel):
    goal: str
    context: Optional[dict] = None
    auto_execute: bool = False
    priority: str = "normal"


class GoalPlan(BaseModel):
    id: str
    goal: str
    status: str
    plan: dict
    agents: list[str]
    estimated_duration: str
    confidence: float
    steps: list[dict]
    created_at: str


class ExecutionStatus(BaseModel):
    id: str
    status: str
    current_step: int
    total_steps: int
    current_agent: str
    progress: float
    results: list[dict]
    started_at: str


from app.agents.executive import ExecutiveAgent

@router.post("/submit", response_model=GoalPlan)
async def submit_goal(request: GoalRequest):
    """Submit a natural language goal for AI planning and execution."""
    agent = ExecutiveAgent()
    plan_result = await agent.process_goal(request.goal, request.context)
    return GoalPlan(**plan_result)


@router.get("/{goal_id}/status", response_model=ExecutionStatus)
async def get_execution_status(goal_id: str):
    """Get real-time execution status for a goal."""
    return ExecutionStatus(
        id=goal_id,
        status="executing",
        current_step=3,
        total_steps=7,
        current_agent="drive",
        progress=0.42,
        results=[
            {"step": 1, "agent": "email", "status": "completed", "summary": "Found 5 relevant emails from client"},
            {"step": 2, "agent": "calendar", "status": "completed", "summary": "Tomorrow 2-3 PM is available"},
            {"step": 3, "agent": "drive", "status": "running", "summary": "Searching project documents..."},
        ],
        started_at=datetime.utcnow().isoformat(),
    )


@router.post("/{goal_id}/approve")
async def approve_execution(goal_id: str):
    """Approve a pending execution plan."""
    return {"message": "Execution approved", "goal_id": goal_id, "status": "executing"}


@router.post("/{goal_id}/cancel")
async def cancel_execution(goal_id: str):
    """Cancel a running or pending execution."""
    return {"message": "Execution cancelled", "goal_id": goal_id, "status": "cancelled"}


@router.get("/history")
async def get_goal_history(limit: int = 20, offset: int = 0):
    """Get history of all submitted goals."""
    return {
        "goals": [
            {
                "id": "goal_001",
                "goal": "Prepare tomorrow's client meeting",
                "status": "completed",
                "agents_used": 7,
                "duration_ms": 45000,
                "confidence": 0.95,
                "created_at": "2026-07-19T09:00:00Z",
            },
            {
                "id": "goal_002",
                "goal": "Plan next week's sprint",
                "status": "completed",
                "agents_used": 5,
                "duration_ms": 32000,
                "confidence": 0.91,
                "created_at": "2026-07-18T14:30:00Z",
            },
        ],
        "total": 2,
        "limit": limit,
        "offset": offset,
    }
