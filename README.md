# NexusOS 

> One Goal. One Prompt. Infinite Productivity.

NexusOS is an advanced AI Productivity Operating System designed to autonomously orchestrate complex workflows across your essential business applications. It acts as an autonomous executive assistant capable of delegating tasks across 14 specialized AI agents that interface with Gmail, Google Calendar, Google Drive, Slack, GitHub, Notion, Jira, and more. 

By simply stating a goal in natural language (e.g., "Prepare for tomorrow's client meeting"), NexusOS analyzes the intent, generates a multi-step execution plan, and executes it by coordinating its specialized agents.

## 🚀 Core Features

- **Multi-Agent Orchestration**: Powered by LangGraph, 14 specialized AI agents (Executive, Planner, Email, Calendar, Drive, GitHub, Slack, Jira, Notion, Presentation, Memory, Workflow, Analytics) collaborate seamlessly.
- **Deep Service Integrations**: First-class, bi-directional API support for major enterprise tools.
- **Visual Workflow Builder**: A React Flow-based automation builder for custom, repeatable AI workflows.
- **Goal-Driven Execution**: State your intent, and the Executive Agent autonomously handles the 'how' and 'who' of task execution.
- **Real-time Streaming**: Watch the AI agents plan, execute, and return results in real-time.
- **Glassmorphism UI**: Beautiful, premium, highly-accessible Next.js dashboard with dark-first design principles.
- **Enterprise Security**: Role-Based Access Control (RBAC), encrypted secrets, secure API headers, and human-in-the-loop action confirmations.
- **Deep Memory**: Persistent semantic, procedural, and conversational memory via vector embeddings.

## 🏗️ Architecture

NexusOS leverages a fully decoupled architecture designed for scalability, security, and real-time performance:

- **Frontend**: Next.js 15, React 19, TailwindCSS v4, Zustand (State Management), Framer Motion (Animations), Vitest (Testing), and Lucide React (Icons).
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0 (Async), PostgreSQL (with pgvector), Redis (Caching & Task Queues).
- **AI Engine**: LangGraph for agent orchestration, LangChain for model wrappers, and MCP (Model Context Protocol) for tool integration.

[Read the full Architecture Document](./docs/architecture.md)

## 🛠️ Quick Start & Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### 1. Environment Setup

Copy the example environment files and fill in your API keys (OpenAI, Anthropic, or Groq):
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 2. Local Development (Docker)
The easiest way to run the entire stack locally:
```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`

### 3. Production Deployment (Cloud Run / Render)
NexusOS is configured for immediate cloud deployment. 
- **Backend**: Deploy directly to Render.com using the included `render.yaml` Blueprint. The PostgreSQL database tables will automatically initialize on startup.
- **Frontend**: Deploy to Vercel or Google Cloud Run. Use the included `deploy.sh` script to automate building and pushing the Docker container to GCP.

## 🧪 Testing and Code Quality
NexusOS maintains rigorous code quality and accessibility standards.
- **Backend Testing**: Extensive Pytest coverage across the FastAPI application (`pytest backend/tests`).
- **Frontend Testing**: Vitest and React Testing Library ensure reliable UI component rendering.
- **Accessibility**: 100% WCAG compliance with semantic HTML, ARIA labels, and high-contrast visuals.
- **Security**: Strictly typed schemas, environment variable isolation, and HTTP security middleware (HSTS, X-Frame-Options, X-XSS-Protection).

## 📚 Documentation
- [Architecture Guide](./docs/architecture.md)
- [Agent Prompts & Design](./backend/app/prompts/templates.py)
- [Database Schema](./backend/app/models/base.py)

## 📄 License
MIT License
