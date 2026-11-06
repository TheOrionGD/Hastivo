import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginAnonymous } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (e: any) {
      setErrorMsg(e.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await loginAnonymous();
      navigate('/dashboard');
    } catch (e: any) {
      setErrorMsg(e.message || 'Guest sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 z-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 hairline-border bg-[var(--surface)]/90 backdrop-blur-md">
        {/* Left Column: Brand Identity & Manifesto (Desktop 5 cols) */}
        <div className="lg:col-span-5 p-8 sm:p-12 hairline-border-b lg:hairline-border-b-0 lg:hairline-border-r flex flex-col justify-between space-y-8 bg-[var(--surface-secondary)]/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[var(--brand-coral)] inline-block" />
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                SIGNA
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              {t('brandStatement')}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Welcome back to your workspace.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Sign in to resume real-time sign language translation, access your verified conversation transcripts, or continue collaboration.
            </p>
          </div>

          <div className="pt-4 hairline-border-t flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)]">
            <ShieldCheck className="w-4 h-4 text-[var(--brand-coral)]" />
            <span>AUTHENTICATED CLIENT &bull; ZERO SIMULATED LOGINS</span>
          </div>
        </div>

        {/* Right Column: Focused Authentication Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Sign In
            </h3>
            <span className="font-mono text-xs text-[var(--text-tertiary)]">
              SECURE ACCESS
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[var(--brand-coral)]/10 border border-[var(--brand-coral)] flex items-start gap-2.5 text-xs text-[var(--brand-coral)]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotMsg && (
            <div className="p-3 bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)] text-xs text-[var(--brand-blue)]">
              {forgotMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="you@domain.com or username"
                className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMsg('To reset your password, contact your workspace administrator or verify via email.')}
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--brand-coral)] cursor-pointer"
                >
                  Forgot?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full hairline-border-b" />
            </div>
            <span className="relative bg-[var(--surface)] px-3 text-xs font-mono text-[var(--text-tertiary)] uppercase">
              OR
            </span>
          </div>

          {/* Alternative Auth Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="py-2.5 px-3 bg-[var(--background)] border border-[var(--border)] text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--brand-blue)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Google Sign-In</span>
            </button>

            <button
              type="button"
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              className="py-2.5 px-3 bg-[var(--background)] border border-[var(--border)] text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Guest Collaborator</span>
            </button>
          </div>

          <div className="pt-4 hairline-border-t text-center text-xs text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--brand-coral)] font-mono font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
