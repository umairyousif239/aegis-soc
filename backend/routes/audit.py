from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.database import get_audit_logs, get_stats
import os
import json
import httpx

router = APIRouter()

@router.get("/logs")
async def audit_logs(limit: int = 100):
    logs = await get_audit_logs(limit)
    return {"logs": logs}

@router.get("/stats")
async def audit_stats():
    stats = await get_stats()
    return stats

class QueryRequest(BaseModel):
    question: str

@router.post("/query")
async def query_logs(request: QueryRequest):
    logs = await get_audit_logs(100)

    log_summary = []
    for log in logs:
        log_summary.append({
            "time": log["timestamp"],
            "agent": log["agent_id"],
            "user": log["user_id"],
            "verdict": log["action"],
            "blocked": bool(log["blocked"]),
            "risk_score": log["risk_score"],
            "intent": log["intent"],
            "message": log["message"][:120],
        })

    prompt = f"""You are a security analyst for Pantheon, an AI Agent Security Operations Center.
You have access to the following audit log data from enterprise AI agents:

{json.dumps(log_summary, indent=2)}

Answer this question about the logs concisely and clearly:
{request.question}

Be specific — reference agent names, counts, risk scores, and timestamps where relevant.
If the logs are empty, say so. Keep your answer under 200 words."""

    api_key = os.getenv("GEMINI_API_KEY")

    payload = {
        "model": "gemini-2.5-flash",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000
    }

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            json=payload,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Accept-Encoding": "identity",
            }
        )
        data = res.json()
        answer = data["choices"][0]["message"]["content"]

    return {"answer": answer}