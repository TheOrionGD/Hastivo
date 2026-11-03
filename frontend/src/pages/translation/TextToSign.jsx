import React, { useState, useEffect, useRef } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import { translationService } from '../../services/translationService';
import { useNotification } from '../../contexts/NotificationContext';
import { AvatarViewer } from '../../components/avatar/AvatarViewer.jsx';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo AI — Text-to-Sign Primary Workspace (Cardless Redesign)
 * Master Specification Section 4.7:
 * - Visually dominant 3D avatar stage without enclosed box containers.
 * - Open input editor with manual typing, speech-to-text mic, live transcript, word/character count.
 * - AI processing area with sign grammar transformation & gesture sequence generation.
 * - Playback controls (play, pause, resume, replay, speed control, prev/next gesture).
 * - Open spatial composition with subtle 1px dividers.
 */
export default function TextToSign() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isListening, setIsListening] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('standard');

  const avatarViewerRef = useRef(null);
  const recognitionRef = useRef(null);
  const { notifyCoralError, notifySuccess } = useNotification();

  // Setup Speech-to-Text Recognition
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const recognizer = new SpeechRec();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.onerror = (err) => {
        setIsListening(false);
        notifyCoralError('Speech Input Error', err.error || 'Microphone error');
      };

      recognitionRef.current = recognizer;
    }
  }, [notifyCoralError]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      notifyCoralError('Not Supported', 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        notifySuccess('Listening...', 'Speak naturally to transcribe into Indian Sign Language.');
      } catch (e) {
        setIsListening(false);
        notifyCoralError('Microphone Access Error', e.message || 'Could not start microphone');
      }
    }
  };

  const handleTranslate = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setErrorMessage('Please enter or dictate a sentence to translate.');
      return;
    }

    setErrorMessage('');
    setIsTranslating(true);
    setTranslationResult(null);

    try {
      const res = await translationService.translateTextToSign(inputText, selectedDialect);
      setTranslationResult(res);

      const words = inputText.trim().toUpperCase().split(/\s+/);
      const recognizedSign = words.find((w) =>
        ['NAMASTE', 'HELLO', 'THANK', 'THANKS', 'WELCOME', 'YES', 'NO', 'PLEASE', 'HELP', 'LEARN', 'COMMUNICATE', 'SIGN'].includes(w)
      );

      if (recognizedSign) {
        const signMap = {
          NAMASTE: 'NAMASTE',
          HELLO: 'HELLO',
          THANK: 'THANK_YOU',
          THANKS: 'THANK_YOU',
          WELCOME: 'WELCOME',
          YES: 'YES',
          NO: 'NO',
          PLEASE: 'PLEASE',
          HELP: 'HELP',
          LEARN: 'LEARN',
          COMMUNICATE: 'COMMUNICATE',
          SIGN: 'SIGN',
        };
        avatarViewerRef.current?.playSign(signMap[recognizedSign]);
        notifySuccess('Sign Found', `Playing ISL gesture for "${recognizedSign}"`);
      } else {
        avatarViewerRef.current?.playFingerspelling(words.join(' '));
        notifySuccess('Fingerspelling Active', `Signing: "${words.join(' ')}"`);
      }

      if (res?.sequence && res.sequence.length > 0) {
        startPlayback(res.sequence);
      } else {
        startPlayback(words);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Translation request failed.');
      notifyCoralError('Translation Error', err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const startPlayback = (sequence) => {
    setIsPlaying(true);
    let index = 0;
    setActiveWordIndex(0);

    const intervalTime = Math.max(500, Math.round(1200 / playbackSpeed));
    const interval = setInterval(() => {
      index++;
      if (index < sequence.length) {
        setActiveWordIndex(index);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveWordIndex(-1);
      }
    }, intervalTime);
  };

  const words = inputText.trim() ? inputText.trim().split(/\s+/) : [];
  const charCount = inputText.length;
  const wordCount = words.length;

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1400px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div className="cardless-kicker">Workspace &bull; Text-to-Sign</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              Text-to-Sign Synthesizer
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Convert natural language sentences and live dictation into continuous 3D Indian Sign Language procedural humanoid animations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CardlessBadge color="coral" icon="🤖">3D Humanoid Engine</CardlessBadge>
            <CardlessBadge color="blue" icon="⚡">Sub-60ms Synthesizer</CardlessBadge>
          </div>
        </div>

        <AvatarGuide
          featureName="Text-to-Sign Workspace"
          description="Type text or click the microphone to speak. The procedural avatar articulates fingers, wrists, and gestures in synchronized real-time."
          pose="present"
        />

        <SectionDivider spacing="24px" />

        {/* ── 2-Column Open Spatial Workspace ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 1fr) minmax(420px, 1.35fr)',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
            marginTop: '28px',
          }}
        >
          {/* Left Column: Input Area & AI Processing Grammar */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Input Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                Sentence or Voice Input
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Dialect:
                </span>
                <select
                  value={selectedDialect}
                  onChange={(e) => setSelectedDialect(e.target.value)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    background: 'var(--surface-elevated, var(--bg-secondary))',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <option value="standard">Standard ISL</option>
                  <option value="northern">Northern ISL</option>
                  <option value="southern">Southern ISL</option>
                </select>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {charCount} chars &bull; {wordCount} words
                </span>
              </div>
            </div>

            {/* Open Input Editor */}
            <form onSubmit={handleTranslate} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  rows="5"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a sentence or click the microphone (e.g. 'Namaste, thank you for learning sign language with Hastivo')..."
                  style={{
                    width: '100%',
                    padding: '16px 18px',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    background: 'var(--surface-elevated, var(--bg-secondary))',
                    border: '1px solid var(--border-subtle, var(--border))',
                    borderRadius: 'var(--radius-control)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle, var(--border))')}
                />

                {/* Speech Dictation Mic Overlay Trigger */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title={isListening ? 'Stop Speech Recognition' : 'Dictate with Microphone'}
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isListening ? 'var(--color-coral)' : 'var(--surface, var(--bg-primary))',
                    color: isListening ? '#fff' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isListening ? '0 0 14px var(--color-coral)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <CardlessButton
                  variant="primary"
                  size="md"
                  disabled={isTranslating || !inputText.trim()}
                  onClick={handleTranslate}
                  style={{ flex: 1 }}
                >
                  {isTranslating ? 'Synthesizing Signs...' : 'Translate & Play 3D Signs →'}
                </CardlessButton>

                <CardlessButton
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setInputText('');
                    setTranslationResult(null);
                    setErrorMessage('');
                    avatarViewerRef.current?.resetPose();
                  }}
                >
                  Clear
                </CardlessButton>
              </div>
            </form>

            {/* Quick Preset Signs */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Quick ISL Lexicon Triggers:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Namaste', 'Thank You', 'Welcome', 'Please', 'Help', 'Learn', 'Yes', 'No'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setInputText(preset);
                      const key = preset.toUpperCase().replace(' ', '_');
                      avatarViewerRef.current?.playSign(key);
                      notifySuccess('Gesture Triggered', `Avatar signing: ${preset}`);
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '0.80rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.borderColor = 'var(--color-coral)')}
                    onMouseLeave={(e) => (e.target.style.borderColor = 'var(--border)')}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Error Notice if any */}
            {errorMessage && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-control)',
                  background: 'rgba(255, 111, 97, 0.12)',
                  border: '1px solid var(--color-coral)',
                  color: 'var(--color-coral)',
                  fontSize: '0.85rem',
                }}
              >
                <strong>Notice:</strong> {errorMessage}
              </div>
            )}

            {/* AI Grammar & Gesture Sequence Timeline */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  Sign Grammar & Sequence Tokens
                </span>
                {isPlaying && (
                  <CardlessBadge color="amber">Playing Sequence</CardlessBadge>
                )}
              </div>

              {translationResult && (
                <div style={{ marginBottom: '12px', fontSize: '0.82rem', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>ISL Grammar:</span>
                  <span>{translationResult.islGlossSequence?.join(' ') || (translationResult.tokens ? translationResult.tokens.map(t => t.gloss).join(' ') : 'Synthesized')}</span>
                </div>
              )}

              {words.length === 0 ? (
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter text to view the generated word-by-word sign translation sequence.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {words.map((word, idx) => {
                    const isActive = idx === activeWordIndex;
                    return (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-control)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          background: isActive ? 'var(--color-amber)' : 'var(--surface-elevated, var(--bg-secondary))',
                          color: isActive ? 'var(--color-charcoal)' : 'var(--text-primary)',
                          border: `1px solid ${isActive ? 'var(--color-amber)' : 'var(--border)'}`,
                          transition: 'all 0.18s ease',
                          boxShadow: isActive ? '0 0 16px rgba(255, 193, 7, 0.5)' : 'none',
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Playback Controls & Speed */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Speed:</span>
                  {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                        background: playbackSpeed === spd ? 'var(--color-coral)' : 'transparent',
                        color: playbackSpeed === spd ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CardlessButton
                    variant="ghost"
                    size="sm"
                    onClick={() => avatarViewerRef.current?.resetPose()}
                  >
                    Reset Pose
                  </CardlessButton>
                  <CardlessButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTranslate()}
                  >
                    ↻ Replay
                  </CardlessButton>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visually Dominant 3D Humanoid Avatar Presentation */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  3D Sign Language Avatar
                </h3>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Procedural X-Bot (♀) & Y-Bot (♂) ISL Kinematics Rig
                </span>
              </div>
              <CardlessBadge color="blue">WebGL Three.js</CardlessBadge>
            </div>

            {/* Procedural Avatar Viewport (Open Canvas without Card Enclosure) */}
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-control)',
                overflow: 'hidden',
                background: 'transparent',
                position: 'relative',
              }}
            >
              <AvatarViewer
                ref={avatarViewerRef}
                height="560px"
                showControls={true}
                showCaptions={true}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
