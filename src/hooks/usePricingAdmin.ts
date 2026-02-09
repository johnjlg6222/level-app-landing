'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  PricingFeature,
  PricingFeatureInput,
  PricingFeatureUpdate,
  PricingPackWithFeatures,
  PricingPackInput,
  PricingPackUpdate,
  PricingConfig,
  PricingConfigUpdate,
  GroupedFeatures,
} from '@/types/admin-pricing';

export interface UsePricingAdminReturn {
  features: PricingFeature[];
  groupedFeatures: GroupedFeatures;
  packs: PricingPackWithFeatures[];
  config: PricingConfig[];
  isLoading: boolean;
  error: string | null;
  // Features
  fetchFeatures: () => Promise<void>;
  createFeature: (input: PricingFeatureInput) => Promise<void>;
  updateFeature: (id: string, input: PricingFeatureUpdate) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  // Packs
  fetchPacks: () => Promise<void>;
  createPack: (input: PricingPackInput & { feature_ids?: string[] }) => Promise<void>;
  updatePack: (id: string, input: PricingPackUpdate & { feature_ids?: string[] }) => Promise<void>;
  deletePack: (id: string) => Promise<void>;
  // Config
  fetchConfig: () => Promise<void>;
  updateConfig: (input: PricingConfigUpdate) => Promise<void>;
}

export function usePricingAdmin(): UsePricingAdminReturn {
  const [features, setFeatures] = useState<PricingFeature[]>([]);
  const [packs, setPacks] = useState<PricingPackWithFeatures[]>([]);
  const [config, setConfig] = useState<PricingConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group features by category
  const groupedFeatures: GroupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as GroupedFeatures);

  // --- Features ---

  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/features');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch features');
      setFeatures(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch features');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFeature = useCallback(async (input: PricingFeatureInput) => {
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create feature');
      setFeatures((prev) => [...prev, result.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature');
      throw err;
    }
  }, []);

  const updateFeature = useCallback(async (id: string, input: PricingFeatureUpdate) => {
    setError(null);
    try {
      const response = await fetch(`/api/admin/pricing/features/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update feature');
      setFeatures((prev) => prev.map((f) => (f.id === id ? result.data : f)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature');
      throw err;
    }
  }, []);

  const deleteFeature = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`/api/admin/pricing/features/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete feature');
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feature');
      throw err;
    }
  }, []);

  // --- Packs ---

  const fetchPacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/packs');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch packs');
      setPacks(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch packs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPack = useCallback(async (input: PricingPackInput & { feature_ids?: string[] }) => {
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create pack');
      setPacks((prev) => [...prev, result.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pack');
      throw err;
    }
  }, []);

  const updatePack = useCallback(async (id: string, input: PricingPackUpdate & { feature_ids?: string[] }) => {
    setError(null);
    try {
      const response = await fetch(`/api/admin/pricing/packs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update pack');
      // Refresh packs to get updated features
      await fetchPacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pack');
      throw err;
    }
  }, [fetchPacks]);

  const deletePack = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`/api/admin/pricing/packs/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete pack');
      setPacks((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pack');
      throw err;
    }
  }, []);

  // --- Config ---

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/config');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch config');
      setConfig(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch config');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (input: PricingConfigUpdate) => {
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update config');
      setConfig((prev) => {
        const exists = prev.find((c) => c.key === input.key);
        if (exists) {
          return prev.map((c) => (c.key === input.key ? result.data : c));
        }
        return [...prev, result.data];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
      throw err;
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    fetchFeatures();
    fetchPacks();
    fetchConfig();
  }, [fetchFeatures, fetchPacks, fetchConfig]);

  return {
    features,
    groupedFeatures,
    packs,
    config,
    isLoading,
    error,
    fetchFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
    fetchPacks,
    createPack,
    updatePack,
    deletePack,
    fetchConfig,
    updateConfig,
  };
}
