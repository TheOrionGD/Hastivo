import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Unlock, Check, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();

  // Form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Lock Mechanism States
  const [isPasswordLocked, setIsPasswordLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password lock checks
  const canLockPassword = password.length >= 8;
  const isMatch = isPasswordLocked && confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = isPasswordLocked && confirmPassword.length > 0 && password !== confirmPassword;

  const handleLockToggle = () => {
    if (!isPasswordLocked) {
      if (!canLockPassword) {
        setErrorMsg('Password must be at least 8 characters long before locking.');
        return;
      }
      setIsPasswordLocked(true);
      setErrorMsg(null);
    } else {
      // Explicit unlock
      setIsPasswordLocked(false);
      setConfirmPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isPasswordLocked) {
      setErrorMsg('Please confirm and lock your initial password first.');
      return;
    }

    if (!isMatch) {
      setErrorMsg('Confirmed password does not match the locked initial password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        username,
        fullName,
        email,
        phone,
        password,
      });

      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 z-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 hairline-border bg-[var(--surface)]/90 backdrop-blur-md">
        {/* Left Column: Brand & Requirements (Desktop 5 cols) */}
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
              Create your verified account.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Join the Swiss Grid communication platform. Save multi-turn conversation logs, access custom linguistic gloss presets, and participate in two-way dialogues.
            </p>

            {/* Password Lock Explanation */}
            <div className="p-4 bg-[var(--surface)] hairline-border space-y-2 text-xs font-mono">
              <span className="text-[var(--brand-coral)] font-bold uppercase block">
                Security Protocol &bull; Password Lock
              </span>
              <p className="text-[var(--text-tertiary)] leading-relaxed">
                1. Enter primary password (&ge; 8 characters)<br />
                2. Click [Lock Initial Password]<br />
                3. Re-enter password in confirmation field to verify match.
              </p>
            </div>
          </div>

          <div className="pt-4 hairline-border-t flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)]">
            <ShieldCheck className="w-4 h-4 text-[var(--brand-coral)]" />
            <span>SECURE ENCRYPTED PROTOCOL</span>
          </div>
        </div>

        {/* Right Column: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Registration
            </h3>
            <span className="font-mono text-xs text-[var(--text-tertiary)]">
              STEP 1 / 1
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[var(--brand-coral)]/10 border border-[var(--brand-coral)] flex items-start gap-2.5 text-xs text-[var(--brand-coral)]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. aditi_sign"
                  className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-[var(--brand-coral)] transition-colors"
                />
              </div>
            </div>

            {/* MANDATORY PASSWORD LOCK INTERACTION SECTION */}
            <div className="p-4 bg-[var(--surface-secondary)]/60 hairline-border space-y-4">
              {/* Step A: Initial Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <span>Initial Password</span>
                    {isPasswordLocked && (
                      <span className="text-[10px] text-[var(--brand-coral)] font-bold flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </label>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    MIN 8 CHARS
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      readOnly={isPasswordLocked}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={`w-full text-sm font-mono px-3.5 py-2 pr-9 border transition-colors ${
                        isPasswordLocked
                          ? 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] cursor-not-allowed'
                          : 'bg-[var(--background)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none focus:border-[var(--brand-coral)]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Lock / Unlock Toggle Button */}
                  <button
                    type="button"
                    onClick={handleLockToggle}
                    disabled={!password || (!isPasswordLocked && !canLockPassword)}
                    className={`px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors border ${
                      isPasswordLocked
                        ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)] hover:opacity-90'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--brand-coral)] disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isPasswordLocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock & Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step B: Confirm Password Field (Enabled only after lock) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                    Re-Enter Confirmation Password
                  </label>
                  {isMatch && (
                    <span className="font-mono text-[10px] text-[var(--brand-blue)] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> MATCH VERIFIED
                    </span>
                  )}
                  {isMismatch && (
                    <span className="font-mono text-[10px] text-[var(--brand-coral)] font-bold">
                      DOES NOT MATCH
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={!isPasswordLocked}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder={isPasswordLocked ? 'Re-type locked password' : 'Lock initial password first'}
                    className={`w-full text-sm font-mono px-3.5 py-2 pr-9 border transition-colors ${
                      !isPasswordLocked
                        ? 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)] border-[var(--border)] cursor-not-allowed'
                        : isMatch
                        ? 'bg-[var(--background)] text-[var(--text-primary)] border-[var(--brand-blue)]'
                        : isMismatch
                        ? 'bg-[var(--background)] text-[var(--text-primary)] border-[var(--brand-coral)]'
                        : 'bg-[var(--background)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none focus:border-[var(--brand-coral)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!isPasswordLocked}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isMatch}
              className={`w-full py-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isMatch
                  ? 'bg-[var(--brand-coral)] text-white hover:opacity-90'
                  : 'bg-[var(--border)] text-[var(--text-tertiary)] cursor-not-allowed'
              }`}
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 hairline-border-t text-center text-xs text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--brand-coral)] font-mono font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
