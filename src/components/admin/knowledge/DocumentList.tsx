'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import type { KnowledgeDocument } from '@/types/knowledge';
import { formatFileSize } from '@/lib/file-utils';

interface DocumentListProps {
  documents: KnowledgeDocument[];
  onPreview: (document: KnowledgeDocument) => void;
  onDelete: (documentId: string) => void;
  onToggleStatus: (document: KnowledgeDocument, newStatus: 'active' | 'reviewed') => void;
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  extracted: { label: 'Extrait', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  reviewed: { label: 'Verifie', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  active: { label: 'Actif', color: 'text-green-400', bg: 'bg-green-500/20' },
};

const FILE_ICONS: Record<string, string> = {
  'application/pdf': '📄',
  'text/plain': '📝',
  'text/csv': '📊',
  'text/markdown': '📑',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📃',
};

interface DocumentItemProps {
  document: KnowledgeDocument;
  onPreview: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function DocumentItem({ document, onPreview, onDelete, onToggleStatus }: DocumentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusConfig = STATUS_CONFIG[document.status] || STATUS_CONFIG.pending;
  const icon = FILE_ICONS[document.mime_type] || '📄';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/knowledge/documents?id=${document.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isActive = document.status === 'active';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors group"
    >
      {/* File icon */}
      <span className="text-xl">{icon}</span>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate" title={document.original_name}>
          {document.original_name}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatFileSize(document.file_size)}</span>
          <span>•</span>
          <span className={`${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Toggle active/inactive */}
        <button
          onClick={onToggleStatus}
          title={isActive ? 'Desactiver' : 'Activer'}
          className={`p-1.5 rounded transition-colors ${
            isActive
              ? 'text-green-400 hover:bg-green-500/20'
              : 'text-gray-400 hover:bg-white/10'
          }`}
        >
          {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>

        {/* Preview */}
        <button
          onClick={onPreview}
          title="Voir le contenu"
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Eye size={16} />
        </button>

        {/* Delete */}
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              {isDeleting ? <Loader2 size={12} className="animate-spin" /> : 'Oui'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Supprimer"
            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function DocumentList({
  documents,
  onPreview,
  onDelete,
  onToggleStatus,
}: DocumentListProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-400">
          Documents attaches ({documents.length})
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onPreview={() => onPreview(doc)}
            onDelete={() => onDelete(doc.id)}
            onToggleStatus={() =>
              onToggleStatus(doc, doc.status === 'active' ? 'reviewed' : 'active')
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default DocumentList;
