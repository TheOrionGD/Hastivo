import React from "react";
import { motion } from "framer-motion";

export interface MicroScaleFadeProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function MicroScaleFade({
  text,
  children,
  className = "",
  delay = 0,
}: MicroScaleFadeProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {text || children}
    </motion.span>
  );
}
export { MicroScaleFade };
