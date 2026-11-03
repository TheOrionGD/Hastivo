/**
 * Signora MixamoBotAvatar - First-Class FBX Avatar Rig (X-Bot & Y-Bot)
 * 
 * Supports:
 * - X-Bot: Sleek female humanoid robot assistant (Beta_Surface + Beta_Joints)
 * - Y-Bot: Athletic male humanoid robot assistant (Alpha_Surface + Alpha_Joints)
 * - Mixamo 65-bone humanoid skeleton with full 5-finger articulated kinematics
 * - PBR MeshPhysicalMaterial with dynamic outer layer coating (color, clearcoat, roughness, metalness)
 * - Compatible with Signora's SigningEngine, AvatarAnimationController, and HandAnimationController interfaces
 */
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { HAND_POSTURES, FINGERSPELLING_POSTURES, NUMBER_POSTURES } from '../animation/HandController.js';

// Pre-configured paths for models served via Vite public dir
export const BOT_MODELS = {
  'x-bot': {
    id: 'x-bot',
    name: 'X-Bot (Female)',
    gender: 'female',
    path: '/models/x-bot.fbx',
    fallbackPath: '/models/X Bot.fbx',
    surfaceMesh: 'Beta_Surface',
    jointsMesh: 'Beta_Joints',
    baseScale: 0.0097, // Normalizes ~180.9cm to 1.75m human height
    yOffset: 0.0,
    accentColor: '#FF6F61', // Coral accent for female bot
    shellColor: '#E2E6EC', // Aerospace Silver-White
    vertices: 147336,
    boneCount: 65
  },
  'y-bot': {
    id: 'y-bot',
    name: 'Y-Bot (Male)',
    gender: 'male',
    path: '/models/y-bot.fbx',
    fallbackPath: '/models/Y Bot.fbx',
    surfaceMesh: 'Alpha_Surface',
    jointsMesh: 'Alpha_Joints',
    baseScale: 0.0097,
    yOffset: 0.0,
    accentColor: '#6FA3EF', // Electric Blue accent for male bot
    shellColor: '#DFE4EB', // Titanium Silver
    vertices: 165960,
    boneCount: 65
  }
};

// Global in-memory cache of parsed FBX templates for instant model switching
const FBX_CACHE = new Map();

/**
 * Preload all FBX avatar rigs into memory with granular progress reporting
 * @param {(progress: number, modelId: string, statusText: string) => void} onProgress
 * @returns {Promise<boolean>}
 */
export async function preloadAvatarModels(onProgress) {
  const models = ['x-bot', 'y-bot'];
  const progressMap = {
    'x-bot': { loaded: FBX_CACHE.has('x-bot') ? 1750032 : 0, total: 1750032, ready: FBX_CACHE.has('x-bot') },
    'y-bot': { loaded: FBX_CACHE.has('y-bot') ? 1982368 : 0, total: 1982368, ready: FBX_CACHE.has('y-bot') }
  };

  const report = (activeId, statusText) => {
    if (!onProgress) return;
    const totalBytes = progressMap['x-bot'].total + progressMap['y-bot'].total;
    const loadedBytes = Math.min(totalBytes, progressMap['x-bot'].loaded + progressMap['y-bot'].loaded);
    const fraction = (progressMap['x-bot'].ready && progressMap['y-bot'].ready)
      ? 1.0
      : Math.min(0.96, Math.max(0.08, loadedBytes / totalBytes));
    onProgress(fraction, activeId, statusText, {
      xBotReady: progressMap['x-bot'].ready,
      yBotReady: progressMap['y-bot'].ready,
      loadedBytes,
      totalBytes,
      percent: Math.round(fraction * 100)
    });
  };

  report('all', 'Connecting to 3D avatar kinematic stream...');

  const tasks = models.map(async (modelId) => {
    const cfg = BOT_MODELS[modelId];
    if (!cfg) return;

    if (FBX_CACHE.has(modelId)) {
      progressMap[modelId].loaded = progressMap[modelId].total;
      progressMap[modelId].ready = true;
      report(modelId, `Cached: ${cfg.name}`);
      return;
    }

    report(modelId, `Streaming ${cfg.name}...`);

    const loader = new FBXLoader();
    let fbxScene = null;
    try {
      fbxScene = await loader.loadAsync(cfg.path, (xhr) => {
        const total = (xhr.total && xhr.total > 0) ? xhr.total : progressMap[modelId].total;
        progressMap[modelId].total = total;
        progressMap[modelId].loaded = xhr.loaded;
        const mb = (xhr.loaded / 1048576).toFixed(1);
        const totalMb = (total / 1048576).toFixed(1);
        report(modelId, `Streaming ${cfg.name} (${mb}/${totalMb} MB)...`);
      });
    } catch {
      report(modelId, `Retrying ${cfg.name} via secondary path...`);
      try {
        fbxScene = await loader.loadAsync(cfg.fallbackPath);
      } catch (err) {
        console.warn(`Failed to preload ${modelId}:`, err);
      }
    }

    if (fbxScene) {
      report(modelId, `Compiling skeletal rig & 27-DOF shaders for ${cfg.name}...`);
      FBX_CACHE.set(modelId, fbxScene);
      progressMap[modelId].loaded = progressMap[modelId].total;
      progressMap[modelId].ready = true;
      report(modelId, `Rig Ready: ${cfg.name}`);
    }
  });

  await Promise.all(tasks);

  report('all', 'All 3D humanoid avatar models loaded into high-speed memory cache.');
  return true;
}

