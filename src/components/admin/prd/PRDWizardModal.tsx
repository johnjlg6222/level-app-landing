'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Loader2, Route, Database, Shield, Palette, RefreshCw, XCircle } from 'lucide-react';
import { Button, StepDots } from '@/components/common';
import { usePRDWizard } from '@/hooks/usePRDWizard';
import { PRDWizardStep } from './PRDWizardStep';
import { PRDPreview } from './PRDPreview';
import { PRD_WIZARD_STEPS } from '@/types/prd';
import { downloadPRDPDF, downloadPRDMarkdown } from '@/lib/prd-pdf-template';
import type { QuoteFormState } from '@/hooks/useQuoteForm';
import type { GenerateQuestionsRequest } from '@/types/prd';

interface PRDWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteState: QuoteFormState;
  onPRDGenerated?: (prdContent: string) => void; // callback to save PRD to DB
}

const stepIcons = {
  Route,
  Database,
  Shield,
  Palette,
};

function buildQuoteData(state: QuoteFormState): GenerateQuestionsRequest {
  return {
    clientInfo: {
      company: state.clientInfo.company,
      sector: state.clientInfo.sector,
    },
    projectContext: {
      projectName: state.projectContext.projectName,
      problemToSolve: state.projectContext.problemToSolve,
      projectType: state.projectContext.projectType,
      targetUsers: state.projectContext.targetUsers,
    },
    selectedPlan: state.selectedPlan,
    selectedPacks: state.selectedPacks,
    simpleFeatures: state.simpleFeatures as Record<string, unknown>,
    advancedFeatures: state.advancedFeatures,
    design: {
      style: state.design.style,
      darkMode: state.design.darkMode,
      animations: state.design.animations,
    },
    notes: {
      indispensable: state.notes.indispensable,
      niceToHave: state.notes.niceToHave,
    },
  };
}

