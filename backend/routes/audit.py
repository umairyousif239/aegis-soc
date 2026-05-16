from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.services.database import get_audit_logs, get_stats
from datetime import datetime, UTC
import os
import json
import httpx
import csv
import io

router = APIRouter()

@router.get("/logs")
async def audit_logs(limit: int = 100):
    logs = get_audit_logs(limit)
    return {"logs": logs}

@router.get("/stats")
async def audit_stats():
    stats = get_stats()
    return stats

class QueryRequest(BaseModel):
    question: str

@router.post("/query")
async def query_logs(request: QueryRequest):
    logs = get_audit_logs(100)

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

@router.get("/report/csv")
async def export_csv():
    logs = get_audit_logs(1000)

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["PANTHEON — AI AGENT SECURITY OPERATIONS CENTER", "", "", "", "", "", ""])
    writer.writerow([f"Report Generated: {datetime.now(UTC).strftime('%Y-%m-%d %H:%M:%S UTC')}", "", "", "", "", "", ""])
    writer.writerow(["Total Interactions", len(logs), "", "", "", "", ""])
    writer.writerow(["Total Blocked", sum(1 for l in logs if l["blocked"]), "", "", "", "", ""])
    avg_risk = sum(l["risk_score"] for l in logs) / len(logs) if logs else 0
    writer.writerow(["Average Risk Score", f"{avg_risk:.3f}", "", "", "", "", ""])
    writer.writerow(["", "", "", "", "", "", ""])
    writer.writerow(["TIMESTAMP", "AGENT", "USER", "VERDICT", "RISK SCORE", "INTENT", "MESSAGE"])

    for log in logs:
        writer.writerow([
            log["timestamp"],
            log["agent_id"].upper(),
            log["user_id"],
            "BLOCKED" if log["blocked"] else "ALLOWED",
            f"{log['risk_score']:.3f}",
            log["intent"].upper(),
            log["message"][:200]
        ])

    output.seek(0)
    filename = f"pantheon-audit-{datetime.now(UTC).strftime('%Y%m%d-%H%M%S')}.csv"

    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )