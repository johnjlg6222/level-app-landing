'use client';

import React from 'react';
import { Shield, X, Mail, Users2, UserCheck } from 'lucide-react';
import { SelectCards, type SelectOption } from '@/components/common';
import { AuthLevel, AUTH_OPTIONS } from '@/types/calculator';

interface AuthStepProps {
  value: AuthLevel;
  onChange: (value: AuthLevel) => void;
}

const iconMap: Record<AuthLevel, React.ReactNode> = {
  none: <X size={24} />,
  email: <Mail size={24} />,
  social: <UserCheck size={24} />,
  multi_user: <Users2 size={24} />,
};

export const AuthStep: React.FC<AuthStepProps> = ({ value, onChange }) => {
  const options: SelectOption<AuthLevel>[] = AUTH_OPTIONS.map((opt) => ({
    value: opt.id,
    label: opt.label,
    description: opt.description,
    icon: iconMap[opt.id],
  }));

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
        <Shield size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Comment vos utilisateurs se connectent-ils ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Le système d&apos;authentification adapté à vos besoins
      </p>

      <div className="max-w-2xl mx-auto">
        <SelectCards value={value} onChange={onChange} options={options} columns={2} />
      </div>
    </div>
  );
};

export default AuthStep;
