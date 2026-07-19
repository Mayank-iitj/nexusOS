"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Workflow,
  FolderKanban,
  Video,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  CircuitBoard,
  LogOut,
  Plus,
  Command,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "AI Workspace", href: "/workspace" },
  { icon: Workflow, label: "Workflows", href: "/workflows" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Video, label: "Meetings", href: "/meetings" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const notifications = [
    { id: 1, title: "Meeting summary ready", message: "Design Review notes generated", time: "2m ago", unread: true },
    { id: 2, title: "Task completed", message: "CI/CD pipeline setup finished", time: "15m ago", unread: true },
    { id: 3, title: "Email drafted", message: "Reply to Acme Corp prepared", time: "1h ago", unread: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ──────────────────────────── */}
      <aside
        className={`h-full flex flex-col glass-strong border-r border-white/5 sidebar-transition ${
          collapsed ? "w-[68px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <CircuitBoard className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold whitespace-nowrap"
              >
                Nexus<span className="gradient-text">OS</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* New Goal Button */}
        <div className="px-3 pt-4 pb-2 shrink-0">
          <Link
            href="/workspace"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-300 hover:from-indigo-500/30 hover:to-purple-500/30 transition-all text-sm font-medium ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Goal</span>}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all relative ${
                    isActive
                      ? "bg-white/5 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
                    />
                  )}
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 pb-4 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all w-full"
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px] mx-auto" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px]" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search or type a goal..."
                className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none flex-1"
              />
              <div className="flex items-center gap-1 text-[10px] text-zinc-600 border border-white/5 rounded px-1.5 py-0.5">
                <Command className="w-2.5 h-2.5" />K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5 text-zinc-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 glass-strong rounded-xl border border-white/5 shadow-xl z-50"
                  >
                    <div className="p-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer ${
                            n.unread ? "bg-indigo-500/5" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{n.message}</p>
                            </div>
                            <span className="text-[10px] text-zinc-600 whitespace-nowrap">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                AC
              </div>
              {/* No name on small screens */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
