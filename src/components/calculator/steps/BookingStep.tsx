'use client';

import React, { useEffect, useRef } from 'react';
import { BookingInfo } from '@/types/calculator';

interface BookingStepProps {
  value: BookingInfo;
  onChange: (value: BookingInfo) => void;
}

export const BookingStep: React.FC<BookingStepProps> = ({ onChange }) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptLoaded.current) return;

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://app.iclosed.io/assets/widget.js"]'
    );
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    // Load the iClosed script
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
      // Check if message is from iClosed
      if (event.origin === 'https://app.iclosed.io') {
        // Parse booking confirmation if available
        if (event.data?.type === 'booking_confirmed') {
          onChange({
            scheduled: true,
            eventUri: event.data?.eventUri,
            scheduledTime: event.data?.scheduledTime,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onChange]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Planifiez votre appel
        </h3>
        <p className="text-gray-400">
          15 minutes pour valider votre projet et affiner l&apos;estimation
        </p>
      </div>

      {/* iClosed Widget Container */}
      <div
        className="iclosed-widget rounded-xl overflow-hidden bg-white/5"
        data-url="https://app.iclosed.io/e/levelapp/meeting-estimation"
        title="Meeting estimation"
        style={{ width: '100%', height: '420px' }}
      />
    </div>
  );
};

export default BookingStep;
