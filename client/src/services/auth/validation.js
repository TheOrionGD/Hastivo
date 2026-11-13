// Client-side checks for fast feedback. The provider re-validates every request.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function validateEmail(v) {
  if (!v.trim()) return "Email address is required.";
  if (!EMAIL_RE.test(v.trim())) return "Enter a valid email address, like name@example.com.";
  return "";
}

export function validatePhone(v) {
  if (!v.trim()) return "Phone number is required.";
  if (!/^\+?[0-9\s()-]+$/.test(v)) return "Use digits, spaces, dashes and an optional leading +.";
  const digits = v.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Phone number should have 7 to 15 digits.";
  return "";
}

export function validateUsername(v) {
  if (!v.trim()) return "Username is required.";
  if (!USERNAME_RE.test(v)) return "3–20 characters: letters, numbers or underscores.";
  return "";
}

export const PASSWORD_RULES = [
  { id: "len", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    id: "case",
    label: "Upper and lower case letters",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { id: "num", label: "At least one number", test: (p) => /\d/.test(p) },
  { id: "sym", label: "At least one symbol", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function passwordScore(p) {
  return PASSWORD_RULES.filter((r) => r.test(p)).length;
}

export function validateNewPassword(p) {
  if (!p) return "Password is required.";
  const failed = PASSWORD_RULES.filter((r) => !r.test(p));
  if (failed.length)
    return `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
  return "";
}
