"""
NexusOS — SQLAlchemy Base Model & Database Tables
Complete schema for 20+ tables covering all NexusOS entities.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
    Enum as SAEnum,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base model with common fields."""
    pass


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


# ═══════════════════════════════════════════════════════
# 1. Users
# ═══════════════════════════════════════════════════════
class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(2048))
    role: Mapped[str] = mapped_column(String(50), default="user")  # user, admin, owner
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    oauth_provider: Mapped[Optional[str]] = mapped_column(String(50))
    oauth_id: Mapped[Optional[str]] = mapped_column(String(255))
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    preferences = relationship("Preference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


# ═══════════════════════════════════════════════════════
# 2. Projects
# ═══════════════════════════════════════════════════════
class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="active")  # active, archived, completed
    color: Mapped[str] = mapped_column(String(7), default="#6366f1")
    icon: Mapped[Optional[str]] = mapped_column(String(50))
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB)

    # Relationships
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="project", cascade="all, delete-orphan")


# ═══════════════════════════════════════════════════════
# 3. Tasks
# ═══════════════════════════════════════════════════════
class Task(TimestampMixin, Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"))
    assignee_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="todo")  # todo, in_progress, review, done
    priority: Mapped[str] = mapped_column(String(20), default="medium")  # low, medium, high, urgent
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    labels: Mapped[Optional[list]] = mapped_column(JSONB)
    position: Mapped[int] = mapped_column(Integer, default=0)
    source: Mapped[Optional[str]] = mapped_column(String(50))  # manual, ai, email, github, jira
    external_id: Mapped[Optional[str]] = mapped_column(String(255))

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks", foreign_keys=[assignee_id])

    __table_args__ = (
        Index("idx_tasks_status", "status"),
        Index("idx_tasks_assignee", "assignee_id"),
    )


# ═══════════════════════════════════════════════════════
# 4. Meetings
# ═══════════════════════════════════════════════════════
class Meeting(TimestampMixin, Base):
    __tablename__ = "meetings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(500))
    meeting_url: Mapped[Optional[str]] = mapped_column(String(2048))
    attendees: Mapped[Optional[list]] = mapped_column(JSONB)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text)
    ai_action_items: Mapped[Optional[list]] = mapped_column(JSONB)
    ai_notes: Mapped[Optional[str]] = mapped_column(Text)
    recording_url: Mapped[Optional[str]] = mapped_column(String(2048))
    calendar_event_id: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50), default="scheduled")  # scheduled, in_progress, completed, cancelled


# ═══════════════════════════════════════════════════════
# 5. Messages (AI Workspace Conversations)
# ═══════════════════════════════════════════════════════
class Message(TimestampMixin, Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # user, assistant, system, tool
    content: Mapped[str] = mapped_column(Text, nullable=False)
    agent_name: Mapped[Optional[str]] = mapped_column(String(100))
    tool_calls: Mapped[Optional[list]] = mapped_column(JSONB)
    tool_results: Mapped[Optional[list]] = mapped_column(JSONB)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer)


# ═══════════════════════════════════════════════════════
# 6. Documents
# ═══════════════════════════════════════════════════════
class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text)
    doc_type: Mapped[str] = mapped_column(String(50), default="note")  # note, pdf, doc, sheet, presentation
    file_url: Mapped[Optional[str]] = mapped_column(String(2048))
    file_size: Mapped[Optional[int]] = mapped_column(Integer)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100))
    tags: Mapped[Optional[list]] = mapped_column(JSONB)
    folder: Mapped[Optional[str]] = mapped_column(String(500))
    source: Mapped[Optional[str]] = mapped_column(String(50))  # upload, drive, notion, ai
    external_id: Mapped[Optional[str]] = mapped_column(String(255))
    ai_summary: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    project = relationship("Project", back_populates="documents")


# ═══════════════════════════════════════════════════════
# 7. Workflows
# ═══════════════════════════════════════════════════════
class Workflow(TimestampMixin, Base):
    __tablename__ = "workflows"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    nodes: Mapped[Optional[list]] = mapped_column(JSONB)  # React Flow nodes
    edges: Mapped[Optional[list]] = mapped_column(JSONB)  # React Flow edges
    trigger_type: Mapped[Optional[str]] = mapped_column(String(50))  # manual, schedule, webhook, event
    trigger_config: Mapped[Optional[dict]] = mapped_column(JSONB)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    last_run_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    run_count: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    project = relationship("Project", back_populates="workflows")
    execution_logs = relationship("ExecutionLog", back_populates="workflow", cascade="all, delete-orphan")


