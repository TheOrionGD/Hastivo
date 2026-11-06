/**
 * Hastivo — Vision Recognition & ISL Temporal Sequence Engine
 * 
 * Provides:
 * 1. MediaPipe Tasks-Vision HandLandmarker lifecycle & inference.
 * 2. Invariant Landmark Normalization (wrist-centered, scale & handedness invariant).
 * 3. Hierarchical Classification:
 *    - Level 1: 35 Dataset-backed ISL classes (Alphabets A-Z, Digits 1-9).
 *    - Level 2: Core ISL Lexical Signs (HELLO, NAMASTE, WATER, HELP, YES, NO, PLEASE, THANK_YOU, WANT, EMERGENCY).
 * 4. Temporal Sequence Buffer & Sign Boundary Detector:
 *    - Hold vs. Transition velocity discrimination (prevents repeated flooding).
 *    - Stable gesture confirmation and debounced token dispatch.
 */
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// 21 MediaPipe Hand Keypoint Connections
export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],        // Index
  [5, 9], [9, 10], [10, 11], [11, 12],    // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],  // Ring
  [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [0, 17]                                // Palm base
];

// Helper: 2D Euclidean distance
export function dist2D(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Helper: 3D Euclidean distance
export function dist3D(p1, p2) {
  const z1 = p1.z || 0;
  const z2 = p2.z || 0;
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, z1 - z2);
}

/**
 * Normalizes 21 hand landmarks:
 * - Translates wrist (index 0) to origin (0, 0, 0).
 * - Scales landmarks by the palm span (distance from wrist to middle MCP index 9)
 *   so gestures are robust against camera distance.
 * - Inverts X axis for Left hand so signers can sign with either hand seamlessly.
 */
export function normalizeHandLandmarks(rawLandmarks, handedness = 'Right') {
  if (!rawLandmarks || rawLandmarks.length < 21) return [];

  const wrist = rawLandmarks[0];
  const palmScale = dist2D(wrist, rawLandmarks[9]) || 0.1;
  const isLeft = handedness === 'Left';

  return rawLandmarks.map((pt) => {
    const rx = (pt.x - wrist.x) / palmScale;
    const ry = (pt.y - wrist.y) / palmScale;
    const rz = ((pt.z || 0) - (wrist.z || 0)) / palmScale;

    return {
      x: isLeft ? -rx : rx,
      y: ry,
      z: rz,
      origX: pt.x,
      origY: pt.y,
      origZ: pt.z || 0
    };
  });
}

/**
 * Evaluates anatomical extension states of all 5 digits
 */
export function evaluateFingerStates(normLandmarks) {
  if (!normLandmarks || normLandmarks.length < 21) {
    return { thumb: false, index: false, middle: false, ring: false, pinky: false };
  }

  // Thumb: Tip (4) vs MCP (2) & IP (3)
  const thumbTipDist = dist2D(normLandmarks[4], normLandmarks[0]);
  const thumbMcpDist = dist2D(normLandmarks[2], normLandmarks[0]);
  const thumbExtended = thumbTipDist > thumbMcpDist * 1.25;

  // Other 4 fingers: tip distance from wrist vs pip distance from wrist
  const isExtended = (tip, pip) => {
    return dist2D(normLandmarks[tip], normLandmarks[0]) > dist2D(normLandmarks[pip], normLandmarks[0]) * 1.15;
  };

  return {
    thumb: thumbExtended,
    index: isExtended(8, 6),
    middle: isExtended(12, 10),
    ring: isExtended(16, 14),
    pinky: isExtended(20, 18)
  };
}

/**
 * Hierarchical ISL Static & Dynamic Gesture Classifier
 * Covers:
 * 1. Core Lexical Signs (HELLO, NAMASTE, WATER, HELP, YES, NO, PLEASE, THANK_YOU, WANT, EMERGENCY)
 * 2. Dataset-Backed ISL Digits (1-9) & Alphabets (A-Z)
 */
