import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Hastivo — Email Verification (Vision Pro / Swiss Editorial Cardless Architecture)
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
    <PageContainer maxWidth="640px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="blue">CREDENTIAL HANDSHAKE</CardlessBadge>

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
          {isVerified ? 'Email Confirmed' : 'Verify Your Identity'}
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 auto 32px',
          }}
        >
          {isVerified
            ? 'Your email address has been verified against our authentication ledger. You now have full access to real-time conversation and 3D avatar translation.'
            : `A cryptographic verification link was dispatched to ${displayEmail}. Please check your inbox or trigger an automatic token check.`}
        </p>

        <div
          style={{
            padding: '20px 24px',
            borderLeft: `3px solid ${isVerified ? '#34d399' : 'var(--color-blue)'}`,
            background: 'var(--background-secondary)',
            maxWidth: '480px',
            margin: '0 auto 36px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: isVerified ? '#34d399' : 'var(--color-blue)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            [ IDENTITY LEDGER STATUS ]
          </span>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Account: {displayEmail} &bull; {isVerified ? 'VERIFIED' : 'PENDING ACTIVATION'}
          </div>
        </div>

        <SectionDivider margin="24px auto 36px" style={{ maxWidth: '360px' }} />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isVerified ? (
            <CardlessButton variant="primary" size="md" onClick={() => navigate('/dashboard')}>
              Enter Workspace &rarr;
            </CardlessButton>
          ) : (
            <>
              {token && (
                <CardlessButton variant="primary" size="md" disabled={isVerifying} onClick={handleVerifyToken}>
                  {isVerifying ? 'Verifying...' : 'Complete Verification'}
                </CardlessButton>
              )}
              <CardlessButton
                variant={token ? 'ghost' : 'primary'}
                size="md"
                disabled={resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0 ? `Resend In ${resendCooldown}s` : 'Resend Verification Note'}
              </CardlessButton>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <CardlessButton variant="ghost" size="md">
                  Back to Sign In
                </CardlessButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
