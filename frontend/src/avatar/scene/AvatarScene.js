/**
 * Hastivo Avatar Three.js Scene & Lighting Architecture
 * Features:
 * - 4-Point Studio Lighting (Key, Fill, Rim, Ambient)
 * - Multi-mode Camera System:
 *   1. Conversation View (waist-up signing space, generous margins)
 *   2. Full-Body Inspection View
 *   3. Head Close-Up
 *   4. Left Hand Close-Up
 *   5. Right Hand Close-Up
 *   6. Front Skeleton Inspection
 * - Smooth camera position & target interpolation
 * - Theme-reactive backdrops (Dark Charcoal / Light Studio Grey)
 * - Performance-optimized rendering loop with automatic pausing when inactive
 * - Full memory disposal
 */
import * as THREE from 'three';
import { HastivoAvatar } from '../core/HastivoAvatar.js';
import { MixamoBotAvatar } from '../core/MixamoBotAvatar.js';
import { AvatarAnimationController } from '../animation/AvatarAnimationController.js';
import { SigningEngine } from '../animation/SigningEngine.js';
import { SignController } from '../animation/SignController.js';

export const CAMERA_MODES = {
  splash: {
    pos: [0, 1.08, 1.95],
    target: [0, 1.02, 0],
    fov: 42,
    name: 'Splash Showcase'
  },
  conversation: {
    pos: [0, 1.42, 2.30],
    target: [0, 1.35, 0],
    fov: 36,
    name: 'Conversation View'
  },
  fullBody: {
    pos: [0, 1.15, 3.40],
    target: [0, 0.95, 0],
    fov: 42,
    name: 'Full-Body Inspection'
  },
  headCloseup: {
    pos: [0, 1.68, 0.85],
    target: [0, 1.68, 0],
    fov: 28,
    name: 'Head Close-Up'
  },
  leftHand: {
    pos: [0.34, 0.88, 0.60],
    target: [0.30, 0.84, 0.0],
    fov: 28,
    name: 'Left Hand Detail'
  },
  rightHand: {
    pos: [-0.34, 0.88, 0.60],
    target: [-0.30, 0.84, 0.0],
    fov: 28,
    name: 'Right Hand Detail'
  },
  frontSkeleton: {
    pos: [0, 1.35, 2.15],
    target: [0, 1.25, 0],
    fov: 34,
    name: 'Front Skeleton Inspection'
  }
};

export class AvatarScene {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;

    this.width = canvas.clientWidth || 640;
    this.height = canvas.clientHeight || 480;
    this.aspect = this.width / this.height;

    this.isDisposed = false;
    this.isRendering = false;
    this.startTime = performance.now();
    this.lastTime = performance.now();

    // Stats tracking
    this.fps = 60;
    this.drawCalls = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;

    // Camera modes
    this.cameraMode = 'conversation';
    this.cameraTargetPos = new THREE.Vector3(0, 1.42, 2.30);
    this.cameraLookTarget = new THREE.Vector3(0, 1.35, 0);
    this.currentLookTarget = new THREE.Vector3(0, 1.35, 0);
    this.targetFov = 36;

    // Avatar model configuration: 'x-bot' (Female), 'y-bot' (Male), or 'procedural'
    this.currentModelType = options.avatarModel || options.model || 'x-bot';
    this.wireframe = options.wireframe || false;
    this.coatingColor = options.coatingColor || null;
    this.coatingOptions = options.coatingOptions || {};
    this.onSignProgress = options.onSignProgress || null;
    this.isModelLoading = false;

    this._initScene();
    this._initCamera();
    this._initRenderer();
    this._initLighting();
    this._initEnvironment();
    this._initAvatar();

