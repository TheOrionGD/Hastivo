import { ArcadePixel, GravityLetters, SmoothButton } from "@/components/ui/smoothui";
import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  RadioTower,
  Home,
  RotateCcw,
  LogIn,
  ArrowLeft,
  Terminal,
} from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";

export interface ErrorPageProps {
  code?: string;
  routeInfo?: string;
  errorDetails?: string | null;
  onRetry?: () => void;
}

const ERROR_CONFIGS: Record<
  string,
  {
    code: string;
    title: string;
    headline: string;
    description: string;
    icon: typeof ServerCrash;
    badgeColor: string;
    showLogin: boolean;
  }
> = {
  403: {
    code: "403",
    title: "Access Forbidden",
    headline: "Restricted Zone",
    description:
      "You do not possess the required security clearances or authentication credentials to view this area.",
    icon: ShieldAlert,
    badgeColor: "bg-coral/15 text-coral border-coral/30",
    showLogin: true,
  },
  404: {
    code: "404",
    title: "Page Not Found",
    headline: "Lost in Sign Space",
    description:
      "The page, translation gloss, or spatial session you are looking for does not exist or has been relocated.",
    icon: FileQuestion,
    badgeColor: "bg-yellow/15 text-yellow border-yellow/30",
    showLogin: false,
  },
  500: {
    code: "500",
    title: "Internal Server Error",
    headline: "System Encountered an Error",
    description:
      "Our backend synthesis cluster encountered an unexpected condition while processing your request.",
    icon: ServerCrash,
    badgeColor: "bg-coral/20 text-coral border-coral/40",
    showLogin: false,
  },
  503: {
    code: "503",
    title: "Service Unavailable",
    headline: "Cluster Temporarily Offline",
    description:
      "The real-time computer vision or 3D kinematics microservice is currently undergoing maintenance or capacity scaling.",
    icon: RadioTower,
    badgeColor: "bg-blue/15 text-blue border-blue/30",
    showLogin: false,
  },
};

/**
 * 12. ERROR PAGES
 * - FETCH: Error code, route information and relevant error details.
 * - DISPLAY: 403, 404, 500 or service unavailable message.
 * - INPUT: Retry, return home, login or navigate back.
 */
export default function ErrorPage({
  code = "404",
  routeInfo = "",
  errorDetails = null,
  onRetry,
}: ErrorPageProps) {
  const router = useRouter();

  const normalizedCode = String(code || "404").trim();
  const config = ERROR_CONFIGS[normalizedCode] || {
    code: normalizedCode,
    title: "Unexpected Error",
    headline: "An Error Occurred",
    description: "An unexpected condition interrupted the translation flow.",
    icon: ServerCrash,
    badgeColor: "bg-coral/20 text-coral border-coral/40",
    showLogin: false,
  };

  const Icon = config.icon;
  const currentPath =
    routeInfo ||
    (typeof window !== "undefined" ? window.location.pathname + window.location.search : "");

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleNavigateBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col justify-between selection:bg-coral selection:text-charcoal relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[50vmin] w-[50vmin] rounded-full blur-[100px] opacity-20"
        style={{
          background:
            normalizedCode === "404"
              ? "radial-gradient(circle, var(--brand-blue), transparent 70%)"
              : normalizedCode === "503"
                ? "radial-gradient(circle, var(--brand-yellow), transparent 70%)"
                : "radial-gradient(circle, var(--brand-coral), transparent 70%)",
        }}
      />

      {/* Top Header */}
      <header className="border-b border-border/80 px-5 py-4 sm:px-10 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-md z-30">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark size={28} />
          <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/accessibility"
            className="text-xs font-mono text-muted-foreground hover:text-foreground hidden sm:inline"
          >
            Accessibility
          </Link>
          <ThemeSwitch />
        </div>
      </header>

      {/* Center Error Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="max-w-xl w-full mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider mb-6"
            style={{ borderColor: "var(--glass-border)", background: "var(--glass)" }}
          >
            <Icon size={16} className="text-coral" />
            <span>HTTP {config.code}</span>
            <span className="opacity-40">&bull;</span>
            <span>{config.title}</span>
          </motion.div>

          {/* Giant Display Code */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-7xl sm:text-8xl md:text-9xl font-semibold tracking-tighter text-foreground"
          >
            {config.code}
          </motion.h1>

          {/* Headline & Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 space-y-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              {config.headline}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              {config.description}
            </p>
          </motion.div>

          {/* Route info & Error details inspection box */}
          {(currentPath || errorDetails) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 p-4 rounded-xl border border-border/80 bg-foreground/[0.02] text-left text-xs font-mono space-y-1.5 max-w-md mx-auto"
            >
              {currentPath && (
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <Terminal size={14} className="text-blue shrink-0" />
                  <span className="shrink-0 text-foreground font-semibold">Route:</span>
                  <span className="truncate text-text-2">{currentPath}</span>
                </div>
              )}
              {errorDetails && (
                <div className="text-muted-foreground pt-1 border-t border-border/50 break-words">
                  <span className="text-foreground font-semibold">Details: </span>
                  {typeof errorDetails === "string" ? errorDetails : JSON.stringify(errorDetails)}
                </div>
              )}
            </motion.div>
          )}

          {/* INPUT: Actions (Retry, Return Home, Login, Navigate Back) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {/* 1. Retry */}
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw size={16} />
              Try Again
            </button>

            {/* 2. Return Home */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium text-xs sm:text-sm transition-all"
            >
              <Home size={16} />
              Return Home
            </Link>

            {/* 3. Login (if 403 or needed) */}
            {config.showLogin && (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-blue/40 bg-blue/10 hover:bg-blue/20 text-blue font-medium text-xs sm:text-sm transition-all"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}

            {/* 4. Navigate Back */}
            <button
              type="button"
              onClick={handleNavigateBack}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Navigate Back
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="border-t border-border/80 px-5 py-4 text-center text-xs text-muted-foreground font-mono">
        Hastivo Spatial & Assistive Communication Engine &bull; System Status: Active
      </footer>
    </div>
  );
}
