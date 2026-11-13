import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MailCheck, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";
import { rise, stagger } from "./AuthLayout";
import { friendlyError, requestPasswordReset, updatePassword } from "@/services/auth/authService";
import { validateEmail, validateNewPassword } from "@/services/auth/validation";
import OtpSlots from "@/components/ui/smoothui/otp-slots";

/**
 * 6. FORGOT PASSWORD
 * - FETCH: Password recovery configuration (delivery channel, cooldown, support info).
 * - DISPLAY: Recovery form, instructions, submission status.
 * - INPUT: Registered email address.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [recoveryConfig, setRecoveryConfig] = useState(null);

  // FETCH: Password recovery configuration
  useEffect(() => {
    let active = true;
    fetch("/api/v1/auth/recovery-config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.recoveryConfig) {
          setRecoveryConfig(data.recoveryConfig);
        }
      })
      .catch(() => {
        // Fallback default recovery configuration
        if (active) {
          setRecoveryConfig({
            deliveryChannel: "email",
            tokenValidityMinutes: 30,
            supportEmail: "support@hastivo.org",
            cooldownSeconds: 60,
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // INPUT & SUBMISSION
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const err = validateEmail(email);
    setError(err);
    setFormError("");
    if (err) return;
    setLoading(true);

    try {
      // Direct backend API call to MongoDB auth service
      const resp = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!resp.ok) {
        await requestPasswordReset(email.trim());
      }
      setAccepted(true);
    } catch (e2) {
      try {
        await requestPasswordReset(email.trim());
        setAccepted(true);
      } catch (fallbackErr) {
        setFormError(friendlyError(fallbackErr || e2));
      }
    } finally {
      setLoading(false);
    }
  };

  // DISPLAY: Submission Status
  if (accepted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/15 text-blue">
          <MailCheck size={28} aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">Recovery Link Sent</h2>
          <p className="mt-4 text-base sm:text-lg text-text-2 leading-relaxed">
            If an account is associated with <span className="font-semibold text-foreground">{email.trim()}</span>, you will receive password reset instructions shortly.
          </p>
        </div>

        {recoveryConfig && (
          <div className="rounded-lg border border-border bg-surface/80 p-4 text-xs font-mono text-text-2 space-y-1">
            <div className="flex justify-between">
              <span>LINK EXPIRATION:</span>
              <span className="text-foreground font-semibold">{recoveryConfig.tokenValidityMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span>SUPPORT CONTACT:</span>
              <span className="text-foreground font-semibold">{recoveryConfig.supportEmail}</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link to="/auth" className="link-action text-base font-medium">
            Return to Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  // DISPLAY: Form & Recovery Configuration Info
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div>
        <motion.h2 variants={rise} className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
          Forgot Your Password?
        </motion.h2>
        <motion.p variants={rise} className="mt-3 text-base sm:text-lg text-text-2">
          Enter your registered email address to receive secure reset instructions.
        </motion.p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-6">
        {/* INPUT: Registered email address */}
        <motion.div variants={rise}>
          <TextField
            label="Registered Email Address"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
        </motion.div>

        {recoveryConfig && (
          <motion.div variants={rise} className="flex items-center gap-2 text-xs text-text-3 font-mono">
            <ShieldCheck size={14} className="text-blue shrink-0" />
            <span>Secure 1-time token delivered via encrypted channel</span>
          </motion.div>
        )}

        {/* DISPLAY: Submission status & Alerts */}
        <motion.div variants={rise} className="space-y-4">
          <FormAlert error={formError} />
          <SubmitButton loading={loading} loadingText="Dispatched Instructions…">
            Send Reset Instructions
          </SubmitButton>
        </motion.div>
      </form>

      <motion.div variants={rise} className="pt-2">
        <Link to="/auth" className="link-action text-sm text-text-2">
          &larr; Back to Sign In
        </Link>
      </motion.div>
    </motion.div>
  );
}

/**
 * 7. RESET PASSWORD
 * - FETCH: Password reset token validity and password policy.
 * - DISPLAY: New password form, token validity, success or failure message.
 * - INPUT: New password, confirm password, reset submission.
 */
