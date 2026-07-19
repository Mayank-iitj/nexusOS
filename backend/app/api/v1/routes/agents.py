"""
NexusOS — AI Agents Routes
Agent management, status monitoring, and configuration.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/agents")


DEMO_AGENTS = [
    {
        "id": "agent_executive", "name": "executive", "display_name": "Executive Agent",
        "description": "Understands goals, builds execution plans, delegates work, merges outputs",
        "icon": "Crown", "color": "#8b5cf6", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["goal_understanding", "plan_building", "delegation", "output_merging"],
        "total_executions": 1247, "success_rate": 0.96,
    },
    {
        "id": "agent_planner", "name": "planner", "display_name": "Planner Agent",
        "description": "Creates roadmaps, timelines, dependencies, and subtask breakdowns",
        "icon": "Map", "color": "#06b6d4", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["roadmap_creation", "timeline_planning", "dependency_mapping", "subtask_generation"],
        "total_executions": 892, "success_rate": 0.94,
    },
    {
        "id": "agent_email", "name": "email", "display_name": "Email Agent",
        "description": "Read Gmail, search conversations, draft replies, send emails, extract tasks",
        "icon": "Mail", "color": "#ef4444", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_emails", "search_conversations", "draft_replies", "send_emails", "extract_tasks"],
        "total_executions": 2156, "success_rate": 0.98,
    },
    {
        "id": "agent_calendar", "name": "calendar", "display_name": "Calendar Agent",
        "description": "Read schedule, detect conflicts, suggest times, create events, invite attendees",
        "icon": "Calendar", "color": "#3b82f6", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_schedule", "detect_conflicts", "suggest_times", "create_events", "invite_attendees"],
        "total_executions": 1543, "success_rate": 0.97,
    },
    {
        "id": "agent_drive", "name": "drive", "display_name": "Drive Agent",
        "description": "Search files, summarize PDFs, read Docs/Sheets, organize folders",
        "icon": "HardDrive", "color": "#f59e0b", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["search_files", "summarize_pdfs", "read_docs", "read_sheets", "organize_folders"],
        "total_executions": 987, "success_rate": 0.93,
    },
    {
        "id": "agent_github", "name": "github", "display_name": "GitHub Agent",
        "description": "Read repos, issues, PRs, generate summaries, track milestones",
        "icon": "Github", "color": "#6366f1", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_repos", "read_issues", "read_prs", "generate_summaries", "track_milestones"],
        "total_executions": 1321, "success_rate": 0.95,
    },
    {
        "id": "agent_meeting", "name": "meeting", "display_name": "Meeting Agent",
        "description": "Create agendas, generate notes, produce action items, send follow-up emails",
        "icon": "Video", "color": "#10b981", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["create_agendas", "generate_notes", "produce_action_items", "followup_emails"],
        "total_executions": 756, "success_rate": 0.94,
    },
    {
        "id": "agent_slack", "name": "slack", "display_name": "Slack Agent",
        "description": "Read channels, summarize discussions, draft announcements, send messages",
        "icon": "MessageSquare", "color": "#e11d48", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_channels", "summarize_discussions", "draft_announcements", "send_messages"],
        "total_executions": 1098, "success_rate": 0.96,
    },
    {
        "id": "agent_jira", "name": "jira", "display_name": "Jira Agent",
        "description": "Read boards, update tickets, create issues, generate sprint reports",
        "icon": "SquareKanban", "color": "#0ea5e9", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_boards", "update_tickets", "create_issues", "sprint_reports"],
        "total_executions": 634, "success_rate": 0.92,
    },
    {
        "id": "agent_notion", "name": "notion", "display_name": "Notion Agent",
        "description": "Read pages, create docs, update databases, knowledge articles",
        "icon": "BookOpen", "color": "#78716c", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["read_pages", "create_documentation", "update_databases", "knowledge_articles"],
        "total_executions": 543, "success_rate": 0.91,
    },
    {
        "id": "agent_presentation", "name": "presentation", "display_name": "Presentation Agent",
        "description": "Generate PowerPoint/Slides, executive summaries, charts, speaker notes",
        "icon": "Presentation", "color": "#f97316", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["generate_slides", "executive_summaries", "create_charts", "speaker_notes"],
        "total_executions": 321, "success_rate": 0.89,
    },
    {
        "id": "agent_workflow", "name": "workflow", "display_name": "Workflow Agent",
        "description": "Execute cross-application workflows, chain agent actions",
        "icon": "Workflow", "color": "#a855f7", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["cross_app_workflows", "chain_actions", "conditional_logic", "parallel_execution"],
        "total_executions": 456, "success_rate": 0.93,
    },
    {
        "id": "agent_memory", "name": "memory", "display_name": "Memory Agent",
        "description": "Store preferences, writing style, meeting history, project context",
        "icon": "Brain", "color": "#ec4899", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["store_preferences", "recall_context", "learning", "pattern_recognition"],
        "total_executions": 3421, "success_rate": 0.99,
    },
    {
        "id": "agent_analytics", "name": "analytics", "display_name": "Analytics Agent",
        "description": "Track productivity, task completion, response times, workload analysis",
        "icon": "BarChart3", "color": "#14b8a6", "status": "active", "model": "gemini-2.0-flash",
        "capabilities": ["productivity_tracking", "task_analysis", "workload_monitoring", "trend_detection"],
        "total_executions": 892, "success_rate": 0.97,
    },
]


@router.get("/")
async def list_agents():
    """List all available AI agents."""
    return {"agents": DEMO_AGENTS, "total": len(DEMO_AGENTS)}


@router.get("/{agent_name}")
async def get_agent(agent_name: str):
    """Get details for a specific agent."""
    agent = next((a for a in DEMO_AGENTS if a["name"] == agent_name), None)
    if not agent:
        return {"error": "Agent not found"}
    return agent


@router.get("/{agent_name}/executions")
async def get_agent_executions(agent_name: str, limit: int = 10):
    """Get recent execution history for an agent."""
    return {
        "agent": agent_name,
        "executions": [
            {"id": "exec_001", "goal": "Read client emails", "status": "completed", "duration_ms": 2300},
            {"id": "exec_002", "goal": "Draft meeting agenda", "status": "completed", "duration_ms": 4100},
        ],
    }
