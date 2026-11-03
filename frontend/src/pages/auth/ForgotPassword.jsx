import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import config from '../../config/env';
import '../../styles/auth-sculpted-trench.css';

/**
 * Hastivo — Forgot Password Screen (SRS Section 7.3)
 * UI:
 * - Email address input
 * - Send Reset Link action
 * - Back to Login action
 * - Privacy-preserving confirmation response (does not disclose account existence)
 * - Rate-limiting feedback
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
    <div className="trench-auth-viewport">
      <div className="trench-auth-card" style={{ maxWidth: '480px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(255, 111, 97, 0.15)',
              border: '1.5px solid var(--color-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.8rem',
            }}
          >
            🔑
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Forgot Password?
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Enter your registered email address. We will send you instructions to securely reset your password.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-control)',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📬</div>
            <h4 style={{ color: '#34d399', margin: '0 0 6px', fontWeight: 700 }}>Instructions Dispatched</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
              If an account with <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> exists, you will receive a secure reset link shortly.
            </p>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleSubmit}
              className="soft-pill-btn"
              style={{
                fontSize: '0.82rem',
                padding: '8px 18px',
                opacity: cooldown > 0 ? 0.6 : 1,
                cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {cooldown > 0 ? `Resend Available in ${cooldown}s` : 'Resend Email'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Registered Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="input-field"
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="soft-pill-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '0.96rem',
                background: 'var(--color-coral)',
                borderColor: 'var(--color-coral)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
          <Link
            to="/signin"
            style={{
              fontSize: '0.88rem',
              color: 'var(--color-blue)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
