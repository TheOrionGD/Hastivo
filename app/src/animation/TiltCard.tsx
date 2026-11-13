import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scaleHover?: number;
  glareEffect?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 6,
  scaleHover = 1.015,
  glareEffect = true,
  onClick,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: scaleHover, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className={`relative transform-gpu ${className}`}
      {...(rest as any)}
    >
      {children}

      {/* Dynamic Cursor Glare Spotlight */}
      {glareEffect && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle 350px at ${mouseX.get() * 100}% ${
                mouseY.get() * 100
              }%, rgba(255, 255, 255, 0.08), transparent 80%)`,
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

