"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  Bot,
  User,
  Check,
  Clock,
  Loader2,
  Sparkles,
  ChevronDown,
  Mail,
  Calendar,
  FileText,
  GitBranch,
  Video,
  Presentation,
  Brain,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";

type MessageRole = "user" | "assistant" | "system";
type AgentStep = {
  agent: string;
  icon: any;
  color: string;
  action: string;
  status: "completed" | "running" | "pending";
  result?: string;
};

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  agentSteps?: AgentStep[];
};

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Prepare tomorrow's client meeting with Acme Corp.",
    timestamp: "10:32 AM",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "I'll prepare everything for your Acme Corp meeting tomorrow. Let me orchestrate the right agents to gather all necessary context and create the deliverables.",
    timestamp: "10:32 AM",
    agentSteps: [
      { agent: "Email Agent", icon: Mail, color: "#ef4444", action: "Found 5 relevant emails from John Smith (Acme CTO)", status: "completed", result: "Latest: Re: Q3 Proposal — requesting timeline update and pricing revision" },
      { agent: "Calendar Agent", icon: Calendar, color: "#3b82f6", action: "Tomorrow 2:00-3:00 PM confirmed. Google Meet link generated.", status: "completed", result: "No conflicts detected. Invite sent to john.smith@acme.com" },
      { agent: "Drive Agent", icon: FileText, color: "#f59e0b", action: "Found: Q3 Proposal v2.pdf, Acme Requirements.docx, Pricing Sheet", status: "completed", result: "3 documents summarized and key points extracted" },
      { agent: "GitHub Agent", icon: GitBranch, color: "#6366f1", action: "Project nexus-os: 3 PRs merged, 2 issues closed since last meeting", status: "completed", result: "Milestone 'v2.0 Beta' at 87% completion" },
      { agent: "Meeting Agent", icon: Video, color: "#10b981", action: "Generated meeting agenda with 5 discussion points", status: "completed", result: "Agenda includes: project update, timeline review, pricing discussion, next steps, Q&A" },
      { agent: "Presentation Agent", icon: Presentation, color: "#f97316", action: "Created 8-slide presentation deck", status: "completed", result: "Slides: Overview, Progress, Demo, Timeline, Pricing, Team, Next Steps, Q&A" },
      { agent: "Memory Agent", icon: Brain, color: "#ec4899", action: "Stored meeting prep context for future reference", status: "completed" },
    ],
  },
  {
    id: "3",
    role: "assistant",
    content: `✅ **Meeting preparation complete!** Here's what I've done:

**📧 Email Summary**: John Smith is expecting a timeline update and revised pricing for the Q3 deployment.

**📅 Meeting Scheduled**: Tomorrow 2:00-3:00 PM via Google Meet. Invite sent to all attendees.

**📊 Presentation Ready**: 8-slide deck covering project progress (87% on v2.0 milestone), demo highlights, revised timeline, and updated pricing.

**📋 Agenda**:
1. Project Status Update (10 min)
2. Live Demo of New Features (15 min)  
3. Timeline Review & Adjustments (10 min)
4. Pricing Discussion (10 min)
5. Next Steps & Action Items (15 min)

**📁 Supporting Docs**: Q3 Proposal v2, Requirements Doc, and Pricing Sheet attached to the calendar invite.

Would you like me to adjust anything, or shall I also draft a pre-meeting email to John?`,
    timestamp: "10:33 AM",
  },
];

const SUGGESTED_GOALS = [
  "Plan next week's sprint",
  "Summarize today's emails",
  "Review GitHub progress",
  "Create weekly report",
];

const getAgentMetadata = (agent: string) => {
  const name = agent.toLowerCase();
  if (name.includes("email")) return { icon: Mail, color: "#ef4444" };
  if (name.includes("calendar")) return { icon: Calendar, color: "#3b82f6" };
  if (name.includes("drive") || name.includes("doc")) return { icon: FileText, color: "#f59e0b" };
  if (name.includes("github") || name.includes("git")) return { icon: GitBranch, color: "#6366f1" };
  if (name.includes("meeting") || name.includes("video")) return { icon: Video, color: "#10b981" };
  if (name.includes("presentation") || name.includes("slide")) return { icon: Presentation, color: "#f97316" };
  if (name.includes("memory")) return { icon: Brain, color: "#ec4899" };
  return { icon: Zap, color: "#a855f7" };
};

export default function WorkspacePage() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({ "2": true });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const goalText = input;
    const newMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: goalText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Make real API call to the backend which uses Groq
      const response = await api.post("/goals/submit", {
        goal: goalText,
        auto_execute: false
      });
      
      const goalPlan = response.data;
      const messageId = String(Date.now() + 1);
      
      // Map backend steps to frontend agentSteps
      const agentSteps: AgentStep[] = goalPlan.steps.map((step: any) => {
        const metadata = getAgentMetadata(step.agent);
        return {
          agent: step.agent.charAt(0).toUpperCase() + step.agent.slice(1) + " Agent",
          icon: metadata.icon,
          color: metadata.color,
          action: step.action,
          status: step.status,
          result: step.result || undefined,
        };
      });

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          role: "assistant",
          content: `I've analyzed your goal using the **${goalPlan.plan.strategy}** strategy. This will take approximately **${goalPlan.estimated_duration}** across ${goalPlan.agents.length} specialized agents. Here is the execution plan I generated:`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          agentSteps: agentSteps,
        },
      ]);
      
      // Auto-expand the new message's steps
      setExpandedSteps((prev) => ({
        ...prev,
        [messageId]: true,
      }));
      
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: "❌ Sorry, I encountered a network error while trying to reach the AI engine. Please make sure the backend is running and the Groq API key is valid.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">What would you like to accomplish?</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-md">
              Describe your goal and NexusOS will plan, delegate, and execute across your apps.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setInput(goal)}
                  className="px-4 py-2 rounded-xl glass-card text-sm text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-indigo-500/20 border border-indigo-500/20 ml-auto"
                    : "glass-card"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={i} className="font-semibold text-white">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>

              {/* Agent Execution Steps */}
              {msg.agentSteps && (
                <div className="mt-3">
                  <button
                    onClick={() =>
                      setExpandedSteps((prev) => ({
                        ...prev,
                        [msg.id]: !prev[msg.id],
                      }))
                    }
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 mb-2 transition-colors"
                  >
                    <Zap className="w-3 h-3 text-indigo-400" />
                    {msg.agentSteps.length} agents executed
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        expandedSteps[msg.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedSteps[msg.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {msg.agentSteps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${step.color}15` }}
                            >
                              <step.icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{step.agent}</span>
                                {step.status === "completed" && (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                )}
                                {step.status === "running" && (
                                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{step.action}</p>
                              {step.result && (
                                <p className="text-[10px] text-zinc-600 mt-1 italic">{step.result}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="text-[10px] text-zinc-600 mt-1.5 px-1">
                {msg.timestamp}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Goals */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 pb-3 overflow-x-auto">
          {SUGGESTED_GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => setInput(goal)}
              className="px-3 py-1.5 rounded-lg glass-card text-[11px] text-zinc-400 hover:text-white whitespace-nowrap transition-all shrink-0"
            >
              {goal}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex items-end gap-2">
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your goal..."
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none min-h-[40px] max-h-[120px] py-2"
              rows={1}
            />
          </div>
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
