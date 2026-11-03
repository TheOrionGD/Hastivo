"""
Signora AI — Landmark & Gesture Visualizer
Renders crisp skeletal joints, connection lines, bounding boxes, and label banners
using official Signora brand colors:
- Coral: #FF6F61 -> BGR (97, 111, 255)
- Blue: #6FA3EF -> BGR (239, 163, 111)
- Amber: #FFC107 -> BGR (7, 193, 255)
"""
import cv2
import numpy as np
from typing import List, Dict, Any

# Connections between the 21 MediaPipe hand landmarks
HAND_CONNECTIONS = [
    # Thumb
    (0, 1), (1, 2), (2, 3), (3, 4),
    # Index
    (0, 5), (5, 6), (6, 7), (7, 8),
    # Middle
    (5, 9), (9, 10), (10, 11), (11, 12),
    # Ring
    (9, 13), (13, 14), (14, 15), (15, 16),
    # Pinky
    (13, 17), (17, 18), (18, 19), (19, 20),
    # Palm base
    (0, 17)
]

COLOR_CORAL_BGR = (97, 111, 255)     # #FF6F61
COLOR_BLUE_BGR = (239, 163, 111)     # #6FA3EF
COLOR_AMBER_BGR = (7, 193, 255)      # #FFC107
COLOR_WHITE_BGR = (255, 255, 255)

def draw_hand_skeleton_and_labels(
    image: np.ndarray,
    hand_data: Dict[str, Any],
    recognized_sign: Dict[str, Any]
) -> np.ndarray:
    annotated = image.copy()
    h, w, _ = annotated.shape

    landmarks = hand_data.get("landmarks", [])
    if len(landmarks) < 21:
        return annotated

    # Convert normalized coords to pixel coords
    pixel_pts = []
    for lm in landmarks:
        px = int(lm["x"] * w)
        py = int(lm["y"] * h)
        pixel_pts.append((px, py))

    # 1. Draw connection lines in brand blue
    for p1_idx, p2_idx in HAND_CONNECTIONS:
        cv2.line(annotated, pixel_pts[p1_idx], pixel_pts[p2_idx], COLOR_BLUE_BGR, 2, cv2.LINE_AA)

    # 2. Draw joint dots in brand coral with white highlight
    for pt in pixel_pts:
        cv2.circle(annotated, pt, 5, COLOR_CORAL_BGR, -1, cv2.LINE_AA)
        cv2.circle(annotated, pt, 2, COLOR_WHITE_BGR, -1, cv2.LINE_AA)

    # 3. Draw Bounding Box and Label
    bbox = hand_data.get("boundingBox", {})
    if bbox:
        bx1 = int(bbox["minX"] * w)
        by1 = int(bbox["minY"] * h)
        bx2 = int(bbox["maxX"] * w)
        by2 = int(bbox["maxY"] * h)

        # Padding
        pad = 12
        bx1 = max(0, bx1 - pad)
        by1 = max(0, by1 - pad)
        bx2 = min(w, bx2 + pad)
        by2 = min(h, by2 + pad)

        cv2.rectangle(annotated, (bx1, by1), (bx2, by2), COLOR_CORAL_BGR, 2)

        # Label Banner
        label_text = f"{recognized_sign.get('label', 'HAND')}  {int(recognized_sign.get('confidence', 0.9) * 100)}%"
        (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        banner_y1 = max(0, by1 - th - 10)
        cv2.rectangle(annotated, (bx1, banner_y1), (bx1 + tw + 16, by1), COLOR_CORAL_BGR, -1)
        cv2.putText(
            annotated,
            label_text,
            (bx1 + 8, by1 - 6),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            COLOR_WHITE_BGR,
            2,
            cv2.LINE_AA
        )

    return annotated
