'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import { Input } from '@/components/common';
import { ContactInfo } from '@/types/calculator';
import { validateContact } from '@/utils/validators';

interface ContactStepProps {
  value: ContactInfo;
  onChange: (value: ContactInfo) => void;
}

export const ContactStep: React.FC<ContactStepProps> = ({ value, onChange }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ContactInfo, fieldValue: string) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = () => {
    const { errors: validationErrors } = validateContact(value);
    setErrors(validationErrors);
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
        <User size={40} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Comment vous contacter ?
      </h3>
      <p className="text-gray-400 mb-12 max-w-md mx-auto">
        Vos coordonnées pour recevoir votre estimation personnalisée
      </p>

      <div className="max-w-md mx-auto space-y-6">
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          value={value.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={handleBlur}
          error={errors.name}
          icon={<User size={18} />}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="jean@exemple.com"
          value={value.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={handleBlur}
          error={errors.email}
          icon={<Mail size={18} />}
          required
        />

        <Input
          label="Téléphone"
          type="tel"
          placeholder="06 12 34 56 78"
          value={value.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={handleBlur}
          error={errors.phone}
          icon={<Phone size={18} />}
          required
        />

        <Input
          label="Entreprise (optionnel)"
          placeholder="Ma Startup"
          value={value.company || ''}
          onChange={(e) => handleChange('company', e.target.value)}
          icon={<Building size={18} />}
        />
      </div>
    </div>
  );
};

export default ContactStep;
