/**
 * SignoraAvatar - Non-Humanoid Robot Assistant
 * Direct Three.js Procedural Implementation matching the reference aesthetic.
 * 
 * Features matching the reference assistant exactly:
 * - Friendly rounded capsule helmet (smooth, chubby, aerodynamic white/silver shell)
 * - Inset rounded-pill glossy black digital visor screen with white border bezel
 * - Bright electric blue glowing digital eyes (^ ^) and smile (◡)
 * - 10 digital expressions driven by FaceController
 * - Concentric circular ear headphone modules with glowing amber outer rings
 * - Articulated mechanical neck column
 * - Compact, slender armored torso with charcoal center shield and Signora "S" emblem
 * - Clavicle glowing amber vents and rib blue accent slits
 * - Segmented slim mechanical abdomen with illuminated amber waist belt
 * - Integrated curved shoulder pauldrons with amber accent line
 * - Segmented robotic arms with mechanical elbow discs
 * - High-precision 5-finger mechanical hands with articulated knuckles and tactile sensor pads
 */
import * as THREE from 'three';
import { createAvatarMaterials } from '../materials/avatarMaterials.js';
import * as Geoms from '../geometry/proceduralGeometries.js';
import { buildProceduralHand } from '../geometry/handGenerator.js';
import { HeadController } from '../animation/HeadController.js';
import { FaceController, ROBOT_10_EXPRESSIONS } from '../animation/FaceController.js';
import { BodyController } from '../animation/BodyController.js';
import { ShoulderController } from '../animation/ShoulderController.js';
import { ArmController } from '../animation/ArmController.js';
import { WristController } from '../animation/WristController.js';
import { HandAnimationController } from '../animation/HandController.js';

export class SignoraAvatar {
  constructor(options = {}) {
    this.options = options;
    this.materials = createAvatarMaterials({ wireframe: options.wireframe || false });

    // Top-level container
    this.root = new THREE.Group();
    this.root.name = 'SignoraRoboticAvatar';

    // Bone collection for animation
    this.bones = {};
    this.meshes = [];

    // Facial nodes for digital display expressions
    this.facialNodes = {};

    // Dynamic Upper Body Transparency for Two-Handed Signing
    this.upperBodyMeshes = [];
    this.currentUpperBodyOpacity = 1.0;
    this.targetUpperBodyOpacity = 1.0;

    // Assemble the complete non-humanoid robot
    this._buildRigAndMeshes();

    // Dedicated Modular Controllers
    this.headController = new HeadController(this.bones['Head'], this.bones['Neck']);
    this.faceController = new FaceController(this.facialNodes, this.headController);
    this.bodyController = new BodyController(
      this.bones['Root'],
      this.bones['Pelvis'],
      this.bones['Spine'],
      this.bones['Chest']
    );
    this.shoulderController = new ShoulderController(
      this.bones['LeftShoulder'],
      this.bones['RightShoulder']
    );
    this.armController = new ArmController(this.bones);
    this.wristController = new WristController(
      this.bones['LeftWrist'],
      this.bones['RightWrist']
    );

    this.leftHandController = new HandAnimationController(
      this.handLeftGroup,
      this.leftHandFingerControllers,
      this.bones['LeftWrist'],
      'L'
    );

    this.rightHandController = new HandAnimationController(
      this.handRightGroup,
      this.rightHandFingerControllers,
      this.bones['RightWrist'],
      'R'
    );

    // Backwards-compatibility alias
    this.facialController = this.faceController;
  }

