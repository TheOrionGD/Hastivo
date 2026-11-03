/**
 * AvatarCanvas - React Three.js Integration Wrapper
 * Mounts the procedural Three.js AvatarScene to an HTML5 Canvas,
 * handles responsive ResizeObserver resizing, and exposes an imperative API.
 */
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AvatarScene } from '../../avatar/scene/AvatarScene.js';

export const AvatarCanvas = forwardRef(function AvatarCanvas({
  avatarModel = 'x-bot',
  theme = 'dark',
  wireframe = false,
  transparent = false,
  hideStage = false,
  cameraMode,
  onSignProgress,
  onModelChange,
  className = '',
  style = {}
}, ref) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const initialPropsRef = useRef({ avatarModel, wireframe, transparent, hideStage, cameraMode, onModelChange, onSignProgress, theme });

  useEffect(() => {
    if (!canvasRef.current) return;

    const initial = initialPropsRef.current;
    // Instantiate Three.js avatar scene with avatarModel ('x-bot', 'y-bot', or 'procedural')
    const sceneInstance = new AvatarScene(canvasRef.current, {
      avatarModel: initial.avatarModel,
      wireframe: initial.wireframe,
      transparent: initial.transparent,
      hideStage: initial.hideStage,
      onModelChange: initial.onModelChange,
      onSignProgress: initial.onSignProgress
    });
    sceneRef.current = sceneInstance;
    if (typeof window !== 'undefined') {
      window.__HASTIVO_SCENE__ = sceneInstance;
    }

    if (initial.cameraMode && typeof sceneInstance.setCameraMode === 'function') {
      sceneInstance.setCameraMode(initial.cameraMode);
    }

    if (initial.onSignProgress && sceneInstance.signingEngine) {
      sceneInstance.signingEngine.onSignProgress = initial.onSignProgress;
    }

    if (typeof sceneInstance.setTheme === 'function') {
      sceneInstance.setTheme(initial.theme);
    }

    // Responsive ResizeObserver
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          sceneInstance.resize(width, height);
        }
      }
    });

    if (canvasRef.current.parentElement) {
      observer.observe(canvasRef.current.parentElement);
    }

    // WebGL Context Loss & Recovery (SIG-022)
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('[AvatarCanvas] WebGL context lost. Suspending render loop.');
    };

    const handleContextRestored = () => {
      console.info('[AvatarCanvas] WebGL context restored. Rebuilding avatar scene.');
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
      if (canvasRef.current) {
        sceneRef.current = new AvatarScene(canvasRef.current, {
          avatarModel: initial.avatarModel,
          wireframe: initial.wireframe,
          transparent: initial.transparent,
          hideStage: initial.hideStage,
          onModelChange: initial.onModelChange,
          onSignProgress: initial.onSignProgress
        });
      }
    };

    const canvasDom = canvasRef.current;
    canvasDom.addEventListener('webglcontextlost', handleContextLost, false);
    canvasDom.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvasDom.removeEventListener('webglcontextlost', handleContextLost);
      canvasDom.removeEventListener('webglcontextrestored', handleContextRestored);
      observer.disconnect();
      sceneInstance.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Sync theme changes
  useEffect(() => {
    if (sceneRef.current && typeof sceneRef.current.setTheme === 'function') {
      sceneRef.current.setTheme(theme);
    }
  }, [theme]);

  // Sync wireframe changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setWireframe(wireframe);
    }
  }, [wireframe]);

  // Sync progress callback
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.onSignProgress = onSignProgress;
      if (sceneRef.current.signingEngine) {
        sceneRef.current.signingEngine.onSignProgress = onSignProgress;
      }
    }
  }, [onSignProgress]);

  // Sync model changes
  useEffect(() => {
    if (sceneRef.current && avatarModel) {
      sceneRef.current.switchAvatar(avatarModel);
    }
  }, [avatarModel]);

  // Sync camera mode
  useEffect(() => {
    if (sceneRef.current && cameraMode) {
      sceneRef.current.setCameraMode(cameraMode);
    }
  }, [cameraMode]);

  // Expose clean imperative public API
  useImperativeHandle(ref, () => ({
    switchAvatar: (modelId) => sceneRef.current?.switchAvatar(modelId),
    getAvatarModel: () => sceneRef.current?.currentModelType || avatarModel,
    isModelLoading: () => sceneRef.current?.isModelLoading || false,
    playAnimation: (name) => {
      if (sceneRef.current?.animationController) {
        sceneRef.current.animationController.playAnimation(name);
      }
    },
    playSign: (signId) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playSign(signId);
      }
    },
    playSequence: (signIds) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playSequence(signIds);
      }
    },
    playFingerspelling: (text, speed, side) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playFingerspelling(text, speed, side);
      }
    },
    playNumber: (num, side) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playNumber(num, side);
      }
    },
    playDefaultSign: (side) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playDefaultSign(side);
      }
    },
    setDefaultSide: (side) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.setDefaultSide(side);
      }
    },
    setOuterLayerCoating: (color, options) => {
      sceneRef.current?.setOuterLayerCoating(color, options);
    },
    setExpression: (expression) => {
      if (sceneRef.current?.avatar?.facialController) {
        sceneRef.current.avatar.facialController.setExpression(expression);
      }
    },
    setPlaybackSpeed: (speed) => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.playbackSpeed = speed;
      }
      if (sceneRef.current?.animationController) {
        sceneRef.current.animationController.playbackSpeed = speed;
      }
    },
    resetPose: () => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.stop();
      }
      if (sceneRef.current?.animationController) {
        sceneRef.current.animationController.resetPose();
      }
    },
    stop: () => {
      if (sceneRef.current?.signingEngine) {
        sceneRef.current.signingEngine.stop();
      }
      if (sceneRef.current?.animationController) {
        sceneRef.current.animationController.resetPose();
      }
    },
    setCameraMode: (mode) => {
      if (sceneRef.current?.setCameraMode) {
        sceneRef.current.setCameraMode(mode);
      }
    },
    getStats: () => {
      return {
        fps: sceneRef.current?.fps || 60,
        drawCalls: sceneRef.current?.drawCalls || 0
      };
    },
    pause: () => {
      sceneRef.current?.pause?.();
    },
    resume: () => {
      sceneRef.current?.resume?.();
    },
    getAvatar: () => sceneRef.current?.avatar,
    getScene: () => sceneRef.current
  }), [avatarModel]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'inherit',
        backgroundColor: '#000000',
        ...style
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          outline: 'none'
        }}
      />
    </div>
  );
});

export default AvatarCanvas;
