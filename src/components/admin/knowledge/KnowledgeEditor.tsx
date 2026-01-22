'use client';

import React, { useState } from 'react';
import { Loader2, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { useKnowledge } from '@/hooks/useKnowledge';
import { KnowledgeSectionCard } from './KnowledgeSectionCard';
import { SystemPromptEditor } from './SystemPromptEditor';
import type { KnowledgeSection } from '@/types/knowledge';

export function KnowledgeEditor() {
  const {
    entries,
    isLoading,
    error,
    fetchEntries,
    updateEntry,
    importData,
    previewPrompt,
  } = useKnowledge();

  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleImport = async () => {
    if (!confirm('Cela va importer/mettre a jour toutes les donnees. Continuer ?')) {
      return;
    }

    setIsImporting(true);
    setImportMessage(null);

    const result = await importData();
    setImportMessage(result.message);

    setIsImporting(false);
  };

  const handleUpdate = async (section: KnowledgeSection, updates: Partial<{ content: unknown; is_active: boolean }>) => {
    await updateEntry(section, updates as never);
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Base de Connaissances</h2>
          <p className="text-sm text-gray-400">
            Gerez les informations utilisees par le chatbot
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEntries}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
          >
            {isImporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Importer les donnees
          </button>
        </div>
      </div>

      {/* Import message */}
      {importMessage && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-sm">{importMessage}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* System prompt editor */}
      <SystemPromptEditor onPreview={previewPrompt} />

      {/* Knowledge sections */}
      {isLoading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Aucune donnee dans la base de connaissances</p>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {isImporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Importer les donnees existantes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <KnowledgeSectionCard
              key={entry.id}
              entry={entry}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default KnowledgeEditor;
