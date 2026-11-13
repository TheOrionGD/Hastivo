# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-11-13

### Added
- **Full Smooth UI Component Suite (187+ Components, 207 Export Aliases)**:
  - Centralized TypeScript barrel export in `client/src/components/ui/smoothui/index.ts` with comprehensive dual-case aliases (e.g. `AiCore` & `AICore`, `PerspectiveText3d` & `PerspectiveText3D`).
  - 100% active in-project component utilization across all 50+ screens and layout surfaces.
- **Complete Typography & Text Motion Suite (34 / 34 Features)**:
  - Implemented 14 modern text motion components: `blur-out-up`, `kinetic-center-build`, `kinetic-type-scroll`, `line-by-line-slide`, `mask-reveal-up`, `micro-scale-fade`, `scale-down-fade`, `short-slide-down`, `short-slide-right`, `soft-blur-in`, `spring-scale-in`, `stagger-from-center`, `stagger-from-edges`, and `top-down-letters`.
  - Seamlessly paired with the existing 20 motion components (`bottom-up-letters`, `depth-parallax-words`, `fade-through`, `focus-blur-resolve`, `gravity-letters`, `per-character-rise`, `per-word-crossfade`, `perspective-text-3d`, `reveal-text`, `rolling-text`, `scramble-hover`, `scroll-reveal-paragraph`, `shared-axis-x/y/z`, `shimmer-sweep`, `shine-text`, `text-morph`, `typewriter-text`, `wave-text`).
- **Comprehensive Multimodal Assistive AI Family in Hastivo AI Assistant (`HastivoAIChatPage.jsx`)**:
  - `AIConversation`: Real-time streaming conversation container with scroll anchoring.
  - `AIMessage`: Origin-aware message bubbles with clipboard copy actions.
  - `SiriOrb` & `AIOrbFace`: Reactive audio-driven companion visuals reflecting idle, listening, processing, and streaming states.
  - `AIContextMeter`: Live visual ring tracking context window and token usage.
  - `AISuggestions`: Contextual language-specific quick prompts.
  - `AITaskList`: Multi-phase checklist execution for spatial neural processing.
  - `AIToolCall`: Expandable telemetry inspector for MediaPipe and kinematic models.
  - `AICitation`: Authoritative institutional references (ISLRTC, NCERT).
  - `AISources`: External linguistic sources card.
  - `AIApproval`: Autonomous multi-signature action guard.
  - `AIArtifact`: Dual-tab code and visual preview inspector for synthesized ISL neural vectors.
  - `AILoader`: High-frequency grid wave animation.
  - `BorderBeam` & `ShimmerSweep`: High-tech visual surface highlights.
- **Full Screen Integration Across All 50+ Application Routes**:
  - Integrated into all 19 core Hastivo studios (Video Studio, Sign-to-Text, Text-to-Sign, Speech Studio, Real-Time Conversation, ISL Explorer, Community Hub, Collaboration, Dashboard, and Settings).
  - Integrated into all 8 Guest Portal screens (Guest AI, Community, Dashboard, Explorer, Reviews, Sign/Text studios, Translation).
  - Integrated into all 10 Admin Management portals (Dashboard, Telemetry, Health Monitor, AI Config, Moderation Queue, Category & User Management).
  - Integrated across Research Documentation chapters (`accessibility`, `architecture`, `corpus`, `grammar`), Auth forms (OTP, biometric unlock, registration), and Landing surfaces.

### Changed
- Standardized Radix UI primitive imports (`@radix-ui/react-context-menu`, `@radix-ui/react-slot`, `@radix-ui/react-popover`) in Smooth UI modules.
- Enhanced `HastivoUserLayout`, `AdminLayout`, and `GuestLayout` with dynamic text motion header wrappers and status indicators.
- Verified production build via Vite and Nitro SSR for Cloudflare Workers (4,579 modules transformed with 0 errors in 2.53s).

---

## [2.0.0] - 2026-11-12

### Added
- Migration to modern TanStack Start + Nitro Cloudflare SSR architecture.
- Modularized services directory into clean client/server structure.
- Enhanced 7-language localization system with real-time bidirectional translation (EN, HI, TA, TE, KN, ML, UR).
- Integrated MediaPipe 3D hand tracking and Three.js kinematic avatar pipelines.

---

## [1.0.0] - 2026-11-03

### Added
- **Core Multi-Service Architecture**:
  - Express.js Backend API Gateway (`port 5000`) with authentication, translation forwarding, and admin routes.
  - Python FastAPI AI Language Engine (`port 8000`) for text-to-sign grammar translation and multi-lingual moderation.
  - Python FastAPI Computer Vision Engine (`port 8001`) with MediaPipe hands and gesture classification.
  - Express/WebSocket Duplex Microservice (`port 5002`) for real-time bidirectional communication and delivery alerts.
- **3D Procedural Avatar Rig & Mixamo Integration**:
  - FBX avatar rig support for X-Bot (Female) and Y-Bot (Male).
  - Kinematic gesture generation and fingerspelling coordinate engine.
- **Automated Verification & E2E Testing Suite**:
  - Multi-service end-to-end integration test runner.
- **Comprehensive Documentation**:
  - OpenAPI 3.0 specification (`docs/openapi.yaml`).
  - Architectural specifications and deployment guides.
