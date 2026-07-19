"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Workflow,
  Shield,
  Mail,
  Calendar,
  GitBranch,
  FileText,
  Video,
  Presentation,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  ChevronRight,
  Globe,
  Clock,
  Target,
  Layers,
  Bot,
  CircuitBoard,
  Menu,
  X,
} from "lucide-react";

/* ──────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
];

const TYPEWRITER_GOALS = [
  "Prepare tomorrow's client meeting.",
  "Plan next week's sprint.",
  "Prepare investor update.",
  "Generate project roadmap.",
  "Review GitHub progress.",
  "Create meeting summary.",
  "Schedule client demo.",
];

const FEATURES = [
  {
    icon: Brain,
    title: "Multi-Agent AI",
    description:
      "14 specialized agents collaborate to execute complex workflows autonomously.",
    color: "#8b5cf6",
  },
  {
    icon: Target,
    title: "Goal-Driven Execution",
    description:
      "Describe your goal in natural language. NexusOS plans, delegates, and executes.",
    color: "#06b6d4",
  },
  {
    icon: Workflow,
    title: "Visual Workflows",
    description:
      "Build automations visually with our node-based workflow builder.",
    color: "#10b981",
  },
  {
    icon: Layers,
    title: "Deep Memory",
    description:
      "Semantic, procedural, and conversational memory for context-aware AI.",
    color: "#f59e0b",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "RBAC, OAuth, encrypted secrets, audit logs, and action confirmations.",
    color: "#ef4444",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "Watch agent execution in real-time with live streaming responses.",
    color: "#ec4899",
  },
];

const AGENTS = [
  { name: "Executive", icon: "👑", color: "#8b5cf6", desc: "Plans & orchestrates" },
  { name: "Planner", icon: "🗺️", color: "#06b6d4", desc: "Roadmaps & timelines" },
  { name: "Email", icon: "📧", color: "#ef4444", desc: "Gmail operations" },
  { name: "Calendar", icon: "📅", color: "#3b82f6", desc: "Schedule management" },
  { name: "Drive", icon: "📁", color: "#f59e0b", desc: "File search & read" },
  { name: "GitHub", icon: "🐙", color: "#6366f1", desc: "Repos & PRs" },
  { name: "Meeting", icon: "🎥", color: "#10b981", desc: "Agendas & notes" },
  { name: "Slack", icon: "💬", color: "#e11d48", desc: "Messages & threads" },
  { name: "Jira", icon: "📋", color: "#0ea5e9", desc: "Tickets & sprints" },
  { name: "Notion", icon: "📝", color: "#78716c", desc: "Docs & databases" },
  { name: "Presentation", icon: "📊", color: "#f97316", desc: "Slides & charts" },
  { name: "Memory", icon: "🧠", color: "#ec4899", desc: "Context & learning" },
  { name: "Workflow", icon: "⚡", color: "#a855f7", desc: "Cross-app chains" },
  { name: "Analytics", icon: "📈", color: "#14b8a6", desc: "Productivity metrics" },
];

const INTEGRATIONS = [
  { name: "Gmail", color: "#ea4335" },
  { name: "Calendar", color: "#4285f4" },
  { name: "Drive", color: "#0f9d58" },
  { name: "GitHub", color: "#6e40c9" },
  { name: "Slack", color: "#e01e5a" },
  { name: "Jira", color: "#0052cc" },
  { name: "Notion", color: "#ffffff" },
  { name: "Zoom", color: "#2d8cff" },
  { name: "Docs", color: "#4285f4" },
  { name: "Sheets", color: "#0f9d58" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "VP of Engineering, TechCorp",
    text: "NexusOS reduced our context switching by 73%. Our team saves 14+ hours per week on repetitive workflows.",
    avatar: "SC",
  },
  {
    name: "Marcus Williams",
    role: "Product Lead, InnovateLabs",
    text: "The multi-agent system is incredible. I just say 'prepare the board meeting' and everything happens automatically.",
    avatar: "MW",
  },
  {
    name: "Priya Patel",
    role: "CTO, DataFlow",
    text: "Finally, an AI tool that actually executes. Not just answers questions but gets real work done across all our apps.",
    avatar: "PP",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals getting started",
    features: [
      "5 AI goals per day",
      "3 integrations",
      "Basic memory",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For power users and small teams",
    features: [
      "Unlimited AI goals",
      "All integrations",
      "Advanced memory & RAG",
      "Visual workflow builder",
      "Priority support",
      "Custom agents",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Audit logs & RBAC",
      "Dedicated support",
      "SLA guarantees",
      "On-premise deployment",
      "Custom AI models",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

/* ──────────────────────────────────────────────
   TYPEWRITER HOOK
   ────────────────────────────────────────────── */

