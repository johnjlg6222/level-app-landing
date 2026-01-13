import { User } from '@supabase/supabase-js';

// Auth types
export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// Admin user
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

// Generic response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Form state
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Animation direction
export type AnimationDirection = 'forward' | 'backward';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Icon component props
export interface IconProps {
  size?: number;
  className?: string;
}

// Option type for selects/radios
export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

// Toast notification
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
