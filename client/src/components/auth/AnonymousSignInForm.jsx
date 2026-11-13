import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Info, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { FormAlert } from "./AuthFields";
import { rise, stagger } from "./AuthLayout";
import {
  friendlyAnonymousError,
  isFirebaseConfigured,
  signInAnonymously,
} from "@/services/auth/authService";

export function AnonymousSignInForm() {
  const navigate = useNavigate();
  const configured = isFirebaseConfigured();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const continueAsGuest = async () => {
    setLoading(true);
    setError("");
    try {
      let guestUid = `guest_${Date.now()}`;
      if (configured) {
        try {
          const credential = await signInAnonymously();
          if (credential?.user?.uid) guestUid = credential.user.uid;
        } catch {}
      }

      // Provision permitted guest session in local backend & MongoDB
      const res = await fetch("/api/v1/auth/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestUid }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("hastivo_auth_token", data.token);
          localStorage.setItem("hastivo_auth_user", JSON.stringify(data.user));
        }
      }

      navigate({ to: "/guest/dashboard" });
    } catch (err) {
      setError(friendlyAnonymousError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={rise} className="flex h-12 w-12 items-center justify-center rounded-full border text-blue" aria-hidden="true">
        <UserRound size={23} />
      </motion.div>
      <motion.h2 variants={rise} className="font-display mt-8 text-5xl font-medium tracking-tight md:text-6xl">
        Continue Anonymously.
      </motion.h2>
      <motion.p variants={rise} className="mt-4 text-lg text-text-2">
        Start a guest session without an email address or password.
      </motion.p>

      <motion.div variants={rise} className="mt-10 space-y-5 text-text-2">
        <p className="flex items-start gap-3">
          <ShieldCheck size={19} className="mt-1 shrink-0 text-blue" aria-hidden="true" />
          Your guest session stays on this device until you sign out or clear its site data.
        </p>
        <p>No public profile is created. Account-only features may not be available to guests.</p>
      </motion.div>

      {!configured && (
        <motion.div variants={rise} className="mt-8 flex items-start gap-3 border-l-2 border-yellow py-1 pl-4 text-text-2" role="note">
          <Info size={19} className="mt-0.5 shrink-0 text-yellow" aria-hidden="true" />
          <p>Firebase setup is required. Add the web configuration and enable Anonymous sign-in in Firebase to activate guest access.</p>
        </motion.div>
      )}

      <motion.div variants={rise} className="mt-10 space-y-4">
        <FormAlert error={error} />
        <button
          type="button"
          className="pill-action w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!configured || loading}
          aria-busy={loading}
          onClick={continueAsGuest}
        >
          {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
          {loading ? "Starting guest session…" : configured ? "Continue as Guest" : "Firebase Setup Required"}
        </button>
      </motion.div>

      <motion.p variants={rise} className="mt-10 text-text-2">
        Prefer an account? <Link to="/auth" className="link-action font-medium text-foreground">Sign In</Link>
      </motion.p>
    </motion.div>
  );
}
