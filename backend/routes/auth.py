from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.database import create_user, login_user, verify_token

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str

class TokenRequest(BaseModel):
    token: str

@router.post("/login")
def login(request: AuthRequest):
    token, error = login_user(request.email, request.password)
    if error:
        return {"success": False, "error": error}
    return {"success": True, "token": token}

@router.post("/signup")
def signup(request: AuthRequest):
    token, error = create_user(request.email, request.password)
    if error:
        return {"success": False, "error": error}
    return {"success": True, "token": token}

@router.post("/verify")
def verify(request: TokenRequest):
    user = verify_token(request.token)
    if not user:
        return {"valid": False}
    return {"valid": True, "email": user["email"]}