"""
Hastivo — ISL Static & Dynamic Gesture Classifier
Analyzes hand landmark geometries, finger extension states, inter-finger distances, and orientations
to classify ISL vocabulary signs with confidence scores.
"""
import numpy as np
from typing import List, Dict, Any, Optional

def distance_2d(p1: Dict[str, float], p2: Dict[str, float]) -> float:
    return float(np.sqrt((p1["x"] - p2["x"])**2 + (p1["y"] - p2["y"])**2))

def classify_hand_gesture(landmarks: List[Dict[str, float]], finger_states: Dict[str, bool]) -> Dict[str, Any]:
    """
    Classifies a single hand posture into an ISL sign label with confidence.
    """
    if len(landmarks) < 21:
        return {"label": "UNKNOWN", "confidence": 0.0, "category": "none"}

    thumb = finger_states.get("thumb", False)
    index = finger_states.get("index", False)
    middle = finger_states.get("middle", False)
    ring = finger_states.get("ring", False)
    pinky = finger_states.get("pinky", False)

    num_extended = sum([index, middle, ring, pinky])

    # Landmarks of interest
    wrist = landmarks[0]
    thumb_tip = landmarks[4]
    index_tip = landmarks[8]
    middle_tip = landmarks[12]
    ring_tip = landmarks[16]
    pinky_tip = landmarks[20]

    # Distances
    thumb_index_dist = distance_2d(thumb_tip, index_tip)
    thumb_pinky_dist = distance_2d(thumb_tip, pinky_tip)

    # 1. OPEN_PALM / HELLO: All 5 fingers extended
    if thumb and index and middle and ring and pinky:
        return {
            "label": "HELLO",
            "confidence": 0.96,
            "category": "greetings",
            "description": "Open hand with all fingers extended upright",
        }

    # 2. NAMASTE (Single hand representation / prayer orientation)
    if index and middle and ring and pinky and not thumb:
        return {
            "label": "NAMASTE",
            "confidence": 0.94,
            "category": "greetings",
            "description": "Fingers together upright in salute/respect",
        }

    # 3. WATER ('W' sign: index, middle, ring extended, thumb touching pinky)
    if index and middle and ring and not pinky and thumb_pinky_dist < 0.12:
        return {
            "label": "WATER",
            "confidence": 0.95,
            "category": "daily_needs",
            "description": "Three middle fingers extended forming 'W' sign for water",
        }

    # 4. YES (Fist with thumb up or all fingers curled except thumb)
    if thumb and not index and not middle and not ring and not pinky:
        # Check if thumb tip is above wrist
        if thumb_tip["y"] < wrist["y"]:
            return {
                "label": "YES",
                "confidence": 0.93,
                "category": "affirmation",
                "description": "Thumbs-up affirmative sign",
            }

    # 5. NO (Thumb, index, middle pinched or waving)
    if thumb and index and middle and not ring and not pinky and thumb_index_dist < 0.10:
        return {
            "label": "NO",
            "confidence": 0.91,
            "category": "negation",
            "description": "Index and middle tapping thumb in ISL 'No' sign",
        }

    # 6. 'I_LOVE_YOU' / 'HELP' gesture variant: Thumb, Index, Pinky extended
    if thumb and index and not middle and not ring and pinky:
        return {
            "label": "HELP",
            "confidence": 0.92,
            "category": "emergency",
            "description": "Thumb, index, and pinky extended in alert/signal",
        }

    # 7. VICTORY / TWO / PEACE: Index and Middle extended
    if not thumb and index and middle and not ring and not pinky:
        return {
            "label": "TWO",
            "confidence": 0.95,
            "category": "number",
            "description": "Two fingers extended in 'V' shape",
        }

    # 8. ONE: Only Index finger extended
    if not thumb and index and not middle and not ring and not pinky:
        return {
            "label": "ONE",
            "confidence": 0.95,
            "category": "number",
            "description": "Index finger extended upright",
        }

    # 9. THREE: Index, Middle, Ring extended
    if not thumb and index and middle and ring and not pinky:
        return {
            "label": "THREE",
            "confidence": 0.94,
            "category": "number",
            "description": "Three fingers extended upright",
        }

    # 10. FOUR: All 4 fingers extended, thumb curled
    if not thumb and index and middle and ring and pinky:
        return {
            "label": "FOUR",
            "confidence": 0.95,
            "category": "number",
            "description": "Four fingers extended, thumb folded",
        }

    # 11. THANK_YOU / PLEASE: Open flat hand tilted
    if index and middle and ring and pinky and thumb:
        return {
            "label": "THANK_YOU",
            "confidence": 0.88,
            "category": "courtesy",
            "description": "Flat palm facing forward / forward motion",
        }

    # 12. ISL LETTER 'L' (Thumb and Index extended at 90 degrees)
    if thumb and index and not middle and not ring and not pinky and thumb_index_dist > 0.12:
        return {
            "label": "L",
            "confidence": 0.94,
            "category": "alphabet",
            "description": "ISL fingerspelling letter 'L' (Thumb and index at right angle)",
        }

    # 13. ISL LETTER 'Y' (Thumb and Pinky extended, middle fingers curled)
    if thumb and not index and not middle and not ring and pinky:
        return {
            "label": "Y",
            "confidence": 0.93,
            "category": "alphabet",
            "description": "ISL fingerspelling letter 'Y' (Thumb and pinky horns)",
        }

    # 14. ISL LETTER 'B' / FOUR: Four fingers extended upright, thumb folded across palm
    if not thumb and index and middle and ring and pinky:
        return {
            "label": "B",
            "confidence": 0.92,
            "category": "alphabet",
            "description": "ISL letter 'B' / number 4 (Four vertical fingers)",
        }

    # 15. ISL LETTER 'C' / 'O': Curved hand shape with thumb near index
    if thumb and index and middle and not ring and not pinky and 0.08 <= thumb_index_dist <= 0.16:
        return {
            "label": "C",
            "confidence": 0.89,
            "category": "alphabet",
            "description": "ISL letter 'C' (Curved arc between thumb and index)",
        }

    # 16. FIST / REST / ISL LETTER 'A'
    if not thumb and not index and not middle and not ring and not pinky:
        return {
            "label": "A",
            "confidence": 0.90,
            "category": "alphabet",
            "description": "ISL letter 'A' / closed fist posture",
        }

    return {
        "label": "GESTURING",
        "confidence": 0.75,
        "category": "in_motion",
        "description": "Dynamic gesture transition in progress",
    }
