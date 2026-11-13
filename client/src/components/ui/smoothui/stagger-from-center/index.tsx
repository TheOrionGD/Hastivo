import React from "react";
import { motion } from "framer-motion";

export interface StaggerFromCenterProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function StaggerFromCenter({
  text,
  children,
  className = "",
  stagger = 0.035,
}: StaggerFromCenterProps) {
  const content = (text || (typeof children === "string" ? children : "")).split("");
  const mid = Math.floor(content.length / 2);

  return (
    <span className={"inline-flex flex-wrap " + className}>
      {content.map((char, i) => {
        const offset = Math.abs(mid - i);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: offset * stagger, duration: 0.4 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
export { StaggerFromCenter };
