import React from 'react';
import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Hastivo AI — Global Editorial Three-Zone Footer
 * 
 * Design Language: Editorial / Swiss Grid / Cardless Interface
 * - Zone 1: Typographic Brand & Mission
 * - Zone 2: Open Structured Multi-Column Directory
 * - Zone 3: Bottom Utility Strip with Thin Top Divider & Status
 */
export default function Footer({ className = '', style = {} }) {
  return (
    <footer
      className={`swiss-footer ${className}`}
      style={{
        width: '100%',
        borderTop: '1px solid var(--border-subtle, var(--border))',
        background: 'transparent',
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px) clamp(40px, 5vw, 64px)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--content-width, 1440px)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(36px, 5vw, 56px)',
        }}
      >
        {/* ── ZONE 1 & ZONE 2: 12-Column Swiss Grid Layout ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
          }}
        >
          {/* ZONE 1: Typographic Brand & Mission (5 Columns Desktop) */}
          <div
            style={{
              gridColumn: 'span 5',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-control, 4px)',
                  background: 'var(--color-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                }}
              >
                S
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display, "Manrope", sans-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Sign<span style={{ color: 'var(--color-coral)' }}>ora</span>
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-display, "Manrope", sans-serif)',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--color-coral)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              Vibrant Connections Through Language Colors
            </p>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '420px',
                margin: 0,
              }}
            >
              Indian Sign Language bidirectional communication system powered by procedural 3D avatar animation, MediaPipe landmark tracking, and contextual AI synthesis.
            </p>
          </div>

          {/* ZONE 2: Open Directory Columns (7 Columns Desktop: 3 Sub-columns) */}
          <div
            style={{
              gridColumn: 'span 7',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'clamp(20px, 3vw, 40px)',
            }}
          >
            {/* Column A: Workspaces */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                Workspaces
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/text-to-sign" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Text-to-Sign</Link></li>
                <li><Link to="/sign-to-text" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Sign-to-Text</Link></li>
                <li><Link to="/conversation" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Real-Time Conversation</Link></li>
                <li><Link to="/history" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Conversation History</Link></li>
              </ul>
            </div>

            {/* Column B: Research & Specs */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                Research & Specs
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/vocabulary-explorer" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>ISL Vocabulary Index</Link></li>
                <li><Link to="/architecture-specs" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Architecture Specs</Link></li>
                <li><Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>About Hastivo AI</Link></li>
                <li><Link to="/help" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Help & Accessibility</Link></li>
              </ul>
            </div>

            {/* Column C: Governance */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                Governance
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Privacy & Data Isolation</Link></li>
                <li><Link to="/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Terms of Service</Link></li>
                <li><Link to="/signin" style={{ color: 'var(--color-coral)', fontSize: '0.88rem', fontWeight: 600 }}>Portal Authentication &rarr;</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── ZONE 3: Bottom Utility Strip ── */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle, var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            fontSize: 'var(--text-meta, 12px)',
            color: 'var(--text-muted)',
          }}
        >
          <span>&copy; {CURRENT_YEAR} Hastivo AI &bull; ISL Accessibility Protocol</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              ENGINE STATUS: OPERATIONAL
            </span>
            <span>SWISS GRID ARCHITECTURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
