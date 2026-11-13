// Integration boundary for authentication connected to Hastivo backend & MongoDB.
// UI components call only these functions; passwords and credentials flow directly to the API.
import { sessionManager } from "./sessionManager";

const FRIENDLY = [
  [
    /invalid login credentials|invalid email\/username or password/i,
    "That email/username and password don't match an account.",
  ],
  [/email not confirmed/i, "Please confirm your email first — check your inbox for the link."],
  [
    /already registered|already been registered|user already exists|account with this email address already exists/i,
    "An account with this email already exists. Try signing in.",
  ],
  [/rate limit|too many/i, "Too many attempts. Please wait a moment and try again."],
  [
    /failed to fetch|network/i,
    "We couldn't reach the server. Check your connection and try again.",
  ],
  [
    /pwned|leaked|compromised/i,
    "This password has appeared in a data breach. Please choose another.",
  ],
  [
    /password should be|weak password|password must be at least/i,
    "This password doesn't meet the security requirements (min 8 characters).",
  ],
];

export function friendlyError(err) {
  const msg = err?.message || String(err || "");
  for (const [re, text] of FRIENDLY) if (re.test(msg)) return text;
  return msg || "Something went wrong. Please try again.";
}

export async function signIn({ email, password }) {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid email or password.");
  }

  sessionManager.setSession(data.token, data.user);
  return data;
}

export async function signUp({ email, password, fullName, username, phone }) {
  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      displayName: fullName,
      username: username?.toLowerCase(),
      phone,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create account.");
  }

  if (data.token) {
    sessionManager.setSession(data.token, data.user);
  }
  return data;
}

export async function isUsernameAvailable(username) {
  if (!username) return false;
  try {
    const res = await fetch(`/api/v1/auth/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return Boolean(data?.available);
  } catch {
    return true; // Fallback
  }
}

export async function signInWithGoogle() {
  // If backend Google OAuth redirect endpoint is configured
  if (typeof window !== "undefined") {
    window.location.href = "/api/v1/auth/google";
  }
}

export async function requestPasswordReset(email) {
  const res = await fetch("/api/v1/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to request password reset.");
  }
}

export async function updatePassword(password, token = "") {
  const res = await fetch("/api/v1/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword: password, token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update password.");
  }
}

export async function signOut() {
  const token = sessionManager.getToken();
  try {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {}
  sessionManager.clearSession();
}

export {
  friendlyAnonymousError,
  isFirebaseConfigured,
  observeAnonymousSession,
  observeFirebaseSession,
  signInAnonymously,
  signOutAnonymous,
  signOutFirebase,
  upgradeAnonymousAccount,
  upgradeAnonymousAccountWithGoogle,
} from "./firebaseAnonymousAuth";
