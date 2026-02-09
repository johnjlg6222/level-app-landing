'use client';

import React from 'react';
import { PRDQuestionCard } from './PRDQuestionCard';
import type { PRDWizardStep as PRDWizardStepType, PRDQuestion, PRDAnswer } from '@/types/prd';

interface PRDWizardStepProps {
  step: PRDWizardStepType;
  questions: PRDQuestion[];
  answers: Record<string, PRDAnswer>;
  onAnswer: (questionId: string, answer: string) => void;
  onAcceptSuggestion: (questionId: string) => void;
}

export const PRDWizardStep: React.FC<PRDWizardStepProps> = ({
  step,
  questions,
  answers,
  onAnswer,
  onAcceptSuggestion,
}) => {
  const stepQuestions = questions.filter((q) => q.stepId === step.id);
  const answered = stepQuestions.filter((q) => answers[q.id]?.answer).length;

  return (
    <div className="space-y-4">
      {/* Step header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
        <p className="text-sm text-gray-400">{step.description}</p>
        <p className="text-xs text-gray-500">
          {answered}/{stepQuestions.length} questions repondues
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {stepQuestions.map((question) => (
          <PRDQuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={onAnswer}
            onAcceptSuggestion={onAcceptSuggestion}
          />
        ))}

        {stepQuestions.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Aucune question pour cette etape.
          </div>
        )}
      </div>
    </div>
  );
};
