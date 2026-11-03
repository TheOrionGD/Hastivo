/**
 * Signora Procedural Mechanical Hand Engine
 * Authentically reconstructed based on reference robotic hand:
 * - Broad, clearly visible sculpted central mechanical palm
 * - Distinct, visible mechanical knuckle hinge sockets
 * - 5 distinct articulated digits (Thumb, Index, Middle, Ring, Little)
 * - Middle finger is the longest, little finger shortest
 * - Wide lateral finger spacing with zero overlapping or compression
 * - Thumb positioned on distinct lateral thenar swivel mount, separated diagonally outward
 * - 3 independently controllable mechanical phalangeal segments per digit (MCP, PIP, DIP)
 * - Tapered silver-grey robotic shells with dark titanium knuckle hinge connectors
 * - Independent THREE.Bone hierarchy for left and right hands with precise mirroring
 */
import * as THREE from 'three';

// Digit anatomical scaling & spacing specifications (calibrated for Right Hand, mirrored for Left)
export const DIGIT_SPECS = {
  thumb: {
    name: 'Thumb',
    lengthScale: 0.82,
    radiusScale: 1.20,
    spreadAngle: -0.75, // 43° lateral outward abduction from palm
    baseOffset: new THREE.Vector3(-0.052, 0.018, 0.010), // Protruding thenar mount
    segments: [
      { length: 0.034, radiusBase: 0.0150, radiusTip: 0.0135 }, // Metacarpal / Base
      { length: 0.028, radiusBase: 0.0135, radiusTip: 0.0125 }, // Proximal
      { length: 0.024, radiusBase: 0.0125, radiusTip: 0.0100 }  // Distal tip
    ]
  },
  index: {
    name: 'Index',
    lengthScale: 1.0,
    radiusScale: 1.0,
    spreadAngle: -0.09, // Slight outward fan-out
    baseOffset: new THREE.Vector3(-0.028, 0.080, 0.002),
    segments: [
      { length: 0.042, radiusBase: 0.0125, radiusTip: 0.0115 }, // Proximal
      { length: 0.033, radiusBase: 0.0115, radiusTip: 0.0105 }, // Middle
      { length: 0.025, radiusBase: 0.0105, radiusTip: 0.0085 }  // Distal
    ]
  },
  middle: {
    name: 'Middle',
    lengthScale: 1.12, // Longest digit
    radiusScale: 1.04,
    spreadAngle: 0.0,  // Straight vertical
    baseOffset: new THREE.Vector3(-0.002, 0.086, 0.003),
    segments: [
      { length: 0.048, radiusBase: 0.0130, radiusTip: 0.0120 }, // Proximal
      { length: 0.038, radiusBase: 0.0120, radiusTip: 0.0110 }, // Middle
      { length: 0.028, radiusBase: 0.0110, radiusTip: 0.0090 }  // Distal
    ]
  },
  ring: {
    name: 'Ring',
    lengthScale: 1.02,
    radiusScale: 0.98,
    spreadAngle: 0.09, // Outward fan-out
    baseOffset: new THREE.Vector3(0.024, 0.082, 0.002),
    segments: [
      { length: 0.043, radiusBase: 0.0125, radiusTip: 0.0115 }, // Proximal
      { length: 0.034, radiusBase: 0.0115, radiusTip: 0.0105 }, // Middle
      { length: 0.025, radiusBase: 0.0105, radiusTip: 0.0085 }  // Distal
    ]
  },
  little: {
    name: 'Little',
    lengthScale: 0.82, // Shortest digit, set lower on carpal arch
    radiusScale: 0.88,
    spreadAngle: 0.24, // Noticeable outward spread
    baseOffset: new THREE.Vector3(0.048, 0.068, 0.0),
    segments: [
      { length: 0.034, radiusBase: 0.0115, radiusTip: 0.0105 }, // Proximal
      { length: 0.027, radiusBase: 0.0105, radiusTip: 0.0095 }, // Middle
      { length: 0.020, radiusBase: 0.0095, radiusTip: 0.0075 }  // Distal
    ]
  }
};

