import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reusable GlassCard component for dashboards, feature cards, and status cards.
 */
export function GlassCard({
  children,
  className = "",
  hoverTilt = true,
  onClick,
  accent = null, // "coral" | "blue" | "amber"
  ...props
}) {
  const accentStyles = {
    coral: "border-coral/40 shadow-coral/5 hover:border-coral",
    blue: "border-blue/40 shadow-blue/5 hover:border-blue",
    amber: "border-yellow/40 shadow-yellow/5 hover:border-yellow",
  };

  return (
    <motion.div
      whileHover={hoverTilt ? { y: -4, scale: 1.01 } : {}}
      whileTap={hoverTilt ? { scale: 0.99 } : {}}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl bg-surface/70 backdrop-blur-xl border border-border/70 p-6 shadow-md transition-colors",
        accent && accentStyles[accent],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;

