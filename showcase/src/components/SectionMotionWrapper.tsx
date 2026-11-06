import React from 'react';
import { motion } from 'framer-motion';

interface SectionMotionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export const SectionMotionWrapper: React.FC<SectionMotionWrapperProps> = ({
  children,
  id,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
