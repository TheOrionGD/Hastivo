import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, EditorialHeader, SectionDivider, CardlessBadge } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Terms & Conditions (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function Terms() {
  return (
    <PageContainer maxWidth="1000px">
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
        eyebrow="SERVICE GOVERNANCE"
        title="Terms of Service"
        subtitle="Operational standards, AI moderation agreements, and acceptable usage framework."
        meta={<CardlessBadge color="coral">EFFECTIVE NOV 2026</CardlessBadge>}
      />

      <SectionDivider index="01" label="ACCEPTABLE USAGE & INTENT" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-coral)' }}>
          01
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Assistive Communication Intent
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-coral)', letterSpacing: '0.1em' }}>
            [ ETHICAL PROTOCOL ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          Hastivo is designed exclusively to bridge communication barriers between sign-language users and spoken-language communicators. Users agree not to misuse the duplex transmission bridge to inject hostile, harassing, or synthetic deceptive payloads.
        </p>
      </div>

      <SectionDivider index="02" label="AI MODERATION & ENFORCEMENT" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-blue)' }}>
          02
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Real-Time Anomaly Detection
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-blue)', letterSpacing: '0.1em' }}>
            [ AUDIT ENFORCEMENT ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          Algorithmic telemetry flags malicious or offensive gesture sequences. Repeated infractions trigger graduated restrictions (e.g. 24-hour rate limiting or account suspension), with guaranteed appeal routes through the administrator review board.
        </p>
      </div>

      <SectionDivider index="03" label="LIMITATIONS & EMERGENCY USE" />

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(40px, 5vw, 60px) 1.2fr 2fr', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-amber)' }}>
          03
        </span>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Assistive Scope Boundary
          </h4>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.625rem', color: 'var(--color-amber)', letterSpacing: '0.1em' }}>
            [ HUMAN IN THE LOOP ]
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
          Automated translation is an assistive enhancement and must not be used as the single critical authority in emergency, medical triage, or judicial proceedings without human certified sign language interpreter verification.
        </p>
      </div>
    </PageContainer>
  );
}
