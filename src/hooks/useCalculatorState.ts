'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  CalculatorState,
  INITIAL_CALCULATOR_STATE,
  CalculatorStep,
  CALCULATOR_STEPS,
  AppType,
  AuthLevel,
  PaymentNeeds,
  DesignPreferences,
  ContactInfo,
  BookingInfo,
} from '@/types/calculator';
import { calculatePrice } from '@/lib/pricing-config';

export type AnimationDirection = 1 | -1;

export interface UseCalculatorStateReturn {
  // State
  state: CalculatorState;
  currentStep: number;
  currentStepId: CalculatorStep;
  direction: AnimationDirection;
  totalSteps: number;

  // Navigation
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  isSummaryStep: boolean;

  // Setters
  setScreenCount: (count: number) => void;
  setAppType: (type: AppType) => void;
  setAuthLevel: (level: AuthLevel) => void;
  setPaymentNeeds: (needs: PaymentNeeds) => void;
  toggleFeature: (featureId: string) => void;
  setDesign: (design: DesignPreferences) => void;
  setContact: (contact: ContactInfo) => void;
  setBooking: (booking: BookingInfo) => void;

  // Validation
  isStepValid: (step: number) => boolean;
  validateCurrentStep: () => boolean;

  // Reset
  resetCalculator: () => void;
}

const TOTAL_STEPS = CALCULATOR_STEPS.length - 1; // Exclude confirmation step from regular flow

export function useCalculatorState(): UseCalculatorStateReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<AnimationDirection>(1);

  // Current step info
  const currentStepId = CALCULATOR_STEPS[currentStep]?.id || 'screens';
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isSummaryStep = currentStepId === 'confirmation';

  // Recalculate price whenever state changes
  const updatePrice = useCallback((newState: CalculatorState) => {
    const calculatedPrice = calculatePrice(newState);
    return { ...newState, calculatedPrice };
  }, []);

  // Navigation
  const goToNextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step <= TOTAL_STEPS) {
        setDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  // Setters
  const setScreenCount = useCallback(
    (count: number) => {
      setState((prev) => updatePrice({ ...prev, screenCount: count }));
    },
    [updatePrice]
  );

  const setAppType = useCallback(
    (type: AppType) => {
      setState((prev) => updatePrice({ ...prev, appType: type }));
    },
    [updatePrice]
  );

  const setAuthLevel = useCallback(
    (level: AuthLevel) => {
      setState((prev) => updatePrice({ ...prev, authLevel: level }));
    },
    [updatePrice]
  );

  const setPaymentNeeds = useCallback(
    (needs: PaymentNeeds) => {
      setState((prev) => updatePrice({ ...prev, paymentNeeds: needs }));
    },
    [updatePrice]
  );

  const toggleFeature = useCallback(
    (featureId: string) => {
      setState((prev) => {
        const newFeatures = prev.additionalFeatures.includes(featureId)
          ? prev.additionalFeatures.filter((f) => f !== featureId)
          : [...prev.additionalFeatures, featureId];
        return updatePrice({ ...prev, additionalFeatures: newFeatures });
      });
    },
    [updatePrice]
  );

  const setDesign = useCallback(
    (design: DesignPreferences) => {
      setState((prev) => updatePrice({ ...prev, design }));
    },
    [updatePrice]
  );

  const setContact = useCallback((contact: ContactInfo) => {
    setState((prev) => ({ ...prev, contact }));
  }, []);

  const setBooking = useCallback((booking: BookingInfo) => {
    setState((prev) => ({ ...prev, booking }));
  }, []);

  // Validation
  const isStepValid = useCallback(
    (step: number): boolean => {
      const stepId = CALCULATOR_STEPS[step]?.id;

      switch (stepId) {
        case 'screens':
          return state.screenCount >= 3 && state.screenCount <= 30;
        case 'appType':
          return !!state.appType;
        case 'auth':
          return !!state.authLevel;
        case 'payments':
          return !!state.paymentNeeds;
        case 'features':
          return true; // Optional step
        case 'design':
          return !!state.design.style;
        case 'contact':
          return (
            !!state.contact.email &&
            !!state.contact.name &&
            !!state.contact.phone
          );
        case 'price':
          return true; // Display only
        case 'booking':
          return true; // Optional step
        default:
          return true;
      }
    },
    [state]
  );

  const validateCurrentStep = useCallback(() => {
    return isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  // Navigation guards
  const canGoNext = useMemo(() => {
    return currentStep < TOTAL_STEPS && isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  const canGoBack = currentStep > 0;

  // Reset
  const resetCalculator = useCallback(() => {
    setState(INITIAL_CALCULATOR_STATE);
    setCurrentStep(0);
    setDirection(1);
  }, []);

  return {
    state,
    currentStep,
    currentStepId,
    direction,
    totalSteps: TOTAL_STEPS,

    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoNext,
    canGoBack,
    isLastStep,
    isSummaryStep,

    setScreenCount,
    setAppType,
    setAuthLevel,
    setPaymentNeeds,
    toggleFeature,
    setDesign,
    setContact,
    setBooking,

    isStepValid,
    validateCurrentStep,

    resetCalculator,
  };
}

export default useCalculatorState;
