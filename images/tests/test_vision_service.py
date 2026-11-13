import pytest
import numpy as np
from app.modules.hand_tracker import HandTracker, LANDMARK_NAMES
from app.modules.gesture_classifier import classify_hand_gesture
from app.modules.visualizer import draw_hand_skeleton_and_labels

def generate_mock_hand_landmarks(all_open=True):
    # Generates synthetic 21 landmarks for testing without requiring a physical webcam
    landmarks = []
    for i in range(21):
        landmarks.append({
            "id": i,
            "name": LANDMARK_NAMES[i],
            "x": 0.5 + (i * 0.01),
            "y": 0.7 - (0.3 if (i in [4, 8, 12, 16, 20] and all_open) else 0.1),
            "z": 0.0,
        })
    return landmarks

def test_hand_tracker_finger_extensions():
    tracker = HandTracker()
    open_landmarks = generate_mock_hand_landmarks(all_open=True)
    extensions = tracker.calculate_finger_extensions(open_landmarks)
    assert isinstance(extensions, dict)
    assert "index" in extensions
    assert "thumb" in extensions

def test_gesture_classifier_open_palm():
    landmarks = generate_mock_hand_landmarks(all_open=True)
    finger_states = {"thumb": True, "index": True, "middle": True, "ring": True, "pinky": True}
    res = classify_hand_gesture(landmarks, finger_states)
    assert res["label"] == "HELLO"
    assert res["confidence"] > 0.9

def test_gesture_classifier_thumbs_up_yes():
    landmarks = generate_mock_hand_landmarks(all_open=False)
    # Thumb tip y < wrist y
    landmarks[4]["y"] = 0.2
    landmarks[0]["y"] = 0.8
    finger_states = {"thumb": True, "index": False, "middle": False, "ring": False, "pinky": False}
    res = classify_hand_gesture(landmarks, finger_states)
    assert res["label"] == "YES"

def test_visualizer_rendering():
    dummy_img = np.zeros((480, 640, 3), dtype=np.uint8)
    hand_data = {
        "landmarks": generate_mock_hand_landmarks(all_open=True),
        "boundingBox": {"minX": 0.3, "minY": 0.2, "maxX": 0.7, "maxY": 0.8},
    }
    gesture = {"label": "NAMASTE", "confidence": 0.95}
    annotated = draw_hand_skeleton_and_labels(dummy_img, hand_data, gesture)
    assert annotated.shape == (480, 640, 3)
    # Ensure visualizer drew pixels
    assert np.any(annotated > 0)

def test_api_classify_landmarks_endpoint():
    from starlette.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    mock_lms = [{"id": i, "x": 0.5, "y": 0.5 - (0.3 if i in [4, 8, 12, 16, 20] else 0.1), "z": 0.0} for i in range(21)]
    payload = {
        "sessionId": "test-session-001",
        "landmarks": mock_lms,
        "handedness": "Right"
    }
    response = client.post("/api/v1/vision/classify-landmarks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "processed"
    assert len(data["recognizedSigns"]) > 0
    assert data["sessionId"] == "test-session-001"

def test_isl_dataset_service():
    from app.modules import isl_dataset_service

    status = isl_dataset_service.get_dataset_status()
    assert status["totalClasses"] == 35

    classes = isl_dataset_service.get_all_classes()
    assert len(classes) == 35
    assert any(c["name"] == "A" for c in classes)
    assert any(c["name"] == "1" for c in classes)

    if status.get("isAvailable"):
        assert status["totalSamples"] == 42745
        sample = isl_dataset_service.get_class_sample("A")
        assert sample is not None
        assert sample["className"] == "A"
        assert sample["sampleImageBase64"] is not None

def test_api_dataset_endpoints():
    from starlette.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    
    # 1. Dataset Info
    res_info = client.get("/api/v1/vision/dataset/info")
    assert res_info.status_code == 200
    info_data = res_info.json()
    assert info_data["totalClasses"] == 35

    # 2. Classes
    res_classes = client.get("/api/v1/vision/dataset/classes")
    assert res_classes.status_code == 200
    assert res_classes.json()["count"] == 35

    # 3. Sample (if dataset downloaded)
    if info_data.get("isAvailable"):
        assert info_data["totalSamples"] == 42745
        res_sample = client.get("/api/v1/vision/dataset/sample/A")
        assert res_sample.status_code == 200
        assert res_sample.json()["className"] == "A"
