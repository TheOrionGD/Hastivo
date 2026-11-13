import React from "react";
import { motion } from "framer-motion";

export interface LineByLineSlideProps {
  lines?: string[];
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function LineByLineSlide({
  lines,
  children,
  className = "",
  delay = 0.15,
}: LineByLineSlideProps) {
  const content = lines || (typeof children === "string" ? children.split("\n") : []);

  return (
    <div className={"flex flex-col " + className}>
      {content.map((line, i) => (
        <span key={i} className="overflow-hidden inline-block leading-tight">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ delay: i * delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
export { LineByLineSlide };
