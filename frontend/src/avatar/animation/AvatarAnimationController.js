/**
 * Hastivo Avatar Animation Controller
 * Manages procedural humanoid poses, kinetic blending, smooth return-to-idle,
 * and key animations: Idle Breathing, Neutral, Walk-in, Wave, Present, Point,
 * Thumbs-up, Shrug, Thinking, Listening, Acknowledgement, and Error Reaction.
 */
import * as THREE from 'three';
import { HAND_POSTURES } from './HandController.js';

export class AvatarAnimationController {
  constructor(avatar) {
    this.avatar = avatar;
    this.bones = avatar.bones;

    this.currentAnimation = 'idleBreathing';
    this.animTime = 0;
    this.playbackSpeed = 1.0;

    // Resting transforms for all bones
    this.restRotations = {};
    for (const name in this.bones) {
      this.restRotations[name] = this.bones[name].rotation.clone();
    }

    // Target bone rotations dictionary for smooth lerping
    this.targetRotations = {};
    for (const name in this.bones) {
      this.targetRotations[name] = this.restRotations[name].clone();
    }
  }

  playAnimation(name) {
    this.currentAnimation = name;
    this.animTime = 0;
    this.isIdleSuppressed = false;

    // Release direct kinematic overrides so procedural animation can animate freely
    if (this.avatar.armController) this.avatar.armController.enabled = false;
    if (this.avatar.shoulderController) this.avatar.shoulderController.enabled = false;
    if (this.avatar.wristController) this.avatar.wristController.enabled = false;
    if (this.avatar.bodyController) this.avatar.bodyController.enabled = false;

    // Trigger complementary facial expression presets
    if (this.avatar.facialController) {
      if (name === 'wave') this.avatar.facialController.setExpression('happy');
      else if (name === 'thumbsUp') this.avatar.facialController.setExpression('happy');
      else if (name === 'thinking') this.avatar.facialController.setExpression('thinking');
      else if (name === 'shrug') this.avatar.facialController.setExpression('confused');
      else if (name === 'listening') this.avatar.facialController.setExpression('questioning');
      else if (name === 'acknowledgement') this.avatar.facialController.setExpression('affirmative');
      else if (name === 'errorReaction') this.avatar.facialController.setExpression('sad');
      else if (name === 'idleBreathing') this.avatar.facialController.setExpression('neutral');
    }
  }

