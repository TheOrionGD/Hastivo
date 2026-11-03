import React from 'react';

export default function Privacy() {
  return (
    <div className="page-wrapper">
      <main className="container" style={{ maxWidth: '800px', margin: '48px auto', padding: '0 20px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.4rem',
            fontWeight: 800,
            marginBottom: '8px',
          }}
        >
          Signora Privacy Policy & Data Architecture
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Technical integrity report &bull; Subject to formal institutional audit
        </p>

        {/* Notice on Unverified Claims */}
        <div
          style={{
            background: 'rgba(255,193,7,0.15)',
            borderLeft: '4px solid var(--color-amber)',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '32px',
          }}
        >
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
            Technical Verification Notice
          </strong>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Earlier documentation referenced a "Zero-Cloud Camera Privacy" guarantee. Per development governance rules, this claim is undergoing rigorous network trace analysis and is pending final confirmation before being advertised as an absolute guarantee.
          </p>
        </div>

        {/* Section 1: Camera & Computer Vision Data */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
            1. Camera Input and Vision Processing
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Camera permissions are requested solely upon explicit user action within the Sign-to-Text Studio and Real-Time Conversation modules. MediaPipe landmark detection extracts coordinate keypoints. When cloud-based sign-recognition microservices are active, landmark streams or approved clips may be processed in accordance with service configurations.
          </p>
        </section>

        {/* Section 2: Audio & Microphone Data */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
            2. Spoken Audio and Voice Navigation
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            The Global Voice Command Navigation system captures audio only while the user explicitly activates listening. Audio is neither permanently recorded nor stored on device storage for navigation commands. Recognized commands are checked against approved route permissions and promptly discarded.
          </p>
        </section>

        {/* Section 3: Authentication and Identity */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
            3. Authentication Credentials
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Authentication is handled via Firebase Authentication and server-side JWT verification. Passwords are never saved in browser local storage or exposed through client renderer logs.
          </p>
        </section>

        {/* Section 4: Data Retention & MongoDB */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
            4. Persistence and Storage
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            User theme preferences and conversation history records are persisted in MongoDB backend services only when configured. If backend services are disconnected, local transient state is preserved without fabricating database synchronization.
          </p>
        </section>
      </main>
    </div>
  );
}
