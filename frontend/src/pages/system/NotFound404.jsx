import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Hastivo AI — 404 Screen (Swiss Editorial UI)
 */
export default function NotFound404() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          System · Route Error
        </div>
        <div style={{ fontSize: 'clamp(5rem, 14vw, 8rem)', fontWeight: 900, color: 'var(--color-blue)', lineHeight: 1, fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em', marginBottom: '24px' }}>
          404
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px' }}>
          The requested coordinate does not exist or has been shifted in the route lattice.
        </p>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 auto 32px', maxWidth: '280px' }} />

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)' }}
          >
            Return to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="btn btn-ghost"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}
          >
            Open Command Palette (⌘K)
          </button>
        </div>
      </div>
    </div>
  );
}
