/**
 * Hastivo — Avatar Service
 * Handles avatar asset resolution, active model preference, and asset verification.
 * 
 * Supports:
 * - X-Bot: Female Bot (/models/x-bot.fbx)
 * - Y-Bot: Male Bot (/models/y-bot.fbx)
 * - Procedural: Hastivo Procedural Robot
 */

export const AVATAR_MODELS = [
  {
    id: 'x-bot',
    name: 'X-Bot',
    label: 'X-Bot (Female)',
    gender: 'female',
    genderSymbol: '♀',
    badge: 'Female Bot',
    format: 'Blender FBX',
    path: '/models/x-bot.fbx',
    fallbackPath: '/models/X Bot.fbx',
    description: 'Sleek female humanoid robot assistant with 65-bone Mixamo rig and PBR armor shell.',
    polycount: '84,816 surface verts + 62,520 joint verts',
    accentColor: '#FF6F61',
    defaultCoating: '#E2E6EC',
    rig: 'Mixamo 65-Bone Humanoid',
    digits: '5-Digit Kinematic Articulation'
  },
  {
    id: 'y-bot',
    name: 'Y-Bot',
    label: 'Y-Bot (Male)',
    gender: 'male',
    genderSymbol: '♂',
    badge: 'Male Bot',
    format: 'Blender FBX',
    path: '/models/y-bot.fbx',
    fallbackPath: '/models/Y Bot.fbx',
    description: 'Athletic male humanoid robot assistant with 65-bone Mixamo rig and PBR armor shell.',
    polycount: '103,440 surface verts + 62,520 joint verts',
    accentColor: '#6FA3EF',
    defaultCoating: '#DFE4EB',
    rig: 'Mixamo 65-Bone Humanoid',
    digits: '5-Digit Kinematic Articulation'
  },
  {
    id: 'procedural',
    name: 'Hastivo Procedural',
    label: 'Hastivo (Procedural)',
    gender: 'neutral',
    genderSymbol: '🤖',
    badge: 'Procedural Rig',
    format: 'Three.js Direct',
    path: null,
    description: '100% Procedural Three.js non-humanoid robot assistant with glowing digital visor expressions.',
    polycount: 'Procedural geometries & morph targets',
    accentColor: '#FFC107',
    defaultCoating: '#DFE3E8',
    rig: 'Custom Kinematic Skeleton',
    digits: 'Procedural 5-Finger Knuckles'
  }
];

export const avatarService = {
  getAvailableModels() {
    return AVATAR_MODELS;
  },

  getModelConfig(modelId = 'x-bot') {
    return AVATAR_MODELS.find(m => m.id === modelId) || AVATAR_MODELS[0];
  },

  getActiveModel() {
    try {
      const stored = localStorage.getItem('hastivo_active_avatar');
      if (stored && AVATAR_MODELS.some(m => m.id === stored)) {
        return stored;
      }
    } catch {
      // LocalStorage might be disabled
    }
    return 'x-bot'; // Default to X-Bot (Female)
  },

  setActiveModel(modelId) {
    try {
      localStorage.setItem('hastivo_active_avatar', modelId);
    } catch {
      // LocalStorage might be disabled
    }
  },

  async checkModelAvailable(modelId = 'x-bot') {
    const config = this.getModelConfig(modelId);
    if (!config.path) return true; // Procedural is always available

    try {
      const res = await fetch(config.path, { method: 'HEAD' });
      if (res.ok) return true;
      if (config.fallbackPath) {
        const fallbackRes = await fetch(config.fallbackPath, { method: 'HEAD' });
        return fallbackRes.ok;
      }
      return false;
    } catch {
      return false;
    }
  },

  async checkAvatarAssetAvailable() {
    // Check both X-Bot and Y-Bot assets
    const xOk = await this.checkModelAvailable('x-bot');
    const yOk = await this.checkModelAvailable('y-bot');
    return xOk && yOk;
  },

  getApprovedPoses() {
    return [
      { id: 'idleBreathing', label: 'Idle Breathing' },
      { id: 'neutral', label: 'Neutral T-Stance' },
      { id: 'wave', label: 'Wave & Greet' },
      { id: 'present', label: 'Present / Point' },
      { id: 'thumbsUp', label: 'Thumbs Up' },
      { id: 'thinking', label: 'Thinking Pose' },
      { id: 'shrug', label: 'Shrug on Error' },
      { id: 'listening', label: 'Listening Pose' },
      { id: 'acknowledgement', label: 'Acknowledgement' },
      { id: 'errorReaction', label: 'Error Reaction' }
    ];
  }
};
