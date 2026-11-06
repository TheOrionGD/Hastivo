/**
 * AvatarViewer - High-Level Interactive 3D Avatar Viewport
 * Displays the procedural humanoid Hastivo character with:
 * - Real-time gesture captions & fingerspelling readout
 * - Speed controls (0.75x, 1x, 1.25x)
 * - Quick gesture toolbar (Namaste, Wave, Thank You, Thumbs Up)
 * - Status pills & responsive framing
 */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AvatarCanvas } from './AvatarCanvas.jsx';
import { avatarService, AVATAR_MODELS } from '../../services/avatarService.js';

export const AvatarViewer = forwardRef(function AvatarViewer({
  theme = 'dark',
  height = '500px',
  showControls = true,
  showCaptions = true,
  showModelSelector = true,
  initialModel,
  initialAnimation = 'idleBreathing',
  className = '',
  onFinishedSign
}, ref) {
  const canvasRef = useRef(null);
  const [currentModel, setCurrentModel] = useState(initialModel || avatarService.getActiveModel() || 'v-bot');
  const [currentCaption, setCurrentCaption] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [activeSignId, setActiveSignId] = useState('');
  const [signProgress, setSignProgress] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [isWireframe, setIsWireframe] = useState(false);

  useEffect(() => {
    if (initialAnimation && canvasRef.current) {
      canvasRef.current.playAnimation(initialAnimation);
    }
  }, [initialAnimation]);

  const handleSelectModel = (modelId) => {
    setCurrentModel(modelId);
    avatarService.setActiveModel(modelId);
    canvasRef.current?.switchAvatar?.(modelId);
  };

  // Forward all methods
  useImperativeHandle(ref, () => ({
    switchAvatar: (modelId) => handleSelectModel(modelId),
    getAvatarModel: () => currentModel,
    playAnimation: (name) => canvasRef.current?.playAnimation(name),
    playSign: (signId) => canvasRef.current?.playSign(signId),
    playSequence: (signIds) => canvasRef.current?.playSequence(signIds),
    playFingerspelling: (text, speed, side) => canvasRef.current?.playFingerspelling(text, speed, side),
    playNumber: (num, side) => canvasRef.current?.playNumber(num, side),
    playDefaultSign: (side) => canvasRef.current?.playDefaultSign(side),
    setDefaultSide: (side) => canvasRef.current?.setDefaultSide(side),
    setOuterLayerCoating: (color, options) => canvasRef.current?.setOuterLayerCoating(color, options),
    setExpression: (expr) => canvasRef.current?.setExpression(expr),
    pause: () => canvasRef.current?.pause?.(),
    resume: () => canvasRef.current?.resume?.(),
    setPlaybackSpeed: (s) => {
      setSpeed(s);
      canvasRef.current?.setPlaybackSpeed(s);
    },
    resetPose: () => {
      setCurrentCaption('');
      setActiveLetter('');
      setActiveSignId('');
      setSignProgress(0);
      canvasRef.current?.resetPose();
    },
    stop: () => {
      setCurrentCaption('');
      setActiveLetter('');
      setActiveSignId('');
      setSignProgress(0);
      canvasRef.current?.stop();
    },
    getStats: () => canvasRef.current?.getStats()
  }), [currentModel]);

  const handleSignProgress = ({ signId, letter, label, progress, finished }) => {
    if (finished) {
      setCurrentCaption('');
      setActiveLetter('');
      setActiveSignId('');
      setSignProgress(100);
      if (onFinishedSign) onFinishedSign();
    } else {
      if (label) setCurrentCaption(label);
      if (letter) setActiveLetter(letter);
      if (signId) setActiveSignId(signId);
      if (typeof progress === 'number') setSignProgress(Math.round(progress * 100));
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 0.75 : speed === 0.75 ? 1.25 : 1.0;
    setSpeed(nextSpeed);
    canvasRef.current?.setPlaybackSpeed(nextSpeed);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: 'transparent',
        borderRadius: 'var(--radius-control)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'none'
      }}
      className={className}
    >
      {/* Three.js Canvas */}
      <AvatarCanvas
        ref={canvasRef}
        avatarModel={currentModel}
        theme={theme}
        wireframe={isWireframe}
        onSignProgress={handleSignProgress}
      />

      {/* Top Right Model Selector */}
      {showModelSelector && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 10,
            backgroundColor: 'rgba(18, 21, 26, 0.75)',
            backdropFilter: 'blur(10px)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            boxShadow: 'none'
          }}
        >
          {AVATAR_MODELS.map((m) => {
            const isActive = currentModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectModel(m.id)}
                title={`${m.label}: ${m.description}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-control, 4px)',
                  border: isActive ? `1px solid ${m.accentColor || 'var(--color-blue)'}` : '1px solid transparent',
                  backgroundColor: isActive ? (m.accentColor || 'var(--color-blue)') : 'transparent',
                  color: isActive ? '#0A0D12' : 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{ fontSize: '0.82rem' }}>{m.genderSymbol}</span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Top Header Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'rgba(18, 21, 26, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            border: '1px solid rgba(111, 163, 239, 0.25)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6FA3EF',
            letterSpacing: '0.04em'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#6FA3EF',
              boxShadow: '0 0 8px #6FA3EF'
            }}
          />
          HASTIVO 3D AVATAR
        </span>

        {/* Live Gesture Caption Badge - Right next to 3D avatar tag at top instead of bottom */}
        {showCaptions && (currentCaption || activeSignId) && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: 'rgba(18, 21, 26, 0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              boxShadow: 'none'
            }}
          >
            <span style={{ color: '#FFC107', fontWeight: 800, fontSize: '0.78rem' }}>ISL:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.78rem' }}>{currentCaption || activeSignId}</span>
            {signProgress > 0 && signProgress < 100 && (
              <span style={{ color: '#6FA3EF', fontSize: '0.72rem', fontWeight: 600 }}>({signProgress}%)</span>
            )}
          </div>
        )}

        {activeLetter && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 8px',
              backgroundColor: 'rgba(255, 111, 97, 0.12)',
              borderRadius: 'var(--radius-control, 4px)',
              border: '1px solid var(--color-coral)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--color-coral)'
            }}
          >
            FINGERSPELLING: {activeLetter}
          </span>
        )}
      </div>

      {/* Floating Interactive Controls Dock (Swiss Grid Minimal Toolbar) */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(23, 25, 30, 0.95)',
            backdropFilter: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control, 4px)',
            boxShadow: 'none',
            zIndex: 10
          }}
        >
          {/* Quick gestures */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => canvasRef.current?.playSign('NAMASTE')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-control, 4px)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono, monospace)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Namaste
            </button>
            <button
              onClick={() => canvasRef.current?.playAnimation('wave')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-control, 4px)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono, monospace)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Wave
            </button>
            <button
              onClick={() => canvasRef.current?.playSign('THANK_YOU')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-control, 4px)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono, monospace)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Thank You
            </button>
          </div>

          {/* Right utilities */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={cycleSpeed}
              style={{
                background: 'rgba(111, 163, 239, 0.12)',
                border: '1px solid var(--color-blue)',
                color: 'var(--color-blue)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-control, 4px)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Playback Speed"
            >
              {speed}x
            </button>
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              style={{
                background: isWireframe ? '#FF6F61' : 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#FFF',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
              title="Wireframe Mesh"
            >
              Wireframe
            </button>
            <button
              onClick={() => {
                setCurrentCaption('');
                setActiveLetter('');
                canvasRef.current?.resetPose();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#AAA',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
              title="Reset Pose"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
