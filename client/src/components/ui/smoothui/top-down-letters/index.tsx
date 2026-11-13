import React from "react";
import { motion } from "framer-motion";

export interface TopDownLettersProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function TopDownLetters({
  text,
  children,
  className = "",
  stagger = 0.03,
}: TopDownLettersProps) {
  const content = (text || (typeof children === "string" ? children : "")).split("");

  return (
    <span className={"inline-flex flex-wrap " + className}>
      {content.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * stagger, type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
export { TopDownLetters };
