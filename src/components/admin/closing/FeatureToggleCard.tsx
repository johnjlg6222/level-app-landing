'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/common/Badge';
import { Package } from 'lucide-react';
import type { PricingFeature } from '@/types/admin-pricing';

interface FeatureToggleCardProps {
  feature: PricingFeature;
  selected: boolean;
  fromPack: string | null;
  onToggle: () => void;
}

export const FeatureToggleCard: React.FC<FeatureToggleCardProps> = ({
  feature,
  selected,
  fromPack,
  onToggle,
}) => {
  const isFromPack = fromPack !== null;

  // Compute average of non-zero prices
  const prices = [
    { label: 'J', value: feature.price_john },
    { label: 'H', value: feature.price_harouna },
    { label: 'A', value: feature.price_andre },
    { label: 'C', value: feature.price_christophe },
  ];

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200',
        selected || isFromPack
          ? 'bg-blue-600/5 border-blue-500/30'
          : 'bg-[#0F1115]/60 border-white/5 hover:border-white/15'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn(
              'text-sm font-semibold',
              selected || isFromPack ? 'text-white' : 'text-gray-300'
            )}>
              {feature.name}
            </h4>
            {isFromPack && (
              <Badge variant="primary" size="sm" icon={<Package size={10} />}>
                Inclus {fromPack}
              </Badge>
            )}
          </div>

          {feature.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {feature.description}
            </p>
          )}

          {/* Price pills */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {prices.map((p) => (
              <span
                key={p.label}
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono',
                  p.value > 0
                    ? 'bg-white/5 text-gray-400'
                    : 'bg-white/[0.02] text-gray-600'
                )}
              >
                {p.label}:{p.value}
              </span>
            ))}
            <span className="text-xs text-gray-600 mx-1">|</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(feature.final_price)}
            </span>
          </div>
        </div>

        {/* Right: Toggle switch */}
        <button
          type="button"
          onClick={onToggle}
          disabled={isFromPack}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050507]',
            selected || isFromPack
              ? 'bg-blue-600'
              : 'bg-white/10',
            isFromPack && 'opacity-70 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200',
              selected || isFromPack
                ? 'translate-x-5'
                : 'translate-x-0'
            )}
          />
        </button>
      </div>
    </div>
  );
};
