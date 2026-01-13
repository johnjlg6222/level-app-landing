'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin');
      } else if (requireAdmin && !isAdmin) {
        router.push('/admin?error=unauthorized');
      }
    }
  }, [user, isAdmin, isLoading, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
