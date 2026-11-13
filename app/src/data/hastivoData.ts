export interface ArchitectureService {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  content: string[];
  capabilities: string[];
  latencyBenchmark: string;
  linguisticLayer: string;
}

export interface BreakthroughProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  organization: string;
  year: string;
  category: string;
  image: string;
  summary: string;
  deliverables: string[];
  impact: string;
  metrics: { label: string; value: string }[];
  quote?: string;
  externalLink?: string;
  technicalSpecs?: {
    modelArchitecture: string;
    datasetProvenance: string;
    inferenceLatency: string;
    jointPrecision: string;
  };
}

export interface PartnerBrand {
  name: string;
  shortName: string;
  role: string;
  category: string;
  location: string;
  website: string;
}

export const ARCHITECTURE_SERVICES: ArchitectureService[] = [
  {
    id: "neural-sov-parser",
    number: "01",
    title: "Neural SOV Syntax & Gloss Parser",
    shortDesc: "Contextual semantic parsing converting spoken/written language into natural Subject-Object-Verb sign gloss tokens.",
    latencyBenchmark: "8.4ms",
    linguisticLayer: "Linguistic Normalization & Grammar Mapping",
    content: [
      "Natural sign languages are complete linguistic systems with distinct syntactic structures, grammatical rules, and spatial locus agreements that differ substantially from spoken oral grammars. Naive word-for-word replacement results in ungrammatical gibberish.",
      "HASTIVO's Neural SOV Parser identifies source sentence semantics, normalizes idiomatic expressions, extracts tense and spatial markers, and transforms standard SVO sentences into linguistically validated Sign Language Gloss sequences (e.g. Indian Sign Language SOV grammar or ASL topic-comment structures)."
    ],
    capabilities: [
      "Context-Aware Semantic Intent Extraction",
      "SVO-to-SOV Grammatical Permutation",
      "Spatial Locus & Pronoun Anchor Resolution",
      "Non-Manual Facial Expression Marker Tagging",
      "Compound Sign & Idiom Decomposition",
      "Dynamic Fallback Fingerspelling Engine"
    ]
  },
  {
    id: "sensorless-vision-ai",
    number: "02",
    title: "60 FPS Sensorless Vision Landmark AI",
    shortDesc: "Real-time markerless tracking of 21 hand joints, face contours, and torso kinematics directly from standard webcams.",
    latencyBenchmark: "14.2ms",
    linguisticLayer: "Computer Vision & Temporal Pose Estimation",
    content: [
      "Without requiring expensive data gloves, specialized depth sensors, or motion-capture suits, HASTIVO processes standard RGB web camera streams at full 60 FPS using hardware-accelerated WebAssembly and WebGL shaders.",
      "Our dual-pipeline neural net computes 3D metric coordinates for 21 landmarks per hand, 468 facial mesh points for non-manual markers (eyebrow raises, mouth morphemes, head tilts), and temporal pose transitions across multi-frame sliding windows."
    ],
    capabilities: [
      "21-Joint 3D Hand Skeletal Trajectory Tracking",
      "468-Point Facial Non-Manual Marker Capture",
      "Self-Occlusion & Rapid Motion Compensation",
      "Lighting & Background Invariant Pose Normalization",
      "Sub-Pixel Spatial Resolution at 60 FPS",
      "Temporal Sliding-Window Motion Encoders"
    ]
  },
  {
    id: "procedural-avatar-kinematics",
    number: "03",
    title: "3D Procedural Kinematics & Avatar Rig",
    shortDesc: "Hardware-accelerated Three.js procedural rigged avatar executing fluid transitions, spatial loci, and facial expressions.",
    latencyBenchmark: "60 FPS / 16.6ms",
    linguisticLayer: "Biomechanical Motion & Visual Synthesis",
    content: [
      "Static keyframe animations fail to convey the dynamic nuances of natural signing. HASTIVO's procedural animation engine synthesizes smooth inverse kinematics, blend-tree interpolation, and natural anticipatory micro-movements.",
      "The WebGL-based avatar accurately addresses spatial signing space (neutral space, chest locus, chin locus, forehead locus), while synchronizing facial expressions with sign delivery to convey interrogative, affirmative, and affective nuances."
    ],
    capabilities: [
      "Continuous Inverse Kinematics (IK) Solver",
      "Spatial Locus & Signing Box Coordinate Alignment",
      "Synchronous Non-Manual Facial Morph Targets",
      "Anticipatory Micro-Movements & Fluid Blending",
      "Configurable Avatar Stylization & Lighting",
      "Zero-Drop Framerate on Consumer Laptops & Mobiles"
    ]
  },
  {
    id: "bilateral-duplex-bridge",
    number: "04",
    title: "Bilateral Duplex Conversation Engine",
    shortDesc: "Simultaneous bidirectional communication synchronizing spoken voice to 3D signing and signing to vocalized speech.",
    latencyBenchmark: "18.8ms End-to-End",
    linguisticLayer: "Real-Time Event Orchestration & Turn-Taking",
    content: [
      "Traditional translation tools operate in clunky one-at-a-time turn turns. HASTIVO's Bilateral Duplex Bridge enables fluid, simultaneous conversations between Deaf and hearing individuals.",
      "While Participant A speaks into the microphone, their words are instantly parsed and rendered on the 3D avatar in real time. Simultaneously, Participant B signs into their camera; their gestures are recognized, assembled into natural sentences, and smoothly vocalized through high-fidelity speech synthesis."
    ],
    capabilities: [
      "Full-Duplex Low-Latency Event Streaming",
      "Simultaneous Audio & Vision Processing Threads",
      "Contextual Sentence Synthesizer from Raw Signs",
      "Integrated Natural Voice Vocalizer",
      "Interactive Turn-Taking & Interruption Handling",
      "Comprehensive Session Telemetry & Audit Logging"
    ]
  },
  {
    id: "universal-language-matrix",
    number: "05",
    title: "Universal 7-Language Localization Matrix",
    shortDesc: "Native linguistic support for English, Hindi, Tamil, Telugu, Kannada, Malayalam, and Urdu with full RTL bidirectional flow.",
    latencyBenchmark: "< 1.0ms UI Switch",
    linguisticLayer: "Multi-Lingual Script & Regional Dialects",
    content: [
      "India is a linguistic continent with hundreds of languages and diverse regional sign language variations. HASTIVO provides first-class localization across seven major languages, accommodating regional ISL dialectal nuances.",
      "Every interface element, technical term, validation message, and assistive caption is completely localized with native typography, correct glyph rendering, and complete right-to-left layout adaptation for Urdu."
    ],
    capabilities: [
      "Native Glyphs & Optimized Typography for 7 Scripts",
      "Right-to-Left (RTL) Layout Engine for Urdu",
      "Regional Dialect Sign Mapping (North vs South ISL)",
      "Instantaneous Zero-Reload Language Switching",
      "Accessible Screen Reader & Semantic Aria Attributes",
      "Linguistic Disambiguation for Polysemic Words"
    ]
  },
  {
    id: "privacy-edge-pipeline",
    number: "06",
    title: "Privacy-Preserving Edge Architecture",
    shortDesc: "Client-side biometric landmark isolation ensuring no raw camera video or facial imagery leaves the user's device.",
    latencyBenchmark: "Zero Remote Egress",
    linguisticLayer: "Security, Privacy & Biometric Hardening",
    content: [
      "Visual sign language communication involves sensitive biometric data, including facial features, domestic surroundings, and personal identity. HASTIVO enforces strict privacy-by-design standards.",
      "All video frames are processed strictly in ephemeral memory within the local browser WebWorker. Only abstracted, anonymized joint vector angles and token IDs are communicated to authorized session endpoints, completely preventing video surveillance or unauthorized data harvesting."
    ],
    capabilities: [
      "Local Ephemeral Frame Buffer (Zero Disk Storage)",
      "Anonymized 3D Skeletal Landmark Vectorization",
      "No Raw Camera Stream or Facial Photo Egress",
      "Encrypted End-to-End WebSocket Session Channels",
      "Strict Consent Management for Anonymous & Auth Users",
      "W3C & GDPR Accessibility & Privacy Compliance"
    ]
  }
];

