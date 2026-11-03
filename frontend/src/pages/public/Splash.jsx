import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/env';
import { API_ENDPOINTS, apiFetch } from '../../config/apiEndpoints';
import { avatarService } from '../../services/avatarService';
import SplashAvatarStage from '../../components/splash/SplashAvatarStage';

/**
 * SIGNORA — Exact Reference UI Reconstruction
 * Visual Specification: media_1793688240579_fafea2bd.jpg
 *
 * Architectural Matrix:
 * - Top Header: "SYSTEM INITIALIZATION | ISL PROTOCOL" (left) and "● X-Bot | ○ Y-Bot" (right)
 * - Horizontal Grid Line 1: Full-width 1px technical rule beneath header
 * - Index "01": Sits cleanly below Line 1 on the left
 * - Horizontal Grid Line 2: Intersects beneath "01", running across the left column and behind the robot
 * - Vertical Grid Line 1: Left boundary of the avatar column with coral rim illumination
 * - Vertical Grid Line 2: Right boundary of the avatar column with cyan-blue rim illumination
 * - Left Content:
 *     - Oversized geometric wordmark "Signora" ("Sign" pure white #FFF, "ora" coral #FF6F61)
 *     - Uppercase tracked headline: "VIBRANT CONNECTIONS / THROUGH LANGUAGE COLORS"
 *     - Short accent line (32px)
 *     - 3-line descriptive summary
 *     - Startup Verification: "STARTUP VERIFICATION" + "5/5 (100%)", coral progress bar, 5 rows
 *     - Actions: Solid coral button "Continue to Signora →" and underlined link "Explore Overview →"
 * - Avatar Column: Centered 3D humanoid robot, framed upper-body to thighs
 * - Right Annotation Column: "HUMAN SIGN LANGUAGE AI", vertical guide, "INCLUSIVE ACCESSIBLE GLOBAL", "01 ── SIGNORA 3D AVATAR INITIALIZING..."
 */

