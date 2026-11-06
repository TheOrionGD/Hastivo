import React, { useEffect, useState, useRef, useCallback } from 'react';
import { preloadAvatarModels, areAvatarModelsPreloaded } from '../../avatar/core/MixamoBotAvatar.js';

/**
 * AvatarPreloader
 * Luxury Cybernetic Preloader that preloads the unified 3D humanoid avatar V-Bot model
 * into high-speed memory cache before the user explores the application.
 *
 * @param {Object} props
 * @param {() => void} [props.onComplete] Callback when preloading completes or is dismissed
 * @param {boolean} [props.autoDismiss=true] Automatically fade out when 100% is reached
 */
export default function AvatarPreloader({ onComplete, autoDismiss = true }) {
  const alreadyLoaded = typeof window !== 'undefined' && areAvatarModelsPreloaded();
  const [percent, setPercent] = useState(() => (alreadyLoaded ? 100 : 0));
  const [statusText, setStatusText] = useState(() =>
    alreadyLoaded ? 'V-Bot 3D humanoid avatar model loaded in cache.' : 'Initiating 3D Kinematic Transceiver...'
  );
  const [vBotReady, setVBotReady] = useState(() => alreadyLoaded);
  const [loadedMb, setLoadedMb] = useState(() => (alreadyLoaded ? '4.7' : '0.0'));
  const [totalMb, setTotalMb] = useState('4.7');
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
    if (alreadyLoaded) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 350);
      return () => clearTimeout(timer);
    }

    let active = true;

    preloadAvatarModels((fraction, _modelId, status, details) => {
      if (!active) return;
      const pct = Math.min(100, Math.round(fraction * 100));
      setPercent(pct);
      setStatusText(status);

      if (details) {
        if (details.vBotReady || fraction >= 1.0) setVBotReady(true);
        if (details.loadedBytes) setLoadedMb((details.loadedBytes / 1048576).toFixed(1));
        if (details.totalBytes) setTotalMb((details.totalBytes / 1048576).toFixed(1));
      }

      if (fraction >= 1.0) {
        setIsDone(true);
        if (autoDismiss) {
          setTimeout(() => {
            if (active) handleDismiss();
          }, 650);
        }
      }
    }).then(() => {
      if (active) {
        setIsDone(true);
        setVBotReady(true);
        setPercent(100);
      }
    });

    return () => {
      active = false;
    };
  }, [alreadyLoaded, autoDismiss, handleDismiss]);

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <aside
      aria-label="3D Avatar Preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 40%, #0d131f 0%, #05070c 80%, #020306 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '460px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="7"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r={radius + 9}
              stroke="rgba(111, 163, 239, 0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
            />
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

        {/* Unified V-Bot Readiness Indicator */}
        <div
          style={{
            width: '100%',
            marginBottom: '22px',
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '16px',
              background: vBotReady ? 'rgba(255, 111, 97, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${vBotReady ? 'rgba(255, 111, 97, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FF8F84' }}>✦ V-Bot Official Model</div>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>80-Bone Rig • 5-Finger Kinematics • PBR Armor</div>
            </div>
            <span
              style={{
                fontSize: '0.70rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '99px',
                background: vBotReady ? '#FF6F61' : 'rgba(255,255,255,0.1)',
                color: vBotReady ? '#ffffff' : '#64748b',
                boxShadow: vBotReady ? '0 0 10px rgba(255, 111, 97, 0.6)' : 'none',
              }}
            >
              {vBotReady ? 'READY' : 'STREAM'}
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
          <span>Kinematic Rig: <strong style={{ color: '#34d399' }}>80-Bone Calibrated</strong></span>
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
          {isDone ? 'Explore Application →' : 'Skip Preloader →'}
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
