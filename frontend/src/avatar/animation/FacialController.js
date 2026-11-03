/**
 * Signora Robotic Facial & Digital Display Controller
 * Controls the robot assistant's digital visor expressions,
 * electric blue digital eyes, digital smile, and head gestures.
 * 
 * Required Robotic Expressions:
 * - Neutral: Friendly rounded digital eyes ( ●   ● ) with soft smile ( ◡ )
 * - Happy: Uplifted bright digital arcs ( ^   ^ ) with wide smile
 * - Sad: Downward soft digital arcs ( ⌒   ⌒ ) with flat mouth line
 * - Confused: Asymmetric arched/squinted eyes with head tilt
 * - Surprised: Wide glowing digital rings ( O   O ) with open mouth
 * - Thinking: Digital gaze looking up-right ( ↗   ↗ ) with head cocked
 * - Listening: Attentive forward lean, wide pupils
 * - Acknowledging: Gentle affirming smile and respectful nod
 */
import * as THREE from 'three';

export const ROBOT_EXPRESSIONS = {
  neutral: {
    name: 'Neutral',
    eyeShape: 'arc',      // 'arc' | 'oval' | 'slit'
    eyeScaleX: 1.0,
    eyeScaleY: 1.0,
    eyeRotZ: 0.0,
    mouthShape: 'smile',  // 'smile' | 'flat' | 'open'
    mouthScaleX: 1.0,
    mouthScaleY: 0.8,
    mouthRotX: 0.0,
    gazeX: 0.0,
    gazeY: 0.0,
    headTilt: 0.0,
    headNod: 0.0
  },
  happy: {
    name: 'Happy',
    eyeShape: 'arc',
    eyeScaleX: 1.15,
    eyeScaleY: 1.25,
    eyeRotZ: 0.12, // Cheerful curved eye angle
    mouthShape: 'smile',
    mouthScaleX: 1.35,
    mouthScaleY: 1.25,
    mouthRotX: 0.15,
    gazeX: 0.0,
    gazeY: 0.05,
    headTilt: 0.03,
    headNod: 0.02
  },
  sad: {
    name: 'Sad',
    eyeShape: 'arc',
    eyeScaleX: 1.0,
    eyeScaleY: -1.0, // Invert arc upside down ( ⌒   ⌒ )
    eyeRotZ: -0.08,
    mouthShape: 'flat',
    mouthScaleX: 0.85,
    mouthScaleY: 0.4,
    mouthRotX: -0.15,
    gazeX: 0.0,
    gazeY: -0.15,
    headTilt: 0.0,
    headNod: -0.06
  },
  confused: {
    name: 'Confused',
    eyeShape: 'arc',
    eyeScaleXLeft: 1.2,
    eyeScaleYLeft: 1.1,
    eyeScaleXRight: 0.75,
    eyeScaleYRight: 0.5, // One eye squinted
    eyeRotZ: 0.22,
    mouthShape: 'flat',
    mouthScaleX: 0.9,
    mouthScaleY: 0.6,
    mouthRotX: 0.1,
    gazeX: -0.15,
    gazeY: 0.1,
    headTilt: 0.14,
    headNod: 0.02
  },
  surprised: {
    name: 'Surprised',
    eyeShape: 'oval',
    eyeScaleX: 1.35,
    eyeScaleY: 1.45,
    eyeRotZ: 0.0,
    mouthShape: 'open',
    mouthScaleX: 0.9,
    mouthScaleY: 1.4,
    mouthRotX: 0.0,
    gazeX: 0.0,
    gazeY: 0.0,
    headTilt: 0.0,
    headNod: -0.08
  },
  thinking: {
    name: 'Thinking',
    eyeShape: 'oval',
    eyeScaleX: 1.1,
    eyeScaleY: 1.1,
    eyeRotZ: 0.08,
    mouthShape: 'flat',
    mouthScaleX: 0.85,
    mouthScaleY: 0.5,
    mouthRotX: 0.05,
    gazeX: 0.35, // Looking up and right
    gazeY: 0.40,
    headTilt: 0.12,
    headNod: -0.08
  },
  listening: {
    name: 'Listening',
    eyeShape: 'arc',
    eyeScaleX: 1.05,
    eyeScaleY: 1.05,
    eyeRotZ: 0.04,
    mouthShape: 'smile',
    mouthScaleX: 0.95,
    mouthScaleY: 0.7,
    mouthRotX: 0.0,
    gazeX: 0.0,
    gazeY: 0.05,
    headTilt: 0.04,
    headNod: 0.08
  },
  acknowledging: {
    name: 'Acknowledging',
    eyeShape: 'arc',
    eyeScaleX: 1.15,
    eyeScaleY: 1.15,
    eyeRotZ: 0.08,
    mouthShape: 'smile',
    mouthScaleX: 1.18,
    mouthScaleY: 0.95,
    mouthRotX: 0.12,
    gazeX: 0.0,
    gazeY: 0.0,
    headTilt: 0.0,
    headNod: 0.15
  }
};

export const EXPRESSION_PRESETS = ROBOT_EXPRESSIONS;