function useTypewriter(words: string[], typingSpeed = 60, deletingSpeed = 30, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentWord.slice(0, text.length + 1));
          if (text.length === currentWord.length) {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          setText(currentWord.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

/* ──────────────────────────────────────────────
   FLOATING PARTICLES
   ────────────────────────────────────────────── */

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map(() => ({
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        background: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 2,
      }))
    );
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.width,
            height: p.height,
            background: p.background,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   LANDING PAGE
   ────────────────────────────────────────────── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const typedGoal = useTypewriter(TYPEWRITER_GOALS);

  return (
    <div className="min-h-screen gradient-bg-animated">
      {/* ── Navbar ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <CircuitBoard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Nexus<span className="gradient-text">OS</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong border-t border-white/5"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <a key={item.label} href={item.href} className="text-sm text-zinc-400 py-2">
                    {item.label}
                  </a>
                ))}
                <Link
                  href="/dashboard"
                  className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center mt-2"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero Section ───────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <FloatingParticles />

        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm text-zinc-300 mb-8">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Powered by Multi-Agent AI</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              One Goal. One Prompt.
              <br />
              <span className="gradient-text">Infinite Productivity.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              NexusOS is an AI Operating System that autonomously orchestrates
              work across Gmail, Calendar, Drive, Slack, GitHub, Notion, and
              more. Just describe your goal.
            </p>

            {/* Typewriter Demo */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-zinc-300 text-lg">
                    {typedGoal}
                    <span className="animate-pulse text-indigo-400">|</span>
                  </span>
                </div>
                <button className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition-colors">
                  Execute
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:from-indigo-400 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Start Building
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-zinc-300 font-medium text-lg hover:bg-white/5 transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 text-center">
              {[
                { value: "14", label: "AI Agents" },
                { value: "10+", label: "Integrations" },
                { value: "96%", label: "Success Rate" },
                { value: "14h", label: "Saved / Week" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ───────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">automate work</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Stop switching between apps. Let AI handle the orchestration while
              you focus on what matters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${feature.color}20` }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Demo Section ──────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See the <span className="gradient-text">magic</span> in action
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              &quot;Prepare tomorrow&apos;s client meeting&quot; — watch NexusOS
              orchestrate 7 agents in real-time.
            </p>
          </motion.div>

          {/* Execution Pipeline Visualization */}
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-3">
              {[
                { agent: "Email Agent", action: "Read 5 client emails", status: "done", icon: Mail, color: "#ef4444" },
                { agent: "Calendar Agent", action: "Check tomorrow's schedule", status: "done", icon: Calendar, color: "#3b82f6" },
                { agent: "Drive Agent", action: "Find project documents", status: "done", icon: FileText, color: "#f59e0b" },
                { agent: "GitHub Agent", action: "Review recent PRs & issues", status: "done", icon: GitBranch, color: "#6366f1" },
                { agent: "Meeting Agent", action: "Generate meeting agenda", status: "active", icon: Video, color: "#10b981" },
                { agent: "Presentation Agent", action: "Create slide deck", status: "pending", icon: Presentation, color: "#f97316" },
                { agent: "Calendar Agent", action: "Schedule & send invites", status: "pending", icon: Calendar, color: "#3b82f6" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    step.status === "active"
                      ? "glass-strong glow-border"
                      : step.status === "done"
                      ? "opacity-80"
                      : "opacity-40"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${step.color}20` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{step.agent}</div>
                    <div className="text-xs text-zinc-400 truncate">
                      {step.action}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {step.status === "done" && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    )}
                    {step.status === "active" && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      </div>
                    )}
                    {step.status === "pending" && (
                      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-zinc-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Agents Section ─────────────────────── */}
      <section id="agents" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">14 Specialized Agents</span>{" "}
              working for you
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Each agent is an expert in its domain, with dedicated prompts,
              tools, and memory.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card p-4 rounded-xl text-center cursor-default"
              >
                <div className="text-2xl mb-2">{agent.icon}</div>
                <div className="text-xs font-semibold mb-1">{agent.name}</div>
                <div className="text-[10px] text-zinc-500">{agent.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations Section ───────────────── */}
      <section id="integrations" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Connects to{" "}
              <span className="gradient-text">everything you use</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-12">
              Deep integrations with your entire workspace. One unified AI
              interface.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 cursor-default"
              >
                <Globe className="w-4 h-4" style={{ color: integration.color }} />
                <span className="text-sm font-medium">{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ───────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">productive teams</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent{" "}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Start free. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 relative ${
                  plan.highlighted
                    ? "glass-strong glow-border"
                    : "glass-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-zinc-500 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block text-center py-2.5 rounded-xl font-medium text-sm transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25"
                      : "border border-white/10 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to transform your{" "}
              <span className="gradient-text">productivity</span>?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have automated their workflow
              with NexusOS. Start free, no credit card required.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:from-indigo-400 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <CircuitBoard className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">
                  Nexus<span className="gradient-text">OS</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                AI Productivity Operating System.
                <br />
                One Goal. One Prompt. Infinite Productivity.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Blog", "Community"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Privacy"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              © 2026 NexusOS. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-zinc-600 hover:text-zinc-400">
                Terms
              </a>
              <a href="#" className="text-sm text-zinc-600 hover:text-zinc-400">
                Privacy
              </a>
              <a href="#" className="text-sm text-zinc-600 hover:text-zinc-400">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
