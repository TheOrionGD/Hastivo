import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer, CardlessBadge, CardlessButton } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Account Restricted Screen (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function AccountRestricted() {
  const { user } = useAuth();

  const restriction = user?.restrictions?.[0] || 'temporary-block';
  const isSuspension = restriction === 'temporary-suspension';

  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="coral">ADMINISTRATIVE ACTION ENFORCED</CardlessBadge>

        <h1
          style={{
            fontFamily: 'var(--font-display, "Manrope", sans-serif)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '24px 0 16px',
            letterSpacing: '-0.03em',
          }}
        >
          Account {isSuspension ? 'Suspended' : 'Restricted'}
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: '560px',
            margin: '0 auto 36px',
          }}
        >
          Your account has received an administrative flag following an automated safety audit. Duplex transmission and real-time translation features are suspended for this duration.
        </p>

        {/* Open Swiss Data Specification Band */}
        <div
          style={{
            padding: '24px 0',
            borderTop: '1px solid var(--border-subtle, var(--border))',
            borderBottom: '1px solid var(--border-subtle, var(--border))',
            textAlign: 'left',
            marginBottom: '36px',
            fontSize: '0.92rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '520px',
            margin: '0 auto 36px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ACTION TYPE:
            </span>
            <strong style={{ color: 'var(--color-coral)' }}>{isSuspension ? '7-Day Suspension' : '24-Hour Temporary Block'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              STATUS:
            </span>
            <span style={{ color: 'var(--color-coral)', fontWeight: 600 }}>Active Enforcement</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              EXPIRATION:
            </span>
            <span style={{ color: 'var(--text-primary)' }}>Automatic restoration post-expiry</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/help" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="primary" size="md">
              Contact Support & Appeal
            </CardlessButton>
          </Link>
          <Link to="/signin" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="ghost" size="md">
              Switch Account
            </CardlessButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
