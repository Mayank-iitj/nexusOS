"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Plug,
  Key,
  Shield,
  Bell,
  Palette,
  CreditCard,
  User,
  Check,
  X,
  ExternalLink,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

const TABS = [
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const INTEGRATIONS = [
  { name: "Google Workspace", desc: "Gmail, Calendar, Drive, Docs, Sheets", status: "connected", color: "#4285f4", icon: "🔵" },
  { name: "GitHub", desc: "Repositories, Issues, Pull Requests", status: "connected", color: "#6e40c9", icon: "🐙" },
  { name: "Slack", desc: "Channels, Messages, Notifications", status: "connected", color: "#e11d48", icon: "💬" },
  { name: "Notion", desc: "Pages, Databases, Knowledge Base", status: "connected", color: "#ffffff", icon: "📝" },
  { name: "Jira", desc: "Boards, Issues, Sprints", status: "disconnected", color: "#0052cc", icon: "📋" },
  { name: "Linear", desc: "Issues, Projects, Cycles", status: "disconnected", color: "#5e6ad2", icon: "⚡" },
  { name: "Zoom", desc: "Meetings, Recordings", status: "disconnected", color: "#2d8cff", icon: "📹" },
  { name: "Discord", desc: "Servers, Channels, Messages", status: "disconnected", color: "#5865f2", icon: "🎮" },
  { name: "Trello", desc: "Boards, Cards, Lists", status: "disconnected", color: "#0079bf", icon: "📌" },
  { name: "ClickUp", desc: "Tasks, Docs, Goals", status: "disconnected", color: "#7b68ee", icon: "✅" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-zinc-400" />
        Settings
      </h1>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white/5 text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "integrations" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Integrations</h2>
                <p className="text-sm text-zinc-500 mt-1">Connect your apps to enable AI orchestration.</p>
              </div>
              <div className="grid gap-3">
                {INTEGRATIONS.map((int) => (
                  <div key={int.name} className="glass-card rounded-xl p-4 flex items-center gap-4">
                    <div className="text-2xl">{int.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{int.name}</p>
                      <p className="text-xs text-zinc-500">{int.desc}</p>
                    </div>
                    {int.status === "connected" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Connected
                        </span>
                        <button className="text-xs text-zinc-600 hover:text-zinc-400 px-2 py-1 rounded hover:bg-white/5">
                          Manage
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Profile</h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold">AC</div>
                  <div>
                    <p className="font-semibold">Alex Chen</p>
                    <p className="text-sm text-zinc-500">demo@nexus-os.ai</p>
                  </div>
                </div>
                {[
                  { label: "Full Name", value: "Alex Chen" },
                  { label: "Email", value: "demo@nexus-os.ai" },
                  { label: "Timezone", value: "America/New_York (UTC-5)" },
                  { label: "Role", value: "Admin" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs text-zinc-500 block mb-1.5">{field.label}</label>
                    <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300 outline-none focus:border-indigo-500/30" defaultValue={field.value} />
                  </div>
                ))}
                <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-sm text-zinc-400 mb-4">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "dark", label: "Dark", icon: Moon, active: true },
                    { id: "light", label: "Light", icon: Sun, active: false },
                    { id: "system", label: "System", icon: Globe, active: false },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        theme.active
                          ? "border-indigo-500/30 bg-indigo-500/10"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <theme.icon className={`w-5 h-5 mx-auto mb-2 ${theme.active ? "text-indigo-400" : "text-zinc-500"}`} />
                      <span className="text-xs font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                {[
                  { label: "Email notifications", desc: "Receive updates via email", enabled: true },
                  { label: "Push notifications", desc: "Browser push notifications", enabled: true },
                  { label: "Slack notifications", desc: "Send updates to Slack", enabled: false },
                  { label: "Daily briefing", desc: "Morning summary at 9 AM", enabled: true },
                  { label: "Weekly review", desc: "Friday afternoon productivity report", enabled: true },
                  { label: "Task reminders", desc: "Get reminded before deadlines", enabled: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{setting.label}</p>
                      <p className="text-xs text-zinc-500">{setting.desc}</p>
                    </div>
                    <button className={`w-10 h-6 rounded-full transition-colors relative ${setting.enabled ? "bg-indigo-500" : "bg-zinc-700"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${setting.enabled ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Security</h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">AI Confirmation Level</p>
                  <p className="text-xs text-zinc-500 mb-3">When should AI ask for confirmation?</p>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All actions", desc: "Confirm every AI action" },
                      { id: "destructive", label: "Destructive only", desc: "Only confirm sends, deletes, publishes" },
                      { id: "none", label: "Never", desc: "Execute autonomously (not recommended)" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${opt.id === "destructive" ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-white/[0.02]"}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${opt.id === "destructive" ? "border-indigo-500" : "border-zinc-600"}`}>
                          {opt.id === "destructive" && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                        </div>
                        <div>
                          <p className="text-sm">{opt.label}</p>
                          <p className="text-[10px] text-zinc-500">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                {[
                  { name: "NexusOS API Key", key: "nxs_sk_****...7f3a", created: "Jul 15, 2026" },
                  { name: "Webhook Secret", key: "whsec_****...9b2e", created: "Jul 10, 2026" },
                ].map((apiKey) => (
                  <div key={apiKey.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-sm font-medium">{apiKey.name}</p>
                      <p className="text-xs text-zinc-600 font-mono">{apiKey.key}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600">{apiKey.created}</span>
                      <button className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10">Revoke</button>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  + Generate new API key
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Billing</h2>
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-zinc-500">Current plan</p>
                    <p className="text-2xl font-bold gradient-text">Pro</p>
                  </div>
                  <span className="text-3xl font-bold">$29<span className="text-sm text-zinc-500 font-normal">/mo</span></span>
                </div>
                <div className="text-xs text-zinc-500 mb-4">Next billing date: August 1, 2026</div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-colors">Upgrade to Enterprise</button>
                  <button className="px-4 py-2 rounded-lg text-zinc-500 text-sm hover:bg-white/5 transition-colors">Manage Billing</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
