import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";
import { rise, stagger } from "./AuthLayout";
import { useFirebaseSession } from "@/hooks/useFirebaseSession";
import {
  friendlyAnonymousError,
  isFirebaseConfigured,
  upgradeAnonymousAccount,
  upgradeAnonymousAccountWithGoogle,
} from "@/services/auth/authService";
import { validateEmail, validateNewPassword } from "@/services/auth/validation";

export function UpgradeAccountForm() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useFirebaseSession();
  const configured = isFirebaseConfigured();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [locked, setLocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const guest = user?.isAnonymous ? user : null;

  const toggleLock = () => {
    if (locked) {
      setLocked(false);
      setValues((current) => ({ ...current, confirm: "" }));
      return;
    }
    const error = validateNewPassword(values.password);
    setErrors((current) => ({ ...current, password: error }));
    if (!error) setLocked(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const next = {
      email: validateEmail(values.email),
      password: validateNewPassword(values.password) || (locked ? "" : "Lock your password before confirming it."),
      confirm: !values.confirm ? "Please confirm your password." : values.confirm !== values.password ? "Passwords don't match." : "",
    };
    setErrors(next);
    setFormError("");
    if (Object.values(next).some(Boolean)) return;

    setSaving(true);
    try {
      await upgradeAnonymousAccount({ email: values.email, password: values.password });
      navigate({ to: "/get-started", replace: true });
    } catch (error) {
      setFormError(friendlyAnonymousError(error));
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading) {
    return <p className="text-lg text-text-2" role="status">Checking your guest session…</p>;
  }

  if (!guest) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.h2 variants={rise} className="font-display text-5xl font-medium tracking-tight">Guest account required.</motion.h2>
        <motion.p variants={rise} className="mt-4 text-lg text-text-2">
          Start with a guest session before upgrading, or return to your existing account.
        </motion.p>
        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-6">
          <Link to="/anonymous" className="pill-action">Continue as Guest <ArrowRight size={18} /></Link>
          <Link to="/get-started" className="link-action">Back to Get Started</Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="flex h-12 w-12 items-center justify-center rounded-full border text-blue" aria-hidden="true">
        <ShieldCheck size={23} />
      </motion.div>
      <motion.h2 variants={rise} className="font-display mt-8 text-5xl font-medium tracking-tight">Make Your Account Permanent.</motion.h2>
      <motion.p variants={rise} className="mt-4 text-lg text-text-2">
        Add an email and password or link your Google account to this guest session. All saved translations, conversations, and preferences are automatically transferred to your new account.
      </motion.p>

      {/* Primary One-Click Google Upgrade */}
      <motion.div variants={rise} className="mt-8">
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            setFormError("");
            try {
              await upgradeAnonymousAccountWithGoogle();
              navigate({ to: "/guest/dashboard", replace: true });
            } catch (err) {
              setFormError(friendlyAnonymousError(err));
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="w-full py-3 px-4 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Upgrade Account With Google (Keep All Data)</span>
        </button>
      </motion.div>

      <div className="relative my-6 text-center text-xs text-muted-foreground">
        <span className="bg-background px-3 font-mono">or set email & password</span>
      </div>

      <form onSubmit={submit} noValidate className="mt-10 space-y-6">
        <motion.div variants={rise}>
          <TextField label="Email Address" type="email" autoComplete="email" inputMode="email" placeholder="Enter your email address" value={values.email} onChange={set("email")} error={errors.email} />
        </motion.div>
        <motion.div variants={rise}>
          <PasswordField label="Password" autoComplete="new-password" placeholder="Create a password" value={values.password} onChange={set("password")} locked={locked} onToggleLock={toggleLock} showStrength={!locked} error={errors.password} success={locked ? "Password locked. Now confirm it below — unlock to edit." : ""} />
        </motion.div>
        <motion.div variants={rise}>
          <PasswordField label="Confirm Password" autoComplete="new-password" placeholder={locked ? "Re-enter your password" : "Lock your password first"} value={values.confirm} onChange={set("confirm")} disabled={!locked} error={errors.confirm} success={locked && values.confirm && values.confirm === values.password ? "Passwords match." : ""} />
        </motion.div>
        <motion.div variants={rise} className="space-y-4 pt-2">
          <FormAlert error={formError} />
          <SubmitButton loading={saving} loadingText="Upgrading your account…">Save My Account</SubmitButton>
        </motion.div>
      </form>
      <motion.p variants={rise} className="mt-8 text-text-2">
        <Link to="/get-started" className="link-action">Keep using this guest session</Link>
      </motion.p>
      {!configured && <p className="mt-6 text-sm text-text-2">Firebase setup is required before account upgrades are available.</p>}
    </motion.div>
  );
}
