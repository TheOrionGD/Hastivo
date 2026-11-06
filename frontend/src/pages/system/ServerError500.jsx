import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — 500 Server Exception (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function ServerError500() {
  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="coral">UNCAUGHT SERVICE EXCEPTION</CardlessBadge>

        <div
          style={{
            fontSize: 'clamp(5rem, 14vw, 8.5rem)',
            fontWeight: 900,
            color: 'var(--color-coral)',
            lineHeight: 1,
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '-0.06em',
            margin: '24px 0 16px',
          }}
        >
          500
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 14px',
            fontFamily: 'var(--font-display, "Manrope", sans-serif)',
          }}
        >
          Internal Microservice Error
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: '520px',
            margin: '0 auto 36px',
          }}
        >
          An unexpected processing error occurred while synchronizing language microservices. Our distributed telemetry collectors have registered the stack trace.
        </p>

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CardlessButton variant="primary" size="md" onClick={() => window.location.reload()}>
            Retry Transmission
          </CardlessButton>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="ghost" size="md">
              Return to Workspace
            </CardlessButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
