import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../navigation/routeRegistry';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto 16px' }} />
        <p>Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole === USER_ROLES.ADMIN && role !== USER_ROLES.ADMIN) {
    return (
      <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255,111,97,0.15)',
              color: 'var(--color-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            This destination requires verified administrator privileges. Your current role is <strong>{role}</strong>.
          </p>
          <a href="/dashboard" className="btn btn-primary btn-sm">
            Return to Citizen Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
