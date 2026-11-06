import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { AvatarCanvas } from '../../components/avatar/AvatarCanvas';
import { PageContainer, EditorialHeader, CardlessBadge, CardlessButton, SectionDivider, SwissGrid, SwissCol } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Hastivo — Conversation Detail (Vision Pro / Swiss Editorial Cardless Architecture)
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
      <PageContainer>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '64px 0', fontFamily: 'var(--font-mono, monospace)' }}>
          [ ACCESSING VERIFIED TRANSACTION LEDGER... ]
        </p>
      </PageContainer>
    );
  }

  if (!record) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Conversation Record Not Found</h2>
          <Link to="/history" style={{ textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
            <CardlessButton variant="primary" size="sm">
              &larr; Return to Conversation History
            </CardlessButton>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="1300px">
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/history"
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
          &larr; [ RETURN TO HISTORY LEDGER ]
        </Link>
      </div>

      <EditorialHeader
        eyebrow="SESSION ARTIFACT"
        title={record.title || `Session #${record.id}`}
        subtitle={`Recorded on ${formattedDate || 'Audit Window'}`}
        meta={<CardlessBadge color="coral">{record.direction || 'ISL Duplex Translation'}</CardlessBadge>}
        actions={
          <CardlessButton variant="danger" size="sm" onClick={handleDelete}>
            🗑️ Delete Record
          </CardlessButton>
        }
      />

      <SectionDivider index="01" label="TRANSCRIPT & METADATA" />

      {/* 2-Column Swiss Asymmetric Grid */}
      <SwissGrid columns={12} gap="clamp(28px, 4vw, 56px)">
        {/* Left Column: Metadata & Transcripts (6 cols) */}
        <SwissCol span={6}>
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-coral)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              [ RUNTIME TELEMETRY ]
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>TRANSLATION MODE:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{record.direction || record.type}</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>SESSION DURATION:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{record.duration || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>SOURCE INGEST:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{record.sourceLanguage || 'English'}</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>TARGET SYNTHESIS:</span>
                <div style={{ fontWeight: 600, color: 'var(--color-blue)', marginTop: '2px' }}>{record.targetSignLanguage || 'ISL'}</div>
              </div>
            </div>
          </div>

          {/* Original Input */}
          <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              [ ORIGINAL SOURCE INGEST ]
            </span>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {record.originalInput || 'Original acoustic or gesture stream captured during duplex session.'}
            </p>
          </div>

          {/* AI-Generated Output & Speech Replay */}
          <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-blue)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              [ SYNTHESIZED CAPTIONS & GRAMMAR ]
            </span>
            <p style={{ margin: '0 0 20px', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {record.aiGeneratedSentence || 'AI translation generated.'}
            </p>

            <CardlessButton
              variant="secondary"
              size="md"
              disabled={isPlayingAudio}
              onClick={handlePlaySpeech}
            >
              {isPlayingAudio ? '🔊 Transmitting Audio...' : '▶ Replay Synthesized Audio'}
            </CardlessButton>
          </div>
        </SwissCol>

        {/* Right Column: 3D Avatar Stage & Sequential Timeline (6 cols) */}
        <SwissCol span={6}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-coral)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              [ 3D AVATAR KINEMATICS ]
            </span>
            <CardlessBadge color="coral">60 FPS PROCEDURAL</CardlessBadge>
          </div>

          <div
            style={{
              height: '340px',
              position: 'relative',
              background: 'var(--background-secondary)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, var(--border))',
            }}
          >
            <AvatarCanvas animName={isPlayingAvatar ? 'defaultSign' : 'idle'} />
          </div>

          <div style={{ marginTop: '14px' }}>
            <CardlessButton
              variant="primary"
              size="md"
              onClick={() => setIsPlayingAvatar(!isPlayingAvatar)}
              style={{ width: '100%' }}
            >
              {isPlayingAvatar ? '⏸ Pause Avatar Gestures' : '▶ Replay 3D Avatar Sign Sequence'}
            </CardlessButton>
          </div>

          {/* Conversation Sequence Timeline */}
          {record.messages && record.messages.length > 0 && (
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                [ CHRONOLOGICAL MESSAGE SEQUENCING ]
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
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
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: msg.sender === 'user' ? 'var(--color-blue)' : 'var(--color-coral)',
                        }}
                      >
                        {msg.sender === 'user' ? 'Participant A (Voice/Text)' : 'Participant B (Avatar/Sign)'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
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
        </SwissCol>
      </SwissGrid>
    </PageContainer>
  );
}
