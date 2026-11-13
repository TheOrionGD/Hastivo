import React from "react";
import { motion } from "framer-motion";

export interface BlurOutUpProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  duration?: number;
}

export default function BlurOutUp({
  children,
  text,
  className = "",
  duration = 0.6,
}: BlurOutUpProps) {
  const content = text || children;
  return (
    <motion.span
      className={"inline-block " + className}
      initial={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      whileHover={{ opacity: 0.2, filter: "blur(8px)", y: -12 }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.span>
  );
}
export { BlurOutUp };