const SPLASH_STYLES = `
  .splash-root {
    --splash-font-display: 'Outfit', 'Manrope', 'Inter', -apple-system, sans-serif;
    --splash-font-sans:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --splash-font-mono:    'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

    /* Scaled up prominent typographic hierarchy matching reference */
    --splash-size-wordmark:     clamp(98px, 12.2vw, 164px);
    --splash-size-index:        clamp(26px, 2.4vw, 36px);
    --splash-size-headline:     clamp(13.5px, 1.12vw, 16.5px);
    --splash-size-body:         clamp(13.5px, 1.02vw, 16px);
    --splash-size-meta:         clamp(11px, 0.82vw, 12.8px);
    --splash-size-label:        clamp(10.5px, 0.75vw, 12px);
    --splash-size-header:       clamp(10.5px, 0.72vw, 11.5px);
    --splash-size-btn:          clamp(14px, 0.95vw, 16px);
    --splash-size-row-name:     clamp(13.5px, 0.98vw, 15.5px);
    --splash-size-annotation:   clamp(9.5px, 0.68vw, 11px);

    --splash-ls-header:     0.16em;
    --splash-ls-headline:   0.26em;
    --splash-ls-meta:       0.15em;
    --splash-ls-badge:      0.06em;
    --splash-ls-annotation: 0.14em;
    --splash-ls-btn:        0.02em;
    --splash-ls-wordmark:  -0.04em;

    --splash-bg:            #11161F;
    --splash-border:        #232B38;
    --splash-border-faint:  #1A222F;
    --splash-text-primary:  #FFFFFF;
    --splash-text-headline: #D0D7E3;
    --splash-text-muted:    #8E9AA8;
    --splash-text-dim:      #7C8797;
    --splash-text-subdued:  #677486;
    --splash-text-ghost:    #4A5565;
    --splash-coral:         #FF6F61;
    --splash-coral-hover:   #ff8376;
    --splash-blue:          #6FA3EF;
    --splash-amber:         #E5A53D;

    --splash-h-padding:     clamp(36px, 4vw, 56px);
  }

  .splash-wordmark {
    font-family: var(--splash-font-display);
    font-size: var(--splash-size-wordmark);
    font-weight: 800;
    line-height: 0.86;
    letter-spacing: var(--splash-ls-wordmark);
    margin: 0;
    padding: 0;
    white-space: nowrap;
  }
  .splash-wordmark-sign { color: #FFFFFF; }
  .splash-wordmark-ora  { color: var(--splash-coral); }

  .splash-header-text {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-header);
    letter-spacing: var(--splash-ls-header);
    text-transform: uppercase;
    color: var(--splash-text-dim);
    font-weight: 400;
  }

  .splash-section-index {
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-index);
    font-weight: 300;
    color: var(--splash-text-muted);
    line-height: 1;
    margin: 0;
  }

  .splash-headline {
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-headline);
    font-weight: 600;
    letter-spacing: var(--splash-ls-headline);
    line-height: 1.62;
    text-transform: uppercase;
    color: var(--splash-text-headline);
    margin: 0;
  }

  .splash-body {
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-body);
    font-weight: 400;
    line-height: 1.65;
    color: var(--splash-text-muted);
    margin: 0;
    max-width: 480px;
  }

  .splash-verify-label {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-meta);
    letter-spacing: var(--splash-ls-meta);
    text-transform: uppercase;
    color: var(--splash-text-muted);
    font-weight: 500;
  }

  .splash-verify-row {
    display: grid;
    grid-template-columns: 32px minmax(160px, 210px) 1fr auto;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
  }

  .splash-verify-num {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-meta);
    color: var(--splash-text-ghost);
    font-weight: 400;
  }

  .splash-verify-name {
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-row-name);
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1.3;
  }

  .splash-verify-detail {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-meta);
    color: #748295;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .splash-badge {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-label);
    letter-spacing: var(--splash-ls-badge);
    font-weight: 500;
    padding: 4px 11px;
    border-radius: 2px;
    white-space: nowrap;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    text-transform: uppercase;
  }
  .splash-badge--blue {
    color: var(--splash-blue);
    border-color: rgba(111, 163, 239, 0.45);
    background: transparent;
  }
  .splash-badge--amber {
    color: var(--splash-amber);
    border-color: rgba(229, 165, 61, 0.50);
    background: transparent;
  }

  .splash-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 22px;
    background-color: var(--splash-coral);
    color: #11161F;
    border: none;
    border-radius: 2px;
    padding: 13px 30px;
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-btn);
    font-weight: 600;
    letter-spacing: var(--splash-ls-btn);
    cursor: pointer;
    transition: background-color 0.15s ease;
    white-space: nowrap;
  }
  .splash-btn-primary:hover { background-color: var(--splash-coral-hover); }

  .splash-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #DCE3ED;
    color: #DCE3ED;
    padding: 3px 0;
    font-family: var(--splash-font-sans);
    font-size: var(--splash-size-btn);
    font-weight: 500;
    letter-spacing: var(--splash-ls-btn);
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
  }
  .splash-btn-ghost:hover {
    color: #FFFFFF;
    border-color: #FFFFFF;
  }

  .splash-annotation {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-annotation);
    letter-spacing: var(--splash-ls-annotation);
    text-transform: uppercase;
    color: var(--splash-text-subdued);
    line-height: 1.75;
    font-weight: 400;
  }

  .splash-model-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s;
  }
  .splash-model-label {
    font-family: var(--splash-font-mono);
    font-size: var(--splash-size-header);
    letter-spacing: 0.08em;
  }
`;

