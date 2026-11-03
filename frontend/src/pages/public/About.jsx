import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Signora AI — About Screen (Cardless UI)
 */
export default function About() {
  return (
    <div className="page-wrapper">
      <main className="container" style={{ padding: 'clamp(40px, 6vw, 80px) 20px', maxWidth: '860px', margin: '0 auto', paddingBottom: '120px' }}>
        <Link to="/landing" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
          ← Back to Overview
        </Link>

        <div style={{ margin: '40px 0 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-control)', background: 'rgba(111,163,239,0.12)', color: 'var(--color-blue)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Version 1.0 Production Release
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Signora <span style={{ color: 'var(--color-coral)' }}>AI</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-blue)', fontWeight: 600, margin: '0 0 16px', fontFamily: 'var(--font-display)' }}>
            Vibrant Connections Through Language Colors.
          </p>
          <div style={{ height: '1px', background: 'var(--border)', margin: '32px 0 40px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.7 }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 12px', fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              About the Platform
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
              Signora AI is an intelligent bidirectional sign-language communication platform engineered to diminish communication barriers between sign-language users and people who primarily communicate through spoken or written language.
            </p>
          </section>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Core Capabilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              <div>
                <strong style={{ color: 'var(--color-coral)', display: 'block', marginBottom: '6px', fontSize: '1.05rem' }}>Text-to-Sign</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem' }}>
                  Converts typed text or speech into expressive sign-language sequences animated on a 3D avatar.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-blue)', display: 'block', marginBottom: '6px', fontSize: '1.05rem' }}>Sign-to-Text</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem' }}>
                  Recognizes sign-language gestures through standard camera input and translates them to captions and speech.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-amber)', display: 'block', marginBottom: '6px', fontSize: '1.05rem' }}>Real-Time Duplex</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem' }}>
                  Simultaneous two-way communication between spoken voice and sign language.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px', fontSize: '1.05rem' }}>Contextual AI</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem' }}>
                  Grammatical reordering and sentence structuring preserving intended meaning.
                </p>
              </div>
            </div>
          </section>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 12px', fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Technology Acknowledgements
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0 }}>
              Built with React, Three.js, MediaPipe landmark tracking, Web Speech APIs, Express, and Groq language understanding. Designed according to the Signora Software Requirements Specification.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
