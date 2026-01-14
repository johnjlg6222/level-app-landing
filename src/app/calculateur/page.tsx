'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useCalculatorState, useLeadSubmission, usePriceCalculation } from '@/hooks';
import { ProgressIndicator, Button } from '@/components/common';
import { AmbientBackground, MouseSpotlight, Navigation } from '@/components/landing';
import {
  ScreensStep,
  AppTypeStep,
  AuthStep,
  PaymentsStep,
  FeaturesStep,
  DesignStep,
  ContactStep,
  PriceStep,
  BookingStep,
  ConfirmationStep,
} from '@/components/calculator/steps';
import { stepVariants } from '@/utils/animations';

export default function CalculatorPage() {
  const {
    state,
    currentStep,
    currentStepId,
    direction,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoBack,
    setScreenCount,
    setAppType,
    setAuthLevel,
    setPaymentNeeds,
    toggleFeature,
    setDesign,
    setContact,
    setBooking,
    resetCalculator,
  } = useCalculatorState();

  const { submitLead, isSubmitting } = useLeadSubmission();
  const { price, deliveryWeeks } = usePriceCalculation(state);

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Handle moving to next step with submission logic
  const handleNext = async () => {
    // Submit lead when leaving contact step
    if (currentStepId === 'contact') {
      const leadId = await submitLead(state);
      if (!leadId) {
        // Handle error - stay on current step
        return;
      }
    }

    // Mark as submitted when leaving booking step
    if (currentStepId === 'booking') {
      setIsSubmitted(true);
    }

    goToNextStep();
  };

  // Render current step content
  const renderStep = () => {
    if (isSubmitted) {
      return <ConfirmationStep state={state} onReset={() => {
        resetCalculator();
        setIsSubmitted(false);
      }} />;
    }

    switch (currentStepId) {
      case 'screens':
        return <ScreensStep value={state.screenCount} onChange={setScreenCount} />;
      case 'appType':
        return <AppTypeStep value={state.appType} onChange={setAppType} />;
      case 'auth':
        return <AuthStep value={state.authLevel} onChange={setAuthLevel} />;
      case 'payments':
        return <PaymentsStep value={state.paymentNeeds} onChange={setPaymentNeeds} />;
      case 'features':
        return <FeaturesStep value={state.additionalFeatures} onToggle={toggleFeature} />;
      case 'design':
        return <DesignStep value={state.design} onChange={setDesign} />;
      case 'contact':
        return <ContactStep value={state.contact} onChange={setContact} />;
      case 'price':
        return <PriceStep price={price} deliveryWeeks={deliveryWeeks} />;
      case 'booking':
        return <BookingStep value={state.booking} onChange={setBooking} />;
      default:
        return null;
    }
  };

  // Get button text based on current step
  const getNextButtonText = () => {
    if (isSubmitting) return 'Envoi en cours...';
    if (currentStepId === 'contact') return 'Voir mon estimation';
    if (currentStepId === 'price') return 'Continuer';
    if (currentStepId === 'booking') return 'Terminer';
    return 'Suivant';
  };

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white selection:bg-blue-500 selection:text-white relative">
      <MouseSpotlight />
      <AmbientBackground />

      {/* Navigation */}
      <Navigation currentSection="calculator" />

      {/* Progress indicator */}
      {!isSubmitted && (
        <div className="fixed top-14 md:top-[72px] left-0 right-0 z-40 px-4 py-2">
          <div className="max-w-md mx-auto bg-[#0F1115]/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/5">
            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 pt-32 md:pt-36 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl border border-white/5 min-h-[600px] flex flex-col">
            {/* Step content */}
            <div className="flex-1 p-6 md:p-12 flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={isSubmitted ? 'confirmation' : currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation footer */}
            {!isSubmitted && (
              <div className="p-6 md:p-8 border-t border-white/5 flex justify-between items-center bg-[#0F1115]/40 rounded-b-3xl">
                <Button
                  variant="ghost"
                  onClick={goToPreviousStep}
                  disabled={!canGoBack}
                  icon={<ChevronLeft size={18} />}
                >
                  Retour
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canGoNext || isSubmitting}
                  loading={isSubmitting}
                  icon={<ChevronRight size={18} />}
                  iconPosition="right"
                >
                  {getNextButtonText()}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Price preview (fixed bottom) - only show after contact step */}
      {!isSubmitted && currentStep >= 7 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="bg-[#0F1115]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4">
            <span className="text-gray-400 text-sm">Estimation</span>
            <motion.span
              key={`${price.min}-${price.max}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-bold"
            >
              {price.min.toLocaleString('fr-FR')} - {price.max.toLocaleString('fr-FR')} €
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
