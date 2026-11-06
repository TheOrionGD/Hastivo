import React from 'react';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Platform Maintenance (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function Maintenance() {
  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="amber">SCHEDULED DEPLOYMENT WINDOW</CardlessBadge>

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
          System Maintenance
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: '540px',
            margin: '0 auto 36px',
          }}
        >
          The distributed node cluster is currently receiving firmware upgrades to the 65-bone humanoid skeletal rigging and real-time lexicon vector databases.
        </p>

        <div
          style={{
            padding: '16px 24px',
            borderLeft: '3px solid var(--color-amber)',
            background: 'var(--background-secondary)',
            maxWidth: '480px',
            margin: '0 auto 36px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            [ WINDOW ESTIMATE ]
          </span>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Expected Return: All nodes nominal at 20:00 UTC
          </div>
        </div>

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div>
          <CardlessButton variant="primary" size="md" onClick={() => window.location.reload()}>
            Refresh Node Status
          </CardlessButton>
        </div>
      </div>
    </PageContainer>
  );
}
