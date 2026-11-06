from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import base64
import json
import cv2
import numpy as np
import uvicorn

from .config import vision_settings
from .schemas import (
    DetectFrameRequest,
    ClassifyLandmarksRequest,
    VisionResponse,
    RecognizedSignItem,
    ContinuousStreamFrameRequest,
    ContinuousSequenceRequest
)
from .modules.hand_tracker import HandTracker, MP_AVAILABLE
from .modules.gesture_classifier import classify_hand_gesture
from .modules.continuous_recognition import ContinuousSignRecognizer
from .modules.visualizer import draw_hand_skeleton_and_labels
from .modules import isl_dataset_service

app = FastAPI(
    title=vision_settings.SERVICE_NAME,
    version=vision_settings.API_VERSION,
    description="Real-Time MediaPipe Hand Landmark Tracking, Continuous Gesture Recognition and Temporal BiLSTM Service",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global HandTracker Instance
tracker = HandTracker(
    min_detection_confidence=vision_settings.MIN_DETECTION_CONFIDENCE,
    min_tracking_confidence=vision_settings.MIN_TRACKING_CONFIDENCE,
    max_num_hands=vision_settings.MAX_NUM_HANDS
)

# Global Continuous Sign Recognizer Instance
continuous_recognizer = ContinuousSignRecognizer(window_size=30, stride=5)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": vision_settings.SERVICE_NAME,
        "version": vision_settings.API_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mediapipeAvailable": MP_AVAILABLE,
        "maxHands": vision_settings.MAX_NUM_HANDS,
        "minConfidence": vision_settings.MIN_DETECTION_CONFIDENCE,
        "islDatasetConfigured": isl_dataset_service.get_dataset_status()["isAvailable"],
        "continuousRecognitionPipeline": "ONLINE",
        "continuousVocabSize": len(continuous_recognizer.model.classifier[-1].weight),
    }

@app.post("/api/v1/vision/continuous-frame")
def api_continuous_frame(req: ContinuousStreamFrameRequest):
    """
    Ingests continuous live stream hand detections frame-by-frame,
    evaluates sliding window trajectory, motion kinetic energy, and pauses.
    """
    feat = ContinuousSignRecognizer.extract_frame_feature(req.hands)
    res = continuous_recognizer.add_frame(feat)
    return {
        "status": "success",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "result": res or {"detected": False, "motionEnergy": 0.0, "isPause": True}
    }

@app.post("/api/v1/vision/continuous-sequence")
def api_continuous_sequence(req: ContinuousSequenceRequest):
    """
    Decodes full dynamic multi-frame continuous sequence into ordered recognized sign sequence.
    """
    tokens = continuous_recognizer.process_continuous_sequence(req.frameLandmarks)
    return {
        "status": "success",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "count": len(tokens),
        "recognizedTokens": tokens
    }

@app.get("/api/v1/vision/dataset/info")
def get_dataset_info():
    """Returns ISL dataset storage stats, sample counts, and class configurations."""
    return isl_dataset_service.get_dataset_status()

@app.get("/api/v1/vision/dataset/classes")
def get_dataset_classes():
    """Returns the list of all 35 supported ISL alphabet and digit classes."""
    return {
        "count": len(isl_dataset_service.LABEL_ID_TO_NAME),
        "classes": isl_dataset_service.get_all_classes()
    }

@app.get("/api/v1/vision/dataset/sample/{class_name}")
def get_dataset_sample(class_name: str):
    """Fetches a real base64-encoded visual sample and metadata for a specific class (e.g. 'A', '1')."""
    sample = isl_dataset_service.get_class_sample(class_name)
    if not sample:
        raise HTTPException(status_code=404, detail=f"Class '{class_name}' not found in ISL dataset.")
    return sample

