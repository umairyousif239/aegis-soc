from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.routes.agents import router as agents_router
import os

load_dotenv()

app = FastAPI(title="AEGIS - AI Agent Governance & Intelligence System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/agents")

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