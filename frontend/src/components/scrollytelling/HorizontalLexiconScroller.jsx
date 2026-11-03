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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="skeuo-led blue" />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase' }}>
            HORIZONTAL LEXICON RUNWAY &bull; {LEXICON_ITEMS.length} VERIFIED PHONEMES
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={scrollLeft}
            className="skeuo-btn skeuo-btn-metallic"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Scroll left in lexicon"
          >
            &larr;
          </button>
          <button
            onClick={scrollRight}
            className="skeuo-btn skeuo-btn-metallic"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
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
          gap: '20px',
          overflowX: 'auto',
          padding: '12px 6px 24px',
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
              flex: '0 0 clamp(290px, 30vw, 360px)',
              scrollSnapAlign: 'start',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            }}
          >
            {/* Soft Neumorphic Inset Surface */}
            <div
              style={{
                borderRadius: '24px',
                padding: '24px 22px',
                background: 'linear-gradient(145deg, rgba(18, 24, 38, 0.72) 0%, rgba(9, 13, 21, 0.88) 100%)',
                boxShadow:
                  activeItem === idx
                    ? `0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 24px ${item.accent}33`
                    : '0 12px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
                border: activeItem === idx ? `1.5px solid ${item.accent}` : '1.5px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Meta Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    background: `${item.accent}20`,
                    color: item.accent,
                    border: `1px solid ${item.accent}45`,
                  }}
                >
                  {item.badge} &bull; ISL VERIFIED
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{item.nativeText}</span>
              </div>

              {/* Main Sign Typographic Headline */}
              <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                {item.sign}
              </h3>
              <div style={{ fontSize: '0.78rem', color: item.accent, fontWeight: 700, marginBottom: '14px' }}>
                {item.type}
              </div>

              {/* Gesture Anatomical Detail */}
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px', minHeight: '48px' }}>
                {item.gestureNote}
              </p>

              {/* Tactile Inset Spec Box */}
              <div
                style={{
                  background: 'rgba(5, 7, 12, 0.6)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.6), inset -1px -1px 3px rgba(255,255,255,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>ARTICULATION SPEC</div>
                  <div style={{ fontSize: '0.74rem', color: '#f1f5f9', fontWeight: 700 }}>{item.articulation}</div>
                </div>
                <span style={{ fontSize: '1.1rem' }}>✋</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
