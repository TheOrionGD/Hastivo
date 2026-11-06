import React, { useRef, useState } from 'react';

const LEXICON_ITEMS = [
  {
    sign: 'Namaste',
    nativeText: 'नमस्ते',
    type: 'Two-Handed Symmetrical',
    context: 'Universal Indian Greeting & Respect',
    gestureNote: 'Palms joined at sternum level with slight head flexion',
    articulation: '27-DOF Symmetrical',
    badge: 'LEX-01',
    accent: '#ff6f61',
  },
  {
    sign: 'Help / Assist',
    nativeText: 'सहायता',
    type: 'Spatial Directional',
    context: 'Emergency, Support & Accessibility Gate',
    gestureNote: 'Closed fist on open horizontal palm moving forward',
    articulation: 'Directional Vector',
    badge: 'LEX-02',
    accent: '#6fa3ef',
  },
  {
    sign: 'Doctor / Medical',
    nativeText: 'चिकित्सक',
    type: 'Contact Anatomical Sign',
    context: 'Healthcare Navigation & Clinical Dialogue',
    gestureNote: 'Index & middle fingers tapping radial pulse at wrist',
    articulation: 'Radial Contact Pulse',
    badge: 'LEX-03',
    accent: '#10b981',
  },
  {
    sign: 'Education / Learn',
    nativeText: 'शिक्षा',
    type: 'Non-Manual Marker (NMM)',
    context: 'Pedagogical Lexicon & Knowledge Transfer',
    gestureNote: 'Open palm towards forehead with visual focus',
    articulation: 'Cranial Proximal',
    badge: 'LEX-04',
    accent: '#ffc107',
  },
  {
    sign: 'Friend / Community',
    nativeText: 'मित्रता',
    type: 'Interactive Coordinate',
    context: 'Social Inclusion & Citizen Networking',
    gestureNote: 'Interlocking index hooks oscillating in signing plane',
    articulation: 'Bilateral Hook Mesh',
    badge: 'LEX-05',
    accent: '#a855f7',
  },
  {
    sign: 'Thank You',
    nativeText: 'धन्यवाद',
    type: 'Cheek/Chin Release Sign',
    context: 'Politeness Formula & Conversational Close',
    gestureNote: 'Flat hand tips touching lower lip and moving forward',
    articulation: 'Forward Labial Release',
    badge: 'LEX-06',
    accent: '#38bdf8',
  },
];

export default function HorizontalLexiconScroller() {
  const scrollRef = useRef(null);
  const [activeItem, setActiveItem] = useState(0);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="horizontal-lexicon-wrapper" style={{ position: 'relative', width: '100%', margin: '28px 0' }}>
      {/* Scroll Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 4px', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-blue, #6FA3EF)' }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase' }}>
            [ RUNWAY / {LEXICON_ITEMS.length} VERIFIED PHONEMES ]
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={scrollLeft}
            style={{
              width: '36px',
              height: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.15))',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Scroll left in lexicon"
          >
            &larr;
          </button>
          <button
            onClick={scrollRight}
            style={{
              width: '36px',
              height: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.15))',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Scroll right in lexicon"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Ribbon */}
      <div
        ref={scrollRef}
        className="horizontal-lexicon-ribbon"
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          padding: '8px 2px 24px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {LEXICON_ITEMS.map((item, idx) => (
          <div
            key={item.sign}
            onClick={() => setActiveItem(idx)}
            className="lexicon-scrolly-panel"
            style={{
              flex: '0 0 clamp(290px, 28vw, 360px)',
              scrollSnapAlign: 'start',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
            }}
          >
            {/* Open Swiss Spatial Surface */}
            <div
              style={{
                borderRadius: '4px',
                padding: '24px 20px',
                background: activeItem === idx ? 'var(--surface-elevated, rgba(255, 255, 255, 0.05))' : 'transparent',
                borderLeft: activeItem === idx ? `3px solid ${item.accent}` : '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                borderRight: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Meta Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    background: `${item.accent}15`,
                    color: item.accent,
                    border: `1px solid ${item.accent}35`,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.badge} &bull; ISL VERIFIED
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>{item.nativeText}</span>
              </div>

              {/* Main Sign Typographic Headline */}
              <h3 style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', fontWeight: 700, color: 'var(--text-primary, #ffffff)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                {item.sign}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: item.accent, fontWeight: 600, marginBottom: '14px' }}>
                {item.type}
              </div>

              {/* Gesture Anatomical Detail */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.6, margin: '0 0 16px', minHeight: '48px' }}>
                {item.gestureNote}
              </p>

              {/* Minimal Inset Spec Box */}
              <div
                style={{
                  background: 'var(--background-secondary, rgba(0, 0, 0, 0.25))',
                  borderRadius: '2px',
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    [ ARTICULATION SPEC ]
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.74rem', color: 'var(--text-primary, #f1f5f9)', fontWeight: 600 }}>{item.articulation}</div>
                </div>
                <span style={{ fontSize: '1rem', opacity: 0.8 }}>✋</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
