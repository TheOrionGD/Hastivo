from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import uvicorn

from .config import settings
from .schemas import TextToSignRequest, SignToTextRequest, ModerationRequest
from .modules.text_to_sign import translate_text_to_sign, ISL_LEXICON
from .modules.sign_to_text import process_sign_to_text
from .modules.moderation import moderate_content
from .modules.language_detector import detect_language, LANGUAGE_NAMES

app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.API_VERSION,
    description="Hastivo Artificial Intelligence and ISL Language Processing Microservice",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.API_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "modules": {
            "textToSign": "ONLINE",
            "signToText": "ONLINE",
            "moderationEngine": "ONLINE",
            "languageDetector": "ONLINE",
        },
        "lexiconCount": len(ISL_LEXICON),
    }

@app.get("/api/v1/ai/languages")
def get_supported_languages():
    return {
        "success": True,
        "supportedLanguages": [
            {"code": code, "name": name, "direction": "rtl" if code == "ur" else "ltr"}
            for code, name in LANGUAGE_NAMES.items()
        ],
    }

@app.get("/api/v1/ai/lexicon")
def get_lexicon():
    return {
        "success": True,
        "count": len(ISL_LEXICON),
        "lexicon": [
            {"gloss": k, **v} for k, v in ISL_LEXICON.items()
        ],
    }

@app.post("/api/v1/ai/detect-language")
def api_detect_language(payload: dict):
    text = payload.get("text", "")
    return {"success": True, "result": detect_language(text)}

@app.post("/api/v1/ai/text-to-sign")
def api_text_to_sign(req: TextToSignRequest):
    try:
        result = translate_text_to_sign(req.text, dialect=req.dialect or "standard")
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-Sign processing failed: {str(e)}")

@app.post("/api/v1/ai/sign-to-text")
def api_sign_to_text(req: SignToTextRequest):
    try:
        result = process_sign_to_text(req.signs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sign-to-Text processing failed: {str(e)}")

@app.post("/api/v1/ai/moderate")
def api_moderate(req: ModerationRequest):
    try:
        result = moderate_content(
            content=req.content,
            content_type=req.contentType,
            user_id=req.userId,
            session_id=req.sessionId,
        )
        return {"success": True, "moderation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Moderation check failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
