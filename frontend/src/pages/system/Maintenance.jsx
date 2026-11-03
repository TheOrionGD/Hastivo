import React from 'react';

/**
 * Signora AI — Maintenance Screen (Cardless UI)
 */
export default function Maintenance() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>
        <div style={{ fontSize: '3.6rem', marginBottom: '16px' }}>🛠️</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Scheduled Platform Maintenance
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Signora AI is currently undergoing scheduled kinematic rig upgrades and lexicon database optimization.
        </p>

        <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-control)', background: 'rgba(255, 193, 7, 0.12)', border: '1px solid var(--color-amber)', marginBottom: '32px', fontSize: '0.92rem', color: 'var(--color-amber)', fontWeight: 600 }}>
          Expected Availability: All systems online at 20:00 UTC
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 auto 32px', maxWidth: '280px' }} />

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-primary"
          style={{ padding: '12px 28px', borderRadius: 'var(--radius-control)', margin: '0 auto', background: 'var(--color-coral)', borderColor: 'var(--color-coral)' }}
        >
          Check System Status
        </button>
      </div>
    </div>
  );
}
