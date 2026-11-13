import React from "react";
import { motion } from "framer-motion";

export interface SpringScaleInProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SpringScaleIn({
  text,
  children,
  className = "",
  delay = 0,
}: SpringScaleInProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 350, damping: 25 }}
    >
      {text || children}
    </motion.span>
  );
}
export { SpringScaleIn };
