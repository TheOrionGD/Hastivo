# Security Policy

## Supported Versions

The following table details security support for versions of Hastivo.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We prioritize the security and privacy of our accessibility users and platform infrastructure. If you discover a vulnerability, please report it responsibly:

1. **Do not** disclose vulnerabilities publicly via GitHub issues, pull requests, or public discussions.
2. Email reports directly to: **hello.theoriongd@gmail.com** or use [GitHub Private Vulnerability Reporting](https://github.com).
3. Include relevant technical details:
   - Type of issue (e.g., buffer overflow, SQL/NoSQL injection, cross-site scripting, authentication bypass, secret exposure).
   - Step-by-step instructions or proof-of-concept scripts to reproduce the issue safely.
   - Affected service (`frontend`, `backend`, `ai-service`, `computer-vision`, or `microservice`).
   - Any suggested mitigations.

### Response Timelines
- **Initial Acknowledgement**: Within 24-48 hours.
- **Triage & Assessment**: Within 5 business days.
- **Patch & Remediation Advisory**: Depending on severity, critical patches are deployed as soon as verified.

## Security Practices in Hastivo
- **Strict Zero Hardcoded Credentials**: Source code never contains production keys, secrets, or JWT tokens.
- **JWT & Role-Based Access Control**: Gatekeeper authentication verifies tokens on every protected route.
- **Real-Time Automated Moderation**: Outbound and inbound sign content passes through AI text/sign safety filters.
- **Protected Environment Variables**: All confidential endpoints and credentials are provided via runtime environment variables.
