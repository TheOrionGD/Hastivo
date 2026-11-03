import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { matchRouteCommand } from '../../navigation/routeRegistry';
import { speechService, SpeechServiceStatus } from '../../services/speechService';

export default function VoiceAccess() {
  const { isAuthenticated, role } = useAuth();
  const { notifyAmber, notifyCoralError, notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [lifecycleState, setLifecycleState] = useState('READY'); // READY, REQUESTING_PERMISSION, LISTENING, PROCESSING, COMMAND_RECOGNIZED, NAVIGATING, ERROR, UNSUPPORTED
  const [transcript, setTranscript] = useState('');
  const [interpretation, setInterpretation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Micro-particles for the floating button
  const particles = [
    { id: 1, top: '-6px', left: '12px', delay: '0s' },
    { id: 2, top: '10px', right: '-8px', delay: '0.4s' },
    { id: 3, bottom: '-4px', left: '20px', delay: '0.8s' },
    { id: 4, top: '24px', left: '-6px', delay: '1.2s' },
  ];

  const handleClose = () => {
    speechService.stopListening();
    setIsOpen(false);
    setLifecycleState('READY');
    setTranscript('');
    setInterpretation(null);
    setErrorMessage('');
  };

  // If user signs out while voice access is active, stop listening immediately
  useEffect(() => {
    if (!isAuthenticated) {
      speechService.stopListening();
    }
  }, [isAuthenticated]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      speechService.stopListening();
    };
  }, []);

  if (!isAuthenticated) {
    return null; // Hidden before successful login
  }

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTranscript('');
    setInterpretation(null);
    setErrorMessage('');
    startSpeechCapture();
  };

  const startSpeechCapture = async () => {
    setLifecycleState('REQUESTING_PERMISSION');
    setErrorMessage('');

    await speechService.startListening({
      onTranscript: ({ transcript: text, isFinal }) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setLifecycleState('PROCESSING');
          processVoiceCommand(text.trim());
        }
      },
      onError: (err) => {
        setLifecycleState('ERROR');
        setErrorMessage(err);
      },
      onStatusChange: (status, detail) => {
        if (status === SpeechServiceStatus.LISTENING) {
          setLifecycleState('LISTENING');
        } else if (status === SpeechServiceStatus.UNSUPPORTED) {
          setLifecycleState('UNSUPPORTED');
          setErrorMessage(detail || 'Speech recognition is unsupported on this platform.');
        } else if (status === SpeechServiceStatus.ERROR) {
          setLifecycleState('ERROR');
          setErrorMessage(detail || 'Microphone error occurred.');
        }
      },
    });
  };

  const processVoiceCommand = (commandText) => {
    const result = matchRouteCommand(commandText, role);

    if (result.unauthorized) {
      setLifecycleState('ERROR');
      const msg = 'You do not have permission to access this destination.';
      setErrorMessage(msg);
      notifyCoralError('Voice Navigation Rejected', msg);
      speechService.stopListening();
      return;
    }

    if (result.notFound || !result.success) {
      setLifecycleState('ERROR');
      const msg = `Unrecognized destination: "${commandText}". Please try "Go to Dashboard" or "Open Text-to-Sign".`;
      setErrorMessage(msg);
      notifyAmber('Command Not Recognized', msg);
      speechService.stopListening();
      return;
    }

    // Command recognized and authorized!
    setLifecycleState('COMMAND_RECOGNIZED');
    setInterpretation(result.route);

    setTimeout(() => {
      setLifecycleState('NAVIGATING');
      notifySuccess('Navigating via Voice', `Opening ${result.route.label}`);
      speechService.stopListening();
      setIsOpen(false);
      navigate(result.route.path);
    }, 900);
  };

  const isListening = lifecycleState === 'LISTENING';
  const isProcessing = lifecycleState === 'PROCESSING';

  return (
    <>
      {/* ── Persistent Floating Voice Button (Bottom-Left) ──────── */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '28px',
          zIndex: 9999,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Contextual Pop-up Hint */}
        {showTooltip && !isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '68px',
              left: '0',
              whiteSpace: 'nowrap',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid var(--border)',
              pointerEvents: 'none',
              animation: 'fadeInUp 0.15s ease-out',
            }}
          >
            Voice Navigation (Click to speak)
          </div>
        )}

        {/* Ambient Decorative Particles */}
        {!isOpen &&
          particles.map((p) => (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                top: p.top,
                bottom: p.bottom,
                left: p.left,
                right: p.right,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--color-blue)',
                opacity: 0.6,
                pointerEvents: 'none',
                animation: `pulse 2s infinite ease-in-out ${p.delay}`,
              }}
            />
          ))}

        {/* Floating Button Main */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? 'Close voice navigation' : 'Open voice navigation'}
          aria-expanded={isOpen}
          className="focus-ring"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isListening
              ? 'var(--color-coral)'
              : isOpen
              ? 'var(--color-charcoal)'
              : 'var(--color-coral)',
            color: '#fff',
            border: isListening
              ? '2px solid #fff'
              : '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: isListening
              ? 'var(--coral-glow), 0 6px 20px rgba(0,0,0,0.3)'
              : 'var(--shadow-lg), 0 0 16px rgba(255,111,97,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s',
            animation: !isOpen ? 'float 4s ease-in-out infinite' : 'none',
          }}
        >
          {isOpen ? (
            // Close 'X' icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Microphone icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Compact Voice Command Container ───────────────────────── */}
      {isOpen && (
        <div
          role="region"
          aria-label="Voice Navigation Assistant"
          style={{
            position: 'fixed',
            bottom: '94px',
            left: '28px',
            zIndex: 9999,
            width: '360px',
            maxWidth: 'calc(100vw - 48px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-overlay)',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isListening
                    ? 'var(--color-coral)'
                    : isProcessing
                    ? 'var(--color-amber)'
                    : lifecycleState === 'COMMAND_RECOGNIZED'
                    ? 'var(--color-blue)'
                    : 'var(--color-grey)',
                  animation: isListening ? 'pulse 1s infinite' : 'none',
                }}
              />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Voice Navigation
              </strong>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: isListening ? 'var(--color-coral)' : 'var(--text-muted)',
              }}
            >
              {lifecycleState}
            </span>
          </div>

          {/* Content Body */}
          <div style={{ padding: '18px' }}>
            {/* Listening Graphic indicator */}
            {isListening && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  height: '32px',
                  marginBottom: '14px',
                }}
              >
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    style={{
                      width: '4px',
                      height: `${12 + (bar % 3) * 10}px`,
                      background: 'var(--color-coral)',
                      borderRadius: '2px',
                      animation: `pulse 0.7s infinite ease-in-out ${bar * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Live Transcript / Prompt */}
            <div
              style={{
                minHeight: '48px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.9rem',
                color: transcript ? 'var(--text-primary)' : 'var(--text-muted)',
                fontStyle: transcript ? 'normal' : 'italic',
                marginBottom: '12px',
                wordBreak: 'break-word',
              }}
            >
              {transcript
                ? `"${transcript}"`
                : isListening
                ? 'Listening for command... (e.g., "Navigate to Text-to-Sign")'
                : 'Microphone ready.'}
            </div>

            {/* Interpreted Destination feedback */}
            {interpretation && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(111,163,239,0.15)',
                  border: '1px solid var(--color-blue)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                Target: <strong>{interpretation.label}</strong> ({interpretation.path})
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,111,97,0.15)',
                  border: '1px solid var(--color-coral)',
                  fontSize: '0.85rem',
                  color: 'var(--color-coral-dark)',
                  marginBottom: '12px',
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Quick Suggestions / Instructions */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Try saying:
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                <span
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}
                >
                  "Go to Dashboard"
                </span>
                <span
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}
                >
                  "Open Text-to-Sign"
                </span>
                <span
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}
                >
                  "Open Sign-to-Text"
                </span>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div
            style={{
              padding: '10px 18px',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isListening ? (
              <button
                onClick={() => speechService.stopListening()}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                Pause Listening
              </button>
            ) : (
              <button
                onClick={startSpeechCapture}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                Resume Mic
              </button>
            )}

            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
