import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Signora AI — Camera Permission Screen (Cardless UI)
 */
export default function CameraPermission() {
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  const handleRequest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setStatus('granted');
      setTimeout(() => navigate('/sign-to-text'), 1200);
    } catch {
      setStatus('denied');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'clamp(32px, 6vw, 80px) 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>
        <div style={{ fontSize: '3.6rem', marginBottom: '16px' }}>📹</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
          Camera Access Required
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Signora AI uses your camera to capture hand landmarks and skeletal movement for sign language gesture recognition. All landmark processing is strictly local.
        </p>

        {status === 'granted' ? (
          <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-control)', background: 'rgba(52,211,153,0.12)', border: '1px solid #34d399', color: '#34d399', fontWeight: 700, marginBottom: '28px' }}>
            ✓ Camera permission granted! Launching Vision Studio...
          </div>
        ) : status === 'denied' ? (
          <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-control)', background: 'rgba(239,68,68,0.12)', border: '1px solid #f87171', color: '#f87171', fontSize: '0.9rem', textAlign: 'left', marginBottom: '28px', lineHeight: 1.6 }}>
            <strong>Access Blocked by Browser:</strong> Please click the lock icon 🔒 next to your browser address bar, set Camera to <strong>Allow</strong>, and retry.
          </div>
        ) : null}

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 auto 32px', maxWidth: '280px' }} />

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleRequest}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-control)', background: 'var(--color-coral)', borderColor: 'var(--color-coral)' }}
          >
            Grant Camera Access
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
