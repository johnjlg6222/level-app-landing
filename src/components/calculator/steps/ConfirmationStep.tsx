'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Phone, Calendar } from 'lucide-react';
import { CalculatorState } from '@/types/calculator';
import { Button } from '@/components/common';

interface ConfirmationStepProps {
  state: CalculatorState;
  onReset: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ state, onReset }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400"
      >
        <CheckCircle size={48} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white mb-4"
      >
        Merci {state.contact.name.split(' ')[0]} !
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-8 max-w-md mx-auto"
      >
        Votre demande a bien été enregistrée. Nous vous recontacterons très rapidement.
      </motion.p>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto bg-white/5 rounded-xl p-6 border border-white/10 text-left mb-8"
      >
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Récapitulatif
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-blue-400" />
            <span className="text-gray-300">{state.contact.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-blue-400" />
            <span className="text-gray-300">{state.contact.phone}</span>
          </div>
          {state.booking.scheduled && (
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-green-400" />
              <span className="text-gray-300">Appel programmé</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Estimation</span>
            <span className="text-white font-bold">
              {state.calculatedPrice.min.toLocaleString('fr-FR')} -{' '}
              {state.calculatedPrice.max.toLocaleString('fr-FR')} €
            </span>
          </div>
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-md mx-auto space-y-4 mb-8"
      >
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Prochaines étapes
        </h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
              1
            </div>
            <div>
              <span className="text-white font-medium">Email de confirmation</span>
              <p className="text-sm text-gray-500">Vous recevrez un récapitulatif par email</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
              2
            </div>
            <div>
              <span className="text-white font-medium">Appel de cadrage</span>
              <p className="text-sm text-gray-500">
                {state.booking.scheduled
                  ? 'Rendez-vous confirmé'
                  : 'Nous vous contacterons pour planifier'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
              3
            </div>
            <div>
              <span className="text-white font-medium">Proposition détaillée</span>
              <p className="text-sm text-gray-500">Devis et planning personnalisés</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/">
          <Button variant="secondary" icon={<ArrowRight size={18} />} iconPosition="right">
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Button variant="ghost" onClick={onReset}>
          Nouvelle estimation
        </Button>
      </motion.div>
    </div>
  );
};

export default ConfirmationStep;
