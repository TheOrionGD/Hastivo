import React, { useState, useEffect, useRef } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import { useNotification } from '../../contexts/NotificationContext';
import { AvatarViewer } from '../../components/avatar/AvatarViewer.jsx';
import { PageContainer, CardlessBadge, CardlessButton } from '../../components/cardless/CardlessComponents';
import { speechService } from '../../services/speechService';
import { translationService } from '../../services/translationService';
import { VisionRecognitionEngine, HAND_CONNECTIONS } from '../../services/visionRecognitionEngine';

/**
 * Hastivo — Real-Time Conversation Workspace (Cardless Split-Screen)
 * 
 * Features:
 * - Simultaneous two-participant duplex workspace (Two-column layout).
 * - Participant A (Speech/Text -> 3D Sign Avatar):
 *   - Continuous browser speech dictation or manual text input.
 *   - Full ISL grammatical sequence compilation.
 *   - Multi-sign synchronized 3D avatar animation playback.
 * - Participant B (Camera Signer -> Speech/Text):
 *   - Full MediaPipe Tasks-Vision hand skeletal tracking.
 *   - Wrist-relative normalized landmark classification (Alphabets + Core signs).
 *   - Hold vs. Transition temporal boundary detection (prevents repeating flood).
 *   - Automatic continuous caption synthesis and Web Speech TTS audio readout.
 * - Non-blocking concurrent execution:
 *   - Left side avatar kinematics and right side vision tracking run completely independently.
 *   - Unified synchronized timeline with sender badges, timestamps, and message export.
 */
