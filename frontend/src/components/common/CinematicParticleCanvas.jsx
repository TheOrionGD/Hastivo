import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   GLSL SHADERS FOR CINEMATIC PARTICLES (Center Clump Removed & Reduced Intensity)
   Calculated 100% on the GPU for 60 FPS performance.
   ═══════════════════════════════════════════════════════════════════════════ */

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aAlpha;
  attribute float aType; // 1.0 = Stars, 2.0 = Orbits, 3.0 = Satellites
  attribute vec3 aRandom;
  attribute float aPhase;

  varying float vAlpha;

  // 3D Simplex Noise Implementation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec3 pos = position;
    float time = uTime * 0.08;

    if (aType < 1.5) {
      // ── OUTER SPARSE STARS (Drifting background universe) ──
      float slowTime = time * 0.03;
      pos.x += sin(slowTime + aPhase) * 1.5;
      pos.y += cos(slowTime * 0.8 + aPhase) * 1.5;
      pos.z += sin(slowTime * 0.5 + aRandom.y) * 1.0;
    }
    else if (aType < 2.5) {
      // ── PARTICLE ORBIT RINGS (Sparse perimeter rings with gentle wobble) ──
      float ringSpeed = (0.003 + aRandom.x * 0.004) * (aRandom.y > 0.0 ? 1.0 : -1.0);
      float rotAngle = uTime * ringSpeed;
      
      float cosA = cos(rotAngle);
      float sinA = sin(rotAngle);
      
      vec2 rotPos;
      rotPos.x = pos.x * cosA - pos.z * sinA;
      rotPos.y = pos.x * sinA + pos.z * cosA;
      pos.x = rotPos.x;
      pos.z = rotPos.y;

      // Subtle noise wobble
      float wobble = snoise(pos * 0.015 + vec3(uTime * 0.04)) * 2.0;
      pos += normalize(pos) * wobble;
    }
    else {
      // ── SATELLITE CLUSTERS (Fuzzy spherical clusters orbiting perimeter) ──
      float orbitSpeed = 0.003 + aRandom.z * 0.003;
      float angle = uTime * orbitSpeed + aPhase;
      float radius = length(pos.xz);
      
      pos.x = cos(angle) * radius + sin(uTime * 0.08 + aPhase) * 1.2;
      pos.z = sin(angle) * radius + cos(uTime * 0.08 + aPhase) * 1.2;
      pos.y += sin(uTime * 0.12 + aRandom.x) * 1.0;
    }

    // Subtle gentle mouse attraction
    vec2 mDist = uMouse * 40.0 - pos.xy;
    float dist = length(mDist);
    if (dist < 30.0) {
      float force = (30.0 - dist) / 30.0;
      pos.xy += normalize(mDist) * force * 2.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Particle sizing: gentle subtle stardust
    float pSize = aSize * uPixelRatio * (140.0 / -mvPosition.z);
    gl_PointSize = clamp(pSize, 1.0, 3.2);

    // Alpha: gentle ambient shimmer
    float shimmer = aAlpha * (0.60 + 0.25 * sin(uTime * 1.0 + aPhase));
    vAlpha = clamp(shimmer * (90.0 / -mvPosition.z), 0.12, 0.65);
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) discard;

    // Soft gaussian halo falloff with high visibility
    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;

    // Crisp luminous silver-white stardust
    vec3 color = vec3(0.92, 0.95, 1.0);

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const CinematicParticleCanvas = ({ forceEnable = false }) => {
  const location = useLocation();
  const containerRef = useRef(null);

  const isSplash = !forceEnable && (location.pathname === '/' || location.pathname === '/splash');

  useEffect(() => {
    if (isSplash) return;
    const container = containerRef.current;
    if (!container) return;

    // ── 1. Scene & Camera Setup ──────────────────────────────────────────
    const scene = new THREE.Scene();

    const w = container.offsetWidth || window.innerWidth;
    const h = container.offsetHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── 2. Particle Geometry Construction (Reduced Count for Clean Minimalist Depth) ──
    const STARS_COUNT = 1500;
    const ORBIT_COUNT = 2500;
    const SATELLITE_COUNT = 800;
    const TOTAL_COUNT = STARS_COUNT + ORBIT_COUNT + SATELLITE_COUNT;

    const positions = new Float32Array(TOTAL_COUNT * 3);
    const sizes = new Float32Array(TOTAL_COUNT);
    const alphas = new Float32Array(TOTAL_COUNT);
    const types = new Float32Array(TOTAL_COUNT);
    const randoms = new Float32Array(TOTAL_COUNT * 3);
    const phases = new Float32Array(TOTAL_COUNT);

    let idx = 0;

    // A) Outer Stars (Distributed in deep space, leaving center open)
    for (let i = 0; i < STARS_COUNT; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const r = 32 + Math.random() * 85;

      positions[idx * 3] = Math.cos(u) * Math.cos(v) * r;
      positions[idx * 3 + 1] = Math.sin(v) * r;
      positions[idx * 3 + 2] = Math.sin(u) * Math.cos(v) * r;

      sizes[idx] = 0.8 + Math.random() * 1.2;
      alphas[idx] = 0.45 + Math.random() * 0.45;
      types[idx] = 1.0;
      phases[idx] = Math.random() * Math.PI * 2;

      randoms[idx * 3] = Math.random() - 0.5;
      randoms[idx * 3 + 1] = Math.random() - 0.5;
      randoms[idx * 3 + 2] = Math.random() - 0.5;

      idx++;
    }

    // B) Particle Orbits (Perimeter rings rotating in space, center open)
    const RINGS = [
      { r: 35, spread: 2.5 },
      { r: 50, spread: 3.2 },
      { r: 68, spread: 4.2 },
      { r: 86, spread: 5.0 },
    ];

    for (let i = 0; i < ORBIT_COUNT; i++) {
      const ring = RINGS[i % RINGS.length];
      const angle = (i / ORBIT_COUNT) * Math.PI * 2 * 3 + (Math.random() - 0.5) * 0.15;
      const jitter = (Math.random() - 0.5) * ring.spread;

      positions[idx * 3] = Math.cos(angle) * (ring.r + jitter);
      positions[idx * 3 + 1] = (Math.random() - 0.5) * ring.spread * 0.8;
      positions[idx * 3 + 2] = Math.sin(angle) * (ring.r + jitter);

      sizes[idx] = 0.9 + Math.random() * 1.3;
      alphas[idx] = i % 8 === 0 ? 0.85 : 0.50;
      types[idx] = 2.0;
      phases[idx] = Math.random() * Math.PI * 2;

      randoms[idx * 3] = Math.random() - 0.5;
      randoms[idx * 3 + 1] = Math.random() - 0.5;
      randoms[idx * 3 + 2] = Math.random() - 0.5;

      idx++;
    }

    // C) Satellite Clusters (Outer corners & edges, leaving center clear)
    const CLUSTER_CENTERS = [
      { x: -45, y: 22, z: -15 },
      { x: 48, y: -24, z: 18 },
      { x: -35, y: -28, z: 22 },
      { x: 42, y: 30, z: -20 },
      { x: 0, y: 46, z: -28 },
      { x: 0, y: -44, z: 28 },
    ];

    for (let i = 0; i < SATELLITE_COUNT; i++) {
      const center = CLUSTER_CENTERS[i % CLUSTER_CENTERS.length];
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const r = Math.pow(Math.random(), 0.5) * 5.5;

      positions[idx * 3] = center.x + Math.cos(u) * Math.cos(v) * r;
      positions[idx * 3 + 1] = center.y + Math.sin(v) * r;
      positions[idx * 3 + 2] = center.z + Math.sin(u) * Math.cos(v) * r;

      sizes[idx] = 0.9 + Math.random() * 1.4;
      alphas[idx] = 0.50 + Math.random() * 0.45;
      types[idx] = 3.0;
      phases[idx] = Math.random() * Math.PI * 2;

      randoms[idx * 3] = Math.random() - 0.5;
      randoms[idx * 3 + 1] = Math.random() - 0.5;
      randoms[idx * 3 + 2] = Math.random() - 0.5;

      idx++;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('aType', new THREE.BufferAttribute(types, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    // ── 3. Custom Shader Material ────────────────────────────────────────
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // ── 4. Interaction & Motion Controls ─────────────────────────────────
    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
    };
    window.addEventListener('resize', handleResize);

    // ── 5. Render Loop (Target 60 FPS) ───────────────────────────────────
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth damping for mouse
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.03;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.03;

      uniforms.uTime.value = elapsedTime;
      uniforms.uMouse.value.copy(currentMouse);

      // Slow floating camera oscillation
      camera.position.x = Math.sin(elapsedTime * 0.2) * 0.25 + currentMouse.x * 0.9;
      camera.position.y = Math.cos(elapsedTime * 0.16) * 0.2 + currentMouse.y * 0.7;
      camera.position.z = 75 + Math.sin(elapsedTime * 0.12) * 0.14;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isSplash]);

  if (isSplash) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="global-cinematic-particles"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};

export default CinematicParticleCanvas;