export class FacialController {
  constructor(facialNodes, headBone, neckBone) {
    this.nodes = facialNodes; // { leftEye, rightEye, mouth, visor, leftEar, rightEar }
    this.headBone = headBone;
    this.neckBone = neckBone;

    this.currentExpression = 'neutral';
    this.targetParams = { ...ROBOT_EXPRESSIONS.neutral };
    this.currentParams = { ...ROBOT_EXPRESSIONS.neutral };

    // Blinking cycle state (robotic electronic screen blink)
    this.isBlinking = false;
    this.blinkPhase = 0;
    this.timeUntilNextBlink = 3.0 + Math.random() * 2.5;

    // Gaze targets
    this.targetGaze = new THREE.Vector2(0, 0);
    this.currentGaze = new THREE.Vector2(0, 0);
  }

  setExpression(name) {
    // Map legacy names or aliases
    const key = name.toLowerCase();
    const resolved = ROBOT_EXPRESSIONS[key] ? key :
      key === 'affirmative' ? 'acknowledging' :
      key === 'concentrating' ? 'thinking' :
      key === 'questioning' ? 'confused' :
      'neutral';

    if (ROBOT_EXPRESSIONS[resolved]) {
      this.currentExpression = resolved;
      this.targetParams = { ...ROBOT_EXPRESSIONS[resolved] };
      if (this.targetParams.gazeX !== undefined) {
        this.setGaze(this.targetParams.gazeX, this.targetParams.gazeY);
      }
    }
  }

  triggerBlink() {
    this.isBlinking = true;
    this.blinkPhase = 0;
  }

  setGaze(x, y) {
    this.targetGaze.set(
      THREE.MathUtils.clamp(x, -0.6, 0.6),
      THREE.MathUtils.clamp(y, -0.5, 0.5)
    );
  }

  update(delta) {
    // 1. Natural Digital Blinking Cycle (Pulse/Laser Slit)
    this.timeUntilNextBlink -= delta;
    if (this.timeUntilNextBlink <= 0 && !this.isBlinking) {
      this.triggerBlink();
      this.timeUntilNextBlink = 3.0 + Math.random() * 3.5;
    }

    let blinkScaleY = 1.0;
    if (this.isBlinking) {
      this.blinkPhase += delta * 14.0; // Snappy 120ms digital blink
      if (this.blinkPhase <= Math.PI) {
        // Drop down to 0.08 scale (slit) at apex
        blinkScaleY = 1.0 - Math.sin(this.blinkPhase) * 0.92;
      } else {
        this.isBlinking = false;
        this.blinkPhase = 0;
      }
    }

    // 2. Smoothly lerp parameters towards target
    const lerpSpeed = 8.5 * delta;
    for (const key in this.targetParams) {
      if (typeof this.targetParams[key] === 'number') {
        this.currentParams[key] = THREE.MathUtils.lerp(
          this.currentParams[key] || 0,
          this.targetParams[key],
          lerpSpeed
        );
      }
    }

    // 3. Smooth Gaze lerp
    this.currentGaze.lerp(this.targetGaze, lerpSpeed * 1.2);

    // 4. Update Digital Eyes on Visor
    const gazeOffsetX = this.currentGaze.x * 0.016;
    const gazeOffsetY = this.currentGaze.y * 0.012;

    const baseEyeY = 0.018;
    const eyeSpacing = 0.048;

    const eyeScaleXL = this.targetParams.eyeScaleXLeft !== undefined ? this.currentParams.eyeScaleXLeft : this.currentParams.eyeScaleX;
    const eyeScaleXR = this.targetParams.eyeScaleXRight !== undefined ? this.currentParams.eyeScaleXRight : this.currentParams.eyeScaleX;
    const eyeScaleYL = (this.targetParams.eyeScaleYLeft !== undefined ? this.currentParams.eyeScaleYLeft : this.currentParams.eyeScaleY) * blinkScaleY;
    const eyeScaleYR = (this.targetParams.eyeScaleYRight !== undefined ? this.currentParams.eyeScaleYRight : this.currentParams.eyeScaleY) * blinkScaleY;

    if (this.nodes.leftEye) {
      this.nodes.leftEye.position.x = eyeSpacing + gazeOffsetX;
      this.nodes.leftEye.position.y = baseEyeY + gazeOffsetY;
      this.nodes.leftEye.scale.set(eyeScaleXL, eyeScaleYL, 1.0);
      this.nodes.leftEye.rotation.z = this.currentParams.eyeRotZ || 0;
    }

    if (this.nodes.rightEye) {
      this.nodes.rightEye.position.x = -eyeSpacing + gazeOffsetX;
      this.nodes.rightEye.position.y = baseEyeY + gazeOffsetY;
      this.nodes.rightEye.scale.set(eyeScaleXR, eyeScaleYR, 1.0);
      this.nodes.rightEye.rotation.z = -(this.currentParams.eyeRotZ || 0); // Symmetrical slant
    }

    // 5. Update Digital Mouth Smile on Visor
    if (this.nodes.mouth) {
      const mouthScaleX = this.currentParams.mouthScaleX || 1.0;
      const mouthScaleY = this.currentParams.mouthScaleY || 1.0;
      this.nodes.mouth.position.set(0, -0.038, 0.016);
      this.nodes.mouth.scale.set(mouthScaleX, mouthScaleY, 1.0);
      this.nodes.mouth.rotation.x = this.currentParams.mouthRotX || 0;
    }

    // 6. Head nod and tilt from expression
    if (this.headBone) {
      this.headBone.rotation.z = this.currentParams.headTilt || 0;
      this.headBone.rotation.x = this.currentParams.headNod || 0;
    }
  }
}
