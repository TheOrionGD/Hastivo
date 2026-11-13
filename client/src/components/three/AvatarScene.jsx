import { Suspense, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import avatarAsset from "@/assets/hastivo-avatar.glb.asset.json";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { AIM_JOINTS, OFFSET_JOINTS, sampleAvatarGesture } from "@/animations/avatarGestures";

// Supported Mixamo & Procedural Avatar Models
export const AVATAR_MODELS = {
  "x-bot": {
    id: "x-bot",
    name: "X-Bot (Female Kinematic Rig)",
    type: "fbx",
    path: "/models/X_Bot.fbx",
    scale: 0.024,
    yOffset: -1.75,
  },
  "y-bot": {
    id: "y-bot",
    name: "Y-Bot (Male Kinematic Rig)",
    type: "fbx",
    path: "/models/Y_Bot.fbx",
    scale: 0.024,
    yOffset: -1.75,
  },
  "default": {
    id: "default",
    name: "Standard Procedural Rig",
    type: "gltf",
    path: avatarAsset.url,
    scale: 1.0,
    yOffset: 0.0,
  },
};

function KinematicAvatar({ pointer, reduced, stage, modelType = "x-bot" }) {
  const root = useRef(null);
  const rig = useRef([]);
  const time = useRef(0);
  const ready = useRef(false);
  const [loadedScene, setLoadedScene] = useState(null);

  const offset = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const tmp = useMemo(
    () => ({
      ref: new THREE.Quaternion(),
      parent: new THREE.Quaternion(),
      aim: new THREE.Quaternion(),
      dir: new THREE.Vector3(),
    }),
    [],
  );
  const { camera, size } = useThree();

  const activeConfig = AVATAR_MODELS[modelType] || AVATAR_MODELS["x-bot"];

  useEffect(() => {
    let active = true;
    if (activeConfig.type === "fbx") {
      const loader = new FBXLoader();
      loader.load(
        activeConfig.path,
        (fbx) => {
          if (!active) return;
          fbx.updateMatrixWorld(true);
          const bounds = new THREE.Box3().setFromObject(fbx);
          const extent = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 2.8 / Math.max(extent.y, 0.001);
          const normalized = new THREE.Group();
          fbx.scale.multiplyScalar(scale);
          fbx.position.sub(center.multiplyScalar(scale));
          normalized.add(fbx);

          // Apply PBR Materials
          fbx.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material = new THREE.MeshStandardMaterial({
                color: modelType === "x-bot" ? 0x22d3ee : 0xf97316,
                roughness: 0.35,
                metalness: 0.25,
              });
            }
          });

          setLoadedScene({
            scene: normalized,
            width: extent.x * scale,
            height: extent.y * scale,
          });
        },
        undefined,
        (err) => {
          console.warn("FBX load fallback to GLTF:", err);
          const gltfLoader = new GLTFLoader();
          gltfLoader.load(avatarAsset.url, (gltf) => {
            if (!active) return;
            const scene = clone(gltf.scene);
            scene.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(scene);
            const extent = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const scale = 2.8 / Math.max(extent.y, 0.001);
            const normalized = new THREE.Group();
            scene.scale.multiplyScalar(scale);
            scene.position.sub(center.multiplyScalar(scale));
            normalized.add(scene);
            setLoadedScene({
              scene: normalized,
              width: extent.x * scale,
              height: extent.y * scale,
            });
          });
        },
      );
    } else {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(activeConfig.path, (gltf) => {
        if (!active) return;
        const scene = clone(gltf.scene);
        scene.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(scene);
        const extent = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 2.8 / Math.max(extent.y, 0.001);
        const normalized = new THREE.Group();
        scene.scale.multiplyScalar(scale);
        scene.position.sub(center.multiplyScalar(scale));
        normalized.add(scene);
        setLoadedScene({
          scene: normalized,
          width: extent.x * scale,
          height: extent.y * scale,
        });
      });
    }

    return () => {
      active = false;
    };
  }, [modelType, activeConfig]);

  useLayoutEffect(() => {
    if (!loadedScene) return;
    const joints = [];
    const names = [...AIM_JOINTS, ...OFFSET_JOINTS];
    loadedScene.scene.updateMatrixWorld(true);
    const refInv = loadedScene.scene.getWorldQuaternion(new THREE.Quaternion()).invert();
    const refMatInv = loadedScene.scene.matrixWorld.clone().invert();

    loadedScene.scene.traverse((node) => {
      if (!node.isBone) return;
      // Match bone names in both Mixamo rig (mixamorigRightArm) and glTF rigs
      const cleanName = node.name.replace("mixamorig", "").replace(":", "_");
      const matched = names.find((part) => cleanName.toLowerCase().includes(part.toLowerCase()));
      if (!matched) return;

      const joint = {
        node,
        name: matched,
        base: node.quaternion.clone(),
        aim: AIM_JOINTS.includes(matched),
      };

      if (joint.aim) {
        const child = node.children.find((c) => c.isBone);
        if (child) {
          const from = node.getWorldPosition(new THREE.Vector3()).applyMatrix4(refMatInv);
          const to = child.getWorldPosition(new THREE.Vector3()).applyMatrix4(refMatInv);
          joint.bindDir = to.sub(from).normalize();
          joint.bindQuat = refInv.clone().multiply(node.getWorldQuaternion(new THREE.Quaternion()));
        }
      }
      joints.push(joint);
    });

    joints.sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name));
    rig.current = joints;
    ready.current = false;
    time.current = 0;

    return () => {
      rig.current = [];
    };
  }, [loadedScene]);

  const distance = useMemo(() => {
    if (!loadedScene) return 4.5;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const aspect = size.width / Math.max(size.height, 1);
    const gestureWidth = loadedScene.width * 0.7;
    return (
      Math.max(
        loadedScene.height / 2 / Math.tan(halfFov),
        gestureWidth / 2 / (Math.tan(halfFov) * aspect),
      ) * 1.15
    );
  }, [camera.fov, size.width, size.height, loadedScene]);

  useFrame((state, delta) => {
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    if (!root.current || !loadedScene) return;

    const dt = Math.min(delta, 0.05);
    if (!reduced) time.current += dt;
    const t = time.current;
    const pose = sampleAvatarGesture(t, reduced);

    loadedScene.scene.updateWorldMatrix(true, false);
    loadedScene.scene.getWorldQuaternion(tmp.ref).invert();

    for (const joint of rig.current) {
      const { node, name, base } = joint;
      if (joint.aim && joint.bindDir && joint.bindQuat && node.parent) {
        node.parent.updateWorldMatrix(true, false);
        node.parent.getWorldQuaternion(tmp.parent).premultiply(tmp.ref);
        tmp.aim
          .setFromUnitVectors(joint.bindDir, tmp.dir.set(...pose[name]))
          .multiply(joint.bindQuat);
        node.quaternion.copy(tmp.parent.invert().multiply(tmp.aim));
      } else if (pose[name]) {
        euler.set(...pose[name]);
        offset.setFromEuler(euler);
        node.quaternion.copy(base).multiply(offset);
      }
    }

    root.current.rotation.y = reduced
      ? 0
      : THREE.MathUtils.damp(
          root.current.rotation.y,
          pointer.current.x * 0.22 + Math.sin(t * 0.35) * 0.06,
          3,
          dt,
        );
    root.current.position.y = 0;

    if (!ready.current && stage.current) {
      if (time.current > 0 || reduced) {
        stage.current.dataset.sceneReady = "true";
        ready.current = true;
      }
    }
    if (stage.current) stage.current.dataset.gestureTime = t.toFixed(2);
  });

  if (!loadedScene) return null;

  return (
    <group ref={root}>
      <primitive object={loadedScene.scene} dispose={null} />
    </group>
  );
}

export default function AvatarScene({ className = "", onReady, modelType = "x-bot" }) {
  const pointer = useRef({ x: 0, y: 0 });
  const stage = useRef(null);
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={stage}
      className={className}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        if (!r.width || !r.height) return;
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        };
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => onReady?.()}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[2.5, 3, 4]} intensity={3.5} />
        <directionalLight position={[-3, 1, 2]} intensity={2.2} />
        <Suspense fallback={null}>
          <KinematicAvatar
            pointer={pointer}
            reduced={reduced}
            stage={stage}
            modelType={modelType}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
