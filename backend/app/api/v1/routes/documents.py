"""NexusOS — Documents Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/documents")

@router.get("/")
async def list_documents():
    return {"documents": [
        {"id": "doc_001", "title": "Product Roadmap Q3 2026", "doc_type": "doc", "folder": "Strategy", "tags": ["roadmap", "planning"], "updated_at": "2026-07-18T10:00:00Z", "ai_summary": "Q3 roadmap covering AI agent expansion, enterprise features, and scaling infrastructure"},
        {"id": "doc_002", "title": "API Design Specification", "doc_type": "doc", "folder": "Engineering", "tags": ["api", "technical"], "updated_at": "2026-07-17T14:30:00Z", "ai_summary": "OpenAPI spec for v1 endpoints including goals, agents, workflows, and memory APIs"},
        {"id": "doc_003", "title": "Client Proposal - Acme Corp", "doc_type": "pdf", "folder": "Sales", "tags": ["proposal", "client"], "updated_at": "2026-07-16T09:00:00Z", "ai_summary": "Enterprise deployment proposal with pricing tiers and implementation timeline"},
        {"id": "doc_004", "title": "Sprint Retrospective Notes", "doc_type": "note", "folder": "Engineering", "tags": ["sprint", "retro"], "updated_at": "2026-07-15T16:00:00Z", "ai_summary": "Sprint 23 retro: improved CI/CD pipeline velocity by 40%, need to reduce PR review time"},
        {"id": "doc_005", "title": "Revenue Projections 2026", "doc_type": "sheet", "folder": "Finance", "tags": ["finance", "projections"], "updated_at": "2026-07-14T11:00:00Z", "ai_summary": "Financial model showing projected ARR of $2.4M by Q4 with 15% MoM growth"},
    ], "total": 5}

@router.get("/search")
async def search_documents(q: str):
    return {"query": q, "results": [], "total": 0}

@router.get("/{doc_id}")
async def get_document(doc_id: str):
    return {"id": doc_id, "title": "Document", "content": ""}

@router.post("/")
async def create_document(title: str, content: str = ""):
    return {"id": "doc_new", "title": title, "status": "created"}
