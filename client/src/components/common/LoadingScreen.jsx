import { motion } from "framer-motion";
import { Loader2, RefreshCw, XCircle, BrainCircuit } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";

const EASE = [0.22, 1, 0.36, 1];

/**
 * 13. LOADING SCREENS
 * - FETCH: No separate business data; reflect the pending operation and its actual loading state.
 * - DISPLAY: Skeletons, progress indicators, avatar thinking state.
 * - INPUT: Cancel or retry where the operation supports it.
 */

// 1. SKELETON DISPLAY COMPONENT
export function SkeletonDisplay({ className = "", count = 3, type = "card" }) {
  if (type === "text") {
    return (
      <div className={`space-y-3 animate-pulse ${className}`} role="status" aria-label="Loading text content">
        <div className="h-4 bg-foreground/10 rounded w-3/4" />
        <div className="h-4 bg-foreground/10 rounded w-full" />
        <div className="h-4 bg-foreground/10 rounded w-5/6" />
      </div>
    );
  }

  if (type === "avatar") {
    return (
      <div className={`flex items-center gap-4 animate-pulse ${className}`} role="status" aria-label="Loading avatar">
        <div className="h-12 w-12 rounded-full bg-foreground/10" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-foreground/10 rounded w-1/3" />
          <div className="h-3 bg-foreground/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 animate-pulse ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-border bg-foreground/[0.03] space-y-3">
          <div className="h-5 bg-foreground/10 rounded w-1/3" />
          <div className="h-3 bg-foreground/10 rounded w-full" />
          <div className="h-3 bg-foreground/10 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

// 2. AVATAR THINKING STATE
export function AvatarThinkingState({
  statusText = "Synthesizing ISL Spatial Grammar...",
  subtext = "Translating speech tokens into 3D bone kinematics",
  className = "",
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-foreground/[0.02] text-center overflow-hidden ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Radial pulse animation */}
      <motion.div
        className="absolute h-40 w-40 rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 25%, transparent), transparent 70%)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mb-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="p-3.5 rounded-full border border-blue/30 bg-blue/10 text-blue shadow-sm inline-block"
        >
          <BrainCircuit size={32} />
        </motion.div>
      </div>

      {/* Floating synaptic dots */}
      <div className="flex items-center gap-1.5 mb-3 z-10">
        {[0, 1, 2].map((idx) => (
          <motion.span
            key={idx}
            className="h-2 w-2 rounded-full bg-coral"
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: idx * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-1">
        <h4 className="font-display font-medium text-base text-foreground">{statusText}</h4>
        <p className="text-xs font-mono text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}

// 3. FULL SCREEN / CONTAINER LOADING OVERLAY WITH PROGRESS & CANCEL/RETRY
export function LoadingScreen({
  isLoading = true,
  progress, // number 0 - 100 or undefined
  title = "Processing Translation...",
  description = "Synchronizing with computer vision and neural gloss engine",
  avatarThinking = true,
  onCancel,
  onRetry,
  fullScreen = true,
}) {
  if (!isLoading) return null;

  const content = (
    <div className="max-w-md w-full mx-auto px-4 py-8 text-center flex flex-col items-center">
      {/* Hastivo Brand & Icon */}
      <div className="mb-6">
        <BrandMark size={44} animate />
      </div>

      {/* Optional Avatar Thinking state visual */}
      {avatarThinking ? (
        <AvatarThinkingState
          statusText={title}
          subtext={description}
          className="w-full mb-6 border-border/80 shadow-sm"
        />
      ) : (
        <div className="mb-6 space-y-2">
          <Loader2 size={36} className="text-coral animate-spin mx-auto mb-3" />
          <h2 className="font-display text-xl font-medium tracking-tight text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{description}</p>
        </div>
      )}

      {/* Progress Bar (if provided) */}
      {typeof progress === "number" && (
        <div className="w-full space-y-2 mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
            <span>Progress</span>
            <span className="text-blue font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue via-coral to-yellow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: EASE, duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* INPUT: Cancel or Retry Actions where operation supports it */}
      {(onCancel || onRetry) && (
        <div className="flex items-center justify-center gap-3 mt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle size={14} className="text-coral" />
              Cancel Operation
            </button>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-xs font-mono text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} className="text-blue" />
              Retry Now
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md overflow-hidden selection:bg-coral selection:text-charcoal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
}

export default LoadingScreen;

