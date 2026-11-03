import React, { useEffect, useRef, useState } from 'react';
import { AvatarCanvas } from '../avatar/AvatarCanvas.jsx';

/**
 * SplashAvatarStage
 * Large humanoid robot presentation matching Image 2 reference.
 * 
 * - Seamless cinematic backdrop with coral and blue rim lighting
 * - Live Three.js humanoid avatar with camera framed for upper body & thighs/legs
 * - Interactive model switching (X-Bot / Y-Bot)
 */
export default function SplashAvatarStage({ activeModel = 'x-bot', onAvatarStatusChange }) {
  const avatarCanvasRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (avatarCanvasRef.current && activeModel) {
      avatarCanvasRef.current.switchAvatar?.(activeModel);
    }
  }, [activeModel]);

  useEffect(() => {
    if (onAvatarStatusChange) {
      onAvatarStatusChange('AVAILABLE');
    }
  }, [onAvatarStatusChange]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Three.js Avatar Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }}
      >
        <AvatarCanvas
          ref={avatarCanvasRef}
          avatarModel={activeModel}
          cameraMode="splash"
          transparent={true}
          hideStage={true}
          theme="dark"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
          onError={() => setLoadError(true)}
        />
      </div>
    </div>
  );
}
