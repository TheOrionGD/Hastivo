/**
 * Hastivo — Environment Configuration
 * All VITE_ variables are publicly exposed to the browser bundle.
 * Private credentials must never appear here.
 */

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || null,
  wsUrl:      import.meta.env.VITE_WS_URL || null,
  appEnv:     import.meta.env.VITE_APP_ENV || 'development',

  firebase: {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || null,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || null,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || null,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || null,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID || null,
  },

  isConfigured: {
    api:      !!import.meta.env.VITE_API_BASE_URL,
    ws:       !!import.meta.env.VITE_WS_URL,
    firebase: !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    ),
  },
};

export default config;
