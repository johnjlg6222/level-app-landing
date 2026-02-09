'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import type { PRDQuestion, PRDAnswer } from '@/types/prd';

interface PRDQuestionCardProps {
  question: PRDQuestion;
  answer?: PRDAnswer;
  onAnswer: (questionId: string, answer: string) => void;
  onAcceptSuggestion: (questionId: string) => void;
}

const priorityConfig = {
  must_answer: { color: 'bg-red-500', label: 'Requis' },
  recommended: { color: 'bg-yellow-500', label: 'Recommande' },
  optional: { color: 'bg-gray-500', label: 'Optionnel' },
};

export const PRDQuestionCard: React.FC<PRDQuestionCardProps> = ({
  question,
  answer,
  onAnswer,
  onAcceptSuggestion,
}) => {
  const priority = priorityConfig[question.priority];

  return (
    <Card className="p-5">
      <div className="space-y-3">
        {/* Header: priority + feature badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-2 h-2 rounded-full ${priority.color} flex-shrink-0`} />
          <span className="text-xs text-gray-500">{priority.label}</span>
          {question.relatedFeature && (
            <Badge variant="primary" size="sm">
              {question.relatedFeature}
            </Badge>
          )}
        </div>

        {/* Question */}
        <p className="text-white font-semibold text-sm leading-relaxed">
          {question.question}
        </p>

        {/* Context */}
        <p className="text-gray-500 text-xs leading-relaxed">
          {question.context}
        </p>

        {/* Textarea for answer */}
        <textarea
          value={answer?.answer || ''}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Votre reponse..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 resize-y min-h-[80px]"
        />

        {/* AI suggestion button */}
        {question.suggestedAnswer && (!answer || !answer.answer) && (
          <button
            onClick={() => onAcceptSuggestion(question.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Suggestion IA
          </button>
        )}
      </div>
    </Card>
  );
};
