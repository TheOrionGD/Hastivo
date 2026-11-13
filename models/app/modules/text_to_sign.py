"""
Hastivo — Text-to-Sign (ISL) Intelligence Engine
Linguistic processing:
1. Normalization & Preprocessing
2. ISL Grammar Parsing:
   - SVO -> SOV (Subject - Object - Verb)
   - TSOV (Time - Subject - Object - Verb)
   - Negation-Final Rule (NO/NOT at sequence termination)
   - Interrogative-Final Rule (WHERE, WHAT, WHY, HOW at end)
3. ISL Lexicon Mapping with Kinematic Articulation metadata
4. Fingerspelling Fallback for OOV (Out of Vocabulary) terms
"""
import re
from typing import List, Dict, Any
from .language_detector import detect_language

# Standard ISL Supported Lexicon with Hand Shapes & Kinematics
ISL_LEXICON = {
    # Greetings & Courtesies
    "HELLO": {"type": "gesture", "hand": "R", "pose": "SIGN_HELLO", "duration": 850, "emotion": "friendly"},
    "NAMASTE": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_NAMASTE", "duration": 1000, "emotion": "respectful"},
    "THANK_YOU": {"type": "gesture", "hand": "R", "pose": "SIGN_THANK_YOU", "duration": 850, "emotion": "grateful"},
    "THANK": {"type": "gesture", "hand": "R", "pose": "SIGN_THANK_YOU", "duration": 850, "emotion": "grateful"},
    "PLEASE": {"type": "gesture", "hand": "R", "pose": "SIGN_PLEASE", "duration": 800, "emotion": "polite"},
    "WELCOME": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_WELCOME", "duration": 900, "emotion": "warm"},
    "YES": {"type": "nod", "hand": "R", "pose": "SIGN_YES", "duration": 700, "emotion": "affirmative"},
    "NO": {"type": "shake", "hand": "R", "pose": "SIGN_NO", "duration": 700, "emotion": "negative"},
    "SORRY": {"type": "gesture", "hand": "R", "pose": "SIGN_SORRY", "duration": 850, "emotion": "apologetic"},
    "GOOD": {"type": "gesture", "hand": "R", "pose": "SIGN_GOOD", "duration": 750, "emotion": "positive"},
    "MORNING": {"type": "gesture", "hand": "R", "pose": "SIGN_MORNING", "duration": 850, "emotion": "neutral"},
    
    # Pronouns & People
    "ME": {"type": "point", "hand": "R", "pose": "SIGN_ME", "duration": 600, "emotion": "neutral"},
    "YOU": {"type": "point", "hand": "R", "pose": "SIGN_YOU", "duration": 600, "emotion": "neutral"},
    "WE": {"type": "point", "hand": "R", "pose": "SIGN_WE", "duration": 800, "emotion": "neutral"},
    "FRIEND": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_FRIEND", "duration": 900, "emotion": "friendly"},
    "FAMILY": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_FAMILY", "duration": 950, "emotion": "warm"},
    "NAME": {"type": "gesture", "hand": "R", "pose": "SIGN_NAME", "duration": 800, "emotion": "neutral"},
    
    # Needs & Actions
    "WANT": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_WANT", "duration": 800, "emotion": "neutral"},
    "HELP": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_HELP", "duration": 950, "emotion": "urgent"},
    "WATER": {"type": "gesture", "hand": "R", "pose": "SIGN_WATER", "duration": 800, "emotion": "neutral"},
    "FOOD": {"type": "gesture", "hand": "R", "pose": "SIGN_FOOD", "duration": 800, "emotion": "neutral"},
    "LEARN": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_LEARN", "duration": 900, "emotion": "focused"},
    "SIGN": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_SIGN", "duration": 900, "emotion": "focused"},
    "LANGUAGE": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_LANGUAGE", "duration": 950, "emotion": "neutral"},
    "UNDERSTAND": {"type": "gesture", "hand": "R", "pose": "SIGN_UNDERSTAND", "duration": 850, "emotion": "thoughtful"},
    "GO": {"type": "gesture", "hand": "R", "pose": "SIGN_GO", "duration": 700, "emotion": "neutral"},
    "COME": {"type": "gesture", "hand": "R", "pose": "SIGN_COME", "duration": 700, "emotion": "neutral"},
    
    # Interrogatives (Questions)
    "WHERE": {"type": "question", "hand": "BOTH", "pose": "SIGN_WHERE", "duration": 850, "emotion": "inquiring"},
    "WHAT": {"type": "question", "hand": "BOTH", "pose": "SIGN_WHAT", "duration": 850, "emotion": "inquiring"},
    "WHEN": {"type": "question", "hand": "R", "pose": "SIGN_WHEN", "duration": 850, "emotion": "inquiring"},
    "HOW": {"type": "question", "hand": "BOTH", "pose": "SIGN_HOW", "duration": 850, "emotion": "inquiring"},
    
    # Time & Transit
    "TODAY": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_TODAY", "duration": 800, "emotion": "neutral"},
    "TOMORROW": {"type": "gesture", "hand": "R", "pose": "SIGN_TOMORROW", "duration": 800, "emotion": "neutral"},
    "YESTERDAY": {"type": "gesture", "hand": "R", "pose": "SIGN_YESTERDAY", "duration": 800, "emotion": "neutral"},
    "TRAIN": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_TRAIN", "duration": 900, "emotion": "neutral"},
    "BUS": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_BUS", "duration": 900, "emotion": "neutral"},
    "STATION": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_STATION", "duration": 900, "emotion": "neutral"},
    "PLATFORM": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_PLATFORM", "duration": 900, "emotion": "neutral"},
    "DOCTOR": {"type": "gesture", "hand": "R", "pose": "SIGN_DOCTOR", "duration": 850, "emotion": "serious"},
    "HOSPITAL": {"type": "gesture", "hand": "R", "pose": "SIGN_HOSPITAL", "duration": 850, "emotion": "serious"},
    "EMERGENCY": {"type": "gesture", "hand": "BOTH", "pose": "SIGN_EMERGENCY", "duration": 1000, "emotion": "urgent"},
    
    # Numbers
    "ONE": {"type": "number", "hand": "R", "pose": "SIGN_1", "duration": 600, "emotion": "neutral"},
    "TWO": {"type": "number", "hand": "R", "pose": "SIGN_2", "duration": 600, "emotion": "neutral"},
    "THREE": {"type": "number", "hand": "R", "pose": "SIGN_3", "duration": 600, "emotion": "neutral"},
    "FOUR": {"type": "number", "hand": "R", "pose": "SIGN_4", "duration": 600, "emotion": "neutral"},
    "FIVE": {"type": "number", "hand": "R", "pose": "SIGN_5", "duration": 600, "emotion": "neutral"},
}

