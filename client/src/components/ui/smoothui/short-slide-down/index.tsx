import React from "react";
import { motion } from "framer-motion";

export interface ShortSlideDownProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ShortSlideDown({
  text,
  children,
  className = "",
  delay = 0,
}: ShortSlideDownProps) {
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
    >
      {text || children}
    </motion.span>
  );
}
export { ShortSlideDown };
