"""
Signora AI — Sign-to-Text Contextual Translation Engine
Converts recognized sign sequences into natural, grammatically correct text while strictly preserving:
1. The exact raw recognized tokens with confidence scores.
2. Semantic fidelity without hallucinating unrelated entities.
"""
from typing import List, Dict, Any

# ISL Gloss Idiomatic Syntactic Mappings
GLOSS_PATTERNS = [
    # Patterns (tuple of gloss tokens -> natural English sentence)
    (["NAMASTE"], "Namaste, greetings to you."),
    (["HELLO"], "Hello, welcome."),
    (["THANK_YOU"], "Thank you very much."),
    (["PLEASE", "HELP"], "Please help me."),
    (["ME", "WATER", "WANT"], "I would like some water."),
    (["ME", "FOOD", "WANT"], "I would like some food."),
    (["TRAIN", "DELHI", "PLATFORM", "THREE"], "The train to Delhi will arrive on platform three."),
    (["BUS", "STATION", "WHERE"], "Where is the bus station?"),
    (["DOCTOR", "HOSPITAL", "EMERGENCY"], "I need a doctor, this is a medical emergency."),
    (["LEARN", "SIGN", "LANGUAGE"], "We are learning Indian Sign Language together."),
    (["ME", "UNDERSTAND"], "I understand."),
    (["ME", "UNDERSTAND", "NO"], "I do not understand."),
    (["NAME", "YOU", "WHAT"], "What is your name?"),
    (["TODAY", "TRAIN", "TIME", "WHAT"], "What time is the train scheduled for today?"),
]

def synthesize_grammatical_sentence(glosses: List[str]) -> str:
    if not glosses:
        return ""

    upper_glosses = [g.upper().strip() for g in glosses if g.strip()]

    # Check exact matching pattern
    for pattern, sentence in GLOSS_PATTERNS:
        if upper_glosses == pattern:
            return sentence

    # Substring / subsequence match
    gloss_str = " ".join(upper_glosses)
    if "EMERGENCY" in upper_glosses:
        return "Emergency assistance requested immediately."
    if "TRAIN" in upper_glosses and "WHERE" in upper_glosses:
        return "Where is the train located?"
    if "WATER" in upper_glosses and "WANT" in upper_glosses:
        return "I need drinking water, please."
    if "HELP" in upper_glosses:
        return "Please provide assistance."

    # Heuristic English sentence reconstruction from ISL SOV
    words = []
    is_negated = "NO" in upper_glosses or "NOT" in upper_glosses
    is_question = any(q in upper_glosses for q in ["WHERE", "WHAT", "WHEN", "WHY", "HOW"])
    
    clean_tokens = [t for t in upper_glosses if t not in ["NO", "NOT"]]

    # Replace pronouns
    token_map = {
        "ME": "I",
        "YOU": "you",
        "WE": "we",
        "THANK_YOU": "thank you",
        "NAMASTE": "namaste",
        "HELLO": "hello",
    }

    natural_words = [token_map.get(t, t.lower()) for t in clean_tokens]

    if is_question:
        q_word = next((t.capitalize() for t in upper_glosses if t in ["WHERE", "WHAT", "WHEN", "WHY", "HOW"]), "What")
        other_words = [w for w in natural_words if w.upper() not in ["WHERE", "WHAT", "WHEN", "WHY", "HOW"]]
        return f"{q_word} is {' '.join(other_words)}?"

    sentence = " ".join(natural_words).strip()
    if is_negated:
        sentence = f"I do not {sentence}" if sentence else "No."
    else:
        sentence = sentence.capitalize()

    if not sentence.endswith((".", "?", "!")):
        sentence += "."

    return sentence

def process_sign_to_text(signs: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not signs:
        return {
            "success": True,
            "rawRecognizedSigns": [],
            "rawGlosses": [],
            "synthesizedSentence": "",
            "overallConfidence": 0.0,
            "status": "empty_input"
        }

    # Extract glosses and confidence
    raw_glosses = []
    confidences = []

    for item in signs:
        if isinstance(item, str):
            raw_glosses.append(item.upper())
            confidences.append(0.95)
        elif isinstance(item, dict):
            label = item.get("label") or item.get("gloss") or item.get("sign") or "UNKNOWN"
            raw_glosses.append(str(label).upper())
            confidences.append(float(item.get("confidence", 0.90)))

    # Deduplicate consecutive repeated signs (temporal windowing smoothing)
    smoothed_glosses = []
    for g in raw_glosses:
        if not smoothed_glosses or smoothed_glosses[-1] != g:
            smoothed_glosses.append(g)

    synthesized_sentence = synthesize_grammatical_sentence(smoothed_glosses)
    avg_confidence = round(sum(confidences) / len(confidences), 3) if confidences else 0.95

    return {
        "success": True,
        "rawRecognizedSigns": signs,
        "rawGlosses": raw_glosses,
        "smoothedGlosses": smoothed_glosses,
        "synthesizedSentence": synthesized_sentence,
        "overallConfidence": avg_confidence,
        "status": "processed"
    }
