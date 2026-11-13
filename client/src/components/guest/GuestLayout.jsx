import { PerspectiveText3D, GlowHoverCard, BorderBeam } from '@/components/ui/smoothui';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Camera,
  Layers,
  Languages,
  BookOpen,
  Bot,
  Users,
  MessageSquare,
  ArrowRight,
  LogOut,
  UserCheck,
  Shield,
  Gauge,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import { sessionManager } from "@/services/auth/sessionManager";

export const GUEST_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/guest/dashboard", icon: Gauge },
  { id: "sign-to-text", label: "Sign-to-Text", path: "/guest/sign-to-text", icon: Camera },
  { id: "text-to-sign", label: "Text-to-Sign", path: "/guest/text-to-sign", icon: Layers },
  { id: "translate", label: "Universal Translate", path: "/guest/translate", icon: Languages },
  { id: "explorer", label: "ISL Explorer", path: "/guest/explorer", icon: BookOpen },
  { id: "ai-assistant", label: "Hastivo AI", path: "/guest/ai-assistant", icon: Bot },
  { id: "community", label: "Community", path: "/guest/community", icon: Users },
  { id: "reviews", label: "Reviews & Feedback", path: "/guest/reviews", icon: MessageSquare },
];

export function GuestLayout({
  children,
  activeId = "dashboard",
  title = "Guest Hub",
  subtitle = "Permitted Guest Experience with Continuous Upgrade Path",
  usageLimits = null,
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(() => sessionManager.getUser());

  useEffect(() => {
    return sessionManager.subscribe((user) => setSession(user));
  }, []);

  const handleSignOut = () => {
    sessionManager.clearSession();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden font-body selection:bg-coral selection:text-charcoal">
      {/* Ambient Aurora Transmission Effect */}
      <div className="aurora-glow -top-32 -left-32 w-[600px] h-[600px]" />
      <div className="aurora-glow -bottom-40 -right-40 w-[650px] h-[650px] animation-delay-4000" />

      {/* Cinematic Logo-to-Sidebar Morphing Container */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border/80 bg-background/80 backdrop-blur-xl z-30 shrink-0 select-none">
        {/* Brand & Entrance Morph Anchor */}
        <div className="p-6 border-b border-border/60">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              layoutId="hastivo-brandmark-hero"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <BrandMark size={32} />
            </motion.div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground block leading-none">
                Hastivo
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-coral">
                Guest Citizen
              </span>
            </div>
          </Link>
        </div>

        {/* Guest Status Banner */}
        <div className="mx-4 my-4 p-3.5 rounded-xl border border-coral/30 bg-coral/5 text-xs space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5 text-coral font-medium">
              <Shield size={13} /> Guest Session
            </span>
            <span className="px-1.5 py-0.5 rounded bg-coral/20 text-coral text-[10px] font-bold">
              Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Your guest work is stored on this device. Upgrade to retain all data permanently with Google.
          </p>
          <Link
            to="/upgrade-account"
            className="w-full mt-1.5 py-1.5 px-2.5 rounded-lg bg-coral text-charcoal font-medium text-[11px] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <UserCheck size={13} />
            Upgrade to Permanent
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {GUEST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-foreground text-background shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <Icon size={17} className={isActive ? "text-background" : "text-blue"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls inside sidebar */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs font-mono">
          <ThemeSwitch />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-coral transition-colors"
            title="End guest session"
          >
            <LogOut size={15} />
            <span>Exit</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark size={26} />
          <span className="font-display text-xl font-bold">Hastivo</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-5 py-4 space-y-2 z-40"
          >
            {GUEST_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    activeId === item.id ? "bg-foreground text-background font-semibold" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/50">
              <Link
                to="/upgrade-account"
                className="w-full py-2 px-3 rounded-lg bg-coral text-charcoal font-medium text-xs flex items-center justify-center gap-2"
              >
                <UserCheck size={14} /> Upgrade Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content View Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
        {/* Top Breadcrumb Bar */}
        <div className="border-b border-border/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-background/50 backdrop-blur-xs">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/upgrade-account"
              className="px-3.5 py-1.5 rounded-lg border border-coral/40 bg-coral/10 hover:bg-coral/20 text-coral font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles size={14} />
              <span>Save & Upgrade With Google</span>
            </Link>
          </div>
        </div>

        {/* Children Page View */}
        <div className="flex-1 p-5 sm:p-8 max-w-[1400px] w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}

