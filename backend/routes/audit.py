from fastapi import APIRouter
from backend.services.database import get_audit_logs, get_stats

router = APIRouter()

@router.get("/logs")
async def audit_logs(limit: int = 100):
    logs = await get_audit_logs(limit)
    return {"logs": logs}

@router.get("/stats")
async def audit_stats():
    stats = await get_stats()
    return stats