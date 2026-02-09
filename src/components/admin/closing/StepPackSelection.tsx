'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { PackCard } from './PackCard';
import type { PricingPackWithFeatures } from '@/types/admin-pricing';

interface StepPackSelectionProps {
  packs: PricingPackWithFeatures[];
  selectedMainPack: string | null;
  selectedCategoryPacks: string[];
  onSelectMainPack: (packId: string | null) => void;
  onToggleCategoryPack: (packId: string) => void;
}

export const StepPackSelection: React.FC<StepPackSelectionProps> = ({
  packs,
  selectedMainPack,
  selectedCategoryPacks,
  onSelectMainPack,
  onToggleCategoryPack,
}) => {
  const mainPacks = packs.filter((p) => p.pack_type === 'main' && p.is_active);
  const categoryPacks = packs.filter((p) => p.pack_type === 'category' && p.is_active);

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Selection des packs</h2>
        <p className="text-gray-400 mt-1">
          Choisissez un plan principal et ajoutez des packs categorie optionnels.
        </p>
      </div>

      {/* Main packs - only one selectable */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Plans principaux</h3>
        <p className="text-sm text-gray-500">
          Selectionnez un seul plan de base. Chaque plan inclut un ensemble de fonctionnalites.
        </p>
        {mainPacks.length === 0 && (
          <div className="text-center py-8 rounded-xl bg-white/5 border border-white/5">
            <Package size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">Aucun pack disponible</p>
            <p className="text-xs text-gray-600 mt-1">Verifiez la connexion a la base de donnees</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainPacks
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                selected={selectedMainPack === pack.id}
                onToggle={() => {
                  if (selectedMainPack === pack.id) {
                    onSelectMainPack(null);
                  } else {
                    onSelectMainPack(pack.id);
                  }
                }}
                variant="main"
              />
            ))}
        </div>
      </div>

      {/* Category packs - multiple selectable */}
      {categoryPacks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Packs categorie</h3>
          <p className="text-sm text-gray-500">
            Ajoutez des packs thematiques pour completer votre projet. Plusieurs packs cumulables.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryPacks
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  selected={selectedCategoryPacks.includes(pack.id)}
                  onToggle={() => onToggleCategoryPack(pack.id)}
                  variant="category"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
