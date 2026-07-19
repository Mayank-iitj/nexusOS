"""NexusOS — Memory Routes"""
from fastapi import APIRouter
router = APIRouter(prefix="/memory")

@router.get("/")
async def list_memories(memory_type: str = None):
    memories = [
        {"id": "mem_001", "type": "preference", "content": "User prefers dark mode and professional writing tone", "importance": 0.9, "category": "ui"},
        {"id": "mem_002", "type": "semantic", "content": "Acme Corp is our largest enterprise client, main contact is John Smith (CTO)", "importance": 0.95, "category": "clients"},
        {"id": "mem_003", "type": "procedural", "content": "Sprint planning always happens Monday 10 AM, retrospective Friday 4 PM", "importance": 0.8, "category": "process"},
        {"id": "mem_004", "type": "project", "content": "NexusOS v2.0 uses LangGraph for agent orchestration, target launch July 25", "importance": 0.85, "category": "project"},
        {"id": "mem_005", "type": "conversation", "content": "Last discussed migration strategy with Mike on July 17, decided on event-driven approach", "importance": 0.7, "category": "discussion"},
    ]
    if memory_type:
        memories = [m for m in memories if m["type"] == memory_type]
    return {"memories": memories, "total": len(memories)}

@router.post("/search")
async def semantic_search(query: str, limit: int = 5):
    return {"query": query, "results": [], "total": 0}

@router.post("/")
async def store_memory(content: str, memory_type: str = "semantic"):
    return {"id": "mem_new", "status": "stored"}

@router.delete("/{memory_id}")
async def delete_memory(memory_id: str):
    return {"message": "Memory deleted", "id": memory_id}
