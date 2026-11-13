import { motion } from "framer-motion";

/** Hastivo mark: two interlocking arcs (coral + blue) meeting at a yellow point — two hands, one conversation. */
export function BrandMark({ size = 36, animate = false, className = "" }) {
  const draw = animate
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }
    : {};
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="Hastivo">
      <motion.path
        d="M10 34 C10 18, 22 10, 30 14"
        fill="none"
        stroke="var(--brand-coral)"
        strokeWidth="5"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M38 14 C38 30, 26 38, 18 34"
        fill="none"
        stroke="var(--brand-blue)"
        strokeWidth="5"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="24"
        cy="24"
        r="3.2"
        fill="var(--brand-yellow)"
        initial={animate ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ delay: animate ? 1.2 : 0, duration: 0.6 }}
      />
    </svg>
  );
}
