---
description: Strict Zero-Placeholder, Zero-Mock-Data, and Zero-Hardcoded-Data Policy
globs: **/*
---

# STRICT ZERO-PLACEHOLDER, ZERO-MOCK-DATA AND ZERO-HARDCODED-DATA POLICY

This rule applies across all modules in this repository (`frontend/`, `backend/`, `ai-service/`, `computer-vision/`, `microservice/`, `showcase/`, `testing/`, and `documentation/`).

**Goal**: Build a genuinely functional, data-driven application—not a visually complete application filled with fabricated content.

## Absolute Rules
1. **No Dummy or Placeholder Data**: No fake accounts, profiles, names, hardcoded dashboard stats, fake translation results, fabricated AI responses, simulated landmarks/gestures, fake chat messages, fake notifications, or static activity logs.
2. **No Hardcoded Application Data**: Dynamic data must originate from MongoDB, authenticated backend endpoints, configured AI/CV models, or live device streams. Centralized config only for static design tokens or system constants.
3. **No Fake API Integrations**: Every endpoint must be real. Do not return hardcoded JSON or fake success. Report unbuilt endpoints as unavailable with structured status.
4. **No Fake AI / Computer Vision**: No simulated hand tracking, no hardcoded translation sentences, no arbitrary confidence scores. If model or credentials are down, return explicit structured unavailable states with retry mechanisms.
5. **No Fake Dashboard Values**: Zero records must display genuine empty states (`0`, "No activity yet", "No translations available"). Never invent metrics.
6. **No Fake UI Controls**: Interactive elements (buttons, inputs, filters, sliders, camera controls) must perform their real persisted operation or be disabled/marked unavailable.
7. **Genuine States**: Implement authentic loading, empty, error, and unavailable states.
8. **Testing Restrictions**: Test mocks permitted only in isolated unit tests; never in production runtime or integration verification.
9. **No Hardcoded Secrets**: Use environment variables and safe `.env.example` templates.
10. **Final Non-Negotiable Rule**: Never sacrifice functional correctness for visual completeness. Never fabricate data to make a screen look populated.
