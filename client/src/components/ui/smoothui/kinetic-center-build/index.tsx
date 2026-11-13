import React from "react";
import { motion } from "framer-motion";

export interface KineticCenterBuildProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function KineticCenterBuild({
  text,
  children,
  className = "",
  stagger = 0.04,
}: KineticCenterBuildProps) {
  const content = (text || (typeof children === "string" ? children : "")).split("");
  const mid = Math.floor(content.length / 2);

  return (
    <span className={"inline-flex flex-wrap overflow-hidden " + className}>
      {content.map((char, i) => {
        const distFromCenter = Math.abs(mid - i);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.2, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: distFromCenter * stagger,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
export { KineticCenterBuild };
