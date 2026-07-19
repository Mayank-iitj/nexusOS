"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, FolderOpen, Tag, Bot, Clock, LayoutGrid, List, Plus, File, Sheet, Presentation, FileImage } from "lucide-react";

const DOCUMENTS = [
  { id: "1", title: "Product Roadmap Q3 2026", type: "doc", folder: "Strategy", tags: ["roadmap", "planning"], updated: "Jul 18", icon: FileText, color: "#4285f4", summary: "Q3 roadmap covering AI agent expansion, enterprise features, and scaling infrastructure" },
  { id: "2", title: "API Design Specification", type: "doc", folder: "Engineering", tags: ["api", "technical"], updated: "Jul 17", icon: FileText, color: "#4285f4", summary: "OpenAPI spec for v1 endpoints" },
  { id: "3", title: "Client Proposal - Acme Corp", type: "pdf", folder: "Sales", tags: ["proposal", "client"], updated: "Jul 16", icon: File, color: "#ef4444", summary: "Enterprise deployment proposal" },
  { id: "4", title: "Sprint Retrospective Notes", type: "note", folder: "Engineering", tags: ["sprint"], updated: "Jul 15", icon: FileText, color: "#8b5cf6", summary: "Sprint 23 retro highlights" },
  { id: "5", title: "Revenue Projections 2026", type: "sheet", folder: "Finance", tags: ["finance"], updated: "Jul 14", icon: Sheet, color: "#0f9d58", summary: "Projected ARR of $2.4M by Q4" },
  { id: "6", title: "Investor Pitch Deck", type: "presentation", folder: "Sales", tags: ["investors"], updated: "Jul 13", icon: Presentation, color: "#f59e0b", summary: "Series A fundraising deck" },
  { id: "7", title: "Brand Guidelines", type: "doc", folder: "Design", tags: ["brand", "design"], updated: "Jul 12", icon: FileImage, color: "#ec4899", summary: "Color palette, typography, logo usage" },
  { id: "8", title: "Security Audit Report", type: "pdf", folder: "Engineering", tags: ["security"], updated: "Jul 11", icon: File, color: "#ef4444", summary: "Q2 penetration test results" },
];

const FOLDERS = ["All", "Strategy", "Engineering", "Sales", "Finance", "Design"];

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = DOCUMENTS.filter((d) => {
    const matchFolder = activeFolder === "All" || d.folder === activeFolder;
    const matchQuery = !query || d.title.toLowerCase().includes(query.toLowerCase()) || d.summary.toLowerCase().includes(query.toLowerCase());
    return matchFolder && matchQuery;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Documents
          </h1>
          <p className="text-sm text-zinc-500 mt-1">8 documents across 5 folders</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents with AI..."
            className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none flex-1"
          />
          <Bot className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex items-center glass-card rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-white/10 text-white" : "text-zinc-500"}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-white/10 text-white" : "text-zinc-500"}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Folders */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {FOLDERS.map((folder) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeFolder === folder ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            {folder}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {view === "grid" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 cursor-pointer group hover:border-indigo-500/20"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${doc.color}15` }}>
                <doc.icon className="w-5 h-5" style={{ color: doc.color }} />
              </div>
              <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-white transition-colors">{doc.title}</h3>
              <p className="text-[11px] text-zinc-600 line-clamp-2 mb-3">{doc.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-600 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{doc.updated}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="glass-card rounded-xl overflow-hidden">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${doc.color}15` }}>
                <doc.icon className="w-4 h-4" style={{ color: doc.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                <p className="text-[11px] text-zinc-500">{doc.folder} · {doc.type}</p>
              </div>
              <div className="flex items-center gap-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{tag}</span>
                ))}
              </div>
              <span className="text-xs text-zinc-600 shrink-0">{doc.updated}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
