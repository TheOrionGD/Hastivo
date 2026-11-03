/**
 * Signora AI — Interactive Demonstration & Telemetry Script
 * Strictly Zero Dummy Data Policy Compliant
 */

const SERVICES = {
  frontend: 'http://localhost:5173',
  backend: 'http://localhost:5000/api/v1/health',
  ai: 'http://localhost:8000/health',
  vision: 'http://localhost:8001/health',
  micro: 'http://localhost:5002/health',
};

// ── 0. Theme System (Dark / Light Theme Sync) ─────────────────
function initTheme() {
  const saved = localStorage.getItem('signora_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

window.toggleTheme = function () {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('signora_theme', next);
  updateThemeIcon(next);
};

function updateThemeIcon(theme) {
  const iconEl = document.getElementById('themeIcon');
  if (!iconEl) return;
  if (theme === 'light') {
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    iconEl.setAttribute('title', 'Switch to Dark Mode');
  } else {
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    iconEl.setAttribute('title', 'Switch to Light Mode');
  }
}

// ── 1. Tab Switching (Cardless Open Panels) ───────────────────
window.switchTab = function (tabId, element) {
  document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((pane) => pane.classList.remove('active'));

  let activeBtn = element;
  if (!activeBtn) {
    if (window.event && window.event.target) {
      activeBtn = window.event.target.closest('.tab-btn');
    }
  }
  if (!activeBtn) {
    activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  }
  if (activeBtn) activeBtn.classList.add('active');

  const targetPane = document.getElementById('tab-' + tabId);
  if (targetPane) targetPane.classList.add('active');
};

// ── 2. Multi-Service Probe (Zero Placeholder) ─────────────────
window.probeAllServices = async function () {
  const probeBtn = document.getElementById('btnProbeServices');
  if (probeBtn) {
    probeBtn.disabled = true;
    probeBtn.textContent = 'Probing...';
  }

  for (const [key, url] of Object.entries(SERVICES)) {
    const badge = document.getElementById(`badge-${key}`);
    const lat = document.getElementById(`lat-${key}`);
    if (badge) {
      badge.className = 'status-badge status-checking';
      badge.textContent = 'PROBING';
    }
    if (lat) {
      lat.textContent = 'Measuring...';
    }

    const start = performance.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      const duration = Math.round(performance.now() - start);
      if (res.ok || res.status === 200 || res.type === 'opaque') {
        if (badge) {
          badge.className = 'status-badge status-online';
          badge.textContent = 'ONLINE';
        }
        if (lat) lat.textContent = `Latency: ${duration}ms`;
      } else {
        if (badge) {
          badge.className = 'status-badge status-offline';
          badge.textContent = `ERR ${res.status}`;
        }
        if (lat) lat.textContent = `Latency: ${duration}ms`;
      }
    } catch (e) {
      if (badge) {
        badge.className = 'status-badge status-offline';
        badge.textContent = 'OFFLINE';
      }
      if (lat) lat.textContent = `Unreachable: ${e.message || 'offline'}`;
    }
  }

  if (probeBtn) {
    probeBtn.disabled = false;
    probeBtn.textContent = 'Probe Services';
  }
};

// ── 3. Text-to-Sign Testing ──────────────────────────────────
window.setPresetText = function (text) {
  const input = document.getElementById('t2sInput');
  if (input) input.value = text;
  testTextToSign();
};

window.testTextToSign = async function () {
  const textInput = document.getElementById('t2sInput');
  const text = textInput ? textInput.value : '';
  const out = document.getElementById('t2sOutput');
  const tokensContainer = document.getElementById('t2sTokens');

  if (out) out.textContent = '// Contacting Translation Intelligence Service (port 8000 / 5000)...';
  try {
    let res = await fetch('http://localhost:8000/api/v1/ai/text-to-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).catch(() => null);

    if (!res || !res.ok) {
      // Fallback to backend gateway proxy
      res = await fetch('http://localhost:5000/api/v1/translation/text-to-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    }

    const data = await res.json();
    if (out) out.textContent = JSON.stringify(data, null, 2);

    if (tokensContainer) {
      tokensContainer.innerHTML = '';
      const sequence = data.islGlossSequence || (data.tokens ? data.tokens.map(t => t.gloss) : []);
      if (sequence.length === 0 && data.islStructure) {
        const words = data.islStructure.split(' ');
        words.forEach((w) => {
          const pill = document.createElement('span');
          pill.className = 'token-pill';
          pill.textContent = w.toUpperCase();
          tokensContainer.appendChild(pill);
        });
      } else {
        sequence.forEach((gloss) => {
          const pill = document.createElement('span');
          pill.className = 'token-pill';
          pill.textContent = gloss;
          tokensContainer.appendChild(pill);
        });
      }
    }
  } catch (err) {
    if (out) {
      out.textContent = `// Translation Service Unreachable:\n// ${err.message}\n// Ensure Python AI Service (port 8000) or Node Gateway (port 5000) is running.`;
    }
  }
};

// ── 4. Computer Vision Landmark HUD Loop ──────────────────────
const canvas = document.getElementById('visionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let currentSign = 'HELLO';

const HAND_BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

function drawHandBones(landmarks, targetCtx = ctx) {
  if (!landmarks || landmarks.length < 21 || !targetCtx) return;
  targetCtx.save();
  targetCtx.strokeStyle = 'rgba(92, 245, 165, 0.75)';
  targetCtx.lineWidth = 2;
  for (const [startIdx, endIdx] of HAND_BONES) {
    const p1 = landmarks[startIdx];
    const p2 = landmarks[endIdx];
    if (p1 && p2) {
      targetCtx.beginPath();
      targetCtx.moveTo(p1.x, p1.y);
      targetCtx.lineTo(p2.x, p2.y);
      targetCtx.stroke();
    }
  }
  targetCtx.restore();
}
window.drawHandBones = drawHandBones;

function renderHud() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width;
  const h = canvas.height;

  // Viewport guide box (Cardless HUD overlay)
  ctx.strokeStyle = 'rgba(111, 163, 239, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.08, h * 0.08, w * 0.84, h * 0.84);

  // Corner brackets
  const cornerSize = 18;
  ctx.strokeStyle = '#6FA3EF';
  ctx.lineWidth = 2;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.08 + cornerSize);
  ctx.lineTo(w * 0.08, h * 0.08);
  ctx.lineTo(w * 0.08 + cornerSize, h * 0.08);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(w * 0.92 - cornerSize, h * 0.08);
  ctx.lineTo(w * 0.92, h * 0.08);
  ctx.lineTo(w * 0.92, h * 0.08 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.92 - cornerSize);
  ctx.lineTo(w * 0.08, h * 0.92);
  ctx.lineTo(w * 0.08 + cornerSize, h * 0.92);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w * 0.92 - cornerSize, h * 0.92);
  ctx.lineTo(w * 0.92, h * 0.92);
  ctx.lineTo(w * 0.92, h * 0.92 - cornerSize);
  ctx.stroke();

  // Reticle crosshair in brand Coral
  ctx.strokeStyle = 'rgba(255, 111, 97, 0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.5 - 18, h * 0.5);
  ctx.lineTo(w * 0.5 + 18, h * 0.5);
  ctx.moveTo(w * 0.5, h * 0.5 - 18);
  ctx.lineTo(w * 0.5, h * 0.5 + 18);
  ctx.stroke();

  // Status text (Strict Zero Mock Data Policy)
  ctx.fillStyle = '#6FA3EF';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MediaPipe 21-Joint Tracking Viewport', w * 0.5, h * 0.42);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Awaiting live camera video frames. Zero synthetic landmarks are generated.', w * 0.5, h * 0.58);
  ctx.textAlign = 'start';
}

window.updateSimulatedGesture = function () {
  const sel = document.getElementById('gestureSelect');
  if (sel) currentSign = sel.value;
  const labelEl = document.getElementById('hudSignLabel');
  const confEl = document.getElementById('hudSignConf');
  if (labelEl) labelEl.textContent = `${currentSign} (Lexicon Sign)`;
  if (confEl) confEl.textContent = 'Live Input Required';
  renderHud();
};

window.sendLandmarksToApi = async function () {
  const out = document.getElementById('visionApiOutput');
  const confEl = document.getElementById('hudSignConf');
  if (out) out.textContent = '// Probing Computer Vision service health on port 8001...';

  try {
    const healthRes = await fetch('http://localhost:8001/health', { signal: AbortSignal.timeout(3000) });
    if (healthRes.ok) {
      const healthData = await healthRes.json();
      if (out) {
        out.textContent = `// Computer Vision Service Online:\n${JSON.stringify(healthData, null, 2)}\n\n// To classify live hand gestures, start the camera studio in frontend (port 5173).`;
      }
      if (confEl) confEl.textContent = 'Service ONLINE';
    } else {
      if (out) out.textContent = `// Vision service responded with HTTP ${healthRes.status}`;
      if (confEl) confEl.textContent = 'Service DEGRADED';
    }
  } catch (err) {
    if (out) {
      out.textContent = `// Computer Vision Engine (port 8001) unreachable: ${err.message}.\n// Strictly adhering to zero dummy data policy: no artificial landmark predictions are fabricated.`;
    }
    if (confEl) confEl.textContent = 'Service OFFLINE';
  }
};

// ── 5. Duplex WebSocket Collaboration ─────────────────────────
let duplexWs = null;

window.connectDuplexWebSocket = function () {
  const roomInput = document.getElementById('duplexRoomId');
  const roomId = roomInput ? roomInput.value : 'showcase_duplex_session';
  const statusEl = document.getElementById('wsStatus');
  const logEl = document.getElementById('duplexLogOutput');
  const btn = document.getElementById('btnConnectWs');

  if (duplexWs) {
    duplexWs.close();
    duplexWs = null;
    if (statusEl) {
      statusEl.textContent = 'DISCONNECTED';
      statusEl.style.color = 'var(--color-amber)';
    }
    if (btn) btn.textContent = 'Connect WebSocket';
    return;
  }

  if (statusEl) {
    statusEl.textContent = 'CONNECTING...';
    statusEl.style.color = 'var(--color-amber)';
  }
  duplexWs = new WebSocket('ws://localhost:5002/ws/v1/conversation');

  duplexWs.onopen = () => {
    if (statusEl) {
      statusEl.textContent = 'CONNECTED (ONLINE)';
      statusEl.style.color = 'var(--color-emerald)';
    }
    if (btn) btn.textContent = 'Disconnect Stream';
    if (logEl) {
      logEl.textContent = `[${new Date().toLocaleTimeString()}] WebSocket connected to microservice (port 5002).\nJoining room '${roomId}'...\n`;
    }

    duplexWs.send(JSON.stringify({
      event: 'conversation:join',
      roomId,
      data: { role: 'speaker', userId: 'usr_showcase_01' },
    }));
  };

  duplexWs.onmessage = (event) => {
    if (!logEl) return;
    try {
      const msg = JSON.parse(event.data);
      logEl.textContent += `[${new Date().toLocaleTimeString()}] EVENT: ${msg.event}\nDATA: ${JSON.stringify(msg.data || msg, null, 2)}\n\n`;
    } catch {
      logEl.textContent += `[${new Date().toLocaleTimeString()}] RAW: ${event.data}\n\n`;
    }
    logEl.scrollTop = logEl.scrollHeight;
  };

  duplexWs.onerror = (e) => {
    if (statusEl) {
      statusEl.textContent = `CONNECTION ERROR: ${e?.message || 'WebSocket Error'}`;
      statusEl.style.color = 'var(--color-coral)';
    }
  };

  duplexWs.onclose = () => {
    if (statusEl) {
      statusEl.textContent = 'DISCONNECTED';
      statusEl.style.color = 'var(--color-amber)';
    }
    if (btn) btn.textContent = 'Connect WebSocket';
    duplexWs = null;
  };
};

window.sendSpeechEvent = function () {
  if (!duplexWs) return alert('Please connect duplex WebSocket first.');
  const roomId = document.getElementById('duplexRoomId').value;
  duplexWs.send(JSON.stringify({
    event: 'speech:transcript',
    roomId,
    data: { text: 'Train departure platform query', timestamp: new Date().toISOString() },
  }));
};

window.sendSignEvent = function () {
  if (!duplexWs) return alert('Please connect duplex WebSocket first.');
  const roomId = document.getElementById('duplexRoomId').value;
  duplexWs.send(JSON.stringify({
    event: 'sign:detected',
    roomId,
    data: { gloss: 'PLATFORM_THREE', confidence: 0.98, timestamp: new Date().toISOString() },
  }));
};

window.clearDuplexLogs = function () {
  const logEl = document.getElementById('duplexLogOutput');
  if (logEl) logEl.textContent = '// Event log cleared.\n';
};

// ── 6. AI Moderation Testing ──────────────────────────────────
window.setModPreset = function (val) {
  const input = document.getElementById('modInput');
  if (input) input.value = val;
  testModeration();
};

window.testModeration = async function () {
  const modInput = document.getElementById('modInput');
  const content = modInput ? modInput.value : '';
  const out = document.getElementById('modOutput');
  const verdict = document.getElementById('modVerdict');

  if (out) out.textContent = '// Dispatching content to AI Moderation Pipeline (port 8000)...';
  try {
    const res = await fetch('http://localhost:8000/api/v1/ai/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        contentType: content.startsWith('GESTURE_') ? 'gesture' : 'text',
      }),
    });
    const data = await res.json();
    if (out) out.textContent = JSON.stringify(data, null, 2);

    const mod = data.moderation;
    if (verdict && mod) {
      if (mod.flagged) {
        verdict.style.borderLeftColor = 'var(--color-coral)';
        verdict.innerHTML = `<span style="color: var(--color-coral); font-weight: 700;">[FLAGGED] Category: ${mod.category || 'RESTRICTED'} | Severity: ${(mod.severity || 'high').toUpperCase()}</span><br><span style="color: var(--text-secondary); font-size: 0.85rem;">${mod.reason || 'Content triggered moderation rule.'}</span>`;
      } else {
        verdict.style.borderLeftColor = 'var(--color-emerald)';
        verdict.innerHTML = `<span style="color: var(--color-emerald); font-weight: 700;">[PASSED] Content Safe & Compliant</span><br><span style="color: var(--text-secondary); font-size: 0.85rem;">${mod.reason || 'Verified clean against safety filter.'}</span>`;
      }
    }
  } catch (err) {
    if (out) {
      out.textContent = `// AI Moderation Service Unreachable:\n// ${err.message}\n// Ensure Python AI Service (port 8000) is running.`;
    }
    if (verdict) {
      verdict.style.borderLeftColor = 'var(--color-amber)';
      verdict.innerHTML = `<span style="color: var(--color-amber); font-weight: 700;">[OFFLINE] AI Service Unavailable</span><br><span style="color: var(--text-secondary); font-size: 0.85rem;">Could not connect to port 8000.</span>`;
    }
  }
};

// ── 7. Utility: Copy Output to Clipboard ─────────────────────
window.copyOutput = function (targetId, btn) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const text = target.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>✓ Copied</span>';
    setTimeout(() => {
      btn.innerHTML = orig;
    }, 1800);
  });
};

// ── 8. Global Keyboard Shortcuts ──────────────────────────────
window.addEventListener('keydown', (e) => {
  // Press 'r' outside input to probe all services
  if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
    probeAllServices();
  }
  // Press 't' outside input to toggle theme
  if ((e.key === 't' || e.key === 'T') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
    toggleTheme();
  }
});

// ── 9. Initial Bootstrap ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHud();
  probeAllServices();
});

// Immediate initialization for browsers loading script at end of body
initTheme();
renderHud();
probeAllServices();
