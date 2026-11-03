# Hastivo AI — Service Responsibility Specification

This document details the exact architectural boundaries, runtime requirements, and public contracts for all eight system directories in the Hastivo repository.

---

## 1. frontend/ (Client Application)

### Responsibility
- Presentation layer and interactive user workspaces.
- Cardless visual direction: no generic cards, typography-driven hierarchy, floating docked navigation, and command palette (`Ctrl+K` / `Cmd+K`).
- 3D Humanoid Robot Avatar rendering with Three.js (`SigningEngine.js`, Mixamo 65-bone humanoid rig).
- Multilingual interface supporting 7 Indian languages: English, Tamil, Telugu, Kannada, Malayalam, Hindi, and Urdu (with native RTL layout).
- Live camera access and Web Speech API dictation.

### Entry Point
- Source: `src/main.jsx`
- Build Output: `dist/index.html`

### Dependencies
- `react@^19.3.1`, `react-router-dom@^7.18.5`, `three@^0.187.0`, `@react-three/fiber`, `framer-motion`, `lucide-react`.

---

## 2. backend/ (Core Application Gateway)

### Responsibility
- Central business logic, authentication, and session management.
- User registration, login, logout, password recovery, email verification.
- Bcrypt password hashing (`bcryptjs`) & genuine JSON Web Token issuance (`jsonwebtoken`).
- Role-Based Access Control (`citizen`, `admin`).
- User profile & preferences persistence (theme, avatar model, speed, languages).
- Translation orchestration proxying between frontend, `ai-service/`, and `computer-vision/`.
- Conversation sessions and historical message storage.
- Admin management: moderation review, user restriction enforcement (24h block, 7d suspension), automated expiry scheduler, and audit logging.

### Entry Point
- `backend/server.js` (Port: 5000)

---

## 3. ai-service/ (Artificial Intelligence & Language Processing)

### Responsibility
- Natural language processing and Indian Sign Language (ISL) grammar transformation.
- SVO &rarr; SOV / TSOV (Time-Subject-Object-Verb) linguistic reordering.
- Interrogative-final rule (question words at end) and negation-final rule.
- ISL lexicon mapping and fingerspelling generation for out-of-vocabulary terms.
- Sign-to-Text contextual smoothing and sentence synthesis.
- Content safety moderation (evaluates profanity, harassment, hate speech, and offensive gestures).
- Language detection across 7 Indian interface languages.

### Entry Point
- `ai-service/run_server.py` & `ai-service/app/main.py` (Port: 8000)

---

## 4. computer-vision/ (Gesture Tracking & Recognition)

### Responsibility
- Video frame analysis and hand skeleton landmark detection.
- MediaPipe Hands 21-keypoint extraction per hand in 3D normalized space.
- Finger extension state calculation (thumb, index, middle, ring, pinky).
- ISL gesture classification (`HELLO`, `NAMASTE`, `WATER`, `YES`, `NO`, `HELP`, numbers, letters).
- Visual annotation with brand colors (`#FF6F61` Coral joints, `#6FA3EF` Blue bones, confidence tags).
- Real-time WebSocket video frame streaming (`/ws/v1/vision/stream`).

### Entry Point
- `computer-vision/run_server.py` & `computer-vision/app/main.py` (Port: 8001)

---

## 5. microservice/ (Real-Time Communication & Notifications)

### Responsibility
- Independent real-time duplex communication hub (`/ws/v1/conversation`).
- Simultaneous two-participant room synchronization (Participant A: speech-to-sign; Participant B: sign-to-speech).
- Event dispatching (`speech:transcript`, `sign:detected`, `avatar:sequence`, `caption:updated`, `conversation:paused`, `conversation:resumed`, `conversation:ended`).
- User restriction notification dispatch broker (integrating Brevo API / sandbox mailer).

### Entry Point
- `microservice/server.js` (Port: 5002)

---

## 6. showcase/ (System Demonstration & Telemetry)

### Responsibility
- Visual demonstration environment showcasing working platform capabilities.
- Live multi-service health matrix probing ports 5173, 5000, 8000, 8001, and 5002.
- Text-to-Sign interactive intelligence debugger.
- MediaPipe 21-joint skeletal tracking HUD.
- Duplex WebSocket communication session simulator.
- AI safety moderation sandbox.

### Entry Point
- `showcase/server.js` & `showcase/index.html` (Port: 4000)

---

## 7. testing/ (Unified Testing Framework)

### Responsibility
- Automated verification across all system tiers.
- System UI governance policy tests (`verify_system.js` - 46 tests).
- Backend Gateway API & Auth tests (`test_backend_suite.js` - 28 tests).
- Python AI Service Pytest (`test_ai_service.py` - 7 tests).
- Python Computer Vision Pytest (`test_vision_service.py` - 5 tests).
- Duplex Microservice tests (`test_microservice.js` - 3 tests).
- Multi-service E2E Integration tests (`test_integration_e2e.js` - 7 tests).
- Master test orchestrator (`run_all_tests.js`).

---

## 8. documentation/ (Technical Architecture & Reference)

### Responsibility
- Single source of truth for architecture, API schemas, security policies, and deployment instructions matching the actual working code.
