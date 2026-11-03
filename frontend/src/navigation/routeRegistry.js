/**
 * Signora — Central Route & Command Registry
 * Shared between React Router, Command Palette, and Global Voice Navigation.
 * Role permissions are enforced consistently.
 */

export const USER_ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
};

export const ROUTES = [
  // Citizen Accessible Routes (Accessible by authenticated citizens and administrators)
  {
    id: 'citizen-dashboard',
    label: 'Citizen Dashboard',
    path: '/dashboard',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['dashboard', 'home', 'main dashboard', 'citizen home'],
    description: 'Central hub for communication modules and activities',
    category: 'Core',
    inPalette: true,
  },
  {
    id: 'text-to-sign',
    label: 'Text-to-Sign',
    path: '/text-to-sign',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['text to sign', 'isl translator', 'speech to sign', 'translate text'],
    description: 'Convert written text or speech into Indian Sign Language avatar signs',
    category: 'Translation',
    inPalette: true,
  },
  {
    id: 'sign-to-text',
    label: 'Sign-to-Text',
    path: '/sign-to-text',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['sign to text', 'camera recognition', 'vision studio', 'sign studio'],
    description: 'Computer-vision sign language recognition to text captions',
    category: 'Translation',
    inPalette: true,
  },
  {
    id: 'real-time-conversation',
    label: 'Real-Time Conversation',
    path: '/conversation',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['real time conversation', 'conversation', 'dual conversation', 'chat', 'live conversation'],
    description: 'Two-way communication interface with sign and voice sync',
    category: 'Communication',
    inPalette: true,
  },
  {
    id: 'conversation-history',
    label: 'Conversation History',
    path: '/history',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['conversation history', 'history', 'past conversations', 'logs'],
    description: 'View recorded conversations and translation records',
    category: 'Communication',
    inPalette: true,
  },
  {
    id: 'user-profile',
    label: 'User Profile',
    path: '/profile',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['user profile', 'profile', 'my account', 'account'],
    description: 'View authenticated account details and credentials',
    category: 'Account',
    inPalette: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['settings', 'preferences', 'theme', 'avatar settings'],
    description: 'Configure theme, display, and avatar preferences',
    category: 'Account',
    inPalette: true,
  },

  // Administrator-Only Routes
  {
    id: 'admin-dashboard',
    label: 'Administrator Dashboard',
    path: '/admin',
    roles: [USER_ROLES.ADMIN],
    aliases: ['admin dashboard', 'admin', 'administrator', 'admin panel'],
    description: 'Central portal for moderation, telemetry, and system management',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-moderation',
    label: 'AI Moderation Alerts',
    path: '/admin/moderation',
    roles: [USER_ROLES.ADMIN],
    aliases: ['moderation', 'flagged items', 'admin moderation', 'content review', 'ai moderation', 'flagged content'],
    description: 'Review AI safety alerts and manage flagged content',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-restrictions',
    label: 'User Restrictions',
    path: '/admin/restrictions',
    roles: [USER_ROLES.ADMIN],
    aliases: ['user restrictions', 'restrictions', 'suspend user', 'warning strikes', 'manage restrictions'],
    description: 'Manage citizen restrictions, translation locks, strikes, and suspensions',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-audit',
    label: 'Audit Records',
    path: '/admin/audit',
    roles: [USER_ROLES.ADMIN],
    aliases: ['audit records', 'audit log', 'system audit', 'compliance records', 'security trail'],
    description: 'Review immutable security, administrative, and AI moderation audit logs',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-telemetry',
    label: 'Admin Telemetry',
    path: '/admin/telemetry',
    roles: [USER_ROLES.ADMIN],
    aliases: ['telemetry', 'metrics', 'analytics', 'admin telemetry', 'system health'],
    description: 'View real application and service telemetry and error rates',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-service-config',
    label: 'Service Configuration',
    path: '/admin/service-config',
    roles: [USER_ROLES.ADMIN],
    aliases: ['service config', 'service configuration', 'api configuration', 'desktop config'],
    description: 'Manage backend service address and network endpoints',
    category: 'Administration',
    inPalette: true,
  },

  // Public Routes
  {
    id: 'splash',
    label: 'Splash Screen',
    path: '/',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['splash', 'start', 'entry'],
    description: 'Initial application entry, startup check and brand presentation',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'landing',
    label: 'Landing Page',
    path: '/landing',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['landing', 'welcome'],
    description: 'Public introduction to Signora',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    path: '/onboarding',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['onboarding', 'tutorial', 'getting started'],
    description: 'Seven-screen introduction to Signora',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'signin',
    label: 'Sign In',
    path: '/signin',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['sign in', 'login', 'authenticate'],
    description: 'Authenticate into your account',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'register',
    label: 'Register',
    path: '/register',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['register', 'sign up', 'create account'],
    description: 'Create a new Signora account',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    path: '/privacy',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['privacy', 'privacy policy', 'data policy'],
    description: 'Data protection and handling principles',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'vocabulary-explorer',
    label: 'ISL Vocabulary Explorer (Unconfirmed)',
    path: '/vocabulary-explorer',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['vocabulary explorer', 'vocabulary', 'dictionary', 'isl signs'],
    description: 'Pending confirmation — ISL dictionary browsing',
    category: 'Exploration',
    inPalette: true,
  },
  {
    id: 'architecture-specs',
    label: 'Architecture & ER Specs (Unconfirmed)',
    path: '/architecture-specs',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['architecture', 'er specs', 'technical specs'],
    description: 'Pending confirmation — technical documentation',
    category: 'Documentation',
    inPalette: true,
  },
  {
    id: 'avatar-test',
    label: '3D Avatar Testing & Diagnostics',
    path: '/avatar-test',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['avatar test', '3d avatar', 'avatar diagnostics', 'robot avatar', 'rig test', 'finger kinematics'],
    description: 'Diagnostic rig suite: finger sliders, 11 facial morphs, ISL gestures, FPS & draw-calls',
    category: 'Developer',
    inPalette: true,
  },
  {
    id: 'admin-flagged-content',
    label: 'Flagged Content Review',
    path: '/admin/flagged-content',
    roles: [USER_ROLES.ADMIN],
    aliases: ['flagged content', 'content review', 'admin flags', 'moderation queue'],
    description: 'Review AI content flags and take administrative action',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'admin-users',
    label: 'User Account Management',
    path: '/admin/users',
    roles: [USER_ROLES.ADMIN],
    aliases: ['manage users', 'admin users', 'user accounts', 'user list'],
    description: 'Manage citizen accounts, enforce 24h blocks or 7d suspensions',
    category: 'Administration',
    inPalette: true,
  },
  {
    id: 'forgot-password',
    label: 'Forgot Password',
    path: '/forgot-password',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['forgot password', 'reset password link', 'recover account'],
    description: 'Request a password reset link',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'reset-password',
    label: 'Reset Password',
    path: '/reset-password',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['reset password', 'change password token', 'update password'],
    description: 'Set a new password using a reset token',
    category: 'Public',
    inPalette: false,
  },
  {
    id: 'verify-email',
    label: 'Email Verification',
    path: '/verify-email',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['verify email', 'email confirmation', 'confirm account'],
    description: 'Verify your registered email address',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'terms',
    label: 'Terms and Conditions',
    path: '/terms',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['terms', 'terms and conditions', 'terms of service', 'legal'],
    description: 'Terms of service and user responsibilities',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'help',
    label: 'Help & Support',
    path: '/help',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['help', 'support', 'faq', 'contact support', 'feedback'],
    description: 'Frequently asked questions, troubleshooting, and support',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'about',
    label: 'About Signora AI',
    path: '/about',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['about', 'about signora', 'system info', 'version'],
    description: 'System specifications, product overview, and team info',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'camera-permission',
    label: 'Camera Permission Guide',
    path: '/camera-permission',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['camera permission', 'webcam guide', 'camera help'],
    description: 'Instructions for granting camera permissions',
    category: 'Public',
    inPalette: true,
  },
  {
    id: 'microphone-permission',
    label: 'Microphone Permission Guide',
    path: '/microphone-permission',
    roles: [USER_ROLES.CITIZEN, USER_ROLES.ADMIN],
    aliases: ['microphone permission', 'mic guide', 'audio help'],
    description: 'Instructions for granting microphone permissions',
    category: 'Public',
    inPalette: true,
  },
];

