'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { ClosingWizardState, SelectedFeatureDetail } from '@/types/closing-wizard';
import { CLOSING_WIZARD_STEPS } from '@/types/closing-wizard';
import type { PricingFeature, PricingPackWithFeatures } from '@/types/admin-pricing';
import { LOCAL_FEATURES, LOCAL_PACKS } from '@/data/pricing-data';
import { calculateQuotePrice } from '@/lib/pricing-config';
import type { PriceBreakdownItem } from '@/types/calculator';

const STORAGE_KEY = 'closing-wizard-draft';

const initialState: ClosingWizardState = {
  currentStep: 0,
  clientInfo: { company: '', contact: '', email: '', phone: '', sector: '' },
  projectContext: { projectName: '', problemToSolve: '', projectType: '', targetUsers: '' },
  selectedMainPack: null,
  selectedCategoryPacks: [],
  selectedFeatureIds: [],
  packFeatureIds: [],
  design: {
    hasBranding: false,
    style: 'moderne',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    darkMode: false,
    animations: true,
  },
  logistics: { deadline: '', urgency: 'normal', maintenance: 'none' },
  notes: { indispensable: '', niceToHave: '', internal: '' },
  discount: 0,
  extraScreens: {},
};

interface StoredDraft {
  state: ClosingWizardState;
  visitedSteps: number[];
}

function loadFromStorage(): StoredDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Support legacy format (direct state object without visitedSteps wrapper)
    if (parsed && !parsed.state && parsed.clientInfo) {
      return { state: parsed as ClosingWizardState, visitedSteps: [] };
    }
    return parsed as StoredDraft;
  } catch {
    return null;
  }
}

export interface CalculatedPrice {
  subtotal: number;
  discount: number;
  urgencyMultiplier: number;
  total: number;
  monthlyMaintenance: number;
  breakdown: PriceBreakdownItem[];
}

export interface UseClosingWizardReturn {
  state: ClosingWizardState;
  // Local data
  allFeatures: PricingFeature[];
  allPacks: PricingPackWithFeatures[];
  isLoading: boolean;
  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  // Setters
  setClientInfo: (info: Partial<ClosingWizardState['clientInfo']>) => void;
  setProjectContext: (ctx: Partial<ClosingWizardState['projectContext']>) => void;
  selectMainPack: (packId: string | null) => void;
  toggleCategoryPack: (packId: string) => void;
  toggleFeature: (featureId: string) => void;
  setDesign: (d: Partial<ClosingWizardState['design']>) => void;
  setLogistics: (l: Partial<ClosingWizardState['logistics']>) => void;
  setNotes: (n: Partial<ClosingWizardState['notes']>) => void;
  setDiscount: (d: number) => void;
  // Computed
  calculatedPrice: CalculatedPrice;
  selectedFeatureDetails: SelectedFeatureDetail[];
  completedSteps: Set<number>;
  visitedSteps: Set<number>;
  featuresForCategory: (category: string) => PricingFeature[];
  packFeatureNames: Map<string, string>; // featureId -> pack name
  // Actions
  resetForm: () => void;
}

