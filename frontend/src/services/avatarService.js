/**
 * Hastivo — Avatar Service
 * Handles avatar asset resolution, active model preference, and asset verification.
 * 
 * Uses exclusively:
 * - V-Bot: Unified Avatar Model (/models/v-bot_x_y-bot.glb)
 */

export const AVATAR_MODELS = [
  {
    id: 'v-bot',
    name: 'V-Bot',
    label: 'V-Bot (Official)',
    gender: 'neutral',
    genderSymbol: '✦',
    badge: 'Official Model',
    format: 'GLTF/GLB',
    path: '/models/v-bot_x_y-bot.glb',
    fallbackPath: '/models/v-bot_x_y-bot.glb',
    description: 'Unified high-fidelity humanoid robot assistant with full 80-bone kinematic rig and PBR armor shell.',
    polycount: '28 skinned meshes, 80 bones',
    accentColor: '#FF6F61',
    defaultCoating: '#E2E6EC',
    rig: 'Mixamo 80-Bone Humanoid',
    digits: '5-Digit Kinematic Articulation'
  }
];

export const avatarService = {
  getAvailableModels() {
    return AVATAR_MODELS;
  },

  getModelConfig(_modelId = 'v-bot') {
    return AVATAR_MODELS[0];
  },

  getActiveModel() {
    return 'v-bot';
  },

  setActiveModel(_modelId) {
    try {
      localStorage.setItem('hastivo_active_avatar', 'v-bot');
    } catch {
      // LocalStorage might be disabled
    }
  },

  async checkModelAvailable(_modelId = 'v-bot') {
    try {
      const res = await fetch('/models/v-bot_x_y-bot.glb', { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async checkAvatarAssetAvailable() {
    return this.checkModelAvailable('v-bot');
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
