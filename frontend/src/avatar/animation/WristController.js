/**
 * Signora WristController
 * Controls mechanical wrist orientation (flexion/extension, deviation, rotation)
 * for both Left and Right hands.
 */
import * as THREE from 'three';

export class WristController {
  constructor(leftWristBone, rightWristBone) {
    this.leftWrist = leftWristBone;
    this.rightWrist = rightWristBone;
    this.enabled = false;

    this.current = {
      L: { flex: 0, roll: 0, yaw: 0 },
      R: { flex: 0, roll: 0, yaw: 0 }
    };

    this.target = {
      L: { flex: 0, roll: 0, yaw: 0 },
      R: { flex: 0, roll: 0, yaw: 0 }
    };
  }

  setWrist(side, flex = 0, roll = 0, yaw = 0) {
    const s = side.toUpperCase();
    if (!this.target[s]) return;
    this.enabled = true;
    this.target[s].flex = THREE.MathUtils.clamp(flex, -1.2, 1.2);
    this.target[s].roll = THREE.MathUtils.clamp(roll, -1.8, 1.8);
    this.target[s].yaw = THREE.MathUtils.clamp(yaw, -0.6, 0.6);
  }

  reset(side) {
    if (side) {
      const s = side.toUpperCase();
      if (this.target[s]) this.target[s] = { flex: 0, roll: 0, yaw: 0 };
    } else {
      this.target.L = { flex: 0, roll: 0, yaw: 0 };
      this.target.R = { flex: 0, roll: 0, yaw: 0 };
    }
  }

  update(delta) {
    if (!this.enabled) return;

    const lerpSpeed = 12 * delta;

    ['L', 'R'].forEach(side => {
      const bone = side === 'L' ? this.leftWrist : this.rightWrist;
      if (!bone) return;

      const curr = this.current[side];
      const tgt = this.target[side];

      curr.flex = THREE.MathUtils.lerp(curr.flex, tgt.flex, lerpSpeed);
      curr.roll = THREE.MathUtils.lerp(curr.roll, tgt.roll, lerpSpeed);
      curr.yaw = THREE.MathUtils.lerp(curr.yaw, tgt.yaw, lerpSpeed);

      bone.rotation.set(curr.flex, curr.roll, curr.yaw);
    });
  }
}
