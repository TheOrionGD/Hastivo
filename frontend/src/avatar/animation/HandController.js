/**
 * Hastivo Hand Animation Controller
 * Handles kinematic finger articulation, wrist flexion/rotation, and hand posture interpolation.
 * Supports standard signing postures, A-Z fingerspelling, and numbers 0-9.
 */
import * as THREE from 'three';

// Standard Hand Posture Presets (flexion in radians for [mcp, pip, dip, abduct])
export const HAND_POSTURES = {
  HELLO_OPEN_PALM: {
    thumb: [-0.10, 0.05, 0.0, 0.45],
    index: [0.06, 0.06, 0.04, -0.08],
    middle: [0.05, 0.05, 0.03, 0.0],
    ring: [0.06, 0.06, 0.04, 0.08],
    little: [0.08, 0.08, 0.05, 0.20]
  },
  OPEN_PALM: {
    thumb: [-0.08, 0.04, 0.0, 0.38],
    index: [0.04, 0.04, 0.02, -0.06],
    middle: [0.04, 0.04, 0.02, 0.0],
    ring: [0.04, 0.04, 0.02, 0.06],
    little: [0.05, 0.05, 0.03, 0.16]
  },
  FLAT_CLOSED: { // Fingers extended but adducted together
    thumb: [0.35, 0.1, 0.0, -0.2],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [0.0, 0.0, 0.0, 0.0],
    little: [0.0, 0.0, 0.0, 0.0]
  },
  FIST: {
    thumb: [0.95, 0.85, 0.65, -0.3],
    index: [1.55, 1.65, 1.45, 0.0],
    middle: [1.60, 1.70, 1.50, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  RELAXED_REST: {
    thumb: [0.25, 0.2, 0.15, 0.0],
    index: [0.45, 0.55, 0.35, 0.0],
    middle: [0.55, 0.65, 0.40, 0.0],
    ring: [0.50, 0.60, 0.38, 0.0],
    little: [0.45, 0.55, 0.32, 0.0]
  },
  POINT_INDEX: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  IMAGE_POINT_SIGN: { // Exact reference image 1 uploaded signing posture
    thumb: [0.85, 0.80, 0.60, -0.25],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [1.58, 1.68, 1.48, 0.0],
    ring: [1.58, 1.68, 1.48, 0.0],
    little: [1.55, 1.65, 1.45, 0.0]
  },
  PEACE_V: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [0.0, 0.0, 0.0, -0.15],
    middle: [0.0, 0.0, 0.0, 0.15],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  THUMBS_UP: {
    thumb: [-0.35, -0.15, 0.0, 0.4],
    index: [1.55, 1.65, 1.45, 0.0],
    middle: [1.60, 1.70, 1.50, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  PINCH_OK: {
    thumb: [0.65, 0.55, 0.35, 0.1],
    index: [0.85, 1.15, 0.85, 0.0],
    middle: [0.0, 0.0, 0.0, 0.08],
    ring: [0.0, 0.0, 0.0, 0.15],
    little: [0.0, 0.0, 0.0, 0.22]
  },
  CUPPED: {
    thumb: [0.45, 0.35, 0.25, 0.1],
    index: [0.65, 0.75, 0.55, 0.0],
    middle: [0.70, 0.80, 0.60, 0.0],
    ring: [0.68, 0.78, 0.58, 0.0],
    little: [0.65, 0.75, 0.52, 0.0]
  }
};

// Fingerspelling A-Z Handshape mappings
export const FINGERSPELLING_POSTURES = {
  A: HAND_POSTURES.FIST,
  B: HAND_POSTURES.FLAT_CLOSED,
  C: HAND_POSTURES.CUPPED,
  D: {
    thumb: [0.65, 0.55, 0.35, 0.1],
    index: [0.0, 0.0, 0.0, 0.0], // Pointer up, others touch thumb
    middle: [1.15, 1.25, 1.05, 0.0],
    ring: [1.15, 1.25, 1.05, 0.0],
    little: [1.15, 1.25, 1.05, 0.0]
  },
  E: {
    thumb: [0.75, 0.65, 0.45, -0.3],
    index: [1.35, 1.45, 1.25, 0.0],
    middle: [1.35, 1.45, 1.25, 0.0],
    ring: [1.35, 1.45, 1.25, 0.0],
    little: [1.35, 1.45, 1.25, 0.0]
  },
  F: HAND_POSTURES.PINCH_OK,
  G: {
    thumb: [0.15, 0.1, 0.0, 0.1],
    index: [0.15, 0.1, 0.0, 0.0], // Parallel index & thumb
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  H: {
    thumb: [0.65, 0.5, 0.3, -0.2],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  I: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [1.55, 1.65, 1.45, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [0.0, 0.0, 0.0, 0.1] // Only pinky up
  },
  J: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [1.55, 1.65, 1.45, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [0.0, 0.0, 0.0, 0.1]
  },
  K: {
    thumb: [0.25, 0.15, 0.0, 0.2],
    index: [0.0, 0.0, 0.0, -0.1],
    middle: [0.2, 0.1, 0.0, 0.1],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  L: {
    thumb: [-0.25, -0.1, 0.0, 0.55], // 'L' angle thumb
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  M: {
    thumb: [0.95, 0.85, 0.65, 0.1],
    index: [1.45, 1.55, 1.35, 0.0],
    middle: [1.45, 1.55, 1.35, 0.0],
    ring: [1.45, 1.55, 1.35, 0.0],
    little: [1.45, 1.55, 1.35, 0.0]
  },
  N: {
    thumb: [0.95, 0.85, 0.65, 0.0],
    index: [1.45, 1.55, 1.35, 0.0],
    middle: [1.45, 1.55, 1.35, 0.0],
    ring: [1.45, 1.55, 1.35, 0.0],
    little: [1.45, 1.55, 1.35, 0.0]
  },
  O: {
    thumb: [0.75, 0.65, 0.45, 0.15],
    index: [0.95, 1.15, 0.95, 0.0],
    middle: [0.95, 1.15, 0.95, 0.0],
    ring: [0.95, 1.15, 0.95, 0.0],
    little: [0.95, 1.15, 0.95, 0.0]
  },
  P: {
    thumb: [0.35, 0.25, 0.1, 0.2],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [0.35, 0.25, 0.1, 0.1],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  Q: {
    thumb: [0.25, 0.2, 0.1, 0.1],
    index: [0.25, 0.2, 0.1, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  R: {
    thumb: [0.75, 0.65, 0.45, -0.2],
    index: [0.0, 0.0, 0.0, 0.12], // Crossed index & middle
    middle: [0.0, 0.0, 0.0, -0.12],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  S: HAND_POSTURES.FIST,
  T: {
    thumb: [0.75, 0.65, 0.45, 0.1],
    index: [1.45, 1.55, 1.35, 0.0],
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  U: {
    thumb: [0.75, 0.65, 0.45, -0.2],
    index: [0.0, 0.0, 0.0, 0.0],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  V: HAND_POSTURES.PEACE_V,
  W: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [0.0, 0.0, 0.0, -0.18],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [0.0, 0.0, 0.0, 0.18],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  X: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [0.65, 1.25, 0.75, 0.0], // Hooked index
    middle: [1.55, 1.65, 1.45, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  Y: {
    thumb: [-0.35, -0.15, 0.0, 0.55], // Thumb & pinky out
    index: [1.55, 1.65, 1.45, 0.0],
    middle: [1.60, 1.70, 1.50, 0.0],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [0.0, 0.0, 0.0, 0.25]
  },
  Z: HAND_POSTURES.POINT_INDEX
};

// Number Postures (0 - 9)
export const NUMBER_POSTURES = {
  0: HAND_POSTURES.PINCH_OK,
  1: HAND_POSTURES.POINT_INDEX,
  2: HAND_POSTURES.PEACE_V,
  3: {
    thumb: [-0.25, -0.1, 0.0, 0.45],
    index: [0.0, 0.0, 0.0, -0.1],
    middle: [0.0, 0.0, 0.0, 0.1],
    ring: [1.55, 1.65, 1.45, 0.0],
    little: [1.50, 1.60, 1.40, 0.0]
  },
  4: {
    thumb: [0.85, 0.8, 0.6, -0.2],
    index: [0.0, 0.0, 0.0, -0.2],
    middle: [0.0, 0.0, 0.0, -0.06],
    ring: [0.0, 0.0, 0.0, 0.06],
    little: [0.0, 0.0, 0.0, 0.2]
  },
  5: HAND_POSTURES.OPEN_PALM,
  6: { // Thumb & pinky touch
    thumb: [0.75, 0.65, 0.45, 0.25],
    index: [0.0, 0.0, 0.0, -0.1],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [0.0, 0.0, 0.0, 0.1],
    little: [1.15, 1.25, 1.05, 0.0]
  },
  7: { // Thumb & ring touch
    thumb: [0.75, 0.65, 0.45, 0.15],
    index: [0.0, 0.0, 0.0, -0.1],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [1.15, 1.25, 1.05, 0.0],
    little: [0.0, 0.0, 0.0, 0.15]
  },
  8: { // Thumb & middle touch
    thumb: [0.75, 0.65, 0.45, 0.1],
    index: [0.0, 0.0, 0.0, -0.1],
    middle: [1.15, 1.25, 1.05, 0.0],
    ring: [0.0, 0.0, 0.0, 0.05],
    little: [0.0, 0.0, 0.0, 0.15]
  },
  9: { // Thumb & index touch
    thumb: [0.75, 0.65, 0.45, 0.05],
    index: [1.15, 1.25, 1.05, 0.0],
    middle: [0.0, 0.0, 0.0, 0.0],
    ring: [0.0, 0.0, 0.0, 0.08],
    little: [0.0, 0.0, 0.0, 0.18]
  }
};

export class HandAnimationController {
  constructor(handGroup, fingerControllers, wristBone, side = 'L') {
    this.handGroup = handGroup;
    this.fingerControllers = fingerControllers;
    this.wristBone = wristBone;
    this.side = side;

    // Current state per finger: { [digit]: [mcp, pip, dip, abduct] }
    this.currentAngles = {};
    this.targetAngles = {};

    const defaultPose = HAND_POSTURES.RELAXED_REST;
    const digits = ['thumb', 'index', 'middle', 'ring', 'little'];
    digits.forEach(d => {
      this.currentAngles[d] = [...defaultPose[d]];
      this.targetAngles[d] = [...defaultPose[d]];
    });

    // Wrist orientation
    this.wristControlEnabled = false;
    this.currentWrist = { flex: 0, extend: 0, roll: 0 };
    this.targetWrist = { flex: 0, extend: 0, roll: 0 };
  }

  setPosture(posture) {
    if (!posture) return;
    for (const digit in posture) {
      if (this.targetAngles[digit] && posture[digit]) {
        this.targetAngles[digit] = [...posture[digit]];
      }
    }
  }

  setFingerspellingLetter(letter) {
    const upper = String(letter).toUpperCase();
    if (FINGERSPELLING_POSTURES[upper]) {
      this.setPosture(FINGERSPELLING_POSTURES[upper]);
    }
  }

  setNumber(num) {
    const n = parseInt(num, 10);
    if (NUMBER_POSTURES[n]) {
      this.setPosture(NUMBER_POSTURES[n]);
    }
  }

  setWristAngles(flex = 0, extend = 0, roll = 0) {
    this.wristControlEnabled = true;
    this.targetWrist = { flex, extend, roll };
  }

  // Dedicated Reusable Hand Pose System API (Requirement 9)
  setOpenPalmPose() {
    this.setPosture(HAND_POSTURES.OPEN_PALM);
  }

  setClosedFistPose() {
    this.setPosture(HAND_POSTURES.FIST);
  }

  setRelaxedHandPose() {
    this.setPosture(HAND_POSTURES.RELAXED_REST);
  }

  setPointingPose() {
    this.setPosture(HAND_POSTURES.IMAGE_POINT_SIGN);
  }

  setUploadedImagePose() {
    this.setPosture(HAND_POSTURES.IMAGE_POINT_SIGN);
    this.setWristAngles(0.10, 0, 0);
  }

  setThumbsUpPose() {
    this.setPosture(HAND_POSTURES.THUMBS_UP);
  }

  setHelloPose() {
    this.setPosture(HAND_POSTURES.HELLO_OPEN_PALM);
  }

  setFingerPose(digit, mcp = 0, pip = 0, dip = 0, abduct = 0) {
    if (this.targetAngles && this.targetAngles[digit]) {
      this.targetAngles[digit] = [mcp, pip, dip, abduct];
    }
  }

  setWristOrientation(flex = 0, extend = 0, roll = 0) {
    this.setWristAngles(flex - extend, 0, roll);
  }

  update(delta) {
    const lerpRate = 12.0 * delta;

    // Lerp finger angles and apply to kinematic controllers
    for (const digit in this.fingerControllers) {
      const cur = this.currentAngles[digit];
      const tgt = this.targetAngles[digit];
      if (cur && tgt) {
        for (let i = 0; i < 4; i++) {
          cur[i] = THREE.MathUtils.lerp(cur[i], tgt[i], lerpRate);
        }
        this.fingerControllers[digit].setFlexion(cur[0], cur[1], cur[2], cur[3]);
      }
    }

    // Lerp wrist angles only if explicitly commanded
    if (this.wristBone && this.wristControlEnabled) {
      this.currentWrist.flex = THREE.MathUtils.lerp(this.currentWrist.flex, this.targetWrist.flex, lerpRate);
      this.currentWrist.roll = THREE.MathUtils.lerp(this.currentWrist.roll, this.targetWrist.roll, lerpRate);
      this.wristBone.rotation.x = this.currentWrist.flex;
      this.wristBone.rotation.z = this.currentWrist.roll;
    }
  }
}
