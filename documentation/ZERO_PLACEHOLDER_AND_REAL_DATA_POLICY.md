# STRICT ZERO-PLACEHOLDER, ZERO-MOCK-DATA AND ZERO-HARDCODED-DATA POLICY

This is a mandatory development rule for the entire repository, including `frontend/`, `backend/`, `ai-service/`, `computer-vision/`, `microservice/`, `showcase/`, and `testing/`.

**The objective is to build a genuinely functional, data-driven application—not a visually complete application filled with fabricated content.**

---

## 1. Absolutely No Dummy or Placeholder Data

Do not introduce:
- Dummy user accounts.
- Fake user profiles.
- Random names, emails, phone numbers, or profile information.
- Hardcoded dashboard statistics.
- Fake translation results.
- Fabricated AI responses.
- Simulated sign recognition results.
- Random gesture labels or confidence scores.
- Fake conversation messages.
- Artificial conversation history.
- Hardcoded notification records.
- Fake moderation alerts.
- Invented analytics.
- Placeholder API responses.
- Static transaction or activity records.
- Fake service health statuses.
- Hardcoded success messages that imply an operation succeeded.
- Predefined values presented as real user-generated or system-generated data.

Do not populate the interface with invented information merely to make it look complete.

---

## 2. No Hardcoded Application Data

All dynamic application data must come from its actual source:
- **User information** → authenticated backend and database.
- **Dashboard statistics** → actual database aggregations.
- **Translation results** → configured AI service.
- **Gesture recognition** → actual computer vision model.
- **Conversation history** → persisted database records.
- **Notifications** → notification service and database.
- **Moderation records** → actual moderation pipeline.
- **User preferences** → persisted settings.
- **Service status** → actual health-check responses.
- **Admin analytics** → actual system records.

Do not place application data directly inside frontend components, static JavaScript arrays, JSON files, or hardcoded API responses.

Use centralized configuration for legitimate constants such as theme colors, route names, supported languages, and system settings.

---

## 3. No Fake API Integrations

Every API call must connect to its intended backend endpoint or service.
- Do not return hardcoded JSON from API handlers.
- Do not use artificial delays to imitate backend processing.
- Do not display success when a request has failed.
- Do not silently replace failed API responses with fabricated data.
- Do not create frontend-only functionality for features that require backend persistence.
- Do not use hardcoded localhost URLs throughout the codebase.
- Use environment-based service configuration.
- Implement actual request validation, response handling, authentication, and error reporting.

If an endpoint is not implemented, identify it as unavailable instead of inventing a response.

---

## 4. No Fake AI or Computer Vision Processing

AI and computer vision must perform genuine processing.
- Never generate random AI translations.
- Never return predefined sign sequences as if they were model predictions.
- Never simulate hand tracking using manually generated landmark coordinates.
- Never assign arbitrary confidence scores.
- Never convert arbitrary camera frames into invented sign labels.
- Never use a hardcoded sentence as an AI-generated result.
- Never claim a model has successfully processed input when it has not.

When a model, dataset, provider, or credential is unavailable:
1. Return an explicit, structured service-unavailable response.
2. Display a clear message to the user.
3. Log the actual failure.
4. Preserve the user's input when appropriate.
5. Provide a retry mechanism where appropriate.
6. Document the missing dependency.

A failed AI or computer vision request must never be presented as a successful translation.

---

## 5. No Fake Dashboard or Analytics Values

Every dashboard metric must be calculated using actual persisted data.

Examples:
- Total registered users.
- Active users.
- Translation count.
- Text-to-Sign requests.
- Sign-to-Text requests.
- Conversation sessions.
- Moderation reports.
- Recent activity.
- System performance metrics.

If no records exist, display a genuine empty state:
- `0` for a verified numerical count.
- `"No activity yet"` for an empty activity list.
- `"No translations available"` when no translation records exist.
- `"No notifications"` when no notifications exist.

Never fill empty areas with invented records or statistics.

---

## 6. No Fake Functionality Behind UI Controls

Every visible interactive element must perform its intended operation.

Examples:
- **Save** must persist the actual changes.
- **Delete** must delete the authorized record.
- **Search** must search real records.
- **Filter** must filter actual results.
- **Export** must generate an actual export.
- **Login** must authenticate against the backend.
- **Registration** must create a real account.
- **Camera controls** must operate the real camera stream.
- **Microphone controls** must operate actual audio capture.
- **Replay** must replay the actual stored or generated sequence.
- **Theme and language changes** must update the actual application state and persist where required.

Do not leave buttons, links, dropdowns, switches, or forms as decorative elements.

If an operation is not yet supported, disable it or clearly label it as unavailable rather than pretending it works.

---

## 7. Proper Empty, Loading, Error and Unavailable States

A professional application must handle missing data correctly.

Implement genuine states for:
- Initial loading.
- Empty database results.
- No search results.
- Network failure.
- Authentication failure.
- Permission denial.
- AI service unavailable.
- Computer vision unavailable.
- Model loading.
- Camera initialization failure.
- Translation processing failure.
- Database connection failure.
- Real-time connection interruption.

Use clear messages, retry actions, and appropriate recovery behavior.

Never use dummy content to hide an empty state or error.

---

## 8. Testing Restrictions

Mocking may be used only in isolated unit tests when necessary to test a specific dependency or failure condition.

However:
- Test mocks must remain inside the test environment.
- Never import mock fixtures into production code.
- Never use mock API responses in the actual application.
- Never use fabricated recognition results to claim model accuracy.
- Integration tests must exercise real service boundaries.
- End-to-end tests must verify actual workflows against the configured test environment.
- Test data must be clearly identified, isolated, and removed or reset safely after testing.

Test fixtures are permitted only when explicitly separated from production data and never presented as genuine user or system records.

---

## 9. Hardcoded Credentials and Secrets Are Strictly Prohibited

Never hardcode:
- API keys.
- Database credentials.
- JWT secrets.
- SMTP credentials.
- Cloud credentials.
- Private tokens.
- Production URLs containing sensitive information.

Use environment variables and secure secret management.

Provide `.env.example` files containing variable names and safe instructional values only.

Never commit actual credentials.

---

## 10. Repository-Wide Verification

Before declaring any module complete:
1. Search the entire module for placeholder strings and dummy data.
2. Inspect static arrays and hardcoded JSON responses.
3. Inspect API handlers for fabricated responses.
4. Verify that frontend data originates from actual services.
5. Verify database persistence.
6. Verify real AI and computer vision execution.
7. Verify loading, empty, error, and unavailable states.
8. Verify that all visible actions work.
9. Run relevant tests.
10. Report any remaining limitations honestly.

Search for patterns such as:
`TODO`, `FIXME`, `PLACEHOLDER`, `DUMMY`, `MOCK`, `FAKE`, `SAMPLE`, `HARDCODED`, `Coming Soon`, and temporary fallback responses.

These keywords are investigation targets, not automatic proof of a defect. Review each occurrence and remove production placeholders or explicitly document legitimate development-only uses.

---

## FINAL NON-NEGOTIABLE RULE

**Never sacrifice functional correctness for visual completeness. Never fabricate data to make a screen look populated. Never simulate an integration to make a feature appear operational.**

If real data is unavailable, show a proper empty or unavailable state.

If a service is not implemented, report it as incomplete.

If an external dependency is missing, identify it explicitly.

If a feature cannot be verified, do not mark it as completed.

The final application must display only genuine user data, actual database results, real AI outputs, verified computer vision results, and authentic service responses.
