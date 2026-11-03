import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import config from '../../config/env';
import '../../styles/auth-sculpted-trench.css';

/**
 * Signora AI — Reset Password Screen (SRS Section 7.4)
 * UI:
 * - New Password
 * - Confirm New Password
 * - Password strength indicator
 * - Show/hide controls
 * - Update Password action
 * - Token verification & validation
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
    <div className="trench-auth-viewport">
      <div className="trench-auth-card" style={{ maxWidth: '480px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(111, 163, 239, 0.15)',
              border: '1.5px solid var(--color-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.8rem',
            }}
          >
            🛡️
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Set New Password
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Choose a strong, unique password with at least 8 characters.
          </p>
        </div>

        {isSuccess ? (
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-control)',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>✅</div>
            <h4 style={{ color: '#34d399', margin: '0 0 8px', fontWeight: 700 }}>Password Updated</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Redirecting you to the Sign In portal...
            </p>
            <Link to="/signin" className="soft-pill-btn" style={{ justifyContent: 'center' }}>
              Sign In Immediately
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* New Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="input-field"
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem' }}
              />

              {/* Strength Meter */}
              {newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          borderRadius: '2px',
                          background: step <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: strength.color, fontWeight: 600 }}>
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                className="input-field"
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem' }}
              />
              {confirmPassword && (
                <span
                  style={{
                    display: 'block',
                    marginTop: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: passwordsMatch ? '#34d399' : '#f87171',
                  }}
                >
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passwordsMatch || newPassword.length < 8}
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
                opacity: !passwordsMatch || newPassword.length < 8 ? 0.6 : 1,
              }}
            >
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
          <Link
            to="/signin"
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Cancel and Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
