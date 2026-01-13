'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, Check } from 'lucide-react';
import { CalculatedPrice } from '@/types/calculator';

interface PriceStepProps {
  price: CalculatedPrice;
  deliveryWeeks: number;
}

export const PriceStep: React.FC<PriceStepProps> = ({ price, deliveryWeeks }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400"
      >
        <Calculator size={40} />
      </motion.div>

      <h3 className="text-gray-400 mb-2">Estimation indicative</h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter"
      >
        {price.min.toLocaleString('fr-FR')} - {price.max.toLocaleString('fr-FR')} €
        <span className="text-xl text-gray-500 font-normal ml-2">HT</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mb-8"
      >
        Basé sur vos choix. Délai estimé de {deliveryWeeks} semaines.
      </motion.p>

      {/* Price breakdown */}
      {price.breakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto bg-white/5 rounded-xl p-6 border border-white/10 text-left"
        >
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Détail de l&apos;estimation
          </h4>
          <div className="space-y-3">
            {price.breakdown.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-400 flex items-center gap-2">
                  <Check size={14} className="text-blue-500" />
                  {item.label}
                </span>
                <span className="text-white font-medium">
                  {item.amount >= 0 ? '+' : ''}
                  {item.amount.toLocaleString('fr-FR')} €
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-2">
              <Clock size={14} />
              Délai estimé
            </span>
            <span className="text-white font-medium">{deliveryWeeks} semaines</span>
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-500 mt-6 max-w-sm mx-auto"
      >
        Cette estimation est indicative et peut varier selon la complexité exacte de votre projet.
        Un appel de cadrage permettra d&apos;affiner ce chiffre.
      </motion.p>
    </div>
  );
};

export default PriceStep;