/**
 * Filter routes accessible by a given user role
 */
export function getRoutesForRole(role) {
  if (!role) {
    return ROUTES.filter((r) => r.category === 'Public');
  }
  return ROUTES.filter((r) => r.roles.includes(role));
}

/**
 * Match a spoken or typed text against routes
 */
export function matchRouteCommand(query, role) {
  if (!query || typeof query !== 'string') return null;
  const normalized = query.toLowerCase().trim().replace(/^(please\s+|open\s+|navigate\s+to\s+|go\s+to\s+|take\s+me\s+to\s+)/, '').trim();

  const accessibleRoutes = getRoutesForRole(role);

  // Exact path or id match
  for (const route of accessibleRoutes) {
    if (route.id === normalized || route.path.toLowerCase() === `/${normalized}` || route.path.toLowerCase() === normalized) {
      return { success: true, route };
    }
  }

  // Exact alias match
  for (const route of accessibleRoutes) {
    if (route.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return { success: true, route };
    }
  }

  // Partial/Contains alias match
  for (const route of accessibleRoutes) {
    if (route.aliases.some((alias) => normalized.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalized))) {
      return { success: true, route };
    }
  }

  // Check if command matched an admin route that citizen is NOT authorized to access
  const allRoutes = ROUTES;
  for (const route of allRoutes) {
    const isTarget = route.aliases.some((alias) => normalized.includes(alias.toLowerCase())) || route.id === normalized;
    if (isTarget && !route.roles.includes(role)) {
      return {
        success: false,
        unauthorized: true,
        route,
        message: 'You do not have permission to access this destination.',
      };
    }
  }

  return { success: false, notFound: true, query: normalized };
}
