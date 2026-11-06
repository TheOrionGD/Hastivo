/**
 * Hastivo — Client Firebase Authentication Service
 * STRICT POLICY: Authentication ONLY.
 * No Firestore, No Realtime DB, No Firebase Storage.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import config from './env';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
};

// Initialize Firebase App instance safely (singleton)
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth Instance exclusively
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup and retrieve the Firebase ID token
 */
export async function authenticateWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    user: result.user,
    idToken,
  };
}

/**
 * Sign in with Email and Password and retrieve the Firebase ID token
 */
export async function authenticateWithEmailPassword(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return {
    user: result.user,
    idToken,
  };
}

/**
 * Register account with Email and Password and retrieve the Firebase ID token
 */
export async function registerWithEmailPassword(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return {
    user: result.user,
    idToken,
  };
}

/**
 * Sign out of Firebase Auth
 */
export async function terminateFirebaseAuth() {
  return await firebaseSignOut(auth);
}

/**
 * Get current user ID token
 */
export async function getFirebaseIdToken() {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(true);
}

export { onAuthStateChanged };
export default firebaseApp;

