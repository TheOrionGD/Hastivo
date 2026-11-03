/**
 * Signora AI — Master Automated System Test Orchestrator
 * Executes and aggregates tests across all eight system tiers.
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║        SIGNORA AI — MASTER SYSTEM TEST ORCHESTRATOR          ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const powershellPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
const results = [];

function runSuite(name, command, cwd) {
  process.stdout.write(`>>> Running ${name}... `);
  const start = Date.now();
  try {
    const output = execSync(command, { cwd, encoding: 'utf8', shell: powershellPath });
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`[PASSED] (${duration}s)`);
    if (process.argv.includes('--verbose')) {
      console.log(output);
    }
    results.push({ name, status: 'PASSED', duration: `${duration}s` });
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`[FAILED] (${duration}s)`);
    console.error(err.stdout || err.stderr || err.message);
    results.push({ name, status: 'FAILED', duration: `${duration}s` });
  }
}

// 1. System Verification Suite (SRS & UI Governance)
runSuite(
  '1. System Verification & UI Policy (verify_system.js)',
  'node verify_system.js',
  path.join(rootDir, 'testing')
);

// 2. Core Backend API & Contracts Suite
runSuite(
  '2. Core Backend Gateway & Auth Suite (test_backend_suite.js)',
  'node test_backend_suite.js',
  path.join(rootDir, 'testing')
);

// 3. AI Service Pytest Suite
runSuite(
  '3. Python AI Language & Moderation Engine (pytest)',
  'python -m pytest tests/test_ai_service.py',
  path.join(rootDir, 'ai-service')
);

// 4. Computer Vision Service Pytest Suite
runSuite(
  '4. Python Computer Vision & MediaPipe Engine (pytest)',
  'python -m pytest tests/test_vision_service.py',
  path.join(rootDir, 'computer-vision')
);

// 5. Real-Time Microservice Duplex Suite
runSuite(
  '5. Duplex WebSocket & Notification Microservice (test_microservice.js)',
  'node test_microservice.js',
  path.join(rootDir, 'microservice')
);

// 6. Multi-Service E2E Integration Suite
runSuite(
  '6. Multi-Service E2E Integration Suite (test_integration_e2e.js)',
  'node test_integration_e2e.js',
  path.join(rootDir, 'testing')
);

// 7. Frontend Client Build Verification
runSuite(
  '7. Frontend Production Bundle Build (npm run build)',
  'npm run build',
  path.join(rootDir, 'frontend')
);

console.log('\n══════════════════════════════════════════════════════════════');
console.log('                  MASTER TEST SUMMARY REPORT                  ');
console.log('══════════════════════════════════════════════════════════════');

let anyFailed = false;
for (const r of results) {
  const pad = ' '.repeat(Math.max(2, 60 - r.name.length));
  console.log(`${r.name}${pad}[${r.status}] in ${r.duration}`);
  if (r.status === 'FAILED') anyFailed = true;
}

console.log('══════════════════════════════════════════════════════════════\n');

if (anyFailed) {
  console.error('SYSTEM TEST SUITE COMPLETED WITH FAILURES.');
  process.exit(1);
} else {
  console.log('ALL SYSTEM TEST SUITES PASSED CLEANLY (100% SUCCESS).');
  process.exit(0);
}
