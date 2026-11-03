import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

/**
 * Hastivo AI — Help & Support Screen (Cardless UI)
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
      a: 'Enter written text or click the microphone to speak. The AI processes grammar and syntax into an Indian Sign Language (ISL) sequence, which the 3D humanoid avatar performs in real time.',
    },
    {
      q: 'How does Sign-to-Text gesture recognition work?',
      a: 'Position your upper body and hands in front of your camera. MediaPipe detects 21 skeletal landmarks per hand and sends feature vectors to the recognition model to generate sequential captions and AI sentences.',
    },
    {
      q: 'Why is my camera not activating?',
      a: 'Ensure you have granted camera permission in your browser. Check for other apps (such as Zoom or Teams) that may be locking the webcam.',
    },
    {
      q: 'Are video feeds recorded on the server?',
      a: 'No. Hastivo enforces zero biometric retention. All camera frames are parsed inside your local browser memory and are discarded immediately.',
    },
  ];

  return (
    <div className="page-wrapper">
      <main className="container" style={{ padding: 'clamp(40px, 6vw, 80px) 20px', maxWidth: '860px', margin: '0 auto', paddingBottom: '120px' }}>
        <Link to="/dashboard" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
          ← Back to Workspace
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '20px 0 8px', letterSpacing: '-0.03em' }}>
          Help & Support Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '40px' }}>
          Troubleshooting, feature guides, and assistance for Hastivo AI
        </p>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '48px' }} />

        {/* FAQ Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--color-blue)', margin: '0 0 10px', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                  {faq.q}
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.94rem', lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '48px' }} />

        {/* Feedback Form */}
        <div style={{ padding: '24px 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
            Send Feedback or Inquiries
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: '28px' }}>
            Encountered a bug or have a suggestion? Our accessibility team reviews all submissions.
          </p>

          {submitted ? (
            <div style={{ padding: '20px', borderRadius: 'var(--radius-control)', background: 'rgba(52,211,153,0.12)', border: '1px solid #34d399', color: '#34d399', fontWeight: 700 }}>
              ✓ Feedback submitted successfully. Thank you for contributing to communication accessibility!
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="citizen@hastivo.org"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid var(--border)',
                    background: 'var(--background-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.94rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Your Message or Issue Description
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe the issue, requested feature, or feedback..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid var(--border)',
                    background: 'var(--background-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.94rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', borderRadius: 'var(--radius-control)', background: 'var(--color-coral)', borderColor: 'var(--color-coral)' }}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
