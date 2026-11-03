import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Hastivo — Terms and Conditions Screen (Cardless UI)
 */
export default function Terms() {
  return (
    <div className="page-wrapper">
      <main className="container" style={{ padding: 'clamp(40px, 6vw, 80px) 20px', maxWidth: '840px', margin: '0 auto', paddingBottom: '120px' }}>
        <Link to="/landing" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
          ← Back to Overview
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '20px 0 8px', letterSpacing: '-0.03em' }}>
          Terms & Conditions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: '40px' }}>
          Effective Date: November 2026 &bull; Version 1.0
        </p>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '48px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: 1.7, fontSize: '0.96rem' }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              1. User Responsibilities & Acceptable Use
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Hastivo is designed to bridge communication barriers between sign-language users and spoken-language communicators. Users agree not to misuse the real-time translation bridge to transmit hateful, harassing, or malicious signals.
            </p>
          </section>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              2. AI Moderation & Restriction Policy
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              AI moderation flags non-standard or hostile gesture postures. Violations may result in a temporary 24-hour block or 7-day account suspension, subject to administrative review and appeal.
            </p>
          </section>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              3. Service Limitations
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Sign language translation is an assistive tool and must not be solely relied upon in life-critical medical, legal, or emergency scenarios without verified human interpreter confirmation.
            </p>
          </section>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <section>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              4. Intellectual Property
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              The 3D humanoid avatar rigs, kinematic animation clips, and Hastivo emblem are proprietary assets protected under international copyright.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
