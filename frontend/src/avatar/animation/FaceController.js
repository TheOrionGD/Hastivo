/**
 * Hastivo FaceController
 * Coordinates the digital display face: integrates EyeController with digital mouth
 * indicators and head gestures to produce all 10 required robotic expressions:
 * 1. Neutral (● ● with gentle curve)
 * 2. Happy (^ ^ with wide smile)
 * 3. Sad (⌒ ⌒ with downturned line)
 * 4. Surprised (O O with open circular mouth)
 * 5. Confused (Asymmetric squint with head tilt)
 * 6. Thinking (Eyes gaze up-right with head cocked)
 * 7. Listening (Attentive forward lean & wide pupils)
 * 8. Acknowledging (Warm smile with affirming nod)
 * 9. Questioning (Arched eye with ? tilt)
 * 10. Error (Laser slits / flash with warning indicator)
 */
import * as THREE from 'three';
import { EyeController } from './EyeController.js';

export const ROBOT_10_EXPRESSIONS = {
  neutral: {
    name: 'Neutral',
    eyeScaleLeft: [1.0, 1.0],
    eyeScaleRight: [1.0, 1.0],
    eyeRotZ: 0.0,
    mouthScale: [1.0, 0.8],
    mouthRotX: 0.0,
    gaze: [0.0, 0.0],
    headTilt: 0.0,
    headPitch: 0.0,
    headYaw: 0.0,
    amberGlow: 0.8,
    blueGlow: 1.0
  },
  happy: {
    name: 'Happy',
    eyeScaleLeft: [1.2, 1.3],
    eyeScaleRight: [1.2, 1.3],
    eyeRotZ: 0.14,
    mouthScale: [1.4, 1.35],
    mouthRotX: 0.18,
    gaze: [0.0, 0.06],
    headTilt: 0.04,
    headPitch: 0.03,
    headYaw: 0.0,
    amberGlow: 1.0,
    blueGlow: 1.3
  },
  sad: {
    name: 'Sad',
    eyeScaleLeft: [1.0, -1.0],
    eyeScaleRight: [1.0, -1.0],
    eyeRotZ: -0.1,
    mouthScale: [0.8, 0.35],
    mouthRotX: -0.2,
    gaze: [0.0, -0.2],
    headTilt: 0.0,
    headPitch: -0.1,
    headYaw: 0.0,
    amberGlow: 0.5,
    blueGlow: 0.7
  },
  surprised: {
    name: 'Surprised',
    eyeScaleLeft: [1.45, 1.5],
    eyeScaleRight: [1.45, 1.5],
    eyeRotZ: 0.0,
    mouthScale: [0.9, 1.5],
    mouthRotX: 0.0,
    gaze: [0.0, 0.0],
    headTilt: 0.0,
    headPitch: -0.06,
    headYaw: 0.0,
    amberGlow: 1.2,
    blueGlow: 1.4
  },
  confused: {
    name: 'Confused',
    eyeScaleLeft: [1.25, 1.15],
    eyeScaleRight: [0.7, 0.45], // Asymmetric squint
    eyeRotZ: 0.25,
    mouthScale: [0.85, 0.5],
    mouthRotX: 0.1,
    gaze: [-0.2, 0.15],
    headTilt: 0.16,
    headPitch: 0.02,
    headYaw: -0.08,
    amberGlow: 1.1,
    blueGlow: 0.9
  },
  thinking: {
    name: 'Thinking',
    eyeScaleLeft: [1.05, 1.1],
    eyeScaleRight: [1.05, 1.1],
    eyeRotZ: 0.08,
    mouthScale: [0.8, 0.4],
    mouthRotX: 0.05,
    gaze: [0.38, 0.45], // Gaze up and right
    headTilt: 0.14,
    headPitch: -0.1,
    headYaw: 0.1,
    amberGlow: 0.9,
    blueGlow: 1.1
  },
  listening: {
    name: 'Listening',
    eyeScaleLeft: [1.1, 1.12],
    eyeScaleRight: [1.1, 1.12],
    eyeRotZ: 0.05,
    mouthScale: [1.0, 0.75],
    mouthRotX: 0.0,
    gaze: [0.0, 0.08],
    headTilt: 0.06,
    headPitch: 0.08, // Attentive forward nod
    headYaw: 0.0,
    amberGlow: 1.2,
    blueGlow: 1.2
  },
  acknowledging: {
    name: 'Acknowledging',
    eyeScaleLeft: [1.2, 1.25],
    eyeScaleRight: [1.2, 1.25],
    eyeRotZ: 0.1,
    mouthScale: [1.25, 1.0],
    mouthRotX: 0.12,
    gaze: [0.0, 0.0],
    headTilt: 0.0,
    headPitch: 0.16,
    headYaw: 0.0,
    amberGlow: 1.0,
    blueGlow: 1.2
  },
  questioning: {
    name: 'Questioning',
    eyeScaleLeft: [1.35, 1.4],  // One eye wide open with question
    eyeScaleRight: [0.85, 0.8], // One eye focused
    eyeRotZ: 0.18,
    mouthScale: [0.8, 0.6],
    mouthRotX: 0.08,
    gaze: [0.15, 0.25],
    headTilt: -0.14,
    headPitch: 0.04,
    headYaw: 0.12,
    amberGlow: 1.3,
    blueGlow: 1.1
  },
  error: {
    name: 'Error',
    eyeScaleLeft: [1.4, 0.15], // Flattened to sharp warning laser slits
    eyeScaleRight: [1.4, 0.15],
    eyeRotZ: -0.2,
    mouthScale: [0.65, 0.2],
    mouthRotX: -0.1,
    gaze: [0.0, 0.0],
    headTilt: 0.0,
    headPitch: -0.04,
    headYaw: 0.0,
    amberGlow: 1.8, // Amber warning flare
    blueGlow: 0.6
  }
};

