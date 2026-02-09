'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  Database,
  DollarSign,
  MessageCircle,
  LogOut,
  Download,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClosingWizard } from '@/hooks/useClosingWizard';
import { Button } from '@/components/common';
import { AmbientBackground } from '@/components/landing';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ChatWidget } from '@/components/chat';
import { PRDWizardModal } from '@/components/admin/prd';
import { CLOSING_WIZARD_STEPS } from '@/types/closing-wizard';
import { formatCurrency } from '@/utils/formatters';
import { downloadQuotePDF } from '@/lib/pdf-generator';

import { WizardSidebar } from '@/components/admin/closing/WizardSidebar';
import { WizardStepNav } from '@/components/admin/closing/WizardStepNav';
import { StepClientInfo } from '@/components/admin/closing/StepClientInfo';
import { StepProjectContext } from '@/components/admin/closing/StepProjectContext';
import { StepPackSelection } from '@/components/admin/closing/StepPackSelection';
import { StepFeatureCategory } from '@/components/admin/closing/StepFeatureCategory';
import { StepDesign } from '@/components/admin/closing/StepDesign';
import { StepLogistics } from '@/components/admin/closing/StepLogistics';
import { StepNotes } from '@/components/admin/closing/StepNotes';
import { StepReview } from '@/components/admin/closing/StepReview';

import type { QuoteFormState } from '@/hooks/useQuoteForm';
// Adapter: convert wizard state to old QuoteFormState for PRD modal compatibility
function wizardStateToQuoteState(wizard: ReturnType<typeof useClosingWizard>): QuoteFormState {
  const { state, selectedFeatureDetails } = wizard;
  return {
    clientInfo: state.clientInfo,
    projectContext: state.projectContext,
    selectedPlan: 'starter', // Placeholder - PRD uses features list now
    selectedPacks: [
      ...(state.selectedMainPack ? [state.selectedMainPack] : []),
      ...state.selectedCategoryPacks,
    ],
    extraScreens: state.extraScreens,
    discount: state.discount,
    simpleFeatures: {
      auth: { enabled: false, level: 'basic' },
      payments: { enabled: false, type: 'simple' },
      data: { enabled: false, complexity: 'basic' },
      dashboard: { enabled: false, charts: false },
      notifications: { enabled: false, types: [] },
      calendar: { enabled: false },
      integrations: { enabled: false, list: [] },
    },
    advancedFeatures: [],
    selectedFeatures: selectedFeatureDetails.map(f => f.featureId),
    design: state.design,
    logistics: state.logistics,
    notes: state.notes,
  };
}

