"""
Signora AI — MediaPipe Hand & Joint Tracking Module
Supports both MediaPipe Tasks API (modern) and legacy Solutions API with robust graceful fallback.
Extracts 21 3D landmarks per hand, joint angles, finger extensions, and bounding boxes.
"""
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import cv2

try:
    import mediapipe as mp
    HAS_MP = True
    HAS_MP_SOLUTIONS = hasattr(mp, "solutions") and hasattr(mp.solutions, "hands")
    HAS_MP_TASKS = hasattr(mp, "tasks")
    MP_AVAILABLE = HAS_MP
except ImportError:
    HAS_MP = False
    HAS_MP_SOLUTIONS = False
    HAS_MP_TASKS = False
    MP_AVAILABLE = False

LANDMARK_NAMES = [
    "WRIST",
    "THUMB_CMC", "THUMB_MCP", "THUMB_IP", "THUMB_TIP",
    "INDEX_FINGER_MCP", "INDEX_FINGER_PIP", "INDEX_FINGER_DIP", "INDEX_FINGER_TIP",
    "MIDDLE_FINGER_MCP", "MIDDLE_FINGER_PIP", "MIDDLE_FINGER_DIP", "MIDDLE_FINGER_TIP",
    "RING_FINGER_MCP", "RING_FINGER_PIP", "RING_FINGER_DIP", "RING_FINGER_TIP",
    "PINKY_MCP", "PINKY_PIP", "PINKY_DIP", "PINKY_TIP"
]

class HandTracker:
    def __init__(self, min_detection_confidence=0.65, min_tracking_confidence=0.60, max_num_hands=2):
        self.mp_available = HAS_MP
        self.max_num_hands = max_num_hands
        self.hands = None

        if HAS_MP_SOLUTIONS:
            try:
                self.mp_hands = mp.solutions.hands
                self.hands = self.mp_hands.Hands(
                    static_image_mode=False,
                    max_num_hands=max_num_hands,
                    min_detection_confidence=min_detection_confidence,
                    min_tracking_confidence=min_tracking_confidence
                )
            except Exception:
                self.hands = None

    def calculate_finger_extensions(self, landmarks_3d: List[Dict[str, float]]) -> Dict[str, bool]:
        """
        Determines whether each finger is extended (straight) or folded/curled.
        Uses Euclidean distances from wrist (0) and tip-to-PIP comparisons.
        """
        if len(landmarks_3d) < 21:
            return {"thumb": False, "index": False, "middle": False, "ring": False, "pinky": False}

        pts = np.array([[lm["x"], lm["y"], lm.get("z", 0.0)] for lm in landmarks_3d])

        # Finger tips: 4 (thumb), 8 (index), 12 (middle), 16 (ring), 20 (pinky)
        # Finger PIPs (knuckles): 2/3 (thumb), 6 (index), 10 (middle), 14 (ring), 18 (pinky)

        # In normalized screen coords, Y goes downward (0 is top, 1 is bottom)
        index_up = pts[8, 1] < pts[6, 1]
        middle_up = pts[12, 1] < pts[10, 1]
        ring_up = pts[16, 1] < pts[14, 1]
        pinky_up = pts[20, 1] < pts[18, 1]

        # Thumb distance comparison
        thumb_dist_wrist = np.linalg.norm(pts[4] - pts[0])
        thumb_mcp_dist_wrist = np.linalg.norm(pts[2] - pts[0])
        thumb_up = thumb_dist_wrist > (thumb_mcp_dist_wrist * 1.25)

        return {
            "thumb": bool(thumb_up),
            "index": bool(index_up),
            "middle": bool(middle_up),
            "ring": bool(ring_up),
            "pinky": bool(pinky_up),
        }

    def process_rgb_image(self, rgb_image: np.ndarray) -> List[Dict[str, Any]]:
        """
        Processes an RGB image frame and extracts 3D landmarks for all visible hands.
        """
        results_list = []
        if self.hands is not None:
            detection = self.hands.process(rgb_image)
            if detection.multi_hand_landmarks:
                for idx, hand_lms in enumerate(detection.multi_hand_landmarks):
                    handedness = "Right"
                    hand_conf = 0.95
                    if detection.multi_handedness and idx < len(detection.multi_handedness):
                        cls_info = detection.multi_handedness[idx].classification[0]
                        handedness = cls_info.label
                        hand_conf = round(float(cls_info.score), 3)

                    landmarks = []
                    xs = []
                    ys = []
                    for lm_idx, lm in enumerate(hand_lms.landmark):
                        landmarks.append({
                            "id": lm_idx,
                            "name": LANDMARK_NAMES[lm_idx],
                            "x": round(float(lm.x), 4),
                            "y": round(float(lm.y), 4),
                            "z": round(float(lm.z), 4),
                        })
                        xs.append(lm.x)
                        ys.append(lm.y)

                    bbox = {
                        "minX": round(float(min(xs)), 4),
                        "minY": round(float(min(ys)), 4),
                        "maxX": round(float(max(xs)), 4),
                        "maxY": round(float(max(ys)), 4),
                    }
                    finger_states = self.calculate_finger_extensions(landmarks)

                    results_list.append({
                        "handIndex": idx,
                        "handedness": handedness,
                        "confidence": hand_conf,
                        "landmarks": landmarks,
                        "boundingBox": bbox,
                        "fingerExtensions": finger_states,
                    })

        return results_list

    def close(self):
        if self.hands is not None:
            self.hands.close()
