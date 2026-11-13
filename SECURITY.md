# Security Policy

## Supported Versions

The following table details security support for active versions of Hastivo.

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 2.1.x   | :white_check_mark: | Active (Current - SmoothUI Suite & SSR) |
| 2.0.x   | :white_check_mark: | Maintenance |
| 1.0.x   | :x:                | Deprecated |
| < 1.0   | :x:                | End of Life |

---

## Reporting a Vulnerability

We prioritize the security, privacy, and safety of our accessibility users, native signers, and platform infrastructure. If you discover a security vulnerability, please report it responsibly:

1. **Do not** disclose vulnerabilities publicly through GitHub issues, pull requests, public forum discussions, or social channels.
2. Email vulnerability reports directly to: **hello.theoriongd@gmail.com** or submit a confidential advisory through [GitHub Private Vulnerability Reporting](https://github.com).
3. Please provide comprehensive technical information:
   - Nature of the vulnerability (e.g., authentication bypass, CORS misconfiguration, cryptographic flaw, SSRF, injection, PII leak, biometric video exposure).
   - Target tier: `client` (TanStack Start / Nitro SSR), `server` (Backend Gateway), `services/ai`, `services/cv`, or WebSocket microservices.
   - Exact reproduction steps, curl commands, or non-destructive proof-of-concept scripts.
   - Remediation proposals or suggested mitigations.

### Response Timelines
- **Initial Acknowledgement**: Within 24-48 hours.
- **Triage & Impact Assessment**: Within 3 to 5 business days.
- **Remediation & Patch Deployment**: Critical severity fixes deployed immediately upon validation; public advisory coordinated once patched.

---

## Security Practices in Hastivo

### 1. Zero Hardcoded Credentials & Secret Hygiene
- Source code never contains production API keys, service credentials, database strings, or private keys.
- Secret tokens (such as `GROQ_API_KEY`, `JWT_SECRET`, `FIREBASE_ADMIN_CREDENTIALS`, `BREVO_API_KEY`) are managed strictly through server-side environment variables and are never dispatched to client browser bundles.

### 2. Privacy & Biometric Video Safeguards
- **Edge Vision Processing**: Camera frames captured for Indian Sign Language (ISL) recognition are processed locally whenever possible via MediaPipe hand landmark extraction; raw video streams are not stored on persistent public disks without explicit user consent.
- **Anonymous Signer Mode**: Supports cryptographically isolated anonymous sessions with pseudonymized sign hashes to protect user identity in public forums.

### 3. Authentication & Role-Based Access Control (RBAC)
- Token verification via JWT / Firebase Auth on every protected route.
- Administrative consoles (`/admin/*`) enforce strict role validation (`superadmin` / `moderator`) with server-side privilege checks.

### 4. Content Safety & Real-Time Moderation
- Both inbound speech-to-text, sign-to-text, and outbound avatar gloss syntheses undergo automated AI safety filtering to prevent abusive, hateful, or harmful transmissions.
- Multi-signature approvals required for committing user-generated regional dialect vocabulary to the authoritative ISL dictionary.

### 5. Client Application & SSR Hardening
- Built with Nitro SSR for Cloudflare Workers adhering to Content Security Policy (CSP) best practices.
- Dependencies tracked and audited with regular vulnerability scans (`npm audit`).
