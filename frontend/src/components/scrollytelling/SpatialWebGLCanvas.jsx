import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Color themes per chapter
const CHAPTER_COLORS = {
  hero: { primary: 0xff6f61, secondary: 0x6fa3ef, core: 0xff8f84 },
  purpose: { primary: 0x6fa3ef, secondary: 0xff6f61, core: 0x9dc4f5 },
  'text-to-sign': { primary: 0xffc107, secondary: 0x6fa3ef, core: 0xffe082 },
  'sign-to-text': { primary: 0x10b981, secondary: 0x38bdf8, core: 0x6ee7b7 },
  'voice-navigation': { primary: 0xa855f7, secondary: 0xff6f61, core: 0xd8b4fe },
  'privacy-security': { primary: 0xffc107, secondary: 0x94a3b8, core: 0xfffbeb },
  standards: { primary: 0x38bdf8, secondary: 0x10b981, core: 0x7dd3fc },
  'get-started': { primary: 0xff6f61, secondary: 0xa855f7, core: 0xffa299 },
};

/**
 * Generates all 32 vertices and 80 edges of a 5D hypercube (Penteract).
 * When the 5th coordinate is collapsed to 0, it dynamically becomes a 4D hypercube (Tesseract).
 */
function create5DHypercubeTopology() {
  const vertices = [];
  // 32 vertices: (x, y, z, w, v) where each is -1 or +1
  for (let i = 0; i < 32; i++) {
    const x = (i & 1) ? 1 : -1;
    const y = (i & 2) ? 1 : -1;
    const z = (i & 4) ? 1 : -1;
    const w = (i & 8) ? 1 : -1;
    const v = (i & 16) ? 1 : -1;
    vertices.push([x, y, z, w, v]);
  }

  // 80 edges: connect vertices that differ in exactly 1 bit
  const edges = [];
  for (let i = 0; i < 32; i++) {
    for (let j = i + 1; j < 32; j++) {
      let diff = 0;
      for (let k = 0; k < 5; k++) {
        if (vertices[i][k] !== vertices[j][k]) diff++;
      }
      if (diff === 1) {
        edges.push([i, j]);
      }
    }
  }

  return { vertices, edges };
}