TIME_WORDS = {"TODAY", "TOMORROW", "YESTERDAY", "NOW", "MORNING", "NIGHT", "SOON"}
QUESTION_WORDS = {"WHERE", "WHAT", "WHEN", "WHY", "HOW", "WHO"}
NEGATION_WORDS = {"NOT", "NO", "NEVER", "DON'T", "CANNOT", "DONT"}

WORD_REPLACEMENTS = {
    "I": "ME",
    "MY": "ME",
    "MINE": "ME",
    "WE": "WE",
    "OUR": "WE",
    "HI": "HELLO",
    "HEY": "HELLO",
    "THANKS": "THANK_YOU",
    "PLEASE": "PLEASE",
    "ASSISTANCE": "HELP",
    "WATER": "WATER",
    "FOOD": "FOOD",
    "EAT": "FOOD",
    "DRINK": "WATER",
    "GO": "GO",
    "COME": "COME",
    "1": "ONE",
    "2": "TWO",
    "3": "THREE",
    "4": "FOUR",
    "5": "FIVE",
}

# Regional ISL Dialect Mappings (Northern ISL vs Southern ISL Lexical Variations)
DIALECT_MAPPINGS = {
    "northern": {
        "THANK_YOU": {"pose": "SIGN_THANK_YOU_NORTH", "duration": 800, "hand": "BOTH"},
        "THANK": {"pose": "SIGN_THANK_YOU_NORTH", "duration": 800, "hand": "BOTH"},
        "NAMASTE": {"pose": "SIGN_NAMASTE", "duration": 1050, "hand": "BOTH"},
        "WATER": {"pose": "SIGN_WATER", "duration": 800, "hand": "R"},
        "HELLO": {"pose": "SIGN_HELLO", "duration": 850, "hand": "R"},
    },
    "southern": {
        "THANK_YOU": {"pose": "SIGN_THANK_YOU_SOUTH", "duration": 900, "hand": "R"},
        "THANK": {"pose": "SIGN_THANK_YOU_SOUTH", "duration": 900, "hand": "R"},
        "NAMASTE": {"pose": "SIGN_VANAKKAM", "duration": 1000, "hand": "BOTH"},
        "WATER": {"pose": "SIGN_WATER_SOUTH", "duration": 850, "hand": "R"},
        "HELLO": {"pose": "SIGN_HELLO_SOUTH", "duration": 800, "hand": "BOTH"},
    },
}

