import React from "react";
import { motion } from "framer-motion";

export interface SoftBlurInProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SoftBlurIn({ text, children, className = "", delay = 0 }: SoftBlurInProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {text || children}
    </motion.span>
  );
}
export { SoftBlurIn };
