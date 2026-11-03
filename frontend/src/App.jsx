import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import CommandPalette from './components/common/CommandPalette';
import VoiceAccess from './components/common/VoiceAccess';
import FloatingNav from './components/common/FloatingNav';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScreenBackground from './components/common/ScreenBackground';
import CustomCursor from './components/scrollytelling/CustomCursor';
import { USER_ROLES } from './navigation/routeRegistry';

// Lazy-loaded Background 3D Canvas
const CinematicParticleCanvas = lazy(() => import('./components/common/CinematicParticleCanvas'));

// Lazy-loaded Public Pages
const Splash = lazy(() => import('./pages/public/Splash'));
const Onboarding = lazy(() => import('./pages/public/Onboarding'));
const Landing = lazy(() => import('./pages/public/Landing'));
const Privacy = lazy(() => import('./pages/public/Privacy'));
const Terms = lazy(() => import('./pages/public/Terms'));
const Help = lazy(() => import('./pages/public/Help'));
const About = lazy(() => import('./pages/public/About'));
const VocabularyExplorer = lazy(() => import('./pages/public/VocabularyExplorer'));
const ArchitectureSpecs = lazy(() => import('./pages/public/ArchitectureSpecs'));

// Lazy-loaded Auth Pages
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const Registration = lazy(() => import('./pages/auth/Registration'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const EmailVerification = lazy(() => import('./pages/auth/EmailVerification'));

// Lazy-loaded Citizen Pages
const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'));
const UserProfile = lazy(() => import('./pages/citizen/UserProfile'));
const Settings = lazy(() => import('./pages/citizen/Settings'));

// Lazy-loaded Translation Pages (Three.js 3D Avatar Rendering & MediaPipe Vision)
const TextToSign = lazy(() => import('./pages/translation/TextToSign'));
const SignToText = lazy(() => import('./pages/translation/SignToText'));

// Lazy-loaded Communication Pages
const RealTimeConversation = lazy(() => import('./pages/communication/RealTimeConversation'));
const ConversationHistory = lazy(() => import('./pages/communication/ConversationHistory'));
const ConversationDetail = lazy(() => import('./pages/communication/ConversationDetail'));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration'));
const AdminFlaggedContent = lazy(() => import('./pages/admin/AdminFlaggedContent'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserRestrictions = lazy(() => import('./pages/admin/AdminUserRestrictions'));
const AdminAuditRecords = lazy(() => import('./pages/admin/AdminAuditRecords'));
const AdminTelemetry = lazy(() => import('./pages/admin/AdminTelemetry'));
const AdminServiceConfig = lazy(() => import('./pages/admin/AdminServiceConfig'));

// Lazy-loaded System Supporting Screens
const AccountRestricted = lazy(() => import('./pages/system/AccountRestricted'));
const Unauthorized = lazy(() => import('./pages/system/Unauthorized'));
const NotFound404 = lazy(() => import('./pages/system/NotFound404'));
const ServerError500 = lazy(() => import('./pages/system/ServerError500'));
const NoInternet = lazy(() => import('./pages/system/NoInternet'));
const Maintenance = lazy(() => import('./pages/system/Maintenance'));
const CameraPermission = lazy(() => import('./pages/system/CameraPermission'));
const MicrophonePermission = lazy(() => import('./pages/system/MicrophonePermission'));

// Lazy-loaded Developer Testing (Avatar Test Module)
const AvatarTestingPage = lazy(() => import('./pages/developer/AvatarTestingPage'));

/**
 * Cardless Route-Level Suspense Fallback Loader
 * Adheres strictly to the cardless design language: fluid, borderless, brand-color ambient glow.
 */
function RouteLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page module"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        width: '100%',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'transparent'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2.5px solid var(--border)',
            borderTopColor: 'var(--brand-coral)',
            borderRightColor: 'var(--brand-blue)',
            animation: 'spin 0.9s linear infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: 'var(--brand-gold)',
            animation: 'spin 1.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite reverse'
          }}
        />
      </div>
      <div
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)'
        }}
      >
        Loading Signora Module
      </div>
      <div
        style={{
          marginTop: '0.35rem',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        }}
      >
        Vibrant Connections Through Language Colors
      </div>
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    // Non-blocking silent background preloading task for 3D humanoid avatar models
    import('./avatar/core/MixamoBotAvatar')
      .then((mod) => {
        if (typeof mod.preloadAvatarModels === 'function') {
          return mod.preloadAvatarModels();
        }
      })
      .catch((err) => console.debug('Background avatar preloading:', err));
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              {/* Global background video for every screen other than landing page */}
              <ScreenBackground />

              {/* Global cinematic particle field (160,000+ particles, GPU GLSL curl noise) across all screens */}
              <Suspense fallback={null}>
                <CinematicParticleCanvas />
              </Suspense>

              {/* Global navigation shortcuts, floating bottom dock & speech access */}
              <CommandPalette />
              <VoiceAccess />
              <FloatingNav />

              {/* Global luxury interactive mouse tail across all client screens */}
              <CustomCursor />

              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  {/* Public & Informational Routes (SRS 1.3 & 18) */}
                  <Route path="/" element={<Splash />} />
                  <Route path="/splash" element={<Splash />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/home" element={<Landing />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/privacy-policy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/vocabulary-explorer" element={<VocabularyExplorer />} />
                  <Route path="/architecture-specs" element={<ArchitectureSpecs />} />
                  <Route path="/avatar-test" element={<AvatarTestingPage />} />

                  {/* Authentication Routes (SRS 7.1 - 7.5) */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<EmailVerification />} />

                  {/* Citizen Authenticated Routes (SRS 8, 9, 10, 11, 12, 13, 14) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CitizenDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/dashboard"
                    element={
                      <ProtectedRoute>
                        <CitizenDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/text-to-sign"
                    element={
                      <ProtectedRoute>
                        <TextToSign />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/text-to-sign"
                    element={
                      <ProtectedRoute>
                        <TextToSign />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/sign-to-text"
                    element={
                      <ProtectedRoute>
                        <SignToText />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/sign-to-text"
                    element={
                      <ProtectedRoute>
                        <SignToText />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/conversation"
                    element={
                      <ProtectedRoute>
                        <RealTimeConversation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/real-time-conversation"
                    element={
                      <ProtectedRoute>
                        <RealTimeConversation />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <ConversationHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/history"
                    element={
                      <ProtectedRoute>
                        <ConversationHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history/:conversationId"
                    element={
                      <ProtectedRoute>
                        <ConversationDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/history/:conversationId"
                    element={
                      <ProtectedRoute>
                        <ConversationDetail />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/app/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Administrator Protected Routes (SRS 15) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/moderation"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminModeration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/flagged-content"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminFlaggedContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/restrictions"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminUserRestrictions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/audit"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminAuditRecords />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/audit-logs"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminAuditRecords />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/telemetry"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminTelemetry />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/service-config"
                    element={
                      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                        <AdminServiceConfig />
                      </ProtectedRoute>
                    }
                  />

                  {/* System Supporting Screens (SRS 16) */}
                  <Route path="/account-restricted" element={<AccountRestricted />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/500" element={<ServerError500 />} />
                  <Route path="/no-internet" element={<NoInternet />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/camera-permission" element={<CameraPermission />} />
                  <Route path="/microphone-permission" element={<MicrophonePermission />} />
                  <Route path="/404" element={<NotFound404 />} />

                  {/* Fallback to 404 per SRS 16.3 */}
                  <Route path="*" element={<NotFound404 />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
