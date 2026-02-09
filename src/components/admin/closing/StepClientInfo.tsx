'use client';

import React from 'react';
import { Input } from '@/components/common/Input';
import { cn } from '@/lib/utils';
import { Building2, User, Mail, Phone } from 'lucide-react';
import { CLIENT_SECTORS } from '@/types/pricing';
import type { ClosingWizardState } from '@/types/closing-wizard';

interface StepClientInfoProps {
  clientInfo: ClosingWizardState['clientInfo'];
  onChange: (info: Partial<ClosingWizardState['clientInfo']>) => void;
}

export const StepClientInfo: React.FC<StepClientInfoProps> = ({
  clientInfo,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Informations client</h2>
        <p className="text-gray-400 mt-1">
          Renseignez les coordonnees du client pour le devis.
        </p>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Entreprise"
          placeholder="Nom de l'entreprise"
          value={clientInfo.company}
          onChange={(e) => onChange({ company: e.target.value })}
          icon={<Building2 size={18} />}
        />
        <Input
          label="Contact"
          placeholder="Nom du contact"
          value={clientInfo.contact}
          onChange={(e) => onChange({ contact: e.target.value })}
          icon={<User size={18} />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="email@entreprise.com"
          value={clientInfo.email}
          onChange={(e) => onChange({ email: e.target.value })}
          icon={<Mail size={18} />}
        />
        <Input
          label="Telephone"
          type="tel"
          placeholder="06 12 34 56 78"
          value={clientInfo.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          icon={<Phone size={18} />}
        />
      </div>

      {/* Sector selection chips */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Secteur d&apos;activite
        </label>
        <div className="flex flex-wrap gap-2">
          {CLIENT_SECTORS.map((sector) => (
            <button
              key={sector.id}
              type="button"
              onClick={() => onChange({ sector: sector.id })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                clientInfo.sector === sector.id
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {sector.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
