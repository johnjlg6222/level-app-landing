'use client';

import React from 'react';
import { Input } from '@/components/common/Input';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { Clock, Zap, Wrench, CalendarDays } from 'lucide-react';
import { URGENCY_OPTIONS, MAINTENANCE_OPTIONS } from '@/types/pricing';
import type { ClosingWizardState } from '@/types/closing-wizard';

interface StepLogisticsProps {
  logistics: ClosingWizardState['logistics'];
  onChange: (l: Partial<ClosingWizardState['logistics']>) => void;
}

export const StepLogistics: React.FC<StepLogisticsProps> = ({
  logistics,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock size={24} className="text-blue-400" />
          Logistique et delais
        </h2>
        <p className="text-gray-400 mt-1">
          Definissez la date de livraison souhaitee, l&apos;urgence et le plan de maintenance.
        </p>
      </div>

      {/* Deadline */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Date limite de livraison
        </label>
        <Input
          type="date"
          value={logistics.deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          icon={<CalendarDays size={18} />}
        />
      </div>

      {/* Urgency chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          <label className="block text-sm font-medium text-gray-400">
            Niveau d&apos;urgence
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {URGENCY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange({ urgency: option.id })}
              className={cn(
                'relative p-4 rounded-xl border text-left transition-all duration-200',
                logistics.urgency === option.id
                  ? 'bg-blue-600/10 border-blue-500/50'
                  : 'bg-[#0F1115]/60 border-white/5 hover:border-white/15'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'text-sm font-semibold',
                  logistics.urgency === option.id ? 'text-blue-400' : 'text-white'
                )}>
                  {option.label}
                </span>
                <span className={cn(
                  'text-xs font-mono px-2 py-0.5 rounded',
                  option.multiplier > 1
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-white/5 text-gray-500'
                )}>
                  x{option.multiplier}
                </span>
              </div>
              <p className="text-xs text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Wrench size={18} className="text-gray-400" />
          <label className="block text-sm font-medium text-gray-400">
            Plan de maintenance
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MAINTENANCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange({ maintenance: option.id })}
              className={cn(
                'relative p-4 rounded-xl border text-left transition-all duration-200',
                logistics.maintenance === option.id
                  ? 'bg-blue-600/10 border-blue-500/50'
                  : 'bg-[#0F1115]/60 border-white/5 hover:border-white/15'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'text-sm font-semibold',
                  logistics.maintenance === option.id ? 'text-blue-400' : 'text-white'
                )}>
                  {option.label}
                </span>
                <span className="text-sm font-bold text-blue-400">
                  {option.monthlyPrice > 0
                    ? `${formatCurrency(option.monthlyPrice)}/mois`
                    : 'Gratuit'
                  }
                </span>
              </div>
              <p className="text-xs text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
