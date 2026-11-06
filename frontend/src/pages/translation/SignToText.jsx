import React, { useState, useEffect, useRef } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, CardlessBadge, CardlessButton } from '../../components/cardless/CardlessComponents';
import { translationService } from '../../services/translationService';
import { VisionRecognitionEngine, HAND_CONNECTIONS } from '../../services/visionRecognitionEngine';

/**
 * Hastivo — Sign-to-Text Vision Studio
 * 
 * Features:
 * - Direct MediaPipe Tasks-Vision integration via VisionRecognitionEngine.
 * - Normalized wrist-centered scale & handedness-invariant landmark processing.
 * - Hierarchical recognition (Alphabets A-Z, Digits 1-9, Core ISL word signs).
 * - Velocity-based Hold vs. Transition stability boundary detection (no repeated character flood).
 * - Live caption synthesis, confidence scoring, and browser-native Text-to-Speech playback.
 * - Toggleable developer telemetry & landmark inspection HUD.
 */
export default function SignToText() {
  const [cameraState, setCameraState] = useState('NOT_REQUESTED'); // NOT_REQUESTED | REQUESTING | GRANTED | DENIED | UNAVAILABLE
  const [isPaused, setIsPaused] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [_errorMessage, setErrorMessage] = useState('');

  // Recognition Results
  const [recognizedWords, setRecognizedWords] = useState([]);
  const [aiGeneratedSentence, setAiGeneratedSentence] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [activeGestureBanner, setActiveGestureBanner] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState(null);

  // Continuous Sequence Mode States
  const [continuousMode, setContinuousMode] = useState(true);
  const [motionEnergy, setMotionEnergy] = useState(0.0);
  const [isSignerPaused, setIsSignerPaused] = useState(false);
  const [continuousStatus, setContinuousStatus] = useState('Online — BiLSTM Temporal Tracker Active');

  // Text-to-Speech Settings
  const [voiceGender, setVoiceGender] = useState('female');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const engineRef = useRef(null);

  const { notifyCoralError, notifySuccess } = useNotification();

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraState('NOT_REQUESTED');
    setIsPaused(false);
    setActiveGestureBanner(null);
  };

  // Initialize VisionRecognitionEngine on mount
  useEffect(() => {
    const engine = new VisionRecognitionEngine({
      minStableFrames: 6,
      tokenDebounceMs: 1100,
      onReady: () => {
        console.log('VisionRecognitionEngine ready.');
      },
      onError: (err) => {
        notifyCoralError('Vision Engine Notice', err.message || 'MediaPipe fallback active.');
      }
    });

    engine.initialize();
    engineRef.current = engine;

    return () => {
      engine.dispose();
      stopCamera();
    };
  }, [notifyCoralError]);

  const processSignTranslation = async (glosses) => {
    if (!glosses || glosses.length === 0) {
      setAiGeneratedSentence('');
      setConfidenceScore(null);
      return;
    }
    try {
      const res = await translationService.translateSignToText(glosses);
      if (res) {
        if (res.sentence || res.synthesizedSentence || res.translatedText) {
          setAiGeneratedSentence(res.sentence || res.synthesizedSentence || res.translatedText);
        }
        if (res.confidence !== undefined && res.confidence !== null) {
          setConfidenceScore(res.confidence);
        }
      }
    } catch {
      // Local sentence synthesis fallback if backend is unreachable
      if (glosses.every((g) => g.length === 1 && /^[A-Z0-9]$/.test(g))) {
        setAiGeneratedSentence(glosses.join('').toLowerCase() + '.');
      } else {
        setAiGeneratedSentence(glosses.join(' ') + '.');
      }
    }
  };

  const handleAddSignToken = (token) => {
    setRecognizedWords((prev) => {
      const updated = [...prev, token];
      processSignTranslation(updated);
      return updated;
    });
  };

  const requestCameraAccess = async () => {
    setCameraState('REQUESTING');
    setErrorMessage('');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('UNAVAILABLE');
      setErrorMessage('Media devices API is not supported in this browser environment.');
      return;
    }

    try {
      const constraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraState('GRANTED');
      setIsPaused(false);
      startRealtimeVisionLoop();
      notifySuccess('Camera Active', 'Real-time hand tracking and 21-point skeletal overlay initialized.');
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('DENIED');
        setErrorMessage('Camera access was denied. Please update your browser permissions.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('UNAVAILABLE');
        setErrorMessage('No camera device was detected on your system.');
      } else {
        setCameraState('UNAVAILABLE');
        setErrorMessage(err.message || 'Camera initialization failed.');
      }
      notifyCoralError('Camera Error', err.message);
    }
  };

  const togglePauseCamera = () => {
    if (!streamRef.current) return;
    const tracks = streamRef.current.getVideoTracks();
    if (tracks.length > 0) {
      tracks[0].enabled = isPaused;
      setIsPaused(!isPaused);
      if (!isPaused) {
        notifySuccess('Stream Paused', 'Vision landmark tracking suspended.');
      } else {
        notifySuccess('Stream Resumed', 'Vision tracking active.');
      }
    }
  };

  // Real-time 60fps vision loop driven by VisionRecognitionEngine
  const startRealtimeVisionLoop = () => {
    let lastVideoTime = -1;

    const renderLoop = (timestamp) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const engine = engineRef.current;

      if (video && canvas && video.readyState >= 2 && !isPaused) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (video.currentTime !== lastVideoTime && engine) {
          lastVideoTime = video.currentTime;
          const result = engine.processVideoFrame(video, timestamp);

          if (result && result.hasHands) {
            // Draw 21-keypoint skeleton overlay
            result.landmarks.forEach((handLm) => {
              // 1. Draw connecting bones
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#6FA3EF';
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';

              HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                const p1 = handLm[startIdx];
                const p2 = handLm[endIdx];
                if (p1 && p2) {
                  ctx.beginPath();
                  ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                  ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                  ctx.stroke();
                }
              });

              // 2. Draw tactile joint pins
              handLm.forEach((pt, idx) => {
                const px = pt.x * canvas.width;
                const py = pt.y * canvas.height;

                ctx.fillStyle = [4, 8, 12, 16, 20].includes(idx) ? '#FFC107' : '#FF6F61';
                ctx.beginPath();
                ctx.arc(px, py, 5.5, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
                ctx.fill();
              });
            });

            // Update UI with active gesture & stability
            if (result.activeGesture) {
              setActiveGestureBanner(result.activeGesture);
              setConfidenceScore(result.activeGesture.confidence);
            } else {
              setActiveGestureBanner(null);
            }

            // Emitted token from temporal boundary detector
            if (result.emittedToken) {
              setRecognizedWords((prev) => {
                const updated = [...prev, result.emittedToken.label];
                processSignTranslation(updated);
                return updated;
              });
            }

            setDiagnosticsData({
              isHolding: result.isHolding,
              velocity: result.velocity,
              stabilityCount: result.stabilityCount,
              activeSign: result.activeGesture?.label || 'None',
              confidence: result.activeGesture?.confidence || 0,
            });
            setMotionEnergy(result.velocity || 0);
            setIsSignerPaused(result.isHolding);
          } else {
            setActiveGestureBanner(null);
            setIsSignerPaused(true);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // Text-to-Speech Playback
  const handlePlaySpeech = () => {
    if (!('speechSynthesis' in window)) {
      notifyCoralError('Audio Error', 'Speech synthesis is not supported on this device.');
      return;
    }

    if (!aiGeneratedSentence) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(aiGeneratedSentence);
    utterance.rate = speechRate;
    utterance.volume = speechVolume;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find((v) =>
        voiceGender === 'female'
          ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
          : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george')
      );
      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    notifySuccess('Speaking Audio', 'Playing synthesized voice output.');
  };

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1400px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div className="cardless-kicker">Workspace &bull; Sign-to-Text</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              Sign-to-Text Vision Studio
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Real-time computer-vision workspace interpreting camera gestures into live captions and natural synthesized speech.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CardlessBadge color={cameraState === 'GRANTED' ? 'coral' : 'grey'}>
              {cameraState === 'GRANTED' ? 'Vision Tracking Active' : 'Camera Standby'}
            </CardlessBadge>
            <CardlessBadge color="blue">21-Keypoint MediaPipe Skeleton</CardlessBadge>
          </div>
        </div>

        <AvatarGuide
          featureName="Sign-to-Text Studio"
          guideSummary="Position your hand within the camera tracking frame. Hastivo normalizes landmarks relative to your wrist and automatically detects sign holds vs. transitions to construct continuous ISL sentences."
          capabilities={[
            'MediaPipe Tasks-Vision 21-joint skeleton extraction',
            'Scale and handedness-invariant landmark normalization',
            'Temporal hold vs. transition boundary detector',
            'Automatic sentence synthesis and Text-to-Speech readout'
          ]}
        />

        {/* ── 2-Column Integrated Vision Workspace ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(420px, 1.4fr) minmax(340px, 1fr)',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
            marginTop: '28px',
          }}
        >
          {/* Left Column: Wide 16:9 Landscape Camera Viewport & HUD */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: cameraState === 'GRANTED' ? 'var(--color-coral)' : 'var(--text-secondary)',
                    boxShadow: cameraState === 'GRANTED' ? '0 0 10px var(--color-coral)' : 'none',
                  }}
                />
                <span style={{ fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  16:9 Camera Tracking Viewport
                </span>
              </div>

              {devices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-control)',
                    background: 'var(--surface, var(--bg-secondary))',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                  }}
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Continuous Tracking Mode Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                marginBottom: '12px',
                borderRadius: 'var(--radius-control)',
                background: 'rgba(111, 163, 239, 0.08)',
                border: '1px solid rgba(111, 163, 239, 0.25)',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isSignerPaused ? '#FFC107' : '#22C55E',
                  boxShadow: `0 0 8px ${isSignerPaused ? '#FFC107' : '#22C55E'}`
                }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {continuousMode ? 'Continuous Gesture Recognition (BiLSTM)' : 'Isolated Sign Mode'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                  [{isSignerPaused ? 'Natural Pause / Hold' : 'Dynamic Signing Motion'}]
                </span>
              </div>
              <button
                type="button"
                onClick={() => setContinuousMode(!continuousMode)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(111, 163, 239, 0.4)',
                  borderRadius: '4px',
                  color: 'var(--color-blue)',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {continuousMode ? 'Switch to Isolated' : 'Enable Continuous'}
              </button>
            </div>

            {/* Video Viewport Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#07090D',
                borderRadius: 'var(--radius-card, 8px)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
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
                  transform: 'scaleX(-1)', // Mirror user natural perspective
                  display: cameraState === 'GRANTED' ? 'block' : 'none',
                }}
              />

              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                  pointerEvents: 'none',
                }}
              />

              {/* Inactive Standby Screen */}
              {cameraState !== 'GRANTED' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'radial-gradient(circle at center, rgba(111,163,239,0.05) 0%, rgba(7,9,13,0.98) 75%)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(255, 111, 97, 0.1)',
                      border: '1px solid var(--color-coral)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      marginBottom: '16px',
                    }}
                  >
                    📹
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    Camera Access Required
                  </h3>
                  <p style={{ margin: '0 0 20px 0', fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.5 }}>
                    Activate your webcam to initiate real-time hand tracking and computer vision gesture recognition.
                  </p>
                  <CardlessButton
                    variant="primary"
                    size="md"
                    onClick={requestCameraAccess}
                    disabled={cameraState === 'REQUESTING'}
                  >
                    {cameraState === 'REQUESTING' ? 'Requesting Camera...' : 'Enable Camera Access'}
                  </CardlessButton>
                </div>
              )}

              {/* Active Real-time Gesture Floating HUD Banner */}
              {activeGestureBanner && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 10,
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-control)',
                    backgroundColor: 'rgba(10, 14, 20, 0.90)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-coral)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-amber)' }}>
                    {activeGestureBanner.label}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    ({Math.round((activeGestureBanner.confidence || 0) * 100)}% match)
                  </span>
                </div>
              )}
            </div>

            {/* Viewport Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {cameraState === 'GRANTED' && (
                  <>
                    <CardlessButton variant="ghost" size="sm" onClick={togglePauseCamera}>
                      {isPaused ? '▶ Resume Stream' : '⏸ Pause Stream'}
                    </CardlessButton>
                    <CardlessButton variant="ghost" size="sm" onClick={stopCamera}>
                      🛑 Stop Camera
                    </CardlessButton>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: showDiagnostics ? 'var(--color-coral)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics ⚙️'}
              </button>
            </div>

            {/* Telemetry Diagnostics Panel */}
            {showDiagnostics && diagnosticsData && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.78rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '8px',
                }}
              >
                <div>Hold State: <strong>{diagnosticsData.isHolding ? 'Holding' : 'In Motion'}</strong></div>
                <div>Wrist Velocity: <strong>{diagnosticsData.velocity}</strong></div>
                <div>Stability Frames: <strong>{diagnosticsData.stabilityCount} / 6</strong></div>
                <div>Active Sign: <strong style={{ color: 'var(--color-coral)' }}>{diagnosticsData.activeSign}</strong></div>
              </div>
            )}
          </div>

          {/* Right Column: Sentence Synthesis & Text-to-Speech Output */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Live Caption Display Container */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  Synthesized ISL Caption
                </span>
                {confidenceScore !== null && (
                  <CardlessBadge color="blue">
                    Confidence: {Math.round(confidenceScore * 100)}%
                  </CardlessBadge>
                )}
              </div>

              <div
                style={{
                  minHeight: '110px',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--surface-sunken, var(--bg-secondary))',
                  border: '1px solid var(--border)',
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: aiGeneratedSentence ? 'flex-start' : 'center',
                }}
              >
                {aiGeneratedSentence || (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.90rem' }}>
                    Awaiting camera gesture input. Recognized hand shapes will be synthesized into live captions here.
                  </span>
                )}
              </div>
            </div>

            {/* Separately Available Recognized Words */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  Individual Recognized Gestures ({recognizedWords.length})
                </span>
                {recognizedWords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRecognizedWords([]);
                      setAiGeneratedSentence('');
                      setConfidenceScore(null);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-coral)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Clear Tokens
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {recognizedWords.length === 0 ? (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    No gestures recognized yet.
                  </span>
                ) : (
                  recognizedWords.map((word, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-control)',
                        background: 'rgba(111, 163, 239, 0.12)',
                        border: '1px solid rgba(111, 163, 239, 0.3)',
                        color: 'var(--color-blue)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                      }}
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>

              {/* Quick Gesture Insertion for testing & synthesis */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginRight: '4px' }}>Test Gestures:</span>
                {['NAMASTE', 'HELLO', 'THANK_YOU', 'PLEASE', 'HELP', 'WELCOME', 'WATER', 'YES', 'NO', '1', '2', '3', 'A', 'B', 'C'].map((sign) => (
                  <button
                    key={sign}
                    type="button"
                    onClick={() => handleAddSignToken(sign)}
                    style={{
                      fontSize: '0.76rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    + {sign}
                  </button>
                ))}
              </div>
            </div>

            {/* Text-to-Speech Output Controls */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  Text-to-Speech Voice Output
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Web Speech API
                </span>
              </div>

              {/* Voice controls grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Voice Profile
                  </label>
                  <select
                    value={voiceGender}
                    onChange={(e) => setVoiceGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-control)',
                      background: 'var(--surface-elevated, var(--bg-secondary))',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <option value="female">Natural Female</option>
                    <option value="male">Natural Male</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Speed: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.25"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-blue)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Volume: {Math.round(speechVolume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={speechVolume}
                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-blue)' }}
                  />
                </div>
              </div>

              <CardlessButton
                variant="primary"
                size="md"
                disabled={!aiGeneratedSentence || isSpeaking}
                onClick={handlePlaySpeech}
                style={{ width: '100%' }}
              >
                {isSpeaking ? '🔊 Synthesizing Speech Output...' : '🔊 Play Spoken Sentence'}
              </CardlessButton>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
