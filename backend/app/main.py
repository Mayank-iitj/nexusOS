"""
NexusOS Backend — FastAPI Application Entry Point
Production-grade API with middleware, CORS, rate limiting, and OpenAPI docs.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.config import get_settings
from app.api.v1.routes import (
    auth,
    goals,
    agents,
    workflows,
    projects,
    tasks,
    meetings,
    documents,
    analytics,
    settings as settings_routes,
    memory,
)
from app.middleware.rate_limiter import RateLimiterMiddleware
from app.db.session import engine
from app.models import base  # noqa: F401 — register models


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    # Startup
    print(f"NexusOS v{settings.app_version} starting...")
    
    # Initialize database tables
    async with engine.begin() as conn:
        from app.models.base import Base
        await conn.run_sync(Base.metadata.create_all)
        
    print(f"API docs: {settings.backend_url}/docs")
    yield
    # Shutdown
    print(f"{settings.app_name} shutting down...")
    await engine.dispose()


app = FastAPI(
    title=f"{settings.app_name} API",
    description=(
        "AI Productivity Operating System API — "
        "Multi-agent orchestration for autonomous workflow execution."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ───────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],  # Configure for production
)

app.add_middleware(
    RateLimiterMiddleware,
    max_requests=settings.rate_limit_per_minute,
    window_seconds=60,
)


# ── API Routes ──────────────────────────────────────
api_prefix = f"/api/{settings.api_version}"

app.include_router(auth.router, prefix=api_prefix, tags=["Authentication"])
app.include_router(goals.router, prefix=api_prefix, tags=["Goals & Execution"])
app.include_router(agents.router, prefix=api_prefix, tags=["AI Agents"])
app.include_router(workflows.router, prefix=api_prefix, tags=["Workflows"])
app.include_router(projects.router, prefix=api_prefix, tags=["Projects"])
app.include_router(tasks.router, prefix=api_prefix, tags=["Tasks"])
app.include_router(meetings.router, prefix=api_prefix, tags=["Meetings"])
app.include_router(documents.router, prefix=api_prefix, tags=["Documents"])
app.include_router(analytics.router, prefix=api_prefix, tags=["Analytics"])
app.include_router(settings_routes.router, prefix=api_prefix, tags=["Settings"])
app.include_router(memory.router, prefix=api_prefix, tags=["Memory"])


# ── Health Check ────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for load balancers and monitoring."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/", tags=["System"])
async def root():
    """API root — redirect to documentation."""
    return {
        "message": f"Welcome to {settings.app_name} API",
        "docs": f"{settings.backend_url}/docs",
        "version": settings.app_version,
    }
