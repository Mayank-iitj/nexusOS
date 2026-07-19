"use client";

import { motion } from "framer-motion";
import { Video, Calendar, Clock, Users, FileText, ExternalLink, Bot, CheckCircle2 } from "lucide-react";

const MEETINGS = [
  {
    id: "1", title: "Sprint Planning", time: "Tomorrow · 10:00 - 11:00 AM", attendees: ["AC", "MT", "SK", "JL"],
    url: "https://meet.google.com/abc", status: "scheduled", type: "upcoming",
  },
  {
    id: "2", title: "Client Demo - Acme Corp", time: "Tomorrow · 2:00 - 3:00 PM", attendees: ["AC", "JS"],
    url: "https://zoom.us/j/123", status: "scheduled", type: "upcoming",
  },
  {
    id: "3", title: "Weekly Design Review", time: "Jul 18 · 3:00 - 4:00 PM", attendees: ["SK", "JL"],
    status: "completed", type: "past",
    summary: "Reviewed new dashboard widgets. Agreed on glassmorphism theme with indigo/purple accent palette. Action items: Sarah to finalize color tokens by Friday, Jordan to implement the widget grid layout.",
    actionItems: ["Finalize color palette", "Implement widget grid", "Update Figma components"],
  },
  {
    id: "4", title: "Architecture Review", time: "Jul 17 · 11:00 AM - 12:00 PM", attendees: ["AC", "MT", "JL"],
    status: "completed", type: "past",
    summary: "Discussed migration to event-driven architecture using Redis Streams for inter-agent communication. Decided to implement the Executive Agent as the central orchestrator. Mike to prototype the agent communication layer by next sprint.",
    actionItems: ["Prototype agent comm layer", "Benchmark Redis Streams vs RabbitMQ", "Update architecture docs"],
  },
];

export default function MeetingsPage() {
  const upcoming = MEETINGS.filter((m) => m.type === "upcoming");
  const past = MEETINGS.filter((m) => m.type === "past");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-emerald-400" />
          Meetings
        </h1>
        <p className="text-sm text-zinc-500 mt-1">2 upcoming · 2 completed this week</p>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Upcoming</h2>
        <div className="space-y-3">
          {upcoming.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{m.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{m.attendees.length} attendees</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                    <Bot className="w-3 h-3" /> Prep with AI
                  </button>
                  {m.url && (
                    <a href={m.url} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Join
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {m.attendees.map((a) => (
                  <div key={a} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold -ml-1 first:ml-0 border-2 border-background">
                    {a}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Completed</h2>
        <div className="space-y-3">
          {past.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{m.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{m.attendees.length}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Completed</span>
              </div>

              {m.summary && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-400">AI Summary</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{m.summary}</p>
                </div>
              )}

              {m.actionItems && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-2">Action Items</p>
                  <div className="space-y-1.5">
                    {m.actionItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
