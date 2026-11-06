import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  pulse?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  className = '',
  variant = 'neutral',
  pulse = false,
}) => {
  const variantStyles = {
    primary: 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10',
    secondary: 'border-[var(--secondary)] text-[var(--secondary)] bg-[var(--secondary)]/10',
    accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    neutral: 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)]',
  };

  return (
    <motion.span
      whileHover={{ y: -2, scale: 1.04 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono tracking-wider uppercase border rounded-full select-none transition-shadow hover:shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />}
      {children}
    </motion.span>
  );
};

