import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import CinematicParticleCanvas from '../common/CinematicParticleCanvas';
import '../../styles/auth-editorial.css';

/**
 * Reconstructed Auth Screen UI Design
 * Exact replication of reference: o:\sign\references\auth
 * Constraints:
 * - Particle effect active
 * - No background color (100% transparent container)
 * - Video background (/bg.mp4) active and visible
 * - Left column: 01 / ACCESSIBILITY ENGINE topline, Brand wordmark, claim,
 *   description, hero-photo.jpg with subtle gradient shade, 3-item numbered proof strip.
 * - Right column: ACCOUNT ACCESS / 02 kicker, Welcome to Hastivo, intro,
 *   email/username input with live check and clear button, password input with show/hide,
 *   keep me logged in checkbox, primary action button, OR divider, Google button,
 *   Anonymous guest button, registration link, copyright and language indicator.
 */
export default function AuthPortal({ initialMode = 'signin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signInAnonymous, signInWithGoogle, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifyCoralError, notifySuccess } = useNotification();

  const mode = location.pathname === '/register' ? 'register' : (location.pathname === '/signin' ? 'signin' : initialMode);

  // Sign In Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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
    <div className="ref-auth-stage">
      {/* Floating Theme Quick Switcher */}
      <div style={{ position: 'fixed', top: '24px', right: '28px', zIndex: 100 }}>
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: 'var(--surface-elevated, #242830)',
            border: '1px solid var(--border-subtle, #41444B)',
            color: 'var(--text-primary)',
            padding: '7px 14px',
            borderRadius: 'var(--radius-control, 4px)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
        </button>
      </div>

      {/* Background Video Layer */}
      <div
        className="global-screen-video-bg"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <video
          className="global-video-element"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(11, 20, 29, 0.40) 0%, rgba(11, 20, 29, 0.72) 100%)',
          }}
        />
      </div>

      {/* Cinematic Particle Field Canvas */}
      <CinematicParticleCanvas />

      {/* Main Two-Column Editorial & Task Grid */}
      <main className="ref-signin-layout" aria-label="Hastivo sign-in">
        {/* ============================================================ */}
        {/* LEFT EDITORIAL COLUMN: Brand, Proposition, Hero Photo, Facts */}
        {/* ============================================================ */}
        <section className="ref-editorial-panel" aria-labelledby="brand-name">
          <div className="ref-editorial-topline">
            <span className="ref-section-index">01</span>
            <span className="ref-topline-slash">/</span>
            <span>ACCESSIBILITY ENGINE</span>
            <span className="ref-topline-rule" aria-hidden="true" />
          </div>

          <div className="ref-brand-block">
            <h1 className="ref-brand-wordmark" id="brand-name">
              Hast<span>ivo</span>
            </h1>
            <p className="ref-brand-claim">
              Vibrant connections through<br />language colors.
            </p>
            <p className="ref-brand-description">
              Real-time Indian Sign Language bidirectional communication platform with 3D avatar animation and computer vision recognition.
            </p>
          </div>

          {/* Photographic Proof Field */}
          <div
            className="ref-editorial-photo"
            role="img"
            aria-label="People communicating using Indian Sign Language in a collaborative workspace"
          >
            <div className="ref-photo-shade" aria-hidden="true" />
          </div>

          {/* Three factual proof points in a ruled editorial strip */}
          <div className="ref-proof-strip" aria-label="Platform characteristics">
            <div className="ref-proof-item">
              <span className="ref-proof-number">01</span>
              <p>Sub-100ms 27-DOF<br />neural hand and pose<br />kinematics</p>
            </div>
            <div className="ref-proof-item">
              <span className="ref-proof-number">02</span>
              <p>Zero-cloud edge privacy<br />and local execution</p>
            </div>
            <div className="ref-proof-item">
              <span className="ref-proof-number">03</span>
              <p>Certified Indian Sign<br />Language lexicon</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT AUTHENTICATION COLUMN: Form with no surrounding card  */}
        {/* ============================================================ */}
        <section className={`ref-auth-panel ${shake ? 'has-ref-shake' : ''}`} aria-labelledby="welcome-title">
          <div className="ref-auth-content">
            <p className="ref-auth-kicker">
              ACCOUNT ACCESS <span>/ 02</span>
            </p>

            {mode === 'signin' ? (
              <>
                <h2 id="welcome-title">Welcome to Hastivo</h2>
                <p className="ref-auth-intro">
                  Sign in to access your inclusive communication platform.
                </p>

                {errorMessage && (
                  <div className="ref-error-banner" role="alert">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form className="ref-signin-form" onSubmit={handleLoginSubmit}>
                  {/* Email / Username Field */}
                  <div className="ref-field-group">
                    <div className="ref-field-heading">
                      <label htmlFor="loginIdentifier">
                        Email or username <span aria-hidden="true">*</span>
                      </label>
                      <span className="ref-field-status" aria-live="polite">
                        {loginIdentifier.trim() ? '✓ Entered' : ''}
                      </span>
                    </div>
                    <div className="ref-input-shell">
                      <span className="ref-field-icon" aria-hidden="true">◎</span>
                      <input
                        id="loginIdentifier"
                        name="loginIdentifier"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter your email or username"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                      />
                      {loginIdentifier && (
                        <button
                          className="ref-icon-button"
                          type="button"
                          onClick={() => setLoginIdentifier('')}
                          aria-label="Clear email"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="ref-field-group">
                    <div className="ref-field-heading">
                      <label htmlFor="loginPassword">
                        Password <span aria-hidden="true">*</span>
                      </label>
                      <Link className="ref-text-link" to="/forgot-password">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="ref-input-shell">
                      <span className="ref-field-icon" aria-hidden="true">⌑</span>
                      <input
                        id="loginPassword"
                        name="loginPassword"
                        type={showLoginPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        className="ref-icon-button"
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showLoginPassword}
                      >
                        {showLoginPassword ? '◉' : '○'}
                      </button>
                    </div>
                  </div>

                  {/* Keep me logged in checkbox */}
                  <label className="ref-remember-row">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    />
                    <span className="ref-custom-check" aria-hidden="true" />
                    <span>Keep me logged in</span>
                  </label>

                  {/* Submit Button */}
                  <button className="ref-primary-action" type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </form>

                {/* OR Divider */}
                <div className="ref-or-divider">
                  <span />
                  <b>OR</b>
                  <span />
                </div>

                {/* Alternate Actions */}
                <div className="ref-alternate-actions">
                  <button
                    className="ref-secondary-action"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                  >
                    <span className="ref-google-mark" aria-hidden="true">G</span>
                    <span>Sign in with Google</span>
                  </button>
                  <button
                    className="ref-secondary-action"
                    type="button"
                    onClick={handleAnonymousSignIn}
                    disabled={isSubmitting}
                  >
                    <span className="ref-guest-mark" aria-hidden="true">＋</span>
                    <span>Anonymous sign in (Guest access)</span>
                  </button>
                </div>

                {/* Switch to Register */}
                <p className="ref-register-prompt">
                  Don't have an account?
                  <Link className="ref-text-link" to="/register">
                    Register here
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 id="welcome-title">Create Account</h2>
                <p className="ref-auth-intro">
                  Join Hastivo for real-time sign language access.
                </p>

                {errorMessage && (
                  <div className="ref-error-banner" role="alert">
                    <span>⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form className="ref-signin-form" onSubmit={handleRegisterSubmit}>
                  {/* Full Name */}
                  <div className="ref-field-group">
                    <div className="ref-field-heading">
                      <label htmlFor="regFullName">
                        Full Name <span aria-hidden="true">*</span>
                      </label>
                    </div>
                    <div className="ref-input-shell">
                      <span className="ref-field-icon" aria-hidden="true">◎</span>
                      <input
                        id="regFullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Username & Email Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="ref-field-group">
                      <div className="ref-field-heading">
                        <label htmlFor="regUsername">
                          Username <span aria-hidden="true">*</span>
                        </label>
                      </div>
                      <div className="ref-input-shell" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                        <input
                          id="regUsername"
                          type="text"
                          placeholder="johndoe"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={{ padding: '0 14px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="ref-field-group">
                      <div className="ref-field-heading">
                        <label htmlFor="regEmail">
                          Email <span aria-hidden="true">*</span>
                        </label>
                      </div>
                      <div className="ref-input-shell" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                        <input
                          id="regEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ padding: '0 14px' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="ref-field-group">
                    <div className="ref-field-heading">
                      <label htmlFor="regPhone">
                        Phone Number <span aria-hidden="true">*</span>
                      </label>
                    </div>
                    <div className="ref-input-shell">
                      <span className="ref-field-icon" aria-hidden="true">⌑</span>
                      <input
                        id="regPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Passwords in Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="ref-field-group">
                      <div className="ref-field-heading">
                        <label htmlFor="regPassword">
                          Password <span aria-hidden="true">*</span>
                        </label>
                        {password && (
                          <button
                            type="button"
                            onClick={() => setIsPasswordLocked(!isPasswordLocked)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: isPasswordLocked ? 'var(--ref-coral)' : 'var(--ref-muted)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {isPasswordLocked ? '🔒 Locked' : '🔓 Lock'}
                          </button>
                        )}
                      </div>
                      <div className="ref-input-shell" style={{ gridTemplateColumns: 'minmax(0, 1fr) 40px' }}>
                        <input
                          id="regPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          disabled={isPasswordLocked}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ padding: '0 12px' }}
                          required
                        />
                        <button
                          type="button"
                          className="ref-icon-button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? '◉' : '○'}
                        </button>
                      </div>
                    </div>

                    <div className="ref-field-group">
                      <div className="ref-field-heading">
                        <label htmlFor="regConfirmPassword">
                          Confirm <span aria-hidden="true">*</span>
                        </label>
                        {confirmPassword && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: password === confirmPassword ? 'var(--ref-blue)' : 'var(--ref-coral)',
                              fontWeight: 600,
                            }}
                          >
                            {password === confirmPassword ? '✓ Match' : '✕ Mismatch'}
                          </span>
                        )}
                      </div>
                      <div className="ref-input-shell" style={{ gridTemplateColumns: 'minmax(0, 1fr) 40px' }}>
                        <input
                          id="regConfirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ padding: '0 12px' }}
                          required
                        />
                        <button
                          type="button"
                          className="ref-icon-button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? '◉' : '○'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    className="ref-primary-action"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ marginTop: '8px' }}
                  >
                    <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </form>

                <p className="ref-register-prompt">
                  Already have an account?
                  <Link className="ref-text-link" to="/signin">
                    Sign in here
                  </Link>
                </p>
              </>
            )}

            {/* Bottom Meta Bar */}
            <div className="ref-auth-meta">
              <span>© 2026 Hastivo Platform</span>
              <button
                className="ref-language-control"
                type="button"
                aria-label="Language: ISL and English"
              >
                <span aria-hidden="true">◎</span> ISL / ENG
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