export class FaceController {
  constructor(facialNodes, headController) {
    this.nodes = facialNodes;
    this.headController = headController;

    // Sub-controller for digital eyes
    this.eyeController = new EyeController(
      this.nodes.leftEye,
      this.nodes.rightEye,
      this.nodes.visor
    );

    this.currentExpression = 'neutral';
    this.mouth = this.nodes.mouth;
    this.nose = this.nodes.nose;

    this.currentMouth = {
      scaleX: 1.0,
      scaleY: 0.8,
      rotX: 0.0
    };

    this.targetMouth = {
      scaleX: 1.0,
      scaleY: 0.8,
      rotX: 0.0
    };

    this.currentNoseScale = 1.0;
    this.targetNoseScale = 1.0;
  }

  setExpression(exprName) {
    const config = ROBOT_10_EXPRESSIONS[exprName] || ROBOT_10_EXPRESSIONS.neutral;
    this.currentExpression = exprName;

    // Apply to eyes
    this.eyeController.setEyeScales(
      config.eyeScaleLeft[0],
      config.eyeScaleLeft[1],
      config.eyeScaleRight[0],
      config.eyeScaleRight[1],
      config.eyeRotZ
    );
    this.eyeController.setGaze(config.gaze[0], config.gaze[1]);
    this.eyeController.setGlowIntensity(config.blueGlow);

    // Apply to mouth
    this.targetMouth.scaleX = config.mouthScale[0];
    this.targetMouth.scaleY = config.mouthScale[1];
    this.targetMouth.rotX = config.mouthRotX;

    // Apply to digital nose line
    if (exprName === 'happy') this.targetNoseScale = 1.15;
    else if (exprName === 'sad') this.targetNoseScale = 0.85;
    else if (exprName === 'surprised') this.targetNoseScale = 1.25;
    else this.targetNoseScale = 1.0;

    // Apply to head if head controller is provided
    if (this.headController) {
      this.headController.setOrientation(
        config.headYaw,
        config.headPitch,
        config.headTilt
      );
    }
  }

  update(delta) {
    this.eyeController.update(delta);

    // Smooth mouth transitions
    const lerpSpeed = 10 * delta;
    this.currentMouth.scaleX = THREE.MathUtils.lerp(this.currentMouth.scaleX, this.targetMouth.scaleX, lerpSpeed);
    this.currentMouth.scaleY = THREE.MathUtils.lerp(this.currentMouth.scaleY, this.targetMouth.scaleY, lerpSpeed);
    this.currentMouth.rotX = THREE.MathUtils.lerp(this.currentMouth.rotX, this.targetMouth.rotX, lerpSpeed);

    if (this.mouth) {
      this.mouth.scale.set(this.currentMouth.scaleX, this.currentMouth.scaleY, 1.0);
      this.mouth.rotation.x = this.currentMouth.rotX;
    }

    // Smooth digital nose animation
    if (this.nose) {
      this.currentNoseScale = THREE.MathUtils.lerp(this.currentNoseScale, this.targetNoseScale, lerpSpeed);
      this.nose.scale.set(1.0, this.currentNoseScale, 1.0);
    }
  }
}
