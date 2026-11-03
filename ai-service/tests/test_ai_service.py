import pytest
from app.modules.text_to_sign import translate_text_to_sign, transform_to_isl_grammar
from app.modules.sign_to_text import process_sign_to_text, synthesize_grammatical_sentence
from app.modules.moderation import moderate_content
from app.modules.language_detector import detect_language

def test_text_to_sign_translation():
    res = translate_text_to_sign("Hello friend want water")
    assert res["success"] is True
    assert "islGlossSequence" in res
    assert len(res["animationSequence"]) > 0
    assert res["grammarFormat"] == "ISL_TSOV"

def test_text_to_sign_interrogative_reordering():
    tokens = ["WHERE", "IS", "BUS"]
    reordered = transform_to_isl_grammar(tokens)
    # Question word WHERE should be at the end
    assert reordered[-1] == "WHERE"

def test_sign_to_text_synthesis():
    signs = [
        {"label": "TRAIN", "confidence": 0.98},
        {"label": "DELHI", "confidence": 0.95},
        {"label": "PLATFORM", "confidence": 0.97},
        {"label": "THREE", "confidence": 0.99},
    ]
    res = process_sign_to_text(signs)
    assert res["success"] is True
    assert "platform three" in res["synthesizedSentence"].lower()
    assert res["overallConfidence"] > 0.9

def test_sign_to_text_deduplication():
    # Consecutive duplicate gesture frames must be smoothed
    signs = ["HELLO", "HELLO", "NAMASTE"]
    res = process_sign_to_text(signs)
    assert res["smoothedGlosses"] == ["HELLO", "NAMASTE"]

def test_moderation_flagged_content():
    mod = moderate_content("You are an idiot and I hate you", content_type="text")
    assert mod["flagged"] is True
    assert mod["category"] in ["HARASSMENT", "PROFANITY"]
    assert mod["severity"] in ["medium", "high", "critical"]

def test_moderation_safe_content():
    mod = moderate_content("Good morning, how are you today?", content_type="text")
    assert mod["flagged"] is False
    assert mod["category"] == "SAFE"
    assert mod["severity"] == "none"

def test_language_detection():
    hindi = detect_language("नमस्ते आप कैसे हैं")
    assert hindi["code"] == "hi"

    tamil = detect_language("வணக்கம் எப்படி இருக்கிறீர்கள்")
    assert tamil["code"] == "ta"

    english = detect_language("Welcome to Signora assistive platform")
    assert english["code"] == "en"

def test_regional_dialect_engine():
    # Northern dialect variation
    res_north = translate_text_to_sign("Thank you", dialect="northern")
    assert res_north["dialect"] == "northern"
    assert res_north["animationSequence"][0]["kinematicPose"] == "SIGN_THANK_YOU_NORTH"

    # Southern dialect variation
    res_south = translate_text_to_sign("Thank you", dialect="southern")
    assert res_south["dialect"] == "southern"
    assert res_south["animationSequence"][0]["kinematicPose"] == "SIGN_THANK_YOU_SOUTH"

