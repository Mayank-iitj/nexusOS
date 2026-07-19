# NexusOS Architecture

## System Overview
NexusOS is an AI-native Operating System. Instead of the user interacting with 15 different applications, the user describes a **Goal** to NexusOS. The OS plans, orchestrates, and delegates sub-tasks to specialized **AI Agents** that interact with external applications via the **Model Context Protocol (MCP)**.

## Core Components

### 1. Frontend (Next.js 15)
- **Framework**: Next.js App Router with React 19.
- **Styling**: TailwindCSS v4 with a custom glassmorphism design system.
- **State Management**: Zustand for local state, TanStack Query for server state.
- **Visualizations**: Recharts for analytics, React Flow for the visual Workflow Builder.
- **Animations**: Framer Motion for highly interactive, premium UI transitions.

### 2. Backend (FastAPI / Python 3.12)
- **Web Server**: FastAPI running on Uvicorn, optimized for async I/O.
- **Database**: PostgreSQL (via asyncpg) for persistent storage of users, goals, agents, projects, and memory.
- **Caching & Pub/Sub**: Redis for session management, rate limiting, and real-time agent event streaming.
- **AI Orchestration**: LangGraph for creating stateful, multi-agent workflows.

### 3. AI Agent System
NexusOS uses a hierarchical multi-agent architecture:
- **Executive Agent**: The top-level orchestrator. Receives natural language goals, generates execution plans, delegates to specialist agents, and merges the results.
- **Planner Agent**: Specializes in breaking down complex multi-day projects into timelines and milestones.
- **Specialist Agents**: 
  - `Email Agent`: Reads, drafts, and summarizes emails (Gmail/Outlook).
  - `Calendar Agent`: Checks availability, schedules meetings (Google Calendar).
  - `Drive Agent`: Searches and extracts text from documents.
  - `GitHub Agent`: Reviews PRs, issues, and codebases.
  - `Slack/Jira/Notion Agents`: Manages communication, ticketing, and documentation.
- **Memory Agent**: Responsible for short-term (context window) and long-term (vector DB) memory storage and retrieval.

### 4. Integration Layer (MCP)
Agents interact with the outside world via the **Model Context Protocol**. 
Instead of writing one-off API integrations, NexusOS uses MCP Servers to expose tools to the LLM natively.

## Data Flow (Goal Execution)

1. **User Input**: User submits a Goal in the AI Workspace ("Prepare tomorrow's Acme client meeting").
2. **Intent Parsing**: The FastAPI backend receives the prompt. The Executive Agent analyzes the intent.
3. **Memory Retrieval**: The Memory Agent fetches context (e.g., who is "Acme", recent emails, past meetings).
4. **Planning**: The Executive Agent creates a Directed Acyclic Graph (DAG) plan using LangGraph.
5. **Execution**: 
   - Node 1: Email Agent fetches Acme emails.
   - Node 2: Drive Agent fetches Acme proposals.
   - Node 3: Calendar Agent schedules the meeting.
   - Node 4: Presentation Agent drafts a slide outline.
6. **Real-time Streaming**: As agents execute, SSE (Server-Sent Events) stream updates to the Next.js frontend, rendering progress indicators in the UI.
7. **Verification**: The Executive Agent reviews the compiled data.
8. **Completion**: The final summary is presented to the user.

## Database Schema Highlights
- **Users & Organizations**: RBAC and multi-tenancy.
- **Goals & Tasks**: Represents the user's intent and the decomposed steps.
- **Agents & Memory**: Tracks which agents are active and their long-term learnings.
- **Workflows**: User-defined automation chains mapping triggers to agent actions.