# ═══════════════════════════════════════════════════════
# 8. Agents
# ═══════════════════════════════════════════════════════
class Agent(TimestampMixin, Base):
    __tablename__ = "agents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    agent_type: Mapped[str] = mapped_column(String(50), nullable=False)  # executive, planner, email, etc.
    icon: Mapped[Optional[str]] = mapped_column(String(50))
    color: Mapped[Optional[str]] = mapped_column(String(7))
    capabilities: Mapped[Optional[list]] = mapped_column(JSONB)
    system_prompt: Mapped[Optional[str]] = mapped_column(Text)
    tools: Mapped[Optional[list]] = mapped_column(JSONB)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    model_provider: Mapped[str] = mapped_column(String(50), default="gemini")
    model_name: Mapped[str] = mapped_column(String(100), default="gemini-2.0-flash")
    temperature: Mapped[float] = mapped_column(Float, default=0.7)
    max_tokens: Mapped[int] = mapped_column(Integer, default=4096)
    total_executions: Mapped[int] = mapped_column(Integer, default=0)


# ═══════════════════════════════════════════════════════
# 9. Execution Logs
# ═══════════════════════════════════════════════════════
class ExecutionLog(TimestampMixin, Base):
    __tablename__ = "execution_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("workflows.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    goal: Mapped[str] = mapped_column(Text, nullable=False)
    plan: Mapped[Optional[dict]] = mapped_column(JSONB)
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, running, completed, failed
    agents_used: Mapped[Optional[list]] = mapped_column(JSONB)
    steps: Mapped[Optional[list]] = mapped_column(JSONB)
    result: Mapped[Optional[dict]] = mapped_column(JSONB)
    error: Mapped[Optional[str]] = mapped_column(Text)
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer)
    tokens_total: Mapped[Optional[int]] = mapped_column(Integer)
    confidence_score: Mapped[Optional[float]] = mapped_column(Float)

    # Relationships
    workflow = relationship("Workflow", back_populates="execution_logs")

    __table_args__ = (
        Index("idx_execution_logs_status", "status"),
        Index("idx_execution_logs_user", "user_id"),
    )


# ═══════════════════════════════════════════════════════
# 10. Notifications
# ═══════════════════════════════════════════════════════
class Notification(TimestampMixin, Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="info")  # info, warning, success, error
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    action_url: Mapped[Optional[str]] = mapped_column(String(2048))
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB)

    # Relationships
    user = relationship("User", back_populates="notifications")


# ═══════════════════════════════════════════════════════
# 11. Calendar Events
# ═══════════════════════════════════════════════════════
class CalendarEvent(TimestampMixin, Base):
    __tablename__ = "calendar_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    all_day: Mapped[bool] = mapped_column(Boolean, default=False)
    location: Mapped[Optional[str]] = mapped_column(String(500))
    attendees: Mapped[Optional[list]] = mapped_column(JSONB)
    recurrence: Mapped[Optional[str]] = mapped_column(String(255))
    external_id: Mapped[Optional[str]] = mapped_column(String(255))
    calendar_source: Mapped[str] = mapped_column(String(50), default="google")
    color: Mapped[Optional[str]] = mapped_column(String(7))


# ═══════════════════════════════════════════════════════
# 12. Emails
# ═══════════════════════════════════════════════════════
class Email(TimestampMixin, Base):
    __tablename__ = "emails"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    thread_id: Mapped[Optional[str]] = mapped_column(String(255), index=True)
    subject: Mapped[str] = mapped_column(String(1000), nullable=False)
    sender: Mapped[str] = mapped_column(String(320), nullable=False)
    recipients: Mapped[Optional[list]] = mapped_column(JSONB)
    body_text: Mapped[Optional[str]] = mapped_column(Text)
    body_html: Mapped[Optional[str]] = mapped_column(Text)
    snippet: Mapped[Optional[str]] = mapped_column(String(500))
    labels: Mapped[Optional[list]] = mapped_column(JSONB)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    has_attachments: Mapped[bool] = mapped_column(Boolean, default=False)
    received_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text)
    ai_action_items: Mapped[Optional[list]] = mapped_column(JSONB)


# ═══════════════════════════════════════════════════════
# 13. GitHub Repositories
# ═══════════════════════════════════════════════════════
class GitHubRepository(TimestampMixin, Base):
    __tablename__ = "github_repositories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    repo_name: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    language: Mapped[Optional[str]] = mapped_column(String(50))
    stars: Mapped[int] = mapped_column(Integer, default=0)
    open_issues: Mapped[int] = mapped_column(Integer, default=0)
    last_synced: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    issues = relationship("GitHubIssue", back_populates="repository", cascade="all, delete-orphan")


# ═══════════════════════════════════════════════════════
# 14. GitHub Issues
# ═══════════════════════════════════════════════════════
class GitHubIssue(TimestampMixin, Base):
    __tablename__ = "github_issues"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("github_repositories.id"), nullable=False)
    issue_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    body: Mapped[Optional[str]] = mapped_column(Text)
    state: Mapped[str] = mapped_column(String(20), default="open")  # open, closed
    labels: Mapped[Optional[list]] = mapped_column(JSONB)
    assignees: Mapped[Optional[list]] = mapped_column(JSONB)
    milestone: Mapped[Optional[str]] = mapped_column(String(255))
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    is_pull_request: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    repository = relationship("GitHubRepository", back_populates="issues")