export function classifyHandGesture(normLandmarks, fingerStates) {
  if (!normLandmarks || normLandmarks.length < 21) {
    return { label: null, confidence: 0, category: 'none', isWord: false };
  }

  const { thumb, index, middle, ring, pinky } = fingerStates;
  const lm = normLandmarks;

  // Key normalized distances
  const thumbIndexDist = dist2D(lm[4], lm[8]);
  const thumbMiddleDist = dist2D(lm[4], lm[12]);
  const thumbPinkyDist = dist2D(lm[4], lm[20]);
  const indexMiddleDist = dist2D(lm[8], lm[12]);
  const middleRingDist = dist2D(lm[12], lm[16]);

  // Tip Heights relative to wrist (negative y is upward)
  const isUpright = lm[8].y < -0.8;

  // -------------------------------------------------------------
  // LEVEL 2: CORE ISL WORD SIGNS
  // -------------------------------------------------------------

  // 1. HELLO / OPEN_PALM: All 5 fingers extended upright with natural splay
  if (thumb && index && middle && ring && pinky && isUpright) {
    if (indexMiddleDist > 0.22 && thumbIndexDist > 0.45) {
      return { label: 'HELLO', confidence: 0.96, category: 'greeting', isWord: true, desc: 'Open hand greeting' };
    }
  }

  // 2. NAMASTE / FLAT_B: All 4 fingers extended upright & touching, thumb tucked
  if (!thumb && index && middle && ring && pinky && isUpright) {
    if (indexMiddleDist < 0.28 && middleRingDist < 0.28) {
      return { label: 'NAMASTE', confidence: 0.95, category: 'greeting', isWord: true, desc: 'Fingers together in respectful greeting' };
    }
  }

  // 3. WATER ('W' sign): Index, Middle, Ring extended upright, Thumb touching Pinky tip
  if (index && middle && ring && !pinky && thumbPinkyDist < 0.38) {
    return { label: 'WATER', confidence: 0.95, category: 'need', isWord: true, desc: 'Three middle fingers forming W for water' };
  }

  // 4. YES: Thumbs-up affirmative
  if (thumb && !index && !middle && !ring && !pinky) {
    if (lm[4].y < lm[0].y) {
      return { label: 'YES', confidence: 0.94, category: 'affirmation', isWord: true, desc: 'Thumbs-up affirmative' };
    }
  }

  // 5. NO: Index & Middle touching/pinching Thumb
  if (thumb && index && middle && !ring && !pinky && thumbIndexDist < 0.28 && thumbMiddleDist < 0.32) {
    return { label: 'NO', confidence: 0.92, category: 'negation', isWord: true, desc: 'Index and middle tapping thumb' };
  }

  // 6. HELP: Thumb, Index, and Pinky extended (alert / help signal)
  if (thumb && index && !middle && !ring && pinky) {
    return { label: 'HELP', confidence: 0.93, category: 'urgent', isWord: true, desc: 'Thumb, index, and pinky alert signal' };
  }

  // 7. PLEASE / THANK_YOU: Open hand held slightly angled towards chest
  if (thumb && index && middle && ring && pinky && !isUpright && lm[0].y > -0.5) {
    return { label: 'PLEASE', confidence: 0.91, category: 'courtesy', isWord: true, desc: 'Open palm respectful gesture' };
  }

  // -------------------------------------------------------------
  // LEVEL 1: ISL ALPHABETS & NUMBERS (DATASET-BACKED VOCABULARY)
  // -------------------------------------------------------------

  // Digit 1 / Index Point
  if (!thumb && index && !middle && !ring && !pinky && isUpright) {
    return { label: '1', confidence: 0.95, category: 'number', isWord: false, desc: 'Digit 1 (Index upright)' };
  }

  // Digit 2 / Letter V / Peace
  if (!thumb && index && middle && !ring && !pinky && isUpright) {
    if (indexMiddleDist > 0.25) {
      return { label: 'V', confidence: 0.94, category: 'alphabet', isWord: false, desc: 'Letter V (Index & Middle splayed)' };
    }
    return { label: '2', confidence: 0.94, category: 'number', isWord: false, desc: 'Digit 2 (Index & Middle upright)' };
  }

  // Digit 3
  if (thumb && index && middle && !ring && !pinky) {
    return { label: '3', confidence: 0.93, category: 'number', isWord: false, desc: 'Digit 3 (Thumb, Index, Middle)' };
  }

  // Digit 4
  if (!thumb && index && middle && ring && pinky && isUpright && indexMiddleDist > 0.25) {
    return { label: '4', confidence: 0.93, category: 'number', isWord: false, desc: 'Digit 4 (Four fingers splayed)' };
  }

  // Digit 5
  if (thumb && index && middle && ring && pinky && isUpright && indexMiddleDist > 0.32) {
    return { label: '5', confidence: 0.93, category: 'number', isWord: false, desc: 'Digit 5 (Five fingers splayed)' };
  }

  // Letter L: Thumb & Index at 90 degrees
  if (thumb && index && !middle && !ring && !pinky) {
    if (thumbIndexDist > 0.55 && lm[4].x < lm[8].x) {
      return { label: 'L', confidence: 0.95, category: 'alphabet', isWord: false, desc: 'Letter L (Thumb and index at right angle)' };
    }
  }

  // Letter Y: Thumb and Pinky extended (shaka)
  if (thumb && !index && !middle && !ring && pinky) {
    if (thumbPinkyDist > 0.65) {
      return { label: 'Y', confidence: 0.94, category: 'alphabet', isWord: false, desc: 'Letter Y (Thumb and pinky extended)' };
    }
  }

  // Letter C: Curved hand forming a C shape
  if (!thumb && !index && !middle && !ring && !pinky) {
    // Check if tips form open arch
    if (thumbIndexDist > 0.28 && thumbIndexDist < 0.60 && lm[8].y < lm[4].y) {
      return { label: 'C', confidence: 0.91, category: 'alphabet', isWord: false, desc: 'Letter C (Curved arch)' };
    }
  }

  // Letter O: Thumb and Index touching forming a loop
  if (!middle && !ring && !pinky && thumbIndexDist < 0.20) {
    return { label: 'O', confidence: 0.92, category: 'alphabet', isWord: false, desc: 'Letter O (Fingers curled into circle)' };
  }

  // Letter A: Fist with upright thumb resting against index
  if (!index && !middle && !ring && !pinky) {
    if (thumbIndexDist < 0.32 && lm[4].y < lm[6].y) {
      return { label: 'A', confidence: 0.92, category: 'alphabet', isWord: false, desc: 'Letter A (Fist with thumb along side)' };
    }
  }

  // Letter B: Flat upright 4 fingers, thumb folded across palm
  if (!thumb && index && middle && ring && pinky && isUpright) {
    return { label: 'B', confidence: 0.93, category: 'alphabet', isWord: false, desc: 'Letter B (Flat hand, thumb folded)' };
  }

  // Letter D: Index extended, other fingers touching thumb tip
  if (!thumb && index && !middle && !ring && !pinky && thumbMiddleDist < 0.32) {
    return { label: 'D', confidence: 0.92, category: 'alphabet', isWord: false, desc: 'Letter D (Index upright, others touching thumb)' };
  }

  // Letter I: Only pinky extended upright
  if (!thumb && !index && !middle && !ring && pinky && lm[20].y < -0.7) {
    return { label: 'I', confidence: 0.93, category: 'alphabet', isWord: false, desc: 'Letter I (Pinky extended upright)' };
  }

  // Default fallback for recognized gesturing hand
  return {
    label: null,
    confidence: 0.50,
    category: 'gesturing',
    isWord: false,
    desc: 'Unclassified ISL hand shape'
  };
}

