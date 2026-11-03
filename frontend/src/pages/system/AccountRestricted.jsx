import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Hastivo AI — Account Restricted Screen (Cardless UI)
 */
export default function AccountRestricted() {
  const { user } = useAuth();

  const restriction = user?.restrictions?.[0] || 'temporary-block';
  const isSuspension = restriction === 'temporary-suspension';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: 'var(--radius-control, 4px)',
            background: 'rgba(255, 111, 97, 0.12)',
            border: '1px solid var(--color-coral)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            margin: '0 auto 24px',
          }}
        >
          🚫
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Account Temporarily {isSuspension ? 'Suspended' : 'Restricted'}
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Your Hastivo account has received an administrative action following a safety policy review. Protected translation and live conversation features are suspended for this duration.
        </p>

        <div
          style={{
            padding: '24px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            textAlign: 'left',
            marginBottom: '32px',
            fontSize: '0.92rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Action Type:</span>
            <strong style={{ color: 'var(--color-coral)' }}>{isSuspension ? '7-Day Suspension' : '24-Hour Temporary Block'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
            <span style={{ color: 'var(--color-coral)', fontWeight: 600 }}>Active Enforcement</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Expiration:</span>
            <span style={{ color: 'var(--text-primary)' }}>Automatic restoration upon expiry</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/help"
            className="btn btn-ghost"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}
          >
            Contact Support & Appeal
          </Link>
          <Link
            to="/signin"
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', background: 'var(--color-blue)', borderColor: 'var(--color-blue)' }}
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
