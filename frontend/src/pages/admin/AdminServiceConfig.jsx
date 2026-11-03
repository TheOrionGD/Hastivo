import React, { useState } from 'react';
import AvatarGuide from '../../components/common/AvatarGuide';
import { configService } from '../../services/configService';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

export default function AdminServiceConfig() {
  const isElectron = configService.isElectron();
  const currentAddress = configService.getCurrentApiAddress();

  const [targetUrl, setTargetUrl] = useState(currentAddress);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const result = await configService.testConnection(targetUrl);
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="960px">
        <EditorialHeader
          kicker="Runtime Infrastructure"
          title="Service Endpoint Configuration"
          subtitle="Inspect runtime API endpoints and perform live connectivity health-checks"
        />

        <AvatarGuide
          featureName="Service Configuration"
          description="Test network connectivity against your backend REST API. In Electron desktop runtimes, endpoint addresses are stored securely within the main process."
          pose="present"
        />

        {/* Runtime Environment Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: '28px',
          }}
        >
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
              Detected Platform Runtime
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isElectron
                ? 'Electron Desktop Runtime (Main process configuration enabled)'
                : 'Web Browser Client (Configuration loaded via public Vite environment)'}
            </span>
          </div>
          <span className={`badge ${isElectron ? 'badge-coral' : 'badge-blue'}`}>
            {isElectron ? 'Electron Desktop' : 'Web Browser'}
          </span>
        </div>

        {/* Configuration Test Section */}
        <div style={{ padding: '32px 0', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            API Base Address
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Current backend endpoint accessed by the frontend service client.
          </p>

          <form onSubmit={handleTestConnection}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="api-url"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}
              >
                Service URL (e.g. <code>https://api.hastivo.org</code> or <code>http://localhost:5000</code>)
              </label>
              <input
                id="api-url"
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://api.hastivo.org"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={testing}
                className="btn btn-primary"
              >
                {testing ? 'Testing Health Endpoint...' : 'Perform Connection Test'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetUrl(currentAddress);
                  setTestResult(null);
                }}
                className="btn btn-ghost"
              >
                Reset to Current
              </button>
            </div>
          </form>

          {/* Test Results Display */}
          {testResult && (
            <div
              style={{
                marginTop: '24px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-control)',
                background:
                  testResult.status === 'REACHABLE'
                    ? 'rgba(111, 163, 239, 0.12)'
                    : 'rgba(255, 111, 97, 0.12)',
                border: `1px solid ${
                  testResult.status === 'REACHABLE'
                    ? 'var(--brand-blue)'
                    : 'var(--brand-coral)'
                }`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background:
                      testResult.status === 'REACHABLE'
                        ? 'var(--brand-blue)'
                        : 'var(--brand-coral)',
                  }}
                />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Result: {testResult.status}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {testResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Security Separation Notice */}
        <div
          style={{
            padding: '24px 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Security Governance Rule
          </strong>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Private backend secrets (MongoDB connection strings, Groq API keys, Cloudinary secrets, and JWT secrets) are prohibited from the client renderer. Browser clients cannot rewrite host system environment files.
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
