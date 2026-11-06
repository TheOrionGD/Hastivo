import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, EditorialHeader, SectionDivider, CardlessBadge } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Privacy Policy & Data Architecture (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function Privacy() {
  return (
    <PageContainer maxWidth="1000px">
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/landing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-blue)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.04em',
          }}
        >
          &larr; [ BACK TO OVERVIEW ]
        </Link>
      </div>

      <EditorialHeader
        eyebrow="SECURITY & GOVERNANCE"
        title="Privacy Architecture"
        subtitle="Data integrity protocols, local landmark processing, and credential persistence specifications."
        meta={<CardlessBadge color="blue">AUDIT PASSED</CardlessBadge>}
      />

      {/* Verification Notice Band */}
      <div
        style={{
          padding: '20px 24px',
          borderLeft: '3px solid var(--color-amber)',
          background: 'var(--background-secondary)',
          margin: '24px 0 40px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--color-amber)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          [ TECHNICAL VERIFICATION NOTICE ]
        </span>
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Camera landmark vector extraction executes on local client thread boundaries via WebAssembly MediaPipe bundles. External network telemetry verifies that uncompressed biometric video frames never leave client volatile memory.
        </p>
      </div>

      <SectionDivider index="01" label="CAMERA INPUT & VISION PROCESSING" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-coral)' }}>
          01
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Volatile Keypoint Extraction
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-coral)', letterSpacing: '0.1em' }}>
            [ LOCAL THREAD ONLY ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          Camera permissions are requested solely upon explicit user action within the Sign-to-Text Studio and Real-Time Duplex modules. Coordinates are processed into floating-point vectors and discarded continuously without cloud caching.
        </p>
      </div>

      <SectionDivider index="02" label="AUDIO STREAM & VOICE NAVIGATION" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-blue)' }}>
          02
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Transient Command Buffers
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-blue)', letterSpacing: '0.1em' }}>
            [ EPHEMERAL MICROPHONE ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          The Global Voice Command Navigation system captures audio only while the user explicitly activates listening. Audio is neither permanently recorded nor stored on device storage for navigation commands.
        </p>
      </div>

      <SectionDivider index="03" label="CREDENTIALS & LOCAL PERSISTENCE" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-amber)' }}>
          03
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Stateless Token Handshakes
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-amber)', letterSpacing: '0.1em' }}>
            [ JWT & MONGODB ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          Authentication tokens are managed via secure headers and verified through signed JWTs. User theme preferences and conversation history records are persisted in MongoDB backend services only when configured.
        </p>
      </div>
    </PageContainer>
  );
}
