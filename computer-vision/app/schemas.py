from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class LandmarkPoint(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    x: float
    y: float
    z: Optional[float] = 0.0

class ClassifyLandmarksRequest(BaseModel):
    sessionId: Optional[str] = "session-default"
    landmarks: List[LandmarkPoint]
    handedness: Optional[str] = "Right"

class DetectFrameRequest(BaseModel):
    sessionId: Optional[str] = "session-default"
    imageBase64: str = Field(..., description="Base64 encoded RGB or JPEG frame")
    returnAnnotatedImage: Optional[bool] = False

class RecognizedSignItem(BaseModel):
    label: str
    confidence: float
    startTime: Optional[int] = None
    endTime: Optional[int] = None
    category: Optional[str] = "gesture"
    description: Optional[str] = ""

class VisionResponse(BaseModel):
    sessionId: str
    timestamp: str
    status: str
    recognizedSigns: List[RecognizedSignItem]
    hands: List[Dict[str, Any]]
    annotatedImageBase64: Optional[str] = None

class ContinuousStreamFrameRequest(BaseModel):
    sessionId: Optional[str] = "session-default"
    hands: List[Dict[str, Any]]
    timestampMs: Optional[int] = None

class ContinuousSequenceRequest(BaseModel):
    sessionId: Optional[str] = "session-default"
    frameLandmarks: List[List[float]] = Field(..., description="List of 126-dimensional landmark vectors per frame")

