import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandMark } from "@/components/common/BrandMark";
import { AvatarStage } from "@/components/three/AvatarStage";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1];
const DURATION_MS = 5200;

/** Cinematic intro. Shown once per browser session; skippable; never blocks on 3D loading. */
export function Splash({ onDone }) {
  const [open, setOpen] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(false), reduced ? 1200 : DURATION_MS);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {open && (
        <motion.div
          key="splash"
          role="dialog"
          aria-label="Hastivo introduction"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1.1, ease: EASE } }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 22%, transparent), transparent 65%)" }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
          />

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            <BrandMark size={56} animate />
          </motion.div>

          <motion.div
            className="relative h-[38vh] w-[min(80vw,420px)]"
            initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: EASE, delay: 1.1 }}
          >
            <AvatarStage className="h-full w-full" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-giant font-medium"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 2.2 }}
            >
              Hastivo
            </motion.h1>
          </div>
          <motion.p
            className="mt-4 px-6 text-center text-lead text-text-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 3 }}
          >
            Vibrant Connections Through <span className="text-coral">Language</span> Colors
          </motion.p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="glass absolute bottom-8 right-8 min-h-11 rounded-full px-5 text-sm text-text-2 hover:text-foreground"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
