from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from backend.routes.agents import router as agents_router
from backend.routes.audit import router as audit_router
from backend.routes.redteam import router as redteam_router
from backend.services.database import init_db

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="AEGIS - AI Agent Governance & Intelligence System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/agents")
app.include_router(audit_router, prefix="/audit")
app.include_router(redteam_router, prefix="/redteam")

@app.get("/")
def root():
    return {"status": "AEGIS backend online"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "lobstertrap": os.getenv("LOBSTERTRAP_URL"),
        "gemini": "configured" if os.getenv("GEMINI_API_KEY") else "missing"
    }