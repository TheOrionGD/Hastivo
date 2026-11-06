/**
 * Hastivo MixamoBotAvatar - High-Fidelity GLTF/GLB Avatar Rig (V-Bot)
 * 
 * Exclusively loads and animates:
 * - V-Bot (v-bot_x_y-bot.glb)
 * - Mixamo standard humanoid skeleton with full 5-finger articulated kinematics (80 bones)
 * - PBR MeshStandardMaterial / MeshPhysicalMaterial outer shell and joint articulation
 * - Full compatibility with SigningEngine, AvatarAnimationController, and HandAnimationController
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { HAND_POSTURES, FINGERSPELLING_POSTURES, NUMBER_POSTURES } from '../animation/HandController.js';

// Pre-configured paths for models served via Vite public dir
export const BOT_MODELS = {
  'v-bot': {
    id: 'v-bot',
    name: 'V-Bot',
    gender: 'neutral',
    path: '/models/v-bot_x_y-bot.glb',
    baseScale: 1.0, // Model is modeled in meters (~1.80m tall)
    yOffset: 0.0,
    accentColor: '#FF6F61',
    shellColor: '#E2E6EC',
    vertices: 48000,
    boneCount: 80
  },
  // Backward compatibility aliases
  'x-bot': {
    id: 'v-bot',
    name: 'V-Bot',
    gender: 'neutral',
    path: '/models/v-bot_x_y-bot.glb',
    baseScale: 1.0,
    yOffset: 0.0,
    accentColor: '#FF6F61',
    shellColor: '#E2E6EC',
    vertices: 48000,
    boneCount: 80
  },
  'y-bot': {
    id: 'v-bot',
    name: 'V-Bot',
    gender: 'neutral',
    path: '/models/v-bot_x_y-bot.glb',
    baseScale: 1.0,
    yOffset: 0.0,
    accentColor: '#6FA3EF',
    shellColor: '#DFE4EB',
    vertices: 48000,
    boneCount: 80
  }
};

// Global in-memory cache of parsed GLTF templates for instant model switching
const GLTF_CACHE = new Map();

/**
 * Preload V-Bot GLB avatar rig into memory with granular progress reporting
 * @param {(fraction: number, modelId: string, statusText: string, details?: any) => void} onProgress
 * @returns {Promise<boolean>}
 */
export async function preloadAvatarModels(onProgress) {
  const modelId = 'v-bot';
  const cfg = BOT_MODELS[modelId];

  const report = (fraction, statusText, details = {}) => {
    if (onProgress) {
      onProgress(fraction, modelId, statusText, {
        loadedBytes: Math.round(fraction * 4742252),
        totalBytes: 4742252,
        percent: Math.round(fraction * 100),
        vBotReady: fraction >= 1.0,
        ...details
      });
    }
  };

  if (GLTF_CACHE.has(modelId)) {
    report(1.0, 'Cached: V-Bot Kinematic Rig');
    return true;
  }

  report(0.08, 'Connecting to V-Bot 3D kinematic stream...');

  const loader = new GLTFLoader();
  try {
    const gltf = await loader.loadAsync(cfg.path, (xhr) => {
      const total = (xhr.total && xhr.total > 0) ? xhr.total : 4742252;
      const fraction = Math.min(0.95, Math.max(0.1, xhr.loaded / total));
      const mb = (xhr.loaded / 1048576).toFixed(1);
      const totalMb = (total / 1048576).toFixed(1);
      report(fraction, `Streaming V-Bot Kinematic Rig (${mb}/${totalMb} MB)...`);
    });

    if (gltf && gltf.scene) {
      report(0.98, 'Compiling V-Bot skeletal rig & shaders...');
      GLTF_CACHE.set(modelId, gltf.scene);
      report(1.0, 'V-Bot 3D humanoid avatar loaded into high-speed memory cache.');
      return true;
    }
  } catch (err) {
    console.error('Failed to preload V-Bot GLB model:', err);
    report(1.0, 'Preloader completed with fallback.');
  }

  return false;
}

