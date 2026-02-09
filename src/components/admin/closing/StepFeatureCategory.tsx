'use client';

import React from 'react';
import { FeatureToggleCard } from './FeatureToggleCard';
import { Badge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils/formatters';
import type { PricingFeature } from '@/types/admin-pricing';

interface StepFeatureCategoryProps {
  category: string;
  features: PricingFeature[];
  selectedFeatureIds: string[];
  packFeatureIds: string[];
  packNames: Map<string, string>;
  onToggleFeature: (featureId: string) => void;
}

export const StepFeatureCategory: React.FC<StepFeatureCategoryProps> = ({
  category,
  features,
  selectedFeatureIds,
  packFeatureIds,
  packNames,
  onToggleFeature,
}) => {
  // Features are already filtered by category from parent hook's featuresForCategory()
  const categoryFeatures = features
    .filter((f) => f.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const selectedCount = categoryFeatures.filter(
    (f) => selectedFeatureIds.includes(f.id) || packFeatureIds.includes(f.id)
  ).length;

  const categoryTotal = categoryFeatures
    .filter((f) => selectedFeatureIds.includes(f.id) && !packFeatureIds.includes(f.id))
    .reduce((sum, f) => sum + f.final_price, 0);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{category}</h2>
          <p className="text-gray-400 mt-1">
            Selectionnez les fonctionnalites dont le client a besoin.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge variant="default" size="sm">
            {selectedCount} / {categoryFeatures.length}
          </Badge>
          {categoryTotal > 0 && (
            <Badge variant="primary" size="sm">
              + {formatCurrency(categoryTotal)}
            </Badge>
          )}
        </div>
      </div>

      {/* Feature grid */}
      {categoryFeatures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune fonctionnalite dans cette categorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {categoryFeatures.map((feature) => {
            const isFromPack = packFeatureIds.includes(feature.id);
            const isSelected = selectedFeatureIds.includes(feature.id) || isFromPack;
            const packName = isFromPack ? packNames.get(feature.id) || null : null;

            return (
              <FeatureToggleCard
                key={feature.id}
                feature={feature}
                selected={isSelected}
                fromPack={packName}
                onToggle={() => onToggleFeature(feature.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
