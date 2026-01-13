'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          Étape {currentStep + 1} / {totalSteps}
        </span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Step dots indicator
export interface StepDotsProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const StepDots: React.FC<StepDotsProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onStepClick?.(index)}
            disabled={!onStepClick || index > currentStep}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-200',
              isCompleted && 'bg-blue-600',
              isCurrent && 'bg-blue-500 ring-4 ring-blue-500/20',
              !isCompleted && !isCurrent && 'bg-white/10',
              onStepClick && index <= currentStep && 'cursor-pointer hover:scale-110',
              (!onStepClick || index > currentStep) && 'cursor-default'
            )}
          />
        );
      })}
    </div>
  );
};

// Vertical stepper
export interface VerticalStepperProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex gap-4">
            {/* Line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  isCompleted && 'bg-blue-600 text-white',
                  isCurrent && 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500',
                  !isCompleted && !isCurrent && 'bg-white/10 text-gray-500'
                )}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[40px]',
                    isCompleted ? 'bg-blue-600' : 'bg-white/10'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <h4
                className={cn(
                  'font-semibold',
                  isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                )}
              >
                {step.title}
              </h4>
              {step.description && (
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
