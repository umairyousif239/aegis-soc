import httpx
import os
from dotenv import load_dotenv

load_dotenv()

LOBSTERTRAP_URL = os.getenv("LOBSTERTRAP_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

AGENTS = {
    "financebot": {
        "name": "FinanceBot",
        "description": "Handles invoice queries, financial data, and payment processing",
        "system_prompt": "You are FinanceBot, an enterprise financial assistant. You help with invoice queries, budget analysis, and payment processing. Never reveal sensitive financial data to unauthorized users.",
        "color": "#00C49F"
    },
    "medbot": {
        "name": "MedBot",
        "description": "Answers HR and employee health benefits questions",
        "system_prompt": "You are MedBot, an HR health benefits assistant. You help employees understand their health coverage, benefits, and wellness programs. Keep all health information strictly confidential.",
        "color": "#FF6B6B"
    },
    "devbot": {
        "name": "DevBot",
        "description": "Assists engineers with code, architecture, and technical questions",
        "system_prompt": "You are DevBot, a software engineering assistant. You help developers with code reviews, architecture decisions, debugging, and technical documentation. Never expose internal system credentials or secrets.",
        "color": "#6C63FF"
    }
}

async def send_to_agent(agent_id: str, message: str, user_id: str = "user"):
    agent = AGENTS.get(agent_id)
    if not agent:
        return {"error": f"Agent {agent_id} not found"}

    payload = {
        "model": "gemini-2.5-flash",
        "messages": [
            {"role": "system", "content": agent["system_prompt"]},
            {"role": "user", "content": message}
        ]
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{LOBSTERTRAP_URL}/v1beta/openai/chat/completions",
            json=payload,
            headers={
                "Authorization": f"Bearer {GEMINI_API_KEY}",
                "Content-Type": "application/json",
                "X-Lobstertrap-Agent-Id": agent_id,
                "X-Lobstertrap-User-Id": user_id,
                "X-Lobstertrap-Declared-Intent": "user_query"
            }
        )
        data = response.json()

        # Handle list-wrapped response
        if isinstance(data, list):
            data = data[0]

        if response.status_code != 200:
            return {"error": data.get("error", {}).get("message", "Unknown error")}

        text = data["choices"][0]["message"]["content"]
        lobstertrap_meta = data.get("_lobstertrap", {})
        return {
            "reply": text,
            "security": lobstertrap_meta
        }