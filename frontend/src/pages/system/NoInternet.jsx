import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — No Internet Connection (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function NoInternet() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color={isOnline ? 'blue' : 'coral'}>
          {isOnline ? 'PACKET CARRIER DETECTED' : 'OFFLINE NETWORK CARRIER'}
        </CardlessBadge>

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
          Connection Interrupted
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
          Cloud neural mesh synchronization and microservice signaling require an active uplink. Local offline linguistic fallbacks remain cached in memory.
        </p>

        <div
          style={{
            padding: '16px 24px',
            borderLeft: `3px solid ${isOnline ? '#34d399' : 'var(--color-coral)'}`,
            background: 'var(--background-secondary)',
            maxWidth: '480px',
            margin: '0 auto 36px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: isOnline ? '#34d399' : 'var(--color-coral)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            [ SOCKET TELEMETRY ]
          </span>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Status: {isOnline ? 'Online (Ready to reconnect)' : 'Disconnected from Cloud Mesh'}
          </div>
        </div>

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CardlessButton variant="primary" size="md" onClick={() => window.location.reload()}>
            Re-establish Uplink
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
