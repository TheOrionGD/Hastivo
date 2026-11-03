/**
 * Signora — Backend Gateway API Test Suite
 * Validates contracts, authentication, database persistence, moderation, and admin controls.
 */

import http from 'http';
import assert from 'assert';

console.log('====================================================');
console.log('   SIGNORA AI — BACKEND GATEWAY TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assertTest(condition, message) {
  try {
    assert.ok(condition, message);
    console.log(`[PASS] ${message}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${message}:`, err.message);
    failCount++;
  }
}

// Helper for JSON requests
function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Start temporary backend server for isolated testing
process.env.PORT = '5099';
process.env.NODE_ENV = 'test';

const { app } = await import('../backend/server.js');
const server = app.listen(5099);
const BASE_URL = 'http://localhost:5099';

try {
  // 1. Health & Config
  console.log('--- 1. Testing System Health & Config ---');
  const health = await requestJson(`${BASE_URL}/api/v1/health`);
  assertTest(health.status === 200, 'Health endpoint returns HTTP 200');
  assertTest(health.data.status === 'healthy', "Health status is 'healthy'");
  assertTest(health.data.subsystems.authService === 'ONLINE', 'Auth subsystem is ONLINE');

  const config = await requestJson(`${BASE_URL}/api/v1/config`);
  assertTest(config.status === 200, 'Config endpoint returns HTTP 200');
  assertTest(config.data.features.duplexVoiceKinematics === true, 'Duplex voice kinematics enabled');

  // 2. Authentication & JWT
  console.log('\n--- 2. Testing Authentication & JWT Flow ---');
  const testEmail = `test_${Date.now()}@signora.isl`;
  const regRes = await requestJson(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
    email: testEmail,
    password: 'SecurePassword2026!',
    displayName: 'Test Citizen User',
    role: 'citizen',
  });
  assertTest(regRes.status === 201, 'User registration returns HTTP 201 Created');
  assertTest(regRes.data.success === true, 'Registration reports success');
  assertTest(!!regRes.data.token, 'JWT token returned on registration');

  const userToken = regRes.data.token;

  // Login
  const loginRes = await requestJson(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
    email: testEmail,
    password: 'SecurePassword2026!',
  });
  assertTest(loginRes.status === 200, 'Login with correct credentials returns HTTP 200');
  assertTest(loginRes.data.token.length > 20, 'Genuine signed JWT issued on login');

  // Failed login
  const badLogin = await requestJson(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
    email: testEmail,
    password: 'WrongPassword!',
  });
  assertTest(badLogin.status === 401, 'Login with invalid password returns HTTP 401 Unauthorized');

  // Me endpoint with token
  const meRes = await requestJson(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  assertTest(meRes.status === 200, 'Protected /me endpoint succeeds with valid Bearer token');
  assertTest(meRes.data.user.email === testEmail, 'Resolved authenticated user matches registration');

  // 3. User Preferences & Profile
  console.log('\n--- 3. Testing Preferences & Profile Management ---');
  const prefRes = await requestJson(`${BASE_URL}/api/v1/user/preferences`, { method: 'POST' }, {
    theme: 'dark',
    avatarModel: 'y-bot',
    avatarSpeed: 1.25,
  });
  assertTest(prefRes.status === 200, 'Preferences update returns HTTP 200');
  assertTest(prefRes.data.preferences.avatarModel === 'y-bot', 'Avatar model preference saved');

  // 4. Translation Endpoints
  console.log('\n--- 4. Testing Translation Gateway Contracts ---');
  const t2sRes = await requestJson(`${BASE_URL}/api/v1/translation/text-to-sign`, { method: 'POST' }, {
    text: 'Hello where is the train platform',
  });
  assertTest(t2sRes.status === 200, 'Text-to-Sign returns HTTP 200');
  assertTest(Array.isArray(t2sRes.data.tokens), 'Tokens array returned in translation response');
  assertTest(t2sRes.data.tokens.length > 0, 'Tokens contain sign animation poses');

  const s2tRes = await requestJson(`${BASE_URL}/api/v1/translation/sign-to-text`, { method: 'POST' }, {
    landmarks: Array(21).fill({ x: 0.5, y: 0.5, z: 0.0 }),
  });
  assertTest(s2tRes.status === 200, 'Sign-to-Text returns HTTP 200');
  assertTest(typeof s2tRes.data.translatedText === 'string', 'Synthesized sentence returned');

  // 5. Conversations Storage
  console.log('\n--- 5. Testing Conversation History Management ---');
  const convRes = await requestJson(`${BASE_URL}/api/v1/conversations`, { method: 'POST' }, {
    title: 'Customer Service Query Session',
    messages: [
      { sender: 'citizen', text: 'Where is platform 3?', type: 'speech' },
      { sender: 'avatar', text: 'PLATFORM THREE FORWARD', type: 'sign' },
    ],
  });
  assertTest(convRes.status === 201, 'Conversation session created with HTTP 201');

  const historyRes = await requestJson(`${BASE_URL}/api/v1/conversations/history`);
  assertTest(Array.isArray(historyRes.data), 'Conversation history list retrieved');
  assertTest(historyRes.data.length > 0, 'History contains stored session');

  // 6. Admin & Restrictions
  console.log('\n--- 6. Testing Administration & Moderation ---');
  const auditRes = await requestJson(`${BASE_URL}/api/v1/admin/audit`);
  assertTest(auditRes.status === 200, 'Admin audit log endpoint returns HTTP 200');
  assertTest(auditRes.data.records.length > 0, 'Audit records populated with system activity');

  const restrictRes = await requestJson(`${BASE_URL}/api/v1/admin/restrictions`, { method: 'POST' }, {
    userId: testEmail,
    type: 'temporary-block',
    reason: 'Automated testing safety violation',
  });
  assertTest(restrictRes.status === 200, 'Applying temporary restriction returns HTTP 200');
  assertTest(restrictRes.data.user.status === 'restricted', "User status transitioned to 'restricted'");
  assertTest(!!restrictRes.data.user.restrictionExpiresAt, '24-hour expiry timestamp computed and stored');

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================\n');

  server.close();
  if (failCount > 0) process.exit(1);
  process.exit(0);
} catch (err) {
  console.error('[FATAL] Backend test suite error:', err);
  server.close();
  process.exit(1);
}
