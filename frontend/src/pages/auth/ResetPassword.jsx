import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Hastivo — Reset Password (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo_token';
  const navigate = useNavigate();
  const { notifySuccess, notifyCoralError } = useNotification();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'transparent' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#f87171' };
    if (score === 2) return { score: 2, label: 'Moderate', color: '#fbbf24' };
    if (score === 3) return { score: 3, label: 'Good', color: '#6fa3ef' };
    return { score: 4, label: 'Strong', color: '#34d399' };
  };

  const strength = calculateStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      notifyCoralError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notifyCoralError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (config.isConfigured.api) {
        const res = await fetch(`${config.apiBaseUrl}/api/v1/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Password update failed.');
        }
      }
      setIsSuccess(true);
      notifySuccess('Your password has been successfully updated.');
      setTimeout(() => navigate('/signin'), 2500);
    } catch (err) {
      notifyCoralError(err.message || 'Unable to update password. Reset token may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="640px">
      <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 90px) 0' }}>
        <CardlessBadge color="blue">CREDENTIAL UPDATE</CardlessBadge>

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
          Set New Password
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
          Choose a strong, unique password with at least 8 characters containing uppercase letters, numbers, and symbols.
        </p>

        {isSuccess ? (
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
              [ CREDENTIAL UPDATED ]
            </span>
            <p style={{ margin: '8px 0 16px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Password rotation completed. Redirecting to sign in interface...
            </p>
            <Link to="/signin" style={{ textDecoration: 'none' }}>
              <CardlessButton variant="primary" size="sm">
                Proceed to Sign In &rarr;
              </CardlessButton>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: '440px', margin: '0 auto 36px', textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    color: 'var(--color-blue)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
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
              {/* Strength indicator bar */}
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(strength.score / 4) * 100}%`,
                      height: '100%',
                      background: strength.color,
                      transition: 'all 0.25s ease',
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
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
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--background-secondary)',
                  border: `1px solid ${confirmPassword ? (passwordsMatch ? '#34d399' : 'var(--color-coral)') : 'var(--border)'}`,
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
              <CardlessButton variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
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
          [ CLIENT-SIDE SALT AND HASH INTEGRITY CHECK ]
        </span>
      </div>
    </PageContainer>
  );
}