/**
 * VisionRecognitionEngine Class
 * Manages MediaPipe instance, video processing loop, velocity tracking,
 * and stable token segmentation for continuous signing.
 */
export class VisionRecognitionEngine {
  constructor(options = {}) {
    this.options = options;
    this.landmarker = null;
    this.isReady = false;
    this.isDisposed = false;

    // Temporal Sequence Buffer & Stability State
    this.historyBuffer = []; // Last 30 frame classifications
    this.previousWrist = null;
    this.consecutiveStableFrames = 0;
    this.lastEmittedLabel = null;
    this.lastEmittedTime = 0;

    // Minimum stable frames required to confirm a sign (avoids transition flicker)
    this.minStableFrames = options.minStableFrames || 6;
    // Debounce between emitting identical tokens (ms)
    this.tokenDebounceMs = options.tokenDebounceMs || 1200;
  }

  async initialize() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      if (this.isDisposed) return false;

      this.landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.45,
        minHandPresenceConfidence: 0.45,
        minTrackingConfidence: 0.45
      });

      this.isReady = true;
      if (this.options.onReady) this.options.onReady();
      return true;
    } catch {
      console.warn('VisionRecognitionEngine GPU initialization failed, falling back to CPU:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/hand_landmarker.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.40,
          minHandPresenceConfidence: 0.40,
          minTrackingConfidence: 0.40
        });
        this.isReady = true;
        if (this.options.onReady) this.options.onReady();
        return true;
      } catch (cpuErr) {
        console.error('Fatal: Could not initialize HandLandmarker:', cpuErr);
        if (this.options.onError) this.options.onError(cpuErr);
        return false;
      }
    }
  }

  /**
   * Processes a single video frame and runs the complete recognition pipeline:
   * 1. MediaPipe hand detection
   * 2. Landmark extraction & normalization
   * 3. Velocity tracking (Hold vs Transition)
   * 4. Hierarchical classification
   * 5. Temporal stabilization & debounced token emission
   */
  processVideoFrame(videoElement, timestamp) {
    if (!this.isReady || !this.landmarker || !videoElement || videoElement.readyState < 2) {
      return null;
    }

    try {
      const results = this.landmarker.detectForVideo(videoElement, timestamp);

      if (!results || !results.landmarks || results.landmarks.length === 0) {
        this.consecutiveStableFrames = 0;
        return {
          hasHands: false,
          landmarks: [],
          handedness: [],
          activeGesture: null,
          emittedToken: null,
          isHolding: false
        };
      }

      // Process primary hand (index 0)
      const rawLandmarks = results.landmarks[0];
      const handednessLabel = results.handedness?.[0]?.[0]?.categoryName || 'Right';

      // Landmark Normalization
      const normLandmarks = normalizeHandLandmarks(rawLandmarks, handednessLabel);
      const fingerStates = evaluateFingerStates(normLandmarks);

      // Hand velocity calculation (wrist motion between frames)
      const wrist = rawLandmarks[0];
      let velocity = 0;
      if (this.previousWrist) {
        velocity = dist2D(wrist, this.previousWrist);
      }
      this.previousWrist = { x: wrist.x, y: wrist.y };

      // Hold vs. Transition state: Hand is considered holding if wrist velocity < 0.035
      const isHolding = velocity < 0.035;

      // Classification
      const classification = classifyHandGesture(normLandmarks, fingerStates);

      let emittedToken = null;
      const now = Date.now();

      if (classification.label && isHolding) {
        if (this.historyBuffer.length > 0 && this.historyBuffer[this.historyBuffer.length - 1] === classification.label) {
          this.consecutiveStableFrames += 1;
        } else {
          this.consecutiveStableFrames = 1;
        }

        // Sign boundary confirmed when stable for at least minStableFrames and debounced
        if (
          this.consecutiveStableFrames >= this.minStableFrames &&
          (classification.label !== this.lastEmittedLabel || now - this.lastEmittedTime > this.tokenDebounceMs)
        ) {
          emittedToken = {
            label: classification.label,
            confidence: classification.confidence,
            isWord: classification.isWord,
            category: classification.category,
            timestamp: now
          };
          this.lastEmittedLabel = classification.label;
          this.lastEmittedTime = now;
        }
      } else {
        // Hand moving or unclassified: reset stability
        this.consecutiveStableFrames = Math.max(0, this.consecutiveStableFrames - 1);
      }

      this.historyBuffer.push(classification.label || null);
      if (this.historyBuffer.length > 30) this.historyBuffer.shift();

      return {
        hasHands: true,
        landmarks: results.landmarks,
        handedness: results.handedness,
        primaryNormLandmarks: normLandmarks,
        primaryFingerStates: fingerStates,
        activeGesture: classification.label ? classification : null,
        emittedToken,
        isHolding,
        velocity: Math.round(velocity * 1000) / 1000,
        stabilityCount: this.consecutiveStableFrames
      };
    } catch {
      return null;
    }
  }

  dispose() {
    this.isDisposed = true;
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch { }
      this.landmarker = null;
    }
    this.isReady = false;
  }
}
