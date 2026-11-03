/**
 * Signora HeadController
 * Controls robotic head rotation, pitch tilt, roll tilt, nodding,
 * listening gestures, and smooth return to neutral posture.
 */
import * as THREE from 'three';

export class HeadController {
  constructor(headBone, neckBone) {
    this.headBone = headBone;
    this.neckBone = neckBone;

    this.current = {
      yaw: 0,    // Left/Right rotation (Y axis)
      pitch: 0,  // Up/Down tilt (X axis)
      roll: 0    // Side cocking/listening tilt (Z axis)
    };

    this.target = {
      yaw: 0,
      pitch: 0,
      roll: 0
    };

    // Nodding state
    this.isNodding = false;
    this.nodTime = 0;
    this.nodDuration = 0.8;
    this.nodCycles = 1;
  }

  setOrientation(yaw = 0, pitch = 0, roll = 0) {
    this.target.yaw = THREE.MathUtils.clamp(yaw, -0.65, 0.65);
    this.target.pitch = THREE.MathUtils.clamp(pitch, -0.4, 0.4);
    this.target.roll = THREE.MathUtils.clamp(roll, -0.35, 0.35);
  }

  nod(cycles = 1, duration = 0.8) {
    this.isNodding = true;
    this.nodTime = 0;
    this.nodCycles = cycles;
    this.nodDuration = duration;
  }

  listenTilt() {
    this.setOrientation(0.08, -0.05, 0.16);
  }

  thinkingTilt() {
    this.setOrientation(0.15, -0.12, 0.14);
  }

  reset() {
    this.target.yaw = 0;
    this.target.pitch = 0;
    this.target.roll = 0;
    this.isNodding = false;
  }

  update(delta) {
    const lerpSpeed = 7 * delta;

    this.current.yaw = THREE.MathUtils.lerp(this.current.yaw, this.target.yaw, lerpSpeed);
    this.current.pitch = THREE.MathUtils.lerp(this.current.pitch, this.target.pitch, lerpSpeed);
    this.current.roll = THREE.MathUtils.lerp(this.current.roll, this.target.roll, lerpSpeed);

    let nodOffset = 0;
    if (this.isNodding) {
      this.nodTime += delta;
      const progress = this.nodTime / this.nodDuration;
      if (progress >= 1.0) {
        this.isNodding = false;
      } else {
        nodOffset = Math.sin(progress * Math.PI * 2 * this.nodCycles) * 0.14;
      }
    }

    // Split orientation smoothly between neck (35%) and head (65%)
    if (this.neckBone) {
      this.neckBone.rotation.y = this.current.yaw * 0.35;
      this.neckBone.rotation.x = (this.current.pitch + nodOffset) * 0.35;
      this.neckBone.rotation.z = this.current.roll * 0.35;
    }

    if (this.headBone) {
      this.headBone.rotation.y = this.current.yaw * 0.65;
      this.headBone.rotation.x = (this.current.pitch + nodOffset) * 0.65;
      this.headBone.rotation.z = this.current.roll * 0.65;
    }
  }
}
