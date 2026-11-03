/**
 * Hastivo EyeController
 * Handles digital eye shape, size, independent left/right gaze, and digital blinking pulses.
 * Electric blue illumination (#6FA3EF) on black visor screen.
 */
import * as THREE from 'three';

export class EyeController {
  constructor(leftEyeMesh, rightEyeMesh, visorMesh) {
    this.leftEye = leftEyeMesh;
    this.rightEye = rightEyeMesh;
    this.visor = visorMesh;

    // Current & Target state
    this.current = {
      gazeX: 0,
      gazeY: 0,
      scaleXLeft: 1.0,
      scaleYLeft: 1.0,
      scaleXRight: 1.0,
      scaleYRight: 1.0,
      rotZLeft: 0,
      rotZRight: 0,
      blinkProgress: 0, // 0 = open, 1 = slit
      glowIntensity: 1.0
    };

    this.target = {
      gazeX: 0,
      gazeY: 0,
      scaleXLeft: 1.0,
      scaleYLeft: 1.0,
      scaleXRight: 1.0,
      scaleYRight: 1.0,
      rotZLeft: 0,
      rotZRight: 0,
      glowIntensity: 1.0
    };

    // Autonomous digital blinking
    this.blinkTimer = 0;
    this.nextBlinkInterval = 3.5 + Math.random() * 2.0;
    this.isBlinking = false;
    this.blinkPhase = 0; // 0 to 1
  }

  setGaze(x, y) {
    this.target.gazeX = THREE.MathUtils.clamp(x, -0.8, 0.8);
    this.target.gazeY = THREE.MathUtils.clamp(y, -0.6, 0.6);
  }

  setEyeScales(leftX, leftY, rightX, rightY, rotZ = 0) {
    this.target.scaleXLeft = leftX;
    this.target.scaleYLeft = leftY;
    this.target.scaleXRight = rightX;
    this.target.scaleYRight = rightY;
    this.target.rotZLeft = rotZ;
    this.target.rotZRight = -rotZ;
  }

  setGlowIntensity(intensity) {
    this.target.glowIntensity = THREE.MathUtils.clamp(intensity, 0.2, 2.0);
  }

  triggerBlink() {
    this.isBlinking = true;
    this.blinkPhase = 0;
  }

  update(delta) {
    const lerpSpeed = 12 * delta;

    // Smooth state interpolation
    this.current.gazeX = THREE.MathUtils.lerp(this.current.gazeX, this.target.gazeX, lerpSpeed);
    this.current.gazeY = THREE.MathUtils.lerp(this.current.gazeY, this.target.gazeY, lerpSpeed);
    this.current.scaleXLeft = THREE.MathUtils.lerp(this.current.scaleXLeft, this.target.scaleXLeft, lerpSpeed);
    this.current.scaleYLeft = THREE.MathUtils.lerp(this.current.scaleYLeft, this.target.scaleYLeft, lerpSpeed);
    this.current.scaleXRight = THREE.MathUtils.lerp(this.current.scaleXRight, this.target.scaleXRight, lerpSpeed);
    this.current.scaleYRight = THREE.MathUtils.lerp(this.current.scaleYRight, this.target.scaleYRight, lerpSpeed);
    this.current.rotZLeft = THREE.MathUtils.lerp(this.current.rotZLeft, this.target.rotZLeft, lerpSpeed);
    this.current.rotZRight = THREE.MathUtils.lerp(this.current.rotZRight, this.target.rotZRight, lerpSpeed);
    this.current.glowIntensity = THREE.MathUtils.lerp(this.current.glowIntensity, this.target.glowIntensity, lerpSpeed);

    // Autonomous blink timer
    this.blinkTimer += delta;
    if (this.blinkTimer >= this.nextBlinkInterval && !this.isBlinking) {
      this.triggerBlink();
      this.blinkTimer = 0;
      this.nextBlinkInterval = 3.0 + Math.random() * 3.5;
    }

    if (this.isBlinking) {
      this.blinkPhase += delta * 7.5; // Fast robotic eyelid pulse (~130ms)
      if (this.blinkPhase >= Math.PI) {
        this.isBlinking = false;
        this.current.blinkProgress = 0;
      } else {
        this.current.blinkProgress = Math.sin(this.blinkPhase);
      }
    }

    // Apply to Three.js meshes
    const blinkScaleY = 1.0 - this.current.blinkProgress * 0.92; // Flattens to digital slit
    const gazeOffsetX = this.current.gazeX * 0.024;
    const gazeOffsetY = this.current.gazeY * 0.018;

    if (this.leftEye) {
      this.leftEye.position.x = 0.048 + gazeOffsetX;
      this.leftEye.position.y = 0.018 + gazeOffsetY;
      this.leftEye.position.z = 0.004;
      this.leftEye.scale.set(
        this.current.scaleXLeft,
        this.current.scaleYLeft * blinkScaleY,
        1.0
      );
      this.leftEye.rotation.z = this.current.rotZLeft;
    }

    if (this.rightEye) {
      this.rightEye.position.x = -0.048 + gazeOffsetX;
      this.rightEye.position.y = 0.018 + gazeOffsetY;
      this.rightEye.position.z = 0.004;
      this.rightEye.scale.set(
        this.current.scaleXRight,
        this.current.scaleYRight * blinkScaleY,
        1.0
      );
      this.rightEye.rotation.z = this.current.rotZRight;
    }
  }
}
