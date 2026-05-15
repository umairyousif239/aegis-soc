from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.agents import AGENTS, send_to_agent
from backend.services.database import log_interaction

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_id: str = "user"

@router.get("/")
def get_agents():
    return {"agents": AGENTS}

@router.post("/api/v1/{agent_id}/chat")
async def chat_with_agent(agent_id: str, request: ChatRequest):
    result = await send_to_agent(agent_id, request.message, request.user_id)
    await log_interaction(
        agent_id=agent_id,
        user_id=request.user_id,
        message=request.message,
        reply=result.get("reply", ""),
        security_meta=result.get("security", {})
    )
    return {"agent_id": agent_id, "response": result}