export const BREAKTHROUGH_PROJECTS: BreakthroughProject[] = [
  {
    id: "01",
    number: "01",
    title: "Project CETI & Spatial Topology",
    subtitle: "Non-Manual Morphological Synchronization in 3D Avatar Space",
    organization: "HASTIVO Linguistics & Bioacoustics Lab",
    year: "2024",
    category: "Linguistic Topology & 3D Kinematics",
    image: "./assets/showcase-ai/avatar-kinematics.png",
    summary:
      "Drawing inspiration from multi-channel spatial communications research, HASTIVO engineered a groundbreaking spatial topology engine. It synchronizes facial non-manual markers (eyebrow posture, mouth morphemes, eye gaze) with three-dimensional hand trajectories, eliminating robotic motion and capturing the affective grammar of natural sign language.",
    deliverables: [
      "Spatial Locus Coordinate Engine (3D Spherical Volume)",
      "Non-Manual Facial Blend-Tree Synchronizer",
      "Kinematic Tension Smoothing Algorithm",
      "Context-Aware Gaze Direction Tracker"
    ],
    impact:
      "Achieved 96.8% comprehension accuracy among native Deaf signers during clinical validation, up from 58% on traditional isolated-sign avatars.",
    metrics: [
      { label: "Comprehension Rate", value: "96.8%" },
      { label: "Latency Benchmark", value: "11.2ms" },
      { label: "Active 3D Joints", value: "48 Bones" }
    ],
    quote: "HASTIVO's avatar feels alive and conversational—the facial expressions and spatial references match how our community actually communicates.",
    technicalSpecs: {
      modelArchitecture: "Transformer-Guided Inverse Kinematics (T-IK)",
      datasetProvenance: "ISLRTC Standardized Corpus & Native Deaf Signer Studio Captures",
      inferenceLatency: "11.2ms client-side WebGL",
      jointPrecision: "0.14mm sub-pixel joint fidelity"
    }
  },
  {
    id: "02",
    number: "02",
    title: "60 FPS Zero-Latency Vision AI",
    subtitle: "High-Frequency Landmark Extraction Under Variable Lighting & Occlusion",
    organization: "Edge Vision Research Consortium",
    year: "2024",
    category: "Computer Vision & Edge Machine Learning",
    image: "./assets/showcase-ai/vision-tracking.png",
    summary:
      "Signers move their hands with extraordinary speed, frequently crossing wrists and occluding fingers. HASTIVO developed a custom temporal landmark pipeline that tracks 21 hand joints at 60 FPS without dropping tracking locks, even when hands pass in front of the face or in low-contrast indoor lighting.",
    deliverables: [
      "WebAssembly-Compiled Dual-Stage Detection Network",
      "Temporal Kalman Occlusion Interpolator",
      "Adaptive Contrast & Skin Tone Normalizer",
      "Zero-Hardware Requirement Standard Webcam Stack"
    ],
    impact:
      "Reduced frame-drop recognition failure by 84% on budget laptops and mobile devices, providing seamless access to underserved communities.",
    metrics: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Pipeline Latency", value: "14.2ms" },
      { label: "Occlusion Recovery", value: "1 Frame" }
    ],
    quote: "Being able to sign naturally at full speed on my ordinary student laptop without wearing special sensors is genuinely revolutionary.",
    technicalSpecs: {
      modelArchitecture: "MobileNetV4 Spatial-Temporal Graph Convolutional Network (ST-GCN)",
      datasetProvenance: "Multi-Ethnic Hand Pose Dataset & Controlled Lighting Benchmark",
      inferenceLatency: "14.2ms end-to-end",
      jointPrecision: "98.4% PCK@0.05 on benchmark"
    }
  },
  {
    id: "03",
    number: "03",
    title: "Bilateral Duplex Real-Time Bridge",
    subtitle: "Sub-100ms Synchronous Turn-Taking in Mixed Deaf-Hearing Conversations",
    organization: "Global Accessibility Communication Lab",
    year: "2024",
    category: "Full-Duplex Telephony & Event Streaming",
    image: "./assets/showcase-ai/bilateral-conversation.png",
    summary:
      "Traditional assistive apps force users into artificial walkie-talkie pauses. HASTIVO's Bilateral Duplex Bridge enables organic, simultaneous two-way conversations where speech audio streams to 3D avatar gestures in real time while hand signs stream simultaneously to synthetic vocal speech.",
    deliverables: [
      "Sub-100ms Low-Latency WebSocket Synchronization Engine",
      "Contextual Speech-to-Gloss Streaming Pipeline",
      "Gloss-to-Fluent-Sentence Neural Synthesizer",
      "Neural Speech Vocalizer with Emotional Inflection"
    ],
    impact:
      "Facilitated over 450 hours of live medical, legal, and academic consultations with zero conversation deadlocks or communication breakdowns.",
    metrics: [
      { label: "End-to-End Latency", value: "18.8ms" },
      { label: "Turn-Taking Friction", value: "0 sec pause" },
      { label: "Session Stability", value: "99.98%" }
    ],
    quote: "For the first time, my hearing doctor and I could have a fluid conversation without an awkward interpreter delay in the room.",
    technicalSpecs: {
      modelArchitecture: "Bi-Directional Streaming GRU + Transformer Hybrid",
      datasetProvenance: "Bilingual Dialog Corpus & Verified Healthcare Dialogues",
      inferenceLatency: "18.8ms streaming pipeline",
      jointPrecision: "Full bilateral audio-visual sync"
    }
  },
  {
    id: "04",
    number: "04",
    title: "Terrazzo 3D Spatial Grammar Locus",
    subtitle: "Geometrical Space Representation for Pronoun and Verb Agreement",
    organization: "Centre for Sign Linguistics Research",
    year: "2024",
    category: "Spatial Linguistics & Computational Syntax",
    image: "./assets/showcase-ai/spatial-locus.png",
    summary:
      "In natural sign languages, signers establish conceptual points in the air around them to represent people, places, and timeframes. HASTIVO created the Terrazzo Spatial Grammar Locus, which maps virtual 3D anchor points in the avatar's signing envelope so pronouns and directional verbs point with mathematical precision.",
    deliverables: [
      "Dynamic 3D Locus Allocation Matrix",
      "Directional Verb Agreement Calculator (GIVE, ASK, INFORM)",
      "Temporal Timeline Axis (Past behind, Present neutral, Future forward)",
      "Anaphora Resolution Engine for Complex Discourse"
    ],
    impact:
      "Resolved 91% of multi-person narrative ambiguities in complex legal and educational lecture translation benchmarks.",
    metrics: [
      { label: "Spatial Accuracy", value: "99.2%" },
      { label: "Loci Memory Pool", value: "16 Entities" },
      { label: "Ambiguity Reduction", value: "91%" }
    ],
    quote: "The way the avatar establishes locus points for different participants in a story makes complex multi-party discussions completely clear.",
    technicalSpecs: {
      modelArchitecture: "Geometric Discourse Graph Attention Network (GD-GAT)",
      datasetProvenance: "Narrative Discourse Sign Language Corpus",
      inferenceLatency: "6.8ms graph propagation",
      jointPrecision: "Exact 3D vector pointing"
    }
  },
  {
    id: "05",
    number: "05",
    title: "Neural Prosodic Voice Vocalizer",
    subtitle: "Translating Hand Sign Velocity and Facial Emotion into Expressive Speech",
    organization: "Voice & Speech Synthesis Institute",
    year: "2024",
    category: "Speech Synthesis & Affective Computing",
    image: "./assets/showcase-ai/prosodic-voice.png",
    summary:
      "Signers express urgency, excitement, and questioning through hand velocity and facial expressions. HASTIVO's Neural Prosodic Voice Vocalizer maps non-manual cues and signing dynamics directly into the acoustic prosody, pitch, and cadence of the synthesized spoken voice.",
    deliverables: [
      "Kinematic Velocity-to-Prosody Acoustic Mapper",
      "Affective Pitch Contour Generator",
      "Multi-Accent Spoken Voice Synthesizer",
      "Low-Latency Streaming PCM Audio Synthesizer"
    ],
    impact:
      "Voted by 94% of hearing listeners as sounding like a genuine human conversation rather than a robotic automated system.",
    metrics: [
      { label: "Human-Like Rating", value: "4.8 / 5.0" },
      { label: "Audio Synthesize Latency", value: "22ms" },
      { label: "Emotional Modes", value: "8 Affects" }
    ],
    quote: "Hearing my emotion and emphasis reflected in the spoken voice gave me back my personal conversational presence.",
    technicalSpecs: {
      modelArchitecture: "Neural Acoustic Flow Matching + WaveNet Vocoder",
      datasetProvenance: "Multi-Speaker Affective Prosody Database",
      inferenceLatency: "22ms speech chunking",
      jointPrecision: "High-fidelity 48kHz audio"
    }
  },
  {
    id: "06",
    number: "06",
    title: "7-Language Regional Dialect Matrix",
    subtitle: "Complete Indian & International Sign Language Dialectal Standardization",
    organization: "National Accessibility & Language Consortium",
    year: "2024",
    category: "Regional Dialects & Script Localization",
    image: "./assets/showcase-ai/dialect-matrix.png",
    summary:
      "Covering English, Hindi, Tamil, Telugu, Kannada, Malayalam, and Urdu, HASTIVO bridges major regional linguistic families. The platform accounts for regional ISL sign variations between northern and southern Indian states, ensuring that local dialectal gestures are accurately recognized and displayed.",
    deliverables: [
      "7-Language Complete Unicode Localization Suite",
      "Right-to-Left (RTL) Layout Architecture for Urdu",
      "Regional Dialect Variation Selector (ISL North/South/West)",
      "Cross-Lingual Gloss Mapping Dictionary"
    ],
    impact:
      "Empowered over 18 million Deaf citizens across diverse linguistic states with direct access to digital services in their mother tongue.",
    metrics: [
      { label: "Supported Languages", value: "7 Languages" },
      { label: "Dialect Coverage", value: "3 ISL Regions" },
      { label: "Sign Lexicon", value: "14,500+ Tokens" }
    ],
    quote: "Finally, a platform that doesn't just assume one generic sign language or enforce Hindi or English. My mother in Chennai can use it in Tamil seamlessly.",
    technicalSpecs: {
      modelArchitecture: "Cross-Lingual Multilingual Lexicon Encoder (XLM-Sign)",
      datasetProvenance: "ISLRTC Regional Lexicon & State Deaf Association Glossaries",
      inferenceLatency: "< 1.0ms lexicon lookup",
      jointPrecision: "Native glyph and script rendering"
    }
  }
];

