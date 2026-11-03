import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AvatarCanvas } from '../../components/avatar/AvatarCanvas.jsx';
import { API_ENDPOINTS, apiFetch } from '../../config/apiEndpoints.js';
import '../../styles/hastivo-landing.css';

/**
 * Hastivo — Seven-Screen Onboarding Experience
 * Architectural Swiss Minimalist Redesign matching design.md and index.css design tokens.
 */

const ONBOARDING_SLIDES = [
  {
    step: 1,
    badge: '01 // INTRODUCTION',
    title: 'Welcome to Hastivo AI',
    subtitle: 'Intelligent Communication Platform',
    description:
      'An open neural infrastructure engineered to bridge the gap between Indian Sign Language (ISL) and spoken orthography through spatial kinematics.',
    isApproved: true,
    statusNotice: 'Subsystem: Verified & Operational',
    accentToken: 'var(--color-blue, var(--brand-blue))',
    tag: 'INITIALIZATION',
  },
  {
    step: 2,
    badge: '02 // KINEMATICS',
    title: 'Turn Text into Signs',
    subtitle: 'Text & Speech Translation',
    description:
      'Enter spoken or written English & Hindi phrases. Our neural rig reorganizes SVO syntax into true ISL topic-comment spatial structures in real time.',
    isApproved: true,
    statusNotice: 'Synthesis: 78 D.O.F. Rig Ready',
    accentToken: 'var(--color-coral, var(--brand-coral))',
    tag: 'TEXT-TO-SIGN',
  },
  {
    step: 3,
    badge: '03 // SENSORIUM',
    title: 'Let Your Gestures Speak',
    subtitle: 'Vision & Sign Recognition',
    description:
      'Sub-100ms computer vision tracks 42 hand joints (dual 21-carpal meshes) and 468 facial points through any standard mobile or desktop camera.',
    isApproved: true,
    statusNotice: 'Sensorium: 60 FPS Hardware-Sync',
    accentToken: 'var(--color-amber, var(--brand-yellow))',
    tag: 'SIGN-TO-TEXT',
  },
  {
    step: 4,
    badge: '04 // CONCURRENCY',
    title: 'Communicate in Real Time',
    subtitle: 'Simultaneous Two-Way Interaction',
    description:
      'Continuous duplex stream tailored for government desks, hospital triage, and banking branches with zero interpreter bottlenecks.',
    isApproved: true,
    statusNotice: 'Duplex Bridge: < 118ms Latency',
    accentToken: 'var(--color-blue, var(--brand-blue))',
    tag: 'REAL-TIME DUPLEX',
  },
  {
    step: 5,
    badge: '05 // LINGUISTICS',
    title: 'Understand the Meaning',
    subtitle: 'Contextual AI Processing',
    description:
      'Indexed against 14,200 ISLRTC official sign morphemes, handling subtle regional dialect shifts and non-manual marker facial tension vectors.',
    isApproved: true,
    statusNotice: 'Lexicon: ISLRTC Corpus Active',
    accentToken: 'var(--color-coral, var(--brand-coral))',
    tag: 'SEMANTIC PARSER',
  },
  {
    step: 6,
    badge: '06 // SOVEREIGNTY',
    title: 'Air-Gapped Client Privacy',
    subtitle: 'Zero Cloud Biometric Retention',
    description:
      'Hardware-isolated client execution. Raw video telemetry stays air-gapped in browser RAM and vanishes instantly upon tokenization.',
    isApproved: true,
    statusNotice: 'Security: Zero Cloud Video Retention',
    accentToken: 'var(--color-amber, var(--brand-yellow))',
    tag: 'ZERO-TELEMETRY',
  },
  {
    step: 7,
    badge: '07 // COMMENCE',
    title: 'Enter the Sovereign Interface',
    subtitle: 'Ready for Deployment',
    description:
      'Hastivo is initialized. Launch your terminal session to begin bidirectional translation, review logs, and explore custom dialect profiles.',
    isApproved: true,
    statusNotice: 'System Status: 100% Edge Autonomous',
    accentToken: 'var(--color-blue, var(--brand-blue))',
    tag: 'TERMINAL READY',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeModel, setActiveModel] = useState('x-bot');
  const avatarRef = useRef(null);

  const handleComplete = useCallback(async () => {
    try {
      localStorage.setItem('hastivo_onboarding_completed', 'true');
      localStorage.setItem('hastivo_onboarding_completed_at', new Date().toISOString());
      localStorage.setItem('hastivo_preferred_avatar_model', activeModel);
    } catch (_) {
      // Storage safety
    }

    try {
      await apiFetch(API_ENDPOINTS.SETTINGS, {
        method: 'PATCH',
        body: JSON.stringify({
          onboardingCompleted: true,
          preferredAvatarModel: activeModel,
        }),
      });
    } catch (_) {
      // API sync fallback
    }

    navigate('/signin');
  }, [navigate, activeModel]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setSlideDirection(1);
      setIsAnimating(true);
      setCurrentSlide((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 320);
    } else {
      handleComplete();
    }
  }, [currentSlide, isAnimating, handleComplete]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    if (currentSlide > 0) {
      setSlideDirection(-1);
      setIsAnimating(true);
      setCurrentSlide((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 320);
    }
  }, [currentSlide, isAnimating]);

  const handleJumpToSlide = useCallback(
    (index) => {
      if (index === currentSlide || isAnimating) return;
      setSlideDirection(index > currentSlide ? 1 : -1);
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 320);
    },
    [currentSlide, isAnimating]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleSwitchModel = (model) => {
    setActiveModel(model);
    if (avatarRef.current && typeof avatarRef.current.switchModel === 'function') {
      avatarRef.current.switchModel(model);
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <div className="sl-landing-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* BACKGROUND VIDEO LAYER */}
      <div className="sl-bg-video-wrapper" aria-hidden="true">
        <video
          className="sl-bg-video"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="sl-bg-video-overlay" />
      </div>

      {/* TOP EDITORIAL TICKER & TELEMETRY STRIP */}
      <aside className="sl-top-ticker">
        <div className="sl-max-w sl-top-ticker-inner">
          <div className="sl-ticker-left">
            <span className="sl-ticker-active-badge">
              <span className="sl-ping-dot" />
              ONBOARDING.SEQUENCE
            </span>
            <span className="sl-ticker-sep text-secondary">
              STAGE: 0{slide.step} / 07
            </span>
            <span className="sl-ticker-sep text-muted">
              PROTOCOL: RFC-ISL-2025
            </span>
          </div>
          <div className="sl-ticker-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="text-secondary">
              <span>EDGE RIG: <strong style={{ color: slide.accentToken, fontWeight: 400 }}>{activeModel.toUpperCase()}</strong></span>
              <span className="text-muted">/</span>
              <span>BUFFER: <strong className="text-primary" style={{ fontWeight: 400 }}>SECURE</strong></span>
            </div>
            <div style={{ borderLeft: 'var(--border-width, 1px) solid var(--border)', paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-coral">ISL</span>
              <span className="text-muted">⇌</span>
              <span className="text-primary">HI·EN</span>
            </div>
          </div>
        </div>
      </aside>

      {/* EDITORIAL MASTHEAD */}
      <header className="sl-header">
        <div className="sl-max-w sl-header-inner">
          <div className="sl-brand-group">
            <Link to="/" className="sl-brand-logo">
              <span className="sl-brand-sign">Sign</span>
              <span className="sl-brand-ora">ora</span>
              <span className="sl-brand-tag">ONBOARDING</span>
            </Link>
            <span className="sl-brand-sub">Spatial Interface Calibration</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/landing"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-eyebrow, 11px)',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                textDecoration: 'none',
                padding: '8px 16px',
                border: 'var(--border-width, 1px) solid var(--border)',
                borderRadius: 'var(--radius-control, 4px)',
              }}
            >
              Overview &amp; Specs
            </Link>
            <button
              onClick={handleComplete}
              style={{
                background: 'transparent',
                border: 'var(--border-width, 1px) solid var(--border)',
                color: 'var(--text-muted)',
                padding: '8px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-eyebrow, 11px)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                borderRadius: 'var(--radius-control, 4px)',
              }}
            >
              Skip to Sign In →
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ONBOARDING STAGE (SWISS EDITORIAL SPLIT) */}
      <main className="sl-editorial-grid-bg" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div className="sl-max-w" style={{ width: '100%', padding: '48px clamp(16px, 3.5vw, 48px)' }}>
          <div
            style={{
              border: 'var(--border-width, 1px) solid var(--border)',
              backgroundColor: 'var(--surface, #242830)',
              backdropFilter: 'blur(16px)',
              display: 'grid',
              gridTemplateColumns: '7fr 5fr',
            }}
          >
            {/* Left: Interactive Editorial Walkthrough */}
            <div
              className="sl-crosshair-node"
              style={{
                padding: 'clamp(28px, 4vw, 56px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: 'var(--border-width, 1px) solid var(--border)',
                minHeight: '520px',
              }}
            >
              <div>
                {/* Step Metadata Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-eyebrow, 11px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: slide.accentToken,
                    }}
                  >
                    {slide.badge}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-eyebrow, 10px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      padding: '2px 8px',
                      border: `var(--border-width, 1px) solid ${slide.accentToken}`,
                      color: slide.accentToken,
                      borderRadius: 'var(--radius-control, 4px)',
                    }}
                  >
                    {slide.tag}
                  </span>
                </div>

                {/* Monumental Slide Title */}
                <h1
                  style={{
                    fontFamily: 'var(--font-display, "Manrope", sans-serif)',
                    fontSize: 'var(--text-h1, clamp(30px, 3.8vw, 48px))',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <h3
                  className="text-coral"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    margin: '0 0 24px 0',
                    fontWeight: 500,
                  }}
                >
                  {slide.subtitle}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: 300,
                    lineHeight: 1.65,
                    maxWidth: '560px',
                    margin: '0 0 32px 0',
                  }}
                >
                  {slide.description}
                </p>

                {/* Status Notice Indicator */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px',
                    border: 'var(--border-width, 1px) solid var(--border-subtle)',
                    backgroundColor: 'var(--surface-elevated)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-eyebrow, 11px)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-control, 4px)',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', backgroundColor: slide.accentToken, borderRadius: '50%' }} />
                  <span>{slide.statusNotice}</span>
                </div>
              </div>

              {/* Bottom Progress Bar & Navigation Controls */}
              <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: 'var(--border-width, 1px) solid var(--border)' }}>
                {/* 7 Segmented Step Bars */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {ONBOARDING_SLIDES.map((s, idx) => {
                    const isActive = idx === currentSlide;
                    const isCompleted = idx < currentSlide;
                    return (
                      <button
                        key={s.step}
                        onClick={() => handleJumpToSlide(idx)}
                        style={{
                          flex: 1,
                          height: '3px',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          backgroundColor: isActive
                            ? 'var(--color-coral, var(--brand-coral))'
                            : isCompleted
                            ? 'var(--color-blue, var(--brand-blue))'
                            : 'var(--border)',
                          transition: 'background-color var(--duration-fast, 150ms)',
                        }}
                        aria-label={`Jump to slide ${s.step}`}
                      />
                    );
                  })}
                </div>

                {/* Action Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentSlide === 0}
                    style={{
                      background: 'transparent',
                      border: 'var(--border-width, 1px) solid var(--border)',
                      color: currentSlide === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                      padding: '10px 20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta, 12px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                      borderRadius: 'var(--btn-radius, 4px)',
                      transition: 'all var(--duration-fast, 150ms)',
                    }}
                  >
                    ← Previous
                  </button>

                  <span className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-eyebrow, 11px)' }}>
                    KEYBOARD: [← / →]
                  </span>

                  <button
                    onClick={handleNext}
                    style={{
                      backgroundColor: 'var(--color-coral, var(--brand-coral))',
                      border: 'var(--border-width, 1px) solid var(--color-coral, var(--brand-coral))',
                      color: 'var(--brand-charcoal, #2E2E2E)',
                      padding: '10px 24px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta, 12px)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                      borderRadius: 'var(--btn-radius, 4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all var(--duration-fast, 150ms)',
                    }}
                  >
                    <span>{currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Launch Terminal' : 'Next Stage'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Unboxed 3D Avatar Stage */}
            <div
              className="sl-crosshair-node-br"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'var(--surface-elevated, #2E333D)',
              }}
            >
              {/* Header Telemetry */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: 'var(--border-width, 1px) solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: slide.accentToken, display: 'inline-block' }} />
                  <span className="text-primary">RIG.PREVIEW: MIXAMO</span>
                </div>
                {/* Model switcher */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleSwitchModel('x-bot')}
                    style={{
                      background: activeModel === 'x-bot' ? 'var(--color-coral, var(--brand-coral))' : 'var(--surface)',
                      border: 'var(--border-width, 1px) solid var(--border)',
                      color: activeModel === 'x-bot' ? 'var(--brand-charcoal, #2E2E2E)' : 'var(--text-secondary)',
                      padding: '2px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-control, 2px)',
                    }}
                  >
                    X-BOT
                  </button>
                  <button
                    onClick={() => handleSwitchModel('y-bot')}
                    style={{
                      background: activeModel === 'y-bot' ? 'var(--color-blue, var(--brand-blue))' : 'var(--surface)',
                      border: 'var(--border-width, 1px) solid var(--border)',
                      color: activeModel === 'y-bot' ? 'var(--brand-charcoal, #2E2E2E)' : 'var(--text-secondary)',
                      padding: '2px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-control, 2px)',
                    }}
                  >
                    Y-BOT
                  </button>
                </div>
              </div>

              {/* 3D Canvas Viewport */}
              <div style={{ position: 'relative', width: '100%', height: '440px', overflow: 'hidden' }}>
                <AvatarCanvas
                  ref={avatarRef}
                  theme="dark"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                />

                {/* HUD Overlay Lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-eyebrow, 10px)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">SLIDE: {slide.step}/07</span>
                    <span style={{ color: slide.accentToken }}>{slide.tag}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }} className="text-muted">
                    <span>ROTATION: 0.00°</span>
                    <span>FPS: LOCKED 60</span>
                  </div>
                </div>
              </div>

              {/* Bottom Ticker */}
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: 'var(--border-width, 1px) solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>ISLRTC SYNC NOMINAL</span>
                <span className="text-coral">AIR-GAPPED</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER TICKER */}
      <footer className="sl-footer" style={{ borderTop: 'var(--border-width, 1px) solid var(--border)', padding: '16px 0' }}>
        <div className="sl-max-w text-muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', flexWrap: 'wrap', gap: '8px' }}>
          <span>HASTIVO KINEMATIC ONBOARDING SUITE</span>
          <span>© 2025 HASTIVO RECOGNIZE LABS • NEW DELHI</span>
        </div>
      </footer>
    </div>
  );
}