export function areAvatarModelsPreloaded() {
  return GLTF_CACHE.has('v-bot');
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
      // Thumb kinematics: In Mixamo rig, Thumb curls primarily along local X & Z
      if (b0) {
        b0.rotation.set(
          0.34 + mcp * 0.45 - abduct * 0.35,
          sign * -0.22,
          sign * (-0.45 + mcp * 0.40)
        );
      }
      if (b1) {
        b1.rotation.set(pip * 0.55, 0, sign * pip * 0.35);
      }
      if (b2) {
        b2.rotation.set(dip * 0.55, 0, sign * dip * 0.35);
      }
    } else {
      // 4 Fingers (Index, Middle, Ring, Pinky):
      // In Mixamo humanoid rig, finger curl flexion is a positive rotation around local X axis.
      // Abduction (spreading) rotates around local Z axis with opposite signs for Left vs Right.
      if (b0) {
        b0.rotation.set(
          Math.max(0, mcp),
          0,
          sign * abduct * 0.6
        );
      }
      if (b1) {
        b1.rotation.set(Math.max(0, pip), 0, 0);
      }
      if (b2) {
        b2.rotation.set(Math.max(0, dip), 0, 0);
      }
    }
  }
}

/**
 * MixamoHandController wraps Mixamo fingers & wrist into Hastivo's HandController interface
 */
class MixamoHandController {
  constructor(bonesMap, side, wristBone) {
    this.side = side;
    this.wristBone = wristBone;
    this.wristControlEnabled = false;

    // Pattern matches both VBOT_LeftHandThumb1_... and mixamorigLeftHandThumb1
    const sidePrefix = side === 'L' ? 'Left' : 'Right';
    const digitNames = {
      thumb: 'Thumb',
      index: 'Index',
      middle: 'Middle',
      ring: 'Ring',
      little: 'Pinky'
    };

    const findBone = (digit, seg) => {
      const regex = new RegExp(`(VBOT_|mixamorig)${sidePrefix}Hand${digit}${seg}`, 'i');
      for (const [name, bone] of Object.entries(bonesMap)) {
        if (regex.test(name)) return bone;
      }
      return null;
    };

    this.fingerControllers = {};
    this.currentAngles = {};
    this.targetAngles = {};

    for (const [key, digitWord] of Object.entries(digitNames)) {
      const segs = [
        findBone(digitWord, 1),
        findBone(digitWord, 2),
        findBone(digitWord, 3),
        findBone(digitWord, 4)
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
          cur[i] += (tgt[i] - cur[i]) * lerpRate;
        }
        this.fingerControllers[digit].setFlexion(cur[0], cur[1], cur[2], cur[3]);
      }
    }

    if (this.wristBone && this.wristControlEnabled) {
      this.currentWrist.flex += (this.targetWrist.flex - this.currentWrist.flex) * lerpRate;
      this.currentWrist.roll += (this.targetWrist.roll - this.currentWrist.roll) * lerpRate;

      const sign = this.side === 'R' ? 1 : -1;
      this.wristBone.rotation.x = this.currentWrist.flex * 0.8;
      this.wristBone.rotation.y = sign * this.currentWrist.roll * 0.8;
    }
  }
}

/**
 * MixamoHeadController handles natural gaze & nods
 */
class MixamoHeadController {
  constructor(headBone, neckBone) {
    this.headBone = headBone;
    this.neckBone = neckBone;
    this.targetPitch = 0;
    this.targetYaw = 0;
    this.targetRoll = 0;
    this.currentPitch = 0;
    this.currentYaw = 0;
    this.currentRoll = 0;
  }

  setOrientation(pitch, yaw, roll) {
    this.targetPitch = pitch;
    this.targetYaw = yaw;
    this.targetRoll = roll;
  }

  update(delta) {
    const factor = Math.min(1.0, 8.0 * delta);
    this.currentPitch += (this.targetPitch - this.currentPitch) * factor;
    this.currentYaw += (this.targetYaw - this.currentYaw) * factor;
    this.currentRoll += (this.targetRoll - this.currentRoll) * factor;

    if (this.headBone) {
      this.headBone.rotation.x = this.currentPitch * 0.7;
      this.headBone.rotation.y = this.currentYaw * 0.7;
      this.headBone.rotation.z = this.currentRoll * 0.7;
    }
    if (this.neckBone) {
      this.neckBone.rotation.x = this.currentPitch * 0.3;
      this.neckBone.rotation.y = this.currentYaw * 0.3;
      this.neckBone.rotation.z = this.currentRoll * 0.3;
    }
  }
}