@app.post("/api/v1/vision/classify-landmarks", response_model=VisionResponse)
def api_classify_landmarks(req: ClassifyLandmarksRequest):
    pts = [{"x": p.x, "y": p.y, "z": p.z or 0.0} for p in req.landmarks]
    finger_states = tracker.calculate_finger_extensions(pts)
    gesture = classify_hand_gesture(pts, finger_states)

    now_iso = datetime.now(timezone.utc).isoformat()
    recognized = [
        RecognizedSignItem(
            label=gesture["label"],
            confidence=gesture["confidence"],
            category=gesture["category"],
            description=gesture["description"],
            startTime=int(datetime.now().timestamp() * 1000) - 200,
            endTime=int(datetime.now().timestamp() * 1000),
        )
    ]

    hand_info = {
        "handedness": req.handedness,
        "landmarks": pts,
        "fingerExtensions": finger_states,
    }

    return VisionResponse(
        sessionId=req.sessionId or "session-default",
        timestamp=now_iso,
        status="processed",
        recognizedSigns=recognized,
        hands=[hand_info],
        annotatedImageBase64=None,
    )

@app.post("/api/v1/vision/detect-frame", response_model=VisionResponse)
def api_detect_frame(req: DetectFrameRequest):
    try:
        header_stripped = req.imageBase64
        if "," in header_stripped:
            header_stripped = header_stripped.split(",", 1)[1]

        img_bytes = base64.b64decode(header_stripped)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img_bgr is None:
            raise HTTPException(status_code=400, detail="Invalid frame image format")

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        hands_detected = tracker.process_rgb_image(img_rgb)

        recognized_signs = []
        annotated_bgr = img_bgr.copy()

        for h in hands_detected:
            gesture = classify_hand_gesture(h["landmarks"], h["fingerExtensions"])
            sign_item = RecognizedSignItem(
                label=gesture["label"],
                confidence=gesture["confidence"],
                category=gesture["category"],
                description=gesture["description"],
                startTime=int(datetime.now().timestamp() * 1000) - 300,
                endTime=int(datetime.now().timestamp() * 1000),
            )
            recognized_signs.append(sign_item)

            if req.returnAnnotatedImage:
                annotated_bgr = draw_hand_skeleton_and_labels(annotated_bgr, h, gesture)

        annotated_b64 = None
        if req.returnAnnotatedImage and hands_detected:
            _, buffer = cv2.imencode(".jpg", annotated_bgr)
            annotated_b64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

        return VisionResponse(
            sessionId=req.sessionId or "session-default",
            timestamp=datetime.now(timezone.utc).isoformat(),
            status="processed",
            recognizedSigns=recognized_signs,
            hands=hands_detected,
            annotatedImageBase64=annotated_b64,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Frame processing error: {str(e)}")

@app.websocket("/ws/v1/vision/stream")
async def websocket_vision_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            if "landmarks" in payload:
                # Direct landmark processing
                lms = payload["landmarks"]
                finger_states = tracker.calculate_finger_extensions(lms)
                gesture = classify_hand_gesture(lms, finger_states)

                # Feed into continuous temporal engine
                hands_payload = [{"handedness": payload.get("handedness", "Right"), "landmarks": lms}]
                feat = ContinuousSignRecognizer.extract_frame_feature(hands_payload)
                cont_res = continuous_recognizer.add_frame(feat)

                await websocket.send_json({
                    "status": "success",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "gesture": gesture,
                    "fingerExtensions": finger_states,
                    "continuous": cont_res,
                })
            elif "image" in payload:
                # Base64 image frame processing
                header_stripped = payload["image"]
                if "," in header_stripped:
                    header_stripped = header_stripped.split(",", 1)[1]
                img_bytes = base64.b64decode(header_stripped)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img_bgr is not None:
                    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
                    hands = tracker.process_rgb_image(img_rgb)
                    gestures = [classify_hand_gesture(h["landmarks"], h["fingerExtensions"]) for h in hands]
                    await websocket.send_json({
                        "status": "success",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "hands": hands,
                        "gestures": gestures,
                    })
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"status": "error", "message": str(e)})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=vision_settings.HOST, port=vision_settings.PORT, reload=False)
