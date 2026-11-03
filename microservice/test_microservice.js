import assert from 'assert';
import http from 'http';
import { WebSocket } from 'ws';

console.log('Testing Microservice REST & WebSocket functionality...');

// Test 1: Start microservice in test mode
const TEST_PORT = 5999;
process.env.PORT = TEST_PORT;

const { server, app } = await import('./server.js');
assert.ok(typeof app === 'function', 'Microservice Express app instance exported correctly');

try {
  // Test HTTP health check
  const healthRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  assert.strictEqual(healthRes.status, 'healthy');
  console.log('[PASS] Microservice HTTP Health check passed');

  // Test Notification sending
  const notifPayload = JSON.stringify({
    recipientEmail: 'citizen@hastivo.isl',
    userId: 'usr_citizen_002',
    notificationType: 'temporary_block_24h',
    reason: 'Policy safety violation testing',
  });

  const notifRes = await new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${TEST_PORT}/api/v1/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(notifPayload),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(notifPayload);
    req.end();
  });

  assert.strictEqual(notifRes.success, true);
  assert.strictEqual(notifRes.notification.recipientEmail, 'citizen@hastivo.isl');
  console.log('[PASS] Microservice Notification Dispatch endpoint passed');

  // Test WebSocket connection & Room joining
  const ws = new WebSocket(`ws://localhost:${TEST_PORT}/ws/v1/conversation`);

  await new Promise((resolve, reject) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({
        event: 'conversation:join',
        roomId: 'test_duplex_room_1',
        data: { role: 'signer', userId: 'usr_signer_01' }
      }));
    });

    ws.on('message', (msg) => {
      const data = JSON.parse(msg.toString());
      if (data.event === 'conversation:joined') {
        assert.strictEqual(data.roomId, 'test_duplex_room_1');
        assert.strictEqual(data.data.role, 'signer');
        ws.close();
        resolve();
      }
    });

    ws.on('error', reject);
  });

  console.log('[PASS] Microservice WebSocket Duplex Session Join passed');

  console.log('\nAll Microservice tests passed successfully!');
  server.close();
  process.exit(0);
} catch (err) {
  console.error('[FAIL] Microservice test error:', err);
  server.close();
  process.exit(1);
}