    this._startLoop();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    if (!this.options.transparent) {
      this.scene.background = new THREE.Color(0x000000); // Fixed black backdrop
      this.scene.fog = new THREE.FogExp2(0x000000, 0.18);
    }
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(36, this.aspect, 0.1, 50);
    this.camera.position.set(0, 1.42, 2.30);
    this.camera.lookAt(0, 1.35, 0);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    if (this.options.transparent) {
      this.renderer.setClearColor(0x000000, 0);
    }
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
  }

  _initLighting() {
    // 1. Ambient Illumination
    this.ambientLight = new THREE.AmbientLight(0xE5EDF5, 0.95);
    this.scene.add(this.ambientLight);

    // 2. Key Light (Top-Right Front)
    this.keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.55);
    this.keyLight.position.set(1.8, 3.2, 2.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 10;
    this.keyLight.shadow.camera.left = -1.5;
    this.keyLight.shadow.camera.right = 1.5;
    this.keyLight.shadow.camera.top = 2.4;
    this.keyLight.shadow.camera.bottom = 0.2;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // 3. Fill Light (Left)
    this.fillLight = new THREE.DirectionalLight(0x6FA3EF, 0.85);
    this.fillLight.position.set(-2.2, 2.0, 1.8);
    this.scene.add(this.fillLight);

    // 4. Rim Light (Back-Top)
    this.rimLight = new THREE.DirectionalLight(0xFF8A7D, 1.30);
    this.rimLight.position.set(0.0, 2.8, -2.2);
    this.scene.add(this.rimLight);
  }

  _initEnvironment() {
    if (this.options.hideStage) {
      return;
    }
    const stageGeom = new THREE.CylinderGeometry(1.4, 1.5, 0.04, 36);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x1A1E24,
      roughness: 0.8,
      metalness: 0.2
    });
    this.stage = new THREE.Mesh(stageGeom, stageMat);
    this.stage.position.set(0, -0.02, 0);
    this.stage.receiveShadow = true;
    this.scene.add(this.stage);

    // Subtle luminous stage perimeter ring (Hastivo Blue)
    const ringGeom = new THREE.RingGeometry(1.36, 1.39, 48);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6FA3EF,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.set(0, 0.001, 0);
    this.scene.add(ringMesh);
  }

  _initAvatar() {
    this.switchAvatar(this.currentModelType);
  }

  async switchAvatar(modelType = 'x-bot') {
    if (this.avatar && this.currentModelType === modelType && this.avatar.isLoaded !== false) {
      return this.avatar;
    }

    this.currentModelType = modelType;
    this.isModelLoading = true;

    // Preserve active progress callbacks & playback speed
    const prevProgress = this.signingEngine?.onSignProgress;
    const prevSpeed = this.signingEngine?.playbackSpeed || 1.0;

    // Cleanly remove previous avatar
    if (this.avatar) {
      if (this.signingEngine) this.signingEngine.stop();
      if (this.avatar.root?.parent) {
        this.scene.remove(this.avatar.root);
      }
      this.avatar.dispose?.();
      this.avatar = null;
    }

    try {
      if (modelType === 'x-bot' || modelType === 'y-bot') {
        const mixamoAvatar = new MixamoBotAvatar(modelType, {
          wireframe: this.wireframe,
          coatingColor: this.coatingColor,
          ...this.coatingOptions
        });
        this.avatar = mixamoAvatar;
        this.scene.add(mixamoAvatar.root);
        await mixamoAvatar.loadPromise;
      } else {
        // Procedural robot fallback
        this.avatar = new HastivoAvatar({ wireframe: this.wireframe });
        this.scene.add(this.avatar.root);
        if (this.coatingColor && this.avatar.setOuterLayerCoating) {
          this.avatar.setOuterLayerCoating(this.coatingColor, this.coatingOptions);
        }
      }

      // Reconnect controllers
      this.animationController = new AvatarAnimationController(this.avatar);
      this.signingEngine = new SigningEngine(this.avatar, this.animationController);
      this.signController = new SignController(this.avatar, this.animationController);

      if (prevProgress || this.onSignProgress) {
        this.signingEngine.onSignProgress = prevProgress || this.onSignProgress;
      }
      this.signingEngine.playbackSpeed = prevSpeed;
      this.animationController.playbackSpeed = prevSpeed;

      // Start with friendly idle breathing
      this.animationController.playAnimation('idleBreathing');

      if (typeof this.options.onModelChange === 'function') {
        this.options.onModelChange(modelType, this.avatar);
      }
    } catch (err) {
      console.error(`Error loading avatar model ${modelType}:`, err);
    } finally {
      this.isModelLoading = false;
    }

    return this.avatar;
  }

  setCameraMode(modeName) {
    const preset = CAMERA_MODES[modeName];
    if (!preset) return;

    this.cameraMode = modeName;
    this.cameraTargetPos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
    this.cameraLookTarget.set(preset.target[0], preset.target[1], preset.target[2]);
    this.targetFov = preset.fov;
  }

  setTheme(theme = 'dark') {
    this.currentTheme = theme;
    if (!this.options.transparent) {
      const bgColor = 0x000000;
      this.scene.background = new THREE.Color(bgColor);
      if (this.scene.fog) {
        this.scene.fog.color = new THREE.Color(bgColor);
      }
    } else {
      this.scene.background = null;
      if (this.scene.fog) {
        this.scene.fog = null;
      }
    }
    this.ambientLight.intensity = theme === 'high-contrast' ? 1.4 : 1.0;
    this.keyLight.intensity = theme === 'high-contrast' ? 1.8 : 1.5;
  }

  setWireframe(enabled) {
    this.wireframe = !!enabled;
    if (this.avatar) {
      this.avatar.setWireframe(enabled);
    }
  }

  setOuterLayerCoating(color, options = {}) {
    this.coatingColor = color;
    this.coatingOptions = options;
    if (this.avatar?.setOuterLayerCoating) {
      this.avatar.setOuterLayerCoating(color, options);
    }
  }

  resize(width, height) {
    if (width <= 0 || height <= 0 || this.isDisposed) return;
    this.width = width;
    this.height = height;
    this.aspect = width / height;

    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  _startLoop() {
    if (this.isRendering) return;
    this.isRendering = true;

    const render = () => {
      if (this.isDisposed) return;

      const now = performance.now();
      const delta = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      const time = (now - this.startTime) / 1000;

      // Smooth camera interpolation
      const camLerp = 6.0 * delta;
      this.camera.position.lerp(this.cameraTargetPos, camLerp);
      this.currentLookTarget.lerp(this.cameraLookTarget, camLerp);
      this.camera.lookAt(this.currentLookTarget);

      if (Math.abs(this.camera.fov - this.targetFov) > 0.05) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, camLerp);
        this.camera.updateProjectionMatrix();
      }

      // Update controllers
      if (this.signingEngine && this.signingEngine.isPlaying) {
        this.signingEngine.update(delta);
        if (this.animationController) {
          this.animationController.update(delta);
        }
      } else if (this.animationController) {
        this.animationController.update(delta);
      }

      if (this.avatar) {
        this.avatar.update(delta);
      }

      // Render
      this.renderer.render(this.scene, this.camera);

      // FPS tracking
      this.frameCount++;
      if (time - this.lastFpsUpdate >= 0.5) {
        this.fps = Math.round((this.frameCount / (time - this.lastFpsUpdate)));
        this.drawCalls = this.renderer.info.render.calls;
        this.frameCount = 0;
        this.lastFpsUpdate = time;
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  pause() {
    this.isPaused = true;
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (!this.isPaused || this.isDisposed) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this._startLoop();
  }

  dispose() {
    this.isDisposed = true;
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.avatar) {
      this.avatar.dispose();
      this.scene.remove(this.avatar.root);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
