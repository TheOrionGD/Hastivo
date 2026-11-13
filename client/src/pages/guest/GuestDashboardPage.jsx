import { ShineText, DigitRoll, TiltCard, BorderBeam } from "@/components/ui/smoothui";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Gauge,
  Camera,
  Layers,
  Languages,
  BookOpen,
  Bot,
  Users,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  RadioTower,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";

export default function GuestDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH: Public module config, guest usage limits, announcements, service availability
  useEffect(() => {
    let active = true;
    fetch("/api/v1/guest/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.success) {
          setData(res);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const limits = data?.usageLimits || {
    signToText: { used: 0, max: 10, remaining: 10 },
    textToSign: { used: 0, max: 10, remaining: 10 },
    translation: { used: 0, max: 15, remaining: 15 },
    aiChat: { used: 0, max: 8, remaining: 8 },
  };

  return (
    <GuestLayout
      activeId="dashboard"
      title="Guest Citizen Dashboard"
      subtitle="Overview of available modules, usage quotas, and live service telemetry"
    >
      {/* Cinematic Entrance Announcement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 p-6 rounded-2xl border border-coral/30 bg-gradient-to-r from-coral/10 via-blue/5 to-transparent relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-coral/20 border border-coral/40 text-coral text-xs font-mono font-medium">
                Guest Experience
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <RadioTower size={12} className="text-blue" />
                Zero-Cloud Camera Pipeline Active
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Try All Hastivo Communication Systems Freely
            </h2>
            <p className="text-xs sm:text-sm text-text-2 leading-relaxed">
              Experience real-time Sign-to-Text vision recognition, 3D Kinematic Text-to-Sign avatar playback, and
              multi-lingual ISL parsing. All progress made in this guest session can be saved permanently by linking
              your Google account.
            </p>
          </div>

          <Link
            to="/upgrade-account"
            className="shrink-0 px-5 py-3 rounded-xl bg-coral text-charcoal font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-sm transition-all"
          >
            <Sparkles size={16} />
            <span>Upgrade With Google</span>
          </Link>
        </div>
      </motion.div>

      {/* Grid of Usage Limits Enforced by Backend */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-semibold">Backend Guest Quota Status</h3>
            <p className="text-xs text-muted-foreground">
              Usage limits enforced at gateway level to guarantee high compute quality for all citizens
            </p>
          </div>
          <span className="text-xs font-mono text-blue flex items-center gap-1">
            <Clock size={13} /> Active Session Limit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Sign-to-Text Vision", key: "signToText", icon: Camera, color: "text-blue", bg: "bg-blue/10" },
            { label: "Text-to-Sign Avatar", key: "textToSign", icon: Layers, color: "text-coral", bg: "bg-coral/10" },
            { label: "Universal Translation", key: "translation", icon: Languages, color: "text-yellow", bg: "bg-yellow/10" },
            { label: "Hastivo AI Engine", key: "aiChat", icon: Bot, color: "text-blue", bg: "bg-blue/10" },
          ].map((item) => {
            const usage = limits[item.key] || { used: 0, max: 10, remaining: 10 };
            const pct = Math.round((usage.used / usage.max) * 100);
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="p-5 rounded-2xl border border-border/80 bg-foreground/[0.02] space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {usage.used} / {usage.max}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{usage.remaining} operations remaining</p>
                </div>
                <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? "bg-coral" : "bg-blue"
                      }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Modules Grid */}
      <div className="mb-10">
        <h3 className="font-display text-xl font-semibold mb-4">Available Assistive Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: "sign-to-text",
              title: "Sign-to-Text Studio",
              path: "/guest/sign-to-text",
              icon: Camera,
              desc: "Continuous camera hand landmark extraction and live ISL sentence transcription.",
              badge: "Computer Vision",
            },
            {
              id: "text-to-sign",
              title: "Text-to-Sign 3D Studio",
              path: "/guest/text-to-sign",
              icon: Layers,
              desc: "Converts text and spoken tokens into 3D avatar bone kinematics in Apple Vision Pro visual aesthetic.",
              badge: "3D Kinematics",
            },
            {
              id: "translate",
              title: "Universal Translation",
              path: "/guest/translate",
              icon: Languages,
              desc: "Multi-lingual translation bridging English, Hindi, and regional speech with ISL topic-comment grammar.",
              badge: "NLP Synthesis",
            },
            {
              id: "explorer",
              title: "ISL Vocabulary Explorer",
              path: "/guest/explorer",
              icon: BookOpen,
              desc: "Explore INCLUDE-50 vocabulary glosses, hand shapes, and 3D demonstration loops.",
              badge: "Lexicon",
            },
            {
              id: "ai-assistant",
              title: "Hastivo AI Assistant",
              path: "/guest/ai-assistant",
              icon: Bot,
              desc: "Ask linguistic, grammatical, and camera telemetry questions with live AI feedback.",
              badge: "LLM Support",
            },
            {
              id: "community",
              title: "Community & Experiences",
              path: "/guest/community",
              icon: Users,
              desc: "Browse public educational posts, community feedback, and research milestones.",
              badge: "Read Only",
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                to={mod.path}
                className="group p-6 rounded-2xl border border-border/80 bg-foreground/[0.01] hover:border-blue/50 hover:bg-foreground/[0.03] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-foreground/5 text-blue group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-border bg-foreground/5 text-muted-foreground">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground group-hover:text-blue transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-coral font-medium group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Public Announcements & Academic Verifications */}
      <div className="p-6 rounded-2xl border border-border/70 bg-foreground/[0.02]">
        <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <Info size={18} className="text-blue" />
          <span>Hastivo Announcements & Platform Standards</span>
        </h3>
        <div className="space-y-3">
          {data?.announcements?.map((ann) => (
            <div key={ann.id} className="p-4 rounded-xl border border-border/60 bg-background/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">{ann.title}</span>
                <span>{ann.date}</span>
              </div>
              <p className="text-xs text-text-2">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}

