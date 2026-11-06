import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  asAnchor?: boolean;
  href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.28,
  asAnchor = false,
  href,
  onClick,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth cinematic spring
  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="inline-block relative"
    >
      <motion.div
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.96 }}
        className="relative"
      >
        {asAnchor ? (
          <a
            href={href}
            onClick={onClick as any}
            className={`relative inline-flex items-center justify-center overflow-hidden transition-colors group ${className}`}
          >
            {/* Shimmer overlay on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
          </a>
        ) : (
          <button
            onClick={onClick}
            className={`relative inline-flex items-center justify-center overflow-hidden transition-colors group cursor-pointer ${className}`}
            {...rest}
          >
            {/* Shimmer overlay on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
          </button>
        )}
      </motion.div>
    </div>
  );

  return content;
};

