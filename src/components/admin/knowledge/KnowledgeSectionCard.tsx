'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Save,
  ToggleLeft,
  ToggleRight,
  Loader2,
  History,
  Plus,
} from 'lucide-react';
import type { KnowledgeEntry, KnowledgeSection, KnowledgeDocument } from '@/types/knowledge';
import { KNOWLEDGE_SECTIONS } from '@/types/knowledge';
import { RichTextEditor } from './RichTextEditor';
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';
import { DocumentReview } from './DocumentReview';
import { VersionHistory } from './VersionHistory';

interface KnowledgeSectionCardProps {
  entry: KnowledgeEntry;
  onUpdate: (section: KnowledgeSection, updates: Partial<KnowledgeEntry>) => Promise<void>;
}

// Convert JSON content to HTML for the rich text editor
function contentToHtml(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  // For structured content, create a readable format
  try {
    const obj = content as Record<string, unknown>;
    let html = '';

    // Handle different content types
    if ('text' in obj && typeof obj.text === 'string') {
      // CustomContextContent
      html = obj.text.replace(/\n/g, '<br>');
      if (obj.instructions) {
        html = `<p><strong>Instructions:</strong> ${obj.instructions}</p>${html}`;
      }
    } else if ('items' in obj && Array.isArray(obj.items)) {
      // FAQContent
      html = '<h2>Questions frequentes</h2><ul>';
      obj.items.forEach((item: { question?: string; answer?: string }) => {
        html += `<li><strong>${item.question || ''}</strong><br>${item.answer || ''}</li>`;
      });
      html += '</ul>';
    } else if ('plans' in obj && Array.isArray(obj.plans)) {
      // PricingContent
      html = '<h2>Tarification</h2>';
      obj.plans.forEach((plan: { name?: string; basePrice?: number; description?: string }) => {
        html += `<p><strong>${plan.name || ''}</strong> (${plan.basePrice || 0}EUR): ${plan.description || ''}</p>`;
      });
    } else if ('steps' in obj && Array.isArray(obj.steps)) {
      // ProcessContent
      html = '<h2>Processus</h2><ol>';
      obj.steps.forEach((step: { title?: string; description?: string }) => {
        html += `<li><strong>${step.title || ''}</strong>: ${step.description || ''}</li>`;
      });
      html += '</ol>';
    } else if ('projects' in obj && Array.isArray(obj.projects)) {
      // CaseStudyContent
      html = '<h2>Etudes de cas</h2>';
      obj.projects.forEach((project: { name?: string; shortDesc?: string }) => {
        html += `<h3>${project.name || ''}</h3><p>${project.shortDesc || ''}</p>`;
      });
    } else if ('name' in obj || 'description' in obj) {
      // CompanyInfoContent
      if (obj.name) html += `<h2>${obj.name}</h2>`;
      if (obj.description) html += `<p>${obj.description}</p>`;
      if (obj.mission) html += `<p><strong>Mission:</strong> ${obj.mission}</p>`;
    } else {
      // Fallback to JSON
      html = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
    }

    return html;
  } catch {
    return JSON.stringify(content, null, 2);
  }
}

// Convert HTML back to structured content (simplified - stores as text)
function htmlToContent(html: string, section: KnowledgeSection): unknown {
  // For custom_context, store as text
  if (section === 'custom_context') {
    // Strip HTML tags for plain text storage
    const text = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    return { text };
  }

  // For other sections, try to preserve JSON structure if it looks like JSON
  const stripped = html.replace(/<[^>]+>/g, '').trim();
  if (stripped.startsWith('{') || stripped.startsWith('[')) {
    try {
      return JSON.parse(stripped);
    } catch {
      // Fall through
    }
  }

  // Store as text in the appropriate structure
  return { text: stripped };
}

export function KnowledgeSectionCard({ entry, onUpdate }: KnowledgeSectionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<string>(
    contentToHtml(entry.content)
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [documentToReview, setDocumentToReview] = useState<KnowledgeDocument | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const sectionMeta = KNOWLEDGE_SECTIONS[entry.section as KnowledgeSection];

  // Fetch documents for this section
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const response = await fetch(`/api/admin/knowledge/documents?section=${entry.section}`);
      const result = await response.json();
      if (response.ok) {
        setDocuments(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [entry.section]);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, fetchDocuments]);

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert HTML to content structure
      const parsedContent = htmlToContent(editedContent, entry.section as KnowledgeSection);

      // Save version before updating
      await fetch('/api/admin/knowledge/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledge_id: entry.id,
          content: entry.content,
          created_by: 'admin',
        }),
      });

      // Update the entry
      await onUpdate(entry.section as KnowledgeSection, { content: parsedContent });
      setHasChanges(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Erreur lors de la sauvegarde');
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

  const handleDocumentUploadComplete = (document: KnowledgeDocument) => {
    setDocuments((prev) => [document, ...prev]);
  };

  const handleDocumentReviewNeeded = (document: KnowledgeDocument) => {
    setDocumentToReview(document);
  };

  const handleDocumentApproved = (document: KnowledgeDocument) => {
    setDocuments((prev) => [document, ...prev.filter((d) => d.id !== document.id)]);
    setDocumentToReview(null);
  };

  const handleDocumentDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  };

  const handleDocumentToggleStatus = async (
    document: KnowledgeDocument,
    newStatus: 'active' | 'reviewed'
  ) => {
    try {
      const response = await fetch('/api/admin/knowledge/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: document.id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === document.id ? { ...d, status: newStatus } : d))
        );
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleVersionRestore = (content: unknown) => {
    setEditedContent(contentToHtml(content));
    setHasChanges(true);
    setShowVersionHistory(false);
  };

  const handleDocumentPreview = (document: KnowledgeDocument) => {
    setDocumentToReview(document);
  };

  return (
    <>
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
              <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                {/* Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contenu
                  </label>
                  <RichTextEditor
                    content={editedContent}
                    onChange={handleContentChange}
                    placeholder={`Contenu pour ${sectionMeta?.label || entry.section}...`}
                  />
                </div>

                {/* Documents section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      Documents attaches
                    </label>
                  </div>

                  {/* Document list */}
                  {isLoadingDocs ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <DocumentList
                      documents={documents}
                      onPreview={handleDocumentPreview}
                      onDelete={handleDocumentDelete}
                      onToggleStatus={handleDocumentToggleStatus}
                    />
                  )}

                  {/* Document uploader */}
                  <DocumentUploader
                    section={entry.section as KnowledgeSection}
                    onUploadComplete={handleDocumentUploadComplete}
                    onReviewNeeded={handleDocumentReviewNeeded}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowVersionHistory(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <History size={14} />
                      Historique
                    </button>
                    <span className="text-xs text-gray-500">
                      Modifie: {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
                    </span>
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

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistory
          entry={entry}
          onRestore={handleVersionRestore}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {/* Document Review Modal */}
      {documentToReview && (
        <DocumentReview
          document={documentToReview}
          onApprove={handleDocumentApproved}
          onCancel={() => setDocumentToReview(null)}
        />
      )}
    </>
  );
}

export default KnowledgeSectionCard;
