# Local Development Setup & Operations Guide

## 1. Prerequisites

Ensure you have installed:
- **Node.js** (v18.x or v20+)
- **npm** (v9+)
- **Python** (v3.10 to v3.14)
- **Git**

## 2. Clone and Initial Setup

```bash
git clone https://github.com/your-username/signora-ai.git
cd signora-ai
```

## 3. Environment Variables

Create `.env` files in each service directory using the provided `.env.example` templates:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend Gateway
cp backend/.env.example backend/.env

# AI Service
cp ai-service/.env.example ai-service/.env

# Computer Vision Service
cp computer-vision/.env.example computer-vision/.env

# Real-Time Microservice
cp microservice/.env.example microservice/.env
```

## 4. Installing Dependencies

### Node.js Services:
```bash
# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..

# Microservice
cd microservice && npm install && cd ..

# Showcase
cd showcase && npm install && cd ..

# Testing Framework
cd testing && npm install && cd ..
```

### Python Services:
Create and activate a virtual environment (recommended):
```bash
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install AI Service dependencies
pip install -r ai-service/requirements.txt

# Install Computer Vision dependencies
pip install -r computer-vision/requirements.txt
```

## 5. Running the Application Locally

In separate terminal windows:

### Terminal 1 — Backend Gateway (Port 5000):
```bash
cd backend
npm run dev
```

### Terminal 2 — AI Language Engine (Port 8000):
```bash
cd ai-service
python run_server.py
```

### Terminal 3 — Computer Vision Engine (Port 8001):
```bash
cd computer-vision
python run_server.py
```

### Terminal 4 — Real-Time WebSocket Microservice (Port 5002):
```bash
cd microservice
npm start
```

### Terminal 5 — Frontend Application (Port 5173):
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in modern Chromium-based browser (Chrome, Edge) with WebGL and camera permissions enabled.

## 6. Running Tests & Verifications

Execute the comprehensive system test orchestrator:
```bash
cd testing
node run_all_tests.js
```
This executes:
1. System verification suite & UI policy tests (`verify_system.js`).
2. Core backend gateway & authentication suite (`test_backend_suite.js`).
3. Python AI language & moderation tests (`pytest`).
4. Python MediaPipe vision & gesture tests (`pytest`).
5. Real-time WebSocket microservice tests (`test_microservice.js`).
6. End-to-end multi-service integration suite (`test_integration_e2e.js`).
7. Frontend production bundle build (`npm run build`).