def normalize_text(text: str) -> str:
    cleaned = re.sub(r"[^\w\s\']", " ", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().upper()
    return cleaned

def transform_to_isl_grammar(tokens: List[str]) -> List[str]:
    """
    Applies ISL Grammar Transformation Rules:
    1. Time words to front (TSOV).
    2. Question words to end.
    3. Negation words to end.
    4. Subject - Object - Verb ordering.
    """
    mapped_tokens = [WORD_REPLACEMENTS.get(t, t) for t in tokens]
    
    time_tokens = []
    question_tokens = []
    negation_tokens = []
    core_tokens = []

    for t in mapped_tokens:
        if t in TIME_WORDS:
            time_tokens.append(t)
        elif t in QUESTION_WORDS:
            question_tokens.append(t)
        elif t in NEGATION_WORDS:
            negation_tokens.append("NO")
        else:
            core_tokens.append(t)

    # Simplified ISL SOV Reordering:
    # If standard English SVO is detected e.g. ["ME", "WANT", "WATER"] -> ["ME", "WATER", "WANT"]
    if len(core_tokens) >= 3 and core_tokens[1] in ["WANT", "LEARN", "NEED", "LIKE", "GO"]:
        # Swap verb and object
        subj = core_tokens[0]
        verb = core_tokens[1]
        objs = core_tokens[2:]
        core_tokens = [subj] + objs + [verb]

    # Assemble: Time + Core (Subject + Object + Verb) + Negation + Question
    isl_tokens = time_tokens + core_tokens + negation_tokens + question_tokens
    return isl_tokens

def translate_text_to_sign(text: str, dialect: str = "standard") -> Dict[str, Any]:
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty.")

    lang_info = detect_language(text)
    normalized = normalize_text(text)
    raw_tokens = normalized.split()
    
    isl_tokens = transform_to_isl_grammar(raw_tokens)
    
    animation_sequence = []
    total_duration_ms = 0

    dialect_clean = (dialect or "standard").lower().strip()
    active_dialect_overrides = DIALECT_MAPPINGS.get(dialect_clean, {})

    for idx, token in enumerate(isl_tokens):
        if token in ISL_LEXICON:
            meta = dict(ISL_LEXICON[token])
            if token in active_dialect_overrides:
                meta.update(active_dialect_overrides[token])

            duration = meta["duration"]
            animation_sequence.append({
                "sequenceIndex": idx,
                "gloss": token,
                "type": meta["type"],
                "hand": meta["hand"],
                "kinematicPose": meta["pose"],
                "durationMs": duration,
                "transitionMs": 150,
                "facialExpression": meta["emotion"],
                "isFingerspelled": False,
                "dialect": dialect_clean,
            })
            total_duration_ms += duration + 150
        else:
            # Fallback to fingerspelling letters
            for char_idx, char in enumerate(token):
                if char.isalnum():
                    duration = 450
                    animation_sequence.append({
                        "sequenceIndex": idx,
                        "gloss": f"CHAR_{char}",
                        "letter": char,
                        "type": "fingerspell",
                        "hand": "R",
                        "kinematicPose": f"SIGN_LETTER_{char}",
                        "durationMs": duration,
                        "transitionMs": 80,
                        "facialExpression": "neutral",
                        "isFingerspelled": True,
                    })
                    total_duration_ms += duration + 80

    return {
        "success": True,
        "sourceText": text,
        "detectedLanguage": lang_info,
        "dialect": dialect_clean,
        "grammarFormat": "ISL_TSOV",
        "islGlossSequence": isl_tokens,
        "tokenCount": len(isl_tokens),
        "animationSequence": animation_sequence,
        "estimatedDurationMs": total_duration_ms,
        "lexiconCoverage": round(sum(1 for t in isl_tokens if t in ISL_LEXICON) / max(len(isl_tokens), 1), 2),
    }
