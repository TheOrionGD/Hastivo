// Firebase guest authentication. The web configuration is public app config,
// not a service credential; it is supplied through VITE_FIREBASE_* variables.
const REQUIRED_CONFIG = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

const OPTIONAL_CONFIG = {
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
};

export function readFirebaseConfig(env = import.meta.env) {
  const config = {};
  for (const [key, variable] of [
    ...Object.entries(REQUIRED_CONFIG),
    ...Object.entries(OPTIONAL_CONFIG),
  ]) {
    const value = env?.[variable]?.trim();
    if (value) config[key] = value;
  }
  return config;
}

export function getMissingFirebaseConfig(env = import.meta.env) {
  return Object.entries(REQUIRED_CONFIG)
    .filter(([, variable]) => !env?.[variable]?.trim())
    .map(([, variable]) => variable);
}

export function isFirebaseConfigured(env = import.meta.env) {
  return getMissingFirebaseConfig(env).length === 0;
}

let firebasePromise;

function loadFirebase() {
  if (!isFirebaseConfigured()) {
    const error = new Error(
      "Anonymous sign-in needs the Firebase web configuration before it can be used.",
    );
    error.code = "hastivo/firebase-not-configured";
    throw error;
  }

  if (!firebasePromise) {
    firebasePromise = (async () => {
      const [appSdk, authSdk] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
      ]);
      const app = appSdk.getApps()[0] || appSdk.initializeApp(readFirebaseConfig());
      const auth = authSdk.getAuth(app);
      await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);
      return { auth, authSdk };
    })();
    firebasePromise.catch(() => {
      // Allow a corrected configuration or a recovered network to retry.
      firebasePromise = undefined;
    });
  }

  return firebasePromise;
}

export async function signInAnonymously() {
  const { auth, authSdk } = await loadFirebase();
  return authSdk.signInAnonymously(auth);
}

export async function signOutAnonymous() {
  const { auth, authSdk } = await loadFirebase();
  if (auth.currentUser?.isAnonymous) await authSdk.signOut(auth);
}

export async function signOutFirebase() {
  const { auth, authSdk } = await loadFirebase();
  if (auth.currentUser) await authSdk.signOut(auth);
}

/**
 * Link email/password credentials to the current guest instead of creating a
 * replacement account. Firebase retains the UID and session, so data keyed by
 * that UID remains attached to the user after the upgrade.
 * The loader parameter keeps the identity-preservation rule directly testable.
 */
/**
 * Link Google OAuth credential or email/password credentials to the current guest.
 * Firebase retains the UID and session, and backend transfers all conversations
 * and usage data to the newly upgraded permanent account.
 */
export async function upgradeAnonymousAccountWithGoogle(loader = loadFirebase) {
  const { auth, authSdk } = await loader();
  const guest = auth.currentUser;
  if (!guest?.isAnonymous) {
    const error = new Error("An active guest session is required before upgrading.");
    error.code = "hastivo/not-anonymous";
    throw error;
  }

  const guestUid = guest.uid;
  const provider = new authSdk.GoogleAuthProvider();
  const result = await authSdk.linkWithPopup(guest, provider);

  if (!result.user || result.user.uid !== guestUid) {
    const error = new Error("Firebase did not preserve the guest account during Google upgrade.");
    error.code = "hastivo/upgrade-identity-mismatch";
    throw error;
  }

  // Notify backend to preserve and re-key all guest data in MongoDB
  await fetch("/api/v1/auth/guest-upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestId: guestUid,
      email: result.user.email,
      displayName: result.user.displayName,
      googleId: result.user.uid,
      firebaseUid: guestUid,
    }),
  }).catch(() => {});

  return result;
}

export async function upgradeAnonymousAccount({ email, password }, loader = loadFirebase) {
  const { auth, authSdk } = await loader();
  const guest = auth.currentUser;
  if (!guest?.isAnonymous) {
    const error = new Error("An active guest session is required before upgrading.");
    error.code = "hastivo/not-anonymous";
    throw error;
  }

  const guestUid = guest.uid;
  const credential = authSdk.EmailAuthProvider.credential(email.trim(), password);
  const result = await authSdk.linkWithCredential(guest, credential);
  if (!result.user || result.user.uid !== guestUid || result.user.isAnonymous) {
    const error = new Error("Firebase did not preserve the guest account during upgrade.");
    error.code = "hastivo/upgrade-identity-mismatch";
    throw error;
  }
  return result;
}

/** Subscribe to Firebase users, optionally limited to guests. Synchronous cleanup. */
export function observeFirebaseSession(onChange, { anonymousOnly = false } = {}) {
  let disposed = false;
  let unsubscribe = () => {};

  Promise.resolve()
    .then(loadFirebase)
    .then(({ auth, authSdk }) => {
      if (disposed) return;
      unsubscribe = authSdk.onAuthStateChanged(
        auth,
        (user) => onChange(anonymousOnly && !user?.isAnonymous ? null : user),
        () => onChange(null),
      );
    })
    .catch(() => {
      if (!disposed) onChange(null);
    });

  return () => {
    disposed = true;
    unsubscribe();
  };
}

export function observeAnonymousSession(onChange) {
  return observeFirebaseSession(onChange, { anonymousOnly: true });
}

export function friendlyAnonymousError(error) {
  const code = error?.code || "";
  if (code === "auth/admin-restricted-operation" || code === "auth/operation-not-allowed") {
    return "Anonymous sign-in is disabled in Firebase. Enable the Anonymous provider and try again.";
  }
  if (code === "auth/email-already-in-use" || code === "auth/credential-already-in-use") {
    return "That email already belongs to an account. Sign in to that account instead, or use another email.";
  }
  if (code === "auth/provider-already-linked") {
    return "This guest account already has email and password access.";
  }
  if (code === "auth/invalid-email") {
    return "Enter a valid email address, like name@example.com.";
  }
  if (code === "auth/weak-password") {
    return "This password doesn't meet Firebase's security requirements.";
  }
  if (code === "auth/requires-recent-login") {
    return "For security, Firebase needs a fresh guest session before this upgrade.";
  }
  if (code === "hastivo/not-anonymous") {
    return "No active guest session was found. Continue as a guest before upgrading.";
  }
  if (code === "hastivo/upgrade-identity-mismatch") {
    return "We couldn't verify that your guest identity was preserved. Please check your account before continuing.";
  }
  if (code === "auth/network-request-failed") {
    return "We couldn't reach Firebase. Check your connection and try again.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (
    code === "hastivo/firebase-not-configured" ||
    code.includes("configuration") ||
    code.includes("api-key")
  ) {
    return "Firebase isn't configured correctly yet. Check the web configuration and try again.";
  }
  return "We couldn't start your guest session. Please try again.";
}
