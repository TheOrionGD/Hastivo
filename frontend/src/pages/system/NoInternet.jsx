import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Signora AI — No Internet Screen (Cardless UI)
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>
        <div style={{ fontSize: '3.6rem', marginBottom: '16px' }}>📡</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Network Connection Lost
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Real-time AI translation and neural gesture recognition require an active internet connection to synthesize sign language sequences.
        </p>

        <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-control)', background: 'var(--background-secondary)', border: '1px solid var(--border)', marginBottom: '32px', fontSize: '0.92rem' }}>
          Status: <strong style={{ color: isOnline ? '#34d399' : 'var(--color-coral)' }}>{isOnline ? 'Online (Ready to reconnect)' : 'Disconnected from Cloud Mesh'}</strong>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 auto 32px', maxWidth: '280px' }} />

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', background: 'var(--color-blue)', borderColor: 'var(--color-blue)' }}
          >
            Retry Connection
          </button>
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
