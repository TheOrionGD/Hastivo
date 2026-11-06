import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, EditorialHeader, SectionDivider, SwissGrid, SwissCol, CardlessBadge } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — About Platform (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function About() {
  return (
    <PageContainer maxWidth="1100px">
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/landing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-blue)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.04em',
          }}
        >
          &larr; [ BACK TO OVERVIEW ]
        </Link>
      </div>

      <EditorialHeader
        eyebrow="SYSTEM MANIFESTO"
        title={
          <span>
            Hastivo <span style={{ color: 'var(--color-coral)' }}>Spatial Engine</span>
          </span>
        }
        subtitle="Intelligent bidirectional sign-language communication engineered for zero barrier interaction."
        meta={<CardlessBadge color="blue">VERSION 1.0 RELEASE</CardlessBadge>}
      />

      <SectionDivider index="01" label="PLATFORM ARCHITECTURE" />

      <SwissGrid columns={12} gap="40px" style={{ marginBottom: '48px' }}>
        <SwissCol span={4}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.6875rem',
              color: 'var(--color-coral)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            [ PURPOSE & HORIZON ]
          </span>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Bridging Two Worlds
          </h3>
        </SwissCol>
        <SwissCol span={8}>
          <p style={{ margin: '0 0 16px', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Hastivo operates directly on client silicon to eliminate communication friction between Deaf/Hard-of-Hearing signers and hearing non-signers. By fusing spatial computer vision with real-time kinematic humanoid animation, natural language grammar is translated bi-directionally in sub-100ms response cycles.
          </p>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
            Our mission strictly adheres to accessibility standards (WCAG AAA contrast ratings, tactile typography, spatial audio-visual synchronization).
          </p>
        </SwissCol>
      </SwissGrid>

      <SectionDivider index="02" label="CORE CAPABILITIES" />

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '48px' }}>
        {[
          {
            num: '01',
            title: 'Text-to-Sign Humanoid Synthesis',
            tag: '3D KINEMATICS',
            accent: 'var(--color-coral)',
            desc: 'Transforms spoken words or written Indian Sign Language grammar into procedural 3D bone rotations, hand shapes, and facial non-manual expressions.',
          },
          {
            num: '02',
            title: 'Sign-to-Text Spatial Vision',
            tag: 'MEDIAPIPE VISION',
            accent: 'var(--color-blue)',
            desc: 'Processes 21 multi-hand 3D landmarks client-side to classify finger spelling, numericals, and core gesture phonemes into synchronized readable captions.',
          },
          {
            num: '03',
            title: 'Real-Time Duplex Conversation',
            tag: 'SYNCHRONOUS AUDIO/VIDEO',
            accent: 'var(--color-amber)',
            desc: 'Full-duplex stream pairing speech-to-text audio synthesis with real-time gesture detection and sign playback simultaneously.',
          },
          {
            num: '04',
            title: 'Local Contextual AI Compiler',
            tag: 'ZERO LATENCY FALLBACK',
            accent: 'var(--color-blue-light)',
            desc: 'Edge-compiled grammatical heuristics guarantee continuous offline operation even in zero-connectivity environments.',
          },
        ].map((cap, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr',
              gap: '24px',
              alignItems: 'baseline',
              padding: '24px 0',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: cap.accent,
              }}
            >
              {cap.num}
            </span>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {cap.title}
              </h4>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  color: cap.accent,
                  textTransform: 'uppercase',
                }}
              >
                [ {cap.tag} ]
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {cap.desc}
            </p>
          </div>
        ))}
      </div>

      <SectionDivider index="03" label="TECHNOLOGY STACK & INTEGRITY" />

      <SwissGrid columns={12} gap="32px">
        <SwissCol span={6}>
          <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--color-blue)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              [ RUNTIME & RENDERING ]
            </span>
            <h5 style={{ margin: '8px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              React 19 & Three.js WebGL
            </h5>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              Procedural mesh rigging, PBR materials with anisotropic sheen, and hardware-accelerated shaders delivering fluid 60 FPS animation.
            </p>
          </div>
        </SwissCol>
        <SwissCol span={6}>
          <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--color-coral)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              [ INTELLIGENCE & VISION ]
            </span>
            <h5 style={{ margin: '8px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              MediaPipe Vision & Web Speech API
            </h5>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              High-accuracy landmark detection running in-browser with complete client data privacy and native voice synthesis.
            </p>
          </div>
        </SwissCol>
      </SwissGrid>
    </PageContainer>
  );
}
