import { ShineText, FocusBlurResolve, BorderBeam, CountBadge } from '@/components/ui/smoothui';
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  LayoutDashboard,
  BarChart3,
  Users,
  KeyRound,
  Bell,
  ScrollText,
  MessageSquare,
  AlertTriangle,
  FolderTree,
  Megaphone,
  Ban,
  FileQuestion,
  HelpCircle,
  Bug,
  Sparkles,
  Cpu,
  Bot,
  Sliders,
  FileCode,
  BookOpen,
  Lock,
  Server,
  Activity,
  Radio,
  Image,
  Terminal,
  ShieldCheck,
  Mail,
  Cog,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { sessionManager } from "@/services/auth/sessionManager";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";

export const ADMIN_NAV_SECTIONS = [
  {
    title: "A. Administration Overview",
    items: [
      { id: "dashboard", label: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "System Analytics", path: "/admin/analytics", icon: BarChart3 },
      { id: "users", label: "User Management", path: "/admin/users", icon: Users },
      { id: "roles", label: "Roles & Permissions", path: "/admin/roles", icon: KeyRound },
      { id: "notifications", label: "Admin Alerts", path: "/admin/notifications", icon: Bell },
      { id: "audit", label: "Audit Logs", path: "/admin/audit", icon: ScrollText },
    ],
  },
  {
    title: "B. Community Management",
    items: [
      { id: "community-overview", label: "Community Overview", path: "/admin/community-overview", icon: MessageSquare },
      { id: "moderation-queue", label: "Moderation Queue", path: "/admin/moderation-queue", icon: AlertTriangle },
      { id: "anonymous-lookup", label: "Anonymous Identity Lookup", path: "/admin/anonymous-lookup", icon: KeyRound },
      { id: "categories", label: "Category Management", path: "/admin/categories", icon: FolderTree },
      { id: "announcements", label: "Announcements", path: "/admin/announcements", icon: Megaphone },
      { id: "restrictions", label: "Community Restrictions", path: "/admin/restrictions", icon: Ban },
    ],
  },
  {
    title: "C. Review & Feedback",
    items: [
      { id: "feedback-overview", label: "Feedback Overview", path: "/admin/feedback-overview", icon: FileQuestion },
      { id: "feedback-management", label: "Feedback Submissions", path: "/admin/feedback-management", icon: HelpCircle },
      { id: "bug-reports", label: "Bug Report Details", path: "/admin/bug-reports", icon: Bug },
      { id: "feature-requests", label: "Feature Requests", path: "/admin/feature-requests", icon: Sparkles },
    ],
  },
  {
    title: "D. Hastivo AI Management",
    items: [
      { id: "ai-overview", label: "AI Operational Overview", path: "/admin/ai-overview", icon: Cpu },
      { id: "ai-monitoring", label: "Conversation Monitoring", path: "/admin/ai-monitoring", icon: Bot },
      { id: "ai-config", label: "AI Configuration & Models", path: "/admin/ai-config", icon: Sliders },
      { id: "ai-prompts", label: "Prompt Management", path: "/admin/ai-prompts", icon: FileCode },
      { id: "ai-knowledge", label: "Knowledge Management", path: "/admin/ai-knowledge", icon: BookOpen },
      { id: "ai-safety", label: "AI Safety & Rules", path: "/admin/ai-safety", icon: Lock },
    ],
  },
  {
    title: "E. System & Infrastructure",
    items: [
      { id: "service-config", label: "Service Configuration", path: "/admin/service-config", icon: Server },
      { id: "backend-health", label: "Backend Health Monitor", path: "/admin/backend-health", icon: Activity },
      { id: "websocket-monitor", label: "WebSocket Real-Time", path: "/admin/websocket-monitor", icon: Radio },
      { id: "media-management", label: "Media & Cloudinary Assets", path: "/admin/media-management", icon: Image },
      { id: "system-logs", label: "Application System Logs", path: "/admin/system-logs", icon: Terminal },
      { id: "security-logs", label: "Security & Access Logs", path: "/admin/security-logs", icon: ShieldCheck },
      { id: "email-config", label: "Email (Brevo) Service", path: "/admin/email-config", icon: Mail },
      { id: "system-settings", label: "Global System Settings", path: "/admin/system-settings", icon: Cog },
    ],
  },
];

export function AdminLayout({ children, title, subtitle, actions }) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname || "";
  const { theme, toggleTheme } = useTheme();
  const { currentLang, meta } = useLanguage();
  const [sessionUser, setSessionUser] = useState(() => sessionManager.getUser());
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    return sessionManager.subscribe((user) => setSessionUser(user));
  }, []);

  const toggleSection = (idx) => {
    setCollapsedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSignOut = () => {
    sessionManager.clearSession();
    navigate({ to: "/auth" });
  };

  return (
    <div
      dir={meta.dir}
      className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative selection:bg-coral selection:text-charcoal font-sans"
    >
      {/* Ambient Spatial Lighting */}
      <div className="aurora-glow -top-32 -left-32 w-[550px] h-[550px] pointer-events-none opacity-40" />

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-surface/85 backdrop-blur-2xl border-r border-border/80 flex flex-col shrink-0 z-30 select-none">
        {/* Admin Header */}
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-coral/20 border border-coral/40 text-coral flex items-center justify-center font-bold font-display text-lg shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold text-foreground block leading-tight">
                Hastivo Admin
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-coral font-bold block">
                Privileged Console
              </span>
            </div>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-3 hover:text-foreground hover:bg-surface border border-transparent hover:border-border/60 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-yellow" /> : <Moon className="w-4 h-4 text-blue" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {ADMIN_NAV_SECTIONS.map((section, sIdx) => {
            const isCollapsed = collapsedSections[sIdx];
            return (
              <div key={sIdx} className="space-y-1">
                <button
                  onClick={() => toggleSection(sIdx)}
                  className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-3 px-2 py-1 hover:text-foreground transition-colors"
                >
                  <span>{section.title}</span>
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pt-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPath === item.path;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-coral/15 text-coral font-bold border border-coral/30 shadow-sm"
                              : "text-text-2 hover:text-foreground hover:bg-surface/60"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Admin User Footer Profile */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-surface/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-coral/20 text-coral border border-coral/30 flex items-center justify-center font-bold text-xs uppercase">
              {sessionUser?.displayName?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-foreground block truncate">
                {sessionUser?.displayName || "Administrator"}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">Role: Superadmin</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-text-3 hover:text-coral hover:bg-surface transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 w-full bg-surface/75 backdrop-blur-xl border-b border-border/70 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              <ShineText text={title || "Admin Workspace"} />
            </h1>
            {subtitle && (
              <p className="font-sans text-xs text-text-3 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <Link
              to="/hastivo/dashboard"
              className="text-xs text-blue hover:underline font-medium px-3 py-1.5 rounded-xl border border-blue/30 bg-blue/10"
            >
              Exit to User Workspace →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

