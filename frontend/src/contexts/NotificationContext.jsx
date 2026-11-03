import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ type = 'info', title, message, duration = 5000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newNotif = { id, type, title, message };

      setNotifications((prev) => [...prev, newNotif]);

      if (duration > 0) {
        setTimeout(() => {
          dismissNotification(id);
        }, duration);
      }
      return id;
    },
    [dismissNotification]
  );

  const notifyAmber = useCallback((title, message, duration) => {
    return addNotification({ type: 'warning', title, message, duration });
  }, [addNotification]);

  const notifyCoralError = useCallback((title, message, duration) => {
    return addNotification({ type: 'error', title, message, duration });
  }, [addNotification]);

  const notifySuccess = useCallback((title, message, duration) => {
    return addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        dismissNotification,
        notifyAmber,
        notifyCoralError,
        notifySuccess,
      }}
    >
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
      >
        {notifications.map((notif) => {
          const isError = notif.type === 'error';
          const isWarning = notif.type === 'warning';
          const borderColor = isError
            ? 'var(--color-coral)'
            : isWarning
            ? 'var(--color-amber)'
            : 'var(--color-blue)';
          const bgGlow = isError
            ? 'var(--coral-glow)'
            : isWarning
            ? 'var(--amber-glow)'
            : 'var(--blue-glow)';

          return (
            <div
              key={notif.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: bgGlow,
                borderRadius: 'var(--radius-control)',
                padding: '14px 18px',
                animation: 'slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: borderColor,
                      display: 'inline-block',
                    }}
                  />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {notif.title || (isError ? 'Error' : isWarning ? 'Notice' : 'Information')}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {notif.message}
                </p>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  padding: '2px 4px',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
