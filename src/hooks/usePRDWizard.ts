'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  PRDWizardState,
  PRDWizardStepId,
  PRDAnswer,
  PRDQuestion,
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  GeneratePRDRequest,
  GeneratePRDResponse,
} from '@/types/prd';

const STORAGE_KEY = 'prd-wizard-draft';
const STORAGE_HASH_KEY = 'prd-wizard-quote-hash';
const FETCH_TIMEOUT_MS = 120_000; // 2 minutes

// Simple hash for detecting quote data changes
function hashQuoteData(data: GenerateQuestionsRequest): string {
  const str = JSON.stringify({
    c: data.clientInfo.company,
    p: data.projectContext.projectName,
    pl: data.selectedPlan,
    pk: data.selectedPacks.sort(),
    f: data.selectedFeatures?.map(f => f.featureId).sort(),
  });
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export interface UsePRDWizardReturn {
  state: PRDWizardState;
  startWizard: (quoteData: GenerateQuestionsRequest, forceRefresh?: boolean) => Promise<void>;
  setAnswer: (questionId: string, answer: string) => void;
  acceptSuggestion: (questionId: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  getStepProgress: (stepId: PRDWizardStepId) => { answered: number; total: number; percentage: number };
  getTotalProgress: () => { answered: number; total: number; percentage: number };
  canGenerate: () => boolean;
  generatePRD: (quoteData: GenerateQuestionsRequest) => Promise<void>;
  cancelGeneration: () => void;
  retryLastAction: () => void;
  clearPRD: () => void;
  reset: () => void;
}

const initialState: PRDWizardState = {
  currentStep: 0,
  questions: [],
  answers: {},
  isGeneratingQuestions: false,
  isGeneratingPRD: false,
  isCancelling: false,
  generatedPRD: null,
  error: null,
};

// --- localStorage helpers ---

function loadDraft(): Partial<PRDWizardState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Only restore questions, answers, generatedPRD, currentStep
    return {
      questions: parsed.questions ?? [],
      answers: parsed.answers ?? {},
      generatedPRD: parsed.generatedPRD ?? null,
      currentStep: parsed.currentStep ?? 0,
    };
  } catch {
    return null;
  }
}