/**
 * MixamoBodyController handles spinal sway & torso postures
 */
class MixamoBodyController {
  constructor(spineBone, chestBone) {
    this.spine = spineBone;
    this.chest = chestBone;
  }

  setTorsoAngles(pitch, yaw, roll) {
    if (this.spine) {
      this.spine.rotation.x = pitch * 0.4;
      this.spine.rotation.y = yaw * 0.4;
      this.spine.rotation.z = roll * 0.4;
    }
    if (this.chest) {
      this.chest.rotation.x = pitch * 0.6;
      this.chest.rotation.y = yaw * 0.6;
      this.chest.rotation.z = roll * 0.6;
    }
  }
}

/**
 * MixamoShoulderController handles shoulder shrug & elevation
 */
class MixamoShoulderController {
  constructor(leftShoulder, rightShoulder) {
    this.left = leftShoulder;
    this.right = rightShoulder;
  }

  setElevation(side, elevation) {
    const bone = side === 'L' ? this.left : this.right;
    if (bone) {
      bone.rotation.z = elevation * (side === 'L' ? -0.2 : 0.2);
    }
  }
}

/**
 * MixamoArmController provides direct procedural joint control for arms
 */
class MixamoArmController {
  constructor(bones) {
    this.bones = bones;
    this.enabled = true;
  }

