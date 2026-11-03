"""
Hastivo AI — Multilingual Language Identification Module
Supports:
- English (en) [Latin]
- Hindi (hi) [Devanagari: \u0900-\u097F]
- Tamil (ta) [Tamil: \u0B80-\u0BFF]
- Telugu (te) [Telugu: \u0C00-\u0C7F]
- Kannada (kn) [Kannada: \u0C80-\u0CFF]
- Malayalam (ml) [Malayalam: \u0D00-\u0D7F]
- Urdu (ur) [Arabic/Nastaliq: \u0600-\u06FF]
"""
import re

UNICODE_RANGES = {
    "hi": (0x0900, 0x097F),  # Devanagari
    "ta": (0x0B80, 0x0BFF),  # Tamil
    "te": (0x0C00, 0x0C7F),  # Telugu
    "kn": (0x0C80, 0x0CFF),  # Kannada
    "ml": (0x0D00, 0x0D7F),  # Malayalam
    "ur": (0x0600, 0x06FF),  # Arabic / Urdu
}

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "ur": "Urdu",
}

def detect_language(text: str) -> dict:
    if not text or not text.strip():
        return {
            "code": "en",
            "name": "English",
            "confidence": 1.0,
            "direction": "ltr"
        }

    counts = {lang: 0 for lang in UNICODE_RANGES}
    latin_count = 0
    total_letters = 0

    for ch in text:
        cp = ord(ch)
        if (0x0041 <= cp <= 0x005A) or (0x0061 <= cp <= 0x007A):
            latin_count += 1
            total_letters += 1
            continue

        matched = False
        for lang, (start, end) in UNICODE_RANGES.items():
            if start <= cp <= end:
                counts[lang] += 1
                total_letters += 1
                matched = True
                break

    if total_letters == 0:
        return {"code": "en", "name": "English", "confidence": 0.5, "direction": "ltr"}

    highest_lang = "en"
    highest_count = latin_count

    for lang, count in counts.items():
        if count > highest_count:
            highest_count = count
            highest_lang = lang

    confidence = round(highest_count / total_letters, 3)
    direction = "rtl" if highest_lang == "ur" else "ltr"

    return {
        "code": highest_lang,
        "name": LANGUAGE_NAMES.get(highest_lang, "Unknown"),
        "confidence": max(confidence, 0.6),
        "direction": direction
    }