export function areAvatarModelsPreloaded() {
  return FBX_CACHE.has('x-bot') && FBX_CACHE.has('y-bot');
}

/**
 * MixamoFingerController handles 3-segment phalangeal kinematics for one digit
 */
class MixamoFingerController {
  constructor(bones, digitName, side) {
    this.bones = bones; // Array of [MCP, PIP, DIP, (optional tip)]
    this.digitName = digitName;
    this.side = side;
  }

  setFlexion(mcp = 0, pip = 0, dip = 0, abduct = 0) {
    const isThumb = this.digitName === 'thumb';
    const b0 = this.bones[0];
    const b1 = this.bones[1];
    const b2 = this.bones[2];
    const sign = this.side === 'R' ? 1 : -1;

    if (isThumb) {
      // Thumb kinematics: Flexion adds to rest Z, abduction tilts X
      if (b0) {
        b0.rotation.set(
          0.527 - abduct * 0.6,
          0,
          sign * (-0.475 + mcp * 0.85)
        );
      }
      if (b1) {
        b1.rotation.set(0, 0, sign * pip * 0.85);
      }
      if (b2) {
        b2.rotation.set(0, 0, sign * dip * 0.85);
      }
    } else {
      // 4 Fingers (Index, Middle, Ring, Pinky):
      // Flexion curls around local Z axis; Abduction splays around local X axis
      if (b0) {
        b0.rotation.set(
          sign * abduct * 0.7,
          0,
          sign * mcp
        );
      }
      if (b1) {
        b1.rotation.set(0, 0, sign * pip);
      }
      if (b2) {
        b2.rotation.set(0, 0, sign * dip);
      }
    }
  }
}

/**
 * MixamoHandController wraps Mixamo fingers & wrist into Signora's HandController interface
 */
class MixamoHandController {
  constructor(bonesMap, side, wristBone) {
    this.side = side;
    this.wristBone = wristBone;
    this.wristControlEnabled = false;

    // Build digit controllers
    const prefix = side === 'L' ? 'mixamorigLeftHand' : 'mixamorigRightHand';
    const digitNames = {
      thumb: 'Thumb',
      index: 'Index',
      middle: 'Middle',
      ring: 'Ring',
      little: 'Pinky'
    };

    this.fingerControllers = {};
    this.currentAngles = {};
    this.targetAngles = {};

    for (const [key, mixamoName] of Object.entries(digitNames)) {
      const segs = [
        bonesMap[`${prefix}${mixamoName}1`],
        bonesMap[`${prefix}${mixamoName}2`],
        bonesMap[`${prefix}${mixamoName}3`],
        bonesMap[`${prefix}${mixamoName}4`]
      ].filter(Boolean);

      this.fingerControllers[key] = new MixamoFingerController(segs, key, side);
      this.currentAngles[key] = [0, 0, 0, 0];
      this.targetAngles[key] = [0, 0, 0, 0];
    }

    this.currentWrist = { flex: 0, roll: 0 };
    this.targetWrist = { flex: 0, roll: 0 };

    // Apply relaxed resting posture by default
    this.setPosture(HAND_POSTURES.RELAXED_REST);
  }

  setPosture(posture) {
    if (!posture) return;
    for (const digit in posture) {
      if (this.targetAngles[digit] && posture[digit]) {
        this.targetAngles[digit] = [...posture[digit]];
      }
    }
  }

  setFingerspellingLetter(letter) {
    const upper = String(letter).toUpperCase();
    if (FINGERSPELLING_POSTURES[upper]) {
      this.setPosture(FINGERSPELLING_POSTURES[upper]);
    }
  }

  setNumber(num) {
    const n = parseInt(num, 10);
    if (NUMBER_POSTURES[n]) {
      this.setPosture(NUMBER_POSTURES[n]);
    }
  }

  setWristAngles(flex = 0, extend = 0, roll = 0) {
    this.wristControlEnabled = true;
    this.targetWrist = { flex: flex - extend, roll };
  }

  setOpenPalmPose() {
    this.setPosture(HAND_POSTURES.OPEN_PALM);
  }

  setClosedFistPose() {
    this.setPosture(HAND_POSTURES.FIST);
  }

  setRelaxedHandPose() {
    this.setPosture(HAND_POSTURES.RELAXED_REST);
  }

  setPointingPose() {
    this.setPosture(HAND_POSTURES.IMAGE_POINT_SIGN);
  }

  setUploadedImagePose() {
    this.setPosture(HAND_POSTURES.IMAGE_POINT_SIGN);
    this.setWristAngles(0.10, 0, 0);
  }

  setThumbsUpPose() {
    this.setPosture(HAND_POSTURES.THUMBS_UP);
  }

  setHelloPose() {
    this.setPosture(HAND_POSTURES.HELLO_OPEN_PALM);
  }

  setFingerPose(digit, mcp = 0, pip = 0, dip = 0, abduct = 0) {
    if (this.targetAngles && this.targetAngles[digit]) {
      this.targetAngles[digit] = [mcp, pip, dip, abduct];
    }
  }

