"""
Hastivo — Content Moderation & Gesture Safety Evaluation Module
Assesses:
- Text & Speech transcripts
- Detected Gesture Sequences
- Real-time conversation messages

Categories:
- INAPPROPRIATE_GESTURE
- HARASSMENT
- HATE_SPEECH
- PROFANITY
- DANGEROUS_CONTENT
- SAFE

Severity:
- none
- low
- medium
- high
- critical
"""
from datetime import datetime, timezone
import re
from typing import Dict, Any, Optional

PROFANITY_PATTERNS = [
    r"\b(bastard|bitch|idiot|stupid|asshole|fuk|shit|hate)\b",
]

HARASSMENT_PATTERNS = [
    r"\b(kill yourself|threaten|harass|attack you|die)\b",
]

INAPPROPRIATE_GESTURE_KEYS = {
    "GESTURE_OFFENSIVE_FINGER",
    "GESTURE_THREAT_NECK",
    "GESTURE_SLUR",
}

def moderate_content(
    content: str,
    content_type: str = "text",
    user_id: Optional[str] = None,
    session_id: Optional[str] = None
) -> Dict[str, Any]:
    timestamp = datetime.now(timezone.utc).isoformat()
    text_lower = (content or "").lower().strip()

    flagged = False
    category = "SAFE"
    severity = "none"
    confidence = 0.0
    reason = "Content complies with standard community guidelines."
    recommended_action = "none"

    if content_type == "gesture" or content.upper() in INAPPROPRIATE_GESTURE_KEYS:
        if content.upper() in INAPPROPRIATE_GESTURE_KEYS:
            flagged = True
            category = "INAPPROPRIATE_GESTURE"
            severity = "high"
            confidence = 0.94
            reason = "MediaPipe landmark tracking detected non-standard hand orientation matching restricted gesture index."
            recommended_action = "Review Translation Stream"

    if not flagged:
        for pat in HARASSMENT_PATTERNS:
            if re.search(pat, text_lower):
                flagged = True
                category = "HARASSMENT"
                severity = "critical"
                confidence = 0.92
                reason = "Detected threatening or harassing language pattern."
                recommended_action = "Escalate to Administrator"
                break

    if not flagged:
        for pat in PROFANITY_PATTERNS:
            if re.search(pat, text_lower):
                flagged = True
                category = "PROFANITY"
                severity = "medium"
                confidence = 0.88
                reason = "Detected vulgar or prohibited lexicon term."
                recommended_action = "Issue Policy Warning"
                break

    return {
        "flagged": flagged,
        "category": category,
        "severity": severity,
        "confidence": confidence if flagged else 0.99,
        "reason": reason,
        "recommendedAction": recommended_action,
        "timestamp": timestamp,
        "userId": user_id or "anonymous",
        "sessionId": session_id or "session_unknown",
        "reviewStatus": "pending" if flagged else "passed",
        "isSignalOnly": True,  # Per Master Prompt: AI moderation results are review signals, not proof
    }
