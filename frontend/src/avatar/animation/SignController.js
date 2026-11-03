/**
 * Hastivo SignController
 * High-level sign language playback controller.
 * Responsibilities:
 * - Priority management: signing gestures override and suppress idle breathing/sway
 * - Sequential sign queue processing with smooth interpolation
 * - Dynamic ISL sign, fingerspelling (A–Z), and number (0–9) playback
 * - Automatic neutral-pose recovery upon sequence completion
 */
import { SigningEngine, ISL_DICTIONARY } from './SigningEngine.js';

export class SignController {
  constructor(avatar, animationController) {
    this.avatar = avatar;
    this.animationController = animationController;
    this.engine = new SigningEngine(avatar, animationController);

    // Callbacks
    this.onSignStart = null;
    this.onSignProgress = null;
    this.onSignComplete = null;

    this.engine.onSignProgress = (info) => {
      if (this.onSignProgress) {
        this.onSignProgress(info);
      }
      if (info.finished && this.onSignComplete) {
        this.onSignComplete(info);
      }
    };
  }

  get isSigning() {
    return this.engine.isPlaying;
  }

  playSign(signId) {
    // Priority: Suppress idle animations
    if (this.animationController) {
      this.animationController.isIdleSuppressed = true;
    }
    return this.engine.playSign(signId);
  }

  playSequence(signIds) {
    if (this.animationController) {
      this.animationController.isIdleSuppressed = true;
    }
    return this.engine.playSequence(signIds);
  }

  playFingerspelling(text, speed = 1.0) {
    if (this.animationController) {
      this.animationController.isIdleSuppressed = true;
    }
    return this.engine.playFingerspelling(text, speed);
  }

  playNumber(num) {
    if (this.animationController) {
      this.animationController.isIdleSuppressed = true;
    }
    return this.engine.playNumber(num);
  }

  stop() {
    this.engine.stop();
    if (this.animationController) {
      this.animationController.isIdleSuppressed = false;
      this.animationController.resetPose();
    }
  }

  hasSign(signId) {
    if (!signId) return false;
    return Boolean(ISL_DICTIONARY[String(signId).toUpperCase()]);
  }

  getAvailableSigns() {
    return Object.keys(ISL_DICTIONARY);
  }

  update(delta) {
    if (this.engine.isPlaying) {
      this.engine.update(delta);
    } else if (this.animationController && this.animationController.isIdleSuppressed) {
      // Re-enable idle once signing is finished and returned to rest
      this.animationController.isIdleSuppressed = false;
    }
  }
}
