'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { Slider } from '@/components/common';

interface ScreensStepProps {
  value: number;
  onChange: (value: number) => void;
}

export const ScreensStep: React.FC<ScreensStepProps> = ({ value, onChange }) => {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
        <Smartphone size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Combien d&apos;écrans dans votre application ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Un écran = une page unique (accueil, profil, liste, détail, etc.)
      </p>

      <div className="max-w-md mx-auto">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-bold text-white mb-8"
        >
          {value}
          <span className="text-2xl text-gray-500 ml-2">écrans</span>
        </motion.div>

        <Slider value={value} onChange={onChange} min={3} max={30} step={1} showValue={false} />

        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white font-semibold">3-7</div>
            <div className="text-gray-500">MVP simple</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white font-semibold">8-15</div>
            <div className="text-gray-500">App standard</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white font-semibold">16+</div>
            <div className="text-gray-500">App complexe</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreensStep;
