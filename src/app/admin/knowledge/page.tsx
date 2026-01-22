'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LogOut, Database, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { AmbientBackground } from '@/components/landing';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { KnowledgeEditor } from '@/components/admin/knowledge';
import { ChatWidget } from '@/components/chat';

function KnowledgePageContent() {
  const { signOut, user } = useAuth();

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white">
      <AmbientBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link
              href="/admin/closing"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Devis</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Database size={18} className="text-blue-400" />
              <h1 className="text-lg font-semibold text-white">Base de Connaissances</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} icon={<LogOut className="w-4 h-4" />}>
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <KnowledgeEditor />
        </div>
      </main>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default function AdminKnowledgePage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <KnowledgePageContent />
    </ProtectedRoute>
  );
}