function AdminFormContent() {
  const { signOut, user } = useAuth();
  const wizard = useClosingWizard();
  const {
    state,
    allFeatures,
    allPacks,
    isLoading,
    goToStep,
    nextStep,
    prevStep,
    setClientInfo,
    setProjectContext,
    selectMainPack,
    toggleCategoryPack,
    toggleFeature,
    setDesign,
    setLogistics,
    setNotes,
    setDiscount,
    calculatedPrice,
    selectedFeatureDetails,
    completedSteps,
    featuresForCategory,
    packFeatureNames,
    resetForm,
  } = wizard;

  const [isExporting, setIsExporting] = useState(false);
  const [isPRDWizardOpen, setIsPRDWizardOpen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep]);

  const handleExportQuote = async () => {
    setIsExporting(true);
    try {
      const quoteState = wizardStateToQuoteState(wizard);
      await downloadQuotePDF(quoteState, calculatedPrice);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Render current step content
  const renderStepContent = () => {
    const currentStepDef = CLOSING_WIZARD_STEPS[state.currentStep];
    if (!currentStepDef) return null;

    switch (currentStepDef.id) {
      case 'client':
        return <StepClientInfo clientInfo={state.clientInfo} onChange={setClientInfo} />;

      case 'project':
        return <StepProjectContext projectContext={state.projectContext} onChange={setProjectContext} />;

      case 'packs':
        return (
          <StepPackSelection
            packs={allPacks}
            selectedMainPack={state.selectedMainPack}
            selectedCategoryPacks={state.selectedCategoryPacks}
            onSelectMainPack={selectMainPack}
            onToggleCategoryPack={toggleCategoryPack}
          />
        );

      case 'design':
        return <StepDesign design={state.design} onChange={setDesign} />;

      case 'logistics':
        return <StepLogistics logistics={state.logistics} onChange={setLogistics} />;

      case 'notes':
        return <StepNotes notes={state.notes} onChange={setNotes} />;

      case 'review':
        return (
          <StepReview
            state={state}
            features={allFeatures}
            packs={allPacks}
          />
        );

      default:
        // Category feature steps
        if (currentStepDef.category) {
          const catFeatures = featuresForCategory(currentStepDef.category);
          return (
            <StepFeatureCategory
              category={currentStepDef.category}
              features={catFeatures}
              selectedFeatureIds={state.selectedFeatureIds}
              packFeatureIds={state.packFeatureIds}
              packNames={packFeatureNames}
              onToggleFeature={toggleFeature}
            />
          );
        }
        return null;
    }
  };

  const totalSteps = CLOSING_WIZARD_STEPS.length;
  const isReviewStep = state.currentStep === totalSteps - 1;

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white">
      <AmbientBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Home size={18} />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-400" />
              <h1 className="text-lg font-semibold text-white">Devis Builder</h1>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <Link href="/admin/knowledge" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Database size={18} />
              <span className="hidden sm:inline">Knowledge</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link href="/admin/pricing" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <DollarSign size={18} />
              <span className="hidden sm:inline">Tarifs</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} icon={<LogOut className="w-4 h-4" />}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-12">
        <div className="flex max-w-[1600px] mx-auto">
          {/* Left sidebar - wizard steps */}
          <div className="hidden lg:block w-72 flex-shrink-0 px-4">
            <WizardSidebar
              currentStep={state.currentStep}
              steps={CLOSING_WIZARD_STEPS}
              totalPrice={calculatedPrice.total}
              monthlyMaintenance={calculatedPrice.monthlyMaintenance}
              onStepClick={goToStep}
              completedSteps={completedSteps}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0 px-4 pb-20 lg:pb-0">
            {/* Step header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                Étape {state.currentStep + 1} / {totalSteps}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {CLOSING_WIZARD_STEPS[state.currentStep]?.label}
              </h2>
            </div>

            {/* Mobile step picker */}
            <div className="lg:hidden mb-4">
              <select
                value={state.currentStep}
                onChange={(e) => goToStep(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none"
              >
                {CLOSING_WIZARD_STEPS.map((step, i) => (
                  <option key={step.id} value={i}>{i + 1}. {step.label}</option>
                ))}
              </select>
            </div>

            {/* Step content */}
            <div className="min-h-[60vh]">
              {renderStepContent()}
            </div>

            {/* Bottom navigation */}
            <WizardStepNav
              currentStep={state.currentStep}
              totalSteps={totalSteps}
              onPrev={prevStep}
              onNext={nextStep}
              onFinish={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              isFirstStep={state.currentStep === 0}
              isLastStep={isReviewStep}
            />
          </div>

          {/* Right sidebar - price summary (desktop) */}
          <div className="hidden lg:block w-72 flex-shrink-0 px-4">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Prix total</h3>
                <motion.p
                  key={Math.round(calculatedPrice.total / 100)}
                  initial={{ scale: 1.02, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold text-white"
                >
                  {formatCurrency(calculatedPrice.total)}
                </motion.p>
                {calculatedPrice.monthlyMaintenance > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    + {formatCurrency(calculatedPrice.monthlyMaintenance)}/mois
                  </p>
                )}

                {/* Full breakdown on review step, summary otherwise */}
                {isReviewStep ? (
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    {/* Breakdown lines */}
                    {calculatedPrice.breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-500 truncate mr-2">{item.label}</span>
                        <span className="text-gray-300 flex-shrink-0">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}

                    {/* Subtotal */}
                    <div className="border-t border-white/5 pt-2 flex justify-between text-xs">
                      <span className="text-gray-400">Sous-total</span>
                      <span className="font-semibold text-white">{formatCurrency(calculatedPrice.subtotal)}</span>
                    </div>

                    {/* Discount */}
                    {calculatedPrice.discount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-green-400">
                          <TrendingDown size={12} />
                          Remise
                        </span>
                        <span className="text-green-400">-{formatCurrency(calculatedPrice.discount)}</span>
                      </div>
                    )}

                    {/* Urgency */}
                    {calculatedPrice.urgencyMultiplier > 1 && (
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <TrendingUp size={12} />
                          Urgence (x{calculatedPrice.urgencyMultiplier})
                        </span>
                        <span className="text-yellow-400">
                          +{formatCurrency((calculatedPrice.subtotal - calculatedPrice.discount) * (calculatedPrice.urgencyMultiplier - 1))}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-sm font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(calculatedPrice.total)}</span>
                    </div>

                    {/* Maintenance */}
                    {calculatedPrice.monthlyMaintenance > 0 && (
                      <div className="border-t border-white/5 pt-2 flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-blue-400">
                          <Minus size={12} />
                          Maintenance / mois
                        </span>
                        <span className="font-semibold text-blue-400">{formatCurrency(calculatedPrice.monthlyMaintenance)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  calculatedPrice.breakdown.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                      {calculatedPrice.breakdown.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-500 truncate mr-2">{item.label}</span>
                          <span className="text-gray-300 flex-shrink-0">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      {calculatedPrice.breakdown.length > 5 && (
                        <p className="text-xs text-gray-600">+{calculatedPrice.breakdown.length - 5} autres...</p>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                {isReviewStep && (
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => setIsPRDWizardOpen(true)}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Générer PRD
                  </Button>
                )}
                <Button
                  fullWidth
                  size="sm"
                  variant="secondary"
                  onClick={handleExportQuote}
                  loading={isExporting}
                  icon={<Download className="w-4 h-4" />}
                >
                  Devis PDF
                </Button>
                {!isReviewStep && (
                  <Button
                    fullWidth
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPRDWizardOpen(true)}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Générer PRD
                  </Button>
                )}
              </div>

              {/* Discount input */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <label className="block text-xs font-medium text-gray-400 mb-1">Remise (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={state.discount}
                  onChange={e => setDiscount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile price bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(calculatedPrice.total)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleExportQuote} loading={isExporting} icon={<Download className="w-4 h-4" />}>
                PDF
              </Button>
              <Button size="sm" onClick={() => setIsPRDWizardOpen(true)} icon={<Sparkles className="w-4 h-4" />}>
                PRD
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      <ChatWidget />

      {/* PRD Wizard Modal */}
      <PRDWizardModal
        isOpen={isPRDWizardOpen}
        onClose={() => setIsPRDWizardOpen(false)}
        quoteState={wizardStateToQuoteState(wizard)}
        onPRDGenerated={() => {}}
      />
    </div>
  );
}

export default function AdminClosingPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminFormContent />
    </ProtectedRoute>
  );
}
