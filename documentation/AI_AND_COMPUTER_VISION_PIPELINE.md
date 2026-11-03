# Hastivo — Artificial Intelligence & Computer Vision Processing Pipelines

## 1. Text-to-Sign Intelligence Engine (`ai-service/`)

Indian Sign Language (ISL) is not a word-for-word translation of spoken English or regional Indian languages. It possesses unique syntax, spatial grammar, and morphological rules.

### Pipeline Stages:
1. **Input Validation**: Rejects empty strings, checks payload length and integrity.
2. **Language Identification**: Detects Latin or Indic script Unicode ranges across 7 languages (English, Hindi, Tamil, Telugu, Kannada, Malayalam, Urdu).
3. **Normalization & Contraction Expansion**: Converts characters, trims spaces, expands English contractions (e.g., `don't` &rarr; `DO NOT`).
4. **Grammar Transformation**:
   - **TSOV Reordering**: Moves time markers (`TODAY`, `TOMORROW`, `YESTERDAY`) to the front.
   - **SOV Structure**: Converts Subject-Verb-Object into Subject-Object-Verb (`I want water` &rarr; `ME WATER WANT`).
   - **Interrogative-Final Rule**: Moves question markers (`WHERE`, `WHAT`, `WHEN`, `WHY`, `HOW`) to the end of the sentence.
   - **Negation-Final Rule**: Moves negation words (`NO`, `NOT`) to the end.
5. **Lexicon Mapping**: Matches tokens to 60+ pre-calibrated ISL signs with hand-orientation tags, durations, and facial expressions.
6. **Fingerspelling Fallback**: For proper nouns and out-of-vocabulary words, decomposes tokens into sequential single-letter sign postures (`A`-`Z`).
7. **Kinematic Sequence Assembly**: Returns an ordered array of animation poses, joint durations, and transition timings to the 3D Avatar Engine.

---

## 2. Computer Vision & Landmark Tracking (`computer-vision/`)

### Architecture:
- Uses **MediaPipe Hands** running on Python 3.14 + OpenCV.
- Tracks **21 normalized 3D keypoints** per hand at 30+ FPS.

### Landmark Indices:
- `0`: Wrist
- `1-4`: Thumb (CMC, MCP, IP, Tip)
- `5-8`: Index Finger (MCP, PIP, DIP, Tip)
- `9-12`: Middle Finger (MCP, PIP, DIP, Tip)
- `13-16`: Ring Finger (MCP, PIP, DIP, Tip)
- `17-20`: Pinky Finger (MCP, PIP, DIP, Tip)

### Feature Geometry & Gesture Recognition:
- **Finger Extension Extraction**: Compares tip-to-knuckle Euclidean distances and Y-axis offsets.
- **Palm Orientation**: Computes normal vector from triangle formed by landmarks 0 (wrist), 5 (index MCP), and 17 (pinky MCP).
- **ISL Gesture Sign Classifications**:
  - `HELLO`: All 5 fingers extended upright with palm forward.
  - `NAMASTE`: Single/dual hand prayer posture.
  - `WATER`: 3 fingers extended forming 'W' sign (thumb pinches pinky).
  - `YES`: Thumbs-up posture (thumb tip above wrist, other 4 fingers curled).
  - `NO`: Index and middle tapping thumb.
  - `HELP`: Emergency 3-finger alert posture.
  - Numbers: `ONE` (Index), `TWO` (Index+Middle), `THREE`, `FOUR`, `FIVE`.

---

## 3. Sign-to-Text Contextual Synthesis

1. **Temporal Smoothing**: Windowing buffer eliminates consecutive duplicate frame predictions.
2. **Contextual Synthesizer**: Re-assembles ISL glosses into grammatically sound natural sentences without hallucinating unrelated entities.
3. **Data Integrity Guarantee**: Both raw recognized tokens and processed sentences are preserved and returned separately.