export const PRDWizardModal: React.FC<PRDWizardModalProps> = ({
  isOpen,
  onClose,
  quoteState,
  onPRDGenerated,
}) => {
  const wizard = usePRDWizard();
  const { state, startWizard, setAnswer, acceptSuggestion, goToStep, nextStep, prevStep, getTotalProgress, getStepProgress, canGenerate, generatePRD, cancelGeneration, retryLastAction, clearPRD, reset } = wizard;

  const currentStepDef = PRD_WIZARD_STEPS[state.currentStep];
  const totalProgress = getTotalProgress();
  const isGenerating = state.isGeneratingQuestions || state.isGeneratingPRD;

  // Start wizard when modal opens and no questions yet
  useEffect(() => {
    if (isOpen && state.questions.length === 0 && !state.isGeneratingQuestions && !state.generatedPRD) {
      startWizard(buildQuoteData(quoteState));
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when PRD is generated (for DB persistence)
  useEffect(() => {
    if (state.generatedPRD && onPRDGenerated) {
      onPRDGenerated(state.generatedPRD);
    }
  }, [state.generatedPRD]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    onClose();
    // Don't reset - user might want to come back (state persisted in localStorage)
  };

  const handleGeneratePRD = () => {
    generatePRD(buildQuoteData(quoteState));
  };

  const handleExportMarkdown = () => {
    if (!state.generatedPRD) return;
    downloadPRDMarkdown(
      state.generatedPRD,
      quoteState.projectContext.projectName || 'projet'
    );
  };

  const handleExportPDF = async () => {
    if (!state.generatedPRD) return;
    await downloadPRDPDF(
      state.generatedPRD,
      quoteState.projectContext.projectName || 'Projet',
      quoteState.clientInfo.company || 'Client'
    );
  };

  const handleBackToWizard = () => {
    clearPRD();
  };

  const handleNewWizard = () => {
    reset();
    startWizard(buildQuoteData(quoteState));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0A0F] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">PRD Wizard</h2>
                    <p className="text-xs text-gray-500">
                      {state.generatedPRD
                        ? 'PRD genere'
                        : state.isGeneratingQuestions
                        ? 'Analyse du devis en cours...'
                        : state.isGeneratingPRD
                        ? 'Redaction du PRD en cours...'
                        : currentStepDef
                        ? `Etape ${state.currentStep + 1}/4 - ${currentStepDef.title}`
                        : 'Chargement...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar and step dots */}
              {!state.generatedPRD && state.questions.length > 0 && !isGenerating && (
                <div className="space-y-3">
                  {/* Step navigation */}
                  <div className="flex items-center justify-between">
                    <StepDots
                      currentStep={state.currentStep}
                      totalSteps={4}
                      onStepClick={goToStep}
                    />
                    <span className="text-xs text-gray-500">
                      {totalProgress.answered}/{totalProgress.total} questions ({totalProgress.percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500"
                      animate={{ width: `${totalProgress.percentage}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Step tabs */}
                  <div className="flex gap-1">
                    {PRD_WIZARD_STEPS.map((step, index) => {
                      const Icon = stepIcons[step.icon as keyof typeof stepIcons];
                      const progress = getStepProgress(step.id);
                      const isActive = index === state.currentStep;

                      return (
                        <button
                          key={step.id}
                          onClick={() => goToStep(index)}
                          className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                            isActive
                              ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                              : 'bg-white/5 border border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                          <span className="hidden sm:inline truncate">{step.title}</span>
                          <span className="ml-auto text-[10px] opacity-60">
                            {progress.answered}/{progress.total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Loading state - generating questions */}
              {state.isGeneratingQuestions && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Analyse du devis en cours...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      L&apos;IA genere des questions ciblees pour votre projet
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelGeneration}
                    icon={<XCircle className="w-4 h-4" />}
                    className="mt-4"
                  >
                    Annuler
                  </Button>
                </div>
              )}

              {/* Generating PRD state */}
              {state.isGeneratingPRD && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Generation du PRD en cours...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      L&apos;IA redige le document de specifications (~1-2 min)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelGeneration}
                    icon={<XCircle className="w-4 h-4" />}
                    className="mt-4"
                  >
                    Annuler
                  </Button>
                </div>
              )}

              {/* Error state with retry */}
              {state.error && !isGenerating && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <p className="text-red-400 text-sm mb-3">{state.error}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={retryLastAction}
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      Reessayer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNewWizard}
                    >
                      Recommencer
                    </Button>
                  </div>
                </div>
              )}

              {/* PRD Preview */}
              {state.generatedPRD && !state.isGeneratingPRD && (
                <PRDPreview
                  prdContent={state.generatedPRD}
                  projectName={quoteState.projectContext.projectName || 'Projet'}
                  clientCompany={quoteState.clientInfo.company || 'Client'}
                  onExportPDF={handleExportPDF}
                  onExportMarkdown={handleExportMarkdown}
                  onBack={handleBackToWizard}
                />
              )}

              {/* Wizard step content */}
              {!state.isGeneratingQuestions &&
                !state.isGeneratingPRD &&
                !state.generatedPRD &&
                state.questions.length > 0 &&
                currentStepDef && (
                  <PRDWizardStep
                    step={currentStepDef}
                    questions={state.questions}
                    answers={state.answers}
                    onAnswer={setAnswer}
                    onAcceptSuggestion={acceptSuggestion}
                  />
                )}
            </div>

            {/* Footer */}
            {!state.generatedPRD &&
              !isGenerating &&
              state.questions.length > 0 && (
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    {/* Left: prev button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevStep}
                      disabled={state.currentStep === 0}
                      icon={<ChevronLeft className="w-4 h-4" />}
                    >
                      Precedent
                    </Button>

                    {/* Center: progress summary */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {totalProgress.answered} / {totalProgress.total} questions repondues
                      </p>
                      {canGenerate() && (
                        <p className="text-xs text-green-400 mt-0.5">Pret pour la generation</p>
                      )}
                    </div>

                    {/* Right: next/generate buttons */}
                    <div className="flex items-center gap-2">
                      {state.currentStep < 3 ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={nextStep}
                          icon={<ChevronRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Suivant
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        onClick={handleGeneratePRD}
                        disabled={!canGenerate()}
                        icon={<Sparkles className="w-4 h-4" />}
                      >
                        Generer le PRD
                      </Button>
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
