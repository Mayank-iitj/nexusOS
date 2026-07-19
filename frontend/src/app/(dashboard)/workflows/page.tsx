"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  BackgroundVariant,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Mail,
  Calendar,
  GitBranch,
  MessageSquare,
  FileText,
  Bot,
  Zap,
  Play,
  Save,
  Plus,
  SquareKanban,
  BookOpen,
  Presentation,
  Brain,
  BarChart3,
  Workflow,
  ArrowRight,
  GripVertical,
} from "lucide-react";

/* ── Custom Node Components ─────────────────── */

function TriggerNode({ data }: { data: any }) {
  return (
    <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm p-4 min-w-[180px] shadow-lg shadow-emerald-500/10">
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-emerald-600" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Play className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span className="text-xs font-semibold text-emerald-300">Trigger</span>
      </div>
      <p className="text-[11px] text-zinc-400">{data.label}</p>
    </div>
  );
}

function AgentNode({ data }: { data: any }) {
  const iconMap: Record<string, any> = {
    email: Mail, calendar: Calendar, github: GitBranch, slack: MessageSquare,
    drive: FileText, jira: SquareKanban, notion: BookOpen, presentation: Presentation,
    memory: Brain, analytics: BarChart3, workflow: Workflow, executive: Bot,
  };
  const Icon = iconMap[data.agent] || Bot;
  const color = data.color || "#6366f1";

  return (
    <div
      className="rounded-xl border backdrop-blur-sm p-4 min-w-[180px] shadow-lg"
      style={{
        borderColor: `${color}40`,
        background: `${color}08`,
        boxShadow: `0 0 20px ${color}10`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-zinc-400 !border-2 !border-zinc-600" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !border-2" style={{ background: color, borderColor: `${color}80` }} />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-xs font-semibold" style={{ color }}>{data.label}</span>
      </div>
      <p className="text-[11px] text-zinc-500">{data.action || "Process data"}</p>
    </div>
  );
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 backdrop-blur-sm p-4 min-w-[160px] shadow-lg shadow-amber-500/10">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-zinc-400 !border-2 !border-zinc-600" />
      <Handle type="source" position={Position.Right} id="yes" className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-emerald-600" style={{ top: "35%" }} />
      <Handle type="source" position={Position.Right} id="no" className="!w-3 !h-3 !bg-red-400 !border-2 !border-red-600" style={{ top: "65%" }} />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <span className="text-xs font-semibold text-amber-300">Condition</span>
      </div>
      <p className="text-[11px] text-zinc-400">{data.label}</p>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  condition: ConditionNode,
};

/* ── Initial Flow Data ────────────────────── */

const initialNodes = [
  { id: "1", type: "trigger", position: { x: 50, y: 200 }, data: { label: "Email Received" } },
  { id: "2", type: "agent", position: { x: 320, y: 200 }, data: { label: "Email Agent", agent: "email", color: "#ef4444", action: "Extract action items" } },
  { id: "3", type: "condition", position: { x: 590, y: 200 }, data: { label: "Has action items?" } },
  { id: "4", type: "agent", position: { x: 860, y: 100 }, data: { label: "Jira Agent", agent: "jira", color: "#0ea5e9", action: "Create tickets" } },
  { id: "5", type: "agent", position: { x: 860, y: 300 }, data: { label: "Notion Agent", agent: "notion", color: "#78716c", action: "Archive email" } },
  { id: "6", type: "agent", position: { x: 1130, y: 200 }, data: { label: "Slack Agent", agent: "slack", color: "#e11d48", action: "Notify team" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#10b981" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#ef4444" } },
  { id: "e3-4", source: "3", target: "4", sourceHandle: "yes", style: { stroke: "#10b981" }, label: "Yes", labelStyle: { fill: "#10b981", fontSize: 10 } },
  { id: "e3-5", source: "3", target: "5", sourceHandle: "no", style: { stroke: "#ef4444" }, label: "No", labelStyle: { fill: "#ef4444", fontSize: 10 } },
  { id: "e4-6", source: "4", target: "6", animated: true, style: { stroke: "#0ea5e9" } },
  { id: "e5-6", source: "5", target: "6", style: { stroke: "#78716c" } },
];

/* ── Palette Items ────────────────────────── */

const PALETTE_ITEMS = [
  { type: "trigger", label: "Trigger", icon: Play, color: "#10b981" },
  { type: "condition", label: "Condition", icon: Zap, color: "#f59e0b" },
  { type: "agent-email", label: "Email", icon: Mail, color: "#ef4444", agent: "email" },
  { type: "agent-calendar", label: "Calendar", icon: Calendar, color: "#3b82f6", agent: "calendar" },
  { type: "agent-github", label: "GitHub", icon: GitBranch, color: "#6366f1", agent: "github" },
  { type: "agent-slack", label: "Slack", icon: MessageSquare, color: "#e11d48", agent: "slack" },
  { type: "agent-jira", label: "Jira", icon: SquareKanban, color: "#0ea5e9", agent: "jira" },
  { type: "agent-notion", label: "Notion", icon: BookOpen, color: "#78716c", agent: "notion" },
  { type: "agent-drive", label: "Drive", icon: FileText, color: "#f59e0b", agent: "drive" },
  { type: "agent-presentation", label: "Slides", icon: Presentation, color: "#f97316", agent: "presentation" },
];

/* ── Workflow Builder Page ────────────────── */

export default function WorkflowsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedWorkflow, setSelectedWorkflow] = useState("Email → Jira → Slack");

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#6366f1" } } as any, eds)),
    [setEdges]
  );

  const workflows = [
    { name: "Email → Jira → Slack", active: true, runs: 47 },
    { name: "Daily Standup Prep", active: true, runs: 23 },
    { name: "Meeting Follow-up", active: false, runs: 12 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-400" />
            Workflow Builder
          </h1>
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none"
          >
            {workflows.map((wf) => (
              <option key={wf.name} value={wf.name} className="bg-zinc-900">
                {wf.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors">
            <Play className="w-4 h-4" /> Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <div className="w-48 border-r border-white/5 glass p-3 overflow-y-auto shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3 px-1">Nodes</p>
          <div className="space-y-1.5">
            {PALETTE_ITEMS.map((item) => (
              <div
                key={item.type}
                draggable
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors group"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
            defaultEdgeOptions={{ animated: true }}
          >
            <Controls
              className="!bg-zinc-900/80 !border-white/10 !rounded-xl !shadow-lg [&>button]:!bg-transparent [&>button]:!border-white/5 [&>button]:!text-zinc-400 [&>button:hover]:!bg-white/5"
            />
            <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.03)" gap={20} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
