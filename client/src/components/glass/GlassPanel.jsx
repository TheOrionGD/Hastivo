import React from "react";
import { cn } from "@/lib/utils";

/**
 * Spatial Glass Panel base container
 * Restrained blur, subtle elevation, and glass borders
 * Elevation levels: Z0 (bg), Z1 (workspace), Z2 (panels/cards), Z3 (dock/tools), Z4 (dropdowns), Z5 (modals)
 */
export function GlassPanel({
  children,
  className = "",
  elevation = "z1",
  interactive = false,
  highlight = null, // "coral" | "blue" | "amber" | null
  ...props
}) {
  const elevationClasses = {
    z0: "bg-background/40 backdrop-blur-sm border-border/30",
    z1: "bg-surface/65 backdrop-blur-md border-border/50 shadow-sm",
    z2: "bg-surface/75 backdrop-blur-xl border-border/70 shadow-md",
    z3: "bg-surface/85 backdrop-blur-2xl border-border/80 shadow-lg",
    z4: "bg-surface/90 backdrop-blur-2xl border-border/90 shadow-xl",
    z5: "bg-surface/95 backdrop-blur-3xl border-border shadow-2xl",
  };

  const highlightBorder = {
    coral: "hover:border-coral/60 focus-within:border-coral/70",
    blue: "hover:border-blue/60 focus-within:border-blue/70",
    amber: "hover:border-yellow/60 focus-within:border-yellow/70",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        elevationClasses[elevation] || elevationClasses.z1,
        highlight && highlightBorder[highlight],
        interactive && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassPanel;

