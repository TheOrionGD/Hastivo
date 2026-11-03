import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Signora AI — Unauthorized Screen (Swiss Editorial UI)
 */
export default function Unauthorized() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          System · Authorization Error
        </div>
        <div style={{ fontSize: 'clamp(5rem, 14vw, 8rem)', fontWeight: 900, color: 'var(--color-coral)', lineHeight: 1, fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em', marginBottom: '24px' }}>
          401
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Access Denied
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px' }}>
          You do not have the required permissions or your session has expired. This destination is restricted to authorized credentials.
        </p>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 auto 32px', maxWidth: '280px' }} />

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signin"
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)' }}
          >
            Sign In with Authorized Account
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-ghost"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