export default function SpatialWebGLCanvas({ activeSection = 'hero' }) {
  const containerRef = useRef(null);
  const activeColorRef = useRef(CHAPTER_COLORS.hero);

  useEffect(() => {
    activeColorRef.current = CHAPTER_COLORS[activeSection] || CHAPTER_COLORS.hero;
  }, [activeSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 20);

    // =====================================================================
    // 1. 4D / 5D DYNAMIC HYPERCUBE (Tesseract to Penteract Projection Engine)
    // =====================================================================
    const hypercubeData = create5DHypercubeTopology();
    const hypercubeGroup = new THREE.Group();
    // Position the hypercube in an elegant spatial depth offset
    hypercubeGroup.position.set(6.5, 0.5, -4);
    scene.add(hypercubeGroup);

    // Dynamic Edge Lines
    const edgeCount = hypercubeData.edges.length; // 80 edges
    const linePositions = new Float32Array(edgeCount * 2 * 3);
    const lineColors = new Float32Array(edgeCount * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5,
    });
    const hypercubeLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    hypercubeGroup.add(hypercubeLines);

    // Glowing Vertex Beacon Spheres
    const vertexGroup = new THREE.Group();
    hypercubeGroup.add(vertexGroup);

    const sphereGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xff6f61,
      transparent: true,
      opacity: 0.85,
    });
    const vertexMeshes = [];
    for (let i = 0; i < 32; i++) {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat.clone());
      vertexGroup.add(mesh);
      vertexMeshes.push(mesh);
    }

    // Central Singularity Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x6fa3ef,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    hypercubeGroup.add(coreMesh);

    // Secondary Left Dimensional Echo Ring (4D Shadow Torus)
    const echoTorusGeo = new THREE.TorusGeometry(4.2, 0.035, 16, 90);
    const echoTorusMat = new THREE.MeshBasicMaterial({
      color: 0xff6f61,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const echoTorus = new THREE.Mesh(echoTorusGeo, echoTorusMat);
    echoTorus.position.set(-6.2, -1.8, -6);
    scene.add(echoTorus);

    // =====================================================================
    // 2. CREATIVE PARTICLE ENGINE: Synaptic Streams & Celestial Constellation
    // =====================================================================
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleOriginals = [];

    const palette = [
      new THREE.Color(0xff6f61),
      new THREE.Color(0x6fa3ef),
      new THREE.Color(0xffc107),
      new THREE.Color(0x10b981),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x38bdf8),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create a double-helical Lissajous ribbon flow across the viewport
      const t = (i / particleCount) * Math.PI * 6;
      const radius = 6 + Math.sin(t * 1.5) * 3.5;
      const px = Math.cos(t) * radius + (Math.random() - 0.5) * 6;
      const py = Math.sin(t * 1.2) * 5 + (Math.random() - 0.5) * 4;
      const pz = (i / particleCount - 0.5) * 22 + (Math.random() - 0.5) * 5;

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleOriginals.push({
        x: px,
        y: py,
        z: pz,
        angle: t,
        speed: 0.2 + Math.random() * 0.4,
        drift: Math.random() * Math.PI * 2,
      });

      const col = palette[i % palette.length];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.26,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Mouse Tracking with Spring Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize Handler
    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // =====================================================================
    // 3. 4D/5D PROJECTION & ANIMATION LOOP
    // =====================================================================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      camera.position.x = mouseX * 2.2;
      camera.position.y = -mouseY * 1.8;
      camera.lookAt(0, 0, 0);

      // Chapter Color Target
      const activeColor = activeColorRef.current;
      const targetColor = new THREE.Color(activeColor.primary);
      const secColor = new THREE.Color(activeColor.secondary);

      // Dimension Transition Modulation:
      // Smoothly oscillates between 4D Tesseract (dimWeight ~ 0) and 5D Penteract (dimWeight ~ 1)
      const dimWeight = (Math.sin(elapsed * 0.45) + 1) * 0.5; // 0.0 to 1.0

      // 4D / 5D Rotation Angles
      const rotXW = elapsed * 0.55;
      const rotYW = elapsed * 0.42;
      const rotZW = elapsed * 0.35;
      const rotZV = elapsed * 0.28;

      // Cos / Sin Pre-computations
      const cosXW = Math.cos(rotXW), sinXW = Math.sin(rotXW);
      const cosYW = Math.cos(rotYW), sinYW = Math.sin(rotYW);
      const cosZW = Math.cos(rotZW), sinZW = Math.sin(rotZW);
      const cosZV = Math.cos(rotZV), sinZV = Math.sin(rotZV);

      const projected3D = [];
      const hyperScale = 2.4;

      // Project each of the 32 5D vertices into 3D
      for (let i = 0; i < 32; i++) {
        let [x, y, z, w, v] = hypercubeData.vertices[i];

        // Modulate 5th dimension amplitude (morphing between 4D and 5D!)
        v = v * dimWeight;

        // 1. Rotate in X-W plane
        let x1 = x * cosXW - w * sinXW;
        let w1 = x * sinXW + w * cosXW;

        // 2. Rotate in Y-W plane
        let y2 = y * cosYW - w1 * sinYW;
        let w2 = y * sinYW + w1 * cosYW;

        // 3. Rotate in Z-W plane
        let z3 = z * cosZW - w2 * sinZW;
        let w3 = z * sinZW + w2 * cosZW;

        // 4. Rotate in Z-V plane (5th dimension rotation)
        let z4 = z3 * cosZV - v * sinZV;
        let v4 = z3 * sinZV + v * cosZV;

        // Perspective Stereographic 5D -> 4D -> 3D Projection
        const dist4D = 2.6 - w3 * 0.45;
        const dist5D = 3.0 - v4 * 0.4;
        const totalDist = dist4D * (1 + (dist5D - 3.0) * 0.35);

        const projX = (x1 / totalDist) * hyperScale;
        const projY = (y2 / totalDist) * hyperScale;
        const projZ = (z4 / totalDist) * hyperScale;

        projected3D.push(projX, projY, projZ);

        // Update vertex sphere position and visibility
        const sphereMesh = vertexMeshes[i];
        if (sphereMesh) {
          sphereMesh.position.set(projX, projY, projZ);
          // Scale vertex spheres based on whether 5th dimension is active
          const isFifthDimVertex = i >= 16;
          sphereMesh.visible = !isFifthDimVertex || dimWeight > 0.08;
          sphereMesh.scale.setScalar(isFifthDimVertex ? 0.7 + dimWeight * 0.3 : 1.0);
          sphereMesh.material.color.lerp(isFifthDimVertex ? secColor : targetColor, 0.08);
        }
      }

      // Update Lines connecting the 80 edges
      const linePosAttr = lineGeometry.attributes.position;
      const lineColAttr = lineGeometry.attributes.color;

      for (let e = 0; e < edgeCount; e++) {
        const [v1, v2] = hypercubeData.edges[e];
        const is5DEdge = v1 >= 16 || v2 >= 16;

        const idx1 = v1 * 3;
        const idx2 = v2 * 3;

        const p1x = projected3D[idx1];
        const p1y = projected3D[idx1 + 1];
        const p1z = projected3D[idx1 + 2];

        const p2x = projected3D[idx2];
        const p2y = projected3D[idx2 + 1];
        const p2z = projected3D[idx2 + 2];

        const lineIdx = e * 6;
        linePosAttr.array[lineIdx] = p1x;
        linePosAttr.array[lineIdx + 1] = p1y;
        linePosAttr.array[lineIdx + 2] = p1z;
        linePosAttr.array[lineIdx + 3] = p2x;
        linePosAttr.array[lineIdx + 4] = p2y;
        linePosAttr.array[lineIdx + 5] = p2z;

        // Alpha/fade for 5th dimensional edges
        const edgeBrightness = is5DEdge ? dimWeight * 0.8 : 1.0;
        const c = is5DEdge ? secColor : targetColor;

        lineColAttr.setXYZ(e * 2, c.r * edgeBrightness, c.g * edgeBrightness, c.b * edgeBrightness);
        lineColAttr.setXYZ(e * 2 + 1, c.r * edgeBrightness, c.g * edgeBrightness, c.b * edgeBrightness);
      }
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Rotate Hypercube Group in 3D Space
      hypercubeGroup.rotation.y = elapsed * 0.12;
      hypercubeGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.35;
      hypercubeGroup.rotation.z = Math.cos(elapsed * 0.1) * 0.2;

      // Core pulsating Singularity
      const coreScale = 0.85 + Math.sin(elapsed * 2.5) * 0.18;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      coreMesh.rotation.y = -elapsed * 0.4;
      coreMesh.rotation.x = elapsed * 0.3;
      coreMat.color.lerp(targetColor, 0.05);

      // Secondary Echo Torus
      echoTorus.rotation.x = elapsed * 0.22;
      echoTorus.rotation.y = -elapsed * 0.18;
      echoTorusMat.color.lerp(secColor, 0.05);

      // Animate Particles with Wave Dispersion & Mouse Repulsion
      const pPosAttr = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const orig = particleOriginals[i];
        const timeOffset = elapsed * orig.speed + orig.drift;

        // Wave Lissajous progression
        let curX = orig.x + Math.sin(timeOffset) * 0.8;
        let curY = orig.y + Math.cos(timeOffset * 1.3) * 0.6;
        let curZ = orig.z + Math.sin(timeOffset * 0.7) * 0.8;

        // Interactive mouse gravitas
        const dx = curX - mouseX * 8;
        const dy = curY + mouseY * 6;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4.5) {
          const force = (4.5 - dist) * 0.28;
          curX += (dx / dist) * force;
          curY += (dy / dist) * force;
        }

        pPosAttr.setXYZ(i, curX, curY, curZ);
      }
      pPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      lineGeometry.dispose();
      lineMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      echoTorusGeo.dispose();
      echoTorusMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="spatial-webgl-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
