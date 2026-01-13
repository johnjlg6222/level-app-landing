'use client';

import { useState, useCallback, useMemo } from 'react';
import { QuoteData } from '@/types/leads';
import { calculateQuotePrice } from '@/lib/pricing-config';
import { quotesService } from '@/lib/supabase';

export interface QuoteFormState {
  // Client info
  clientInfo: {
    company: string;
    contact: string;
    email: string;
    phone: string;
    sector: string;
  };

  // Project context
  projectContext: {
    projectName: string;
    problemToSolve: string;
    projectType: string;
    targetUsers: string;
  };

  // Plan selection
  selectedPlan: 'starter' | 'business' | 'premium';
  selectedPacks: string[];
  extraScreens: Record<string, number>;
  discount: number;

  // Features
  simpleFeatures: {
    auth: { enabled: boolean; level: string };
    payments: { enabled: boolean; type: string };
    data: { enabled: boolean; complexity: string };
    dashboard: { enabled: boolean; charts: boolean };
    notifications: { enabled: boolean; types: string[] };
    calendar: { enabled: boolean };
    integrations: { enabled: boolean; list: string[] };
  };
  advancedFeatures: string[];
  selectedFeatures: string[];

  // Design
  design: {
    hasBranding: boolean;
    style: string;
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    animations: boolean;
  };

  // Logistics
  logistics: {
    deadline: string;
    urgency: string;
    maintenance: string;
  };

  // Notes
  notes: {
    indispensable: string;
    niceToHave: string;
    internal: string;
  };
}

const initialState: QuoteFormState = {
  clientInfo: {
    company: '',
    contact: '',
    email: '',
    phone: '',
    sector: '',
  },
  projectContext: {
    projectName: '',
    problemToSolve: '',
    projectType: '',
    targetUsers: '',
  },
  selectedPlan: 'starter',
  selectedPacks: [],
  extraScreens: {},
  discount: 0,
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
  selectedFeatures: [],
  design: {
    hasBranding: false,
    style: 'modern',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    darkMode: false,
    animations: true,
  },
  logistics: {
    deadline: '',
    urgency: 'normal',
    maintenance: 'none',
  },
  notes: {
    indispensable: '',
    niceToHave: '',
    internal: '',
  },
};

