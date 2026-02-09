'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = true, requireSuperAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, role, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin');
      } else if (requireAdmin && !isAdmin) {
        router.push('/admin?error=unauthorized');
      } else if (requireSuperAdmin && role !== 'super_admin') {
        router.push('/admin/closing?error=super_admin_required');
      }
    }
  }, [user, isAdmin, role, isLoading, requireAdmin, requireSuperAdmin, router]);

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

  if (requireSuperAdmin && role !== 'super_admin') {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
