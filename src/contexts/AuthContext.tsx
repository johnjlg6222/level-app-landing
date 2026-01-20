'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabase, checkIsAdmin } from '@/lib/supabase';
import { AuthContextType } from '@/types/shared';

// Hardcoded admin bypass credentials
const ADMIN_BYPASS_EMAIL = 'admin@level.app';
const ADMIN_BYPASS_PASSWORD = 'admin123';
const BYPASS_ADMIN_SESSION_KEY = 'level_admin_bypass_session';

// Create a mock admin user for bypass authentication
const createBypassAdminUser = (): User => ({
  id: 'bypass-admin-user-id',
  email: ADMIN_BYPASS_EMAIL,
  app_metadata: {},
  user_metadata: { is_bypass_admin: true },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}) as User;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin status
  const checkAdminStatus = useCallback(async (userId: string) => {
    const adminStatus = await checkIsAdmin(userId);
    setIsAdmin(adminStatus);
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const supabase = getSupabase();

    // If Supabase is not configured, just set loading to false
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for bypass admin session first
        if (typeof window !== 'undefined') {
          const bypassSession = sessionStorage.getItem(BYPASS_ADMIN_SESSION_KEY);
          if (bypassSession === 'true') {
            setUser(createBypassAdminUser());
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await checkAdminStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Don't override bypass admin session
      if (typeof window !== 'undefined') {
        const bypassSession = sessionStorage.getItem(BYPASS_ADMIN_SESSION_KEY);
        if (bypassSession === 'true') {
          return;
        }
      }

      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    // Check for admin bypass credentials first
    if (email === ADMIN_BYPASS_EMAIL && password === ADMIN_BYPASS_PASSWORD) {
      const bypassUser = createBypassAdminUser();
      setUser(bypassUser);
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(BYPASS_ADMIN_SESSION_KEY, 'true');
      }
      return { error: null };
    }

    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        await checkAdminStatus(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    // Clear bypass session
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(BYPASS_ADMIN_SESSION_KEY);
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsAdmin(false);
  };

  const value: AuthContextType = {
    user,
    isAdmin,
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
