import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Divider, FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AnonymousAuthLink } from "./AnonymousAuthLink";
import { rise, stagger } from "./AuthLayout";
import { friendlyError, signIn } from "@/services/auth/authService";
import { validateEmail } from "@/services/auth/validation";

export function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const next = { email: validateEmail(email), password: password ? "" : "Password is required." };
    setErrors(next);
    setFormError("");
    if (next.email || next.password) return;
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate({ to: "/get-started" });
    } catch (err) {
      setFormError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h2 variants={rise} className="font-display text-5xl font-medium tracking-tight md:text-6xl">Welcome Back.</motion.h2>
      <motion.p variants={rise} className="mt-4 text-lg text-text-2">Sign in to continue your communication experience.</motion.p>

      <form onSubmit={submit} noValidate className="mt-10 space-y-7" aria-describedby={formError ? "form-alert" : undefined}>
        <motion.div variants={rise}>
          <TextField label="Email Address" type="email" autoComplete="email" inputMode="email" placeholder="Enter your email address"
            value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        </motion.div>
        <motion.div variants={rise}>
          <PasswordField label="Password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <div className="mt-2 flex justify-end">
            <Link to="/forgot-password" className="link-action text-sm text-text-2">Forgot password?</Link>
          </div>
        </motion.div>
        <motion.div variants={rise} className="space-y-4">
          <FormAlert error={formError} />
          <SubmitButton loading={loading} loadingText="Signing in…">Sign In</SubmitButton>
        </motion.div>
      </form>

      <motion.div variants={rise}>
        <Divider />
        <GoogleAuthButton onError={setFormError} />
        <AnonymousAuthLink />
        <p className="mt-10 text-text-2">
          Don't have an account?{" "}
          <Link to="/register" className="link-action font-medium text-foreground">Create Account</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
