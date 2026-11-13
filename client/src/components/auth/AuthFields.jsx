import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, LockOpen } from "lucide-react";
import { PASSWORD_RULES, passwordScore } from "@/services/auth/validation";

/** Inline message with icon + text, never colour alone. */
export function FieldMessage({ id, error, success }) {
  return (
    <AnimatePresence initial={false}>
      {(error || success) && (
        <motion.p
          id={id}
          role={error ? "alert" : "status"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mt-2 flex items-start gap-2 text-sm ${error ? "text-coral" : "text-text-2"}`}
        >
          {error ? <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />}
          {error || success}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function TextField({ label, error, success, hint, className = "", ...props }) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-text-2">{label}</label>
      <input
        id={id}
        className="auth-input"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error || success ? msgId : undefined}
        {...props}
      />
      {hint && !error && <p className="mt-2 text-sm text-text-3">{hint}</p>}
      <FieldMessage id={msgId} error={error} success={success} />
    </div>
  );
}

export function PasswordField({ label, error, success, locked, onToggleLock, showStrength, value, autoComplete = "current-password", ...props }) {
  const id = useId();
  const msgId = `${id}-msg`;
  const [visible, setVisible] = useState(false);
  const score = passwordScore(value || "");
  const strength = ["Too weak", "Weak", "Fair", "Good", "Strong"][score];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-text-2">{label}</label>
        {locked && (
          <span className="flex items-center gap-1 text-sm text-blue">
            <Lock size={13} aria-hidden="true" /> Locked
          </span>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`auth-input pr-24 ${locked ? "auth-input--locked" : ""}`}
          readOnly={locked}
          aria-readonly={locked || undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error || success ? msgId : undefined}
          autoComplete={autoComplete}
          value={value}
          {...props}
        />
        <div className="absolute bottom-1 right-0 flex">
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="grid h-11 w-11 place-items-center text-text-3 hover:text-foreground"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {onToggleLock && (
            <button
              type="button"
              onClick={onToggleLock}
              disabled={!locked && !value}
              className={`grid h-11 w-11 place-items-center transition-colors disabled:opacity-30 ${locked ? "text-blue" : "text-text-3 hover:text-foreground"}`}
              aria-label={locked ? "Unlock password to edit" : "Lock password"}
              aria-pressed={locked}
            >
              <motion.span key={locked ? "l" : "u"} initial={{ rotate: -20, scale: 0.7 }} animate={{ rotate: 0, scale: 1 }}>
                {locked ? <Lock size={18} /> : <LockOpen size={18} />}
              </motion.span>
            </button>
          )}
        </div>
      </div>

      {showStrength && value && (
        <div className="mt-3" aria-live="polite">
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? (score >= 4 ? "bg-blue" : score >= 3 ? "bg-yellow" : "bg-coral") : "bg-border"}`} />
            ))}
          </div>
          <p className="mt-2 text-sm text-text-2">Strength: {strength}</p>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(value);
              return (
                <li key={r.id} className={`flex items-center gap-2 ${ok ? "text-text-2" : "text-text-3"}`}>
                  {ok ? <CheckCircle2 size={14} className="text-blue" aria-hidden="true" /> : <span className="inline-block h-3.5 w-3.5 rounded-full border" aria-hidden="true" />}
                  {r.label}
                  <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <FieldMessage id={msgId} error={error} success={success} />
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText }) {
  return (
    <button type="submit" disabled={loading} aria-busy={loading} className="pill-action w-full justify-center disabled:cursor-wait disabled:opacity-70">
      {loading ? (<><Loader2 size={18} className="animate-spin" aria-hidden="true" /> {loadingText}</>) : children}
    </button>
  );
}

export function FormAlert({ error, success }) {
  return <FieldMessage id="form-alert" error={error} success={success} />;
}

export function Divider() {
  return (
    <div className="my-8 flex items-center gap-4 text-sm text-text-3" aria-hidden="true">
      <span className="hairline flex-1" /> or <span className="hairline flex-1" />
    </div>
  );
}
