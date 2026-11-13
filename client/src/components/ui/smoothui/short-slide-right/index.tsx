import React from "react";
import { motion } from "framer-motion";

export interface ShortSlideRightProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ShortSlideRight({
  text,
  children,
  className = "",
  delay = 0,
}: ShortSlideRightProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
    >
      {text || children}
    </motion.span>
  );
}
export { ShortSlideRight };
