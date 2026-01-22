'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Check, AlertTriangle, Loader2 } from 'lucide-react';
import type { KnowledgeDocument } from '@/types/knowledge';
import { formatFileSize } from '@/lib/document-parser';

interface DocumentReviewProps {
  document: KnowledgeDocument;
  onApprove: (document: KnowledgeDocument, editedText: string) => void;
  onCancel: () => void;
}

export function DocumentReview({ document, onApprove, onCancel }: DocumentReviewProps) {
  const [editedText, setEditedText] = useState(document.extracted_text || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Update the document with edited text and mark as reviewed
      const response = await fetch('/api/admin/knowledge/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: document.id,
          extracted_text: editedText,
          status: 'active',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      onApprove(result.data, editedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = editedText.split(/\s+/).filter(Boolean).length;
  const charCount = editedText.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#0F1115] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Verifier le contenu extrait</h3>
                <p className="text-xs text-gray-500">{document.original_name}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Warning banner */}
          <div className="p-3 mx-4 mt-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400">
              Verifiez et corrigez le texte extrait si necessaire. L'extraction automatique peut contenir des erreurs.
            </p>
          </div>

          {/* File info */}
          <div className="px-4 py-2 flex items-center gap-4 text-xs text-gray-500">
            <span>Type: {document.mime_type}</span>
            <span>Taille: {formatFileSize(document.file_size)}</span>
            <span>{wordCount} mots</span>
            <span>{charCount} caracteres</span>
          </div>

          {/* Editor */}
          <div className="flex-1 p-4 overflow-hidden">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-full min-h-[300px] px-4 py-3 bg-black/30 border border-white/10 rounded-xl
                         text-gray-300 text-sm
                         focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                         resize-none"
              placeholder="Contenu extrait du document..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mb-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleApprove}
              disabled={isSaving || !editedText.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-all ${
                !editedText.trim() || isSaving
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Approuver et activer
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DocumentReview;
