/**
 * Hastivo BodyController
 * Controls spine, pelvis, and chest bones. Handles subtle mechanical idle breathing,
 * torso rotation during signing, and ergonomic posture balancing.
 */
import * as THREE from 'three';

export class BodyController {
  constructor(rootBone, pelvisBone, spineBone, chestBone) {
    this.rootBone = rootBone;
    this.pelvisBone = pelvisBone;
    this.spineBone = spineBone;
    this.chestBone = chestBone;
    this.enabled = false;

    this.current = {
      spineRotY: 0,
      spineRotX: 0,
      chestRotY: 0,
      chestRotX: 0,
      breathCycle: 0
    };

    this.target = {
      spineRotY: 0,
      spineRotX: 0,
      chestRotY: 0,
      chestRotX: 0
    };

    this.idleBreathingEnabled = false;
    this.breathTime = 0;
  }

  setTorsoRotation(yaw = 0, pitch = 0) {
    this.enabled = true;
    this.target.spineRotY = THREE.MathUtils.clamp(yaw * 0.4, -0.3, 0.3);
    this.target.chestRotY = THREE.MathUtils.clamp(yaw * 0.6, -0.4, 0.4);
    this.target.spineRotX = THREE.MathUtils.clamp(pitch * 0.5, -0.2, 0.2);
    this.target.chestRotX = THREE.MathUtils.clamp(pitch * 0.5, -0.2, 0.2);
  }

  reset() {
    this.target.spineRotY = 0;
    this.target.spineRotX = 0;
    this.target.chestRotY = 0;
    this.target.chestRotX = 0;
  }

  update(delta) {
    if (!this.enabled) return;

    const lerpSpeed = 5 * delta;
    this.current.spineRotY = THREE.MathUtils.lerp(this.current.spineRotY, this.target.spineRotY, lerpSpeed);
    this.current.chestRotY = THREE.MathUtils.lerp(this.current.chestRotY, this.target.chestRotY, lerpSpeed);
    this.current.spineRotX = THREE.MathUtils.lerp(this.current.spineRotX, this.target.spineRotX, lerpSpeed);
    this.current.chestRotX = THREE.MathUtils.lerp(this.current.chestRotX, this.target.chestRotX, lerpSpeed);

    if (this.spineBone) {
      this.spineBone.rotation.y = this.current.spineRotY;
      this.spineBone.rotation.x = this.current.spineRotX;
    }

    if (this.chestBone) {
      this.chestBone.rotation.y = this.current.chestRotY;
      this.chestBone.rotation.x = this.current.chestRotX;
    }
  }
}