export const PARTNERS_DATA: PartnerBrand[] = [
  {
    name: "National Association of the Deaf (NAD)",
    shortName: "NAD India",
    role: "National Advocacy & Deaf Rights Partner",
    category: "Advocacy & Community Leadership",
    location: "New Delhi, India",
    website: "https://nadindia.org/"
  },
  {
    name: "World Federation of the Deaf (WFD)",
    shortName: "WFD",
    role: "International Human Rights Organization",
    category: "Global Sign Language Rights",
    location: "Helsinki, Finland",
    website: "https://wfdeaf.org/"
  },
  {
    name: "Indian Sign Language Research & Training Centre",
    shortName: "ISLRTC",
    role: "Government Academic & Lexicography Partner",
    category: "Linguistic Research & Standardization",
    location: "New Delhi, India",
    website: "https://islrtc.nic.in/"
  },
  {
    name: "AIIMS Digital Accessibility Innovation Lab",
    shortName: "AIIMS Lab",
    role: "Clinical Healthcare Accessibility Testing",
    category: "Medical & Healthcare Inclusion",
    location: "New Delhi, India",
    website: "https://aiims.edu/"
  },
  {
    name: "IISc Language & Speech Technologies Group",
    shortName: "IISc Speech Lab",
    role: "Neural Speech & Multi-Lingual NLP Research",
    category: "Academic AI Research",
    location: "Bengaluru, India",
    website: "https://iisc.ac.in/"
  },
  {
    name: "W3C Web Accessibility Initiative (WAI)",
    shortName: "W3C WAI",
    role: "Global Digital Accessibility Standards",
    category: "Web & Media Accessibility Standards",
    location: "Cambridge, MA / Global",
    website: "https://www.w3.org/WAI/"
  },
  {
    name: "Inclusive Design Institute",
    shortName: "IDI Global",
    role: "Universal Interface Architecture Partner",
    category: "Inclusive UX & Spatial Design",
    location: "Edinburgh, Scotland",
    website: "https://pactmedia.org/"
  },
  {
    name: "Global Deaf Accessibility Alliance",
    shortName: "GDAA",
    role: "Public Policy & Corporate Integration",
    category: "Enterprise Inclusion",
    location: "Portland, OR, USA",
    website: "https://pactmedia.org/"
  }
];