  update(delta) {
    const lerpRate = Math.min(1.0, 14.0 * delta);

    for (const digit in this.fingerControllers) {
      const cur = this.currentAngles[digit];
      const tgt = this.targetAngles[digit];
      if (cur && tgt) {
        for (let i = 0; i < 4; i++) {
          cur[i] = THREE.MathUtils.lerp(cur[i], tgt[i], lerpRate);
        }
        this.fingerControllers[digit].setFlexion(cur[0], cur[1], cur[2], cur[3]);
      }
    }

    if (this.wristBone && this.wristControlEnabled) {
      this.currentWrist.flex = THREE.MathUtils.lerp(this.currentWrist.flex, this.targetWrist.flex, lerpRate);
      this.currentWrist.roll = THREE.MathUtils.lerp(this.currentWrist.roll, this.targetWrist.roll, lerpRate);
      this.wristBone.rotation.x = this.currentWrist.flex;
      this.wristBone.rotation.z = this.currentWrist.roll;
    }
  }
}

/**
 * MixamoHeadController controls Head & Neck orientation
 */
class MixamoHeadController {
  constructor(headBone, neckBone) {
    this.headBone = headBone;
    this.neckBone = neckBone;
  }

  setOrientation(yaw = 0, pitch = 0, roll = 0) {
    if (this.headBone) {
      this.headBone.rotation.y = yaw * 0.75;
      this.headBone.rotation.x = pitch * 0.75;
      this.headBone.rotation.z = roll * 0.75;
    }
    if (this.neckBone) {
      this.neckBone.rotation.y = yaw * 0.25;
      this.neckBone.rotation.x = pitch * 0.25;
      this.neckBone.rotation.z = roll * 0.25;
    }
  }
}

/**
 * MixamoBodyController controls Torso yaw and waist pitch
 */
class MixamoBodyController {
  constructor(spineBone, spine1Bone) {
    this.spineBone = spineBone;
    this.spine1Bone = spine1Bone;
    this.enabled = true;
  }

  setTorsoRotation(yaw = 0, pitch = 0) {
    if (this.spineBone) {
      this.spineBone.rotation.y = yaw * 0.55;
      this.spineBone.rotation.x = pitch * 0.55;
    }
    if (this.spine1Bone) {
      this.spine1Bone.rotation.y = yaw * 0.45;
      this.spine1Bone.rotation.x = pitch * 0.45;
    }
  }

  setBreathingIntensity() {
    // Breathing handled by animation controller
  }
}

/**
 * MixamoShoulderController controls shoulder elevation and protraction
 */
class MixamoShoulderController {
  constructor(leftShoulder, rightShoulder) {
    this.leftShoulder = leftShoulder;
    this.rightShoulder = rightShoulder;
    this.enabled = true;
  }

  setShoulder(side, elevation = 0, protraction = 0, roll = 0) {
    const b = side === 'L' ? this.leftShoulder : this.rightShoulder;
    if (!b) return;
    b.rotation.z = elevation * (side === 'L' ? -1 : 1);
    b.rotation.y = protraction;
    b.rotation.x = roll;
  }
}

/**
 * MixamoArmController controls upper arm and elbow angles
 */
class MixamoArmController {
  constructor(bones) {
    this.bones = bones;
    this.enabled = true;
  }

  setArmPose(side, { upperArmX = 0, upperArmY = 0, upperArmZ = 0, elbowBend = 0 } = {}) {
    const upper = this.bones[side === 'L' ? 'LeftUpperArm' : 'RightUpperArm'];
    const elbow = this.bones[side === 'L' ? 'LeftElbow' : 'RightElbow'];

    if (upper) {
      // Natural base down angle: 1.35 rad around X
      upper.rotation.x = 1.35 + upperArmX;
      upper.rotation.y = upperArmY;
      upper.rotation.z = upperArmZ * (side === 'L' ? 1 : -1);
    }

    if (elbow) {
      // Elbow flexion around local Z (L: +z, R: -z)
      elbow.rotation.z = Math.abs(elbowBend) * (side === 'L' ? 1 : -1);
    }
  }
}

/**
 * MixamoFacialController handles simulated digital expressions
 */
class MixamoFacialController {
  constructor(avatar) {
    this.avatar = avatar;
    this.currentExpression = 'neutral';
  }

  setExpression(exprName) {
    this.currentExpression = exprName;
    const head = this.avatar.headController;
    if (!head) return;

    // Subtle head tilt / nod complementing the expression
    switch (exprName) {
      case 'happy':
        head.setOrientation(0, -0.06, 0.04);
        break;
      case 'thinking':
        head.setOrientation(0.12, -0.08, -0.08);
        break;
      case 'confused':
      case 'questioning':
        head.setOrientation(-0.08, 0.05, 0.12);
        break;
      case 'affirmative':
        head.setOrientation(0, 0.08, 0);
        break;
      case 'sad':
        head.setOrientation(0, 0.14, 0);
        break;
      case 'neutral':
      default:
        head.setOrientation(0, 0, 0);
        break;
    }
  }
}

/**
 * Main MixamoBotAvatar Class
 */
