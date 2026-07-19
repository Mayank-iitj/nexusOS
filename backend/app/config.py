"""
NexusOS Backend — Configuration
Centralized settings management using Pydantic BaseSettings.
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────
    app_name: str = "NexusOS"
    app_version: str = "1.0.0"
    debug: bool = False
    api_version: str = "v1"
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"

    # ── Database ─────────────────────────────────
    database_url: str = "postgresql://nexus:nexus_password@localhost:5432/nexus_os"
    db_pool_size: int = 20
    db_max_overflow: int = 10

    # ── Redis ────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"

    # ── Authentication ───────────────────────────
    nextauth_secret: str = "dev-secret-change-in-production"
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    github_client_id: Optional[str] = None
    github_client_secret: Optional[str] = None

    # ── AI / LLM ─────────────────────────────────
    openai_api_key: Optional[str] = None
    google_gemini_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    default_llm_provider: str = "groq"
    default_llm_model: str = "llama-3.1-70b-versatile"

    # ── Embeddings ───────────────────────────────
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # ── Google Workspace ─────────────────────────
    google_workspace_credentials: Optional[str] = None
    gmail_scopes: str = "https://www.googleapis.com/auth/gmail.modify"
    calendar_scopes: str = "https://www.googleapis.com/auth/calendar"
    drive_scopes: str = "https://www.googleapis.com/auth/drive.readonly"

    # ── GitHub ───────────────────────────────────
    github_token: Optional[str] = None
    github_webhook_secret: Optional[str] = None

    # ── Slack ────────────────────────────────────
    slack_bot_token: Optional[str] = None
    slack_signing_secret: Optional[str] = None

    # ── Jira ─────────────────────────────────────
    jira_url: Optional[str] = None
    jira_email: Optional[str] = None
    jira_api_token: Optional[str] = None

    # ── Notion ───────────────────────────────────
    notion_api_key: Optional[str] = None

    # ── n8n ──────────────────────────────────────
    n8n_url: str = "http://localhost:5678"
    n8n_api_key: Optional[str] = None

    # ── Monitoring ───────────────────────────────
    sentry_dsn: Optional[str] = None
    otel_endpoint: Optional[str] = None

    # ── Security ─────────────────────────────────
    rate_limit_per_minute: int = 60
    encryption_key: Optional[str] = None
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
