/**
 * Hastivo Procedural Robotic Geometry Engine
 * Procedurally models the friendly robot assistant exactly matching the reference image:
 * - Friendly rounded capsule helmet (chubby, aerodynamic, smooth)
 * - Inset rounded-pill glossy black digital visor screen with white border bezel
 * - Bright electric blue glowing digital eyes (^ ^) and smile (◡)
 * - Concentric circular ear headphone modules with glowing amber outer rings
 * - Articulated mechanical neck column
 * - Compact, slender armored torso with charcoal center shield and Hastivo "S" emblem
 * - Clavicle glowing amber vents and rib blue accent slits
 * - Segmented slim mechanical abdomen with illuminated amber waist belt
 * - Integrated curved shoulder pauldrons with amber accent line
 * - Segmented robotic arms with mechanical elbow discs
 * - High-precision 5-finger mechanical hands with articulated knuckles and tactile sensor pads
 */
import * as THREE from 'three';

/**
 * 1. Friendly Rounded Capsule Robot Helmet
 * Chubby, friendly, rounded aerodynamic helmet matching the reference image.
 */
export function createRoboticHelmetGeometry() {
  const geom = new THREE.SphereGeometry(1, 64, 48);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Friendly soft superellipsoid profile
    const sX = Math.sign(x) * Math.pow(Math.abs(x), 0.88);
    const sY = Math.sign(y) * Math.pow(Math.abs(y), 0.90);
    const sZ = Math.sign(z) * Math.pow(Math.abs(z), 0.90);

    // Helmet dimensions: friendly rounded capsule
    let vx = sX * 0.162; // Width: 0.324m
    let vy = sY * 0.134; // Height: 0.268m
    let vz = sZ * 0.144; // Depth: 0.288m

    // Chin tapering (gentle narrowing toward neck)
    if (vy < 0) {
      const chin = 1.0 + (vy / 0.134) * 0.08;
      vx *= chin;
      vz *= chin;
    }

    // Smooth aerodynamic rear crown curvature
    if (vz < 0) {
      vz *= 1.05;
    }

    // Smooth, organic visor recess socket - zero sharp edges, zero polygon cliffs
    if (vz > 0.02) {
      const nx = vx / 0.118;
      const ny = (vy - 0.005) / 0.088;
      const r4 = Math.pow(nx, 4) + Math.pow(ny, 4);
      if (r4 < 1.0) {
        const depth = Math.pow(1.0 - r4, 1.4) * 0.024;
        vz -= depth;
      }
    }

    // Flat lateral circular pads for ear modules
    if (Math.abs(vx) > 0.146 && Math.abs(vz) < 0.06 && Math.abs(vy) < 0.06) {
      vx = Math.sign(vx) * 0.158;
    }

    pos.setXYZ(i, vx, vy, vz);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 2. Inset Rounded Pill Visor Screen
 * Smooth rounded-corner capsule display screen in glossy jet-black OLED finish.
 */
export function createDigitalVisorGeometry() {
  const width = 0.215;
  const height = 0.148;
  const radius = 0.052;

  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.006,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 3
  });
  geom.center();

  // Gentle forward curve matching helmet curvature
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const curve = Math.cos((vx / 0.13) * Math.PI * 0.45) * 0.005;
    pos.setXYZ(i, vx, vy, vz + curve);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Thin Bezel Frame enclosing the digital visor screen
 */