export class MixamoBotAvatar {
  constructor(modelType = 'x-bot', options = {}) {
    this.modelType = modelType;
    this.config = BOT_MODELS[modelType] || BOT_MODELS['x-bot'];
    this.options = options;

    this.root = new THREE.Group();
    this.root.name = `Signora_${this.config.name}`;

    this.bones = {};
    this.meshes = [];
    this.surfaceMesh = null;
    this.jointsMesh = null;
    this.isLoaded = false;

    // Outer coating state
    this.coatingColor = options.coatingColor || this.config.shellColor;
    this.coatingRoughness = options.roughness !== undefined ? options.roughness : 0.18;
    this.coatingMetalness = options.metalness !== undefined ? options.metalness : 0.35;
    this.coatingClearcoat = options.clearcoat !== undefined ? options.clearcoat : 0.92;
    this.isWireframe = options.wireframe || false;

    // Dynamic upper body opacity (compatible with Signora signing engine)
    this.currentUpperBodyOpacity = 1.0;
    this.targetUpperBodyOpacity = 1.0;

    // Placeholders for controllers until FBX finishes loading
    this.leftHandController = null;
    this.rightHandController = null;
    this.headController = null;
    this.bodyController = null;
    this.shoulderController = null;
    this.armController = null;
    this.wristController = null;
    this.faceController = new MixamoFacialController(this);
    this.facialController = this.faceController;

    // Asynchronously load and initialize FBX
    this.loadPromise = this._loadModel();
  }

  async _loadModel() {
    let fbxScene = null;

    if (FBX_CACHE.has(this.config.id)) {
      // Deep-clone skinned mesh and skeleton hierarchy using Three.js SkeletonUtils
      const cached = FBX_CACHE.get(this.config.id);
      fbxScene = SkeletonUtils.clone(cached);
    } else {
      const loader = new FBXLoader();
      try {
        fbxScene = await loader.loadAsync(this.config.path);
      } catch (err) {
        console.warn(`Failed to load FBX from primary path ${this.config.path}, trying fallback ${this.config.fallbackPath}:`, err);
        fbxScene = await loader.loadAsync(this.config.fallbackPath);
      }
      // Cache original template
      FBX_CACHE.set(this.config.id, fbxScene);
      fbxScene = SkeletonUtils.clone(fbxScene);
    }

    // Configure scale & position: scale to ~1.75m human height
    const scale = this.config.baseScale;
    this.root.scale.set(scale, scale, scale);
    this.root.position.set(0, this.config.yOffset, 0);

    // Map bones and configure meshes
    this._setupRig(fbxScene);
    this._setupMaterials(fbxScene);
    this._buildGenderFaceAndAttire();

    this.root.add(fbxScene);
    this.modelRoot = fbxScene;

    // Build Controllers
    this._buildControllers();

    // Set initial natural relaxed human resting posture
    this._applyRestStance();

    this.isLoaded = true;
    if (this.options.onLoaded) {
      this.options.onLoaded(this);
    }

    return this;
  }

  _setupRig(fbxScene) {
    const rawBones = {};
    let primarySkinnedMesh = null;
    fbxScene.traverse((child) => {
      if (child.isSkinnedMesh && !primarySkinnedMesh) {
        primarySkinnedMesh = child;
      }
    });

    if (primarySkinnedMesh && primarySkinnedMesh.skeleton) {
      primarySkinnedMesh.skeleton.bones.forEach((bone) => {
        rawBones[bone.name] = bone;
      });
    }

    // Fallback for any bone not captured in skeleton array
    fbxScene.traverse((child) => {
      if (child.isBone && !rawBones[child.name]) {
        rawBones[child.name] = child;
      }
    });

    this.rawBones = rawBones;

    // Kinematic proxy bones for procedural arm control so SigningEngine and AvatarAnimationController
    // seamlessly articulate Mixamo humanoid arms without requiring T-pose bone coordinate transforms
    this.proxyBones = {
      RightUpperArm: new THREE.Object3D(),
      RightElbow: new THREE.Object3D(),
      RightForearm: new THREE.Object3D(),
      RightWrist: new THREE.Object3D(),
      LeftUpperArm: new THREE.Object3D(),
      LeftElbow: new THREE.Object3D(),
      LeftForearm: new THREE.Object3D(),
      LeftWrist: new THREE.Object3D(),
    };

    // Store real bones reference
    this.realBones = {
      RightUpperArm: rawBones['mixamorigRightArm'],
      RightElbow: rawBones['mixamorigRightForeArm'],
      RightForearm: rawBones['mixamorigRightForeArm'],
      RightWrist: rawBones['mixamorigRightHand'],
      LeftUpperArm: rawBones['mixamorigLeftArm'],
      LeftElbow: rawBones['mixamorigLeftForeArm'],
      LeftForearm: rawBones['mixamorigLeftForeArm'],
      LeftWrist: rawBones['mixamorigLeftHand'],
    };

    // Populate both raw Mixamo names and Signora standard alias names
    this.bones = { ...rawBones };

    // Standard alias mappings: proxy bones for arm kinematics
    this.bones['Root'] = rawBones['mixamorigHips'];
    this.bones['Pelvis'] = rawBones['mixamorigHips'];
    this.bones['Spine'] = rawBones['mixamorigSpine'];
    this.bones['Chest'] = rawBones['mixamorigSpine1'] || rawBones['mixamorigSpine'];
    this.bones['Spine2'] = rawBones['mixamorigSpine2'];
    this.bones['Neck'] = rawBones['mixamorigNeck'];
    this.bones['Head'] = rawBones['mixamorigHead'];

    this.bones['LeftShoulder'] = rawBones['mixamorigLeftShoulder'];
    this.bones['RightShoulder'] = rawBones['mixamorigRightShoulder'];
    this.bones['LeftUpperArm'] = this.proxyBones.LeftUpperArm;
    this.bones['RightUpperArm'] = this.proxyBones.RightUpperArm;
    this.bones['LeftElbow'] = this.proxyBones.LeftElbow;
    this.bones['RightElbow'] = this.proxyBones.RightElbow;
    this.bones['LeftForearm'] = this.proxyBones.LeftForearm;
    this.bones['RightForearm'] = this.proxyBones.RightForearm;
    this.bones['LeftWrist'] = this.proxyBones.LeftWrist;
    this.bones['RightWrist'] = this.proxyBones.RightWrist;

    this.bones['LeftHip'] = rawBones['mixamorigLeftUpLeg'];
    this.bones['RightHip'] = rawBones['mixamorigRightUpLeg'];
    this.bones['LeftKnee'] = rawBones['mixamorigLeftLeg'];
    this.bones['RightKnee'] = rawBones['mixamorigRightLeg'];
    this.bones['LeftFoot'] = rawBones['mixamorigLeftFoot'];
    this.bones['RightFoot'] = rawBones['mixamorigRightFoot'];
  }

