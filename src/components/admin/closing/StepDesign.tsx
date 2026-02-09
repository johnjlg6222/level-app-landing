'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Palette, Moon, Sparkles } from 'lucide-react';
import type { ClosingWizardState } from '@/types/closing-wizard';

interface StepDesignProps {
  design: ClosingWizardState['design'];
  onChange: (d: Partial<ClosingWizardState['design']>) => void;
}

const STYLE_OPTIONS = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'moderne', label: 'Moderne' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'creatif', label: 'Creatif' },
  { id: 'luxe', label: 'Luxe' },
  { id: 'playful', label: 'Playful' },
];

export const StepDesign: React.FC<StepDesignProps> = ({
  design,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Palette size={24} className="text-blue-400" />
          Preferences design
        </h2>
        <p className="text-gray-400 mt-1">
          Definissez le style visuel et les preferences graphiques du projet.
        </p>
      </div>

      {/* Has branding checkbox */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            type="button"
            onClick={() => onChange({ hasBranding: !design.hasBranding })}
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              design.hasBranding
                ? 'bg-blue-600 border-blue-600'
                : 'border-white/20 bg-transparent group-hover:border-white/40'
            )}
          >
            {design.hasBranding && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div>
            <span className="text-sm font-medium text-white">Le client a deja un branding</span>
            <p className="text-xs text-gray-500">Charte graphique, logo, couleurs existantes</p>
          </div>
        </label>
      </div>

      {/* Style chips */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Style visuel
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ style: style.id })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                design.style === style.id
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Couleur principale
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.primaryColor || '#3B82F6'}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={design.primaryColor || '#3B82F6'}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="#3B82F6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Couleur secondaire
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.secondaryColor || '#1E40AF'}
              onChange={(e) => onChange({ secondaryColor: e.target.value })}
              className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={design.secondaryColor || '#1E40AF'}
              onChange={(e) => onChange({ secondaryColor: e.target.value })}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="#1E40AF"
            />
          </div>
        </div>
      </div>

      {/* Toggle options */}
      <div className="space-y-4">
        {/* Dark mode toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F1115]/60 border border-white/5">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Mode sombre</p>
              <p className="text-xs text-gray-500">Interface en theme sombre</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ darkMode: !design.darkMode })}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050507]',
              design.darkMode ? 'bg-blue-600' : 'bg-white/10'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200',
                design.darkMode ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Animations toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F1115]/60 border border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Animations</p>
              <p className="text-xs text-gray-500">Transitions et micro-interactions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ animations: !design.animations })}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050507]',
              design.animations ? 'bg-blue-600' : 'bg-white/10'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200',
                design.animations ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