  resetPose() {
    this.currentAnimation = 'idleBreathing';
    this.animTime = 0;
    this.isIdleSuppressed = false;

    if (this.avatar.armController) this.avatar.armController.enabled = false;
    if (this.avatar.shoulderController) this.avatar.shoulderController.enabled = false;
    if (this.avatar.wristController) this.avatar.wristController.enabled = false;
    if (this.avatar.bodyController) this.avatar.bodyController.enabled = false;

    for (const name in this.bones) {
      this.targetRotations[name].copy(this.restRotations[name]);
    }
    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
      this.avatar.leftHandController.wristControlEnabled = false;
    }
    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.RELAXED_REST);
      this.avatar.rightHandController.wristControlEnabled = false;
    }
    if (this.avatar.facialController) {
      this.avatar.facialController.setExpression('neutral');
    }
  }

  update(delta) {
    const dt = delta * this.playbackSpeed;
    this.animTime += dt;
    const t = this.animTime;

    // 1. Procedural Animation Drivers (Suppressed during active signing to prevent conflicts)
    if (!this.isIdleSuppressed) {
      switch (this.currentAnimation) {
        case 'idleBreathing':
          this._animateIdleBreathing(t);
          break;
        case 'neutral':
          this._animateNeutral(t);
          break;
        case 'walkIn':
          this._animateWalkIn(t);
          break;
        case 'wave':
          this._animateWave(t);
          break;
        case 'present':
          this._animatePresent(t);
          break;
        case 'point':
        case 'uploadedImageSign':
        case 'defaultSign':
          this._animatePoint(t);
          break;
        case 'thumbsUp':
          this._animateThumbsUp(t);
          break;
        case 'shrug':
          this._animateShrug(t);
          break;
        case 'thinking':
          this._animateThinking(t);
          break;
        case 'listening':
          this._animateListening(t);
          break;
        case 'acknowledgement':
          this._animateAcknowledgement(t);
          break;
        case 'errorReaction':
          this._animateErrorReaction(t);
          break;
        default:
          this._animateIdleBreathing(t);
      }
    }

    // 2. Smoothly lerp bone rotations toward calculated targets
    const lerpRate = Math.min(1.0, 10.0 * dt);
    for (const name in this.bones) {
      // During active signing, SigningEngine directly drives the arms, elbows, forearms, and wrists
      if (this.isIdleSuppressed && (name.includes('UpperArm') || name.includes('Elbow') || name.includes('Forearm') || name.includes('Wrist'))) {
        continue;
      }
      const bone = this.bones[name];
      const target = this.targetRotations[name];
      if (bone && target) {
        bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, target.x, lerpRate);
        bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, target.y, lerpRate);
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, target.z, lerpRate);
      }
    }
  }

  // --- Animation Implementations ---

  _animateIdleBreathing(t) {
    const breath = Math.sin(t * 1.8);
    const microSway = Math.sin(t * 0.9) * 0.015;

    // Subtle spine breathing expansion
    this.targetRotations['Spine'].x = this.restRotations['Spine'].x + breath * 0.02;
    this.targetRotations['Chest'].x = this.restRotations['Chest'].x - breath * 0.015;
    this.targetRotations['Chest'].y = microSway;

    // Gentle head compensation
    this.targetRotations['Head'].x = this.restRotations['Head'].x - breath * 0.012;
    this.targetRotations['Head'].y = -microSway * 0.8;

    // Natural resting posture micro-drift without arm flaring
    this.targetRotations['LeftUpperArm'].x = this.restRotations['LeftUpperArm'].x + breath * 0.005;
    this.targetRotations['RightUpperArm'].x = this.restRotations['RightUpperArm'].x + breath * 0.005;
    this.targetRotations['LeftElbow'].z = this.restRotations['LeftElbow'].z + breath * 0.004;
    this.targetRotations['RightElbow'].z = this.restRotations['RightElbow'].z - breath * 0.004;

    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
  }

  _animateNeutral() {
    for (const name in this.bones) {
      this.targetRotations[name].copy(this.restRotations[name]);
    }
  }

  _animateWalkIn(t) {
    const progress = Math.min(1.0, t / 1.6);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    // Rotate root gently as if coming onto stage
    this.bones['Root'].position.z = THREE.MathUtils.lerp(-0.8, 0.0, ease);
    this.targetRotations['Root'].y = THREE.MathUtils.lerp(0.3, 0.0, ease);

    // Subtle step sway
    const step = Math.sin(t * 6.0) * (1 - ease);
    this.targetRotations['Pelvis'].z = step * 0.05;
    this.targetRotations['LeftUpperArm'].x = this.restRotations['LeftUpperArm'].x - step * 0.15;
    this.targetRotations['RightUpperArm'].x = this.restRotations['RightUpperArm'].x + step * 0.15;

    if (progress >= 1.0) {
      this._animateIdleBreathing(t);
    }
  }

  _animateWave(t) {
    const raiseDuration = 0.8;
    const presentDuration = 0.6; // 0.8s - 1.4s

    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.wristControlEnabled = false;
      this.avatar.rightHandController.setHelloPose();
    }

    // Left arm maintains natural attention resting pose
    this.targetRotations['LeftUpperArm'].copy(this.restRotations['LeftUpperArm']);
    this.targetRotations['LeftElbow'].copy(this.restRotations['LeftElbow']);
    if (this.restRotations['LeftWrist']) {
      this.targetRotations['LeftWrist'].copy(this.restRotations['LeftWrist']);
    }

    // Right arm base rest transforms
    const restUpper = this.restRotations['RightUpperArm'];
    const restElbow = this.restRotations['RightElbow'];
    const restWrist = this.restRotations['RightWrist'];

    // Target greeting transforms:
    // Analytically calibrated so fingers point UP (+Y_world) and palm faces directly FORWARD (+Z_world)
    const greetUpper = { x: 0.20, y: 0.0, z: -0.40 };
    const greetElbowZ = -1.50; // elbow flexion along local Z axis
    const greetWrist = { x: 1.585, y: 0.337, z: -2.650 };

    if (t < raiseDuration) {
      // PHASE 1 — Raise: Smoothly elevate arm into greeting position
      const p = THREE.MathUtils.smoothstep(t, 0, raiseDuration);
      this.targetRotations['RightUpperArm'].set(
        THREE.MathUtils.lerp(restUpper.x, greetUpper.x, p),
        THREE.MathUtils.lerp(restUpper.y, greetUpper.y, p),
        THREE.MathUtils.lerp(restUpper.z, greetUpper.z, p)
      );
      this.targetRotations['RightElbow'].set(
        0,
        0,
        THREE.MathUtils.lerp(restElbow.z, greetElbowZ, p)
      );
      this.targetRotations['RightWrist'].set(
        THREE.MathUtils.lerp(restWrist.x, greetWrist.x, p),
        THREE.MathUtils.lerp(restWrist.y, greetWrist.y, p),
        THREE.MathUtils.lerp(restWrist.z, greetWrist.z, p)
      );
    } else if (t < raiseDuration + presentDuration) {
      // PHASE 2 — Present: Hold palm facing camera with distinct separated fingers and friendly nod
      this.targetRotations['RightUpperArm'].set(greetUpper.x, greetUpper.y, greetUpper.z);
      this.targetRotations['RightElbow'].set(0, 0, greetElbowZ);
      this.targetRotations['RightWrist'].set(greetWrist.x, greetWrist.y, greetWrist.z);

      const nodProgress = (t - raiseDuration) / presentDuration;
      this.targetRotations['Head'].x = this.restRotations['Head'].x + Math.sin(nodProgress * Math.PI) * 0.08;
    } else {
      // PHASE 3 — Wave: Gentle side-to-side oscillation around viewing axis (+Z) at the wrist without twisting palm
      const waveT = t - (raiseDuration + presentDuration);
      const waveCycle = Math.sin(waveT * 5.0) * 0.18;

      this.targetRotations['RightUpperArm'].set(
        greetUpper.x,
        greetUpper.y,
        greetUpper.z + waveCycle * 0.03
      );
      this.targetRotations['RightElbow'].set(0, 0, greetElbowZ);
      this.targetRotations['RightWrist'].set(
        greetWrist.x,
        greetWrist.y + waveCycle * 0.1,
        greetWrist.z + waveCycle
      );

      // Subtle friendly head tilt accompanying wave
      this.targetRotations['Head'].z = this.restRotations['Head'].z + waveCycle * 0.04;
    }
  }

  _animatePresent(t) {
    const breathe = Math.sin(t * 1.5) * 0.02;
    // Both arms open gracefully forward with forearms bent
    this.targetRotations['LeftUpperArm'].set(0.65 + breathe, -0.15, 0.35);
    this.targetRotations['LeftElbow'].set(0, 0, 1.15);

    this.targetRotations['RightUpperArm'].set(0.65 + breathe, 0.15, -0.35);
    this.targetRotations['RightElbow'].set(0, 0, -1.15);

    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.OPEN_PALM);
    }
    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.OPEN_PALM);
    }
  }

  _animatePoint(t) {
    const subtleSway = Math.sin(t * 2.0) * 0.015;
    // Right arm elevated into signing workspace
    this.targetRotations['RightUpperArm'].set(0.40 + subtleSway, 0.0, -0.50);
    this.targetRotations['RightElbow'].set(0, 0, -1.40);
    this.targetRotations['RightWrist'].set(1.583, 0.340, -2.449);

    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.wristControlEnabled = false;
      this.avatar.rightHandController.setPosture(HAND_POSTURES.IMAGE_POINT_SIGN);
    }

    // Left arm resting comfortably in neutral attention posture
    this.targetRotations['LeftUpperArm'].copy(this.restRotations['LeftUpperArm']);
    this.targetRotations['LeftElbow'].copy(this.restRotations['LeftElbow']);
    if (this.restRotations['LeftWrist']) {
      this.targetRotations['LeftWrist'].copy(this.restRotations['LeftWrist']);
    }
    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
  }

  _animateUploadedImageSign(t) {
    this._animatePoint(t);
  }

  _animateThumbsUp(t) {
    // Right arm bends forward, wrist oriented upright
    this.targetRotations['RightUpperArm'].set(0.45, 0.0, -0.40);
    this.targetRotations['RightElbow'].set(0, 0, -1.35);
    this.targetRotations['RightWrist'].set(1.58, 0.34, -2.50);

    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.THUMBS_UP);
    }

    // Affirmative head nod
    const nod = Math.sin(t * 3.5) * 0.08;
    this.targetRotations['Head'].x = this.restRotations['Head'].x + nod;
  }

  _animateShrug(t) {
    const pulse = Math.min(1.0, Math.sin(Math.min(Math.PI, t * 1.5)));

    // Forearms bent forward with open palms
    this.targetRotations['LeftUpperArm'].set(
      THREE.MathUtils.lerp(this.restRotations['LeftUpperArm'].x, 0.65, pulse),
      0,
      THREE.MathUtils.lerp(this.restRotations['LeftUpperArm'].z, 0.35, pulse)
    );
    this.targetRotations['LeftElbow'].set(0, 0, pulse * 1.10);

    this.targetRotations['RightUpperArm'].set(
      THREE.MathUtils.lerp(this.restRotations['RightUpperArm'].x, 0.65, pulse),
      0,
      THREE.MathUtils.lerp(this.restRotations['RightUpperArm'].z, -0.35, pulse)
    );
    this.targetRotations['RightElbow'].set(0, 0, -pulse * 1.10);

    this.targetRotations['Head'].z = 0.12 * pulse; // Inquisitive head tilt

    if (this.avatar.leftHandController) {
      this.avatar.leftHandController.setPosture(HAND_POSTURES.CUPPED);
    }
    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.CUPPED);
    }
  }

  _animateThinking(t) {
    const contemplationCycle = Math.sin(t * 1.2) * 0.02;
    // Right hand up to chin
    this.targetRotations['RightUpperArm'].set(0.35, 0.0, -0.65);
    this.targetRotations['RightElbow'].set(0, 0, -1.95);
    this.targetRotations['RightWrist'].set(1.20, 0.20, -2.20);

    this.targetRotations['Head'].z = 0.14 + contemplationCycle;
    this.targetRotations['Head'].y = -0.1;

    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.POINT_INDEX);
    }
  }

  _animateListening(t) {
    // Attentive forward lean
    this.targetRotations['Spine'].x = 0.08;
    this.targetRotations['Head'].x = -0.06;
    this.targetRotations['Head'].y = 0.12;

    this._animateIdleBreathing(t);
  }

  _animateAcknowledgement(t) {
    // Respectful nod
    const cycle = Math.sin(t * 3.0);
    this.targetRotations['Spine'].x = 0.05 + Math.max(0, cycle) * 0.08;
    this.targetRotations['Head'].x = 0.04 + Math.max(0, cycle) * 0.12;

    this._animateIdleBreathing(t);
  }

  _animateErrorReaction(t) {
    const shake = Math.sin(t * 7.0) * 0.12;
    this.targetRotations['Head'].y = shake; // Head shake "no / error"
    this.targetRotations['Head'].x = -0.05;

    this.targetRotations['RightUpperArm'].set(0.50, 0, -0.30);
    this.targetRotations['RightElbow'].set(0, 0, -0.8);

    if (this.avatar.rightHandController) {
      this.avatar.rightHandController.setPosture(HAND_POSTURES.OPEN_PALM);
    }
  }
}