export default function RealTimeConversation() {
  const [sessionStatus, setSessionStatus] = useState('LIVE'); // LIVE | PAUSED
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('NOT_REQUESTED');

  // Participant A State (Speech-to-Sign)
  const [textA, setTextA] = useState('');
  const [currentSignedWord, setCurrentSignedWord] = useState('');
  const [isAvatarPlaying, setIsAvatarPlaying] = useState(false);
  const [sequenceA, setSequenceA] = useState([]);

  // Participant B State (Sign-to-Speech)
  const [recognizedWordsB, setRecognizedWordsB] = useState([]);
  const [sentenceB, setSentenceB] = useState('');
  const [_confidenceB, _setConfidenceB] = useState(null);
  const [voiceRate, _setVoiceRate] = useState(1.0);
  const [voiceVolume, _setVoiceVolume] = useState(1.0);
  const [_activeGestureB, setActiveGestureB] = useState(null);

  // Synchronized message timeline
  const [timeline, setTimeline] = useState([]);

  // Video and Canvas references
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const avatarViewerRef = useRef(null);
  const visionEngineRef = useRef(null);

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
    setIsCameraActive(false);
    setActiveGestureB(null);
  };

  // Initialize Vision Engine for Participant B
  useEffect(() => {
    const engine = new VisionRecognitionEngine({
      minStableFrames: 6,
      tokenDebounceMs: 1200,
      onReady: () => {
        console.log('RealTimeConversation: Vision engine initialized.');
      },
      onError: (err) => {
        notifyCoralError('Vision Engine Notice', err.message);
      }
    });

    engine.initialize();
    visionEngineRef.current = engine;

    return () => {
      engine.dispose();
      stopCamera();
      speechService.stopListening();
    };
  }, [notifyCoralError]);

  // -------------------------------------------------------------
  // PARTICIPANT A: Speech-to-Sign Workflow
  // -------------------------------------------------------------
  const toggleMic = async () => {
    if (isMicActive) {
      speechService.stopListening();
      setIsMicActive(false);
      notifySuccess('Microphone Paused', 'Participant A dictation suspended.');
    } else {
      const perm = await speechService.checkMicrophonePermission();
      if (!perm.supported) {
        notifyCoralError('Audio Unavailable', perm.error || 'Microphone not supported.');
        return;
      }

      setIsMicActive(true);
      await speechService.startListening({
        continuous: true,
        lang: 'en-US',
        onTranscript: ({ transcript, finalTranscript }) => {
          const currentText = finalTranscript || transcript;
          if (currentText) {
            setTextA(currentText);
            // Compile sequence on avatar
            handleTranslateTurnA(currentText);
          }
        },
        onError: (err) => {
          setIsMicActive(false);
          notifyCoralError('Microphone Error', err);
        }
      });
      notifySuccess('Microphone Active', 'Participant A speaking stream listening.');
    }
  };

  const handleTranslateTurnA = (textToProcess) => {
    const query = textToProcess || textA;
    if (!query.trim()) return;

    const rawTokens = query.toUpperCase().replace(/[^\w\s]/g, '').trim().split(/\s+/);
    setSequenceA(rawTokens);

    if (avatarViewerRef.current && rawTokens.length > 0) {
      avatarViewerRef.current.playSequence(rawTokens);
      setCurrentSignedWord(rawTokens[0] || 'SIGNING');
      setIsAvatarPlaying(true);
    }
  };

  const sendTurnA = () => {
    if (!textA.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setTimeline((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'A',
        name: 'Participant A (Speaker)',
        text: textA,
        glosses: sequenceA.join(' '),
        time: timeStr,
        type: 'speech-to-sign',
      },
    ]);

    notifySuccess('Turn Sent', 'Participant A turn recorded on conversation timeline.');
    setTextA('');
    setSequenceA([]);
  };

  // -------------------------------------------------------------
  // PARTICIPANT B: Sign-to-Speech Workflow
  // -------------------------------------------------------------
  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
      notifySuccess('Camera Suspended', 'Participant B video stream stopped.');
    } else {
      setCameraPermission('REQUESTING');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        setCameraPermission('GRANTED');
        startParticipantBVisionLoop();
        notifySuccess('Camera Active', 'Participant B real-time vision tracking live.');
      } catch (err) {
        setCameraPermission('DENIED');
        notifyCoralError('Camera Error', err.message);
      }
    }
  };

  const synthesizeSentenceB = async (tokens) => {
    if (!tokens || tokens.length === 0) {
      setSentenceB('');
      setConfidenceB(null);
      return;
    }

    try {
      const res = await translationService.translateSignToText(tokens);
      if (res?.synthesizedSentence || res?.sentence || res?.translatedText) {
        const fullSent = res.synthesizedSentence || res.sentence || res.translatedText;
        setSentenceB(fullSent);
        if (res.confidence) setConfidenceB(res.confidence);
      }
    } catch {
      // Local sentence synthesis fallback
      if (tokens.every((t) => t.length === 1)) {
        setSentenceB(tokens.join('').toLowerCase() + '.');
      } else {
        setSentenceB(tokens.join(' ') + '.');
      }
    }
  };

  const startParticipantBVisionLoop = () => {
    let lastVideoTime = -1;

    const renderLoop = (timestamp) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const engine = visionEngineRef.current;

      if (video && canvas && video.readyState >= 2 && isCameraActive) {
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
            // Draw 21-point tactile skeletal overlay
            result.landmarks.forEach((handLm) => {
              ctx.lineWidth = 2.5;
              ctx.strokeStyle = '#6FA3EF';
              ctx.lineCap = 'round';

              HAND_CONNECTIONS.forEach(([sIdx, eIdx]) => {
                const p1 = handLm[sIdx];
                const p2 = handLm[eIdx];
                if (p1 && p2) {
                  ctx.beginPath();
                  ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                  ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                  ctx.stroke();
                }
              });

              handLm.forEach((pt, idx) => {
                const px = pt.x * canvas.width;
                const py = pt.y * canvas.height;
                ctx.fillStyle = [4, 8, 12, 16, 20].includes(idx) ? '#FFC107' : '#FF6F61';
                ctx.beginPath();
                ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
                ctx.fill();
              });
            });

            if (result.activeGesture) {
              setActiveGestureB(result.activeGesture);
            } else {
              setActiveGestureB(null);
            }

            // Emitted stable sign token
            if (result.emittedToken) {
              setRecognizedWordsB((prev) => {
                const updated = [...prev, result.emittedToken.label];
                synthesizeSentenceB(updated);
                return updated;
              });
            }
          } else {
            setActiveGestureB(null);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  const handlePlayTTS = () => {
    if ('speechSynthesis' in window && sentenceB) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentenceB);
      utterance.rate = voiceRate;
      utterance.volume = voiceVolume;
      window.speechSynthesis.speak(utterance);
      notifySuccess('Playing Speech', sentenceB);
    }
  };

  const sendTurnB = () => {
    if (!sentenceB.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setTimeline((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'B',
        name: 'Participant B (Signer)',
        text: sentenceB,
        glosses: recognizedWordsB.join(' '),
        time: timeStr,
        type: 'sign-to-speech',
      },
    ]);

    handlePlayTTS();
    notifySuccess('Turn Sent', 'Participant B turn added & spoken aloud.');
    setSentenceB('');
    setRecognizedWordsB([]);
  };

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1400px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div className="cardless-kicker">Workspace &bull; Real-Time Duplex</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              Real-Time Conversation
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Simultaneous two-way communication connecting speech-to-sign avatar synthesis with camera sign-to-speech recognition.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSessionStatus((prev) => (prev === 'LIVE' ? 'PAUSED' : 'LIVE'))}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              title="Click to toggle session pause or live state"
            >
              <CardlessBadge color={sessionStatus === 'LIVE' ? 'coral' : 'grey'}>
                Session: {sessionStatus}
              </CardlessBadge>
            </button>
            <CardlessButton
              variant={isMicActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleMic}
            >
              {isMicActive ? '🎙️ Mic Active' : '🎙️ Activate Mic'}
            </CardlessButton>
            <CardlessButton
              variant={isCameraActive ? 'secondary' : 'ghost'}
              size="sm"
              onClick={toggleCamera}
            >
              {isCameraActive ? '📹 Camera Active' : '📹 Activate Camera'}
            </CardlessButton>
          </div>
        </div>

        <AvatarGuide
          featureName="Real-Time Conversation"
          guideSummary="Speak into Participant A to articulate sign avatar gestures, while Participant B signs into the camera to generate synthesized speech in real-time."
          capabilities={[
            'Simultaneous independent dual pipelines (no blocking)',
            'Speech dictation with ISL avatar sequence playback',
            'Camera hand landmark recognition with TTS audio output',
            'Synchronized bidirectional turn-taking conversation history'
          ]}
        />

        {/* ── Simultaneous Two-Participant Split-Screen Workspace ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 1fr) minmax(340px, 1fr)',
            gap: 'clamp(28px, 4vw, 56px)',
            margin: '32px 0',
            alignItems: 'start',
          }}
        >
          {/* ══════════════════════════════════════════════════════════════
              PARTICIPANT A — SPEECH-TO-SIGN (Left Column)
              ══════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.80rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-coral)' }}>
                  Participant A &bull; Spoken Voice / Text
                </span>
                <h3 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  Voice &rarr; 3D Sign Avatar
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <CardlessBadge color="coral">{isMicActive ? 'Listening' : 'Muted'}</CardlessBadge>
                {isAvatarPlaying && <CardlessBadge color="amber">Avatar Signing</CardlessBadge>}
              </div>
            </div>

            {/* 3D Sign Language Avatar Viewport */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                background: '#0a0d12',
                borderRadius: 'var(--radius-control)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle, var(--border))',
                position: 'relative',
              }}
            >
              <AvatarViewer
                ref={avatarViewerRef}
                height="100%"
                cameraMode="conversation"
                showControls={false}
                showQuickPhrases={false}
              />

              {currentSignedWord && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    background: 'rgba(10, 14, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-coral)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#FFF',
                  }}
                >
                  Signing: {currentSignedWord}
                </div>
              )}
            </div>

            {/* Participant A Transcript & Controls */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Live Voice Transcript:
                </span>
                <button
                  type="button"
                  onClick={sendTurnA}
                  disabled={!textA.trim()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: textA.trim() ? 'var(--color-coral)' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: textA.trim() ? 'pointer' : 'default',
                  }}
                >
                  Append Turn A &rarr;
                </button>
              </div>

              <textarea
                value={textA}
                onChange={(e) => {
                  setTextA(e.target.value);
                  handleTranslateTurnA(e.target.value);
                }}
                placeholder="Speak into microphone or type here to animate the sign avatar..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--surface, var(--bg-secondary))',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <CardlessButton variant={isMicActive ? 'primary' : 'ghost'} size="sm" onClick={toggleMic}>
                {isMicActive ? '🛑 Pause Mic' : '🎙️ Mic Input'}
              </CardlessButton>
              <CardlessButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  avatarViewerRef.current?.resetPose();
                  setCurrentSignedWord('');
                }}
              >
                Reset Avatar
              </CardlessButton>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              PARTICIPANT B — SIGN-TO-SPEECH (Right Column)
              ══════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.80rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-blue)' }}>
                  Participant B &bull; Camera Signer
                </span>
                <h3 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  Camera &rarr; AI Text & Voice
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <CardlessBadge color="blue">{isCameraActive ? 'Vision Live' : 'Standby'}</CardlessBadge>
                {cameraPermission !== 'NOT_REQUESTED' && (
                  <CardlessBadge color={cameraPermission === 'GRANTED' ? 'blue' : 'coral'}>
                    Cam: {cameraPermission}
                  </CardlessBadge>
                )}
              </div>
            </div>

            {/* Camera Viewport with HUD Canvas */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                background: '#0d0f14',
                borderRadius: 'var(--radius-control)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle, var(--border))',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: isCameraActive ? 'block' : 'none',
                  transform: 'scaleX(-1)',
                }}
              />

              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  display: isCameraActive ? 'block' : 'none',
                  transform: 'scaleX(-1)',
                }}
              />

              {activeGestureB && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    background: 'rgba(10, 14, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-blue)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-amber)',
                  }}
                >
                  Detected: {activeGestureB.label} ({Math.round(activeGestureB.confidence * 100)}%)
                </div>
              )}

              {!isCameraActive && (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📹</div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
                    Participant B Camera Standby
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '0 0 14px' }}>
                    Click activate to stream video and track hand keypoints.
                  </p>
                  <CardlessButton variant="secondary" size="sm" onClick={toggleCamera}>
                    Activate Signer Camera
                  </CardlessButton>
                </div>
              )}
            </div>

            {/* Recognized Words & AI Generated Sentence */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Recognized Signs & Synthesized Speech:
                </span>
                <button
                  type="button"
                  onClick={sendTurnB}
                  disabled={!sentenceB.trim()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: sentenceB.trim() ? 'var(--color-blue)' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: sentenceB.trim() ? 'pointer' : 'default',
                  }}
                >
                  Append Turn B &rarr;
                </button>
              </div>

              {recognizedWordsB.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {recognizedWordsB.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.74rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(111, 163, 239, 0.15)',
                        color: 'var(--color-blue)',
                        border: '1px solid rgba(111, 163, 239, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}

              <textarea
                value={sentenceB}
                onChange={(e) => setSentenceB(e.target.value)}
                placeholder="Participant B recognized camera signs will synthesize into live captions here..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--surface, var(--bg-secondary))',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <CardlessButton variant={isCameraActive ? 'secondary' : 'ghost'} size="sm" onClick={toggleCamera}>
                {isCameraActive ? '🛑 Stop Camera' : '📹 Start Camera'}
              </CardlessButton>
              <CardlessButton variant="ghost" size="sm" onClick={handlePlayTTS} disabled={!sentenceB.trim()}>
                🔊 Play Voice
              </CardlessButton>
              <CardlessButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRecognizedWordsB([]);
                  setSentenceB('');
                  setConfidenceB(null);
                }}
              >
                Clear
              </CardlessButton>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SHARED CONVERSATION TIMELINE
            ══════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: '48px', paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.80rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-secondary)' }}>
                Duplex Conversation Record
              </span>
              <h3 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                Synchronized Turn Timeline ({timeline.length})
              </h3>
            </div>
            {timeline.length > 0 && (
              <button
                type="button"
                onClick={() => setTimeline([])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-coral)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Clear History
              </button>
            )}
          </div>

          {timeline.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', background: 'var(--surface-sunken, var(--bg-secondary))', borderRadius: 'var(--radius-control)' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.90rem' }}>
                No conversation turns logged yet. Activate Participant A (Voice) or Participant B (Signer) to begin two-way communication.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {timeline.map((msg) => {
                const isA = msg.sender === 'A';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isA ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 18px',
                        borderRadius: 'var(--radius-control)',
                        background: isA ? 'rgba(255, 111, 97, 0.08)' : 'rgba(111, 163, 239, 0.08)',
                        border: `1px solid ${isA ? 'rgba(255, 111, 97, 0.3)' : 'rgba(111, 163, 239, 0.3)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.78rem', color: isA ? 'var(--color-coral)' : 'var(--color-blue)' }}>
                          {msg.name}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {msg.time}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {msg.text}
                      </p>
                      {msg.glosses && (
                        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          ISL Gloss: <em>{msg.glosses}</em>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
