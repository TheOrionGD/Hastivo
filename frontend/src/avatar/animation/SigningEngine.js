/**
 * Hastivo Procedural Signing Engine
 * Data-driven Indian Sign Language (ISL) animation engine.
 * Supports:
 * - Structured ISL gesture keyframe playback with arm, elbow, wrist, and 5-finger kinematics
 * - Fingerspelling A–Z with smooth arm elevation, letter articulation, and return-to-rest
 * - Numbers 0–9 with verified ISL digit handshapes
 * - Two-handed synchronized signing (Namaste, Welcome, Help, Learn, etc.)
 * - Automatic clean reset of previous tasks when a new sign starts
 * - Automatic return to neutral resting pose upon task completion
 */
import * as THREE from 'three';
import { HAND_POSTURES, FINGERSPELLING_POSTURES, NUMBER_POSTURES } from './HandController.js';

// Exact kinematic arm poses calibrated with upright hand/palm presentation
export const UPLOADED_IMAGE_ARM_POSES = {
  // Right Arm elevated vertical signing posture: Elbow at natural height, forearm & wrist angle hand UPWARD facing camera
  R: {
    upperX: 0.42,
    upperY: -0.08,
    upperZ: -0.18,
    elbowX: -1.45,
    forearmY: 0.22,
    wristX: 1.28,
    wristY: -0.16,
    wristRoll: -0.12
  },
  // Left Arm mirrored elevated vertical signing posture
  L: {
    upperX: 0.42,
    upperY: 0.08,
    upperZ: 0.18,
    elbowX: -1.45,
    forearmY: -0.22,
    wristX: 1.28,
    wristY: 0.16,
    wristRoll: 0.12
  },
  // Conversational Ready Stance (Image 2)
  READY_R: {
    upperX: 0.42,
    upperY: -0.10,
    upperZ: 0.22,
    elbowX: -1.05,
    forearmY: 0.35,
    wristX: 0.10,
    wristY: -0.10,
    wristRoll: 0.0
  },
  READY_L: {
    upperX: 0.42,
    upperY: 0.10,
    upperZ: -0.22,
    elbowX: -1.05,
    forearmY: -0.35,
    wristX: 0.10,
    wristY: 0.10,
    wristRoll: 0.0
  }
};

