'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  KnowledgeEntry,
  KnowledgeSection,
  KnowledgeContent,
  KnowledgeDocument,
  KnowledgeVersion,
} from '@/types/knowledge';

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
  // Document methods
  fetchDocuments: (section?: KnowledgeSection) => Promise<KnowledgeDocument[]>;
  uploadDocument: (section: KnowledgeSection, file: File) => Promise<KnowledgeDocument | null>;
  updateDocument: (id: string, updates: Partial<KnowledgeDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  // Version methods
  fetchVersions: (knowledgeId: string) => Promise<KnowledgeVersion[]>;
  restoreVersion: (versionId: string, knowledgeId: string) => Promise<void>;
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

  // Document methods
  const fetchDocuments = useCallback(async (section?: KnowledgeSection) => {
    try {
      const url = section
        ? `/api/admin/knowledge/documents?section=${section}`
        : '/api/admin/knowledge/documents';
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch documents');
      }

      return result.data as KnowledgeDocument[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      return [];
    }
  }, []);

  const uploadDocument = useCallback(async (section: KnowledgeSection, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);

      const response = await fetch('/api/admin/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload document');
      }

      return result.data as KnowledgeDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateDocument = useCallback(async (id: string, updates: Partial<KnowledgeDocument>) => {
    try {
      const response = await fetch('/api/admin/knowledge/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update document');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/knowledge/documents?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete document');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Version methods
  const fetchVersions = useCallback(async (knowledgeId: string) => {
    try {
      const response = await fetch(`/api/admin/knowledge/versions?knowledge_id=${knowledgeId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch versions');
      }

      return result.data as KnowledgeVersion[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch versions';
      setError(errorMessage);
      return [];
    }
  }, []);

  const restoreVersion = useCallback(async (versionId: string, knowledgeId: string) => {
    try {
      const response = await fetch('/api/admin/knowledge/versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version_id: versionId, knowledge_id: knowledgeId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to restore version');
      }

      // Refresh entries after restore
      await fetchEntries();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore version';
      setError(errorMessage);
      throw err;
    }
  }, [fetchEntries]);

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
    // Document methods
    fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    // Version methods
    fetchVersions,
    restoreVersion,
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
