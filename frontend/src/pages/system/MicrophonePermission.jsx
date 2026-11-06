import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Microphone Permission Request (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function MicrophonePermission() {
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  const handleRequest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setStatus('granted');
      setTimeout(() => navigate('/text-to-sign'), 1200);
    } catch {
      setStatus('denied');
    }
  };

  return (
    <PageContainer maxWidth="720px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="coral">AUDIO INPUT INTERFACE</CardlessBadge>

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
          Microphone Permission
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
          Hastivo captures spoken acoustics via Web Speech APIs to perform real-time speech-to-sign avatar synthesis. Voice buffers are processed ephemerally without persistent recording.
        </p>

        {status === 'granted' ? (
          <div
            style={{
              padding: '16px 24px',
              borderLeft: '3px solid #34d399',
              background: 'var(--background-secondary)',
              color: '#34d399',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.88rem',
              fontWeight: 600,
              maxWidth: '520px',
              margin: '0 auto 36px',
              textAlign: 'left',
            }}
          >
            ✓ PERMISSION GRANTED: Synthesizing voice recognition pipeline...
          </div>
        ) : status === 'denied' ? (
          <div
            style={{
              padding: '16px 24px',
              borderLeft: '3px solid var(--color-coral)',
              background: 'var(--background-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              maxWidth: '520px',
              margin: '0 auto 36px',
              textAlign: 'left',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--color-coral)', display: 'block', marginBottom: '4px' }}>
              ACCESS BLOCKED BY ENVIRONMENT
            </strong>
            Please click the lock icon 🔒 next to your browser URL bar, set Microphone to <strong>Allow</strong>, and retry.
          </div>
        ) : null}

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CardlessButton variant="secondary" size="lg" onClick={handleRequest}>
            Grant Microphone Access
          </CardlessButton>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="ghost" size="lg">
              Return to Dashboard
            </CardlessButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
