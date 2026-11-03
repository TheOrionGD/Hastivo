from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TextToSignRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input natural text or speech transcript")
    sourceLanguage: Optional[str] = Field(None, description="Optional override language code (e.g., 'en', 'hi', 'ta')")
    dialect: Optional[str] = Field("standard", description="Regional ISL dialect: 'standard', 'northern', or 'southern'")

class SignItem(BaseModel):
    label: str
    confidence: Optional[float] = 0.95
    startTime: Optional[int] = None
    endTime: Optional[int] = None

class SignToTextRequest(BaseModel):
    signs: List[Any] = Field(..., description="List of recognized sign glosses or objects")
    sessionId: Optional[str] = None

class ModerationRequest(BaseModel):
    content: str = Field(..., description="Text, transcript, or gesture key to evaluate")
    contentType: Optional[str] = "text"
    userId: Optional[str] = None
    sessionId: Optional[str] = None
