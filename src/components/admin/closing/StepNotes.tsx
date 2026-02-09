'use client';

import React from 'react';
import { Textarea } from '@/components/common/Input';
import { StickyNote, AlertTriangle, Sparkles, Lock } from 'lucide-react';
import type { ClosingWizardState } from '@/types/closing-wizard';

interface StepNotesProps {
  notes: ClosingWizardState['notes'];
  onChange: (n: Partial<ClosingWizardState['notes']>) => void;
}

export const StepNotes: React.FC<StepNotesProps> = ({
  notes,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <StickyNote size={24} className="text-blue-400" />
          Notes et remarques
        </h2>
        <p className="text-gray-400 mt-1">
          Capturez les points importants mentionnes par le client pendant l&apos;appel.
        </p>
      </div>

      {/* Indispensable */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <label className="text-sm font-medium text-red-400">
            Indispensable (must-have)
          </label>
        </div>
        <Textarea
          placeholder="Points absolument critiques pour le client. Fonctionnalites sans lesquelles le projet n'a pas de sens..."
          value={notes.indispensable}
          onChange={(e) => onChange({ indispensable: e.target.value })}
        />
      </div>

      {/* Nice-to-have */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-400" />
          <label className="text-sm font-medium text-yellow-400">
            Nice-to-have (bonus)
          </label>
        </div>
        <Textarea
          placeholder="Fonctionnalites souhaitees mais non bloquantes. Points qui pourraient etre ajoutes en phase 2..."
          value={notes.niceToHave}
          onChange={(e) => onChange({ niceToHave: e.target.value })}
        />
      </div>

      {/* Internal notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-gray-400" />
          <label className="text-sm font-medium text-gray-400">
            Notes internes (non visible client)
          </label>
        </div>
        <Textarea
          placeholder="Impressions personnelles, points d'attention, red flags, notes sur le budget ou la decision..."
          value={notes.internal}
          onChange={(e) => onChange({ internal: e.target.value })}
        />
      </div>
    </div>
  );
};