  _buildRigAndMeshes() {
    const mat = this.materials;

    // 1. Root / Center of Mass
    const rootBone = new THREE.Bone();
    rootBone.name = 'Root';
    rootBone.position.set(0, 0.95, 0);
    this.root.add(rootBone);
    this.bones['Root'] = rootBone;

    // 2. Pelvis / Lower Chassis (Symmetrical armor housing matching reference image)
    const pelvisBone = new THREE.Bone();
    pelvisBone.name = 'Pelvis';
    rootBone.add(pelvisBone);
    this.bones['Pelvis'] = pelvisBone;

    // Sculpted Silver-Grey Pelvis Armor Housing
    const pelvisGeom = Geoms.createRoboticPelvisGeometry();
    const pelvisMesh = new THREE.Mesh(pelvisGeom, mat.greyArmor);
    pelvisMesh.position.set(0, -0.050, 0.0);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    pelvisBone.add(pelvisMesh);
    this.meshes.push(pelvisMesh);

    // Front Groin Protective Plate
    const groinPlateGeom = Geoms.createPelvisGroinPlateGeometry();
    const groinPlate = new THREE.Mesh(groinPlateGeom, mat.charcoalShell);
    groinPlate.position.set(0, -0.052, 0.086);
    pelvisBone.add(groinPlate);

    // Mechanical Hip Ball Socket Pivots for leg attachments
    const hipSocketGeom = new THREE.SphereGeometry(0.048, 24, 18);
    const leftHipSocket = new THREE.Mesh(hipSocketGeom, mat.mechanicalJoint);
    leftHipSocket.position.set(0.095, -0.115, 0);
    pelvisBone.add(leftHipSocket);

    const rightHipSocket = new THREE.Mesh(hipSocketGeom, mat.mechanicalJoint);
    rightHipSocket.position.set(-0.095, -0.115, 0);
    pelvisBone.add(rightHipSocket);

    // 3. Spine / Lower Abdomen (Segmented mechanical waist matching reference image)
    const spineBone = new THREE.Bone();
    spineBone.name = 'Spine';
    spineBone.position.set(0, 0.09, 0);
    pelvisBone.add(spineBone);
    this.bones['Spine'] = spineBone;

    // Segmented mechanical charcoal waist discs
    for (let i = 0; i < 2; i++) {
      const discGeom = new THREE.CylinderGeometry(0.118 - i * 0.006, 0.124 - i * 0.006, 0.024, 28);
      const discMesh = new THREE.Mesh(discGeom, mat.charcoalShell);
      discMesh.position.set(0, i * 0.028 - 0.012, 0);
      discMesh.castShadow = true;
      spineBone.add(discMesh);
    }

    // Glowing Amber Belt Ring wrapping the waistline
    const beltRingGeom = new THREE.TorusGeometry(0.126, 0.0075, 14, 36);
    beltRingGeom.rotateX(Math.PI / 2);
    const beltRingMesh = new THREE.Mesh(beltRingGeom, mat.amberGlow);
    beltRingMesh.position.set(0, 0.012, 0);
    spineBone.add(beltRingMesh);

    // 4. Chest / Main Torso Chassis (Continuous athletic body matching reference)
    const chestBone = new THREE.Bone();
    chestBone.name = 'Chest';
    chestBone.position.set(0, 0.14, 0);
    spineBone.add(chestBone);
    this.bones['Chest'] = chestBone;

    // Continuous Sculpted Outer Torso Shell (spans from collar down to pelvis)
    const torsoGeom = Geoms.createRoboticTorsoGeometry();
    const torsoMesh = new THREE.Mesh(torsoGeom, mat.greyArmor);
    torsoMesh.name = 'TorsoArmour';
    torsoMesh.position.set(0, 0.0, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    chestBone.add(torsoMesh);
    this.meshes.push(torsoMesh);

    // Symmetrical Sculpted Pectoral Armor Plates (Left & Right)
    const leftPec = new THREE.Mesh(Geoms.createPectoralArmorGeometry('L'), mat.greyArmor);
    leftPec.position.set(0.040, 0.055, 0.094);
    leftPec.rotation.y = -0.08;
    leftPec.castShadow = true;
    chestBone.add(leftPec);

    const rightPec = new THREE.Mesh(Geoms.createPectoralArmorGeometry('R'), mat.greyArmor);
    rightPec.position.set(-0.040, 0.055, 0.094);
    rightPec.rotation.y = 0.08;
    rightPec.castShadow = true;
    chestBone.add(rightPec);

    // Center Charcoal Shield Chest Plate
    const shieldGeom = Geoms.createChestCenterShieldGeometry();
    const shieldMesh = new THREE.Mesh(shieldGeom, mat.charcoalShell);
    shieldMesh.position.set(0, 0.050, 0.108);
    shieldMesh.rotation.x = -0.05;
    shieldMesh.castShadow = true;
    chestBone.add(shieldMesh);
    this.meshes.push(shieldMesh);

    // ARC REACTOR ASSEMBLY WITH EMBROIDERED TWO-TONE "S" EMBLEM
    const arcReactorGroup = new THREE.Group();
    arcReactorGroup.position.set(0, 0.105, 0.126);
    arcReactorGroup.rotation.x = -0.05;

    // 1. Outer Dark Titanium Housing Ring Socket
    const reactorHousing = new THREE.Mesh(Geoms.createArcReactorHousingGeometry(), mat.mechanicalJoint);
    reactorHousing.position.set(0, 0, 0.002);
    arcReactorGroup.add(reactorHousing);

    // 2. Inset Glossy OLED Black Lens Backdrop
    const reactorLens = new THREE.Mesh(Geoms.createArcReactorLensGeometry(), mat.digitalScreen);
    reactorLens.position.set(0, 0, 0.003);
    arcReactorGroup.add(reactorLens);

    // 3. Bold Embroidered/Illuminated Letter "S" Core (Coral Upper, Blue Lower)
    const upperS = new THREE.Mesh(Geoms.createArcReactorSLogoGeometry(true), mat.coralGlow);
    upperS.position.set(0, 0, 0.008);
    arcReactorGroup.add(upperS);

    const lowerS = new THREE.Mesh(Geoms.createArcReactorSLogoGeometry(false), mat.blueGlow);
    lowerS.position.set(0, 0, 0.008);
    arcReactorGroup.add(lowerS);

    chestBone.add(arcReactorGroup);

    // Central Charcoal Abdominal Plate (Seamlessly meets chest shield)
    const abPlateGeom = Geoms.createAbdominalPlateGeometry();
    const abPlateMesh = new THREE.Mesh(abPlateGeom, mat.charcoalShell);
    abPlateMesh.position.set(0, -0.080, 0.104);
    abPlateMesh.rotation.x = -0.03;
    abPlateMesh.castShadow = true;
    chestBone.add(abPlateMesh);

    // Glowing Amber Waist Belt Light Bar inset into bezel at the beltline
    const beltBezelGeom = Geoms.createWaistBeltBezelGeometry();
    const beltBezelMesh = new THREE.Mesh(beltBezelGeom, mat.mechanicalJoint);
    beltBezelMesh.position.set(0, -0.190, 0.114);
    chestBone.add(beltBezelMesh);

    const beltLightGeom = Geoms.createWaistBeltLightGeometry();
    const beltLightMesh = new THREE.Mesh(beltLightGeom, mat.amberGlow);
    beltLightMesh.position.set(0, -0.190, 0.119);
    chestBone.add(beltLightMesh);


    // ASYMMETRIC ILLUMINATED SLIT VENTS
    // Robot Right Clavicle (viewer's left): Glowing Amber Slit
    const rightClavicleVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.048, 0.008), mat.amberGlow);
    rightClavicleVent.position.set(-0.105, 0.165, 0.092);
    rightClavicleVent.rotation.set(-0.12, -0.24, 0.38);
    chestBone.add(rightClavicleVent);

