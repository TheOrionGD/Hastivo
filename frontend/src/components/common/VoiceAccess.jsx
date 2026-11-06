import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { matchRouteCommand } from '../../navigation/routeRegistry';
import { speechService, SpeechServiceStatus } from '../../services/speechService';
import { VisionRecognitionEngine, HAND_CONNECTIONS } from '../../services/visionRecognitionEngine';

/**
 * Hastivo — Dual Access Navigation (Voice & Sign Language Gesture Access)
 * 
 * Floating bottom-left hub:
 * - Persistent floating toggle button.
 * - When opened, presents a dual modality hub:
 *     1. LEFT: Voice Navigation (Speech Recognition -> Route Match)
 *     2. RIGHT: Sign Language Navigation (Live Camera -> MediaPipe Gesture Match)
 * - Sign Navigation includes:
 *     - Live camera view with overlaid skeletal hand landmarks.
 *     - Real-time gesture recommendations / cheat-sheet for deaf/hard-of-hearing signers.
 *     - Visual feedback and progress countdown before instant navigation.
 */

// Supported Navigation Gestures and Target Routes
const SIGN_COMMAND_ROUTES = [
  {
    gesture: 'HELLO',
    handShape: 'Open 5 Palm',
    icon: '👋',
    label: 'Citizen Dashboard',
    path: '/dashboard',
    desc: 'Perform Open Palm / Hello',
    color: 'var(--color-coral, #FF6F61)',
  },
  {
    gesture: '1',
    handShape: 'Index Upright',
    icon: '☝️',
    label: 'Text-to-Sign',
    path: '/text-to-sign',
    desc: 'Hold Digit 1 (Index Finger)',
    color: 'var(--color-coral, #FF6F61)',
  },
  {
    gesture: 'V',
    handShape: 'Victory / 2 Fingers',
    icon: '✌️',
    label: 'Sign-to-Text',
    path: '/sign-to-text',
    desc: 'Hold Peace / Letter V',
    color: 'var(--color-blue, #6FA3EF)',
  },
  {
    gesture: 'WATER',
    handShape: 'W Shape (3 Fingers)',
    icon: '🤟',
    label: 'Real-Time Duplex',
    path: '/conversation',
    desc: 'Hold 3 Fingers Up (W for Water)',
    color: 'var(--color-amber, #FFC107)',
  },
  {
    gesture: 'L',
    handShape: 'L Shape (Thumb & Index)',
    icon: '👆',
    label: 'Conversation History',
    path: '/history',
    desc: 'Hold Letter L (Thumb + Index)',
    color: 'var(--color-blue-light, #9dc4f5)',
  },
  {
    gesture: 'Y',
    handShape: 'Shaka (Thumb + Pinky)',
    icon: '🤙',
    label: 'User Profile',
    path: '/profile',
    desc: 'Hold Letter Y / Shaka',
    color: 'var(--color-amber-light, #ffcf3d)',
  },
  {
    gesture: 'YES',
    handShape: 'Thumbs-Up',
    icon: '👍',
    label: 'Settings',
    path: '/settings',
    desc: 'Give Thumbs-Up Affirmative',
    color: '#10B981',
  },
];

