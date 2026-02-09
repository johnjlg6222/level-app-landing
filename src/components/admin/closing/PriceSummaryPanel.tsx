'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CalculatedPrice {
  subtotal: number;
  discount: number;
  urgencyMultiplier: number;
  total: number;
  monthlyMaintenance: number;
  breakdown: { label: string; amount: number }[];
}

interface PriceSummaryPanelProps {
  calculatedPrice: CalculatedPrice;
}

export const PriceSummaryPanel: React.FC<PriceSummaryPanelProps> = ({
  calculatedPrice,
}) => {
  const {
    subtotal,
    discount,
    urgencyMultiplier,
    total,
    monthlyMaintenance,
    breakdown,
  } = calculatedPrice;

  return (
    <div className="rounded-2xl bg-[#0F1115]/80 border border-white/5 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Resume tarifaire
      </h3>

      {/* Breakdown lines */}
      <div className="space-y-2">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{item.label}</span>
            <span className={cn(
              'font-medium',
              item.amount > 0 ? 'text-gray-300' : 'text-gray-600'
            )}>
              {item.amount > 0 ? formatCurrency(item.amount) : '--'}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Sous-total</span>
        <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-green-400">
            <TrendingDown size={14} />
            Remise
          </span>
          <span className="font-medium text-green-400">
            - {formatCurrency(discount)}
          </span>
        </div>
      )}

      {/* Urgency multiplier */}
      {urgencyMultiplier > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-yellow-400">
            <TrendingUp size={14} />
            Urgence (x{urgencyMultiplier})
          </span>
          <span className="font-medium text-yellow-400">
            + {formatCurrency((subtotal - discount) * (urgencyMultiplier - 1))}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Grand total */}
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-white">Total</span>
        <span className="text-2xl font-bold text-white">{formatCurrency(total)}</span>
      </div>

      {/* Monthly maintenance */}
      {monthlyMaintenance > 0 && (
        <>
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-blue-400">
              <Minus size={14} />
              Maintenance / mois
            </span>
            <span className="font-semibold text-blue-400">
              {formatCurrency(monthlyMaintenance)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
