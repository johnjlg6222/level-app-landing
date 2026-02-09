'use client';

import React from 'react';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Input';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { PROJECT_TYPES, TARGET_USERS_OPTIONS } from '@/types/pricing';
import type { ClosingWizardState } from '@/types/closing-wizard';

interface StepProjectContextProps {
  projectContext: ClosingWizardState['projectContext'];
  onChange: (ctx: Partial<ClosingWizardState['projectContext']>) => void;
}

export const StepProjectContext: React.FC<StepProjectContextProps> = ({
  projectContext,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Contexte du projet</h2>
        <p className="text-gray-400 mt-1">
          Decrivez le projet pour mieux cerner les besoins.
        </p>
      </div>

      {/* Project name */}
      <Input
        label="Nom du projet"
        placeholder="Ex: MonApp, Dashboard Analytics..."
        value={projectContext.projectName}
        onChange={(e) => onChange({ projectName: e.target.value })}
        icon={<FileText size={18} />}
      />

      {/* Problem to solve */}
      <Textarea
        label="Probleme a resoudre"
        placeholder="Quel probleme le client cherche-t-il a resoudre ? Quel est le besoin principal ?"
        value={projectContext.problemToSolve}
        onChange={(e) => onChange({ problemToSolve: e.target.value })}
      />

      {/* Project type chips */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Type de projet
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange({ projectType: type.id })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                projectContext.projectType === type.id
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              <span>{type.label}</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {type.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Target users chips */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Utilisateurs cibles
        </label>
        <div className="flex flex-wrap gap-2">
          {TARGET_USERS_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange({ targetUsers: option.id })}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                projectContext.targetUsers === option.id
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              <span>{option.label}</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
