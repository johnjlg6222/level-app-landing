'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle,
  MapPin,
  MessageSquare,
  Bell,
  Layout,
  BarChart,
  Upload,
  Calendar,
  Search,
  Check,
} from 'lucide-react';
import { ADDITIONAL_FEATURES } from '@/types/calculator';

interface FeaturesStepProps {
  value: string[];
  onToggle: (featureId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  geolocation: <MapPin size={20} />,
  chat: <MessageSquare size={20} />,
  notifications: <Bell size={20} />,
  admin_dashboard: <Layout size={20} />,
  analytics: <BarChart size={20} />,
  file_upload: <Upload size={20} />,
  calendar: <Calendar size={20} />,
  search: <Search size={20} />,
};

export const FeaturesStep: React.FC<FeaturesStepProps> = ({ value, onToggle }) => {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-400">
        <Puzzle size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Quelles fonctionnalités souhaitez-vous ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Sélectionnez les fonctionnalités dont vous avez besoin (optionnel)
      </p>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ADDITIONAL_FEATURES.map((feature) => {
          const isSelected = value.includes(feature.id);

          return (
            <motion.button
              key={feature.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(feature.id)}
              className={`p-5 rounded-xl border text-left flex items-start gap-4 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className={`mt-0.5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                {iconMap[feature.id] || <Puzzle size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {feature.label}
                  </span>
                  {isSelected && <Check className="text-blue-500" size={16} />}
                </div>
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-8">
        {value.length === 0
          ? 'Aucune fonctionnalité sélectionnée'
          : `${value.length} fonctionnalité${value.length > 1 ? 's' : ''} sélectionnée${value.length > 1 ? 's' : ''}`}
      </p>
    </div>
  );
};

export default FeaturesStep;
