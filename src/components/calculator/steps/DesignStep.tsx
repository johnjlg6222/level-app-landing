'use client';

import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { SelectCards, type SelectOption } from '@/components/common';
import { DesignPreferences, DesignStyle, DESIGN_STYLE_OPTIONS } from '@/types/calculator';

interface DesignStepProps {
  value: DesignPreferences;
  onChange: (value: DesignPreferences) => void;
}

export const DesignStep: React.FC<DesignStepProps> = ({ value, onChange }) => {
  const styleOptions: SelectOption<DesignStyle>[] = DESIGN_STYLE_OPTIONS.map((opt) => ({
    value: opt.id,
    label: opt.label,
    description: opt.description,
  }));

  const handleStyleChange = (style: DesignStyle) => {
    onChange({ ...value, style });
  };

  const handleBrandingChange = (hasBranding: boolean) => {
    onChange({ ...value, hasBranding });
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
        <Palette size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Quel style de design souhaitez-vous ?
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Choisissez le niveau de design pour votre application
      </p>

      {/* Branding toggle */}
      <div className="max-w-md mx-auto mb-8">
        <button
          type="button"
          onClick={() => handleBrandingChange(!value.hasBranding)}
          className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
            value.hasBranding
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles size={20} className={value.hasBranding ? 'text-blue-400' : 'text-gray-400'} />
            <div className="text-left">
              <span className={`font-semibold ${value.hasBranding ? 'text-white' : 'text-gray-300'}`}>
                J&apos;ai déjà mon branding
              </span>
              <p className="text-sm text-gray-500">Logo, couleurs, charte graphique</p>
            </div>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors ${
              value.hasBranding ? 'bg-blue-600' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                value.hasBranding ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`}
            />
          </div>
        </button>
      </div>

      {/* Style selection */}
      <div className="max-w-2xl mx-auto">
        <SelectCards
          value={value.style}
          onChange={handleStyleChange}
          options={styleOptions}
          columns={2}
        />
      </div>
    </div>
  );
};

export default DesignStep;
