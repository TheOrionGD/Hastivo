# Contributing to Hastivo AI

Thank you for your interest in contributing to **Hastivo AI**, the accessible Indian Sign Language (ISL) communication platform.

## Code of Conduct
Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in this repository.

## Non-Negotiable Governance Policy
Hastivo enforces a strict **Zero-Placeholder, Zero-Mock-Data, and Zero-Hardcoded-Data** policy:
- No dummy data, fabricated dashboard statistics, or fake translation sequences in production code.
- If a service or model dependency is offline or unconfigured, return explicit service-unavailable states (`UnavailableState`) with retry mechanisms.
- Never commit actual secrets or credentials to Git.

## Development Workflow

### 1. Prerequisites
- **Node.js**: v18.x or v20+ (tested on Node v20/v24)
- **Python**: 3.10+ (tested on Python 3.10 - 3.14)
- **Git**

### 2. Fork and Clone
```bash
git clone https://github.com/your-username/hastivo-ai.git
cd hastivo-ai
```

### 3. Setting Up Environments
Copy environment sample files in all service folders:
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp computer-vision/.env.example computer-vision/.env
cp microservice/.env.example microservice/.env
```

### 4. Branching Model
- `main`: Production-ready branch.
- Feature branches: `feature/<feature-name>`
- Bug fixes: `fix/<issue-name>`

### 5. Running Tests Locally
Before submitting a pull request, ensure the master test suite and linters pass:
```bash
# In frontend directory
cd frontend
npm run lint
npm run build

# In testing directory
cd ../testing
node run_all_tests.js
```

### 6. Submitting a Pull Request
- Create descriptive commit messages adhering to Conventional Commits:
  - `feat: add Tamil fingerspelling kinematic mapping`
  - `fix: handle WebSocket reconnection timeout gracefully`
  - `docs: update deployment architecture diagram`
- Ensure PR template fields are completely filled out.
- Ensure all CI/CD automated checks pass.