# ═══════════════════════════════════════════════════════
# 15. Slack Channels
# ═══════════════════════════════════════════════════════
class SlackChannel(TimestampMixin, Base):
    __tablename__ = "slack_channels"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    channel_id: Mapped[str] = mapped_column(String(50), nullable=False)
    channel_name: Mapped[str] = mapped_column(String(255), nullable=False)
    channel_type: Mapped[str] = mapped_column(String(20), default="public")  # public, private, dm
    member_count: Mapped[Optional[int]] = mapped_column(Integer)
    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    unread_count: Mapped[int] = mapped_column(Integer, default=0)


# ═══════════════════════════════════════════════════════
# 16. Notion Pages
# ═══════════════════════════════════════════════════════
class NotionPage(TimestampMixin, Base):
    __tablename__ = "notion_pages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    page_id: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text)
    parent_id: Mapped[Optional[str]] = mapped_column(String(255))
    page_type: Mapped[str] = mapped_column(String(50), default="page")  # page, database, block
    icon: Mapped[Optional[str]] = mapped_column(String(50))
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    last_synced: Mapped[Optional[datetime]] = mapped_column(DateTime)


# ═══════════════════════════════════════════════════════
# 17. Preferences
# ═══════════════════════════════════════════════════════
class Preference(TimestampMixin, Base):
    __tablename__ = "preferences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    language: Mapped[str] = mapped_column(String(10), default="en")
    notification_email: Mapped[bool] = mapped_column(Boolean, default=True)
    notification_push: Mapped[bool] = mapped_column(Boolean, default=True)
    notification_slack: Mapped[bool] = mapped_column(Boolean, default=False)
    ai_auto_execute: Mapped[bool] = mapped_column(Boolean, default=False)
    ai_confirmation_level: Mapped[str] = mapped_column(String(20), default="destructive")  # all, destructive, none
    writing_style: Mapped[Optional[str]] = mapped_column(String(50))  # professional, casual, formal
    daily_briefing: Mapped[bool] = mapped_column(Boolean, default=True)
    weekly_review: Mapped[bool] = mapped_column(Boolean, default=True)
    keyboard_shortcuts: Mapped[bool] = mapped_column(Boolean, default=True)
    integrations: Mapped[Optional[dict]] = mapped_column(JSONB)

    # Relationships
    user = relationship("User", back_populates="preferences")


# ═══════════════════════════════════════════════════════
# 18. Memory (Long-term AI Memory)
# ═══════════════════════════════════════════════════════
class Memory(TimestampMixin, Base):
    __tablename__ = "memories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    memory_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # Types: semantic, procedural, conversation, project, preference
    category: Mapped[Optional[str]] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    importance: Mapped[float] = mapped_column(Float, default=0.5)
    access_count: Mapped[int] = mapped_column(Integer, default=0)
    last_accessed: Mapped[Optional[datetime]] = mapped_column(DateTime)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB)

    # Relationships
    user = relationship("User", back_populates="memories")

    __table_args__ = (
        Index("idx_memories_type", "memory_type"),
        Index("idx_memories_user_type", "user_id", "memory_type"),
    )


# ═══════════════════════════════════════════════════════
# 19. Embeddings (Vector Storage)
# ═══════════════════════════════════════════════════════
class Embedding(TimestampMixin, Base):
    __tablename__ = "embeddings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)  # document, email, message, memory
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    content_chunk: Mapped[str] = mapped_column(Text, nullable=False)
    embedding_vector: Mapped[Optional[list]] = mapped_column(JSONB)  # Use pgvector in production
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    dimensions: Mapped[int] = mapped_column(Integer, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB)

    __table_args__ = (
        Index("idx_embeddings_source", "source_type", "source_id"),
    )


# ═══════════════════════════════════════════════════════
# 20. Jira Issues (Cached)
# ═══════════════════════════════════════════════════════
class JiraIssue(TimestampMixin, Base):
    __tablename__ = "jira_issues"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    issue_key: Mapped[str] = mapped_column(String(50), nullable=False)
    summary: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50))
    priority: Mapped[Optional[str]] = mapped_column(String(50))
    assignee: Mapped[Optional[str]] = mapped_column(String(255))
    reporter: Mapped[Optional[str]] = mapped_column(String(255))
    sprint: Mapped[Optional[str]] = mapped_column(String(255))
    story_points: Mapped[Optional[float]] = mapped_column(Float)
    labels: Mapped[Optional[list]] = mapped_column(JSONB)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    last_synced: Mapped[Optional[datetime]] = mapped_column(DateTime)


# ═══════════════════════════════════════════════════════
# 21. Audit Logs (Security)
# ═══════════════════════════════════════════════════════
class AuditLog(TimestampMixin, Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(String(255))
    details: Mapped[Optional[dict]] = mapped_column(JSONB)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(String(500))

    __table_args__ = (
        Index("idx_audit_logs_user", "user_id"),
        Index("idx_audit_logs_action", "action"),
    )
