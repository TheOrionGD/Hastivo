# Hastivo AI — Security, Authentication & Moderation Architecture

## 1. Authentication & Cryptography

### Password Storage:
- No passwords are ever stored in plaintext.
- All credentials are mathematically hashed and salted using **bcrypt** with a salt work factor of 10 (`bcryptjs`).
- Passwords must satisfy complexity constraints (minimum 8 characters).

### JSON Web Tokens (JWT):
- Stateless authentication using HMAC-SHA256 signed JWTs.
- Secrets are stored in server-side environment variables (`JWT_SECRET`) and never exposed to client bundles.
- Tokens encode `id`, `email`, `role`, and expiration timestamps (`expiresIn: '7d'`).

### Role-Based Access Control (RBAC):
- `citizen`: Can access translation tools, 3D avatar studios, conversation history, and profile settings.
- `admin`: Can access audit trails, flagged content queues, user restriction management, and telemetry dashboards.

---

## 2. Administrative Restrictions & Automated Expiry

When inappropriate behavior or policy violations occur, administrators can apply structured restrictions:

### 1. Temporary Block (24 Hours)
- Blocks translation stream and features for exactly 24 hours (`now + 86400000 ms`).
- Stored in `targetUser.restrictionExpiresAt`.
- Automated Expiry Scheduler: On every authenticated user check, the system verifies whether `restrictionExpiresAt` has elapsed. If elapsed, access is automatically restored to `active` without data loss.

### 2. Temporary Suspension (7 Days)
- Blocks portal login for 7 days (`now + 7 * 86400000 ms`).
- Rejection response HTTP 403 Forbidden with exact expiry timestamp.
- Automatically restores after 7 days unless explicitly extended by an administrator.

---

## 3. Automated Notification Dispatch

When an account restriction is enforced:
1. Backend Gateway issues an asynchronous event to `microservice/` (`POST /api/v1/notifications/send`).
2. Microservice generates an official notification containing:
   - Reason for restriction.
   - Restriction classification (24h Block / 7d Suspension).
   - Start and Expiry timestamps.
   - Appeal submission instructions link (`/help/appeals`).
3. Dispatched through Brevo (or sandbox mock mailer in development).

---

## 4. AI Content Moderation System

Moderates manual text, speech dictation transcripts, and detected sign gestures.

### Categories:
- `INAPPROPRIATE_GESTURE`: Non-standard finger orientations conflicting with standard ISL lexicon.
- `HARASSMENT`: Bullying, demeaning language, or intimidation.
- `HATE_SPEECH`: Slurs, hate terms targeting groups.
- `PROFANITY`: Obscene or vulgar words.
- `DANGEROUS_CONTENT`: Threats or harmful directions.

### Core Governance Policy:
AI moderation outputs are classified as **review signals for human administrator evaluation**, never as automatic proof of misconduct.
