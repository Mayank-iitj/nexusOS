"""
NexusOS — Authentication Routes
OAuth login, callback, session management.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth")


class LoginRequest(BaseModel):
    provider: str  # google, github
    redirect_url: str = "/"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    user: dict


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: str | None = None
    role: str = "user"


@router.post("/login")
async def login(request: LoginRequest):
    """Initiate OAuth login flow."""
    return {
        "auth_url": f"https://accounts.google.com/o/oauth2/v2/auth?provider={request.provider}",
        "state": "oauth-state-token",
    }


@router.post("/callback")
async def oauth_callback(code: str, state: str):
    """Handle OAuth callback and create session."""
    # In production: exchange code for tokens, create/find user
    return TokenResponse(
        access_token="nexus-demo-token",
        user={
            "id": "usr_demo_001",
            "email": "demo@nexus-os.ai",
            "name": "Alex Chen",
            "avatar_url": None,
            "role": "admin",
        },
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get current authenticated user."""
    return UserResponse(
        id="usr_demo_001",
        email="demo@nexus-os.ai",
        name="Alex Chen",
        role="admin",
    )


@router.post("/logout")
async def logout():
    """Logout and invalidate session."""
    return {"message": "Successfully logged out"}
