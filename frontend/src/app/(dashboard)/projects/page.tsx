"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  FolderKanban,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "#71717a" },
  { id: "in_progress", title: "In Progress", color: "#6366f1" },
  { id: "review", title: "Review", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#10b981" },
];

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
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

  const tasks = data?.tasks || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getProjectColor = (project: string) => {
    if (project.includes("NexusOS")) return "#6366f1";
    if (project.includes("Integration")) return "#10b981";
    return "#f59e0b";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            Projects & Tasks
          </h1>
          <p className="text-sm text-zinc-500 mt-1">3 active projects · {tasks.length} tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center glass-card rounded-lg overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-xs ${view === "kanban" ? "bg-white/10 text-white" : "text-zinc-500"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-xs ${view === "list" ? "bg-white/10 text-white" : "text-zinc-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === "kanban" && (
        <div className="grid grid-cols-4 gap-4 overflow-x-auto">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t: any) => t.status === col.id);
            return (
              <div key={col.id} className="min-w-[260px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="text-sm font-medium">{col.title}</span>
                    <span className="text-xs text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="text-zinc-600 hover:text-zinc-400">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task: any, i: number) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-xl p-4 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: getProjectColor(task.project) }} />
                          <span className="text-[10px] text-zinc-500">{task.project}</span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-zinc-600" />
                        </button>
                      </div>
                      <p className="text-sm font-medium mb-3 leading-snug">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          task.priority === "urgent" ? "bg-red-500/10 text-red-400" :
                          task.priority === "high" ? "bg-amber-500/10 text-amber-400" :
                          "bg-zinc-700/50 text-zinc-400"
                        }`}>
                          {task.priority}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold">
                          {getInitials(task.assignee)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-xs text-zinc-500">
                <th className="text-left p-3 font-medium">Task</th>
                <th className="text-left p-3 font-medium">Project</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Priority</th>
                <th className="text-left p-3 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: any) => (
                <tr key={task.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-3 text-sm">{task.title}</td>
                  <td className="p-3 text-sm text-zinc-400">{task.project}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      task.status === "done" ? "bg-emerald-500/10 text-emerald-400" :
                      task.status === "in_progress" ? "bg-indigo-500/10 text-indigo-400" :
                      task.status === "review" ? "bg-amber-500/10 text-amber-400" :
                      "bg-zinc-700/50 text-zinc-400"
                    }`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      task.priority === "urgent" ? "bg-red-500/10 text-red-400" :
                      task.priority === "high" ? "bg-amber-500/10 text-amber-400" :
                      "bg-zinc-700/50 text-zinc-400"
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold">
                      {getInitials(task.assignee)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
