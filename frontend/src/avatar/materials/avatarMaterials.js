/**
 * Hastivo Robotic Avatar Materials
 * Built using Three.js MeshStandardMaterial & MeshPhysicalMaterial
 * Strictly adheres to the Hastivo palette: Charcoal, Grey, Coral, Blue, Amber.
 * Configured specifically for the non-humanoid robot assistant with digital display.
 */
import * as THREE from 'three';

export function createAvatarMaterials(options = { wireframe: false }) {
  const isWireframe = Boolean(options.wireframe);

  // 1. Red Outer Armor: Default vibrant metallic robot red shell with physical clearcoat outer lacquer coating
  const redArmor = new THREE.MeshPhysicalMaterial({
    name: 'hastivo_red_armor',
    color: new THREE.Color(0xD9222A), // Vibrant robot crimson red
    roughness: 0.22,
    metalness: 0.35,
    clearcoat: 0.92,          // Real PBR protective clearcoat lacquer layer
    clearcoatRoughness: 0.12, // High-gloss automotive ceramic clearcoat finish
    reflectivity: 0.70,
    wireframe: isWireframe,
  });
  // Maintain backward-compatibility alias
  const greyArmor = redArmor;

  // 2. Main Charcoal Chassis: Matte dark composite for chest center shield, abdomen, collar, and structure
  const charcoalShell = new THREE.MeshStandardMaterial({
    name: 'hastivo_charcoal_shell',
    color: new THREE.Color(0x22262E),
    roughness: 0.38,
    metalness: 0.22,
    wireframe: isWireframe,
  });

  // 3. Digital Face Display Screen: Deep glossy black glass visor inset into helmet
  const digitalScreen = new THREE.MeshStandardMaterial({
    name: 'hastivo_digital_screen',
    color: new THREE.Color(0x05070A),
    roughness: 0.05,
    metalness: 0.95,
    wireframe: isWireframe,
  });

  // 4. Digital Display Glow - Crisp High-Contrast White (#FFFFFF) for eyes, nose, mouth
  const whiteGlow = new THREE.MeshStandardMaterial({
    name: 'hastivo_white_glow',
    color: new THREE.Color(0xFFFFFF),
    roughness: 0.08,
    metalness: 0.1,
    emissive: new THREE.Color(0xFFFFFF),
    emissiveIntensity: 2.8,
    toneMapped: false,
    wireframe: isWireframe,
  });

  // 5. Digital Display Accent Glow - Electric Blue (#4DA6FF)
  const blueGlow = new THREE.MeshStandardMaterial({
    name: 'hastivo_blue_glow',
    color: new THREE.Color(0x52AAFF),
    roughness: 0.1,
    metalness: 0.1,
    emissive: new THREE.Color(0x3088FF),
    emissiveIntensity: 2.4,
    toneMapped: false,
    wireframe: isWireframe,
  });

  // 6. Amber Illuminated Slits & Accents (#FFA500): Head crest, right vents, waist belt light
  const amberGlow = new THREE.MeshStandardMaterial({
    name: 'hastivo_amber_glow',
    color: new THREE.Color(0xFFB510),
    roughness: 0.12,
    metalness: 0.15,
    emissive: new THREE.Color(0xFFA500),
    emissiveIntensity: 2.4,
    toneMapped: false,
    wireframe: isWireframe,
  });

  // 7. Coral Brand Accent (#FF583F): Hastivo Arc Reactor upper "S" emblem & identity rings
  const coralGlow = new THREE.MeshStandardMaterial({
    name: 'hastivo_coral_glow',
    color: new THREE.Color(0xFF7058),
    roughness: 0.15,
    metalness: 0.15,
    emissive: new THREE.Color(0xFF583F),
    emissiveIntensity: 2.2,
    toneMapped: false,
    wireframe: isWireframe,
  });

  // 8. Translucent Silver for Hands & Joints: Clear identification of digits and mechanical articulation
  const translucentSilver = new THREE.MeshPhysicalMaterial({
    name: 'hastivo_translucent_silver',
    color: new THREE.Color(0xD4DBE4),
    roughness: 0.20,
    metalness: 0.85,
    clearcoat: 0.85,
    clearcoatRoughness: 0.14,
    transparent: true,
    opacity: 0.74,
    transmission: 0.28,
    ior: 1.45,
    wireframe: isWireframe,
  });

  // Mechanical Joint uses Translucent Silver styling
  const mechanicalJoint = translucentSilver;

  // Tactile Hand Grips & Inner Pads: Translucent silver pearlescent texture
  const handPad = new THREE.MeshPhysicalMaterial({
    name: 'hastivo_hand_pad',
    color: new THREE.Color(0xE2E8F0),
    roughness: 0.25,
    metalness: 0.75,
    transparent: true,
    opacity: 0.80,
    wireframe: isWireframe,
  });

  // Fingertip Sensor Nodes: Glowing sensor caps on distal phalanges
  const fingertipSensor = new THREE.MeshStandardMaterial({
    name: 'hastivo_fingertip_sensor',
    color: new THREE.Color(0xD8E2EE),
    roughness: 0.2,
    metalness: 0.4,
    emissive: new THREE.Color(0x6FA3EF),
    emissiveIntensity: 0.9,
    wireframe: isWireframe,
  });

  return {
    redArmor,
    greyArmor,
    charcoalShell,
    digitalScreen,
    whiteGlow,
    blueGlow,
    amberGlow,
    coralGlow,
    translucentSilver,
    mechanicalJoint,
    handPad,
    fingertipSensor,
    dispose() {
      redArmor.dispose();
      charcoalShell.dispose();
      digitalScreen.dispose();
      whiteGlow.dispose();
      blueGlow.dispose();
      amberGlow.dispose();
      coralGlow.dispose();
      translucentSilver.dispose();
      handPad.dispose();
      fingertipSensor.dispose();
    }
  };
}
