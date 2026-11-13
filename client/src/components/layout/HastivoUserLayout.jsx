import { RevealText, SoftBlurIn, BorderBeam, DynamicIsland } from '@/components/ui/smoothui';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  CheckCircle,
  Menu,
  X,
  Command,
  Globe,
} from "lucide-react";
import { GlassDock } from "@/components/glass/GlassDock";
import { CinematicEntrance } from "@/components/common/CinematicEntrance";
import { sessionManager } from "@/services/auth/sessionManager";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";

export function HastivoUserLayout({
  children,
  title,
  subtitle,
  actions,
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentLang, changeLanguage, meta, supportedLanguages, t } = useLanguage();
  const [sessionUser, setSessionUser] = useState(() => sessionManager.getUser());
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    return sessionManager.subscribe((user) => setSessionUser(user));
  }, []);

  // Fetch real unread notification count
  useEffect(() => {
    let active = true;
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {});

    fetch("/api/v1/conversations/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.unreadCount) {
          setUnreadNotifications(data.unreadCount);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = () => {
    sessionManager.clearSession();
    navigate({ to: "/auth" });
  };

  return (
    <div
      dir={meta.dir}
      className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden selection:bg-coral selection:text-charcoal font-sans pb-24 lg:pb-28"
    >
      {/* 6-Stage Logo-to-Dock Cinematic Entrance */}
      <CinematicEntrance />

      {/* Spatial Aurora Ambient Glows */}
      <div className="aurora-glow -top-40 -left-40 w-[600px] h-[600px] pointer-events-none" />
      <div className="aurora-glow -bottom-40 -right-40 w-[700px] h-[700px] pointer-events-none" />

      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 w-full bg-surface/75 backdrop-blur-xl border-b border-border/70 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        {/* Brand & Page Context */}
        <div className="flex items-center gap-4">
          <Link
            to="/hastivo/dashboard"
            className="flex items-center gap-2.5 group outline-none"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-coral to-coral/80 text-charcoal font-display text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg font-bold tracking-tight block leading-none">
                Hastivo
              </span>
              <span className="font-sans text-[10px] tracking-widest uppercase text-text-3 block mt-0.5">
                {meta.nativeName} ({meta.name})
              </span>
            </div>
          </Link>

          {(title || subtitle) && (
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border/60">
              {title && (
                <span className="font-heading text-base font-semibold text-foreground">
                  <RevealText text={title} />
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-text-3 font-sans">• {subtitle}</span>
              )}
            </div>
          )}
        </div>

        {/* Global Controls & User Chip */}
        <div className="flex items-center gap-3">
          {actions && <div className="flex items-center gap-2 mr-2">{actions}</div>}

          {/* Global System Multilingual Language Selector */}
          <div className="flex items-center gap-1.5 bg-surface/60 border border-border/70 rounded-2xl p-1 px-2.5 hover:border-coral/50 transition-colors">
            <Globe className="w-3.5 h-3.5 text-coral shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-xs text-foreground font-medium outline-none cursor-pointer"
              title="Select System Language"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-surface text-foreground">
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-2 hover:text-foreground hover:bg-surface/80 border border-transparent hover:border-border/60 transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-yellow" /> : <Moon className="w-4 h-4 text-blue" />}
          </button>

          {/* Notifications */}
          <Link
            to="/hastivo/notifications"
            className="relative p-2 rounded-xl text-text-2 hover:text-foreground hover:bg-surface/80 border border-transparent hover:border-border/60 transition-all"
            title={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral animate-pulse" />
            )}
          </Link>

          {/* User Profile / Status */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-border/60">
            <Link
              to="/hastivo/profile"
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-2xl bg-surface/60 hover:bg-surface border border-border/70 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue to-coral flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {sessionUser?.displayName?.[0] || sessionUser?.username?.[0] || "U"}
              </div>
              <span className="text-xs font-medium max-w-[100px] truncate">
                {sessionUser?.displayName || sessionUser?.username || "User"}
              </span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-text-3 hover:text-coral hover:bg-surface/80 transition-colors"
              title={t.signOut}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        {children}
      </main>

      {/* Floating Spatial Dock */}
      <GlassDock unreadCount={unreadNotifications} />
    </div>
  );
}

export default HastivoUserLayout;
