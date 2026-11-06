import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — 404 Route Not Found (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function NotFound404() {
  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="blue">UNRESOLVED ROUTE LATTICE</CardlessBadge>

        <div
          style={{
            fontSize: 'clamp(5rem, 14vw, 8.5rem)',
            fontWeight: 900,
            color: 'var(--color-blue)',
            lineHeight: 1,
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '-0.06em',
            margin: '24px 0 16px',
          }}
        >
          404
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
          Coordinate Not Found
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
          The requested route path does not correspond to an accessible view in the platform registry. Please return to your active workspace or trigger command search.
        </p>

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="primary" size="md">
              Return to Workspace
            </CardlessButton>
          </Link>
          <CardlessButton
            variant="ghost"
            size="md"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            Open Command Hub (Ctrl+K)
          </CardlessButton>
        </div>
      </div>
    </PageContainer>
  );
}
