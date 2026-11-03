import React, { useEffect, useRef, useState } from 'react';

// Chapter atmospheric visual profiles (reduced transparency for vivid, visible cosmic video)
const ATMOSPHERIC_PROFILES = {
  hero: {
    filter: 'brightness(0.82) contrast(1.15) saturate(1.18) hue-rotate(0deg)',
    tint: 'radial-gradient(ellipse at 50% 30%, rgba(255, 111, 97, 0.14) 0%, rgba(10, 13, 20, 0.65) 75%)',
    ambientGlow: 'rgba(255, 111, 97, 0.25)',
  },
  purpose: {
    filter: 'brightness(0.74) contrast(1.20) saturate(1.25) hue-rotate(20deg)',
    tint: 'radial-gradient(circle at 30% 50%, rgba(111, 163, 239, 0.20) 0%, rgba(255, 111, 97, 0.12) 70%, rgba(8, 11, 18, 0.68) 100%)',
    ambientGlow: 'rgba(111, 163, 239, 0.3)',
  },
  'text-to-sign': {
    filter: 'brightness(0.76) contrast(1.18) saturate(1.20) hue-rotate(35deg)',
    tint: 'radial-gradient(ellipse at 70% 40%, rgba(255, 193, 7, 0.18) 0%, rgba(10, 14, 22, 0.68) 80%)',
    ambientGlow: 'rgba(255, 193, 7, 0.25)',
  },
  'sign-to-text': {
    filter: 'brightness(0.70) contrast(1.22) saturate(1.22) hue-rotate(85deg)',
    tint: 'radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.18) 0%, rgba(8, 12, 19, 0.70) 85%)',
    ambientGlow: 'rgba(16, 185, 129, 0.3)',
  },
  'voice-navigation': {
    filter: 'brightness(0.74) contrast(1.20) saturate(1.22) hue-rotate(200deg)',
    tint: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.20) 0%, rgba(255, 111, 97, 0.12) 65%, rgba(9, 12, 20, 0.68) 100%)',
    ambientGlow: 'rgba(168, 85, 247, 0.28)',
  },
  'privacy-security': {
    filter: 'brightness(0.68) contrast(1.25) saturate(0.95) grayscale(0.15)',
    tint: 'radial-gradient(ellipse at 50% 60%, rgba(255, 193, 7, 0.12) 0%, rgba(15, 23, 42, 0.60) 50%, rgba(6, 8, 14, 0.76) 100%)',
    ambientGlow: 'rgba(255, 193, 7, 0.18)',
  },
  standards: {
    filter: 'brightness(0.72) contrast(1.18) saturate(1.20) hue-rotate(150deg)',
    tint: 'radial-gradient(ellipse at 60% 40%, rgba(56, 189, 248, 0.18) 0%, rgba(9, 14, 24, 0.70) 80%)',
    ambientGlow: 'rgba(56, 189, 248, 0.25)',
  },
  'get-started': {
    filter: 'brightness(0.82) contrast(1.20) saturate(1.25) hue-rotate(330deg)',
    tint: 'radial-gradient(circle at 50% 45%, rgba(255, 111, 97, 0.22) 0%, rgba(111, 163, 239, 0.18) 50%, rgba(7, 9, 16, 0.70) 100%)',
    ambientGlow: 'rgba(255, 111, 97, 0.35)',
  },
};

export default function SpatialBackgroundVideo({ activeSection = 'hero' }) {
  const videoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Track scroll position for subtle cinematic depth scaling
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Check reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  // Ensure continuous autoplay playback
  useEffect(() => {
    if (videoRef.current && !prefersReducedMotion) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled browser autoplay policy gracefully
        });
      }
    }
  }, [prefersReducedMotion]);

  const activeProfile = ATMOSPHERIC_PROFILES[activeSection] || ATMOSPHERIC_PROFILES.hero;

  return (
    <div
      className="spatial-video-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#07090e',
      }}
      aria-hidden="true"
    >
      {prefersReducedMotion ? (
        // Reduced motion fallback: Static high-definition poster frame
        <img
          src="/frame/frame-001.jpg"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
            filter: activeProfile.filter,
            transition: 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      ) : (
        // Completely fixed Full-Bleed Background Video - never moves upward on scroll
        <video
          ref={videoRef}
          src="/bg.mp4"
          poster="/frame/frame-001.jpg"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: prefersReducedMotion ? 'none' : `scale(${1 + Math.min(scrollY * 0.00008, 0.04)})`,
            filter: activeProfile.filter,
            transition: 'filter 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease-out',
            willChange: 'filter, transform',
          }}
        />
      )}

      {/* Dynamic Chapter Atmospheric Color Tint Crossfade Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: activeProfile.tint,
          transition: 'background 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: 0.62,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Cinematic Vignette & Edge Shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 54%, rgba(5, 7, 12, 0.50) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Digital Scanline / Film Grain Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