function saveDraft(state: PRDWizardState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        questions: state.questions,
        answers: state.answers,
        generatedPRD: state.generatedPRD,
        currentStep: state.currentStep,
      })
    );
  } catch {
    // localStorage full or unavailable - silently ignore
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function usePRDWizard(): UsePRDWizardReturn {
  const [state, setState] = useState<PRDWizardState>(initialState);
  const abortRef = useRef<AbortController | null>(null);
  const lastActionRef = useRef<{ type: 'questions' | 'prd'; quoteData: GenerateQuestionsRequest } | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.questions && draft.questions.length > 0) {
      setState((prev) => ({
        ...prev,
        questions: draft.questions!,
        answers: draft.answers ?? {},
        generatedPRD: draft.generatedPRD ?? null,
        currentStep: draft.currentStep ?? 0,
      }));
    }
  }, []);

  // Auto-save to localStorage on relevant state changes
  useEffect(() => {
    if (state.questions.length > 0) {
      saveDraft(state);
    }
  }, [state.questions, state.answers, state.generatedPRD, state.currentStep]);

  const cancelGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isGeneratingQuestions: false,
      isGeneratingPRD: false,
      isCancelling: false,
      error: 'Generation annulee.',
    }));
  }, []);

  const startWizard = useCallback(async (quoteData: GenerateQuestionsRequest, forceRefresh = false) => {
    // Check if quote data has changed since last draft
    const currentHash = hashQuoteData(quoteData);
    const storedHash = (() => { try { return localStorage.getItem(STORAGE_HASH_KEY); } catch { return null; } })();

    // If we have a valid draft with matching hash and not forcing refresh, skip API call
    if (!forceRefresh && storedHash === currentHash) {
      const draft = loadDraft();
      if (draft && draft.questions && draft.questions.length > 0) {
        setState((prev) => ({
          ...prev,
          questions: draft.questions!,
          answers: draft.answers ?? {},
          generatedPRD: draft.generatedPRD ?? null,
          currentStep: draft.currentStep ?? 0,
        }));
        return;
      }
    }

    // Clear stale draft if hash changed
    if (storedHash !== currentHash) {
      clearDraft();
      try { localStorage.setItem(STORAGE_HASH_KEY, currentHash); } catch { /* ignore */ }
    }

    setState((prev) => ({ ...prev, isGeneratingQuestions: true, error: null, isCancelling: false, questions: [], answers: {}, generatedPRD: null }));
    lastActionRef.current = { type: 'questions', quoteData };

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch('/api/admin/prd/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Erreur HTTP ${res.status}` }));
        throw new Error(errorData.error || `Erreur serveur (${res.status})`);
      }

      const data: GenerateQuestionsResponse = await res.json();

      if (!data.questions || data.questions.length === 0) {
        throw new Error('L\'IA n\'a genere aucune question. Verifiez que le devis contient suffisamment d\'informations.');
      }

      setState((prev) => ({
        ...prev,
        questions: data.questions,
        isGeneratingQuestions: false,
        currentStep: 0,
      }));
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        setState((prev) => ({
          ...prev,
          isGeneratingQuestions: false,
          isCancelling: false,
          error: 'Generation annulee ou delai depasse (2 min). Reessayez.',
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isGeneratingQuestions: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        }));
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: { questionId, answer, isAISuggested: false },
      },
    }));
  }, []);

  const acceptSuggestion = useCallback((questionId: string) => {
    setState((prev) => {
      const question = prev.questions.find((q) => q.id === questionId);
      if (!question?.suggestedAnswer) return prev;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            questionId,
            answer: question.suggestedAnswer,
            isAISuggested: true,
          },
        },
      };
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(3, step)),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(3, prev.currentStep + 1),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const getStepProgress = useCallback(
    (stepId: PRDWizardStepId) => {
      const stepQuestions = state.questions.filter((q) => q.stepId === stepId);
      const answered = stepQuestions.filter((q) => state.answers[q.id]?.answer).length;
      const total = stepQuestions.length;
      const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
      return { answered, total, percentage };
    },
    [state.questions, state.answers]
  );

  const getTotalProgress = useCallback(() => {
    const total = state.questions.length;
    const answered = state.questions.filter((q) => state.answers[q.id]?.answer).length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { answered, total, percentage };
  }, [state.questions, state.answers]);

  const canGenerate = useCallback(() => {
    const { percentage } = getTotalProgress();
    return percentage >= 70;
  }, [getTotalProgress]);

  const generatePRD = useCallback(
    async (quoteData: GenerateQuestionsRequest) => {
      // Prevent double-click
      if (state.isGeneratingPRD) return;

      setState((prev) => ({ ...prev, isGeneratingPRD: true, error: null, isCancelling: false }));
      lastActionRef.current = { type: 'prd', quoteData };

      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      try {
        const answersArray: PRDAnswer[] = Object.values(state.answers).filter(
          (a) => a.answer.trim() !== ''
        );

        const requestBody: GeneratePRDRequest = {
          quoteData,
          answers: answersArray,
          questions: state.questions, // Send full questions so AI gets question text
        };

        const res = await fetch('/api/admin/prd/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Erreur HTTP ${res.status}` }));
          throw new Error(errorData.error || `Erreur serveur (${res.status})`);
        }

        const data: GeneratePRDResponse = await res.json();

        if (!data.prdContent || data.prdContent.trim().length < 100) {
          throw new Error('Le PRD genere est trop court ou vide. Reessayez.');
        }

        setState((prev) => ({
          ...prev,
          generatedPRD: data.prdContent,
          isGeneratingPRD: false,
        }));
      } catch (error) {
        clearTimeout(timeoutId);
        if ((error as Error).name === 'AbortError') {
          setState((prev) => ({
            ...prev,
            isGeneratingPRD: false,
            isCancelling: false,
            error: 'Generation annulee ou delai depasse (2 min). Reessayez.',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isGeneratingPRD: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
          }));
        }
      } finally {
        abortRef.current = null;
      }
    },
    [state.answers, state.questions, state.isGeneratingPRD]
  );

  const retryLastAction = useCallback(() => {
    const last = lastActionRef.current;
    if (!last) return;
    setState((prev) => ({ ...prev, error: null }));
    if (last.type === 'questions') {
      startWizard(last.quoteData);
    } else {
      generatePRD(last.quoteData);
    }
  }, [startWizard, generatePRD]);

  const clearPRD = useCallback(() => {
    setState((prev) => ({ ...prev, generatedPRD: null, currentStep: 0 }));
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState(initialState);
    clearDraft();
    try { localStorage.removeItem(STORAGE_HASH_KEY); } catch { /* ignore */ }
    lastActionRef.current = null;
  }, []);

  return {
    state,
    startWizard,
    setAnswer,
    acceptSuggestion,
    goToStep,
    nextStep,
    prevStep,
    getStepProgress,
    getTotalProgress,
    canGenerate,
    generatePRD,
    cancelGeneration,
    retryLastAction,
    clearPRD,
    reset,
  };
}
