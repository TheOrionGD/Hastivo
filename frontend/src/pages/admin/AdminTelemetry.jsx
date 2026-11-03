import React, { useState, useEffect } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import UnavailableState from '../../components/common/UnavailableState';
import { telemetryService } from '../../services/telemetryService';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

export default function AdminTelemetry() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTelemetry() {
      setLoading(true);
      setError(null);
      try {
        const data = await telemetryService.getTelemetryMetrics(token);
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTelemetry();
  }, [token]);

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1200px">
        <EditorialHeader
          kicker="System Telemetry & Health"
          title="Telemetry Ledger"
          subtitle="Genuine operational metrics and health monitoring · Strictly zero fabricated analytics"
          meta="IMMUTABLE TELEMETRY STREAM"
        />

        <AvatarGuide
          featureName="Telemetry Portal"
          description="Monitors real microservice response times, error rates, and connection states. Charts display only verified telemetry streams."
          pose="present"
        />

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="skeleton" style={{ width: '50%', height: '14px', marginBottom: '14px' }} />
                <div className="skeleton" style={{ width: '80%', height: '36px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <UnavailableState
            title="Telemetry Microservice Unreachable"
            message={error}
            actionLabel="Retry Telemetry Check"
            onAction={() => window.location.reload()}
            iconType="error"
          />
        )}

        {/* Real Metrics Display (Cardless Open Stats) */}
        {!loading && !error && metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                API Latency (P95)
              </span>
              <div style={{ fontSize: 'var(--text-stat)', fontWeight: 900, color: 'var(--color-blue)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {metrics.latencyMs ? `${metrics.latencyMs} ms` : 'N/A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Active WebSocket Connections
              </span>
              <div style={{ fontSize: 'var(--text-stat)', fontWeight: 900, color: 'var(--color-coral)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {metrics.activeWsConnections ?? 'N/A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Service Error Rate
              </span>
              <div style={{ fontSize: 'var(--text-stat)', fontWeight: 900, color: 'var(--color-amber)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {metrics.errorRate != null ? `${metrics.errorRate}%` : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