export function useClosingWizard(): UseClosingWizardReturn {
  const stored = useRef(loadFromStorage());
  const [state, setState] = useState<ClosingWizardState>(() => stored.current?.state || initialState);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    () => new Set(stored.current?.visitedSteps.length ? stored.current.visitedSteps : [0])
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local data — no loading needed
  const allFeatures = LOCAL_FEATURES;
  const allPacks = LOCAL_PACKS;
  const isLoading = false;

  // Persist state + visitedSteps to localStorage (debounced)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const draft: StoredDraft = { state, visitedSteps: Array.from(visitedSteps) };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch { /* quota exceeded - ignore */ }
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state, visitedSteps]);

  // Navigation
  const totalSteps = CLOSING_WIZARD_STEPS.length;

  const goToStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(totalSteps - 1, step));
    setState(prev => ({ ...prev, currentStep: clamped }));
    setVisitedSteps(prev => new Set(prev).add(clamped));
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    setState(prev => {
      const next = Math.min(totalSteps - 1, prev.currentStep + 1);
      setVisitedSteps(vs => new Set(vs).add(next));
      return { ...prev, currentStep: next };
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setState(prev => {
      const next = Math.max(0, prev.currentStep - 1);
      setVisitedSteps(vs => new Set(vs).add(next));
      return { ...prev, currentStep: next };
    });
  }, []);

  // Setters
  const setClientInfo = useCallback((info: Partial<ClosingWizardState['clientInfo']>) => {
    setState(prev => ({ ...prev, clientInfo: { ...prev.clientInfo, ...info } }));
  }, []);

  const setProjectContext = useCallback((ctx: Partial<ClosingWizardState['projectContext']>) => {
    setState(prev => ({ ...prev, projectContext: { ...prev.projectContext, ...ctx } }));
  }, []);

  const setDesign = useCallback((d: Partial<ClosingWizardState['design']>) => {
    setState(prev => ({ ...prev, design: { ...prev.design, ...d } }));
  }, []);

  const setLogistics = useCallback((l: Partial<ClosingWizardState['logistics']>) => {
    setState(prev => ({ ...prev, logistics: { ...prev.logistics, ...l } }));
  }, []);

  const setNotes = useCallback((n: Partial<ClosingWizardState['notes']>) => {
    setState(prev => ({ ...prev, notes: { ...prev.notes, ...n } }));
  }, []);

  const setDiscount = useCallback((d: number) => {
    setState(prev => ({ ...prev, discount: Math.max(0, Math.min(100, d)) }));
  }, []);

  // Compute pack feature IDs (features auto-included from selected packs)
  const computePackFeatureIds = useCallback((
    mainPackId: string | null,
    categoryPackIds: string[],
    packs: PricingPackWithFeatures[]
  ): string[] => {
    const featureIds = new Set<string>();
    const packIds = [...categoryPackIds];
    if (mainPackId) packIds.push(mainPackId);

    // For main packs, also include features from cumulative parent packs
    const resolvePackChain = (packId: string): string[] => {
      const pack = packs.find(p => p.id === packId);
      if (!pack) return [];
      const ids = pack.features.map(f => f.id);
      if (pack.includes_pack_id) {
        ids.push(...resolvePackChain(pack.includes_pack_id));
      }
      return ids;
    };

    for (const pid of packIds) {
      const chainIds = resolvePackChain(pid);
      chainIds.forEach(id => featureIds.add(id));
    }

    return Array.from(featureIds);
  }, []);

  // Select main pack
  const selectMainPack = useCallback((packId: string | null) => {
    setState(prev => {
      const newPackFeatureIds = computePackFeatureIds(packId, prev.selectedCategoryPacks, allPacks);
      return {
        ...prev,
        selectedMainPack: packId,
        packFeatureIds: newPackFeatureIds,
      };
    });
  }, [allPacks, computePackFeatureIds]);

  // Toggle category pack
  const toggleCategoryPack = useCallback((packId: string) => {
    setState(prev => {
      const isSelected = prev.selectedCategoryPacks.includes(packId);
      const newCategoryPacks = isSelected
        ? prev.selectedCategoryPacks.filter(id => id !== packId)
        : [...prev.selectedCategoryPacks, packId];
      const newPackFeatureIds = computePackFeatureIds(prev.selectedMainPack, newCategoryPacks, allPacks);
      return {
        ...prev,
        selectedCategoryPacks: newCategoryPacks,
        packFeatureIds: newPackFeatureIds,
      };
    });
  }, [allPacks, computePackFeatureIds]);

  // Toggle individual feature (a-la-carte)
  const toggleFeature = useCallback((featureId: string) => {
    setState(prev => ({
      ...prev,
      selectedFeatureIds: prev.selectedFeatureIds.includes(featureId)
        ? prev.selectedFeatureIds.filter(id => id !== featureId)
        : [...prev.selectedFeatureIds, featureId],
    }));
  }, []);

  // Map of featureId -> pack name (for "Inclus dans Pack X" badges)
  const packFeatureNames = useMemo(() => {
    const map = new Map<string, string>();

    // Check category packs first
    for (const packId of state.selectedCategoryPacks) {
      const pack = allPacks.find(p => p.id === packId);
      if (pack) {
        pack.features.forEach(f => {
          if (!map.has(f.id)) map.set(f.id, pack.name);
        });
      }
    }

    // Check main pack (and its chain)
    if (state.selectedMainPack) {
      const resolveChain = (pid: string) => {
        const pack = allPacks.find(p => p.id === pid);
        if (!pack) return;
        pack.features.forEach(f => {
          if (!map.has(f.id)) map.set(f.id, pack.name);
        });
        if (pack.includes_pack_id) resolveChain(pack.includes_pack_id);
      };
      resolveChain(state.selectedMainPack);
    }

    return map;
  }, [state.selectedMainPack, state.selectedCategoryPacks, allPacks]);

  // Features for a specific category
  const featuresForCategory = useCallback((category: string) => {
    return allFeatures.filter(f => f.category === category && f.is_active);
  }, [allFeatures]);

  // All unique feature IDs (deduplicated: pack features + manual selections)
  const allSelectedFeatureIds = useMemo(() => {
    const set = new Set([...state.packFeatureIds, ...state.selectedFeatureIds]);
    return Array.from(set);
  }, [state.packFeatureIds, state.selectedFeatureIds]);

  // A-la-carte feature IDs (only manually selected, NOT in any pack)
  const aLaCarteFeatureIds = useMemo(() => {
    return state.selectedFeatureIds.filter(id => !state.packFeatureIds.includes(id));
  }, [state.selectedFeatureIds, state.packFeatureIds]);

  // Calculate price (synchronous, local-only)
  const calculatedPrice = useMemo(() => {
    const selectedPackIds: string[] = [...state.selectedCategoryPacks];
    if (state.selectedMainPack) selectedPackIds.push(state.selectedMainPack);

    return calculateQuotePrice({
      selectedPlan: '',
      selectedPacks: selectedPackIds,
      selectedFeatures: aLaCarteFeatureIds,
      extraScreens: state.extraScreens,
      discount: state.discount,
      urgency: state.logistics.urgency,
      maintenance: state.logistics.maintenance,
    });
  }, [state.selectedMainPack, state.selectedCategoryPacks, aLaCarteFeatureIds, state.extraScreens, state.discount, state.logistics.urgency, state.logistics.maintenance]);

  // Selected feature details for PRD
  const selectedFeatureDetails = useMemo((): SelectedFeatureDetail[] => {
    const featMap = new Map(allFeatures.map(f => [f.id, f]));
    return allSelectedFeatureIds.map(id => {
      const f = featMap.get(id);
      if (!f) return null;
      return {
        featureId: f.id,
        featureName: f.name,
        category: f.category,
        price: f.final_price,
        fromPack: packFeatureNames.get(id) || null,
      };
    }).filter(Boolean) as SelectedFeatureDetail[];
  }, [allSelectedFeatureIds, allFeatures, packFeatureNames]);

  // Completed steps tracking (13 category steps: indices 3-15)
  const completedSteps = useMemo(() => {
    const completed = new Set<number>();

    // Step 0: Client - completed if company is filled
    if (state.clientInfo.company.trim()) completed.add(0);
    // Step 1: Project - completed if project name is filled
    if (state.projectContext.projectName.trim()) completed.add(1);
    // Step 2: Packs - completed if any pack selected
    if (state.selectedMainPack || state.selectedCategoryPacks.length > 0) completed.add(2);
    // Steps 3-15: Category steps - completed if any feature selected in that category
    for (let i = 3; i <= 15; i++) {
      const step = CLOSING_WIZARD_STEPS[i];
      if (step?.category) {
        const catFeatures = allFeatures.filter(f => f.category === step.category);
        const hasSelected = catFeatures.some(f =>
          state.selectedFeatureIds.includes(f.id) || state.packFeatureIds.includes(f.id)
        );
        if (hasSelected) completed.add(i);
      }
    }
    // Step 16: Design - completed if visited AND any value differs from defaults
    if (visitedSteps.has(16) && (
      state.design.style !== 'moderne' ||
      state.design.hasBranding !== false ||
      state.design.primaryColor !== '#3B82F6' ||
      state.design.secondaryColor !== '#1E40AF'
    )) completed.add(16);
    // Step 17: Logistics - completed if any non-default value set
    if (
      state.logistics.deadline ||
      state.logistics.urgency !== 'normal' ||
      state.logistics.maintenance !== 'none'
    ) completed.add(17);
    // Step 18: Notes - completed if any note field has content
    if (
      state.notes.indispensable.trim() ||
      state.notes.niceToHave.trim() ||
      state.notes.internal.trim()
    ) completed.add(18);

    return completed;
  }, [state, allFeatures, visitedSteps]);

  const resetForm = useCallback(() => {
    setState(initialState);
    setVisitedSteps(new Set([0]));
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return {
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
    visitedSteps,
    featuresForCategory,
    packFeatureNames,
    resetForm,
  };
}