/**
 * Creates a sculpted mechanical palm chassis with ergonomic bevelled contours
 */
export function createSculptedPalmGeometry(side = 'R') {
  const isRight = side === 'R';
  const mir = isRight ? 1 : -1;

  const shape = new THREE.Shape();
  // Sculpted carpal/metacarpal outline with thenar flare
  // Wrist carpal base
  shape.moveTo(mir * -0.036, -0.052);
  // Thenar flare out to thumb mount
  shape.lineTo(mir * -0.062, -0.012);
  shape.lineTo(mir * -0.058, 0.028);
  // Index knuckle shoulder
  shape.lineTo(mir * -0.042, 0.066);
  // Distal knuckle arch (Index, Middle, Ring, Little)
  shape.lineTo(mir * -0.028, 0.080);
  shape.lineTo(mir * -0.002, 0.086);
  shape.lineTo(mir * 0.024, 0.082);
  shape.lineTo(mir * 0.048, 0.068);
  // Hypothenar outer curve
  shape.lineTo(mir * 0.054, 0.042);
  shape.lineTo(mir * 0.052, -0.018);
  shape.lineTo(mir * 0.038, -0.052);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.026,
    bevelEnabled: true,
    bevelThickness: 0.010,
    bevelSize: 0.010,
    bevelSegments: 4
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates individual tapered mechanical phalanx segment with visible joint socket
 */
export function createPhalanxGeometry(length, radiusBase, radiusTip, isTip = false) {
  const points = [];
  const segments = 20;
  const halfLen = length * 0.5;

  // Base socket rim
  for (let i = 0; i <= 6; i++) {
    const theta = (i / 6) * (Math.PI / 2);
    const r = radiusBase * Math.cos(theta);
    const y = -halfLen - radiusBase * 0.32 * Math.sin(theta);
    points.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  // Tapered manufactured shaft
  points.push(new THREE.Vector2(radiusBase * 0.96, -halfLen * 0.45));
  points.push(new THREE.Vector2((radiusBase + radiusTip) * 0.5, 0.0));
  points.push(new THREE.Vector2(radiusTip * 1.02, halfLen * 0.5));

  // Tip cap (smooth hemisphere for distal fingertip, mechanical seal for intermediate)
  for (let i = 0; i <= 6; i++) {
    const theta = (i / 6) * (Math.PI / 2);
    const r = radiusTip * Math.cos(theta);
    const y = halfLen + (isTip ? radiusTip * 0.85 : radiusTip * 0.32) * Math.sin(theta);
    points.push(new THREE.Vector2(Math.max(0.001, r), y));
  }

  const geom = new THREE.LatheGeometry(points.reverse(), segments);

  // Subtle ergonomic oval cross-section
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    pos.setXYZ(i, x * 1.08, y, z * 0.90);
  }
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates visible mechanical knuckle hinge pin geometry with pivot end caps
 */
export function createKnuckleHingeGroup(radius = 0.012, width = 0.024, materials) {
  const group = new THREE.Group();
  const silverMat = materials.translucentSilver || materials.greyArmor;
  const jointMat = materials.translucentSilver || materials.mechanicalJoint;

  // Translucent silver central hinge pin
  const pinGeom = new THREE.CylinderGeometry(radius, radius, width, 18);
  pinGeom.rotateZ(Math.PI / 2);
  const pinMesh = new THREE.Mesh(pinGeom, jointMat);
  group.add(pinMesh);

  // Concentric end caps (Translucent silver armor detail)
  const capRadius = radius * 1.05;
  const capGeom = new THREE.CylinderGeometry(capRadius, capRadius, width * 0.12, 16);
  capGeom.rotateZ(Math.PI / 2);

  const leftCap = new THREE.Mesh(capGeom, silverMat);
  leftCap.position.x = width * 0.45;
  group.add(leftCap);

  const rightCap = new THREE.Mesh(capGeom, silverMat);
  rightCap.position.x = -width * 0.45;
  group.add(rightCap);

  return group;
}

/**
 * Builds the complete articulated Hand hierarchy for Left or Right side.
 * Returns { root, handBone, bones, fingerControllers }
 */
export function buildProceduralHand(side = 'R', materials) {
  const isRight = side === 'R';
  // Mirror factor: for Right hand mir = 1, for Left hand mir = -1
  const mir = isRight ? 1 : -1;
  const silverMat = materials.translucentSilver || materials.greyArmor;
  const jointMat = materials.translucentSilver || materials.mechanicalJoint;

  // Root Hand Group / Wrist Pivot
  const handRoot = new THREE.Group();
  handRoot.name = `HandRoot_${side}`;

  // Main Hand / Palm Bone (Rigging anchor for palm orientation)
  const handBone = new THREE.Bone();
  handBone.name = `Hand_${side}`;
  handRoot.add(handBone);

  // 1. Broad Sculpted Palm Chassis (Translucent silver outer shell for identifying digits)
  const palmGeom = createSculptedPalmGeometry(side);
  const palmMesh = new THREE.Mesh(palmGeom, silverMat);
  palmMesh.name = `PalmMesh_${side}`;
  palmMesh.castShadow = true;
  palmMesh.receiveShadow = true;
  handBone.add(palmMesh);

  // 2. Palmar Ergonomic Face Plate (Front facing +Z)
  const palmarPadGeom = new THREE.BoxGeometry(0.078, 0.082, 0.007);
  const palmarPadMesh = new THREE.Mesh(palmarPadGeom, materials.handPad || silverMat);
  palmarPadMesh.position.set(mir * -0.005, 0.008, 0.016);
  palmarPadMesh.castShadow = true;
  handBone.add(palmarPadMesh);

  // Palmar Thenar Contoured Groove Plate
  const thenarPadGeom = new THREE.BoxGeometry(0.034, 0.052, 0.006);
  const thenarPadMesh = new THREE.Mesh(thenarPadGeom, materials.charcoalShell);
  thenarPadMesh.position.set(mir * -0.034, -0.010, 0.017);
  thenarPadMesh.rotation.z = mir * 0.35;
  handBone.add(thenarPadMesh);

  // 3. Dorsal Backhand Armor Shield (Back facing -Z)
  const backhandGeom = new THREE.BoxGeometry(0.080, 0.086, 0.008);
  const backhandMesh = new THREE.Mesh(backhandGeom, silverMat);
  backhandMesh.position.set(mir * -0.005, 0.008, -0.016);
  backhandMesh.castShadow = true;
  handBone.add(backhandMesh);

  // Backhand Amber Micro-Accent Status Bar
  const backhandAccentGeom = new THREE.BoxGeometry(0.038, 0.005, 0.004);
  const backhandAccent = new THREE.Mesh(backhandAccentGeom, materials.amberGlow);
  backhandAccent.position.set(mir * -0.005, 0.024, -0.021);
  handBone.add(backhandAccent);

  // 4. Distinct Knuckle Sockets along Distal Margin (MCP Housings - Joint B)
  const fourDigitKeys = ['index', 'middle', 'ring', 'little'];
  fourDigitKeys.forEach(key => {
    const spec = DIGIT_SPECS[key];
    const socketGeom = new THREE.CylinderGeometry(spec.segments[0].radiusBase * 1.15, spec.segments[0].radiusBase * 1.25, 0.014, 18);
    const socketMesh = new THREE.Mesh(socketGeom, jointMat);
    socketMesh.position.set(mir * spec.baseOffset.x, spec.baseOffset.y - 0.006, spec.baseOffset.z);
    handBone.add(socketMesh);
  });

  // 5. Distinct Thumb Swivel Base Joint Housing (On lateral thenar side)
  const thumbBaseSpec = DIGIT_SPECS.thumb;
  const thumbSocketGeom = new THREE.SphereGeometry(thumbBaseSpec.segments[0].radiusBase * 1.35, 18, 14);
  thumbSocketGeom.scale(1.2, 0.9, 0.9);
  const thumbSocket = new THREE.Mesh(thumbSocketGeom, jointMat);
  thumbSocket.position.set(mir * thumbBaseSpec.baseOffset.x, thumbBaseSpec.baseOffset.y - 0.005, thumbBaseSpec.baseOffset.z);
  handBone.add(thumbSocket);

  // Glowing Accent Ring on Thumb Joint Housing
  const thumbRingGeom = new THREE.TorusGeometry(thumbBaseSpec.segments[0].radiusBase * 1.28, 0.0025, 8, 20);
  thumbRingGeom.rotateY(mir * Math.PI / 4);
  const thumbRing = new THREE.Mesh(thumbRingGeom, materials.amberGlow);
  thumbRing.position.copy(thumbSocket.position);
  handBone.add(thumbRing);

  const bonesMap = {
    [`Hand_${side}`]: handBone,
    [`Palm_${side}`]: handBone
  };

  const fingerControllers = {};
  const allDigitKeys = ['thumb', 'index', 'middle', 'ring', 'little'];

  allDigitKeys.forEach(digitKey => {
    const spec = DIGIT_SPECS[digitKey];
    const isThumb = digitKey === 'thumb';

    // Base offset adjusted for Left/Right mirror
    const basePos = spec.baseOffset.clone();
    basePos.x *= mir;

    // Segment 1 (Proximal / Metacarpal) Bone
    const bone01 = new THREE.Bone();
    bone01.name = `${spec.name}_01_${side}`;
    bone01.position.copy(basePos);

    // Initial resting angles
    if (isThumb) {
      // Natural thumb opposition: angled diagonally outward (-43° on right, +43° on left)
      bone01.rotation.set(0.20, mir * 0.35, mir * spec.spreadAngle);
    } else {
      // Natural splay across the distal knuckle arch
      bone01.rotation.z = mir * spec.spreadAngle;
    }
    handBone.add(bone01);
    bonesMap[bone01.name] = bone01;

    // Visible Knuckle Hinge at MCP Joint
    const seg1Spec = spec.segments[0];
    const mcpKnuckle = createKnuckleHingeGroup(seg1Spec.radiusBase * 0.95, seg1Spec.radiusBase * 2.1, materials);
    mcpKnuckle.position.set(0, 0, 0);
    bone01.add(mcpKnuckle);

    // Segment 1 Mesh (Translucent silver armor phalanx)
    const geom1 = createPhalanxGeometry(seg1Spec.length, seg1Spec.radiusBase, seg1Spec.radiusTip, false);
    const mesh1 = new THREE.Mesh(geom1, silverMat);
    mesh1.position.y = seg1Spec.length * 0.5;
    mesh1.castShadow = true;
    bone01.add(mesh1);

    // Segment 2 (Intermediate) Bone
    const bone02 = new THREE.Bone();
    bone02.name = `${spec.name}_02_${side}`;
    bone02.position.set(0, seg1Spec.length, 0);
    bone01.add(bone02);
    bonesMap[bone02.name] = bone02;

    // Visible Knuckle Hinge at PIP Joint
    const seg2Spec = spec.segments[1];
    const pipKnuckle = createKnuckleHingeGroup(seg2Spec.radiusBase * 0.92, seg2Spec.radiusBase * 2.0, materials);
    pipKnuckle.position.set(0, 0, 0);
    bone02.add(pipKnuckle);

    // Segment 2 Mesh (Translucent silver armor phalanx)
    const geom2 = createPhalanxGeometry(seg2Spec.length, seg2Spec.radiusBase, seg2Spec.radiusTip, false);
    const mesh2 = new THREE.Mesh(geom2, silverMat);
    mesh2.position.y = seg2Spec.length * 0.5;
    mesh2.castShadow = true;
    bone02.add(mesh2);

    // Dorsal Knuckle Blue Sensor Disc (Visible when curled into fist, matching reference image)
    const knuckleSensorGeom = new THREE.CylinderGeometry(seg2Spec.radiusTip * 0.58, seg2Spec.radiusTip * 0.58, 0.003, 16);
    knuckleSensorGeom.rotateX(Math.PI / 2);
    const knuckleSensorMesh = new THREE.Mesh(knuckleSensorGeom, materials.blueGlow);
    knuckleSensorMesh.position.set(0, seg2Spec.length * 0.88, -seg2Spec.radiusTip * 0.85);
    bone02.add(knuckleSensorMesh);

    // Segment 3 (Distal / Fingertip) Bone
    const bone03 = new THREE.Bone();
    bone03.name = `${spec.name}_03_${side}`;
    bone03.position.set(0, seg2Spec.length, 0);
    bone02.add(bone03);
    bonesMap[bone03.name] = bone03;

    // Visible Knuckle Hinge at DIP Joint
    const seg3Spec = spec.segments[2];
    const dipKnuckle = createKnuckleHingeGroup(seg3Spec.radiusBase * 0.90, seg3Spec.radiusBase * 1.9, materials);
    dipKnuckle.position.set(0, 0, 0);
    bone03.add(dipKnuckle);

    // Segment 3 Mesh (Translucent silver tip phalanx)
    const geom3 = createPhalanxGeometry(seg3Spec.length, seg3Spec.radiusBase, seg3Spec.radiusTip, true);
    const mesh3 = new THREE.Mesh(geom3, silverMat);
    mesh3.position.y = seg3Spec.length * 0.5;
    mesh3.castShadow = true;
    bone03.add(mesh3);

    // Fingertip Optical Tactile Sensor Pad (Electric Blue Glowing Indicator matching reference image)
    const tipSensorGeom = new THREE.SphereGeometry(seg3Spec.radiusTip * 0.85, 14, 12);
    tipSensorGeom.scale(0.90, 1.15, 0.90);
    const tipSensorMesh = new THREE.Mesh(tipSensorGeom, materials.blueGlow);
    tipSensorMesh.position.set(0, seg3Spec.length * 0.92, 0.002);
    bone03.add(tipSensorMesh);

    // Distal Knuckle Blue Indicator Dot (shines forward when curled into fist)
    const dipDotGeom = new THREE.SphereGeometry(seg3Spec.radiusTip * 0.55, 12, 10);
    const dipDotMesh = new THREE.Mesh(dipDotGeom, materials.blueGlow);
    dipDotMesh.position.set(0, seg3Spec.length * 0.35, -seg3Spec.radiusBase * 0.82);
    bone03.add(dipDotMesh);

    // Kinematic Controller for this digit
    fingerControllers[digitKey] = {
      bone01,
      bone02,
      bone03,
      /**
       * Flex finger joints:
       * @param {number} mcp MCP flexion (radians)
       * @param {number} pip PIP flexion (radians)
       * @param {number} dip DIP flexion (radians)
       * @param {number} abduct Abduction spread (radians)
       */
      setFlexion(mcp = 0, pip = 0, dip = 0, abduct = 0) {
        if (isThumb) {
          bone01.rotation.x = 0.20 + mcp * 0.75;
          bone01.rotation.y = mir * (0.35 + abduct * 0.5);
          bone01.rotation.z = mir * (spec.spreadAngle + abduct * 0.5);
          bone02.rotation.x = pip;
          bone03.rotation.x = dip;
        } else {
          bone01.rotation.x = mcp;
          bone01.rotation.z = mir * (spec.spreadAngle + abduct);
          bone02.rotation.x = pip;
          bone03.rotation.x = dip;
        }
      }
    };
  });

  return {
    root: handRoot,
    handBone,
    bones: bonesMap,
    fingerControllers
  };
}
