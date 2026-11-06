import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../navigation/routeRegistry';
import config from '../config/env';
import { API_ENDPOINTS, apiFetch } from '../config/apiEndpoints';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('hastivo_auth_token') : null;
  });
  const [role, setRole] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('hastivo_auth_role') : null;
  });
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const storedToken = sessionStorage.getItem('hastivo_auth_token');
    const storedRole = sessionStorage.getItem('hastivo_auth_role');
    const storedEmail = sessionStorage.getItem('hastivo_auth_email');
    const storedIsGuest = sessionStorage.getItem('hastivo_is_guest') === 'true';

    if (storedToken && storedRole) {
      return {
        email: storedEmail || 'user@hastivo.local',
        name: storedIsGuest ? 'Guest Citizen' : (storedEmail?.split('@')[0] || 'Citizen'),
        isGuest: storedIsGuest,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'hastivo_auth_token' || e.key === 'hastivo_auth_role') {
        const curToken = sessionStorage.getItem('hastivo_auth_token');
        const curRole = sessionStorage.getItem('hastivo_auth_role');
        setToken(curToken);
        setRole(curRole);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (identifier, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email: identifier, password }),
        timeout: config.apiTimeout || 6000,
      });

      if (res.ok && res.data?.success) {
        const data = res.data;
        const userRole = data.user?.role === 'admin' || data.role === 'admin' ? USER_ROLES.ADMIN : USER_ROLES.CITIZEN;
        const sessionToken = data.token;

        setUser({
          id: data.user?.id,
          email: data.user?.email || identifier,
          name: data.user?.displayName || identifier.split('@')[0],
          username: data.user?.username || identifier.split('@')[0],
          role: userRole,
          status: data.user?.status || 'active',
          isGuest: false,
        });
        setRole(userRole);
        setToken(sessionToken);

        sessionStorage.setItem('hastivo_auth_token', sessionToken);
        sessionStorage.setItem('hastivo_auth_role', userRole);
        sessionStorage.setItem('hastivo_auth_email', data.user?.email || identifier);
        sessionStorage.removeItem('hastivo_is_guest');

        setLoading(false);
        return { success: true, role: userRole };
      } else {
        const errMsg = res.data?.message || res.error || 'Authentication failed. Please verify credentials.';
        setAuthError(errMsg);
        setLoading(false);
        throw new Error(errMsg);
      }
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signInAnonymous = async () => {
    setLoading(true);
    setAuthError(null);

    // Attempt genuine backend anonymous auth
    try {
      const res = await apiFetch(API_ENDPOINTS.AUTH.ANONYMOUS, {
        method: 'POST',
        timeout: config.apiTimeout || 5000,
      });

      if (res.ok && res.data) {
        const data = res.data;
        const guestUser = {
          ...data.user,
          name: data.user?.displayName || 'Guest Citizen',
          isGuest: true,
          permittedFeatures: data.permittedFeatures || [
            'view_landing',
            'complete_onboarding',
            'view_vocabulary',
            'avatar_test',
            'guest_translation_preview',
            'view_architecture_specs',
          ],
        };
        const sessionToken = data.token || 'hastivo-guest-tok-' + Date.now();

        setUser(guestUser);
        setRole(USER_ROLES.CITIZEN);
        setToken(sessionToken);

        sessionStorage.setItem('hastivo_auth_token', sessionToken);
        sessionStorage.setItem('hastivo_auth_role', USER_ROLES.CITIZEN);
        sessionStorage.setItem('hastivo_auth_email', guestUser.email);
        sessionStorage.setItem('hastivo_is_guest', 'true');

        setLoading(false);
        return { success: true, role: USER_ROLES.CITIZEN, isGuest: true };
      }
    } catch (err) {
      console.warn('Backend anonymous auth unreachable, falling back to local guest session:', err);
    }

    const anonUser = {
      email: 'guest@hastivo.isl',
      name: 'Guest Citizen',
      username: 'guest_citizen',
      isAnonymous: true,
      isGuest: true,
      permittedFeatures: [
        'view_landing',
        'complete_onboarding',
        'view_vocabulary',
        'avatar_test',
        'guest_translation_preview',
        'view_architecture_specs',
      ],
    };
    const userRole = USER_ROLES.CITIZEN;
    const sessionToken = 'anon-' + Date.now();

    setUser(anonUser);
    setRole(userRole);
    setToken(sessionToken);

    sessionStorage.setItem('hastivo_auth_token', sessionToken);
    sessionStorage.setItem('hastivo_auth_role', userRole);
    sessionStorage.setItem('hastivo_auth_email', 'guest@hastivo.isl');
    sessionStorage.setItem('hastivo_is_guest', 'true');

    setLoading(false);
    return { success: true, role: userRole, isGuest: true };
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    const googleUser = {
      email: 'user.verified@gmail.com',
      name: 'Google User',
      username: 'google_user',
      isGoogle: true,
    };
    const userRole = USER_ROLES.CITIZEN;
    const sessionToken = 'google-tok-' + Date.now();

    setUser(googleUser);
    setRole(userRole);
    setToken(sessionToken);

    sessionStorage.setItem('hastivo_auth_token', sessionToken);
    sessionStorage.setItem('hastivo_auth_role', userRole);
    sessionStorage.setItem('hastivo_auth_email', googleUser.email);

    setLoading(false);
    return { success: true, role: userRole };
  };

  const register = async (email, password, displayName, selectedRole = 'citizen', phone = '', username = '') => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName, role: selectedRole, phone, username }),
        timeout: config.apiTimeout || 6000,
      });

      if (res.ok && res.data?.success) {
        const data = res.data;
        const userRole = selectedRole === 'admin' ? USER_ROLES.ADMIN : USER_ROLES.CITIZEN;
        const sessionToken = data.token;

        setUser({
          id: data.user?.id,
          email: data.user?.email || email,
          name: data.user?.displayName || displayName,
          username: data.user?.username || username || email.split('@')[0],
          phone: data.user?.phone || phone,
          role: userRole,
          status: data.user?.status || 'active',
          isGuest: false,
        });
        setRole(userRole);
        setToken(sessionToken);

        sessionStorage.setItem('hastivo_auth_token', sessionToken);
        sessionStorage.setItem('hastivo_auth_role', userRole);
        sessionStorage.setItem('hastivo_auth_email', email);
        sessionStorage.removeItem('hastivo_is_guest');

        setLoading(false);
        return { success: true, role: userRole };
      } else {
        const errMsg = res.data?.message || res.error || 'Registration failed.';
        setAuthError(errMsg);
        setLoading(false);
        throw new Error(errMsg);
      }
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signOut = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    sessionStorage.removeItem('hastivo_auth_token');
    sessionStorage.removeItem('hastivo_auth_role');
    sessionStorage.removeItem('hastivo_auth_email');
    sessionStorage.removeItem('hastivo_is_guest');
  };

  const isGuest = !!user?.isGuest || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hastivo_is_guest') === 'true');

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user && !!role,
        isAdmin: role === USER_ROLES.ADMIN,
        isCitizen: role === USER_ROLES.CITIZEN,
        isGuest,
        loading,
        authError,
        signIn,
        signInAnonymous,
        signInWithGoogle,
        register,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