// Pre-defined ISL Core Dictionary Gestures
export const ISL_DICTIONARY = {
  NAMASTE: {
    signId: 'NAMASTE',
    label: 'Namaste / Hello',
    duration: 2.2,
    face: 'happy',
    twoHanded: true,
    head: { nod: 0.16, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.5,
        leftArm: { upperX: 0.54, upperY: 0.15, upperZ: 0.18, elbowX: -1.35, wristX: 1.25, wristY: 0.16, wristRoll: 0.35 },
        rightArm: { upperX: 0.54, upperY: -0.15, upperZ: -0.18, elbowX: -1.35, wristX: 1.25, wristY: -0.16, wristRoll: -0.35 },
        leftHand: HAND_POSTURES.FLAT_CLOSED,
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 1.2, // Both palms pressed together reverently in front of chest pointing UPWARD
        leftArm: { upperX: 0.58, upperY: 0.18, upperZ: 0.14, elbowX: -1.48, wristX: 1.30, wristY: 0.18, wristRoll: 0.45 },
        rightArm: { upperX: 0.58, upperY: -0.18, upperZ: -0.14, elbowX: -1.48, wristX: 1.30, wristY: -0.18, wristRoll: -0.45 },
        leftHand: HAND_POSTURES.FLAT_CLOSED,
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 2.2, // Smooth return to neutral ready rest
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  HELLO: {
    signId: 'HELLO',
    label: 'Hello',
    duration: 3.2,
    face: 'happy',
    twoHanded: false,
    head: { nod: 0.08, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristY: -0.18, wristRoll: 0.12 },
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.7, // Raise and present open palm facing camera upright
        rightArm: { upperX: 0.30, upperY: 0.0, upperZ: -2.40, elbowX: -1.10, wristX: 1.324, wristY: -0.201, wristRoll: -0.719 },
        rightHand: HAND_POSTURES.HELLO_OPEN_PALM
      },
      {
        time: 1.2, // Wave tilt left in frontal plane
        rightArm: { upperX: 0.30, upperY: 0.0, upperZ: -2.39, elbowX: -1.10, wristX: 1.324, wristY: -0.201, wristRoll: -0.92 },
        rightHand: HAND_POSTURES.HELLO_OPEN_PALM
      },
      {
        time: 1.7, // Wave tilt right in frontal plane
        rightArm: { upperX: 0.30, upperY: 0.0, upperZ: -2.41, elbowX: -1.10, wristX: 1.324, wristY: -0.201, wristRoll: -0.52 },
        rightHand: HAND_POSTURES.HELLO_OPEN_PALM
      },
      {
        time: 2.2, // Wave center
        rightArm: { upperX: 0.30, upperY: 0.0, upperZ: -2.40, elbowX: -1.10, wristX: 1.324, wristY: -0.201, wristRoll: -0.719 },
        rightHand: HAND_POSTURES.HELLO_OPEN_PALM
      },
      {
        time: 3.2, // Smooth return to neutral ISL ready rest
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristY: -0.18, wristRoll: 0.12 },
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  THANK_YOU: {
    signId: 'THANK_YOU',
    label: 'Thank You',
    duration: 1.9,
    face: 'acknowledging',
    twoHanded: false,
    head: { nod: 0.14, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Fingertips touch chin
        rightArm: { upperX: 0.85, upperY: 0.08, upperZ: -0.15, elbowX: -1.55, wristX: 1.15, wristY: -0.12, wristRoll: 0.05 },
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 1.3, // Hand moves outward gracefully toward recipient with upward palm
        rightArm: { upperX: 0.58, upperY: 0.05, upperZ: -0.18, elbowX: -1.15, wristX: 1.28, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 1.9, // Return to rest
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  WELCOME: {
    signId: 'WELCOME',
    label: 'Welcome',
    duration: 2.0,
    face: 'happy',
    twoHanded: true,
    head: { nod: 0.08, tilt: 0.02 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Open arms wide with upturned palms
        leftArm: { upperX: 0.50, upperY: -0.10, upperZ: 0.48, elbowX: -1.15, wristX: 1.25, wristY: 0.18, wristRoll: 0.35 },
        rightArm: { upperX: 0.50, upperY: 0.10, upperZ: -0.48, elbowX: -1.15, wristX: 1.25, wristY: -0.18, wristRoll: -0.35 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.OPEN_PALM
      },
      {
        time: 1.3, // Sweep inward toward torso with palms facing camera upright
        leftArm: { upperX: 0.54, upperY: 0.15, upperZ: 0.22, elbowX: -1.35, wristX: 1.28, wristY: 0.16, wristRoll: 0.40 },
        rightArm: { upperX: 0.54, upperY: -0.15, upperZ: -0.22, elbowX: -1.35, wristX: 1.28, wristY: -0.16, wristRoll: -0.40 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.OPEN_PALM
      },
      {
        time: 2.0, // Return to rest
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  YES: {
    signId: 'YES',
    label: 'Yes',
    duration: 1.8,
    face: 'happy',
    twoHanded: false,
    head: { nod: 0.15, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.5, // Hand elevates with fist upright (acting like nodding head)
        rightArm: { upperX: 0.45, upperY: 0.05, upperZ: -0.18, elbowX: -1.40, wristX: 1.28, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.FIST
      },
      {
        time: 0.9, // Fist nods down
        rightArm: { upperX: 0.45, upperY: 0.05, upperZ: -0.18, elbowX: -1.32, wristX: 1.05, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.FIST
      },
      {
        time: 1.3, // Fist nods up again
        rightArm: { upperX: 0.45, upperY: 0.05, upperZ: -0.18, elbowX: -1.40, wristX: 1.28, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.FIST
      },
      {
        time: 1.8, // Return to rest
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  NO: {
    signId: 'NO',
    label: 'No',
    duration: 1.8,
    face: 'sad',
    twoHanded: false,
    head: { nod: 0.0, tilt: 0.1 },
    keyframes: [
      {
        time: 0.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.5, // Open index & middle fingers snapping shut to thumb in upright view
        rightArm: { upperX: 0.45, upperY: 0.05, upperZ: -0.18, elbowX: -1.38, wristX: 1.28, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.PEACE_V
      },
      {
        time: 1.1, // Snap closed to pinch
        rightArm: { upperX: 0.45, upperY: 0.05, upperZ: -0.18, elbowX: -1.38, wristX: 1.28, wristY: -0.14, wristRoll: 0.15 },
        rightHand: HAND_POSTURES.PINCH_OK
      },
      {
        time: 1.8,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  PLEASE: {
    signId: 'PLEASE',
    label: 'Please',
    duration: 2.0,
    face: 'happy',
    twoHanded: false,
    head: { nod: 0.08, tilt: 0.04 },
    keyframes: [
      {
        time: 0.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.5, // Palm placed flat on chest with upward fingers
        rightArm: { upperX: 0.52, upperY: 0.10, upperZ: -0.12, elbowX: -1.48, wristX: 1.20, wristY: -0.15, wristRoll: 0.35 },
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 1.2, // Gentle circular rub
        rightArm: { upperX: 0.55, upperY: 0.06, upperZ: -0.15, elbowX: -1.44, wristX: 1.20, wristY: -0.15, wristRoll: 0.25 },
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 2.0,
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  HELP: {
    signId: 'HELP',
    label: 'Help',
    duration: 2.0,
    face: 'questioning',
    twoHanded: true,
    head: { nod: 0.06, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Left palm flat underneath Right thumbs-up fist
        leftArm: { upperX: 0.50, upperY: 0.10, upperZ: 0.18, elbowX: -1.35, wristX: 1.25, wristY: 0.15, wristRoll: 0.4 },
        rightArm: { upperX: 0.58, upperY: -0.08, upperZ: -0.14, elbowX: -1.42, wristX: 1.28, wristY: -0.15, wristRoll: 0.1 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.THUMBS_UP
      },
      {
        time: 1.3, // Both hands elevate upward together
        leftArm: { upperX: 0.62, upperY: 0.10, upperZ: 0.18, elbowX: -1.45, wristX: 1.28, wristY: 0.15, wristRoll: 0.4 },
        rightArm: { upperX: 0.70, upperY: -0.08, upperZ: -0.14, elbowX: -1.52, wristX: 1.30, wristY: -0.15, wristRoll: 0.1 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.THUMBS_UP
      },
      {
        time: 2.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  LEARN: {
    signId: 'LEARN',
    label: 'Learn',
    duration: 2.2,
    face: 'thinking',
    twoHanded: true,
    head: { nod: 0.08, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Left open palm flat, right hand takes knowledge from palm
        leftArm: { upperX: 0.50, upperY: 0.10, upperZ: 0.18, elbowX: -1.35, wristX: 1.25, wristY: 0.15, wristRoll: 0.4 },
        rightArm: { upperX: 0.58, upperY: -0.08, upperZ: -0.14, elbowX: -1.42, wristX: 1.28, wristY: -0.15, wristRoll: 0.1 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.FLAT_CLOSED
      },
      {
        time: 1.3, // Right hand draws up to touch forehead
        leftArm: { upperX: 0.50, upperY: 0.10, upperZ: 0.18, elbowX: -1.35, wristX: 1.25, wristY: 0.15, wristRoll: 0.4 },
        rightArm: { upperX: 0.90, upperY: 0.08, upperZ: -0.22, elbowX: -1.82, wristX: 1.15, wristY: -0.10, wristRoll: -0.1 },
        leftHand: HAND_POSTURES.OPEN_PALM,
        rightHand: HAND_POSTURES.PINCH_OK
      },
      {
        time: 2.2,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  COMMUNICATE: {
    signId: 'COMMUNICATE',
    label: 'Communicate',
    duration: 2.2,
    face: 'happy',
    twoHanded: true,
    head: { nod: 0.08, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Both hands alternate in forward-back rolling motion with 'C' shape upright
        leftArm: { upperX: 0.52, upperY: 0.12, upperZ: 0.18, elbowX: -1.35, wristX: 1.28, wristY: 0.15, wristRoll: 0.2 },
        rightArm: { upperX: 0.48, upperY: -0.12, upperZ: -0.18, elbowX: -1.25, wristX: 1.28, wristY: -0.15, wristRoll: -0.2 },
        leftHand: HAND_POSTURES.CUPPED,
        rightHand: HAND_POSTURES.CUPPED
      },
      {
        time: 1.3,
        leftArm: { upperX: 0.48, upperY: 0.12, upperZ: 0.18, elbowX: -1.25, wristX: 1.28, wristY: 0.15, wristRoll: 0.2 },
        rightArm: { upperX: 0.52, upperY: -0.12, upperZ: -0.18, elbowX: -1.35, wristX: 1.28, wristY: -0.15, wristRoll: -0.2 },
        leftHand: HAND_POSTURES.CUPPED,
        rightHand: HAND_POSTURES.CUPPED
      },
      {
        time: 2.2,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  },

  SIGN: {
    signId: 'SIGN',
    label: 'Sign Language',
    duration: 2.2,
    face: 'happy',
    twoHanded: true,
    head: { nod: 0.08, tilt: 0.0 },
    keyframes: [
      {
        time: 0.0,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      },
      {
        time: 0.6, // Both index fingers revolving alternately with upright palms
        leftArm: { upperX: 0.52, upperY: 0.12, upperZ: 0.20, elbowX: -1.35, wristX: 1.28, wristY: 0.15, wristRoll: 0.2 },
        rightArm: { upperX: 0.55, upperY: -0.10, upperZ: -0.18, elbowX: -1.30, wristX: 1.28, wristY: -0.15, wristRoll: -0.2 },
        leftHand: HAND_POSTURES.POINT_INDEX,
        rightHand: HAND_POSTURES.POINT_INDEX
      },
      {
        time: 1.3,
        leftArm: { upperX: 0.55, upperY: 0.10, upperZ: 0.18, elbowX: -1.30, wristX: 1.28, wristY: 0.15, wristRoll: -0.2 },
        rightArm: { upperX: 0.52, upperY: -0.12, upperZ: -0.20, elbowX: -1.35, wristX: 1.28, wristY: -0.15, wristRoll: 0.2 },
        leftHand: HAND_POSTURES.POINT_INDEX,
        rightHand: HAND_POSTURES.POINT_INDEX
      },
      {
        time: 2.2,
        leftArm: { upperX: 0.42, upperY: 0.10, upperZ: -0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        rightArm: { upperX: 0.42, upperY: -0.10, upperZ: 0.28, elbowX: -0.92, wristX: 0.10, wristRoll: 0.0 },
        leftHand: HAND_POSTURES.RELAXED_REST,
        rightHand: HAND_POSTURES.RELAXED_REST
      }
    ]
  }
};

export class SigningEngine {
  constructor(avatar, animationController) {
    this.avatar = avatar;
    this.animationController = animationController;

    this.isPlaying = false;
    this.queue = [];
    this.currentSign = null;
    this.signElapsedTime = 0;
    this.playbackSpeed = 1.0;
    this.defaultSide = 'R'; // 'R' | 'L' | 'both'

    // Resting transforms for natural ISL ready posture matching reference image 2
    this.restPose = {
      rightUpperArm: { x: 0.42, y: -0.10, z: 0.22 },
      rightElbow: { x: -1.05, y: 0.0, z: 0.0 },
      leftUpperArm: { x: 0.42, y: 0.10, z: -0.22 },
      leftElbow: { x: -1.05, y: 0.0, z: 0.0 }
    };

    // Events callback for UI feedback
    this.onSignProgress = null; // ({ signId, letter, label, progress, finished }) => void
  }

  setDefaultSide(side = 'R') {
    this.defaultSide = side;
  }

  _buildSigningArmKf(time, posture, side = this.defaultSide) {
    const kf = { time };
    const useRight = side === 'R' || side === 'both';
    const useLeft = side === 'L' || side === 'both';

    if (useRight) {
      kf.rightArm = { ...UPLOADED_IMAGE_ARM_POSES.R };
      kf.rightHand = posture;
    } else {
      kf.rightArm = { ...UPLOADED_IMAGE_ARM_POSES.READY_R };
      kf.rightHand = HAND_POSTURES.RELAXED_REST;
    }

    if (useLeft) {
      kf.leftArm = { ...UPLOADED_IMAGE_ARM_POSES.L };
      kf.leftHand = posture;
    } else {
      kf.leftArm = { ...UPLOADED_IMAGE_ARM_POSES.READY_L };
      kf.leftHand = HAND_POSTURES.RELAXED_REST;
    }

    return kf;
  }

  _buildRestArmKf(time) {
    return {
      time,
      rightArm: { ...UPLOADED_IMAGE_ARM_POSES.READY_R },
      rightHand: HAND_POSTURES.RELAXED_REST,
      leftArm: { ...UPLOADED_IMAGE_ARM_POSES.READY_L },
      leftHand: HAND_POSTURES.RELAXED_REST
    };
  }

  playUploadedImageAction(side = this.defaultSide) {
    this.stop();
    const useRight = side === 'R' || side === 'both';
    const useLeft = side === 'L' || side === 'both';
    const sideLabel = useRight && useLeft ? 'Both Hands' : (useLeft ? 'Left Hand' : 'Right Hand');

    const gesture = {
      signId: 'IMAGE_DEFAULT_SIGN',
      label: `Hastivo Default Sign: ${sideLabel}`,
      duration: 3.2,
      face: 'happy',
      head: { nod: 0.12, tilt: 0.0 },
      keyframes: [
        this._buildRestArmKf(0.0),
        {
          time: 0.5,
          ...this._buildSigningArmKf(0.5, HAND_POSTURES.IMAGE_POINT_SIGN, side)
        },
        {
          time: 2.5,
          ...this._buildSigningArmKf(2.5, HAND_POSTURES.IMAGE_POINT_SIGN, side)
        },
        this._buildRestArmKf(3.2)
      ]
    };

    this.queue = [gesture];
    this._startNextInQueue();
  }

  playDefaultSign(side = this.defaultSide) {
    this.playUploadedImageAction(side);
  }

  playSign(signIdOrObj) {
    // 1. Clean reset of previous running tasks
    this.stop();

    let signData = null;
    if (typeof signIdOrObj === 'string') {
      const upper = signIdOrObj.toUpperCase().trim();
      signData = ISL_DICTIONARY[upper];
    } else if (typeof signIdOrObj === 'object') {
      signData = signIdOrObj;
    }

    if (signData) {
      this.queue = [JSON.parse(JSON.stringify(signData))];
      this._startNextInQueue();
    }
  }

  playSequence(signIds) {
    this.stop();

    if (!Array.isArray(signIds)) return;
    this.queue = signIds.map(id => {
      const upper = String(id).toUpperCase().trim();
      return ISL_DICTIONARY[upper] ? JSON.parse(JSON.stringify(ISL_DICTIONARY[upper])) : null;
    }).filter(Boolean);

    if (this.queue.length > 0) {
      this._startNextInQueue();
    }
  }

  playFingerspelling(text, secondsPerLetter = 0.85, side = this.defaultSide) {
    this.stop();

    const clean = String(text).toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    if (!clean) return;

    const letters = clean.split('');
    const spellingGestures = [];
    const isSingleChar = letters.length === 1;

    // 1. Preparation: elevate arm smoothly into vertical signing posture (matching reference image)
    spellingGestures.push({
      signId: 'PREPARE_SIGN',
      label: isSingleChar ? `Signing: ${letters[0]}` : `Spelling: ${clean}`,
      letter: isSingleChar ? letters[0] : '',
      duration: 0.35,
      face: 'concentrating',
      keyframes: [
        this._buildRestArmKf(0.0),
        this._buildSigningArmKf(
          0.35,
          isSingleChar ? (FINGERSPELLING_POSTURES[letters[0]] || NUMBER_POSTURES[letters[0]] || HAND_POSTURES.IMAGE_POINT_SIGN) : HAND_POSTURES.IMAGE_POINT_SIGN,
          side
        )
      ]
    });

    // 2. Articulate each letter in the signing workspace
    const holdDuration = isSingleChar ? 1.3 : secondsPerLetter;

    letters.forEach(char => {
      if (char === ' ') {
        spellingGestures.push({
          signId: 'SPACE',
          label: 'Space',
          letter: ' ',
          duration: 0.4,
          face: 'neutral',
          keyframes: [
            this._buildSigningArmKf(0.0, HAND_POSTURES.RELAXED_REST, side),
            this._buildSigningArmKf(0.4, HAND_POSTURES.RELAXED_REST, side)
          ]
        });
      } else {
        const posture = FINGERSPELLING_POSTURES[char] || NUMBER_POSTURES[char] || HAND_POSTURES.IMAGE_POINT_SIGN;
        spellingGestures.push({
          signId: `SPELL_${char}`,
          label: `Letter ${char}`,
          letter: char,
          duration: holdDuration,
          face: 'concentrating',
          keyframes: [
            this._buildSigningArmKf(0.0, posture, side),
            this._buildSigningArmKf(holdDuration, posture, side)
          ]
        });
      }
    });

    // 3. Return to rest: smoothly return to conversational ready posture
    spellingGestures.push({
      signId: 'RETURN_REST',
      label: 'Returning to Rest',
      letter: '',
      duration: 0.45,
      face: 'neutral',
      keyframes: [
        this._buildSigningArmKf(0.0, HAND_POSTURES.IMAGE_POINT_SIGN, side),
        this._buildRestArmKf(0.45)
      ]
    });

    this.queue = spellingGestures;
    this._startNextInQueue();
  }

  playNumber(num, side = this.defaultSide) {
    this.stop();

    const n = parseInt(num, 10);
    const posture = NUMBER_POSTURES[n] || NUMBER_POSTURES[String(num)] || HAND_POSTURES.IMAGE_POINT_SIGN;

    const numberGestures = [
      {
        signId: 'PREPARE_NUMBER',
        label: `Number ${num}`,
        letter: String(num),
        duration: 0.35,
        face: 'concentrating',
        keyframes: [
          this._buildRestArmKf(0.0),
          this._buildSigningArmKf(0.35, posture, side)
        ]
      },
      {
        signId: `NUMBER_${num}`,
        label: `Number ${num}`,
        letter: String(num),
        duration: 1.3,
        face: 'concentrating',
        keyframes: [
          this._buildSigningArmKf(0.0, posture, side),
          this._buildSigningArmKf(1.3, posture, side)
        ]
      },
      {
        signId: 'RETURN_REST',
        label: 'Returning to Rest',
        letter: '',
        duration: 0.45,
        face: 'neutral',
        keyframes: [
          this._buildSigningArmKf(0.0, posture, side),
          this._buildRestArmKf(0.45)
        ]
      }
    ];

    this.queue = numberGestures;
    this._startNextInQueue();
  }

  _startNextInQueue() {
    if (this.queue.length === 0) {
      this.stop();
      if (this.onSignProgress) {
        this.onSignProgress({ finished: true, label: '', letter: '' });
      }
      return;
    }

    this.currentSign = this.queue.shift();
    this.signElapsedTime = 0;
    this.isPlaying = true;

    // Detect if this sign requires both hands
    const hasLeft = Boolean(this.currentSign.keyframes && this.currentSign.keyframes.some(kf => kf.leftArm));
    const hasRight = Boolean(this.currentSign.keyframes && this.currentSign.keyframes.some(kf => kf.rightArm));
    this.isCurrentTwoHanded = Boolean(
      this.currentSign.twoHanded ||
      (hasLeft && hasRight) ||
      this.defaultSide === 'both'
    );

    // Suppress idle animation while signing
    if (this.animationController) {
      this.animationController.isIdleSuppressed = true;
    }

    // Ensure direct controllers do not fight SigningEngine
    if (this.avatar.armController) this.avatar.armController.enabled = false;
    if (this.avatar.shoulderController) this.avatar.shoulderController.enabled = false;
    if (this.avatar.wristController) this.avatar.wristController.enabled = false;

    // Trigger complementary facial expression
    if (this.currentSign.face && this.avatar.facialController) {
      this.avatar.facialController.setExpression(this.currentSign.face);
    }

    if (this.onSignProgress) {
      this.onSignProgress({
        signId: this.currentSign.signId,
        letter: this.currentSign.letter || '',
        label: this.currentSign.label || this.currentSign.signId,
        progress: 0,
        finished: false
      });
    }
  }

  stop() {
    this.isPlaying = false;
    this.queue = [];
    this.currentSign = null;
    this.signElapsedTime = 0;
    this.isCurrentTwoHanded = false;

    // Reset upper body transparency
    if (this.avatar?.setUpperBodyGhosted) {
      this.avatar.setUpperBodyGhosted(false);
    }

    // Reset direct bone rotations to natural ISL ready posture
    const bones = this.avatar.bones;
    if (bones) {
      if (bones['RightUpperArm']) bones['RightUpperArm'].rotation.set(0.42, -0.10, 0.28);
      if (bones['RightElbow']) bones['RightElbow'].rotation.x = -0.92;
      if (bones['RightForearm']) bones['RightForearm'].rotation.y = 0.35;
      if (bones['LeftUpperArm']) bones['LeftUpperArm'].rotation.set(0.42, 0.10, -0.28);
      if (bones['LeftElbow']) bones['LeftElbow'].rotation.x = -0.92;
      if (bones['LeftForearm']) bones['LeftForearm'].rotation.y = -0.35;
      if (bones['RightWrist']) bones['RightWrist'].rotation.set(0.10, 0.18, -0.12);
      if (bones['LeftWrist']) bones['LeftWrist'].rotation.set(0.10, -0.18, 0.12);
    }

    // Reset animation controller and restore idle breathing
    if (this.animationController) {
      this.animationController.isIdleSuppressed = false;
      this.animationController.resetPose();
    }

    // Reset hand postures to natural relaxed rest
    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
      this.avatar.leftHandController.setWristAngles(0, 0, 0);
    }
    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.RELAXED_REST);
      this.avatar.rightHandController.setWristAngles(0, 0, 0);
    }

    // Reset expression to friendly neutral
    if (this.avatar.facialController) {
      this.avatar.facialController.setExpression('neutral');
    }
  }

  update(delta) {
    if (!this.isPlaying || !this.currentSign) return;

    const dt = delta * this.playbackSpeed;
    this.signElapsedTime += dt;

    const sign = this.currentSign;
    const progress = Math.min(1.0, this.signElapsedTime / sign.duration);

    // Dynamic Upper Body Transparency: only when two hands are signing together in front of the body
    if (this.avatar?.setUpperBodyGhosted) {
      if (this.isCurrentTwoHanded) {
        // Transparent while active in front of body; restore as returning to rest at end of sign
        const isReturningToRest = progress > 0.88;
        this.avatar.setUpperBodyGhosted(!isReturningToRest);
      } else {
        this.avatar.setUpperBodyGhosted(false);
      }
    }

    if (this.onSignProgress) {
      this.onSignProgress({
        signId: sign.signId,
        letter: sign.letter || '',
        label: sign.label || sign.signId,
        progress,
        finished: false
      });
    }

    // Directly interpolate and apply keyframes to avatar bones
    this._interpolateSignKeyframes(sign, this.signElapsedTime);

    if (this.signElapsedTime >= sign.duration) {
      this._startNextInQueue();
    }
  }

  _interpolateSignKeyframes(sign, time) {
    const kfs = sign.keyframes;
    if (!kfs || kfs.length === 0) return;

    let kfA = kfs[0];
    let kfB = kfs[kfs.length - 1];
    let localT = 0;

    for (let i = 0; i < kfs.length - 1; i++) {
      if (time >= kfs[i].time && time <= kfs[i + 1].time) {
        kfA = kfs[i];
        kfB = kfs[i + 1];
        const span = kfB.time - kfA.time;
        localT = span > 0 ? (time - kfA.time) / span : 0;
        break;
      }
    }

    // Smooth cubic ease in-out
    const ease = localT * localT * (3 - 2 * localT);

    // 1. Direct Right Arm Kinematics
    if (kfA.rightArm && kfB.rightArm) {
      const armA = kfA.rightArm;
      const armB = kfB.rightArm;
      const ux = THREE.MathUtils.lerp(armA.upperX, armB.upperX, ease);
      const uy = THREE.MathUtils.lerp(armA.upperY || 0, armB.upperY || 0, ease);
      const uz = THREE.MathUtils.lerp(armA.upperZ, armB.upperZ, ease);
      const el = THREE.MathUtils.lerp(armA.elbowX, armB.elbowX, ease);
      const roll = (armA.wristRoll !== undefined && armB.wristRoll !== undefined)
        ? THREE.MathUtils.lerp(armA.wristRoll, armB.wristRoll, ease)
        : 0;

      // Apply directly to bones
      const rUpper = this.avatar.bones['RightUpperArm'];
      if (rUpper) rUpper.rotation.set(ux, uy, uz);

      const rElbow = this.avatar.bones['RightElbow'];
      if (rElbow) rElbow.rotation.x = el;

      if (armA.wristX !== undefined && armB.wristX !== undefined) {
        const wx = THREE.MathUtils.lerp(armA.wristX, armB.wristX, ease);
        const wy = THREE.MathUtils.lerp(armA.wristY || 0, armB.wristY || 0, ease);
        const wz = THREE.MathUtils.lerp(armA.wristRoll ?? armA.wristZ ?? 0, armB.wristRoll ?? armB.wristZ ?? 0, ease);
        const rWrist = this.avatar.bones['RightWrist'];
        if (rWrist) rWrist.rotation.set(wx, wy, wz);
        if (this.avatar.rightHandController) {
          this.avatar.rightHandController.wristControlEnabled = false;
        }
      } else if (this.avatar.rightHandController) {
        this.avatar.rightHandController.setWristAngles(0, 0, roll);
      }

      // Sync animationController targetRotations
      if (this.animationController?.targetRotations['RightUpperArm']) {
        this.animationController.targetRotations['RightUpperArm'].set(ux, uy, uz);
      }
      if (this.animationController?.targetRotations['RightElbow']) {
        this.animationController.targetRotations['RightElbow'].x = el;
      }
    }

    // 2. Direct Left Arm Kinematics
    if (kfA.leftArm && kfB.leftArm) {
      const armA = kfA.leftArm;
      const armB = kfB.leftArm;
      const ux = THREE.MathUtils.lerp(armA.upperX, armB.upperX, ease);
      const uy = THREE.MathUtils.lerp(armA.upperY || 0, armB.upperY || 0, ease);
      const uz = THREE.MathUtils.lerp(armA.upperZ, armB.upperZ, ease);
      const el = THREE.MathUtils.lerp(armA.elbowX, armB.elbowX, ease);
      const roll = (armA.wristRoll !== undefined && armB.wristRoll !== undefined)
        ? THREE.MathUtils.lerp(armA.wristRoll, armB.wristRoll, ease)
        : 0;

      const lUpper = this.avatar.bones['LeftUpperArm'];
      if (lUpper) lUpper.rotation.set(ux, uy, uz);

      const lElbow = this.avatar.bones['LeftElbow'];
      if (lElbow) lElbow.rotation.x = el;

      if (armA.wristX !== undefined && armB.wristX !== undefined) {
        const wx = THREE.MathUtils.lerp(armA.wristX, armB.wristX, ease);
        const wy = THREE.MathUtils.lerp(armA.wristY || 0, armB.wristY || 0, ease);
        const wz = THREE.MathUtils.lerp(armA.wristRoll ?? armA.wristZ ?? 0, armB.wristRoll ?? armB.wristZ ?? 0, ease);
        const lWrist = this.avatar.bones['LeftWrist'];
        if (lWrist) lWrist.rotation.set(wx, wy, wz);
        if (this.avatar.leftHandController) {
          this.avatar.leftHandController.wristControlEnabled = false;
        }
      } else if (this.avatar.leftHandController) {
        this.avatar.leftHandController.setWristAngles(0, 0, roll);
      }

      if (this.animationController?.targetRotations['LeftUpperArm']) {
        this.animationController.targetRotations['LeftUpperArm'].set(ux, uy, uz);
      }
      if (this.animationController?.targetRotations['LeftElbow']) {
        this.animationController.targetRotations['LeftElbow'].x = el;
      }
    }

    // 3. Direct Hand Posture Application
    if (kfA.rightHand && this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(kfA.rightHand);
    }
    if (kfA.leftHand && this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(kfA.leftHand);
    }
  }
}
