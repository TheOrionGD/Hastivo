/**
 * Signora ShoulderController
 * Manages left and right robotic shoulder articulation: clavicle elevation/depression,
 * forward protraction, and scapular rotation for natural signing space reach.
 */
import * as THREE from 'three';

export class ShoulderController {
  constructor(leftShoulderBone, rightShoulderBone) {
    this.leftShoulder = leftShoulderBone;
    this.rightShoulder = rightShoulderBone;
    this.enabled = false;

    this.current = {
      left: { elevation: 0, roll: 0, protraction: 0 },
      right: { elevation: 0, roll: 0, protraction: 0 }
    };

    this.target = {
      left: { elevation: 0, roll: 0, protraction: 0 },
      right: { elevation: 0, roll: 0, protraction: 0 }
    };
  }

  setShoulder(side, elevation = 0, protraction = 0, roll = 0) {
    const key = side === 'L' ? 'left' : 'right';
    this.enabled = true;
    this.target[key].elevation = THREE.MathUtils.clamp(elevation, -0.3, 0.45);
    this.target[key].protraction = THREE.MathUtils.clamp(protraction, -0.35, 0.45);
    this.target[key].roll = THREE.MathUtils.clamp(roll, -0.3, 0.3);
  }

  reset() {
    this.target.left = { elevation: 0, roll: 0, protraction: 0 };
    this.target.right = { elevation: 0, roll: 0, protraction: 0 };
  }

  update(delta) {
    if (!this.enabled) return;

    const lerpSpeed = 9 * delta;

    ['left', 'right'].forEach(sideKey => {
      const isLeft = sideKey === 'left';
      const sideSign = isLeft ? 1 : -1;
      const bone = isLeft ? this.leftShoulder : this.rightShoulder;
      if (!bone) return;

      const curr = this.current[sideKey];
      const tgt = this.target[sideKey];

      curr.elevation = THREE.MathUtils.lerp(curr.elevation, tgt.elevation, lerpSpeed);
      curr.protraction = THREE.MathUtils.lerp(curr.protraction, tgt.protraction, lerpSpeed);
      curr.roll = THREE.MathUtils.lerp(curr.roll, tgt.roll, lerpSpeed);

      bone.rotation.z = sideSign * curr.elevation;
      bone.rotation.y = sideSign * curr.protraction;
      bone.rotation.x = curr.roll;
    });
  }
}
