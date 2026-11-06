import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, EditorialHeader, CardlessBadge, SectionDivider } from '../../components/cardless/CardlessComponents';
import AvatarGuide from '../../components/common/AvatarGuide';

/**
 * Hastivo — Architecture & Engineering Specifications
 * Vision Pro / Swiss Editorial Cardless Architecture
 */
export default function ArchitectureSpecs() {
  const subsystems = [
    {
      num: '01',
      title: 'Core Gateway & Authentication',
      runtime: 'Node.js 20+ / Express 4',
      port: '5000',
      description: 'Central API gateway enforcing JWT authorization, rate-limiting, and REST contracts for citizen and admin roles.',
      accent: 'var(--color-coral)',
    },
    {
      num: '02',
      title: 'AI Language & Morphology Engine',
      runtime: 'Python 3.10+ / FastAPI / Uvicorn',
      port: '8000',
      description: 'Linguistic parsing pipeline translating English/regional text into ISL SOV/TSOV grammar and synthesizing sentences from recognized signs.',
      accent: 'var(--color-blue)',
    },
    {
      num: '03',
      title: 'Computer Vision & Landmark Tracking',
      runtime: 'Python 3.10+ / OpenCV / MediaPipe',
      port: '8001',
      description: 'Real-time webcam pipeline extracting 21 3D hand landmarks per hand with sub-100ms inference for dynamic ISL gesture classification.',
      accent: 'var(--color-amber)',
    },
    {
      num: '04',
      title: 'Duplex WebSockets Microservice',
      runtime: 'Node.js 20+ / ws / Brevo Relay',
      port: '5002',
      description: 'Low-latency bidirectional room signaling broker enabling synchronized sign-to-voice and voice-to-sign communication.',
      accent: 'var(--color-blue-light)',
    },
    {
      num: '05',
      title: 'Frontend 3D Avatar Client',
      runtime: 'React 19 / Three.js / WebGL 2',
      port: '5173',
      description: 'Client-side editorial presentation layer animating Mixamo V-Bot humanoid rig with 80 bones and GLTF GLB format and PBR shaders.',
      accent: 'var(--color-coral)',
    },
  ];

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
        eyebrow="DISTRIBUTED SYSTEMS TOPOLOGY"
        title="Architecture & Engineering Specs"
        subtitle="Comprehensive architectural blueprints, microservice contracts, and air-gapped security boundaries governing the Hastivo platform."
        meta={<CardlessBadge color="blue">DISTRIBUTED CLUSTER</CardlessBadge>}
      />

      <AvatarGuide
        featureName="System Topology & Contracts"
        description="Every microservice in Hastivo operates under verified runtime bindings. Review live communication ports, runtimes, and air-gapped privacy boundaries below."
        pose="presenting"
      />

      <SectionDivider index="01" label="MICROSERVICE SUBSYSTEMS & COMMUNICATION PORTS" />

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '40px' }}>
        {subsystems.map((sub) => (
          <div
            key={sub.num}
            style={{
              padding: '24px 0',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
              display: 'grid',
              gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1fr 200px',
              gap: '24px',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1rem', fontWeight: 800, color: sub.accent }}>
              {sub.num}
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {sub.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {sub.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-blue)' }}>
                PORT :{sub.port}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {sub.runtime}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionDivider index="02" label="SECURITY & DATA FLOW CALLOUT" />

      <div
        style={{
          padding: '24px',
          borderLeft: '3px solid var(--color-coral)',
          background: 'var(--background-secondary)',
          margin: '20px 0 40px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--color-coral)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          [ ZERO-CLOUD VIDEO RETENTION & EDGE PRIVACY ]
        </span>
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Camera video frames are processed exclusively inside ephemeral in-memory buffers within the client and local Computer Vision worker. Video frames are immediately released post-inference; raw imagery is never persisted to disk or cloud telemetry stores.
        </p>
      </div>
    </PageContainer>
  );
}