    // Robot Left Clavicle (viewer's right): Glowing Electric Blue Slit
    const leftClavicleVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.048, 0.008), mat.blueGlow);
    leftClavicleVent.position.set(0.105, 0.165, 0.092);
    leftClavicleVent.rotation.set(-0.12, 0.24, -0.38);
    chestBone.add(leftClavicleVent);

    // Robot Right Lower Rib (viewer's left): Angled Glowing Amber Slit
    const rightRibAccent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.042, 0.007), mat.amberGlow);
    rightRibAccent.position.set(-0.112, 0.015, 0.078);
    rightRibAccent.rotation.set(0.04, -0.35, 0.30);
    chestBone.add(rightRibAccent);

    // Robot Left Lower Rib (viewer's right): Angled Glowing Electric Blue Slit
    const leftRibAccent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.042, 0.007), mat.blueGlow);
    leftRibAccent.position.set(0.112, 0.015, 0.078);
    leftRibAccent.rotation.set(0.04, 0.35, -0.30);
    chestBone.add(leftRibAccent);

    // Robot Right Hip (viewer's left): Amber Glowing Vent
    const rightHipVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.046, 0.008), mat.amberGlow);
    rightHipVent.position.set(-0.130, -0.210, 0.082);
    rightHipVent.rotation.set(-0.15, -0.35, 0.40);
    chestBone.add(rightHipVent);

    // Robot Left Hip (viewer's right): Electric Blue Glowing Vent
    const leftHipVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.046, 0.008), mat.blueGlow);
    leftHipVent.position.set(0.130, -0.210, 0.082);
    leftHipVent.rotation.set(-0.15, 0.35, -0.40);
    chestBone.add(leftHipVent);

    // Register all upper body / chest center meshes for two-handed signing transparency
    const upperList = [
      torsoMesh, leftPec, rightPec, shieldMesh, abPlateMesh,
      reactorHousing, reactorLens, upperS, lowerS,
      beltBezelMesh, beltLightMesh,
      rightClavicleVent, leftClavicleVent,
      rightRibAccent, leftRibAccent,
      rightHipVent, leftHipVent
    ];
    for (const m of upperList) {
      if (m && m.material) {
        m.material = m.material.clone();
        m.userData.baseOpacity = m.material.opacity !== undefined ? m.material.opacity : 1.0;
        this.upperBodyMeshes.push(m);
      }
    }

    // 5. Short Articulated Mechanical Neck
    const neckBone = new THREE.Bone();
    neckBone.name = 'Neck';
    neckBone.position.set(0, 0.32, 0);
    chestBone.add(neckBone);
    this.bones['Neck'] = neckBone;

    const neckGeom = Geoms.createRoboticNeckGeometry();
    const neckMesh = new THREE.Mesh(neckGeom, mat.charcoalShell);
    neckMesh.position.set(0, 0.02, 0);
    neckBone.add(neckMesh);
    this.meshes.push(neckMesh);

    // Neck Hydraulic Collar Ring
    const neckCollarGeom = new THREE.TorusGeometry(0.062, 0.007, 12, 28);
    neckCollarGeom.rotateX(Math.PI / 2);
    const neckCollarMesh = new THREE.Mesh(neckCollarGeom, mat.mechanicalJoint);
    neckCollarMesh.position.set(0, 0.012, 0);
    neckBone.add(neckCollarMesh);

    // 6. Friendly Rounded Robotic Head Assembly
    const headBone = new THREE.Bone();
    headBone.name = 'Head';
    headBone.position.set(0, 0.11, 0);
    neckBone.add(headBone);
    this.bones['Head'] = headBone;

    this._buildRoboticHeadAssembly(headBone, mat);

    // 7. Upper Limbs: Left & Right Mechanical Arms
    this._buildRoboticArm('L', 1, chestBone, mat);
    this._buildRoboticArm('R', -1, chestBone, mat);

    // 8. Lower Limbs: Left & Right Robotic Legs
    this._buildRoboticLeg('L', 1, pelvisBone, mat);
    this._buildRoboticLeg('R', -1, pelvisBone, mat);
  }

  _buildRoboticHeadAssembly(headBone, mat) {
    // 1. Friendly Rounded Capsule Helmet Shell
    const helmetGeom = Geoms.createRoboticHelmetGeometry();
    const helmetMesh = new THREE.Mesh(helmetGeom, mat.greyArmor);
    helmetMesh.name = 'RoboticHelmet';
    helmetMesh.castShadow = true;
    helmetMesh.receiveShadow = true;
    headBone.add(helmetMesh);
    this.meshes.push(helmetMesh);

    // 2. Top Head Crest with Glowing Amber Strip
    const crestHousingGeom = new THREE.BoxGeometry(0.075, 0.020, 0.12);
    const crestHousing = new THREE.Mesh(crestHousingGeom, mat.charcoalShell);
    crestHousing.position.set(0, 0.130, 0.01);
    headBone.add(crestHousing);

    const crestVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.055, 0.010), mat.amberGlow);
    crestVent.position.set(0, 0.141, 0.01);
    crestVent.rotation.x = Math.PI / 2;
    headBone.add(crestVent);

    // 3. Rounded Pill Visor White Bezel Frame (Frames the black OLED screen)
    const bezelGeom = Geoms.createDigitalVisorBezelGeometry();
    const bezelMesh = new THREE.Mesh(bezelGeom, mat.greyArmor);
    bezelMesh.position.set(0, 0.005, 0.134);
    headBone.add(bezelMesh);

    // 4. Inset Rounded Pill Glossy Black Visor Screen
    const visorGeom = Geoms.createDigitalVisorGeometry();
    const visorMesh = new THREE.Mesh(visorGeom, mat.digitalScreen);
    visorMesh.position.set(0, 0.005, 0.136);
    headBone.add(visorMesh);
    this.facialNodes.visor = visorMesh;

    // 5. Digital Display Face Group (Sitting cleanly in front of the visor display)
    const displayGroup = new THREE.Group();
    displayGroup.name = 'DigitalFaceDisplay';
    displayGroup.position.set(0, 0.005, 0.150);
    headBone.add(displayGroup);

    // Left Digital Eye (Crisp White Glow Arc ^)
    const leftEyeGeom = Geoms.createDigitalEyeArcGeometry();
    const leftEyeMesh = new THREE.Mesh(leftEyeGeom, mat.whiteGlow);
    leftEyeMesh.position.set(0.048, 0.016, 0.004);
    leftEyeMesh.renderOrder = 20;
    displayGroup.add(leftEyeMesh);
    this.facialNodes.leftEye = leftEyeMesh;

    // Right Digital Eye (Crisp White Glow Arc ^)
    const rightEyeGeom = Geoms.createDigitalEyeArcGeometry();
    const rightEyeMesh = new THREE.Mesh(rightEyeGeom, mat.whiteGlow);
    rightEyeMesh.position.set(-0.048, 0.016, 0.004);
    rightEyeMesh.renderOrder = 20;
    displayGroup.add(rightEyeMesh);
    this.facialNodes.rightEye = rightEyeMesh;

    // Digital Nose (Crisp White Glow Line Structure |)
    const noseGeom = Geoms.createDigitalNoseGeometry();
    const noseMesh = new THREE.Mesh(noseGeom, mat.whiteGlow);
    noseMesh.position.set(0, -0.005, 0.004);
    noseMesh.renderOrder = 20;
    displayGroup.add(noseMesh);
    this.facialNodes.nose = noseMesh;

    // Digital Smile (Crisp White Glow Curve ◡)
    const mouthGeom = Geoms.createDigitalMouthArcGeometry();
    const mouthMesh = new THREE.Mesh(mouthGeom, mat.whiteGlow);
    mouthMesh.position.set(0, -0.038, 0.004);
    mouthMesh.renderOrder = 20;
    displayGroup.add(mouthMesh);
    this.facialNodes.mouth = mouthMesh;

    // 6. Concentric Circular Ear Modules (Left & Right)
    const earGeom = Geoms.createEarModuleGeometry();

    // Left Ear Module
    const leftEarGroup = new THREE.Group();
    leftEarGroup.position.set(0.165, 0.005, 0.0);
    leftEarGroup.rotation.y = -Math.PI / 2;

    const leftEarMesh = new THREE.Mesh(earGeom, mat.charcoalShell);
    leftEarGroup.add(leftEarMesh);

    // Outer Glowing Amber Ring
    const leftEarAmberRing = new THREE.Mesh(new THREE.RingGeometry(0.030, 0.039, 32), mat.amberGlow);
    leftEarAmberRing.position.set(0, 0, 0.040);
    leftEarGroup.add(leftEarAmberRing);

    // Inner Glowing Blue Center Dot
    const leftEarBlueDot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), mat.blueGlow);
    leftEarBlueDot.position.set(0, 0, 0.041);
    leftEarGroup.add(leftEarBlueDot);

    headBone.add(leftEarGroup);
    this.facialNodes.leftEar = leftEarGroup;

    // Right Ear Module
    const rightEarGroup = new THREE.Group();
    rightEarGroup.position.set(-0.165, 0.005, 0.0);
    rightEarGroup.rotation.y = Math.PI / 2;

    const rightEarMesh = new THREE.Mesh(earGeom, mat.charcoalShell);
    rightEarGroup.add(rightEarMesh);

    const rightEarAmberRing = new THREE.Mesh(new THREE.RingGeometry(0.030, 0.039, 32), mat.amberGlow);
    rightEarAmberRing.position.set(0, 0, 0.040);
    rightEarGroup.add(rightEarAmberRing);

    const rightEarBlueDot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), mat.blueGlow);
    rightEarBlueDot.position.set(0, 0, 0.041);
    rightEarGroup.add(rightEarBlueDot);

    headBone.add(rightEarGroup);
    this.facialNodes.rightEar = rightEarGroup;
  }

  _buildRoboticArm(side, sign, chestBone, mat) {
    const isLeft = side === 'L';

    // 1. Clavicle / Shoulder Joint (Ergonomic fit to continuous torso)
    const shoulderBone = new THREE.Bone();
    shoulderBone.name = `${isLeft ? 'Left' : 'Right'}Shoulder`;
    shoulderBone.position.set(sign * 0.165, 0.19, 0.0);
    chestBone.add(shoulderBone);
    this.bones[shoulderBone.name] = shoulderBone;

    // Charcoal Ball Socket Housing
    const socketGeom = new THREE.SphereGeometry(0.044, 24, 20);
    const socketMesh = new THREE.Mesh(socketGeom, mat.charcoalShell);
    shoulderBone.add(socketMesh);

    // Protective Silver-Grey Shoulder Deltoid Pauldron
    const shoulderCowl = new THREE.Mesh(Geoms.createShoulderShellGeometry(), mat.greyArmor);
    shoulderCowl.position.set(sign * 0.012, 0.015, 0.0);
    shoulderCowl.rotation.set(0.1, sign * 0.2, sign * -Math.PI * 0.45);
    shoulderCowl.scale.set(1.02, 1.18, 0.96);
    shoulderCowl.castShadow = true;
    shoulderBone.add(shoulderCowl);
    this.meshes.push(shoulderCowl);

    // Asymmetric Deltoid Ridge Slit (Left: Electric Blue, Right: Amber)
    const sideGlow = isLeft ? mat.blueGlow : mat.amberGlow;
    const deltoidVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.048, 0.007), sideGlow);
    deltoidVent.position.set(sign * 0.052, 0.035, 0.015);
    deltoidVent.rotation.set(0, sign * 0.2, sign * -0.3);
    shoulderBone.add(deltoidVent);

    // 2. Upper Arm (Natural ergonomic hang along torso sides)
    const upperArmBone = new THREE.Bone();
    upperArmBone.name = `${isLeft ? 'Left' : 'Right'}UpperArm`;
    upperArmBone.position.set(sign * 0.025, -0.045, 0.0);
    upperArmBone.rotation.set(0.24, sign * -0.05, sign * 0.14);
    shoulderBone.add(upperArmBone);
    this.bones[upperArmBone.name] = upperArmBone;

    // Silver-Grey Upper Arm Armor Sleeve
    const armGeom = Geoms.createRoboticLimbGeometry(0.24, 0.046, 0.038);
    const upperArmMesh = new THREE.Mesh(armGeom, mat.greyArmor);
    upperArmMesh.position.set(0, -0.12, 0.0);
    upperArmMesh.castShadow = true;
    upperArmBone.add(upperArmMesh);
    this.meshes.push(upperArmMesh);

    // Charcoal Inner Arm Mechanical Inset
    const innerArmGeom = new THREE.CylinderGeometry(0.034, 0.030, 0.19, 16);
    const innerArmMesh = new THREE.Mesh(innerArmGeom, mat.charcoalShell);
    innerArmMesh.position.set(0, -0.12, 0.0);
    upperArmBone.add(innerArmMesh);

    // 3. Elbow Joint (Mechanical Dual-Ring Pivot Discs)
    const elbowBone = new THREE.Bone();
    elbowBone.name = `${isLeft ? 'Left' : 'Right'}Elbow`;
    elbowBone.position.set(0, -0.24, 0.0);
    elbowBone.rotation.x = -0.92; // Natural ISL ready stance: forearms held up in front of lower chest
    upperArmBone.add(elbowBone);
    this.bones[elbowBone.name] = elbowBone;

    // Dual-Ring Concentric Elbow Disc
    const elbowPivot = new THREE.Mesh(Geoms.createMechanicalJointDiscGeometry(0.038, 0.030), mat.mechanicalJoint);
    elbowBone.add(elbowPivot);

    // Glowing Concentric Accent Ring on Elbow
    const elbowAccent = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0035, 12, 24), sideGlow);
    elbowAccent.rotateY(Math.PI / 2);
    elbowBone.add(elbowAccent);

    // 4. Forearm
    const forearmBone = new THREE.Bone();
    forearmBone.name = `${isLeft ? 'Left' : 'Right'}Forearm`;
    forearmBone.position.set(0, -0.035, 0.0);
    forearmBone.rotation.y = sign * 0.35; // Natural semi-pronation
    elbowBone.add(forearmBone);
    this.bones[forearmBone.name] = forearmBone;

    const forearmGeom = Geoms.createRoboticLimbGeometry(0.22, 0.040, 0.032);
    const forearmMesh = new THREE.Mesh(forearmGeom, mat.greyArmor);
    forearmMesh.position.set(0, -0.11, 0.0);
    forearmMesh.castShadow = true;
    forearmBone.add(forearmMesh);
    this.meshes.push(forearmMesh);

    // Forearm Glowing Amber Vertical Slit (matching reference image exactly)
    const forearmAccentVent = new THREE.Mesh(Geoms.createAccentSlitGeometry(0.045, 0.007), mat.amberGlow);
    forearmAccentVent.position.set(sign * 0.038, -0.10, 0.012);
    forearmAccentVent.rotation.set(0, sign * Math.PI / 2, 0);
    forearmBone.add(forearmAccentVent);

    // Charcoal Recessed Panel Section (matching reference image)
    const forearmInset = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.09, 0.024), mat.charcoalShell);
    forearmInset.position.set(sign * -0.014, -0.10, -0.010);
    forearmBone.add(forearmInset);

    // Forearm Asymmetric Sensor Ring
    const forearmRingGeom = new THREE.TorusGeometry(0.040, 0.004, 10, 24);
    forearmRingGeom.rotateX(Math.PI / 2);
    const forearmRingMesh = new THREE.Mesh(forearmRingGeom, sideGlow);
    forearmRingMesh.position.set(0, -0.16, 0.0);
    forearmBone.add(forearmRingMesh);

    // 5. Wrist (Refined Mechanical Wrist Cuffs matching reference)
    const wristBone = new THREE.Bone();
    wristBone.name = `${isLeft ? 'Left' : 'Right'}Wrist`;
    wristBone.position.set(0, -0.22, 0.0);
    wristBone.rotation.set(0.10, sign * 0.18, sign * -0.12);
    forearmBone.add(wristBone);
    this.bones[wristBone.name] = wristBone;

    // Sculpted Dual-Tier Mechanical Wrist Collar
    const wristCollarGeom = Geoms.createWristCuffGeometry();
    const wristCollarMesh = new THREE.Mesh(wristCollarGeom, mat.mechanicalJoint);
    wristBone.add(wristCollarMesh);

    // Illuminated Wrist Sensor Ring (Amber Right Wrist, Blue Left Wrist)
    const wristSensorGeom = Geoms.createWristSensorRingGeometry();
    const wristSensorMesh = new THREE.Mesh(wristSensorGeom, sideGlow);
    wristSensorMesh.position.set(0, 0.001, 0.0);
    wristBone.add(wristSensorMesh);

    // 6. High-Detail 5-Finger Articulated Hand
    const handResult = buildProceduralHand(side, mat);
    handResult.root.rotation.set(0, 0, Math.PI);
    handResult.root.position.set(0, 0.062, 0.0);
    wristBone.add(handResult.root);

    // Register hand bones into main bone lookup
    for (const bName in handResult.bones) {
      this.bones[bName] = handResult.bones[bName];
    }

    if (isLeft) {
      this.handLeftGroup = handResult.root;
      this.leftHandFingerControllers = handResult.fingerControllers;
    } else {
      this.handRightGroup = handResult.root;
      this.rightHandFingerControllers = handResult.fingerControllers;
    }
  }

  _buildRoboticLeg(side, sign, pelvisBone, mat) {
    const isLeft = side === 'L';

    // 1. Hip Joint
    const hipBone = new THREE.Bone();
    hipBone.name = `${isLeft ? 'Left' : 'Right'}Hip`;
    hipBone.position.set(sign * 0.095, -0.12, 0.0);
    pelvisBone.add(hipBone);
    this.bones[hipBone.name] = hipBone;

    // Upper Leg Thigh Armor - anatomical silver-grey armor sleeve
    const upperLegGeom = Geoms.createRoboticLimbGeometry(0.36, 0.070, 0.056);
    const upperLegMesh = new THREE.Mesh(upperLegGeom, mat.greyArmor);
    upperLegMesh.position.set(0, -0.18, 0.0);
    upperLegMesh.castShadow = true;
    upperLegMesh.receiveShadow = true;
    hipBone.add(upperLegMesh);
    this.meshes.push(upperLegMesh);

    // 2. Knee Mechanical Pivot Hinge
    const kneeBone = new THREE.Bone();
    kneeBone.name = `${isLeft ? 'Left' : 'Right'}Knee`;
    kneeBone.position.set(0, -0.36, 0.0);
    hipBone.add(kneeBone);
    this.bones[kneeBone.name] = kneeBone;

    // Precision mechanical knee joint block
    const kneeJointGeom = Geoms.createRoboticKneeGeometry();
    const kneeJoint = new THREE.Mesh(kneeJointGeom, mat.mechanicalJoint);
    kneeJoint.castShadow = true;
    kneeBone.add(kneeJoint);

    // Coral indicator accent tab on knee front face
    const kneeCoralTabGeom = new THREE.BoxGeometry(0.042, 0.012, 0.020);
    const kneeCoralTab = new THREE.Mesh(kneeCoralTabGeom, mat.coralGlow);
    kneeCoralTab.position.set(0, 0.024, 0.034);
    kneeBone.add(kneeCoralTab);

    // 3. Lower Leg Shin Armor - sleek dark charcoal/black matching reference
    const lowerLegGeom = Geoms.createRoboticLimbGeometry(0.34, 0.056, 0.044);
    const lowerLegMesh = new THREE.Mesh(lowerLegGeom, mat.charcoalShell);
    lowerLegMesh.position.set(0, -0.17, 0.0);
    lowerLegMesh.castShadow = true;
    lowerLegMesh.receiveShadow = true;
    kneeBone.add(lowerLegMesh);
    this.meshes.push(lowerLegMesh);

    // 4. Ankle Joint
    const footBone = new THREE.Bone();
    footBone.name = `${isLeft ? 'Left' : 'Right'}Ankle`;
    footBone.position.set(0, -0.34, 0.0);
    kneeBone.add(footBone);
    this.bones[footBone.name] = footBone;

    // Mechanical ankle disc pivot
    const anklePivotGeom = Geoms.createMechanicalJointDiscGeometry(0.036, 0.028);
    const anklePivot = new THREE.Mesh(anklePivotGeom, mat.mechanicalJoint);
    anklePivot.position.set(0, 0.010, 0.0);
    footBone.add(anklePivot);

    // Sculpted Silver-Grey Robot Foot Shoe with stable ground sole
    const footGeom = Geoms.createRoboticFootGeometry();
    const footMesh = new THREE.Mesh(footGeom, mat.greyArmor);
    footMesh.position.set(0, -0.024, 0.032);
    footMesh.castShadow = true;
    footMesh.receiveShadow = true;
    footBone.add(footMesh);
    this.meshes.push(footMesh);
  }

  setWireframe(enabled) {
    for (const key in this.materials) {
      if (this.materials[key] && typeof this.materials[key].wireframe !== 'undefined') {
        this.materials[key].wireframe = Boolean(enabled);
      }
    }
  }

  /**
   * Set avatar outer layer coating color and clearcoat lacquer properties
   * @param {string|number|THREE.Color} color - Preset name, hex string, or THREE.Color
   * @param {Object} options - Optional clearcoat, roughness, metalness overrides
   */
  setOuterLayerCoating(color, options = {}) {
    if (!this.materials || !this.materials.greyArmor) return;

    const PRESETS = {
      default: { color: 0xD9222A, clearcoat: 0.92, clearcoatRoughness: 0.12, metalness: 0.35, roughness: 0.22 },
      red: { color: 0xD9222A, clearcoat: 0.92, clearcoatRoughness: 0.12, metalness: 0.35, roughness: 0.22 },
      silver: { color: 0xDFE3E8, clearcoat: 0.88, clearcoatRoughness: 0.12, metalness: 0.35, roughness: 0.20 },
      white: { color: 0xF4F6F9, clearcoat: 0.95, clearcoatRoughness: 0.08, metalness: 0.25, roughness: 0.18 },
      blue: { color: 0x6FA3EF, clearcoat: 0.92, clearcoatRoughness: 0.10, metalness: 0.38, roughness: 0.20 },
      coral: { color: 0xFF6F61, clearcoat: 0.90, clearcoatRoughness: 0.12, metalness: 0.30, roughness: 0.22 },
      amber: { color: 0xFFC107, clearcoat: 0.88, clearcoatRoughness: 0.14, metalness: 0.40, roughness: 0.22 },
      stealth: { color: 0x1E222A, clearcoat: 0.80, clearcoatRoughness: 0.18, metalness: 0.45, roughness: 0.28 },
      emerald: { color: 0x10B981, clearcoat: 0.90, clearcoatRoughness: 0.10, metalness: 0.35, roughness: 0.20 },
      lavender: { color: 0xA78BFA, clearcoat: 0.92, clearcoatRoughness: 0.10, metalness: 0.32, roughness: 0.20 },
      gold: { color: 0xD4AF37, clearcoat: 0.95, clearcoatRoughness: 0.10, metalness: 0.65, roughness: 0.18 }
    };

    let targetColor;
    let targetClearcoat = options.clearcoat !== undefined ? options.clearcoat : 0.92;
    let targetClearcoatRoughness = options.clearcoatRoughness !== undefined ? options.clearcoatRoughness : 0.12;
    let targetMetalness = options.metalness !== undefined ? options.metalness : 0.35;
    let targetRoughness = options.roughness !== undefined ? options.roughness : 0.22;

    if (typeof color === 'string' && PRESETS[color.toLowerCase()]) {
      const p = PRESETS[color.toLowerCase()];
      targetColor = new THREE.Color(p.color);
      targetClearcoat = p.clearcoat;
      targetClearcoatRoughness = p.clearcoatRoughness;
      targetMetalness = p.metalness;
      targetRoughness = p.roughness;
    } else if (color instanceof THREE.Color) {
      targetColor = color;
    } else {
      try {
        targetColor = new THREE.Color(color);
      } catch {
        targetColor = new THREE.Color(0xD9222A);
      }
    }

    this.materials.greyArmor.color.copy(targetColor);
    if (this.materials.greyArmor.clearcoat !== undefined) {
      this.materials.greyArmor.clearcoat = targetClearcoat;
      this.materials.greyArmor.clearcoatRoughness = targetClearcoatRoughness;
      this.materials.greyArmor.metalness = targetMetalness;
      this.materials.greyArmor.roughness = targetRoughness;
    }
    this.materials.greyArmor.needsUpdate = true;
  }

  setUpperBodyGhosted(ghosted) {
    this.targetUpperBodyOpacity = ghosted ? 0.22 : 1.0;
  }

  setUpperBodyTransparency(opacity) {
    this.targetUpperBodyOpacity = THREE.MathUtils.clamp(opacity, 0.0, 1.0);
  }

  _applyUpperBodyOpacity(factor) {
    if (!this.upperBodyMeshes) return;
    for (const mesh of this.upperBodyMeshes) {
      if (mesh && mesh.material) {
        mesh.material.transparent = factor < 0.99;
        const base = mesh.userData?.baseOpacity !== undefined ? mesh.userData.baseOpacity : 1.0;
        mesh.material.opacity = base * factor;
        mesh.material.needsUpdate = true;
      }
    }
  }

  update(delta) {
    // Smooth dynamic upper body transparency during two-handed signs
    if (this.currentUpperBodyOpacity !== undefined && this.targetUpperBodyOpacity !== undefined) {
      if (Math.abs(this.currentUpperBodyOpacity - this.targetUpperBodyOpacity) > 0.002) {
        this.currentUpperBodyOpacity = THREE.MathUtils.lerp(
          this.currentUpperBodyOpacity,
          this.targetUpperBodyOpacity,
          Math.min(1.0, 9.0 * delta)
        );
        this._applyUpperBodyOpacity(this.currentUpperBodyOpacity);
      }
    }

    if (this.headController) {
      this.headController.update(delta);
    }
    if (this.faceController) {
      this.faceController.update(delta);
    }
    if (this.bodyController) {
      this.bodyController.update(delta);
    }
    if (this.shoulderController) {
      this.shoulderController.update(delta);
    }
    if (this.armController) {
      this.armController.update(delta);
    }
    if (this.wristController) {
      this.wristController.update(delta);
    }
    if (this.leftHandController) {
      this.leftHandController.update(delta);
    }
    if (this.rightHandController) {
      this.rightHandController.update(delta);
    }
  }

  setExpression(name) {
    if (this.faceController && ROBOT_10_EXPRESSIONS[name]) {
      this.faceController.setExpression(name);
    }
  }

  getAvailableExpressions() {
    return Object.keys(ROBOT_10_EXPRESSIONS);
  }

  dispose() {
    if (this.materials) {
      this.materials.dispose();
    }
  }
}
