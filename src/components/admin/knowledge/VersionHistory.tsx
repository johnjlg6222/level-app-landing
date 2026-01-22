'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  History,
  RotateCcw,
  Eye,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { KnowledgeVersion, KnowledgeEntry } from '@/types/knowledge';

interface VersionHistoryProps {
  entry: KnowledgeEntry;
  onRestore: (content: unknown) => void;
  onClose: () => void;
}

export function VersionHistory({ entry, onRestore, onClose }: VersionHistoryProps) {
  const [versions, setVersions] = useState<KnowledgeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/knowledge/versions?knowledge_id=${entry.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch versions');
      }

      setVersions(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  }, [entry.id]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleRestore = async (version: KnowledgeVersion) => {
    setIsRestoring(version.id);

    try {
      const response = await fetch('/api/admin/knowledge/versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version_id: version.id,
          knowledge_id: entry.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to restore version');
      }

      onRestore(version.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore version');
    } finally {
      setIsRestoring(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatContentPreview = (content: unknown): string => {
    try {
      const str = JSON.stringify(content, null, 2);
      return str.length > 200 ? str.substring(0, 200) + '...' : str;
    } catch {
      return 'Contenu non lisible';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl max-h-[80vh] bg-[#0F1115] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <History size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Historique des versions</h3>
                <p className="text-xs text-gray-500">{entry.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12">
                <History size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">Aucune version enregistree</p>
                <p className="text-xs text-gray-500 mt-1">
                  Les versions seront creees automatiquement lors des modifications
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className="rounded-lg border border-white/5 overflow-hidden"
                  >
                    {/* Version header */}
                    <button
                      onClick={() =>
                        setExpandedVersion(
                          expandedVersion === version.id ? null : version.id
                        )
                      }
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === 0
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {version.version_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">
                            Version {version.version_number}
                          </span>
                          {index === 0 && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-green-500/20 text-green-400">
                              Actuelle
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{formatDate(version.created_at)}</span>
                          {version.created_by && (
                            <>
                              <span>•</span>
                              <span>{version.created_by}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {expandedVersion === version.id ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedVersion === version.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                          <div className="p-3 space-y-3">
                            {/* Content preview */}
                            <pre className="p-3 rounded-lg bg-black/30 text-xs text-gray-400 overflow-x-auto max-h-40">
                              {formatContentPreview(version.content)}
                            </pre>

                            {/* Actions */}
                            {index !== 0 && (
                              <button
                                onClick={() => handleRestore(version)}
                                disabled={isRestoring === version.id}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                                           bg-purple-500/20 text-purple-400 hover:bg-purple-500/30
                                           transition-colors disabled:opacity-50"
                              >
                                {isRestoring === version.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <RotateCcw size={14} />
                                )}
                                Restaurer cette version
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VersionHistory;
