'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { CalculatedPrice, BookingInfo } from '@/types/calculator';

interface PriceStepProps {
  price: CalculatedPrice;
  deliveryWeeks: number;
  booking: BookingInfo;
  onBookingChange: (value: BookingInfo) => void;
}

export const PriceStep: React.FC<PriceStepProps> = ({ price, booking, onBookingChange }) => {
  const scriptLoaded = useRef(false);

  // Load iClosed script
  useEffect(() => {
    if (scriptLoaded.current) return;

    const existingScript = document.querySelector(
      'script[src="https://app.iclosed.io/assets/widget.js"]'
    );
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.iclosed.io/assets/widget.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);
  }, []);

  // Listen for booking completion events from iClosed
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://app.iclosed.io') {
        if (event.data?.type === 'booking_confirmed') {
          onBookingChange({
            scheduled: true,
            eventUri: event.data?.eventUri,
            scheduledTime: event.data?.scheduledTime,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBookingChange]);

  return (
    <div className="w-full">
      {/* Price Display */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400"
        >
          <Calculator size={32} />
        </motion.div>

        <h3 className="text-gray-400 mb-2 text-sm">Estimation indicative</h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tighter"
        >
          {price.min.toLocaleString('fr-FR')} - {price.max.toLocaleString('fr-FR')} €
          <span className="text-lg text-gray-500 font-normal ml-2">HT</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-xs"
        >
          Basé sur vos choix.
        </motion.p>
      </div>

      {/* iClosed Widget - Square and Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm mx-auto"
      >
        <div
          className="iclosed-widget rounded-xl overflow-hidden bg-white/5"
          data-url="https://app.iclosed.io/e/levelapp/meeting-estimation"
          title="Meeting estimation"
          style={{ width: '100%', height: '320px' }}
        />
      </motion.div>
    </div>
  );
};

export default PriceStep;
