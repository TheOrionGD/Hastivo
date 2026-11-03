import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/auth-editorial.css';

/**
 * Hastivo Editorial / Swiss Grid Sign-In & Registration Portal
 * Visual Specification: media_1793703067436_53e4e791.jpg
 *
 * Architecture:
 * - Left Section: "01 / ACCESSIBILITY ENGINE"
 *   - Monumental Brand Wordmark: "SIGN" in white + "ORA" in #FF6F61
 *   - Tagline: "Vibrant connections through language colors."
 *   - Summary: "Real-time Indian Sign Language bidirectional communication platform..."
 *   - Embedded Community Imagery with bottom bullet nodes (01 Sub-100ms 27-DOF, 02 Zero-cloud edge, 03 Certified ISL)
 * - Right Section:
 *   - "Welcome to Hastivo" + "Sign in to access your inclusive communication platform."
 *   - Email or username field with "✓ Entered" live check and "✕" clear button
 *   - Password field with "Forgot password?" and password visibility toggle
 *   - "Keep me logged in" custom coral check
 *   - Solid coral CTA: "Sign In →"
 *   - Divider: "OR"
 *   - Outlined Google Sign In: "Sign in with Google"
 *   - Outlined Guest Access: "Anonymous Sign In (Guest Access)"
 *   - "Don't have an account? Register here"
 * - Bottom Bar: "© 2026 Hastivo Platform" and "🌐 ISL / ENG"
 * - Floating Command Deck remains active at bottom of viewport
 */
