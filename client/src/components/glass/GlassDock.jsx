import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  Layers,
  Video,
  Languages,
  Mic,
  BookOpen,
  History,
  Bot,
  Users,
  MessageSquare,
  Bookmark,
  Activity,
  User,
  Settings,
  Bell,
  Search,
  Sparkles,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export function GlassDock({ onOpenCommandPalette, unreadCount = 0 }) {
  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname || "";
  const [hoveredItem, setHoveredItem] = useState(null);
  const { t } = useLanguage();

  const dockItems = [
    { id: "dashboard", label: t.dashboard, path: "/hastivo/dashboard", icon: LayoutDashboard },
    { id: "video-studio", label: t.videoStudio, path: "/hastivo/video-studio", icon: Video, badge: "New" },
    { id: "sign-to-text", label: t.signToText, path: "/hastivo/sign-to-text", icon: Camera },
    { id: "text-to-sign", label: t.textToSign, path: "/hastivo/text-to-sign", icon: Layers },
    { id: "conversation", label: t.conversation, path: "/hastivo/conversation", icon: Users },
    { id: "translation", label: t.translation, path: "/hastivo/translation", icon: Languages },
    { id: "speech", label: t.speech, path: "/hastivo/speech", icon: Mic },
    { id: "explorer", label: t.explorer, path: "/hastivo/explorer", icon: BookOpen },
    { id: "history", label: t.history, path: "/hastivo/history", icon: History },
    { id: "ai", label: t.ai, path: "/hastivo/ai", icon: Bot },
    { id: "community", label: t.community, path: "/hastivo/community", icon: Users },
    { id: "reviews", label: t.reviews, path: "/hastivo/reviews", icon: MessageSquare },
    { id: "saved", label: t.saved, path: "/hastivo/saved", icon: Bookmark },
    { id: "profile", label: t.profile, path: "/hastivo/profile", icon: User },
    { id: "settings", label: t.settings, path: "/hastivo/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Floating Spatial Dock (Bottom Centered) */}
      <nav
        aria-label="Spatial navigation dock"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden lg:flex items-center"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1.5 p-2 rounded-3xl bg-surface/85 backdrop-blur-2xl border border-border/80 shadow-2xl shadow-charcoal/20 ring-1 ring-border/50"
        >
          {/* Brand Icon Anchor */}
          <Link
            to="/hastivo/dashboard"
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-coral to-coral/80 text-charcoal font-display font-bold text-lg shadow-md hover:scale-105 active:scale-95 transition-transform mr-1"
            title="Hastivo Workspace"
          >
            H
          </Link>

          <div className="w-[1px] h-6 bg-border/60 mx-1" />

          {/* Dock Links */}
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue",
                    isActive
                      ? "bg-coral/20 text-coral shadow-inner border border-coral/30"
                      : "text-text-2 hover:text-foreground hover:bg-surface/60"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-transform duration-200", isHovered && "scale-115")} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-coral text-charcoal text-[9px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="dock-active-dot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-coral"
                    />
                  )}
                </Link>

                {/* Floating Tooltip Label with Localized Text */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: -44, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-charcoal text-white text-xs font-sans whitespace-nowrap shadow-lg pointer-events-none z-50 border border-white/10"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="w-[1px] h-6 bg-border/60 mx-1" />

          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center justify-center w-10 h-10 rounded-2xl text-text-2 hover:text-foreground hover:bg-surface/60 transition-colors"
              title="Global Command Palette (Cmd+K)"
            >
              <Command className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <nav
        aria-label="Mobile navigation bar"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/90 backdrop-blur-2xl border-t border-border/80 px-4 py-2 flex items-center justify-around shadow-2xl"
      >
        {[
          dockItems[0], // Dashboard
          dockItems[1], // Video Studio
          dockItems[2], // Sign-to-Text
          dockItems[9], // AI
          dockItems[10], // Community
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors",
                isActive ? "text-coral" : "text-text-3 hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default GlassDock;
