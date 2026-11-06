/**
 * Hastivo ArmController
 * Controls upper arm orientation, elbow flexion/extension, and forearm rotation
 * for both Left and Right robotic arms.
 * Enabled on-demand when direct manual kinematics are commanded.
 */
import * as THREE from 'three';

export class ArmController {
  constructor(armBones = {}) {
    this.bones = armBones;
    this.enabled = false;

    this.current = {
      L: { upperX: 1.35, upperY: -0.05, upperZ: 0.15, elbowBend: 0.08, forearmRoll: 0 },
      R: { upperX: 1.35, upperY: 0.05, upperZ: -0.15, elbowBend: -0.08, forearmRoll: 0 }
    };

    this.target = {
      L: { upperX: 1.35, upperY: -0.05, upperZ: 0.15, elbowBend: 0.08, forearmRoll: 0 },
      R: { upperX: 1.35, upperY: 0.05, upperZ: -0.15, elbowBend: -0.08, forearmRoll: 0 }
    };
  }

  setArmPose(side, { upperX = 1.35, upperY = 0, upperZ = 0, elbowBend = 0, forearmRoll = 0 } = {}) {
    const s = side.toUpperCase();
    if (!this.target[s]) return;

    this.enabled = true;
    this.target[s].upperX = upperX;
    this.target[s].upperY = upperY;
    this.target[s].upperZ = upperZ;
    this.target[s].elbowBend = THREE.MathUtils.clamp(elbowBend, -2.4, 2.4);
    this.target[s].forearmRoll = forearmRoll;
  }

  resetArm(side) {
    const s = side.toUpperCase();
    const sign = s === 'L' ? 1 : -1;
    this.setArmPose(s, {
      upperX: 1.35,
      upperY: sign * -0.05,
      upperZ: sign * 0.15,
      elbowBend: sign * 0.08,
      forearmRoll: 0
    });
  }

  update(delta) {
    if (!this.enabled) return;

    const lerpSpeed = 10 * delta;

    ['L', 'R'].forEach(side => {
      const isLeft = side === 'L';
      const sidePrefix = isLeft ? 'Left' : 'Right';
      const curr = this.current[side];
      const tgt = this.target[side];

      curr.upperX = THREE.MathUtils.lerp(curr.upperX, tgt.upperX, lerpSpeed);
      curr.upperY = THREE.MathUtils.lerp(curr.upperY, tgt.upperY, lerpSpeed);
      curr.upperZ = THREE.MathUtils.lerp(curr.upperZ, tgt.upperZ, lerpSpeed);
      curr.elbowBend = THREE.MathUtils.lerp(curr.elbowBend, tgt.elbowBend, lerpSpeed);
      curr.forearmRoll = THREE.MathUtils.lerp(curr.forearmRoll, tgt.forearmRoll, lerpSpeed);

      const upperArm = this.bones[`${sidePrefix}UpperArm`];
      if (upperArm) {
        upperArm.rotation.set(curr.upperX, curr.upperY, curr.upperZ);
      }

      const elbow = this.bones[`${sidePrefix}Elbow`];
      if (elbow) {
        // In Mixamo humanoid rig, elbow flexion hinges on local Z axis
        elbow.rotation.z = curr.elbowBend;
        elbow.rotation.y = curr.forearmRoll;
      }
    });
  }
}
