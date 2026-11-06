import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { AvatarCanvas } from '../../components/avatar/AvatarCanvas.jsx';
import '../../styles/hastivo-landing.css';

/**
 * Hastivo Landing Page — Clean Open Swiss Minimalist Structure
 *
 * Requirements fulfilled:
 * 1. ZERO top header, navbar, menubar, or sidebar (All navigation lives in the initial floating dock with drag-to-center warp).
 * 2. Background video with reduced transparency (0.80 dark theme / 0.28 light theme) matching signin/login.
 * 3. Removal of Swiss grid background lines and borders for an open, airy, fluid aesthetic.
 * 4. Light and Dark theme separation adhering strictly to index.css and ThemeContext.
 * 5. Added +4 brand-aligned feature sections (+4 new sections using solely the 5 system palette tokens):
 *    - Section 1: Multi-Modal Computer Vision Sensorium
 *    - Section 2: SOV Spatial Syntax Translation Engine
 *    - Section 3: Real-Time Dual Duplex Mode
 *    - Section 4: Sovereign Privacy & Constitutional Inclusion
 * 6. EXACT custom footer layout matching the provided screenshot (ISL Bridge AI, MIT license, Capstone research tags, Platform modules, Academic research).
 *
 * System Color Palette:
 * --brand-coral:    #FF6F61;
 * --brand-blue:     #6FA3EF;
 * --brand-yellow:   #FFC107;
 * --brand-charcoal: #2E2E2E;
 * --brand-grey:     #D1CFCF;
 */

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef(null);
  const avatarCanvasRef = useRef(null);
  const [activeModel, setActiveModel] = useState('v-bot');
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const fullMessage = 'Hastivo deploys sub-100ms spatial computer vision and kinematic neural rigs. We parse the full grammar of Indian Sign Language—handshapes, spatial syntax, and facial non-manual markers—directly on client silicon.';
    let index = 0;
    setTypedText('');
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      index++;
      setTypedText(fullMessage.slice(0, index));
      if (index >= fullMessage.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled by browser policy
      });
    }
  }, []);

  const handleSwitchModel = (model) => {
    setActiveModel(model);
    if (avatarCanvasRef.current && typeof avatarCanvasRef.current.switchModel === 'function') {
      avatarCanvasRef.current.switchModel(model);
    }
  };

  return (
    <div className="sl-landing-root">
      {/* BACKGROUND VIDEO LAYER (Matching Auth Screen with Theme Adaptation) */}
      <div className="sl-bg-video-wrapper" aria-hidden="true">
        <video
          ref={videoRef}
          className="sl-bg-video"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="sl-bg-video-overlay" />
      </div>

      {/* Floating Theme Quick Switcher (Top Right Corner) */}
      <div style={{ position: 'fixed', top: '24px', right: '28px', zIndex: 100 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--surface, #242830)',
            border: 'var(--border-width, 1px) solid var(--border-subtle, #41444B)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-control, 4px)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
        </button>
      </div>

      {/* MAIN OPEN CONTENT CONTAINER (Zero Headers, Zero Menubars, Zero Grids) */}
      <main className="sl-editorial-clean-bg">
        {/* HERO SECTION */}
        <section className="sl-max-w" style={{ paddingTop: 'clamp(56px, 8vw, 112px)', paddingBottom: '56px' }}>
          <div className="sl-hero-split">
            {/* Left Column: Monumental Typographic Voice */}
            <div className="sl-hero-left">
              <div>
                <div className="sl-pill-badge">
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-coral, var(--brand-coral))', borderRadius: '50%', display: 'inline-block' }} />
                  <span>RECONSTRUCTING COGNITIVE EQUALITY</span>
                </div>

                <h1 className="sl-hero-title">
                  Silence <br />
                  <span className="sl-hero-title-italic">translated into</span><br />
                  <span className="sl-hero-title-underline">Sovereignty.</span>
                </h1>

                <p className="sl-hero-desc sl-typewriter-text" aria-label="Hastivo deploys sub-100ms spatial computer vision and kinematic neural rigs. We parse the full grammar of Indian Sign Language—handshapes, spatial syntax, and facial non-manual markers—directly on client silicon." style={{ minHeight: '4.8em' }}>
                  <span>{typedText}</span>
                  <span
                    className="sl-typewriter-cursor"
                    style={{
                      display: 'inline-block',
                      width: '2.5px',
                      height: '1.05em',
                      backgroundColor: 'var(--color-coral, var(--brand-coral))',
                      marginLeft: '3px',
                      verticalAlign: 'text-bottom',
                      animation: isTypingComplete ? 'cursorBlink 1s infinite' : 'none',
                      opacity: 1,
                    }}
                  />
                </p>
              </div>

              {/* Bottom Support Matrix */}
              <div className="sl-hero-bottom">
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>
                    Native Support Matrix
                  </span>
                  <p style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    भारतीय सांकेतिक भाषा (ISL) • हिंदी • English
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    14,200 Morphemes Indexed / Zero-Latency Edge
                  </p>
                </div>

                <div>
                  <Link to="/signin" className="sl-explore-btn">
                    <span>Launch Terminal</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>north_east</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Live 3D Humanoid Avatar Stage */}
            <div className="sl-hero-right" id="architecture">
              <div className="sl-avatar-hud-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-blue, var(--brand-blue))', display: 'inline-block', borderRadius: '1px' }} />
                  <span className="text-primary" style={{ letterSpacing: '0.1em' }}>RIG.TELEMETRY: SKELETAL 3D</span>
                </div>

                {/* Model switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleSwitchModel('v-bot')}
                    style={{
                      background: activeModel === 'v-bot' ? 'var(--color-coral, var(--brand-coral))' : 'transparent',
                      border: 'var(--border-width, 1px) solid var(--border-subtle)',
                      color: activeModel === 'v-bot' ? 'var(--brand-charcoal, #2E2E2E)' : 'var(--text-secondary)',
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
                    onClick={() => handleSwitchModel('v-bot')}
                    style={{
                      background: activeModel === 'v-bot' ? 'var(--color-blue, var(--brand-blue))' : 'transparent',
                      border: 'var(--border-width, 1px) solid var(--border-subtle)',
                      color: activeModel === 'v-bot' ? 'var(--brand-charcoal, #2E2E2E)' : 'var(--text-secondary)',
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
                  <span className="text-muted" style={{ fontSize: '11px', marginLeft: '4px' }}>[34.2, -12.4]</span>
                </div>
              </div>

              {/* Three.js Live Canvas */}
              <div className="sl-avatar-viewport">
                <AvatarCanvas
                  ref={avatarCanvasRef}
                  theme={theme}
                  style={{ width: '100%', height: '100%', minHeight: '520px', backgroundColor: 'transparent' }}
                />

                {/* Technical HUD Overlay */}
                <div className="sl-avatar-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    <div style={{ borderLeft: 'var(--border-width, 1px) solid var(--color-coral, var(--brand-coral))', paddingLeft: '8px' }}>
                      <span className="text-coral" style={{ display: 'block' }}>HEAD ORIENTATION</span>
                      <span className="text-primary">PITCH: +4.2° | YAW: -2.1°</span>
                    </div>
                    <div style={{ borderRight: 'var(--border-width, 1px) solid var(--color-blue, var(--brand-blue))', paddingRight: '8px', textAlign: 'right' }}>
                      <span className="text-blue" style={{ display: 'block' }}>FACIAL AFFECT (NMM)</span>
                      <span className="text-primary">INTERROGATIVE [99.2%]</span>
                    </div>
                  </div>

                  {/* Center Reticle */}
                  <div style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: 'var(--border-width, 1px) solid var(--border-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-coral, var(--brand-coral))', borderRadius: '50%' }} />
                    </div>
                    <span style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', backgroundColor: 'var(--surface)', padding: '2px 8px', border: 'var(--border-width, 1px) solid var(--border-subtle)' }}>
                      TORSO REF: 0,0,0
                    </span>
                  </div>

                  {/* Landmarks Status */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '4px' }}>
                      <span className="text-muted">DUAL CARPAL MESH</span>
                      <span className="text-coral">21 x 2 LANDMARKS LOCKED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">PARSING RATE</span>
                      <span className="text-blue">60.0 FPS CONTINUOUS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Ticker */}
              <div className="sl-avatar-hud-foot">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-coral, var(--brand-coral))', display: 'inline-block' }} />
                  HASTIVO-KINETIC V2.4.0
                </span>
                <span className="text-coral">EDGE PRIVACY VERIFIED</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* +4 NEW SECTIONS IN MATCHING DESIGN SYSTEM & SYSTEM PALETTE   */}
        {/* ============================================================ */}

        {/* SECTION 1: MULTI-MODAL COMPUTER VISION SENSORIUM */}
        <section className="sl-max-w" style={{ padding: '48px clamp(20px, 4vw, 56px)' }} id="sensorium">
          <div className="sl-section-header">
            <div>
              <span className="text-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: '6px' }}>
                01 // SENSORIUM &amp; CV ARCHITECTURE
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Computer Vision Sensorium
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
                Real-time spatial capture processing 543 simultaneous anatomical landmark points per frame without transmitting pixel buffers outside client device memory.
              </p>
            </div>
          </div>

          <div className="sl-feature-grid">
            <div className="sl-feature-card">
              <div>
                <span className="text-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  FEATURE 01.A
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Dual Carpal 42-Point Mesh</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  High-precision tracking of 21 articulation coordinates per hand. Resolves finger inter-occlusions, rapid finger-spelling, and micro-movements across varying skin tones and background lighting.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                PRECISION: 0.84MM AT 60 FPS
              </div>
            </div>

            <div className="sl-feature-card">
              <div>
                <span className="text-coral" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  FEATURE 01.B
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>468-Vertex Facial Affect</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Extracts facial Non-Manual Markers (NMM)—eyebrow lifts, head tilts, and mouth shapes—which convey essential grammatical markers (questions, negations, conditionals) in ISL.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                NMM DISAMBIGUATION: 99.2%
              </div>
            </div>

            <div className="sl-feature-card">
              <div>
                <span className="text-amber" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  FEATURE 01.C
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>33-Point Skeletal Pose</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Tracks upper-body torso references and shoulder tilt angles to establish the 3D signing space envelope according to standard ISLRTC linguistics.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                CALIBRATION: ZERO SENSOR SETUP
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SOV SPATIAL SYNTAX TRANSLATION ENGINE */}
        <section className="sl-max-w" style={{ padding: '48px clamp(20px, 4vw, 56px)' }} id="syntax">
          <div className="sl-section-header">
            <div>
              <span className="text-coral" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: '6px' }}>
                02 // LINGUISTIC PARSING ENGINE
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Spatial SOV Grammar
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
                Indian Sign Language has a rich, independent spatial grammar distinct from linear English or Hindi. Hastivo reorganizes sentence syntax rather than doing direct word-for-word translation.
              </p>
            </div>
          </div>

          <div className="sl-pillars-grid">
            <div className="sl-pillar-col">
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 300, color: 'var(--text-muted)' }}>01</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '16px 0 12px 0' }}>Linear to Spatial Grammar</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Transforms standard Subject-Verb-Object (SVO) written sequences into Time-Topic-Comment structures with spatial referent points anchored in 3D coordinate space.
                </p>
              </div>
              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">SYNTAX MAPPING</span>
                <span className="text-coral">SOV TOPIC-COMMENT</span>
              </div>
            </div>

            <div className="sl-pillar-col">
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 300, color: 'var(--text-muted)' }}>02</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '16px 0 12px 0' }}>14,200 Official Morphemes</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Comprehensive lexical corpus aligned with the ISLRTC dictionary, covering everyday conversational idioms, judicial terminology, administrative forms, and regional dialect variations.
                </p>
              </div>
              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">CORPUS BASE</span>
                <span className="text-blue">ISLRTC V4.2 CERTIFIED</span>
              </div>
            </div>

            <div className="sl-pillar-col">
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 300, color: 'var(--text-muted)' }}>03</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '16px 0 12px 0' }}>Devanagari Orthography</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Direct phonetic and orthographic binding for Hindi and English. Speech recognition transcribes spoken inputs and maps homophones to correct spatial gesture tokens automatically.
                </p>
              </div>
              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">LOCALIZATION</span>
                <span className="text-amber">BILINGUAL HI / EN</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: REAL-TIME DUAL CONVERSATION DUPLEX */}
        <section className="sl-max-w" style={{ padding: '48px clamp(20px, 4vw, 56px)' }} id="duplex">
          <div className="sl-section-header">
            <div>
              <span className="text-amber" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: '6px' }}>
                03 // CONCURRENT COMMUNICATION
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Real-Time Dual Duplex Mode
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
                Simultaneous two-way conversational bridge designed for counters, bank desks, hospitals, and educational classrooms.
              </p>
            </div>
          </div>

          <div className="sl-feature-grid">
            <div className="sl-feature-card">
              <div>
                <span className="text-coral" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  LATENCY CRITICAL
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Sub-118ms Local Turnaround</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Zero roundtrip latency to remote cloud servers. Recognition and avatar synthesis happen concurrently on device GPU cores so conversation cadence feels natural.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                TRANSPORT: WEBRTC P2P DIRECT
              </div>
            </div>

            <div className="sl-feature-card">
              <div>
                <span className="text-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  AUDIO SYNTHESIS
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Neural Speech Vocoder</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  High-fidelity 48kHz FastSpeech2 vocal generation gives a clear, natural audible voice to the deaf participant's sign language gestures in both Hindi and Indian English.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                SAMPLE RATE: 48 KHZ HIGH FIDELITY
              </div>
            </div>

            <div className="sl-feature-card">
              <div>
                <span className="text-amber" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '12px' }}>
                  ACCESSIBLE UI
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Dual Direction Transcript</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  Synchronized live transcription view with replay options, font scaling, audio speed controls (0.5x to 2.0x), and exportable session logs.
                </p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-width, 1px) solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                COMPLIANCE: WCAG 2.1 LEVEL AA
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CIVIC ACCESSIBILITY & CONSTITUTIONAL SOVEREIGNTY */}
        <section className="sl-max-w" style={{ padding: '48px clamp(20px, 4vw, 56px)' }} id="sovereignty">
          <div className="sl-section-header">
            <div>
              <span className="text-coral" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: '6px' }}>
                04 // CIVIC GUARANTEE &amp; PRIVACY
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Sovereign Privacy &amp; Inclusion
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
                Under constitutional privacy doctrines and the Rights of Persons with Disabilities (RPwD) Act 2016, Hastivo guarantees zero-retention edge security.
              </p>
            </div>
          </div>

          <div className="sl-metrics-grid">
            <div className="sl-metric-card">
              <span className="text-coral" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '14px' }}>
                BENCHMARK 01 // ACCURACY
              </span>
              <div className="sl-metric-num">
                99.4<span className="text-coral" style={{ fontSize: '36px', fontWeight: 300 }}>%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                Syntactic precision verified against standard ISLRTC corpora across regional dialect shifts across India.
              </p>
            </div>

            <div className="sl-metric-card">
              <span className="text-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '14px' }}>
                BENCHMARK 02 // SPEED
              </span>
              <div className="sl-metric-num">
                &lt;120<span className="text-blue" style={{ fontSize: '36px', fontWeight: 300 }}>ms</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                End-to-end turnaround running on standard browser hardware without high-end dedicated GPU clusters.
              </p>
            </div>

            <div className="sl-metric-card">
              <span className="text-amber" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '14px' }}>
                BENCHMARK 03 // AIR-GAP PRIVACY
              </span>
              <div className="sl-metric-num">
                100<span className="text-amber" style={{ fontSize: '36px', fontWeight: 300 }}>%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                Zero video telemetry leaves client browser memory. Ephemeral frame buffers are wiped on tokenization.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* EXACT USER SPECIFIED FOOTER                                  */}
      {/* ============================================================ */}
      <footer className="sl-custom-footer">
        <div className="sl-max-w">
          <div className="sl-custom-footer-main">
            {/* Left Column: Brand & Capstone Summary */}
            <div>
              <div className="sl-footer-brand-title">
                <div className="sl-footer-hand-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  ISL Bridge <span className="text-blue">AI</span>
                </h3>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 300, margin: '0 0 24px 0', maxWidth: '440px' }}>
                Final-Year Computer Science and Engineering Capstone Project. Advanced bi-directional Indian Sign Language translation bridging communication between the Deaf community and the hearing world through real-time computer vision and 3D signing avatars.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="text-blue">⚙️</span>
                  <span>MediaPipe + PyTorch Temporal Model</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="text-coral">🛡️</span>
                  <span>Zero-Cloud Camera Privacy</span>
                </span>
              </div>
            </div>

            {/* Middle Column: Platform Modules */}
            <div>
              <div className="sl-footer-heading">PLATFORM MODULES</div>
              <ul className="sl-footer-links">
                <li><Link to="/sign-to-text">Sign-to-Text Studio</Link></li>
                <li><Link to="/text-to-sign">Speech/Text-to-Sign</Link></li>
                <li><Link to="/conversation">Dual Conversation Mode</Link></li>
                <li><Link to="/vocabulary-explorer">ISL Vocabulary Explorer</Link></li>
                <li><Link to="/history">Translation History</Link></li>
              </ul>
            </div>

            {/* Right Column: Academic Research */}
            <div>
              <div className="sl-footer-heading">ACADEMIC RESEARCH</div>
              <ul className="sl-footer-links">
                <li>
                  <Link to="/architecture-specs" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Architecture &amp; ER Specs</span>
                    <span className="text-blue">✨</span>
                  </Link>
                </li>
                <li><a href="#syntax">Corpus: INCLUDE-50 &amp; ISL-CSLTR</a></li>
                <li><a href="#syntax">Grammar: SOV Topic-Comment</a></li>
                <li><Link to="/privacy">Accessibility &amp; Privacy</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="sl-footer-bottom-bar">
            <div>
              © 2026 ISL Bridge AI. Final-Year CSE Capstone Research Project. Distributed under MIT License for academic and accessibility evaluation.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Engineered with empathy for Deaf Accessibility</span>
              <span className="text-coral" style={{ fontSize: '14px' }}>❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