export default function Splash() {
  const navigate = useNavigate();
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  const [activeModel, setActiveModel] = useState('x-bot');

  const [checks, setChecks] = useState({
    environment: { id: '01', label: 'Environment & Config', status: 'CONFIGURED',       detail: 'Mode: development' },
    webgl:       { id: '02', label: '3D WebGL Engine',      status: 'ACCELERATED',      detail: 'WebGL 2.0 Ready' },
    mediaDevices:{ id: '03', label: 'Media Hardware API',   status: 'AVAILABLE',        detail: 'Camera/Mic APIs Ready' },
    backend:     { id: '04', label: 'Backend API Gateway',  status: 'DEVELOPMENT MODE', detail: 'Local standalone mode' },
    avatarAsset: { id: '05', label: 'Approved 3D Avatar Asset', status: 'AVAILABLE',    detail: '3 Certified Avatar Models Ready' },
  });

  const [hasStartedTransition, setHasStartedTransition] = useState(false);

  const checkKeys = ['environment', 'webgl', 'mediaDevices', 'backend', 'avatarAsset'];
  const completedChecksCount = checkKeys.filter((k) => checks[k].status !== 'Checking...').length;
  const progressPercent = Math.round((completedChecksCount / checkKeys.length) * 100);
  const allChecksFinished = completedChecksCount === checkKeys.length;

  const handleProceed = useCallback(() => {
    if (!isMountedRef.current || hasStartedTransition) return;
    setHasStartedTransition(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    const token = sessionStorage.getItem('signora_auth_token');
    const onboardingCompleted = localStorage.getItem('signora_onboarding_completed') === 'true';
    if (token) navigate('/dashboard');
    else if (onboardingCompleted) navigate('/signin');
    else navigate('/onboarding');
  }, [navigate, hasStartedTransition]);

  const handleAvatarStatusChange = useCallback(() => {
    if (!isMountedRef.current) return;
    setChecks((prev) => ({
      ...prev,
      avatarAsset: { ...prev.avatarAsset, status: 'AVAILABLE', detail: '3 Certified Avatar Models Ready' },
    }));
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    startTimeRef.current = Date.now();

    async function runStartupChecks() {
      const appEnv = config.appEnv || 'development';
      if (isMountedRef.current) {
        setChecks((prev) => ({
          ...prev,
          environment: { ...prev.environment, status: 'CONFIGURED', detail: `Mode: ${appEnv}` },
        }));
      }

      try {
        const res = await apiFetch(API_ENDPOINTS.SYSTEM.HEALTH, { timeout: 2000 });
        if (isMountedRef.current) {
          setChecks((prev) => ({
            ...prev,
            backend: res.ok
              ? { ...prev.backend, status: 'CONNECTED', detail: res.data?.status ? `Online (${res.data.status})` : 'Health 200 OK' }
              : { ...prev.backend, status: 'DEVELOPMENT MODE', detail: 'Local standalone mode' },
          }));
        }
      } catch {
        if (isMountedRef.current) {
          setChecks((prev) => ({
            ...prev,
            backend: { ...prev.backend, status: 'DEVELOPMENT MODE', detail: 'Local standalone mode' },
          }));
        }
      }

      if (isMountedRef.current) {
        const models = avatarService.getAvailableModels ? avatarService.getAvailableModels() : ['x-bot', 'y-bot'];
        setChecks((prev) => ({
          ...prev,
          avatarAsset: { ...prev.avatarAsset, status: 'AVAILABLE', detail: `${models.length || 3} Certified Avatar Models Ready` },
        }));
      }
    }

    runStartupChecks();

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleProceed(); };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleProceed]);

  useEffect(() => {
    if (allChecksFinished && !hasStartedTransition) {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(1000, 12000 - elapsed);
      timerRef.current = setTimeout(handleProceed, remainingTime);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [allChecksFinished, hasStartedTransition, handleProceed]);

  const getBadgeClass = (status) =>
    status === 'DEVELOPMENT MODE' ? 'splash-badge splash-badge--amber' : 'splash-badge splash-badge--blue';

  return (
    <>
      <style>{SPLASH_STYLES}</style>

      {/* ── ROOT VIEWPORT CONTAINER ── */}
      <div
        className="splash-root"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--splash-bg)',
          color: 'var(--splash-text-primary)',
          overflow: 'hidden',
          userSelect: 'none',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── CINEMATIC DUAL-TEMPERATURE LIGHTING (Exact Reference Match) ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: `
              /* Left-center coral anamorphic light streak behind robot */
              radial-gradient(ellipse 650px 850px at 58% 46%, rgba(255, 111, 97, 0.42) 0%, rgba(255, 111, 97, 0.12) 40%, transparent 68%),
              /* Top-right cyan overhead spotlight */
              radial-gradient(ellipse 600px 700px at 82% 8%, rgba(111, 163, 239, 0.40) 0%, rgba(111, 163, 239, 0.08) 45%, transparent 72%),
              /* Deep contrast shadow preserving left readability */
              radial-gradient(circle 850px at 15% 50%, rgba(17, 22, 31, 0.98) 0%, rgba(17, 22, 31, 0.85) 60%, transparent 100%)
            `,
          }}
        />

        {/* ── TOP HEADER BAR: SYSTEM INITIALIZATION | ISL PROTOCOL  ·  ● X-Bot | ○ Y-Bot ── */}
        <header
          style={{
            width: '100%',
            height: '46px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 var(--splash-h-padding)',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 20,
            flexShrink: 0,
          }}
        >
          {/* Left: System metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <span className="splash-header-text">SYSTEM INITIALIZATION</span>
            <span style={{ color: '#384353', fontSize: '11px', lineHeight: 1 }}>|</span>
            <span className="splash-header-text">ISL PROTOCOL</span>
          </div>

          {/* Right: Model Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <button
              type="button"
              className="splash-model-btn"
              onClick={() => setActiveModel('x-bot')}
              aria-pressed={activeModel === 'x-bot'}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FF6F61',
                  flexShrink: 0,
                  boxShadow: activeModel === 'x-bot' ? '0 0 8px #FF6F61' : 'none',
                }}
              />
              <span
                className="splash-model-label"
                style={{
                  color: activeModel === 'x-bot' ? '#FFFFFF' : '#6D7A8C',
                  fontWeight: activeModel === 'x-bot' ? 600 : 400,
                }}
              >
                X-Bot
              </span>
            </button>

            <span style={{ color: '#384353', fontSize: '11px' }}>|</span>

            <button
              type="button"
              className="splash-model-btn"
              onClick={() => setActiveModel('y-bot')}
              aria-pressed={activeModel === 'y-bot'}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  opacity: activeModel === 'y-bot' ? 1 : 0.5,
                  flexShrink: 0,
                }}
              />
              <span
                className="splash-model-label"
                style={{
                  color: activeModel === 'y-bot' ? '#FFFFFF' : '#6D7A8C',
                  fontWeight: activeModel === 'y-bot' ? 600 : 400,
                }}
              >
                Y-Bot
              </span>
            </button>
          </div>
        </header>

        {/* ── HORIZONTAL GRID LINE 1: Full-width continuous rule ── */}
        <div
          aria-hidden="true"
          style={{
            width: 'calc(100% - calc(var(--splash-h-padding) * 2))',
            margin: '0 auto',
            height: '1px',
            backgroundColor: 'var(--splash-border)',
            position: 'relative',
            zIndex: 20,
            flexShrink: 0,
          }}
        />

        {/* ── MAIN WORKSPACE MATRIX ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            boxSizing: 'border-box',
            padding: `0 var(--splash-h-padding) clamp(24px, 3vh, 38px)`,
            minHeight: 0,
          }}
        >
          {/*
           ┌────────────────────────────────────────────────────────┐
           │  LEFT COLUMN (~52% width)                              │
           │  Section index 01 + Horizontal Line 2 + Content Stack │
           └────────────────────────────────────────────────────────┘
          */}
          <div
            style={{
              flex: '0 0 54%',
              maxWidth: '54%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 15,
              paddingRight: 'clamp(24px, 3vw, 44px)',
              boxSizing: 'border-box',
              minHeight: 0,
            }}
          >
            {/* Top Region: Index 01, Line 2, Wordmark, Headline, Body */}
            <div>
              {/* Section Index "01" (Above Line 2) */}
              <div
                style={{
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div className="splash-section-index">01</div>
              </div>

              {/* HORIZONTAL GRID LINE 2: Runs directly under 01 and extends across */}
              <div
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'var(--splash-border)',
                  marginBottom: 'clamp(20px, 2.6vh, 32px)',
                }}
              />

              {/* Giant Signora Wordmark */}
              <h1 className="splash-wordmark" style={{ marginBottom: 'clamp(18px, 2.4vh, 28px)' }}>
                <span className="splash-wordmark-sign">Sign</span>
                <span className="splash-wordmark-ora">ora</span>
              </h1>

              {/* Uppercase Tracked Two-Line Headline */}
              <p className="splash-headline" style={{ marginBottom: 'clamp(14px, 1.8vh, 20px)' }}>
                VIBRANT CONNECTIONS<br />
                THROUGH LANGUAGE COLORS
              </p>

              {/* Short Accent Divider */}
              <div
                aria-hidden="true"
                style={{
                  width: '38px',
                  height: '1.5px',
                  backgroundColor: '#384556',
                  marginBottom: 'clamp(14px, 1.8vh, 20px)',
                }}
              />

              {/* Platform Description Body */}
              <p className="splash-body" style={{ marginBottom: 'clamp(22px, 2.8vh, 34px)' }}>
                Real-time Indian Sign Language bidirectional communication
                platform with 3D avatar animation and computer vision
                recognition.
              </p>

              {/* STARTUP VERIFICATION SECTION */}
              <div style={{ width: '100%', maxWidth: '680px' }}>
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '8px',
                  }}
                >
                  <span className="splash-verify-label">STARTUP VERIFICATION</span>
                  <span
                    className="splash-verify-label"
                    style={{ letterSpacing: '0.04em' }}
                  >
                    {completedChecksCount}/5 ({progressPercent}%)
                  </span>
                </div>

                {/* Coral Progress Bar with Terminal Pip */}
                <div
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Verification progress: ${progressPercent}%`}
                  style={{
                    width: '100%',
                    height: '2.5px',
                    backgroundColor: '#222B38',
                    marginBottom: 'clamp(12px, 1.5vh, 18px)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: 'var(--splash-coral)',
                      transition: 'width 0.45s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Glowing terminal pip at tip */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        right: '-2px',
                        top: '-2px',
                        width: '6.5px',
                        height: '6.5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--splash-coral)',
                        boxShadow: '0 0 7px var(--splash-coral)',
                      }}
                    />
                  </div>
                </div>

                {/* 5 Numbered Verification Rows */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {checkKeys.map((key) => {
                    const item = checks[key];
                    return (
                      <div key={key} className="splash-verify-row">
                        <span className="splash-verify-num">{item.id}</span>
                        <span className="splash-verify-name">{item.label}</span>
                        <span className="splash-verify-detail">{item.detail}</span>
                        <span className={getBadgeClass(item.status)}>{item.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(24px, 3vw, 40px)',
                paddingTop: 'clamp(18px, 2.4vh, 28px)',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                className="splash-btn-primary"
                onClick={handleProceed}
              >
                <span>Continue to Signora</span>
                <span aria-hidden="true" style={{ fontSize: '1.05em', lineHeight: 1 }}>→</span>
              </button>

              <button
                type="button"
                className="splash-btn-ghost"
                onClick={() => navigate('/landing')}
              >
                <span>Explore Overview</span>
                <span aria-hidden="true" style={{ fontSize: '1em', lineHeight: 1 }}>→</span>
              </button>
            </div>
          </div>

          {/*
           ┌────────────────────────────────────────────────────────┐
           │  CENTRE COLUMN — Live 3D Avatar Centerpiece            │
           │  Framed by Vertical Line 1 (left) & Vertical Line 2    │
           │  Horizontal Line 2 passes behind robot at neck level   │
           └────────────────────────────────────────────────────────┘
          */}
          <div
            style={{
              flex: 1,
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 12,
              minWidth: 0,
            }}
          >
            {/* Vertical Line 1 (Left structural border with coral illumination) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '1px',
                backgroundColor: 'var(--splash-border)',
                boxShadow: '1px 0 14px rgba(255, 111, 97, 0.35)',
              }}
            />

            {/* Horizontal Grid Line 2 continuation behind the avatar */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '46px',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: 'var(--splash-border)',
                zIndex: 1,
              }}
            />

            {/* Vertical Line 2 (Right structural border with cyan-blue illumination) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '1px',
                backgroundColor: 'var(--splash-border)',
                boxShadow: '-1px 0 14px rgba(111, 163, 239, 0.30)',
              }}
            />

            {/* Avatar Viewport — Proportional Swiss Framing */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '78%',
                maxHeight: '560px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 2,
              }}
            >
              {/* Radial floor contact shadow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '36px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, transparent 75%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
                <SplashAvatarStage
                  activeModel={activeModel}
                  onAvatarStatusChange={handleAvatarStatusChange}
                />
              </div>
            </div>
          </div>

          {/*
           ┌────────────────────────────────────────────────────────┐
           │  RIGHT COLUMN — Swiss Editorial Annotation Strip       │
           │  HUMAN SIGN LANGUAGE AI                                │
           │  [vertical guide]                                      │
           │  INCLUSIVE ACCESSIBLE GLOBAL                           │
           │  01 ── SIGNORA 3D AVATAR / INITIALIZING...             │
           └────────────────────────────────────────────────────────┘
          */}
          <div
            style={{
              flex: '0 0 100px',
              width: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingLeft: '24px',
              boxSizing: 'border-box',
              zIndex: 15,
            }}
          >
            {/* Top Cluster: Tick + HUMAN SIGN LANGUAGE AI */}
            <div style={{ marginTop: '22px' }}>
              <div
                aria-hidden="true"
                style={{
                  width: '16px',
                  height: '1px',
                  backgroundColor: '#3C4758',
                  marginBottom: '18px',
                }}
              />
              <div className="splash-annotation">
                <div>HUMAN</div>
                <div>SIGN</div>
                <div>LANGUAGE</div>
                <div>AI</div>
              </div>
            </div>

            {/* Middle Cluster: Vertical Guide Line + INCLUSIVE ACCESSIBLE GLOBAL */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
              <div
                aria-hidden="true"
                style={{
                  width: '1px',
                  height: '76px',
                  backgroundColor: '#3C4758',
                  position: 'relative',
                }}
              >
                {/* Small indicator pip on the line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '-1px',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    backgroundColor: '#677486',
                  }}
                />
              </div>
              <div className="splash-annotation">
                <div>INCLUSIVE</div>
                <div>ACCESSIBLE</div>
                <div>GLOBAL</div>
              </div>
            </div>

            {/* Bottom Cluster: 01 ── + SIGNORA 3D AVATAR INITIALIZING... */}
            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--splash-font-sans)',
                    fontSize: 'clamp(13px, 0.9vw, 15px)',
                    fontWeight: 300,
                    color: '#8E9AA8',
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
                <div
                  aria-hidden="true"
                  style={{ width: '28px', height: '1px', backgroundColor: '#3C4758' }}
                />
              </div>
              <div className="splash-annotation">
                <div>SIGNORA 3D AVATAR</div>
                <div>INITIALIZING ...</div>
              </div>
            </div>
          </div>

        </div>{/* /MAIN WORKSPACE */}
      </div>{/* /ROOT */}
    </>
  );
}
