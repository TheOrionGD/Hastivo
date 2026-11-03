import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import config from '../../config/env';
import '../../styles/auth-sculpted-trench.css';

/**
 * Hastivo AI — Email Verification Screen (SRS Section 7.5)
 * UI:
 * - Email verification status
 * - Registered email display
 * - Resend Verification action
 * - Continue action
 */
export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyCoralError } = useNotification();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(!!token || user?.emailVerified);
  const [resendCooldown, setResendCooldown] = useState(0);

  const displayEmail = user?.email || 'citizen@hastivo.isl';

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      if (config.isConfigured.api) {
        await fetch(`${config.apiBaseUrl}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: displayEmail }),
        });
      }
      notifySuccess(`Verification link re-sent to ${displayEmail}`);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      notifyCoralError('Could not resend email. Please try again.');
    }
  };

  const handleVerifyToken = async () => {
    setIsVerifying(true);
    try {
      if (config.isConfigured.api) {
        await fetch(`${config.apiBaseUrl}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token || 'verified_token' }),
        });
      }
      setIsVerified(true);
      notifySuccess('Email successfully verified!');
    } catch {
      notifyCoralError('Verification token invalid or expired.');
    } finally {
      setIsVerifying(false);
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
              background: isVerified ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 193, 7, 0.15)',
              border: `1.5px solid ${isVerified ? '#34d399' : 'var(--color-amber)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.8rem',
            }}
          >
            {isVerified ? '✉️' : '⏳'}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            {isVerified ? 'Email Confirmed' : 'Verify Your Email'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {isVerified
              ? 'Your email address has been verified successfully. Your account has full privileges.'
              : `We sent a confirmation link to ${displayEmail}. Please check your inbox.`}
          </p>
        </div>

        {isVerified ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-control)',
                background: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.88rem',
                color: '#34d399',
              }}
            >
              <span>✓</span>
              <span>{displayEmail} is verified</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="soft-pill-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '0.96rem',
                background: 'var(--color-blue)',
                borderColor: 'var(--color-blue)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {token && (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyToken}
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
                {isVerifying ? 'Verifying Token...' : 'Confirm Email Verification'}
              </button>
            )}

            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={handleResend}
              className="soft-pill-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.9rem',
                opacity: resendCooldown > 0 ? 0.6 : 1,
              }}
            >
              {resendCooldown > 0 ? `Resend Link in ${resendCooldown}s` : 'Resend Verification Link'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '0.86rem' }}>
              <Link to="/signin" style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>
                &larr; Back to Sign In
              </Link>
              <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Skip for now &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
