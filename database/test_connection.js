/**
 * MongoDB Connection Health Check & Diagnostics Script
 * Run via: node test_connection.js
 */

import { connectDatabase, disconnectDatabase } from './connection.js';

async function runCheck() {
  console.log('--- Testing Hastivo MongoDB Connection ---');
  const result = await connectDatabase();
  console.log('Result:', result);

  if (result.connected) {
    console.log('✅ MongoDB connection successfully established!');
    await disconnectDatabase();
  } else {
    console.log(`⚠️ Connection pending: ${result.status}`);
    console.log('Awaiting new connection string or credentials.');
  }
}

runCheck().catch((err) => {
  console.error('Diagnostic error:', err);
});

