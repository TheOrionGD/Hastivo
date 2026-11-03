# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-03

### Added
- **Core Multi-Service Architecture**:
  - Express.js Backend API Gateway (`port 5000`) with authentication, translation forwarding, and admin routes.
  - Python FastAPI AI Language Engine (`port 8000`) for text-to-sign grammar translation and multi-lingual moderation.
  - Python FastAPI Computer Vision Engine (`port 8001`) with MediaPipe hands and gesture classification.
  - Express/WebSocket Duplex Microservice (`port 5002`) for real-time bidirectional communication and delivery alerts.
  - React 19 Frontend with Three.js 3D avatar rendering, custom kinetic cursor, and 7-language localization (EN, TA, TE, KN, UR, ML, HI).
- **3D Procedural Avatar Rig & Mixamo Integration**:
  - FBX avatar rig support for X-Bot (Female) and Y-Bot (Male).
  - Kinematic gesture generation and fingerspelling coordinate engine.
- **Automated Verification & E2E Testing Suite**:
  - 47-point system verification suite (`verify_system.js`).
  - Core backend gateway & auth testing (`test_backend_suite.js`).
  - Pytest suites for AI and Vision services.
  - Duplex microservice verification (`test_microservice.js`).
  - Multi-service end-to-end integration test runner (`run_all_tests.js`).
- **Comprehensive Documentation**:
  - OpenAPI 3.0 specification (`documentation/openapi.yaml`).
  - System architecture, deployment guides, and zero-placeholder governance rules.
- **CI/CD & GitHub Tooling**:
  - GitHub Actions automated workflows for linting, testing, and production builds.
  - Issue templates (Bug Report, Feature Request) and Pull Request template.
  - `.editorconfig`, `.gitattributes`, and optimized root `.gitignore`.

