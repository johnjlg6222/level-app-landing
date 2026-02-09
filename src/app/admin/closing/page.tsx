'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  Database,
  DollarSign,
  MessageCircle,
  LogOut,
  Save,
  Download,
  FileText,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClosingWizard } from '@/hooks/useClosingWizard';
import { Button } from '@/components/common';
import { AmbientBackground } from '@/components/landing';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ChatWidget } from '@/components/chat';
import { PRDWizardModal } from '@/components/admin/prd';
import { quotesService } from '@/lib/supabase';
import { CLOSING_WIZARD_STEPS } from '@/types/closing-wizard';
import { formatCurrency } from '@/utils/formatters';
import { downloadQuotePDF, downloadTechSpecPDF } from '@/lib/pdf-generator';

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
import type { GenerateQuestionsRequest, SelectedFeatureForPRD } from '@/types/prd';

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

function buildQuoteDataForPRD(
  wizard: ReturnType<typeof useClosingWizard>
): GenerateQuestionsRequest {
  const { state, selectedFeatureDetails } = wizard;
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
    selectedPlan: state.selectedMainPack || '',
    selectedPacks: state.selectedCategoryPacks,
    simpleFeatures: {},
    advancedFeatures: [],
    selectedFeatures: selectedFeatureDetails.map(f => ({
      featureId: f.featureId,
      featureName: f.featureName,
      category: f.category,
      price: f.price,
      fromPack: f.fromPack,
    })),
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

  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const quoteState = wizardStateToQuoteState(wizard);
      const quoteData = {
        client_company: quoteState.clientInfo.company,
        client_contact: quoteState.clientInfo.contact,
        client_email: quoteState.clientInfo.email,
        client_phone: quoteState.clientInfo.phone,
        client_sector: quoteState.clientInfo.sector,
        project_name: quoteState.projectContext.projectName,
        problem_to_solve: quoteState.projectContext.problemToSolve,
        project_type: quoteState.projectContext.projectType,
        target_users: quoteState.projectContext.targetUsers,
        simple_features: quoteState.simpleFeatures,
        advanced_features: quoteState.advancedFeatures,
        selected_features: quoteState.selectedFeatures,
        selected_plan: quoteState.selectedPlan,
        selected_packs: quoteState.selectedPacks,
        extra_screens: quoteState.extraScreens,
        discount: quoteState.discount,
        design_has_branding: quoteState.design.hasBranding,
        design_style: quoteState.design.style,
        design_primary_color: quoteState.design.primaryColor,
        design_secondary_color: quoteState.design.secondaryColor,
        design_dark_mode: quoteState.design.darkMode,
        design_animations: quoteState.design.animations,
        deadline: quoteState.logistics.deadline,
        urgency: quoteState.logistics.urgency,
        maintenance: quoteState.logistics.maintenance,
        notes_indispensable: quoteState.notes.indispensable,
        notes_nice_to_have: quoteState.notes.niceToHave,
        notes_internal: quoteState.notes.internal,
        total_price: calculatedPrice.total,
        monthly_maintenance: calculatedPrice.monthlyMaintenance,
        status: 'draft' as const,
        spec_markdown: null,
        prd_content: null,
      };

      if (savedId) {
        const { error: updateError } = await quotesService.update(savedId, quoteData);
        if (updateError) throw updateError;
      } else {
        const { data, error: createError } = await quotesService.create(quoteData);
        if (createError) throw createError;
        if (data) setSavedId(data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, [wizard, calculatedPrice, savedId]);

  const handlePRDGenerated = async (prdContent: string) => {
    if (savedId) {
      try {
        await quotesService.update(savedId, { prd_content: prdContent });
      } catch (err) {
        console.error('Error saving PRD to quote:', err);
      }
    }
  };

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

  const handleExportTechSpec = async () => {
    setIsExporting(true);
    try {
      const quoteState = wizardStateToQuoteState(wizard);
      await downloadTechSpecPDF(quoteState);
    } catch (err) {
      console.error('Error exporting Tech Spec PDF:', err);
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
            calculatedPrice={calculatedPrice}
            onGeneratePRD={() => setIsPRDWizardOpen(true)}
            onSave={handleSave}
            onExportPDF={handleExportQuote}
            isSaving={isSaving}
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
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-12">
        {/* Success/Error messages */}
        <div className="max-w-[1600px] mx-auto px-4">
          {savedId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <p className="text-green-400 text-sm">Devis sauvegarde (ID: {savedId})</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Chargement des tarifs...</p>
          </div>
        ) : (
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
                  Etape {state.currentStep + 1} / {totalSteps}
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
                isLastStep={state.currentStep === totalSteps - 1}
              />
            </div>

            {/* Right sidebar - price summary (desktop) */}
            <div className="hidden lg:block w-64 flex-shrink-0 px-4">
              <div className="sticky top-24 space-y-4">
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

                  {calculatedPrice.breakdown.length > 0 && (
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
                  )}
                </div>

                {/* Quick actions */}
                <div className="space-y-2">
                  <Button
                    fullWidth
                    size="sm"
                    onClick={handleSave}
                    loading={isSaving}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Sauvegarder
                  </Button>
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
                  <Button
                    fullWidth
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPRDWizardOpen(true)}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Generer PRD
                  </Button>
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
        )}

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
              <Button size="sm" onClick={handleSave} loading={isSaving} icon={<Save className="w-4 h-4" />}>
                Sauvegarder
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
        onPRDGenerated={handlePRDGenerated}
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