export function useQuoteForm() {
  const [state, setState] = useState<QuoteFormState>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update client info
  const setClientInfo = useCallback((info: Partial<QuoteFormState['clientInfo']>) => {
    setState((prev) => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, ...info },
    }));
  }, []);

  // Update project context
  const setProjectContext = useCallback((context: Partial<QuoteFormState['projectContext']>) => {
    setState((prev) => ({
      ...prev,
      projectContext: { ...prev.projectContext, ...context },
    }));
  }, []);

  // Set selected plan
  const setSelectedPlan = useCallback((plan: QuoteFormState['selectedPlan']) => {
    setState((prev) => ({ ...prev, selectedPlan: plan }));
  }, []);

  // Toggle pack selection
  const togglePack = useCallback((packId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPacks: prev.selectedPacks.includes(packId)
        ? prev.selectedPacks.filter((p) => p !== packId)
        : [...prev.selectedPacks, packId],
    }));
  }, []);

  // Set extra screens
  const setExtraScreens = useCallback((screens: Record<string, number>) => {
    setState((prev) => ({ ...prev, extraScreens: screens }));
  }, []);

  // Set discount
  const setDiscount = useCallback((discount: number) => {
    setState((prev) => ({ ...prev, discount: Math.max(0, Math.min(100, discount)) }));
  }, []);

  // Update simple features
  const setSimpleFeature = useCallback(
    <K extends keyof QuoteFormState['simpleFeatures']>(
      feature: K,
      value: Partial<QuoteFormState['simpleFeatures'][K]>
    ) => {
      setState((prev) => ({
        ...prev,
        simpleFeatures: {
          ...prev.simpleFeatures,
          [feature]: { ...prev.simpleFeatures[feature], ...value },
        },
      }));
    },
    []
  );

  // Toggle advanced feature
  const toggleAdvancedFeature = useCallback((feature: string) => {
    setState((prev) => ({
      ...prev,
      advancedFeatures: prev.advancedFeatures.includes(feature)
        ? prev.advancedFeatures.filter((f) => f !== feature)
        : [...prev.advancedFeatures, feature],
    }));
  }, []);

  // Toggle selected feature
  const toggleSelectedFeature = useCallback((feature: string) => {
    setState((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }));
  }, []);

  // Update design
  const setDesign = useCallback((design: Partial<QuoteFormState['design']>) => {
    setState((prev) => ({
      ...prev,
      design: { ...prev.design, ...design },
    }));
  }, []);

  // Update logistics
  const setLogistics = useCallback((logistics: Partial<QuoteFormState['logistics']>) => {
    setState((prev) => ({
      ...prev,
      logistics: { ...prev.logistics, ...logistics },
    }));
  }, []);

  // Update notes
  const setNotes = useCallback((notes: Partial<QuoteFormState['notes']>) => {
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, ...notes },
    }));
  }, []);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    return calculateQuotePrice({
      selectedPlan: state.selectedPlan,
      selectedPacks: state.selectedPacks,
      selectedFeatures: state.selectedFeatures,
      extraScreens: state.extraScreens,
      discount: state.discount,
      urgency: state.logistics.urgency,
      maintenance: state.logistics.maintenance,
    });
  }, [state]);

  // Convert form state to QuoteData for database
  const toQuoteData = useCallback((): Omit<QuoteData, 'id' | 'created_at' | 'updated_at'> => {
    return {
      client_company: state.clientInfo.company,
      client_contact: state.clientInfo.contact,
      client_email: state.clientInfo.email,
      client_phone: state.clientInfo.phone,
      client_sector: state.clientInfo.sector,
      project_name: state.projectContext.projectName,
      problem_to_solve: state.projectContext.problemToSolve,
      project_type: state.projectContext.projectType,
      target_users: state.projectContext.targetUsers,
      simple_features: state.simpleFeatures,
      advanced_features: state.advancedFeatures,
      selected_features: state.selectedFeatures,
      selected_plan: state.selectedPlan,
      selected_packs: state.selectedPacks,
      extra_screens: state.extraScreens,
      discount: state.discount,
      design_has_branding: state.design.hasBranding,
      design_style: state.design.style,
      design_primary_color: state.design.primaryColor,
      design_secondary_color: state.design.secondaryColor,
      design_dark_mode: state.design.darkMode,
      design_animations: state.design.animations,
      deadline: state.logistics.deadline,
      urgency: state.logistics.urgency,
      maintenance: state.logistics.maintenance,
      notes_indispensable: state.notes.indispensable,
      notes_nice_to_have: state.notes.niceToHave,
      notes_internal: state.notes.internal,
      total_price: calculatedPrice.total,
      monthly_maintenance: calculatedPrice.monthlyMaintenance,
      status: 'draft',
      spec_markdown: null,
      prd_content: null,
    };
  }, [state, calculatedPrice]);

  // Save quote
  const saveQuote = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const quoteData = toQuoteData();

      if (savedId) {
        // Update existing quote
        const { data, error: updateError } = await quotesService.update(savedId, quoteData);
        if (updateError) throw updateError;
        return data;
      } else {
        // Create new quote
        const { data, error: createError } = await quotesService.create(quoteData);
        if (createError) throw createError;
        if (data) {
          setSavedId(data.id);
        }
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [savedId, toQuoteData]);

  // Reset form
  const resetForm = useCallback(() => {
    setState(initialState);
    setSavedId(null);
    setError(null);
  }, []);

  return {
    state,
    calculatedPrice,
    isSaving,
    savedId,
    error,
    setClientInfo,
    setProjectContext,
    setSelectedPlan,
    togglePack,
    setExtraScreens,
    setDiscount,
    setSimpleFeature,
    toggleAdvancedFeature,
    toggleSelectedFeature,
    setDesign,
    setLogistics,
    setNotes,
    saveQuote,
    resetForm,
    toQuoteData,
  };
}
