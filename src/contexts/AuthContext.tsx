'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AdminRole, User } from '@/types/shared';

// Hardcoded admin bypass credentials
const ADMIN_BYPASS_EMAIL = 'admin@level.app';
const ADMIN_BYPASS_PASSWORD = 'admin123';
const BYPASS_ADMIN_SESSION_KEY = 'level_admin_bypass_session';

// Safe sessionStorage wrapper for iOS private browsing mode
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem(key);
      }
    } catch {
      // sessionStorage not available (e.g., iOS private browsing)
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch {
      // sessionStorage not available
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch {
      // sessionStorage not available
    }
  },
};

// Create a mock admin user for bypass authentication
const createBypassAdminUser = (): User => ({
  id: 'bypass-admin-user-id',
  email: ADMIN_BYPASS_EMAIL,
  user_metadata: { is_bypass_admin: true },
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<AdminRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing bypass session on mount
  useEffect(() => {
    const bypassSession = safeSessionStorage.getItem(BYPASS_ADMIN_SESSION_KEY);
    if (bypassSession === 'true') {
      setUser(createBypassAdminUser());
      setIsAdmin(true);
      setRole('super_admin');
    }
    setIsLoading(false);
  }, []);

  // Sign in with email/password (bypass only)
  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail === ADMIN_BYPASS_EMAIL && normalizedPassword === ADMIN_BYPASS_PASSWORD) {
      const bypassUser = createBypassAdminUser();
      setUser(bypassUser);
      setIsAdmin(true);
      setRole('super_admin');
      safeSessionStorage.setItem(BYPASS_ADMIN_SESSION_KEY, 'true');
      return { error: null };
    }

    return { error: new Error('Identifiants invalides') };
  };

  // Sign out
  const signOut = async () => {
    safeSessionStorage.removeItem(BYPASS_ADMIN_SESSION_KEY);
    setUser(null);
    setIsAdmin(false);
    setRole(null);
  };

  const value: AuthContextType = {
    user,
    isAdmin,
    role,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
