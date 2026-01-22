'use client';

import { useState, useCallback, useEffect } from 'react';
import type { KnowledgeEntry, KnowledgeSection, KnowledgeContent } from '@/types/knowledge';

export interface UseKnowledgeReturn {
  entries: KnowledgeEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  updateEntry: (section: KnowledgeSection, updates: Partial<KnowledgeEntry>) => Promise<void>;
  createEntry: (entry: Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteEntry: (section: KnowledgeSection) => Promise<void>;
  importData: () => Promise<{ success: boolean; message: string }>;
  previewPrompt: () => Promise<{ prompt: string; estimatedTokens: number } | null>;
}

export function useKnowledge(): UseKnowledgeReturn {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/knowledge');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch knowledge');
      }

      setEntries(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch knowledge';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEntry = useCallback(async (
    section: KnowledgeSection,
    updates: Partial<KnowledgeEntry>
  ) => {
    setError(null);

    try {
      const response = await fetch(`/api/admin/knowledge/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update knowledge');
      }

      // Update local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.section === section ? { ...entry, ...result.data } : entry
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update knowledge';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const createEntry = useCallback(async (
    entry: Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setError(null);

    try {
      const response = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create knowledge');
      }

      // Add to local state
      setEntries((prev) => [...prev, result.data]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create knowledge';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (section: KnowledgeSection) => {
    setError(null);

    try {
      const response = await fetch(`/api/admin/knowledge/${section}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete knowledge');
      }

      // Remove from local state
      setEntries((prev) => prev.filter((entry) => entry.section !== section));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete knowledge';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const importData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/knowledge/import', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import data');
      }

      // Refresh entries after import
      await fetchEntries();

      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchEntries]);

  const previewPrompt = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/knowledge/preview');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to preview prompt');
      }

      return {
        prompt: result.prompt,
        estimatedTokens: result.estimatedTokens,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to preview prompt';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    updateEntry,
    createEntry,
    deleteEntry,
    importData,
    previewPrompt,
  };
}

// Helper function to get content by section type
export function getKnowledgeContent<T extends KnowledgeContent>(
  entries: KnowledgeEntry[],
  section: KnowledgeSection
): T | null {
  const entry = entries.find((e) => e.section === section);
  return entry ? (entry.content as T) : null;
}