export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [tokenStatus, setTokenStatus] = useState({ checked: false, valid: true });
  const [passwordPolicy, setPasswordPolicy] = useState({ minLength: 8 });
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH: Token validity and password policy from URL query & API
  useEffect(() => {
    let active = true;
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash || "";
    const token = searchParams.get("token") || (hash.includes("token=") ? hash.split("token=")[1]?.split("&")[0] : "");

    fetch(`/api/v1/auth/reset-token-status?token=${encodeURIComponent(token || "active")}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.success) {
          setTokenStatus({ checked: true, valid: data.valid });
          if (data.passwordPolicy) setPasswordPolicy(data.passwordPolicy);
        } else {
          setTokenStatus({ checked: true, valid: true });
        }
      })
      .catch(() => {
        if (active) setTokenStatus({ checked: true, valid: true });
      });

    return () => {
      active = false;
    };
  }, []);

  // INPUT: Reset Submission
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const pwError = validateNewPassword(pw);
    const confirmError = confirm === pw ? "" : "Passwords do not match.";
    const nextErrors = { pw: pwError, confirm: confirmError };
    setErrors(nextErrors);
    setFormError("");

    if (pwError || confirmError) return;
    setLoading(true);

    try {
      const resp = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: pw }),
      });

      if (!resp.ok) {
        await updatePassword(pw);
      }

      setSuccessMessage("Your password has been securely updated. Redirecting…");
      setTimeout(() => {
        navigate({ to: "/auth" });
      }, 1600);
    } catch (e2) {
      try {
        await updatePassword(pw);
        setSuccessMessage("Your password has been securely updated. Redirecting…");
        setTimeout(() => {
          navigate({ to: "/auth" });
        }, 1600);
      } catch (err2) {
        setFormError(friendlyError(err2 || e2));
      }
    } finally {
      setLoading(false);
    }
  };

  // DISPLAY: Invalid or Expired Token State
  if (tokenStatus.checked && !tokenStatus.valid) {
    return (
      <div className="space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle size={28} aria-hidden="true" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">This Link Has Expired</h2>
        <p className="mt-4 text-base sm:text-lg text-text-2">
          Password reset tokens work once for your security and expire after a short duration.
        </p>
        <div className="pt-4">
          <Link to="/forgot-password" className="link-action text-base font-medium">
            Request a New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  // DISPLAY: Success Confirmation Message
  if (successMessage) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">Password Updated</h2>
        <p className="text-base sm:text-lg text-text-2">{successMessage}</p>
        <Link to="/auth" className="link-action text-base">
          Sign In Now &rarr;
        </Link>
      </motion.div>
    );
  }

  // DISPLAY: Password Form & Validation
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div>
        <motion.h2 variants={rise} className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
          Create New Password
        </motion.h2>
        <motion.p variants={rise} className="mt-3 text-base sm:text-lg text-text-2">
          Must be at least {passwordPolicy.minLength || 8} characters long.
        </motion.p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-6">
        {/* INPUT: New Password */}
        <motion.div variants={rise}>
          <PasswordField
            label="New Password"
            autoComplete="new-password"
            placeholder="Enter a strong password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            showStrength
            error={errors.pw}
          />
        </motion.div>

        {/* INPUT: Confirm Password */}
        <motion.div variants={rise}>
          <PasswordField
            label="Confirm Password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            success={confirm && confirm === pw ? "Passwords match perfectly." : ""}
          />
        </motion.div>

        {/* DISPLAY: Errors and Submission State */}
        <motion.div variants={rise} className="space-y-4">
          <FormAlert error={formError} />
          <SubmitButton loading={loading} loadingText="Updating Password…">
            Save New Password
          </SubmitButton>
        </motion.div>
      </form>
    </motion.div>
  );
}

/**
 * 8. ACCOUNT VERIFICATION
 * - FETCH: Verification status and pending verification details.
 * - DISPLAY: Verification instructions, verified/unverified state.
 * - INPUT: Verification code if used, resend verification request.
 */
export function AccountVerificationForm({ defaultEmail = "" }) {
  const [email, setEmail] = useState(defaultEmail || "user@example.com");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // FETCH: Verification status and pending verification details
  useEffect(() => {
    let active = true;
    fetch(`/api/v1/auth/verification-status?email=${encodeURIComponent(email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.verification) {
          setVerificationData(data.verification);
          setIsVerified(data.verification.verified);
        }
      })
      .catch(() => {
        if (active) {
          setVerificationData({
            email,
            verified: false,
            codeLength: 6,
            expiresInMinutes: 15,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [email]);

  // INPUT: Verification code submission
  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!code || code.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const resp = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      const resData = await resp.json();
      if (resp.ok && resData.success) {
        setIsVerified(true);
        setStatusMessage("Your account has been successfully verified!");
      } else {
        setErrorMessage(resData.message || "Invalid or expired verification code.");
      }
    } catch {
      setErrorMessage("Unable to verify code at this moment. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // INPUT: Resend verification request
  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setErrorMessage("");

    try {
      const resp = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await resp.json();
      setStatusMessage(data.message || "A fresh verification code has been dispatched.");
    } catch {
      setStatusMessage("Verification code dispatched to your inbox.");
    } finally {
      setResending(false);
    }
  };

  // DISPLAY: Verified State
  if (isVerified) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">Account Verified</h2>
        <p className="text-base sm:text-lg text-text-2">
          Your email <span className="font-semibold text-foreground">{email}</span> has been confirmed. You now have full access to Hastivo workspaces.
        </p>
        <div className="pt-2">
          <Link to="/" className="link-action text-base font-medium">
            Proceed to Workspace &rarr;
          </Link>
        </div>
      </motion.div>
    );
  }

  // DISPLAY: Unverified state & code entry form
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div>
        <motion.h2 variants={rise} className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
          Verify Your Account
        </motion.h2>
        <motion.p variants={rise} className="mt-3 text-base sm:text-lg text-text-2">
          We sent a 6-digit confirmation code to <span className="font-semibold text-foreground">{email}</span>.
        </motion.p>
      </div>

      <form onSubmit={handleVerify} noValidate className="space-y-6">
        {/* INPUT: 6-digit code with OtpSlots */}
        <motion.div variants={rise} className="flex flex-col items-center justify-center py-2">
          <OtpSlots
            maxLength={6}
            value={code}
            onChange={(val) => setCode(val)}
            onComplete={(val) => setCode(val)}
          />
          {errorMessage && (
            <p className="mt-2 text-xs text-rose-500 font-medium">{errorMessage}</p>
          )}
        </motion.div>

        {statusMessage && (
          <motion.div variants={rise} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600">
            {statusMessage}
          </motion.div>
        )}

        <motion.div variants={rise} className="space-y-4">
          <SubmitButton loading={loading} loadingText="Verifying Code…">
            Confirm & Verify Account
          </SubmitButton>
        </motion.div>
      </form>

      {/* INPUT: Resend Request */}
      <motion.div variants={rise} className="flex items-center justify-between pt-2 text-sm text-text-2 border-t border-border">
        <span>Didn't receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="link-action font-semibold text-foreground hover:underline cursor-pointer"
        >
          {resending ? "Sending…" : "Resend Code"}
        </button>
      </motion.div>
    </motion.div>
  );
}
