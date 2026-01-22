'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Save,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import type { KnowledgeEntry, KnowledgeSection } from '@/types/knowledge';
import { KNOWLEDGE_SECTIONS } from '@/types/knowledge';

interface KnowledgeSectionCardProps {
  entry: KnowledgeEntry;
  onUpdate: (section: KnowledgeSection, updates: Partial<KnowledgeEntry>) => Promise<void>;
}

export function KnowledgeSectionCard({ entry, onUpdate }: KnowledgeSectionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<string>(
    JSON.stringify(entry.content, null, 2)
  );
  const [hasChanges, setHasChanges] = useState(false);

  const sectionMeta = KNOWLEDGE_SECTIONS[entry.section as KnowledgeSection];

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const parsedContent = JSON.parse(editedContent);
      await onUpdate(entry.section as KnowledgeSection, { content: parsedContent });
      setHasChanges(false);
    } catch (err) {
      alert('Invalid JSON format. Please check your content.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      setIsSaving(true);
      await onUpdate(entry.section as KnowledgeSection, { is_active: !entry.is_active });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sectionMeta?.icon || '📄'}</span>
          <div>
            <h3 className="font-medium text-white">{entry.title}</h3>
            <p className="text-xs text-gray-500">{sectionMeta?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Active toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              entry.is_active
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {entry.is_active ? (
              <>
                <ToggleRight size={14} />
                Actif
              </>
            ) : (
              <>
                <ToggleLeft size={14} />
                Inactif
              </>
            )}
          </button>

          {/* Expand icon */}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
              {/* JSON Editor */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenu (JSON)
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-64 px-4 py-3 bg-black/30 border border-white/10 rounded-xl
                             text-gray-300 text-sm font-mono
                             focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                             resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Priorite: {entry.priority} | Modifie:{' '}
                  {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
                </div>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    hasChanges
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Sauvegarder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default KnowledgeSectionCard;
