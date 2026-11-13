import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { Divider, FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AnonymousAuthLink } from "./AnonymousAuthLink";
import { rise, stagger } from "./AuthLayout";
import { friendlyError, isUsernameAvailable, signUp } from "@/services/auth/authService";
import { validateEmail, validateNewPassword, validatePhone, validateUsername } from "@/services/auth/validation";

export function RegisterForm() {
  const [v, setV] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirm: "" });
  const [locked, setLocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const toggleLock = () => {
    if (locked) {
      setLocked(false);
      setV((s) => ({ ...s, confirm: "" }));
      return;
    }
    const err = validateNewPassword(v.password);
    setErrors((s) => ({ ...s, password: err }));
    if (!err) setLocked(true);
  };

  const matchState = locked && v.confirm ? (v.confirm === v.password ? "match" : "mismatch") : null;

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const next = {
      fullName: v.fullName.trim().length >= 2 ? "" : "Please enter your full name.",
      username: validateUsername(v.username),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
      password: validateNewPassword(v.password) || (locked ? "" : "Lock your password before confirming it."),
      confirm: !v.confirm ? "Please confirm your password." : v.confirm !== v.password ? "Passwords don't match." : "",
    };
    setErrors(next);
    setFormError("");
    if (Object.values(next).some(Boolean)) return;
    setLoading(true);
    try {
      if (!(await isUsernameAvailable(v.username))) {
        setErrors((s) => ({ ...s, username: "That username is taken. Try another." }));
        return;
      }
      const data = await signUp({ email: v.email.trim(), password: v.password, fullName: v.fullName.trim(), username: v.username, phone: v.phone.trim() });
      if (data.session) window.location.assign("/get-started");
      else setSentTo(v.email.trim());
    } catch (err) {
      setFormError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status">
        <MailCheck size={32} className="text-blue" aria-hidden="true" />
        <h2 className="font-display mt-6 text-5xl font-medium tracking-tight">Check your inbox.</h2>
        <p className="mt-4 text-lg text-text-2">
          Your account was created. We asked our sign-in service to send a confirmation link to <span className="text-foreground">{sentTo}</span>. Open it to activate your account.
        </p>
        <Link to="/auth" className="link-action mt-10 text-lg">Back to Sign In</Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h2 variants={rise} className="font-display text-5xl font-medium tracking-tight">Create Your Account</motion.h2>
      <motion.p variants={rise} className="mt-4 text-lg text-text-2">Join the communication experience.</motion.p>

      <form onSubmit={submit} noValidate className="mt-10 space-y-6">
        <motion.div variants={rise} className="grid gap-6 sm:grid-cols-2">
          <TextField label="Full Name" autoComplete="name" placeholder="Your full name" value={v.fullName} onChange={set("fullName")} error={errors.fullName} />
          <TextField label="Username" autoComplete="username" placeholder="e.g. asha_k" value={v.username} onChange={set("username")} error={errors.username} />
        </motion.div>
        <motion.div variants={rise} className="grid gap-6 sm:grid-cols-2">
          <TextField label="Email Address" type="email" autoComplete="email" inputMode="email" placeholder="Enter your email address" value={v.email} onChange={set("email")} error={errors.email} />
          <TextField label="Phone Number" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" value={v.phone} onChange={set("phone")} error={errors.phone} />
        </motion.div>
        <motion.div variants={rise}>
          <PasswordField label="Password" autoComplete="new-password" placeholder="Create a password" value={v.password} onChange={set("password")}
            locked={locked} onToggleLock={toggleLock} showStrength={!locked} error={errors.password}
            success={locked ? "Password locked. Now confirm it below — unlock to edit." : ""} />
        </motion.div>
        <motion.div variants={rise}>
          <PasswordField label="Confirm Password" autoComplete="new-password" placeholder={locked ? "Re-enter your password" : "Lock your password first"}
            value={v.confirm} onChange={set("confirm")} disabled={!locked}
            error={errors.confirm || (matchState === "mismatch" ? "Passwords don't match." : "")}
            success={matchState === "match" ? "Passwords match." : ""} />
        </motion.div>
        <motion.div variants={rise} className="space-y-4 pt-2">
          <FormAlert error={formError} />
          <SubmitButton loading={loading} loadingText="Creating account…">Create Account</SubmitButton>
        </motion.div>
      </form>

      <motion.div variants={rise}>
        <Divider />
        <GoogleAuthButton onError={setFormError} />
        <AnonymousAuthLink />
        <p className="mt-10 text-text-2">
          Already have an account?{" "}
          <Link to="/auth" className="link-action font-medium text-foreground">Sign In</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
