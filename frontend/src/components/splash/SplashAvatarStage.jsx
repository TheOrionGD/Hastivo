import React, { useEffect, useRef } from 'react';
import { AvatarCanvas } from '../avatar/AvatarCanvas.jsx';

/**
 * SplashAvatarStage
 * Large humanoid robot presentation matching Image 2 reference.
 * 
 * - Seamless cinematic backdrop with soft cool rim lighting
 * - Live Three.js humanoid avatar waving/performing dynamic welcome action
 * - Interactive model switching (V-Bot)
 */
export default function SplashAvatarStage({
  activeModel = 'v-bot',
  initialAnimation = 'wave',
  onAvatarStatusChange
}) {
  const avatarCanvasRef = useRef(null);

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
          initialAnimation={initialAnimation}
          rimLightColor={0x7CA4D8}
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
