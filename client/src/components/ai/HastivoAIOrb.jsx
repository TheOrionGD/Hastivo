import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Hastivo AI Orb Component
 * Visual assistant orb with distinct dynamic states:
 * - 'idle': gentle floating & breathing
 * - 'listening': audio-reactive pulse
 * - 'recognizing': subtle scanning rings
 * - 'thinking': internal rotating illumination
 * - 'responding': controlled radiant expansion
 * - 'error': warning coral/red state
 */
export function HastivoAIOrb({
  state = "idle", // "idle" | "listening" | "recognizing" | "thinking" | "responding" | "error"
  size = "md", // "sm" | "md" | "lg"
  className = "",
  onClick,
}) {
  const sizeMap = {
    sm: "w-14 h-14",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  const orbVariants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: [0, 180, 360],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
    listening: {
      scale: [1, 1.15, 0.95, 1.1, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    recognizing: {
      rotate: [0, 360],
      scale: [1, 1.08, 1],
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
    thinking: {
      scale: [0.95, 1.1, 0.95],
      rotate: [0, -360],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
    responding: {
      scale: [1, 1.2, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
    error: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: 3 },
    },
  };

  const colorStyles = {
    idle: "from-blue/40 via-coral/30 to-yellow/20 shadow-blue/20",
    listening: "from-coral/70 via-coral/40 to-yellow/40 shadow-coral/30",
    recognizing: "from-blue/60 via-blue/30 to-white/40 shadow-blue/30",
    thinking: "from-yellow/60 via-coral/40 to-blue/40 shadow-yellow/30",
    responding: "from-coral/80 via-blue/50 to-yellow/50 shadow-coral/40",
    error: "from-red-500/80 via-coral/60 to-red-600/40 shadow-red-500/40",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center cursor-pointer select-none",
        sizeMap[size],
        className
      )}
    >
      {/* Outer ambient blur */}
      <motion.div
        animate={{
          scale: state === "listening" || state === "responding" ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute -inset-4 rounded-full bg-gradient-to-tr blur-xl opacity-60",
          colorStyles[state]
        )}
      />

      {/* Main Glass Orb */}
      <motion.div
        variants={orbVariants}
        animate={state}
        className={cn(
          "relative w-full h-full rounded-full bg-gradient-to-tr border border-white/40 shadow-2xl backdrop-blur-md overflow-hidden flex items-center justify-center",
          colorStyles[state]
        )}
      >
        {/* Core highlight reflection */}
        <div className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full bg-white/40 blur-[2px]" />
        
        {/* Internal scanning rings */}
        {(state === "recognizing" || state === "thinking") && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-3/4 h-3/4 rounded-full border border-dashed border-white/60"
          />
        )}
      </motion.div>
    </div>
  );
}

export default HastivoAIOrb;

