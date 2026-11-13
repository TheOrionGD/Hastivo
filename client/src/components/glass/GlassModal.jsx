import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlassModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
  size = "md", // "sm" | "md" | "lg" | "xl"
}) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full rounded-3xl bg-surface/90 backdrop-blur-3xl border border-border/80 shadow-2xl p-6 sm:p-8 z-10 text-foreground",
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  {title && (
                    <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="font-sans text-sm text-text-2 mt-1">{description}</p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-text-3 hover:text-foreground hover:bg-surface transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GlassModal;

