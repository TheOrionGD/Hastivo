import React, { useEffect, useState, useRef, useCallback } from 'react';
import { preloadAvatarModels, areAvatarModelsPreloaded } from '../../avatar/core/MixamoBotAvatar.js';

/**
 * AvatarPreloader
 * Luxury Cybernetic Preloader that preloads both 3D humanoid avatar FBX models
 * into high-speed memory cache before the user explores the 8 landing page sections.
 *
 * @param {Object} props
 * @param {() => void} [props.onComplete] Callback when preloading completes or is dismissed
 * @param {boolean} [props.autoDismiss=true] Automatically fade out when 100% is reached
 */
export default function AvatarPreloader({ onComplete, autoDismiss = true }) {
  const alreadyLoaded = typeof window !== 'undefined' && areAvatarModelsPreloaded();
  const [percent, setPercent] = useState(() => (alreadyLoaded ? 100 : 0));
  const [statusText, setStatusText] = useState(() =>
    alreadyLoaded ? 'All 3D humanoid avatar models loaded in cache.' : 'Initiating 3D Kinematic Transceiver...'
  );
  const [xBotReady, setXBotReady] = useState(() => alreadyLoaded);
  const [yBotReady, setYBotReady] = useState(() => alreadyLoaded);
  const [loadedMb, setLoadedMb] = useState(() => (alreadyLoaded ? '3.7' : '0.0'));
  const [totalMb, setTotalMb] = useState('3.7');
  const [isDone, setIsDone] = useState(() => alreadyLoaded);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const completedRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    // If already preloaded into memory cache, brief 200ms verification then pass
    if (alreadyLoaded) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 350);
      return () => clearTimeout(timer);
    }

    let active = true;

    preloadAvatarModels((fraction, modelId, status, details) => {
      if (!active) return;
      const pct = Math.min(100, Math.round(fraction * 100));
      setPercent(pct);
      setStatusText(status);

      if (details) {
        if (details.xBotReady) setXBotReady(true);
        if (details.yBotReady) setYBotReady(true);
        if (details.loadedBytes) setLoadedMb((details.loadedBytes / 1048576).toFixed(1));
        if (details.totalBytes) setTotalMb((details.totalBytes / 1048576).toFixed(1));
      }
    })
      .then(() => {
        if (!active) return;
        setPercent(100);
        setXBotReady(true);
        setYBotReady(true);
        setStatusText('3D Kinematic Humanoid Rig Synchronized');
        setIsDone(true);

        if (autoDismiss) {
          setTimeout(() => {
            if (active) handleDismiss();
          }, 650);
        }
      })
      .catch((err) => {
        console.warn('Avatar preloader notice:', err);
        if (active) {
          setIsDone(true);
          setTimeout(() => {
            if (active) handleDismiss();
          }, 800);
        }
      });

    return () => {
      active = false;
    };
  }, [alreadyLoaded, autoDismiss, handleDismiss]);

  // SVG Circle geometry
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <aside
      aria-label="3D Avatar Preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(13, 19, 33, 0.98) 0%, rgba(5, 7, 12, 0.99) 100%)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Background Cyber Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(111, 163, 239, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(111, 163, 239, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Holographic Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '520px',
          padding: '36px 20px',
          borderRadius: 'var(--radius-overlay)',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        {/* Top Header Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '99px',
            background: 'rgba(255, 111, 97, 0.12)',
            border: '1px solid rgba(255, 111, 97, 0.35)',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FF6F61',
              boxShadow: '0 0 10px #FF6F61',
              animation: 'preloaderPulse 1.4s infinite ease-in-out',
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1.2px',
              color: '#FF8F84',
              textTransform: 'uppercase',
            }}
          >
            HASTIVO 3D AVATAR KINEMATICS ENGINE
          </span>
        </div>

        {/* Central Circular Hologram Gauge */}
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(111, 163, 239, 0.22) 0%, transparent 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }}
          />

          <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="7"
              fill="none"
            />
            {/* Secondary Segment Glow */}
            <circle
              cx="90"
              cy="90"
              r={radius + 9}
              stroke="rgba(111, 163, 239, 0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* Primary Gradient Animated Progress */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="url(#preloaderGrad)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{
                transition: 'stroke-dashoffset 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
                filter: 'drop-shadow(0 0 8px rgba(111, 163, 239, 0.6))',
              }}
            />
            <defs>
              <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6F61" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6FA3EF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Percentage Counter */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                color: '#ffffff',
                textShadow: '0 0 16px rgba(111, 163, 239, 0.5)',
              }}
            >
              {percent}
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#6FA3EF', marginLeft: '2px' }}>%</span>
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                letterSpacing: '1px',
                color: isDone ? '#34D399' : '#94A3B8',
                textTransform: 'uppercase',
                marginTop: '-2px',
              }}
            >
              {isDone ? 'SYNCHRONIZED' : 'STREAMING'}
            </span>
          </div>
        </div>

        {/* Live Status Text */}
        <div
          style={{
            minHeight: '26px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#e2e8f0',
            marginBottom: '18px',
            letterSpacing: '0.2px',
          }}
        >
          {statusText}
        </div>

        {/* Dual Model Readiness Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
            marginBottom: '22px',
          }}
        >
          {/* Female Model Badge */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: xBotReady ? 'rgba(255, 111, 97, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${xBotReady ? 'rgba(255, 111, 97, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF8F84' }}>♀ X-Bot (Female)</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Cyber Visor & Bodice</div>
            </div>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '99px',
                background: xBotReady ? '#FF6F61' : 'rgba(255,255,255,0.1)',
                color: xBotReady ? '#ffffff' : '#64748b',
                boxShadow: xBotReady ? '0 0 10px rgba(255, 111, 97, 0.6)' : 'none',
              }}
            >
              {xBotReady ? 'READY' : 'STREAM'}
            </span>
          </div>

          {/* Male Model Badge */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: yBotReady ? 'rgba(111, 163, 239, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${yBotReady ? 'rgba(111, 163, 239, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93C5FD' }}>♂ Y-Bot (Male)</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Tactical Armor & Vest</div>
            </div>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '99px',
                background: yBotReady ? '#6FA3EF' : 'rgba(255,255,255,0.1)',
                color: yBotReady ? '#ffffff' : '#64748b',
                boxShadow: yBotReady ? '0 0 10px rgba(111, 163, 239, 0.6)' : 'none',
              }}
            >
              {yBotReady ? 'READY' : 'STREAM'}
            </span>
          </div>
        </div>

        {/* Telemetry Throughput */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '0.72rem',
            color: '#64748b',
            marginBottom: '20px',
            padding: '0 4px',
          }}
        >
          <span>Memory Buffer: <strong style={{ color: '#cbd5e1' }}>{loadedMb} MB / {totalMb} MB</strong></span>
          <span>Kinematic Rig: <strong style={{ color: '#34d399' }}>27-DOF Calibrated</strong></span>
        </div>

        {/* Action Button: Skip / Enter */}
        <button
          onClick={handleDismiss}
          style={{
            padding: '12px 32px',
            borderRadius: '99px',
            border: isDone ? '1px solid rgba(52, 211, 153, 0.6)' : '1px solid rgba(255, 255, 255, 0.16)',
            background: isDone
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'rgba(255, 255, 255, 0.06)',
            color: '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isDone ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            if (!isDone) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (!isDone) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          {isDone ? 'Explore 8 Chapters →' : 'Skip Preloader →'}
        </button>
      </div>

      <style>{`
        @keyframes preloaderPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </aside>
  );
}
