import React from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";

export interface KineticTypeScrollProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function KineticTypeScroll({
  text,
  children,
  className = "",
}: KineticTypeScrollProps) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-15, 15]);

  return (
    <motion.span style={{ skewX }} className={"inline-block will-change-transform " + className}>
      {text || children}
    </motion.span>
  );
}
export { KineticTypeScroll };
