# NexusOS 

> One Goal. One Prompt. Infinite Productivity.

NexusOS is an AI Productivity Operating System that autonomously orchestrates work across Gmail, Calendar, Drive, Slack, GitHub, Notion, Jira, and more. Describe your goal in natural language, and NexusOS plans, delegates, and executes across 14 specialized AI agents.

## 🚀 Features

- **Multi-Agent Orchestration**: 14 specialized AI agents collaborate to achieve complex goals.
- **Deep Integrations**: First-class support for Gmail, Calendar, Drive, GitHub, Slack, Jira, Notion, and more.
- **Workflow Builder**: Visual React Flow-based workflow automation builder.
- **Goal-Driven Execution**: State your intent, and the Executive Agent generates a plan and delegates tasks.
- **Real-time Streaming**: Watch the AI agents execute tasks in real-time.
- **Glassmorphism UI**: Beautiful, premium Next.js dashboard with a dark-first design.
- **Enterprise Security**: Role-based access control, encrypted secrets, and human-in-the-loop confirmations.

## 🏗️ Architecture

NexusOS uses a modern, decoupled architecture:
- **Frontend**: Next.js 15, React 19, TailwindCSS v4, Zustand, Framer Motion
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, PostgreSQL, Redis
- **AI Orchestration**: LangGraph, LangChain, Model Context Protocol (MCP)

[Read the full Architecture Document](./docs/architecture.md)

## 🛠️ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### Environment Setup

```bash
cp .env.example .env
```
Fill in your `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` in the `.env` file.

### Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```
- Frontend will be available at `http://localhost:3000`
- Backend API will be available at `http://localhost:8000`
- API Documentation at `http://localhost:8000/docs`

## 📚 Documentation

- [Architecture Guide](./docs/architecture.md)
- [Agent Prompts & Design](./backend/app/prompts/templates.py)
- [Database Schema](./backend/app/models/base.py)

## 📄 License
MIT License
# nexusOS
