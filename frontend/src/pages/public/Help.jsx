import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, EditorialHeader, SectionDivider, SwissGrid, SwissCol, CardlessButton, CardlessBadge } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Help & Support (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function Help() {
  const { notifySuccess } = useNotification();
  const [feedback, setFeedback] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    notifySuccess('Thank you! Your feedback has been received.');
  };

  const FAQS = [
    {
      q: 'How does Text-to-Sign work?',
      a: 'Enter written text or click the microphone to speak. The AI compiles grammar into an Indian Sign Language (ISL) sequence, which the 3D humanoid avatar animates procedurally in real time.',
      tag: 'SYNTHESIS',
    },
    {
      q: 'How does Sign-to-Text gesture recognition work?',
      a: 'Position your upper body and hands in front of your camera. MediaPipe detects 21 skeletal landmarks per hand and classifies feature vectors to generate sequential captions and synthesized voice playback.',
      tag: 'VISION',
    },
    {
      q: 'Why is my camera not activating?',
      a: 'Ensure you have granted camera permission in your browser settings. Check that no other background application (e.g. Zoom, Teams) has locked the webcam stream.',
      tag: 'HARDWARE',
    },
    {
      q: 'Are video feeds recorded or stored on any server?',
      a: 'No. Hastivo strictly enforces zero biometric retention. All camera frames are parsed inside your local browser memory and discarded immediately frame-by-frame.',
      tag: 'PRIVACY',
    },
  ];

  return (
    <PageContainer maxWidth="1100px">
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/dashboard"
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
          &larr; [ BACK TO WORKSPACE ]
        </Link>
      </div>

      <EditorialHeader
        eyebrow="DOCUMENTATION & SUPPORT"
        title="Help & Knowledge Base"
        subtitle="Troubleshooting, hardware permissions, and operational guides for the Hastivo spatial platform."
        meta={<CardlessBadge color="coral">ASSISTANCE 24/7</CardlessBadge>}
      />

      <SectionDivider index="01" label="FREQUENTLY ASKED QUESTIONS" />

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '48px' }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              padding: '24px 0',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
              display: 'grid',
              gridTemplateColumns: 'clamp(50px, 6vw, 80px) 1.2fr 2fr',
              gap: '24px',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-blue)',
              }}
            >
              0{i + 1}
            </span>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {faq.q}
              </h4>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  color: 'var(--color-blue)',
                  textTransform: 'uppercase',
                }}
              >
                [ {faq.tag} ]
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <SectionDivider index="02" label="DIRECT SUPPORT INQUIRY" />

      <SwissGrid columns={12} gap="40px">
        <SwissCol span={5}>
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
            [ DIRECT DESK ]
          </span>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Send Feedback or Report an Issue
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
            Our engineering team reviews all telemetries and user feedback to expand vocabulary datasets and improve camera stability.
          </p>
        </SwissCol>

        <SwissCol span={7}>
          {submitted ? (
            <div style={{ padding: '32px 0' }}>
              <CardlessBadge color="blue">DISPATCHED</CardlessBadge>
              <h4 style={{ margin: '12px 0 6px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                Feedback Dispatched Successfully
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Thank you for contributing to Hastivo’s continuous refinement.
              </p>
              <CardlessButton variant="ghost" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Note
              </CardlessButton>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Your Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="contact@domain.org"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Diagnostic Message / Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your suggestion, landmark recognition bug, or device specifications..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <CardlessButton variant="primary" size="md" type="submit">
                  Dispatch Feedback Note
                </CardlessButton>
              </div>
            </form>
          )}
        </SwissCol>
      </SwissGrid>
    </PageContainer>
  );
}
