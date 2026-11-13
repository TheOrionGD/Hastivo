import { ShineText, DigitRoll, NumberFlow, ContributionGraph, DitherChart, ScrollableCardStack } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Video,
  Camera,
  Layers,
  Languages,
  Mic,
  BookOpen,
  Bot,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  History,
  AlertCircle,
  Globe,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { sessionManager } from "@/services/auth/sessionManager";
import { useLanguage } from "@/hooks/useLanguage";

export default function HastivoDashboardPage() {
  const { currentLang, changeLanguage, t, meta, supportedLanguages } = useLanguage();
  const [profile, setProfile] = useState(() => sessionManager.getUser());
  const [recentHistory, setRecentHistory] = useState([]);
  const [servicesStatus, setServicesStatus] = useState({
    signRecognition: "checking",
    textToSign: "checking",
    hastivoAI: "checking",
    videoProcessor: "checking",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Fetch user profile and history
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.user) {
          setProfile(data.user);
          sessionManager.setSession(sessionManager.getToken() || "", data.user);
        }
      })
      .catch(() => {});

    // Fetch recent translation history
    fetch("/api/v1/conversations/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.history) {
          setRecentHistory(data.history.slice(0, 5));
        }
      })
      .catch(() => {});

    // Live health check
    fetch("/api/v1/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active) {
          setServicesStatus({
            signRecognition: res?.services?.computerVision || "operational",
            textToSign: res?.services?.aiService || "operational",
            hastivoAI: res?.services?.aiService || "operational",
            videoProcessor: "operational",
          });
        }
      })
      .catch(() => {
        if (active) {
          setServicesStatus({
            signRecognition: "offline",
            textToSign: "offline",
            hastivoAI: "offline",
            videoProcessor: "offline",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayName = profile?.displayName || profile?.username || "Hastivo User";

  return (
    <HastivoUserLayout
      title="Workspace"
      subtitle={t.workspaceSubtitle}
      actions={
        <div className="flex items-center gap-1.5 bg-surface/60 border border-border/70 rounded-2xl p-1 px-2.5">
          <Globe className="w-3.5 h-3.5 text-coral" />
          <select
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-xs text-foreground font-medium outline-none cursor-pointer"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code} className="bg-surface text-foreground">
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Welcome Hero Banner with Staggered Fade & Depth Zoom */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-coral/15 text-coral text-xs font-semibold uppercase tracking-wider border border-coral/30">
              {meta.greeting}
            </span>
            <span className="text-xs text-text-3">• {meta.nativeName} ({meta.script} script)</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          {t.welcomeTitle}, <span className="text-coral">{displayName}</span>.
        </h1>
          <p className="font-sans text-base sm:text-lg text-text-2 mt-2 max-w-2xl">
            {meta.welcome}. Access your sign-language studio, prerecorded video processing, real-time conversation, and assistive AI engine.
          </p>
        </motion.div>
      </section>

      {/* Featured Studio Modules Grid with Staggered 40ms Entrances */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Communication & Video Studios
          </h2>
          <span className="text-xs font-sans text-text-3">Full Studio Suite</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Processing Studio (C18) */}
          <GlassCard
            accent="coral"
            className="flex flex-col justify-between group hover:border-coral transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-coral/20 text-coral flex items-center justify-center border border-coral/30">
                  <Video className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-coral text-charcoal text-[11px] font-bold">
                  Bi-Directional Video
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-coral transition-colors">
                Video Processing Studio
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                {t.videoStudioDesc}
              </p>
            </div>
            <Link to="/hastivo/video-studio" className="w-full">
              <GlassButton variant="primary" className="w-full">
                Open Studio <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Sign-to-Text Studio (C01) */}
          <GlassCard
            accent="blue"
            className="flex flex-col justify-between group hover:border-blue transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue/20 text-blue flex items-center justify-center border border-blue/30">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs text-text-3">Real-Time Camera</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-blue transition-colors">
                Sign-to-Text Studio
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                {t.signToTextDesc}
              </p>
            </div>
            <Link to="/hastivo/sign-to-text" className="w-full">
              <GlassButton variant="secondary" className="w-full">
                Launch Camera <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Text-to-Sign Studio (C02) */}
          <GlassCard
            className="flex flex-col justify-between group hover:border-yellow/70 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow/20 text-yellow flex items-center justify-center border border-yellow/30">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs text-text-3">Three.js 3D Avatar</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-yellow transition-colors">
                Text-to-Sign Studio
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                {t.textToSignDesc}
              </p>
            </div>
            <Link to="/hastivo/text-to-sign" className="w-full">
              <GlassButton variant="glass" className="w-full">
                Animate Avatar <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Real-Time Conversation (C03) */}
          <GlassCard className="flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-surface text-foreground flex items-center justify-center border border-border/80 mb-4">
                <Users className="w-6 h-6 text-coral" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                Real-Time Conversation
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                Two-way live communication bridging Deaf signing participants and hearing speech participants.
              </p>
            </div>
            <Link to="/hastivo/conversation" className="w-full">
              <GlassButton variant="glass" className="w-full">
                Join Room <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Hastivo AI Chat (C10) */}
          <GlassCard className="flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-coral/20 to-blue/20 text-coral flex items-center justify-center border border-border/80 mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                Hastivo AI Assistant
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                Multimodal AI chat supporting Text, Live Sign, and Voice inputs through a unified conversation engine.
              </p>
            </div>
            <Link to="/hastivo/ai" className="w-full">
              <GlassButton variant="glass" className="w-full">
                Chat with AI <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>

          {/* Speech Studio (C05) */}
          <GlassCard className="flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-surface text-blue flex items-center justify-center border border-border/80 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                Speech Studio
              </h3>
              <p className="font-sans text-sm text-text-2 mb-4">
                Audio waveform visualization, speech-to-text recognition, and expressive text-to-speech voice playback.
              </p>
            </div>
            <Link to="/hastivo/speech" className="w-full">
              <GlassButton variant="glass" className="w-full">
                Open Studio <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Activity & Service Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent History Panel */}
        <div className="lg:col-span-2">
          <GlassPanel elevation="z2" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-coral" /> Recent Activity
              </h3>
              <Link
                to="/hastivo/history"
                className="text-xs text-blue hover:underline font-medium"
              >
                View All History
              </Link>
            </div>

            {recentHistory.length === 0 ? (
              <div className="py-8 text-center text-text-3 font-sans text-sm">
                No recent translations or video sessions found. Start a new session from the studios above.
              </div>
            ) : (
              <div className="space-y-3">
                {recentHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-surface/50 border border-border/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {item.title || item.originalText || "Translation Session"}
                      </p>
                      <span className="text-xs text-text-3">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface text-text-2 text-xs border border-border">
                      {item.type || "ISL"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Live Service Availability Panel */}
        <div>
          <GlassPanel elevation="z2" className="p-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue" /> System Status
            </h3>

            <div className="space-y-3 font-sans text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface/40 border border-border/50">
                <span className="text-text-2">CV Sign Recognition</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {servicesStatus.signRecognition}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface/40 border border-border/50">
                <span className="text-text-2">3D Avatar Engine</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {servicesStatus.textToSign}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface/40 border border-border/50">
                <span className="text-text-2">Hastivo AI Core</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {servicesStatus.hastivoAI}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface/40 border border-border/50">
                <span className="text-text-2">Video BiLSTM Pipeline</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {servicesStatus.videoProcessor}
                </span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}
