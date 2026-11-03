# Signora AI — API Reference & Endpoints

This document outlines the REST and WebSocket endpoints across Signora AI services. For full schema definitions, consult [`documentation/openapi.yaml`](../documentation/openapi.yaml).

## Backend Gateway (Port 5000)

Base URL: `http://localhost:5000`

### Authentication & Account
| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer JWT |
| `POST` | `/api/auth/forgot-password` | Request password reset token | No |
| `POST` | `/api/auth/reset-password` | Submit new password | No |
| `POST` | `/api/auth/verify-email` | Verify email address token | No |

### Translation & AI Forwarding
| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| `POST` | `/api/translate/text-to-sign` | Translate text to ISL signs | Bearer JWT |
| `POST` | `/api/translate/sign-to-text` | Classify gesture & translate to text | Bearer JWT |

### Conversation & History
| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| `GET` | `/api/history` | List user conversation histories | Bearer JWT |
| `POST` | `/api/history` | Save completed conversation | Bearer JWT |
| `GET` | `/api/history/:id` | Fetch specific conversation details | Bearer JWT |

### Administration & Moderation
| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| `GET` | `/api/admin/users` | List platform users | Admin Bearer JWT |
| `GET` | `/api/admin/moderation` | List flagged moderation alerts | Admin Bearer JWT |
| `POST` | `/api/admin/moderation/:id/action` | Approve/Reject flagged content | Admin Bearer JWT |
| `GET` | `/api/admin/audit` | Fetch platform audit log | Admin Bearer JWT |
| `GET` | `/api/admin/telemetry` | View real-time system metrics | Admin Bearer JWT |

---

## AI Language Service (Port 8000)

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/health` | Service health status |
| `POST` | `/api/ai/text-to-sign` | Parse text into ISL gesture tokens |
| `POST` | `/api/ai/detect-language` | Detect natural language of input |
| `POST` | `/api/ai/moderate` | Evaluate text against content policies |

---

## Computer Vision Service (Port 8001)

Base URL: `http://localhost:8001`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/health` | Vision model status & device index |
| `POST` | `/api/vision/recognize-frame` | Extract landmarks and classify gesture |
| `POST` | `/api/vision/track-hands` | Raw 21-point 3D landmark extraction |

---

## Real-Time Duplex Microservice (Port 5002)

Base URL: `http://localhost:5002`

| Protocol | Endpoint | Description |
| -------- | -------- | ----------- |
| `GET` | `/health` | Microservice and WebSocket status |
| `WS` | `ws://localhost:5002` | Real-time duplex message and signaling exchange |

