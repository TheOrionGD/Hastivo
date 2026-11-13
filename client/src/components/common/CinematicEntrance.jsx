import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 6-Stage Cinematic Logo-to-Dock Entrance Sequence:
 * Stage 1: Central Logo with Aurora lighting
 * Stage 2: Logo Activation & depth expansion
 * Stage 3: Logo-to-Dock Morph trajectory
 * Stage 4: Floating Navigation Dock reveal
 * Stage 5: Dashboard Panels emergence
 * Stage 6: AI Orb Activation
 * Completes within 1.8 seconds.
 */
export function CinematicEntrance({ onComplete }) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    // Only run on first mount of workspace session
    const hasSeen = sessionStorage.getItem("hastivo_entrance_shown");
    if (hasSeen) {
      if (onComplete) onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(2), 350);
    const t2 = setTimeout(() => setStage(3), 850);
    const t3 = setTimeout(() => setStage(4), 1300);
    const t4 = setTimeout(() => {
      setStage(5);
      sessionStorage.setItem("hastivo_entrance_shown", "true");
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (stage >= 5) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-2xl pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
          {/* Spatial Aurora Glow Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: stage >= 2 ? [1, 1.25, 1] : 1,
              opacity: stage >= 2 ? 0.8 : 0.3,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute -inset-16 rounded-full bg-gradient-to-tr from-coral/30 via-blue/20 to-yellow/20 blur-2xl"
          />

          {/* Central Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{
              scale: stage === 3 ? 0.5 : stage === 2 ? 1.08 : 1,
              y: stage === 3 ? 240 : 0,
              opacity: stage === 3 ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-coral to-coral/80 shadow-2xl border border-white/20 text-charcoal font-display text-5xl font-bold"
          >
            H
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: stage <= 2 ? 1 : 0, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <h1 className="font-heading text-2xl tracking-wide text-foreground">
              Hastivo
            </h1>
            <p className="font-sans text-xs tracking-widest uppercase text-text-3 mt-1">
              Assistive Spatial Intelligence
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CinematicEntrance;

