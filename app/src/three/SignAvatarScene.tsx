import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Eye, ChevronDown, ChevronUp, FastForward } from 'lucide-react';

export type GestureType =
  | 'IDLE'
  | 'GREETING'
  | 'THANK_YOU'
  | 'QUESTION'
  | 'WELCOME'
  | 'YES_AFFIRM'
  | 'NO_NEGATE'
  | 'POINT_YOU'
  | 'LOVE'
  | 'HELP'
  | 'NAME'
  | 'TIME'
  | 'COMMUNICATE';

interface SignAvatarSceneProps {
  currentGesture?: GestureType | string;
  speed?: number;
  interactive?: boolean;
  onGestureComplete?: () => void;
  className?: string;
  subtitle?: string;
}

// Pre-allocated math scratch variables (Zero GC in animation loop)
const _targetRot = new THREE.Euler();
const _targetPos = new THREE.Vector3();

export const SignAvatarScene: React.FC<SignAvatarSceneProps> = ({
  currentGesture = 'IDLE',
  speed = 1.0,
  interactive = true,
  onGestureComplete,
  className = '',
  subtitle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeGesture, setActiveGesture] = useState<GestureType>(
    (currentGesture as GestureType) || 'IDLE'
  );
  const [cameraAngle, setCameraAngle] = useState<'front' | 'threeQuarter' | 'closeUp'>('front');
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  // Sync external prop changes
  useEffect(() => {
    if (currentGesture) {
      setActiveGesture(currentGesture as GestureType);
      setIsPlaying(true);
    }
  }, [currentGesture]);

  useEffect(() => {
    setPlaybackSpeed(speed);
  }, [speed]);

  const activeGestureRef = useRef(activeGesture);
  activeGestureRef.current = activeGesture;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(playbackSpeed);
  speedRef.current = playbackSpeed;

  const onCompleteRef = useRef(onGestureComplete);
  onCompleteRef.current = onGestureComplete;

  const cameraAngleRef = useRef(cameraAngle);
  cameraAngleRef.current = cameraAngle;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    // 2. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.4);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch (e) {
      console.warn('WebGL init error:', e);
      setWebGlAvailable(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Warm Key Light + Cool Hemisphere Fill)
    const keyLight = new THREE.DirectionalLight(0xfff1e8, 2.4);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6fa3ef, 1.8);
    rimLight.position.set(-3.0, 2.5, -2.5);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xe5edfa, 0x1f232b, 1.1);
    scene.add(hemiLight);

    // 5. Procedural Textures (Zero 404 dependencies)
    const createSubtleGridTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#e2e6eb';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 256; i += 32) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
      }
      ctx.stroke();
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const gridTexture = createSubtleGridTexture();

    // 6. Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(23, 25, 30, 0.45)');
    grad.addColorStop(0.5, 'rgba(23, 25, 30, 0.18)');
    grad.addColorStop(1, 'rgba(23, 25, 30, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // 7. BUILD PROCEDURAL 3D AVATAR (Composite THREE.Group with 12 distinct articulated parts)
    const avatar = new THREE.Group();
    avatar.position.y = 0.0;
    scene.add(avatar);

    // PBR Material Palette (Varying roughness >= 0.25 between adjacent parts)
    // 1. Ceramic Shell (Matte white/eggshell)
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xf4f5f8,
      roughness: 0.28,
      metalness: 0.08,
      map: gridTexture,
    });

    // 2. High-Tech Dark Titanium (Contrasting inner chassis)
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x242830,
      roughness: 0.55,
      metalness: 0.85,
    });

    // 3. Cyber Brand Coral Accent (Active focus indicator)
    const coralMat = new THREE.MeshStandardMaterial({
      color: 0xff6f61,
      roughness: 0.22,
      metalness: 0.4,
    });

    // 4. Brand Blue Visor Glass (Reflective optical sensor)
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x111b2e,
      roughness: 0.12,
      metalness: 0.95,
      emissive: 0x6fa3ef,
      emissiveIntensity: 0.4,
    });

    // 5. Chrome / Silver Articulation Joints
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde5,
      roughness: 0.18,
      metalness: 0.9,
    });

    // Part 1: Pelvic Anchor Base
    const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.28, 24);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, darkChassisMat);
    pelvisMesh.position.y = 0.65;
    avatar.add(pelvisMesh);

    // Part 2: Spine / Abdominal core
    const spineGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.3, 16);
    const spineMesh = new THREE.Mesh(spineGeo, jointMat);
    spineMesh.position.y = 0.9;
    avatar.add(spineMesh);

    // Part 3: Main Chest Armor (Primary silhouette)
    const chestGroup = new THREE.Group();
    chestGroup.position.y = 1.25;
    avatar.add(chestGroup);

    const chestPlateGeo = new THREE.BoxGeometry(0.56, 0.45, 0.32);
    const chestMesh = new THREE.Mesh(chestPlateGeo, shellMat);
    chestMesh.castShadow = !isSoftwareGl;
    chestMesh.receiveShadow = !isSoftwareGl;
    chestGroup.add(chestMesh);

    // Chest Brand Accent Plate (Coral brand insignia)
    const chestCoreGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24);
    chestCoreGeo.rotateX(Math.PI / 2);
    const chestCoreMesh = new THREE.Mesh(chestCoreGeo, coralMat);
    chestCoreMesh.position.set(0, 0.06, 0.16);
    chestGroup.add(chestCoreMesh);

    // Part 4: Articulated Neck
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.28, 0);
    chestGroup.add(neckGroup);

    const neckGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.16, 16);
    const neckMesh = new THREE.Mesh(neckGeo, jointMat);
    neckMesh.position.y = 0.08;
    neckGroup.add(neckMesh);

    // Part 5: Head Silhouette & Visor
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.2, 0);
    neckGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
    headGeo.scale(0.95, 1.15, 1.05);
    const headMesh = new THREE.Mesh(headGeo, shellMat);
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Sleek Visor
    const visorGeo = new THREE.BoxGeometry(0.34, 0.14, 0.18);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.04, 0.15);
    headGroup.add(visorMesh);

    // Head Audio Nodes / Ears
    const earGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, coralMat);
    leftEar.position.set(-0.22, 0.03, 0);
    headGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.set(0.22, 0.03, 0);
    headGroup.add(rightEar);

    // Parts 6-12: Left and Right Articulated Arms & Hands
    // Helper to construct an articulated arm
    const createArticulatedArm = (side: 'left' | 'right') => {
      const isRight = side === 'right';
      const dir = isRight ? 1 : -1;

      // Shoulder pivot
      const shoulderPivot = new THREE.Group();
      shoulderPivot.position.set(dir * 0.36, 0.15, 0);
      chestGroup.add(shoulderPivot);

      const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), jointMat);
      shoulderPivot.add(shoulderJoint);

      // Upper arm
      const upperArm = new THREE.Group();
      upperArm.position.set(0, 0, 0);
      shoulderPivot.add(upperArm);

      const upperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.32, 16), shellMat);
      upperArmMesh.position.set(0, -0.18, 0);
      upperArmMesh.castShadow = !isSoftwareGl;
      upperArm.add(upperArmMesh);

      // Elbow joint
      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(0, -0.34, 0);
      upperArm.add(elbowPivot);

      const elbowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), jointMat);
      elbowPivot.add(elbowMesh);

      // Forearm
      const forearm = new THREE.Group();
      elbowPivot.add(forearm);

      const forearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.3, 16), darkChassisMat);
      forearmMesh.position.set(0, -0.16, 0);
      forearm.add(forearmMesh);

      // Forearm armor plate
      const forearmPlate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), shellMat);
      forearmPlate.position.set(0, -0.16, 0.02);
      forearm.add(forearmPlate);

      // Wrist joint
      const wristPivot = new THREE.Group();
      wristPivot.position.set(0, -0.32, 0);
      forearm.add(wristPivot);

      // Hand palm
      const palmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.04), shellMat);
      palmMesh.position.set(0, -0.06, 0);
      wristPivot.add(palmMesh);

      // Fingers Group (Articulated digits for sign language clarity)
      const fingersGroup = new THREE.Group();
      fingersGroup.position.set(0, -0.12, 0);
      wristPivot.add(fingersGroup);

      // 4 Main Fingers + 1 Thumb
      const fingerMeshes: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.09, 8), jointMat);
        finger.position.set((i - 1.5) * 0.024, -0.045, 0);
        fingersGroup.add(finger);
        fingerMeshes.push(finger);
      }

      // Thumb
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.08, 8), coralMat);
      thumb.position.set(dir * 0.05, 0.02, 0.02);
      thumb.rotation.z = dir * -0.5;
      wristPivot.add(thumb);

      return {
        shoulderPivot,
        upperArm,
        elbowPivot,
        forearm,
        wristPivot,
        fingersGroup,
        fingerMeshes,
        thumb,
      };
    };

    const rightArm = createArticulatedArm('right');
    const leftArm = createArticulatedArm('left');

    // 8. Animation & Damping Loop
    let clock = new THREE.Clock();
    let animTimer = 0;
    let animCycle = 0;
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(tick);

      const delta = Math.min(clock.getDelta(), 0.1);
      const effSpeed = speedRef.current;

      if (isPlayingRef.current) {
        animTimer += delta * effSpeed;
        animCycle += delta * effSpeed;
      }

      const t = animTimer;
      const gesture = activeGestureRef.current;

      // Camera Perspective interpolation
      const targetCamAngle = cameraAngleRef.current;
      if (targetCamAngle === 'front') {
        _targetPos.set(0, 1.35, 3.2);
      } else if (targetCamAngle === 'threeQuarter') {
        _targetPos.set(1.4, 1.45, 2.8);
      } else {
        _targetPos.set(0, 1.48, 1.9); // Close-up on sign articulation
      }
      camera.position.lerp(_targetPos, 0.04);
      camera.lookAt(0, 1.3, 0);

      // Universal Gentle Breathing (Humanoid bio-motion)
      const breath = Math.sin(t * 2.0) * 0.025;
      chestGroup.position.y = 1.25 + breath * 0.5;
      pelvisMesh.position.y = 0.65 + breath * 0.2;
      headGroup.rotation.x = Math.sin(t * 1.5) * 0.03;

      // Base arm poses
      let rShoulderRotX = 0, rShoulderRotZ = 0.15, rShoulderRotY = 0;
      let rElbowRotX = 0.35, rElbowRotY = 0;
      let rWristRotX = 0, rWristRotY = 0, rWristRotZ = 0;

      let lShoulderRotX = 0, lShoulderRotZ = -0.15, lShoulderRotY = 0;
      let lElbowRotX = 0.35, lElbowRotY = 0;
      let lWristRotX = 0, lWristRotY = 0, lWristRotZ = 0;

      // Gesture-Specific Kinematic Target Trajectories
      switch (gesture) {
        case 'GREETING': {
          // Right hand rises, elbow flexes, palm waves enthusiastically
          rShoulderRotX = -0.9 + Math.sin(t * 4.0) * 0.05;
          rShoulderRotZ = 0.45;
          rShoulderRotY = -0.3;
          rElbowRotX = 1.85;
          rWristRotX = 0.2;
          rWristRotZ = Math.sin(t * 7.0) * 0.35; // Gentle wave oscillation
          headGroup.rotation.y = 0.08;
          headGroup.rotation.z = -0.04;
          break;
        }

        case 'THANK_YOU': {
          // Flat hand moves from chin/mouth forward and down with respectful head bow
          const stroke = (Math.sin(t * 3.0) + 1) / 2;
          rShoulderRotX = -1.1 + stroke * 0.4;
          rShoulderRotY = -0.4 + stroke * 0.2;
          rShoulderRotZ = 0.25;
          rElbowRotX = 2.1 - stroke * 1.1;
          rWristRotX = 0.4 - stroke * 0.3;
          headGroup.rotation.x = 0.15 * (1 - stroke); // Slight nod of gratitude
          break;
        }

        case 'QUESTION': {
          // Both arms extend slightly, palms open upwards, head tilts inquisitively
          const p = Math.sin(t * 2.5) * 0.08;
          rShoulderRotX = -0.45 + p;
          rShoulderRotZ = 0.4;
          rElbowRotX = 1.35;
          rWristRotX = -0.5; // Palms facing upward
          rWristRotY = -0.3;

          lShoulderRotX = -0.45 + p;
          lShoulderRotZ = -0.4;
          lElbowRotX = 1.35;
          lWristRotX = -0.5;
          lWristRotY = 0.3;

          headGroup.rotation.z = 0.12; // Inquisitive head tilt
          headGroup.rotation.x = -0.05;
          break;
        }

        case 'WELCOME': {
          // Both arms spread wide open gracefully
          const w = Math.sin(t * 2.2) * 0.1;
          rShoulderRotX = -0.35 + w;
          rShoulderRotZ = 0.95;
          rElbowRotX = 0.85;
          rWristRotY = -0.4;

          lShoulderRotX = -0.35 + w;
          lShoulderRotZ = -0.95;
          lElbowRotX = 0.85;
          lWristRotY = 0.4;

          headGroup.rotation.y = Math.sin(t * 1.8) * 0.1;
          break;
        }

        case 'YES_AFFIRM': {
          // Right hand forms fist and nods rhythmically down and up
          const nod = Math.sin(t * 5.0);
          rShoulderRotX = -0.65;
          rShoulderRotZ = 0.25;
          rElbowRotX = 1.6;
          rWristRotX = 0.5 + nod * 0.35;
          headGroup.rotation.x = 0.1 + nod * 0.08;
          break;
        }

        case 'POINT_YOU': {
          // Index finger extends forward toward conversational partner
          rShoulderRotX = -0.75;
          rShoulderRotY = -0.15;
          rShoulderRotZ = 0.18;
          rElbowRotX = 0.85;
          rWristRotX = 0.15;
          break;
        }

        case 'LOVE': {
          // I Love You sign (raised hand, chest proximity, ILY handshape)
          rShoulderRotX = -0.85;
          rShoulderRotZ = 0.3;
          rElbowRotX = 1.95;
          rWristRotX = 0.25;
          rWristRotZ = 0.15;
          headGroup.rotation.z = -0.08;
          break;
        }

        case 'HELP': {
          // Left hand supports bottom of right hand, lifting together
          lShoulderRotX = -0.5;
          lShoulderRotZ = -0.25;
          lElbowRotX = 1.5;
          lWristRotX = -0.6; // Flat palm up

          rShoulderRotX = -0.5;
          rShoulderRotZ = 0.15;
          rElbowRotX = 1.6;
          rWristRotX = 0.2;
          break;
        }

        case 'TIME': {
          // Right hand taps left wrist
          lShoulderRotX = -0.4;
          lShoulderRotZ = -0.3;
          lElbowRotX = 1.6;

          rShoulderRotX = -0.6;
          rShoulderRotZ = 0.35;
          rShoulderRotY = -0.3;
          rElbowRotX = 1.85;
          rWristRotX = 0.3 + Math.sin(t * 6.0) * 0.2;
          break;
        }

        case 'IDLE':
        default: {
          // Natural resting stance with gentle sway
          const sway = Math.sin(t * 1.2) * 0.03;
          rShoulderRotX = -0.15 + sway;
          rShoulderRotZ = 0.22;
          rElbowRotX = 0.45;

          lShoulderRotX = -0.15 - sway;
          lShoulderRotZ = -0.22;
          lElbowRotX = 0.45;
          break;
        }
      }

      // Smooth exponential damping applied to all joints (Silky-smooth weight)
      const dampFactor = 0.12;
      rightArm.shoulderPivot.rotation.x += (rShoulderRotX - rightArm.shoulderPivot.rotation.x) * dampFactor;
      rightArm.shoulderPivot.rotation.y += (rShoulderRotY - rightArm.shoulderPivot.rotation.y) * dampFactor;
      rightArm.shoulderPivot.rotation.z += (rShoulderRotZ - rightArm.shoulderPivot.rotation.z) * dampFactor;
      rightArm.elbowPivot.rotation.x += (rElbowRotX - rightArm.elbowPivot.rotation.x) * dampFactor;
      rightArm.elbowPivot.rotation.y += (rElbowRotY - rightArm.elbowPivot.rotation.y) * dampFactor;
      rightArm.wristPivot.rotation.x += (rWristRotX - rightArm.wristPivot.rotation.x) * dampFactor;
      rightArm.wristPivot.rotation.y += (rWristRotY - rightArm.wristPivot.rotation.y) * dampFactor;
      rightArm.wristPivot.rotation.z += (rWristRotZ - rightArm.wristPivot.rotation.z) * dampFactor;

      leftArm.shoulderPivot.rotation.x += (lShoulderRotX - leftArm.shoulderPivot.rotation.x) * dampFactor;
      leftArm.shoulderPivot.rotation.y += (lShoulderRotY - leftArm.shoulderPivot.rotation.y) * dampFactor;
      leftArm.shoulderPivot.rotation.z += (lShoulderRotZ - leftArm.shoulderPivot.rotation.z) * dampFactor;
      leftArm.elbowPivot.rotation.x += (lElbowRotX - leftArm.elbowPivot.rotation.x) * dampFactor;
      leftArm.elbowPivot.rotation.y += (lElbowRotY - leftArm.elbowPivot.rotation.y) * dampFactor;
      leftArm.wristPivot.rotation.x += (lWristRotX - leftArm.wristPivot.rotation.x) * dampFactor;
      leftArm.wristPivot.rotation.y += (lWristRotY - leftArm.wristPivot.rotation.y) * dampFactor;
      leftArm.wristPivot.rotation.z += (lWristRotZ - leftArm.wristPivot.rotation.z) * dampFactor;

      renderer.render(scene, camera);
    };

    tick();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 10. Clean Unmount Disposal
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[420px] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full min-h-[420px]" />

      {/* WebGL Fallback if device does not support hardware/software WebGL */}
      {!webGlAvailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[var(--surface)] text-center">
          <p className="font-display text-xl text-[var(--brand-coral)] mb-2">3D Acceleration Unavailable</p>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            Interactive 3D sign-avatar requires WebGL support. Sign tokens and text translations remain fully functional.
          </p>
        </div>
      )}

      {/* Real-time Subtitle / Token Badge (Top Center, minimal & clean) */}
      {subtitle && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-[var(--surface)] border border-[var(--border)] px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[var(--brand-coral)] shadow-sm">
            {subtitle}
          </div>
        </div>
      )}

      {/* Active Gesture & Status Tag (Top-left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--brand-coral)]" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
          AVATAR / {activeGesture}
        </span>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROL DOCK (Three.js Skill Rule: No side cards) */}
      {interactive && (
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-md transition-all duration-300 ease-out`}
        >
          {/* Collapse/Expand Toggle Tab */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-0.5 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
              title="Toggle Viewport Controls"
            >
              {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isCollapsed ? 'Show Controls' : 'Hide Controls'}
            </button>
          </div>

          {/* Unified Compact Horizontal Dock */}
          {!isCollapsed && (
            <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 flex items-center justify-between gap-3 text-xs shadow-md">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1 text-[var(--text-primary)] hover:text-[var(--brand-coral)] cursor-pointer px-1 py-0.5"
                title={isPlaying ? 'Pause Animation' : 'Play Animation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="font-mono text-[11px] uppercase">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <div className="h-4 w-px bg-[var(--border)]" />

              {/* Speed Multiplier */}
              <div className="flex items-center gap-1">
                <FastForward className="w-3 h-3 text-[var(--text-secondary)]" />
                {[0.75, 1.0, 1.25].map(s => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`font-mono text-[10px] px-1.5 py-0.5 cursor-pointer transition-colors ${
                      playbackSpeed === s
                        ? 'bg-[var(--text-primary)] text-[var(--background)] font-bold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-[var(--border)]" />

              {/* Camera Perspective Angle */}
              <button
                onClick={() => {
                  setCameraAngle(prev => (prev === 'front' ? 'threeQuarter' : prev === 'threeQuarter' ? 'closeUp' : 'front'));
                }}
                className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer px-1 py-0.5"
                title="Switch Camera View Angle"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase">{cameraAngle}</span>
              </button>

              <div className="h-4 w-px bg-[var(--border)]" />

              {/* Reset to Idle */}
              <button
                onClick={() => setActiveGesture('IDLE')}
                className="text-[var(--text-secondary)] hover:text-[var(--brand-coral)] cursor-pointer"
                title="Reset Avatar to Idle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
