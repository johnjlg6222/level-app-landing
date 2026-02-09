'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardStepNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const WizardStepNav: React.FC<WizardStepNavProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onFinish,
  isFirstStep,
  isLastStep,
}) => {
  return (
    <div className="sticky bottom-0 z-10 bg-[#050507]/90 backdrop-blur-md border-t border-white/5 px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left: Previous */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={isFirstStep}
          icon={<ChevronLeft size={18} />}
        >
          Precedent
        </Button>

        {/* Center: Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {currentStep + 1}
          </span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">
            {totalSteps}
          </span>
        </div>

        {/* Right: Next */}
        <Button
          variant="primary"
          size="sm"
          onClick={isLastStep && onFinish ? onFinish : onNext}
          icon={<ChevronRight size={18} />}
          iconPosition="right"
        >
          {isLastStep ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};
