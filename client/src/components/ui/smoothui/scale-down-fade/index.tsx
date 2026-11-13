import React from "react";
import { motion } from "framer-motion";

export interface ScaleDownFadeProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScaleDownFade({
  text,
  children,
  className = "",
  delay = 0,
}: ScaleDownFadeProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, scale: 1.15 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {text || children}
    </motion.span>
  );
}
export { ScaleDownFade };
