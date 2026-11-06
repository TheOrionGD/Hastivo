export interface RealSourceItem {
  id: string;
  name: string;
  badge: string;
  institution: string;
  category: string;
  sampleCount: string;
  logo: string;
  description: string;
  specs: { label: string; val: string }[];
  license: string;
  sourceStatus: "External Verified Resource" | "Validated Open Standard";
  website: string;
  repoPath: string;
}

export const realSourcesData: RealSourceItem[] = [
  {
    id: "isl-isolated-dataset",
    name: "Indian Sign Language (ISL) 42K Dataset",
    badge: "42,745 Samples",
    institution: "Hugging Face / Hemg Research",
    category: "Sign Benchmark",
    sampleCount: "42,745 Annotated Parquet Samples",
    logo: "/assets/source-logos/huggingface.svg",
    description:
      "Full 35-class Indian Sign Language isolated gesture corpus comprising numerals 1–9 and alphabets A–Z. Sourced directly from verified open research repositories and cached locally for benchmark testing.",
    specs: [
      { label: "Corpus Volume", val: "42,745 Images" },
      { label: "Classes", val: "35 (A–Z, 1–9)" },
      { label: "Storage Format", val: "Parquet (292.2 MB)" },
      { label: "Resource Origin", val: "Hugging Face Dataset Hub" }
    ],
    license: "Creative Commons / Open Research",
    sourceStatus: "External Verified Resource",
    website: "https://huggingface.co/datasets/Hemg/Indian_sign_language_dataset",
    repoPath: "data/isl_dataset/data/train-00000-of-00001-a1731e778755d263.parquet"
  },
  {
    id: "isltranslate-iitk",
    name: "ISLTranslate Continuous Corpus",
    badge: "31,222 Sentence Pairs",
    institution: "IIT Kanpur (Exploration Lab, ACL 2023)",
    category: "Translation Corpus",
    sampleCount: "31,222 Continuous Sign Sentences",
    logo: "/assets/source-logos/iitk-github.svg",
    description:
      "First and largest open research translation dataset for continuous Indian Sign Language (Joshi, Agrawal, Modi, ACL 2023) featuring corresponding English transcripts and 291 human gold-validated signer evaluations.",
    specs: [
      { label: "Sentence Pairs", val: "31,222 Pairs" },
      { label: "Signer Validation", val: "291 Gold Pairs" },
      { label: "Publication", val: "ACL 2023 Findings" },
      { label: "Resource Origin", val: "IITK Exploration Lab GitHub" }
    ],
    license: "CC BY-NC 4.0",
    sourceStatus: "External Verified Resource",
    website: "https://github.com/Exploration-Lab/ISLTranslate",
    repoPath: "data/isltranslate_github/ISLTranslate.csv"
  },
  {
    id: "bridgeconn-isl",
    name: "BridgeConn ISL Lexicon & DWPose",
    badge: "3,077 Lexical Signs",
    institution: "Bridge Connectivity Solutions Pvt. Ltd.",
    category: "Kinematics Corpus",
    sampleCount: "3,077 Lexicon Words / DWPose NPZ",
    logo: "/assets/source-logos/bridgeconn.svg",
    description:
      "High-fidelity Indian Sign Language Bible (ISLV) video recordings, 133-point dense DWPose kinematics (.npz), and MediaPipe pose tracking developed by Bridge Connectivity Solutions.",
    specs: [
      { label: "Lexicon Words", val: "3,077 Tokens" },
      { label: "Dense Kinematics", val: "DWPose NPZ (133 Pts)" },
      { label: "Video Capture", val: "1080p @ 29 FPS" },
      { label: "Resource Origin", val: "Bridge Connectivity Solutions" }
    ],
    license: "CC BY-SA 4.0",
    sourceStatus: "External Verified Resource",
    website: "https://huggingface.co/datasets/bridgeconn/sign-dictionary-isl",
    repoPath: "data/bridgeconn_isl/manifest.json"
  },
  {
    id: "wlasl-dataset",
    name: "WLASL Word-Level Sign Lexicon",
    badge: "21,083 Instances",
    institution: "World-Level American Sign Language (WLASL v0.3)",
    category: "Comparative Lexicon",
    sampleCount: "2,000 Glosses / 21,083 Instances",
    logo: "/assets/source-logos/wlasl.svg",
    description:
      "Largest open research word-level sign corpus compiled across multiple accredited sign banks (ASL Signbank, ASL Pro, SignSchool) used for cross-lingual kinematic benchmarking.",
    specs: [
      { label: "Gloss Tokens", val: "2,000 Signs" },
      { label: "Video Instances", val: "21,083 Clips" },
      { label: "Contributing Signers", val: "119 Native Signers" },
      { label: "Resource Origin", val: "WLASL Academic Initiative" }
    ],
    license: "Academic Open Research",
    sourceStatus: "External Verified Resource",
    website: "https://dxli94.github.io/WLASL/",
    repoPath: "data/wlasl_dataset/WLASL_v0.3.json"
  },
  {
    id: "mediapipe-holistic",
    name: "Google MediaPipe Landmark Engine",
    badge: "543 Biometric Keypoints",
    institution: "Google Research / AI Perception",
    category: "Vision Framework",
    sampleCount: "60 FPS Client-Side Landmark Pipeline",
    logo: "/assets/source-logos/mediapipe.svg",
    description:
      "Open-source landmark tracking pipeline by Google Research providing client-side 543 topological keypoints (33 pose, 468 face, 42 hand) executing entirely in the user's browser without uploading camera video.",
    specs: [
      { label: "Landmark Count", val: "543 3D Keypoints" },
      { label: "Runtime Engine", val: "Client-Side WASM / WebGL" },
      { label: "Camera Data", val: "Zero Remote Video Egress" },
      { label: "Resource Origin", val: "Google AI Perception" }
    ],
    license: "Apache 2.0",
    sourceStatus: "Validated Open Standard",
    website: "https://ai.google.dev/edge/mediapipe",
    repoPath: "frontend/public/hand_landmarker.task"
  },
  {
    id: "mixamo-rig-standard",
    name: "Adobe Mixamo Skeletal Rig Hierarchy",
    badge: "65-Bone Skeletal Rig",
    institution: "Adobe Research & Mixamo Animation Lab",
    category: "3D Animation Standard",
    sampleCount: "65 Skeletal Bones / Multi-Axis Quaternions",
    logo: "/assets/source-logos/mixamo.svg",
    description:
      "Industry standard humanoid skeletal hierarchy established by Adobe Mixamo, governing the 65-bone joint and 15 finger-joint orientation quaternions used for real-time 3D signing avatar animations.",
    specs: [
      { label: "Bone Rig Count", val: "65 Standard Bones" },
      { label: "Hand Articulation", val: "15 Joints / Hand" },
      { label: "Render Engine", val: "Three.js WebGL" },
      { label: "Resource Origin", val: "Adobe Mixamo Standard" }
    ],
    license: "Royalty-Free Standard Rig",
    sourceStatus: "Validated Open Standard",
    website: "https://www.mixamo.com/",
    repoPath: "frontend/public/models/v-bot_x_y-bot.glb"
  },
  {
    id: "w3c-wai-standards",
    name: "W3C WAI Web Accessibility (WCAG 2.2 AA)",
    badge: "Accessibility Directive",
    institution: "World Wide Web Consortium (W3C)",
    category: "Compliance Directive",
    sampleCount: "WCAG 2.2 Level AA Standard",
    logo: "/assets/source-logos/w3c.svg",
    description:
      "Governing web accessibility guidelines established by the W3C, defining high-contrast visual ratios, accessible keyboard interaction flows, ARIA live region behaviors, and reduced-motion compliance.",
    specs: [
      { label: "Standard Level", val: "WCAG 2.2 Level AA" },
      { label: "Visual Target", val: "4.5:1 Text / 3:1 UI Contrast" },
      { label: "Motion Rule", val: "prefers-reduced-motion" },
      { label: "Resource Origin", val: "W3C Open Guidelines" }
    ],
    license: "W3C Open Standard",
    sourceStatus: "Validated Open Standard",
    website: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    repoPath: "documentation/Sign_Language_Platform_Source_of_Truth.txt"
  },
  {
    id: "iso-bcp47-matrix",
    name: "ISO 639-3 & IETF BCP-47 Dialect Codes",
    badge: "Linguistic Identifier",
    institution: "SIL International & IETF Standard",
    category: "Linguistic Standard",
    sampleCount: "Canonical Sign & Spoken Identifiers",
    logo: "/assets/source-logos/iso-sil.svg",
    description:
      "International ISO 639-3 language registry and IETF BCP-47 tags defining canonical codes for Indian Sign Language (code 'ins'), American Sign Language ('ase'), British Sign Language ('bfi'), and regional spoken dialects.",
    specs: [
      { label: "ISL Code", val: "ins (ISO 639-3)" },
      { label: "Regional Tag", val: "ins-IN (BCP-47)" },
      { label: "Grammar Model", val: "SOV Syntax Agreement" },
      { label: "Resource Origin", val: "SIL International Registry" }
    ],
    license: "ISO / IETF Global Standard",
    sourceStatus: "Validated Open Standard",
    website: "https://iso639-3.sil.org/code/ins",
    repoPath: "documentation/Sign_Language_Platform_Source_of_Truth.txt"
  }
];
