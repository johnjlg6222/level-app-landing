'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, LogOut, Database, MessageCircle, DollarSign, LayoutGrid, Package, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { AmbientBackground } from '@/components/landing';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ChatWidget } from '@/components/chat';
import { usePricingAdmin } from '@/hooks/usePricingAdmin';
import { PricingFeaturesTable, PricingPackManager, PricingConfigEditor } from '@/components/admin/pricing';
import type { PricingAdminTab } from '@/types/admin-pricing';

const TABS: { id: PricingAdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'features', label: 'Fonctionnalites', icon: LayoutGrid },
  { id: 'packs', label: 'Packs', icon: Package },
  { id: 'config', label: 'Configuration', icon: Settings },
];

function PricingPageContent() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<PricingAdminTab>('features');
  const {
    features,
    groupedFeatures,
    packs,
    config,
    isLoading,
    error,
    createFeature,
    updateFeature,
    deleteFeature,
    createPack,
    updatePack,
    deletePack,
    updateConfig,
  } = usePricingAdmin();

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
            <Link
              href="/admin/knowledge"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Database size={18} />
              <span className="hidden sm:inline">Knowledge</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-blue-400" />
              <h1 className="text-lg font-semibold text-white">Tarification</h1>
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
        <div className="max-w-6xl mx-auto">
          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {isLoading && features.length === 0 && packs.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'features' && (
            <PricingFeaturesTable
              features={features}
              groupedFeatures={groupedFeatures}
              onCreate={createFeature}
              onUpdate={updateFeature}
              onDelete={deleteFeature}
            />
          )}

          {activeTab === 'packs' && (
            <PricingPackManager
              packs={packs}
              allFeatures={features}
              groupedFeatures={groupedFeatures}
              onCreate={createPack}
              onUpdate={updatePack}
              onDelete={deletePack}
            />
          )}

          {activeTab === 'config' && (
            <PricingConfigEditor
              config={config}
              onUpdate={updateConfig}
            />
          )}
        </div>
      </main>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default function AdminPricingPage() {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      <PricingPageContent />
    </ProtectedRoute>
  );
}
