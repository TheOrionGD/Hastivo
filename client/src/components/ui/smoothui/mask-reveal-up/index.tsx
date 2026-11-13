import React from "react";
import { motion } from "framer-motion";

export interface MaskRevealUpProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function MaskRevealUp({
  text,
  children,
  className = "",
  delay = 0,
}: MaskRevealUpProps) {
  return (
    <span className={"inline-block overflow-hidden " + className}>
      <motion.span
        className="inline-block"
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ delay, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {text || children}
      </motion.span>
    </span>
  );
}
export { MaskRevealUp };
