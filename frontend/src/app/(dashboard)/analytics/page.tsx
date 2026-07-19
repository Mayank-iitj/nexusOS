"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Mail,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const agentUsage = [
  { name: "Email", value: 2156, color: "#ef4444" },
  { name: "Memory", value: 3421, color: "#ec4899" },
  { name: "Calendar", value: 1543, color: "#3b82f6" },
  { name: "GitHub", value: 1321, color: "#6366f1" },
  { name: "Slack", value: 1098, color: "#e11d48" },
  { name: "Executive", value: 1247, color: "#8b5cf6" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg p-2.5 shadow-xl border border-white/10">
        <p className="text-xs font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const res = await api.get("/analytics/overview");
      return res.data;
    },
  });

  const { data: trends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ["analytics", "trends"],
    queryFn: async () => {
      const res = await api.get("/analytics/trends");
      return res.data;
    },
  });

  if (isOverviewLoading || isTrendsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Combine trends data into a single array for Recharts
  const taskData = trends?.tasks_completed.map((t: any, i: number) => ({
    day: new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }),
    tasks: t.value,
    emails: trends.emails_processed[i].value,
  })) || [];

  const hoursSaved = trends?.hours_saved.map((h: any) => ({
    day: new Date(h.date).toLocaleDateString("en-US", { weekday: "short" }),
    hours: h.value,
  })) || [];

  const metrics = [
    { label: "Productivity Score", value: `${overview?.productivity_score}/100`, icon: Target, color: "#8b5cf6", delta: "+12%", up: true },
    { label: "Tasks Completed", value: overview?.tasks_completed_week, icon: CheckCircle2, color: "#10b981", delta: "+18%", up: true },
    { label: "Hours Saved", value: `${overview?.hours_saved}h`, icon: Clock, color: "#06b6d4", delta: "+2.3h", up: true },
    { label: "Emails Processed", value: overview?.emails_processed, icon: Mail, color: "#ef4444", delta: "+23", up: true },
    { label: "Meetings", value: overview?.meetings_week, icon: Calendar, color: "#3b82f6", delta: "+40%", up: false },
    { label: "AI Accuracy", value: `${overview?.ai_accuracy}%`, icon: Brain, color: "#ec4899", delta: "+1.8%", up: true },
    { label: "Automation Rate", value: `${overview?.automation_success_rate}%`, icon: Zap, color: "#f59e0b", delta: "+3.2%", up: true },
    { label: "Focus Hours", value: `${overview?.focus_hours_today}h/day`, icon: TrendingUp, color: "#a855f7", delta: "+0.5h", up: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Analytics
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Your productivity insights for this week</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <span className={`text-[10px] flex items-center gap-0.5 ${m.up ? "text-emerald-400" : "text-amber-400"}`}>
                {m.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {m.delta}
              </span>
            </div>
            <div className="text-xl font-bold">{m.value}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks & Emails Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4">Tasks Completed & Emails Processed</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} name="Tasks" />
                <Bar dataKey="emails" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Emails" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hours Saved Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4">Hours Saved by AI</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hoursSaved}>
                <defs>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="url(#hoursGradient)" strokeWidth={2} name="Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agent Usage */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4">Agent Usage Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {agentUsage.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {agentUsage.map((agent) => (
                <div key={agent.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: agent.color }} />
                  <span className="text-xs text-zinc-400 flex-1">{agent.name}</span>
                  <span className="text-xs font-medium">{agent.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            AI Weekly Summary
          </h3>
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              📈 Your productivity score improved by <span className="text-emerald-400 font-medium">12%</span> this week, driven by increased automation adoption.
            </p>
            <p>
              ⚡ The AI saved you <span className="text-indigo-400 font-medium">14.5 hours</span> through automated email processing, meeting preparation, and document summarization.
            </p>
            <p>
              ⚠️ Your meeting load increased <span className="text-amber-400 font-medium">40%</span> this week. Consider declining non-essential meetings to protect focus time.
            </p>
            <p>
              🎯 <span className="text-purple-400 font-medium">Recommendation:</span> Block 2-hour focus sessions on Tuesday and Thursday mornings for deep work.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
