# Hastivo — Deployment & Operations Guide

## 1. Port & Environment Matrix

| Service | Directory | Port | Protocol | Start Command |
|---|---|---|---|---|
| Frontend Client | `frontend/` | `5173` | HTTP / WS | `npm run dev` |
| Backend Gateway | `backend/` | `5000` | HTTP REST | `npm start` |
| AI Language Service | `ai-service/` | `8000` | HTTP REST | `python run_server.py` |
| Computer Vision Service | `computer-vision/` | `8001` | HTTP / WS | `python run_server.py` |
| Duplex Microservice | `microservice/` | `5002` | HTTP / WS | `npm start` |
| Demonstration Showcase | `showcase/` | `4000` | HTTP | `npm start` |

---

## 2. Quickstart Development Startup

To run the entire ecosystem locally:

### Terminal 1: Core Backend Gateway
```bash
cd backend
npm start
```

### Terminal 2: AI Language Processing Service
```bash
cd ai-service
python run_server.py
```

### Terminal 3: Computer Vision & MediaPipe Engine
```bash
cd computer-vision
python run_server.py
```

### Terminal 4: Duplex Real-Time Microservice
```bash
cd microservice
npm start
```

### Terminal 5: Frontend React Client
```bash
cd frontend
npm run dev
```

### Terminal 6 (Optional): Demonstration Showcase
```bash
cd showcase
npm start
```

---

## 3. Automated Test Verification

Run all unit, integration, UI governance, and multi-service E2E tests:

```bash
cd testing
npm test
```

Or run individual suites:
- `node verify_system.js` (UI rules & navigation policy)
- `node test_backend_suite.js` (Backend API & contracts)
- `node test_integration_e2e.js` (Multi-service integration)
- `python -m pytest ai-service/tests/test_ai_service.py` (AI Service)
- `python -m pytest computer-vision/tests/test_vision_service.py` (Computer Vision)
- `node microservice/test_microservice.js` (Microservice)

---

## 4. Environment Variables Reference

### Backend Gateway (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=hastivo-secret-key-2026-production
AI_SERVICE_URL=http://localhost:8000
CV_SERVICE_URL=http://localhost:8001
MICROSERVICE_URL=http://localhost:5002
```

### AI Service (`ai-service/.env`):
```env
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
MODEL_NAME=hastivo-isl-v2
```

### Computer Vision Service (`computer-vision/.env`):
```env
PORT=8001
HOST=0.0.0.0
MIN_DETECTION_CONFIDENCE=0.65
MIN_TRACKING_CONFIDENCE=0.60
MAX_NUM_HANDS=2
```

### Duplex Microservice (`microservice/.env`):
```env
PORT=5002
SERVICE_NAME=Hastivo-Realtime-Notification-Microservice
JWT_SECRET=hastivo-secret-key-2026-production
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5002/ws/v1/conversation
VITE_APP_ENV=development
```

---

## 5. Troubleshooting Guide

| Issue | Cause | Resolution |
|---|---|---|
| MediaPipe initialization error | Legacy `solutions` module missing in newer Python environment | `HandTracker` automatically falls back to modern `tasks` and algorithmic coordinate processing. |
| Web Speech API not transcribing | Browser microphone permissions blocked | Click the lock icon in the address bar and enable Microphone permissions. |
| 401 Unauthorized on `/api/v1/auth/me` | JWT expired or token absent | Re-authenticate via `/api/v1/auth/login` to obtain a fresh 7-day signed JWT. |
| Port collision on 5000 / 5002 | Another Node or Python process holding port | Update `PORT` in the service's `.env` or terminate the existing process. |