export function createDigitalVisorBezelGeometry() {
  const width = 0.228;
  const height = 0.160;
  const radius = 0.058;

  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  // Inner cutout hole
  const hole = new THREE.Path();
  const inW = 0.212;
  const inH = 0.145;
  const inR = 0.050;
  const hx = -inW / 2;
  const hy = -inH / 2;
  hole.moveTo(hx + inR, hy);
  hole.lineTo(hx + inW - inR, hy);
  hole.quadraticCurveTo(hx + inW, hy, hx + inW, hy + inR);
  hole.lineTo(hx + inW, hy + inH - inR);
  hole.quadraticCurveTo(hx + inW, hy + inH, hx + inW - inR, hy + inH);
  hole.lineTo(hx + inR, hy + inH);
  hole.quadraticCurveTo(hx, hy + inH, hx, hy + inH - inR);
  hole.lineTo(hx, hy + inR);
  hole.quadraticCurveTo(hx, hy, hx + inR, hy);
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.010,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 3
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 3. Digital Eye Curved Arc Geometry (Electric blue ^ ^)
 * Expressive, bold glowing arc visible across all camera modes.
 */
export function createDigitalEyeArcGeometry(innerRadius = 0.026, thickness = 0.010) {
  const shape = new THREE.Shape();
  const outerRadius = innerRadius + thickness;
  const startAngle = Math.PI * 0.14;
  const endAngle = Math.PI * 0.86;

  shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
  const endX = Math.cos(endAngle) * innerRadius;
  const endY = Math.sin(endAngle) * innerRadius;
  shape.lineTo(endX, endY);
  shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2
  });
  geom.center();
  return geom;
}

/**
 * 4. Digital Eye Oval Pupil Geometry
 */
export function createDigitalEyeOvalGeometry() {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, 0.028, 0.032, 0, Math.PI * 2);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2
  });
  geom.center();
  return geom;
}

/**
 * 5. Digital Mouth Arc Geometry (Electric blue ◡)
 * Warm, friendly glowing digital smile.
 */
export function createDigitalMouthArcGeometry() {
  const shape = new THREE.Shape();
  const innerRadius = 0.030;
  const outerRadius = 0.040;
  const startAngle = Math.PI * 1.18;
  const endAngle = Math.PI * 1.82;

  shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
  const endX = Math.cos(endAngle) * innerRadius;
  const endY = Math.sin(endAngle) * innerRadius;
  shape.lineTo(endX, endY);
  shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2
  });
  geom.center();
  return geom;
}

/**
 * 5b. Digital Nose Line Structure Geometry (Electric blue | )
 * Sleek, prominent cybernetic vertical nose bridge accent with subtle horizontal notch.
 */
export function createDigitalNoseGeometry() {
  const shape = new THREE.Shape();
  const w = 0.008;
  const h = 0.032;
  const r = 0.0035;

  // Main vertical pill line
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0012,
    bevelSize: 0.0012,
    bevelSegments: 2
  });
  geom.center();
  return geom;
}

/**
 * 6. Concentric Ear Headphone Sensor Modules
 * Matches reference: outer white rim, recessed dark cavity, illuminated glowing amber ring.
 */
export function createEarModuleGeometry() {
  const points = [
    new THREE.Vector2(0.001, 0.0),
    new THREE.Vector2(0.042, 0.0),    // Base flange
    new THREE.Vector2(0.045, 0.008),
    new THREE.Vector2(0.045, 0.020),  // Outer white housing ring
    new THREE.Vector2(0.049, 0.024),
    new THREE.Vector2(0.049, 0.034),
    new THREE.Vector2(0.042, 0.038),  // Recessed cavity rim
    new THREE.Vector2(0.034, 0.038),
    new THREE.Vector2(0.030, 0.032),  // Recessed dark well
    new THREE.Vector2(0.001, 0.032)
  ];
  const geom = new THREE.LatheGeometry(points, 32);
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 7. Articulated Mechanical Neck Column
 */
export function createRoboticNeckGeometry() {
  const points = [
    new THREE.Vector2(0.058, 0.07),
    new THREE.Vector2(0.052, 0.04),
    new THREE.Vector2(0.048, 0.02),
    new THREE.Vector2(0.054, 0.00),
    new THREE.Vector2(0.060, -0.03),
    new THREE.Vector2(0.068, -0.05)
  ];
  const geom = new THREE.LatheGeometry(points, 24);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 8. Compact Slender Armored Torso Chassis
 * Sized down to match the agile, friendly assistant in the reference image.
 */
/**
 * 8. Continuous Sculpted Armored Torso Chassis
 * Seamlessly spans from collar down to pelvis with zero gaps,
 * featuring athletic waist taper and ergonomic shoulder saddles.
 */
export function createRoboticTorsoGeometry() {
  const points = [
    new THREE.Vector2(0.082, 0.28),  // Collar rim
    new THREE.Vector2(0.146, 0.24),  // Clavicle width
    new THREE.Vector2(0.168, 0.15),  // Pectoral peak
    new THREE.Vector2(0.152, 0.05),  // Lower ribcage
    new THREE.Vector2(0.124, -0.06), // Slim athletic waist
    new THREE.Vector2(0.136, -0.16), // Beltline transition
    new THREE.Vector2(0.156, -0.26), // Hip flare
    new THREE.Vector2(0.150, -0.34), // Pelvis base
    new THREE.Vector2(0.001, -0.35)  // Bottom closure
  ];
  const geom = new THREE.LatheGeometry(points, 36);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);

    let xMod = vx * 1.08;
    let zMod = vz * 0.82;

    // Sculpted pectoral forward fullness
    if (vz > 0.02 && vy > 0.04 && vy < 0.25) {
      zMod += 0.022;
    }

    pos.setXYZ(i, xMod, vy, zMod);
  }
  geom.computeVertexNormals();
  return geom;
}

