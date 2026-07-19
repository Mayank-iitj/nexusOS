"""
NexusOS — Executive Agent
Top-level orchestrator that understands goals, builds plans, and delegates to specialized agents.
"""

from typing import Any, List, Dict
import uuid
import datetime
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.prompts.templates import get_all_prompts
from app.config import get_settings


class PlanStep(BaseModel):
    step: int = Field(description="Step sequence number")
    agent: str = Field(description="Agent to handle this step (e.g. email, calendar, drive, github, meeting, presentation)")
    action: str = Field(description="Action to perform")
    status: str = Field(default="pending")

class AIPlan(BaseModel):
    strategy: str = Field(description="Execution strategy, e.g. multi-agent-sequential")
    estimated_steps: int = Field(description="Number of steps")
    requires_confirmation: bool = Field(description="Whether user confirmation is required")

class AIGoalPlan(BaseModel):
    plan: AIPlan = Field(description="Overall execution plan")
    agents: List[str] = Field(description="List of agents required for this plan")
    estimated_duration: str = Field(description="Estimated duration (e.g., '2-4 minutes')")
    confidence: float = Field(description="Confidence score (0.0 to 1.0)")
    steps: List[PlanStep] = Field(description="Sequential list of steps to execute")


class ExecutiveAgent:
    """
    The Executive Agent is the top-level orchestrator in NexusOS.
    It receives user goals, creates execution plans, delegates to 
    specialized agents, and merges results.
    """

    def __init__(self):
        self.name = "executive"
        self.prompts = get_all_prompts("executive")
        self.settings = get_settings()
        self.available_agents = [
            "planner", "email", "calendar", "drive", "github",
            "meeting", "slack", "jira", "notion", "presentation",
            "workflow", "memory", "analytics",
        ]
        
        # Initialize Groq if configured
        api_key = self.settings.groq_api_key or "DUMMY_KEY"
        self.llm = ChatGroq(
            temperature=0, 
            model_name=self.settings.default_llm_model, 
            groq_api_key=api_key
        )

    async def process_goal(self, goal: str, context: dict | None = None) -> dict:
        """
        Process a user goal through the full orchestration pipeline.
        Currently focusing on Plan Generation using Groq LLM.
        """
        parsed_goal = await self._understand_goal(goal, context)
        plan_data = await self._create_plan(parsed_goal)
        return plan_data

    async def _understand_goal(self, goal: str, context: dict | None) -> dict:
        """Parse natural language goal into structured intent."""
        return {
            "original": goal,
            "intent": "meeting_preparation",
            "entities": [],
            "urgency": "normal",
            "context": context or {},
        }

    async def _create_plan(self, parsed_goal: dict) -> dict:
        """Create an execution plan with agent assignments using Groq API."""
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.prompts["system"] + "\n\n" + self.prompts["developer"]),
            ("human", "Goal: {goal}\nContext: {context}")
        ])
        
        structured_llm = self.llm.with_structured_output(AIGoalPlan)
        chain = prompt | structured_llm
        
        try:
            # Check if we have a real key, else fallback to mock
            if self.settings.groq_api_key:
                ai_result = await chain.ainvoke({
                    "goal": parsed_goal["original"], 
                    "context": str(parsed_goal["context"])
                })
                
                return {
                    "id": f"goal_{str(uuid.uuid4())[:8]}",
                    "goal": parsed_goal["original"],
                    "status": "planning",
                    "plan": ai_result.plan.dict(),
                    "agents": ai_result.agents,
                    "estimated_duration": ai_result.estimated_duration,
                    "confidence": ai_result.confidence,
                    "steps": [s.dict() for s in ai_result.steps],
                    "created_at": datetime.datetime.utcnow().isoformat(),
                }
        except Exception as e:
            print(f"Groq API Error: {e}")
            
        # Fallback if no key or error
        return {
            "id": f"goal_{str(uuid.uuid4())[:8]}",
            "goal": parsed_goal["original"],
            "status": "planning",
            "plan": {
                "strategy": "multi-agent-sequential",
                "estimated_steps": 1,
                "requires_confirmation": True,
            },
            "agents": ["executive", "email"],
            "estimated_duration": "2-4 minutes",
            "confidence": 0.92,
            "steps": [
                {"step": 1, "agent": "email", "action": "Analyze request (Fallback due to missing Groq Key)", "status": "pending"},
            ],
            "created_at": datetime.datetime.utcnow().isoformat(),
        }

    async def _execute_plan(self, plan: dict) -> list[dict]:
        return []

    async def _delegate_to_agent(self, agent_name: str, task: str, context: dict) -> dict:
        return {}

    async def _merge_results(self, results: list[dict]) -> dict:
        return {}

    async def _verify_output(self, merged: dict, goal: dict) -> dict:
        return merged

    async def _store_learnings(self, goal: str, result: dict) -> None:
        pass
