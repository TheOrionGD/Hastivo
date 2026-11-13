import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const VisionRadialCursorGlow: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [hasMoved, setHasMoved] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Only track if pointer supports fine hover (desktop/mouse)
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const handlePointerMove = (e: PointerEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!hasMoved) setHasMoved(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Smooth interpolation loop for lag-free organic fluid motion
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const animateGlow = () => {
      if (hasMoved) {
        currentX += (targetPos.current.x - currentX) * 0.15;
        currentY += (targetPos.current.y - currentY) * 0.15;
        setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      }
      rafRef.current = requestAnimationFrame(animateGlow);
    };

    rafRef.current = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasMoved]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Cursor Spotlight (Follows mouse on desktop) */}
      {hasMoved ? (
        <div
          className="absolute rounded-full transition-opacity duration-300"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '750px',
            height: '750px',
            transform: 'translate(-50%, -50%)',
            background: isDark
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0, 229, 255, 0.08) 35%, rgba(255, 111, 97, 0.04) 55%, transparent 75%)'
              : 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(255, 140, 0, 0.10) 40%, rgba(90, 160, 255, 0.06) 60%, transparent 75%)',
            filter: 'blur(35px)',
          }}
        />
      ) : (
        /* Ambient visionOS Breathing Bloom on mobile/initial load */
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full animate-pulse transition-opacity duration-1000"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0, 229, 255, 0.06) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(255, 140, 0, 0.08) 45%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
      )}

      {/* Subtle Specular Refraction Ring at top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 opacity-40 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
