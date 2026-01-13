'use client';

import React from 'react';
import { CreditCard, X, ShoppingCart, RefreshCw, Layers } from 'lucide-react';
import { SelectCards, type SelectOption } from '@/components/common';
import { PaymentNeeds, PAYMENT_OPTIONS } from '@/types/calculator';

interface PaymentsStepProps {
  value: PaymentNeeds;
  onChange: (value: PaymentNeeds) => void;
}

const iconMap: Record<PaymentNeeds, React.ReactNode> = {
  none: <X size={24} />,
  onetime: <ShoppingCart size={24} />,
  subscription: <RefreshCw size={24} />,
  both: <Layers size={24} />,
};

export const PaymentsStep: React.FC<PaymentsStepProps> = ({ value, onChange }) => {
  const options: SelectOption<PaymentNeeds>[] = PAYMENT_OPTIONS.map((opt) => ({
    value: opt.id,
    label: opt.label,
    description: opt.description,
    icon: iconMap[opt.id],
  }));

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-400">
        <CreditCard size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Avez-vous besoin d&apos;un système de paiement ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Intégration Stripe pour les paiements sécurisés
      </p>

      <div className="max-w-2xl mx-auto">
        <SelectCards value={value} onChange={onChange} options={options} columns={2} />
      </div>
    </div>
  );
};

export default PaymentsStep;