export default function AuthPortal({ initialMode = 'signin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signInAnonymous, signInWithGoogle, register } = useAuth();
  const { notifyCoralError, notifySuccess } = useNotification();

  const mode = location.pathname === '/register' ? 'register' : (location.pathname === '/signin' ? 'signin' : initialMode);

  // Sign In Form States
  const [loginIdentifier, setLoginIdentifier] = useState('godfrey.cs23@krct.ac.in');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // Registration Form States
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordLocked, setIsPasswordLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const triggerShake = (msg) => {
    setShake(true);
    setErrorMessage(msg);
    setTimeout(() => setShake(false), 500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim() || !loginPassword) {
      triggerShake('Please enter both your email address/username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(loginIdentifier.trim(), loginPassword);
      notifySuccess('Signed In', 'Welcome back to Hastivo!');
      if (res?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      triggerShake(err.message || 'Authentication failed. Please verify credentials.');
      notifyCoralError('Sign In Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
      notifySuccess('Google Sign In', 'Authenticated via Google Secure Gateway.');
      navigate(from);
    } catch (err) {
      triggerShake(err.message || 'Google authentication failed.');
      notifyCoralError('SSO Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await signInAnonymous();
      notifySuccess('Guest Access Granted', 'Welcome to Hastivo as an anonymous citizen.');
      navigate(from);
    } catch (err) {
      triggerShake(err.message || 'Anonymous sign-in failed.');
      notifyCoralError('Auth Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      triggerShake('Please fill out all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      triggerShake('Passwords do not match. Please verify your re-entered password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim(), password, fullName.trim(), 'citizen', phone.trim(), username.trim());
      notifySuccess('Account Created', 'Registration successful! Welcome to Hastivo.');
      navigate('/dashboard');
    } catch (err) {
      triggerShake(err.message || 'Registration failed.');
      notifyCoralError('Registration Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-editorial-stage">
      {/* Background Atmosphere */}
      <div className="auth-editorial-bg" />

      {/* Top Hairline Header Marker */}
      <div className="auth-top-indicator">
        <span className="idx">01</span>
        <span>/</span>
        <span>ACCESSIBILITY ENGINE</span>
      </div>

      {/* Main Two-Column Editorial Viewport */}
      <div className="auth-editorial-container">
        <div className={`auth-editorial-grid ${shake ? 'has-auth-shake' : ''}`}>
          {/* ============================================================ */}
          {/* LEFT COLUMN: BRANDING & COMMUNITY SHOWCASE                  */}
          {/* ============================================================ */}
          <div className="auth-editorial-left">
            <div>
              {/* Giant Monumental Wordmark */}
              <h1 className="auth-editorial-title">
                <span className="brand-sign">SIGN</span>
                <span className="brand-ora">ORA</span>
              </h1>

              {/* Editorial Tagline */}
              <h2 className="auth-editorial-tagline">
                Vibrant connections through language colors.
              </h2>

              {/* Explanatory Paragraph */}
              <p className="auth-editorial-desc">
                Real-time Indian Sign Language bidirectional communication platform with 3D avatar animation and computer vision recognition.
              </p>
            </div>

            {/* Live Community Image Frame with 3 Sub-points */}
            <div className="auth-editorial-image-frame">
              <img
                src="/auth-editorial-showcase.jpg"
                alt="Inclusive Sign Language Communication Community"
                className="auth-editorial-image"
                onError={(e) => {
                  e.currentTarget.src = '/auth-showcase.jpg';
                }}
              />
              <div className="auth-editorial-image-overlay" />

              {/* 3 Metric Bullet Nodes at Base of Image */}
              <div className="auth-editorial-bullets">
                <div className="auth-bullet-item">
                  <span className="auth-bullet-num">01</span>
                  <span className="auth-bullet-text">Sub-100ms 27-DOF neural hand &amp; pose kinematics</span>
                </div>
                <div className="auth-bullet-item">
                  <span className="auth-bullet-num">02</span>
                  <span className="auth-bullet-text">Zero-cloud edge privacy &amp; local execution</span>
                </div>
                <div className="auth-bullet-item">
                  <span className="auth-bullet-num">03</span>
                  <span className="auth-bullet-text">Certified Indian Sign Language lexicon</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: SWISS SIGN-IN / REGISTER FORM                 */}
          {/* ============================================================ */}
          <div className="auth-editorial-right">
            {mode === 'signin' ? (
              <>
                <h2 className="auth-form-title">Welcome to Hastivo</h2>
                <p className="auth-form-subtitle">
                  Sign in to access your inclusive communication platform.
                </p>

                {errorMessage && (
                  <div className="auth-error-banner" role="alert">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  {/* Email or Username Input */}
                  <div className="auth-input-group">
                    <div className="auth-input-label-row">
                      <label htmlFor="loginIdentifier">Email or username *</label>
                      {loginIdentifier && (
                        <span className="auth-input-indicator">✓ Entered</span>
                      )}
                    </div>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        id="loginIdentifier"
                        type="text"
                        className="auth-text-input"
                        placeholder="Enter email or username"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        autoComplete="username"
                        required
                      />
                      {loginIdentifier && (
                        <button
                          type="button"
                          className="auth-input-action-btn"
                          onClick={() => setLoginIdentifier('')}
                          aria-label="Clear field"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="auth-input-group">
                    <div className="auth-input-label-row">
                      <label htmlFor="loginPassword">Password *</label>
                      <Link to="/forgot-password" className="auth-forgot-link">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        id="loginPassword"
                        type={showLoginPassword ? 'text' : 'password'}
                        className="auth-text-input"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="auth-input-action-btn"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  {/* Keep me logged in Checkbox */}
                  <div
                    className="auth-checkbox-row"
                    onClick={() => setKeepLoggedIn(!keepLoggedIn)}
                    role="checkbox"
                    aria-checked={keepLoggedIn}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setKeepLoggedIn(!keepLoggedIn);
                      }
                    }}
                  >
                    <div className={`auth-custom-checkbox ${!keepLoggedIn ? 'unchecked' : ''}`}>
                      {keepLoggedIn && '✓'}
                    </div>
                    <span>Keep me logged in</span>
                  </div>

                  {/* Solid Coral Submit Button */}
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                    <span>→</span>
                  </button>
                </form>

                {/* Divider OR */}
                <div className="auth-divider-or">
                  <span>OR</span>
                </div>

                {/* Sign in with Google */}
                <button
                  type="button"
                  className="auth-secondary-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                {/* Anonymous Guest Access */}
                <button
                  type="button"
                  className="auth-secondary-btn"
                  onClick={handleAnonymousSignIn}
                  disabled={isSubmitting}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-blue, #6FA3EF)' }}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7.5" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Anonymous Sign In (Guest Access)</span>
                </button>

                {/* Register Link */}
                <div className="auth-switch-prompt">
                  <span>Don't have an account?</span>
                  <Link to="/register" className="auth-switch-link">
                    Register here
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="auth-form-title">Create Account</h2>
                <p className="auth-form-subtitle">
                  Join Hastivo for real-time sign language access.
                </p>

                {errorMessage && (
                  <div className="auth-error-banner" role="alert">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  {/* Full Name */}
                  <div className="auth-input-group">
                    <div className="auth-input-label-row">
                      <label htmlFor="regFullName">Full Name *</label>
                    </div>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">👤</span>
                      <input
                        id="regFullName"
                        type="text"
                        className="auth-text-input"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Username & Email in Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="auth-input-group">
                      <div className="auth-input-label-row">
                        <label htmlFor="regUsername">Username *</label>
                      </div>
                      <div className="auth-input-wrapper">
                        <input
                          id="regUsername"
                          type="text"
                          className="auth-text-input"
                          placeholder="johndoe"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="auth-input-label-row">
                        <label htmlFor="regEmail">Email *</label>
                      </div>
                      <div className="auth-input-wrapper">
                        <input
                          id="regEmail"
                          type="email"
                          className="auth-text-input"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="auth-input-group">
                    <div className="auth-input-label-row">
                      <label htmlFor="regPhone">Phone Number *</label>
                    </div>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">📞</span>
                      <input
                        id="regPhone"
                        type="tel"
                        className="auth-text-input"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Passwords in Grid with Lock & Re-entry per SRS 4.6 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="auth-input-group">
                      <div className="auth-input-label-row">
                        <label htmlFor="regPassword">Password *</label>
                        {password && (
                          <button
                            type="button"
                            onClick={() => setIsPasswordLocked(!isPasswordLocked)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: isPasswordLocked ? 'var(--color-coral)' : 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title={isPasswordLocked ? 'Unlock to modify password' : 'Lock password to confirm'}
                          >
                            {isPasswordLocked ? '🔒 Locked (Unlock)' : '🔓 Lock'}
                          </button>
                        )}
                      </div>
                      <div className="auth-input-wrapper">
                        <input
                          id="regPassword"
                          type={showPassword ? 'text' : 'password'}
                          className="auth-text-input"
                          placeholder="••••••••"
                          value={password}
                          disabled={isPasswordLocked}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{
                            opacity: isPasswordLocked ? 0.7 : 1,
                            cursor: isPasswordLocked ? 'not-allowed' : 'text'
                          }}
                          required
                        />
                        <button
                          type="button"
                          className="auth-input-action-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="auth-input-label-row">
                        <label htmlFor="regConfirmPassword">Confirm *</label>
                        {confirmPassword && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: password === confirmPassword ? 'var(--color-blue)' : 'var(--color-coral)',
                              fontWeight: 500
                            }}
                          >
                            {password === confirmPassword ? '✓ Match' : '✕ Mismatch'}
                          </span>
                        )}
                      </div>
                      <div className="auth-input-wrapper">
                        <input
                          id="regConfirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="auth-text-input"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="auth-input-action-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isSubmitting}
                    style={{ marginTop: '8px' }}
                  >
                    <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                    <span>→</span>
                  </button>
                </form>

                <div className="auth-switch-prompt">
                  <span>Already have an account?</span>
                  <Link to="/signin" className="auth-switch-link">
                    Sign in here
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sub-Bar Matching Reference */}
      <div className="auth-bottom-subbar">
        <span>© 2026 Hastivo Platform</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌐</span>
          <span>ISL / ENG</span>
        </span>
      </div>
    </div>
  );
}