  _setupMaterials(fbxScene) {
    this.meshes = [];

    // Outer cyber shell armor material (PBR MeshPhysicalMaterial with dynamic outer coating)
    this.surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.coatingColor),
      roughness: this.coatingRoughness,
      metalness: this.coatingMetalness,
      clearcoat: this.coatingClearcoat,
      clearcoatRoughness: 0.12,
      wireframe: this.isWireframe,
      reflectivity: 0.85
    });

    // Dark titanium / carbon fiber mechanics material
    this.jointsMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1B1F26),
      roughness: 0.35,
      metalness: 0.85,
      wireframe: this.isWireframe
    });

    fbxScene.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        this.meshes.push(child);
        child.castShadow = true;
        child.receiveShadow = true;

        const isSurface = child.name.includes('Surface') || child.name.includes('Body');
        if (isSurface) {
          this.surfaceMesh = child;
          child.material = this.surfaceMaterial;
        } else {
          this.jointsMesh = child;
          child.material = this.jointsMaterial;
        }
      }
    });
  }

  _buildControllers() {
    this.headController = new MixamoHeadController(this.bones['Head'], this.bones['Neck']);
    this.bodyController = new MixamoBodyController(this.bones['Spine'], this.bones['Chest']);
    this.shoulderController = new MixamoShoulderController(this.bones['LeftShoulder'], this.bones['RightShoulder']);
    this.armController = new MixamoArmController(this.bones);

    this.leftHandController = new MixamoHandController(this.rawBones, 'L', this.realBones.LeftWrist);
    this.rightHandController = new MixamoHandController(this.rawBones, 'R', this.realBones.RightWrist);

    // Wrist controller proxy
    this.wristController = {
      setWrist: (side, flex, dev, pron) => {
        const ctrl = side === 'L' ? this.leftHandController : this.rightHandController;
        if (ctrl) ctrl.setWristAngles(flex, 0, pron);
      }
    };
  }

  _applyRestStance() {
    // Initial rest stance on proxy bones (matches Signora procedural ready stance)
    this.proxyBones.RightUpperArm.rotation.set(0.42, -0.10, 0.28);
    this.proxyBones.RightElbow.rotation.set(-0.92, 0, 0);
    this.proxyBones.RightForearm.rotation.set(0, 0.35, 0);
    this.proxyBones.RightWrist.rotation.set(0.10, 0.18, -0.12);

    this.proxyBones.LeftUpperArm.rotation.set(0.42, 0.10, -0.28);
    this.proxyBones.LeftElbow.rotation.set(-0.92, 0, 0);
    this.proxyBones.LeftForearm.rotation.set(0, -0.35, 0);
    this.proxyBones.LeftWrist.rotation.set(0.10, -0.18, 0.12);

    // Initial rest on real Mixamo FBX bones (natural resting human posture at sides)
    const rArm = this.realBones.RightUpperArm;
    const lArm = this.realBones.LeftUpperArm;
    const rForeArm = this.realBones.RightElbow;
    const lForeArm = this.realBones.LeftElbow;

    if (rArm) rArm.rotation.set(1.35, 0.05, -0.15);
    if (lArm) lArm.rotation.set(1.35, -0.05, 0.15);
    if (rForeArm) rForeArm.rotation.set(-0.25, 0, -0.25);
    if (lForeArm) lForeArm.rotation.set(-0.25, 0, 0.25);

    if (this.leftHandController) {
      this.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
    if (this.rightHandController) {
      this.rightHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
  }

  _updateArmKinematics() {
    const mapKinematics = (pUpper, pElbow, pWrist, side = 'R') => {
      const isRight = side === 'R';
      const sign = isRight ? 1 : -1;

      const ux = pUpper.rotation.x;
      const uy = pUpper.rotation.y;
      const uz = pUpper.rotation.z;
      const el = pElbow.rotation.x;

      const elbowBend = Math.min(1.8, Math.max(0.0, -el));
      
      // Upper arm elevation: 1.35 down at side, decreasing X elevates the arm
      const ax = 1.35 - (elbowBend - 0.4) * 0.35 + (ux - 0.42) * 0.45;
      const ay = sign * (-0.15 - (elbowBend - 0.4) * 0.55 + (uy || 0) * 0.6);
      const az = sign * (-0.10 + (uz || 0) * 0.5);

      // Forearm bend forward & across chest
      const fz = sign * (-elbowBend * 0.95);
      const fx = (elbowBend - 0.4) * 0.75;

      return { ax, ay, az, fx, fz };
    };

    const rK = mapKinematics(this.proxyBones.RightUpperArm, this.proxyBones.RightElbow, this.proxyBones.RightWrist, 'R');
    const lK = mapKinematics(this.proxyBones.LeftUpperArm, this.proxyBones.LeftElbow, this.proxyBones.LeftWrist, 'L');

    if (this.realBones.RightUpperArm) this.realBones.RightUpperArm.rotation.set(rK.ax, rK.ay, rK.az);
    if (this.realBones.RightElbow) this.realBones.RightElbow.rotation.set(rK.fx, 0, rK.fz);
    if (this.realBones.RightWrist) {
      const pw = this.proxyBones.RightWrist.rotation;
      this.realBones.RightWrist.rotation.set(pw.x * 0.6, pw.y, pw.z);
    }

    if (this.realBones.LeftUpperArm) this.realBones.LeftUpperArm.rotation.set(lK.ax, lK.ay, lK.az);
    if (this.realBones.LeftElbow) this.realBones.LeftElbow.rotation.set(lK.fx, 0, lK.fz);
    if (this.realBones.LeftWrist) {
      const pw = this.proxyBones.LeftWrist.rotation;
      this.realBones.LeftWrist.rotation.set(pw.x * 0.6, pw.y, pw.z);
    }
  }

  _buildGenderFaceAndAttire() {
    const isFemale = this.config.gender === 'female';
    const accentHex = isFemale ? 0xFF6F61 : 0x6FA3EF; // Coral for female, Electric Blue for male

    // Shared high-polish materials for cyber face & attire
    const accentGlowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentHex),
      emissive: new THREE.Color(accentHex),
      emissiveIntensity: 0.90,
      roughness: 0.18,
      metalness: 0.55
    });

    const whiteGlowMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF
    });

    const visorOledMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x06090E),
      roughness: 0.08,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const cyberArmorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.coatingColor),
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 0.92
    });

    const titaniumJointMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1B1F26),
      roughness: 0.35,
      metalness: 0.85
    });

    const headBone = this.rawBones['mixamorigHead'];
    const chestBone = this.rawBones['mixamorigSpine1'] || this.rawBones['mixamorigSpine'];
    const hipsBone = this.rawBones['mixamorigHips'];

    if (headBone) {
      if (isFemale) {
        // --- FEMALE BOT FACE (X-Bot) ---
        // Sleek curved cyber visor with glowing coral outline and expressive digital eyes
        const visorGroup = new THREE.Group();
        visorGroup.position.set(0, 11.2, 12.6);

        // 1. Glossy OLED curved visor screen
        const visorGeom = new THREE.CylinderGeometry(11.2, 11.2, 5.8, 32, 1, false, -Math.PI * 0.32, Math.PI * 0.64);
        const visorScreen = new THREE.Mesh(visorGeom, visorOledMat);
        visorScreen.rotation.y = Math.PI;
        visorScreen.position.set(0, 0, -2.4);
        visorGroup.add(visorScreen);

        // 2. Coral Glowing Visor Frame Bezel
        const frameGeom = new THREE.TorusGeometry(8.5, 0.45, 12, 32, Math.PI);
        const frameMesh = new THREE.Mesh(frameGeom, accentGlowMat);
        frameMesh.position.set(0, 0.2, 7.8);
        frameMesh.rotation.z = Math.PI;
        visorGroup.add(frameMesh);

        // 3. Expressive Digital Eyes Display (Friendly curved cyber eyes ^ ^)
        const leftEyeGeom = new THREE.TorusGeometry(1.6, 0.25, 8, 20, Math.PI * 0.7);
        const leftEye = new THREE.Mesh(leftEyeGeom, whiteGlowMat);
        leftEye.position.set(3.4, 0.6, 8.2);
        leftEye.rotation.z = Math.PI * 0.65;
        visorGroup.add(leftEye);

        const rightEyeGeom = new THREE.TorusGeometry(1.6, 0.25, 8, 20, Math.PI * 0.7);
        const rightEye = new THREE.Mesh(rightEyeGeom, whiteGlowMat);
        rightEye.position.set(-3.4, 0.6, 8.2);
        rightEye.rotation.z = Math.PI * 0.65;
        visorGroup.add(rightEye);

        // 4. Sleek Audio Headphone Ear Rings with glowing outer rims
        const earRingGeom = new THREE.TorusGeometry(3.5, 0.5, 12, 28);
        const leftEar = new THREE.Mesh(earRingGeom, accentGlowMat);
        leftEar.position.set(10.2, 0.5, -0.5);
        leftEar.rotation.y = Math.PI / 2;
        visorGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earRingGeom, accentGlowMat);
        rightEar.position.set(-10.2, 0.5, -0.5);
        rightEar.rotation.y = Math.PI / 2;
        visorGroup.add(rightEar);

        // 5. Forehead Crest Accent
        const crest = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.2, 0.8), accentGlowMat);
        crest.position.set(0, 5.2, 7.8);
        crest.rotation.x = -0.3;
        visorGroup.add(crest);

        headBone.add(visorGroup);
        this.femaleFaceNodes = { visorGroup, leftEye, rightEye };
      } else {
        // --- MALE BOT FACE (Y-Bot) ---
        // Tactical angular cyber visor with electric blue dual HUD optic scan slits
        const visorGroup = new THREE.Group();
        visorGroup.position.set(0, 11.5, 13.0);

        // 1. Angular titanium visor shell
        const visorGeom = new THREE.BoxGeometry(16.5, 6.2, 4.2);
        const visorScreen = new THREE.Mesh(visorGeom, visorOledMat);
        visorScreen.position.set(0, 0, 5.0);
        visorGroup.add(visorScreen);

        // 2. Dual Horizontal HUD Optic Scan Slits (Electric Blue)
        const leftOptic = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 0.4), accentGlowMat);
        leftOptic.position.set(4.0, 0.4, 7.2);
        visorGroup.add(leftOptic);

        const rightOptic = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 0.4), accentGlowMat);
        rightOptic.position.set(-4.0, 0.4, 7.2);
        visorGroup.add(rightOptic);

        // 3. Cyber Brow Plate & Ridge
        const browMesh = new THREE.Mesh(new THREE.BoxGeometry(17.2, 1.2, 2.8), titaniumJointMat);
        browMesh.position.set(0, 3.4, 6.2);
        visorGroup.add(browMesh);

        // 4. Tactical Temple Comms Fin
        const finMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 3.2), accentGlowMat);
        finMesh.position.set(9.6, 2.0, 2.5);
        finMesh.rotation.z = -0.15;
        visorGroup.add(finMesh);

        headBone.add(visorGroup);
        this.maleFaceNodes = { visorGroup, leftOptic, rightOptic };
      }
    }

    if (isFemale) {
      // --- FEMALE BOT ATTIRE / DRESS (X-Bot) ---
      // 1. Attached to Chest (mixamorigSpine1):
      // Elegant cyber bodice / dress top with coral trim and neckline collar
      if (chestBone) {
        const bodiceGroup = new THREE.Group();
        bodiceGroup.position.set(0, 3.5, 2.2);

        // Center sculpted corset shield plate
        const bodicePlate = new THREE.Mesh(new THREE.BoxGeometry(18.0, 14.0, 6.5), cyberArmorMat);
        bodicePlate.position.set(0, 0, 8.5);
        bodicePlate.castShadow = true;
        bodiceGroup.add(bodicePlate);

        // Glowing Coral Accent Slits on bodice
        const leftBustTrim = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 0.5), accentGlowMat);
        leftBustTrim.position.set(4.8, 4.2, 12.0);
        leftBustTrim.rotation.z = -0.25;
        bodiceGroup.add(leftBustTrim);

        const rightBustTrim = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 0.5), accentGlowMat);
        rightBustTrim.position.set(-4.8, 4.2, 12.0);
        rightBustTrim.rotation.z = 0.25;
        bodiceGroup.add(rightBustTrim);

        // Delicate cyber choker collar
        const collarMesh = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.6, 8, 28), accentGlowMat);
        collarMesh.rotation.x = Math.PI / 2;
        collarMesh.position.set(0, 10.5, 5.0);
        bodiceGroup.add(collarMesh);

        chestBone.add(bodiceGroup);
      }

      // 2. Attached to Hips / Pelvis (mixamorigHips):
      // Flowing Sculpted Cyber Skirt & Sash Panels
      if (hipsBone) {
        const skirtGroup = new THREE.Group();
        skirtGroup.position.set(0, -2.5, 0);

        // Belt waistband with glowing buckle
        const beltMesh = new THREE.Mesh(new THREE.CylinderGeometry(15.5, 16.5, 3.2, 24), titaniumJointMat);
        skirtGroup.add(beltMesh);

        const buckleMesh = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.4, 1.2), accentGlowMat);
        buckleMesh.position.set(0, 0, 16.5);
        skirtGroup.add(buckleMesh);

        // Left & Right flared cyber dress skirt panels draping over hips
        const skirtGeomL = new THREE.CylinderGeometry(16.5, 21.0, 18.0, 16, 1, true, 0, Math.PI * 0.45);
        const skirtPanelL = new THREE.Mesh(skirtGeomL, cyberArmorMat);
        skirtPanelL.position.set(0, -9.5, 0);
        skirtGroup.add(skirtPanelL);

        const skirtGeomR = new THREE.CylinderGeometry(16.5, 21.0, 18.0, 16, 1, true, Math.PI * 0.55, Math.PI * 0.45);
        const skirtPanelR = new THREE.Mesh(skirtGeomR, cyberArmorMat);
        skirtPanelR.position.set(0, -9.5, 0);
        skirtGroup.add(skirtPanelR);

        // Glowing coral hem trim at bottom of dress panels
        const hemTrimL = new THREE.Mesh(new THREE.TorusGeometry(20.5, 0.4, 8, 24, Math.PI * 0.45), accentGlowMat);
        hemTrimL.rotation.x = Math.PI / 2;
        hemTrimL.position.set(0, -18.2, 0);
        skirtGroup.add(hemTrimL);

        const hemTrimR = new THREE.Mesh(new THREE.TorusGeometry(20.5, 0.4, 8, 24, Math.PI * 0.45), accentGlowMat);
        hemTrimR.rotation.x = Math.PI / 2;
        hemTrimR.rotation.z = Math.PI * 0.55;
        hemTrimR.position.set(0, -18.2, 0);
        skirtGroup.add(hemTrimR);

        hipsBone.add(skirtGroup);
      }
    } else {
      // --- MALE BOT ATTIRE (Y-Bot) ---
      // 1. Attached to Chest (mixamorigSpine1):
      // Heavy tactical armor vest with glowing electric blue harness straps & arc core
      if (chestBone) {
        const vestGroup = new THREE.Group();
        vestGroup.position.set(0, 3.5, 2.0);

        // Armored chest plate
        const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(22.0, 16.0, 7.5), cyberArmorMat);
        chestPlate.position.set(0, 0, 9.5);
        chestPlate.castShadow = true;
        vestGroup.add(chestPlate);

        // Central Electric Blue Arc Core / Badge
        const arcCore = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.2, 20), accentGlowMat);
        arcCore.rotation.x = Math.PI / 2;
        arcCore.position.set(0, 2.5, 13.5);
        vestGroup.add(arcCore);

        // Diagonal tactical harness straps (Electric Blue)
        const strapL = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18.0, 0.6), accentGlowMat);
        strapL.position.set(6.2, 0, 13.2);
        strapL.rotation.z = -0.25;
        vestGroup.add(strapL);

        const strapR = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18.0, 0.6), accentGlowMat);
        strapR.position.set(-6.2, 0, 13.2);
        strapR.rotation.z = 0.25;
        vestGroup.add(strapR);

        chestBone.add(vestGroup);
      }

      // Tactical shoulder pauldrons
      const lShoulder = this.rawBones['mixamorigLeftShoulder'];
      const rShoulder = this.rawBones['mixamorigRightShoulder'];
      if (lShoulder) {
        const pauldronL = new THREE.Mesh(new THREE.BoxGeometry(9.5, 5.0, 11.0), titaniumJointMat);
        pauldronL.position.set(12.0, 5.0, 0);
        pauldronL.rotation.z = -0.25;
        const pGlowL = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.8, 9.5), accentGlowMat);
        pGlowL.position.set(0, 2.6, 0);
        pauldronL.add(pGlowL);
        lShoulder.add(pauldronL);
      }
      if (rShoulder) {
        const pauldronR = new THREE.Mesh(new THREE.BoxGeometry(9.5, 5.0, 11.0), titaniumJointMat);
        pauldronR.position.set(-12.0, 5.0, 0);
        pauldronR.rotation.z = 0.25;
        const pGlowR = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.8, 9.5), accentGlowMat);
        pGlowR.position.set(0, 2.6, 0);
        pauldronR.add(pGlowR);
        rShoulder.add(pauldronR);
      }

      // 2. Attached to Hips / Pelvis (mixamorigHips):
      // Tactical utility belt with modular tech gear pouches
      if (hipsBone) {
        const beltGroup = new THREE.Group();
        beltGroup.position.set(0, -2.5, 0);

        const beltBand = new THREE.Mesh(new THREE.CylinderGeometry(17.5, 17.5, 4.0, 24), titaniumJointMat);
        beltGroup.add(beltBand);

        // Utility tech pouches around waist
        [-9.5, -4.5, 4.5, 9.5].forEach(xOff => {
          const pouch = new THREE.Mesh(new THREE.BoxGeometry(3.5, 5.0, 2.8), cyberArmorMat);
          pouch.position.set(xOff, -1.0, 17.0);
          beltGroup.add(pouch);
        });

        // Electric Blue Belt Holster Light Strip
        const beltStrip = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.8, 0.6), accentGlowMat);
        beltStrip.position.set(0, 0, 18.0);
        beltGroup.add(beltStrip);

        hipsBone.add(beltGroup);
      }
    }
  }

  setOuterLayerCoating(color, options = {}) {
    this.coatingColor = color;
    if (options.clearcoat !== undefined) this.coatingClearcoat = options.clearcoat;
    if (options.roughness !== undefined || options.clearcoatRoughness !== undefined) {
      this.coatingRoughness = options.roughness ?? options.clearcoatRoughness;
    }
    if (options.metalness !== undefined) this.coatingMetalness = options.metalness;

    if (this.surfaceMaterial) {
      this.surfaceMaterial.color.set(color);
      this.surfaceMaterial.clearcoat = this.coatingClearcoat;
      this.surfaceMaterial.roughness = this.coatingRoughness;
      this.surfaceMaterial.metalness = this.coatingMetalness;
      this.surfaceMaterial.needsUpdate = true;
    }
  }

  setWireframe(enabled) {
    this.isWireframe = !!enabled;
    if (this.surfaceMaterial) {
      this.surfaceMaterial.wireframe = this.isWireframe;
      this.surfaceMaterial.needsUpdate = true;
    }
    if (this.jointsMaterial) {
      this.jointsMaterial.wireframe = this.isWireframe;
      this.jointsMaterial.needsUpdate = true;
    }
  }

  update(delta) {
    if (!this.isLoaded) return;

    // Update dynamic arm kinematics from procedural proxy bones onto Mixamo FBX skeleton
    this._updateArmKinematics();

    if (this.leftHandController) {
      this.leftHandController.update(delta);
    }
    if (this.rightHandController) {
      this.rightHandController.update(delta);
    }
  }

  dispose() {
    if (this.surfaceMaterial) this.surfaceMaterial.dispose();
    if (this.jointsMaterial) this.jointsMaterial.dispose();
    this.meshes.forEach((m) => {
      if (m.geometry) m.geometry.dispose();
    });
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
  }
}
