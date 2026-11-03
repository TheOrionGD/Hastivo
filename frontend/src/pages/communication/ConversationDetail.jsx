import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { AvatarCanvas } from '../../components/avatar/AvatarCanvas';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Hastivo AI — Conversation Detail Screen (Cardless Redesign)
 * Master Specification Section 4.9 & SRS Section 12.6:
 * - Original input, recognized content, AI-generated sentence.
 * - Translation direction, language metadata, timestamp.
 * - 3D avatar gesture replay controls.
 * - Speech audio replay controls.
 * - Cardless conversation timeline stream.
 * - Delete record action with confirmation.
 */
export default function ConversationDetail() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyCoralError } = useNotification();

  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const formattedDate = record?.timestamp ? new Date(record.timestamp).toLocaleString() : '';

  useEffect(() => {
    const loadConversation = async () => {
      try {
        if (config.isConfigured.api) {
          const res = await fetch(`${config.apiBaseUrl}/api/v1/conversations/${conversationId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.conversation) {
              setRecord(data.conversation);
              return;
            }
          }
          const listRes = await fetch(`${config.apiBaseUrl}/api/v1/conversations/history`);
          if (listRes.ok) {
            const list = await listRes.json();
            const found = list.find((c) => c.id === conversationId);
            if (found) {
              setRecord(found);
              return;
            }
          }
        }
        setRecord(null);
      } catch (err) {
        notifyCoralError(`Could not retrieve conversation details: ${err.message || 'Network error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, notifyCoralError]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this conversation record? This action cannot be undone.')) {
      return;
    }

    try {
      if (config.isConfigured.api) {
        await fetch(`${config.apiBaseUrl}/api/v1/conversations/${conversationId}`, {
          method: 'DELETE',
        });
      }
      notifySuccess('Conversation deleted.');
      navigate('/history');
    } catch {
      notifyCoralError('Failed to delete conversation.');
    }
  };

  const handlePlaySpeech = () => {
    if ('speechSynthesis' in window && record?.aiGeneratedSentence) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(record.aiGeneratedSentence);
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      notifyCoralError('Speech synthesis unavailable in this browser.');
    }
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <PageContainer>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '64px 0' }}>
            Loading verified conversation records...
          </p>
        </PageContainer>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="page-wrapper">
        <PageContainer>
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h2 className="cardless-title">Conversation Not Found</h2>
            <Link to="/history" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
              &larr; Return to Conversation History
            </Link>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1280px">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '28px' }}>
          <Link
            to="/history"
            style={{
              color: 'var(--color-blue)',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            &larr; Return to Conversation History
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CardlessBadge color="coral">{record.direction || 'ISL Translation'}</CardlessBadge>
                {formattedDate && (
                  <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                    Recorded on {formattedDate}
                  </span>
                )}
              </div>
              <h1 className="cardless-title" style={{ margin: 0 }}>
                {record.title}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CardlessButton variant="danger" size="sm" onClick={handleDelete}>
                🗑️ Delete Record
              </CardlessButton>
            </div>
          </div>
        </div>

        <SectionDivider spacing="24px" />

        {/* ── 2-Column Split: Left Metadata & Text, Right 3D Avatar Replay & Messages ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Metadata & Transcripts */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Session Metadata Key-Value List */}
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px', color: 'var(--text-primary)' }}>
                Session Metadata
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>Translation Mode:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{record.direction || record.type}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>Duration:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{record.duration || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>Source Language:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{record.sourceLanguage || 'English'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.78rem' }}>Target Language:</span>
                  <strong style={{ color: 'var(--color-blue)' }}>{record.targetSignLanguage || 'ISL'}</strong>
                </div>
              </div>
            </div>

            {/* Original Input */}
            <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Original Input Transcript
              </span>
              <p style={{ margin: 0, fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {record.originalInput || 'Original input captured during two-way session.'}
              </p>
            </div>

            {/* AI-Generated Output & Speech Replay */}
            <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                AI-Generated Output & Captions
              </span>
              <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {record.aiGeneratedSentence || 'AI translation generated.'}
              </p>

              <CardlessButton
                variant="secondary"
                size="md"
                disabled={isPlayingAudio}
                onClick={handlePlaySpeech}
              >
                {isPlayingAudio ? '🔊 Playing Audio...' : '▶ Replay Synthesized Audio'}
              </CardlessButton>
            </div>
          </div>

          {/* Right Column: 3D Avatar Replay Stage & Message Sequence */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 3D Avatar Replay Viewport */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                  3D Sign Avatar Playback
                </span>
                <CardlessBadge color="coral">Kinematic Replay</CardlessBadge>
              </div>

              <div
                style={{
                  height: '320px',
                  position: 'relative',
                  background: 'transparent',
                  borderRadius: 'var(--radius-control)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle, var(--border))',
                }}
              >
                <AvatarCanvas animName={isPlayingAvatar ? 'defaultSign' : 'idle'} />
              </div>

              <div style={{ marginTop: '12px' }}>
                <CardlessButton
                  variant="primary"
                  size="md"
                  onClick={() => setIsPlayingAvatar(!isPlayingAvatar)}
                  style={{ width: '100%' }}
                >
                  {isPlayingAvatar ? '⏸ Pause Avatar Gestures' : '▶ Replay 3D Avatar Sign Sequence'}
                </CardlessButton>
              </div>
            </div>

            {/* Conversation Sequence Timeline */}
            {record.messages && record.messages.length > 0 && (
              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                  Sequential Conversation Timeline
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {record.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-subtle, var(--border))',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: msg.sender === 'user' ? 'var(--color-blue)' : 'var(--color-coral)',
                          }}
                        >
                          {msg.sender === 'user' ? 'Participant A (Speech / Text)' : 'Participant B (Avatar / Sign)'}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          {msg.time}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
