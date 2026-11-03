import React, { useState } from 'react';
import { AvatarDevPanel } from '../../components/avatar/AvatarDevPanel.jsx';

export default function AvatarTestingPage() {
  const [currentSignedText, setCurrentSignedText] = useState('Please');

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        backgroundColor: '#090B0F',
        color: '#FFFFFF',
        padding: '24px 20px 100px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Signora 3D Avatar Diagnostics & Rig Testing Suite
          </h1>
          <p style={{ color: '#8E99A8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            X-Bot (Female Bot) & Y-Bot (Male Bot) • Blender FBX 3D Rig • Mixamo 65-Bone Skeleton • 5-Finger Kinematics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-control, 4px)', background: 'rgba(255, 111, 97, 0.12)', border: '1px solid #FF6F61', color: '#FF6F61', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', fontWeight: 700 }}>
            ♀️ X-Bot (Female Bot)
          </span>
          <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-control, 4px)', background: 'rgba(111, 163, 239, 0.12)', border: '1px solid #6FA3EF', color: '#6FA3EF', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', fontWeight: 700 }}>
            ♂️ Y-Bot (Male Bot)
          </span>
          <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-control, 4px)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', color: '#10B981', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem', fontWeight: 600 }}>
            Blender Assets Verified
          </span>

          {/* ISL Currently Signed Word Badge - Right to 3D avatar tags at the top */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              backgroundColor: '#12151A',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              boxShadow: 'none',
              letterSpacing: '0.02em'
            }}
          >
            <span style={{ color: '#FFC107', fontWeight: 800, fontSize: '0.90rem' }}>ISL:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.90rem' }}>{currentSignedText}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <AvatarDevPanel onSignChange={setCurrentSignedText} />
      </div>
    </div>
  );
}
