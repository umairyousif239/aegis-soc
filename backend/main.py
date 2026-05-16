from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import asyncio
import os

from backend.routes.agents import router as agents_router
from backend.routes.audit import router as audit_router
from backend.routes.redteam import router as redteam_router
from backend.services.database import init_db
from backend.state import connected_clients

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Pantheon - AI Agent Governance & Intelligence System",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://pantheon-ff9u.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api/v1/agents")
app.include_router(audit_router, prefix="/api/v1/audit")
app.include_router(redteam_router, prefix="/api/v1/redteam")

@app.get("/")
def root():
    return {"status": "Pantheon backend is online"}

@app.get("/api/v1/status")
def health():
    return {
        "status": "ok",
        "gemini": "configured" if os.getenv("GEMINI_API_KEY") else "missing"
    }

@app.websocket("/api/v1/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except Exception:
        pass
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)