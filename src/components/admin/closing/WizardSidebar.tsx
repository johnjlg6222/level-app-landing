'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import type { ClosingWizardStep } from '@/types/closing-wizard';
import {
  Building2, FileText, Package, Lock, CreditCard, Database,
  LayoutDashboard, Bell, Calendar, Plug, Image, Bot, Search,
  BarChart3, FileDown, Globe, Layers, ShieldCheck, Palette,
  Clock, StickyNote, CheckCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Building2, FileText, Package, Lock, CreditCard, Database,
  LayoutDashboard, Bell, Calendar, Plug, Image, Bot, Search,
  BarChart3, FileDown, Globe, Layers, ShieldCheck, Palette,
  Clock, StickyNote, CheckCircle,
};

interface WizardSidebarProps {
  currentStep: number;
  steps: ClosingWizardStep[];
  totalPrice: number;
  monthlyMaintenance: number;
  onStepClick: (index: number) => void;
  completedSteps: Set<number>;
}

export const WizardSidebar: React.FC<WizardSidebarProps> = ({
  currentStep,
  steps,
  totalPrice,
  monthlyMaintenance,
  onStepClick,
  completedSteps,
}) => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Use rAF to run after browser scroll restoration on reload
    requestAnimationFrame(() => {
      const el = navRef.current?.querySelector('[data-active="true"]');
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [currentStep]);

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-[280px] flex-shrink-0 bg-[#0A0A0F]/50 border border-white/5 rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-5 border-b border-white/5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Closing Wizard
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Etape {currentStep + 1} / {steps.length}
        </p>
      </div>

      {/* Steps list - scrollable */}
      <nav ref={navRef} className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10">
        <ul className="space-y-0.5 px-2">
          {steps.map((step, index) => {
            const IconComponent = ICON_MAP[step.icon];
            const isCurrent = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isPast = index < currentStep;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  data-active={isCurrent ? 'true' : undefined}
                  onClick={() => onStepClick(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group',
                    isCurrent
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : isPast || isCompleted
                        ? 'text-gray-300 hover:bg-white/5'
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-400'
                  )}
                >
                  {/* Step number / check icon */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-white/5 text-gray-500'
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle size={14} />
                    ) : IconComponent ? (
                      <IconComponent size={14} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-sm font-medium truncate">
                    {step.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Price footer */}
      <div className="border-t border-white/5 px-4 py-5 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total projet</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalPrice)}
          </p>
        </div>
        {monthlyMaintenance > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Maintenance / mois</p>
            <p className="text-lg font-semibold text-blue-400">
              {formatCurrency(monthlyMaintenance)}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
