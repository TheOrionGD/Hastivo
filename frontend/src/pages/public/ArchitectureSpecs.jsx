import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, CardlessBadge, SectionDivider } from '../../components/cardless/CardlessComponents';
import AvatarGuide from '../../components/common/AvatarGuide';

/**
 * Hastivo AI — Architecture & Engineering Specifications
 * Editorial Swiss documentation page exposing certified subsystem topologies,
 * data flow pipelines, security boundaries, and microservice definitions.
 */
export default function ArchitectureSpecs() {
  const subsystems = [
    {
      num: '01',
      title: 'Core Gateway & Authentication',
      runtime: 'Node.js 20+ / Express 4',
      port: '5000',
      description: 'Central API gateway enforcing JWT authorization, rate-limiting, and REST contracts for citizen and admin roles.',
    },
    {
      num: '02',
      title: 'AI Language & Morphology Engine',
      runtime: 'Python 3.10+ / FastAPI / Uvicorn',
      port: '8000',
      description: 'Linguistic parsing pipeline translating English/regional text into ISL SOV/TSOV grammar and synthesizing sentences from recognized signs.',
    },
    {
      num: '03',
      title: 'Computer Vision & Landmark Tracking',
      runtime: 'Python 3.10+ / OpenCV / MediaPipe',
      port: '8001',
      description: 'Real-time webcam pipeline extracting 21 3D hand landmarks per hand with sub-100ms inference for dynamic ISL gesture classification.',
    },
    {
      num: '04',
      title: 'Duplex WebSockets Microservice',
      runtime: 'Node.js 20+ / ws / Brevo Relay',
      port: '5002',
      description: 'Low-latency bidirectional room signaling broker enabling synchronized sign-to-voice and voice-to-sign communication.',
    },
    {
      num: '05',
      title: 'Frontend 3D Avatar Client',
      runtime: 'React 19 / Three.js / WebGL 2',
      port: '5173',
      description: 'Client-side editorial presentation layer animating Mixamo X-Bot and Y-Bot humanoid rigs with 65 bones and PBR shaders.',
    },
  ];

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1100px">
        {/* Editorial Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-coral)' }}>
              05 // SYSTEM TOPOLOGY
            </span>
            <CardlessBadge color="blue">Distributed Architecture</CardlessBadge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
            Architecture & Engineering Specs
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '780px', lineHeight: 1.6 }}>
            Comprehensive architectural blueprints, microservice contracts, and air-gapped security boundaries governing the Hastivo AI platform.
          </p>
        </div>

        <AvatarGuide
          featureName="System Topology & Contracts"
          description="Every microservice in Hastivo operates under zero-mock verification. Review live communication ports, runtimes, and air-gapped privacy boundaries below."
          pose="presenting"
        />

        <SectionDivider />

        {/* Subsystem Specifications List */}
        <div style={{ marginTop: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Microservice Subsystems & Communication Ports
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {subsystems.map((sub) => (
              <div
                key={sub.num}
                style={{
                  padding: '20px 24px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--surface, var(--bg-primary))',
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 220px',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-coral)' }}>
                  {sub.num}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {sub.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sub.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-blue)' }}>
                    Port :{sub.port}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {sub.runtime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Data Flow Callout */}
        <div
          style={{
            marginTop: '36px',
            padding: '24px',
            borderLeft: '4px solid var(--color-coral)',
            background: 'var(--surface-elevated, var(--bg-secondary))',
            borderRadius: '0 var(--radius-control) var(--radius-control) 0',
          }}
        >
          <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Zero-Cloud Video Retention & Edge Privacy Guarantee
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Camera video frames are processed exclusively inside ephemeral in-memory buffers within the client and the local Computer Vision worker. Video frames are immediately released post-inference; raw imagery is never persisted to disk or cloud telemetry stores.
          </p>
        </div>

        <div style={{ marginTop: '36px' }}>
          <Link
            to="/landing"
            style={{
              color: 'var(--color-blue)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            ← Return to Overview
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
