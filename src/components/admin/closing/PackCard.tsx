'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/common/Badge';
import { Check, ChevronDown, ChevronUp, Package, Star } from 'lucide-react';
import type { PricingPackWithFeatures } from '@/types/admin-pricing';

interface PackCardProps {
  pack: PricingPackWithFeatures;
  selected: boolean;
  onToggle: () => void;
  variant?: 'main' | 'category';
}

export const PackCard: React.FC<PackCardProps> = ({
  pack,
  selected,
  onToggle,
  variant = 'category',
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full text-left rounded-2xl border p-5 transition-all duration-200',
        selected
          ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-600/5'
          : 'bg-[#0F1115]/60 border-white/5 hover:border-white/15',
        variant === 'main' && 'relative'
      )}
    >
      {/* Recommended badge */}
      {pack.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary" size="sm" icon={<Star size={12} />}>
            Recommande
          </Badge>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Pack name */}
          <div className="flex items-center gap-2">
            <Package size={18} className={selected ? 'text-blue-400' : 'text-gray-500'} />
            <h3 className={cn(
              'font-semibold text-base',
              selected ? 'text-white' : 'text-gray-300'
            )}>
              {pack.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {pack.description}
          </p>

          {/* Meta badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="default" size="sm">
              {pack.features.length} fonctionnalite{pack.features.length > 1 ? 's' : ''}
            </Badge>
            {pack.discount_percentage > 0 && (
              <Badge variant="success" size="sm">
                -{pack.discount_percentage}%
              </Badge>
            )}
            {pack.includes_pack_id && (
              <Badge variant="warning" size="sm">
                Cumulatif
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Price + check */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <p className={cn(
            'text-xl font-bold',
            selected ? 'text-blue-400' : 'text-white'
          )}>
            {formatCurrency(pack.price)}
          </p>

          <div
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              selected
                ? 'bg-blue-600 border-blue-600'
                : 'border-white/20 bg-transparent'
            )}
          >
            {selected && <Check size={14} className="text-white" />}
          </div>
        </div>
      </div>

      {/* Expandable feature list */}
      <div className="mt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Masquer' : 'Voir'} les fonctionnalites
        </button>

        {expanded && (
          <ul className="mt-2 space-y-1 pl-1">
            {pack.features.map((feature) => (
              <li
                key={feature.id}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <Check size={12} className="text-green-500 flex-shrink-0" />
                <span className="truncate">{feature.name}</span>
                <span className="text-gray-600 text-xs ml-auto flex-shrink-0">
                  {formatCurrency(feature.final_price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </button>
  );
};
