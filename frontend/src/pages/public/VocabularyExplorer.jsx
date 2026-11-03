import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import { AvatarViewer } from '../../components/avatar/AvatarViewer.jsx';
import AvatarGuide from '../../components/common/AvatarGuide';
import config from '../../config/env';

/**
 * Hastivo — ISL Vocabulary Explorer (Cardless Redesign)
 * Master Specification Section 8.13:
 * - Searchable vocabulary index.
 * - Category / alphabetical navigation.
 * - Selected sign detail and kinematic breakdown.
 * - Large 3D avatar playback stage.
 * - Real lexicon data from AI & backend service without dummy entries.
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
    <div className="page-wrapper">
      <PageContainer maxWidth="1400px">
        {/* Editorial Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-coral)' }}>
              04 // SPECIALIST CATALOG
            </span>
            <CardlessBadge color="blue">{lexicon.length} Verified Gestures</CardlessBadge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
            ISL Vocabulary Explorer
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '780px', lineHeight: 1.6 }}>
            Official Indian Sign Language kinematic catalog. Inspect joint rotation metadata, duration timing, and preview expressions live on the 3D humanoid avatar.
          </p>
        </div>

        <AvatarGuide
          featureName="Kinematic Gesture Catalog"
          description="Browse certified Indian Sign Language gestures. Selecting any vocabulary entry triggers real-time 3D skeletal deformation on the interactive rig."
          pose="pointing"
        />

        <SectionDivider />

        {/* 2-Column Swiss Workspace: Search & Directory on Left, 3D Avatar on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 480px) 1fr', gap: 'clamp(24px, 4vw, 48px)', marginTop: '24px' }}>
          {/* Left Column: Search & Glossary List */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search gestures by keyword (e.g. HELLO, WATER, HELP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-elevated, var(--bg-secondary))',
                  color: 'var(--text-primary)',
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
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    background: filterType === type ? 'var(--color-coral)' : 'transparent',
                    color: filterType === type ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Lexicon List */}
            <div
              style={{
                maxHeight: '520px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-control)',
                background: 'var(--surface, var(--bg-primary))',
              }}
            >
              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Loading ISL vocabulary...
                </div>
              ) : filteredLexicon.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No gestures matched your search.
                </div>
              ) : (
                filteredLexicon.map((sign) => {
                  const isSelected = selectedSign?.gloss === sign.gloss;
                  return (
                    <div
                      key={sign.gloss || sign.key}
                      onClick={() => handlePlaySign(sign)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-subtle, var(--border))',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--surface-elevated, var(--bg-secondary))' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--color-coral)' : '3px solid transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {sign.gloss || sign.key}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {sign.hand === 'BOTH' ? 'Two-Handed' : 'Right-Hand'} &bull; {sign.type}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-blue)' }}>
                          {sign.duration ? `${sign.duration}ms` : 'Standard'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Avatar Stage & Sign Inspector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Live Kinematic Stage
                </h3>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Active Sign: {selectedSign ? selectedSign.gloss || selectedSign.key : 'None'}
                </span>
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

            {/* Avatar Stage */}
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-control)',
                overflow: 'hidden',
                background: 'transparent',
                position: 'relative',
              }}
            >
              <AvatarViewer
                ref={avatarViewerRef}
                height="460px"
                showControls={true}
                showCaptions={true}
              />
            </div>

            {/* Selected Sign Details Strip */}
            {selectedSign && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface, var(--bg-primary))',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Pose ID</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedSign.pose || `SIGN_${selectedSign.gloss}`}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Hands</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-coral)', marginTop: '2px' }}>
                    {selectedSign.hand === 'BOTH' ? 'Bimanual' : 'Single Right'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Emotion</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {selectedSign.emotion || 'Neutral'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-blue)', marginTop: '2px' }}>
                    {selectedSign.duration || 850} ms
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