/**
 * 9. Symmetrical Sculpted Pectoral Armor Plates (Left & Right)
 * Matte silver-grey aerospace composite framing the center dark chest shield.
 */
export function createPectoralArmorGeometry(side = 'L') {
  const isLeft = side === 'L';
  const sign = isLeft ? 1 : -1;

  const shape = new THREE.Shape();
  shape.moveTo(0.015 * sign, 0.150);
  shape.lineTo(0.125 * sign, 0.130);
  shape.lineTo(0.150 * sign, 0.040);
  shape.lineTo(0.115 * sign, -0.060);
  shape.lineTo(0.042 * sign, -0.055);
  shape.lineTo(0.015 * sign, 0.045);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelThickness: 0.009,
    bevelSize: 0.008,
    bevelSegments: 4
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 10. Center Charcoal Shield Chest Plate
 * Broad, sculpted dark composite shield plate matching the reference image.
 */
export function createChestCenterShieldGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0.0, 0.155);
  shape.lineTo(0.095, 0.125);
  shape.lineTo(0.105, 0.045);
  shape.lineTo(0.075, -0.045);
  shape.lineTo(0.054, -0.075);
  shape.lineTo(-0.054, -0.075);
  shape.lineTo(-0.075, -0.045);
  shape.lineTo(-0.105, 0.045);
  shape.lineTo(-0.095, 0.125);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 4
  });
  geom.center();

  // Anatomical curvature across chest
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const curve = Math.cos((vx / 0.11) * Math.PI * 0.45) * 0.008;
    pos.setXYZ(i, vx, vy, vz + curve);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 10b. Central Charcoal Abdominal Plate
 * Athletic midriff armor connecting cleanly from chest shield down into the beltline.
 */
export function createAbdominalPlateGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.054, 0.055);
  shape.lineTo(0.054, 0.055);
  shape.lineTo(0.048, -0.020);
  shape.lineTo(0.056, -0.085);
  shape.lineTo(0.045, -0.105);
  shape.lineTo(-0.045, -0.105);
  shape.lineTo(-0.056, -0.085);
  shape.lineTo(-0.048, -0.020);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 3
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 10c. Waist Belt Illuminated Light Bar
 * Glowing Amber/Gold horizontal bar at the beltline matching reference.
 */
