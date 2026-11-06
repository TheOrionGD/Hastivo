import React, { useState, useRef } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import { translationService } from '../../services/translationService';
import { speechService } from '../../services/speechService';
import { useNotification } from '../../contexts/NotificationContext';
import { AvatarViewer } from '../../components/avatar/AvatarViewer.jsx';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Text-to-Sign Primary Workspace
 * 
 * Features:
 * - Robust speech recognition pipeline with live interim/final transcripts and auto-recovery.
 * - Multi-sign ISL grammatical sequence generation (TSOV grammar rules).
 * - Full chronological 3D avatar animation playback queue (signs + fingerspelling OOV).
 * - Full interactive playback controls: Play, Pause, Resume, Replay, Reset Pose, Speed Adjustment.
 */
export default function TextToSign() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('IDLE');
  const [selectedDialect, setSelectedDialect] = useState('standard');

  const avatarViewerRef = useRef(null);
  const { notifyCoralError, notifySuccess } = useNotification();

  // Speech Recognition integration via centralized speechService
  const toggleSpeechRecognition = async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setSpeechStatus('IDLE');
      notifySuccess('Microphone Stopped', 'Dictation concluded.');
    } else {
      const perm = await speechService.checkMicrophonePermission();
      if (!perm.supported) {
        notifyCoralError('Audio Unavailable', perm.error || 'Microphone not supported in this browser.');
        return;
      }

      setIsListening(true);
      await speechService.startListening({
        continuous: false,
        lang: 'en-US',
        onStatusChange: (status) => setSpeechStatus(status),
        onTranscript: ({ transcript, isFinal }) => {
          if (transcript) {
            setInputText(transcript);
          }
          if (isFinal) {
            setIsListening(false);
            setSpeechStatus('IDLE');
          }
        },
        onError: (err) => {
          setIsListening(false);
          setSpeechStatus('ERROR');
          notifyCoralError('Speech Input Notice', err);
        }
      });
      notifySuccess('Listening...', 'Speak naturally to dictate your sentence.');
    }
  };

  // Compile local fallback ISL grammar if backend service is unreachable
  const compileLocalISLSequence = (text) => {
    const rawTokens = text.toUpperCase().replace(/[^\w\s]/g, '').trim().split(/\s+/);
    const timeWords = new Set(['TODAY', 'TOMORROW', 'YESTERDAY', 'NOW', 'MORNING', 'NIGHT']);
    const questionWords = new Set(['WHERE', 'WHAT', 'WHEN', 'WHY', 'HOW', 'WHO']);
    const negationWords = new Set(['NOT', 'NO', 'NEVER']);

    const times = [];
    const questions = [];
    const negations = [];
    const core = [];

    rawTokens.forEach((t) => {
      if (timeWords.has(t)) times.push(t);
      else if (questionWords.has(t)) questions.push(t);
      else if (negationWords.has(t)) negations.push('NO');
      else core.push(t);
    });

    // ISL SOV reordering: Subject + Object + Verb
    if (core.length >= 3 && ['WANT', 'NEED', 'LEARN', 'LIKE', 'GO'].includes(core[1])) {
      const subj = core[0];
      const verb = core[1];
      const objs = core.slice(2);
      core.splice(0, core.length, subj, ...objs, verb);
    }

    return [...times, ...core, ...negations, ...questions];
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
    setIsPaused(false);

    try {
      let result = null;
      try {
        result = await translationService.translateTextToSign(inputText, selectedDialect);
      } catch {
        // Transparent local linguistic compiler fallback
        const islTokens = compileLocalISLSequence(inputText);
        result = {
          success: true,
          sourceText: inputText,
          islGlossSequence: islTokens,
          animationSequence: islTokens.map((t, idx) => ({ sequenceIndex: idx, gloss: t }))
        };
      }

      setTranslationResult(result);

      // Extract sequence of signs to play
      const sequenceTokens = result.islGlossSequence ||
        (result.animationSequence ? result.animationSequence.map(a => a.gloss || a.letter) : null) ||
        compileLocalISLSequence(inputText);

      // Play continuous synchronized sequence on 3D avatar
      if (avatarViewerRef.current && sequenceTokens.length > 0) {
        avatarViewerRef.current.playSequence(sequenceTokens);
        notifySuccess('Synthesizing Signs', `Articulating ${sequenceTokens.length} ISL signs in sequence.`);
        startPlaybackProgress(sequenceTokens);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Translation request failed.');
      notifyCoralError('Translation Error', err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const startPlaybackProgress = (sequence) => {
    setIsPlaying(true);
    setIsPaused(false);
    let index = 0;
    setActiveWordIndex(0);

    const intervalTime = Math.max(500, Math.round(1150 / playbackSpeed));
    const interval = setInterval(() => {
      if (isPaused) return;

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

  const handleTogglePause = () => {
    if (isPaused) {
      avatarViewerRef.current?.resume?.();
      setIsPaused(false);
      notifySuccess('Playback Resumed', 'Avatar signing resumed.');
    } else {
      avatarViewerRef.current?.pause?.();
      setIsPaused(true);
      notifySuccess('Playback Paused', 'Avatar signing paused.');
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    avatarViewerRef.current?.setPlaybackSpeed?.(speed);
  };

  const words = inputText.trim() ? inputText.trim().split(/\s+/) : [];
  const sequenceTokens = translationResult?.islGlossSequence || words;

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
            <CardlessBadge color="blue" icon="⚡">ISL TSOV Grammar</CardlessBadge>
          </div>
        </div>

        <AvatarGuide
          featureName="Text-to-Sign Workspace"
          guideSummary="Type a sentence or use your microphone to dictate. Hastivo's linguistic engine parses the text into Indian Sign Language (ISL) grammar and commands the 3D avatar to articulate the signs sequentially."
          capabilities={[
            'Browser-native speech recognition with live transcription',
            'ISL Subject-Object-Verb (SOV) grammatical compilation',
            'Full sequential multi-sign animation queues with fingerspelling fallback',
            'Interactive playback controls (Play, Pause, Resume, Replay, Speed adjustment)'
          ]}
        />

        <SectionDivider spacing="24px" />

        {/* 2-Column Split Composition (55% Avatar Stage / 45% Text Input & Sequence Editor) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '32px',
            alignItems: 'start',
          }}
          className="text-to-sign-grid"
        >
          {/* Column A: 3D Avatar Interactive Stage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                3D Sign Language Avatar Stage
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isPlaying && (
                  <CardlessBadge color={isPaused ? 'amber' : 'coral'}>
                    {isPaused ? '⏸ Paused' : '▶ Articulating Signs'}
                  </CardlessBadge>
                )}
                <CardlessBadge color="grey">65-Bone Rig</CardlessBadge>
              </div>
            </div>

            <AvatarViewer
              ref={avatarViewerRef}
              height="580px"
              showControls={true}
              cameraMode="conversation"
              showQuickPhrases={true}
            />
          </div>

          {/* Column B: Open Input Editor & ISL Sequence Timeline */}
          <div>
            <form onSubmit={handleTranslate} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label
                  htmlFor="tts-input"
                  style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}
                >
                  Sentence / Speech Input
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Dialect:</span>
                  <select
                    value={selectedDialect}
                    onChange={(e) => setSelectedDialect(e.target.value)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      fontSize: '0.78rem',
                      outline: 'none',
                    }}
                  >
                    <option value="standard">Standard ISL</option>
                    <option value="northern">Northern ISL</option>
                    <option value="southern">Southern ISL</option>
                  </select>
                </div>
              </div>

              {/* Textarea Input */}
              <div style={{ position: 'relative' }}>
                <textarea
                  id="tts-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or speak a sentence (e.g., 'Hello, where is the train station?' or 'I need water please')..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-sunken, var(--bg-secondary))',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-coral)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Input Meta & Microphone Dictation Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                    {words.length} words &bull; {inputText.length} characters
                  </span>
                  {speechStatus === 'LISTENING' && (
                    <span style={{ fontSize: '0.80rem', color: 'var(--color-coral)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-coral)', display: 'inline-block' }} />
                      Listening to speech...
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CardlessButton
                    type="button"
                    variant={isListening ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={toggleSpeechRecognition}
                    style={{
                      borderColor: isListening ? 'var(--color-coral)' : 'var(--border)',
                      color: isListening ? '#FFFFFF' : 'var(--text-primary)',
                      background: isListening ? 'var(--color-coral)' : 'transparent',
                    }}
                  >
                    {isListening ? '🛑 Stop Dictation' : '🎙️ Microphone'}
                  </CardlessButton>

                  <CardlessButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isTranslating || !inputText.trim()}
                  >
                    {isTranslating ? 'Compiling ISL...' : 'Synthesize Signs ▶'}
                  </CardlessButton>
                </div>
              </div>
            </form>

            {/* Quick Vocabulary Presets */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Preset Examples:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  'Hello, welcome!',
                  'Please help me',
                  'I want water',
                  'Where is the doctor?',
                  'Thank you very much'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setInputText(preset);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-control)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
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
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  ISL Grammar Tokens ({sequenceTokens.length})
                </span>
                {isPlaying && (
                  <CardlessBadge color="amber">Playing Sequence</CardlessBadge>
                )}
              </div>

              {translationResult && (
                <div style={{ marginBottom: '12px', fontSize: '0.82rem', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>ISL Sequence:</span>
                  <span>{sequenceTokens.join(' ')}</span>
                </div>
              )}

              {sequenceTokens.length === 0 ? (
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter text to view the generated word-by-word sign translation sequence.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {sequenceTokens.map((token, idx) => {
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
                        {typeof token === 'object' ? (token.gloss || token.letter) : token}
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
                      onClick={() => handleSpeedChange(spd)}
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
                  {isPlaying && (
                    <CardlessButton
                      variant="ghost"
                      size="sm"
                      onClick={handleTogglePause}
                    >
                      {isPaused ? '▶ Resume' : '⏸ Pause'}
                    </CardlessButton>
                  )}
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
        </div>
      </PageContainer>
    </div>
  );
}
