import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const GlassButton = forwardRef(function GlassButton(
  {
    children,
    className = "",
    variant = "primary", // "primary" | "secondary" | "ghost" | "danger" | "glass"
    size = "md", // "sm" | "md" | "lg" | "icon"
    disabled = false,
    loading = false,
    icon: Icon,
    ...props
  },
  ref
) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans tracking-wide transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
    md: "h-10 px-4 text-sm rounded-xl gap-2",
    lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
    icon: "h-10 w-10 p-0 rounded-xl",
  };

  const variantStyles = {
    primary:
      "bg-coral text-charcoal font-semibold shadow-md hover:bg-coral/90 shadow-coral/20 border border-coral/30",
    secondary:
      "bg-blue/15 text-blue border border-blue/30 hover:bg-blue/25 hover:border-blue/50",
    glass:
      "bg-surface/60 backdrop-blur-md text-foreground border border-border/80 hover:bg-surface/90 hover:border-border shadow-sm",
    ghost:
      "bg-transparent text-foreground hover:bg-surface/40 hover:text-coral border border-transparent",
    danger:
      "bg-red-500/15 text-red-500 border border-red-500/30 hover:bg-red-500/25",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={cn("shrink-0", size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />
      ) : null}
      {children}
    </button>
  );
});

export const GlassInput = forwardRef(function GlassInput(
  { className = "", error = false, icon: Icon, ...props },
  ref
) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3.5 text-text-3 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl bg-surface/50 backdrop-blur-md border px-4 py-2.5 text-sm text-foreground placeholder:text-text-3 font-sans transition-all duration-200 outline-none",
          "focus:border-blue focus:ring-2 focus:ring-blue/20",
          error ? "border-coral focus:border-coral focus:ring-coral/20" : "border-border/80",
          Icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
});

export default GlassButton;

