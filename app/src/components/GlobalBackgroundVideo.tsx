import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const VIDEO_URL = 'https://res.cloudinary.com/b4qngi2o/video/upload/v1793781030/bg.mp4';

export const GlobalBackgroundVideo: React.FC = () => {
  const { theme } = useTheme();
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Base architectural tint for theme separation */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#101319]' : 'bg-[#F2F4F8]'}`} />

      {/* Cloudinary Video Layer */}
      {!videoFailed && !prefersReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isDark ? 'opacity-80' : 'opacity-75'
          }`}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      )}

      {/* Theme-Adaptive Readability Vignette: Light mode softens with luminous white frosted veil, Dark mode with rich obsidian veil */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(16, 19, 25, 0.40) 0%, rgba(10, 12, 16, 0.78) 100%)'
            : 'radial-gradient(ellipse at center, rgba(246, 248, 252, 0.42) 0%, rgba(230, 235, 244, 0.76) 100%)',
        }}
      />
    </div>
  );
};