export default function VoiceAccess() {
  const { isAuthenticated, role } = useAuth();
  const { notifyAmber, notifyCoralError, notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('menu'); // 'menu' | 'voice' | 'sign'
  const [showTooltip, setShowTooltip] = useState(false);

  // --- Voice Navigation State ---
  const [voiceState, setVoiceState] = useState('READY'); // READY, REQUESTING_PERMISSION, LISTENING, PROCESSING, COMMAND_RECOGNIZED, NAVIGATING, ERROR
  const [transcript, setTranscript] = useState('');
  const [voiceInterpretation, setVoiceInterpretation] = useState(null);
  const [voiceErrorMessage, setVoiceErrorMessage] = useState('');

  // --- Sign Navigation State ---
  const [cameraState, setCameraState] = useState('NOT_REQUESTED'); // NOT_REQUESTED, REQUESTING, ACTIVE, DENIED, ERROR
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [signHoldProgress, setSignHoldProgress] = useState(0); // 0 to 100%
  const [targetRoute, setTargetRoute] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const visionEngineRef = useRef(null);
  const holdCounterRef = useRef(0);
  const lastGestureRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setCameraState('NOT_REQUESTED');
  };

  const handleClose = () => {
    speechService.stopListening();
    stopCamera();
    setIsOpen(false);
    setActiveMode('menu');
    setVoiceState('READY');
    setTranscript('');
    setVoiceInterpretation(null);
    setVoiceErrorMessage('');
    setDetectedGesture(null);
    setSignHoldProgress(0);
    setTargetRoute(null);
  };

  // Cleanup on unmount or authentication changes
  useEffect(() => {
    return () => {
      speechService.stopListening();
      stopCamera();
      if (visionEngineRef.current) {
        visionEngineRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      handleClose();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      setActiveMode('menu');
    }
  };

  // ==========================================
  // VOICE NAVIGATION LOGIC
  // ==========================================
  const startVoiceMode = async () => {
    setActiveMode('voice');
    stopCamera();
    setVoiceState('REQUESTING_PERMISSION');
    setTranscript('');
    setVoiceInterpretation(null);
    setVoiceErrorMessage('');

    await speechService.startListening({
      onTranscript: ({ transcript: text, isFinal }) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setVoiceState('PROCESSING');
          processVoiceCommand(text.trim());
        }
      },
      onError: (err) => {
        setVoiceState('ERROR');
        setVoiceErrorMessage(err);
      },
      onStatusChange: (status, detail) => {
        if (status === SpeechServiceStatus.LISTENING) {
          setVoiceState('LISTENING');
        } else if (status === SpeechServiceStatus.UNSUPPORTED) {
          setVoiceState('ERROR');
          setVoiceErrorMessage(detail || 'Speech recognition unsupported on this device.');
        } else if (status === SpeechServiceStatus.ERROR) {
          setVoiceState('ERROR');
          setVoiceErrorMessage(detail || 'Microphone error occurred.');
        }
      },
    });
  };

  const processVoiceCommand = (commandText) => {
    const result = matchRouteCommand(commandText, role);

    if (result.unauthorized) {
      setVoiceState('ERROR');
      const msg = 'Permission denied for this destination.';
      setVoiceErrorMessage(msg);
      notifyCoralError('Voice Navigation Rejected', msg);
      speechService.stopListening();
      return;
    }

    if (result.notFound || !result.success) {
      setVoiceState('ERROR');
      const msg = `Unrecognized destination: "${commandText}". Try "Go to Dashboard" or "Open Text to Sign".`;
      setVoiceErrorMessage(msg);
      notifyAmber('Command Not Recognized', msg);
      speechService.stopListening();
      return;
    }

    setVoiceState('COMMAND_RECOGNIZED');
    setVoiceInterpretation(result.route);

    setTimeout(() => {
      setVoiceState('NAVIGATING');
      notifySuccess('Navigating via Voice', `Opening ${result.route.label}`);
      speechService.stopListening();
      handleClose();
      navigate(result.route.path);
    }, 900);
  };

  // ==========================================
  // SIGN LANGUAGE NAVIGATION LOGIC
  // ==========================================
  const startSignMode = async () => {
    setActiveMode('sign');
    speechService.stopListening();
    setCameraState('REQUESTING');
    setDetectedGesture(null);
    setSignHoldProgress(0);
    setTargetRoute(null);
    holdCounterRef.current = 0;

    // Initialize Vision Engine if not ready
    if (!visionEngineRef.current) {
      const engine = new VisionRecognitionEngine({
        minStableFrames: 5,
        tokenDebounceMs: 1000,
        onError: (err) => {
          notifyCoralError('Vision Engine Notice', err.message);
        },
      });
      await engine.initialize();
      visionEngineRef.current = engine;
    }

    // Request Webcam Stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraState('ACTIVE');
          startRecognitionLoop();
        };
      }
    } catch {
      setCameraState('DENIED');
      notifyCoralError('Camera Blocked', 'Camera permission is required for sign language navigation.');
    }
  };

  const startRecognitionLoop = () => {
    const loop = () => {
      if (!videoRef.current || videoRef.current.readyState < 2 || !visionEngineRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const engine = visionEngineRef.current;

      const result = engine.processVideoFrame(video, performance.now());

      if (canvas && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Skeletal Hand Landmarks
        if (result?.landmarks && result.landmarks.length > 0) {
          result.landmarks.forEach((handLm) => {
            // Draw Connections
            ctx.strokeStyle = '#6FA3EF';
            ctx.lineWidth = 3;
            HAND_CONNECTIONS.forEach(([i1, i2]) => {
              const p1 = handLm[i1];
              const p2 = handLm[i2];
              if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.stroke();
              }
            });

            // Draw Landmark Points
            ctx.fillStyle = '#FF6F61';
            handLm.forEach((pt) => {
              ctx.beginPath();
              ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fill();
            });
          });
        }
      }

      // Check Gesture Match Against Navigation Routes
      if (result?.activeGesture?.label) {
        const gestureLabel = result.activeGesture.label;
        setDetectedGesture(result.activeGesture);

        // Match with route command
        const matchedRoute = SIGN_COMMAND_ROUTES.find((r) => r.gesture === gestureLabel);

        if (matchedRoute) {
          if (lastGestureRef.current === gestureLabel) {
            holdCounterRef.current += 1;
          } else {
            lastGestureRef.current = gestureLabel;
            holdCounterRef.current = 1;
          }

          // Need ~18 consecutive frames (about 0.6 seconds hold)
          const REQUIRED_FRAMES = 18;
          const progress = Math.min(100, Math.round((holdCounterRef.current / REQUIRED_FRAMES) * 100));
          setSignHoldProgress(progress);
          setTargetRoute(matchedRoute);

          if (holdCounterRef.current >= REQUIRED_FRAMES) {
            // Successfully held! Execute navigation
            notifySuccess('Sign Command Recognized', `Navigating to ${matchedRoute.label}`);
            stopCamera();
            handleClose();
            navigate(matchedRoute.path);
            return;
          }
        } else {
          lastGestureRef.current = null;
          holdCounterRef.current = 0;
          setSignHoldProgress(0);
          setTargetRoute(null);
        }
      } else {
        lastGestureRef.current = null;
        holdCounterRef.current = 0;
        setSignHoldProgress(0);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  return (
    <>
      {/* ── Floating Dual-Modal FAB (Bottom-Left) ────────────────── */}
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
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '68px',
              left: '0',
              whiteSpace: 'nowrap',
              background: 'var(--surface-elevated, #1E2229)',
              color: 'var(--text-primary)',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600,
              border: '1px solid var(--border)',
              pointerEvents: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            [ ASSISTIVE ACCESS: VOICE & SIGN ]
          </div>
        )}

        {/* Dual Access FAB Button */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? 'Close Assistive Access' : 'Open Assistive Access (Voice & Sign)'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isOpen
              ? 'var(--color-charcoal, #2E2E2E)'
              : 'linear-gradient(135deg, var(--color-coral, #FF6F61) 0%, var(--color-blue, #6FA3EF) 100%)',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s',
          }}
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {/* Mic Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
              {/* Hand Icon */}
              <span style={{ fontSize: '13px' }}>✋</span>
            </div>
          )}
        </button>
      </div>

      {/* ── Cardless Dual Modality Modal / Flyout ─────────────────── */}
      {isOpen && (
        <div
          role="region"
          aria-label="Assistive Navigation Portal"
          style={{
            position: 'fixed',
            bottom: '96px',
            left: '28px',
            zIndex: 9999,
            width: activeMode === 'sign' ? '520px' : activeMode === 'voice' ? '400px' : '460px',
            maxWidth: 'calc(100vw - 48px)',
            background: 'var(--surface-elevated, #17191E)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
            transition: 'width 0.25s ease',
          }}
        >
          {/* Header Strip with Mode Switchers */}
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
              background: 'var(--background-secondary, #1E2229)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: activeMode === 'sign' ? 'var(--color-blue)' : activeMode === 'voice' ? 'var(--color-coral)' : '#10B981',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                }}
              >
                ASSISTIVE ACCESS LATTICE
              </span>
            </div>

            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* MODE 1: DUAL COMPONENT SELECTION MENU                    */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeMode === 'menu' && (
            <div style={{ padding: '24px 20px' }}>
              <p
                style={{
                  margin: '0 0 20px',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                Select your preferred assistive navigation mode to navigate pages hands-free or via Indian Sign Language:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                {/* Left Side: Voice Access */}
                <button
                  type="button"
                  onClick={startVoiceMode}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px',
                    borderRadius: '4px',
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle, var(--border))',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-coral)';
                    e.currentTarget.style.background = 'rgba(255, 111, 97, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle, var(--border))';
                    e.currentTarget.style.background = 'var(--background-secondary)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255, 111, 97, 0.15)',
                      color: 'var(--color-coral)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Voice Navigation
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Dictate commands via microphone
                  </span>
                </button>

                {/* Right Side: Sign Language Access */}
                <button
                  type="button"
                  onClick={startSignMode}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px',
                    borderRadius: '4px',
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle, var(--border))',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-blue)';
                    e.currentTarget.style.background = 'rgba(111, 163, 239, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle, var(--border))';
                    e.currentTarget.style.background = 'var(--background-secondary)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(111, 163, 239, 0.15)',
                      color: 'var(--color-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      fontSize: '22px',
                    }}
                  >
                    ✋
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Sign Language Navigation
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Perform hand signs in camera
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* MODE 2: VOICE ASSISTANT VIEW                             */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeMode === 'voice' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-coral)', textTransform: 'uppercase' }}>
                  [ MICROPHONE STATUS: {voiceState} ]
                </span>
                <button
                  onClick={() => setActiveMode('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-blue)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  &larr; Switch Mode
                </button>
              </div>

              {/* Live Transcript Box */}
              <div
                style={{
                  minHeight: '52px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border-subtle, var(--border))',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  fontSize: '0.92rem',
                  color: transcript ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontStyle: transcript ? 'normal' : 'italic',
                  marginBottom: '14px',
                }}
              >
                {transcript ? `"${transcript}"` : voiceState === 'LISTENING' ? 'Listening for command (e.g. "Go to Dashboard")...' : 'Ready.'}
              </div>

              {/* Interpreted Destination feedback */}
              {voiceInterpretation && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(111,163,239,0.12)',
                    border: '1px solid var(--color-blue)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    marginBottom: '14px',
                  }}
                >
                  Navigating to: <strong>{voiceInterpretation.label}</strong> ({voiceInterpretation.path})
                </div>
              )}

              {/* Error Message */}
              {voiceErrorMessage && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255,111,97,0.12)',
                    border: '1px solid var(--color-coral)',
                    fontSize: '0.85rem',
                    color: 'var(--color-coral)',
                    marginBottom: '14px',
                  }}
                >
                  {voiceErrorMessage}
                </div>
              )}

              {/* Quick Suggestions */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Try saying:
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {['"Dashboard"', '"Text-to-Sign"', '"Sign-to-Text"', '"History"', '"Settings"'].map((phrase) => (
                    <span
                      key={phrase}
                      style={{
                        background: 'var(--background-secondary)',
                        padding: '2px 8px',
                        borderRadius: '2px',
                        border: '1px solid var(--border-subtle, var(--border))',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* MODE 3: SIGN LANGUAGE GESTURE CAMERA VIEW                */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeMode === 'sign' && (
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-blue)', textTransform: 'uppercase' }}>
                  [ VISION HUD: {cameraState} ]
                </span>
                <button
                  onClick={() => {
                    stopCamera();
                    setActiveMode('menu');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-coral)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  &larr; Switch Mode
                </button>
              </div>

              {/* Camera Video & Canvas HUD */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  background: '#090C12',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle, var(--border))',
                  marginBottom: '16px',
                }}
              >
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Mirrored selfie perspective
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'scaleX(-1)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Overlaid Active Detection Badge */}
                {detectedGesture?.label && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '4px 10px',
                      background: 'rgba(23, 25, 30, 0.9)',
                      border: '1px solid var(--color-blue)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-blue)',
                    }}
                  >
                    DETECTED: {detectedGesture.label} ({Math.round((detectedGesture.confidence || 0.9) * 100)}%)
                  </div>
                )}

                {/* Target Route Confirmation & Hold Progress */}
                {targetRoute && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.92)',
                      border: `1.5px solid ${targetRoute.color}`,
                      borderRadius: '4px',
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{targetRoute.icon}</span>
                        <strong style={{ fontSize: '0.9rem', color: '#fff' }}>
                          Hold for {targetRoute.label}...
                        </strong>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: targetRoute.color, fontWeight: 700 }}>
                        {signHoldProgress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${signHoldProgress}%`,
                          height: '100%',
                          background: targetRoute.color,
                          transition: 'width 0.1s linear',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Hand Signs Cheat-Sheet for Signers */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  [ SIGN NAVIGATION GUIDE — HOLD TO JUMP ]
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '8px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {SIGN_COMMAND_ROUTES.map((cmd) => {
                    const isMatched = detectedGesture?.label === cmd.gesture;
                    return (
                      <div
                        key={cmd.gesture}
                        onClick={() => setSelectedRecommendation(cmd)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '4px',
                          background: isMatched ? 'rgba(111, 163, 239, 0.15)' : 'var(--background-secondary)',
                          border: isMatched ? `1.5px solid ${cmd.color}` : '1px solid var(--border-subtle, var(--border))',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{cmd.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {cmd.label}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: cmd.color }}>
                            {cmd.handShape}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
