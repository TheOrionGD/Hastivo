import React from "react";
import { motion } from "framer-motion";

export interface StaggerFromEdgesProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function StaggerFromEdges({
  text,
  children,
  className = "",
  stagger = 0.035,
}: StaggerFromEdgesProps) {
  const content = (text || (typeof children === "string" ? children : "")).split("");
  const len = content.length;

  return (
    <span className={"inline-flex flex-wrap " + className}>
      {content.map((char, i) => {
        const edgeDist = Math.min(i, len - 1 - i);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: edgeDist * stagger, duration: 0.4 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
export { StaggerFromEdges };
