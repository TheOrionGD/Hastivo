import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Hastivo — Forgot Password (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { notifySuccess, notifyCoralError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notifyCoralError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (config.isConfigured.api) {
        await fetch(`${config.apiBaseUrl}/api/v1/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
      }
      setSubmitted(true);
      notifySuccess('If an account exists for this email, password reset instructions have been sent.');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      notifyCoralError(err.message || 'Network request failed. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="640px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="coral">CREDENTIAL RECOVERY</CardlessBadge>

        <h1
          style={{
            fontFamily: 'var(--font-display, "Manrope", sans-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '24px 0 14px',
            letterSpacing: '-0.03em',
          }}
        >
          Password Recovery
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 auto 36px',
          }}
        >
          Enter the verified email address linked to your Hastivo account. We will dispatch a single-use cryptographic reset link.
        </p>

        {submitted ? (
          <div
            style={{
              padding: '24px',
              borderLeft: '3px solid #34d399',
              background: 'var(--background-secondary)',
              maxWidth: '480px',
              margin: '0 auto 36px',
              textAlign: 'left',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              [ RECOVERY INSTRUCTIONS DISPATCHED ]
            </span>
            <p style={{ margin: '8px 0 14px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              If an account is associated with <strong>{email}</strong>, a secure reset token has been transmitted.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <CardlessButton variant="primary" size="sm">
                  Return to Sign In
                </CardlessButton>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: '440px', margin: '0 auto 36px', textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Account Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@domain.org"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <CardlessButton variant="primary" size="md" type="submit" disabled={isSubmitting || cooldown > 0}>
                {isSubmitting ? 'Transmitting...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Transmit Reset Link'}
              </CardlessButton>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <CardlessButton variant="ghost" size="md">
                  Cancel
                </CardlessButton>
              </Link>
            </div>
          </form>
        )}

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          [ ZERO INFORMATION DISCLOSURE PRIVACY GUARANTEE ]
        </span>
      </div>
    </PageContainer>
  );
}
