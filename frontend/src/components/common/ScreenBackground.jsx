import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScreenBackground
 * Renders the global background video (public/bg.mp4) across all application screens,
 * including the landing page for a unified cinematic motion scroll effect.
 */
export default function ScreenBackground() {
  const location = useLocation();
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('has-video-screen');
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled: Browser autoplay policy
      });
    }

    return () => {
      document.body.classList.remove('has-video-screen');
    };
  }, [location.pathname]);

  if (location.pathname === '/landing' || location.pathname === '/' || location.pathname === '/splash') {
    return null;
  }

  return (
    <div className="global-screen-video-bg" aria-hidden="true">
      <video
        ref={videoRef}
        className="global-video-element"
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="global-video-overlay" />
    </div>
  );
}
