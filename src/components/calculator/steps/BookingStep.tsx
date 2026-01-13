'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, ExternalLink } from 'lucide-react';
import { BookingInfo } from '@/types/calculator';
import { Button } from '@/components/common';

interface BookingStepProps {
  value: BookingInfo;
  onChange: (value: BookingInfo) => void;
}

export const BookingStep: React.FC<BookingStepProps> = ({ value, onChange }) => {
  const handleBookingClick = () => {
    // In a real implementation, this would open a Calendly widget or similar
    // For now, we'll simulate a successful booking
    onChange({
      scheduled: true,
      eventUri: 'https://calendly.com/level-app/discovery',
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    });
  };

  if (value.scheduled) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400"
        >
          <Check size={40} />
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Rendez-vous confirmé !
        </h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Nous avons hâte de discuter de votre projet. Vous recevrez un email de confirmation.
        </p>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-blue-400" />
            <span className="text-white font-medium">Appel de découverte</span>
          </div>
          <p className="text-gray-400 text-sm">
            {value.scheduledTime
              ? new Date(value.scheduledTime).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date à confirmer'}
          </p>
        </div>

        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => onChange({ scheduled: false })}
        >
          Modifier le rendez-vous
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
        <Calendar size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Réservez un appel de cadrage
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        15 minutes pour valider votre projet et affiner l&apos;estimation
      </p>

      <div className="max-w-md mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left">
            <Check size={18} className="text-green-400" />
            <span className="text-gray-300">Discussion de vos besoins</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check size={18} className="text-green-400" />
            <span className="text-gray-300">Estimation affinée</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check size={18} className="text-green-400" />
            <span className="text-gray-300">Réponses à vos questions</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check size={18} className="text-green-400" />
            <span className="text-gray-300">Sans engagement</span>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleBookingClick}
          icon={<ExternalLink size={18} />}
          iconPosition="right"
        >
          Choisir un créneau
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Appel gratuit • Réponse sous 24h
        </p>
      </div>

      <Button
        variant="ghost"
        className="mt-6"
        onClick={() => onChange({ scheduled: false })}
      >
        Passer cette étape
      </Button>
    </div>
  );
};

export default BookingStep;