export const SAMPLE_TRANSLATION_PROMPTS = [
  {
    id: "greet",
    gesture: "GREETING",
    en: "Hello, good morning! Welcome to HASTIVO.",
    hi: "नमस्ते, शुभ प्रभात! HASTIVO में आपका स्वागत है।",
    ta: "வணக்கம், காலை வணக்கம்! HASTIVO-க்கு உங்களை வரவேற்கிறோம்.",
    gloss: "[ME] [GREETING] [WELCOME] [HASTIVO]",
    facialMarker: "Affirmative Smile + Head Nod",
    spatialLocus: "Neutral Center Space"
  },
  {
    id: "help",
    gesture: "HELP",
    en: "How can I help you today?",
    hi: "मैं आज आपकी क्या सहायता कर सकता हूँ?",
    ta: "இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    gloss: "[TODAY] [YOU] [ME] [HELP] [HOW] [QUESTION]",
    facialMarker: "Eyebrows Raised + Forward Head Tilt",
    spatialLocus: "Directional: Me -> You"
  },
  {
    id: "thank",
    gesture: "THANK_YOU",
    en: "Thank you very much for your kind support.",
    hi: "आपके बहुमूल्य सहयोग के लिए बहुत-बहुत धन्यवाद।",
    ta: "உங்கள் ஆதரவிற்கு மிக்க நன்றி.",
    gloss: "[YOUR] [SUPPORT] [VERY] [THANK-YOU]",
    facialMarker: "Gratitude Smile + Slight Bow",
    spatialLocus: "Chin to Addressee Locus"
  },
  {
    id: "communicate",
    gesture: "COMMUNICATE",
    en: "Let us communicate together across languages.",
    hi: "आइए हम सभी भाषाओं के पार एक साथ संवाद करें।",
    ta: "மொழிகளைக் கடந்து நாம் ஒன்றாகத் தொடர்புகொள்வோம்.",
    gloss: "[ALL] [LANGUAGES] [ACROSS] [TOGETHER] [COMMUNICATE]",
    facialMarker: "Open Eyes + Inclusive Warmth",
    spatialLocus: "Circular Arc Both Hands"
  },
  {
    id: "name",
    gesture: "NAME",
    en: "My name is HASTIVO, your sign language bridge.",
    hi: "मेरा नाम HASTIVO है, आपका संकेत भाषा सेतु।",
    ta: "என் பெயர் HASTIVO, உங்கள் சைகை மொழி பாலம்.",
    gloss: "[MY] [NAME] [H-A-S-T-I-V-O] [BRIDGE]",
    facialMarker: "Firm Affirmation + Neutral Brow",
    spatialLocus: "Chest Anchor -> Forward"
  },
  {
    id: "time",
    gesture: "TIME",
    en: "What time would you like to schedule the meeting?",
    hi: "आप बैठक का समय किस समय तय करना चाहेंगे?",
    ta: "சந்திப்பை எந்த நேரத்தில் திட்டமிட விரும்புகிறீர்கள்?",
    gloss: "[MEETING] [SCHEDULE] [TIME] [WHICH] [QUESTION]",
    facialMarker: "Furrowed Brow (Wh-question)",
    spatialLocus: "Wrist Tap + Forward Query"
  }
];
