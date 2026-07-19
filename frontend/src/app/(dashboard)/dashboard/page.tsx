"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  Mail,
  GitBranch,
  FileText,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Bot,
  BarChart3,
  Brain,
  Play,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const res = await api.get("/analytics/overview");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Alex</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {date} — You have {overview?.meetings_today} meetings today and {overview?.tasks_completed_today} pending tasks.
          </p>
        </div>
        <Link
          href="/workspace"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Bot className="w-4 h-4" />
          New Goal
        </Link>
      </div>

      {/* Top Row — Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weekly Score", value: overview?.productivity_score, unit: "/100", icon: TrendingUp, color: "#8b5cf6", delta: "+12%" },
          { label: "Tasks Done", value: overview?.tasks_completed_week, unit: " this week", icon: CheckCircle2, color: "#10b981", delta: "+8" },
          { label: "Hours Saved", value: overview?.hours_saved, unit: "h", icon: Clock, color: "#06b6d4", delta: "+2.3h" },
          { label: "Automations", value: overview?.automation_success_rate, unit: "%", icon: Zap, color: "#f59e0b", delta: "success" },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            variants={item}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${metric.color}15` }}
              >
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {metric.delta}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {metric.value}
              <span className="text-sm text-zinc-500 font-normal">{metric.unit}</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <motion.div variants={item} className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Today&apos;s Focus
            </h2>
            <Link href="/projects" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "Finalize API documentation", project: "NexusOS v2.0", priority: "high", time: "2h", done: false },
              { title: "Review GitHub Agent PR #247", project: "API Integration", priority: "high", time: "1h", done: false },
              { title: "Prepare investor presentation", project: "Q3 Marketing", priority: "urgent", time: "3h", done: false },
              { title: "Set up CI/CD pipeline", project: "NexusOS v2.0", priority: "medium", time: "Done", done: true },
              { title: "Design email campaign templates", project: "Q3 Marketing", priority: "medium", time: "2h", done: false },
            ].map((task, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group ${
                  task.done ? "opacity-50" : ""
                }`}
              >
                <button className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  task.done
                    ? "bg-emerald-500/20 border-emerald-500/30"
                    : "border-white/10 hover:border-indigo-500/30"
                }`}>
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.done ? "line-through text-zinc-500" : ""}`}>{task.title}</p>
                  <p className="text-xs text-zinc-600">{task.project}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  task.priority === "urgent" ? "bg-red-500/10 text-red-400" :
                  task.priority === "high" ? "bg-amber-500/10 text-amber-400" :
                  "bg-zinc-700/50 text-zinc-400"
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-zinc-600 w-12 text-right">{task.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Insights
          </h2>
          <div className="space-y-3">
            {[
              { text: "You have 3 unread emails from Acme Corp that may need urgent replies.", action: "Review", color: "#ef4444" },
              { text: "Sprint planning is tomorrow. Jira has 5 unestimated tickets.", action: "Estimate", color: "#f59e0b" },
              { text: "Your meeting load is 40% higher than last week. Consider blocking focus time.", action: "Block Time", color: "#06b6d4" },
              { text: "PR #247 has been open for 3 days without review.", action: "Review PR", color: "#6366f1" },
            ].map((insight, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-zinc-300 leading-relaxed mb-2">{insight.text}</p>
                <button
                  className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                  style={{ background: `${insight.color}15`, color: insight.color }}
                >
                  {insight.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-blue-400" />
            Upcoming Meetings
          </h2>
          <div className="space-y-3">
            {[
              { title: "Sprint Planning", time: "10:00 AM", attendees: 4, in: "Tomorrow" },
              { title: "Client Demo - Acme", time: "2:00 PM", attendees: 2, in: "Tomorrow" },
              { title: "Design Review", time: "3:00 PM", attendees: 3, in: "Mon" },
            ].map((meeting, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{meeting.title}</p>
                  <p className="text-xs text-zinc-500">{meeting.time} · {meeting.attendees} attendees</p>
                </div>
                <span className="text-xs text-zinc-600 shrink-0">{meeting.in}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GitHub Activity */}
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <GitBranch className="w-5 h-5 text-purple-400" />
            GitHub Activity
          </h2>
          <div className="space-y-3">
            {[
              { title: "PR #247: Add Slack integration", repo: "nexus-os/agents", type: "pr", status: "review" },
              { title: "Issue #89: Memory leak fix", repo: "nexus-os/core", type: "issue", status: "open" },
              { title: "PR #245: Update API docs", repo: "nexus-os/docs", type: "pr", status: "merged" },
              { title: "Issue #91: Rate limiting", repo: "nexus-os/api", type: "issue", status: "closed" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02]">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  activity.status === "merged" ? "bg-purple-400" :
                  activity.status === "review" ? "bg-amber-400" :
                  activity.status === "open" ? "bg-emerald-400" : "bg-zinc-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.title}</p>
                  <p className="text-[10px] text-zinc-600">{activity.repo}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  activity.status === "merged" ? "bg-purple-500/10 text-purple-400" :
                  activity.status === "review" ? "bg-amber-500/10 text-amber-400" :
                  activity.status === "open" ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-zinc-700/50 text-zinc-400"
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Emails + Documents */}
        <motion.div variants={item} className="space-y-6">
          {/* Emails */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-red-400" />
              Unread Emails
              <span className="ml-auto text-xs text-zinc-600">5 new</span>
            </h2>
            <div className="space-y-2">
              {[
                { from: "John Smith (Acme)", subject: "Re: Q3 Proposal", time: "9:30 AM" },
                { from: "GitHub", subject: "PR review requested", time: "8:15 AM" },
                { from: "Sarah Kim", subject: "Design assets ready", time: "Yesterday" },
              ].map((email, i) => (
                <div key={i} className="p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer">
                  <p className="text-xs font-medium truncate">{email.from}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{email.subject}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Automations */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              Active Automations
              <span className="ml-auto text-xs text-emerald-400">3 running</span>
            </h2>
            <div className="space-y-2">
              {[
                { name: "Email → Jira → Slack", runs: 47, status: "active" },
                { name: "Daily Standup Prep", runs: 23, status: "active" },
                { name: "Meeting Follow-up", runs: 12, status: "paused" },
              ].map((wf, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                  <div className={`w-1.5 h-1.5 rounded-full ${wf.status === "active" ? "bg-emerald-400" : "bg-zinc-500"}`} />
                  <span className="text-xs flex-1 truncate">{wf.name}</span>
                  <span className="text-[10px] text-zinc-600">{wf.runs} runs</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