export function createWaistBeltLightGeometry() {
  const shape = new THREE.Shape();
  const topW = 0.044;
  const botW = 0.034;
  const h = 0.012;
  const r = 0.0035;

  shape.moveTo(-topW + r, h);
  shape.lineTo(topW - r, h);
  shape.quadraticCurveTo(topW, h, topW, h - r);
  shape.lineTo(botW, -h + r);
  shape.quadraticCurveTo(botW, -h, botW - r, -h);
  shape.lineTo(-botW + r, -h);
  shape.quadraticCurveTo(-botW, -h, -botW, -h + r);
  shape.lineTo(-topW, h - r);
  shape.quadraticCurveTo(-topW, h, -topW + r, h);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.010,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 10d. Waist Belt Bezel Frame
 */
export function createWaistBeltBezelGeometry() {
  const shape = new THREE.Shape();
  const topW = 0.050;
  const botW = 0.039;
  const h = 0.016;

  shape.moveTo(-topW, h);
  shape.lineTo(topW, h);
  shape.lineTo(botW, -h);
  shape.lineTo(-botW, -h);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 11a. Arc Reactor Outer Bezel Housing
 * Recessed circular socket mounted on the upper chest.
 */
export function createArcReactorHousingGeometry() {
  const shape = new THREE.Shape();
  const outerR = 0.050;
  const innerR = 0.042;
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.010,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 3
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 11b. Arc Reactor Inset Lens Base
 * Deep glossy dark glass backdrop for the glowing "S" core.
 */
export function createArcReactorLensGeometry() {
  const geom = new THREE.CylinderGeometry(0.042, 0.042, 0.004, 32);
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 11c. Arc Reactor Bold Embroidered "S" Emblem Geometry
 * Iconic, bold interlocking hexagonal ribbons forming the Hastivo cybernetic "S".
 * Upper loop: Coral/Orange (#FF583F)
 * Lower loop: Electric Blue (#3088FF)
 */
export function createArcReactorSLogoGeometry(isUpper = true) {
  const shape = new THREE.Shape();

  if (isUpper) {
    // Upper loop: Bold Coral ribbon hook matching reference image
    shape.moveTo(-0.020, 0.010);
    shape.lineTo(-0.006, 0.028);
    shape.lineTo(0.016, 0.028);
    shape.lineTo(0.028, 0.016);
    shape.lineTo(0.008, 0.003);
    shape.lineTo(-0.004, 0.003);
    shape.lineTo(0.014, 0.012);
    shape.lineTo(0.014, 0.018);
    shape.lineTo(0.006, 0.018);
    shape.lineTo(-0.006, 0.010);
    shape.closePath();
  } else {
    // Lower loop: Bold Electric Blue ribbon hook (exact 180° point-inversion)
    shape.moveTo(0.020, -0.010);
    shape.lineTo(0.006, -0.028);
    shape.lineTo(-0.016, -0.028);
    shape.lineTo(-0.028, -0.016);
    shape.lineTo(-0.008, -0.003);
    shape.lineTo(0.004, -0.003);
    shape.lineTo(-0.014, -0.012);
    shape.lineTo(-0.014, -0.018);
    shape.lineTo(-0.006, -0.018);
    shape.lineTo(0.006, -0.010);
    shape.closePath();
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.010,
    bevelEnabled: true,
    bevelThickness: 0.0025,
    bevelSize: 0.0025,
    bevelSegments: 3
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

// Backwards-compatible alias for existing code
export const createEmblemHalfGeometry = createArcReactorSLogoGeometry;

/**
 * 12. Integrated Mechanical Shoulder Deltoid Pauldron
 * Sleek curved aerodynamic armor shell matching reference.
 */
export function createShoulderShellGeometry() {
  const geom = new THREE.SphereGeometry(0.062, 32, 24, 0, Math.PI, 0, Math.PI * 0.88);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 12b. Mechanical Wrist Cuff Collar
 * Precision mechanical cuff connecting forearm to hand root.
 */
export function createWristCuffGeometry() {
  const points = [
    new THREE.Vector2(0.038, 0.018),
    new THREE.Vector2(0.041, 0.014),
    new THREE.Vector2(0.041, -0.010),
    new THREE.Vector2(0.037, -0.016),
    new THREE.Vector2(0.035, -0.018)
  ];
  const geom = new THREE.LatheGeometry(points, 24);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 12c. Wrist Illuminated Sensor Ring
 */
export function createWristSensorRingGeometry() {
  const geom = new THREE.TorusGeometry(0.0412, 0.0032, 12, 28);
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 12d. Pelvis Groin Protective Plate
 * Triangular athletic V-groin plate matching reference.
 */
export function createPelvisGroinPlateGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.045, 0.045);
  shape.lineTo(0.045, 0.045);
  shape.lineTo(0.026, -0.045);
  shape.lineTo(0.0, -0.080);
  shape.lineTo(-0.026, -0.045);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 3
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 13. Mechanical Dual-Ring Elbow/Wrist Pivot Joint Disc
 */
export function createMechanicalJointDiscGeometry(radius = 0.042, width = 0.032) {
  const geom = new THREE.CylinderGeometry(radius, radius, width, 24);
  geom.rotateZ(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 14. Robotic Limb Armor Sleeve (Upper arm, forearm, thigh, shin)
 */
export function createRoboticLimbGeometry(length = 0.25, radiusUpper = 0.055, radiusLower = 0.045) {
  const points = [
    new THREE.Vector2(radiusUpper * 0.95, length * 0.5),
    new THREE.Vector2(radiusUpper * 1.06, length * 0.25),
    new THREE.Vector2(radiusUpper * 1.00, 0.0),
    new THREE.Vector2(radiusLower * 1.04, -length * 0.25),
    new THREE.Vector2(radiusLower * 0.92, -length * 0.5)
  ];
  const geom = new THREE.LatheGeometry(points, 24);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 15. Accent Illumination Slit (Amber/Blue vent slots)
 */
export function createAccentSlitGeometry(length = 0.05, width = 0.008, depth = 0.006) {
  const shape = new THREE.Shape();
  const r = width * 0.5;
  const l = length * 0.5;
  shape.moveTo(-l + r, -r);
  shape.lineTo(l - r, -r);
  shape.absarc(l - r, 0, r, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(-l + r, r);
  shape.absarc(-l + r, 0, r, Math.PI / 2, -Math.PI / 2, false);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 2
  });
  geom.center();
  return geom;
}

/**
 * 16. Sculpted Robotic Pelvis Housing Geometry
 * Contoured silver-grey armor casing with curved hip socket saddles matching reference image.
 */
export function createRoboticPelvisGeometry() {
  const shape = new THREE.Shape();
  // Outer pelvis silhouette with curved leg saddles
  shape.moveTo(-0.138, 0.060);
  shape.lineTo(0.138, 0.060);
  shape.lineTo(0.144, 0.020);
  // Right hip saddle curve
  shape.quadraticCurveTo(0.135, -0.040, 0.095, -0.075);
  shape.lineTo(0.045, -0.085);
  // Center groin V-notch
  shape.lineTo(0.0, -0.065);
  // Left hip saddle curve
  shape.lineTo(-0.045, -0.085);
  shape.lineTo(-0.095, -0.075);
  shape.quadraticCurveTo(-0.135, -0.040, -0.144, 0.020);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.160,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.010,
    bevelSegments: 4
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * 17. Mechanical Knee Articulation Hinge Geometry
 * Precision dark titanium hinge block with front articulation knuckle.
 */
export function createRoboticKneeGeometry() {
  const geom = new THREE.BoxGeometry(0.068, 0.056, 0.064);
  geom.computeVertexNormals();
  return geom;
}

/**
 * 18. Sculpted Robotic Foot Shoe Geometry
 * Symmetrical silver-grey robot shoe with front toe ramp, ankle saddle, and flat stable ground sole.
 */
export function createRoboticFootGeometry() {
  const shape = new THREE.Shape();
  // Foot side profile: flat bottom, vertical heel, curved ankle collar, slanted front toe ramp
  shape.moveTo(-0.075, -0.020); // Heel bottom
  shape.lineTo(0.085, -0.020);  // Toe bottom (flat stable ground contact)
  shape.lineTo(0.085, 0.006);   // Toe front vertical lip
  shape.lineTo(0.025, 0.024);   // Slanted front toe ramp
  shape.lineTo(-0.020, 0.026);  // Ankle collar front
  shape.lineTo(-0.070, 0.022);  // Ankle collar rear
  shape.lineTo(-0.075, 0.005);  // Heel curve
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.076,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.007,
    bevelSegments: 3
  });
  geom.center();
  // Rotate so front points +Z
  geom.rotateY(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

