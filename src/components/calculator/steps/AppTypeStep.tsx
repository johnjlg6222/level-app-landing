'use client';

import React from 'react';
import { Smartphone, Globe, Layout } from 'lucide-react';
import { SelectCards, type SelectOption } from '@/components/common';
import { AppType, APP_TYPE_OPTIONS } from '@/types/calculator';

interface AppTypeStepProps {
  value: AppType;
  onChange: (value: AppType) => void;
}

const iconMap: Record<AppType, React.ReactNode> = {
  mobile: <Smartphone size={24} />,
  web: <Globe size={24} />,
  both: <Layout size={24} />,
};

export const AppTypeStep: React.FC<AppTypeStepProps> = ({ value, onChange }) => {
  const options: SelectOption<AppType>[] = APP_TYPE_OPTIONS.map((opt) => ({
    value: opt.id,
    label: opt.label,
    description: opt.description,
    icon: iconMap[opt.id],
  }));

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400">
        <Layout size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Sur quelle plateforme ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Choisissez le type d&apos;application que vous souhaitez développer
      </p>

      <div className="max-w-2xl mx-auto">
        <SelectCards value={value} onChange={onChange} options={options} columns={3} />
      </div>
    </div>
  );
};

export default AppTypeStep;
