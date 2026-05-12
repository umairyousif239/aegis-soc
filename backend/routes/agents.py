from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.agents import AGENTS, send_to_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_id: str = "user"

@router.get("/")
def get_agents():
    return {"agents": AGENTS}

@router.post("/{agent_id}/chat")
async def chat_with_agent(agent_id: str, request: ChatRequest):
    result = await send_to_agent(agent_id, request.message, request.user_id)
    return {"agent_id": agent_id, "response": result}