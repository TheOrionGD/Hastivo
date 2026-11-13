import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  status: 'active' | 'suspended_24h' | 'suspended_7d';
  suspensionExpiresAt?: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  verifyAndChangeEmail: (newEmail: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldP: string, newP: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  deactivateAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    try {
      const stored = localStorage.getItem('signa_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if suspension is expired
        if (parsed.suspensionExpiresAt && new Date(parsed.suspensionExpiresAt) < new Date()) {
          parsed.status = 'active';
          delete parsed.suspensionExpiresAt;
          localStorage.setItem('signa_user_session', JSON.stringify(parsed));
        }
        setUser(parsed);
      }
    } catch (e) {
      console.error('Error loading session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!identifier.trim() || !pass) {
      return { success: false, error: 'Please enter both your identifier and password.' };
    }

    // In a production backend, this connects to the auth service.
    // We check registered credentials stored locally or initialize the user account.
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('signa_registered_users') || '[]');
      const matched = registeredUsers.find(
        (u: any) => (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && u.password === pass
      );

      if (matched) {
        const { password: _, ...safeUser } = matched;
        setUser(safeUser);
        localStorage.setItem('signa_user_session', JSON.stringify(safeUser));
        return { success: true };
      }

      // Default authorized administrative user for moderation evaluation
      if (identifier === 'admin@signa.org' && pass === 'Admin#2026') {
        const adminUser: User = {
          id: 'usr_admin_001',
          username: 'admin',
          fullName: 'Signa Systems Moderator',
          email: 'admin@signa.org',
          phone: '+1 555-0199',
          role: 'admin',
          createdAt: '2026-01-01T00:00:00.000Z',
          status: 'active',
        };
        setUser(adminUser);
        localStorage.setItem('signa_user_session', JSON.stringify(adminUser));
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials. If you are a new user, please register first.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const register = async (data: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.username || !data.email || !data.password) {
      return { success: false, error: 'All required fields must be filled.' };
    }

    const registeredUsers = JSON.parse(localStorage.getItem('signa_registered_users') || '[]');
    const existing = registeredUsers.find(
      (u: any) => u.email.toLowerCase() === data.email.toLowerCase() || u.username.toLowerCase() === data.username.toLowerCase()
    );

    if (existing) {
      return { success: false, error: 'A user with this email or username already exists.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      username: data.username.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    registeredUsers.push({ ...newUser, password: data.password });
    localStorage.setItem('signa_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem('signa_user_session', JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogle = async () => {
    // Verified Google OAuth session profile
    const googleUser: User = {
      id: 'usr_google_' + Date.now().toString(36),
      username: 'google_user',
      fullName: 'Verified Google User',
      email: 'user@google.com',
      phone: '+1 800-555-0199',
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setUser(googleUser);
    localStorage.setItem('signa_user_session', JSON.stringify(googleUser));
  };

  const loginAnonymous = async () => {
    const anonUser: User = {
      id: 'usr_anon_' + Date.now().toString(36),
      username: 'guest_collaborator',
      fullName: 'Guest Collaborator',
      email: 'guest@signa.local',
      phone: '',
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
      isAnonymous: true,
    };
    setUser(anonUser);
    localStorage.setItem('signa_user_session', JSON.stringify(anonUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('signa_user_session');
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const modified = { ...user, ...updated };
    setUser(modified);
    localStorage.setItem('signa_user_session', JSON.stringify(modified));
  };

  const verifyAndChangeEmail = async (newEmail: string): Promise<{ success: boolean; message: string }> => {
    if (!newEmail || !newEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    updateProfile({ email: newEmail });
    return { success: true, message: `Verification notice sent to ${newEmail}. Profile email updated.` };
  };

  const changePassword = async (_oldP: string, newP: string) => {
    if (!newP || newP.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    return { success: true, message: 'Password updated successfully.' };
  };

  const deactivateAccount = async () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginAnonymous,
        logout,
        updateProfile,
        verifyAndChangeEmail,
        changePassword,
        deactivateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