  setArmAngles(side, upperArmX, upperArmY, upperArmZ, elbowBend) {
    if (!this.enabled) return;
    const isRight = side.toUpperCase() === 'R';
    const upper = isRight ? this.bones['RightUpperArm'] : this.bones['LeftUpperArm'];
    const elbow = isRight ? this.bones['RightElbow'] : this.bones['LeftElbow'];

    if (upper) {
      upper.rotation.set(upperArmX, upperArmY, upperArmZ);
    }

    if (elbow) {
      elbow.rotation.z = isRight ? -Math.abs(elbowBend) : Math.abs(elbowBend);
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
 * Main MixamoBotAvatar Class (Unified V-Bot Avatar)
 */
export class MixamoBotAvatar {
  constructor(modelType = 'v-bot', options = {}) {
    this.modelType = 'v-bot';
    this.config = BOT_MODELS['v-bot'];
    this.options = options;

    this.root = new THREE.Group();
    this.root.name = `Hastivo_${this.config.name}`;

    this.bones = {};
    this.meshes = [];
    this.isLoaded = false;

    // Outer coating state
    this.coatingColor = options.coatingColor || this.config.shellColor;
    this.coatingRoughness = options.roughness !== undefined ? options.roughness : 0.18;
    this.coatingMetalness = options.metalness !== undefined ? options.metalness : 0.35;
    this.coatingClearcoat = options.clearcoat !== undefined ? options.clearcoat : 0.92;
    this.isWireframe = options.wireframe || false;

    // Accessory meshes and materials for wireframe & ghosting synchronization
    this.accessoryMeshes = [];
    this.accessoryMaterials = [];

    // Dynamic upper body opacity (compatible with Hastivo signing engine)
    this.currentUpperBodyOpacity = 1.0;
    this.targetUpperBodyOpacity = 1.0;

    // Controllers
    this.leftHandController = null;
    this.rightHandController = null;
    this.headController = null;
    this.bodyController = null;
    this.shoulderController = null;
    this.armController = null;
    this.wristController = null;
    this.faceController = new MixamoFacialController(this);
    this.facialController = this.faceController;

    // Asynchronously load and initialize GLTF/GLB
    this.loadPromise = this._loadModel();
  }

  async _loadModel() {
    let gltfScene = null;

    if (GLTF_CACHE.has(this.config.id)) {
      const cached = GLTF_CACHE.get(this.config.id);
      gltfScene = SkeletonUtils.clone(cached);
    } else {
      const loader = new GLTFLoader();
      try {
        const gltf = await loader.loadAsync(this.config.path);
        GLTF_CACHE.set(this.config.id, gltf.scene);
        gltfScene = SkeletonUtils.clone(gltf.scene);
      } catch (err) {
        console.error('Failed to load V-Bot GLB model:', err);
        return this;
      }
    }

    // Configure scale & position: scale = 1.0 (model is 1.80m tall in meters)
    const scale = this.config.baseScale;
    this.root.scale.set(scale, scale, scale);
    this.root.position.set(0, this.config.yOffset, 0);

    // Map bones and configure meshes
    this._setupRig(gltfScene);
    this._setupMaterials(gltfScene);

    this.root.add(gltfScene);
    this.modelRoot = gltfScene;

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

  _setupRig(gltfScene) {
    const rawBones = {};
    let primarySkinnedMesh = null;
    gltfScene.traverse((child) => {
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
    gltfScene.traverse((child) => {
      if (child.isBone && !rawBones[child.name]) {
        rawBones[child.name] = child;
      }
    });

    this.rawBones = rawBones;

    // Helper to find bone matching regex
    const findBone = (regex) => {
      for (const [name, bone] of Object.entries(rawBones)) {
        if (regex.test(name)) return bone;
      }
      return null;
    };

    // Direct real bone references (matching VBOT_* bone names)
    const rightUpper = findBone(/RightArm/i);
    const rightElbow = findBone(/RightForeArm/i);
    const rightWrist = findBone(/RightHand(?!\w+Thumb|\w+Index|\w+Middle|\w+Ring|\w+Pinky)/i);
    const leftUpper = findBone(/LeftArm/i);
    const leftElbow = findBone(/LeftForeArm/i);
    const leftWrist = findBone(/LeftHand(?!\w+Thumb|\w+Index|\w+Middle|\w+Ring|\w+Pinky)/i);

    this.realBones = {
      RightUpperArm: rightUpper,
      RightElbow: rightElbow,
      RightForearm: rightElbow,
      RightWrist: rightWrist,
      LeftUpperArm: leftUpper,
      LeftElbow: leftElbow,
      LeftForearm: leftElbow,
      LeftWrist: leftWrist,
    };

    // Populate both raw bone names and Hastivo standard alias names
    this.bones = { ...rawBones };

    // Standard alias mappings: DIRECTLY bind to real skeleton bones
    this.bones['Root'] = findBone(/Hips/i);
    this.bones['Pelvis'] = findBone(/Hips/i);
    this.bones['Spine'] = findBone(/Spine(?!\d)/i) || findBone(/Spine_02/i);
    this.bones['Chest'] = findBone(/Spine1/i) || findBone(/Spine/i);
    this.bones['Spine2'] = findBone(/Spine2/i);
    this.bones['Neck'] = findBone(/Neck/i);
    this.bones['Head'] = findBone(/Head(?!\w+End)/i);

    this.bones['LeftShoulder'] = findBone(/LeftShoulder/i);
    this.bones['RightShoulder'] = findBone(/RightShoulder/i);
    this.bones['LeftUpperArm'] = leftUpper;
    this.bones['RightUpperArm'] = rightUpper;
    this.bones['LeftElbow'] = leftElbow;
    this.bones['RightElbow'] = rightElbow;
    this.bones['LeftForearm'] = leftElbow;
    this.bones['RightForearm'] = rightElbow;
    this.bones['LeftWrist'] = leftWrist;
    this.bones['RightWrist'] = rightWrist;

    this.bones['LeftHip'] = findBone(/LeftUpLeg/i);
    this.bones['RightHip'] = findBone(/RightUpLeg/i);
    this.bones['LeftKnee'] = findBone(/LeftLeg/i);
    this.bones['RightKnee'] = findBone(/RightLeg/i);
    this.bones['LeftFoot'] = findBone(/LeftFoot/i);
    this.bones['RightFoot'] = findBone(/RightFoot/i);
  }

  _setupMaterials(gltfScene) {
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

    gltfScene.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        this.meshes.push(child);
        child.castShadow = true;
        child.receiveShadow = true;

        if (this.isWireframe) {
          if (child.material) child.material.wireframe = true;
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
    // Symmetrical, anatomically correct neutral attention posture directly on real skeleton bones
    const rArm = this.bones['RightUpperArm'];
    const lArm = this.bones['LeftUpperArm'];
    const rElbow = this.bones['RightElbow'];
    const lElbow = this.bones['LeftElbow'];
    const rWrist = this.bones['RightWrist'];
    const lWrist = this.bones['LeftWrist'];

    // Hanging naturally beside torso with subtle forward flexion
    if (rArm) rArm.rotation.set(1.35, 0.05, -0.15);
    if (lArm) lArm.rotation.set(1.35, -0.05, 0.15);

    // Natural slight resting elbow flexion
    if (rElbow) rElbow.rotation.set(0, 0, -0.08);
    if (lElbow) lElbow.rotation.set(0, 0, 0.08);

    // Neutral wrist alignment
    if (rWrist) rWrist.rotation.set(0, 0, 0);
    if (lWrist) lWrist.rotation.set(0, 0, 0);

    if (this.leftHandController) {
      this.leftHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
    if (this.rightHandController) {
      this.rightHandController.setPosture(HAND_POSTURES.RELAXED_REST);
    }
  }

  update(delta) {
    if (!this.isLoaded) return;

    // Update hand fingers kinematics
    if (this.leftHandController) this.leftHandController.update(delta);
    if (this.rightHandController) this.rightHandController.update(delta);

    // Update head orientation
    if (this.headController) this.headController.update(delta);

    // Smoothly interpolate upper-body opacity if requested
    if (Math.abs(this.currentUpperBodyOpacity - this.targetUpperBodyOpacity) > 0.005) {
      const factor = Math.min(1.0, 10.0 * delta);
      this.currentUpperBodyOpacity += (this.targetUpperBodyOpacity - this.currentUpperBodyOpacity) * factor;
      this._applyUpperBodyOpacity(this.currentUpperBodyOpacity);
    }
  }

  setOuterLayerCoating(hexColor, options = {}) {
    this.coatingColor = hexColor;
    if (options.roughness !== undefined) this.coatingRoughness = options.roughness;
    if (options.metalness !== undefined) this.coatingMetalness = options.metalness;
    if (options.clearcoat !== undefined) this.coatingClearcoat = options.clearcoat;

    if (this.surfaceMaterial) {
      this.surfaceMaterial.color.set(hexColor);
      this.surfaceMaterial.roughness = this.coatingRoughness;
      this.surfaceMaterial.metalness = this.coatingMetalness;
      this.surfaceMaterial.clearcoat = this.coatingClearcoat;
      this.surfaceMaterial.needsUpdate = true;
    }
  }

  setWireframe(enabled) {
    this.isWireframe = enabled;
    if (this.surfaceMaterial) this.surfaceMaterial.wireframe = enabled;
    if (this.jointsMaterial) this.jointsMaterial.wireframe = enabled;
    for (const mat of this.accessoryMaterials) {
      if (mat) mat.wireframe = enabled;
    }
    for (const m of this.meshes) {
      if (m.material) {
        if (Array.isArray(m.material)) {
          m.material.forEach(mat => { mat.wireframe = enabled; });
        } else {
          m.material.wireframe = enabled;
        }
      }
    }
  }

  setUpperBodyOpacity(opacity) {
    this.targetUpperBodyOpacity = Math.max(0.0, Math.min(1.0, opacity));
  }

  _applyUpperBodyOpacity(opacity) {
    const isTranslucent = opacity < 0.999;
    if (this.surfaceMaterial) {
      this.surfaceMaterial.transparent = isTranslucent;
      this.surfaceMaterial.opacity = opacity;
    }
    if (this.jointsMaterial) {
      this.jointsMaterial.transparent = isTranslucent;
      this.jointsMaterial.opacity = opacity;
    }
    for (const mat of this.accessoryMaterials) {
      if (mat) {
        mat.transparent = isTranslucent;
        mat.opacity = opacity;
      }
    }
  }

  dispose() {
    if (this.surfaceMaterial) this.surfaceMaterial.dispose();
    if (this.jointsMaterial) this.jointsMaterial.dispose();
    for (const mat of this.accessoryMaterials) {
      if (mat) mat.dispose();
    }
    for (const m of this.meshes) {
      if (m.geometry) m.geometry.dispose();
    }
  }
}
