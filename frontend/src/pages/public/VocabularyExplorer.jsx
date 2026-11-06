import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, EditorialHeader, CardlessBadge, CardlessButton, SectionDivider, SwissGrid, SwissCol } from '../../components/cardless/CardlessComponents';
import { AvatarViewer } from '../../components/avatar/AvatarViewer.jsx';
import AvatarGuide from '../../components/common/AvatarGuide';
import config from '../../config/env';

/**
 * Hastivo — ISL Vocabulary Explorer
 * Vision Pro / Swiss Editorial Cardless Architecture
 */
export default function VocabularyExplorer() {
  const [lexicon, setLexicon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSign, setSelectedSign] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const avatarViewerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLexicon() {
      setLoading(true);
      try {
        const res = await fetch(`${config.apiBaseUrl}/api/v1/avatar/signs`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const list = data.lexicon || [];
            setLexicon(list);
            if (list.length > 0) setSelectedSign(list[0]);
          }
        }
      } catch {
        if (isMounted) setLexicon([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLexicon();
    return () => { isMounted = false; };
  }, []);

  const filteredLexicon = lexicon.filter((item) => {
    const gloss = item.gloss || item.key || '';
    const matchesSearch = gloss.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type?.toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  const handlePlaySign = (sign) => {
    setSelectedSign(sign);
    const poseKey = sign.pose || sign.kinematicPose || `SIGN_${sign.gloss || sign.key}`;
    avatarViewerRef.current?.playSign(poseKey);
  };

  return (
    <PageContainer maxWidth="1400px">
      <EditorialHeader
        eyebrow="LEXICAL REPERTOIRE"
        title="ISL Vocabulary Explorer"
        subtitle="Official Indian Sign Language kinematic catalog. Inspect joint rotation metadata, duration timing, and preview expressions live on the 3D humanoid avatar."
        meta={<CardlessBadge color="blue">{lexicon.length} VERIFIED PHONEMES</CardlessBadge>}
      />

      <AvatarGuide
        featureName="Kinematic Gesture Catalog"
        description="Browse certified Indian Sign Language gestures. Selecting any vocabulary entry triggers real-time 3D skeletal deformation on the interactive rig."
        pose="pointing"
      />

      <SectionDivider index="01" label="SPATIAL LEXICON RUNWAY & STAGE" />

      {/* 2-Column Swiss Asymmetric Workspace */}
      <SwissGrid columns={12} gap="clamp(24px, 4vw, 48px)">
        {/* Left Column: Search & Glossary List (5 cols) */}
        <SwissCol span={5}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search gestures by keyword (e.g. HELLO, WATER, HELP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['ALL', 'GESTURE', 'POINT', 'NOD', 'SHAKE', 'QUESTION', 'NUMBER'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '2px',
                  border: '1px solid var(--border)',
                  background: filterType === type ? 'var(--color-coral)' : 'transparent',
                  color: filterType === type ? '#fff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Lexicon Open List (Cardless) */}
          <div
            style={{
              maxHeight: '560px',
              overflowY: 'auto',
              borderTop: '1px solid var(--border-subtle, var(--border))',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
            }}
          >
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Loading ISL vocabulary...
              </div>
            ) : filteredLexicon.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No gestures matched your search query.
              </div>
            ) : (
              filteredLexicon.map((sign) => {
                const isSelected = selectedSign?.gloss === sign.gloss;
                return (
                  <div
                    key={sign.gloss || sign.key}
                    onClick={() => handlePlaySign(sign)}
                    style={{
                      padding: '14px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle, var(--border))',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--background-secondary)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--color-coral)' : '3px solid transparent',
                      paddingLeft: isSelected ? '12px' : '8px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {sign.gloss || sign.key}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {sign.hand === 'BOTH' ? 'Bimanual' : 'Single Right'} &bull; {sign.type}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--color-blue)' }}>
                        {sign.duration ? `${sign.duration}ms` : 'Standard'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SwissCol>

        {/* Right Column: Avatar Stage & Sign Inspector (7 cols) */}
        <SwissCol span={7}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--color-coral)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                [ SPATIAL RECEPTOR ]
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                Kinematic Playback Stage
              </h3>
            </div>
            {selectedSign && (
              <CardlessButton
                variant="primary"
                size="sm"
                onClick={() => handlePlaySign(selectedSign)}
              >
                ▶ Replay Gesture
              </CardlessButton>
            )}
          </div>

          {/* Full Bleed Avatar Stage Container */}
          <div
            style={{
              width: '100%',
              borderRadius: '4px',
              overflow: 'hidden',
              background: 'var(--background-secondary)',
              border: '1px solid var(--border-subtle, var(--border))',
              position: 'relative',
            }}
          >
            <AvatarViewer
              ref={avatarViewerRef}
              height="480px"
              showControls={true}
              showCaptions={true}
            />
          </div>

          {/* Selected Sign Details Strip (Open Swiss Data Row) */}
          {selectedSign && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-subtle, var(--border))',
                borderBottom: '1px solid var(--border-subtle, var(--border))',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  POSE ID
                </span>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedSign.pose || `SIGN_${selectedSign.gloss}`}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  HANDS
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-coral)', marginTop: '4px' }}>
                  {selectedSign.hand === 'BOTH' ? 'Bimanual' : 'Single Right'}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  FACIAL EXPRESSION
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', textTransform: 'capitalize' }}>
                  {selectedSign.emotion || 'Neutral'}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  HOLD DURATION
                </span>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-blue)', marginTop: '4px' }}>
                  {selectedSign.duration || 850} ms
                </div>
              </div>
            </div>
          )}
        </SwissCol>
      </SwissGrid>
    </PageContainer>
  );
}
